// ============================================
// HILLWAY ALPHA - Financial Calculations
// ============================================

/**
 * Convert decimal odds to implied probability
 * Example: 2.0 odds = 50% implied probability
 */
export function oddsToImpliedProbability(decimalOdds: number): number {
  if (decimalOdds <= 1) return 1;
  return 1 / decimalOdds;
}

/**
 * Convert implied probability to decimal odds
 */
export function impliedProbabilityToOdds(probability: number): number {
  if (probability <= 0 || probability >= 1) {
    throw new Error('Probability must be between 0 and 1');
  }
  return 1 / probability;
}

/**
 * Calculate the total implied probability from a set of best odds
 * If < 1.0, arbitrage exists
 */
export function calculateTotalImpliedProbability(
  oddsArray: number[]
): number {
  return oddsArray.reduce((sum, odds) => sum + oddsToImpliedProbability(odds), 0);
}

/**
 * Calculate arbitrage margin (profit percentage)
 * Margin = (1 - sum of implied probabilities) * 100
 */
export function calculateArbitrageMargin(oddsArray: number[]): number {
  const totalImplied = calculateTotalImpliedProbability(oddsArray);
  if (totalImplied >= 1) return 0; // No arbitrage
  return (1 - totalImplied) * 100;
}

/**
 * Calculate optimal stake distribution for arbitrage
 * Returns stakes that guarantee equal profit regardless of outcome
 */
export function calculateArbitrageStakes(
  oddsArray: number[],
  totalStake: number
): { stakes: number[]; profit: number; returnAmount: number } {
  const totalImplied = calculateTotalImpliedProbability(oddsArray);

  if (totalImplied >= 1) {
    throw new Error('No arbitrage opportunity exists');
  }

  // Calculate individual stakes
  // Stake for outcome i = (totalStake / totalImplied) * impliedProbability_i
  const stakes = oddsArray.map(odds => {
    const impliedProb = oddsToImpliedProbability(odds);
    return (totalStake / totalImplied) * impliedProb;
  });

  // All outcomes should return the same amount
  const returnAmount = stakes[0] * oddsArray[0];
  const profit = returnAmount - totalStake;

  return {
    stakes: stakes.map(s => Math.round(s * 100) / 100), // Round to 2 decimal places
    profit: Math.round(profit * 100) / 100,
    returnAmount: Math.round(returnAmount * 100) / 100,
  };
}

/**
 * Kelly Criterion - calculate optimal bet size
 * f* = (bp - q) / b
 * where:
 *   b = decimal odds - 1 (net odds)
 *   p = probability of winning
 *   q = probability of losing (1 - p)
 */
export function kellyFraction(
  winProbability: number,
  decimalOdds: number
): number {
  const b = decimalOdds - 1; // Net odds
  const p = winProbability;
  const q = 1 - p;

  const kelly = (b * p - q) / b;
  return Math.max(0, kelly); // Never negative
}

/**
 * Calculate suggested stake using fractional Kelly
 */
export function calculateKellyStake(
  winProbability: number,
  decimalOdds: number,
  bankroll: number,
  kellyFractionMultiplier: number = 0.25 // Use 25% Kelly by default
): number {
  const fullKelly = kellyFraction(winProbability, decimalOdds);
  const fractionalKelly = fullKelly * kellyFractionMultiplier;

  // Cap at 5% of bankroll as safety
  const maxBet = bankroll * 0.05;
  const suggestedBet = bankroll * fractionalKelly;

  return Math.min(suggestedBet, maxBet);
}

/**
 * Calculate Expected Value
 * EV = (probability * potential_win) - ((1 - probability) * stake)
 */
export function calculateExpectedValue(
  probability: number,
  decimalOdds: number,
  stake: number = 1
): number {
  const potentialWin = stake * (decimalOdds - 1);
  const ev = probability * potentialWin - (1 - probability) * stake;
  return ev;
}

/**
 * Calculate EV as a percentage
 */
export function calculateExpectedValuePercent(
  probability: number,
  decimalOdds: number
): number {
  const ev = calculateExpectedValue(probability, decimalOdds, 1);
  return ev * 100;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = '£'): string {
  return `${currency}${amount.toFixed(2)}`;
}

/**
 * Format percentage for display
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate hours until a given date
 */
export function hoursUntil(date: Date): number {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  return diffMs / (1000 * 60 * 60);
}
