import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  createPlatformClient,
  Platform,
  PlatformCredentials,
} from "@/lib/platforms";
import { decryptIfPresent, encryptIfPresent } from "@/lib/encryption";
import { BetfairClient } from "@/lib/platforms/betfair";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/**
 * GET /api/cron/sync-platforms
 * Daily cron job to sync all linked accounts
 * Called by Vercel Cron
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    // Get all active linked accounts
    const { data: accounts, error: accountsError } = await supabase
      .from("linked_accounts")
      .select("*")
      .eq("is_active", true);

    if (accountsError) {
      console.error("Error fetching linked accounts:", accountsError);
      return NextResponse.json(
        { error: "Failed to fetch linked accounts" },
        { status: 500 },
      );
    }

    if (!accounts || accounts.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No linked accounts to sync",
        synced: 0,
        failed: 0,
      });
    }

    let synced = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const account of accounts) {
      const platform = account.platform as Platform;
      let credentials: PlatformCredentials = {};

      try {
        // Handle Betfair token refresh if needed
        if (platform === "betfair") {
          let accessToken = decryptIfPresent(account.access_token);
          const refreshToken = decryptIfPresent(account.refresh_token);

          // Check if token needs refresh
          if (account.expires_at && new Date(account.expires_at) < new Date()) {
            if (!refreshToken) {
              await supabase
                .from("linked_accounts")
                .update({
                  sync_error: "Token expired - reconnection required",
                  is_active: false,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", account.id);
              failed++;
              errors.push(`${platform}: Token expired`);
              continue;
            }

            try {
              const tokens =
                await BetfairClient.refreshAccessToken(refreshToken);
              accessToken = tokens.accessToken;

              await supabase
                .from("linked_accounts")
                .update({
                  access_token: encryptIfPresent(tokens.accessToken),
                  refresh_token: encryptIfPresent(tokens.refreshToken),
                  expires_at: new Date(
                    Date.now() + tokens.expiresIn * 1000,
                  ).toISOString(),
                  updated_at: new Date().toISOString(),
                })
                .eq("id", account.id);
            } catch (refreshError) {
              console.error(
                `Token refresh error for user ${account.user_id}:`,
                refreshError,
              );
              await supabase
                .from("linked_accounts")
                .update({
                  sync_error: "Token refresh failed",
                  is_active: false,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", account.id);
              failed++;
              errors.push(`${platform}: Token refresh failed`);
              continue;
            }
          }

          credentials = { accessToken };
        } else {
          credentials = {
            apiKey: decryptIfPresent(account.api_key),
            apiSecret: decryptIfPresent(account.api_secret),
          };
        }

        // Create client and fetch data
        const client = createPlatformClient(platform, credentials);
        const balance = await client.getBalance();
        const positions = await client.getPositions();
        const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const trades = await client.getTradeHistory(since);

        // Update user portfolio with real balance if available
        if (balance) {
          // Check if user has a portfolio
          const { data: portfolio } = await supabase
            .from("user_portfolios")
            .select("id")
            .eq("user_id", account.user_id)
            .single();

          if (portfolio) {
            // We could update portfolio balances here
            // For now, just log the sync
            console.log(
              `Synced ${platform} for user ${account.user_id}: Balance ${balance.currency} ${balance.total}`,
            );
          }
        }

        // Import trades to user_trades table
        for (const trade of trades) {
          // Check if trade already exists
          const { data: existingTrade } = await supabase
            .from("user_trades")
            .select("id")
            .eq("user_id", account.user_id)
            .eq("external_id", `${platform}-${trade.id}`)
            .single();

          if (!existingTrade) {
            // Calculate P&L for closed trades
            const pnl = trade.fee ? -trade.fee : 0;

            await supabase.from("user_trades").insert({
              user_id: account.user_id,
              external_id: `${platform}-${trade.id}`,
              category: platform === "betfair" ? "arbitrage" : platform,
              title: trade.symbol,
              entry_amount: trade.quantity * trade.price,
              exit_amount: trade.quantity * trade.price - (trade.fee || 0),
              pnl,
              pnl_percent: 0,
              status: "closed",
              notes: `Imported from ${platform}`,
              opened_at: trade.executedAt.toISOString(),
              closed_at: trade.executedAt.toISOString(),
            });
          }
        }

        // Update last sync time
        await supabase
          .from("linked_accounts")
          .update({
            last_sync_at: new Date().toISOString(),
            sync_error: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", account.id);

        synced++;
      } catch (syncError) {
        console.error(
          `Sync error for ${platform} (user ${account.user_id}):`,
          syncError,
        );
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

        failed++;
        errors.push(`${platform}: ${errorMessage}`);
      }
    }

    return NextResponse.json({
      success: true,
      synced,
      failed,
      total: accounts.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Cron sync-platforms error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
