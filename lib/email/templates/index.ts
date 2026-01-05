/**
 * Email Templates Index
 *
 * Re-exports all email templates for easy importing.
 */

export {
  OpportunityAlertEmail,
  opportunityAlertHtml,
  type OpportunityAlertProps,
} from "./opportunity-alert";

export {
  DailyDigestEmail,
  dailyDigestHtml,
  type DailyDigestProps,
  type DailyDigestOpportunity,
  type DailyDigestMetrics,
} from "./daily-digest";

export {
  WeeklyReportEmail,
  weeklyReportHtml,
  type WeeklyReportProps,
  type WeeklyStats,
  type WeeklyStatsCategory,
} from "./weekly-report";

// Onboarding Email Templates
export {
  WelcomeEmail,
  welcomeEmailHtml,
  type WelcomeEmailProps,
} from "./welcome-email";

export {
  GettingStartedEmail,
  gettingStartedHtml,
  type GettingStartedEmailProps,
} from "./getting-started";

export {
  FeatureHighlightEmail,
  featureHighlightHtml,
  type FeatureHighlightEmailProps,
  type SampleOpportunity,
} from "./feature-highlight";

export {
  TrialEndingEmail,
  trialEndingHtml,
  type TrialEndingEmailProps,
  type TrialStats,
} from "./trial-ending";
