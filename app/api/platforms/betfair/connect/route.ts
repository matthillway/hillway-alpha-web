import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { randomBytes } from "crypto";
import { BetfairClient } from "@/lib/platforms/betfair";

// Get authenticated user from session
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
 * POST /api/platforms/betfair/connect
 * Start Betfair OAuth flow - generates state and returns auth URL
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if Betfair OAuth is configured
    if (!process.env.BETFAIR_CLIENT_ID || !process.env.BETFAIR_CLIENT_SECRET) {
      return NextResponse.json(
        {
          error:
            "Betfair OAuth is not configured. Please contact support to set up your Betfair integration.",
        },
        { status: 503 },
      );
    }

    const supabase = getSupabaseAdmin();

    // Generate state for CSRF protection
    const state = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store state in database
    const { error: stateError } = await supabase.from("oauth_states").insert({
      user_id: user.id,
      state,
      platform: "betfair",
      expires_at: expiresAt.toISOString(),
    });

    if (stateError) {
      console.error("Error storing OAuth state:", stateError);
      return NextResponse.json(
        { error: "Failed to initiate OAuth flow" },
        { status: 500 },
      );
    }

    // Generate authorization URL
    const authUrl = BetfairClient.getAuthorizationUrl(state);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error("Betfair connect error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
