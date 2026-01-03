/**
 * Email types for TradeSmartHub
 */

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

export interface BaseEmailParams {
  to: EmailRecipient | EmailRecipient[];
  replyTo?: string;
  attachments?: EmailAttachment[];
}

// Welcome email after signup
export interface WelcomeEmailParams extends BaseEmailParams {
  type: "welcome";
  data: {
    userName: string;
    loginUrl?: string;
  };
}

// Password reset request
export interface PasswordResetEmailParams extends BaseEmailParams {
  type: "password-reset";
  data: {
    userName: string;
    resetUrl: string;
    expiresIn: string; // e.g., "1 hour"
  };
}

// Subscription confirmation (after payment)
export interface SubscriptionConfirmationEmailParams extends BaseEmailParams {
  type: "subscription-confirmation";
  data: {
    userName: string;
    planName: string;
    amount: string; // formatted price, e.g., "$49.00"
    billingCycle: "monthly" | "annual";
    nextBillingDate: string;
    dashboardUrl: string;
  };
}

// Daily briefing delivery
export interface DailyBriefingEmailParams extends BaseEmailParams {
  type: "daily-briefing";
  data: {
    userName: string;
    date: string;
    summary: string;
    opportunityCount: number;
    topOpportunities: Array<{
      title: string;
      type: string;
      confidence: number;
      potentialReturn: string;
    }>;
    dashboardUrl: string;
  };
}

// Subscription cancellation
export interface SubscriptionCancelledEmailParams extends BaseEmailParams {
  type: "subscription-cancelled";
  data: {
    userName: string;
    planName: string;
    accessEndDate: string;
    reactivateUrl: string;
  };
}

// Payment failed
export interface PaymentFailedEmailParams extends BaseEmailParams {
  type: "payment-failed";
  data: {
    userName: string;
    amount: string;
    updatePaymentUrl: string;
    retryDate?: string;
  };
}

export type EmailParams =
  | WelcomeEmailParams
  | PasswordResetEmailParams
  | SubscriptionConfirmationEmailParams
  | DailyBriefingEmailParams
  | SubscriptionCancelledEmailParams
  | PaymentFailedEmailParams;

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailConfig {
  from: string;
  replyTo?: string;
  baseUrl: string;
}
