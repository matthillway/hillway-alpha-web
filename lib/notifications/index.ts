// ============================================
// HILLWAY ALPHA - Notification System
// ============================================

export * from './whatsapp';
export * from './email';

import { sendWhatsAppMessage, isWhatsAppConfigured, sendDailyBriefingWhatsApp } from './whatsapp';
import { sendEmail, isEmailConfigured, sendDailyBriefingEmail } from './email';

export interface NotificationChannels {
  whatsapp: boolean;
  email: boolean;
}

/**
 * Get available notification channels
 */
export function getAvailableChannels(): NotificationChannels {
  return {
    whatsapp: isWhatsAppConfigured(),
    email: isEmailConfigured(),
  };
}

/**
 * Send alert to all configured channels
 */
export async function sendAlert(
  message: string,
  channels?: Partial<NotificationChannels>
): Promise<{ whatsapp: boolean; email: boolean }> {
  const available = getAvailableChannels();
  const results = { whatsapp: false, email: false };

  if (available.whatsapp && (channels?.whatsapp !== false)) {
    results.whatsapp = await sendWhatsAppMessage(message);
  }

  if (available.email && (channels?.email !== false)) {
    results.email = await sendEmail('Hillway Alpha Alert', `<p>${message}</p>`, message);
  }

  return results;
}

/**
 * Send daily briefing to all configured channels
 */
export async function sendDailyBriefing(briefing: {
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
}): Promise<{ whatsapp: boolean; email: boolean; sent: string[] }> {
  const available = getAvailableChannels();
  const results = { whatsapp: false, email: false, sent: [] as string[] };

  // Send email (full format)
  if (available.email) {
    results.email = await sendDailyBriefingEmail(briefing);
    if (results.email) results.sent.push('email');
  }

  // Send WhatsApp (condensed format)
  if (available.whatsapp) {
    const whatsappBriefing = formatBriefingForWhatsApp(briefing);
    results.whatsapp = await sendDailyBriefingWhatsApp(whatsappBriefing);
    if (results.whatsapp) results.sent.push('whatsapp');
  }

  return results;
}

/**
 * Format briefing for WhatsApp (condensed)
 */
function formatBriefingForWhatsApp(briefing: {
  date: string;
  opportunities: Array<{
    rank: number;
    title: string;
    type: string;
    margin?: number;
    expectedValue?: number;
    confidence: number;
  }>;
  totalPnL?: number;
}): string {
  let message = `🌅 *HILLWAY ALPHA*\n📅 ${briefing.date}\n\n`;

  if (briefing.opportunities.length === 0) {
    message += '📭 No high-confidence opportunities today.\n';
  } else {
    message += `🎯 *TOP ${Math.min(3, briefing.opportunities.length)} OPPORTUNITIES*\n\n`;

    briefing.opportunities.slice(0, 3).forEach((opp, i) => {
      const edge = opp.margin
        ? `+${opp.margin.toFixed(2)}%`
        : `+${opp.expectedValue?.toFixed(2)}% EV`;

      message += `${i + 1}. ${opp.title}\n`;
      message += `   ${edge} | ${opp.confidence}% conf\n\n`;
    });

    if (briefing.opportunities.length > 3) {
      message += `_+${briefing.opportunities.length - 3} more opportunities_\n\n`;
    }
  }

  if (briefing.totalPnL !== undefined) {
    const pnlEmoji = briefing.totalPnL >= 0 ? '📈' : '📉';
    message += `${pnlEmoji} Yesterday: ${briefing.totalPnL >= 0 ? '+' : ''}£${briefing.totalPnL.toFixed(2)}`;
  }

  return message;
}

/**
 * Simple notification function for jobs
 */
export async function notifyUser(
  message: string,
  channel: 'whatsapp' | 'email' | 'all' = 'all'
): Promise<boolean> {
  try {
    if (channel === 'whatsapp' || channel === 'all') {
      if (isWhatsAppConfigured()) {
        await sendWhatsAppMessage(message);
      }
    }

    if (channel === 'email' || channel === 'all') {
      if (isEmailConfigured()) {
        await sendEmail('Hillway Alpha Notification', `<p>${message}</p>`, message);
      }
    }

    return true;
  } catch (error) {
    console.error('Notification error:', error);
    return false;
  }
}
