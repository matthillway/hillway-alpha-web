import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import type { DiscountCode } from "@/lib/types/discount-codes";

// Lazy-create admin Supabase client
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// Get trial days from user's applied discount code
async function getTrialDaysFromDiscount(
  userId: string,
): Promise<{ trialDays: number; discountCode: string | null }> {
  const supabase = getSupabaseAdmin();

  // Get user with their discount code
  const { data: user, error } = await supabase
    .from("users")
    .select("id, discount_code_applied")
    .eq("id", userId)
    .single();

  if (error || !user || !user.discount_code_applied) {
    return { trialDays: 0, discountCode: null };
  }

  // Get the discount code details
  const { data: discountCode } = await supabase
    .from("discount_codes")
    .select("*")
    .ilike("code", user.discount_code_applied)
    .single();

  if (!discountCode) {
    return { trialDays: 0, discountCode: user.discount_code_applied };
  }

  const discount = discountCode as DiscountCode;

  // Calculate trial days for free_months type
  if (discount.discount_type === "free_months") {
    // Convert months to approximate days
    const trialDays = discount.discount_value * 30;
    return { trialDays, discountCode: discount.code };
  }

  return { trialDays: 0, discountCode: discount.code };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { priceId, customerId, userId, discountCode } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 },
      );
    }

    // Check for trial extension from discount code
    let trialDays = 0;
    if (userId) {
      const discountInfo = await getTrialDaysFromDiscount(userId);
      trialDays = discountInfo.trialDays;

      if (trialDays > 0) {
        console.log(
          `Applying ${trialDays} day trial from discount code ${discountInfo.discountCode}`,
        );
      }
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    };

    // Add trial period if discount code provides free months
    if (trialDays > 0) {
      sessionParams.subscription_data = {
        trial_period_days: trialDays,
      };
    }

    // Attach to existing customer if provided
    if (customerId) {
      sessionParams.customer = customerId;
    } else {
      sessionParams.customer_creation = "always";
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
