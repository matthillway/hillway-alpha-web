import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client with user's session
async function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseAnonKey);
}

// GET /api/opportunities - List opportunities with filtering
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient();
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const category = searchParams.get("category"); // arbitrage, value_bet, stock, crypto
    const status = searchParams.get("status") || "open";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build query
    let query = supabase
      .from("opportunities")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (category) {
      query = query.eq("category", category);
    }

    if (status) {
      query = query.eq("status", status);
    }

    // Only show non-expired opportunities
    query = query.or(
      `expires_at.is.null,expires_at.gt.${new Date().toISOString()}`,
    );

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching opportunities:", error);
      return NextResponse.json(
        { error: "Failed to fetch opportunities" },
        { status: 500 },
      );
    }

    const response = NextResponse.json({
      opportunities: data || [],
      total: count || 0,
      limit,
      offset,
    });

    response.headers.set(
      "Cache-Control",
      "private, s-maxage=30, stale-while-revalidate=15",
    );

    return response;
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
