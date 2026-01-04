import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import {
  createPlatformClient,
  Platform,
  PlatformCredentials,
} from "@/lib/platforms";
import { decryptIfPresent, encryptIfPresent } from "@/lib/encryption";
import { BetfairClient } from "@/lib/platforms/betfair";

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

interface SyncResult {
  platform: Platform;
  success: boolean;
  balance?: {
    available: number;
    exposure: number;
    total: number;
    currency: string;
  };
  positionsCount?: number;
  tradesCount?: number;
  error?: string;
}

/**
 * GET /api/platforms/sync-all
 * Sync all linked accounts for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    // Get all active linked accounts
    const { data: accounts, error: accountsError } = await supabase
      .from("linked_accounts")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true);

    if (accountsError) {
      console.error("Error fetching linked accounts:", accountsError);
      return NextResponse.json(
        { error: "Failed to fetch linked accounts" },
        { status: 500 },
      );
    }

    if (!accounts || accounts.length === 0) {
      return NextResponse.json({ results: [], message: "No linked accounts" });
    }

    const results: SyncResult[] = [];

    for (const account of accounts) {
      const platform = account.platform as Platform;
      let credentials: PlatformCredentials = {};

      // Handle Betfair token refresh if needed
      if (platform === "betfair") {
        let accessToken = decryptIfPresent(account.access_token);
        const refreshToken = decryptIfPresent(account.refresh_token);

        // Check if token needs refresh
        if (account.expires_at && new Date(account.expires_at) < new Date()) {
          if (!refreshToken) {
            results.push({
              platform,
              success: false,
              error: "Token expired and no refresh token available",
            });
            continue;
          }

          try {
            const tokens = await BetfairClient.refreshAccessToken(refreshToken);
            accessToken = tokens.accessToken;

            // Update stored tokens
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
            console.error(`Token refresh error for ${platform}:`, refreshError);
            await supabase
              .from("linked_accounts")
              .update({
                sync_error: "Failed to refresh token",
                is_active: false,
                updated_at: new Date().toISOString(),
              })
              .eq("id", account.id);

            results.push({
              platform,
              success: false,
              error: "Failed to refresh token",
            });
            continue;
          }
        }

        credentials = { accessToken };
      } else {
        // API key-based platforms
        credentials = {
          apiKey: decryptIfPresent(account.api_key),
          apiSecret: decryptIfPresent(account.api_secret),
        };
      }

      // Sync platform data
      try {
        const client = createPlatformClient(platform, credentials);
        const balance = await client.getBalance();
        const positions = await client.getPositions();
        const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const trades = await client.getTradeHistory(since);

        // Update last sync time
        await supabase
          .from("linked_accounts")
          .update({
            last_sync_at: new Date().toISOString(),
            sync_error: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", account.id);

        results.push({
          platform,
          success: true,
          balance,
          positionsCount: positions.length,
          tradesCount: trades.length,
        });
      } catch (syncError) {
        console.error(`Sync error for ${platform}:`, syncError);
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

        results.push({
          platform,
          success: false,
          error: errorMessage,
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Sync-all error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
