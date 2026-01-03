/**
 * Email templates for TradeSmart
 *
 * These templates use a simple HTML structure that works well across email clients.
 * Styles are inlined for maximum compatibility.
 */

import type {
  WelcomeEmailParams,
  PasswordResetEmailParams,
  SubscriptionConfirmationEmailParams,
  DailyBriefingEmailParams,
  SubscriptionCancelledEmailParams,
  PaymentFailedEmailParams,
} from "./types";

const BRAND_COLOR = "#3B82F6"; // Blue-500
const BRAND_NAME = "TradeSmart";
const SUPPORT_EMAIL = "support@tradesmarthub.com";

// Base layout wrapper for all emails
function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${BRAND_NAME}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: ${BRAND_COLOR}; padding: 24px 32px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">${BRAND_NAME}</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; text-align: center;">
                Questions? Contact us at <a href="mailto:${SUPPORT_EMAIL}" style="color: ${BRAND_COLOR};">${SUPPORT_EMAIL}</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
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

// Primary button style
function primaryButton(text: string, url: string): string {
  return `
<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 24px 0;">
  <tr>
    <td style="border-radius: 6px; background-color: ${BRAND_COLOR};">
      <a href="${url}" style="display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none;">
        ${text}
      </a>
    </td>
  </tr>
</table>
`.trim();
}

// Welcome email template
export function welcomeEmailTemplate(params: WelcomeEmailParams): {
  subject: string;
  html: string;
} {
  const { data } = params;
  const loginUrl = data.loginUrl || "https://tradesmarthub.com/login";

  const content = `
<h2 style="margin: 0 0 16px 0; font-size: 20px; color: #111827;">Welcome to ${BRAND_NAME}, ${data.userName}!</h2>
<p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
  Thank you for signing up! You're now part of a community of smart traders who use data-driven insights to find the best opportunities.
</p>
<p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
  Here's what you can do next:
</p>
<ul style="margin: 0 0 16px 0; padding-left: 20px; color: #374151;">
  <li style="margin-bottom: 8px;">Explore real-time trading opportunities</li>
  <li style="margin-bottom: 8px;">Set up your notification preferences</li>
  <li style="margin-bottom: 8px;">Review your personalized daily briefings</li>
</ul>
${primaryButton("Go to Dashboard", loginUrl)}
<p style="margin: 16px 0 0 0; font-size: 14px; color: #6b7280;">
  If you have any questions, our support team is here to help.
</p>
`.trim();

  return {
    subject: `Welcome to ${BRAND_NAME}!`,
    html: emailWrapper(content),
  };
}

// Password reset email template
export function passwordResetEmailTemplate(params: PasswordResetEmailParams): {
  subject: string;
  html: string;
} {
  const { data } = params;

  const content = `
<h2 style="margin: 0 0 16px 0; font-size: 20px; color: #111827;">Reset Your Password</h2>
<p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
  Hi ${data.userName},
</p>
<p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
  We received a request to reset your password. Click the button below to choose a new password.
</p>
${primaryButton("Reset Password", data.resetUrl)}
<p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280;">
  This link will expire in ${data.expiresIn}.
</p>
<p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280;">
  If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
</p>
<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
<p style="margin: 0; font-size: 12px; color: #9ca3af;">
  If the button doesn't work, copy and paste this URL into your browser:<br>
  <a href="${data.resetUrl}" style="color: ${BRAND_COLOR}; word-break: break-all;">${data.resetUrl}</a>
</p>
`.trim();

  return {
    subject: `Reset your ${BRAND_NAME} password`,
    html: emailWrapper(content),
  };
}

// Subscription confirmation email template
export function subscriptionConfirmationEmailTemplate(
  params: SubscriptionConfirmationEmailParams,
): { subject: string; html: string } {
  const { data } = params;
  const billingText = data.billingCycle === "monthly" ? "month" : "year";

  const content = `
<h2 style="margin: 0 0 16px 0; font-size: 20px; color: #111827;">Subscription Confirmed!</h2>
<p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
  Hi ${data.userName},
</p>
<p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
  Thank you for subscribing to ${BRAND_NAME}! Your ${data.planName} plan is now active.
</p>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0; background-color: #f9fafb; border-radius: 8px; padding: 20px;">
  <tr>
    <td style="padding: 16px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding-bottom: 12px;">
            <span style="font-size: 14px; color: #6b7280;">Plan</span><br>
            <span style="font-size: 16px; font-weight: 600; color: #111827;">${data.planName}</span>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 12px;">
            <span style="font-size: 14px; color: #6b7280;">Amount</span><br>
            <span style="font-size: 16px; font-weight: 600; color: #111827;">${data.amount}/${billingText}</span>
          </td>
        </tr>
        <tr>
          <td>
            <span style="font-size: 14px; color: #6b7280;">Next billing date</span><br>
            <span style="font-size: 16px; font-weight: 600; color: #111827;">${data.nextBillingDate}</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
${primaryButton("Go to Dashboard", data.dashboardUrl)}
<p style="margin: 16px 0 0 0; font-size: 14px; color: #6b7280;">
  You can manage your subscription at any time from your account settings.
</p>
`.trim();

  return {
    subject: `Your ${BRAND_NAME} ${data.planName} subscription is active`,
    html: emailWrapper(content),
  };
}

// Daily briefing email template
export function dailyBriefingEmailTemplate(params: DailyBriefingEmailParams): {
  subject: string;
  html: string;
} {
  const { data } = params;

  const opportunitiesHtml =
    data.topOpportunities.length > 0
      ? data.topOpportunities
          .map((opp) =>
            `
<tr>
  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td>
          <span style="font-size: 16px; font-weight: 600; color: #111827;">${opp.title}</span><br>
          <span style="font-size: 14px; color: #6b7280;">${opp.type}</span>
        </td>
        <td style="text-align: right;">
          <span style="font-size: 16px; font-weight: 600; color: #10b981;">${opp.potentialReturn}</span><br>
          <span style="font-size: 12px; color: #6b7280;">${opp.confidence}% confidence</span>
        </td>
      </tr>
    </table>
  </td>
</tr>
`.trim(),
          )
          .join("")
      : '<tr><td style="padding: 12px 0; color: #6b7280; font-style: italic;">No high-confidence opportunities today.</td></tr>';

  const content = `
<h2 style="margin: 0 0 16px 0; font-size: 20px; color: #111827;">Daily Briefing - ${data.date}</h2>
<p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
  Good morning, ${data.userName}!
</p>
<p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
  ${data.summary}
</p>
<div style="background-color: #f0f9ff; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
  <p style="margin: 0; font-size: 14px; color: #0369a1;">
    <strong>${data.opportunityCount}</strong> opportunities identified today
  </p>
</div>
<h3 style="margin: 0 0 16px 0; font-size: 16px; color: #111827;">Top Opportunities</h3>
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
  ${opportunitiesHtml}
</table>
${primaryButton("View All Opportunities", data.dashboardUrl)}
`.trim();

  return {
    subject: `[${BRAND_NAME}] Daily Briefing - ${data.date} (${data.opportunityCount} opportunities)`,
    html: emailWrapper(content),
  };
}

// Subscription cancelled email template
export function subscriptionCancelledEmailTemplate(
  params: SubscriptionCancelledEmailParams,
): { subject: string; html: string } {
  const { data } = params;

  const content = `
<h2 style="margin: 0 0 16px 0; font-size: 20px; color: #111827;">Subscription Cancelled</h2>
<p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
  Hi ${data.userName},
</p>
<p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
  We're sorry to see you go. Your ${data.planName} subscription has been cancelled.
</p>
<p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
  You'll continue to have access to all features until <strong>${data.accessEndDate}</strong>.
</p>
<p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
  Changed your mind? You can reactivate your subscription at any time.
</p>
${primaryButton("Reactivate Subscription", data.reactivateUrl)}
<p style="margin: 16px 0 0 0; font-size: 14px; color: #6b7280;">
  We'd love to hear your feedback. If there's anything we could have done better, please let us know at ${SUPPORT_EMAIL}.
</p>
`.trim();

  return {
    subject: `Your ${BRAND_NAME} subscription has been cancelled`,
    html: emailWrapper(content),
  };
}

// Payment failed email template
export function paymentFailedEmailTemplate(params: PaymentFailedEmailParams): {
  subject: string;
  html: string;
} {
  const { data } = params;

  const retryText = data.retryDate
    ? `We'll automatically retry the payment on ${data.retryDate}.`
    : "Please update your payment method to avoid service interruption.";

  const content = `
<h2 style="margin: 0 0 16px 0; font-size: 20px; color: #dc2626;">Payment Failed</h2>
<p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
  Hi ${data.userName},
</p>
<p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">
  We were unable to process your payment of <strong>${data.amount}</strong>. ${retryText}
</p>
<p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
  To ensure uninterrupted access to ${BRAND_NAME}, please update your payment information.
</p>
${primaryButton("Update Payment Method", data.updatePaymentUrl)}
<p style="margin: 16px 0 0 0; font-size: 14px; color: #6b7280;">
  If you believe this is an error, please contact your bank or reach out to our support team.
</p>
`.trim();

  return {
    subject: `Action required: Payment failed for ${BRAND_NAME}`,
    html: emailWrapper(content),
  };
}
