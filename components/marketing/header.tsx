"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "./button";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-shadow">
              <span className="text-white font-bold text-sm tracking-tight">
                TS
              </span>
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              TradeSmart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#features"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="/#how-it-works"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group"
            >
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors relative group"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300" />
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" href="/login" size="sm">
              Sign In
            </Button>
            <Button
              href="/login?signup=true"
              size="sm"
              className="shadow-lg shadow-emerald-500/20"
            >
              Start Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 bg-white/95 backdrop-blur-xl rounded-b-2xl">
            <nav className="flex flex-col gap-1">
              <Link
                href="/#features"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors px-3 py-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors px-3 py-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium transition-colors px-3 py-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-gray-100">
                <Button variant="secondary" href="/login" className="w-full">
                  Sign In
                </Button>
                <Button href="/login?signup=true" className="w-full">
                  Start Free
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
