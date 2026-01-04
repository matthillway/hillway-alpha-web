/**
 * Platform Clients Index
 *
 * Central module for creating and managing platform clients
 */

export * from "./types";
export { BetfairClient } from "./betfair";
export { IBKRClient } from "./ibkr";
export { KrakenClient } from "./kraken";

import { Platform, PlatformClient, PlatformCredentials } from "./types";
import { BetfairClient } from "./betfair";
import { IBKRClient } from "./ibkr";
import { KrakenClient } from "./kraken";

/**
 * Create a platform client based on the platform type
 */
export function createPlatformClient(
  platform: Platform,
  credentials: PlatformCredentials,
): PlatformClient {
  switch (platform) {
    case "betfair":
      return new BetfairClient(credentials);
    case "ibkr":
      return new IBKRClient(credentials);
    case "kraken":
      return new KrakenClient(credentials);
    default:
      throw new Error(`Unknown platform: ${platform}`);
  }
}

/**
 * Platform configuration for UI display
 */
export const PLATFORM_CONFIG = {
  betfair: {
    name: "Betfair",
    description: "UK-based betting exchange",
    authType: "oauth" as const,
    icon: "activity", // lucide icon name
    color: "yellow",
    requiresFields: [] as string[],
  },
  ibkr: {
    name: "Interactive Brokers",
    description: "Global trading platform for stocks, options, and more",
    authType: "apikey" as const,
    icon: "bar-chart-3",
    color: "red",
    requiresFields: ["apiKey", "apiSecret"] as string[],
  },
  kraken: {
    name: "Kraken",
    description: "Cryptocurrency exchange",
    authType: "apikey" as const,
    icon: "bitcoin",
    color: "purple",
    requiresFields: ["apiKey", "apiSecret"] as string[],
  },
} as const;

export type PlatformConfig = (typeof PLATFORM_CONFIG)[Platform];
