// ============================================
// HILLWAY ALPHA - Value Bet Scanner
// Identifies bets where model probability > implied probability
// ============================================

import { v4 as uuidv4 } from 'uuid';
import { OddsApiEvent, ValueBetOpportunity } from '@/lib/types/scanner';
import {
  oddsToImpliedProbability,
  calculateExpectedValuePercent,
  calculateKellyStake,
  hoursUntil,
} from '@/lib/scanner-utils/calculations';
import { OddsApiClient } from '@/lib/scanner-api/odds-api';

export interface ValueBetScannerOptions {
  minEdge?: number;           // Minimum edge % (default: 3.0)
  minConfidence?: number;     // Minimum confidence score (default: 60)
  maxHoursAhead?: number;     // Max hours until event (default: 48)
  bankroll?: number;          // Betting bankroll for stake sizing
  kellyFraction?: number;     // Kelly fraction (default: 0.25)
}

const DEFAULT_OPTIONS: Required<ValueBetScannerOptions> = {
  minEdge: 3.0,
  minConfidence: 60,
  maxHoursAhead: 48,
  bankroll: 1000,
  kellyFraction: 0.25,
};

/**
 * Simple form-based probability model
 * Uses historical patterns and basic statistics
 */
interface TeamStats {
  recentWins: number;
  recentDraws: number;
  recentLosses: number;
  homeAdvantage: number;  // Multiplier for home team
  avgGoalsScored: number;
  avgGoalsConceded: number;
}

/**
 * Calculate model probability for a football match
 * This is a simplified model - real implementation would use more data
 */
function calculateModelProbabilities(
  homeTeam: string,
  awayTeam: string,
  homeStats?: TeamStats,
  awayStats?: TeamStats
): { home: number; draw: number; away: number } {
  // Default probabilities based on historical averages
  // Premier League long-term averages: ~46% home, ~27% draw, ~27% away
  let homeProb = 0.46;
  let drawProb = 0.27;
  let awayProb = 0.27;

  if (homeStats && awayStats) {
    // Adjust based on recent form
    const homeFormScore = (homeStats.recentWins * 3 + homeStats.recentDraws) / 15;
    const awayFormScore = (awayStats.recentWins * 3 + awayStats.recentDraws) / 15;

    // Form differential adjustment
    const formDiff = homeFormScore - awayFormScore;
    homeProb += formDiff * 0.15;
    awayProb -= formDiff * 0.15;

    // Goal scoring adjustment
    const homeAttack = homeStats.avgGoalsScored / 1.5;
    const awayAttack = awayStats.avgGoalsScored / 1.5;
    const homeDefense = 1.5 / homeStats.avgGoalsConceded;
    const awayDefense = 1.5 / awayStats.avgGoalsConceded;

    const homeStrength = (homeAttack * homeDefense) / (awayAttack * awayDefense);
    homeProb *= Math.min(1.3, Math.max(0.7, homeStrength));
  }

  // Normalize probabilities
  const total = homeProb + drawProb + awayProb;
  return {
    home: homeProb / total,
    draw: drawProb / total,
    away: awayProb / total,
  };
}

/**
 * Calculate confidence score for a value bet
 */
function calculateConfidence(
  edge: number,
  oddsCount: number,
  hoursUntilStart: number
): number {
  let confidence = 50;

  // Higher edge = higher confidence
  if (edge >= 10) confidence += 25;
  else if (edge >= 7) confidence += 20;
  else if (edge >= 5) confidence += 15;
  else if (edge >= 3) confidence += 10;

  // More bookmakers = more reliable odds
  if (oddsCount >= 5) confidence += 10;
  else if (oddsCount >= 3) confidence += 5;

  // Events soon have more reliable odds
  if (hoursUntilStart <= 6) confidence += 10;
  else if (hoursUntilStart <= 24) confidence += 5;

  return Math.min(100, Math.max(0, confidence));
}

/**
 * Find value bets in an event
 */
function findValueBetsInEvent(
  event: OddsApiEvent,
  options: Required<ValueBetScannerOptions>
): ValueBetOpportunity[] {
  const valueBets: ValueBetOpportunity[] = [];

  if (event.bookmakers.length === 0) return valueBets;

  // Calculate model probabilities
  const modelProbs = calculateModelProbabilities(event.home_team, event.away_team);

  // Get average odds for each outcome
  const outcomeOdds: Map<string, { odds: number[]; bookmakers: string[] }> = new Map();

  for (const bookmaker of event.bookmakers) {
    const h2hMarket = bookmaker.markets.find(m => m.key === 'h2h');
    if (!h2hMarket) continue;

    for (const outcome of h2hMarket.outcomes) {
      const existing = outcomeOdds.get(outcome.name) || { odds: [], bookmakers: [] };
      existing.odds.push(outcome.price);
      existing.bookmakers.push(bookmaker.title);
      outcomeOdds.set(outcome.name, existing);
    }
  }

  const commenceTime = new Date(event.commence_time);
  const hoursAhead = hoursUntil(commenceTime);

  if (hoursAhead < 0 || hoursAhead > options.maxHoursAhead) return valueBets;

  // Check each outcome for value
  for (const [outcomeName, data] of outcomeOdds) {
    if (data.odds.length === 0) continue;

    // Find best odds for this outcome
    const bestOddsIndex = data.odds.indexOf(Math.max(...data.odds));
    const bestOdds = data.odds[bestOddsIndex];
    const bestBookmaker = data.bookmakers[bestOddsIndex];

    const impliedProb = oddsToImpliedProbability(bestOdds);

    // Get model probability for this outcome
    let modelProb: number;
    if (outcomeName === event.home_team) {
      modelProb = modelProbs.home;
    } else if (outcomeName === event.away_team) {
      modelProb = modelProbs.away;
    } else {
      modelProb = modelProbs.draw;
    }

    // Calculate edge
    const edge = (modelProb - impliedProb) * 100;

    if (edge >= options.minEdge) {
      const ev = calculateExpectedValuePercent(modelProb, bestOdds);
      const confidence = calculateConfidence(edge, data.odds.length, hoursAhead);

      if (confidence >= options.minConfidence) {
        const suggestedStake = calculateKellyStake(
          modelProb,
          bestOdds,
          options.bankroll,
          options.kellyFraction
        );

        valueBets.push({
          id: uuidv4(),
          event: `${event.home_team} vs ${event.away_team}`,
          selection: outcomeName,
          bookmaker: bestBookmaker,
          bookmakerOdds: bestOdds,
          impliedProbability: impliedProb * 100,
          modelProbability: modelProb * 100,
          expectedValue: ev,
          confidence,
          suggestedStake: Math.round(suggestedStake * 100) / 100,
          sport: event.sport_key,
          commenceTime,
        });
      }
    }
  }

  return valueBets;
}

/**
 * Value Bet Scanner class
 */
export class ValueBetScanner {
  private oddsClient: OddsApiClient;
  private options: Required<ValueBetScannerOptions>;

  constructor(
    oddsClient: OddsApiClient,
    options: ValueBetScannerOptions = {}
  ) {
    this.oddsClient = oddsClient;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Scan for value bets across specified sports
   */
  async scan(sports: string[] = ['soccer_epl']): Promise<ValueBetOpportunity[]> {
    const allValueBets: ValueBetOpportunity[] = [];

    for (const sport of sports) {
      try {
        const events = await this.oddsClient.getOdds(sport, {
          regions: ['uk'],
          markets: ['h2h'],
        });

        for (const event of events) {
          const valueBets = findValueBetsInEvent(event, this.options);
          allValueBets.push(...valueBets);
        }
      } catch (error) {
        console.error(`Error scanning ${sport} for value bets:`, error);
      }
    }

    // Sort by expected value
    return allValueBets.sort((a, b) => b.expectedValue - a.expectedValue);
  }

  /**
   * Update scanner options
   */
  updateOptions(options: Partial<ValueBetScannerOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Get quota status
   */
  getQuotaStatus() {
    return this.oddsClient.getQuotaStatus();
  }
}

/**
 * Create a configured value bet scanner
 */
export function createValueBetScanner(
  oddsClient: OddsApiClient,
  options?: ValueBetScannerOptions
): ValueBetScanner {
  return new ValueBetScanner(oddsClient, options);
}
