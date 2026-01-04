import Link from "next/link";
import { Logo } from "./logo";
import { ArrowUpRight } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Dashboard", href: "/dashboard" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Disclaimer", href: "/disclaimer" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 gap-12 lg:grid-cols-5 lg:gap-8">
            {/* Brand */}
            <div className="col-span-2">
              <Logo size="sm" />
              <p className="mt-6 text-sm text-gray-500 leading-relaxed max-w-sm">
                AI-powered opportunity scanner for betting, stocks, and crypto
                markets. Find alpha across every market.
              </p>
              <div className="mt-8">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Get started free
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Product
              </h3>
              <ul className="mt-6 space-y-4">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Company
              </h3>
              <ul className="mt-6 space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Legal
              </h3>
              <ul className="mt-6 space-y-4">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} TradeSmart. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              A{" "}
              <a
                href="https://hillwayco.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 transition-colors font-medium"
              >
                Hillway
              </a>{" "}
              product
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
