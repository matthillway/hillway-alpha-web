/**
 * Betfair Exchange API Client
 *
 * Betfair uses OAuth2 for authentication. Users need to:
 * 1. Register an app at Betfair Developer Portal
 * 2. Go through OAuth flow to get access/refresh tokens
 *
 * API Documentation: https://docs.developer.betfair.com/
 */

import {
  PlatformClient,
  PlatformBalance,
  PlatformPosition,
  PlatformTrade,
  PlatformCredentials,
} from "./types";

const BETFAIR_API_URL = "https://api.betfair.com/exchange";
const BETFAIR_ACCOUNT_URL = "https://api.betfair.com/exchange/account/rest";
const BETFAIR_AUTH_URL = "https://identitysso.betfair.com";

interface BetfairAccountFunds {
  availableToBetBalance: number;
  exposure: number;
  retainedCommission: number;
  exposureLimit: number;
  discountRate: number;
  pointsBalance: number;
  wallet: string;
}

interface BetfairCurrentOrder {
  betId: string;
  marketId: string;
  selectionId: number;
  side: "BACK" | "LAY";
  status: string;
  priceSize: {
    size: number;
    price: number;
  };
  averagePriceMatched: number;
  sizeMatched: number;
  sizeRemaining: number;
  placedDate: string;
}

interface BetfairClearedOrder {
  eventTypeId: string;
  eventId: string;
  marketId: string;
  selectionId: number;
  betId: string;
  placedDate: string;
  settledDate: string;
  side: "BACK" | "LAY";
  profit: number;
  priceRequested: number;
  priceMatched: number;
  sizeSettled: number;
}

export class BetfairClient implements PlatformClient {
  readonly platform = "betfair" as const;
  private accessToken: string;
  private appKey: string;

  constructor(credentials: PlatformCredentials) {
    if (!credentials.accessToken) {
      throw new Error("Betfair access token is required");
    }
    this.accessToken = credentials.accessToken;
    this.appKey = process.env.BETFAIR_APP_KEY || "";
    if (!this.appKey) {
      throw new Error("BETFAIR_APP_KEY environment variable is not set");
    }
  }

  private async request<T>(
    endpoint: string,
    method: string = "POST",
    body?: object,
    baseUrl: string = BETFAIR_ACCOUNT_URL,
  ): Promise<T> {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: {
        "X-Application": this.appKey,
        "X-Authentication": this.accessToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Betfair API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async validateCredentials(): Promise<boolean> {
    try {
      await this.getBalance();
      return true;
    } catch (error) {
      console.error("Betfair credential validation failed:", error);
      return false;
    }
  }

  async getBalance(): Promise<PlatformBalance> {
    const funds = await this.request<BetfairAccountFunds>(
      "/getAccountFunds/",
      "POST",
      { wallet: "UK" },
    );

    return {
      available: funds.availableToBetBalance,
      exposure: Math.abs(funds.exposure),
      total: funds.availableToBetBalance + Math.abs(funds.exposure),
      currency: "GBP",
    };
  }

  async getPositions(): Promise<PlatformPosition[]> {
    // Betfair "positions" are current unmatched/matched orders
    const orders = await this.request<{ currentOrders: BetfairCurrentOrder[] }>(
      "/betting/json-rpc/v1",
      "POST",
      {
        jsonrpc: "2.0",
        method: "SportsAPING/v1.0/listCurrentOrders",
        params: {},
        id: 1,
      },
      "https://api.betfair.com/exchange",
    );

    if (!orders.currentOrders) {
      return [];
    }

    return orders.currentOrders.map((order) => ({
      id: order.betId,
      symbol: `${order.marketId}-${order.selectionId}`,
      side: order.side === "BACK" ? ("long" as const) : ("short" as const),
      quantity: order.sizeMatched,
      entryPrice: order.averagePriceMatched,
      currentPrice: order.averagePriceMatched, // Would need market data for current
      unrealizedPnl: 0, // Calculated at settlement
      currency: "GBP",
      openedAt: new Date(order.placedDate),
    }));
  }

  async getTradeHistory(since?: Date): Promise<PlatformTrade[]> {
    const fromRecord = since
      ? { from: since.toISOString() }
      : { from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() };

    const result = await this.request<{
      clearedOrders: BetfairClearedOrder[];
    }>("/listClearedOrders/", "POST", {
      betStatus: "SETTLED",
      settledDateRange: fromRecord,
    });

    if (!result.clearedOrders) {
      return [];
    }

    return result.clearedOrders.map((order) => ({
      id: order.betId,
      symbol: `${order.marketId}-${order.selectionId}`,
      side: order.side === "BACK" ? ("buy" as const) : ("sell" as const),
      quantity: order.sizeSettled,
      price: order.priceMatched,
      fee: 0, // Commission handled separately
      currency: "GBP",
      executedAt: new Date(order.settledDate),
    }));
  }

  /**
   * Generate OAuth authorization URL for Betfair login
   */
  static getAuthorizationUrl(state: string): string {
    const clientId = process.env.BETFAIR_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/platforms/betfair/callback`;

    if (!clientId) {
      throw new Error("BETFAIR_CLIENT_ID environment variable is not set");
    }

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      state,
    });

    return `${BETFAIR_AUTH_URL}/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  static async exchangeCodeForToken(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const clientId = process.env.BETFAIR_CLIENT_ID;
    const clientSecret = process.env.BETFAIR_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/platforms/betfair/callback`;

    if (!clientId || !clientSecret) {
      throw new Error("Betfair OAuth credentials not configured");
    }

    const response = await fetch(`${BETFAIR_AUTH_URL}/api/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to exchange code: ${errorText}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const clientId = process.env.BETFAIR_CLIENT_ID;
    const clientSecret = process.env.BETFAIR_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Betfair OAuth credentials not configured");
    }

    const response = await fetch(`${BETFAIR_AUTH_URL}/api/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to refresh token: ${errorText}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || refreshToken,
      expiresIn: data.expires_in,
    };
  }
}
