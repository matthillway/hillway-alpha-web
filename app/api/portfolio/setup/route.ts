import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseAnonKey);
}

// POST /api/portfolio/setup - Set opening bankroll
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();

    const { userId, openingBalance } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    if (typeof openingBalance !== "number" || openingBalance < 0) {
      return NextResponse.json(
        { error: "openingBalance must be a non-negative number" },
        { status: 400 },
      );
    }

    // Check if portfolio already exists
    const { data: existingPortfolio } = await supabase
      .from("user_portfolios")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existingPortfolio) {
      // Update existing portfolio
      const { data, error } = await supabase
        .from("user_portfolios")
        .update({
          opening_balance: openingBalance,
          current_balance: openingBalance,
        })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating portfolio:", error);
        return NextResponse.json(
          { error: "Failed to update portfolio" },
          { status: 500 },
        );
      }

      return NextResponse.json(data);
    }

    // Create new portfolio
    const { data, error } = await supabase
      .from("user_portfolios")
      .insert({
        user_id: userId,
        opening_balance: openingBalance,
        current_balance: openingBalance,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating portfolio:", error);
      return NextResponse.json(
        { error: "Failed to create portfolio" },
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
