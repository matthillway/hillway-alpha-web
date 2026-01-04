// ============================================
// HILLWAY ALPHA - Technical Indicators
// RSI, MACD, Moving Averages, Bollinger Bands
// ============================================

/**
 * Calculate Simple Moving Average (SMA)
 */
export function sma(prices: number[], period: number): number[] {
  const result: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
      continue;
    }

    const slice = prices.slice(i - period + 1, i + 1);
    const avg = slice.reduce((a, b) => a + b, 0) / period;
    result.push(avg);
  }

  return result;
}

/**
 * Calculate Exponential Moving Average (EMA)
 */
export function ema(prices: number[], period: number): number[] {
  const result: number[] = [];
  const multiplier = 2 / (period + 1);

  for (let i = 0; i < prices.length; i++) {
    if (i === 0) {
      result.push(prices[0]);
    } else if (i < period - 1) {
      // Use SMA for initial values
      const slice = prices.slice(0, i + 1);
      result.push(slice.reduce((a, b) => a + b, 0) / slice.length);
    } else if (i === period - 1) {
      // First EMA is SMA
      const slice = prices.slice(0, period);
      result.push(slice.reduce((a, b) => a + b, 0) / period);
    } else {
      // EMA = (Close - Previous EMA) * multiplier + Previous EMA
      const emaValue = (prices[i] - result[i - 1]) * multiplier + result[i - 1];
      result.push(emaValue);
    }
  }

  return result;
}

/**
 * Calculate Relative Strength Index (RSI)
 */
export function rsi(prices: number[], period: number = 14): number[] {
  const result: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  // Calculate price changes
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  // First value is NaN
  result.push(NaN);

  for (let i = 0; i < gains.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
      continue;
    }

    let avgGain: number;
    let avgLoss: number;

    if (i === period - 1) {
      // First RSI - simple average
      avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
      avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
    } else {
      // Subsequent RSI - smoothed average
      const prevRsi = result[result.length - 1];
      // Reverse engineer previous avg gain/loss (approximation)
      const prevAvgGain = gains.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
      const prevAvgLoss = losses.slice(i - period, i).reduce((a, b) => a + b, 0) / period;

      avgGain = (prevAvgGain * (period - 1) + gains[i]) / period;
      avgLoss = (prevAvgLoss * (period - 1) + losses[i]) / period;
    }

    if (avgLoss === 0) {
      result.push(100);
    } else {
      const rs = avgGain / avgLoss;
      const rsiValue = 100 - (100 / (1 + rs));
      result.push(rsiValue);
    }
  }

  return result;
}

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 */
export function macd(
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { macd: number[]; signal: number[]; histogram: number[] } {
  const fastEma = ema(prices, fastPeriod);
  const slowEma = ema(prices, slowPeriod);

  // MACD Line = Fast EMA - Slow EMA
  const macdLine = fastEma.map((fast, i) => fast - slowEma[i]);

  // Signal Line = EMA of MACD Line
  const signalLine = ema(macdLine.filter(v => !isNaN(v)), signalPeriod);

  // Pad signal line to match length
  const paddedSignal = Array(macdLine.length - signalLine.length).fill(NaN).concat(signalLine);

  // Histogram = MACD Line - Signal Line
  const histogram = macdLine.map((m, i) => m - paddedSignal[i]);

  return {
    macd: macdLine,
    signal: paddedSignal,
    histogram,
  };
}

/**
 * Calculate Bollinger Bands
 */
export function bollingerBands(
  prices: number[],
  period: number = 20,
  stdDev: number = 2
): { upper: number[]; middle: number[]; lower: number[]; bandwidth: number[] } {
  const middle = sma(prices, period);
  const upper: number[] = [];
  const lower: number[] = [];
  const bandwidth: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
      bandwidth.push(NaN);
      continue;
    }

    const slice = prices.slice(i - period + 1, i + 1);
    const avg = middle[i];

    // Calculate standard deviation
    const squaredDiffs = slice.map(p => Math.pow(p - avg, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
    const sd = Math.sqrt(variance);

    upper.push(avg + stdDev * sd);
    lower.push(avg - stdDev * sd);
    bandwidth.push((upper[i] - lower[i]) / middle[i] * 100); // As percentage
  }

  return { upper, middle, lower, bandwidth };
}

/**
 * Detect golden cross (50 SMA crosses above 200 SMA)
 */
export function detectGoldenCross(prices: number[]): boolean {
  if (prices.length < 201) return false;

  const sma50 = sma(prices, 50);
  const sma200 = sma(prices, 200);

  const current50 = sma50[sma50.length - 1];
  const current200 = sma200[sma200.length - 1];
  const prev50 = sma50[sma50.length - 2];
  const prev200 = sma200[sma200.length - 2];

  // Cross happened if prev50 <= prev200 and current50 > current200
  return prev50 <= prev200 && current50 > current200;
}

/**
 * Detect death cross (50 SMA crosses below 200 SMA)
 */
export function detectDeathCross(prices: number[]): boolean {
  if (prices.length < 201) return false;

  const sma50 = sma(prices, 50);
  const sma200 = sma(prices, 200);

  const current50 = sma50[sma50.length - 1];
  const current200 = sma200[sma200.length - 1];
  const prev50 = sma50[sma50.length - 2];
  const prev200 = sma200[sma200.length - 2];

  return prev50 >= prev200 && current50 < current200;
}

/**
 * Check if RSI indicates oversold
 */
export function isOversold(rsiValues: number[], threshold: number = 30): boolean {
  const current = rsiValues[rsiValues.length - 1];
  return !isNaN(current) && current < threshold;
}

/**
 * Check if RSI indicates overbought
 */
export function isOverbought(rsiValues: number[], threshold: number = 70): boolean {
  const current = rsiValues[rsiValues.length - 1];
  return !isNaN(current) && current > threshold;
}

/**
 * Detect MACD bullish crossover
 */
export function isMacdBullish(macdData: { macd: number[]; signal: number[] }): boolean {
  const len = macdData.macd.length;
  if (len < 2) return false;

  const currentMacd = macdData.macd[len - 1];
  const currentSignal = macdData.signal[len - 1];
  const prevMacd = macdData.macd[len - 2];
  const prevSignal = macdData.signal[len - 2];

  return prevMacd <= prevSignal && currentMacd > currentSignal;
}

/**
 * Detect MACD bearish crossover
 */
export function isMacdBearish(macdData: { macd: number[]; signal: number[] }): boolean {
  const len = macdData.macd.length;
  if (len < 2) return false;

  const currentMacd = macdData.macd[len - 1];
  const currentSignal = macdData.signal[len - 1];
  const prevMacd = macdData.macd[len - 2];
  const prevSignal = macdData.signal[len - 2];

  return prevMacd >= prevSignal && currentMacd < currentSignal;
}
