import { Button } from "@/components/marketing/button";

const tiers = [
  {
    name: "Starter",
    price: "£19",
    description: "Perfect for getting started",
    features: [
      "3 sports markets",
      "100 scans per day",
      "Email alerts",
      "Basic analytics",
    ],
    cta: "Start Free Trial",
    href: "/login?signup=true&plan=starter",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "£49",
    description: "For serious traders and bettors",
    features: [
      "All three markets (stocks, crypto, betting)",
      "1,000 scans per day",
      "Real-time WhatsApp alerts",
      "AI-powered daily briefings",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/login?signup=true&plan=pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "£149",
    description: "For teams and professionals",
    features: [
      "Unlimited scans",
      "API access",
      "Custom integrations",
      "White-label options",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    href: "mailto:sales@tradesmarthub.com",
    highlighted: false,
  },
];

const faqs = [
  {
    question: "What markets do you cover?",
    answer:
      "We scan three markets: stocks (FTSE 100 & S&P 500), cryptocurrencies (major coins on Binance), and betting (UK bookmakers for football and other sports).",
  },
  {
    question: "How do the alerts work?",
    answer:
      "When our AI finds an opportunity that meets your criteria, you'll receive an instant notification via your chosen channel - email, WhatsApp, or both.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! All paid plans include a 7-day free trial. No credit card required to start.",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Start with a free trial. Upgrade when you&apos;re ready for more
            markets and real-time alerts.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`bg-white rounded-2xl p-8 ${
                  tier.highlighted
                    ? "border-2 border-emerald-600 shadow-lg scale-[1.02]"
                    : "border border-gray-200"
                }`}
              >
                {tier.highlighted && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>
                <p className="text-gray-500 mb-4">{tier.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {tier.price}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-gray-600"
                    >
                      <svg
                        className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  href={tier.href}
                  variant={tier.highlighted ? "primary" : "secondary"}
                  className="w-full"
                >
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="bg-white border border-gray-200 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to start scanning?
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto">
            Join traders and bettors who use TradeSmart to find profitable
            opportunities.
          </p>
          <Button href="/login?signup=true" size="lg">
            Start Your Free Trial
          </Button>
        </div>
      </section>
    </>
  );
}
