// ============================================
// HILLWAY ALPHA - The Odds API Client
// https://the-odds-api.com/
// ============================================

import axios, { AxiosInstance } from "axios";
import { OddsApiEvent } from "@/lib/types/scanner";
import {
  getCached,
  setCache,
  CACHE_TTL,
  CACHE_PREFIX,
  getTimeBucketKey,
} from "@/lib/cache";

const BASE_URL = "https://api.the-odds-api.com/v4";

// Sports we're interested in (UK-focused)
export const SUPPORTED_SPORTS = {
  // Football
  soccer_epl: "English Premier League",
  soccer_england_league1: "English League 1",
  soccer_england_league2: "English League 2",
  soccer_england_efl_cup: "EFL Cup",
  soccer_fa_cup: "FA Cup",
  soccer_uefa_champs_league: "UEFA Champions League",
  soccer_uefa_europa_league: "UEFA Europa League",

  // Tennis
  tennis_atp_french_open: "ATP French Open",
  tennis_atp_wimbledon: "ATP Wimbledon",
  tennis_atp_us_open: "ATP US Open",
  tennis_wta_french_open: "WTA French Open",
  tennis_wta_wimbledon: "WTA Wimbledon",

  // Other popular markets
  americanfootball_nfl: "NFL",
  basketball_nba: "NBA",
  mma_mixed_martial_arts: "MMA",
  boxing_boxing: "Boxing",
} as const;

// UK-available bookmakers (prioritized)
export const UK_BOOKMAKERS = [
  "betfair_ex_uk", // Betfair Exchange (for laying)
  "betfair", // Betfair Sportsbook
  "bet365",
  "williamhill",
  "ladbrokes_uk",
  "coral",
  "paddypower",
  "skybet",
  "betvictor",
  "unibet_uk",
  "betway",
  "888sport",
  "boylesports",
  "betfred",
] as const;

export interface OddsApiOptions {
  sports?: string[];
  regions?: string[];
  markets?: string[];
  bookmakers?: string[];
  oddsFormat?: "decimal" | "american";
}

export class OddsApiClient {
  private client: AxiosInstance;
  private apiKey: string;
  private requestsUsed: number = 0;
  private requestsRemaining: number = 500;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("ODDS_API_KEY is required");
    }
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
    });
  }

  /**
   * Get list of available sports
   * Cached for 1 hour (sports list rarely changes)
   */
  async getSports(): Promise<
    { key: string; title: string; active: boolean }[]
  > {
    const cacheKey = `${CACHE_PREFIX.SPORTS}:list`;

    // Try cache first
    const cached =
      await getCached<{ key: string; title: string; active: boolean }[]>(
        cacheKey,
      );
    if (cached) {
      return cached;
    }

    // Fetch from API
    const response = await this.client.get("/sports", {
      params: { apiKey: this.apiKey },
    });
    this.updateQuotaFromHeaders(response.headers);

    // Cache the result
    await setCache(cacheKey, response.data, CACHE_TTL.SPORTS_LIST);

    return response.data;
  }

  /**
   * Get odds for a specific sport
   * Cached for 5 minutes (odds change frequently)
   */
  async getOdds(
    sport: string,
    options: OddsApiOptions = {},
  ): Promise<OddsApiEvent[]> {
    const {
      regions = ["uk"],
      markets = ["h2h"], // head-to-head (1X2 for football)
      bookmakers,
      oddsFormat = "decimal",
    } = options;

    // Build cache key using time bucket (5 min buckets)
    const marketKey = markets.join("-");
    const timeBucket = getTimeBucketKey(
      `${CACHE_PREFIX.ODDS}:${sport}:${marketKey}`,
      5,
    );
    const cacheKey = timeBucket;

    // Try cache first
    const cached = await getCached<OddsApiEvent[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const params: Record<string, string> = {
      apiKey: this.apiKey,
      regions: regions.join(","),
      markets: markets.join(","),
      oddsFormat,
    };

    if (bookmakers && bookmakers.length > 0) {
      params.bookmakers = bookmakers.join(",");
    }

    try {
      const response = await this.client.get(`/sports/${sport}/odds`, {
        params,
      });
      this.updateQuotaFromHeaders(response.headers);

      // Cache the result
      await setCache(cacheKey, response.data, CACHE_TTL.ODDS_DATA);

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // Sport might not have any events currently
        return [];
      }
      throw error;
    }
  }

  /**
   * Get odds for multiple sports at once
   */
  async getOddsMultipleSports(
    sports: string[],
    options: OddsApiOptions = {},
  ): Promise<Map<string, OddsApiEvent[]>> {
    const results = new Map<string, OddsApiEvent[]>();

    // Fetch in parallel but with reasonable concurrency
    const batchSize = 3;
    for (let i = 0; i < sports.length; i += batchSize) {
      const batch = sports.slice(i, i + batchSize);
      const promises = batch.map((sport) =>
        this.getOdds(sport, options)
          .then((events) => ({ sport, events }))
          .catch(() => ({ sport, events: [] as OddsApiEvent[] })),
      );

      const batchResults = await Promise.all(promises);
      for (const { sport, events } of batchResults) {
        results.set(sport, events);
      }
    }

    return results;
  }

  /**
   * Get all Premier League odds (most common use case)
   */
  async getPremierLeagueOdds(): Promise<OddsApiEvent[]> {
    return this.getOdds("soccer_epl", {
      regions: ["uk"],
      markets: ["h2h"],
      bookmakers: UK_BOOKMAKERS as unknown as string[],
    });
  }

  /**
   * Get all football odds across major leagues
   */
  async getAllFootballOdds(): Promise<OddsApiEvent[]> {
    const footballSports = Object.keys(SUPPORTED_SPORTS).filter((s) =>
      s.startsWith("soccer"),
    );
    const results = await this.getOddsMultipleSports(footballSports);

    // Flatten all events
    const allEvents: OddsApiEvent[] = [];
    for (const events of results.values()) {
      allEvents.push(...events);
    }
    return allEvents;
  }

  /**
   * Update quota tracking from response headers
   */
  private updateQuotaFromHeaders(headers: unknown): void {
    const h = headers as Record<string, string | undefined>;
    if (h["x-requests-used"]) {
      this.requestsUsed = parseInt(h["x-requests-used"], 10);
    }
    if (h["x-requests-remaining"]) {
      this.requestsRemaining = parseInt(h["x-requests-remaining"], 10);
    }
  }

  /**
   * Get current API quota status
   */
  getQuotaStatus(): { used: number; remaining: number } {
    return {
      used: this.requestsUsed,
      remaining: this.requestsRemaining,
    };
  }
}

/**
 * Create a configured Odds API client
 */
export function createOddsApiClient(): OddsApiClient {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    throw new Error("ODDS_API_KEY environment variable is required");
  }
  return new OddsApiClient(apiKey);
}
