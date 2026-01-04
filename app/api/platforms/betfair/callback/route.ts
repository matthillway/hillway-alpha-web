import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { BetfairClient } from "@/lib/platforms/betfair";
import { encryptIfPresent } from "@/lib/encryption";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/**
 * GET /api/platforms/betfair/callback
 * OAuth callback handler for Betfair
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Redirect URL for success/failure
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const settingsUrl = `${baseUrl}/settings/linked-accounts`;

    if (error) {
      console.error("Betfair OAuth error:", error);
      return NextResponse.redirect(
        `${settingsUrl}?error=Betfair+authorization+denied`,
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${settingsUrl}?error=Invalid+callback+parameters`,
      );
    }

    const supabase = getSupabaseAdmin();

    // Verify state and get user
    const { data: oauthState, error: stateError } = await supabase
      .from("oauth_states")
      .select("*")
      .eq("state", state)
      .eq("platform", "betfair")
      .single();

    if (stateError || !oauthState) {
      console.error("Invalid OAuth state:", stateError);
      return NextResponse.redirect(
        `${settingsUrl}?error=Invalid+or+expired+state`,
      );
    }

    // Check if state has expired
    if (new Date(oauthState.expires_at) < new Date()) {
      await supabase.from("oauth_states").delete().eq("id", oauthState.id);
      return NextResponse.redirect(
        `${settingsUrl}?error=OAuth+session+expired`,
      );
    }

    // Delete used state
    await supabase.from("oauth_states").delete().eq("id", oauthState.id);

    // Exchange code for tokens
    let tokens;
    try {
      tokens = await BetfairClient.exchangeCodeForToken(code);
    } catch (tokenError) {
      console.error("Token exchange error:", tokenError);
      return NextResponse.redirect(
        `${settingsUrl}?error=Failed+to+get+access+token`,
      );
    }

    // Encrypt tokens before storage
    const encryptedAccessToken = encryptIfPresent(tokens.accessToken);
    const encryptedRefreshToken = encryptIfPresent(tokens.refreshToken);
    const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);

    // Validate credentials work
    try {
      const client = new BetfairClient({ accessToken: tokens.accessToken });
      const isValid = await client.validateCredentials();
      if (!isValid) {
        return NextResponse.redirect(
          `${settingsUrl}?error=Invalid+Betfair+credentials`,
        );
      }
    } catch (validationError) {
      console.error("Credential validation error:", validationError);
      return NextResponse.redirect(
        `${settingsUrl}?error=Failed+to+validate+credentials`,
      );
    }

    // Upsert linked account
    const { error: upsertError } = await supabase
      .from("linked_accounts")
      .upsert(
        {
          user_id: oauthState.user_id,
          platform: "betfair",
          access_token: encryptedAccessToken,
          refresh_token: encryptedRefreshToken,
          expires_at: expiresAt.toISOString(),
          is_active: true,
          sync_error: null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,platform",
        },
      );

    if (upsertError) {
      console.error("Error saving linked account:", upsertError);
      return NextResponse.redirect(
        `${settingsUrl}?error=Failed+to+save+connection`,
      );
    }

    return NextResponse.redirect(`${settingsUrl}?success=betfair`);
  } catch (error) {
    console.error("Betfair callback error:", error);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(
      `${baseUrl}/settings/linked-accounts?error=Connection+failed`,
    );
  }
}
