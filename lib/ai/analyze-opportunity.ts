/**
 * AI Opportunity Analysis Module
 *
 * Uses Claude Haiku for cost-efficient analysis of trading opportunities.
 * Provides risk assessment, recommended actions, and potential pitfalls.
 */

import Anthropic from "@anthropic-ai/sdk";

// Types for AI analysis
export interface AIAnalysis {
  riskAssessment: {
    level: "low" | "medium" | "high";
    score: number; // 1-10 scale
    factors: string[];
  };
  recommendedAction: {
    action: "take" | "pass" | "monitor";
    confidence: number; // 0-100
    reasoning: string;
  };
  confidenceExplanation: string;
  potentialPitfalls: string[];
  timing: {
    urgency: "immediate" | "soon" | "flexible";
    optimalWindow: string;
  };
  summary: string;
}

export interface OpportunityForAnalysis {
  id: string;
  category: string;
  subcategory?: string;
  title: string;
  description: string;
  confidence_score: number;
  expected_value: number;
  data: Record<string, unknown>;
  expires_at?: string | null;
}

// Initialize Anthropic client
function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }
  return new Anthropic({ apiKey });
}

/**
 * Generate a contextual prompt based on opportunity category
 */
function buildAnalysisPrompt(opportunity: OpportunityForAnalysis): string {
  const baseContext = `You are an expert financial analyst specializing in ${opportunity.category} opportunities. Analyze the following opportunity and provide a structured assessment.`;

  let categoryContext = "";
  switch (opportunity.category) {
    case "arbitrage":
      categoryContext = `
This is a sports betting arbitrage opportunity where we exploit odds discrepancies between bookmakers.
Key factors to consider:
- Margin size and sustainability
- Time until event starts
- Bookmaker reliability and payout speed
- Maximum stake limits
- Risk of odds movement before all bets placed`;
      break;
    case "stock":
      categoryContext = `
This is a stock market momentum/technical analysis opportunity.
Key factors to consider:
- Signal strength and confirmation
- Market conditions and sentiment
- Volume and liquidity
- Technical indicator alignment
- Upcoming events (earnings, news)`;
      break;
    case "crypto":
      categoryContext = `
This is a cryptocurrency funding rate arbitrage opportunity on perpetual futures.
Key factors to consider:
- Funding rate sustainability
- Exchange risk and reliability
- Liquidation risk at suggested position size
- Historical funding rate patterns
- Market volatility`;
      break;
    default:
      categoryContext = `Analyze this opportunity based on standard risk/reward principles.`;
  }

  const opportunityData = `
OPPORTUNITY DETAILS:
- Title: ${opportunity.title}
- Description: ${opportunity.description}
- Category: ${opportunity.category}
- Subcategory: ${opportunity.subcategory || "N/A"}
- Scanner Confidence: ${opportunity.confidence_score}%
- Expected Value: ${opportunity.expected_value > 0 ? "£" + opportunity.expected_value.toFixed(2) : opportunity.expected_value.toFixed(2) + "%"}
- Expires: ${opportunity.expires_at || "N/A"}
- Additional Data: ${JSON.stringify(opportunity.data, null, 2)}`;

  return `${baseContext}

${categoryContext}

${opportunityData}

Provide your analysis in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "riskAssessment": {
    "level": "low" | "medium" | "high",
    "score": <1-10>,
    "factors": ["factor1", "factor2", ...]
  },
  "recommendedAction": {
    "action": "take" | "pass" | "monitor",
    "confidence": <0-100>,
    "reasoning": "detailed reasoning"
  },
  "confidenceExplanation": "explanation of the confidence score",
  "potentialPitfalls": ["pitfall1", "pitfall2", ...],
  "timing": {
    "urgency": "immediate" | "soon" | "flexible",
    "optimalWindow": "description of best time to act"
  },
  "summary": "2-3 sentence executive summary"
}`;
}

/**
 * Parse AI response into structured analysis
 */
function parseAnalysisResponse(response: string): AIAnalysis {
  try {
    // Clean up response if needed (remove markdown code blocks)
    let cleaned = response.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const parsed = JSON.parse(cleaned);

    // Validate and provide defaults
    return {
      riskAssessment: {
        level: parsed.riskAssessment?.level || "medium",
        score: Math.min(10, Math.max(1, parsed.riskAssessment?.score || 5)),
        factors: parsed.riskAssessment?.factors || [],
      },
      recommendedAction: {
        action: parsed.recommendedAction?.action || "monitor",
        confidence: Math.min(
          100,
          Math.max(0, parsed.recommendedAction?.confidence || 50),
        ),
        reasoning: parsed.recommendedAction?.reasoning || "Unable to determine",
      },
      confidenceExplanation:
        parsed.confidenceExplanation || "Analysis incomplete",
      potentialPitfalls: parsed.potentialPitfalls || [],
      timing: {
        urgency: parsed.timing?.urgency || "flexible",
        optimalWindow: parsed.timing?.optimalWindow || "Review before acting",
      },
      summary: parsed.summary || "Analysis could not be completed",
    };
  } catch (error) {
    console.error("Failed to parse AI response:", error, response);
    // Return a safe default analysis
    return {
      riskAssessment: {
        level: "medium",
        score: 5,
        factors: ["Analysis parsing error - manual review recommended"],
      },
      recommendedAction: {
        action: "monitor",
        confidence: 50,
        reasoning:
          "AI analysis could not be parsed. Manual review recommended.",
      },
      confidenceExplanation:
        "Unable to complete analysis due to response parsing error.",
      potentialPitfalls: ["AI analysis incomplete - verify manually"],
      timing: {
        urgency: "flexible",
        optimalWindow: "Review manually before making a decision",
      },
      summary:
        "Analysis could not be completed. Please review the opportunity manually.",
    };
  }
}

/**
 * Analyze an opportunity using Claude Haiku
 *
 * @param opportunity - The opportunity to analyze
 * @returns AI analysis with risk assessment and recommendations
 */
export async function analyzeOpportunity(
  opportunity: OpportunityForAnalysis,
): Promise<AIAnalysis> {
  const client = getAnthropicClient();
  const prompt = buildAnalysisPrompt(opportunity);

  try {
    const message = await client.messages.create({
      model: "claude-3-haiku-20240307", // Cost-efficient model for analysis
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract text from response
    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in AI response");
    }

    return parseAnalysisResponse(textContent.text);
  } catch (error) {
    console.error("AI analysis error:", error);
    throw error;
  }
}

/**
 * Analyze multiple opportunities in batch (for efficiency)
 *
 * @param opportunities - Array of opportunities to analyze
 * @returns Map of opportunity ID to AI analysis
 */
export async function analyzeOpportunitiesBatch(
  opportunities: OpportunityForAnalysis[],
): Promise<Map<string, AIAnalysis>> {
  const results = new Map<string, AIAnalysis>();

  // Process in parallel with concurrency limit
  const BATCH_SIZE = 5;
  for (let i = 0; i < opportunities.length; i += BATCH_SIZE) {
    const batch = opportunities.slice(i, i + BATCH_SIZE);
    const analyses = await Promise.allSettled(
      batch.map((opp) => analyzeOpportunity(opp)),
    );

    analyses.forEach((result, index) => {
      const oppId = batch[index].id;
      if (result.status === "fulfilled") {
        results.set(oppId, result.value);
      } else {
        console.error(`Failed to analyze opportunity ${oppId}:`, result.reason);
        // Store error analysis
        results.set(oppId, {
          riskAssessment: {
            level: "medium",
            score: 5,
            factors: ["Analysis failed - manual review required"],
          },
          recommendedAction: {
            action: "monitor",
            confidence: 0,
            reasoning: "Analysis failed. Please review manually.",
          },
          confidenceExplanation: "Analysis could not be completed.",
          potentialPitfalls: ["Unable to assess - review manually"],
          timing: {
            urgency: "flexible",
            optimalWindow: "Pending manual review",
          },
          summary: "Analysis failed. Manual review required.",
        });
      }
    });
  }

  return results;
}

/**
 * Check if an opportunity should receive AI analysis based on confidence threshold
 */
export function shouldAnalyze(
  opportunity: OpportunityForAnalysis,
  minConfidence: number = 70,
): boolean {
  return opportunity.confidence_score >= minConfidence;
}
