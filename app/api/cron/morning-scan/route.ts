// ============================================
// TRADESMART - Morning Scan Cron Handler
// Next.js App Router API Route
// Runs at 7:00 AM UK time (0 7 * * *)
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 60; // 60 second timeout for comprehensive scan

interface ScanResults {
  timestamp: string;
  opportunities: {
    arbitrage: number;
    valueBets: number;
    momentum: number;
    sentiment: number;
    fundingRates: number;
  };
  errors: string[];
  duration: number;
}

async function runMorningScan(): Promise<{
  results: ScanResults;
  allOpportunities: any[];
}> {
  const results: ScanResults = {
    timestamp: new Date().toISOString(),
    opportunities: {
      arbitrage: 0,
      valueBets: 0,
      momentum: 0,
      sentiment: 0,
      fundingRates: 0,
    },
    errors: [],
    duration: 0,
  };

  const startTime = Date.now();
  const allOpportunities: any[] = [];

  // Run betting scans if API key available
  if (process.env.ODDS_API_KEY) {
    try {
      const { createOddsApiClient } =
        await import("@/lib/scanner-api/odds-api");
      const { createArbitrageScanner } =
        await import("@/lib/scanners/betting/arbitrage");
      const { createValueBetScanner } =
        await import("@/lib/scanners/betting/value-bets");

      const oddsClient = createOddsApiClient();

      // Arbitrage scan
      const arbScanner = createArbitrageScanner(oddsClient, { minMargin: 0.5 });
      const arbOpps = await arbScanner.scan();
      results.opportunities.arbitrage = arbOpps.length;
      allOpportunities.push(
        ...arbOpps.map((o) => ({
          ...o,
          category: "betting",
          type: "arbitrage",
        })),
      );

      // Value bet scan
      const valueScanner = createValueBetScanner(oddsClient, {
        minEdge: 3,
        minConfidence: 50,
      });
      const valueOpps = await valueScanner.scan();
      results.opportunities.valueBets = valueOpps.length;
      allOpportunities.push(
        ...valueOpps.map((o) => ({
          ...o,
          category: "betting",
          type: "value_bet",
        })),
      );
    } catch (error: any) {
      results.errors.push(`Betting scan error: ${error.message}`);
    }
  }

  // Stock momentum scan
  try {
    const { createMomentumScanner } =
      await import("@/lib/scanners/stocks/momentum");
    const scanner = createMomentumScanner({
      markets: ["UK", "US"],
      minConfidence: 50,
    });
    const opps = await scanner.scan();
    results.opportunities.momentum = opps.length;
    allOpportunities.push(
      ...opps.map((o) => ({ ...o, category: "stocks", type: "momentum" })),
    );
  } catch (error: any) {
    results.errors.push(`Stock scan error: ${error.message}`);
  }

  // Crypto sentiment scan
  try {
    const { createSentimentScanner } =
      await import("@/lib/scanners/crypto/sentiment");
    const scanner = createSentimentScanner({ minSignalStrength: 40 });
    const opps = await scanner.scan();
    results.opportunities.sentiment = opps.length;
    allOpportunities.push(
      ...opps.map((o) => ({ ...o, category: "crypto", type: "sentiment" })),
    );
  } catch (error: any) {
    results.errors.push(`Sentiment scan error: ${error.message}`);
  }

  // Crypto funding rates scan
  try {
    const { createFundingRateScanner } =
      await import("@/lib/scanners/crypto/funding-rates");
    const scanner = createFundingRateScanner({
      minAnnualizedRate: 50,
      topPairsCount: 20,
    });
    const opps = await scanner.scan();
    results.opportunities.fundingRates = opps.length;
    allOpportunities.push(
      ...opps.map((o) => ({ ...o, category: "crypto", type: "funding_rate" })),
    );
  } catch (error: any) {
    results.errors.push(`Funding rate scan error: ${error.message}`);
  }

  // Save opportunities to Supabase
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    allOpportunities.length > 0
  ) {
    try {
      for (const opp of allOpportunities.slice(0, 20)) {
        const { error } = await supabase.from("opportunities").insert({
          type: opp.type,
          category: opp.category,
          event_name: opp.event || opp.symbol || "Unknown",
          margin: opp.margin,
          confidence: opp.confidence,
          data: opp,
          status: "open",
        });
        if (error) {
          results.errors.push(`DB insert error: ${error.message}`);
        }
      }
    } catch (error: any) {
      results.errors.push(`Database save error: ${error.message}`);
    }
  }

  // Send notification if opportunities found
  const totalOpps = Object.values(results.opportunities).reduce(
    (a, b) => a + b,
    0,
  );
  if (totalOpps > 0) {
    try {
      const { notifyUser } = await import("@/lib/notifications");
      const message = `Morning Scan: Found ${totalOpps} opportunities (${results.opportunities.arbitrage} arb, ${results.opportunities.valueBets} value, ${results.opportunities.momentum} stocks, ${results.opportunities.sentiment} sentiment, ${results.opportunities.fundingRates} funding).`;
      await notifyUser(message, "all");
    } catch (error: any) {
      results.errors.push(`Notification error: ${error.message}`);
    }
  }

  results.duration = Date.now() - startTime;
  return { results, allOpportunities };
}

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Allow requests without auth in development or if CRON_SECRET not set
    if (process.env.CRON_SECRET && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  console.log(`[${new Date().toISOString()}] Morning scan triggered`);

  try {
    const { results, allOpportunities } = await runMorningScan();

    const totalOpps = Object.values(results.opportunities).reduce(
      (a, b) => a + b,
      0,
    );

    return NextResponse.json({
      success: true,
      message: `Morning scan complete. Found ${totalOpps} opportunities.`,
      ...results,
      opportunityDetails: allOpportunities.slice(0, 10).map((o) => ({
        type: o.type,
        category: o.category,
        event: o.event || o.symbol || "Unknown",
        margin: o.margin,
        confidence: o.confidence,
      })),
    });
  } catch (error: any) {
    console.error("Morning scan failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
