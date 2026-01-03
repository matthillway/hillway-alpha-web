/**
 * Email service for TradeSmart
 *
 * Uses Resend for transactional email delivery.
 * All emails are sent from noreply@tradesmarthub.com
 */

import { Resend } from "resend";
import type {
  EmailParams,
  SendEmailResult,
  EmailConfig,
  EmailRecipient,
} from "./types";
import {
  welcomeEmailTemplate,
  passwordResetEmailTemplate,
  subscriptionConfirmationEmailTemplate,
  dailyBriefingEmailTemplate,
  subscriptionCancelledEmailTemplate,
  paymentFailedEmailTemplate,
} from "./templates";

// Default configuration
const DEFAULT_CONFIG: EmailConfig = {
  from: "TradeSmart <noreply@tradesmarthub.com>",
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "https://tradesmarthub.com",
};

// Initialize Resend client (lazy initialization)
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

// Format recipients for Resend
function formatRecipients(to: EmailRecipient | EmailRecipient[]): string[] {
  const recipients = Array.isArray(to) ? to : [to];
  return recipients.map((r) => (r.name ? `${r.name} <${r.email}>` : r.email));
}

// Generate email content based on type
function generateEmailContent(params: EmailParams): {
  subject: string;
  html: string;
} {
  switch (params.type) {
    case "welcome":
      return welcomeEmailTemplate(params);
    case "password-reset":
      return passwordResetEmailTemplate(params);
    case "subscription-confirmation":
      return subscriptionConfirmationEmailTemplate(params);
    case "daily-briefing":
      return dailyBriefingEmailTemplate(params);
    case "subscription-cancelled":
      return subscriptionCancelledEmailTemplate(params);
    case "payment-failed":
      return paymentFailedEmailTemplate(params);
    default:
      throw new Error(`Unknown email type: ${(params as EmailParams).type}`);
  }
}

/**
 * Send an email using Resend
 *
 * @param params - Email parameters including type, recipient, and data
 * @param config - Optional configuration overrides
 * @returns Promise with send result
 *
 * @example
 * // Send a welcome email
 * await sendEmail({
 *   type: 'welcome',
 *   to: { email: 'user@example.com', name: 'John' },
 *   data: { userName: 'John' },
 * });
 *
 * @example
 * // Send password reset with custom reply-to
 * await sendEmail({
 *   type: 'password-reset',
 *   to: { email: 'user@example.com' },
 *   data: {
 *     userName: 'John',
 *     resetUrl: 'https://tradesmarthub.com/reset?token=abc123',
 *     expiresIn: '1 hour',
 *   },
 *   replyTo: 'support@tradesmarthub.com',
 * });
 */
export async function sendEmail(
  params: EmailParams,
  config: Partial<EmailConfig> = {},
): Promise<SendEmailResult> {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    const resend = getResendClient();
    const { subject, html } = generateEmailContent(params);
    const to = formatRecipients(params.to);

    const response = await resend.emails.send({
      from: mergedConfig.from,
      to,
      subject,
      html,
      replyTo: params.replyTo || mergedConfig.replyTo,
    });

    if (response.error) {
      console.error("[Email] Failed to send:", response.error);
      return {
        success: false,
        error: response.error.message,
      };
    }

    console.log(
      `[Email] Sent ${params.type} email to ${to.join(", ")}, ID: ${response.data?.id}`,
    );

    return {
      success: true,
      messageId: response.data?.id,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[Email] Error sending email:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Send multiple emails in batch (uses Resend's batch API)
 *
 * @param emailParams - Array of email parameters
 * @returns Promise with array of send results
 */
export async function sendEmailBatch(
  emailParams: EmailParams[],
): Promise<SendEmailResult[]> {
  const results = await Promise.all(
    emailParams.map((params) => sendEmail(params)),
  );
  return results;
}

/**
 * Validate email configuration
 * Useful for health checks and startup validation
 */
export function validateEmailConfig(): { valid: boolean; error?: string } {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      valid: false,
      error: "RESEND_API_KEY is not configured",
    };
  }

  if (!apiKey.startsWith("re_")) {
    return {
      valid: false,
      error: "RESEND_API_KEY appears to be invalid (should start with re_)",
    };
  }

  return { valid: true };
}

// Re-export types for convenience
export type {
  EmailParams,
  EmailRecipient,
  SendEmailResult,
  EmailConfig,
  WelcomeEmailParams,
  PasswordResetEmailParams,
  SubscriptionConfirmationEmailParams,
  DailyBriefingEmailParams,
  SubscriptionCancelledEmailParams,
  PaymentFailedEmailParams,
} from "./types";
