/**
 * Email Send API Route
 * POST /api/email/send
 *
 * Protected endpoint for sending transactional emails.
 * Requires authentication or API key for security.
 */

import { NextRequest, NextResponse } from "next/server";
import { sendEmail, validateEmailConfig } from "@/lib/email";
import type { EmailParams } from "@/lib/email";

// Validate the request has proper authorization
function isAuthorized(request: NextRequest): boolean {
  // Check for API key in header (for server-to-server calls)
  const apiKey = request.headers.get("x-api-key");
  const validApiKey = process.env.EMAIL_API_KEY;

  if (validApiKey && apiKey === validApiKey) {
    return true;
  }

  // Check for internal service header (for cron jobs, webhooks)
  const internalSecret = request.headers.get("x-internal-secret");
  const validSecret = process.env.INTERNAL_SECRET;

  if (validSecret && internalSecret === validSecret) {
    return true;
  }

  // In development, allow unauthenticated requests for testing
  if (process.env.NODE_ENV === "development") {
    console.warn(
      "[Email API] Allowing unauthenticated request in development mode",
    );
    return true;
  }

  return false;
}

// Validate email params structure
function validateEmailParams(body: unknown): {
  valid: boolean;
  error?: string;
  params?: EmailParams;
} {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be an object" };
  }

  const params = body as Record<string, unknown>;

  // Check required fields
  if (!params.type || typeof params.type !== "string") {
    return { valid: false, error: 'Missing or invalid "type" field' };
  }

  if (!params.to) {
    return { valid: false, error: 'Missing "to" field' };
  }

  if (!params.data || typeof params.data !== "object") {
    return { valid: false, error: 'Missing or invalid "data" field' };
  }

  // Validate type is a known email type
  const validTypes = [
    "welcome",
    "password-reset",
    "subscription-confirmation",
    "daily-briefing",
    "subscription-cancelled",
    "payment-failed",
  ];

  if (!validTypes.includes(params.type)) {
    return {
      valid: false,
      error: `Invalid email type. Must be one of: ${validTypes.join(", ")}`,
    };
  }

  return { valid: true, params: params as unknown as EmailParams };
}

export async function POST(request: NextRequest) {
  // Check authorization
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate email configuration
  const configCheck = validateEmailConfig();
  if (!configCheck.valid) {
    console.error("[Email API] Configuration error:", configCheck.error);
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 503 },
    );
  }

  // Parse request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 },
    );
  }

  // Validate email params
  const validation = validateEmailParams(body);
  if (!validation.valid || !validation.params) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // Send the email
  const result = await sendEmail(validation.params);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "Failed to send email" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    messageId: result.messageId,
  });
}

// Health check for email service
export async function GET() {
  const configCheck = validateEmailConfig();

  return NextResponse.json({
    status: configCheck.valid ? "healthy" : "unhealthy",
    configured: configCheck.valid,
    error: configCheck.error,
  });
}
