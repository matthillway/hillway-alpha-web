/**
 * Welcome Email Template
 *
 * Sent immediately on signup (Day 0).
 * Welcomes user and provides quick start guidance.
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

export interface WelcomeEmailProps {
  userName: string;
  dashboardUrl: string;
  trialDays?: number;
}

const BRAND_COLOR = BRAND_CONFIG.colors.primary;
const BRAND_NAME = BRAND_CONFIG.name;

export function WelcomeEmail({
  userName,
  dashboardUrl,
  trialDays = 7,
}: WelcomeEmailProps) {
  const previewText = `Welcome to ${BRAND_NAME}! Your trading edge starts here.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>{BRAND_NAME}</Heading>
            <Text style={headerSubtitle}>Welcome Aboard!</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Heading style={h2}>Hey {userName}!</Heading>
            <Text style={paragraph}>
              Welcome to {BRAND_NAME}! You've just unlocked access to the most
              powerful AI-driven opportunity scanner for stocks, crypto, and
              sports betting markets.
            </Text>

            <Text style={paragraph}>
              Your {trialDays}-day free trial starts now. Here's how to make the
              most of it:
            </Text>

            {/* Quick Start Steps */}
            <Section style={stepsSection}>
              <Heading style={h3}>3 Things to Do First</Heading>

              <Section style={stepCard}>
                <Text style={stepNumber}>1</Text>
                <div style={stepContent}>
                  <Text style={stepTitle}>Explore the Scanners</Text>
                  <Text style={stepDescription}>
                    Check out our AI-powered scanners for arbitrage, stocks, and
                    crypto opportunities. Each scanner runs 24/7 to find edges
                    others miss.
                  </Text>
                </div>
              </Section>

              <Section style={stepCard}>
                <Text style={stepNumber}>2</Text>
                <div style={stepContent}>
                  <Text style={stepTitle}>Set Up Your Alerts</Text>
                  <Text style={stepDescription}>
                    Configure email and WhatsApp notifications so you never miss
                    a high-confidence opportunity.
                  </Text>
                </div>
              </Section>

              <Section style={stepCard}>
                <Text style={stepNumber}>3</Text>
                <div style={stepContent}>
                  <Text style={stepTitle}>Review AI Analysis</Text>
                  <Text style={stepDescription}>
                    Each opportunity comes with AI-generated analysis explaining
                    why it's a good trade and the confidence level.
                  </Text>
                </div>
              </Section>
            </Section>

            <Button style={primaryButton} href={`${dashboardUrl}/dashboard`}>
              Go to Dashboard
            </Button>

            <Hr style={divider} />

            {/* Support Section */}
            <Section style={supportSection}>
              <Heading style={h4}>Need Help?</Heading>
              <Text style={supportText}>
                Our team is here to help you get started. If you have any
                questions or need guidance, just reply to this email or reach
                out to us at{" "}
                <Link href={`mailto:${BRAND_CONFIG.supportEmail}`} style={link}>
                  {BRAND_CONFIG.supportEmail}
                </Link>
                .
              </Text>
            </Section>

            <Text style={signoff}>
              Happy trading,
              <br />
              <strong>The {BRAND_NAME} Team</strong>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You're receiving this because you signed up for {BRAND_NAME}.
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
  margin: "0 0 20px 0",
};

const h4 = {
  color: "#f1f5f9",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px 0",
};

const paragraph = {
  color: "#94a3b8",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

const stepsSection = {
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
  border: "1px solid #334155",
};

const stepCard = {
  display: "flex" as const,
  marginBottom: "20px",
};

const stepNumber = {
  backgroundColor: BRAND_COLOR,
  color: "#ffffff",
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  display: "inline-flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  fontSize: "16px",
  fontWeight: "700",
  margin: "0 16px 0 0",
  flexShrink: 0,
};

const stepContent = {
  flex: 1,
};

const stepTitle = {
  color: "#f1f5f9",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 4px 0",
};

const stepDescription = {
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
  margin: "24px 0",
};

const divider = {
  borderColor: "#334155",
  margin: "32px 0",
};

const supportSection = {
  backgroundColor: "rgba(22, 163, 74, 0.1)",
  borderRadius: "8px",
  padding: "20px",
  margin: "0 0 24px 0",
  border: "1px solid rgba(22, 163, 74, 0.2)",
};

const supportText = {
  color: "#94a3b8",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0",
};

const link = {
  color: BRAND_COLOR,
  textDecoration: "underline",
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

export default WelcomeEmail;

// Plain HTML export for fallback
export function welcomeEmailHtml(props: WelcomeEmailProps): string {
  const trialDays = props.trialDays || 7;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${BRAND_NAME}</title>
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
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Welcome Aboard!</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="color: #f1f5f9; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">Hey ${props.userName}!</h2>
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                Welcome to ${BRAND_NAME}! You've just unlocked access to the most powerful AI-driven opportunity scanner for stocks, crypto, and sports betting markets.
              </p>
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                Your ${trialDays}-day free trial starts now. Here's how to make the most of it:
              </p>

              <!-- Quick Start Steps -->
              <div style="background-color: #0f172a; border-radius: 8px; padding: 24px; margin: 24px 0; border: 1px solid #334155;">
                <h3 style="color: #f1f5f9; font-size: 18px; font-weight: 600; margin: 0 0 20px 0;">3 Things to Do First</h3>

                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 16px;">
                  <tr>
                    <td width="48" style="vertical-align: top;">
                      <span style="background-color: ${BRAND_COLOR}; color: #ffffff; width: 32px; height: 32px; border-radius: 50%; display: inline-block; text-align: center; line-height: 32px; font-weight: 700;">1</span>
                    </td>
                    <td style="vertical-align: top;">
                      <p style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">Explore the Scanners</p>
                      <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0;">Check out our AI-powered scanners for arbitrage, stocks, and crypto opportunities.</p>
                    </td>
                  </tr>
                </table>

                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 16px;">
                  <tr>
                    <td width="48" style="vertical-align: top;">
                      <span style="background-color: ${BRAND_COLOR}; color: #ffffff; width: 32px; height: 32px; border-radius: 50%; display: inline-block; text-align: center; line-height: 32px; font-weight: 700;">2</span>
                    </td>
                    <td style="vertical-align: top;">
                      <p style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">Set Up Your Alerts</p>
                      <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0;">Configure email and WhatsApp notifications so you never miss a high-confidence opportunity.</p>
                    </td>
                  </tr>
                </table>

                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td width="48" style="vertical-align: top;">
                      <span style="background-color: ${BRAND_COLOR}; color: #ffffff; width: 32px; height: 32px; border-radius: 50%; display: inline-block; text-align: center; line-height: 32px; font-weight: 700;">3</span>
                    </td>
                    <td style="vertical-align: top;">
                      <p style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">Review AI Analysis</p>
                      <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0;">Each opportunity comes with AI-generated analysis explaining why it's a good trade.</p>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0; width: 100%;">
                <tr>
                  <td style="border-radius: 6px; background-color: ${BRAND_COLOR}; text-align: center;">
                    <a href="${props.dashboardUrl}/dashboard" style="display: block; padding: 14px 24px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
                      Go to Dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <hr style="border: none; border-top: 1px solid #334155; margin: 32px 0;">

              <!-- Support -->
              <div style="background-color: rgba(22, 163, 74, 0.1); border-radius: 8px; padding: 20px; margin: 0 0 24px 0; border: 1px solid rgba(22, 163, 74, 0.2);">
                <h4 style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">Need Help?</h4>
                <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0;">
                  Our team is here to help you get started. If you have any questions or need guidance, just reply to this email or reach out to us at <a href="mailto:${BRAND_CONFIG.supportEmail}" style="color: ${BRAND_COLOR}; text-decoration: underline;">${BRAND_CONFIG.supportEmail}</a>.
                </p>
              </div>

              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0;">
                Happy trading,<br>
                <strong>The ${BRAND_NAME} Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #0f172a; border-top: 1px solid #334155;">
              <p style="color: #64748b; font-size: 13px; margin: 0 0 16px 0; text-align: center;">
                You're receiving this because you signed up for ${BRAND_NAME}.
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
