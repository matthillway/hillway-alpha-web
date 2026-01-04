# TradeSmart Marketing Site Rebuild Prompt

## BACKGROUND CONTEXT

You are rebuilding the marketing website for **TradeSmart** (tradesmarthub.com) - an AI-powered multi-asset opportunity scanner.

**Current Problem:** The existing marketing site is a generic, cramped SaaS template that:
- Lacks visual hierarchy and polish
- Has weak typography and cramped sections
- Looks like a cheap template with text swapped in
- Does not flow correctly or feel premium

**Target Quality:** Match the quality of these proven sites:
- **Spotter** (https://spotter-xi.vercel.app/) - Next.js 16, Tailwind v4, Shadcn/ui
- **ServCharge** (https://servcharge.uk) - Vite/React, Tailwind 3, Shadcn/ui

Both are premium B2B SaaS marketing sites with excellent flow, typography, and visual appeal.

---

## PROJECT ARCHITECTURE

**Keep these unchanged:**
- `/app/api/*` - All API endpoints (Stripe, cron jobs, CRUD operations)
- `/app/auth/*` - Authentication routes (login, signup)
- `/app/dashboard/*` - Protected user dashboard
- `/lib/*` - Supabase client, Stripe integration, utilities
- `/components/ui/*` - Keep existing Shadcn components
- `vercel.json` - Cron job configuration
- Environment variables and database connections

**Completely rebuild:**
- `/app/(marketing)/page.tsx` - Landing page (DELETE and recreate)
- `/app/(marketing)/pricing/page.tsx` - Pricing page
- `/app/(marketing)/layout.tsx` - Marketing layout (header/footer)
- `/app/globals.css` - Theme variables and styling

---

## WORKFLOW METHODOLOGY

### Default Workflow: Explore -> Plan -> Code -> Commit

1. **EXPLORE**: Read the Spotter and ServCharge codebases first
2. **PLAN**: Design the section structure before coding
3. **CODE**: Implement one section at a time, verify with screenshots
4. **COMMIT**: Push after each working section

### Thinking Triggers

Use these to increase reasoning depth:
- `"think"` - Basic reasoning
- `"think hard"` - Deeper analysis
- `"ultrathink"` - Maximum depth for design decisions

**Use `ultrathink` before:**
- Designing the hero section layout
- Choosing the color palette and gradients
- Planning the section flow and visual hierarchy

### Ralph-Wiggum Loops for This Project

```bash
# Phase 1: Delete old marketing pages and create new layout
/ralph-loop "Delete the current (marketing) pages. Create new marketing layout with premium header/footer matching Spotter's design. Output <promise>LAYOUT-DONE</promise> when complete." --max-iterations 15

# Phase 2: Build hero section
/ralph-loop "Create a premium hero section with: gradient background, animated badge, powerful headline, subheading, dual CTA buttons, decorative blur effects. Match Spotter's visual quality. Take screenshot to verify. Output <promise>HERO-DONE</promise> when complete." --max-iterations 15

# Phase 3: Build feature sections
/ralph-loop "Create: stats bar, problem/solution section, how-it-works steps, feature grid (6 cards), testimonials. Each with proper spacing and animations. Output <promise>FEATURES-DONE</promise> when complete." --max-iterations 20

# Phase 4: Build pricing page
/ralph-loop "Create premium pricing page with 4 tiers (Free, Starter £19, Pro £49, Enterprise £149), FAQ accordion, and CTA sections. Output <promise>PRICING-DONE</promise> when complete." --max-iterations 15

# Phase 5: Polish and verify
/ralph-loop "Take full-page screenshots, verify responsive design at mobile/tablet/desktop breakpoints, fix any visual issues. Output <promise>POLISH-DONE</promise> when complete." --max-iterations 10
```

---

## DESIGN SPECIFICATION

### Color Palette (Match Spotter)

Use OKLCH color space for modern color handling:

```css
/* Light Mode */
--background: oklch(1 0 0);           /* Pure white */
--foreground: oklch(0.145 0 0);       /* Near black */
--primary: oklch(0.205 0 0);          /* Dark primary */
--primary-foreground: oklch(0.985 0 0);
--muted: oklch(0.97 0 0);             /* Very light gray */
--muted-foreground: oklch(0.556 0 0); /* Medium gray */
--accent: oklch(0.6 0.2 260);         /* Blue-purple accent */
--border: oklch(0.922 0 0);

/* Dark Mode */
--background: oklch(0.145 0 0);
--foreground: oklch(0.985 0 0);
/* ... inverse of light mode */
```

**Brand Color:** Keep the blue-to-purple gradient theme but make it more subtle and premium.

### Typography

- **Headlines:** `text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl`
- **Subheadings:** `text-lg md:text-xl text-muted-foreground`
- **Body:** `text-sm text-muted-foreground`
- **Font:** Inter (system fallback)

### Spacing

- **Section padding:** `py-20 md:py-28 px-4 md:px-6`
- **Content gaps:** `gap-6` (small), `gap-8` (medium), `gap-12` (large)
- **Container:** `container mx-auto max-w-6xl`

### Responsive Breakpoints

- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px

---

## LANDING PAGE STRUCTURE

Follow this exact section order:

### 1. Header (Sticky)
```jsx
<header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
  <div className="container h-16 flex items-center justify-between">
    {/* Logo */}
    {/* Nav: Features, Pricing, About */}
    {/* CTAs: Login, Get Started */}
  </div>
</header>
```

### 2. Hero Section
- Gradient background (`bg-gradient-to-b from-background to-muted/30`)
- Animated badge (e.g., "Powered by Claude AI")
- Large headline with line breaks for impact
- Descriptive subheading
- Two CTA buttons (primary + outline)
- Decorative blur circle behind content

### 3. Stats Bar
- Border top/bottom with muted background
- 4 stats in 2x2 grid (mobile) or 4-column (desktop)
- Large numbers + small labels
- Example: "3 Markets", "Real-time Scanning", "AI-Powered", "24/7 Alerts"

### 4. Problem/Solution Section
- Two-column layout (stacked on mobile)
- "Before" column with pain points (red X icons)
- "After" column with benefits (green checkmarks)
- Clear contrast between the two

### 5. How It Works
- 3-4 numbered steps with connecting visual line
- Icon + title + description per step
- Numbered circles (1, 2, 3, 4) with accent color

### 6. Features Grid
- 6 feature cards in 3x2 grid (responsive)
- Icon in accent-colored container
- Title + description
- Hover effect (shadow increase)
- Staggered animation on scroll

### 7. Social Proof / Testimonials
- 3 testimonial cards with:
  - 5-star rating
  - Quote text
  - Avatar + name + title
- Responsive grid

### 8. FAQ Section
- Accordion component with 6-8 questions
- Smooth expand/collapse animation
- Common questions about pricing, features, data

### 9. Final CTA Section
- Full-width dark background
- Compelling headline
- Single CTA button
- Optional: "No credit card required" text

### 10. Footer
- 4-column link layout (Product, Company, Legal, Contact)
- Social media icons
- Copyright with current year
- "Built by Hillway.ai"

---

## PRICING PAGE STRUCTURE

### Pricing Header
- Large headline: "Simple, Transparent Pricing"
- Subheading explaining value

### Pricing Cards
```
| Free      | Starter £19/mo | Pro £49/mo      | Enterprise £149/mo |
|-----------|----------------|-----------------|---------------------|
| Demo mode | 3 sports       | All sports      | Unlimited           |
| Sample    | 100 scans/day  | All scanners    | API access          |
| data only | Email alerts   | 1000 scans/day  | White-label         |
|           |                | WhatsApp alerts | Priority support    |
```

- Highlight "Pro" as recommended (popular badge, border accent)
- CTA button per tier
- Free tier: "Try Demo"
- Paid tiers: "Start Free Trial"

### FAQ Accordion
- 7-8 questions about billing, features, cancellation

---

## REFERENCE FILES TO COPY PATTERNS FROM

### Spotter (Next.js 16, Tailwind v4)
```
/Users/matt/Projects/spotter/src/app/(marketing)/page.tsx       # Landing page (434 lines)
/Users/matt/Projects/spotter/src/app/(marketing)/layout.tsx     # Header/footer
/Users/matt/Projects/spotter/src/app/(marketing)/pricing/page.tsx
/Users/matt/Projects/spotter/src/app/globals.css                # Theme variables
/Users/matt/Projects/spotter/src/lib/utils.ts                   # cn() helper
```

### ServCharge (Vite/React, Tailwind 3)
```
/Users/matt/Projects/servcharge-smart-budgets/src/pages/Landing.tsx     # 660 lines
/Users/matt/Projects/servcharge-smart-budgets/src/lib/brand-config.ts   # Centralized branding
/Users/matt/Projects/servcharge-smart-budgets/tailwind.config.ts        # Color config
```

---

## BRAND CONFIGURATION

Create `/lib/brand-config.ts`:

```typescript
export const BRAND_CONFIG = {
  name: "TradeSmart",
  tagline: "Find Your Edge Across Markets",
  description: "AI-powered scanner that finds profitable opportunities across stocks, crypto, and betting markets.",
  website: "tradesmarthub.com",
  websiteUrl: "https://tradesmarthub.com",
  company: "Hillway.ai",
  companyUrl: "https://hillway.ai",
  supportEmail: "support@tradesmarthub.com",
  salesEmail: "sales@tradesmarthub.com",
  colors: {
    primary: "#000000",
    accent: "#3B82F6",      // Blue
    accentDark: "#1D4ED8",
  },
  social: {
    twitter: "https://twitter.com/tradesmarthub",
  },
};
```

---

## QUALITY CHECKLIST

Before marking complete, verify:

- [ ] Hero section has visual impact (gradient, blur effects, animations)
- [ ] All sections have proper vertical rhythm (consistent py-20/py-28)
- [ ] Typography hierarchy is clear (h1 > h2 > h3 > p)
- [ ] Feature cards have hover effects and staggered animations
- [ ] Responsive at all breakpoints (mobile, tablet, desktop)
- [ ] Footer has proper column structure
- [ ] CTAs are prominent and consistently styled
- [ ] Page flows naturally from section to section
- [ ] No cramped or cluttered sections
- [ ] Dark mode works correctly

---

## HOW TO EXECUTE

1. Read Spotter's landing page implementation:
   ```
   Read /Users/matt/Projects/spotter/src/app/(marketing)/page.tsx
   ```

2. Start with Phase 1 Ralph loop to delete old pages and create layout

3. Use `ultrathink` before designing the hero section

4. Take screenshots after each major section to verify quality

5. Run `/code-review` after completing all phases

6. Test responsive design with Playwright screenshots at 375px, 768px, 1440px

---

## BEGIN

Start by reading the Spotter landing page, then execute Phase 1.
