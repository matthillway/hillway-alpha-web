/**
 * Discount Code Types
 *
 * Discount codes can provide:
 * - percentage: X% off subscription price
 * - fixed: Fixed amount off (e.g., £10 off)
 * - free_months: X months free (extended trial)
 * - free_forever: Lifetime free access (for special partners)
 */

export type DiscountType =
  | "percentage"
  | "fixed"
  | "free_months"
  | "free_forever";

export interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number; // percentage (0-100), fixed amount, or number of free months
  applicable_tiers: ("starter" | "pro" | "unlimited")[] | null; // null = all tiers
  max_uses: number | null; // null = unlimited
  current_uses: number;
  valid_from: string;
  valid_until: string | null; // null = never expires
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserDiscountCode {
  id: string;
  user_id: string;
  discount_code_id: string;
  applied_at: string;
  expires_at: string | null; // When the discount effect expires
  is_consumed: boolean; // For one-time use codes
}

export interface ValidateDiscountCodeResponse {
  valid: boolean;
  error?: string;
  discount?: {
    code: string;
    type: DiscountType;
    value: number;
    description: string | null;
    applicable_tiers: ("starter" | "pro" | "unlimited")[] | null;
  };
}

export interface ApplyDiscountCodeRequest {
  code: string;
  user_id: string;
  tier?: "starter" | "pro" | "unlimited";
}

export interface ApplyDiscountCodeResponse {
  success: boolean;
  error?: string;
  trial_end_date?: string; // For free_months type
  discount_applied?: {
    type: DiscountType;
    value: number;
  };
}
