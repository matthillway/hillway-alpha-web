// ============================================
// HILLWAY ALPHA - AI Synthesis Layer
// Uses Claude to generate intelligent briefings
// ============================================

import Anthropic from "@anthropic-ai/sdk";
import {
  ArbitrageOpportunity,
  DbOpportunity,
  DailyBriefing,
  RankedOpportunity,
} from "@/lib/types/scanner";
import dayjs from "dayjs";

let anthropicClient: Anthropic | null = null;

/**
 * Get or create Anthropic client
 */
function getAnthropicClient(): Anthropic {
  if (anthropicClient) return anthropicClient;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is required for AI synthesis");
  }

  anthropicClient = new Anthropic({ apiKey });
  return anthropicClient;
}

/**
 * Check if AI synthesis is available
 */
export function isAiConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}

/**
 * Generate market context summary
 */
export async function generateMarketContext(
  opportunities: DbOpportunity[],
): Promise<string> {
  if (!isAiConfigured()) {
    return "Market context unavailable (AI not configured)";
  }

  const client = getAnthropicClient();

  const summary =
    opportunities.length > 0
      ? `Found ${opportunities.length} opportunities across categories: ${[...new Set(opportunities.map((o) => o.category))].join(", ")}`
      : "No significant opportunities detected";

  const prompt = `You are a trading analyst providing a brief market context for a daily briefing.
Based on the following opportunity summary, provide a 2-3 sentence market overview:

${summary}

Keep it concise and actionable. Focus on what matters for finding trading/betting opportunities today.`;

  try {
    const response = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock ? textBlock.text : summary;
  } catch (error) {
    console.error("AI market context generation failed:", error);
    return summary;
  }
}

/**
 * Generate AI insight from opportunity patterns
 */
export async function generateAiInsight(
  opportunities: DbOpportunity[],
  recentResults?: { wins: number; losses: number; pnl: number },
): Promise<string> {
  if (!isAiConfigured()) {
    return "AI insights unavailable (not configured)";
  }

  const client = getAnthropicClient();

  const categories = [...new Set(opportunities.map((o) => o.category))];
  const avgConfidence =
    opportunities.length > 0
      ? opportunities.reduce((sum, o) => sum + (o.confidence_score || 0), 0) /
        opportunities.length
      : 0;

  const prompt = `You are an AI trading analyst providing insights for a personal opportunity scanner.

Current data:
- ${opportunities.length} opportunities found
- Categories: ${categories.join(", ") || "none"}
- Average confidence score: ${avgConfidence.toFixed(0)}%
${recentResults ? `- Recent performance: ${recentResults.wins} wins, ${recentResults.losses} losses, £${recentResults.pnl.toFixed(2)} P&L` : ""}

Provide ONE key insight or observation (1-2 sentences). Be specific and actionable.
Focus on patterns, risks, or opportunities worth noting.`;

  try {
    const response = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 150,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock ? textBlock.text : "No specific patterns detected today.";
  } catch (error) {
    console.error("AI insight generation failed:", error);
    return "AI insights temporarily unavailable.";
  }
}

/**
 * Score and rank opportunities using AI
 */
export async function rankOpportunitiesWithAi(
  opportunities: DbOpportunity[],
): Promise<RankedOpportunity[]> {
  // For now, use simple rule-based ranking
  // AI can be added later for more sophisticated analysis

  const ranked = opportunities
    .filter((o) => o.status === "open")
    .sort((a, b) => {
      // Primary: confidence score
      const confDiff = (b.confidence_score || 0) - (a.confidence_score || 0);
      if (confDiff !== 0) return confDiff;

      // Secondary: expected value
      return (b.expected_value || 0) - (a.expected_value || 0);
    })
    .slice(0, 10) // Top 10
    .map((opp, index) => ({
      rank: index + 1,
      opportunity: opp,
      confidence: opp.confidence_score || 50,
      expectedValue: opp.expected_value || 0,
      suggestedStake: calculateSuggestedStake(opp),
      actionWindow: calculateActionWindow(opp),
      reasoning: generateReasoning(opp),
    }));

  return ranked;
}

/**
 * Calculate suggested stake based on confidence and bankroll
 */
function calculateSuggestedStake(opp: DbOpportunity): number {
  const bettingBankroll = parseFloat(process.env.BETTING_BANKROLL || "1000");
  const kellyFraction = parseFloat(process.env.KELLY_FRACTION || "0.25");

  // For arbitrage, use fixed percentage of bankroll
  if (opp.category === "arbitrage") {
    return Math.min(bettingBankroll * 0.1, 100); // 10% max, £100 cap
  }

  // For other opportunities, scale by confidence
  const confidence = (opp.confidence_score || 50) / 100;
  const baseStake = bettingBankroll * kellyFraction * confidence;

  // Cap at 5% of bankroll
  return Math.min(baseStake, bettingBankroll * 0.05);
}

/**
 * Calculate action window description
 */
function calculateActionWindow(opp: DbOpportunity): string {
  if (!opp.expires_at) return "No deadline";

  const expiresAt = dayjs(opp.expires_at);
  const now = dayjs();
  const hoursUntil = expiresAt.diff(now, "hour", true);

  if (hoursUntil < 0) return "Expired";
  if (hoursUntil < 1) return `${Math.round(hoursUntil * 60)} minutes`;
  if (hoursUntil < 24) return `${hoursUntil.toFixed(1)} hours`;
  return `${Math.floor(hoursUntil / 24)} days`;
}

/**
 * Generate simple reasoning for opportunity
 */
function generateReasoning(opp: DbOpportunity): string {
  if (opp.category === "arbitrage") {
    return `Mathematically guaranteed ${opp.expected_value?.toFixed(2)}% profit across multiple bookmakers.`;
  }

  if (opp.category === "value_bet") {
    return `Model probability exceeds implied odds by ${opp.expected_value?.toFixed(2)}% (positive expected value).`;
  }

  return opp.description || "Opportunity meets confidence threshold.";
}

/**
 * Calculate recommendation accuracy based on outcomes
 *
 * Recommendation accuracy measures how well our confidence-weighted
 * recommendations performed. It differs from simple win rate by
 * accounting for whether high-confidence recommendations won more often.
 *
 * Formula:
 * - Base: Win rate (0-100%)
 * - Bonus: If PnL is positive, add up to 20% based on profitability
 * - This rewards systems that not only win but win profitably
 *
 * Range: 0-100%
 */
function calculateRecommendationAccuracy(
  wins: number,
  losses: number,
  pnl: number,
): number {
  const totalBets = wins + losses;

  // No data = no accuracy to report
  if (totalBets === 0) return 0;

  // Base accuracy is the win rate
  const winRate = (wins / totalBets) * 100;

  // Calculate profitability bonus (0-20%)
  // If PnL is positive, recommendations are proving valuable
  // Cap the bonus at 20% to prevent distortion
  let profitabilityBonus = 0;
  if (pnl > 0 && totalBets > 0) {
    // Average profit per bet, normalized (assume £10 average stake for scaling)
    const avgProfitPerBet = pnl / totalBets;
    // Scale: £0 = 0%, £2+ = 20% bonus
    profitabilityBonus = Math.min(20, (avgProfitPerBet / 2) * 20);
  }

  // Combine win rate with profitability bonus, capped at 100%
  const accuracy = Math.min(100, winRate + profitabilityBonus);

  // Round to 1 decimal place
  return Math.round(accuracy * 10) / 10;
}

/**
 * Generate complete daily briefing
 */
export async function generateDailyBriefing(
  opportunities: DbOpportunity[],
  yesterdayResults?: { wins: number; losses: number; pnl: number },
): Promise<DailyBriefing> {
  const today = dayjs();

  // Generate components in parallel where possible
  const [marketContext, rankedOpportunities, aiInsight] = await Promise.all([
    generateMarketContext(opportunities),
    rankOpportunitiesWithAi(opportunities),
    generateAiInsight(opportunities, yesterdayResults),
  ]);

  // Split into top opportunities and watchlist
  const topOpportunities = rankedOpportunities.filter(
    (o) => o.confidence >= 60,
  );
  const watchlist = rankedOpportunities.filter(
    (o) => o.confidence >= 40 && o.confidence < 60,
  );

  // Calculate recommendation accuracy from yesterday's results
  const recommendationAccuracy = yesterdayResults
    ? calculateRecommendationAccuracy(
        yesterdayResults.wins,
        yesterdayResults.losses,
        yesterdayResults.pnl,
      )
    : 0;

  return {
    date: today.toDate(),
    marketContext,
    topOpportunities,
    watchlist,
    yesterdayResults: yesterdayResults
      ? {
          totalPnL: yesterdayResults.pnl,
          winRate:
            yesterdayResults.wins + yesterdayResults.losses > 0
              ? (yesterdayResults.wins /
                  (yesterdayResults.wins + yesterdayResults.losses)) *
                100
              : 0,
          recommendationAccuracy,
          byCategory: {},
        }
      : {
          totalPnL: 0,
          winRate: 0,
          recommendationAccuracy: 0,
          byCategory: {},
        },
    aiInsight,
  };
}

/**
 * Format briefing as text for CLI/logs
 */
export function formatBriefingAsText(briefing: DailyBriefing): string {
  const lines: string[] = [];

  lines.push("═".repeat(60));
  lines.push(`  HILLWAY ALPHA - Daily Briefing`);
  lines.push(`  ${dayjs(briefing.date).format("dddd, MMMM D, YYYY")}`);
  lines.push("═".repeat(60));
  lines.push("");

  lines.push("📊 MARKET CONTEXT");
  lines.push(briefing.marketContext);
  lines.push("");

  if (briefing.topOpportunities.length > 0) {
    lines.push("🎯 TOP OPPORTUNITIES");
    lines.push("");

    for (const opp of briefing.topOpportunities) {
      lines.push(`${opp.rank}. ${opp.opportunity.title}`);
      lines.push(`   Category: ${opp.opportunity.category}`);
      lines.push(
        `   Confidence: ${opp.confidence}% | EV: +${opp.expectedValue.toFixed(2)}%`,
      );
      lines.push(`   Suggested Stake: £${opp.suggestedStake.toFixed(2)}`);
      lines.push(`   Action Window: ${opp.actionWindow}`);
      lines.push(`   ${opp.reasoning}`);
      lines.push("");
    }
  } else {
    lines.push("📭 No high-confidence opportunities today.");
    lines.push("");
  }

  if (briefing.watchlist.length > 0) {
    lines.push("⏰ WATCHLIST");
    for (const opp of briefing.watchlist) {
      lines.push(`  - ${opp.opportunity.title} (${opp.confidence}% conf)`);
    }
    lines.push("");
  }

  if (
    briefing.yesterdayResults.totalPnL !== 0 ||
    briefing.yesterdayResults.winRate > 0
  ) {
    lines.push("📈 YESTERDAY'S RESULTS");
    lines.push(`   P&L: £${briefing.yesterdayResults.totalPnL.toFixed(2)}`);
    lines.push(`   Win Rate: ${briefing.yesterdayResults.winRate.toFixed(1)}%`);
    lines.push("");
  }

  lines.push("💡 AI INSIGHT");
  lines.push(briefing.aiInsight);
  lines.push("");
  lines.push("─".repeat(60));

  return lines.join("\n");
}
