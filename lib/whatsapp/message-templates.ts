// ============================================
// HILLWAY ALPHA - WhatsApp Message Templates
// Formatted messages for WhatsApp notifications
// Keep messages under 1600 chars (WhatsApp limit)
// ============================================

export interface Opportunity {
  id?: string;
  type: "arbitrage" | "value_bet" | "momentum" | "funding_rate" | "sentiment";
  category: "betting" | "stocks" | "crypto";
  event_name?: string;
  event?: string;
  symbol?: string;
  margin?: number;
  confidence?: number;
  expectedValue?: number;
  data?: {
    home_team?: string;
    away_team?: string;
    legs?: Array<{
      outcome: string;
      bookmaker: string;
      odds: number;
      stake?: number;
    }>;
    stake?: number;
    profit?: number;
    annualizedRate?: number;
    exchange?: string;
    signal?: string;
    direction?: string;
    expectedValue?: number;
  };
  startsAt?: string;
  created_at?: string;
}

export interface DailyMetrics {
  totalOpportunities: number;
  arbitrageCount: number;
  stockCount: number;
  cryptoCount: number;
  topMargin?: number;
  weeklyPnL?: number;
  successRate?: number;
}

/**
 * Get emoji for opportunity type
 */
function getTypeEmoji(
  type: Opportunity["type"],
  category?: Opportunity["category"],
): string {
  const typeEmojis: Record<string, string> = {
    arbitrage: "\u{1F3AF}", // Target
    value_bet: "\u{1F4B0}", // Money Bag
    momentum: "\u{1F4C8}", // Chart Increasing
    funding_rate: "\u{1F4B1}", // Currency Exchange
    sentiment: "\u{1F50D}", // Magnifying Glass
  };

  return (
    typeEmojis[type] || (category === "crypto" ? "\u{1FA99}" : "\u{1F4CA}")
  );
}

/**
 * Format opportunity alert for WhatsApp (real-time notification)
 * Concise message for immediate action
 */
export function formatOpportunityAlert(opportunity: Opportunity): string {
  const emoji = getTypeEmoji(opportunity.type, opportunity.category);
  const eventName =
    opportunity.event_name ||
    opportunity.event ||
    opportunity.symbol ||
    "Unknown Event";

  let message = `${emoji} *New Opportunity Found!*\n\n`;
  message += `*${eventName}*\n`;

  // Add type-specific details
  switch (opportunity.type) {
    case "arbitrage":
      if (opportunity.margin) {
        message += `\u{1F4CA} Arbitrage: ${opportunity.margin.toFixed(2)}% margin\n`;
        const profit = opportunity.data?.profit || opportunity.margin;
        message += `\u{1F4B0} Guaranteed profit: \u{00A3}${profit.toFixed(2)} per \u{00A3}100\n`;
      }

      // Add staking details if available
      if (opportunity.data?.legs && opportunity.data.legs.length > 0) {
        message += `\nStakes:\n`;
        opportunity.data.legs.slice(0, 3).forEach((leg) => {
          const stake = leg.stake ? ` - \u{00A3}${leg.stake.toFixed(2)}` : "";
          message += `\u{2022} ${leg.outcome} @ ${leg.odds.toFixed(2)} (${leg.bookmaker})${stake}\n`;
        });
      }
      break;

    case "value_bet":
      if (opportunity.expectedValue) {
        message += `\u{1F4C8} Edge: +${opportunity.expectedValue.toFixed(2)}%\n`;
      }
      if (opportunity.confidence) {
        message += `\u{1F3AF} Confidence: ${opportunity.confidence}%\n`;
      }
      break;

    case "momentum":
      if (opportunity.data?.signal) {
        message += `\u{1F4CA} Signal: ${opportunity.data.signal}\n`;
      }
      if (opportunity.data?.direction) {
        const dirEmoji =
          opportunity.data.direction === "bullish" ? "\u{1F4C8}" : "\u{1F4C9}";
        message += `${dirEmoji} Direction: ${opportunity.data.direction.toUpperCase()}\n`;
      }
      if (opportunity.confidence) {
        message += `\u{1F3AF} Confidence: ${opportunity.confidence}%\n`;
      }
      break;

    case "funding_rate":
      if (opportunity.data?.annualizedRate) {
        message += `\u{1F4B1} Funding Rate: ${opportunity.data.annualizedRate.toFixed(1)}% APY\n`;
      }
      if (opportunity.data?.exchange) {
        message += `\u{1F3E6} Exchange: ${opportunity.data.exchange}\n`;
      }
      break;

    case "sentiment":
      if (opportunity.data?.signal) {
        message += `\u{1F50D} Signal: ${opportunity.data.signal}\n`;
      }
      if (opportunity.confidence) {
        message += `\u{1F4CA} Strength: ${opportunity.confidence}%\n`;
      }
      break;
  }

  // Add timing info
  if (opportunity.startsAt) {
    const startsAt = new Date(opportunity.startsAt);
    const now = new Date();
    const hoursUntil = Math.round(
      (startsAt.getTime() - now.getTime()) / (1000 * 60 * 60),
    );

    if (hoursUntil > 0 && hoursUntil < 48) {
      message += `\n\u{23F0} Match starts in ${hoursUntil} hours\n`;
    }
  }

  // Add link (if app URL configured)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl && opportunity.id) {
    message += `\nView details: ${appUrl}/opportunities/${opportunity.id}`;
  }

  return message;
}

/**
 * Format daily digest for WhatsApp
 * Summary of the day's opportunities and performance
 */
export function formatDailyDigest(
  opportunities: Opportunity[],
  metrics: DailyMetrics,
): string {
  let message = `\u{1F4CA} *Hillway Alpha Daily Digest*\n\n`;

  // Summary stats
  message += `Today's Opportunities: ${metrics.totalOpportunities}\n`;

  if (metrics.arbitrageCount > 0) {
    const avgMargin = opportunities
      .filter((o) => o.type === "arbitrage" && o.margin)
      .reduce((sum, o, _, arr) => sum + (o.margin || 0) / arr.length, 0);
    message += `\u{2022} Arbitrage: ${metrics.arbitrageCount}${avgMargin > 0 ? ` (avg ${avgMargin.toFixed(1)}%)` : ""}\n`;
  }

  if (metrics.stockCount > 0) {
    message += `\u{2022} Stocks: ${metrics.stockCount} signals\n`;
  }

  if (metrics.cryptoCount > 0) {
    message += `\u{2022} Crypto: ${metrics.cryptoCount} plays\n`;
  }

  // Top opportunity
  const topOpp = opportunities
    .filter((o) => o.margin || o.data?.annualizedRate || o.confidence)
    .sort((a, b) => {
      const scoreA = a.margin || a.data?.annualizedRate || a.confidence || 0;
      const scoreB = b.margin || b.data?.annualizedRate || b.confidence || 0;
      return scoreB - scoreA;
    })[0];

  if (topOpp) {
    const name =
      topOpp.event_name || topOpp.event || topOpp.symbol || "Unknown";
    let topScore: string;

    if (topOpp.type === "funding_rate" && topOpp.data?.annualizedRate) {
      topScore = `${topOpp.data.annualizedRate.toFixed(1)}% APY`;
    } else if (topOpp.margin) {
      topScore = `${topOpp.margin.toFixed(2)}%`;
    } else if (topOpp.confidence) {
      topScore = `${topOpp.confidence}% conf`;
    } else {
      topScore = "High confidence";
    }

    message += `\n\u{1F3C6} Top Pick: ${name}\n`;
    message += `   ${topScore}\n`;
  }

  // Performance if available
  if (metrics.weeklyPnL !== undefined) {
    const emoji = metrics.weeklyPnL >= 0 ? "\u{1F4C8}" : "\u{1F4C9}";
    const sign = metrics.weeklyPnL >= 0 ? "+" : "";
    message += `\n${emoji} Your P&L: ${sign}\u{00A3}${metrics.weeklyPnL.toFixed(2)} this week`;
    if (metrics.successRate) {
      message += ` (${metrics.successRate.toFixed(0)}% win rate)`;
    }
    message += "\n";
  }

  // Link to dashboard
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    message += `\nView all: ${appUrl}/dashboard`;
  }

  return message;
}

/**
 * Format urgent high-value alert
 * Used for opportunities with high margin/confidence that need immediate attention
 */
export function formatUrgentAlert(opportunity: Opportunity): string {
  const eventName =
    opportunity.event_name ||
    opportunity.event ||
    opportunity.symbol ||
    "Unknown";

  let message = `\u{1F6A8} *URGENT: High-Value Opportunity*\n\n`;
  message += `*${eventName}*\n\n`;

  if (opportunity.margin && opportunity.margin >= 3) {
    message += `\u{1F4B0} ${opportunity.margin.toFixed(2)}% GUARANTEED MARGIN\n`;
  }

  if (opportunity.confidence && opportunity.confidence >= 80) {
    message += `\u{1F3AF} ${opportunity.confidence}% Confidence\n`;
  }

  if (
    opportunity.data?.annualizedRate &&
    opportunity.data.annualizedRate >= 100
  ) {
    message += `\u{1F4B1} ${opportunity.data.annualizedRate.toFixed(1)}% APY\n`;
  }

  message += `\n\u{26A1} Act quickly - window may close soon\n`;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl && opportunity.id) {
    message += `\nDetails: ${appUrl}/opportunities/${opportunity.id}`;
  }

  return message;
}

/**
 * Format welcome/onboarding message
 */
export function formatWelcomeMessage(userName?: string): string {
  const greeting = userName ? `Hi ${userName}!` : "Welcome!";

  return `\u{1F44B} ${greeting}

*Your Hillway Alpha WhatsApp alerts are now active.*

You'll receive:
\u{1F3AF} Real-time opportunity alerts
\u{1F4CA} Daily digest summaries
\u{1F4B0} High-value urgent notifications

Manage your preferences at:
${process.env.NEXT_PUBLIC_APP_URL || "https://alpha.hillwayco.uk"}/settings/notifications

Happy trading! \u{1F4C8}`;
}

/**
 * Format test message
 */
export function formatTestMessage(): string {
  return `\u{2705} *Hillway Alpha WhatsApp Test*

Your WhatsApp notifications are working correctly!

This is a test message sent at ${new Date().toLocaleString("en-GB", { timeZone: "Europe/London" })} UK time.

\u{1F3AF} You're all set to receive:
\u{2022} Real-time opportunity alerts
\u{2022} Daily digest summaries
\u{2022} High-value notifications

${process.env.NEXT_PUBLIC_APP_URL || "https://alpha.hillwayco.uk"}`;
}
