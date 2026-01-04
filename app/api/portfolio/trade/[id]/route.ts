import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseAnonKey);
}

// PATCH /api/portfolio/trade/[id] - Close a trade with result
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;
    const body = await request.json();

    const { exitAmount, status, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Trade ID is required" },
        { status: 400 },
      );
    }

    // Fetch existing trade to get entry_amount
    const { data: existingTrade, error: fetchError } = await supabase
      .from("user_trades")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingTrade) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    // Prepare update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    // If closing the trade
    if (status === "closed" && typeof exitAmount === "number") {
      const entryAmount = existingTrade.entry_amount || 0;
      const pnl = exitAmount - entryAmount;
      const pnlPercent = entryAmount > 0 ? (pnl / entryAmount) * 100 : 0;

      updateData.status = "closed";
      updateData.exit_amount = exitAmount;
      updateData.pnl = pnl;
      updateData.pnl_percent = pnlPercent;
      updateData.closed_at = new Date().toISOString();

      // Update user's current balance in portfolio
      const { data: portfolio } = await supabase
        .from("user_portfolios")
        .select("current_balance")
        .eq("user_id", existingTrade.user_id)
        .single();

      if (portfolio) {
        await supabase
          .from("user_portfolios")
          .update({
            current_balance: (portfolio.current_balance || 0) + pnl,
          })
          .eq("user_id", existingTrade.user_id);
      }
    } else if (status === "cancelled") {
      updateData.status = "cancelled";
      updateData.closed_at = new Date().toISOString();
    }

    // Update the trade
    const { data, error } = await supabase
      .from("user_trades")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating trade:", error);
      return NextResponse.json(
        { error: "Failed to update trade" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET /api/portfolio/trade/[id] - Get a specific trade
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Trade ID is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("user_trades")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/portfolio/trade/[id] - Delete a trade
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Trade ID is required" },
        { status: 400 },
      );
    }

    // Fetch existing trade
    const { data: existingTrade, error: fetchError } = await supabase
      .from("user_trades")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existingTrade) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    // If trade was closed, reverse the P&L impact on portfolio
    if (existingTrade.status === "closed" && existingTrade.pnl) {
      const { data: portfolio } = await supabase
        .from("user_portfolios")
        .select("current_balance")
        .eq("user_id", existingTrade.user_id)
        .single();

      if (portfolio) {
        await supabase
          .from("user_portfolios")
          .update({
            current_balance:
              (portfolio.current_balance || 0) - existingTrade.pnl,
          })
          .eq("user_id", existingTrade.user_id);
      }
    }

    const { error } = await supabase.from("user_trades").delete().eq("id", id);

    if (error) {
      console.error("Error deleting trade:", error);
      return NextResponse.json(
        { error: "Failed to delete trade" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
