import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export type NotificationPreferences = {
  email_alerts_enabled: boolean;
  whatsapp_alerts_enabled: boolean;
  alert_frequency: "realtime" | "hourly" | "daily" | "weekly";
  whatsapp_number: string | null;
};

// GET /api/settings/notifications - Get user's notification preferences
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error fetching notification preferences:", error);
      return NextResponse.json(
        { error: "Failed to fetch preferences" },
        { status: 500 },
      );
    }

    // Return defaults if no preferences exist
    const preferences: NotificationPreferences = data || {
      email_alerts_enabled: true,
      whatsapp_alerts_enabled: false,
      alert_frequency: "realtime",
      whatsapp_number: null,
    };

    return NextResponse.json(preferences);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/settings/notifications - Save user's notification preferences
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const {
      email_alerts_enabled,
      whatsapp_alerts_enabled,
      alert_frequency,
      whatsapp_number,
    } = body;

    // Validate alert_frequency
    const validFrequencies = ["realtime", "hourly", "daily", "weekly"];
    if (alert_frequency && !validFrequencies.includes(alert_frequency)) {
      return NextResponse.json(
        { error: "Invalid alert frequency" },
        { status: 400 },
      );
    }

    // Validate WhatsApp number format if provided
    if (whatsapp_number) {
      // Basic validation: should start with + and contain only digits after
      const phoneRegex = /^\+[1-9]\d{6,14}$/;
      if (!phoneRegex.test(whatsapp_number)) {
        return NextResponse.json(
          {
            error:
              "Invalid phone number format. Please use international format (e.g., +447123456789)",
          },
          { status: 400 },
        );
      }
    }

    // Check if user has Pro or higher tier for WhatsApp
    if (whatsapp_alerts_enabled) {
      const { data: userData } = await supabase
        .from("users")
        .select("subscription_tier")
        .eq("id", user.id)
        .single();

      const tier = userData?.subscription_tier || "free";
      if (tier === "free" || tier === "starter") {
        return NextResponse.json(
          { error: "WhatsApp alerts require Pro or Enterprise subscription" },
          { status: 403 },
        );
      }
    }

    // Upsert the preferences
    const { data, error } = await supabase
      .from("notification_preferences")
      .upsert(
        {
          user_id: user.id,
          email_alerts_enabled:
            email_alerts_enabled !== undefined ? email_alerts_enabled : true,
          whatsapp_alerts_enabled:
            whatsapp_alerts_enabled !== undefined
              ? whatsapp_alerts_enabled
              : false,
          alert_frequency: alert_frequency || "realtime",
          whatsapp_number: whatsapp_number || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      )
      .select()
      .single();

    if (error) {
      console.error("Error saving notification preferences:", error);
      return NextResponse.json(
        { error: "Failed to save preferences" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      preferences: data,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
