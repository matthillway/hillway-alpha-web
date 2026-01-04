import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

// Scanner imports
import { createMomentumScanner } from "@/lib/scanners/stocks/momentum";
import { createFundingRateScanner } from "@/lib/scanners/crypto/funding-rates";
// Arbitrage scanner requires ODDS_API_KEY
import { createArbitrageScanner } from "@/lib/scanners/betting/arbitrage";
import { createOddsApiClient } from "@/lib/scanner-api/odds-api";
// Real-time email alerts
import {
  sendOpportunityAlertBatch,
  getUsersForRealtimeAlerts,
  type Opportunity as NotificationOpportunity,
} from "@/lib/email/send-notification";

// Minimum confidence to trigger realtime email alerts (70%+)
const MIN_CONFIDENCE_FOR_ALERTS = 70;

// Create Supabase client with service role for inserts
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseKey);
}

// Tier limits
const TIER_LIMITS: Record<string, number> = {
  free: 0, // No scans for free users
  starter: 100, // 100 scans per day
  pro: 500, // 500 scans per day
  unlimited: -1, // Unlimited
};

interface DbOpportunity {
  id: string;
  category: string;
  subcategory: string;
  title: string;
  description: string;
  confidence_score: number;
  expected_value: number;
  data: Record<string, unknown>;
  expires_at: string | null;
  status: string;
  user_id: string | null;
}

// POST /api/scanner/run - Trigger a scan
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    const { scanType, userId, userTier = "free" } = body;

    if (!scanType) {
      return NextResponse.json(
        { error: "scanType is required" },
        { status: 400 },
      );
    }

    // Validate scan type
    const validTypes = ["arbitrage", "value_bets", "stocks", "crypto", "all"];
    if (!validTypes.includes(scanType)) {
      return NextResponse.json(
        { error: `Invalid scanType. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 },
      );
    }

    // Check tier limits
    const dailyLimit = TIER_LIMITS[userTier];

    if (dailyLimit === 0) {
      return NextResponse.json(
        {
          error:
            "Free tier does not include scanning. Please upgrade to Starter or higher.",
          code: "TIER_LIMIT_FREE",
        },
        { status: 403 },
      );
    }

    // Check usage for the day (if not unlimited)
    if (dailyLimit !== -1 && userId) {
      const today = new Date().toISOString().split("T")[0];

      const { data: usage } = await supabase
        .from("user_usage")
        .select("scans_used")
        .eq("user_id", userId)
        .eq("date", today)
        .single();

      const scansUsed = usage?.scans_used || 0;

      if (scansUsed >= dailyLimit) {
        return NextResponse.json(
          {
            error: `Daily scan limit reached (${dailyLimit}). Resets at midnight UTC.`,
            code: "TIER_LIMIT_REACHED",
            used: scansUsed,
            limit: dailyLimit,
          },
          { status: 429 },
        );
      }

      // Increment usage
      await supabase.from("user_usage").upsert(
        {
          user_id: userId,
          date: today,
          scans_used: scansUsed + 1,
        },
        { onConflict: "user_id,date" },
      );
    }

    // Run the actual scanners
    const opportunities: DbOpportunity[] = [];
    const errors: string[] = [];

    // Determine which scanners to run
    const runArbitrage = scanType === "arbitrage" || scanType === "all";
    const runStocks = scanType === "stocks" || scanType === "all";
    const runCrypto = scanType === "crypto" || scanType === "all";

    // Run arbitrage scanner (requires ODDS_API_KEY)
    if (runArbitrage) {
      try {
        if (!process.env.ODDS_API_KEY) {
          errors.push(
            "Arbitrage scanner unavailable: ODDS_API_KEY not configured",
          );
        } else {
          const oddsClient = createOddsApiClient();
          const arbScanner = createArbitrageScanner(oddsClient, {
            minMargin: 1.0,
            maxHoursAhead: 48,
            totalStake: 100,
          });

          const arbOpportunities = await arbScanner.scan();

          for (const arb of arbOpportunities) {
            const expiresAt = new Date(arb.commenceTime);
            opportunities.push({
              id: uuidv4(),
              category: "arbitrage",
              subcategory: arb.sport,
              title: `${arb.event} - ${arb.margin.toFixed(2)}% margin`,
              description: `Arbitrage opportunity: ${arb.stakes.map((s) => `${s.team} @ ${s.odds} (${s.bookmaker})`).join(" vs ")}`,
              confidence_score: Math.min(100, Math.round(50 + arb.margin * 10)),
              expected_value: arb.guaranteedProfit,
              data: {
                eventId: arb.eventId,
                homeTeam: arb.homeTeam,
                awayTeam: arb.awayTeam,
                sport: arb.sport,
                sportTitle: arb.sportTitle,
                margin: arb.margin,
                stakes: arb.stakes,
                totalStake: arb.totalStake,
                guaranteedReturn: arb.guaranteedReturn,
                hoursUntilStart: arb.hoursUntilStart,
              },
              expires_at: expiresAt.toISOString(),
              status: "open",
              user_id: userId || null,
            });
          }
        }
      } catch (err) {
        console.error("Arbitrage scan error:", err);
        errors.push(`Arbitrage scan failed: ${(err as Error).message}`);
      }
    }

    // Run stock momentum scanner
    if (runStocks) {
      try {
        const momentumScanner = createMomentumScanner({
          markets: ["UK", "US"],
          minConfidence: 50,
        });

        const stockOpportunities = await momentumScanner.getTopOpportunities(
          10,
          "bullish",
        );

        for (const stock of stockOpportunities) {
          // Stock opportunities don't expire but we set 24h window
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 24);

          opportunities.push({
            id: uuidv4(),
            category: "stock",
            subcategory: stock.market,
            title: `${stock.symbol} - ${stock.overallSignal.replace("_", " ")}`,
            description: stock.reasoning,
            confidence_score: stock.confidence,
            expected_value: stock.priceChange,
            data: {
              symbol: stock.symbol,
              name: stock.name,
              market: stock.market,
              currentPrice: stock.currentPrice,
              priceChange: stock.priceChange,
              priceChangePercent: stock.priceChangePercent,
              signals: stock.signals,
              overallSignal: stock.overallSignal,
              technicals: stock.technicals,
              volumeRatio: stock.volumeRatio,
              fiftyTwoWeekPosition: stock.fiftyTwoWeekPosition,
              suggestedAction: stock.suggestedAction,
            },
            expires_at: expiresAt.toISOString(),
            status: "open",
            user_id: userId || null,
          });
        }
      } catch (err) {
        console.error("Stock scan error:", err);
        errors.push(`Stock scan failed: ${(err as Error).message}`);
      }
    }

    // Run crypto funding rate scanner
    if (runCrypto) {
      try {
        const fundingScanner = createFundingRateScanner({
          minAnnualizedRate: 50,
          topPairsCount: 20,
        });

        const cryptoOpportunities = await fundingScanner.getTopOpportunities(5);

        for (const crypto of cryptoOpportunities) {
          opportunities.push({
            id: uuidv4(),
            category: "crypto",
            subcategory: "funding_rate",
            title: `${crypto.symbol} - ${crypto.direction} ${Math.abs(crypto.annualizedRate).toFixed(0)}% APY`,
            description: `Funding rate opportunity: Go ${crypto.direction} on ${crypto.asset}. Current rate ${crypto.currentRate.toFixed(4)}% per 8h (${crypto.annualizedRate.toFixed(1)}% annualized). Risk: ${crypto.riskLevel}`,
            confidence_score: crypto.confidence,
            expected_value:
              crypto.suggestedSize * (crypto.annualizedRate / 100),
            data: {
              symbol: crypto.symbol,
              asset: crypto.asset,
              currentRate: crypto.currentRate,
              annualizedRate: crypto.annualizedRate,
              direction: crypto.direction,
              markPrice: crypto.markPrice,
              nextFundingTime: crypto.nextFundingTime.toISOString(),
              riskLevel: crypto.riskLevel,
              suggestedSize: crypto.suggestedSize,
            },
            expires_at: crypto.nextFundingTime.toISOString(),
            status: "open",
            user_id: userId || null,
          });
        }
      } catch (err) {
        console.error("Crypto scan error:", err);
        errors.push(`Crypto scan failed: ${(err as Error).message}`);
      }
    }

    // Insert opportunities into database
    if (opportunities.length > 0) {
      const { error: insertError } = await supabase
        .from("opportunities")
        .insert(opportunities);

      if (insertError) {
        console.error("Error inserting opportunities:", insertError);
        errors.push(`Database insert failed: ${insertError.message}`);
      }
    }

    // Send real-time email alerts for high-confidence opportunities
    let alertsSent = 0;
    if (opportunities.length > 0) {
      try {
        // Filter for high-confidence opportunities (70%+)
        const highConfidenceOpps = opportunities.filter(
          (opp) => opp.confidence_score >= MIN_CONFIDENCE_FOR_ALERTS,
        );

        if (highConfidenceOpps.length > 0) {
          // Get users who want realtime alerts
          const userIds = await getUsersForRealtimeAlerts();

          if (userIds.length > 0) {
            // Convert to email opportunity format and send alerts
            for (const opp of highConfidenceOpps) {
              const notificationOpp: NotificationOpportunity = {
                id: opp.id,
                category: opp.category as "arbitrage" | "stock" | "crypto",
                subcategory: opp.subcategory,
                title: opp.title,
                description: opp.description,
                confidence_score: opp.confidence_score,
                expected_value: opp.expected_value,
                expires_at: opp.expires_at,
                data: opp.data,
                status: opp.status,
                user_id: opp.user_id,
              };

              const results = await sendOpportunityAlertBatch(
                userIds,
                notificationOpp,
              );
              alertsSent += results.filter((r) => r.success).length;
            }
          }
        }
      } catch (alertError) {
        console.error("Error sending realtime alerts:", alertError);
        // Don't add to errors array - alerts failing shouldn't fail the scan
      }
    }

    // Return results
    return NextResponse.json({
      success: true,
      scanType,
      timestamp: new Date().toISOString(),
      opportunities,
      count: opportunities.length,
      alertsSent,
      errors: errors.length > 0 ? errors : undefined,
      message:
        opportunities.length > 0
          ? `Found ${opportunities.length} opportunities${alertsSent > 0 ? `, sent ${alertsSent} alerts` : ""}`
          : errors.length > 0
            ? `Scan completed with errors: ${errors.join("; ")}`
            : "No opportunities found",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 },
    );
  }
}
