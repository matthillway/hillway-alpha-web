import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseAnonKey);
}

// POST /api/portfolio/trade - Record a trade
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();

    const { userId, opportunityId, category, title, entryAmount, notes } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "category is required" },
        { status: 400 },
      );
    }

    if (typeof entryAmount !== "number" || entryAmount <= 0) {
      return NextResponse.json(
        { error: "entryAmount must be a positive number" },
        { status: 400 },
      );
    }

    const validCategories = [
      "arbitrage",
      "stock",
      "crypto",
      "value_bet",
      "other",
    ];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `category must be one of: ${validCategories.join(", ")}` },
        { status: 400 },
      );
    }

    // Create the trade
    const { data, error } = await supabase
      .from("user_trades")
      .insert({
        user_id: userId,
        opportunity_id: opportunityId || null,
        category,
        title: title || null,
        entry_amount: entryAmount,
        status: "open",
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating trade:", error);
      return NextResponse.json(
        { error: "Failed to create trade" },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET /api/portfolio/trade - List trades
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    let query = supabase
      .from("user_trades")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("opened_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching trades:", error);
      return NextResponse.json(
        { error: "Failed to fetch trades" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      trades: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
