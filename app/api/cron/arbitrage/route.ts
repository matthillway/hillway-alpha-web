// ============================================
// TRADESMART - Arbitrage Cron Handler
// Next.js App Router API Route
// Runs every 15 minutes during betting hours (10am-10pm UK)
// Schedule: */15 10-22 * * *
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 30; // 30 second timeout for quick arbitrage scan

// Track recently alerted opportunities (in-memory - resets on cold start)
const recentAlerts = new Map<string, number>();
const ALERT_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes

interface ArbitrageResults {
  timestamp: string;
  scannedEvents: number;
  opportunitiesFound: number;
  highMarginOpps: number;
  newAlerts: number;
  errors: string[];
}

async function runArbitrageScan(): Promise<{
  results: ArbitrageResults;
  opportunities: any[];
}> {
  const results: ArbitrageResults = {
    timestamp: new Date().toISOString(),
    scannedEvents: 0,
    opportunitiesFound: 0,
    highMarginOpps: 0,
    newAlerts: 0,
    errors: [],
  };

  if (!process.env.ODDS_API_KEY) {
    results.errors.push("ODDS_API_KEY not configured");
    return { results, opportunities: [] };
  }

  try {
    const { createOddsApiClient } = await import("@/lib/scanner-api/odds-api");
    const { createArbitrageScanner } =
      await import("@/lib/scanners/betting/arbitrage");

    const oddsClient = createOddsApiClient();
    const scanner = createArbitrageScanner(oddsClient, {
      minMargin: 0.5,
      sports: ["soccer_epl", "soccer_uefa_champs_league", "soccer_fa_cup"],
    });

    const opportunities = await scanner.scan();
    results.opportunitiesFound = opportunities.length;

    // Filter for high-margin opportunities (1%+)
    const highMarginOpps = opportunities.filter((o) => o.margin >= 1.0);
    results.highMarginOpps = highMarginOpps.length;

    // Send alerts for new high-margin opportunities
    for (const opp of highMarginOpps) {
      const key = `${opp.eventId}-${opp.sport}`;
      const lastAlert = recentAlerts.get(key);
      const now = Date.now();

      if (!lastAlert || now - lastAlert > ALERT_COOLDOWN_MS) {
        try {
          const { notifyUser } = await import("@/lib/notifications");

          const message = [
            `ARBITRAGE ALERT`,
            `${opp.homeTeam} vs ${opp.awayTeam}`,
            `Margin: ${opp.margin.toFixed(2)}%`,
            ``,
            ...opp.stakes.map(
              (s: any) => `${s.outcome}: ${s.odds.toFixed(2)} @ ${s.bookmaker}`,
            ),
            ``,
            `Total stake: £${opp.totalStake.toFixed(2)}`,
            `Guaranteed profit: £${opp.guaranteedProfit.toFixed(2)}`,
          ].join("\n");

          await notifyUser(message, "whatsapp");
          recentAlerts.set(key, now);
          results.newAlerts++;

          // Save to database
          if (
            process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ) {
            await supabase.from("opportunities").insert({
              type: "arbitrage",
              category: "betting",
              event_name: `${opp.homeTeam} vs ${opp.awayTeam}`,
              margin: opp.margin,
              confidence: Math.min(100, opp.margin * 20), // Rough confidence from margin
              data: opp,
              status: "open",
            });
          }
        } catch (error: any) {
          results.errors.push(
            `Alert failed for ${opp.eventId}: ${error.message}`,
          );
        }
      }
    }

    return { results, opportunities };
  } catch (error: any) {
    results.errors.push(`Scan failed: ${error.message}`);
    return { results, opportunities: [] };
  }
}

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    if (process.env.CRON_SECRET && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Check if we're in betting hours (10am - 10pm UK time)
  const now = new Date();
  const ukTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/London" }),
  );
  const ukHour = ukTime.getHours();

  if (ukHour < 10 || ukHour >= 22) {
    return NextResponse.json({
      success: true,
      message: `Outside betting hours (current UK hour: ${ukHour}). Skipping scan.`,
      skipped: true,
      timestamp: now.toISOString(),
    });
  }

  console.log(
    `[${now.toISOString()}] Arbitrage scan triggered (UK hour: ${ukHour})`,
  );

  try {
    const { results, opportunities } = await runArbitrageScan();

    return NextResponse.json({
      success: true,
      message: `Arbitrage scan complete. Found ${results.opportunitiesFound} opportunities, ${results.newAlerts} new alerts sent.`,
      ...results,
      topOpportunities: opportunities.slice(0, 5).map((o) => ({
        event: `${o.homeTeam} vs ${o.awayTeam}`,
        margin: o.margin,
        stakes: o.stakes.map((s: any) => ({
          outcome: s.outcome,
          odds: s.odds,
          bookmaker: s.bookmaker,
        })),
      })),
    });
  } catch (error: any) {
    console.error("Arbitrage scan failed:", error);
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
