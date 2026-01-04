// ============================================
// HILLWAY ALPHA - WhatsApp Notifications (Twilio)
// ============================================

import axios from 'axios';

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;  // whatsapp:+14155238886 (Twilio sandbox)
  toNumber: string;    // whatsapp:+44xxxxxxxxxx
}

/**
 * Get Twilio configuration from environment
 */
function getTwilioConfig(): TwilioConfig | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;
  const toNumber = process.env.MY_WHATSAPP_NUMBER;

  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    return null;
  }

  return { accountSid, authToken, fromNumber, toNumber };
}

/**
 * Check if WhatsApp notifications are configured
 */
export function isWhatsAppConfigured(): boolean {
  return getTwilioConfig() !== null;
}

/**
 * Send a WhatsApp message via Twilio
 */
export async function sendWhatsAppMessage(message: string): Promise<boolean> {
  const config = getTwilioConfig();

  if (!config) {
    console.warn('WhatsApp not configured. Set TWILIO_* environment variables.');
    return false;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`;

  try {
    const response = await axios.post(
      url,
      new URLSearchParams({
        From: config.fromNumber,
        To: config.toNumber,
        Body: message,
      }),
      {
        auth: {
          username: config.accountSid,
          password: config.authToken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.status === 201;
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    return false;
  }
}

/**
 * Format a brief opportunity alert for WhatsApp
 */
export function formatWhatsAppAlert(
  type: 'arbitrage' | 'value_bet' | 'stock' | 'crypto',
  title: string,
  details: {
    margin?: number;
    expectedValue?: number;
    confidence?: number;
    action?: string;
    urgency?: 'low' | 'medium' | 'high';
  }
): string {
  const emoji = {
    arbitrage: '🎯',
    value_bet: '💰',
    stock: '📈',
    crypto: '🪙',
  }[type];

  const urgencyEmoji = {
    low: '',
    medium: '⏰',
    high: '🚨',
  }[details.urgency || 'low'];

  let message = `${emoji} ${urgencyEmoji} HILLWAY ALPHA\n\n`;
  message += `*${title}*\n\n`;

  if (details.margin !== undefined) {
    message += `📊 Margin: +${details.margin.toFixed(2)}%\n`;
  }

  if (details.expectedValue !== undefined) {
    message += `💹 Expected Value: +${details.expectedValue.toFixed(2)}%\n`;
  }

  if (details.confidence !== undefined) {
    message += `🎯 Confidence: ${details.confidence}%\n`;
  }

  if (details.action) {
    message += `\n✅ Action: ${details.action}`;
  }

  return message;
}

/**
 * Send daily briefing via WhatsApp (chunked if needed)
 */
export async function sendDailyBriefingWhatsApp(briefing: string): Promise<boolean> {
  // WhatsApp has a 1600 character limit per message
  const MAX_LENGTH = 1500;

  if (briefing.length <= MAX_LENGTH) {
    return sendWhatsAppMessage(briefing);
  }

  // Split into chunks
  const chunks: string[] = [];
  let remaining = briefing;

  while (remaining.length > 0) {
    if (remaining.length <= MAX_LENGTH) {
      chunks.push(remaining);
      break;
    }

    // Find a good break point (newline)
    let breakPoint = remaining.lastIndexOf('\n', MAX_LENGTH);
    if (breakPoint < MAX_LENGTH / 2) {
      breakPoint = MAX_LENGTH;
    }

    chunks.push(remaining.substring(0, breakPoint));
    remaining = remaining.substring(breakPoint).trim();
  }

  // Send each chunk with a small delay
  let success = true;
  for (let i = 0; i < chunks.length; i++) {
    const header = i > 0 ? `(${i + 1}/${chunks.length})\n` : '';
    const sent = await sendWhatsAppMessage(header + chunks[i]);
    if (!sent) success = false;

    // Small delay between messages
    if (i < chunks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return success;
}
