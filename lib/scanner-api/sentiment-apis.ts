// ============================================
// HILLWAY ALPHA - Sentiment API Clients
// Fear & Greed Index and market sentiment
// ============================================

import axios from 'axios';

export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update?: string;
}

export interface FearGreedResponse {
  name: string;
  data: FearGreedData[];
  metadata: {
    error: string | null;
  };
}

export interface SentimentReading {
  value: number;
  classification: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
  timestamp: Date;
  signal: 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell';
  signalStrength: number; // 0-100
}

/**
 * Fetch Fear & Greed Index from Alternative.me
 */
export async function fetchFearGreedIndex(days: number = 30): Promise<FearGreedData[]> {
  try {
    const response = await axios.get<FearGreedResponse>(
      `https://api.alternative.me/fng/?limit=${days}&format=json`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Fear & Greed Index:', error);
    return [];
  }
}

/**
 * Get current Fear & Greed reading with signal
 */
export async function getCurrentSentiment(): Promise<SentimentReading | null> {
  try {
    const data = await fetchFearGreedIndex(1);
    if (data.length === 0) return null;

    const current = data[0];
    const value = parseInt(current.value, 10);

    return {
      value,
      classification: current.value_classification as SentimentReading['classification'],
      timestamp: new Date(parseInt(current.timestamp, 10) * 1000),
      signal: calculateSignal(value),
      signalStrength: calculateSignalStrength(value),
    };
  } catch (error) {
    console.error('Error getting current sentiment:', error);
    return null;
  }
}

/**
 * Calculate trading signal from Fear & Greed value
 * Contrarian approach: Buy fear, sell greed
 */
function calculateSignal(value: number): SentimentReading['signal'] {
  if (value <= 20) return 'strong_buy';
  if (value <= 40) return 'buy';
  if (value >= 80) return 'strong_sell';
  if (value >= 60) return 'sell';
  return 'neutral';
}

/**
 * Calculate signal strength (how extreme the reading is)
 */
function calculateSignalStrength(value: number): number {
  // Distance from neutral (50)
  const distanceFromNeutral = Math.abs(value - 50);
  // Scale to 0-100
  return Math.min(100, distanceFromNeutral * 2);
}

/**
 * Analyze trend in Fear & Greed over time
 */
export async function analyzeSentimentTrend(days: number = 7): Promise<{
  current: number;
  average: number;
  trend: 'improving' | 'worsening' | 'stable';
  momentum: number;
}> {
  const data = await fetchFearGreedIndex(days);

  if (data.length < 2) {
    return { current: 50, average: 50, trend: 'stable', momentum: 0 };
  }

  const values = data.map(d => parseInt(d.value, 10));
  const current = values[0];
  const average = values.reduce((a, b) => a + b, 0) / values.length;

  // Calculate momentum (rate of change)
  const recentAvg = values.slice(0, Math.ceil(values.length / 2)).reduce((a, b) => a + b, 0) / Math.ceil(values.length / 2);
  const olderAvg = values.slice(Math.ceil(values.length / 2)).reduce((a, b) => a + b, 0) / Math.floor(values.length / 2);
  const momentum = recentAvg - olderAvg;

  let trend: 'improving' | 'worsening' | 'stable' = 'stable';
  if (momentum > 5) trend = 'improving';
  else if (momentum < -5) trend = 'worsening';

  return { current, average, trend, momentum };
}
