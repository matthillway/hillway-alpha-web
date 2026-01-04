import Link from "next/link";
import { TrendingUp, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | TradeSmart",
  description:
    "Terms of Service for TradeSmart - Multi-asset opportunity scanner",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TradeSmart</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </nav>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-500 mb-8">Last updated: January 2025</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Agreement to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using TradeSmart (&quot;the Service&quot;),
              operated by Matt Fitzgerald (&quot;we&quot;, &quot;us&quot;, or
              &quot;our&quot;), located in Sheffield, United Kingdom, you agree
              to be bound by these Terms of Service. If you do not agree to
              these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 leading-relaxed">
              TradeSmart is a multi-asset opportunity scanner that provides
              information about potential opportunities in betting arbitrage,
              stock momentum, and cryptocurrency markets. The Service includes
              web-based tools, alerts, and analytical features designed to help
              users identify market opportunities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Eligibility
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You must be at least 18 years of age to use this Service. By using
              the Service, you represent and warrant that:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>You are at least 18 years old</li>
              <li>
                You have the legal capacity to enter into a binding agreement
              </li>
              <li>
                You are not prohibited from using the Service under applicable
                laws
              </li>
              <li>
                Betting and trading activities are legal in your jurisdiction
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Account Registration
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features of the Service, you must create an
              account. When registering, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password confidential and secure</li>
              <li>
                Accept responsibility for all activities under your account
              </li>
              <li>
                Notify us immediately of any unauthorized use of your account
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Subscription and Billing
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4">
              <p>
                <strong className="text-gray-900">
                  5.1 Subscription Plans:
                </strong>{" "}
                The Service offers various subscription tiers (Starter, Pro, and
                Enterprise) with different features and pricing. Details of each
                plan are available on our pricing page.
              </p>
              <p>
                <strong className="text-gray-900">5.2 Billing:</strong> Paid
                subscriptions are billed in advance on a monthly basis. Your
                subscription will automatically renew unless cancelled before
                the renewal date.
              </p>
              <p>
                <strong className="text-gray-900">
                  5.3 Payment Processing:
                </strong>{" "}
                Payments are processed securely through Stripe. By subscribing,
                you authorize us to charge your payment method for all fees
                associated with your subscription.
              </p>
              <p>
                <strong className="text-gray-900">5.4 Refunds:</strong> We offer
                a 14-day free trial on the Pro plan. After your trial period or
                after payment, subscriptions are non-refundable. You may cancel
                at any time, and you will retain access until the end of your
                current billing period.
              </p>
              <p>
                <strong className="text-gray-900">5.5 Price Changes:</strong> We
                reserve the right to modify pricing with 30 days&apos; notice.
                Price changes will take effect at the start of your next billing
                cycle.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Acceptable Use
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>
                Use the Service for any illegal purpose or in violation of any
                laws
              </li>
              <li>
                Share your account credentials or allow others to access your
                account
              </li>
              <li>
                Attempt to reverse engineer, decompile, or disassemble the
                Service
              </li>
              <li>
                Use automated systems or software to extract data from the
                Service (scraping)
              </li>
              <li>
                Interfere with or disrupt the integrity or performance of the
                Service
              </li>
              <li>
                Resell, redistribute, or commercially exploit the Service
                without authorization
              </li>
              <li>
                Use the Service to engage in money laundering or fraudulent
                activities
              </li>
              <li>Circumvent any rate limits or access restrictions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The Service and its original content, features, and functionality
              are owned by Matt Fitzgerald and are protected by international
              copyright, trademark, and other intellectual property laws. You
              may not copy, modify, distribute, sell, or lease any part of the
              Service without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Disclaimer of Warranties
            </h2>
            <p className="text-gray-700 leading-relaxed">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
              AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
              IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
              TIMELY, SECURE, OR ERROR-FREE. THE INFORMATION PROVIDED THROUGH
              THE SERVICE IS FOR INFORMATIONAL PURPOSES ONLY AND SHOULD NOT BE
              CONSTRUED AS FINANCIAL, BETTING, OR INVESTMENT ADVICE.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, MATT FITZGERALD SHALL NOT
              BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
              INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE,
              GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR USE
              OR INABILITY TO USE THE SERVICE; (B) ANY UNAUTHORIZED ACCESS TO OR
              USE OF OUR SERVERS; (C) ANY TRADING OR BETTING LOSSES; OR (D) ANY
              ERRORS OR OMISSIONS IN THE CONTENT PROVIDED.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Indemnification
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless Matt Fitzgerald from any
              claims, damages, losses, liabilities, costs, or expenses
              (including legal fees) arising from your use of the Service, your
              violation of these Terms, or your violation of any rights of
              another party.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Termination
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your account and access to the Service
              immediately, without prior notice or liability, for any reason,
              including if you breach these Terms. Upon termination, your right
              to use the Service will immediately cease. All provisions of the
              Terms which by their nature should survive termination shall
              survive.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with
              the laws of England and Wales, without regard to its conflict of
              law provisions. Any disputes arising from these Terms or the
              Service shall be subject to the exclusive jurisdiction of the
              courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time.
              If a revision is material, we will provide at least 30 days&apos;
              notice prior to any new terms taking effect. Your continued use of
              the Service after changes become effective constitutes acceptance
              of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              14. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="mt-4 p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
              <p className="text-gray-700">
                <strong className="text-gray-900">Email:</strong>{" "}
                <a
                  href="mailto:support@tradesmarthub.com"
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  support@tradesmarthub.com
                </a>
              </p>
              <p className="text-gray-700 mt-2">
                <strong className="text-gray-900">Location:</strong> Sheffield,
                United Kingdom
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-600">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-gray-500">
                TradeSmart - Multi-Asset Opportunity Scanner
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/terms" className="text-emerald-600 font-medium">
                Terms
              </Link>
              <Link
                href="/privacy"
                className="hover:text-gray-900 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/disclaimer"
                className="hover:text-gray-900 transition-colors"
              >
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
