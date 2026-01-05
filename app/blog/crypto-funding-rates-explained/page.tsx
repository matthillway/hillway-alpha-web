import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Crypto Funding Rates Explained: How to Profit from Perpetual Futures",
  description:
    "Discover how funding rates work on crypto exchanges and how traders use them to earn consistent yields through funding rate arbitrage.",
  openGraph: {
    title:
      "Crypto Funding Rates Explained: How to Profit from Perpetual Futures",
    description:
      "Discover how funding rates work on crypto exchanges and how traders use them to earn consistent yields through funding rate arbitrage.",
    type: "article",
    publishedTime: "2025-01-04",
  },
};

export default function CryptoFundingRatesGuide() {
  return (
    <article className="px-4 py-20 md:px-6 md:py-28">
      <div className="container mx-auto">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/blog" className="hover:text-foreground">
              Blog
            </Link>
            <span>/</span>
            <span>Crypto</span>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Crypto
              </span>
              <span>10 min read</span>
              <time>4 January 2025</time>
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Crypto Funding Rates Explained: How to Profit from Perpetual
              Futures
            </h1>
            <p className="mt-6 text-xl text-muted-foreground">
              Funding rates are one of the most consistent ways to generate
              yield in crypto. Here&apos;s how they work and how traders profit
              from them.
            </p>
          </header>

          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2>What Are Perpetual Futures?</h2>
            <p>
              Perpetual futures (or &quot;perps&quot;) are a type of derivative
              contract that lets you trade crypto with leverage without an
              expiry date. Unlike traditional futures that settle on a specific
              date, perpetual futures can be held indefinitely.
            </p>
            <p>
              To keep the perpetual price aligned with the spot price, exchanges
              use a mechanism called the &quot;funding rate&quot; - a payment
              between long and short traders that occurs every 8 hours.
            </p>

            <h2>How Do Funding Rates Work?</h2>
            <p>
              The funding rate is determined by the difference between the
              perpetual futures price and the spot price:
            </p>
            <ul>
              <li>
                <strong>Positive funding rate:</strong> Perp price &gt; Spot
                price. Longs pay shorts.
              </li>
              <li>
                <strong>Negative funding rate:</strong> Perp price &lt; Spot
                price. Shorts pay longs.
              </li>
            </ul>
            <p>
              Funding rates are expressed as a percentage and typically range
              from -0.1% to +0.3% per 8-hour period. During extreme market
              conditions, they can spike to 1% or higher.
            </p>

            <h2>Funding Rate Arbitrage Strategy</h2>
            <p>
              The most common way to profit from funding rates is through a
              delta-neutral strategy:
            </p>
            <ol>
              <li>
                <strong>Go long on spot:</strong> Buy the crypto on a spot
                exchange.
              </li>
              <li>
                <strong>Go short on perps:</strong> Open a short position on a
                perpetual futures exchange for the same amount.
              </li>
              <li>
                <strong>Collect funding:</strong> When funding is positive, you
                receive payments from longs while your positions offset each
                other.
              </li>
            </ol>
            <p>
              This creates a market-neutral position where price movements
              don&apos;t affect you (the spot gain/loss offsets the perp
              loss/gain), but you still collect the funding rate payments.
            </p>

            <h2>Example Trade</h2>
            <pre className="rounded-lg bg-muted p-4 text-sm">
              {`Position:
- Buy 1 BTC spot at $42,000
- Short 1 BTC perp at $42,000

Funding rate: +0.03% per 8 hours

Daily yield: 0.03% x 3 = 0.09%
Annual yield (APY): 0.09% x 365 = 32.85%

With $42,000 capital:
Daily: $37.80
Monthly: ~$1,134
Annual: ~$13,797`}
            </pre>
            <p>
              Note: These are simplified calculations. Real yields vary based on
              funding rate fluctuations, exchange fees, and capital efficiency.
            </p>

            <h2>Where to Find High Funding Rates</h2>
            <p>
              Funding rates vary across exchanges and assets. Some
              considerations:
            </p>
            <ul>
              <li>
                <strong>Major exchanges:</strong> Binance, Bybit, OKX, and dYdX
                typically have the most liquid perp markets.
              </li>
              <li>
                <strong>Altcoins vs Bitcoin:</strong> Smaller altcoins often
                have higher (and more volatile) funding rates than BTC and ETH.
              </li>
              <li>
                <strong>Market conditions:</strong> Funding rates spike during
                bullish sentiment and can go negative during crashes.
              </li>
            </ul>

            <h2>Risks to Consider</h2>
            <p>
              While funding rate arbitrage is considered low-risk, it&apos;s not
              risk-free:
            </p>
            <ul>
              <li>
                <strong>Liquidation risk:</strong> If you use leverage on your
                perp short, extreme price moves could liquidate your position
                before funding payments offset the loss.
              </li>
              <li>
                <strong>Exchange risk:</strong> Your funds are on exchanges. If
                an exchange fails (like FTX), you could lose your capital.
              </li>
              <li>
                <strong>Negative funding:</strong> During bear markets, funding
                can go negative, meaning you pay instead of receive.
              </li>
              <li>
                <strong>Execution costs:</strong> Trading fees, slippage, and
                funding rate changes can eat into your profits.
              </li>
            </ul>

            <h2>Automating Funding Rate Monitoring</h2>
            <p>
              Manually tracking funding rates across exchanges and assets is
              time-consuming. Tools like TradeSmart monitor funding rates in
              real-time and alert you when opportunities exceed your threshold.
            </p>
            <p>Our crypto scanner tracks:</p>
            <ul>
              <li>Real-time funding rates across major exchanges</li>
              <li>Historical funding rate trends</li>
              <li>APY calculations based on current rates</li>
              <li>Alerts when high-yield opportunities appear</li>
            </ul>

            <h2>Getting Started</h2>
            <p>To start profiting from funding rates:</p>
            <ol>
              <li>Open accounts on at least 2-3 major exchanges</li>
              <li>Ensure you understand perpetual futures mechanics</li>
              <li>Start with a small position to learn the execution flow</li>
              <li>Use monitoring tools to find the best opportunities</li>
              <li>Track your actual yields vs theoretical yields</li>
            </ol>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-xl bg-primary/10 p-8 text-center">
            <h3 className="text-2xl font-bold">
              Track Funding Rates Automatically
            </h3>
            <p className="mt-2 text-muted-foreground">
              TradeSmart monitors crypto funding rates 24/7 and alerts you to
              high-yield opportunities.
            </p>
            <Link
              href="/login?signup=true"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 font-medium text-primary-foreground hover:bg-primary/90"
            >
              Try Free Demo
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
