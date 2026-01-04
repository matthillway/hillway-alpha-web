// ============================================
// HILLWAY ALPHA - Binance API Client
// Public endpoints only (no auth required)
// ============================================

import axios, { AxiosInstance } from "axios";
import { getCached, setCache, CACHE_TTL, CACHE_PREFIX } from "@/lib/cache";

const FUTURES_BASE_URL = "https://fapi.binance.com";
const SPOT_BASE_URL = "https://api.binance.com";

export interface FundingRateData {
  symbol: string;
  fundingRate: string;
  fundingTime: number;
  markPrice: string;
}

export interface PremiumIndexData {
  symbol: string;
  markPrice: string;
  indexPrice: string;
  estimatedSettlePrice: string;
  lastFundingRate: string;
  nextFundingTime: number;
  interestRate: string;
  time: number;
}

export interface TickerPrice {
  symbol: string;
  price: string;
}

export class BinanceClient {
  private futuresClient: AxiosInstance;
  private spotClient: AxiosInstance;

  constructor() {
    this.futuresClient = axios.create({
      baseURL: FUTURES_BASE_URL,
      timeout: 10000,
    });

    this.spotClient = axios.create({
      baseURL: SPOT_BASE_URL,
      timeout: 10000,
    });
  }

  /**
   * Get current funding rates for all perpetual futures
   * Cached for 5 minutes
   */
  async getCurrentFundingRates(): Promise<PremiumIndexData[]> {
    const cacheKey = `${CACHE_PREFIX.CRYPTO}:funding:all`;

    // Try cache first
    const cached = await getCached<PremiumIndexData[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await this.futuresClient.get("/fapi/v1/premiumIndex");

      // Cache the result
      await setCache(cacheKey, response.data, CACHE_TTL.FUNDING_RATE);

      return response.data;
    } catch (error) {
      console.error("Error fetching funding rates:", error);
      return [];
    }
  }

  /**
   * Get funding rate for specific symbol
   * Cached for 5 minutes
   */
  async getFundingRate(symbol: string): Promise<PremiumIndexData | null> {
    const cacheKey = `${CACHE_PREFIX.CRYPTO}:funding:${symbol}`;

    // Try cache first
    const cached = await getCached<PremiumIndexData>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await this.futuresClient.get("/fapi/v1/premiumIndex", {
        params: { symbol },
      });

      // Cache the result
      await setCache(cacheKey, response.data, CACHE_TTL.FUNDING_RATE);

      return response.data;
    } catch (error) {
      console.error(`Error fetching funding rate for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Get historical funding rates
   */
  async getHistoricalFundingRates(
    symbol: string,
    limit: number = 100,
  ): Promise<FundingRateData[]> {
    try {
      const response = await this.futuresClient.get("/fapi/v1/fundingRate", {
        params: { symbol, limit },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching historical funding for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Get spot price for a symbol
   */
  async getSpotPrice(symbol: string): Promise<number | null> {
    try {
      const response = await this.spotClient.get("/api/v3/ticker/price", {
        params: { symbol },
      });
      return parseFloat(response.data.price);
    } catch (error) {
      console.error(`Error fetching spot price for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Get all spot prices
   */
  async getAllSpotPrices(): Promise<TickerPrice[]> {
    try {
      const response = await this.spotClient.get("/api/v3/ticker/price");
      return response.data;
    } catch (error) {
      console.error("Error fetching spot prices:", error);
      return [];
    }
  }

  /**
   * Get top trading pairs by volume
   * Cached for 15 minutes
   */
  async getTopPairs(limit: number = 20): Promise<string[]> {
    const cacheKey = `${CACHE_PREFIX.CRYPTO}:top_pairs:${limit}`;

    // Try cache first
    const cached = await getCached<string[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await this.futuresClient.get("/fapi/v1/ticker/24hr");
      const sorted = response.data
        .sort(
          (a: any, b: any) =>
            parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume),
        )
        .slice(0, limit)
        .map((t: any) => t.symbol);

      // Cache the result
      await setCache(cacheKey, sorted, CACHE_TTL.TOP_PAIRS);

      return sorted;
    } catch (error) {
      console.error("Error fetching top pairs:", error);
      return ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"];
    }
  }
}

export function createBinanceClient(): BinanceClient {
  return new BinanceClient();
}
