// ============================================
// HILLWAY ALPHA - Crypto Sentiment Scanner
// Fear & Greed contrarian signals
// ============================================

import { v4 as uuidv4 } from 'uuid';
import {
  fetchFearGreedIndex,
  getCurrentSentiment,
  analyzeSentimentTrend,
  SentimentReading,
} from '@/lib/scanner-api/sentiment-apis';

export interface SentimentOpportunity {
  id: string;
  type: 'sentiment';
  signal: 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell';
  fearGreedValue: number;
  classification: string;
  signalStrength: number;
  trend: 'improving' | 'worsening' | 'stable';
  trendMomentum: number;
  reasoning: string;
  confidence: number;
  suggestedAction: string;
  createdAt: Date;
}

export interface SentimentScannerOptions {
  extremeFearThreshold?: number;   // Below this = strong buy (default: 25)
  fearThreshold?: number;          // Below this = buy (default: 40)
  greedThreshold?: number;         // Above this = sell (default: 60)
  extremeGreedThreshold?: number;  // Above this = strong sell (default: 75)
  minSignalStrength?: number;      // Minimum strength to report (default: 30)
}

const DEFAULT_OPTIONS: Required<SentimentScannerOptions> = {
  extremeFearThreshold: 25,
  fearThreshold: 40,
  greedThreshold: 60,
  extremeGreedThreshold: 75,
  minSignalStrength: 30,
};

export class SentimentScanner {
  private options: Required<SentimentScannerOptions>;

  constructor(options: SentimentScannerOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Scan for sentiment-based opportunities
   */
  async scan(): Promise<SentimentOpportunity[]> {
    const opportunities: SentimentOpportunity[] = [];

    try {
      const [current, trend] = await Promise.all([
        getCurrentSentiment(),
        analyzeSentimentTrend(7),
      ]);

      if (!current) {
        console.error('Could not fetch sentiment data');
        return [];
      }

      // Only create opportunity if signal is not neutral and strong enough
      if (current.signal === 'neutral' || current.signalStrength < this.options.minSignalStrength) {
        return [];
      }

      const opportunity = this.createOpportunity(current, trend);
      opportunities.push(opportunity);

    } catch (error) {
      console.error('Error scanning sentiment:', error);
    }

    return opportunities;
  }

  /**
   * Create opportunity from sentiment data
   */
  private createOpportunity(
    current: SentimentReading,
    trend: { current: number; average: number; trend: string; momentum: number }
  ): SentimentOpportunity {
    const { value, classification, signal, signalStrength } = current;

    // Build reasoning
    let reasoning = `Fear & Greed Index at ${value} (${classification}). `;

    if (signal === 'strong_buy' || signal === 'buy') {
      reasoning += 'Contrarian signal: Market fear typically precedes recoveries. ';
    } else if (signal === 'strong_sell' || signal === 'sell') {
      reasoning += 'Contrarian signal: Market euphoria often precedes corrections. ';
    }

    if (trend.trend === 'improving') {
      reasoning += `Sentiment improving (momentum: +${trend.momentum.toFixed(1)}). `;
    } else if (trend.trend === 'worsening') {
      reasoning += `Sentiment worsening (momentum: ${trend.momentum.toFixed(1)}). `;
    }

    // Calculate confidence based on signal strength and trend alignment
    let confidence = signalStrength;

    // Boost confidence if trend supports the signal
    if ((signal.includes('buy') && trend.trend === 'worsening') ||
        (signal.includes('sell') && trend.trend === 'improving')) {
      // Counter-trend - slightly lower confidence
      confidence -= 10;
    } else if ((signal.includes('buy') && trend.trend === 'improving') ||
               (signal.includes('sell') && trend.trend === 'worsening')) {
      // Trend-aligned - higher confidence
      confidence += 10;
    }

    confidence = Math.max(0, Math.min(100, confidence));

    // Suggested action
    let suggestedAction: string;
    switch (signal) {
      case 'strong_buy':
        suggestedAction = 'Consider significant BTC/ETH accumulation. DCA into positions.';
        break;
      case 'buy':
        suggestedAction = 'Light accumulation of major cryptos. Watch for further fear.';
        break;
      case 'sell':
        suggestedAction = 'Take partial profits. Reduce risk exposure.';
        break;
      case 'strong_sell':
        suggestedAction = 'Consider significant profit-taking. Raise cash levels.';
        break;
      default:
        suggestedAction = 'No action recommended. Market in neutral territory.';
    }

    return {
      id: uuidv4(),
      type: 'sentiment',
      signal,
      fearGreedValue: value,
      classification,
      signalStrength,
      trend: trend.trend as 'improving' | 'worsening' | 'stable',
      trendMomentum: trend.momentum,
      reasoning,
      confidence,
      suggestedAction,
      createdAt: new Date(),
    };
  }

  /**
   * Get historical sentiment for analysis
   */
  async getHistoricalSentiment(days: number = 30): Promise<{
    data: Array<{ date: Date; value: number; classification: string }>;
    stats: { min: number; max: number; average: number; current: number };
  }> {
    const rawData = await fetchFearGreedIndex(days);

    const data = rawData.map(d => ({
      date: new Date(parseInt(d.timestamp, 10) * 1000),
      value: parseInt(d.value, 10),
      classification: d.value_classification,
    }));

    const values = data.map(d => d.value);
    const stats = {
      min: Math.min(...values),
      max: Math.max(...values),
      average: values.reduce((a, b) => a + b, 0) / values.length,
      current: values[0],
    };

    return { data, stats };
  }

  /**
   * Update scanner options
   */
  updateOptions(options: Partial<SentimentScannerOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

export function createSentimentScanner(
  options?: SentimentScannerOptions
): SentimentScanner {
  return new SentimentScanner(options);
}
