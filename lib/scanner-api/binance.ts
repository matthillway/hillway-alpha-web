// ============================================
// HILLWAY ALPHA - Binance API Client
// Public endpoints only (no auth required)
// ============================================

import axios, { AxiosInstance } from 'axios';

const FUTURES_BASE_URL = 'https://fapi.binance.com';
const SPOT_BASE_URL = 'https://api.binance.com';

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
   */
  async getCurrentFundingRates(): Promise<PremiumIndexData[]> {
    try {
      const response = await this.futuresClient.get('/fapi/v1/premiumIndex');
      return response.data;
    } catch (error) {
      console.error('Error fetching funding rates:', error);
      return [];
    }
  }

  /**
   * Get funding rate for specific symbol
   */
  async getFundingRate(symbol: string): Promise<PremiumIndexData | null> {
    try {
      const response = await this.futuresClient.get('/fapi/v1/premiumIndex', {
        params: { symbol },
      });
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
    limit: number = 100
  ): Promise<FundingRateData[]> {
    try {
      const response = await this.futuresClient.get('/fapi/v1/fundingRate', {
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
      const response = await this.spotClient.get('/api/v3/ticker/price', {
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
      const response = await this.spotClient.get('/api/v3/ticker/price');
      return response.data;
    } catch (error) {
      console.error('Error fetching spot prices:', error);
      return [];
    }
  }

  /**
   * Get top trading pairs by volume
   */
  async getTopPairs(limit: number = 20): Promise<string[]> {
    try {
      const response = await this.futuresClient.get('/fapi/v1/ticker/24hr');
      const sorted = response.data
        .sort((a: any, b: any) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
        .slice(0, limit)
        .map((t: any) => t.symbol);
      return sorted;
    } catch (error) {
      console.error('Error fetching top pairs:', error);
      return ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];
    }
  }
}

export function createBinanceClient(): BinanceClient {
  return new BinanceClient();
}
