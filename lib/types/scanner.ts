// ============================================
// HILLWAY ALPHA - Core Type Definitions
// ============================================

import { z } from "zod";

// Opportunity Categories
export type OpportunityCategory =
  | "arbitrage"
  | "value_bet"
  | "stock"
  | "crypto";
export type OpportunitySubcategory =
  | "arbitrage"
  | "value_bet"
  | "matched_betting" // betting
  | "momentum"
  | "earnings"
  | "options"
  | "dividend" // stocks
  | "funding_rate"
  | "spread"
  | "yield"
  | "whale"
  | "sentiment"; // crypto

export type OpportunityStatus = "open" | "taken" | "expired" | "passed";
export type PositionStatus = "open" | "closed" | "stopped";

// ============================================
// Betting Types
// ============================================

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
}

export interface OddsOutcome {
  name: string;
  price: number; // decimal odds
}

export interface OddsMarket {
  key: string; // 'h2h', 'spreads', 'totals'
  outcomes: OddsOutcome[];
}

export interface OddsApiEvent {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: {
    key: string;
    title: string;
    last_update: string;
    markets: OddsMarket[];
  }[];
}

export interface BestOddsOutcome {
  outcome: string; // 'home', 'away', 'draw'
  team: string;
  odds: number;
  bookmaker: string;
  impliedProbability: number;
}

export interface StakeAllocation {
  outcome: string;
  team: string;
  bookmaker: string;
  odds: number;
  stake: number;
  potentialReturn: number;
}

export interface ArbitrageOpportunity {
  id: string;
  eventId: string;
  event: string;
  homeTeam: string;
  awayTeam: string;
  sport: string;
  sportTitle: string;
  commenceTime: Date;
  margin: number; // Profit percentage
  totalImpliedProbability: number;
  stakes: StakeAllocation[];
  totalStake: number;
  guaranteedProfit: number;
  guaranteedReturn: number;
  hoursUntilStart: number;
  createdAt: Date;
}

export interface ValueBetOpportunity {
  id: string;
  event: string;
  selection: string;
  bookmaker: string;
  bookmakerOdds: number;
  impliedProbability: number;
  modelProbability: number;
  expectedValue: number; // +EV%
  confidence: number;
  suggestedStake: number;
  sport: string;
  commenceTime: Date;
}

// ============================================
// Matched Betting Types
// ============================================

export type PromotionType =
  | "signup_bonus" // New customer sign-up offers
  | "free_bet" // Free bet tokens
  | "enhanced_odds" // Boosted odds promotions
  | "acca_insurance" // Acca/parlay insurance
  | "risk_free" // Risk-free bet promotions
  | "reload_bonus" // Deposit bonus for existing customers
  | "cashback" // Money back specials
  | "loyalty" // VIP/loyalty rewards
  | "refer_friend"; // Referral bonuses

export type PromotionStatus =
  | "available" // Can be claimed
  | "claimed" // Already used
  | "expired" // Past expiry date
  | "restricted"; // Account restricted from promo

export type BookmakerStatus =
  | "active" // Full account access
  | "restricted" // Limited stakes/markets
  | "gubbed" // Heavily restricted
  | "closed"; // Account closed

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
}

export interface BookmakerInfo {
  key: string;
  name: string;
  signupUrl: string;
  minDeposit: number;
  notes?: string;
}

export interface Promotion {
  id: string;
  bookmaker: string;
  bookmakerKey: string;
  type: PromotionType;
  title: string;
  description: string;
  value: number; // Face value of the promotion
  minOdds?: number; // Minimum odds requirement
  minDeposit?: number; // Minimum deposit required
  wagerRequirement?: number; // e.g., 3x means bet 3x the bonus
  expiresAt?: Date;
  terms: string[];
  expectedValue: number; // Calculated expected profit
  qualifyingLoss?: number; // Max loss to unlock the bonus
  status: PromotionStatus;
  isNewCustomer: boolean; // Sign-up offer vs reload
  lastUpdated: Date;
}

export interface MatchedBettingOpportunity {
  id: string;
  promotion: Promotion;
  strategy: "matched_bet" | "risk_free" | "arb_unlock";
  expectedProfit: number;
  profitRate: number; // Profit as % of stake/deposit
  confidence: number;
  steps: string[];
  requirements: {
    backStake: number;
    layStake?: number;
    layOdds?: number;
    layCommission?: number;
    exchange?: string;
  };
  riskLevel: "low" | "medium" | "high";
  timeToComplete: number; // Estimated minutes
  notes?: string;
}

export interface BookmakerAccount {
  id: string;
  bookmaker: string;
  bookmakerKey: string;
  status: BookmakerStatus;
  signedUp: boolean;
  signupDate?: Date;
  lifetimeProfit: number;
  pendingPromotions: string[]; // Promotion IDs
  claimedPromotions: string[]; // Promotion IDs
  notes?: string;
  lastUpdated: Date;
}

// ============================================
// Stock Types
// ============================================

export interface StockOpportunity {
  id: string;
  ticker: string;
  companyName: string;
  subcategory: OpportunitySubcategory;
  signal: string;
  currentPrice: number;
  targetPrice?: number;
  stopLoss?: number;
  confidence: number;
  expectedValue?: number;
  data: Record<string, unknown>;
}

// ============================================
// Crypto Types
// ============================================

export interface FundingRateOpportunity {
  id: string;
  asset: string;
  exchange: string;
  fundingRate: number; // Per 8 hours
  annualizedRate: number;
  direction: "long" | "short";
  confidence: number;
  suggestedSize: number;
}

export interface SpreadOpportunity {
  id: string;
  asset: string;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  spreadPercent: number;
  estimatedProfit: number;
  gasCost?: number;
}

// ============================================
// Database Types
// ============================================

export interface DbOpportunity {
  id: string;
  created_at: string;
  category: OpportunityCategory;
  subcategory: OpportunitySubcategory | null;
  title: string;
  description: string | null;
  confidence_score: number | null;
  expected_value: number | null;
  data: Record<string, unknown>;
  expires_at: string | null;
  status: OpportunityStatus;
}

export interface DbPosition {
  id: string;
  opportunity_id: string | null;
  opened_at: string;
  closed_at: string | null;
  entry_price: number | null;
  exit_price: number | null;
  stake_amount: number | null;
  asset_class: string | null;
  status: PositionStatus;
  pnl: number | null;
  notes: string | null;
}

export interface DbBriefing {
  id: string;
  created_at: string;
  date: string;
  content: string;
  opportunities_included: string[];
  sent_via: string[];
}

export interface DbDailyMetrics {
  date: string;
  total_opportunities: number;
  opportunities_taken: number;
  wins: number;
  losses: number;
  gross_pnl: number;
  by_category: Record<string, unknown>;
}

export interface DbBankroll {
  id: string;
  asset_class: string;
  current_balance: number;
  initial_balance: number;
  last_updated: string;
}

export interface DbBookmakerAccount {
  id: string;
  bookmaker: string;
  status: "active" | "restricted" | "gubbed" | "closed";
  lifetime_profit: number;
  pending_promotions: Record<string, unknown> | null;
  notes: string | null;
}

// ============================================
// Confidence Scoring
// ============================================

export interface ConfidenceFactors {
  dataQuality: number; // 0-100: How complete/recent is the data
  historicalAccuracy: number; // 0-100: How similar signals performed
  edgeSize: number; // 0-100: Magnitude of expected value
  liquidity: number; // 0-100: Can position be executed
  timeSensitivity: number; // 0-100: How long opportunity persists
  correlationRisk: number; // 0-100: Independence from other positions
}

export interface ConfidenceScore {
  overall: number;
  factors: ConfidenceFactors;
  breakdown: string;
}

// ============================================
// Briefing Types
// ============================================

export interface DailyBriefing {
  date: Date;
  marketContext: string;
  topOpportunities: RankedOpportunity[];
  watchlist: RankedOpportunity[];
  yesterdayResults: ResultsSummary;
  aiInsight: string;
}

export interface RankedOpportunity {
  rank: number;
  opportunity: DbOpportunity;
  confidence: number;
  expectedValue: number;
  suggestedStake: number;
  actionWindow: string;
  reasoning: string;
}

export interface ResultsSummary {
  totalPnL: number;
  winRate: number;
  recommendationAccuracy: number;
  byCategory: Record<string, { pnl: number; count: number }>;
}

// ============================================
// Config Types
// ============================================

export const ConfigSchema = z.object({
  bettingBankroll: z.number().positive(),
  stocksBankroll: z.number().positive(),
  cryptoBankroll: z.number().positive(),
  kellyFraction: z.number().min(0.1).max(1),
  minArbitrageMargin: z.number().min(0).max(10),
  minConfidenceScore: z.number().min(0).max(100),
});

export type Config = z.infer<typeof ConfigSchema>;

export const DEFAULT_CONFIG: Config = {
  bettingBankroll: 1000,
  stocksBankroll: 5000,
  cryptoBankroll: 2000,
  kellyFraction: 0.25,
  minArbitrageMargin: 1.0,
  minConfidenceScore: 60,
};
