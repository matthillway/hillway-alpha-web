// Common types for platform integrations

export type Platform = "betfair" | "ibkr" | "kraken";

export interface PlatformBalance {
  available: number;
  exposure: number;
  total: number;
  currency: string;
}

export interface PlatformPosition {
  id: string;
  symbol: string;
  side: "long" | "short";
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  currency: string;
  openedAt: Date;
}

export interface PlatformTrade {
  id: string;
  symbol: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  fee: number;
  currency: string;
  executedAt: Date;
  orderId?: string;
}

export interface PlatformCredentials {
  // OAuth (Betfair)
  accessToken?: string | null;
  refreshToken?: string | null;
  expiresAt?: Date | null;
  // API Key based (IBKR, Kraken)
  apiKey?: string | null;
  apiSecret?: string | null;
}

export interface PlatformClient {
  platform: Platform;
  validateCredentials(): Promise<boolean>;
  getBalance(): Promise<PlatformBalance>;
  getPositions(): Promise<PlatformPosition[]>;
  getTradeHistory(since?: Date): Promise<PlatformTrade[]>;
}

export interface LinkedAccount {
  id: string;
  user_id: string;
  platform: Platform;
  platform_user_id: string | null;
  access_token: string | null;
  refresh_token: string | null;
  api_key: string | null;
  api_secret: string | null;
  expires_at: string | null;
  is_active: boolean;
  last_sync_at: string | null;
  sync_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface SyncResult {
  success: boolean;
  balance?: PlatformBalance;
  positions?: PlatformPosition[];
  trades?: PlatformTrade[];
  error?: string;
}
