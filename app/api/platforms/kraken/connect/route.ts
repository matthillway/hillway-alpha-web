import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { KrakenClient } from "@/lib/platforms/kraken";
import { encryptIfPresent } from "@/lib/encryption";

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
 * POST /api/platforms/kraken/connect
 * Connect Kraken account using API key and secret
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { apiKey, apiSecret } = body;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "API key and secret are required" },
        { status: 400 },
      );
    }

    // Validate credentials by attempting to fetch balance
    const client = new KrakenClient({ apiKey, apiSecret });
    let isValid = false;
    try {
      isValid = await client.validateCredentials();
    } catch (validationError) {
      console.error("Kraken validation error:", validationError);
      return NextResponse.json(
        {
          error:
            "Invalid API credentials. Please check your key and secret are correct.",
        },
        { status: 400 },
      );
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid API credentials" },
        { status: 400 },
      );
    }

    // Encrypt credentials
    const encryptedApiKey = encryptIfPresent(apiKey);
    const encryptedApiSecret = encryptIfPresent(apiSecret);

    const supabase = getSupabaseAdmin();

    // Upsert linked account
    const { error: upsertError } = await supabase
      .from("linked_accounts")
      .upsert(
        {
          user_id: user.id,
          platform: "kraken",
          api_key: encryptedApiKey,
          api_secret: encryptedApiSecret,
          is_active: true,
          sync_error: null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,platform",
        },
      );

    if (upsertError) {
      console.error("Error saving Kraken account:", upsertError);
      return NextResponse.json(
        { error: "Failed to save account" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Kraken connect error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
