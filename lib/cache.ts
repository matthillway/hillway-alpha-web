// ============================================
// HILLWAY ALPHA - Vercel KV Cache Utilities
// Optional caching layer to reduce API costs
// ============================================

import { kv } from "@vercel/kv";

// Cache statistics tracking (in-memory for this session)
let cacheStats = {
  hits: 0,
  misses: 0,
  errors: 0,
  lastReset: new Date().toISOString(),
};

/**
 * Check if Vercel KV is configured
 */
function isKVConfigured(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/**
 * Get a cached value by key
 * Returns null if not found or KV is not configured
 */
export async function getCached<T>(key: string): Promise<T | null> {
  if (!isKVConfigured()) {
    return null;
  }

  try {
    const value = await kv.get<T>(key);
    if (value !== null) {
      cacheStats.hits++;
      return value;
    }
    cacheStats.misses++;
    return null;
  } catch (error) {
    cacheStats.errors++;
    console.error(`Cache get error for key ${key}:`, error);
    return null;
  }
}

/**
 * Set a cached value with TTL
 * Silently fails if KV is not configured
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number,
): Promise<void> {
  if (!isKVConfigured()) {
    return;
  }

  try {
    await kv.set(key, value, { ex: ttlSeconds });
  } catch (error) {
    cacheStats.errors++;
    console.error(`Cache set error for key ${key}:`, error);
  }
}

/**
 * Invalidate (delete) a cached value
 */
export async function invalidateCache(key: string): Promise<void> {
  if (!isKVConfigured()) {
    return;
  }

  try {
    await kv.del(key);
  } catch (error) {
    cacheStats.errors++;
    console.error(`Cache invalidate error for key ${key}:`, error);
  }
}

/**
 * Invalidate all keys matching a pattern
 * Uses SCAN for safety (doesn't block)
 */
export async function invalidateCachePattern(pattern: string): Promise<number> {
  if (!isKVConfigured()) {
    return 0;
  }

  try {
    let cursor = 0;
    let deletedCount = 0;

    do {
      const result = await kv.scan(cursor, {
        match: pattern,
        count: 100,
      });
      const nextCursor = result[0];
      const keys = result[1] as string[];
      cursor =
        typeof nextCursor === "string"
          ? parseInt(nextCursor, 10)
          : (nextCursor as number);

      if (keys.length > 0) {
        await kv.del(...keys);
        deletedCount += keys.length;
      }
    } while (cursor !== 0);

    return deletedCount;
  } catch (error) {
    cacheStats.errors++;
    console.error(`Cache pattern invalidate error for ${pattern}:`, error);
    return 0;
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const total = cacheStats.hits + cacheStats.misses;
  const hitRate = total > 0 ? (cacheStats.hits / total) * 100 : 0;

  return {
    hits: cacheStats.hits,
    misses: cacheStats.misses,
    errors: cacheStats.errors,
    hitRate: Math.round(hitRate * 100) / 100, // 2 decimal places
    lastReset: cacheStats.lastReset,
    isConfigured: isKVConfigured(),
  };
}

/**
 * Reset cache statistics
 */
export function resetCacheStats(): void {
  cacheStats = {
    hits: 0,
    misses: 0,
    errors: 0,
    lastReset: new Date().toISOString(),
  };
}

// ============================================
// Cache Key Helpers
// ============================================

/**
 * Generate a time-bucketed cache key
 * Useful for data that changes frequently but can be cached for short periods
 */
export function getTimeBucketKey(
  prefix: string,
  bucketMinutes: number,
): string {
  const now = Date.now();
  const bucket = Math.floor(now / (bucketMinutes * 60 * 1000));
  return `${prefix}:${bucket}`;
}

// Predefined TTL constants (in seconds)
export const CACHE_TTL = {
  // Odds API
  SPORTS_LIST: 60 * 60, // 1 hour - sports list rarely changes
  ODDS_DATA: 5 * 60, // 5 minutes - odds change frequently

  // Yahoo Finance
  STOCK_QUOTE: 15 * 60, // 15 minutes
  COMPANY_INFO: 24 * 60 * 60, // 24 hours
  HISTORICAL_DATA: 60 * 60, // 1 hour

  // Binance
  FUNDING_RATE: 5 * 60, // 5 minutes
  SPOT_PRICE: 60, // 1 minute - very volatile
  TOP_PAIRS: 15 * 60, // 15 minutes
} as const;

// Cache key prefixes
export const CACHE_PREFIX = {
  ODDS: "odds",
  SPORTS: "sports",
  STOCKS: "stocks",
  CRYPTO: "crypto",
} as const;

/**
 * Helper to wrap a function with caching
 * Useful for simple cases where you want to cache the entire response
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>,
): Promise<T> {
  // Try to get from cache first
  const cached = await getCached<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();

  // Cache the result (don't await, fire and forget)
  setCache(key, data, ttlSeconds).catch(() => {
    // Already logged in setCache
  });

  return data;
}
