import { Metadata } from "next";
import { BRAND_CONFIG } from "@/lib/brand-config";

export const metadata: Metadata = {
  title: {
    default: `Blog - ${BRAND_CONFIG.name}`,
    template: `%s | ${BRAND_CONFIG.name} Blog`,
  },
  description:
    "Tips, strategies, and insights for finding profitable opportunities across stocks, crypto, and betting markets.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
