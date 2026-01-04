# Hillway Alpha Project Consolidation

## Current State Analysis

### The "Project Mess" Explained

| Project | Purpose | Location | Vercel URL | GitHub |
|---------|---------|----------|------------|--------|
| **hillway-alpha** | Backend scanner engine + Vercel cron jobs | `/Users/matt/Projects/hillway-alpha` | hillway-alpha.vercel.app | matthillway/hillway-alpha |
| **hillway-alpha-web** | Marketing site + SaaS frontend | `/Users/matt/Projects/hillway-alpha-web` | **tradesmarthub.com** (+ hillway-alpha-web.vercel.app) | matthillway/hillway-alpha-web |
| **tradesmarthub** | Just a domain name | N/A | Served by hillway-alpha-web | No repo (not needed) |

**Key Insight:** There is NO separate tradesmarthub project. The domain `tradesmarthub.com` is already pointed at `hillway-alpha-web` on Vercel. Everything is correctly configured.

---

## Architecture (Current - Keep This)

```
┌─────────────────────────────────────────────────────────────┐
│                      tradesmarthub.com                       │
│                    (Vercel Domain Alias)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   hillway-alpha-web                          │
│              Next.js 15 Marketing + SaaS App                 │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ (marketing) │  │    auth/    │  │  dashboard/ │         │
│  │  Landing    │  │   Login     │  │  Protected  │         │
│  │  Pricing    │  │   Signup    │  │    Area     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    /api/*                            │    │
│  │   Stripe webhooks, CRUD endpoints, Scanner trigger   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  Cron Jobs (vercel.json)             │    │
│  │   /api/cron/morning-scan (7am daily)                 │    │
│  │   /api/cron/arbitrage (every 15min, 10am-10pm)       │    │
│  │   /api/cron/daily-review (11pm daily)                │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase                                │
│          Project: wlkxzlyxizkajlkureka                       │
│                                                              │
│   Tables: opportunities, positions, briefings,               │
│           user_subscriptions, metrics, etc.                  │
└─────────────────────────────────────────────────────────────┘
```

---

## What About hillway-alpha (Backend)?

The `/Users/matt/Projects/hillway-alpha` project was the **original CLI scanner**. Most of its scanner logic has been **consolidated into hillway-alpha-web** (see recent commits mentioning "consolidate scanner code").

### hillway-alpha Status

**Can probably be archived.** The cron jobs and API routes now live in hillway-alpha-web.

However, keep it if:
- You still use the CLI locally (`npm run scan`, `npm run briefing`)
- There are unique features not yet ported to the web version

### Recommended Action

1. Check if hillway-alpha CLI is still being used
2. If not, archive the repo on GitHub
3. If yes, keep it as a "local development tool" but don't deploy it

---

## Hosting Situation

### Current Setup (Correct)

| Service | Purpose | Status |
|---------|---------|--------|
| **Vercel** | Hosts hillway-alpha-web | ✅ Active |
| **tradesmarthub.com domain** | Custom domain pointing to Vercel | ✅ Configured |
| **Wix** | NOT USED - ignore this | ⚠️ Check if you're paying for it |

### Domain Configuration (Already Done)

The Vercel project `hillway-alpha-web` has these domains configured:
- `tradesmarthub.com` (primary)
- `www.tradesmarthub.com` (www redirect)
- `hillway-alpha-web.vercel.app` (default Vercel subdomain)

**You don't need Wix.** If tradesmarthub.com was registered there, just ensure DNS points to Vercel. If you're paying Wix monthly for hosting, cancel it.

---

## Recommended Consolidation Steps

### Immediate Actions

1. **Rebuild the marketing site** - Use the REBUILD_PROMPT.md in this folder
2. **Don't create new projects** - Work within hillway-alpha-web only
3. **Archive hillway-alpha if unused** - Keep codebase clean

### Check Wix

1. Log into Wix account
2. Check if tradesmarthub.com was registered there
3. If so, ensure DNS is pointing to Vercel:
   - A record: 76.76.21.21
   - CNAME for www: cname.vercel-dns.com
4. Cancel any Wix hosting subscription (you don't need it)

### Git Hygiene

```bash
# In hillway-alpha-web
git status
git add .
git commit -m "Rebuild marketing site - delete old pages"
git push origin main
```

---

## Final Structure (Target)

```
/Users/matt/Projects/
├── hillway-alpha/              # ARCHIVE (or keep for CLI if used)
├── hillway-alpha-web/          # MAIN PROJECT - all development here
│   ├── app/(marketing)/        # Rebuilt landing page
│   ├── app/api/                # Cron jobs + endpoints
│   ├── app/dashboard/          # User app (after login)
│   └── ...
├── spotter/                    # Reference template (keep)
└── servcharge-smart-budgets/   # Reference template (keep)
```

---

## Summary

| Issue | Resolution |
|-------|------------|
| "Multiple projects" | Only hillway-alpha-web matters for TradeSmart |
| "tradesmarthub project missing" | It's not a project - it's a domain alias |
| "Wix vs Vercel confusion" | Use Vercel only. Check if Wix needs DNS update or cancellation |
| "Poor marketing site" | Rebuild using REBUILD_PROMPT.md |
| "hillway-alpha purpose" | Legacy CLI - archive if not used |

**Bottom line:** Your architecture is correct. The only problem is the marketing page design quality. Rebuild it using the Spotter/ServCharge templates and you're done.
