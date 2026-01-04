// ============================================
// TRADESMART - Daily Review Cron Handler
// Next.js App Router API Route
// Runs at 11:00 PM UK time (0 23 * * *)
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 30;

interface DailyReviewMetrics {
  timestamp: string;
  metrics: {
    opportunitiesFound: number;
    opportunitiesTaken: number;
    winRate: number;
    totalProfit: number;
    roi: number;
  };
  breakdown: {
    betting: { count: number; profit: number };
    stocks: { count: number; profit: number };
    crypto: { count: number; profit: number };
  };
  topPerformers: Array<{
    type: string;
    description: string;
    profit: number;
  }>;
  errors: string[];
}

async function runDailyReview(): Promise<DailyReviewMetrics> {
  const result: DailyReviewMetrics = {
    timestamp: new Date().toISOString(),
    metrics: {
      opportunitiesFound: 0,
      opportunitiesTaken: 0,
      winRate: 0,
      totalProfit: 0,
      roi: 0,
    },
    breakdown: {
      betting: { count: 0, profit: 0 },
      stocks: { count: 0, profit: 0 },
      crypto: { count: 0, profit: 0 },
    },
    topPerformers: [],
    errors: [],
  };

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    result.errors.push("Supabase not configured - skipping review");
    return result;
  }

  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch today's opportunities
    const { data: opportunities, error: oppError } = await supabase
      .from("opportunities")
      .select("*")
      .gte("created_at", today.toISOString())
      .lt("created_at", tomorrow.toISOString());

    if (oppError) {
      result.errors.push(`Failed to fetch opportunities: ${oppError.message}`);
    } else if (opportunities) {
      result.metrics.opportunitiesFound = opportunities.length;

      for (const opp of opportunities) {
        const oppType = opp.type as string;
        if (oppType === "arbitrage" || oppType === "value_bet") {
          result.breakdown.betting.count++;
        } else if (oppType === "momentum") {
          result.breakdown.stocks.count++;
        } else if (oppType === "funding_rate" || oppType === "sentiment") {
          result.breakdown.crypto.count++;
        }
      }
    }

    // Fetch today's closed positions
    const { data: positions, error: posError } = await supabase
      .from("positions")
      .select("*")
      .eq("status", "closed")
      .gte("closed_at", today.toISOString())
      .lt("closed_at", tomorrow.toISOString());

    if (posError) {
      result.errors.push(`Failed to fetch positions: ${posError.message}`);
    } else if (positions && positions.length > 0) {
      result.metrics.opportunitiesTaken = positions.length;

      let wins = 0;
      let totalStaked = 0;

      for (const pos of positions) {
        const profit = parseFloat(pos.realized_pnl || "0");
        const stake = parseFloat(pos.size || "0");

        result.metrics.totalProfit += profit;
        totalStaked += stake;

        if (profit > 0) wins++;

        const assetClass = pos.asset_class as string;
        if (assetClass === "betting") {
          result.breakdown.betting.profit += profit;
        } else if (assetClass === "stocks") {
          result.breakdown.stocks.profit += profit;
        } else if (assetClass === "crypto") {
          result.breakdown.crypto.profit += profit;
        }

        if (profit > 0) {
          result.topPerformers.push({
            type: assetClass,
            description: pos.symbol || pos.event_name || "Unknown",
            profit,
          });
        }
      }

      result.metrics.winRate =
        positions.length > 0 ? (wins / positions.length) * 100 : 0;
      result.metrics.roi =
        totalStaked > 0 ? (result.metrics.totalProfit / totalStaked) * 100 : 0;

      result.topPerformers.sort((a, b) => b.profit - a.profit);
      result.topPerformers = result.topPerformers.slice(0, 5);
    }

    // Save daily metrics
    try {
      const { error: metricsError } = await supabase
        .from("daily_metrics")
        .insert({
          date: today.toISOString().split("T")[0],
          opportunities_found: result.metrics.opportunitiesFound,
          opportunities_taken: result.metrics.opportunitiesTaken,
          win_rate: result.metrics.winRate,
          total_profit: result.metrics.totalProfit,
          roi: result.metrics.roi,
          betting_count: result.breakdown.betting.count,
          betting_profit: result.breakdown.betting.profit,
          stocks_count: result.breakdown.stocks.count,
          stocks_profit: result.breakdown.stocks.profit,
          crypto_count: result.breakdown.crypto.count,
          crypto_profit: result.breakdown.crypto.profit,
        });

      if (metricsError && !metricsError.message.includes("duplicate")) {
        result.errors.push(`Failed to save metrics: ${metricsError.message}`);
      }
    } catch (err: any) {
      result.errors.push(`Metrics save error: ${err.message}`);
    }

    // Send summary email
    if (
      result.metrics.opportunitiesFound > 0 ||
      result.metrics.opportunitiesTaken > 0
    ) {
      try {
        const { notifyUser } = await import("@/lib/notifications");

        const formatCurrency = (amount: number) =>
          `£${amount >= 0 ? "" : "-"}${Math.abs(amount).toFixed(2)}`;

        const summary = [
          "=== TRADESMART DAILY REVIEW ===",
          "",
          "OPPORTUNITIES",
          `  Found: ${result.metrics.opportunitiesFound}`,
          `  Taken: ${result.metrics.opportunitiesTaken}`,
          "",
          "PERFORMANCE",
          `  Win Rate: ${result.metrics.winRate.toFixed(1)}%`,
          `  Total P&L: ${formatCurrency(result.metrics.totalProfit)}`,
          `  ROI: ${result.metrics.roi.toFixed(1)}%`,
          "",
          "BY CATEGORY",
          `  Betting: ${result.breakdown.betting.count} opps, ${formatCurrency(result.breakdown.betting.profit)}`,
          `  Stocks: ${result.breakdown.stocks.count} opps, ${formatCurrency(result.breakdown.stocks.profit)}`,
          `  Crypto: ${result.breakdown.crypto.count} opps, ${formatCurrency(result.breakdown.crypto.profit)}`,
        ].join("\n");

        await notifyUser(summary, "email");
      } catch (error: any) {
        result.errors.push(`Notification error: ${error.message}`);
      }
    }
  } catch (error: any) {
    result.errors.push(`Review failed: ${error.message}`);
  }

  return result;
}

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    if (process.env.CRON_SECRET && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  console.log(`[${new Date().toISOString()}] Daily review triggered`);

  try {
    const result = await runDailyReview();

    return NextResponse.json({
      success: true,
      message: `Daily review complete. ${result.metrics.opportunitiesFound} opportunities found, ${result.metrics.opportunitiesTaken} taken.`,
      ...result,
    });
  } catch (error: any) {
    console.error("Daily review failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
