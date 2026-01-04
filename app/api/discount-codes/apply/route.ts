import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type {
  DiscountCode,
  ApplyDiscountCodeResponse,
} from "@/lib/types/discount-codes";

// Lazy-create admin Supabase client to avoid build-time errors
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, user_id, tier } = body as {
      code: string;
      user_id: string;
      tier?: "starter" | "pro" | "unlimited";
    };

    if (!code || !user_id) {
      return NextResponse.json<ApplyDiscountCodeResponse>(
        { success: false, error: "Discount code and user ID are required" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    // Fetch the discount code (case-insensitive search)
    const { data: discountCode, error: codeError } = await supabase
      .from("discount_codes")
      .select("*")
      .ilike("code", code.trim())
      .single();

    if (codeError || !discountCode) {
      return NextResponse.json<ApplyDiscountCodeResponse>(
        { success: false, error: "Invalid discount code" },
        { status: 400 },
      );
    }

    const discount = discountCode as DiscountCode;

    // Validate the code (same checks as validate endpoint)
    if (!discount.is_active) {
      return NextResponse.json<ApplyDiscountCodeResponse>(
        { success: false, error: "This discount code is no longer active" },
        { status: 400 },
      );
    }

    const now = new Date();
    const validFrom = new Date(discount.valid_from);
    if (now < validFrom) {
      return NextResponse.json<ApplyDiscountCodeResponse>(
        { success: false, error: "This discount code is not yet valid" },
        { status: 400 },
      );
    }

    if (discount.valid_until) {
      const validUntil = new Date(discount.valid_until);
      if (now > validUntil) {
        return NextResponse.json<ApplyDiscountCodeResponse>(
          { success: false, error: "This discount code has expired" },
          { status: 400 },
        );
      }
    }

    if (
      discount.max_uses !== null &&
      discount.current_uses >= discount.max_uses
    ) {
      return NextResponse.json<ApplyDiscountCodeResponse>(
        {
          success: false,
          error: "This discount code has reached its maximum uses",
        },
        { status: 400 },
      );
    }

    if (tier && discount.applicable_tiers) {
      if (!discount.applicable_tiers.includes(tier)) {
        return NextResponse.json<ApplyDiscountCodeResponse>(
          {
            success: false,
            error: `This discount code is not valid for the ${tier} tier`,
          },
          { status: 400 },
        );
      }
    }

    // Check if user has already used this code
    const { data: existingUsage } = await supabase
      .from("user_discount_codes")
      .select("id")
      .eq("user_id", user_id)
      .eq("discount_code_id", discount.id)
      .single();

    if (existingUsage) {
      return NextResponse.json<ApplyDiscountCodeResponse>(
        { success: false, error: "You have already used this discount code" },
        { status: 400 },
      );
    }

    // Calculate expiration for the discount effect
    let expiresAt: string | null = null;
    let trialEndDate: string | null = null;

    if (discount.discount_type === "free_months") {
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + discount.discount_value);
      expiresAt = expiry.toISOString();
      trialEndDate = expiresAt;
    } else if (discount.discount_type === "free_forever") {
      expiresAt = null; // Never expires
    }

    // Start a transaction-like operation
    // 1. Insert the user discount code record
    const { error: insertError } = await supabase
      .from("user_discount_codes")
      .insert({
        user_id,
        discount_code_id: discount.id,
        applied_at: now.toISOString(),
        expires_at: expiresAt,
        is_consumed: false,
      });

    if (insertError) {
      console.error("Error inserting user discount code:", insertError);
      return NextResponse.json<ApplyDiscountCodeResponse>(
        { success: false, error: "Failed to apply discount code" },
        { status: 500 },
      );
    }

    // 2. Increment the usage counter
    const { error: updateError } = await supabase
      .from("discount_codes")
      .update({ current_uses: discount.current_uses + 1 })
      .eq("id", discount.id);

    if (updateError) {
      console.error("Error updating discount code usage:", updateError);
      // Don't fail the request, the code was applied
    }

    // 3. Update user record based on discount type
    if (
      discount.discount_type === "free_months" ||
      discount.discount_type === "free_forever"
    ) {
      const userUpdate: Record<string, unknown> = {
        discount_code_applied: discount.code,
      };

      if (discount.discount_type === "free_months") {
        userUpdate.trial_ends_at = trialEndDate;
        // If they don't have a subscription yet, give them trial access
        userUpdate.subscription_tier = tier || "pro"; // Default to pro for free months
        userUpdate.subscription_status = "trialing";
      } else if (discount.discount_type === "free_forever") {
        userUpdate.subscription_tier = "pro"; // Free forever = pro access
        userUpdate.subscription_status = "active";
        userUpdate.is_lifetime_access = true;
      }

      const { error: userUpdateError } = await supabase
        .from("users")
        .update(userUpdate)
        .eq("id", user_id);

      if (userUpdateError) {
        console.error("Error updating user with discount:", userUpdateError);
        // Don't fail - the discount was recorded
      }
    } else {
      // For percentage/fixed discounts, just store the code reference
      const { error: userUpdateError } = await supabase
        .from("users")
        .update({ discount_code_applied: discount.code })
        .eq("id", user_id);

      if (userUpdateError) {
        console.error(
          "Error updating user discount code ref:",
          userUpdateError,
        );
      }
    }

    console.log(
      `Discount code ${discount.code} applied to user ${user_id} (type: ${discount.discount_type}, value: ${discount.discount_value})`,
    );

    return NextResponse.json<ApplyDiscountCodeResponse>({
      success: true,
      trial_end_date: trialEndDate || undefined,
      discount_applied: {
        type: discount.discount_type,
        value: discount.discount_value,
      },
    });
  } catch (error) {
    console.error("Error applying discount code:", error);
    return NextResponse.json<ApplyDiscountCodeResponse>(
      { success: false, error: "Failed to apply discount code" },
      { status: 500 },
    );
  }
}
