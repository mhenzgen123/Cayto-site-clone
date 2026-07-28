# Product Sense: Cayto Group Marketing Site

## What Is This?

A marketing and sales website for **Cayto Group LLC**, a company that builds and runs finance functions for U.S. companies through two service lines: **Dedicated Professionals** (offshore accounting talent embedded on a client's team, managed by the client) and **Managed Accounting** (Cayto's own team runs a client's books end to end on an AI-native platform). Both lines run at roughly half the cost of the onshore equivalent.

The site is the primary digital presence for prospecting and trust-building with two distinct buyers: finance leaders who need more capacity on a team they already run, and owners/operators who have no one leading accounting at all.

---

## Who Uses It?

### Primary Users

- **CFOs, Controllers, and VP Finance** — decision-makers with an existing finance function evaluating offshore staffing to add capacity (Dedicated Professionals)
- **Owners, CEOs, and Operations leads** — companies with no one leading accounting, evaluating an outcome-based service (Managed Accounting)
- **Accounting Department Heads** — managing teams and budgets
- **Finance Teams** — looking for staffing resources and cost-saving opportunities
- **Anyone researching offshore accounting or outsourced bookkeeping** — searching for alternatives to expensive onshore talent

### Secondary Users

- Cayto Group sales team — using the site as a prospecting tool
- Internally — reference for company positioning and messaging

---

## Why Does It Exist?

**Current goal:** Trust and credibility building. The site establishes Cayto Group as a legitimate, professional provider of offshore accounting talent.

**Future goal:** Lead generation. Once the site builds traffic, it will feed prospective customers into an email drip campaign managed by marketing automation.

---

## Scope

### In Scope

- Marketing presence (hero, value proposition, trust signals)
- Company information (about us, mission, values, team)
- Dedicated Professionals overview (what we do, how the vetting process works, what talent tiers we offer)
- Managed Accounting overview (full-cycle bookkeeping through financial statements, AI-enabled delivery, published pricing, the Caytava platform partnership)
- Careers page (employer brand, benefits, job openings for Sri Lanka-based talent)
- Client testimonials and logo social proof
- FAQ and contact page (two Calendly event types, one per service line, plus email contact cards)
- Blog (thought leadership on accounting staffing trends)

### Out of Scope

- CMS integration (content managed directly in Markdown/Astro)
- Multi-language support
- Complex interactivity (single-page apps, heavy JavaScript)
- Massive scale (not planning 1000+ pages)
- Real-time features (no databases, chat, etc.)

---

## Stage

**Active development.** The site is live and being refined based on user feedback and performance. No major architectural changes expected unless the company scales significantly (e.g., hire dedicated content/marketing team → consider CMS).

---

## Brand & Tone

**Professional, trustworthy, approachable.** The audience is CFOs and Controllers — busy, skeptical people evaluating a service that impacts their budget and staffing. The site should:

- Demonstrate expertise and vetting rigor
- Build confidence through client logos and testimonials
- Use clear, jargon-free language
- Avoid gimmicks or flashy design (trust > playfulness)
- Emphasize cost savings, reliability, and process clarity

---

## Success Metrics

- **Trust signals:** Client logos visible, testimonials credible, process transparent
- **Conversion:** Lead capture via contact form / Calendly scheduling
- **Content:** Blog posts drive organic search traffic (future)
- **Performance:** Fast load times, accessible on mobile and desktop

---

## Technical Constraints

- **Static-first:** No server-side rendering; all pages are pre-built HTML
- **Git-based:** Content (Markdown) lives in version control, not a CMS
- **Theme updates:** Theme is a git submodule so upstream updates can be pulled
- **Minimal JavaScript:** Interactive sections only where necessary
- **Cloudflare Pages:** Hosting, previews, and auto-deploy from main branch

---

## Content Pillars

1. **Trust & Credibility:** Client logos, testimonials, 14-day replacement guarantee, 3-month contracts
2. **Cost Savings:** "50%+ annual cost savings" is the headline number
3. **Process Clarity:** 6-step vetting process (Screening → Assessment → Communication → Validation → Verification → Onboarding)
4. **Talent Quality:** Entry, Mid, Senior level professionals with relevant certifications
5. **Security & Compliance:** IT integration, data security, background screening, billing sovereignty
6. **AI-Enabled Delivery:** Automation handles the busywork, humans hold the judgment and the accountability

---

## Users Do Not Know

- How the vetting process actually works in detail (the site explains it at a high level)
- What specific certifications or backgrounds the talent has
- The exact cost structure (discussed during the sales call)
- How long onboarding typically takes
- What integrations are supported

The site's job is to build enough trust that they schedule a discovery call.
