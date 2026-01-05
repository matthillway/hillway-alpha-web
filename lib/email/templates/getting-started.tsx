/**
 * Getting Started Email Template
 *
 * Sent Day 1 after signup.
 * Tips for getting the most out of the trial with feature highlights.
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

export interface GettingStartedEmailProps {
  userName: string;
  dashboardUrl: string;
  guidesUrl?: string;
}

const BRAND_COLOR = BRAND_CONFIG.colors.primary;
const BRAND_NAME = BRAND_CONFIG.name;

export function GettingStartedEmail({
  userName,
  dashboardUrl,
  guidesUrl,
}: GettingStartedEmailProps) {
  const previewText = `Tips to maximize your ${BRAND_NAME} trial`;
  const effectiveGuidesUrl = guidesUrl || `${dashboardUrl}/guides`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>{BRAND_NAME}</Heading>
            <Text style={headerSubtitle}>Getting Started Guide</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={dayBadge}>Day 1 of Your Trial</Text>
            <Heading style={h2}>Ready to find your edge, {userName}?</Heading>
            <Text style={paragraph}>
              You've had a day to explore. Now let's make sure you're getting
              the most out of {BRAND_NAME}. Here are the key features that our
              most successful users rely on:
            </Text>

            {/* Feature Cards */}
            <Section style={featuresGrid}>
              {/* Scanner Feature */}
              <Section style={featureCard}>
                <Text style={featureEmoji}>🔍</Text>
                <Heading style={featureTitle}>Multi-Market Scanners</Heading>
                <Text style={featureDescription}>
                  Our AI scans stocks, crypto, and sports markets 24/7,
                  identifying opportunities with statistical edges. Each scanner
                  uses different strategies optimized for its market.
                </Text>
                <Link href={`${dashboardUrl}/dashboard`} style={featureLink}>
                  Open Scanners →
                </Link>
              </Section>

              {/* AI Analysis Feature */}
              <Section style={featureCard}>
                <Text style={featureEmoji}>🤖</Text>
                <Heading style={featureTitle}>AI Opportunity Scoring</Heading>
                <Text style={featureDescription}>
                  Every opportunity gets a confidence score based on historical
                  data, current market conditions, and pattern recognition.
                  Focus on 75%+ confidence for best results.
                </Text>
                <Link
                  href={`${dashboardUrl}/dashboard/opportunities`}
                  style={featureLink}
                >
                  View Opportunities →
                </Link>
              </Section>

              {/* Alerts Feature */}
              <Section style={featureCard}>
                <Text style={featureEmoji}>🔔</Text>
                <Heading style={featureTitle}>Smart Alerts</Heading>
                <Text style={featureDescription}>
                  Get notified via email or WhatsApp when high-confidence
                  opportunities appear. Set your own thresholds and frequency
                  preferences.
                </Text>
                <Link
                  href={`${dashboardUrl}/dashboard/settings`}
                  style={featureLink}
                >
                  Configure Alerts →
                </Link>
              </Section>
            </Section>

            {/* Pro Tips */}
            <Section style={tipsSection}>
              <Heading style={h3}>Pro Tips from Power Users</Heading>
              <Section style={tipItem}>
                <Text style={tipBullet}>✓</Text>
                <Text style={tipText}>
                  <strong>Start with one market</strong> - Master arbitrage or
                  stocks before expanding to multiple scanners.
                </Text>
              </Section>
              <Section style={tipItem}>
                <Text style={tipBullet}>✓</Text>
                <Text style={tipText}>
                  <strong>Set realistic alerts</strong> - Daily digests work
                  better than realtime for most users.
                </Text>
              </Section>
              <Section style={tipItem}>
                <Text style={tipBullet}>✓</Text>
                <Text style={tipText}>
                  <strong>Read the AI analysis</strong> - Understanding why an
                  opportunity scores well helps you make better decisions.
                </Text>
              </Section>
            </Section>

            <Button style={primaryButton} href={effectiveGuidesUrl}>
              Read the Full Guide
            </Button>

            <Hr style={divider} />

            <Text style={paragraph}>
              Questions? Just reply to this email - we read every message.
            </Text>

            <Text style={signoff}>
              Here to help,
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

const paragraph = {
  color: "#94a3b8",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const featuresGrid = {
  margin: "0 0 32px 0",
};

const featureCard = {
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  padding: "24px",
  margin: "0 0 16px 0",
  border: "1px solid #334155",
};

const featureEmoji = {
  fontSize: "32px",
  margin: "0 0 12px 0",
};

const featureTitle = {
  color: "#f1f5f9",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 8px 0",
};

const featureDescription = {
  color: "#94a3b8",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0 0 12px 0",
};

const featureLink = {
  color: BRAND_COLOR,
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
};

const tipsSection = {
  backgroundColor: "rgba(22, 163, 74, 0.08)",
  borderRadius: "8px",
  padding: "24px",
  margin: "0 0 24px 0",
  border: "1px solid rgba(22, 163, 74, 0.2)",
};

const tipItem = {
  display: "flex" as const,
  marginBottom: "12px",
};

const tipBullet = {
  color: BRAND_COLOR,
  fontSize: "16px",
  fontWeight: "700",
  margin: "0 12px 0 0",
  flexShrink: 0,
};

const tipText = {
  color: "#94a3b8",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
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

export default GettingStartedEmail;

// Plain HTML export for fallback
export function gettingStartedHtml(props: GettingStartedEmailProps): string {
  const guidesUrl = props.guidesUrl || `${props.dashboardUrl}/guides`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Getting Started with ${BRAND_NAME}</title>
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
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Getting Started Guide</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <span style="background-color: rgba(22, 163, 74, 0.15); color: ${BRAND_COLOR}; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 9999px; display: inline-block; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Day 1 of Your Trial</span>

              <h2 style="color: #f1f5f9; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">Ready to find your edge, ${props.userName}?</h2>
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                You've had a day to explore. Now let's make sure you're getting the most out of ${BRAND_NAME}. Here are the key features that our most successful users rely on:
              </p>

              <!-- Feature Cards -->
              <div style="background-color: #0f172a; border-radius: 8px; padding: 24px; margin-bottom: 16px; border: 1px solid #334155;">
                <span style="font-size: 32px;">🔍</span>
                <h3 style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 12px 0 8px 0;">Multi-Market Scanners</h3>
                <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 12px 0;">Our AI scans stocks, crypto, and sports markets 24/7, identifying opportunities with statistical edges.</p>
                <a href="${props.dashboardUrl}/dashboard" style="color: ${BRAND_COLOR}; font-size: 14px; font-weight: 600; text-decoration: none;">Open Scanners →</a>
              </div>

              <div style="background-color: #0f172a; border-radius: 8px; padding: 24px; margin-bottom: 16px; border: 1px solid #334155;">
                <span style="font-size: 32px;">🤖</span>
                <h3 style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 12px 0 8px 0;">AI Opportunity Scoring</h3>
                <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 12px 0;">Every opportunity gets a confidence score based on historical data, current market conditions, and pattern recognition.</p>
                <a href="${props.dashboardUrl}/dashboard/opportunities" style="color: ${BRAND_COLOR}; font-size: 14px; font-weight: 600; text-decoration: none;">View Opportunities →</a>
              </div>

              <div style="background-color: #0f172a; border-radius: 8px; padding: 24px; margin-bottom: 24px; border: 1px solid #334155;">
                <span style="font-size: 32px;">🔔</span>
                <h3 style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 12px 0 8px 0;">Smart Alerts</h3>
                <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 12px 0;">Get notified via email or WhatsApp when high-confidence opportunities appear.</p>
                <a href="${props.dashboardUrl}/dashboard/settings" style="color: ${BRAND_COLOR}; font-size: 14px; font-weight: 600; text-decoration: none;">Configure Alerts →</a>
              </div>

              <!-- Pro Tips -->
              <div style="background-color: rgba(22, 163, 74, 0.08); border-radius: 8px; padding: 24px; margin-bottom: 24px; border: 1px solid rgba(22, 163, 74, 0.2);">
                <h3 style="color: #f1f5f9; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">Pro Tips from Power Users</h3>
                <p style="color: #94a3b8; font-size: 14px; line-height: 1.8; margin: 0;">
                  <span style="color: ${BRAND_COLOR}; font-weight: 700;">✓</span> <strong>Start with one market</strong> - Master arbitrage or stocks before expanding.<br>
                  <span style="color: ${BRAND_COLOR}; font-weight: 700;">✓</span> <strong>Set realistic alerts</strong> - Daily digests work better than realtime for most users.<br>
                  <span style="color: ${BRAND_COLOR}; font-weight: 700;">✓</span> <strong>Read the AI analysis</strong> - Understanding why an opportunity scores well helps you make better decisions.
                </p>
              </div>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 24px 0; width: 100%;">
                <tr>
                  <td style="border-radius: 6px; background-color: ${BRAND_COLOR}; text-align: center;">
                    <a href="${guidesUrl}" style="display: block; padding: 14px 24px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Read the Full Guide
                    </a>
                  </td>
                </tr>
              </table>

              <hr style="border: none; border-top: 1px solid #334155; margin: 24px 0;">

              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                Questions? Just reply to this email - we read every message.
              </p>

              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0;">
                Here to help,<br>
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
