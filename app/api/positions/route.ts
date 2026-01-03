import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseAnonKey);
}

// GET /api/positions - List positions
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status"); // open, closed, stopped
    const assetClass = searchParams.get("asset_class");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("positions")
      .select("*, opportunities(title, category)", { count: "exact" })
      .order("opened_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    if (assetClass) {
      query = query.eq("asset_class", assetClass);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching positions:", error);
      return NextResponse.json(
        { error: "Failed to fetch positions" },
        { status: 500 },
      );
    }

    // Calculate summary stats
    const openPositions = data?.filter((p) => p.status === "open") || [];
    const closedPositions = data?.filter((p) => p.status === "closed") || [];
    const totalPnl = closedPositions.reduce((sum, p) => sum + (p.pnl || 0), 0);
    const openValue = openPositions.reduce(
      (sum, p) => sum + (p.stake_amount || 0),
      0,
    );

    return NextResponse.json({
      positions: data || [],
      total: count || 0,
      summary: {
        openCount: openPositions.length,
        closedCount: closedPositions.length,
        totalPnl,
        openValue,
      },
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

// POST /api/positions - Create a new position
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();

    const { opportunity_id, stake_amount, entry_price, asset_class, notes } =
      body;

    if (!opportunity_id || !stake_amount) {
      return NextResponse.json(
        { error: "opportunity_id and stake_amount are required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("positions")
      .insert({
        opportunity_id,
        stake_amount,
        entry_price,
        asset_class,
        notes,
        status: "open",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating position:", error);
      return NextResponse.json(
        { error: "Failed to create position" },
        { status: 500 },
      );
    }

    // Update opportunity status to 'taken'
    await supabase
      .from("opportunities")
      .update({ status: "taken" })
      .eq("id", opportunity_id);

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
