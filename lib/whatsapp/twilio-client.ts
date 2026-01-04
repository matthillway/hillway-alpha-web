// ============================================
// HILLWAY ALPHA - Twilio WhatsApp Client
// Uses official Twilio SDK for WhatsApp messaging
// ============================================

import twilio from "twilio";

// Twilio client singleton
let twilioClient: twilio.Twilio | null = null;

/**
 * Check if Twilio credentials are configured
 */
export function isTwilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_FROM,
  );
}

/**
 * Get the Twilio client singleton
 * Returns null if credentials are not configured
 */
export function getTwilioClient(): twilio.Twilio | null {
  if (!isTwilioConfigured()) {
    console.warn(
      "Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM environment variables.",
    );
    return null;
  }

  if (!twilioClient) {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!,
    );
  }

  return twilioClient;
}

export interface WhatsAppMessageResult {
  success: boolean;
  messageSid?: string;
  error?: string;
}

/**
 * Send a WhatsApp message via Twilio
 * @param to - Phone number in E.164 format (e.g., +447123456789) or WhatsApp format (whatsapp:+447123456789)
 * @param message - Message content (max 1600 characters)
 */
export async function sendWhatsAppMessage(
  to: string,
  message: string,
): Promise<WhatsAppMessageResult> {
  const client = getTwilioClient();

  if (!client) {
    return {
      success: false,
      error:
        "Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_WHATSAPP_FROM.",
    };
  }

  // Ensure the 'to' number is in WhatsApp format
  const toNumber = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM!;

  // Validate message length (WhatsApp limit)
  if (message.length > 1600) {
    console.warn(
      `WhatsApp message exceeds 1600 char limit (${message.length} chars). Truncating.`,
    );
    message = message.substring(0, 1597) + "...";
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: toNumber,
    });

    return {
      success: true,
      messageSid: result.sid,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to send WhatsApp message:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Send a WhatsApp message with rate limiting (1 msg/sec)
 * Used for batch operations to respect Twilio rate limits
 */
export async function sendWhatsAppMessageThrottled(
  to: string,
  message: string,
): Promise<WhatsAppMessageResult> {
  const result = await sendWhatsAppMessage(to, message);

  // Wait 1 second to respect Twilio rate limits
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return result;
}

/**
 * Send a long message in chunks (handles WhatsApp 1600 char limit)
 * @param to - Phone number
 * @param message - Full message content
 * @param maxChunkSize - Max characters per chunk (default 1500 to leave room for chunk headers)
 */
export async function sendLongWhatsAppMessage(
  to: string,
  message: string,
  maxChunkSize: number = 1500,
): Promise<{ success: boolean; totalChunks: number; errors: string[] }> {
  if (message.length <= maxChunkSize) {
    const result = await sendWhatsAppMessage(to, message);
    return {
      success: result.success,
      totalChunks: 1,
      errors: result.error ? [result.error] : [],
    };
  }

  // Split into chunks at newline boundaries
  const chunks: string[] = [];
  let remaining = message;

  while (remaining.length > 0) {
    if (remaining.length <= maxChunkSize) {
      chunks.push(remaining);
      break;
    }

    // Find a good break point (newline)
    let breakPoint = remaining.lastIndexOf("\n", maxChunkSize);
    if (breakPoint < maxChunkSize / 2) {
      // No good newline found, break at space
      breakPoint = remaining.lastIndexOf(" ", maxChunkSize);
    }
    if (breakPoint < maxChunkSize / 2) {
      // No good space found, hard break
      breakPoint = maxChunkSize;
    }

    chunks.push(remaining.substring(0, breakPoint));
    remaining = remaining.substring(breakPoint).trim();
  }

  const errors: string[] = [];
  let allSuccess = true;

  for (let i = 0; i < chunks.length; i++) {
    const header = chunks.length > 1 ? `(${i + 1}/${chunks.length})\n\n` : "";
    const result = await sendWhatsAppMessageThrottled(to, header + chunks[i]);

    if (!result.success) {
      allSuccess = false;
      errors.push(result.error || `Chunk ${i + 1} failed`);
    }
  }

  return {
    success: allSuccess,
    totalChunks: chunks.length,
    errors,
  };
}
