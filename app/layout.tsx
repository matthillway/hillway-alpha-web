import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tradesmarthub.com"),
  title: "TradeSmart - AI-Powered Multi-Asset Opportunity Scanner",
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
  ],
  authors: [{ name: "TradeSmart" }],
  creator: "TradeSmart",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://tradesmarthub.com",
    title: "TradeSmart - AI-Powered Multi-Asset Opportunity Scanner",
    description:
      "Find profitable opportunities across betting arbitrage, stock momentum, and crypto funding rates. Get real-time alerts delivered to your phone.",
    siteName: "TradeSmart",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TradeSmart - Find Alpha Across Every Market",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeSmart - AI-Powered Multi-Asset Opportunity Scanner",
    description:
      "Find profitable opportunities across betting arbitrage, stock momentum, and crypto funding rates.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preconnect hints for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-gray-950 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
