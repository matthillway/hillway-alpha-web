// ============================================
// HILLWAY ALPHA - Stock Momentum Scanner
// RSI, MACD, Moving Average crossovers
// ============================================

import { v4 as uuidv4 } from 'uuid';
import {
  createYahooFinanceClient,
  YahooFinanceClient,
  StockQuote,
  HistoricalData,
  FTSE_100_SYMBOLS,
  SP500_SYMBOLS,
} from '@/lib/scanner-api/yahoo-finance';
import {
  rsi,
  macd,
  bollingerBands,
  detectGoldenCross,
  detectDeathCross,
  isOversold,
  isOverbought,
  isMacdBullish,
  isMacdBearish,
} from '@/lib/scanner-utils/indicators';

export interface MomentumSignal {
  type: 'rsi_oversold' | 'rsi_overbought' | 'macd_bullish' | 'macd_bearish' |
        'golden_cross' | 'death_cross' | 'bollinger_squeeze' | 'breakout_high' |
        'breakout_low' | 'volume_spike';
  strength: number;  // 0-100
  value?: number;    // Signal-specific value (e.g., RSI value)
}

export interface MomentumOpportunity {
  id: string;
  type: 'momentum';
  symbol: string;
  name: string;
  market: 'UK' | 'US';
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  signals: MomentumSignal[];
  overallSignal: 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell';
  confidence: number;
  technicals: {
    rsi14: number;
    macdLine: number;
    macdSignal: number;
    macdHistogram: number;
    sma50: number;
    sma200: number;
    bollingerUpper: number;
    bollingerLower: number;
    bollingerBandwidth: number;
  };
  volumeRatio: number;  // Current vs average
  fiftyTwoWeekPosition: number;  // 0 = at low, 100 = at high
  reasoning: string;
  suggestedAction: string;
  createdAt: Date;
}

export interface MomentumScannerOptions {
  markets?: ('UK' | 'US')[];
  symbols?: string[];
  minConfidence?: number;
  rsiOversoldThreshold?: number;
  rsiOverboughtThreshold?: number;
  volumeSpikeMultiple?: number;
}

const DEFAULT_OPTIONS: Required<MomentumScannerOptions> = {
  markets: ['UK', 'US'],
  symbols: [],
  minConfidence: 40,
  rsiOversoldThreshold: 30,
  rsiOverboughtThreshold: 70,
  volumeSpikeMultiple: 2,
};

export class MomentumScanner {
  private client: YahooFinanceClient;
  private options: Required<MomentumScannerOptions>;

  constructor(options: MomentumScannerOptions = {}) {
    this.client = createYahooFinanceClient();
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Scan for momentum opportunities
   */
  async scan(): Promise<MomentumOpportunity[]> {
    const opportunities: MomentumOpportunity[] = [];

    try {
      // Determine which symbols to scan
      let symbolsToScan: { symbol: string; market: 'UK' | 'US' }[] = [];

      if (this.options.symbols.length > 0) {
        // Use provided symbols (assume US market unless .L suffix)
        symbolsToScan = this.options.symbols.map(s => ({
          symbol: s,
          market: s.endsWith('.L') ? 'UK' as const : 'US' as const,
        }));
      } else {
        // Use default lists based on selected markets
        if (this.options.markets.includes('UK')) {
          symbolsToScan.push(...FTSE_100_SYMBOLS.map(s => ({ symbol: s, market: 'UK' as const })));
        }
        if (this.options.markets.includes('US')) {
          symbolsToScan.push(...SP500_SYMBOLS.map(s => ({ symbol: s, market: 'US' as const })));
        }
      }

      console.log(`Scanning ${symbolsToScan.length} stocks for momentum signals...`);

      // Process stocks in parallel batches
      const batchSize = 5;
      for (let i = 0; i < symbolsToScan.length; i += batchSize) {
        const batch = symbolsToScan.slice(i, i + batchSize);

        const batchResults = await Promise.all(
          batch.map(({ symbol, market }) => this.analyzeStock(symbol, market))
        );

        const validResults = batchResults.filter(
          (r): r is MomentumOpportunity =>
            r !== null && r.confidence >= this.options.minConfidence
        );

        opportunities.push(...validResults);

        // Rate limiting
        if (i + batchSize < symbolsToScan.length) {
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      // Sort by confidence (highest first)
      return opportunities.sort((a, b) => b.confidence - a.confidence);

    } catch (error) {
      console.error('Error scanning momentum:', error);
      return [];
    }
  }

  /**
   * Analyze a single stock for momentum signals
   */
  private async analyzeStock(
    symbol: string,
    market: 'UK' | 'US'
  ): Promise<MomentumOpportunity | null> {
    try {
      // Fetch quote and historical data in parallel
      const [quote, historicalData] = await Promise.all([
        this.client.getQuote(symbol),
        this.client.getHistoricalData(symbol, '1y'),
      ]);

      if (!quote || historicalData.length < 50) {
        return null;
      }

      // Extract closing prices
      const closePrices = historicalData.map(d => d.close);
      const volumes = historicalData.map(d => d.volume);

      // Calculate all indicators
      const rsiValues = rsi(closePrices, 14);
      const macdData = macd(closePrices, 12, 26, 9);
      const bbData = bollingerBands(closePrices, 20, 2);

      // Get current values
      const currentRsi = rsiValues[rsiValues.length - 1];
      const currentMacd = macdData.macd[macdData.macd.length - 1];
      const currentSignal = macdData.signal[macdData.signal.length - 1];
      const currentHistogram = macdData.histogram[macdData.histogram.length - 1];

      // Collect signals
      const signals: MomentumSignal[] = [];

      // RSI signals
      if (isOversold(rsiValues, this.options.rsiOversoldThreshold)) {
        const strength = Math.min(100, (this.options.rsiOversoldThreshold - currentRsi) * 3);
        signals.push({ type: 'rsi_oversold', strength, value: currentRsi });
      }
      if (isOverbought(rsiValues, this.options.rsiOverboughtThreshold)) {
        const strength = Math.min(100, (currentRsi - this.options.rsiOverboughtThreshold) * 3);
        signals.push({ type: 'rsi_overbought', strength, value: currentRsi });
      }

      // MACD signals
      if (isMacdBullish(macdData)) {
        signals.push({ type: 'macd_bullish', strength: 70 });
      }
      if (isMacdBearish(macdData)) {
        signals.push({ type: 'macd_bearish', strength: 70 });
      }

      // Moving average crossovers (need 200+ days)
      if (closePrices.length >= 201) {
        if (detectGoldenCross(closePrices)) {
          signals.push({ type: 'golden_cross', strength: 85 });
        }
        if (detectDeathCross(closePrices)) {
          signals.push({ type: 'death_cross', strength: 85 });
        }
      }

      // Volume spike
      const avgVolume = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
      const currentVolume = volumes[volumes.length - 1];
      const volumeRatio = currentVolume / avgVolume;

      if (volumeRatio >= this.options.volumeSpikeMultiple) {
        signals.push({
          type: 'volume_spike',
          strength: Math.min(100, volumeRatio * 25),
          value: volumeRatio,
        });
      }

      // Bollinger squeeze (low bandwidth = potential breakout)
      const currentBandwidth = bbData.bandwidth[bbData.bandwidth.length - 1];
      const avgBandwidth = bbData.bandwidth.filter(b => !isNaN(b)).slice(-50);
      if (avgBandwidth.length > 0) {
        const bandwidthAvg = avgBandwidth.reduce((a, b) => a + b, 0) / avgBandwidth.length;
        if (currentBandwidth < bandwidthAvg * 0.5) {
          signals.push({ type: 'bollinger_squeeze', strength: 60 });
        }
      }

      // Near 52-week high/low breakouts
      const percentFrom52High = quote.fiftyTwoWeekHigh > 0
        ? ((quote.fiftyTwoWeekHigh - quote.regularMarketPrice) / quote.fiftyTwoWeekHigh) * 100
        : 0;
      const percentFrom52Low = quote.fiftyTwoWeekLow > 0
        ? ((quote.regularMarketPrice - quote.fiftyTwoWeekLow) / quote.fiftyTwoWeekLow) * 100
        : 0;

      if (percentFrom52High <= 3) {
        signals.push({ type: 'breakout_high', strength: 75, value: percentFrom52High });
      }
      if (percentFrom52Low <= 5 && quote.regularMarketChange > 0) {
        signals.push({ type: 'breakout_low', strength: 70, value: percentFrom52Low });
      }

      // Skip if no significant signals
      if (signals.length === 0) {
        return null;
      }

      // Calculate overall signal and confidence
      const { overallSignal, confidence, reasoning, suggestedAction } =
        this.calculateOverallSignal(signals, quote);

      // Calculate 52-week position (0 = at low, 100 = at high)
      const fiftyTwoWeekRange = quote.fiftyTwoWeekHigh - quote.fiftyTwoWeekLow;
      const fiftyTwoWeekPosition = fiftyTwoWeekRange > 0
        ? ((quote.regularMarketPrice - quote.fiftyTwoWeekLow) / fiftyTwoWeekRange) * 100
        : 50;

      // Calculate SMA values (need enough data)
      const sma50Values = closePrices.length >= 50
        ? closePrices.slice(-50).reduce((a, b) => a + b, 0) / 50
        : quote.regularMarketPrice;
      const sma200Values = closePrices.length >= 200
        ? closePrices.slice(-200).reduce((a, b) => a + b, 0) / 200
        : quote.regularMarketPrice;

      return {
        id: uuidv4(),
        type: 'momentum',
        symbol,
        name: quote.shortName,
        market,
        currentPrice: quote.regularMarketPrice,
        priceChange: quote.regularMarketChange,
        priceChangePercent: quote.regularMarketChangePercent,
        signals,
        overallSignal,
        confidence,
        technicals: {
          rsi14: currentRsi,
          macdLine: currentMacd,
          macdSignal: currentSignal,
          macdHistogram: currentHistogram,
          sma50: sma50Values,
          sma200: sma200Values,
          bollingerUpper: bbData.upper[bbData.upper.length - 1],
          bollingerLower: bbData.lower[bbData.lower.length - 1],
          bollingerBandwidth: currentBandwidth,
        },
        volumeRatio,
        fiftyTwoWeekPosition,
        reasoning,
        suggestedAction,
        createdAt: new Date(),
      };
    } catch (error) {
      // Silent fail for individual stocks
      return null;
    }
  }

  /**
   * Calculate overall signal from individual signals
   */
  private calculateOverallSignal(
    signals: MomentumSignal[],
    quote: StockQuote
  ): {
    overallSignal: MomentumOpportunity['overallSignal'];
    confidence: number;
    reasoning: string;
    suggestedAction: string;
  } {
    // Score bullish vs bearish signals
    let bullishScore = 0;
    let bearishScore = 0;
    const reasoningParts: string[] = [];

    for (const signal of signals) {
      switch (signal.type) {
        case 'rsi_oversold':
          bullishScore += signal.strength;
          reasoningParts.push(`RSI oversold at ${signal.value?.toFixed(1)}`);
          break;
        case 'rsi_overbought':
          bearishScore += signal.strength;
          reasoningParts.push(`RSI overbought at ${signal.value?.toFixed(1)}`);
          break;
        case 'macd_bullish':
          bullishScore += signal.strength;
          reasoningParts.push('MACD bullish crossover');
          break;
        case 'macd_bearish':
          bearishScore += signal.strength;
          reasoningParts.push('MACD bearish crossover');
          break;
        case 'golden_cross':
          bullishScore += signal.strength;
          reasoningParts.push('Golden cross (50 SMA > 200 SMA)');
          break;
        case 'death_cross':
          bearishScore += signal.strength;
          reasoningParts.push('Death cross (50 SMA < 200 SMA)');
          break;
        case 'volume_spike':
          // Volume spike direction based on price change
          if (quote.regularMarketChange > 0) {
            bullishScore += signal.strength * 0.5;
            reasoningParts.push(`High volume rally (${signal.value?.toFixed(1)}x avg)`);
          } else {
            bearishScore += signal.strength * 0.5;
            reasoningParts.push(`High volume selloff (${signal.value?.toFixed(1)}x avg)`);
          }
          break;
        case 'bollinger_squeeze':
          reasoningParts.push('Bollinger squeeze - breakout imminent');
          break;
        case 'breakout_high':
          bullishScore += signal.strength;
          reasoningParts.push(`Near 52-week high (${signal.value?.toFixed(1)}% away)`);
          break;
        case 'breakout_low':
          bullishScore += signal.strength * 0.7;  // Lower weight for bounces from lows
          reasoningParts.push(`Bouncing off 52-week low`);
          break;
      }
    }

    // Determine overall signal
    const netScore = bullishScore - bearishScore;
    let overallSignal: MomentumOpportunity['overallSignal'];
    let suggestedAction: string;

    if (netScore >= 150) {
      overallSignal = 'strong_buy';
      suggestedAction = 'Strong bullish momentum. Consider initiating position.';
    } else if (netScore >= 60) {
      overallSignal = 'buy';
      suggestedAction = 'Positive signals. Monitor for entry opportunity.';
    } else if (netScore <= -150) {
      overallSignal = 'strong_sell';
      suggestedAction = 'Strong bearish momentum. Consider reducing exposure or shorting.';
    } else if (netScore <= -60) {
      overallSignal = 'sell';
      suggestedAction = 'Negative signals. Consider taking profits or reducing position.';
    } else {
      overallSignal = 'neutral';
      suggestedAction = 'Mixed signals. Wait for clearer trend direction.';
    }

    // Calculate confidence based on signal agreement
    const totalSignals = signals.length;
    const signalAgreement = Math.abs(bullishScore - bearishScore) / (bullishScore + bearishScore + 1);
    const confidence = Math.min(100, Math.round(
      (signalAgreement * 50) + (totalSignals * 10) + (Math.abs(netScore) * 0.1)
    ));

    return {
      overallSignal,
      confidence,
      reasoning: reasoningParts.join('. ') + '.',
      suggestedAction,
    };
  }

  /**
   * Get top momentum opportunities
   */
  async getTopOpportunities(
    limit: number = 10,
    signalType?: 'bullish' | 'bearish'
  ): Promise<MomentumOpportunity[]> {
    const all = await this.scan();

    let filtered = all;
    if (signalType === 'bullish') {
      filtered = all.filter(o => o.overallSignal === 'buy' || o.overallSignal === 'strong_buy');
    } else if (signalType === 'bearish') {
      filtered = all.filter(o => o.overallSignal === 'sell' || o.overallSignal === 'strong_sell');
    }

    return filtered.slice(0, limit);
  }

  /**
   * Update scanner options
   */
  updateOptions(options: Partial<MomentumScannerOptions>): void {
    this.options = { ...this.options, ...options };
  }
}

export function createMomentumScanner(options?: MomentumScannerOptions): MomentumScanner {
  return new MomentumScanner(options);
}
