// ============================================
// HILLWAY ALPHA - Yahoo Finance API Client
// Stock data via yahoo-finance2 package
// ============================================

import YahooFinance from "yahoo-finance2";
import { getCached, setCache, CACHE_TTL, CACHE_PREFIX } from "@/lib/cache";

// Instantiate the Yahoo Finance client (required for v3.x)
const yahooFinance = new YahooFinance({
  suppressNotices: ["yahooSurvey", "ripHistorical"],
});

// Type definitions for yahoo-finance2 responses
interface YahooQuote {
  symbol: string;
  shortName?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
  averageDailyVolume10Day?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  marketCap?: number;
}

interface YahooHistoricalRow {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose?: number;
}

export interface StockQuote {
  symbol: string;
  shortName: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
  averageVolume: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  marketCap: number;
}

export interface HistoricalData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose: number;
}

// FTSE 100 top stocks (by market cap)
export const FTSE_100_SYMBOLS = [
  "SHEL.L",
  "AZN.L",
  "HSBA.L",
  "ULVR.L",
  "BP.L",
  "GSK.L",
  "RIO.L",
  "DGE.L",
  "BATS.L",
  "REL.L",
  "NG.L",
  "LSEG.L",
  "AAL.L",
  "CPG.L",
  "PRU.L",
  "VOD.L",
  "GLEN.L",
  "SSE.L",
  "BA.L",
  "LLOY.L",
];

// S&P 500 top stocks
export const SP500_SYMBOLS = [
  "AAPL",
  "MSFT",
  "GOOGL",
  "AMZN",
  "NVDA",
  "META",
  "TSLA",
  "BRK-B",
  "UNH",
  "JNJ",
  "V",
  "XOM",
  "JPM",
  "WMT",
  "MA",
  "PG",
  "HD",
  "CVX",
  "MRK",
  "ABBV",
];

export class YahooFinanceClient {
  /**
   * Get quote for a single symbol
   * Cached for 15 minutes
   */
  async getQuote(symbol: string): Promise<StockQuote | null> {
    const cacheKey = `${CACHE_PREFIX.STOCKS}:${symbol}:quote`;

    // Try cache first
    const cached = await getCached<StockQuote>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const quote = (await yahooFinance.quote(symbol)) as YahooQuote;

      const result: StockQuote = {
        symbol: quote.symbol,
        shortName: quote.shortName || quote.symbol,
        regularMarketPrice: quote.regularMarketPrice || 0,
        regularMarketChange: quote.regularMarketChange || 0,
        regularMarketChangePercent: quote.regularMarketChangePercent || 0,
        regularMarketVolume: quote.regularMarketVolume || 0,
        averageVolume: quote.averageDailyVolume10Day || 0,
        fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 0,
        fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 0,
        marketCap: quote.marketCap || 0,
      };

      // Cache the result
      await setCache(cacheKey, result, CACHE_TTL.STOCK_QUOTE);

      return result;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Get quotes for multiple symbols
   */
  async getQuotes(symbols: string[]): Promise<StockQuote[]> {
    const quotes: StockQuote[] = [];

    // Process in batches to avoid rate limiting
    const batchSize = 10;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const batchQuotes = await Promise.all(batch.map((s) => this.getQuote(s)));
      quotes.push(...batchQuotes.filter((q): q is StockQuote => q !== null));

      // Small delay between batches
      if (i + batchSize < symbols.length) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    return quotes;
  }

  /**
   * Get historical data for a symbol
   * Cached for 1 hour (historical data doesn't change often)
   */
  async getHistoricalData(
    symbol: string,
    period: "1mo" | "3mo" | "6mo" | "1y" | "2y" | "5y" = "6mo",
  ): Promise<HistoricalData[]> {
    const cacheKey = `${CACHE_PREFIX.STOCKS}:${symbol}:historical:${period}`;

    // Try cache first
    const cached = await getCached<HistoricalData[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const endDate = new Date();
      const startDate = new Date();

      switch (period) {
        case "1mo":
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case "3mo":
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case "6mo":
          startDate.setMonth(startDate.getMonth() - 6);
          break;
        case "1y":
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        case "2y":
          startDate.setFullYear(startDate.getFullYear() - 2);
          break;
        case "5y":
          startDate.setFullYear(startDate.getFullYear() - 5);
          break;
      }

      const result = (await yahooFinance.historical(symbol, {
        period1: startDate,
        period2: endDate,
        interval: "1d",
      })) as YahooHistoricalRow[];

      const historicalData = result.map((d: YahooHistoricalRow) => ({
        date: d.date,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        volume: d.volume,
        adjClose: d.adjClose || d.close,
      }));

      // Cache the result
      await setCache(cacheKey, historicalData, CACHE_TTL.HISTORICAL_DATA);

      return historicalData;
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      return [];
    }
  }

  /**
   * Get top movers (gainers/losers)
   */
  async getTopMovers(
    symbols: string[],
    type: "gainers" | "losers" = "gainers",
    limit: number = 10,
  ): Promise<StockQuote[]> {
    const quotes = await this.getQuotes(symbols);

    const sorted = quotes.sort((a, b) => {
      if (type === "gainers") {
        return b.regularMarketChangePercent - a.regularMarketChangePercent;
      } else {
        return a.regularMarketChangePercent - b.regularMarketChangePercent;
      }
    });

    return sorted.slice(0, limit);
  }

  /**
   * Get stocks near 52-week high
   */
  async getNear52WeekHigh(
    symbols: string[],
    withinPercent: number = 5,
  ): Promise<StockQuote[]> {
    const quotes = await this.getQuotes(symbols);

    return quotes.filter((q) => {
      if (!q.fiftyTwoWeekHigh || !q.regularMarketPrice) return false;
      const percentFromHigh =
        ((q.fiftyTwoWeekHigh - q.regularMarketPrice) / q.fiftyTwoWeekHigh) *
        100;
      return percentFromHigh <= withinPercent;
    });
  }

  /**
   * Get stocks near 52-week low
   */
  async getNear52WeekLow(
    symbols: string[],
    withinPercent: number = 5,
  ): Promise<StockQuote[]> {
    const quotes = await this.getQuotes(symbols);

    return quotes.filter((q) => {
      if (!q.fiftyTwoWeekLow || !q.regularMarketPrice) return false;
      const percentFromLow =
        ((q.regularMarketPrice - q.fiftyTwoWeekLow) / q.fiftyTwoWeekLow) * 100;
      return percentFromLow <= withinPercent;
    });
  }

  /**
   * Get high volume stocks
   */
  async getHighVolumeStocks(
    symbols: string[],
    volumeMultiple: number = 2,
  ): Promise<StockQuote[]> {
    const quotes = await this.getQuotes(symbols);

    return quotes.filter((q) => {
      if (!q.regularMarketVolume || !q.averageVolume) return false;
      return q.regularMarketVolume > q.averageVolume * volumeMultiple;
    });
  }
}

export function createYahooFinanceClient(): YahooFinanceClient {
  return new YahooFinanceClient();
}
