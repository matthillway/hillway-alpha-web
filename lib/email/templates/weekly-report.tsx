/**
 * Weekly Report Email Template
 *
 * Weekly P&L and performance summary.
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

export interface WeeklyStatsCategory {
  opportunities: number;
  trades: number;
  wins: number;
  losses: number;
  profit: number;
  avgConfidence: number;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalOpportunities: number;
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  totalProfit: number;
  bestTrade: {
    title: string;
    category: string;
    profit: number;
  } | null;
  worstTrade: {
    title: string;
    category: string;
    loss: number;
  } | null;
  byCategory: {
    arbitrage: WeeklyStatsCategory;
    stock: WeeklyStatsCategory;
    crypto: WeeklyStatsCategory;
  };
  dailyPnL: Array<{
    date: string;
    profit: number;
  }>;
}

export interface WeeklyReportProps {
  userName: string;
  stats: WeeklyStats;
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

export function WeeklyReportEmail({
  userName,
  stats,
  dashboardUrl,
  unsubscribeUrl,
}: WeeklyReportProps) {
  const previewText = `Weekly Report: ${stats.winRate.toFixed(0)}% win rate, ${stats.totalProfit >= 0 ? "+" : ""}$${stats.totalProfit.toFixed(2)} P&L`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>{BRAND_NAME}</Heading>
            <Text style={headerSubtitle}>Weekly Performance Report</Text>
          </Section>

          {/* Week Range */}
          <Section style={weekBadge}>
            <Text style={weekBadgeText}>
              {stats.weekStart} - {stats.weekEnd}
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h2}>Hi {userName},</Heading>
            <Text style={paragraph}>
              Here's your weekly trading performance summary. Use these insights
              to refine your strategy.
            </Text>

            {/* Main P&L Card */}
            <Section style={pnlCard}>
              <Text style={pnlLabel}>Week P&L</Text>
              <Text
                style={{
                  ...pnlValue,
                  color: stats.totalProfit >= 0 ? "#10B981" : "#EF4444",
                }}
              >
                {stats.totalProfit >= 0 ? "+" : ""}$
                {stats.totalProfit.toFixed(2)}
              </Text>
              <table
                role="presentation"
                width="100%"
                cellPadding="0"
                cellSpacing="0"
                style={{ marginTop: "16px" }}
              >
                <tr>
                  <td width="33%" style={{ textAlign: "center" }}>
                    <Text style={pnlMetricValue}>{stats.totalTrades}</Text>
                    <Text style={pnlMetricLabel}>Trades</Text>
                  </td>
                  <td width="33%" style={{ textAlign: "center" }}>
                    <Text style={{ ...pnlMetricValue, color: "#10B981" }}>
                      {stats.wins}
                    </Text>
                    <Text style={pnlMetricLabel}>Wins</Text>
                  </td>
                  <td width="33%" style={{ textAlign: "center" }}>
                    <Text style={{ ...pnlMetricValue, color: "#EF4444" }}>
                      {stats.losses}
                    </Text>
                    <Text style={pnlMetricLabel}>Losses</Text>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Win Rate */}
            <Section style={winRateSection}>
              <table
                role="presentation"
                width="100%"
                cellPadding="0"
                cellSpacing="0"
              >
                <tr>
                  <td width="50%">
                    <Text style={sectionLabel}>Win Rate</Text>
                    <Text
                      style={{
                        ...winRateValue,
                        color:
                          stats.winRate >= 50
                            ? "#10B981"
                            : stats.winRate >= 40
                              ? "#F59E0B"
                              : "#EF4444",
                      }}
                    >
                      {stats.winRate.toFixed(1)}%
                    </Text>
                  </td>
                  <td width="50%">
                    <Text style={sectionLabel}>Opportunities Found</Text>
                    <Text style={winRateValue}>{stats.totalOpportunities}</Text>
                  </td>
                </tr>
              </table>
            </Section>

            {/* Best/Worst Trade */}
            {(stats.bestTrade || stats.worstTrade) && (
              <Section style={tradesSection}>
                <Heading style={h3}>Notable Trades</Heading>
                <table
                  role="presentation"
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                >
                  {stats.bestTrade && (
                    <tr>
                      <td style={tradeRow}>
                        <Text style={tradeLabel}>Best Trade</Text>
                        <Text style={tradeTitle}>{stats.bestTrade.title}</Text>
                        <Text style={{ ...tradeProfit, color: "#10B981" }}>
                          +${stats.bestTrade.profit.toFixed(2)}
                        </Text>
                      </td>
                    </tr>
                  )}
                  {stats.worstTrade && (
                    <tr>
                      <td style={{ ...tradeRow, borderBottom: "none" }}>
                        <Text style={tradeLabel}>Worst Trade</Text>
                        <Text style={tradeTitle}>{stats.worstTrade.title}</Text>
                        <Text style={{ ...tradeProfit, color: "#EF4444" }}>
                          -${Math.abs(stats.worstTrade.loss).toFixed(2)}
                        </Text>
                      </td>
                    </tr>
                  )}
                </table>
              </Section>
            )}

            {/* Category Breakdown */}
            <Section style={categoryBreakdown}>
              <Heading style={h3}>Performance by Category</Heading>
              <table
                role="presentation"
                width="100%"
                cellPadding="0"
                cellSpacing="0"
                style={categoryTable}
              >
                <tr style={categoryHeaderRow}>
                  <td style={categoryHeaderCell}>Category</td>
                  <td style={{ ...categoryHeaderCell, textAlign: "center" }}>
                    Trades
                  </td>
                  <td style={{ ...categoryHeaderCell, textAlign: "center" }}>
                    Win %
                  </td>
                  <td style={{ ...categoryHeaderCell, textAlign: "right" }}>
                    P&L
                  </td>
                </tr>
                {Object.entries(stats.byCategory).map(([cat, data]) => {
                  const config =
                    categoryConfig[cat as keyof typeof categoryConfig];
                  const winRate =
                    data.trades > 0 ? (data.wins / data.trades) * 100 : 0;
                  return (
                    <tr key={cat}>
                      <td style={categoryDataCell}>
                        <span style={{ marginRight: "8px" }}>
                          {config.emoji}
                        </span>
                        {config.label}
                      </td>
                      <td style={{ ...categoryDataCell, textAlign: "center" }}>
                        {data.trades}
                      </td>
                      <td
                        style={{
                          ...categoryDataCell,
                          textAlign: "center",
                          color: winRate >= 50 ? "#10B981" : "#EF4444",
                        }}
                      >
                        {winRate.toFixed(0)}%
                      </td>
                      <td
                        style={{
                          ...categoryDataCell,
                          textAlign: "right",
                          color: data.profit >= 0 ? "#10B981" : "#EF4444",
                        }}
                      >
                        {data.profit >= 0 ? "+" : ""}${data.profit.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </table>
            </Section>

            {/* Daily P&L Chart (simplified as table) */}
            <Section style={dailyPnLSection}>
              <Heading style={h3}>Daily P&L</Heading>
              <table
                role="presentation"
                width="100%"
                cellPadding="0"
                cellSpacing="0"
              >
                <tr>
                  {stats.dailyPnL.map((day) => (
                    <td key={day.date} style={dayCell}>
                      <div
                        style={{
                          ...dayBar,
                          height: `${Math.min(Math.abs(day.profit) * 2, 60)}px`,
                          backgroundColor:
                            day.profit >= 0 ? "#10B981" : "#EF4444",
                        }}
                      />
                      <Text style={dayValue}>
                        {day.profit >= 0 ? "+" : ""}${day.profit.toFixed(0)}
                      </Text>
                      <Text style={dayLabel}>{day.date.split(" ")[0]}</Text>
                    </td>
                  ))}
                </tr>
              </table>
            </Section>

            <Button
              style={primaryButton}
              href={`${dashboardUrl}/dashboard/analytics`}
            >
              View Full Analytics
            </Button>

            {/* Tips */}
            <Section style={tipsSection}>
              <Heading style={h3}>Weekly Insights</Heading>
              {stats.winRate >= 50 ? (
                <Text style={tipText}>
                  Great work! Your win rate of {stats.winRate.toFixed(0)}% is
                  above average. Consider slightly increasing your position
                  sizes on high-confidence opportunities.
                </Text>
              ) : (
                <Text style={tipText}>
                  Focus on quality over quantity next week. Consider only taking
                  opportunities with 75%+ confidence to improve your win rate.
                </Text>
              )}
            </Section>
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

const weekBadge = {
  backgroundColor: "#1e3a5f",
  padding: "12px 32px",
  textAlign: "center" as const,
};

const weekBadgeText = {
  color: "#60a5fa",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0",
};

const content = {
  backgroundColor: "#1e293b",
  padding: "32px",
};

const h2 = {
  color: "#f1f5f9",
  fontSize: "22px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const h3 = {
  color: "#f1f5f9",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const paragraph = {
  color: "#94a3b8",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const pnlCard = {
  backgroundColor: "#0f172a",
  borderRadius: "12px",
  padding: "24px",
  textAlign: "center" as const,
  margin: "0 0 24px 0",
  border: "1px solid #334155",
};

const pnlLabel = {
  color: "#64748b",
  fontSize: "14px",
  textTransform: "uppercase" as const,
  margin: "0 0 8px 0",
};

const pnlValue = {
  fontSize: "48px",
  fontWeight: "700",
  margin: "0",
};

const pnlMetricValue = {
  color: "#f1f5f9",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0",
};

const pnlMetricLabel = {
  color: "#64748b",
  fontSize: "12px",
  margin: "4px 0 0 0",
};

const winRateSection = {
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  padding: "20px",
  margin: "0 0 24px 0",
  border: "1px solid #334155",
};

const sectionLabel = {
  color: "#64748b",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  margin: "0 0 4px 0",
};

const winRateValue = {
  color: "#f1f5f9",
  fontSize: "32px",
  fontWeight: "700",
  margin: "0",
};

const tradesSection = {
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  padding: "20px",
  margin: "0 0 24px 0",
  border: "1px solid #334155",
};

const tradeRow = {
  padding: "12px 0",
  borderBottom: "1px solid #334155",
};

const tradeLabel = {
  color: "#64748b",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  margin: "0 0 4px 0",
};

const tradeTitle = {
  color: "#f1f5f9",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0 0 4px 0",
};

const tradeProfit = {
  fontSize: "16px",
  fontWeight: "700",
  margin: "0",
};

const categoryBreakdown = {
  margin: "0 0 24px 0",
};

const categoryTable = {
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  border: "1px solid #334155",
  overflow: "hidden",
};

const categoryHeaderRow = {
  backgroundColor: "#1e293b",
};

const categoryHeaderCell = {
  color: "#64748b",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  padding: "12px 16px",
  borderBottom: "1px solid #334155",
};

const categoryDataCell = {
  color: "#f1f5f9",
  fontSize: "14px",
  padding: "12px 16px",
  borderBottom: "1px solid #334155",
};

const dailyPnLSection = {
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  padding: "20px",
  margin: "0 0 24px 0",
  border: "1px solid #334155",
};

const dayCell = {
  textAlign: "center" as const,
  verticalAlign: "bottom" as const,
  padding: "0 4px",
};

const dayBar = {
  width: "100%",
  minHeight: "4px",
  borderRadius: "2px 2px 0 0",
  marginBottom: "8px",
};

const dayValue = {
  color: "#f1f5f9",
  fontSize: "11px",
  fontWeight: "600",
  margin: "0",
};

const dayLabel = {
  color: "#64748b",
  fontSize: "10px",
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

const tipsSection = {
  backgroundColor: "rgba(59, 130, 246, 0.1)",
  borderRadius: "8px",
  padding: "20px",
  borderLeft: `4px solid ${BRAND_COLOR}`,
};

const tipText = {
  color: "#94a3b8",
  fontSize: "14px",
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

export default WeeklyReportEmail;

// Plain HTML export for fallback
export function weeklyReportHtml(props: WeeklyReportProps): string {
  const { stats } = props;

  const categoryRowsHtml = Object.entries(stats.byCategory)
    .map(([cat, data]) => {
      const config = categoryConfig[cat as keyof typeof categoryConfig];
      const winRate = data.trades > 0 ? (data.wins / data.trades) * 100 : 0;
      return `
        <tr>
          <td style="color: #f1f5f9; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #334155;">
            <span style="margin-right: 8px;">${config.emoji}</span>${config.label}
          </td>
          <td style="color: #f1f5f9; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #334155; text-align: center;">${data.trades}</td>
          <td style="color: ${winRate >= 50 ? "#10B981" : "#EF4444"}; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #334155; text-align: center;">${winRate.toFixed(0)}%</td>
          <td style="color: ${data.profit >= 0 ? "#10B981" : "#EF4444"}; font-size: 14px; padding: 12px 16px; border-bottom: 1px solid #334155; text-align: right;">${data.profit >= 0 ? "+" : ""}$${data.profit.toFixed(2)}</td>
        </tr>
      `;
    })
    .join("");

  const dailyBarsHtml = stats.dailyPnL
    .map(
      (day) => `
      <td style="text-align: center; vertical-align: bottom; padding: 0 4px;">
        <div style="width: 100%; min-height: 4px; height: ${Math.min(Math.abs(day.profit) * 2, 60)}px; background-color: ${day.profit >= 0 ? "#10B981" : "#EF4444"}; border-radius: 2px 2px 0 0; margin-bottom: 8px;"></div>
        <p style="color: #f1f5f9; font-size: 11px; font-weight: 600; margin: 0;">${day.profit >= 0 ? "+" : ""}$${day.profit.toFixed(0)}</p>
        <p style="color: #64748b; font-size: 10px; margin: 4px 0 0 0;">${day.date.split(" ")[0]}</p>
      </td>
    `,
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Report - ${stats.weekStart} to ${stats.weekEnd}</title>
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
              <p style="margin: 4px 0 0 0; color: rgba(255, 255, 255, 0.8); font-size: 14px;">Weekly Performance Report</p>
            </td>
          </tr>

          <!-- Week Range Badge -->
          <tr>
            <td style="background-color: #1e3a5f; padding: 12px 32px; text-align: center;">
              <span style="color: #60a5fa; font-size: 14px; font-weight: 600;">${stats.weekStart} - ${stats.weekEnd}</span>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="color: #f1f5f9; font-size: 22px; font-weight: 600; margin: 0 0 16px 0;">Hi ${props.userName},</h2>
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Here's your weekly trading performance summary. Use these insights to refine your strategy.
              </p>

              <!-- Main P&L Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0f172a; border-radius: 12px; border: 1px solid #334155; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="color: #64748b; font-size: 14px; text-transform: uppercase; margin: 0 0 8px 0;">Week P&L</p>
                    <p style="font-size: 48px; font-weight: 700; margin: 0; color: ${stats.totalProfit >= 0 ? "#10B981" : "#EF4444"};">${stats.totalProfit >= 0 ? "+" : ""}$${stats.totalProfit.toFixed(2)}</p>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
                      <tr>
                        <td width="33%" style="text-align: center;">
                          <p style="color: #f1f5f9; font-size: 24px; font-weight: 700; margin: 0;">${stats.totalTrades}</p>
                          <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Trades</p>
                        </td>
                        <td width="33%" style="text-align: center;">
                          <p style="color: #10B981; font-size: 24px; font-weight: 700; margin: 0;">${stats.wins}</p>
                          <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Wins</p>
                        </td>
                        <td width="33%" style="text-align: center;">
                          <p style="color: #EF4444; font-size: 24px; font-weight: 700; margin: 0;">${stats.losses}</p>
                          <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Losses</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Win Rate Section -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0f172a; border-radius: 8px; border: 1px solid #334155; margin-bottom: 24px;">
                <tr>
                  <td width="50%" style="padding: 20px;">
                    <p style="color: #64748b; font-size: 12px; text-transform: uppercase; margin: 0 0 4px 0;">Win Rate</p>
                    <p style="font-size: 32px; font-weight: 700; margin: 0; color: ${stats.winRate >= 50 ? "#10B981" : stats.winRate >= 40 ? "#F59E0B" : "#EF4444"};">${stats.winRate.toFixed(1)}%</p>
                  </td>
                  <td width="50%" style="padding: 20px;">
                    <p style="color: #64748b; font-size: 12px; text-transform: uppercase; margin: 0 0 4px 0;">Opportunities Found</p>
                    <p style="color: #f1f5f9; font-size: 32px; font-weight: 700; margin: 0;">${stats.totalOpportunities}</p>
                  </td>
                </tr>
              </table>

              <!-- Category Breakdown -->
              <h3 style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">Performance by Category</h3>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0f172a; border-radius: 8px; border: 1px solid #334155; margin-bottom: 24px;">
                <tr style="background-color: #1e293b;">
                  <td style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; padding: 12px 16px; border-bottom: 1px solid #334155;">Category</td>
                  <td style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; padding: 12px 16px; border-bottom: 1px solid #334155; text-align: center;">Trades</td>
                  <td style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; padding: 12px 16px; border-bottom: 1px solid #334155; text-align: center;">Win %</td>
                  <td style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; padding: 12px 16px; border-bottom: 1px solid #334155; text-align: right;">P&L</td>
                </tr>
                ${categoryRowsHtml}
              </table>

              <!-- Daily P&L -->
              <h3 style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">Daily P&L</h3>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0f172a; border-radius: 8px; border: 1px solid #334155; padding: 20px; margin-bottom: 24px;">
                <tr>
                  ${dailyBarsHtml}
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 24px 0; width: 100%;">
                <tr>
                  <td style="border-radius: 6px; background-color: ${BRAND_COLOR}; text-align: center;">
                    <a href="${props.dashboardUrl}/dashboard/analytics" style="display: block; padding: 12px 24px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      View Full Analytics
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Tips -->
              <div style="background-color: rgba(59, 130, 246, 0.1); border-radius: 8px; padding: 20px; border-left: 4px solid ${BRAND_COLOR};">
                <h3 style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">Weekly Insights</h3>
                <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0;">
                  ${stats.winRate >= 50 ? `Great work! Your win rate of ${stats.winRate.toFixed(0)}% is above average. Consider slightly increasing your position sizes on high-confidence opportunities.` : "Focus on quality over quantity next week. Consider only taking opportunities with 75%+ confidence to improve your win rate."}
                </p>
              </div>
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
