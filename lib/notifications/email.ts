// ============================================
// HILLWAY ALPHA - Email Notifications (Resend)
// ============================================

import axios from 'axios';

interface ResendConfig {
  apiKey: string;
  toEmail: string;
  fromEmail: string;
}

/**
 * Get Resend configuration from environment
 */
function getResendConfig(): ResendConfig | null {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.MY_EMAIL;

  if (!apiKey || !toEmail) {
    return null;
  }

  return {
    apiKey,
    toEmail,
    fromEmail: 'Hillway Alpha <alerts@updates.hillwayco.uk>', // Requires verified domain
  };
}

/**
 * Check if email notifications are configured
 */
export function isEmailConfigured(): boolean {
  return getResendConfig() !== null;
}

/**
 * Send an email via Resend
 */
export async function sendEmail(
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<boolean> {
  const config = getResendConfig();

  if (!config) {
    console.warn('Email not configured. Set RESEND_API_KEY and MY_EMAIL.');
    return false;
  }

  try {
    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: config.fromEmail,
        to: [config.toEmail],
        subject,
        html: htmlContent,
        text: textContent,
      },
      {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Generate HTML email template for daily briefing
 */
export function generateBriefingEmailHtml(briefing: {
  date: string;
  marketContext: string;
  opportunities: Array<{
    rank: number;
    title: string;
    type: string;
    margin?: number;
    expectedValue?: number;
    confidence: number;
    action: string;
  }>;
  totalPnL?: number;
  winRate?: number;
}): string {
  const opportunitiesHtml = briefing.opportunities
    .map(
      (opp, i) => `
      <tr style="background-color: ${i % 2 === 0 ? '#f9fafb' : 'white'};">
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">#${opp.rank}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong>${opp.title}</strong><br>
          <span style="color: #6b7280; font-size: 12px;">${opp.type}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #059669; font-weight: bold;">
          ${opp.margin ? `+${opp.margin.toFixed(2)}%` : opp.expectedValue ? `+${opp.expectedValue.toFixed(2)}% EV` : '-'}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${opp.confidence}%</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${opp.action}</td>
      </tr>
    `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hillway Alpha Daily Briefing</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 800px; margin: 0 auto; padding: 20px;">

  <!-- Header -->
  <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 24px;">
    <h1 style="margin: 0; font-size: 28px;">🎯 Hillway Alpha</h1>
    <p style="margin: 8px 0 0 0; opacity: 0.9;">Daily Opportunity Briefing - ${briefing.date}</p>
  </div>

  <!-- Market Context -->
  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
    <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #374151;">📊 Market Context</h2>
    <p style="margin: 0; color: #4b5563;">${briefing.marketContext}</p>
  </div>

  <!-- Opportunities Table -->
  <div style="margin-bottom: 24px;">
    <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #374151;">🎯 Top Opportunities</h2>
    <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <thead>
        <tr style="background-color: #1f2937; color: white;">
          <th style="padding: 12px; text-align: left;">Rank</th>
          <th style="padding: 12px; text-align: left;">Opportunity</th>
          <th style="padding: 12px; text-align: left;">Edge</th>
          <th style="padding: 12px; text-align: left;">Confidence</th>
          <th style="padding: 12px; text-align: left;">Action</th>
        </tr>
      </thead>
      <tbody>
        ${opportunitiesHtml}
      </tbody>
    </table>
  </div>

  ${
    briefing.totalPnL !== undefined
      ? `
  <!-- Performance Summary -->
  <div style="background-color: ${briefing.totalPnL >= 0 ? '#d1fae5' : '#fee2e2'}; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
    <h2 style="margin: 0 0 12px 0; font-size: 18px; color: #374151;">📈 Yesterday's Performance</h2>
    <div style="display: flex; gap: 24px;">
      <div>
        <span style="font-size: 14px; color: #6b7280;">P&L</span>
        <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: bold; color: ${briefing.totalPnL >= 0 ? '#059669' : '#dc2626'};">
          ${briefing.totalPnL >= 0 ? '+' : ''}£${briefing.totalPnL.toFixed(2)}
        </p>
      </div>
      ${
        briefing.winRate !== undefined
          ? `
      <div>
        <span style="font-size: 14px; color: #6b7280;">Win Rate</span>
        <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: bold; color: #374151;">
          ${briefing.winRate.toFixed(1)}%
        </p>
      </div>
      `
          : ''
      }
    </div>
  </div>
  `
      : ''
  }

  <!-- Footer -->
  <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 14px;">
    <p style="margin: 0;">Generated by Hillway Alpha</p>
    <p style="margin: 4px 0 0 0;">© ${new Date().getFullYear()} Hillway Property Consultants</p>
  </div>

</body>
</html>
  `;
}

/**
 * Send daily briefing via email
 */
export async function sendDailyBriefingEmail(briefing: {
  date: string;
  marketContext: string;
  opportunities: Array<{
    rank: number;
    title: string;
    type: string;
    margin?: number;
    expectedValue?: number;
    confidence: number;
    action: string;
  }>;
  totalPnL?: number;
  winRate?: number;
}): Promise<boolean> {
  const subject = `🎯 Hillway Alpha - ${briefing.date} - ${briefing.opportunities.length} Opportunities`;
  const html = generateBriefingEmailHtml(briefing);

  // Generate plain text version
  const text = `
HILLWAY ALPHA - Daily Briefing
${briefing.date}

MARKET CONTEXT:
${briefing.marketContext}

TOP OPPORTUNITIES:
${briefing.opportunities.map((o) => `${o.rank}. ${o.title} (${o.type}) - ${o.margin ? `+${o.margin.toFixed(2)}%` : `+${o.expectedValue?.toFixed(2)}% EV`} - Confidence: ${o.confidence}% - Action: ${o.action}`).join('\n')}

${briefing.totalPnL !== undefined ? `YESTERDAY'S P&L: £${briefing.totalPnL.toFixed(2)}` : ''}
${briefing.winRate !== undefined ? `WIN RATE: ${briefing.winRate.toFixed(1)}%` : ''}
  `.trim();

  return sendEmail(subject, html, text);
}
