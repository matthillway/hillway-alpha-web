import { Button } from "@/components/marketing/button";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              About TradeSmart
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              TradeSmart was built by traders for traders. We believe everyone
              should have access to the same analytical tools that professional
              traders use to find their edge.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Our Story
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                We started TradeSmart after spending years manually scanning
                markets for opportunities. Whether it was finding arbitrage in
                betting markets, momentum plays in stocks, or funding rate
                opportunities in crypto - the process was always the same:
                tedious, time-consuming, and error-prone.
              </p>
              <p>
                We built TradeSmart to automate this process. Our AI-powered
                scanners continuously monitor multiple markets, identifying
                opportunities and ranking them by confidence so you can focus on
                executing trades rather than finding them.
              </p>
              <p>
                Today, TradeSmart helps traders and bettors across the UK find
                profitable opportunities across stocks, crypto, and betting
                markets - all from a single dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hillway Attribution */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-muted-foreground mb-4">A product by</p>
          <a
            href="https://hillway.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900 hover:text-emerald-600 transition-colors"
          >
            Hillway.ai
          </a>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Hillway builds AI-powered tools for property professionals and
            traders. We combine deep domain expertise with cutting-edge
            technology.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-emerald-600">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to find your edge?
          </h2>
          <Button
            href="/login?signup=true"
            variant="secondary"
            size="lg"
            className="bg-white text-emerald-600 hover:bg-gray-50 border-0"
          >
            Start Free Today
          </Button>
        </div>
      </section>
    </>
  );
}
