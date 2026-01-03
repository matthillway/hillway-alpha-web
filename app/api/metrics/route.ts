import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseAnonKey);
}

// GET /api/metrics - Dashboard metrics
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString();

    // Fetch all data in parallel
    const [
      todayOpportunities,
      openPositions,
      weeklyMetrics,
      categoryBreakdown,
    ] = await Promise.all([
      // Today's opportunities
      supabase
        .from("opportunities")
        .select("*", { count: "exact" })
        .gte("created_at", `${today}T00:00:00`)
        .eq("status", "open"),

      // Open positions with P&L
      supabase.from("positions").select("*").eq("status", "open"),

      // Weekly metrics
      supabase
        .from("daily_metrics")
        .select("*")
        .gte("date", weekAgo.split("T")[0]),

      // Category breakdown of opportunities
      supabase
        .from("opportunities")
        .select("category")
        .gte("created_at", `${today}T00:00:00`)
        .eq("status", "open"),
    ]);

    // Calculate totals
    const todayCount = todayOpportunities.count || 0;
    const openCount = openPositions.data?.length || 0;

    // Calculate week P&L
    const weekPnl =
      weeklyMetrics.data?.reduce((sum, m) => sum + (m.gross_pnl || 0), 0) || 0;

    // Calculate total P&L from closed positions
    const { data: closedPositions } = await supabase
      .from("positions")
      .select("pnl")
      .eq("status", "closed");

    const totalPnl =
      closedPositions?.reduce((sum, p) => sum + (p.pnl || 0), 0) || 0;

    // Category counts
    const categoryCounts =
      categoryBreakdown.data?.reduce(
        (acc, opp) => {
          acc[opp.category] = (acc[opp.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ) || {};

    // Best opportunity margin
    const bestOpportunity = todayOpportunities.data?.reduce(
      (best, opp) => {
        const margin = opp.data?.margin || opp.expected_value || 0;
        if (!best || margin > best.margin) {
          return { ...opp, margin };
        }
        return best;
      },
      null as Record<string, unknown> | null,
    );

    // Win rate calculation
    const { data: allClosedPositions } = await supabase
      .from("positions")
      .select("pnl")
      .eq("status", "closed");

    const wins =
      allClosedPositions?.filter((p) => (p.pnl || 0) > 0).length || 0;
    const totalClosed = allClosedPositions?.length || 0;
    const winRate = totalClosed > 0 ? (wins / totalClosed) * 100 : 0;

    return NextResponse.json({
      today: {
        opportunities: todayCount,
        byCategory: categoryCounts,
        bestMargin: bestOpportunity?.margin || 0,
      },
      positions: {
        open: openCount,
        openValue:
          openPositions.data?.reduce(
            (sum, p) => sum + (p.stake_amount || 0),
            0,
          ) || 0,
      },
      performance: {
        weekPnl,
        totalPnl,
        winRate: Math.round(winRate * 10) / 10,
        totalTrades: totalClosed,
      },
      summary: {
        todayOpportunities: todayCount,
        openPositions: openCount,
        weekPnl,
        totalPnl,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
