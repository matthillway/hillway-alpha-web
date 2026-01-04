import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { KrakenClient } from "@/lib/platforms/kraken";
import { decryptIfPresent } from "@/lib/encryption";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }
  return user;
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/**
 * GET /api/platforms/kraken/sync
 * Sync data from Kraken
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    // Get linked account
    const { data: account, error: accountError } = await supabase
      .from("linked_accounts")
      .select("*")
      .eq("user_id", user.id)
      .eq("platform", "kraken")
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        { error: "Kraken account not connected" },
        { status: 404 },
      );
    }

    // Decrypt credentials
    const apiKey = decryptIfPresent(account.api_key);
    const apiSecret = decryptIfPresent(account.api_secret);

    if (!apiKey || !apiSecret) {
      await supabase
        .from("linked_accounts")
        .update({
          sync_error: "Invalid stored credentials",
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", account.id);

      return NextResponse.json(
        { error: "Invalid credentials. Please reconnect your account." },
        { status: 401 },
      );
    }

    // Create client and fetch data
    const client = new KrakenClient({ apiKey, apiSecret });

    let balance, positions, trades;
    try {
      balance = await client.getBalance();
      positions = await client.getPositions();
      // Get trades from last 30 days
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      trades = await client.getTradeHistory(since);
    } catch (syncError) {
      console.error("Kraken sync error:", syncError);
      const errorMessage =
        syncError instanceof Error ? syncError.message : "Sync failed";

      await supabase
        .from("linked_accounts")
        .update({
          sync_error: errorMessage,
          last_sync_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", account.id);

      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    // Update last sync time and clear errors
    await supabase
      .from("linked_accounts")
      .update({
        last_sync_at: new Date().toISOString(),
        sync_error: null,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", account.id);

    return NextResponse.json({
      success: true,
      balance,
      positions,
      tradesCount: trades.length,
    });
  } catch (error) {
    console.error("Kraken sync error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
