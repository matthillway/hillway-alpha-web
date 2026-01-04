import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { isUserSuperAdmin } from "@/lib/admin";
import { getCacheStats, resetCacheStats } from "@/lib/cache";

// GET /api/cache/stats - Get cache statistics (admin only)
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is super admin
    const isSuperAdmin = await isUserSuperAdmin(user.id);
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const stats = getCacheStats();

    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        estimatedCostSavings: calculateCostSavings(stats.hits),
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/cache/stats - Reset cache statistics (admin only)
export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is super admin
    const isSuperAdmin = await isUserSuperAdmin(user.id);
    if (!isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    resetCacheStats();

    return NextResponse.json({
      success: true,
      message: "Cache statistics reset",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * Estimate cost savings based on cache hits
 * This is a rough estimate based on typical API costs
 */
function calculateCostSavings(cacheHits: number): {
  estimatedAPICalls: number;
  estimatedSavingsUSD: number;
} {
  // Average cost per API call across our providers:
  // - Odds API: ~$0.01 per request
  // - Yahoo Finance: Free (but rate limited)
  // - Binance: Free (but rate limited)
  // Conservative estimate: $0.005 per avoided API call (weighted average)
  const avgCostPerCall = 0.005;

  return {
    estimatedAPICalls: cacheHits,
    estimatedSavingsUSD: Math.round(cacheHits * avgCostPerCall * 100) / 100,
  };
}
