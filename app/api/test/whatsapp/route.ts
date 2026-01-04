// ============================================
// HILLWAY ALPHA - WhatsApp Test Endpoint
// Admin-only endpoint to verify Twilio configuration
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { isUserSuperAdmin } from "@/lib/admin";
import {
  sendWhatsAppMessage,
  isTwilioConfigured,
} from "@/lib/whatsapp/twilio-client";
import { formatTestMessage } from "@/lib/whatsapp/message-templates";

export const runtime = "nodejs";

/**
 * POST /api/test/whatsapp
 * Send a test WhatsApp message (admin only)
 *
 * Body:
 * - phone_number: string (optional) - E.164 format, defaults to user's configured number
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = await isUserSuperAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    // Check Twilio configuration
    if (!isTwilioConfigured()) {
      return NextResponse.json(
        {
          error: "Twilio not configured",
          details:
            "Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM environment variables",
          configured: {
            accountSid: Boolean(process.env.TWILIO_ACCOUNT_SID),
            authToken: Boolean(process.env.TWILIO_AUTH_TOKEN),
            whatsappFrom: Boolean(process.env.TWILIO_WHATSAPP_FROM),
          },
        },
        { status: 503 },
      );
    }

    // Get phone number from request body or user preferences
    let phoneNumber: string | null = null;

    try {
      const body = await request.json();
      phoneNumber = body.phone_number;
    } catch {
      // No body provided, will use user's configured number
    }

    // If no phone provided, try to get from user's notification preferences
    if (!phoneNumber) {
      const { data: prefs } = await supabase
        .from("notification_preferences")
        .select("whatsapp_number")
        .eq("user_id", user.id)
        .single();

      phoneNumber = prefs?.whatsapp_number;
    }

    if (!phoneNumber) {
      return NextResponse.json(
        {
          error: "No phone number provided",
          details:
            "Provide phone_number in request body or configure in notification preferences",
        },
        { status: 400 },
      );
    }

    // Validate phone format
    if (!phoneNumber.match(/^\+[1-9]\d{6,14}$/)) {
      return NextResponse.json(
        {
          error: "Invalid phone number format",
          details: "Use E.164 format (e.g., +447123456789)",
        },
        { status: 400 },
      );
    }

    // Send test message
    const testMessage = formatTestMessage();
    const result = await sendWhatsAppMessage(phoneNumber, testMessage);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test message sent successfully",
        messageSid: result.messageSid,
        sentTo: phoneNumber.substring(0, 4) + "****" + phoneNumber.slice(-2),
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          details:
            "Check Twilio console for more details. Common issues: sandbox not joined, invalid number.",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("WhatsApp test error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/test/whatsapp
 * Check WhatsApp/Twilio configuration status (admin only)
 */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await isUserSuperAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const configured = isTwilioConfigured();

    return NextResponse.json({
      configured,
      status: configured ? "ready" : "not_configured",
      configuration: {
        accountSid: process.env.TWILIO_ACCOUNT_SID
          ? "****" + process.env.TWILIO_ACCOUNT_SID.slice(-4)
          : null,
        authToken: process.env.TWILIO_AUTH_TOKEN ? "configured" : null,
        whatsappFrom: process.env.TWILIO_WHATSAPP_FROM || null,
      },
      instructions: !configured
        ? [
            "1. Create a Twilio account at https://www.twilio.com/",
            "2. Enable WhatsApp sandbox or get approved number",
            "3. Add TWILIO_ACCOUNT_SID to environment variables",
            "4. Add TWILIO_AUTH_TOKEN to environment variables",
            "5. Add TWILIO_WHATSAPP_FROM (e.g., whatsapp:+14155238886 for sandbox)",
          ]
        : null,
    });
  } catch (error) {
    console.error("WhatsApp config check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
