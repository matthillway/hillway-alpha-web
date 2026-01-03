import Link from "next/link";
import { TrendingUp, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | TradeSmartHub",
  description:
    "Privacy Policy for TradeSmartHub - How we collect, use, and protect your data",
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-zinc-400 mb-8">Last updated: January 2025</p>

        <div className="prose prose-invert prose-zinc max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Introduction
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              TradeSmartHub, operated by Matt Fitzgerald (&quot;we&quot;,
              &quot;us&quot;, or &quot;our&quot;), is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our
              multi-asset opportunity scanner service. Please read this policy
              carefully.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-medium text-white mb-3 mt-6">
              2.1 Information You Provide
            </h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
              <li>
                <strong className="text-white">Account Information:</strong>{" "}
                Name, email address, and password when you create an account
              </li>
              <li>
                <strong className="text-white">Payment Information:</strong>{" "}
                Billing address and payment details (processed securely by
                Stripe)
              </li>
              <li>
                <strong className="text-white">Communications:</strong>{" "}
                Information you provide when contacting support or providing
                feedback
              </li>
              <li>
                <strong className="text-white">Preferences:</strong> Your
                notification settings, alert preferences, and dashboard
                configurations
              </li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3 mt-6">
              2.2 Information Collected Automatically
            </h3>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
              <li>
                <strong className="text-white">Usage Data:</strong> Features
                used, pages visited, scan history, and alert interactions
              </li>
              <li>
                <strong className="text-white">Device Information:</strong>{" "}
                Browser type, operating system, device type, and screen
                resolution
              </li>
              <li>
                <strong className="text-white">Log Data:</strong> IP address,
                access times, referring URLs, and error logs
              </li>
              <li>
                <strong className="text-white">Cookies:</strong> Session cookies
                and authentication tokens (see Section 6)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
              <li>Provide, maintain, and improve the Service</li>
              <li>
                Process your subscription payments and manage your account
              </li>
              <li>
                Send you alerts, notifications, and briefings based on your
                preferences
              </li>
              <li>Respond to your comments, questions, and support requests</li>
              <li>
                Analyze usage patterns to improve our algorithms and features
              </li>
              <li>
                Detect, prevent, and address technical issues and security
                threats
              </li>
              <li>
                Comply with legal obligations and enforce our Terms of Service
              </li>
              <li>Send you marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Third-Party Services
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              We use the following third-party services to operate
              TradeSmartHub:
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                <h4 className="text-white font-medium mb-2">Supabase</h4>
                <p className="text-zinc-400 text-sm">
                  Database and authentication services. Your account data and
                  usage information is stored securely on Supabase servers. View
                  their privacy policy at{" "}
                  <a
                    href="https://supabase.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    supabase.com/privacy
                  </a>
                </p>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                <h4 className="text-white font-medium mb-2">Stripe</h4>
                <p className="text-zinc-400 text-sm">
                  Payment processing. Your payment card details are handled
                  directly by Stripe and are never stored on our servers. View
                  their privacy policy at{" "}
                  <a
                    href="https://stripe.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    stripe.com/privacy
                  </a>
                </p>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                <h4 className="text-white font-medium mb-2">Vercel</h4>
                <p className="text-zinc-400 text-sm">
                  Website hosting and deployment. View their privacy policy at{" "}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    vercel.com/legal/privacy-policy
                  </a>
                </p>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                <h4 className="text-white font-medium mb-2">
                  Twilio (WhatsApp Alerts)
                </h4>
                <p className="text-zinc-400 text-sm">
                  If you opt in to WhatsApp alerts, your phone number is shared
                  with Twilio for message delivery. View their privacy policy at{" "}
                  <a
                    href="https://www.twilio.com/legal/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    twilio.com/legal/privacy
                  </a>
                </p>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                <h4 className="text-white font-medium mb-2">Resend (Email)</h4>
                <p className="text-zinc-400 text-sm">
                  Email delivery service for alerts and notifications. View
                  their privacy policy at{" "}
                  <a
                    href="https://resend.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    resend.com/legal/privacy-policy
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Data Retention
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              We retain your personal information for as long as your account is
              active or as needed to provide you services. If you close your
              account, we will delete or anonymize your personal data within 90
              days, except where retention is required for legal, accounting, or
              audit purposes. Anonymized usage data may be retained indefinitely
              for analytics purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Cookies and Tracking
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
              <li>
                <strong className="text-white">Essential Cookies:</strong>{" "}
                Required for authentication and security (cannot be disabled)
              </li>
              <li>
                <strong className="text-white">Functional Cookies:</strong>{" "}
                Remember your preferences and settings
              </li>
              <li>
                <strong className="text-white">Analytics Cookies:</strong> Help
                us understand how you use the Service (with consent)
              </li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">
              You can control cookies through your browser settings. Note that
              disabling essential cookies may prevent you from using the
              Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Data Security
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              We implement appropriate technical and organizational measures to
              protect your personal information, including:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-4">
              <li>Encryption of data in transit (TLS/SSL) and at rest</li>
              <li>
                Secure password hashing using industry-standard algorithms
              </li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls limiting employee access to personal data</li>
              <li>Secure hosting with SOC 2 compliant providers</li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">
              However, no method of transmission over the Internet is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              8. Your Rights (GDPR)
            </h2>
            <p className="text-zinc-300 leading-relaxed mb-4">
              If you are located in the European Economic Area (EEA) or United
              Kingdom, you have the following rights under GDPR:
            </p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
              <li>
                <strong className="text-white">Access:</strong> Request a copy
                of your personal data
              </li>
              <li>
                <strong className="text-white">Rectification:</strong> Request
                correction of inaccurate data
              </li>
              <li>
                <strong className="text-white">Erasure:</strong> Request
                deletion of your personal data
              </li>
              <li>
                <strong className="text-white">Restriction:</strong> Request
                restriction of processing
              </li>
              <li>
                <strong className="text-white">Portability:</strong> Receive
                your data in a structured, machine-readable format
              </li>
              <li>
                <strong className="text-white">Objection:</strong> Object to
                processing based on legitimate interests
              </li>
              <li>
                <strong className="text-white">Withdraw Consent:</strong>{" "}
                Withdraw consent at any time where processing is based on
                consent
              </li>
            </ul>
            <p className="text-zinc-300 leading-relaxed mt-4">
              To exercise these rights, please contact us at{" "}
              <a
                href="mailto:support@tradesmarthub.com"
                className="text-emerald-400 hover:text-emerald-300"
              >
                support@tradesmarthub.com
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              9. International Data Transfers
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              Your information may be transferred to and processed in countries
              other than the UK, including the United States where some of our
              third-party service providers are located. We ensure appropriate
              safeguards are in place, including Standard Contractual Clauses,
              to protect your data in accordance with UK GDPR requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              10. Children&apos;s Privacy
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              TradeSmartHub is not intended for individuals under 18 years of
              age. We do not knowingly collect personal information from
              children under 18. If you become aware that a child has provided
              us with personal information, please contact us, and we will take
              steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              11. Changes to This Policy
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the &quot;Last updated&quot; date. For material
              changes, we will notify you via email or through the Service. Your
              continued use of the Service after changes become effective
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              12. Contact Us
            </h2>
            <p className="text-zinc-300 leading-relaxed">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <div className="mt-4 p-4 rounded-lg bg-zinc-900 border border-zinc-800">
              <p className="text-zinc-300">
                <strong className="text-white">Data Controller:</strong> Matt
                Fitzgerald
              </p>
              <p className="text-zinc-300 mt-2">
                <strong className="text-white">Email:</strong>{" "}
                <a
                  href="mailto:support@tradesmarthub.com"
                  className="text-emerald-400 hover:text-emerald-300"
                >
                  support@tradesmarthub.com
                </a>
              </p>
              <p className="text-zinc-300 mt-2">
                <strong className="text-white">Location:</strong> Sheffield,
                United Kingdom
              </p>
            </div>
            <p className="text-zinc-300 leading-relaxed mt-4">
              You also have the right to lodge a complaint with the UK
              Information Commissioner&apos;s Office (ICO) if you believe your
              data protection rights have been violated.
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
              <Link href="/privacy" className="text-emerald-400">
                Privacy
              </Link>
              <Link
                href="/disclaimer"
                className="hover:text-zinc-300 transition-colors"
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
