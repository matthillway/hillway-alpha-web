import Link from "next/link";
import { TrendingUp, ArrowLeft, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Risk Disclaimer | TradeSmartHub",
  description:
    "Important risk disclaimers for betting and trading activities on TradeSmartHub",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
              <TrendingUp className="h-5 w-5 text-black" />
            </div>
            <span className="text-xl font-bold text-white">TradeSmartHub</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </nav>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">Risk Disclaimer</h1>
        <p className="text-zinc-400 mb-8">Last updated: January 2025</p>

        {/* Important Warning Banner */}
        <div className="mb-12 p-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-amber-400 mb-2">
                Important Notice
              </h2>
              <p className="text-amber-200/80 leading-relaxed">
                Trading and betting involve substantial risk of loss. You could
                lose some or all of your invested capital. TradeSmartHub
                provides information only and does not constitute financial,
                investment, or betting advice. Please read this entire
                disclaimer before using our service.
              </p>
            </div>
          </div>
        </div>

        <div className="prose prose-invert prose-zinc max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Not Financial Advice
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              TradeSmartHub and all content, tools, and information provided
              through the Service are for
              <strong className="text-white">
                {" "}
                informational and educational purposes only
              </strong>
              . Nothing on this platform constitutes:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-4">
              <li>Financial advice or recommendations</li>
              <li>Investment advice</li>
              <li>Trading advice</li>
              <li>Tax or legal advice</li>
              <li>
                A recommendation to buy, sell, or hold any financial instrument
              </li>
              <li>A recommendation to place any bet or wager</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">
              We are not regulated by the Financial Conduct Authority (FCA) or
              any other financial regulatory body. Matt Fitzgerald is not a
              licensed financial advisor, investment advisor, or betting
              advisor. You should consult with qualified professionals before
              making any financial decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Risk of Loss
            </h2>
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-4">
              <p className="text-red-200/90 font-medium">
                Trading stocks, cryptocurrencies, and placing bets all involve
                substantial risk of loss, including the possibility of losing
                your entire investment or stake.
              </p>
            </div>
            <p className="text-zinc-300 leading-relaxed mb-4">
              You should be aware of and willing to accept the following risks:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
              <li>
                <strong className="text-white">Market Risk:</strong> Market
                prices can move against your position rapidly and unexpectedly
              </li>
              <li>
                <strong className="text-white">Volatility Risk:</strong> Crypto
                and some stocks can experience extreme price volatility
              </li>
              <li>
                <strong className="text-white">Liquidity Risk:</strong> You may
                not be able to exit positions at desired prices
              </li>
              <li>
                <strong className="text-white">Arbitrage Risk:</strong>{" "}
                Odds/prices can change before you execute trades, eliminating
                profit opportunities
              </li>
              <li>
                <strong className="text-white">Execution Risk:</strong>{" "}
                Technical issues may prevent timely trade execution
              </li>
              <li>
                <strong className="text-white">Bookmaker Risk:</strong> Accounts
                may be limited or closed; bets may be voided
              </li>
              <li>
                <strong className="text-white">Regulatory Risk:</strong> Laws
                and regulations may change, affecting your ability to trade or
                bet
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. Past Performance
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              <strong className="text-white">
                Past performance is not indicative of future results.
              </strong>{" "}
              Any examples, statistics, profit figures, or backtested results
              shown on TradeSmartHub are purely illustrative and do not
              guarantee future performance. Historical data may not reflect
              current market conditions, and strategies that worked in the past
              may not work in the future.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. No Guarantees
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              We make no guarantees or warranties regarding:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-4">
              <li>
                The accuracy, completeness, or timeliness of any information
                provided
              </li>
              <li>
                The profitability of any opportunity, strategy, or approach
              </li>
              <li>
                The availability or accuracy of odds, prices, or market data
              </li>
              <li>The performance of our algorithms, scanners, or AI models</li>
              <li>The suitability of the Service for any particular purpose</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">
              While we strive for accuracy, information may be delayed,
              incomplete, or contain errors. You should always verify
              opportunities through primary sources before acting.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Age Restriction
            </h2>
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
              <p className="text-zinc-300 leading-relaxed">
                <strong className="text-white text-lg">
                  You must be at least 18 years of age
                </strong>{" "}
                (or the legal age for gambling and trading in your jurisdiction,
                whichever is higher) to use TradeSmartHub. By using the Service,
                you confirm that you meet these age requirements.
              </p>
            </div>
            <p className="text-zinc-300 leading-relaxed mt-4">
              If you are located in a jurisdiction where online gambling or
              certain trading activities are prohibited, you must not use the
              betting-related features of this Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Responsible Gambling
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              If you choose to engage in betting activities, please gamble
              responsibly:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
              <li>Only bet with money you can afford to lose</li>
              <li>Set strict budgets and time limits</li>
              <li>Never chase losses</li>
              <li>Take regular breaks from gambling</li>
              <li>Be aware of the signs of problem gambling</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">
              If you or someone you know has a gambling problem, please seek
              help from:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <a
                href="https://www.gamcare.org.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <p className="text-white font-medium">GamCare</p>
                <p className="text-zinc-400 text-sm">gamcare.org.uk</p>
              </a>
              <a
                href="https://www.gamstop.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <p className="text-white font-medium">GamStop</p>
                <p className="text-zinc-400 text-sm">gamstop.co.uk</p>
              </a>
              <a
                href="https://www.begambleaware.org"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <p className="text-white font-medium">BeGambleAware</p>
                <p className="text-zinc-400 text-sm">begambleaware.org</p>
              </a>
              <a
                href="https://www.gamblingtherapy.org"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <p className="text-white font-medium">Gambling Therapy</p>
                <p className="text-zinc-400 text-sm">gamblingtherapy.org</p>
              </a>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Third-Party Data and Services
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              TradeSmartHub aggregates data from third-party sources including
              bookmakers, exchanges, and market data providers. We are not
              responsible for:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-4">
              <li>The accuracy or reliability of third-party data</li>
              <li>Delays or outages in third-party services</li>
              <li>Changes to third-party terms, prices, or availability</li>
              <li>
                Actions taken by bookmakers or exchanges (account limitations,
                voided bets, etc.)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              8. Your Responsibility
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              By using TradeSmartHub, you acknowledge and agree that:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
              <li>
                You are solely responsible for your trading and betting
                decisions
              </li>
              <li>
                You will conduct your own research and due diligence before
                acting on any information
              </li>
              <li>
                You understand the risks involved and accept them voluntarily
              </li>
              <li>You will only use funds you can afford to lose</li>
              <li>
                You will comply with all applicable laws and regulations in your
                jurisdiction
              </li>
              <li>
                You will verify that any betting or trading activity is legal in
                your jurisdiction
              </li>
              <li>
                You will not hold TradeSmartHub or Matt Fitzgerald liable for
                any losses
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRADESMARTHUB AND MATT
              FITZGERALD SHALL NOT BE LIABLE FOR ANY TRADING LOSSES, BETTING
              LOSSES, LOST PROFITS, OR ANY OTHER DAMAGES ARISING FROM YOUR USE
              OF THE SERVICE OR RELIANCE ON ANY INFORMATION PROVIDED. THIS
              INCLUDES, WITHOUT LIMITATION, LOSSES RESULTING FROM:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-4">
              <li>Acting on opportunities identified by the Service</li>
              <li>Errors or inaccuracies in data or calculations</li>
              <li>Technical failures or service interruptions</li>
              <li>Changes in market conditions or odds</li>
              <li>Actions by third parties (bookmakers, exchanges, etc.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              10. Jurisdiction-Specific Notices
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              <strong className="text-white">United Kingdom:</strong> Online
              gambling in the UK is regulated by the Gambling Commission.
              TradeSmartHub is not a gambling operator and does not hold a
              Gambling Commission licence. We provide information tools only.
            </p>
            <p className="text-zinc-300 leading-relaxed">
              <strong className="text-white">Other Jurisdictions:</strong> The
              legality of online gambling and certain trading activities varies
              by jurisdiction. It is your responsibility to ensure that your use
              of TradeSmartHub complies with local laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              11. Contact
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              If you have any questions about this disclaimer, please contact
              us:
            </p>
            <div className="mt-4 p-4 rounded-lg bg-zinc-900 border border-zinc-800">
              <p className="text-zinc-300">
                <strong className="text-white">Email:</strong>{" "}
                <a
                  href="mailto:support@tradesmarthub.com"
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  support@tradesmarthub.com
                </a>
              </p>
              <p className="text-zinc-300 mt-2">
                <strong className="text-white">Operator:</strong> Matt
                Fitzgerald
              </p>
              <p className="text-zinc-300 mt-2">
                <strong className="text-white">Location:</strong> Sheffield,
                United Kingdom
              </p>
            </div>
          </section>

          {/* Final Warning */}
          <section className="mt-12 p-6 rounded-xl bg-zinc-900 border border-zinc-800">
            <p className="text-zinc-300 leading-relaxed text-center">
              By using TradeSmartHub, you acknowledge that you have read,
              understood, and agree to this Risk Disclaimer in its entirety. If
              you do not agree with any part of this disclaimer, please do not
              use the Service.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500">
                <TrendingUp className="h-4 w-4 text-black" />
              </div>
              <span className="text-sm text-zinc-400">
                TradeSmartHub - Multi-Asset Opportunity Scanner
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <Link
                href="/terms"
                className="hover:text-zinc-300 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="hover:text-zinc-300 transition-colors"
              >
                Privacy
              </Link>
              <Link href="/disclaimer" className="text-emerald-400">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
