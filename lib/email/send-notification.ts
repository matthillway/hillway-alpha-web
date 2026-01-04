/**
 * Notification Email Functions
 *
 * High-level functions for sending opportunity notifications to users.
 * Checks user preferences before sending and respects frequency settings.
 */

import { Resend } from "resend";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  opportunityAlertHtml,
  dailyDigestHtml,
  weeklyReportHtml,
  type OpportunityAlertProps,
  type DailyDigestProps,
  type DailyDigestOpportunity,
  type DailyDigestMetrics,
  type WeeklyReportProps,
  type WeeklyStats,
} from "./templates/index";

// Types
export interface Opportunity {
  id: string;
  category: "arbitrage" | "stock" | "crypto";
  subcategory: string;
  title: string;
  description: string;
  confidence_score: number;
  expected_value: number;
  expires_at?: string | null;
  data?: Record<string, unknown>;
  status: string;
  user_id?: string | null;
  created_at?: string;
}

export interface NotificationPreferences {
  user_id: string;
  email_alerts_enabled: boolean;
  whatsapp_alerts_enabled: boolean;
  alert_frequency: "realtime" | "hourly" | "daily" | "weekly";
  whatsapp_number: string | null;
  min_confidence_threshold?: number;
  categories?: string[];
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  subscription_tier?: string;
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  userId?: string;
}

// Configuration
const BRAND_NAME = "TradeSmart";
const FROM_EMAIL = "TradeSmart <noreply@tradesmarthub.com>";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://tradesmarthub.com";
const MIN_CONFIDENCE_FOR_REALTIME = 70; // Only send realtime alerts for 70%+ confidence

// Initialize clients
let resendClient: Resend | null = null;
let supabaseClient: SupabaseClient | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase configuration is missing");
    }

    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseClient;
}

/**
 * Get user notification preferences
 */
async function getUserPreferences(
  userId: string,
): Promise<NotificationPreferences | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    // Return defaults if no preferences exist
    return {
      user_id: userId,
      email_alerts_enabled: true,
      whatsapp_alerts_enabled: false,
      alert_frequency: "realtime",
      whatsapp_number: null,
      min_confidence_threshold: 60,
    };
  }

  return data;
}

/**
 * Get user details by ID
 */
async function getUserById(userId: string): Promise<User | null> {
  const supabase = getSupabaseClient();

  // Try users table first, then auth.users
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, email, full_name, subscription_tier")
    .eq("id", userId)
    .single();

  if (userData) {
    return userData;
  }

  // Fallback to auth.users if users table doesn't have the user
  const { data: authData, error: authError } =
    await supabase.auth.admin.getUserById(userId);

  if (authError || !authData.user) {
    console.error(
      "Failed to get user:",
      userError?.message || authError?.message,
    );
    return null;
  }

  return {
    id: authData.user.id,
    email: authData.user.email || "",
    full_name: authData.user.user_metadata?.full_name,
  };
}

/**
 * Check if user should receive realtime alerts for this opportunity
 */
function shouldSendRealtimeAlert(
  opportunity: Opportunity,
  preferences: NotificationPreferences,
): boolean {
  // Check if email alerts are enabled
  if (!preferences.email_alerts_enabled) {
    return false;
  }

  // Check frequency setting
  if (preferences.alert_frequency !== "realtime") {
    return false;
  }

  // Check confidence threshold
  const minConfidence =
    preferences.min_confidence_threshold || MIN_CONFIDENCE_FOR_REALTIME;
  if (opportunity.confidence_score < minConfidence) {
    return false;
  }

  // Check category filter if set
  if (
    preferences.categories &&
    preferences.categories.length > 0 &&
    !preferences.categories.includes(opportunity.category)
  ) {
    return false;
  }

  return true;
}

/**
 * Send opportunity alert email (realtime notification)
 */
export async function sendOpportunityAlert(
  userId: string,
  opportunity: Opportunity,
): Promise<SendResult> {
  try {
    // Get user preferences
    const preferences = await getUserPreferences(userId);
    if (!preferences) {
      return { success: false, error: "User preferences not found", userId };
    }

    // Check if should send
    if (!shouldSendRealtimeAlert(opportunity, preferences)) {
      return {
        success: true,
        error: "Alert not sent (user preferences or confidence threshold)",
        userId,
      };
    }

    // Get user details
    const user = await getUserById(userId);
    if (!user || !user.email) {
      return { success: false, error: "User not found or no email", userId };
    }

    // Prepare email data
    const emailData: OpportunityAlertProps = {
      userName: user.full_name || user.email.split("@")[0],
      opportunity: {
        id: opportunity.id,
        title: opportunity.title,
        category: opportunity.category,
        subcategory: opportunity.subcategory,
        description: opportunity.description,
        confidence: opportunity.confidence_score,
        expectedValue: opportunity.expected_value,
        expiresAt: opportunity.expires_at || undefined,
        data: opportunity.data,
      },
      dashboardUrl: BASE_URL,
      unsubscribeUrl: `${BASE_URL}/dashboard/settings`,
    };

    // Send email
    const resend = getResendClient();
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `New ${opportunity.category} opportunity: ${opportunity.title}`,
      html: opportunityAlertHtml(emailData),
    });

    if (response.error) {
      console.error(
        "[Email] Failed to send opportunity alert:",
        response.error,
      );
      return { success: false, error: response.error.message, userId };
    }

    console.log(
      `[Email] Sent opportunity alert to ${user.email}, ID: ${response.data?.id}`,
    );

    // Log notification
    await logNotification(userId, "opportunity_alert", opportunity.id);

    return { success: true, messageId: response.data?.id, userId };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[Email] Error sending opportunity alert:", errorMessage);
    return { success: false, error: errorMessage, userId };
  }
}

/**
 * Send daily digest email
 */
export async function sendDailyDigest(
  userId: string,
  opportunities: Opportunity[],
  metrics: Partial<DailyDigestMetrics>,
): Promise<SendResult> {
  try {
    // Get user details
    const user = await getUserById(userId);
    if (!user || !user.email) {
      return { success: false, error: "User not found or no email", userId };
    }

    // Get preferences to check if email alerts are enabled
    const preferences = await getUserPreferences(userId);
    if (!preferences?.email_alerts_enabled) {
      return { success: true, error: "Email alerts disabled", userId };
    }

    // Format opportunities for the digest
    const digestOpportunities: DailyDigestOpportunity[] = opportunities.map(
      (opp) => ({
        id: opp.id,
        title: opp.title,
        category: opp.category,
        subcategory: opp.subcategory,
        confidence: opp.confidence_score,
        expectedValue: opp.expected_value,
        status: opp.status as "open" | "closed" | "expired",
      }),
    );

    // Calculate metrics
    const fullMetrics: DailyDigestMetrics = {
      totalOpportunities: metrics.totalOpportunities || opportunities.length,
      successfulTrades: metrics.successfulTrades || 0,
      totalProfit: metrics.totalProfit || 0,
      avgConfidence:
        metrics.avgConfidence ||
        (opportunities.length > 0
          ? opportunities.reduce((acc, o) => acc + o.confidence_score, 0) /
            opportunities.length
          : 0),
      categoryCounts: metrics.categoryCounts || {
        arbitrage: opportunities.filter((o) => o.category === "arbitrage")
          .length,
        stock: opportunities.filter((o) => o.category === "stock").length,
        crypto: opportunities.filter((o) => o.category === "crypto").length,
      },
    };

    // Prepare email data
    const today = new Date();
    const emailData: DailyDigestProps = {
      userName: user.full_name || user.email.split("@")[0],
      date: today.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      opportunities: digestOpportunities,
      metrics: fullMetrics,
      dashboardUrl: BASE_URL,
      unsubscribeUrl: `${BASE_URL}/dashboard/settings`,
    };

    // Send email
    const resend = getResendClient();
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `[${BRAND_NAME}] Daily Digest - ${fullMetrics.totalOpportunities} opportunities`,
      html: dailyDigestHtml(emailData),
    });

    if (response.error) {
      console.error("[Email] Failed to send daily digest:", response.error);
      return { success: false, error: response.error.message, userId };
    }

    console.log(
      `[Email] Sent daily digest to ${user.email}, ID: ${response.data?.id}`,
    );

    // Log notification
    await logNotification(userId, "daily_digest", null);

    return { success: true, messageId: response.data?.id, userId };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[Email] Error sending daily digest:", errorMessage);
    return { success: false, error: errorMessage, userId };
  }
}

/**
 * Send weekly report email
 */
export async function sendWeeklyReport(
  userId: string,
  weeklyStats: WeeklyStats,
): Promise<SendResult> {
  try {
    // Get user details
    const user = await getUserById(userId);
    if (!user || !user.email) {
      return { success: false, error: "User not found or no email", userId };
    }

    // Get preferences to check if email alerts are enabled
    const preferences = await getUserPreferences(userId);
    if (!preferences?.email_alerts_enabled) {
      return { success: true, error: "Email alerts disabled", userId };
    }

    // Prepare email data
    const emailData: WeeklyReportProps = {
      userName: user.full_name || user.email.split("@")[0],
      stats: weeklyStats,
      dashboardUrl: BASE_URL,
      unsubscribeUrl: `${BASE_URL}/dashboard/settings`,
    };

    // Send email
    const resend = getResendClient();
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `[${BRAND_NAME}] Weekly Report: ${weeklyStats.winRate.toFixed(0)}% win rate`,
      html: weeklyReportHtml(emailData),
    });

    if (response.error) {
      console.error("[Email] Failed to send weekly report:", response.error);
      return { success: false, error: response.error.message, userId };
    }

    console.log(
      `[Email] Sent weekly report to ${user.email}, ID: ${response.data?.id}`,
    );

    // Log notification
    await logNotification(userId, "weekly_report", null);

    return { success: true, messageId: response.data?.id, userId };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[Email] Error sending weekly report:", errorMessage);
    return { success: false, error: errorMessage, userId };
  }
}

/**
 * Send opportunity alerts in batch (for multiple users)
 */
export async function sendOpportunityAlertBatch(
  userIds: string[],
  opportunity: Opportunity,
): Promise<SendResult[]> {
  const results = await Promise.all(
    userIds.map((userId) => sendOpportunityAlert(userId, opportunity)),
  );
  return results;
}

/**
 * Get users who should receive daily digest
 */
export async function getUsersForDailyDigest(): Promise<string[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("notification_preferences")
    .select("user_id")
    .eq("email_alerts_enabled", true)
    .eq("alert_frequency", "daily");

  if (error) {
    console.error("Failed to get users for daily digest:", error);
    return [];
  }

  return data.map((row) => row.user_id);
}

/**
 * Get users who should receive weekly report
 */
export async function getUsersForWeeklyReport(): Promise<string[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("notification_preferences")
    .select("user_id")
    .eq("email_alerts_enabled", true)
    .eq("alert_frequency", "weekly");

  if (error) {
    console.error("Failed to get users for weekly report:", error);
    return [];
  }

  return data.map((row) => row.user_id);
}

/**
 * Get users who want realtime alerts for a specific category
 */
export async function getUsersForRealtimeAlerts(
  category?: string,
): Promise<string[]> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from("notification_preferences")
    .select("user_id")
    .eq("email_alerts_enabled", true)
    .eq("alert_frequency", "realtime");

  // Note: Category filtering would need to be done in application code
  // if categories is stored as a JSON array

  const { data, error } = await query;

  if (error) {
    console.error("Failed to get users for realtime alerts:", error);
    return [];
  }

  return data.map((row) => row.user_id);
}

/**
 * Log notification to database for tracking
 */
async function logNotification(
  userId: string,
  type: string,
  opportunityId: string | null,
): Promise<void> {
  try {
    const supabase = getSupabaseClient();

    await supabase.from("notification_logs").insert({
      user_id: userId,
      type,
      opportunity_id: opportunityId,
      sent_at: new Date().toISOString(),
    });
  } catch (error) {
    // Don't fail the email send if logging fails
    console.error("Failed to log notification:", error);
  }
}

/**
 * Get opportunities for a user's daily digest
 */
export async function getOpportunitiesForDigest(
  userId: string,
  daysBack: number = 1,
): Promise<Opportunity[]> {
  const supabase = getSupabaseClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .or(`user_id.eq.${userId},user_id.is.null`)
    .gte("created_at", startDate.toISOString())
    .order("confidence_score", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Failed to get opportunities for digest:", error);
    return [];
  }

  return data || [];
}

/**
 * Calculate weekly stats for a user
 */
export async function calculateWeeklyStats(
  userId: string,
): Promise<WeeklyStats> {
  const supabase = getSupabaseClient();

  const weekEnd = new Date();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  // Get trades from the past week
  const { data: trades, error: tradesError } = await supabase
    .from("portfolio_trades")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", weekStart.toISOString())
    .lte("created_at", weekEnd.toISOString());

  // Get opportunities from the past week
  const { data: opportunities, error: oppsError } = await supabase
    .from("opportunities")
    .select("*")
    .or(`user_id.eq.${userId},user_id.is.null`)
    .gte("created_at", weekStart.toISOString())
    .lte("created_at", weekEnd.toISOString());

  const tradesList = trades || [];
  const opportunitiesList = opportunities || [];

  // Calculate stats
  const wins = tradesList.filter((t) => (t.pnl || 0) > 0).length;
  const losses = tradesList.filter((t) => (t.pnl || 0) < 0).length;
  const totalProfit = tradesList.reduce((sum, t) => sum + (t.pnl || 0), 0);

  // Find best and worst trades
  const sortedTrades = [...tradesList].sort(
    (a, b) => (b.pnl || 0) - (a.pnl || 0),
  );
  const bestTrade =
    sortedTrades.length > 0 && (sortedTrades[0].pnl || 0) > 0
      ? {
          title: sortedTrades[0].symbol || "Trade",
          category: sortedTrades[0].category || "unknown",
          profit: sortedTrades[0].pnl || 0,
        }
      : null;

  const worstTrade =
    sortedTrades.length > 0 &&
    (sortedTrades[sortedTrades.length - 1].pnl || 0) < 0
      ? {
          title: sortedTrades[sortedTrades.length - 1].symbol || "Trade",
          category: sortedTrades[sortedTrades.length - 1].category || "unknown",
          loss: Math.abs(sortedTrades[sortedTrades.length - 1].pnl || 0),
        }
      : null;

  // Calculate category breakdown
  const byCategory = {
    arbitrage: {
      opportunities: opportunitiesList.filter((o) => o.category === "arbitrage")
        .length,
      trades: tradesList.filter((t) => t.category === "arbitrage").length,
      wins: tradesList.filter(
        (t) => t.category === "arbitrage" && (t.pnl || 0) > 0,
      ).length,
      losses: tradesList.filter(
        (t) => t.category === "arbitrage" && (t.pnl || 0) < 0,
      ).length,
      profit: tradesList
        .filter((t) => t.category === "arbitrage")
        .reduce((sum, t) => sum + (t.pnl || 0), 0),
      avgConfidence: 0,
    },
    stock: {
      opportunities: opportunitiesList.filter((o) => o.category === "stock")
        .length,
      trades: tradesList.filter((t) => t.category === "stock").length,
      wins: tradesList.filter((t) => t.category === "stock" && (t.pnl || 0) > 0)
        .length,
      losses: tradesList.filter(
        (t) => t.category === "stock" && (t.pnl || 0) < 0,
      ).length,
      profit: tradesList
        .filter((t) => t.category === "stock")
        .reduce((sum, t) => sum + (t.pnl || 0), 0),
      avgConfidence: 0,
    },
    crypto: {
      opportunities: opportunitiesList.filter((o) => o.category === "crypto")
        .length,
      trades: tradesList.filter((t) => t.category === "crypto").length,
      wins: tradesList.filter(
        (t) => t.category === "crypto" && (t.pnl || 0) > 0,
      ).length,
      losses: tradesList.filter(
        (t) => t.category === "crypto" && (t.pnl || 0) < 0,
      ).length,
      profit: tradesList
        .filter((t) => t.category === "crypto")
        .reduce((sum, t) => sum + (t.pnl || 0), 0),
      avgConfidence: 0,
    },
  };

  // Calculate daily P&L
  const dailyPnL: Array<{ date: string; profit: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString("en-GB", { weekday: "short" });
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const dayProfit = tradesList
      .filter((t) => {
        const tradeDate = new Date(t.created_at);
        return tradeDate >= dayStart && tradeDate <= dayEnd;
      })
      .reduce((sum, t) => sum + (t.pnl || 0), 0);

    dailyPnL.push({ date: dateStr, profit: dayProfit });
  }

  return {
    weekStart: weekStart.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    weekEnd: weekEnd.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    totalOpportunities: opportunitiesList.length,
    totalTrades: tradesList.length,
    wins,
    losses,
    winRate: tradesList.length > 0 ? (wins / tradesList.length) * 100 : 0,
    totalProfit,
    bestTrade,
    worstTrade,
    byCategory,
    dailyPnL,
  };
}
