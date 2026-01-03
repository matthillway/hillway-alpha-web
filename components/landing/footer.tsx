import Link from "next/link";
import { TrendingUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">TradeSmart</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-8">
            <Link
              href="/privacy"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/disclaimer"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Disclaimer
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} TradeSmart
          </p>
        </div>
      </div>
    </footer>
  );
}
