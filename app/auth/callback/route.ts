import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

// Lazy-create admin Supabase client for discount code operations
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

// Apply discount code to user
async function applyDiscountCodeToUser(
  userId: string,
  discountCode: string,
  tier?: string,
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/discount-codes/apply`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: discountCode,
          user_id: userId,
          tier: tier || undefined,
        }),
      },
    );

    const result = await response.json();

    if (result.success) {
      console.log(
        `Discount code ${discountCode} applied to user ${userId}:`,
        result.discount_applied,
      );
      return { success: true, ...result };
    } else {
      console.warn(
        `Failed to apply discount code ${discountCode}:`,
        result.error,
      );
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error("Error applying discount code:", error);
    return { success: false, error: "Failed to apply discount code" };
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const plan = searchParams.get("plan");
  const discountCode = searchParams.get("discount_code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      },
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check if this is a new user (created within the last minute)
      const createdAt = new Date(data.user.created_at);
      const now = new Date();
      const isNewUser = now.getTime() - createdAt.getTime() < 60000; // 1 minute

      // Apply discount code if provided (for new users)
      if (isNewUser && discountCode) {
        const discountResult = await applyDiscountCodeToUser(
          data.user.id,
          discountCode,
          plan || undefined,
        );

        // If discount gives free months/forever, skip to dashboard
        if (
          discountResult.success &&
          discountResult.discount_applied &&
          (discountResult.discount_applied.type === "free_months" ||
            discountResult.discount_applied.type === "free_forever")
        ) {
          return NextResponse.redirect(
            `${origin}/dashboard?welcome=true&discount=applied`,
          );
        }
      }

      if (isNewUser && plan) {
        // New user with a selected plan - redirect to onboarding
        const onboardingUrl = new URL(
          `${origin}/onboarding/select-plan?plan=${plan}`,
        );
        if (discountCode) {
          onboardingUrl.searchParams.set("discount_code", discountCode);
        }
        return NextResponse.redirect(onboardingUrl.toString());
      }

      // Existing user or no plan - redirect to dashboard
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
