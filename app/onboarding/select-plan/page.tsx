"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PRICING_TIERS } from "@/lib/stripe";
import { Check, ArrowRight, Loader2 } from "lucide-react";

function SelectPlanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedPlan = searchParams.get("plan");
  const discountCode = searchParams.get("discount_code");

  const [selectedPlan, setSelectedPlan] = useState<string | null>(
    preselectedPlan,
  );
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);
    }
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectPlan = async (planKey: string) => {
    if (planKey === "free") {
      router.push("/dashboard?welcome=true");
      return;
    }

    setLoading(true);
    setSelectedPlan(planKey);

    try {
      const plan = PRICING_TIERS[planKey as keyof typeof PRICING_TIERS];
      if (!plan || !plan.priceId) {
        router.push("/dashboard?welcome=true");
        return;
      }

      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId: user?.id,
          discountCode: discountCode,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL received");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      setLoading(false);
    }
  };

  const plans = [
    {
      key: "starter",
      name: "Starter",
      price: "£29",
      period: "/month",
      description: "Perfect for getting started with arbitrage betting",
      features: [
        "100 scans per day",
        "Betting arbitrage scanner",
        "Email alerts",
        "Daily briefings",
      ],
      cta: "Start with Starter",
    },
    {
      key: "pro",
      name: "Pro",
      price: "£79",
      period: "/month",
      description: "Full access to all scanners and premium features",
      features: [
        "500 scans per day",
        "All 3 scanners (Betting, Stocks, Crypto)",
        "WhatsApp + Email alerts",
        "AI-powered insights",
        "Priority support",
      ],
      popular: true,
      cta: "Start with Pro",
    },
    {
      key: "unlimited",
      name: "Unlimited",
      price: "£199",
      period: "/month",
      description: "For serious traders who need everything",
      features: [
        "Unlimited scans",
        "API access",
        "Platform account linking",
        "White-label option",
        "Dedicated support",
      ],
      cta: "Start with Unlimited",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-3">
            Welcome to TradeSmart! 🎉
          </h1>
          <p className="text-gray-400 text-lg">
            Choose a plan to get started. You can change anytime.
          </p>
          {discountCode && (
            <p className="text-emerald-400 mt-2">
              Discount code <span className="font-mono">{discountCode}</span>{" "}
              will be applied
            </p>
          )}
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`relative bg-gray-900 rounded-2xl border-2 p-6 transition-all ${
                selectedPlan === plan.key
                  ? "border-emerald-500 ring-2 ring-emerald-500/20"
                  : plan.popular
                    ? "border-emerald-500/50"
                    : "border-gray-800 hover:border-gray-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {plan.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                <span className="text-gray-400">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.key)}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  plan.popular
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading && selectedPlan === plan.key ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Free Option */}
        <div className="text-center">
          <button
            onClick={() => router.push("/dashboard?welcome=true")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Skip for now and explore free features →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SelectPlanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      }
    >
      <SelectPlanContent />
    </Suspense>
  );
}
