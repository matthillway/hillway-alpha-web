/**
 * Trial Ending Email Template
 *
 * Sent Day 5 or 7 (depending on trial length).
 * Trial ending reminder with value summary and upgrade CTA.
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

export interface TrialStats {
  opportunitiesViewed: number;
  alertsReceived: number;
  topCategory?: string;
  daysRemaining: number;
}

export interface TrialEndingEmailProps {
  userName: string;
  dashboardUrl: string;
  pricingUrl?: string;
  trialStats?: TrialStats;
  discountCode?: string;
  discountPercent?: number;
}

const BRAND_COLOR = BRAND_CONFIG.colors.primary;
const BRAND_NAME = BRAND_CONFIG.name;

const defaultTrialStats: TrialStats = {
  opportunitiesViewed: 47,
  alertsReceived: 12,
  topCategory: "Arbitrage",
  daysRemaining: 2,
};

const pricingTiers = [
  {
    name: "Starter",
    price: "19",
    features: ["3 sports markets", "100 scans/day", "Email alerts"],
  },
  {
    name: "Pro",
    price: "49",
    features: [
      "All markets",
      "1000 scans/day",
      "WhatsApp alerts",
      "Priority support",
    ],
    recommended: true,
  },
  {
    name: "Enterprise",
    price: "149",
    features: [
      "Unlimited scans",
      "API access",
      "White-label",
      "Dedicated support",
    ],
  },
];

export function TrialEndingEmail({
  userName,
  dashboardUrl,
  pricingUrl,
  trialStats,
  discountCode,
  discountPercent,
}: TrialEndingEmailProps) {
  const stats = trialStats || defaultTrialStats;
  const effectivePricingUrl = pricingUrl || `${dashboardUrl}/pricing`;
  const previewText = `Your ${BRAND_NAME} trial ends in ${stats.daysRemaining} day${stats.daysRemaining === 1 ? "" : "s"}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>{BRAND_NAME}</Heading>
            <Text style={headerSubtitle}>Trial Ending Soon</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            {/* Urgency Badge */}
            <Section style={urgencyBadge}>
              <Text style={urgencyText}>
                ⏰ {stats.daysRemaining} Day
                {stats.daysRemaining === 1 ? "" : "s"} Remaining
              </Text>
            </Section>

            <Heading style={h2}>Don't lose your edge, {userName}</Heading>
            <Text style={paragraph}>
              Your free trial of {BRAND_NAME} is coming to an end. Before it
              does, here's what you've accomplished:
            </Text>

            {/* Trial Stats */}
            <Section style={statsSection}>
              <Heading style={h3}>Your Trial Summary</Heading>
              <table
                role="presentation"
                width="100%"
                cellPadding="0"
                cellSpacing="0"
              >
                <tr>
                  <td style={statCell}>
                    <Text style={statValue}>{stats.opportunitiesViewed}</Text>
                    <Text style={statLabel}>Opportunities Viewed</Text>
                  </td>
                  <td style={statCell}>
                    <Text style={statValue}>{stats.alertsReceived}</Text>
                    <Text style={statLabel}>Alerts Received</Text>
                  </td>
                </tr>
              </table>
              {stats.topCategory && (
                <Text style={topCategoryText}>
                  Your most active category:{" "}
                  <strong style={{ color: BRAND_COLOR }}>
                    {stats.topCategory}
                  </strong>
                </Text>
              )}
            </Section>

            {/* Discount Offer */}
            {discountCode && discountPercent && (
              <Section style={discountSection}>
                <Text style={discountBadge}>
                  🎉 SPECIAL OFFER: {discountPercent}% OFF
                </Text>
                <Text style={discountText}>
                  Use code{" "}
                  <strong style={discountCodeStyle}>{discountCode}</strong> at
                  checkout to save {discountPercent}% on your first month.
                </Text>
              </Section>
            )}

            {/* Pricing Tiers */}
            <Heading style={h3}>Choose Your Plan</Heading>
            <Section style={pricingGrid}>
              {pricingTiers.map((tier) => (
                <Section
                  key={tier.name}
                  style={
                    tier.recommended
                      ? { ...pricingCard, ...recommendedCard }
                      : pricingCard
                  }
                >
                  {tier.recommended && (
                    <Text style={recommendedBadge}>MOST POPULAR</Text>
                  )}
                  <Text style={tierName}>{tier.name}</Text>
                  <Text style={tierPrice}>
                    <span style={currencySymbol}>£</span>
                    {tier.price}
                    <span style={perMonth}>/mo</span>
                  </Text>
                  <Section style={featuresList}>
                    {tier.features.map((feature, idx) => (
                      <Text key={idx} style={featureItem}>
                        ✓ {feature}
                      </Text>
                    ))}
                  </Section>
                </Section>
              ))}
            </Section>

            <Button style={primaryButton} href={effectivePricingUrl}>
              Upgrade Now
            </Button>

            {/* What You'll Lose */}
            <Section style={loseSection}>
              <Heading style={h4}>If you don't upgrade, you'll lose:</Heading>
              <Text style={loseItem}>
                ❌ Access to AI-powered opportunity scanning
              </Text>
              <Text style={loseItem}>
                ❌ Real-time alerts on profitable opportunities
              </Text>
              <Text style={loseItem}>
                ❌ AI analysis and confidence scoring
              </Text>
              <Text style={loseItem}>
                ❌ Multi-market coverage (stocks, crypto, betting)
              </Text>
            </Section>

            <Hr style={divider} />

            <Text style={paragraph}>
              Have questions before upgrading? Just reply to this email - we're
              here to help.
            </Text>

            <Text style={signoff}>The {BRAND_NAME} Team</Text>
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

const urgencyBadge = {
  backgroundColor: "rgba(239, 68, 68, 0.15)",
  borderRadius: "8px",
  padding: "12px 16px",
  margin: "0 0 24px 0",
  textAlign: "center" as const,
  border: "1px solid rgba(239, 68, 68, 0.3)",
};

const urgencyText = {
  color: "#EF4444",
  fontSize: "16px",
  fontWeight: "700",
  margin: "0",
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
  margin: "0 0 12px 0",
};

const paragraph = {
  color: "#94a3b8",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const statsSection = {
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  padding: "24px",
  margin: "0 0 24px 0",
  border: "1px solid #334155",
  textAlign: "center" as const,
};

const statCell = {
  textAlign: "center" as const,
  padding: "8px 16px",
  width: "50%",
};

const statValue = {
  color: BRAND_COLOR,
  fontSize: "36px",
  fontWeight: "700",
  margin: "0 0 4px 0",
};

const statLabel = {
  color: "#94a3b8",
  fontSize: "12px",
  margin: "0",
  textTransform: "uppercase" as const,
};

const topCategoryText = {
  color: "#94a3b8",
  fontSize: "14px",
  margin: "16px 0 0 0",
};

const discountSection = {
  backgroundColor: "rgba(22, 163, 74, 0.15)",
  borderRadius: "8px",
  padding: "20px",
  margin: "0 0 24px 0",
  border: "2px dashed " + BRAND_COLOR,
  textAlign: "center" as const,
};

const discountBadge = {
  color: BRAND_COLOR,
  fontSize: "18px",
  fontWeight: "700",
  margin: "0 0 8px 0",
};

const discountText = {
  color: "#94a3b8",
  fontSize: "14px",
  margin: "0",
};

const discountCodeStyle = {
  color: "#f1f5f9",
  backgroundColor: "#334155",
  padding: "2px 8px",
  borderRadius: "4px",
  fontFamily: "monospace",
};

const pricingGrid = {
  margin: "0 0 24px 0",
};

const pricingCard = {
  backgroundColor: "#0f172a",
  borderRadius: "8px",
  padding: "20px",
  margin: "0 0 12px 0",
  border: "1px solid #334155",
  textAlign: "center" as const,
};

const recommendedCard = {
  border: "2px solid " + BRAND_COLOR,
  position: "relative" as const,
};

const recommendedBadge = {
  backgroundColor: BRAND_COLOR,
  color: "#ffffff",
  fontSize: "10px",
  fontWeight: "700",
  padding: "4px 12px",
  borderRadius: "4px",
  display: "inline-block",
  margin: "0 0 12px 0",
  letterSpacing: "0.5px",
};

const tierName = {
  color: "#f1f5f9",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 8px 0",
};

const tierPrice = {
  color: "#f1f5f9",
  fontSize: "32px",
  fontWeight: "700",
  margin: "0 0 12px 0",
};

const currencySymbol = {
  fontSize: "18px",
  verticalAlign: "super" as const,
};

const perMonth = {
  fontSize: "14px",
  color: "#94a3b8",
  fontWeight: "400",
};

const featuresList = {
  textAlign: "left" as const,
};

const featureItem = {
  color: "#94a3b8",
  fontSize: "13px",
  margin: "0 0 6px 0",
};

const primaryButton = {
  backgroundColor: BRAND_COLOR,
  borderRadius: "6px",
  color: "#ffffff",
  display: "block",
  fontSize: "18px",
  fontWeight: "700",
  padding: "16px 24px",
  textAlign: "center" as const,
  textDecoration: "none",
  margin: "0 0 24px 0",
};

const loseSection = {
  backgroundColor: "rgba(239, 68, 68, 0.08)",
  borderRadius: "8px",
  padding: "20px",
  margin: "0 0 24px 0",
  border: "1px solid rgba(239, 68, 68, 0.2)",
};

const loseItem = {
  color: "#94a3b8",
  fontSize: "14px",
  margin: "0 0 8px 0",
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

export default TrialEndingEmail;

// Plain HTML export for fallback
export function trialEndingHtml(props: TrialEndingEmailProps): string {
  const stats = props.trialStats || defaultTrialStats;
  const pricingUrl = props.pricingUrl || `${props.dashboardUrl}/pricing`;

  const discountHtml =
    props.discountCode && props.discountPercent
      ? `
        <div style="background-color: rgba(22, 163, 74, 0.15); border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 2px dashed ${BRAND_COLOR}; text-align: center;">
          <p style="color: ${BRAND_COLOR}; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">🎉 SPECIAL OFFER: ${props.discountPercent}% OFF</p>
          <p style="color: #94a3b8; font-size: 14px; margin: 0;">
            Use code <strong style="color: #f1f5f9; background-color: #334155; padding: 2px 8px; border-radius: 4px; font-family: monospace;">${props.discountCode}</strong> at checkout to save ${props.discountPercent}% on your first month.
          </p>
        </div>
      `
      : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trial Ending Soon - ${BRAND_NAME}</title>
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
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Trial Ending Soon</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <!-- Urgency Badge -->
              <div style="background-color: rgba(239, 68, 68, 0.15); border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; text-align: center; border: 1px solid rgba(239, 68, 68, 0.3);">
                <p style="color: #EF4444; font-size: 16px; font-weight: 700; margin: 0;">⏰ ${stats.daysRemaining} Day${stats.daysRemaining === 1 ? "" : "s"} Remaining</p>
              </div>

              <h2 style="color: #f1f5f9; font-size: 24px; font-weight: 600; margin: 0 0 16px 0;">Don't lose your edge, ${props.userName}</h2>
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Your free trial of ${BRAND_NAME} is coming to an end. Before it does, here's what you've accomplished:
              </p>

              <!-- Trial Stats -->
              <div style="background-color: #0f172a; border-radius: 8px; padding: 24px; margin-bottom: 24px; border: 1px solid #334155; text-align: center;">
                <h3 style="color: #f1f5f9; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">Your Trial Summary</h3>
                <table role="presentation" cellspacing="0" cellpadding="8" border="0" width="100%">
                  <tr>
                    <td width="50%" style="text-align: center;">
                      <p style="color: ${BRAND_COLOR}; font-size: 36px; font-weight: 700; margin: 0 0 4px 0;">${stats.opportunitiesViewed}</p>
                      <p style="color: #94a3b8; font-size: 12px; margin: 0; text-transform: uppercase;">Opportunities Viewed</p>
                    </td>
                    <td width="50%" style="text-align: center;">
                      <p style="color: ${BRAND_COLOR}; font-size: 36px; font-weight: 700; margin: 0 0 4px 0;">${stats.alertsReceived}</p>
                      <p style="color: #94a3b8; font-size: 12px; margin: 0; text-transform: uppercase;">Alerts Received</p>
                    </td>
                  </tr>
                </table>
                ${stats.topCategory ? `<p style="color: #94a3b8; font-size: 14px; margin: 16px 0 0 0;">Your most active category: <strong style="color: ${BRAND_COLOR};">${stats.topCategory}</strong></p>` : ""}
              </div>

              ${discountHtml}

              <!-- Pricing -->
              <h3 style="color: #f1f5f9; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">Choose Your Plan</h3>

              <div style="background-color: #0f172a; border-radius: 8px; padding: 20px; margin-bottom: 12px; border: 1px solid #334155; text-align: center;">
                <p style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Starter</p>
                <p style="color: #f1f5f9; font-size: 32px; font-weight: 700; margin: 0 0 12px 0;"><span style="font-size: 18px; vertical-align: super;">£</span>19<span style="font-size: 14px; color: #94a3b8; font-weight: 400;">/mo</span></p>
                <p style="color: #94a3b8; font-size: 13px; margin: 0; text-align: left;">✓ 3 sports markets<br>✓ 100 scans/day<br>✓ Email alerts</p>
              </div>

              <div style="background-color: #0f172a; border-radius: 8px; padding: 20px; margin-bottom: 12px; border: 2px solid ${BRAND_COLOR}; text-align: center;">
                <span style="background-color: ${BRAND_COLOR}; color: #ffffff; font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 4px; display: inline-block; margin-bottom: 12px; letter-spacing: 0.5px;">MOST POPULAR</span>
                <p style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Pro</p>
                <p style="color: #f1f5f9; font-size: 32px; font-weight: 700; margin: 0 0 12px 0;"><span style="font-size: 18px; vertical-align: super;">£</span>49<span style="font-size: 14px; color: #94a3b8; font-weight: 400;">/mo</span></p>
                <p style="color: #94a3b8; font-size: 13px; margin: 0; text-align: left;">✓ All markets<br>✓ 1000 scans/day<br>✓ WhatsApp alerts<br>✓ Priority support</p>
              </div>

              <div style="background-color: #0f172a; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #334155; text-align: center;">
                <p style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 0 0 8px 0;">Enterprise</p>
                <p style="color: #f1f5f9; font-size: 32px; font-weight: 700; margin: 0 0 12px 0;"><span style="font-size: 18px; vertical-align: super;">£</span>149<span style="font-size: 14px; color: #94a3b8; font-weight: 400;">/mo</span></p>
                <p style="color: #94a3b8; font-size: 13px; margin: 0; text-align: left;">✓ Unlimited scans<br>✓ API access<br>✓ White-label<br>✓ Dedicated support</p>
              </div>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 24px 0; width: 100%;">
                <tr>
                  <td style="border-radius: 6px; background-color: ${BRAND_COLOR}; text-align: center;">
                    <a href="${pricingUrl}" style="display: block; padding: 16px 24px; font-size: 18px; font-weight: 700; color: #ffffff; text-decoration: none;">
                      Upgrade Now
                    </a>
                  </td>
                </tr>
              </table>

              <!-- What You'll Lose -->
              <div style="background-color: rgba(239, 68, 68, 0.08); border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid rgba(239, 68, 68, 0.2);">
                <h4 style="color: #f1f5f9; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">If you don't upgrade, you'll lose:</h4>
                <p style="color: #94a3b8; font-size: 14px; margin: 0; line-height: 1.8;">
                  ❌ Access to AI-powered opportunity scanning<br>
                  ❌ Real-time alerts on profitable opportunities<br>
                  ❌ AI analysis and confidence scoring<br>
                  ❌ Multi-market coverage (stocks, crypto, betting)
                </p>
              </div>

              <hr style="border: none; border-top: 1px solid #334155; margin: 24px 0;">

              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                Have questions before upgrading? Just reply to this email - we're here to help.
              </p>

              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin: 0;">
                The ${BRAND_NAME} Team
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
