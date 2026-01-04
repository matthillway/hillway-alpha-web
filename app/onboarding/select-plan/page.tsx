"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Check, Zap, Trophy, Crown, Loader2, ArrowRight } from "lucide-react";
import { Logo } from "@/components/marketing/logo";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "19",
    icon: Zap,
    features: [
      "Betting arbitrage scanner",
      "3 sports leagues",
      "100 scans/day",
      "Email alerts",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "49",
    icon: Trophy,
    popular: true,
    features: [
      "All Starter features",
      "Stock momentum scanner",
      "Crypto signals",
      "WhatsApp alerts",
      "AI briefings",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "149",
    icon: Crown,
    features: [
      "All Pro features",
      "Unlimited scans",
      "API access",
      "Custom integrations",
      "Dedicated support",
    ],
  },
];

function SelectPlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPlan = searchParams.get("plan");

  const [selectedPlan, setSelectedPlan] = useState(preselectedPlan || "pro");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser({ email: user.email || "" });
    };
    getUser();
  }, [router]);

  const handleSelectPlan = async () => {
    setIsLoading(true);

    try {
      // In production, this would create a Stripe Checkout session
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      if (response.ok) {
        const { url } = await response.json();
        if (url) {
          window.location.href = url;
          return;
        }
      }

      // Fallback: redirect to dashboard
      router.push("/dashboard");
    } catch {
      // Fallback: redirect to dashboard
      router.push("/dashboard");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Logo className="justify-center mb-8" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose your plan
          </h1>
          <p className="text-gray-600">
            Welcome, {user.email}! Select a plan to get started.
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const isSelected = selectedPlan === plan.id;

            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative rounded-2xl border-2 p-6 text-left transition-all ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                      Recommended
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                    <div className="text-sm text-gray-500">
                      £{plan.price}/month
                    </div>
                  </div>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <Check
                        className={`h-4 w-4 ${isSelected ? "text-emerald-600" : "text-gray-400"}`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="h-5 w-5 rounded-full bg-emerald-600 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleSelectPlan}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-4 text-base font-semibold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue to Payment
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          <p className="mt-4 text-sm text-gray-500">
            Pro plan includes a 14-day free trial. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}

function SelectPlanFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
    </div>
  );
}

export default function SelectPlanPage() {
  return (
    <Suspense fallback={<SelectPlanFallback />}>
      <SelectPlanContent />
    </Suspense>
  );
}
