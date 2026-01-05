import { NextRequest, NextResponse } from "next/server";
import {
  getTipOfTheDay,
  getTips,
  getQuickTips,
  getExecutionGuidance,
  getRiskWarnings,
  getPlatformInstructions,
  getAvailablePlatforms,
  type OpportunityCategory,
  type ExperienceLevel,
} from "@/lib/tips";

// =============================================================================
// GET /api/tips - Get tips and guidance
// =============================================================================
// Query parameters:
// - type: 'daily' | 'quick' | 'full' | 'guidance' (default: 'daily')
// - category: 'arbitrage' | 'value_bet' | 'stock' | 'crypto'
// - level: 'beginner' | 'intermediate' | 'advanced'
// - platform: string (for platform-specific instructions)
// - limit: number (for quick tips)
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const type = searchParams.get("type") || "daily";
    const category = searchParams.get("category") as OpportunityCategory | null;
    const level = searchParams.get("level") as ExperienceLevel | null;
    const platform = searchParams.get("platform");
    const limit = parseInt(searchParams.get("limit") || "5");

    switch (type) {
      case "daily": {
        // Get tip of the day
        const tip = getTipOfTheDay(category || undefined);
        return NextResponse.json({
          type: "daily",
          tip,
        });
      }

      case "quick": {
        // Get quick tips for sidebar
        const tips = getQuickTips(category || undefined, limit);
        return NextResponse.json({
          type: "quick",
          tips,
          count: tips.length,
        });
      }

      case "full": {
        // Get all tips filtered by category and level
        const tips = getTips(
          category || undefined,
          level || undefined,
          limit || undefined,
        );
        return NextResponse.json({
          type: "full",
          tips,
          count: tips.length,
          filters: {
            category,
            level,
            limit,
          },
        });
      }

      case "guidance": {
        // Get full execution guidance for a category
        if (!category) {
          return NextResponse.json(
            {
              error:
                "Category is required for guidance. Use: arbitrage, value_bet, stock, or crypto",
            },
            { status: 400 },
          );
        }

        const guidance = getExecutionGuidance(category);
        const warnings = getRiskWarnings(category);
        const platforms = getAvailablePlatforms(category);
        const platformInstructions = platform
          ? getPlatformInstructions(category, platform)
          : null;

        return NextResponse.json({
          type: "guidance",
          category,
          guidance: {
            overview: guidance.overview,
            executionSteps: guidance.executionSteps,
            riskWarnings: warnings,
            moneyManagement: guidance.moneyManagement,
            commonMistakes: guidance.commonMistakes,
            proTips: guidance.proTips,
          },
          platforms: {
            available: platforms,
            selected: platform,
            instructions: platformInstructions,
          },
        });
      }

      case "platforms": {
        // Get available platforms for a category
        if (!category) {
          return NextResponse.json(
            { error: "Category is required for platform list" },
            { status: 400 },
          );
        }

        const platforms = getAvailablePlatforms(category);
        const allInstructions: Record<string, string[]> = {};

        platforms.forEach((p) => {
          allInstructions[p] = getPlatformInstructions(category, p);
        });

        return NextResponse.json({
          type: "platforms",
          category,
          platforms,
          instructions: allInstructions,
        });
      }

      case "warnings": {
        // Get risk warnings for a category
        if (!category) {
          return NextResponse.json(
            { error: "Category is required for warnings" },
            { status: 400 },
          );
        }

        const warnings = getRiskWarnings(category);
        return NextResponse.json({
          type: "warnings",
          category,
          warnings,
        });
      }

      default:
        return NextResponse.json(
          {
            error: `Invalid type: ${type}. Use: daily, quick, full, guidance, platforms, or warnings`,
          },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Tips API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
