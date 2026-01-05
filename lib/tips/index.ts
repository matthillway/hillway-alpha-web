// =============================================================================
// Tips & Guidance System for Hillway Alpha
// Provides actionable advice for executing opportunities
// =============================================================================

export type OpportunityCategory =
  | "arbitrage"
  | "value_bet"
  | "stock"
  | "crypto";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type MarketCondition = "normal" | "volatile" | "trending" | "quiet";

// =============================================================================
// Tip Types
// =============================================================================

export interface Tip {
  id: string;
  title: string;
  content: string;
  category: OpportunityCategory | "general";
  level: ExperienceLevel;
  isQuickTip: boolean;
  tags: string[];
}

export interface ExecutionStep {
  step: number;
  title: string;
  description: string;
  platform?: string;
  warning?: string;
  tip?: string;
}

export interface RiskWarning {
  level: "info" | "warning" | "danger";
  title: string;
  message: string;
}

export interface CategoryGuidance {
  category: OpportunityCategory;
  overview: string;
  executionSteps: ExecutionStep[];
  riskWarnings: RiskWarning[];
  moneyManagement: string[];
  platformInstructions: Record<string, string[]>;
  commonMistakes: string[];
  proTips: string[];
}

// =============================================================================
// Daily Tips - Tip of the Day
// =============================================================================

export const dailyTips: Tip[] = [
  // Arbitrage Tips
  {
    id: "arb-speed",
    title: "Speed is Everything in Arbitrage",
    content:
      "Arbitrage opportunities disappear within minutes. Have all your bookmaker accounts open in separate tabs and funds ready before scanning.",
    category: "arbitrage",
    level: "beginner",
    isQuickTip: true,
    tags: ["arbitrage", "execution", "speed"],
  },
  {
    id: "arb-accounts",
    title: "Maintain Multiple Bookmaker Accounts",
    content:
      "The more bookmaker accounts you have funded, the more arbitrage opportunities you can capture. Aim for at least 5-10 accounts.",
    category: "arbitrage",
    level: "beginner",
    isQuickTip: true,
    tags: ["arbitrage", "setup", "accounts"],
  },
  {
    id: "arb-stake-rounding",
    title: "Round Your Stakes Naturally",
    content:
      "Instead of betting exactly £47.23, round to £47 or £50. Unusual stake amounts can flag your account for gubbing (account restrictions).",
    category: "arbitrage",
    level: "intermediate",
    isQuickTip: true,
    tags: ["arbitrage", "stealth", "accounts"],
  },
  {
    id: "arb-verify-odds",
    title: "Always Verify Odds Before Placing",
    content:
      "Odds can change between scan and execution. Always verify both odds still exist before placing your bets. One wrong bet ruins the arbitrage.",
    category: "arbitrage",
    level: "beginner",
    isQuickTip: true,
    tags: ["arbitrage", "verification", "risk"],
  },
  {
    id: "arb-track-profits",
    title: "Track Every Arbitrage Bet",
    content:
      "Keep a spreadsheet tracking every arb: stakes, odds, profit, and bookmakers used. This helps identify your most profitable sources and track account health.",
    category: "arbitrage",
    level: "intermediate",
    isQuickTip: true,
    tags: ["arbitrage", "tracking", "analysis"],
  },

  // Stock Tips
  {
    id: "stock-stop-loss",
    title: "Always Set a Stop-Loss",
    content:
      "Before entering any stock trade, determine your exit point. Set a stop-loss at 5-10% below entry to protect capital. Never remove a stop-loss once set.",
    category: "stock",
    level: "beginner",
    isQuickTip: true,
    tags: ["stocks", "risk", "stop-loss"],
  },
  {
    id: "stock-position-size",
    title: "The 1% Rule for Position Sizing",
    content:
      "Never risk more than 1-2% of your total capital on a single trade. With £10,000 capital, your maximum loss per trade should be £100-200.",
    category: "stock",
    level: "beginner",
    isQuickTip: true,
    tags: ["stocks", "risk", "position-sizing"],
  },
  {
    id: "stock-news-check",
    title: "Check for Pending News",
    content:
      "Before entering a momentum trade, check if there are earnings reports, ex-dividend dates, or major announcements due. These can override technical signals.",
    category: "stock",
    level: "intermediate",
    isQuickTip: true,
    tags: ["stocks", "research", "news"],
  },
  {
    id: "stock-avoid-opening",
    title: "Avoid the First 30 Minutes",
    content:
      "Market opens are volatile and spreads are wider. Unless you have a specific gap strategy, wait 30 minutes for the market to settle before entering positions.",
    category: "stock",
    level: "intermediate",
    isQuickTip: true,
    tags: ["stocks", "timing", "execution"],
  },
  {
    id: "stock-volume-confirm",
    title: "Volume Confirms Price Moves",
    content:
      "A price breakout on low volume often fails. Look for above-average volume to confirm the move is genuine. High volume = conviction.",
    category: "stock",
    level: "intermediate",
    isQuickTip: true,
    tags: ["stocks", "analysis", "volume"],
  },

  // Crypto Tips
  {
    id: "crypto-funding-timing",
    title: "Time Your Entry Before Funding",
    content:
      "Funding rates are paid every 8 hours (usually 00:00, 08:00, 16:00 UTC). Enter positions at least 30 minutes before funding to ensure you capture the payment.",
    category: "crypto",
    level: "beginner",
    isQuickTip: true,
    tags: ["crypto", "funding", "timing"],
  },
  {
    id: "crypto-leverage-limit",
    title: "Keep Leverage Low for Funding Arb",
    content:
      "For funding rate arbitrage, use maximum 2-3x leverage. Higher leverage increases liquidation risk during flash crashes. Capital preservation > maximising returns.",
    category: "crypto",
    level: "intermediate",
    isQuickTip: true,
    tags: ["crypto", "leverage", "risk"],
  },
  {
    id: "crypto-match-positions",
    title: "Match Your Spot and Perp Positions Exactly",
    content:
      "When setting up a funding arb, ensure your spot and perpetual positions are identical in size. Any mismatch exposes you to directional risk.",
    category: "crypto",
    level: "beginner",
    isQuickTip: true,
    tags: ["crypto", "execution", "position-sizing"],
  },
  {
    id: "crypto-monitor-margin",
    title: "Monitor Margin Levels Constantly",
    content:
      "Crypto can move 10-20% in hours. Keep extra margin in your futures account and set alerts at 50% margin usage. Top up before you get liquidated.",
    category: "crypto",
    level: "intermediate",
    isQuickTip: true,
    tags: ["crypto", "risk", "margin"],
  },
  {
    id: "crypto-rate-reversals",
    title: "Watch for Funding Rate Reversals",
    content:
      "When funding rates go from positive to negative, your profitable short becomes a liability. Set alerts and be ready to exit when rates approach zero.",
    category: "crypto",
    level: "advanced",
    isQuickTip: true,
    tags: ["crypto", "funding", "exit"],
  },

  // General Tips
  {
    id: "gen-bankroll",
    title: "Separate Your Trading Bankroll",
    content:
      "Never trade with money you need for bills or emergencies. Keep your trading capital completely separate from personal finances.",
    category: "general",
    level: "beginner",
    isQuickTip: true,
    tags: ["general", "bankroll", "risk"],
  },
  {
    id: "gen-journal",
    title: "Keep a Trading Journal",
    content:
      "Record every trade: entry reason, exit reason, emotions, and outcome. Review weekly to identify patterns in your successes and failures.",
    category: "general",
    level: "beginner",
    isQuickTip: true,
    tags: ["general", "tracking", "improvement"],
  },
  {
    id: "gen-patience",
    title: "No Opportunity is Better Than a Bad One",
    content:
      "Forcing trades when opportunities are thin leads to losses. Be patient and wait for high-quality setups rather than chasing marginal ones.",
    category: "general",
    level: "intermediate",
    isQuickTip: true,
    tags: ["general", "psychology", "patience"],
  },
  {
    id: "gen-compound",
    title: "The Power of Compounding Small Wins",
    content:
      "A 2% profit per week compounds to 180% annually. Focus on consistent small gains rather than home runs. Consistency beats luck.",
    category: "general",
    level: "beginner",
    isQuickTip: true,
    tags: ["general", "compounding", "strategy"],
  },
  {
    id: "gen-diversify",
    title: "Diversify Across Opportunity Types",
    content:
      "Don't put all capital into one strategy. Split between arbitrage, stocks, and crypto based on your risk tolerance. Diversification reduces overall volatility.",
    category: "general",
    level: "intermediate",
    isQuickTip: true,
    tags: ["general", "diversification", "portfolio"],
  },
];

// =============================================================================
// Category-Specific Execution Guidance
// =============================================================================

export const categoryGuidance: Record<OpportunityCategory, CategoryGuidance> = {
  arbitrage: {
    category: "arbitrage",
    overview:
      "Arbitrage betting exploits odds differences between bookmakers to guarantee profit regardless of the outcome. Success requires speed, multiple funded accounts, and careful execution.",
    executionSteps: [
      {
        step: 1,
        title: "Verify Both Odds Still Exist",
        description:
          "Before placing any bets, open both bookmaker sites and confirm the odds shown in the opportunity are still available.",
        warning:
          "Odds can change within seconds. If either odd has moved, recalculate or skip this opportunity.",
        tip: "Use two monitors or browser windows side by side for faster verification.",
      },
      {
        step: 2,
        title: "Calculate Your Stakes",
        description:
          "Use the exact stake amounts shown in the opportunity. These are calculated to ensure equal profit regardless of outcome.",
        warning:
          "Do not round stakes significantly as this can turn a profit into a loss.",
        tip: "Keep a calculator handy to verify stake calculations if needed.",
      },
      {
        step: 3,
        title: "Place the Larger Stake First",
        description:
          "Place the bet with the larger stake amount first. If odds change, you can more easily hedge with a smaller remaining bet.",
        platform:
          "Place on the exchange (Betfair/Smarkets) first if possible - odds are more stable.",
      },
      {
        step: 4,
        title: "Immediately Place the Second Bet",
        description:
          "Without delay, switch to the second bookmaker and place the remaining bet at the required odds.",
        warning:
          "If the second bet fails at the required odds, you may need to hedge at a loss or leave exposure.",
      },
      {
        step: 5,
        title: "Record the Trade",
        description:
          "Screenshot both bet slips and log the trade in your spreadsheet or mark as actioned in the app.",
        tip: "Note the actual odds you achieved vs. the scanned odds for performance tracking.",
      },
      {
        step: 6,
        title: "Wait for Settlement",
        description:
          "The event must complete for bets to settle. Your profit will appear in one of your bookmaker accounts.",
        tip: "Use the time between placing and settlement to withdraw profits from successful accounts to balance your bankroll.",
      },
    ],
    riskWarnings: [
      {
        level: "warning",
        title: "Account Restrictions",
        message:
          "Consistent arbitrage betting can lead to account gubbing (restrictions). Vary your betting patterns and place some recreational bets to maintain accounts.",
      },
      {
        level: "info",
        title: "Partial Execution Risk",
        message:
          "If you only manage to place one side of the arb, you have directional exposure. Always have a plan for hedging failed executions.",
      },
      {
        level: "danger",
        title: "Palpable Errors",
        message:
          'Some bookmakers void bets on "palpable errors" (obvious mispriced odds). Extremely high margins (>5%) may be voided. Check terms before betting.',
      },
    ],
    moneyManagement: [
      "Keep each bookmaker account funded with 5-10% of your total arbitrage bankroll",
      "Never bet more than 50% of an account balance on a single arb",
      "Withdraw profits regularly to maintain even balances across accounts",
      "Set aside 10% of profits for tax (UK gambling winnings are tax-free but track anyway)",
      "Maintain a float for rebalancing - don't commit 100% of capital",
    ],
    platformInstructions: {
      Betfair: [
        "Log in to Betfair Exchange (not Sportsbook)",
        "Navigate to the correct event and market",
        "Use LAY bets to bet against an outcome",
        "Check the liability shown matches your calculated stake",
        "Place the bet and verify it's matched",
      ],
      Smarkets: [
        "Log in to Smarkets Exchange",
        "Search for the event using the search bar",
        "Select the correct market (match winner, etc.)",
        "Enter your stake and verify the potential return",
        "Submit and wait for the bet to be matched",
      ],
      Bet365: [
        "Log in to your Bet365 account",
        "Navigate to the sport and find the event",
        "Click on the odds to add to bet slip",
        "Enter your stake in the bet slip",
        "Confirm and place the bet",
      ],
    },
    commonMistakes: [
      "Placing bets on wrong events or markets (double-check event names)",
      "Forgetting to account for commission on exchanges",
      "Betting more than the maximum allowed stake",
      "Not verifying odds before placing (acting on stale data)",
      "Using the same stake amount repeatedly (triggers restrictions)",
    ],
    proTips: [
      "Use multiple browser profiles to stay logged into all bookmakers simultaneously",
      "Set up bank transfers to bookmakers in advance - deposits can take time",
      "Focus on tennis and smaller football leagues - less scrutiny than Premier League",
      "Place some recreational bets (especially accumulators) to appear as a normal punter",
      "Keep records of every bet for both tracking and potential disputes",
    ],
  },

  value_bet: {
    category: "value_bet",
    overview:
      "Value betting identifies odds that are higher than the true probability of an outcome. Unlike arbitrage, value bets have risk but offer positive expected value over time.",
    executionSteps: [
      {
        step: 1,
        title: "Understand the Value",
        description:
          "Check the value percentage shown. This indicates how much higher the odds are compared to our calculated true probability.",
        tip: "Higher value % means more edge, but also more variance. Start with lower value bets to build experience.",
      },
      {
        step: 2,
        title: "Apply Kelly Criterion",
        description:
          "Use Kelly criterion or a fraction thereof to determine stake size based on your edge and bankroll.",
        warning:
          "Full Kelly is aggressive. Most professionals use 1/4 or 1/2 Kelly to reduce variance.",
      },
      {
        step: 3,
        title: "Verify the Odds",
        description:
          "Confirm the bookmaker still offers the odds shown in the opportunity.",
        tip: "If odds have dropped but still represent value, the bet may still be worth placing.",
      },
      {
        step: 4,
        title: "Place Your Bet",
        description:
          "Log into the bookmaker, find the event, and place your calculated stake.",
      },
      {
        step: 5,
        title: "Track and Review",
        description:
          "Record all value bets and track your long-term return on investment.",
        tip: "You need 500+ bets to assess whether you're beating the market. Don't judge on short samples.",
      },
    ],
    riskWarnings: [
      {
        level: "warning",
        title: "Variance and Losing Streaks",
        message:
          "Even with positive expected value, you will experience losing streaks. A 10-bet losing streak is normal. Ensure your bankroll can handle variance.",
      },
      {
        level: "info",
        title: "Model Uncertainty",
        message:
          "Our probability estimates are models, not certainties. The edge may be smaller than calculated or non-existent in some cases.",
      },
      {
        level: "danger",
        title: "Stake Sizing is Critical",
        message:
          "Overbetting (too large stakes) can lead to ruin even with positive EV. Always size according to Kelly or smaller.",
      },
    ],
    moneyManagement: [
      "Use Kelly criterion: stake = (bp - q) / b where b=odds-1, p=probability, q=1-p",
      "Start with 1/4 Kelly to reduce variance while building confidence",
      "Never bet more than 5% of bankroll on a single value bet",
      "Track closing line value (CLV) as well as actual results",
      "Set stop-losses at 20% of bankroll - step back if you hit it",
    ],
    platformInstructions: {
      "Any Bookmaker": [
        "Log into your betting account",
        "Search for the specific event",
        "Find the market and selection that matches the opportunity",
        "Enter your calculated stake (based on Kelly)",
        "Confirm the odds haven't changed significantly",
        "Place the bet",
      ],
    },
    commonMistakes: [
      "Chasing losses by increasing stake sizes",
      "Abandoning the strategy after a short losing run",
      "Betting based on gut feeling rather than the model",
      "Not tracking closing line value (best indicator of edge)",
      "Using bookmakers with low limits or that restrict winners quickly",
    ],
    proTips: [
      "Track closing line value (CLV) - if you consistently beat the close, you have an edge",
      "Specialise in leagues or sports where you can develop superior knowledge",
      "Sharp bookmakers (Pinnacle) are best for high-volume value betting",
      "Join value betting communities to share insights and verify models",
      "Consider using Asian handicap markets for better liquidity and limits",
    ],
  },

  stock: {
    category: "stock",
    overview:
      "Stock momentum trading uses technical analysis to identify short-term price movements. Signals indicate potential entry and exit points based on indicators like RSI, MACD, and price patterns.",
    executionSteps: [
      {
        step: 1,
        title: "Review the Signal",
        description:
          "Understand why the signal was generated. Check the confidence score, entry price, stop-loss, and take-profit levels.",
        tip: "Higher confidence signals have multiple confirming indicators aligned.",
      },
      {
        step: 2,
        title: "Check for News",
        description:
          "Before trading, check if there are upcoming earnings, dividends, or major announcements that could override the technical signal.",
        platform: "Use Yahoo Finance, Bloomberg, or your broker's news feed.",
        warning:
          "Trading before earnings is gambling. Avoid stocks with imminent announcements.",
      },
      {
        step: 3,
        title: "Calculate Position Size",
        description:
          "Determine your position size based on the stop-loss distance and your risk tolerance (1-2% of portfolio).",
        tip: "Position size = (Risk Amount) / (Entry Price - Stop Loss Price)",
      },
      {
        step: 4,
        title: "Set Up Your Order",
        description:
          "In your broker platform, set up a limit order at or near the suggested entry price.",
        platform:
          "Use limit orders, not market orders, to control entry price.",
      },
      {
        step: 5,
        title: "Set Stop-Loss Immediately",
        description:
          "As soon as your entry order fills, place a stop-loss order at the suggested level.",
        warning:
          "NEVER skip the stop-loss. This is your primary risk management tool.",
      },
      {
        step: 6,
        title: "Monitor and Manage",
        description:
          "Track the trade against your take-profit and stop-loss levels. Consider trailing your stop-loss as the trade moves in your favour.",
        tip: "Move stop-loss to break-even once you have 1R profit (R = initial risk amount).",
      },
    ],
    riskWarnings: [
      {
        level: "danger",
        title: "Capital at Risk",
        message:
          "Stock trading can result in significant losses. Never invest money you cannot afford to lose. Past performance does not guarantee future results.",
      },
      {
        level: "warning",
        title: "Leverage Risk",
        message:
          "If using CFDs or spread betting, losses can exceed your deposit. Use appropriate position sizing and never over-leverage.",
      },
      {
        level: "info",
        title: "Market Hours",
        message:
          "Stock signals are most valid during market hours. Pre-market and after-hours trading has lower liquidity and wider spreads.",
      },
    ],
    moneyManagement: [
      "Risk maximum 1-2% of total capital per trade",
      "Position size formula: Risk Amount / (Entry - Stop Loss)",
      "Never add to losing positions (averaging down)",
      "Take partial profits at first target, let remainder run",
      "Maximum 5 open positions at once to manage correlation risk",
    ],
    platformInstructions: {
      "Interactive Brokers": [
        "Log into Trader Workstation (TWS) or IBKR Mobile",
        "Search for the stock symbol",
        'Click "Buy" or "Sell" to open order ticket',
        'Select "LMT" (Limit) order type',
        'Enter quantity, limit price, and click "Submit"',
        "Set a separate stop-loss order after fill",
      ],
      "Trading 212": [
        "Open the Trading 212 app or web platform",
        "Search for the stock in the search bar",
        'Tap "Buy" or "Sell"',
        "Enter your investment amount or number of shares",
        'Use "Advanced" to set stop-loss and take-profit',
        "Confirm and place the order",
      ],
      IG: [
        "Log into the IG platform",
        "Find the stock using search",
        "Click to open a deal ticket",
        "Enter your stake/contract size",
        "Add stop-loss and limit (take-profit)",
        'Click "Place deal" to execute',
      ],
    },
    commonMistakes: [
      "Removing or widening stop-losses when price approaches",
      "Holding losing trades hoping they'll recover",
      "Trading against the overall market trend",
      "Over-trading (entering too many positions)",
      "Ignoring position sizing rules in the heat of the moment",
    ],
    proTips: [
      "Trade in the direction of the higher timeframe trend",
      "Best results usually come from first 2 hours and last hour of trading",
      "Keep a trade journal noting emotions and decision-making",
      "Backtest signals on historical data before using real money",
      "Use stock screeners to pre-filter universe before signal analysis",
    ],
  },

  crypto: {
    category: "crypto",
    overview:
      "Crypto funding rate arbitrage profits from the difference between perpetual futures and spot prices. By holding opposing positions, you collect funding payments while staying market-neutral.",
    executionSteps: [
      {
        step: 1,
        title: "Assess the Funding Rate",
        description:
          "Review the current funding rate and its history. Look for consistently positive rates above 0.03% (10% APY) to make the trade worthwhile.",
        tip: "Check the predicted rate as well as the current rate - rates change every 8 hours.",
      },
      {
        step: 2,
        title: "Fund Both Accounts",
        description:
          "Ensure you have sufficient capital in both your spot wallet and futures margin account.",
        warning:
          "Leave extra margin (20-30%) in futures account for price volatility.",
      },
      {
        step: 3,
        title: "Buy Spot Position",
        description:
          "Purchase the cryptocurrency in the spot market. Use a limit order slightly below market price to get a better fill.",
        platform:
          'Your spot position is your "long" - you profit if price goes up.',
      },
      {
        step: 4,
        title: "Open Short Perpetual",
        description:
          "Immediately open a short perpetual futures position for the EXACT same notional value.",
        warning:
          "Ensure position sizes match precisely. Any mismatch creates directional exposure.",
        tip: "Use 2-3x leverage maximum. Higher leverage = higher liquidation risk.",
      },
      {
        step: 5,
        title: "Verify Delta Neutral",
        description:
          "Confirm both positions are the same size. Your P&L should stay roughly flat regardless of price movement.",
      },
      {
        step: 6,
        title: "Collect Funding",
        description:
          "Every 8 hours, funding is paid. With positive rates, your short position receives the payment.",
        tip: "Rates are paid on position size x rate. £10,000 position x 0.1% rate = £10 per funding period.",
      },
      {
        step: 7,
        title: "Monitor and Exit",
        description:
          "Check funding rates daily. When rates drop or turn negative, close both positions to lock in profits.",
        warning:
          "Always close BOTH positions simultaneously. Closing one leaves you exposed.",
      },
    ],
    riskWarnings: [
      {
        level: "danger",
        title: "Liquidation Risk",
        message:
          "If price spikes rapidly, your short can be liquidated before your spot profit is realised. Always maintain adequate margin and use low leverage.",
      },
      {
        level: "danger",
        title: "Exchange Risk",
        message:
          "Crypto exchanges can fail, freeze withdrawals, or be hacked. Never keep more capital on an exchange than you can afford to lose.",
      },
      {
        level: "warning",
        title: "Funding Rate Reversals",
        message:
          "Rates can turn negative suddenly, making your position unprofitable. Monitor rates and be prepared to exit quickly.",
      },
      {
        level: "info",
        title: "Tax Implications",
        message:
          "Crypto trades are taxable in the UK. Each leg of the trade may trigger a disposal event. Consult a tax professional.",
      },
    ],
    moneyManagement: [
      "Use maximum 2-3x leverage on the futures side",
      "Keep 30% of futures capital as buffer margin",
      "Don't allocate more than 20% of portfolio to single coin funding arb",
      "Take profits weekly by reducing position size",
      "Set alerts for margin ratio below 50%",
    ],
    platformInstructions: {
      Kraken: [
        "Log into Kraken Pro or Kraken app",
        "Go to Spot trading and buy the cryptocurrency",
        "Transfer funds to Kraken Futures",
        "Open a short perpetual position matching your spot size",
        "Monitor via the Positions tab",
      ],
      OKX: [
        "Log into OKX and navigate to Trade",
        'Buy spot crypto under "Convert" or "Spot Trading"',
        "Go to Derivatives > Perpetual",
        "Select the coin and open a short position",
        "Set leverage to 2-3x (isolated margin recommended)",
        "Ensure position size matches spot holdings",
      ],
      Binance: [
        "Log into Binance and go to Spot market",
        "Purchase the cryptocurrency",
        "Navigate to USD-M Futures",
        "Adjust leverage (keep low: 2-3x)",
        "Open a short perpetual position",
        'Use "Hedge mode" if available to manage positions easily',
      ],
    },
    commonMistakes: [
      "Using too high leverage (5x+ is asking for liquidation)",
      "Not matching spot and perp position sizes exactly",
      "Ignoring funding rate changes until too late",
      "Keeping too much capital on a single exchange",
      "Closing positions separately (creates directional exposure)",
    ],
    proTips: [
      "Use multiple exchanges for funding arb - rates differ between platforms",
      "Set up rate alerts using TradingView or exchange notifications",
      "Compound profits by increasing position size as you collect funding",
      "Consider stablecoin funding rates (USDC, USDT) for lower volatility",
      "Keep records for tax purposes - each trade is potentially taxable",
    ],
  },
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get a random tip of the day based on optional category filter
 */
export function getTipOfTheDay(category?: OpportunityCategory): Tip {
  const eligibleTips = category
    ? dailyTips.filter(
        (t) => t.category === category || t.category === "general",
      )
    : dailyTips;

  // Use date as seed for consistent daily tip
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  const index = dayOfYear % eligibleTips.length;

  return eligibleTips[index];
}

/**
 * Get tips filtered by category and experience level
 */
export function getTips(
  category?: OpportunityCategory | "general",
  level?: ExperienceLevel,
  limit?: number,
): Tip[] {
  let filtered = dailyTips;

  if (category) {
    filtered = filtered.filter(
      (t) => t.category === category || t.category === "general",
    );
  }

  if (level) {
    // Show tips at or below the user's level
    const levelOrder: ExperienceLevel[] = [
      "beginner",
      "intermediate",
      "advanced",
    ];
    const maxLevelIndex = levelOrder.indexOf(level);
    filtered = filtered.filter(
      (t) => levelOrder.indexOf(t.level) <= maxLevelIndex,
    );
  }

  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  return filtered;
}

/**
 * Get execution guidance for a specific category
 */
export function getExecutionGuidance(
  category: OpportunityCategory,
): CategoryGuidance {
  return categoryGuidance[category];
}

/**
 * Get quick tips (suitable for sidebar display)
 */
export function getQuickTips(
  category?: OpportunityCategory,
  limit: number = 3,
): Tip[] {
  const filtered = category
    ? dailyTips.filter(
        (t) =>
          t.isQuickTip && (t.category === category || t.category === "general"),
      )
    : dailyTips.filter((t) => t.isQuickTip);

  // Shuffle and return limited tips
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

/**
 * Get risk warnings for a category
 */
export function getRiskWarnings(category: OpportunityCategory): RiskWarning[] {
  return categoryGuidance[category]?.riskWarnings || [];
}

/**
 * Get platform-specific instructions
 */
export function getPlatformInstructions(
  category: OpportunityCategory,
  platform?: string,
): string[] {
  const guidance = categoryGuidance[category];
  if (!guidance?.platformInstructions) return [];

  if (platform && guidance.platformInstructions[platform]) {
    return guidance.platformInstructions[platform];
  }

  // Return first platform's instructions as default
  const platforms = Object.keys(guidance.platformInstructions);
  return platforms.length > 0
    ? guidance.platformInstructions[platforms[0]]
    : [];
}

/**
 * Get available platforms for a category
 */
export function getAvailablePlatforms(category: OpportunityCategory): string[] {
  const guidance = categoryGuidance[category];
  return guidance?.platformInstructions
    ? Object.keys(guidance.platformInstructions)
    : [];
}
