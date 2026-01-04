// ============================================
// HILLWAY ALPHA - Matched Betting Promotion Tracker
// Scans for and evaluates UK bookmaker promotions
// ============================================

import { v4 as uuidv4 } from "uuid";
import {
  Promotion,
  PromotionType,
  PromotionStatus,
  MatchedBettingOpportunity,
  BookmakerAccount,
  BookmakerInfo,
  BookmakerStatus,
} from "@/lib/types/scanner";

// ============================================
// UK Bookmaker Configuration
// ============================================

export const UK_BOOKMAKERS: BookmakerInfo[] = [
  {
    key: "bet365",
    name: "Bet365",
    signupUrl: "https://www.bet365.com",
    minDeposit: 5,
  },
  {
    key: "betfair",
    name: "Betfair",
    signupUrl: "https://www.betfair.com",
    minDeposit: 5,
    notes: "Exchange available",
  },
  {
    key: "paddypower",
    name: "Paddy Power",
    signupUrl: "https://www.paddypower.com",
    minDeposit: 5,
  },
  {
    key: "williamhill",
    name: "William Hill",
    signupUrl: "https://www.williamhill.com",
    minDeposit: 10,
  },
  {
    key: "ladbrokes",
    name: "Ladbrokes",
    signupUrl: "https://www.ladbrokes.com",
    minDeposit: 5,
  },
  {
    key: "coral",
    name: "Coral",
    signupUrl: "https://www.coral.co.uk",
    minDeposit: 5,
  },
  {
    key: "skybet",
    name: "Sky Bet",
    signupUrl: "https://www.skybet.com",
    minDeposit: 5,
  },
  {
    key: "betway",
    name: "Betway",
    signupUrl: "https://www.betway.com",
    minDeposit: 10,
  },
  {
    key: "888sport",
    name: "888sport",
    signupUrl: "https://www.888sport.com",
    minDeposit: 10,
  },
  {
    key: "unibet",
    name: "Unibet",
    signupUrl: "https://www.unibet.co.uk",
    minDeposit: 10,
  },
];

// ============================================
// Sample Promotions Database
// In production, this would come from web scraping or API
// ============================================

function getSamplePromotions(): Promotion[] {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return [
    // Sign-up offers
    {
      id: "bet365-signup",
      bookmaker: "Bet365",
      bookmakerKey: "bet365",
      type: "signup_bonus",
      title: "Bet £10 Get £30 in Free Bets",
      description:
        "New customers only. Deposit and bet £10 on any sport, get £30 in free bets.",
      value: 30,
      minOdds: 1.2,
      minDeposit: 10,
      wagerRequirement: 1,
      expiresAt: nextMonth,
      terms: [
        "New customers only",
        "Qualifying bet must be at odds of 1/5 or greater",
        "Free bets expire after 30 days",
        "Free bet stakes not returned",
      ],
      expectedValue: 25, // ~83% retention rate typical for free bets
      qualifyingLoss: 0.5, // Small loss on qualifying bet
      status: "available",
      isNewCustomer: true,
      lastUpdated: now,
    },
    {
      id: "betfair-signup",
      bookmaker: "Betfair",
      bookmakerKey: "betfair",
      type: "signup_bonus",
      title: "Get £20 in Free Bets When You Bet £5",
      description:
        "Place a £5 bet and receive £20 in free bets on the Sportsbook.",
      value: 20,
      minOdds: 2.0,
      minDeposit: 5,
      wagerRequirement: 1,
      expiresAt: nextMonth,
      terms: [
        "New customers only",
        "Min odds 2.0",
        "Free bet stakes not included in returns",
        "7 day expiry on free bets",
      ],
      expectedValue: 16,
      qualifyingLoss: 0.25,
      status: "available",
      isNewCustomer: true,
      lastUpdated: now,
    },
    {
      id: "paddypower-signup",
      bookmaker: "Paddy Power",
      bookmakerKey: "paddypower",
      type: "risk_free",
      title: "Money Back as Cash if Your First Bet Loses (up to £20)",
      description:
        "Place your first bet and if it loses, get your stake back as cash up to £20.",
      value: 20,
      minOdds: 1.5,
      minDeposit: 10,
      wagerRequirement: 0,
      expiresAt: nextMonth,
      terms: [
        "New customers only",
        "First single bet only",
        "Cash refund, not free bet",
        "Min odds evens (2.0)",
      ],
      expectedValue: 18, // Cash refund more valuable than free bet
      qualifyingLoss: 0,
      status: "available",
      isNewCustomer: true,
      lastUpdated: now,
    },
    {
      id: "williamhill-signup",
      bookmaker: "William Hill",
      bookmakerKey: "williamhill",
      type: "signup_bonus",
      title: "Bet £10 Get £40 in Free Bets",
      description:
        "Bet £10 at odds of 1/2 or greater and receive £40 in free bets.",
      value: 40,
      minOdds: 1.5,
      minDeposit: 10,
      wagerRequirement: 1,
      expiresAt: nextMonth,
      terms: [
        "New online customers only",
        "Min odds 1/2 (1.5)",
        "Free bets in 4x £10 denominations",
        "30 day expiry",
      ],
      expectedValue: 33,
      qualifyingLoss: 0.5,
      status: "available",
      isNewCustomer: true,
      lastUpdated: now,
    },
    {
      id: "skybet-signup",
      bookmaker: "Sky Bet",
      bookmakerKey: "skybet",
      type: "signup_bonus",
      title: "Bet £10 Get £30 in Free Bets",
      description: "Place a £10 bet and get £30 in free bets.",
      value: 30,
      minOdds: 1.5,
      minDeposit: 10,
      wagerRequirement: 1,
      expiresAt: nextMonth,
      terms: [
        "New customers only",
        "First single bet only",
        "Min odds 1/2 (1.5)",
        "30 day expiry",
      ],
      expectedValue: 25,
      qualifyingLoss: 0.5,
      status: "available",
      isNewCustomer: true,
      lastUpdated: now,
    },

    // Reload offers (for existing customers)
    {
      id: "bet365-acca-insurance",
      bookmaker: "Bet365",
      bookmakerKey: "bet365",
      type: "acca_insurance",
      title: "Acca Bonus - Get Up To 70% Extra Winnings",
      description:
        "Place a pre-match accumulator and receive up to 70% bonus on winnings.",
      value: 0, // Variable based on winnings
      minOdds: 1.2,
      terms: [
        "3+ selections required",
        "All selections must be pre-match",
        "Min odds 1/5 per selection",
        "Max bonus 100,000 credits",
      ],
      expectedValue: 5, // Average EV per acca
      status: "available",
      isNewCustomer: false,
      lastUpdated: now,
    },
    {
      id: "betfair-free-bet-club",
      bookmaker: "Betfair",
      bookmakerKey: "betfair",
      type: "free_bet",
      title: "Free Bet Club - Bet £20 Get £5 Weekly",
      description:
        "Place £20 in qualifying bets each week to receive a £5 free bet.",
      value: 5,
      minOdds: 1.5,
      wagerRequirement: 20,
      terms: [
        "Place 5x £4 bets at min odds 1.5",
        "Sunday to Saturday qualifying period",
        "Free bet credited Monday",
        "7 day expiry",
      ],
      expectedValue: 4,
      qualifyingLoss: 1,
      status: "available",
      isNewCustomer: false,
      lastUpdated: now,
    },
    {
      id: "ladbrokes-enhanced-odds",
      bookmaker: "Ladbrokes",
      bookmakerKey: "ladbrokes",
      type: "enhanced_odds",
      title: "Ladbrokes Boost - Enhanced Odds Daily",
      description: "One enhanced price boost per day on selected markets.",
      value: 10, // Max stake typically
      terms: [
        "One boost per customer per day",
        "Max stake applies",
        "Selected markets only",
        "Sportsbook only",
      ],
      expectedValue: 2,
      status: "available",
      isNewCustomer: false,
      lastUpdated: now,
    },
    {
      id: "coral-acca-insurance",
      bookmaker: "Coral",
      bookmakerKey: "coral",
      type: "acca_insurance",
      title: "Acca Insurance - Get Stake Back If One Leg Loses",
      description:
        "Place a 5+ fold accumulator and get your stake back as a free bet if one leg lets you down.",
      value: 0,
      minOdds: 1.2,
      terms: [
        "5+ selections required",
        "Only one leg can lose",
        "Stake returned as free bet",
        "Pre-match only",
      ],
      expectedValue: 3,
      status: "available",
      isNewCustomer: false,
      lastUpdated: now,
    },
    {
      id: "888sport-weekly",
      bookmaker: "888sport",
      bookmakerKey: "888sport",
      type: "free_bet",
      title: "£10 Weekly Free Bet",
      description:
        "Opt in and bet £25+ during the week to receive a £10 free bet.",
      value: 10,
      minOdds: 1.5,
      wagerRequirement: 25,
      expiresAt: nextWeek,
      terms: [
        "Must opt in",
        "Min £25 qualifying bets at 1.5+ odds",
        "Max one per week",
        "7 day free bet expiry",
      ],
      expectedValue: 8,
      qualifyingLoss: 1.25,
      status: "available",
      isNewCustomer: false,
      lastUpdated: now,
    },
  ];
}

// ============================================
// Matched Betting Calculator Functions
// ============================================

export interface LayCalculation {
  layStake: number;
  layLiability: number;
  qualifyingLoss: number;
  profitIfBackWins: number;
  profitIfLayWins: number;
}

/**
 * Calculate lay stake for matched betting
 * Formula: Lay Stake = (Back Stake × Back Odds) / (Lay Odds - Commission)
 */
export function calculateLayStake(
  backStake: number,
  backOdds: number,
  layOdds: number,
  commission: number = 0.02, // 2% Betfair commission
): LayCalculation {
  const effectiveLayOdds = layOdds - commission;
  const layStake = (backStake * backOdds) / effectiveLayOdds;
  const layLiability = layStake * (layOdds - 1);

  // Profit/loss calculations
  const profitIfBackWins = backStake * (backOdds - 1) - layLiability;
  const profitIfLayWins = layStake * (1 - commission) - backStake;

  // Qualifying loss is the average loss when matching
  const qualifyingLoss = Math.abs((profitIfBackWins + profitIfLayWins) / 2);

  return {
    layStake: Math.round(layStake * 100) / 100,
    layLiability: Math.round(layLiability * 100) / 100,
    qualifyingLoss: Math.round(qualifyingLoss * 100) / 100,
    profitIfBackWins: Math.round(profitIfBackWins * 100) / 100,
    profitIfLayWins: Math.round(profitIfLayWins * 100) / 100,
  };
}

/**
 * Calculate expected value of a free bet
 * Free bet stakes are typically not returned, so EV is lower than face value
 */
export function calculateFreeBetValue(
  freeBetAmount: number,
  expectedOdds: number = 4.0, // Typical odds used for free bets
  commission: number = 0.02,
): number {
  // Retention rate = (odds - 1) / odds - small margin for matching
  const retentionRate =
    ((expectedOdds - 1) / expectedOdds) * (1 - commission) - 0.02;
  return Math.round(freeBetAmount * retentionRate * 100) / 100;
}

/**
 * Calculate SNR (Stake Not Returned) free bet profit
 */
export function calculateSNRFreeBetProfit(
  freeBetStake: number,
  backOdds: number,
  layOdds: number,
  commission: number = 0.02,
): number {
  // For SNR free bets, we only win (backOdds - 1) × stake if back wins
  const layStake = (freeBetStake * (backOdds - 1)) / (layOdds - commission);
  const layLiability = layStake * (layOdds - 1);

  const profitIfBackWins = freeBetStake * (backOdds - 1) - layLiability;
  const profitIfLayWins = layStake * (1 - commission); // No back stake to lose

  // Average profit (should be close to equal if matched well)
  return Math.round(((profitIfBackWins + profitIfLayWins) / 2) * 100) / 100;
}

// ============================================
// Matched Betting Scanner
// ============================================

export interface MatchedBettingScannerOptions {
  includeSignupOffers?: boolean;
  includeReloadOffers?: boolean;
  minExpectedValue?: number;
  exchangeCommission?: number;
}

const DEFAULT_OPTIONS: Required<MatchedBettingScannerOptions> = {
  includeSignupOffers: true,
  includeReloadOffers: true,
  minExpectedValue: 0,
  exchangeCommission: 0.02,
};

export class MatchedBettingScanner {
  private options: Required<MatchedBettingScannerOptions>;
  private accounts: Map<string, BookmakerAccount>;

  constructor(options: MatchedBettingScannerOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.accounts = new Map();
  }

  /**
   * Load bookmaker accounts from database or initialize defaults
   */
  async loadAccounts(dbAccounts?: BookmakerAccount[]): Promise<void> {
    if (dbAccounts) {
      for (const account of dbAccounts) {
        this.accounts.set(account.bookmakerKey, account);
      }
    } else {
      // Initialize default accounts (not signed up)
      for (const bookie of UK_BOOKMAKERS) {
        this.accounts.set(bookie.key, {
          id: uuidv4(),
          bookmaker: bookie.name,
          bookmakerKey: bookie.key,
          status: "active" as BookmakerStatus,
          signedUp: false,
          lifetimeProfit: 0,
          pendingPromotions: [],
          claimedPromotions: [],
          lastUpdated: new Date(),
        });
      }
    }
  }

  /**
   * Mark a bookmaker as signed up
   */
  markAsSignedUp(bookmakerKey: string): void {
    const account = this.accounts.get(bookmakerKey);
    if (account) {
      account.signedUp = true;
      account.signupDate = new Date();
      account.lastUpdated = new Date();
    }
  }

  /**
   * Mark a promotion as claimed
   */
  markPromotionClaimed(bookmakerKey: string, promotionId: string): void {
    const account = this.accounts.get(bookmakerKey);
    if (account) {
      if (!account.claimedPromotions.includes(promotionId)) {
        account.claimedPromotions.push(promotionId);
      }
      // Remove from pending if present
      account.pendingPromotions = account.pendingPromotions.filter(
        (id) => id !== promotionId,
      );
      account.lastUpdated = new Date();
    }
  }

  /**
   * Get all available promotions (not yet claimed)
   */
  getAvailablePromotions(): Promotion[] {
    const allPromotions = getSamplePromotions();
    const now = new Date();

    return allPromotions.filter((promo) => {
      // Check if expired
      if (promo.expiresAt && promo.expiresAt < now) {
        return false;
      }

      // Check if already claimed
      const account = this.accounts.get(promo.bookmakerKey);
      if (account?.claimedPromotions.includes(promo.id)) {
        return false;
      }

      // Check if signup offer but already signed up
      if (promo.isNewCustomer && account?.signedUp) {
        return false;
      }

      // Check if reload offer but not signed up
      if (!promo.isNewCustomer && !account?.signedUp) {
        return false;
      }

      // Filter by options
      if (!this.options.includeSignupOffers && promo.isNewCustomer) {
        return false;
      }
      if (!this.options.includeReloadOffers && !promo.isNewCustomer) {
        return false;
      }

      // Check minimum EV
      if (promo.expectedValue < this.options.minExpectedValue) {
        return false;
      }

      return true;
    });
  }

  /**
   * Create matched betting opportunity from promotion
   */
  createOpportunity(promo: Promotion): MatchedBettingOpportunity {
    const commission = this.options.exchangeCommission;

    // Default lay odds assumption (would come from exchange in production)
    const typicalLayOdds = promo.minOdds ? promo.minOdds + 0.02 : 3.0;
    const typicalBackOdds = promo.minOdds || 3.0;
    const backStake = promo.minDeposit || 10;

    let expectedProfit = promo.expectedValue;
    let steps: string[] = [];
    let strategy: "matched_bet" | "risk_free" | "arb_unlock" = "matched_bet";
    let riskLevel: "low" | "medium" | "high" = "low";
    let requirements = {
      backStake,
      layStake: 0,
      layOdds: typicalLayOdds,
      layCommission: commission,
      exchange: "Betfair Exchange",
    };

    // Generate strategy based on promotion type
    switch (promo.type) {
      case "signup_bonus":
      case "free_bet":
        // Calculate lay stake for qualifying bet
        const layCalc = calculateLayStake(
          backStake,
          typicalBackOdds,
          typicalLayOdds,
          commission,
        );
        requirements.layStake = layCalc.layStake;

        // Calculate free bet profit
        const freeBetProfit = calculateSNRFreeBetProfit(
          promo.value,
          4.0,
          4.02,
          commission,
        );
        expectedProfit = freeBetProfit - layCalc.qualifyingLoss;

        steps = [
          `1. Sign up at ${promo.bookmaker} using the offer link`,
          `2. Deposit £${promo.minDeposit || 10} minimum`,
          `3. Find a market with back odds ~${typicalBackOdds.toFixed(2)} at ${promo.bookmaker}`,
          `4. Check Betfair Exchange for similar lay odds`,
          `5. Place £${backStake} back bet at ${promo.bookmaker}`,
          `6. Place £${layCalc.layStake.toFixed(2)} lay bet on Betfair (liability: £${layCalc.layLiability.toFixed(2)})`,
          `7. Wait for bet to settle - you'll make small qualifying loss of ~£${layCalc.qualifyingLoss.toFixed(2)}`,
          `8. When free bet arrives, use at high odds (4.0+) and lay off`,
          `9. Expected profit from free bet: £${freeBetProfit.toFixed(2)}`,
        ];
        strategy = "matched_bet";
        break;

      case "risk_free":
        steps = [
          `1. Sign up at ${promo.bookmaker}`,
          `2. Deposit £${promo.minDeposit || 10}`,
          `3. Place first bet at odds ${promo.minOdds?.toFixed(2) || "2.0"}+`,
          `4. Do NOT lay this bet (risk-free offers are better unmatched)`,
          `5. If bet wins: collect winnings`,
          `6. If bet loses: receive cash refund up to £${promo.value}`,
          `7. Expected value: £${promo.expectedValue.toFixed(2)}`,
        ];
        strategy = "risk_free";
        riskLevel = "medium"; // Some variance as unmatched
        break;

      case "enhanced_odds":
        steps = [
          `1. Find today's enhanced odds offer at ${promo.bookmaker}`,
          `2. Check if lay odds are available on exchange`,
          `3. If arb exists: back enhanced price, lay on exchange`,
          `4. If no arb: consider small stake for +EV`,
          `5. Note: Max stake limits often apply (£10-£50)`,
        ];
        strategy = "arb_unlock";
        riskLevel = "low";
        break;

      case "acca_insurance":
        steps = [
          `1. Build 5+ selection accumulator at ${promo.bookmaker}`,
          `2. Each leg must meet minimum odds (usually 1.2)`,
          `3. If 4/5 win, receive stake back as free bet`,
          `4. Small positive EV but requires larger variance`,
          `5. Consider smaller stakes to manage risk`,
        ];
        strategy = "matched_bet";
        riskLevel = "high"; // High variance
        break;

      case "reload_bonus":
        const reloadLayCalc = calculateLayStake(
          promo.wagerRequirement || 20,
          typicalBackOdds,
          typicalLayOdds,
          commission,
        );
        requirements.layStake = reloadLayCalc.layStake;
        requirements.backStake = promo.wagerRequirement || 20;

        expectedProfit =
          calculateFreeBetValue(promo.value) - reloadLayCalc.qualifyingLoss;

        steps = [
          `1. Opt into the ${promo.bookmaker} offer`,
          `2. Place qualifying bets totaling £${promo.wagerRequirement || 20}`,
          `3. Match each bet on exchange`,
          `4. Qualifying loss: ~£${reloadLayCalc.qualifyingLoss.toFixed(2)}`,
          `5. Receive £${promo.value} free bet when qualified`,
          `6. Use free bet at high odds and lay off`,
        ];
        strategy = "matched_bet";
        break;

      default:
        steps = [
          `1. Check offer terms at ${promo.bookmaker}`,
          `2. Evaluate if matched betting approach works`,
          `3. Calculate lay stakes if applicable`,
        ];
    }

    const profitRate =
      (expectedProfit /
        (requirements.backStake + (requirements.layStake || 0))) *
      100;

    return {
      id: uuidv4(),
      promotion: promo,
      strategy,
      expectedProfit: Math.round(expectedProfit * 100) / 100,
      profitRate: Math.round(profitRate * 100) / 100,
      confidence: this.calculateConfidence(promo),
      steps,
      requirements,
      riskLevel,
      timeToComplete: this.estimateTimeToComplete(promo),
      notes: promo.isNewCustomer
        ? "New customer offer - can only be claimed once"
        : "Reload offer - may be available weekly/monthly",
    };
  }

  /**
   * Calculate confidence score for an opportunity
   */
  private calculateConfidence(promo: Promotion): number {
    let confidence = 70;

    // Higher value = higher confidence (more room for error)
    if (promo.expectedValue >= 30) confidence += 15;
    else if (promo.expectedValue >= 20) confidence += 10;
    else if (promo.expectedValue >= 10) confidence += 5;

    // Sign-up offers are more reliable
    if (promo.isNewCustomer) confidence += 10;

    // No wagering requirement is better
    if (promo.wagerRequirement === 0) confidence += 5;

    // Risk-free offers are highest confidence
    if (promo.type === "risk_free") confidence += 10;

    // Acca insurance has high variance
    if (promo.type === "acca_insurance") confidence -= 20;

    return Math.min(100, Math.max(0, confidence));
  }

  /**
   * Estimate time to complete offer in minutes
   */
  private estimateTimeToComplete(promo: Promotion): number {
    let time = 15; // Base time for any offer

    if (promo.isNewCustomer) {
      time += 15; // Account creation
    }

    if (promo.type === "acca_insurance") {
      time += 30; // More complex selection
    }

    if (promo.wagerRequirement && promo.wagerRequirement > 20) {
      time += 15; // Multiple qualifying bets
    }

    return time;
  }

  /**
   * Scan for all available opportunities
   */
  async scan(): Promise<MatchedBettingOpportunity[]> {
    const promotions = this.getAvailablePromotions();
    const opportunities = promotions.map((promo) =>
      this.createOpportunity(promo),
    );

    // Sort by expected profit (highest first)
    return opportunities.sort((a, b) => b.expectedProfit - a.expectedProfit);
  }

  /**
   * Get top opportunities by expected value
   */
  async getTopOpportunities(
    limit: number = 10,
  ): Promise<MatchedBettingOpportunity[]> {
    const all = await this.scan();
    return all.slice(0, limit);
  }

  /**
   * Get only new customer sign-up opportunities
   */
  async getSignupOpportunities(): Promise<MatchedBettingOpportunity[]> {
    const all = await this.scan();
    return all.filter((opp) => opp.promotion.isNewCustomer);
  }

  /**
   * Get only reload/existing customer opportunities
   */
  async getReloadOpportunities(): Promise<MatchedBettingOpportunity[]> {
    const all = await this.scan();
    return all.filter((opp) => !opp.promotion.isNewCustomer);
  }

  /**
   * Get bookmaker account status
   */
  getAccountStatus(bookmakerKey: string): BookmakerAccount | undefined {
    return this.accounts.get(bookmakerKey);
  }

  /**
   * Get all bookmaker accounts
   */
  getAllAccounts(): BookmakerAccount[] {
    return Array.from(this.accounts.values());
  }

  /**
   * Get summary statistics
   */
  getSummary(): {
    totalBookmakers: number;
    signedUp: number;
    availableOffers: number;
    totalPotentialEV: number;
    signupOffersRemaining: number;
    reloadOffersAvailable: number;
  } {
    const promotions = this.getAvailablePromotions();
    const accounts = Array.from(this.accounts.values());

    return {
      totalBookmakers: UK_BOOKMAKERS.length,
      signedUp: accounts.filter((a) => a.signedUp).length,
      availableOffers: promotions.length,
      totalPotentialEV: promotions.reduce((sum, p) => sum + p.expectedValue, 0),
      signupOffersRemaining: promotions.filter((p) => p.isNewCustomer).length,
      reloadOffersAvailable: promotions.filter((p) => !p.isNewCustomer).length,
    };
  }
}

/**
 * Create a configured matched betting scanner
 */
export function createMatchedBettingScanner(
  options?: MatchedBettingScannerOptions,
): MatchedBettingScanner {
  return new MatchedBettingScanner(options);
}
