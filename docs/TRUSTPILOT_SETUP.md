# Trustpilot Setup Guide for TradeSmart

## Overview

Trustpilot is essential for building credibility. As a new SaaS, getting verified reviews early helps conversion rates significantly.

## Step 1: Create Business Account

1. Go to https://business.trustpilot.com/signup
2. Sign up with:
   - Business Name: **TradeSmart** (or Hillway.ai)
   - Website: **tradesmarthub.com**
   - Business Email: **support@tradesmarthub.com**
   - Category: **Financial Services** > **Investment Services** or **Software Company**
   - Country: **United Kingdom**

## Step 2: Verify Domain

1. Trustpilot will ask you to verify ownership of tradesmarthub.com
2. Options:
   - **DNS TXT record** (recommended) - Add to Vercel DNS
   - **Meta tag** - Add to `<head>` in layout
   - **HTML file upload** - Upload to public folder

### DNS Verification (Recommended)

Add TXT record in Vercel:

- Go to Vercel Dashboard > tradesmarthub.com > Settings > Domains > DNS Records
- Add TXT record with value Trustpilot provides

## Step 3: Configure Profile

1. **Logo**: Upload TradeSmart logo (use green scanner icon)
2. **Description**:
   ```
   TradeSmart is an AI-powered opportunity scanner that helps traders find profitable opportunities across stocks, crypto, and betting markets. Our scanners use machine learning to analyze thousands of data points and surface high-confidence opportunities in real-time.
   ```
3. **Contact Info**: support@tradesmarthub.com
4. **Social Links**: Add Twitter when ready

## Step 4: Enable Review Collection

### Automatic Review Invitations

1. Go to Business Settings > Review Invitations
2. Enable automatic invitations
3. Set timing: **7 days after signup** (gives users time to experience the product)

### Manual Review Link

Get your review link for use in:

- Email signatures
- Post-purchase emails
- Dashboard footer

Link format: `https://www.trustpilot.com/evaluate/tradesmarthub.com`

## Step 5: Add Trustpilot Widget to Website

### TrustBox Widget

1. Go to Trustpilot Business > Integrations > TrustBox Library
2. Choose "Micro Review Count" widget
3. Get the embed code

Add to the marketing page footer or pricing page:

```tsx
// In app/(marketing)/page.tsx or pricing/page.tsx
<Script
  type="text/javascript"
  src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
  async
/>

<div
  className="trustpilot-widget"
  data-locale="en-GB"
  data-template-id="5419b6a8b0d04a076446a9ad"
  data-businessunit-id="YOUR_BUSINESS_UNIT_ID"
  data-style-height="24px"
  data-style-width="100%"
>
  <a href="https://www.trustpilot.com/review/tradesmarthub.com">Trustpilot</a>
</div>
```

## Step 6: Get First Reviews

### Seed Reviews Strategy

1. **Personal network**: Ask 3-5 people who've genuinely used the demo
2. **Beta users**: Email existing users asking for honest feedback
3. **In-app prompt**: Add "Leave a review" link after 7 days of usage

### Review Request Email Template

```
Subject: Quick favor? Share your TradeSmart experience

Hi {name},

You've been using TradeSmart for a week now, and I'd love to hear how it's going.

Would you mind leaving a quick review on Trustpilot? It takes 2 minutes and really helps other traders discover us.

👉 Leave a review: https://www.trustpilot.com/evaluate/tradesmarthub.com

Thanks for being an early user!

Matt
Founder, TradeSmart
```

## Pricing

- **Free Plan**: Basic features, limited invitations
- **Standard Plan**: ~£199/month - More invitations, widgets, analytics
- **Recommendation**: Start with Free, upgrade when you have 20+ reviews

## Timeline

| Day | Action                                         |
| --- | ---------------------------------------------- |
| 1   | Create account, verify domain                  |
| 2-3 | Configure profile, get review link             |
| 7   | Send first review requests to beta users       |
| 14  | Add widget to website once you have 5+ reviews |

## Links

- Trustpilot Business: https://business.trustpilot.com
- TrustBox Library: https://businessapp.b2b.trustpilot.com/trustbox
- Review Guidelines: https://support.trustpilot.com/hc/en-us/articles/223402108
