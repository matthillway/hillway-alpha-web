import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseAnonKey);
}

// GET /api/portfolio - Get user's portfolio stats
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    // Fetch portfolio data
    const { data: portfolio, error: portfolioError } = await supabase
      .from("user_portfolios")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (portfolioError && portfolioError.code !== "PGRST116") {
      console.error("Error fetching portfolio:", portfolioError);
      return NextResponse.json(
        { error: "Failed to fetch portfolio" },
        { status: 500 },
      );
    }

    // Fetch all trades for the user
    const { data: trades, error: tradesError } = await supabase
      .from("user_trades")
      .select("*")
      .eq("user_id", userId)
      .order("opened_at", { ascending: false });

    if (tradesError) {
      console.error("Error fetching trades:", tradesError);
      return NextResponse.json(
        { error: "Failed to fetch trades" },
        { status: 500 },
      );
    }

    // Calculate stats
    const closedTrades = trades?.filter((t) => t.status === "closed") || [];
    const openTrades = trades?.filter((t) => t.status === "open") || [];
    const winningTrades = closedTrades.filter((t) => (t.pnl || 0) > 0);
    const losingTrades = closedTrades.filter((t) => (t.pnl || 0) < 0);

    // Calculate P&L by category
    const pnlByCategory = closedTrades.reduce(
      (acc, trade) => {
        const category = trade.category || "other";
        if (!acc[category]) {
          acc[category] = { pnl: 0, count: 0 };
        }
        acc[category].pnl += trade.pnl || 0;
        acc[category].count += 1;
        return acc;
      },
      {} as Record<string, { pnl: number; count: number }>,
    );

    // Calculate total P&L
    const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

    // Calculate open positions value
    const openPositionsValue = openTrades.reduce(
      (sum, t) => sum + (t.entry_amount || 0),
      0,
    );

    // Calculate daily P&L for chart data
    const dailyPnl = closedTrades.reduce(
      (acc, trade) => {
        if (trade.closed_at) {
          const date = new Date(trade.closed_at).toISOString().split("T")[0];
          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += trade.pnl || 0;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    // Create cumulative P&L data for chart
    const sortedDates = Object.keys(dailyPnl).sort();
    let cumulative = 0;
    const chartData = sortedDates.map((date) => {
      cumulative += dailyPnl[date];
      return {
        date,
        dailyPnl: dailyPnl[date],
        cumulativePnl: cumulative,
      };
    });

    // Win rate
    const winRate =
      closedTrades.length > 0
        ? (winningTrades.length / closedTrades.length) * 100
        : 0;

    // Average win/loss
    const avgWin =
      winningTrades.length > 0
        ? winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) /
          winningTrades.length
        : 0;

    const avgLoss =
      losingTrades.length > 0
        ? losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) /
          losingTrades.length
        : 0;

    // Calculate P&L percentage
    const openingBalance = portfolio?.opening_balance || 0;
    const pnlPercent =
      openingBalance > 0 ? (totalPnl / openingBalance) * 100 : 0;

    return NextResponse.json({
      portfolio: portfolio || null,
      stats: {
        totalPnl,
        pnlPercent,
        winRate: Math.round(winRate * 10) / 10,
        totalTrades: closedTrades.length,
        openTrades: openTrades.length,
        openPositionsValue,
        winningTrades: winningTrades.length,
        losingTrades: losingTrades.length,
        avgWin,
        avgLoss,
        currentBalance: (openingBalance || 0) + totalPnl,
      },
      pnlByCategory,
      chartData,
      recentTrades: trades?.slice(0, 10) || [],
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
