/**
 * Feature Highlight Email Template
 *
 * Sent Day 3 after signup.
 * Deep dive on AI opportunity scoring with real example.
 */

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { BRAND_CONFIG } from "../../brand-config";

export interface SampleOpportunity {
  title: string;
  category: "arbitrage" | "stock" | "crypto";
  subcategory: string;
  confidence: number;
  expectedValue: number;
  aiAnalysis: string;
}

export interface FeatureHighlightEmailProps {
  userName: string;
  dashboardUrl: string;
  sampleOpportunity?: SampleOpportunity;
}

const BRAND_COLOR = BRAND_CONFIG.colors.primary;
const BRAND_NAME = BRAND_CONFIG.name;

const defaultSampleOpportunity: SampleOpportunity = {
  title: "BTC/ETH Correlation Divergence",
  category: "crypto",
  subcategory: "Correlation Trade",
  confidence: 82,
  expectedValue: 3.4,
  aiAnalysis:
    "Historical correlation between BTC and ETH has temporarily broken down. Based on 2,847 similar patterns since 2020, convergence typically occurs within 24-48 hours with an average return of 3.2%.",
};

const categoryConfig = {
  arbitrage: { color: "#10B981", emoji: "🎯", label: "Arbitrage" },
  stock: { color: "#8B5CF6", emoji: "📈", label: "Stock" },
  crypto: { color: "#F59E0B", emoji: "₿", label: "Crypto" },
};

export function FeatureHighlightEmail({
  userName,
  dashboardUrl,
  sampleOpportunity,
}: FeatureHighlightEmailProps) {
  const opportunity = sampleOpportunity || defaultSampleOpportunity;
  const config = categoryConfig[opportunity.category];
  const previewText = `See how AI finds opportunities like "${opportunity.title}"`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>{BRAND_NAME}</Heading>
            <Text style={headerSubtitle}>Feature Spotlight</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={dayBadge}>Day 3 of Your Trial</Text>
            <Heading style={h2}>
              The Secret Sauce: AI Opportunity Scoring
            </Heading>
            <Text style={paragraph}>
              Hey {userName}, today we're diving deep into what makes{" "}
              {BRAND_NAME} different from other scanners: our AI-powered
              opportunity scoring system.
            </Text>

            {/* How It Works Section */}
            <Section style={explanationSection}>
              <Heading style={h3}>How AI Scoring Works</Heading>
              <Text style={explanationText}>
                Every opportunity that hits your dashboard goes through our
                three-stage analysis:
              </Text>

              <Section style={stageItem}>
                <Text style={stageNumber}>1</Text>
                <div style={stageContent}>
                  <Text style={stageTitle}>Pattern Recognition</Text>
                  <Text style={stageDescription}>
                    Our AI compares current conditions against millions of
                    historical patterns to identify statistical edges.
                  </Text>
                </div>
              </Section>

              <Section style={stageItem}>
                <Text style={stageNumber}>2</Text>
                <div style={stageContent}>
                  <Text style={stageTitle}>Risk Assessment</Text>
                  <Text style={stageDescription}>
                    Each opportunity is scored for volatility, liquidity, and
                    time sensitivity to estimate risk-adjusted returns.
                  </Text>
                </div>
              </Section>

              <Section style={stageItem}>
                <Text style={stageNumber}>3</Text>
                <div style={stageContent}>
                  <Text style={stageTitle}>Confidence Scoring</Text>
                  <Text style={stageDescription}>
                    The final confidence score (0-100%) reflects the probability
                    of success based on all analyzed factors.
                  </Text>
                </div>
              </Section>
            </Section>

            {/* Real Example */}
            <Heading style={h3}>Real Example: Here's What the AI Found</Heading>
            <Section style={opportunityCard}>
              <Section style={opportunityHeader}>
                <Text style={categoryBadgeStyle}>
                  {config.emoji} {config.label} / {opportunity.subcategory}
                </Text>
              </Section>

              <Heading style={opportunityTitle}>{opportunity.title}</Heading>

              {/* Metrics */}
              <Section style={metricsRow}>
                <div style={metric}>
                  <Text style={metricLabel}>Confidence</Text>
                  <Text
                    style={{
                      ...metricValue,
                      color:
                        opportunity.confidence >= 80
                          ? "#10B981"
                          : opportunity.confidence >= 60
                            ? "#F59E0B"
                            : "#EF4444",
                    }}
                  >
                    {opportunity.confidence}%
                  </Text>
                </div>
                <div style={metric}>
                  <Text style={metricLabel}>Expected Return</Text>
                  <Text style={{ ...metricValue, color: "#10B981" }}>
                    +{opportunity.expectedValue}%
                  </Text>
                </div>
              </Section>

              {/* AI Analysis */}
              <Section style={aiAnalysisSection}>
                <Text style={aiLabel}>🤖 AI Analysis</Text>
                <Text style={aiAnalysisText}>{opportunity.aiAnalysis}</Text>
              </Section>
            </Section>

            <Button
              style={primaryButton}
              href={`${dashboardUrl}/dashboard/opportunities`}
            >
              Explore Live Opportunities
            </Button>

            {/* Quick Stats */}
            <Section style={statsSection}>
              <Heading style={h4}>Why Trust the Score?</Heading>
              <table
                role="presentation"
                width="100%"
                cellPadding="0"
                cellSpacing="0"
              >
                <tr>
                  <td style={statCell}>
                    <Text style={statValue}>2.4M+</Text>
                    <Text style={statLabel}>Patterns Analyzed</Text>
                  </td>
                  <td style={statCell}>
                    <Text style={statValue}>73%</Text>
                    <Text style={statLabel}>Win Rate (75%+ Score)</Text>
                  </td>
                  <td style={statCell}>
                    <Text style={statValue}>24/7</Text>
                    <Text style={statLabel}>Market Scanning</Text>
                  </td>
                </tr>
              </table>
            </Section>

            <Hr style={divider} />

            <Text style={paragraph}>
              Pro tip: Focus on opportunities with 75%+ confidence score for the
              best risk-adjusted returns.
            </Text>

            <Text style={signoff}>
              To your trading success,
              <br />
              <strong>The {BRAND_NAME} Team</strong>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <Link
                href={`${dashboardUrl}/dashboard/settings`}
                style={footerLink}
              >
                Manage email preferences
              </Link>
            </Text>
            <Hr style={footerHr} />
            <Text style={footerCopyright}>
              &copy; {new Date().getFullYear()} {BRAND_NAME} by{" "}
              {BRAND_CONFIG.company}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#0f172a",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
};

const header = {
  backgroundColor: BRAND_COLOR,
  padding: "32px",
  borderRadius: "8px 8px 0 0",
  textAlign: "center" as const,
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0",
};

const headerSubtitle = {
  color: "rgba(255, 255, 255, 0.9)",
  fontSize: "16px",
  margin: "8px 0 0 0",
};

const content = {
  backgroundColor: "#1e293b",
  padding: "32px",
};

const dayBadge = {
  backgroundColor: "rgba(22, 163, 74, 0.15)",
  color: BRAND_COLOR,
  fontSize: "12px",
  fontWeight: "600",
  padding: "6px 12px",
  borderRadius: "9999px",
  display: "inline-block",
  margin: "0 0 16px 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const h2 = {
  color: "#f1f5f9",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const h3 = {
  color: "#f1f5f9",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const h4 = {
  color: "#f1f5f9",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 16px 0",
  textAlign: "center" as const,
};

const paragraph = {
  color: "#94a3b8",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const explanationSection = {
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  padding: "24px",
  margin: "0 0 24px 0",
  border: "1px solid #334155",
};

const explanationText = {
  color: "#94a3b8",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 20px 0",
};

const stageItem = {
  display: "flex" as const,
  marginBottom: "16px",
};

const stageNumber = {
  backgroundColor: BRAND_COLOR,
  color: "#ffffff",
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  display: "inline-flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  fontSize: "14px",
  fontWeight: "700",
  margin: "0 14px 0 0",
  flexShrink: 0,
};

const stageContent = {
  flex: 1,
};

const stageTitle = {
  color: "#f1f5f9",
  fontSize: "15px",
  fontWeight: "600",
  margin: "0 0 4px 0",
};

const stageDescription = {
  color: "#94a3b8",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0",
};

const opportunityCard = {
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  padding: "24px",
  margin: "0 0 24px 0",
  border: "1px solid #334155",
};

const opportunityHeader = {
  marginBottom: "12px",
};

const categoryBadgeStyle = {
  backgroundColor: "rgba(245, 158, 11, 0.15)",
  color: "#F59E0B",
  fontSize: "12px",
  fontWeight: "600",
  padding: "4px 10px",
  borderRadius: "4px",
  display: "inline-block",
  margin: "0",
};

const opportunityTitle = {
  color: "#f1f5f9",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const metricsRow = {
  display: "flex" as const,
  gap: "24px",
  margin: "0 0 20px 0",
};

const metric = {
  flex: "1",
};

const metricLabel = {
  color: "#64748b",
  fontSize: "11px",
  margin: "0 0 4px 0",
  textTransform: "uppercase" as const,
};

const metricValue = {
  fontSize: "24px",
  fontWeight: "700",
  margin: "0",
};

const aiAnalysisSection = {
  backgroundColor: "#1e293b",
  borderRadius: "6px",
  padding: "16px",
  border: "1px solid #334155",
};

const aiLabel = {
  color: "#94a3b8",
  fontSize: "12px",
  fontWeight: "600",
  margin: "0 0 8px 0",
};

const aiAnalysisText = {
  color: "#cbd5e1",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
  fontStyle: "italic" as const,
};

const primaryButton = {
  backgroundColor: BRAND_COLOR,
  borderRadius: "6px",
  color: "#ffffff",
  display: "block",
  fontSize: "16px",
  fontWeight: "600",
  padding: "14px 24px",
  textAlign: "center" as const,
  textDecoration: "none",
  margin: "0 0 24px 0",
};

const statsSection = {
  backgroundColor: "rgba(22, 163, 74, 0.08)",
  borderRadius: "8px",
  padding: "24px",
  margin: "0 0 24px 0",
  border: "1px solid rgba(22, 163, 74, 0.2)",
};

const statCell = {
  textAlign: "center" as const,
  padding: "8px",
};

const statValue = {
  color: BRAND_COLOR,
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 4px 0",
};

const statLabel = {
  color: "#94a3b8",
  fontSize: "11px",
  margin: "0",
  textTransform: "uppercase" as const,
};

const divider = {
  borderColor: "#334155",
  margin: "24px 0",
};

const signoff = {
  color: "#94a3b8",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0",
};

const footer = {
  backgroundColor: "#0f172a",
  padding: "24px 32px",
  borderRadius: "0 0 8px 8px",
  borderTop: "1px solid #334155",
};

const footerText = {
  color: "#64748b",
  fontSize: "13px",
  margin: "0 0 16px 0",
  textAlign: "center" as const,
};

const footerLink = {
  color: BRAND_COLOR,
  textDecoration: "underline",
};

const footerHr = {
  borderColor: "#334155",
  margin: "16px 0",
};

const footerCopyright = {
  color: "#475569",
  fontSize: "12px",
  margin: "0",
  textAlign: "center" as const,
};

export default FeatureHighlightEmail;

// Plain HTML export for fallback
export function featureHighlightHtml(
  props: FeatureHighlightEmailProps,
): string {
  const opportunity = props.sampleOpportunity || defaultSampleOpportunity;
  const config = categoryConfig[opportunity.category];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Feature Spotlight - ${BRAND_NAME}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0f172a;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: ${BRAND_COLOR}; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">${BRAND_NAME}</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Feature Spotlight</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <span style="background-color: rgba(22, 163, 74, 0.15); color: ${BRAND_COLOR}; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 9999px; display: inline-block; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Day 3 of Your Trial</span>

              <h2 style="color: #f1f5f9; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">The Secret Sauce: AI Opportunity Scoring</h2>
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Hey ${props.userName}, today we're diving deep into what makes ${BRAND_NAME} different from other scanners: our AI-powered opportunity scoring system.
              </p>

              <!-- How It Works -->
              <div style="background-color: #0f172a; border-radius: 8px; padding: 24px; margin-bottom: 24px; border: 1px solid #334155;">
                <h3 style="color: #f1f5f9; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">How AI Scoring Works</h3>
                <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">Every opportunity that hits your dashboard goes through our three-stage analysis:</p>

                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td width="42" style="vertical-align: top; padding-bottom: 16px;">
                      <span style="background-color: ${BRAND_COLOR}; color: #ffffff; width: 28px; height: 28px; border-radius: 50%; display: inline-block; text-align: center; line-height: 28px; font-weight: 700; font-size: 14px;">1</span>
                    </td>
                    <td style="vertical-align: top; padding-bottom: 16px;">
                      <p style="color: #f1f5f9; font-size: 15px; font-weight: 600; margin: 0 0 4px 0;">Pattern Recognition</p>
                      <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0;">Our AI compares current conditions against millions of historical patterns.</p>
                    </td>
                  </tr>
                  <tr>
                    <td width="42" style="vertical-align: top; padding-bottom: 16px;">
                      <span style="background-color: ${BRAND_COLOR}; color: #ffffff; width: 28px; height: 28px; border-radius: 50%; display: inline-block; text-align: center; line-height: 28px; font-weight: 700; font-size: 14px;">2</span>
                    </td>
                    <td style="vertical-align: top; padding-bottom: 16px;">
                      <p style="color: #f1f5f9; font-size: 15px; font-weight: 600; margin: 0 0 4px 0;">Risk Assessment</p>
                      <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0;">Each opportunity is scored for volatility, liquidity, and time sensitivity.</p>
                    </td>
                  </tr>
                  <tr>
                    <td width="42" style="vertical-align: top;">
                      <span style="background-color: ${BRAND_COLOR}; color: #ffffff; width: 28px; height: 28px; border-radius: 50%; display: inline-block; text-align: center; line-height: 28px; font-weight: 700; font-size: 14px;">3</span>
                    </td>
                    <td style="vertical-align: top;">
                      <p style="color: #f1f5f9; font-size: 15px; font-weight: 600; margin: 0 0 4px 0;">Confidence Scoring</p>
                      <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0;">The final confidence score reflects the probability of success.</p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Real Example -->
              <h3 style="color: #f1f5f9; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">Real Example: Here's What the AI Found</h3>
              <div style="background-color: #0f172a; border-radius: 8px; padding: 24px; margin-bottom: 24px; border: 1px solid #334155;">
                <span style="background-color: rgba(245, 158, 11, 0.15); color: #F59E0B; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 4px; display: inline-block; margin-bottom: 12px;">${config.emoji} ${config.label} / ${opportunity.subcategory}</span>
                <h4 style="color: #f1f5f9; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">${opportunity.title}</h4>

                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                  <tr>
                    <td width="50%">
                      <p style="color: #64748b; font-size: 11px; margin: 0 0 4px 0; text-transform: uppercase;">Confidence</p>
                      <p style="font-size: 24px; font-weight: 700; margin: 0; color: ${opportunity.confidence >= 80 ? "#10B981" : opportunity.confidence >= 60 ? "#F59E0B" : "#EF4444"};">${opportunity.confidence}%</p>
                    </td>
                    <td width="50%">
                      <p style="color: #64748b; font-size: 11px; margin: 0 0 4px 0; text-transform: uppercase;">Expected Return</p>
                      <p style="font-size: 24px; font-weight: 700; margin: 0; color: #10B981;">+${opportunity.expectedValue}%</p>
                    </td>
                  </tr>
                </table>

                <div style="background-color: #1e293b; border-radius: 6px; padding: 16px; border: 1px solid #334155;">
                  <p style="color: #94a3b8; font-size: 12px; font-weight: 600; margin: 0 0 8px 0;">🤖 AI Analysis</p>
                  <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0; font-style: italic;">${opportunity.aiAnalysis}</p>
                </div>
              </div>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 24px 0; width: 100%;">
                <tr>
                  <td style="border-radius: 6px; background-color: ${BRAND_COLOR}; text-align: center;">
                    <a href="${props.dashboardUrl}/dashboard/opportunities" style="display: block; padding: 14px 24px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Explore Live Opportunities
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Stats -->
              <div style="background-color: rgba(22, 163, 74, 0.08); border-radius: 8px; padding: 24px; margin-bottom: 24px; border: 1px solid rgba(22, 163, 74, 0.2);">
                <h4 style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 0 0 16px 0; text-align: center;">Why Trust the Score?</h4>
                <table role="presentation" cellspacing="0" cellpadding="8" border="0" width="100%">
                  <tr>
                    <td width="33%" style="text-align: center;">
                      <p style="color: ${BRAND_COLOR}; font-size: 24px; font-weight: 700; margin: 0 0 4px 0;">2.4M+</p>
                      <p style="color: #94a3b8; font-size: 11px; margin: 0; text-transform: uppercase;">Patterns Analyzed</p>
                    </td>
                    <td width="33%" style="text-align: center;">
                      <p style="color: ${BRAND_COLOR}; font-size: 24px; font-weight: 700; margin: 0 0 4px 0;">73%</p>
                      <p style="color: #94a3b8; font-size: 11px; margin: 0; text-transform: uppercase;">Win Rate (75%+)</p>
                    </td>
                    <td width="33%" style="text-align: center;">
                      <p style="color: ${BRAND_COLOR}; font-size: 24px; font-weight: 700; margin: 0 0 4px 0;">24/7</p>
                      <p style="color: #94a3b8; font-size: 11px; margin: 0; text-transform: uppercase;">Market Scanning</p>
                    </td>
                  </tr>
                </table>
              </div>

              <hr style="border: none; border-top: 1px solid #334155; margin: 24px 0;">

              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                Pro tip: Focus on opportunities with 75%+ confidence score for the best risk-adjusted returns.
              </p>

              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0;">
                To your trading success,<br>
                <strong>The ${BRAND_NAME} Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0f172a; border-top: 1px solid #334155;">
              <p style="color: #64748b; font-size: 13px; margin: 0 0 16px 0; text-align: center;">
                <a href="${props.dashboardUrl}/dashboard/settings" style="color: ${BRAND_COLOR}; text-decoration: underline;">Manage email preferences</a>
              </p>
              <p style="color: #475569; font-size: 12px; margin: 0; text-align: center;">
                &copy; ${new Date().getFullYear()} ${BRAND_NAME} by ${BRAND_CONFIG.company}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}
