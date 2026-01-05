# Google Search Console Setup Guide for TradeSmart

## Overview

Google Search Console (GSC) is essential for:

- Monitoring search performance
- Submitting sitemaps
- Identifying indexing issues
- Understanding which keywords drive traffic

## Step 1: Access Search Console

1. Go to https://search.google.com/search-console
2. Sign in with Google account (use matt@hillwayco.uk or dedicated TradeSmart Google account)

## Step 2: Add Property

1. Click "Add property"
2. Choose **URL prefix** method
3. Enter: `https://tradesmarthub.com`

## Step 3: Verify Ownership

### Option A: DNS Verification (Recommended for Vercel)

1. GSC will provide a TXT record value
2. Go to Vercel Dashboard > tradesmarthub.com > Settings > Domains > DNS Records
3. Add a TXT record:
   - Name: `@` (or leave blank)
   - Type: `TXT`
   - Value: The verification string from Google (starts with `google-site-verification=`)
4. Wait 5-10 minutes, then click "Verify" in GSC

### Option B: HTML Tag (Alternative)

1. GSC provides a meta tag like:

   ```html
   <meta name="google-site-verification" content="YOUR_CODE" />
   ```

2. Add to `app/layout.tsx`:

   ```tsx
   export const metadata: Metadata = {
     // ... existing metadata
     verification: {
       google: "YOUR_VERIFICATION_CODE",
     },
   };
   ```

3. Deploy and verify

## Step 4: Submit Sitemap

1. In GSC, go to "Sitemaps" in left sidebar
2. Enter sitemap URL: `sitemap.xml`
3. Click "Submit"

Your sitemap is at: `https://tradesmarthub.com/sitemap.xml`

Current pages in sitemap:

- Homepage, Pricing, Features, Guides
- Blog posts (3 articles)
- Compare pages (4 pages)
- ROI Calculator
- Legal pages

## Step 5: Request Indexing

For important pages, request immediate indexing:

1. Go to "URL Inspection" in GSC
2. Enter URL (e.g., `https://tradesmarthub.com/`)
3. Click "Request Indexing"

Priority pages to index first:

1. `https://tradesmarthub.com/` (homepage)
2. `https://tradesmarthub.com/pricing`
3. `https://tradesmarthub.com/features`
4. `https://tradesmarthub.com/blog/what-is-sports-betting-arbitrage`
5. `https://tradesmarthub.com/compare`

## Step 6: Monitor Performance

### Key Metrics to Watch

- **Impressions**: How often you appear in search
- **Clicks**: Actual visits from search
- **CTR**: Click-through rate (aim for 3%+)
- **Position**: Average ranking position

### Performance Filters

Set up these views:

1. **By Query**: See which keywords drive traffic
2. **By Page**: See which pages perform best
3. **By Country**: Confirm UK traffic
4. **By Device**: Mobile vs Desktop split

## Step 7: Set Up Alerts

1. Go to Settings > Email preferences
2. Enable:
   - ✅ Coverage issues
   - ✅ Enhancement issues
   - ✅ Manual actions (critical!)

## Common Issues to Watch For

### Coverage Issues

- **Crawled - currently not indexed**: Page found but not indexed
- **Discovered - currently not indexed**: Known but not crawled
- **Duplicate without canonical**: Duplicate content issue

### Mobile Usability

- Ensure all pages pass mobile-friendly test
- Check Core Web Vitals

## Structured Data (Future Enhancement)

Consider adding JSON-LD structured data for:

### Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "TradeSmart",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "19.00",
    "priceCurrency": "GBP"
  }
}
```

### FAQ Schema (for blog posts)

Helps get rich snippets in search results.

## Timeline

| Day | Action                                |
| --- | ------------------------------------- |
| 1   | Create property, verify ownership     |
| 1   | Submit sitemap                        |
| 2   | Request indexing for top 5 pages      |
| 7   | Check indexing status                 |
| 14  | Review initial performance data       |
| 30  | First meaningful performance analysis |

## Links

- Google Search Console: https://search.google.com/search-console
- URL Inspection API: https://developers.google.com/search/apis/indexing-api/v3/quickstart
- Rich Results Test: https://search.google.com/test/rich-results
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- PageSpeed Insights: https://pagespeed.web.dev/

## Integration with Google Analytics

If not already set up:

1. Create GA4 property for tradesmarthub.com
2. Link GSC to GA4 in GSC Settings > Associations
3. This enables search query data in GA4 reports
