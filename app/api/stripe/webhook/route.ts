import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import type { DiscountCode } from "@/lib/types/discount-codes";

// Lazy-create admin Supabase client to avoid build-time errors
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

// Map Stripe price IDs to subscription tiers
// TODO: Update env vars after creating new prices in Stripe Dashboard:
// STRIPE_PRICE_STARTER, STRIPE_PRICE_PRO, STRIPE_PRICE_UNLIMITED
function getTierFromPriceId(priceId: string): "starter" | "pro" | "unlimited" {
  const priceTierMap: Record<string, "starter" | "pro" | "unlimited"> = {
    [process.env.STRIPE_STARTER_PRICE_ID || process.env.STRIPE_PRICE_STARTER!]:
      "starter",
    [process.env.STRIPE_PRO_PRICE_ID || process.env.STRIPE_PRICE_PRO!]: "pro",
    [process.env.STRIPE_UNLIMITED_PRICE_ID ||
    process.env.STRIPE_PRICE_UNLIMITED!]: "unlimited",
  };
  return priceTierMap[priceId] || "starter";
}

// Get user's applied discount code and calculate trial extension
async function getUserDiscountInfo(
  email: string,
): Promise<{ trialDays: number; discountCode: string | null }> {
  const supabase = getSupabaseAdmin();

  // Get user with their discount code
  const { data: user, error } = await supabase
    .from("users")
    .select("id, discount_code_applied, trial_ends_at")
    .eq("email", email)
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

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  const customerEmail = session.customer_details?.email;

  if (!customerEmail) {
    console.error("No customer email found in checkout session");
    return;
  }

  // Get the subscription to find the price ID
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  const tier = getTierFromPriceId(priceId);

  // Update user in Supabase
  const { error } = await getSupabaseAdmin()
    .from("users")
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      subscription_tier: tier,
      subscription_status: "active",
    })
    .eq("email", customerEmail);

  if (error) {
    console.error("Error updating user after checkout:", error);
    throw error;
  }

  console.log(`User ${customerEmail} upgraded to ${tier}`);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id;
  const tier = getTierFromPriceId(priceId);

  // Update user by customer ID
  const { error } = await getSupabaseAdmin()
    .from("users")
    .update({
      stripe_subscription_id: subscription.id,
      subscription_tier: tier,
      subscription_status: subscription.status,
    })
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error("Error updating user on subscription created:", error);
    throw error;
  }

  console.log(`Subscription created for customer ${customerId}: ${tier}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id;
  const tier = getTierFromPriceId(priceId);

  // Update user subscription details
  const { error } = await getSupabaseAdmin()
    .from("users")
    .update({
      subscription_tier: tier,
      subscription_status: subscription.status,
    })
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error("Error updating user on subscription update:", error);
    throw error;
  }

  console.log(
    `Subscription updated for customer ${customerId}: ${tier} (${subscription.status})`,
  );
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  // Downgrade user to free tier
  const { error } = await getSupabaseAdmin()
    .from("users")
    .update({
      subscription_tier: "free",
      subscription_status: "canceled",
      stripe_subscription_id: null,
    })
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error("Error updating user on subscription deleted:", error);
    throw error;
  }

  console.log(
    `Subscription canceled for customer ${customerId}, downgraded to free`,
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature");

    if (!sig) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`Webhook signature verification failed: ${message}`);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${message}` },
        { status: 400 },
      );
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription,
        );
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
