// ============================================
// HILLWAY ALPHA - WhatsApp Notification Sender
// Handles user-specific WhatsApp alerts
// ============================================

import { createClient } from "@supabase/supabase-js";
import {
  sendWhatsAppMessage,
  sendWhatsAppMessageThrottled,
  isTwilioConfigured,
} from "./twilio-client";
import {
  formatOpportunityAlert,
  formatDailyDigest,
  formatUrgentAlert,
  type Opportunity,
  type DailyMetrics,
} from "./message-templates";

// Supabase admin client for server-side operations
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export interface UserNotificationPrefs {
  user_id: string;
  email_alerts_enabled: boolean;
  whatsapp_alerts_enabled: boolean;
  alert_frequency: "realtime" | "hourly" | "daily" | "weekly";
  whatsapp_number: string | null;
}

export interface UserData {
  id: string;
  email: string;
  subscription_tier: "free" | "starter" | "pro" | "enterprise";
}

/**
 * Check if user can receive WhatsApp alerts
 * Requirements: Pro+ subscription, WhatsApp enabled, valid phone number
 */
async function canReceiveWhatsApp(
  userId: string,
): Promise<{ allowed: boolean; reason?: string; phone?: string }> {
  const supabase = getSupabaseAdmin();

  // Get user tier
  const { data: userData } = await supabase
    .from("users")
    .select("subscription_tier")
    .eq("id", userId)
    .single();

  const tier = userData?.subscription_tier || "free";

  // WhatsApp is Pro+ feature
  if (tier === "free" || tier === "starter") {
    return {
      allowed: false,
      reason: "WhatsApp alerts require Pro or Enterprise subscription",
    };
  }

  // Get notification preferences
  const { data: prefs } = await supabase
    .from("notification_preferences")
    .select("whatsapp_alerts_enabled, whatsapp_number")
    .eq("user_id", userId)
    .single();

  if (!prefs?.whatsapp_alerts_enabled) {
    return { allowed: false, reason: "WhatsApp alerts not enabled" };
  }

  if (!prefs?.whatsapp_number) {
    return { allowed: false, reason: "No WhatsApp number configured" };
  }

  return { allowed: true, phone: prefs.whatsapp_number };
}

/**
 * Get user's alert frequency preference
 */
async function getUserAlertFrequency(
  userId: string,
): Promise<"realtime" | "hourly" | "daily" | "weekly"> {
  const supabase = getSupabaseAdmin();

  const { data } = await supabase
    .from("notification_preferences")
    .select("alert_frequency")
    .eq("user_id", userId)
    .single();

  return data?.alert_frequency || "realtime";
}

export interface SendAlertResult {
  success: boolean;
  sent: boolean;
  messageSid?: string;
  reason?: string;
}

/**
 * Send a real-time opportunity alert to a specific user
 */
export async function sendWhatsAppAlert(
  userId: string,
  opportunity: Opportunity,
): Promise<SendAlertResult> {
  // Check Twilio configuration
  if (!isTwilioConfigured()) {
    return {
      success: false,
      sent: false,
      reason: "Twilio not configured",
    };
  }

  // Check user eligibility
  const eligibility = await canReceiveWhatsApp(userId);
  if (!eligibility.allowed) {
    return {
      success: true, // Not an error, just not eligible
      sent: false,
      reason: eligibility.reason,
    };
  }

  // Check alert frequency - only send for realtime users
  const frequency = await getUserAlertFrequency(userId);
  if (frequency !== "realtime") {
    return {
      success: true,
      sent: false,
      reason: `User prefers ${frequency} alerts`,
    };
  }

  // Format and send message
  const isUrgent =
    (opportunity.margin && opportunity.margin >= 3) ||
    (opportunity.confidence && opportunity.confidence >= 80) ||
    (opportunity.data?.annualizedRate &&
      opportunity.data.annualizedRate >= 100);

  const message = isUrgent
    ? formatUrgentAlert(opportunity)
    : formatOpportunityAlert(opportunity);

  const result = await sendWhatsAppMessage(eligibility.phone!, message);

  return {
    success: result.success,
    sent: result.success,
    messageSid: result.messageSid,
    reason: result.error,
  };
}

/**
 * Send daily digest to a specific user
 */
export async function sendWhatsAppDigest(
  userId: string,
  opportunities: Opportunity[],
  metrics?: Partial<DailyMetrics>,
): Promise<SendAlertResult> {
  // Check Twilio configuration
  if (!isTwilioConfigured()) {
    return {
      success: false,
      sent: false,
      reason: "Twilio not configured",
    };
  }

  // Check user eligibility
  const eligibility = await canReceiveWhatsApp(userId);
  if (!eligibility.allowed) {
    return {
      success: true,
      sent: false,
      reason: eligibility.reason,
    };
  }

  // Build full metrics
  const fullMetrics: DailyMetrics = {
    totalOpportunities: opportunities.length,
    arbitrageCount: opportunities.filter((o) => o.type === "arbitrage").length,
    stockCount: opportunities.filter((o) => o.category === "stocks").length,
    cryptoCount: opportunities.filter((o) => o.category === "crypto").length,
    ...metrics,
  };

  // Format and send
  const message = formatDailyDigest(opportunities, fullMetrics);
  const result = await sendWhatsAppMessage(eligibility.phone!, message);

  return {
    success: result.success,
    sent: result.success,
    messageSid: result.messageSid,
    reason: result.error,
  };
}

/**
 * Send opportunity alert to all eligible users
 * Used for broadcasting new opportunities
 */
export async function broadcastOpportunityAlert(
  opportunity: Opportunity,
): Promise<{ sent: number; failed: number; skipped: number }> {
  const supabase = getSupabaseAdmin();

  // Get all users with WhatsApp enabled and Pro+ tier
  const { data: users } = await supabase
    .from("users")
    .select(
      `
      id,
      subscription_tier,
      notification_preferences!inner (
        whatsapp_alerts_enabled,
        whatsapp_number,
        alert_frequency
      )
    `,
    )
    .in("subscription_tier", ["pro", "enterprise"]);

  const stats = { sent: 0, failed: 0, skipped: 0 };

  if (!users || users.length === 0) {
    return stats;
  }

  for (const user of users) {
    const prefs = (
      user.notification_preferences as UserNotificationPrefs[]
    )?.[0];

    // Skip if not eligible
    if (!prefs?.whatsapp_alerts_enabled || !prefs?.whatsapp_number) {
      stats.skipped++;
      continue;
    }

    // Skip if not realtime
    if (prefs.alert_frequency !== "realtime") {
      stats.skipped++;
      continue;
    }

    // Send with throttling for rate limits
    const result = await sendWhatsAppMessageThrottled(
      prefs.whatsapp_number,
      formatOpportunityAlert(opportunity),
    );

    if (result.success) {
      stats.sent++;
    } else {
      stats.failed++;
    }
  }

  return stats;
}

/**
 * Send daily digests to all eligible users
 * Called by cron job at end of day
 */
export async function broadcastDailyDigest(
  opportunities: Opportunity[],
  metrics?: Partial<DailyMetrics>,
): Promise<{ sent: number; failed: number; skipped: number }> {
  const supabase = getSupabaseAdmin();

  // Get all users with WhatsApp enabled, Pro+ tier, and daily frequency
  const { data: users } = await supabase
    .from("users")
    .select(
      `
      id,
      subscription_tier,
      notification_preferences!inner (
        whatsapp_alerts_enabled,
        whatsapp_number,
        alert_frequency
      )
    `,
    )
    .in("subscription_tier", ["pro", "enterprise"]);

  const stats = { sent: 0, failed: 0, skipped: 0 };

  if (!users || users.length === 0) {
    return stats;
  }

  // Build full metrics
  const fullMetrics: DailyMetrics = {
    totalOpportunities: opportunities.length,
    arbitrageCount: opportunities.filter((o) => o.type === "arbitrage").length,
    stockCount: opportunities.filter((o) => o.category === "stocks").length,
    cryptoCount: opportunities.filter((o) => o.category === "crypto").length,
    ...metrics,
  };

  const digestMessage = formatDailyDigest(opportunities, fullMetrics);

  for (const user of users) {
    const prefs = (
      user.notification_preferences as UserNotificationPrefs[]
    )?.[0];

    // Skip if not eligible
    if (!prefs?.whatsapp_alerts_enabled || !prefs?.whatsapp_number) {
      stats.skipped++;
      continue;
    }

    // Only send to users who want daily digests
    if (prefs.alert_frequency !== "daily") {
      stats.skipped++;
      continue;
    }

    // Send with throttling
    const result = await sendWhatsAppMessageThrottled(
      prefs.whatsapp_number,
      digestMessage,
    );

    if (result.success) {
      stats.sent++;
    } else {
      stats.failed++;
    }
  }

  return stats;
}

/**
 * Export index file for cleaner imports
 */
export * from "./twilio-client";
export * from "./message-templates";
