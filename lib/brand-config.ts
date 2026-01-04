export const BRAND_CONFIG = {
  name: "TradeSmart",
  tagline: "Find Your Edge Across Markets",
  description:
    "AI-powered scanner that finds profitable opportunities across stocks, crypto, and betting markets.",
  website: "tradesmarthub.com",
  websiteUrl: "https://tradesmarthub.com",
  company: "Hillway.ai",
  companyUrl: "https://hillway.ai",
  supportEmail: "support@tradesmarthub.com",
  salesEmail: "sales@tradesmarthub.com",
  colors: {
    primary: "#16A34A",
    accent: "#15803D",
    accentDark: "#166534",
  },
  social: {
    twitter: "https://twitter.com/tradesmarthub",
  },
} as const;

export type BrandConfig = typeof BRAND_CONFIG;
