import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1117" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tradesmarthub.com"),
  title: {
    default: "TradeSmart - AI-Powered Multi-Asset Opportunity Scanner",
    template: "%s | TradeSmart",
  },
  description:
    "Find profitable opportunities across betting arbitrage, stock momentum, and crypto funding rates. Get real-time alerts delivered to your phone. Start your free trial today.",
  keywords: [
    "arbitrage",
    "betting arbitrage",
    "stock scanner",
    "crypto trading",
    "funding rates",
    "AI trading",
    "opportunity scanner",
    "market signals",
    "sports betting",
    "value betting",
    "matched betting",
    "trading signals",
    "crypto alerts",
    "stock alerts",
  ],
  authors: [{ name: "TradeSmart", url: "https://tradesmarthub.com" }],
  creator: "TradeSmart",
  publisher: "Hillway.ai",
  formatDetection: {
    email: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://tradesmarthub.com",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://tradesmarthub.com",
    title: "TradeSmart - AI-Powered Multi-Asset Opportunity Scanner",
    description:
      "Find profitable opportunities across betting arbitrage, stock momentum, and crypto funding rates. Get real-time alerts delivered to your phone.",
    siteName: "TradeSmart",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeSmart - AI-Powered Multi-Asset Opportunity Scanner",
    description:
      "Find profitable opportunities across betting arbitrage, stock momentum, and crypto funding rates.",
    creator: "@tradesmarthub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add Google Search Console verification when available
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
