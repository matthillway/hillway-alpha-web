// ============================================
// HILLWAY ALPHA - Send Notifications Cron Handler
// Next.js App Router API Route
// Sends WhatsApp and Email notifications to users
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  broadcastDailyDigest,
  isTwilioConfigured,
  type Opportunity,
} from "@/lib/whatsapp";
import {
  sendDailyBriefingEmail,
  isEmailConfigured,
} from "@/lib/notifications/email";
import {
  sendDailyDigest,
  sendWeeklyReport,
  getUsersForDailyDigest,
  getUsersForWeeklyReport,
  getOpportunitiesForDigest,
  calculateWeeklyStats,
} from "@/lib/email/send-notification";

export const runtime = "nodejs";
export const maxDuration = 120; // 2 minute timeout for batch notifications

// Supabase admin client
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

interface NotificationStats {
  whatsapp: {
    sent: number;
    failed: number;
    skipped: number;
  };
  email: {
    sent: number;
    failed: number;
    skipped: number;
  };
  resendDigest: {
    sent: number;
    failed: number;
  };
  errors: string[];
}

/**
 * Get today's opportunities from the database
 */
async function getTodaysOpportunities(): Promise<Opportunity[]> {
  const supabase = getSupabaseAdmin();

  // Get opportunities from the last 24 hours
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .gte("created_at", yesterday.toISOString())
    .order("margin", { ascending: false });

  if (error) {
    console.error("Error fetching opportunities:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    type: row.type,
    category: row.category,
    event_name: row.event_name,
    margin: row.margin,
    confidence: row.confidence,
    data: row.data,
    created_at: row.created_at,
  }));
}

/**
 * Send email digest to daily users
 */
async function sendEmailDigests(
  opportunities: Opportunity[],
): Promise<{ sent: number; failed: number; skipped: number }> {
  const supabase = getSupabaseAdmin();

  // Get users with daily email alerts enabled
  const { data: users } = await supabase.from("users").select(
    `
      id,
      email,
      notification_preferences (
        email_alerts_enabled,
        alert_frequency
      )
    `,
  );

  const stats = { sent: 0, failed: 0, skipped: 0 };

  if (!users || users.length === 0 || !isEmailConfigured()) {
    return stats;
  }

  for (const user of users) {
    const prefs = (user.notification_preferences as any[])?.[0];

    // Skip if email not enabled or not daily
    if (!prefs?.email_alerts_enabled || prefs.alert_frequency !== "daily") {
      stats.skipped++;
      continue;
    }

    try {
      const briefing = {
        date: new Date().toLocaleDateString("en-GB", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        marketContext: getMarketContext(opportunities),
        opportunities: opportunities.slice(0, 10).map((opp, i) => ({
          rank: i + 1,
          title: opp.event_name || opp.event || opp.symbol || "Unknown",
          type: opp.type,
          margin: opp.margin,
          expectedValue: opp.expectedValue,
          confidence: opp.confidence || 0,
          action: getActionText(opp),
        })),
      };

      const sent = await sendDailyBriefingEmail(briefing);
      if (sent) {
        stats.sent++;
      } else {
        stats.failed++;
      }
    } catch (error) {
      stats.failed++;
    }
  }

  return stats;
}

/**
 * Generate market context text
 */
function getMarketContext(opportunities: Opportunity[]): string {
  const arbitrageCount = opportunities.filter(
    (o) => o.type === "arbitrage",
  ).length;
  const stockCount = opportunities.filter(
    (o) => o.category === "stocks",
  ).length;
  const cryptoCount = opportunities.filter(
    (o) => o.category === "crypto",
  ).length;

  const parts: string[] = [];

  if (arbitrageCount > 0) {
    const avgMargin =
      opportunities
        .filter((o) => o.type === "arbitrage" && o.margin)
        .reduce((sum, o) => sum + (o.margin || 0), 0) / arbitrageCount;
    parts.push(
      `Found ${arbitrageCount} arbitrage opportunities with average ${avgMargin.toFixed(1)}% margin`,
    );
  }

  if (stockCount > 0) {
    parts.push(`${stockCount} stock momentum signals detected`);
  }

  if (cryptoCount > 0) {
    parts.push(`${cryptoCount} crypto opportunities including funding rates`);
  }

  if (parts.length === 0) {
    return "No significant opportunities detected today.";
  }

  return parts.join(". ") + ".";
}

/**
 * Get recommended action text for opportunity
 */
function getActionText(opp: Opportunity): string {
  switch (opp.type) {
    case "arbitrage":
      return "Place matched bets";
    case "value_bet":
      return "Consider stake";
    case "momentum":
      return opp.data?.direction === "bullish"
        ? "Consider long"
        : "Consider short";
    case "funding_rate":
      return "Check funding position";
    case "sentiment":
      return "Monitor closely";
    default:
      return "Review opportunity";
  }
}

/**
 * Send new Resend-based daily digests
 */
async function sendResendDailyDigests(): Promise<{
  sent: number;
  failed: number;
}> {
  const stats = { sent: 0, failed: 0 };

  try {
    const userIds = await getUsersForDailyDigest();
    if (userIds.length === 0) return stats;

    const BATCH_SIZE = 10;
    const BATCH_DELAY = 1000;

    for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
      const batch = userIds.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (userId) => {
          try {
            const opportunities = await getOpportunitiesForDigest(userId, 1);
            const result = await sendDailyDigest(userId, opportunities, {});
            return result.success;
          } catch {
            return false;
          }
        }),
      );

      stats.sent += batchResults.filter(Boolean).length;
      stats.failed += batchResults.filter((r) => !r).length;

      if (i + BATCH_SIZE < userIds.length) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
      }
    }
  } catch (error) {
    console.error("Error sending Resend daily digests:", error);
  }

  return stats;
}

/**
 * Send weekly reports via Resend
 */
async function sendResendWeeklyReports(): Promise<{
  sent: number;
  failed: number;
}> {
  const stats = { sent: 0, failed: 0 };

  try {
    const userIds = await getUsersForWeeklyReport();
    if (userIds.length === 0) return stats;

    const BATCH_SIZE = 5;
    const BATCH_DELAY = 2000;

    for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
      const batch = userIds.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (userId) => {
          try {
            const weeklyStats = await calculateWeeklyStats(userId);
            const result = await sendWeeklyReport(userId, weeklyStats);
            return result.success;
          } catch {
            return false;
          }
        }),
      );

      stats.sent += batchResults.filter(Boolean).length;
      stats.failed += batchResults.filter((r) => !r).length;

      if (i + BATCH_SIZE < userIds.length) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
      }
    }
  } catch (error) {
    console.error("Error sending weekly reports:", error);
  }

  return stats;
}

/**
 * GET /api/cron/send-notifications
 * Triggered by cron job to send daily digests
 *
 * Query params:
 * - type: "daily" | "weekly" (default: "daily")
 */
export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron or has valid auth
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    if (process.env.CRON_SECRET && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const startTime = Date.now();
  const notificationType = request.nextUrl.searchParams.get("type") || "daily";
  const dayOfWeek = new Date().getUTCDay();

  console.log(
    `[${new Date().toISOString()}] Send notifications triggered (type: ${notificationType})`,
  );

  const stats: NotificationStats = {
    whatsapp: { sent: 0, failed: 0, skipped: 0 },
    email: { sent: 0, failed: 0, skipped: 0 },
    resendDigest: { sent: 0, failed: 0 },
    errors: [],
  };

  // Handle weekly reports on Mondays only
  if (notificationType === "weekly") {
    if (dayOfWeek !== 1) {
      return NextResponse.json({
        success: true,
        message: "Weekly reports only sent on Mondays",
        day: dayOfWeek,
        duration: Date.now() - startTime,
      });
    }

    try {
      stats.resendDigest = await sendResendWeeklyReports();
    } catch (error) {
      stats.errors.push(
        `Weekly report error: ${error instanceof Error ? error.message : "Unknown"}`,
      );
    }

    return NextResponse.json({
      success: true,
      type: "weekly",
      message: `Weekly reports: ${stats.resendDigest.sent} sent, ${stats.resendDigest.failed} failed`,
      stats,
      duration: Date.now() - startTime,
    });
  }

  try {
    // Get today's opportunities
    const opportunities = await getTodaysOpportunities();

    if (opportunities.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No opportunities to send",
        stats,
        duration: Date.now() - startTime,
      });
    }

    // Calculate metrics
    const metrics = {
      totalOpportunities: opportunities.length,
      arbitrageCount: opportunities.filter((o) => o.type === "arbitrage")
        .length,
      stockCount: opportunities.filter((o) => o.category === "stocks").length,
      cryptoCount: opportunities.filter((o) => o.category === "crypto").length,
      topMargin: Math.max(...opportunities.map((o) => o.margin || 0)),
    };

    // Send WhatsApp digests
    if (isTwilioConfigured()) {
      try {
        stats.whatsapp = await broadcastDailyDigest(opportunities, metrics);
      } catch (error) {
        stats.errors.push(
          `WhatsApp error: ${error instanceof Error ? error.message : "Unknown"}`,
        );
      }
    } else {
      stats.errors.push("WhatsApp: Twilio not configured");
    }

    // Send email digests (legacy system)
    if (isEmailConfigured()) {
      try {
        stats.email = await sendEmailDigests(opportunities);
      } catch (error) {
        stats.errors.push(
          `Email error: ${error instanceof Error ? error.message : "Unknown"}`,
        );
      }
    } else {
      stats.errors.push("Email: Resend not configured");
    }

    // Send new Resend-based daily digests
    try {
      stats.resendDigest = await sendResendDailyDigests();
    } catch (error) {
      stats.errors.push(
        `Resend digest error: ${error instanceof Error ? error.message : "Unknown"}`,
      );
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      type: "daily",
      message: `Notifications sent. WhatsApp: ${stats.whatsapp.sent}/${stats.whatsapp.sent + stats.whatsapp.failed + stats.whatsapp.skipped}, Email: ${stats.email.sent}/${stats.email.sent + stats.email.failed + stats.email.skipped}, Resend Digest: ${stats.resendDigest.sent}/${stats.resendDigest.sent + stats.resendDigest.failed}`,
      opportunityCount: opportunities.length,
      stats,
      duration,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Send notifications failed:", errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        stats,
        duration: Date.now() - startTime,
      },
      { status: 500 },
    );
  }
}
