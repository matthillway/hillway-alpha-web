import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type {
  DiscountCode,
  ValidateDiscountCodeResponse,
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
    const { code, tier } = body as {
      code: string;
      tier?: "starter" | "pro" | "enterprise";
    };

    if (!code) {
      return NextResponse.json<ValidateDiscountCodeResponse>(
        { valid: false, error: "Discount code is required" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    // Fetch the discount code (case-insensitive search)
    const { data: discountCode, error } = await supabase
      .from("discount_codes")
      .select("*")
      .ilike("code", code.trim())
      .single();

    if (error || !discountCode) {
      return NextResponse.json<ValidateDiscountCodeResponse>(
        { valid: false, error: "Invalid discount code" },
        { status: 200 },
      );
    }

    const discount = discountCode as DiscountCode;

    // Check if code is active
    if (!discount.is_active) {
      return NextResponse.json<ValidateDiscountCodeResponse>(
        { valid: false, error: "This discount code is no longer active" },
        { status: 200 },
      );
    }

    // Check validity dates
    const now = new Date();
    const validFrom = new Date(discount.valid_from);
    if (now < validFrom) {
      return NextResponse.json<ValidateDiscountCodeResponse>(
        { valid: false, error: "This discount code is not yet valid" },
        { status: 200 },
      );
    }

    if (discount.valid_until) {
      const validUntil = new Date(discount.valid_until);
      if (now > validUntil) {
        return NextResponse.json<ValidateDiscountCodeResponse>(
          { valid: false, error: "This discount code has expired" },
          { status: 200 },
        );
      }
    }

    // Check usage limits
    if (
      discount.max_uses !== null &&
      discount.current_uses >= discount.max_uses
    ) {
      return NextResponse.json<ValidateDiscountCodeResponse>(
        {
          valid: false,
          error: "This discount code has reached its maximum uses",
        },
        { status: 200 },
      );
    }

    // Check tier applicability
    if (tier && discount.applicable_tiers) {
      if (!discount.applicable_tiers.includes(tier)) {
        return NextResponse.json<ValidateDiscountCodeResponse>(
          {
            valid: false,
            error: `This discount code is not valid for the ${tier} tier`,
          },
          { status: 200 },
        );
      }
    }

    // Code is valid
    return NextResponse.json<ValidateDiscountCodeResponse>({
      valid: true,
      discount: {
        code: discount.code,
        type: discount.discount_type,
        value: discount.discount_value,
        description: discount.description,
        applicable_tiers: discount.applicable_tiers,
      },
    });
  } catch (error) {
    console.error("Error validating discount code:", error);
    return NextResponse.json<ValidateDiscountCodeResponse>(
      { valid: false, error: "Failed to validate discount code" },
      { status: 500 },
    );
  }
}
