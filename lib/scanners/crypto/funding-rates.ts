// ============================================
// HILLWAY ALPHA - Crypto Funding Rate Scanner
// Identifies funding rate arbitrage opportunities
// ============================================

import { v4 as uuidv4 } from 'uuid';
import { BinanceClient, createBinanceClient } from '@/lib/scanner-api/binance';
import { FundingRateOpportunity } from '@/lib/types/scanner';

export interface FundingRateScannerOptions {
  minAnnualizedRate?: number;  // Minimum annualized rate to flag (default: 50%)
  symbols?: string[];          // Specific symbols to scan
  topPairsCount?: number;      // Number of top pairs to scan
}

const DEFAULT_OPTIONS: Required<FundingRateScannerOptions> = {
  minAnnualizedRate: 50,
  symbols: [],
  topPairsCount: 20,
};

export interface FundingOpportunity {
  id: string;
  symbol: string;
  asset: string;
  currentRate: number;           // Per 8 hours (%)
  annualizedRate: number;        // APY (%)
  direction: 'long' | 'short';   // Which side to take
  markPrice: number;
  nextFundingTime: Date;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  suggestedSize: number;         // Based on bankroll
  createdAt: Date;
}

/**
 * Calculate annualized rate from 8-hour funding rate
 * Funding is paid 3x per day (every 8 hours)
 */
function annualizeRate(rate8h: number): number {
  // (1 + rate)^(365*3) - 1 for compound
  // Or simplified: rate * 3 * 365 for linear
  return rate8h * 3 * 365;
}

/**
 * Determine risk level based on rate magnitude
 */
function assessRiskLevel(annualizedRate: number): 'low' | 'medium' | 'high' {
  const absRate = Math.abs(annualizedRate);
  if (absRate > 200) return 'high';   // Very volatile
  if (absRate > 100) return 'medium';
  return 'low';
}

/**
 * Calculate confidence score
 */
function calculateConfidence(
  annualizedRate: number,
  hoursToFunding: number
): number {
  let confidence = 60;

  // Higher rates = potentially more opportunity but also more risk
  const absRate = Math.abs(annualizedRate);
  if (absRate >= 100) confidence += 15;
  else if (absRate >= 75) confidence += 10;

  // Closer to funding time = more certainty
  if (hoursToFunding <= 2) confidence += 15;
  else if (hoursToFunding <= 4) confidence += 10;

  return Math.min(100, confidence);
}

export class FundingRateScanner {
  private client: BinanceClient;
  private options: Required<FundingRateScannerOptions>;

  constructor(options: FundingRateScannerOptions = {}) {
    this.client = createBinanceClient();
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Scan for funding rate opportunities
   */
  async scan(): Promise<FundingOpportunity[]> {
    const opportunities: FundingOpportunity[] = [];

    try {
      // Get all current funding rates
      const rates = await this.client.getCurrentFundingRates();

      // Filter to symbols we care about
      let symbolsToCheck = rates;
      if (this.options.symbols.length > 0) {
        symbolsToCheck = rates.filter(r =>
          this.options.symbols.includes(r.symbol)
        );
      } else {
        // Get top pairs by volume
        const topPairs = await this.client.getTopPairs(this.options.topPairsCount);
        symbolsToCheck = rates.filter(r => topPairs.includes(r.symbol));
      }

      const now = Date.now();

      for (const rate of symbolsToCheck) {
        const fundingRate = parseFloat(rate.lastFundingRate) * 100; // Convert to %
        const annualized = annualizeRate(fundingRate);

        // Skip if below threshold
        if (Math.abs(annualized) < this.options.minAnnualizedRate) continue;

        const nextFundingTime = new Date(rate.nextFundingTime);
        const hoursToFunding = (rate.nextFundingTime - now) / (1000 * 60 * 60);

        // Determine direction: if rate is positive, shorts pay longs (so go long)
        // If rate is negative, longs pay shorts (so go short)
        const direction: 'long' | 'short' = fundingRate > 0 ? 'long' : 'short';

        const confidence = calculateConfidence(annualized, hoursToFunding);
        const riskLevel = assessRiskLevel(annualized);

        // Calculate suggested position size (conservative)
        const cryptoBankroll = parseFloat(process.env.CRYPTO_BANKROLL || '2000');
        const riskMultiplier = riskLevel === 'low' ? 0.1 : riskLevel === 'medium' ? 0.05 : 0.02;
        const suggestedSize = cryptoBankroll * riskMultiplier;

        opportunities.push({
          id: uuidv4(),
          symbol: rate.symbol,
          asset: rate.symbol.replace('USDT', ''),
          currentRate: fundingRate,
          annualizedRate: annualized,
          direction,
          markPrice: parseFloat(rate.markPrice),
          nextFundingTime,
          confidence,
          riskLevel,
          suggestedSize: Math.round(suggestedSize),
          createdAt: new Date(),
        });
      }

      // Sort by absolute annualized rate (highest first)
      return opportunities.sort((a, b) =>
        Math.abs(b.annualizedRate) - Math.abs(a.annualizedRate)
      );
    } catch (error) {
      console.error('Error scanning funding rates:', error);
      return [];
    }
  }

  /**
   * Get top N opportunities
   */
  async getTopOpportunities(limit: number = 5): Promise<FundingOpportunity[]> {
    const all = await this.scan();
    return all.slice(0, limit);
  }

  /**
   * Update scanner options
   */
  updateOptions(options: Partial<FundingRateScannerOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

export function createFundingRateScanner(
  options?: FundingRateScannerOptions
): FundingRateScanner {
  return new FundingRateScanner(options);
}
