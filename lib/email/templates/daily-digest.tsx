/**
 * Daily Digest Email Template
 *
 * Daily summary of all opportunities found during the day.
 * Uses React Email components for nice formatting.
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

export interface DailyDigestOpportunity {
  id: string;
  title: string;
  category: "arbitrage" | "stock" | "crypto";
  subcategory: string;
  confidence: number;
  expectedValue: number;
  status: "open" | "closed" | "expired";
}

export interface DailyDigestMetrics {
  totalOpportunities: number;
  successfulTrades: number;
  totalProfit: number;
  avgConfidence: number;
  categoryCounts: {
    arbitrage: number;
    stock: number;
    crypto: number;
  };
}

export interface DailyDigestProps {
  userName: string;
  date: string;
  opportunities: DailyDigestOpportunity[];
  metrics: DailyDigestMetrics;
  dashboardUrl: string;
  unsubscribeUrl: string;
}

const BRAND_COLOR = "#3B82F6";
const BRAND_NAME = "TradeSmart";

const categoryConfig = {
  arbitrage: { color: "#10B981", emoji: "🎯", label: "Arbitrage" },
  stock: { color: "#8B5CF6", emoji: "📈", label: "Stock" },
  crypto: { color: "#F59E0B", emoji: "₿", label: "Crypto" },
};

export function DailyDigestEmail({
  userName,
  date,
  opportunities,
  metrics,
  dashboardUrl,
  unsubscribeUrl,
}: DailyDigestProps) {
  const previewText = `Daily Digest for ${date}: ${metrics.totalOpportunities} opportunities found`;

  const topOpportunities = opportunities
    .filter((o) => o.status === "open")
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>{BRAND_NAME}</Heading>
            <Text style={headerSubtitle}>Daily Digest</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h2}>Good morning, {userName}!</Heading>
            <Text style={dateText}>{date}</Text>
            <Text style={paragraph}>
              Here's your daily summary of trading opportunities and
              performance.
            </Text>

            {/* Metrics Cards */}
            <Section style={metricsGrid}>
              <table
                role="presentation"
                width="100%"
                cellPadding="0"
                cellSpacing="0"
              >
                <tr>
                  <td width="50%" style={metricCell}>
                    <div style={metricCard}>
                      <Text style={metricValue}>
                        {metrics.totalOpportunities}
                      </Text>
                      <Text style={metricLabel}>Opportunities</Text>
                    </div>
                  </td>
                  <td width="50%" style={metricCell}>
                    <div style={metricCard}>
                      <Text style={metricValue}>
                        {metrics.avgConfidence.toFixed(0)}%
                      </Text>
                      <Text style={metricLabel}>Avg Confidence</Text>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style={metricCell}>
                    <div style={metricCard}>
                      <Text style={metricValue}>
                        {metrics.successfulTrades}
                      </Text>
                      <Text style={metricLabel}>Successful Trades</Text>
                    </div>
                  </td>
                  <td width="50%" style={metricCell}>
                    <div
                      style={{
                        ...metricCard,
                        borderColor:
                          metrics.totalProfit >= 0 ? "#10B981" : "#EF4444",
                      }}
                    >
                      <Text
                        style={{
                          ...metricValue,
                          color:
                            metrics.totalProfit >= 0 ? "#10B981" : "#EF4444",
                        }}
                      >
                        {metrics.totalProfit >= 0 ? "+" : ""}$
                        {metrics.totalProfit.toFixed(2)}
                      </Text>
                      <Text style={metricLabel}>Day P&L</Text>
                    </div>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Category Breakdown */}
            <Section style={categorySection}>
              <Heading style={h3}>By Category</Heading>
              <table
                role="presentation"
                width="100%"
                cellPadding="0"
                cellSpacing="0"
              >
                <tr>
                  {Object.entries(metrics.categoryCounts).map(
                    ([cat, count]) => {
                      const config =
                        categoryConfig[cat as keyof typeof categoryConfig];
                      return (
                        <td
                          key={cat}
                          width="33%"
                          style={{ textAlign: "center", padding: "8px" }}
                        >
                          <Text style={{ ...categoryEmoji }}>
                            {config.emoji}
                          </Text>
                          <Text
                            style={{ ...categoryCount, color: config.color }}
                          >
                            {count}
                          </Text>
                          <Text style={categoryLabel}>{config.label}</Text>
                        </td>
                      );
                    },
                  )}
                </tr>
              </table>
            </Section>

            {/* Top Opportunities */}
            {topOpportunities.length > 0 && (
              <Section style={opportunitiesSection}>
                <Heading style={h3}>Top Active Opportunities</Heading>
                <table
                  role="presentation"
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  style={opportunitiesTable}
                >
                  {topOpportunities.map((opp, idx) => {
                    const config = categoryConfig[opp.category];
                    return (
                      <tr key={opp.id}>
                        <td style={opportunityRow}>
                          <table
                            role="presentation"
                            width="100%"
                            cellPadding="0"
                            cellSpacing="0"
                          >
                            <tr>
                              <td
                                width="24"
                                style={{
                                  verticalAlign: "top",
                                  paddingRight: "12px",
                                }}
                              >
                                <Text style={opportunityEmoji}>
                                  {config.emoji}
                                </Text>
                              </td>
                              <td style={{ verticalAlign: "top" }}>
                                <Text style={opportunityTitle}>
                                  {opp.title}
                                </Text>
                                <Text style={opportunityMeta}>
                                  {config.label} · {opp.subcategory}
                                </Text>
                              </td>
                              <td
                                width="80"
                                style={{
                                  textAlign: "right",
                                  verticalAlign: "top",
                                }}
                              >
                                <Text
                                  style={{
                                    ...confidenceBadge,
                                    backgroundColor:
                                      opp.confidence >= 80
                                        ? "#10B98120"
                                        : opp.confidence >= 60
                                          ? "#F59E0B20"
                                          : "#EF444420",
                                    color:
                                      opp.confidence >= 80
                                        ? "#10B981"
                                        : opp.confidence >= 60
                                          ? "#F59E0B"
                                          : "#EF4444",
                                  }}
                                >
                                  {opp.confidence}%
                                </Text>
                                <Text style={evText}>
                                  {opp.expectedValue >= 0 ? "+" : ""}$
                                  {opp.expectedValue.toFixed(2)}
                                </Text>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </Section>
            )}

            <Button style={primaryButton} href={`${dashboardUrl}/dashboard`}>
              View All Opportunities
            </Button>

            <Text style={tipText}>
              💡 <strong>Tip:</strong> Focus on opportunities with 75%+
              confidence for better success rates.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Manage your{" "}
              <Link
                href={`${dashboardUrl}/dashboard/settings`}
                style={footerLink}
              >
                notification preferences
              </Link>
            </Text>
            <Hr style={footerHr} />
            <Text style={footerCopyright}>
              &copy; {new Date().getFullYear()} {BRAND_NAME}. All rights
              reserved.
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
  padding: "24px 32px",
  borderRadius: "8px 8px 0 0",
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0",
};

const headerSubtitle = {
  color: "rgba(255, 255, 255, 0.8)",
  fontSize: "14px",
  margin: "4px 0 0 0",
};

const content = {
  backgroundColor: "#1e293b",
  padding: "32px",
};

const h2 = {
  color: "#f1f5f9",
  fontSize: "22px",
  fontWeight: "600",
  margin: "0 0 8px 0",
};

const h3 = {
  color: "#f1f5f9",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const dateText = {
  color: "#64748b",
  fontSize: "14px",
  margin: "0 0 16px 0",
};

const paragraph = {
  color: "#94a3b8",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const metricsGrid = {
  margin: "0 0 24px 0",
};

const metricCell = {
  padding: "6px",
};

const metricCard = {
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  padding: "16px",
  textAlign: "center" as const,
  border: "1px solid #334155",
};

const metricValue = {
  color: "#f1f5f9",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0 0 4px 0",
};

const metricLabel = {
  color: "#64748b",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  margin: "0",
};

const categorySection = {
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  padding: "20px",
  margin: "0 0 24px 0",
  border: "1px solid #334155",
};

const categoryEmoji = {
  fontSize: "24px",
  margin: "0",
};

const categoryCount = {
  fontSize: "24px",
  fontWeight: "700",
  margin: "4px 0",
};

const categoryLabel = {
  color: "#64748b",
  fontSize: "12px",
  margin: "0",
};

const opportunitiesSection = {
  margin: "0 0 24px 0",
};

const opportunitiesTable = {
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  border: "1px solid #334155",
  overflow: "hidden",
};

const opportunityRow = {
  padding: "16px",
  borderBottom: "1px solid #334155",
};

const opportunityEmoji = {
  fontSize: "16px",
  margin: "0",
};

const opportunityTitle = {
  color: "#f1f5f9",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 4px 0",
};

const opportunityMeta = {
  color: "#64748b",
  fontSize: "12px",
  margin: "0",
};

const confidenceBadge = {
  display: "inline-block",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: "600",
  margin: "0",
};

const evText = {
  color: "#10B981",
  fontSize: "12px",
  fontWeight: "600",
  margin: "4px 0 0 0",
};

const primaryButton = {
  backgroundColor: BRAND_COLOR,
  borderRadius: "6px",
  color: "#ffffff",
  display: "block",
  fontSize: "16px",
  fontWeight: "600",
  padding: "12px 24px",
  textAlign: "center" as const,
  textDecoration: "none",
  margin: "0 0 24px 0",
};

const tipText = {
  color: "#94a3b8",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
  padding: "16px",
  backgroundColor: "rgba(59, 130, 246, 0.1)",
  borderRadius: "8px",
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

export default DailyDigestEmail;

// Plain HTML export for fallback
export function dailyDigestHtml(props: DailyDigestProps): string {
  const topOpportunities = props.opportunities
    .filter((o) => o.status === "open")
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);

  const opportunitiesHtml =
    topOpportunities.length > 0
      ? topOpportunities
          .map((opp) => {
            const config = categoryConfig[opp.category];
            return `
          <tr>
            <td style="padding: 16px; border-bottom: 1px solid #334155;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align: top;">
                    <span style="font-size: 16px;">${config.emoji}</span>
                    <span style="color: #f1f5f9; font-size: 14px; font-weight: 600; margin-left: 8px;">${opp.title}</span><br>
                    <span style="color: #64748b; font-size: 12px;">${config.label} · ${opp.subcategory}</span>
                  </td>
                  <td style="text-align: right; vertical-align: top; width: 80px;">
                    <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; background-color: ${opp.confidence >= 80 ? "#10B98120" : opp.confidence >= 60 ? "#F59E0B20" : "#EF444420"}; color: ${opp.confidence >= 80 ? "#10B981" : opp.confidence >= 60 ? "#F59E0B" : "#EF4444"};">${opp.confidence}%</span><br>
                    <span style="color: #10B981; font-size: 12px; font-weight: 600;">${opp.expectedValue >= 0 ? "+" : ""}$${opp.expectedValue.toFixed(2)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        `;
          })
          .join("")
      : '<tr><td style="padding: 16px; color: #64748b;">No active opportunities at this time.</td></tr>';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Digest - ${props.date}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0f172a;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: ${BRAND_COLOR}; padding: 24px 32px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">${BRAND_NAME}</h1>
              <p style="margin: 4px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 14px;">Daily Digest</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="color: #f1f5f9; font-size: 22px; font-weight: 600; margin: 0 0 8px 0;">Good morning, ${props.userName}!</h2>
              <p style="color: #64748b; font-size: 14px; margin: 0 0 16px 0;">${props.date}</p>
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Here's your daily summary of trading opportunities and performance.
              </p>

              <!-- Metrics -->
              <table role="presentation" cellspacing="0" cellpadding="6" border="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td width="50%">
                    <div style="background-color: #0f172a; border-radius: 8px; padding: 16px; text-align: center; border: 1px solid #334155;">
                      <p style="color: #f1f5f9; font-size: 28px; font-weight: 700; margin: 0 0 4px 0;">${props.metrics.totalOpportunities}</p>
                      <p style="color: #64748b; font-size: 12px; text-transform: uppercase; margin: 0;">Opportunities</p>
                    </div>
                  </td>
                  <td width="50%">
                    <div style="background-color: #0f172a; border-radius: 8px; padding: 16px; text-align: center; border: 1px solid #334155;">
                      <p style="color: #f1f5f9; font-size: 28px; font-weight: 700; margin: 0 0 4px 0;">${props.metrics.avgConfidence.toFixed(0)}%</p>
                      <p style="color: #64748b; font-size: 12px; text-transform: uppercase; margin: 0;">Avg Confidence</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%">
                    <div style="background-color: #0f172a; border-radius: 8px; padding: 16px; text-align: center; border: 1px solid #334155;">
                      <p style="color: #f1f5f9; font-size: 28px; font-weight: 700; margin: 0 0 4px 0;">${props.metrics.successfulTrades}</p>
                      <p style="color: #64748b; font-size: 12px; text-transform: uppercase; margin: 0;">Successful Trades</p>
                    </div>
                  </td>
                  <td width="50%">
                    <div style="background-color: #0f172a; border-radius: 8px; padding: 16px; text-align: center; border: 1px solid ${props.metrics.totalProfit >= 0 ? "#10B981" : "#EF4444"};">
                      <p style="color: ${props.metrics.totalProfit >= 0 ? "#10B981" : "#EF4444"}; font-size: 28px; font-weight: 700; margin: 0 0 4px 0;">${props.metrics.totalProfit >= 0 ? "+" : ""}$${props.metrics.totalProfit.toFixed(2)}</p>
                      <p style="color: #64748b; font-size: 12px; text-transform: uppercase; margin: 0;">Day P&L</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Top Opportunities -->
              <h3 style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">Top Active Opportunities</h3>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0f172a; border-radius: 8px; border: 1px solid #334155; margin-bottom: 24px;">
                ${opportunitiesHtml}
              </table>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 24px 0; width: 100%;">
                <tr>
                  <td style="border-radius: 6px; background-color: ${BRAND_COLOR}; text-align: center;">
                    <a href="${props.dashboardUrl}/dashboard" style="display: block; padding: 12px 24px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      View All Opportunities
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0; padding: 16px; background-color: rgba(59, 130, 246, 0.1); border-radius: 8px;">
                💡 <strong>Tip:</strong> Focus on opportunities with 75%+ confidence for better success rates.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0f172a; border-top: 1px solid #334155;">
              <p style="color: #64748b; font-size: 13px; margin: 0 0 16px 0; text-align: center;">
                Manage your <a href="${props.dashboardUrl}/dashboard/settings" style="color: ${BRAND_COLOR}; text-decoration: underline;">notification preferences</a>
              </p>
              <p style="color: #475569; font-size: 12px; margin: 0; text-align: center;">
                &copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.
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
