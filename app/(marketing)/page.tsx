import { Metadata } from "next";
import {
  Hero,
  Stats,
  ProblemSolution,
  HowItWorks,
  FeaturesGrid,
  Testimonials,
  CTASection,
} from "@/components/marketing";

export const metadata: Metadata = {
  title: "TradeSmart - AI-Powered Multi-Asset Opportunity Scanner",
  description:
    "Find profitable opportunities across betting arbitrage, stock momentum, and crypto signals. Real-time AI alerts delivered to your phone. Start your free trial today.",
  openGraph: {
    title: "TradeSmart - Find Alpha Across Every Market",
    description:
      "Real-time opportunity scanner for betting, stocks, and crypto. AI-powered alerts and daily briefings.",
  },
};

export default function HomePage() {
  return (
    <>
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-md"
      >
        Skip to main content
      </a>

      <div id="main-content">
        <Hero />
        <Stats />
        <ProblemSolution />
        <HowItWorks />
        <FeaturesGrid />
        <Testimonials />
        <CTASection />
      </div>
    </>
  );
}
