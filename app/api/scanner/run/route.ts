import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

// Scanner imports
import { createMomentumScanner } from "@/lib/scanners/stocks/momentum";
import { createFundingRateScanner } from "@/lib/scanners/crypto/funding-rates";
// Betting scanners
import { createArbitrageScanner } from "@/lib/scanners/betting/arbitrage";
import { createValueBetScanner } from "@/lib/scanners/betting/value-bets";
import { createMatchedBettingScanner } from "@/lib/scanners/betting/matched-betting";
import { createOddsApiClient } from "@/lib/scanner-api/odds-api";
// Real-time email alerts
import {
  sendOpportunityAlertBatch,
  getUsersForRealtimeAlerts,
  type Opportunity as NotificationOpportunity,
} from "@/lib/email/send-notification";
// AI Analysis
import {
  analyzeOpportunity,
  shouldAnalyze,
  type AIAnalysis,
} from "@/lib/ai/analyze-opportunity";

// Minimum confidence to trigger realtime email alerts (70%+)
const MIN_CONFIDENCE_FOR_ALERTS = 70;
// Minimum confidence to trigger AI analysis (70%+)
const MIN_CONFIDENCE_FOR_AI_ANALYSIS = 70;

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
  enterprise: -1, // Unlimited
  unlimited: -1, // Alias for enterprise (backwards compatibility)
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

// Generate demo opportunities for free tier users
function generateDemoOpportunities(
  scanType: string,
  userId: string | null,
): DbOpportunity[] {
  const now = new Date();
  const expiresIn24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const expiresIn48h = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const demoOpps: DbOpportunity[] = [];

  // Betting demo opportunities
  if (
    scanType === "arbitrage" ||
    scanType === "betting" ||
    scanType === "all"
  ) {
    demoOpps.push({
      id: `demo-arb-${Date.now()}`,
      category: "arbitrage",
      subcategory: "soccer_epl",
      title: "Arsenal vs Chelsea - 2.3% margin",
      description:
        "Arbitrage opportunity: Arsenal @ 2.10 (Bet365) vs Chelsea @ 3.80 (William Hill) vs Draw @ 3.40 (Betfair)",
      confidence_score: 85,
      expected_value: 2.3,
      data: {
        eventId: "demo-event-1",
        homeTeam: "Arsenal",
        awayTeam: "Chelsea",
        sport: "soccer_epl",
        sportTitle: "English Premier League",
        margin: 2.3,
        isDemo: true,
        stakes: [
          { team: "Arsenal", odds: 2.1, bookmaker: "Bet365", stake: 47.62 },
          {
            team: "Chelsea",
            odds: 3.8,
            bookmaker: "William Hill",
            stake: 26.32,
          },
          { team: "Draw", odds: 3.4, bookmaker: "Betfair", stake: 29.41 },
        ],
        totalStake: 100,
        guaranteedReturn: 102.3,
        aiAnalysis: {
          summary:
            "Strong arbitrage opportunity on Premier League match. All bookmakers are reputable with good liquidity.",
          recommendation: "PROCEED",
          riskFactors: ["Line movement possible", "Account limits may apply"],
          confidence: 85,
        },
      },
      expires_at: expiresIn48h.toISOString(),
      status: "open",
      user_id: userId,
    });
  }

  if (
    scanType === "value_bets" ||
    scanType === "betting" ||
    scanType === "all"
  ) {
    demoOpps.push({
      id: `demo-vb-${Date.now()}`,
      category: "value_bet",
      subcategory: "value_bet",
      title: "Man City vs Liverpool - Man City Win @ 1.95",
      description:
        "Value bet: Man City has 58% model probability vs 51% implied. Expected value: +13.7%",
      confidence_score: 78,
      expected_value: 13.7,
      data: {
        event: "Man City vs Liverpool",
        selection: "Man City Win",
        bookmaker: "Betfair",
        bookmakerOdds: 1.95,
        impliedProbability: 51.3,
        modelProbability: 58.0,
        expectedValue: 13.7,
        suggestedStake: 25,
        sport: "soccer_epl",
        isDemo: true,
        aiAnalysis: {
          summary:
            "Historical data suggests bookmakers undervalue home advantage in big matches. Model factors in recent form.",
          recommendation: "PROCEED",
          riskFactors: ["Key player injuries", "Weather conditions"],
          confidence: 78,
        },
      },
      expires_at: expiresIn48h.toISOString(),
      status: "open",
      user_id: userId,
    });
  }

  if (
    scanType === "matched_betting" ||
    scanType === "betting" ||
    scanType === "all"
  ) {
    demoOpps.push({
      id: `demo-mb-${Date.now()}`,
      category: "value_bet",
      subcategory: "matched_betting",
      title: "Bet365 - £50 Free Bet New Customer Offer",
      description:
        "SNR free bet opportunity: Expected profit £42.50. Risk level: low. Time to complete: ~30 mins",
      confidence_score: 95,
      expected_value: 42.5,
      data: {
        promotion: {
          id: "demo-promo-1",
          bookmaker: "Bet365",
          type: "free_bet_snr",
          title: "£50 Free Bet New Customer Offer",
          value: 50,
          expectedValue: 42.5,
          isNewCustomer: true,
        },
        strategy: "stake_not_returned",
        expectedProfit: 42.5,
        profitRate: 0.85,
        steps: [
          "Open Bet365 account",
          "Place qualifying bet",
          "Lay on Betfair Exchange",
          "Receive free bet",
          "Use free bet on high odds selection",
          "Lay on exchange to lock in profit",
        ],
        requirements: ["Valid ID", "UK resident", "18+"],
        riskLevel: "low",
        timeToComplete: 30,
        isDemo: true,
        aiAnalysis: {
          summary:
            "Classic matched betting opportunity with one of the most reliable bookmakers. 85% retention rate typical for SNR bets.",
          recommendation: "PROCEED",
          riskFactors: ["Gubbing risk after multiple offers"],
          confidence: 95,
        },
      },
      expires_at: expiresIn24h.toISOString(),
      status: "open",
      user_id: userId,
    });
  }

  // Stock demo opportunities
  if (scanType === "stocks" || scanType === "all") {
    demoOpps.push({
      id: `demo-stock-${Date.now()}`,
      category: "stock",
      subcategory: "UK",
      title: "SHEL.L - Strong Bullish Signal",
      description:
        "Shell PLC showing strong momentum with RSI breakout, MACD crossover, and above-average volume. +3.2% expected move.",
      confidence_score: 72,
      expected_value: 3.2,
      data: {
        symbol: "SHEL.L",
        name: "Shell PLC",
        market: "UK",
        currentPrice: 2534.5,
        priceChange: 45.2,
        priceChangePercent: 1.81,
        signals: {
          rsi: "bullish",
          macd: "bullish",
          volume: "high",
          trend: "uptrend",
        },
        overallSignal: "strong_bullish",
        technicals: {
          rsi: 62,
          macd: 12.5,
          sma20: 2480,
          sma50: 2420,
        },
        volumeRatio: 1.45,
        fiftyTwoWeekPosition: 0.78,
        suggestedAction: "BUY",
        isDemo: true,
        aiAnalysis: {
          summary:
            "Energy sector showing strength amid supply concerns. Technical setup suggests continued momentum.",
          recommendation: "BUY",
          riskFactors: ["Oil price volatility", "Geopolitical risk"],
          confidence: 72,
        },
      },
      expires_at: expiresIn24h.toISOString(),
      status: "open",
      user_id: userId,
    });
  }

  // Crypto demo opportunities
  if (scanType === "crypto" || scanType === "all") {
    demoOpps.push({
      id: `demo-crypto-${Date.now()}`,
      category: "crypto",
      subcategory: "funding_rate",
      title: "ETHUSDT - Short 45% APY",
      description:
        "Funding rate opportunity: Go short on ETH. Current rate 0.05% per 8h (45.6% annualized). Risk: Medium",
      confidence_score: 68,
      expected_value: 45.6,
      data: {
        symbol: "ETHUSDT",
        asset: "ETH",
        currentRate: 0.05,
        annualizedRate: 45.6,
        direction: "short",
        markPrice: 3245.5,
        nextFundingTime: expiresIn24h.toISOString(),
        riskLevel: "medium",
        suggestedSize: 1000,
        isDemo: true,
        aiAnalysis: {
          summary:
            "Elevated funding rates suggest overleveraged long positions. Delta-neutral strategy recommended.",
          recommendation: "PROCEED_WITH_CAUTION",
          riskFactors: ["Funding rate can flip", "Liquidation risk"],
          confidence: 68,
        },
      },
      expires_at: expiresIn24h.toISOString(),
      status: "open",
      user_id: userId,
    });
  }

  return demoOpps;
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
    const validTypes = [
      "arbitrage",
      "value_bets",
      "matched_betting",
      "betting", // All betting scanners combined
      "stocks",
      "crypto",
      "all",
    ];
    if (!validTypes.includes(scanType)) {
      return NextResponse.json(
        { error: `Invalid scanType. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 },
      );
    }

    // Check tier limits
    const dailyLimit = TIER_LIMITS[userTier];

    // For free tier, return demo opportunities to show what the product can do
    if (dailyLimit === 0) {
      const demoOpportunities = generateDemoOpportunities(scanType, userId);
      return NextResponse.json({
        success: true,
        scanType,
        timestamp: new Date().toISOString(),
        opportunities: demoOpportunities,
        count: demoOpportunities.length,
        aiAnalysisCount: demoOpportunities.length,
        alertsSent: 0,
        isDemo: true,
        message: `Demo mode: Showing ${demoOpportunities.length} sample opportunities. Upgrade to scan live markets.`,
      });
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
    const runArbitrage =
      scanType === "arbitrage" || scanType === "betting" || scanType === "all";
    const runValueBets =
      scanType === "value_bets" || scanType === "betting" || scanType === "all";
    const runMatchedBetting =
      scanType === "matched_betting" ||
      scanType === "betting" ||
      scanType === "all";
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
            minMargin: 0.5, // Lowered to catch smaller opportunities
            maxHoursAhead: 72,
            totalStake: 100,
          });

          // Scan more sports for better coverage
          const arbOpportunities = await arbScanner.scan([
            "soccer_epl",
            "soccer_uefa_champs_league",
            "soccer_fa_cup",
            "soccer_efl_champ",
            "soccer_spain_la_liga",
            "soccer_germany_bundesliga",
            "soccer_italy_serie_a",
            "basketball_nba",
            "americanfootball_nfl",
          ]);

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

    // Run value bets scanner (requires ODDS_API_KEY)
    if (runValueBets) {
      try {
        if (!process.env.ODDS_API_KEY) {
          errors.push(
            "Value bets scanner unavailable: ODDS_API_KEY not configured",
          );
        } else {
          const oddsClient = createOddsApiClient();
          const valueBetScanner = createValueBetScanner(oddsClient, {
            minEdge: 1.5, // Lowered to find more value bets
            minConfidence: 50,
            maxHoursAhead: 72,
            bankroll: 1000,
            kellyFraction: 0.25,
          });

          // Scan more sports for better coverage
          const valueBetOpportunities = await valueBetScanner.scan([
            "soccer_epl",
            "soccer_uefa_champs_league",
            "soccer_fa_cup",
            "soccer_efl_champ",
            "soccer_spain_la_liga",
            "soccer_germany_bundesliga",
            "soccer_italy_serie_a",
            "basketball_nba",
            "americanfootball_nfl",
          ]);

          for (const vb of valueBetOpportunities) {
            const expiresAt = new Date(vb.commenceTime);
            opportunities.push({
              id: uuidv4(),
              category: "value_bet",
              subcategory: "value_bet",
              title: `${vb.event} - ${vb.selection} @ ${vb.bookmakerOdds.toFixed(2)}`,
              description: `Value bet: ${vb.selection} has ${vb.modelProbability.toFixed(1)}% model probability vs ${vb.impliedProbability.toFixed(1)}% implied. Expected value: +${vb.expectedValue.toFixed(1)}%`,
              confidence_score: vb.confidence,
              expected_value: vb.suggestedStake * (vb.expectedValue / 100),
              data: {
                event: vb.event,
                selection: vb.selection,
                bookmaker: vb.bookmaker,
                bookmakerOdds: vb.bookmakerOdds,
                impliedProbability: vb.impliedProbability,
                modelProbability: vb.modelProbability,
                expectedValue: vb.expectedValue,
                suggestedStake: vb.suggestedStake,
                sport: vb.sport,
              },
              expires_at: expiresAt.toISOString(),
              status: "open",
              user_id: userId || null,
            });
          }
        }
      } catch (err) {
        console.error("Value bets scan error:", err);
        errors.push(`Value bets scan failed: ${(err as Error).message}`);
      }
    }

    // Run matched betting scanner
    if (runMatchedBetting) {
      try {
        const matchedBettingScanner = createMatchedBettingScanner({
          includeSignupOffers: true,
          includeReloadOffers: true,
          minExpectedValue: 0,
          exchangeCommission: 0.02,
        });

        // Initialize accounts (in production, would load from database)
        await matchedBettingScanner.loadAccounts();

        const matchedBettingOpportunities =
          await matchedBettingScanner.getTopOpportunities(10);

        for (const mb of matchedBettingOpportunities) {
          // Matched betting opportunities don't have a fixed expiry, set 7 days
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 7);

          opportunities.push({
            id: uuidv4(),
            category: "value_bet", // Using value_bet category for betting opportunities
            subcategory: "matched_betting",
            title: `${mb.promotion.bookmaker} - ${mb.promotion.title}`,
            description: `${mb.strategy.replace("_", " ")} opportunity: Expected profit £${mb.expectedProfit.toFixed(2)}. Risk level: ${mb.riskLevel}. Time to complete: ~${mb.timeToComplete} mins`,
            confidence_score: mb.confidence,
            expected_value: mb.expectedProfit,
            data: {
              promotion: {
                id: mb.promotion.id,
                bookmaker: mb.promotion.bookmaker,
                type: mb.promotion.type,
                title: mb.promotion.title,
                value: mb.promotion.value,
                expectedValue: mb.promotion.expectedValue,
                isNewCustomer: mb.promotion.isNewCustomer,
              },
              strategy: mb.strategy,
              expectedProfit: mb.expectedProfit,
              profitRate: mb.profitRate,
              steps: mb.steps,
              requirements: mb.requirements,
              riskLevel: mb.riskLevel,
              timeToComplete: mb.timeToComplete,
            },
            expires_at: expiresAt.toISOString(),
            status: "open",
            user_id: userId || null,
          });
        }
      } catch (err) {
        console.error("Matched betting scan error:", err);
        errors.push(`Matched betting scan failed: ${(err as Error).message}`);
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
            // EV is always positive - we go the direction that RECEIVES funding
            expected_value:
              crypto.suggestedSize * (Math.abs(crypto.annualizedRate) / 100),
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

    // Run AI analysis on high-confidence opportunities (70%+)
    let aiAnalysisCount = 0;
    if (opportunities.length > 0 && process.env.ANTHROPIC_API_KEY) {
      try {
        const highConfidenceForAI = opportunities.filter(
          (opp) => opp.confidence_score >= MIN_CONFIDENCE_FOR_AI_ANALYSIS,
        );

        if (highConfidenceForAI.length > 0) {
          console.log(
            `Running AI analysis on ${highConfidenceForAI.length} high-confidence opportunities`,
          );

          // Analyze opportunities in parallel (with concurrency limit in the function)
          const analysisPromises = highConfidenceForAI.map(async (opp) => {
            try {
              const analysis = await analyzeOpportunity({
                id: opp.id,
                category: opp.category,
                subcategory: opp.subcategory,
                title: opp.title,
                description: opp.description,
                confidence_score: opp.confidence_score,
                expected_value: opp.expected_value,
                data: opp.data,
                expires_at: opp.expires_at,
              });

              // Store analysis in the opportunity's data field
              opp.data = {
                ...opp.data,
                aiAnalysis: analysis,
              };
              aiAnalysisCount++;
            } catch (analysisErr) {
              console.error(
                `AI analysis failed for opportunity ${opp.id}:`,
                analysisErr,
              );
              // Don't fail the whole scan if AI analysis fails
            }
          });

          await Promise.allSettled(analysisPromises);
        }
      } catch (aiError) {
        console.error("AI analysis batch error:", aiError);
        // Don't add to errors array - AI analysis failing shouldn't fail the scan
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
      aiAnalysisCount,
      alertsSent,
      errors: errors.length > 0 ? errors : undefined,
      message:
        opportunities.length > 0
          ? `Found ${opportunities.length} opportunities${aiAnalysisCount > 0 ? ` (${aiAnalysisCount} AI analyzed)` : ""}${alertsSent > 0 ? `, sent ${alertsSent} alerts` : ""}`
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
