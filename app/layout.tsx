import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Hillway Alpha - AI-Powered Multi-Asset Opportunity Scanner',
  description:
    'Find profitable opportunities across betting arbitrage, stock momentum, and crypto funding rates. Get real-time alerts delivered to your phone. Start your free trial today.',
  keywords: [
    'arbitrage',
    'betting arbitrage',
    'stock scanner',
    'crypto trading',
    'funding rates',
    'AI trading',
    'opportunity scanner',
    'market signals',
  ],
  authors: [{ name: 'Hillway Property Consultants Ltd' }],
  creator: 'Hillway.ai',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://alpha.hillwayco.uk',
    title: 'Hillway Alpha - AI-Powered Multi-Asset Opportunity Scanner',
    description:
      'Find profitable opportunities across betting arbitrage, stock momentum, and crypto funding rates. Get real-time alerts delivered to your phone.',
    siteName: 'Hillway Alpha',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hillway Alpha - Find Alpha Across Every Market',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hillway Alpha - AI-Powered Multi-Asset Opportunity Scanner',
    description:
      'Find profitable opportunities across betting arbitrage, stock momentum, and crypto funding rates.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-gray-950 text-white`}>
        {children}
      </body>
    </html>
  );
}
