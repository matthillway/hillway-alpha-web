import { Metadata } from "next";
import Link from "next/link";
import { BRAND_CONFIG } from "@/lib/brand-config";

export const metadata: Metadata = {
  title: `Blog - ${BRAND_CONFIG.name}`,
  description:
    "Tips, strategies, and insights for finding profitable opportunities across stocks, crypto, and betting markets.",
};

const posts = [
  {
    slug: "what-is-sports-betting-arbitrage",
    title: "What is Sports Betting Arbitrage? A Complete Guide for 2025",
    excerpt:
      "Learn how arbitrage betting works, why bookmaker odds create guaranteed profit opportunities, and how to get started with arbing in the UK.",
    date: "2025-01-05",
    readTime: "8 min read",
    category: "Betting",
  },
  {
    slug: "crypto-funding-rates-explained",
    title:
      "Crypto Funding Rates Explained: How to Profit from Perpetual Futures",
    excerpt:
      "Discover how funding rates work on crypto exchanges and how traders use them to earn consistent yields through funding rate arbitrage.",
    date: "2025-01-04",
    readTime: "10 min read",
    category: "Crypto",
  },
  {
    slug: "ai-trading-signals-worth-it",
    title: "Are AI Trading Signals Worth It? What to Look For in 2025",
    excerpt:
      "AI-powered trading tools are everywhere, but do they actually work? We break down what makes a good AI signal service and red flags to avoid.",
    date: "2025-01-03",
    readTime: "6 min read",
    category: "AI & Trading",
  },
];

export default function BlogPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-gradient-to-b from-background to-muted/30 px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            TradeSmart Blog
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Tips, strategies, and insights for finding profitable opportunities
            across stocks, crypto, and betting markets.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="px-4 py-20 md:px-6 md:py-28">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group rounded-lg border-2 bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {post.category}
                  </span>
                  <span>{post.readTime}</span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="mt-4 text-xl font-bold transition-colors group-hover:text-primary">
                    {post.title}
                  </h2>
                </Link>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <time className="text-sm text-muted-foreground">
                    {new Date(post.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
