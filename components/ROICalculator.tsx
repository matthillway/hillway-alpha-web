"use client";

import { useState, useMemo } from "react";
import { BRAND_CONFIG } from "@/lib/brand-config";

type OpportunityType =
  | "betting-arbitrage"
  | "value-bets"
  | "crypto-funding"
  | "stock-momentum";

interface OpportunityConfig {
  name: string;
  description: string;
  minImprovement: number;
  maxImprovement: number;
  defaultImprovement: number;
  icon: string;
}

const opportunityTypes: Record<OpportunityType, OpportunityConfig> = {
  "betting-arbitrage": {
    name: "Betting Arbitrage",
    description: "Risk-free profits from odds discrepancies across bookmakers",
    minImprovement: 2,
    maxImprovement: 5,
    defaultImprovement: 3.5,
    icon: "🎯",
  },
  "value-bets": {
    name: "Value Betting",
    description: "Positive expected value bets identified by AI analysis",
    minImprovement: 1,
    maxImprovement: 3,
    defaultImprovement: 2,
    icon: "📊",
  },
  "crypto-funding": {
    name: "Crypto Funding Rates",
    description: "Capture funding rate arbitrage across exchanges",
    minImprovement: 1.5,
    maxImprovement: 4,
    defaultImprovement: 2.5,
    icon: "💰",
  },
  "stock-momentum": {
    name: "Stock Momentum",
    description: "Technical breakouts and momentum signals on equities",
    minImprovement: 0.5,
    maxImprovement: 2.5,
    defaultImprovement: 1.5,
    icon: "📈",
  },
};

const subscriptionCosts = {
  starter: 19,
  pro: 49,
  unlimited: 149,
};

export function ROICalculator() {
  const [monthlyVolume, setMonthlyVolume] = useState<number>(5000);
  const [currentProfit, setCurrentProfit] = useState<number>(3);
  const [opportunityType, setOpportunityType] =
    useState<OpportunityType>("betting-arbitrage");
  const [selectedPlan, setSelectedPlan] = useState<
    "starter" | "pro" | "unlimited"
  >("pro");

  const config = opportunityTypes[opportunityType];
  const subscriptionCost = subscriptionCosts[selectedPlan];

  const calculations = useMemo(() => {
    // Current monthly profit
    const currentMonthlyProfit = (monthlyVolume * currentProfit) / 100;
    const currentAnnualProfit = currentMonthlyProfit * 12;

    // Expected improvement with TradeSmart
    const improvementPercent = config.defaultImprovement;
    const newProfitPercent = currentProfit + improvementPercent;
    const newMonthlyProfit = (monthlyVolume * newProfitPercent) / 100;
    const newAnnualProfit = newMonthlyProfit * 12;

    // Profit increase
    const monthlyProfitIncrease = newMonthlyProfit - currentMonthlyProfit;
    const annualProfitIncrease = monthlyProfitIncrease * 12;

    // ROI on subscription
    const annualSubscriptionCost = subscriptionCost * 12;
    const roi =
      ((annualProfitIncrease - annualSubscriptionCost) /
        annualSubscriptionCost) *
      100;
    const paybackDays =
      monthlyProfitIncrease > 0
        ? Math.ceil((subscriptionCost / monthlyProfitIncrease) * 30)
        : Infinity;

    return {
      currentMonthlyProfit,
      currentAnnualProfit,
      newMonthlyProfit,
      newAnnualProfit,
      monthlyProfitIncrease,
      annualProfitIncrease,
      improvementPercent,
      newProfitPercent,
      annualSubscriptionCost,
      roi,
      paybackDays,
    };
  }, [
    monthlyVolume,
    currentProfit,
    config.defaultImprovement,
    subscriptionCost,
  ]);

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `£${(value / 1000).toFixed(1)}k`;
    }
    return `£${value.toFixed(0)}`;
  };

  return (
    <div className="w-full">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Opportunity Type Selector */}
          <div>
            <label className="mb-3 block text-sm font-medium">
              Opportunity Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(opportunityTypes) as OpportunityType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setOpportunityType(type)}
                    className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                      opportunityType === type
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-2xl">
                      {opportunityTypes[type].icon}
                    </span>
                    <div>
                      <div className="text-sm font-medium">
                        {opportunityTypes[type].name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        +{opportunityTypes[type].minImprovement}-
                        {opportunityTypes[type].maxImprovement}% typical
                      </div>
                    </div>
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Monthly Volume Input */}
          <div>
            <label className="mb-3 block text-sm font-medium">
              Monthly Betting/Trading Volume
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                £
              </span>
              <input
                type="number"
                value={monthlyVolume}
                onChange={(e) =>
                  setMonthlyVolume(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="h-12 w-full rounded-lg border-2 border-border bg-background pl-8 pr-4 text-lg font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                min={0}
                step={500}
              />
            </div>
            <input
              type="range"
              value={monthlyVolume}
              onChange={(e) => setMonthlyVolume(parseInt(e.target.value))}
              min={500}
              max={50000}
              step={500}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>£500</span>
              <span>£50,000</span>
            </div>
          </div>

          {/* Current Profit Input */}
          <div>
            <label className="mb-3 block text-sm font-medium">
              Your Current Monthly Profit Rate
            </label>
            <div className="relative">
              <input
                type="number"
                value={currentProfit}
                onChange={(e) =>
                  setCurrentProfit(Math.max(0, parseFloat(e.target.value) || 0))
                }
                className="h-12 w-full rounded-lg border-2 border-border bg-background pl-4 pr-10 text-lg font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                min={0}
                max={50}
                step={0.5}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                %
              </span>
            </div>
            <input
              type="range"
              value={currentProfit}
              onChange={(e) => setCurrentProfit(parseFloat(e.target.value))}
              min={0}
              max={20}
              step={0.5}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>20%</span>
            </div>
          </div>

          {/* Plan Selector */}
          <div>
            <label className="mb-3 block text-sm font-medium">
              {BRAND_CONFIG.name} Plan
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["starter", "pro", "unlimited"] as const).map((plan) => (
                <button
                  key={plan}
                  onClick={() => setSelectedPlan(plan)}
                  className={`rounded-lg border-2 p-3 text-center transition-all ${
                    selectedPlan === plan
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-sm font-medium capitalize">{plan}</div>
                  <div className="text-lg font-bold">
                    £{subscriptionCosts[plan]}
                    <span className="text-xs font-normal text-muted-foreground">
                      /mo
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="rounded-xl border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 p-6">
          <h3 className="text-xl font-bold">Your Potential ROI</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on {config.name} with typical{" "}
            {calculations.improvementPercent.toFixed(1)}% improvement
          </p>

          <div className="mt-6 space-y-4">
            {/* Current vs New Comparison */}
            <div className="rounded-lg bg-background/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Current Monthly Profit
                </span>
                <span className="font-medium">
                  {formatCurrency(calculations.currentMonthlyProfit)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  With {BRAND_CONFIG.name}
                </span>
                <span className="font-bold text-primary">
                  {formatCurrency(calculations.newMonthlyProfit)}
                </span>
              </div>
              <div className="mt-2 border-t pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Monthly Increase</span>
                  <span className="font-bold text-primary">
                    +{formatCurrency(calculations.monthlyProfitIncrease)}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-background/50 p-4 text-center">
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(calculations.annualProfitIncrease)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Extra Annual Profit
                </div>
              </div>
              <div className="rounded-lg bg-background/50 p-4 text-center">
                <div className="text-3xl font-bold text-primary">
                  {calculations.roi > 0
                    ? `${calculations.roi.toFixed(0)}%`
                    : "N/A"}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  ROI on Subscription
                </div>
              </div>
            </div>

            {/* Payback Period */}
            <div className="rounded-lg bg-background/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Subscription Cost
                </span>
                <span className="font-medium">
                  £{subscriptionCost}/month (£
                  {calculations.annualSubscriptionCost}/year)
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Payback Period
                </span>
                <span className="font-bold text-primary">
                  {calculations.paybackDays < Infinity
                    ? `${calculations.paybackDays} days`
                    : "Increase volume"}
                </span>
              </div>
            </div>

            {/* Net Profit */}
            <div className="rounded-lg border-2 border-primary bg-primary/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">
                  Net Annual Gain After Subscription
                </span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(
                    calculations.annualProfitIncrease -
                      calculations.annualSubscriptionCost,
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="mt-6 text-xs text-muted-foreground">
            * These projections are estimates based on typical performance
            improvements. Past performance does not guarantee future results.
            Individual results may vary based on market conditions, strategy
            execution, and other factors. Always trade responsibly.
          </p>
        </div>
      </div>
    </div>
  );
}
