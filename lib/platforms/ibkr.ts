/**
 * Interactive Brokers API Client
 *
 * IBKR uses the Client Portal API for web-based access.
 * This requires API credentials from the IBKR Client Portal.
 *
 * Note: For production, consider using IBKR's TWS API or the newer
 * IBKR Web API with proper API key authentication.
 *
 * API Documentation: https://www.interactivebrokers.com/api/doc.html
 */

import {
  PlatformClient,
  PlatformBalance,
  PlatformPosition,
  PlatformTrade,
  PlatformCredentials,
} from "./types";

// IBKR Client Portal Gateway - users need to run this locally or use hosted version
const IBKR_GATEWAY_URL =
  process.env.IBKR_GATEWAY_URL || "https://localhost:5000/v1";

interface IBKRAccount {
  accountId: string;
  accountVan: string;
  accountTitle: string;
  displayName: string;
  accountAlias: string;
  accountStatus: number;
  currency: string;
  type: string;
}

interface IBKRAccountSummary {
  accountId: string;
  netLiquidationValue: { amount: number; currency: string };
  excessLiquidity: { amount: number; currency: string };
  availableFunds: { amount: number; currency: string };
  grossPositionValue: { amount: number; currency: string };
}

interface IBKRPosition {
  acctId: string;
  conid: number;
  contractDesc: string;
  position: number;
  mktPrice: number;
  mktValue: number;
  avgCost: number;
  avgPrice: number;
  realizedPnl: number;
  unrealizedPnl: number;
  currency: string;
}

interface IBKRTrade {
  execution_id: string;
  symbol: string;
  side: string;
  order_description: string;
  trade_time: string;
  trade_time_r: number;
  size: number;
  price: string;
  order_ref: string;
  submitter: string;
  exchange: string;
  commission: string;
  net_amount: number;
  account: string;
  conid: number;
}

export class IBKRClient implements PlatformClient {
  readonly platform = "ibkr" as const;
  private accountId: string;
  private apiKey: string;
  private apiSecret: string;

  constructor(credentials: PlatformCredentials) {
    if (!credentials.apiKey || !credentials.apiSecret) {
      throw new Error("IBKR API key and secret are required");
    }
    this.apiKey = credentials.apiKey;
    this.apiSecret = credentials.apiSecret;
    this.accountId = ""; // Will be fetched on first call
  }

  private async request<T>(
    endpoint: string,
    method: string = "GET",
    body?: object,
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      // IBKR Client Portal uses session-based auth
      // For API key auth, we'd use a different header scheme
      "X-IBKR-API-Key": this.apiKey,
      "X-IBKR-API-Signature": await this.generateSignature(
        endpoint,
        method,
        body,
      ),
    };

    const response = await fetch(`${IBKR_GATEWAY_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`IBKR API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  private async generateSignature(
    endpoint: string,
    method: string,
    body?: object,
  ): Promise<string> {
    // IBKR signature generation would typically use HMAC-SHA256
    // This is a placeholder - actual implementation depends on IBKR's auth scheme
    const crypto = await import("crypto");
    const message = `${method}${endpoint}${body ? JSON.stringify(body) : ""}`;
    return crypto
      .createHmac("sha256", this.apiSecret)
      .update(message)
      .digest("hex");
  }

  private async ensureAccountId(): Promise<void> {
    if (this.accountId) return;

    const accounts = await this.request<IBKRAccount[]>("/portfolio/accounts");
    if (!accounts || accounts.length === 0) {
      throw new Error("No IBKR accounts found");
    }
    this.accountId = accounts[0].accountId;
  }

  async validateCredentials(): Promise<boolean> {
    try {
      await this.ensureAccountId();
      return true;
    } catch (error) {
      console.error("IBKR credential validation failed:", error);
      return false;
    }
  }

  async getBalance(): Promise<PlatformBalance> {
    await this.ensureAccountId();

    const summary = await this.request<IBKRAccountSummary>(
      `/portfolio/${this.accountId}/summary`,
    );

    return {
      available: summary.availableFunds?.amount || 0,
      exposure: summary.grossPositionValue?.amount || 0,
      total: summary.netLiquidationValue?.amount || 0,
      currency: summary.netLiquidationValue?.currency || "USD",
    };
  }

  async getPositions(): Promise<PlatformPosition[]> {
    await this.ensureAccountId();

    const positions = await this.request<IBKRPosition[]>(
      `/portfolio/${this.accountId}/positions/0`,
    );

    if (!positions) {
      return [];
    }

    return positions.map((pos) => ({
      id: `${pos.conid}`,
      symbol: pos.contractDesc,
      side: pos.position > 0 ? ("long" as const) : ("short" as const),
      quantity: Math.abs(pos.position),
      entryPrice: pos.avgPrice,
      currentPrice: pos.mktPrice,
      unrealizedPnl: pos.unrealizedPnl,
      currency: pos.currency,
      openedAt: new Date(), // IBKR doesn't return open date in positions
    }));
  }

  async getTradeHistory(since?: Date): Promise<PlatformTrade[]> {
    await this.ensureAccountId();

    // IBKR uses days parameter for trade history
    const days = since
      ? Math.ceil((Date.now() - since.getTime()) / (24 * 60 * 60 * 1000))
      : 30;

    const trades = await this.request<IBKRTrade[]>(
      `/iserver/account/trades?days=${days}`,
    );

    if (!trades) {
      return [];
    }

    return trades.map((trade) => ({
      id: trade.execution_id,
      symbol: trade.symbol,
      side: trade.side.toLowerCase().includes("buy")
        ? ("buy" as const)
        : ("sell" as const),
      quantity: trade.size,
      price: parseFloat(trade.price) || 0,
      fee: parseFloat(trade.commission) || 0,
      currency: "USD", // IBKR trades default to USD
      executedAt: new Date(trade.trade_time_r),
      orderId: trade.order_ref,
    }));
  }
}
