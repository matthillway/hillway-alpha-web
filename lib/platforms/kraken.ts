/**
 * Kraken API Client
 *
 * Kraken uses API key + secret for authentication.
 * Keys can be generated at: https://www.kraken.com/u/security/api
 *
 * API Documentation: https://docs.kraken.com/rest/
 */

import crypto from "crypto";
import {
  PlatformClient,
  PlatformBalance,
  PlatformPosition,
  PlatformTrade,
  PlatformCredentials,
} from "./types";

const KRAKEN_API_URL = "https://api.kraken.com";

interface KrakenResponse<T> {
  error: string[];
  result: T;
}

interface KrakenBalance {
  [asset: string]: string;
}

interface KrakenPosition {
  ordertxid: string;
  posstatus: string;
  pair: string;
  time: number;
  type: string;
  ordertype: string;
  cost: string;
  fee: string;
  vol: string;
  vol_closed: string;
  margin: string;
  value: string;
  net: string;
  terms: string;
  rollovertm: string;
}

interface KrakenTrade {
  ordertxid: string;
  pair: string;
  time: number;
  type: string;
  ordertype: string;
  price: string;
  cost: string;
  fee: string;
  vol: string;
  margin: string;
  misc: string;
}

export class KrakenClient implements PlatformClient {
  readonly platform = "kraken" as const;
  private apiKey: string;
  private apiSecret: string;

  constructor(credentials: PlatformCredentials) {
    if (!credentials.apiKey || !credentials.apiSecret) {
      throw new Error("Kraken API key and secret are required");
    }
    this.apiKey = credentials.apiKey;
    this.apiSecret = credentials.apiSecret;
  }

  private generateSignature(
    path: string,
    nonce: number,
    postData: string,
  ): string {
    const message = nonce + postData;
    const hash = crypto.createHash("sha256").update(message).digest();
    const hmac = crypto.createHmac(
      "sha512",
      Buffer.from(this.apiSecret, "base64"),
    );
    hmac.update(path);
    hmac.update(hash);
    return hmac.digest("base64");
  }

  private async request<T>(endpoint: string, params: object = {}): Promise<T> {
    const path = `/0/private${endpoint}`;
    const nonce = Date.now() * 1000;
    const postData = new URLSearchParams({
      nonce: nonce.toString(),
      ...Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, String(v)]),
      ),
    }).toString();

    const signature = this.generateSignature(path, nonce, postData);

    const response = await fetch(`${KRAKEN_API_URL}${path}`, {
      method: "POST",
      headers: {
        "API-Key": this.apiKey,
        "API-Sign": signature,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: postData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Kraken API error: ${response.status} - ${errorText}`);
    }

    const data: KrakenResponse<T> = await response.json();

    if (data.error && data.error.length > 0) {
      throw new Error(`Kraken API error: ${data.error.join(", ")}`);
    }

    return data.result;
  }

  async validateCredentials(): Promise<boolean> {
    try {
      await this.getBalance();
      return true;
    } catch (error) {
      console.error("Kraken credential validation failed:", error);
      return false;
    }
  }

  async getBalance(): Promise<PlatformBalance> {
    const balances = await this.request<KrakenBalance>("/Balance");

    // Calculate total in USD/GBP equivalent
    // Kraken returns individual asset balances
    let total = 0;
    let available = 0;

    // Common fiat and stablecoin assets
    const fiatAssets = [
      "ZUSD",
      "USD",
      "ZGBP",
      "GBP",
      "ZEUR",
      "EUR",
      "USDT",
      "USDC",
    ];

    for (const [asset, balance] of Object.entries(balances)) {
      const amount = parseFloat(balance);
      if (fiatAssets.includes(asset)) {
        total += amount;
        available += amount;
      }
    }

    // For crypto assets, we'd need to fetch current prices
    // For now, return fiat balance only
    return {
      available,
      exposure: 0, // Would need to calculate from open positions
      total,
      currency: "USD", // Kraken primarily uses USD
    };
  }

  async getPositions(): Promise<PlatformPosition[]> {
    try {
      const positions =
        await this.request<Record<string, KrakenPosition>>("/OpenPositions");

      if (!positions || Object.keys(positions).length === 0) {
        return [];
      }

      return Object.entries(positions).map(([id, pos]) => {
        const entryPrice = parseFloat(pos.cost) / parseFloat(pos.vol);
        const currentValue = parseFloat(pos.value);
        const currentPrice = currentValue / parseFloat(pos.vol);

        return {
          id,
          symbol: pos.pair,
          side: pos.type === "buy" ? ("long" as const) : ("short" as const),
          quantity: parseFloat(pos.vol),
          entryPrice,
          currentPrice,
          unrealizedPnl: parseFloat(pos.net),
          currency: "USD",
          openedAt: new Date(pos.time * 1000),
        };
      });
    } catch (error) {
      // OpenPositions may return empty or error if margin trading not enabled
      console.log("Kraken positions not available:", error);
      return [];
    }
  }

  async getTradeHistory(since?: Date): Promise<PlatformTrade[]> {
    const params: Record<string, string | number> = {};
    if (since) {
      params.start = Math.floor(since.getTime() / 1000);
    }

    const result = await this.request<{
      trades: Record<string, KrakenTrade>;
      count: number;
    }>("/TradesHistory", params);

    if (!result.trades || Object.keys(result.trades).length === 0) {
      return [];
    }

    return Object.entries(result.trades).map(([id, trade]) => ({
      id,
      symbol: trade.pair,
      side: trade.type === "buy" ? ("buy" as const) : ("sell" as const),
      quantity: parseFloat(trade.vol),
      price: parseFloat(trade.price),
      fee: parseFloat(trade.fee),
      currency: "USD",
      executedAt: new Date(trade.time * 1000),
      orderId: trade.ordertxid,
    }));
  }
}
