/**
 * Opportunity Alert Email Template
 *
 * Real-time notification for new high-confidence trading opportunities.
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
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export interface OpportunityAlertProps {
  userName: string;
  opportunity: {
    id: string;
    title: string;
    category: "arbitrage" | "stock" | "crypto";
    subcategory: string;
    description: string;
    confidence: number;
    expectedValue: number;
    expiresAt?: string;
    data?: Record<string, unknown>;
  };
  dashboardUrl: string;
  unsubscribeUrl: string;
}

const BRAND_COLOR = "#3B82F6";
const BRAND_NAME = "TradeSmart";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://tradesmarthub.com";

// Category colors and icons
const categoryConfig = {
  arbitrage: { color: "#10B981", emoji: "🎯", label: "Arbitrage" },
  stock: { color: "#8B5CF6", emoji: "📈", label: "Stock" },
  crypto: { color: "#F59E0B", emoji: "₿", label: "Crypto" },
};

export function OpportunityAlertEmail({
  userName,
  opportunity,
  dashboardUrl,
  unsubscribeUrl,
}: OpportunityAlertProps) {
  const config =
    categoryConfig[opportunity.category] || categoryConfig.arbitrage;
  const previewText = `${config.emoji} New ${config.label} opportunity: ${opportunity.title}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>{BRAND_NAME}</Heading>
          </Section>

          {/* Alert Badge */}
          <Section style={alertBadge}>
            <Text style={alertBadgeText}>
              {config.emoji} NEW {config.label.toUpperCase()} OPPORTUNITY
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h2}>Hi {userName},</Heading>
            <Text style={paragraph}>
              We've identified a new trading opportunity that matches your
              preferences:
            </Text>

            {/* Opportunity Card */}
            <Section style={opportunityCard}>
              <Text style={opportunityCategory}>
                <span
                  style={{
                    ...categoryBadge,
                    backgroundColor: `${config.color}20`,
                    color: config.color,
                  }}
                >
                  {config.label} / {opportunity.subcategory}
                </span>
              </Text>
              <Heading style={opportunityTitle}>{opportunity.title}</Heading>
              <Text style={opportunityDescription}>
                {opportunity.description}
              </Text>

              {/* Metrics Row */}
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
                  <Text style={metricLabel}>Expected Value</Text>
                  <Text style={{ ...metricValue, color: "#10B981" }}>
                    {opportunity.expectedValue >= 0 ? "+" : ""}
                    {typeof opportunity.expectedValue === "number"
                      ? opportunity.expectedValue.toFixed(2)
                      : opportunity.expectedValue}
                  </Text>
                </div>
              </Section>

              {/* Expiry Warning */}
              {opportunity.expiresAt && (
                <Text style={expiryWarning}>
                  ⏰ Expires:{" "}
                  {new Date(opportunity.expiresAt).toLocaleString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              )}
            </Section>

            <Button
              style={primaryButton}
              href={`${dashboardUrl}/opportunities/${opportunity.id}`}
            >
              View Opportunity Details
            </Button>

            <Text style={disclaimer}>
              This is an automated alert based on your notification preferences.
              Always conduct your own research before making any trading
              decisions.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Don't want these alerts?{" "}
              <Link href={unsubscribeUrl} style={footerLink}>
                Update preferences
              </Link>{" "}
              or{" "}
              <Link
                href={`${unsubscribeUrl}?action=unsubscribe`}
                style={footerLink}
              >
                unsubscribe
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

const alertBadge = {
  backgroundColor: "#1e3a5f",
  padding: "12px 32px",
  textAlign: "center" as const,
};

const alertBadgeText = {
  color: "#60a5fa",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "1px",
  margin: "0",
};

const content = {
  backgroundColor: "#1e293b",
  padding: "32px",
};

const h2 = {
  color: "#f1f5f9",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const paragraph = {
  color: "#94a3b8",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const opportunityCard = {
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  padding: "24px",
  margin: "0 0 24px 0",
  border: "1px solid #334155",
};

const opportunityCategory = {
  margin: "0 0 12px 0",
};

const categoryBadge = {
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: "9999px",
  fontSize: "12px",
  fontWeight: "500",
};

const opportunityTitle = {
  color: "#f1f5f9",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 8px 0",
};

const opportunityDescription = {
  color: "#94a3b8",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 0 16px 0",
};

const metricsRow = {
  display: "flex" as const,
  gap: "24px",
  margin: "0 0 12px 0",
};

const metric = {
  flex: "1",
};

const metricLabel = {
  color: "#64748b",
  fontSize: "12px",
  margin: "0 0 4px 0",
  textTransform: "uppercase" as const,
};

const metricValue = {
  fontSize: "20px",
  fontWeight: "700",
  margin: "0",
};

const expiryWarning = {
  color: "#fbbf24",
  fontSize: "13px",
  margin: "16px 0 0 0",
  padding: "8px 12px",
  backgroundColor: "rgba(251, 191, 36, 0.1)",
  borderRadius: "4px",
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

const disclaimer = {
  color: "#64748b",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0",
  fontStyle: "italic" as const,
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

export default OpportunityAlertEmail;

// Plain HTML export for fallback
export function opportunityAlertHtml(props: OpportunityAlertProps): string {
  const config =
    categoryConfig[props.opportunity.category] || categoryConfig.arbitrage;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Opportunity Alert</title>
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
            </td>
          </tr>
          <!-- Alert Badge -->
          <tr>
            <td style="background-color: #1e3a5f; padding: 12px 32px; text-align: center;">
              <span style="color: #60a5fa; font-size: 12px; font-weight: 700; letter-spacing: 1px;">
                ${config.emoji} NEW ${config.label.toUpperCase()} OPPORTUNITY
              </span>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="color: #f1f5f9; font-size: 20px; margin: 0 0 16px 0;">Hi ${props.userName},</h2>
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                We've identified a new trading opportunity that matches your preferences:
              </p>

              <!-- Opportunity Card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0f172a; border-radius: 8px; border: 1px solid #334155; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; background-color: ${config.color}20; color: ${config.color};">
                      ${config.label} / ${props.opportunity.subcategory}
                    </span>
                    <h3 style="color: #f1f5f9; font-size: 18px; font-weight: 600; margin: 12px 0 8px 0;">${props.opportunity.title}</h3>
                    <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 16px 0;">${props.opportunity.description}</p>

                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="50%" style="vertical-align: top;">
                          <span style="color: #64748b; font-size: 12px; text-transform: uppercase;">Confidence</span><br>
                          <span style="font-size: 20px; font-weight: 700; color: ${props.opportunity.confidence >= 80 ? "#10B981" : props.opportunity.confidence >= 60 ? "#F59E0B" : "#EF4444"};">${props.opportunity.confidence}%</span>
                        </td>
                        <td width="50%" style="vertical-align: top;">
                          <span style="color: #64748b; font-size: 12px; text-transform: uppercase;">Expected Value</span><br>
                          <span style="font-size: 20px; font-weight: 700; color: #10B981;">${props.opportunity.expectedValue >= 0 ? "+" : ""}${typeof props.opportunity.expectedValue === "number" ? props.opportunity.expectedValue.toFixed(2) : props.opportunity.expectedValue}</span>
                        </td>
                      </tr>
                    </table>

                    ${
                      props.opportunity.expiresAt
                        ? `
                    <p style="color: #fbbf24; font-size: 13px; margin: 16px 0 0 0; padding: 8px 12px; background-color: rgba(251, 191, 36, 0.1); border-radius: 4px;">
                      ⏰ Expires: ${new Date(props.opportunity.expiresAt).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    `
                        : ""
                    }
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td style="border-radius: 6px; background-color: ${BRAND_COLOR};">
                    <a href="${props.dashboardUrl}/opportunities/${props.opportunity.id}" style="display: block; padding: 12px 24px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; text-align: center;">
                      View Opportunity Details
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0; font-style: italic;">
                This is an automated alert based on your notification preferences. Always conduct your own research before making any trading decisions.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0f172a; border-top: 1px solid #334155;">
              <p style="color: #64748b; font-size: 13px; margin: 0 0 16px 0; text-align: center;">
                Don't want these alerts? <a href="${props.unsubscribeUrl}" style="color: ${BRAND_COLOR}; text-decoration: underline;">Update preferences</a> or <a href="${props.unsubscribeUrl}?action=unsubscribe" style="color: ${BRAND_COLOR}; text-decoration: underline;">unsubscribe</a>
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
