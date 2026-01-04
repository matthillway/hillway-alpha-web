// ============================================
// HILLWAY ALPHA - Arbitrage Scanner
// ============================================

import { v4 as uuidv4 } from "uuid";
import {
  OddsApiEvent,
  ArbitrageOpportunity,
  BestOddsOutcome,
  StakeAllocation,
} from "@/lib/types/scanner";
import {
  oddsToImpliedProbability,
  calculateArbitrageMargin,
  calculateArbitrageStakes,
  hoursUntil,
} from "@/lib/scanner-utils/calculations";
import { OddsApiClient, SUPPORTED_SPORTS } from "@/lib/scanner-api/odds-api";

export interface ArbitrageScannerOptions {
  minMargin?: number; // Minimum profit margin % (default: 1.0)
  maxHoursAhead?: number; // Only events within X hours (default: 48)
  totalStake?: number; // Total stake to calculate with (default: 100)
  sports?: string[]; // Which sports to scan
}

const DEFAULT_OPTIONS: Required<ArbitrageScannerOptions> = {
  minMargin: 1.0,
  maxHoursAhead: 48,
  totalStake: 100,
  sports: ["soccer_epl", "soccer_uefa_champs_league"],
};

/**
 * Find the best odds for each outcome across all bookmakers
 */
function findBestOddsPerOutcome(event: OddsApiEvent): BestOddsOutcome[] {
  const bestOdds: Map<string, BestOddsOutcome> = new Map();

  for (const bookmaker of event.bookmakers) {
    // Find h2h market
    const h2hMarket = bookmaker.markets.find((m) => m.key === "h2h");
    if (!h2hMarket) continue;

    for (const outcome of h2hMarket.outcomes) {
      const existing = bestOdds.get(outcome.name);

      if (!existing || outcome.price > existing.odds) {
        bestOdds.set(outcome.name, {
          outcome:
            outcome.name === event.home_team
              ? "home"
              : outcome.name === event.away_team
                ? "away"
                : "draw",
          team: outcome.name,
          odds: outcome.price,
          bookmaker: bookmaker.title,
          impliedProbability: oddsToImpliedProbability(outcome.price),
        });
      }
    }
  }

  return Array.from(bestOdds.values());
}

/**
 * Check if an event has an arbitrage opportunity
 */
function analyzeEventForArbitrage(
  event: OddsApiEvent,
  options: Required<ArbitrageScannerOptions>,
): ArbitrageOpportunity | null {
  const bestOdds = findBestOddsPerOutcome(event);

  // Need at least 2 outcomes (3 for football with draw)
  if (bestOdds.length < 2) return null;

  const oddsArray = bestOdds.map((o) => o.odds);
  const margin = calculateArbitrageMargin(oddsArray);

  // Check if margin meets minimum threshold
  if (margin < options.minMargin) return null;

  // Calculate stake distribution
  const { stakes, profit, returnAmount } = calculateArbitrageStakes(
    oddsArray,
    options.totalStake,
  );

  // Build stake allocations
  const stakeAllocations: StakeAllocation[] = bestOdds.map((outcome, i) => ({
    outcome: outcome.outcome,
    team: outcome.team,
    bookmaker: outcome.bookmaker,
    odds: outcome.odds,
    stake: stakes[i],
    potentialReturn: stakes[i] * outcome.odds,
  }));

  const commenceTime = new Date(event.commence_time);
  const hoursAhead = hoursUntil(commenceTime);

  // Skip events too far in the future or already started
  if (hoursAhead < 0 || hoursAhead > options.maxHoursAhead) return null;

  return {
    id: uuidv4(),
    eventId: event.id,
    event: `${event.home_team} vs ${event.away_team}`,
    homeTeam: event.home_team,
    awayTeam: event.away_team,
    sport: event.sport_key,
    sportTitle: event.sport_title,
    commenceTime,
    margin,
    totalImpliedProbability: bestOdds.reduce(
      (sum, o) => sum + o.impliedProbability,
      0,
    ),
    stakes: stakeAllocations,
    totalStake: options.totalStake,
    guaranteedProfit: profit,
    guaranteedReturn: returnAmount,
    hoursUntilStart: hoursAhead,
    createdAt: new Date(),
  };
}

/**
 * Main arbitrage scanner class
 */
export class ArbitrageScanner {
  private oddsClient: OddsApiClient;
  private options: Required<ArbitrageScannerOptions>;

  constructor(
    oddsClient: OddsApiClient,
    options: ArbitrageScannerOptions = {},
  ) {
    this.oddsClient = oddsClient;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Scan for arbitrage opportunities across specified sports
   */
  async scan(sports?: string[]): Promise<ArbitrageOpportunity[]> {
    const sportsToScan = sports || this.options.sports;
    const opportunities: ArbitrageOpportunity[] = [];

    for (const sport of sportsToScan) {
      try {
        const events = await this.oddsClient.getOdds(sport, {
          regions: ["uk"],
          markets: ["h2h"],
        });

        for (const event of events) {
          const arb = analyzeEventForArbitrage(event, this.options);
          if (arb) {
            opportunities.push(arb);
          }
        }
      } catch (error) {
        console.error(`Error scanning ${sport}:`, error);
      }
    }

    // Sort by margin (highest first)
    return opportunities.sort((a, b) => b.margin - a.margin);
  }

  /**
   * Scan Premier League only (quick scan)
   */
  async scanPremierLeague(): Promise<ArbitrageOpportunity[]> {
    return this.scan(["soccer_epl"]);
  }

  /**
   * Scan all supported football leagues
   */
  async scanAllFootball(): Promise<ArbitrageOpportunity[]> {
    const footballSports = Object.keys(SUPPORTED_SPORTS).filter((s) =>
      s.startsWith("soccer"),
    );
    return this.scan(footballSports);
  }

  /**
   * Get quota status
   */
  getQuotaStatus() {
    return this.oddsClient.getQuotaStatus();
  }

  /**
   * Update scanner options
   */
  updateOptions(options: Partial<ArbitrageScannerOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

/**
 * Create a configured arbitrage scanner
 */
export function createArbitrageScanner(
  oddsClient: OddsApiClient,
  options?: ArbitrageScannerOptions,
): ArbitrageScanner {
  return new ArbitrageScanner(oddsClient, options);
}
