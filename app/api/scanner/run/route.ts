import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Tier limits
const TIER_LIMITS: Record<string, number> = {
  free: 0, // No scans for free users
  starter: 100, // 100 scans per day
  pro: 1000, // 1000 scans per day
  enterprise: -1, // Unlimited
};

// POST /api/scanner/run - Trigger a scan
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    const { scanType, userId, userTier = "free" } = body;

    if (!scanType) {
      return NextResponse.json(
        { error: "scanType is required" },
        { status: 400 },
      );
    }

    // Validate scan type
    const validTypes = ["arbitrage", "value_bets", "stocks", "crypto", "all"];
    if (!validTypes.includes(scanType)) {
      return NextResponse.json(
        { error: `Invalid scanType. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 },
      );
    }

    // Check tier limits
    const dailyLimit = TIER_LIMITS[userTier];

    if (dailyLimit === 0) {
      return NextResponse.json(
        {
          error:
            "Free tier does not include scanning. Please upgrade to Starter or higher.",
          code: "TIER_LIMIT_FREE",
        },
        { status: 403 },
      );
    }

    // Check usage for the day (if not enterprise)
    if (dailyLimit !== -1 && userId) {
      const today = new Date().toISOString().split("T")[0];

      const { data: usage } = await supabase
        .from("user_usage")
        .select("scans_used")
        .eq("user_id", userId)
        .eq("date", today)
        .single();

      const scansUsed = usage?.scans_used || 0;

      if (scansUsed >= dailyLimit) {
        return NextResponse.json(
          {
            error: `Daily scan limit reached (${dailyLimit}). Resets at midnight UTC.`,
            code: "TIER_LIMIT_REACHED",
            used: scansUsed,
            limit: dailyLimit,
          },
          { status: 429 },
        );
      }

      // Increment usage
      await supabase.from("user_usage").upsert(
        {
          user_id: userId,
          date: today,
          scans_used: scansUsed + 1,
        },
        { onConflict: "user_id,date" },
      );
    }

    // In a production setup, this would call the hillway-alpha scanner API
    // For now, we'll return the latest opportunities from the database

    let query = supabase
      .from("opportunities")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(20);

    // Filter by category if specific scan type
    if (scanType !== "all") {
      const categoryMap: Record<string, string> = {
        arbitrage: "arbitrage",
        value_bets: "value_bet",
        stocks: "stock",
        crypto: "crypto",
      };
      query = query.eq("category", categoryMap[scanType]);
    }

    const { data: opportunities, error } = await query;

    if (error) {
      console.error("Error fetching opportunities:", error);
      return NextResponse.json({ error: "Scan failed" }, { status: 500 });
    }

    // In a real implementation, we'd trigger the actual scanner here
    // and wait for results or return a job ID for polling

    return NextResponse.json({
      success: true,
      scanType,
      timestamp: new Date().toISOString(),
      opportunities: opportunities || [],
      count: opportunities?.length || 0,
      message: `Found ${opportunities?.length || 0} ${scanType} opportunities`,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
