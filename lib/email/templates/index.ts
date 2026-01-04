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
