# Design Guide: Cayto Group Site

## Design Philosophy

**"Financial Architect" — professional trust-building, not flashy.** The audience is CFOs and Controllers — skeptical decision-makers. Every design choice should reinforce credibility and clarity. The aesthetic targets an editorial, high-caliber feel: authoritative spacing, serif display type, institutional precision.

---

## Visual Direction

### Color Palette

All values live in `src/config/theme.json` — change there to update site-wide.

| Role | Hex | Usage |
|---|---|---|
| `primary` | `#1A7A94` | CTAs, headlines, accent elements, button base |
| `primary-container` | `#2196B5` | Button gradient endpoint |
| `body` bg | `#F7F9FA` | Page canvas (slightly blue-tinted off-white) |
| `dot-grid` bg | `#EEF4F7` | Textured sections (see below) |
| `light` section | `#EAF2F5` | Alternating tinted sections |
| `border` | `#C8D8DE` | Ghost borders, card outlines |
| `text` | `#4a5568` | Body copy |
| `text-dark` | `#1A2D34` | Headings — near-black with primary hue baked in |

**Color theory rationale:** All background tints derive from the same hue as `primary` (~196° blue-teal), varying only in lightness and saturation. This creates a monochromatic tonal family: `#F7F9FA → #EEF4F7 → #EAF2F5`. `text-dark` also carries the hue. The ~196° anchor matches the Cayto logo (see Decision 18).

**Three background levels (top to bottom of visual hierarchy):**
1. `#F7F9FA` — Page canvas / nav glass (near-white with faint tint)
2. `#EEF4F7` — Dot-grid sections (cool off-white, subtly differentiated)
3. `#EAF2F5` — Light sections (noticeably tinted, clear step down)

### Typography

- **Headings: Newsreader** (serif, Google Fonts)
  - Font-weight: 600–700; letter-spacing: -0.02em (tight, "printed" feel)
  - H1: 48–64px, line-height 1.2
  - H2: 32–40px, line-height 1.3
  - H3: 24–28px, line-height 1.4
  - Applied via `font-secondary` utility class; see Decision 21 for loading strategy
- **Body & UI: Inter** (sans-serif, Google Fonts)
  - Font-weight: 400–600; loaded via Astro's font provider
  - 16–18px, line-height 1.6
- **Buttons:** Inter, 0.875rem, uppercase, letter-spacing 0.05em
- **Small Text:** 14px, line-height 1.5

**Tone:** Clear, direct, professional. No marketing jargon. Avoid superlatives ("world-class", "revolutionary").

### Spacing & Layout

- **Container width:** max-w-6xl (1152px) for main content
- **Gutters:** 24px on desktop, 16px on mobile
- **Section padding:** 80px vertical (64px mobile) between major sections
- **Card padding:** 24px inside cards
- **Gap between items:** 16–24px depending on context

**Mobile-first approach:** Design works perfectly on 375px width, scales up gracefully.

---

## Component Design

### Background Texture

Sections use a subtle SVG dot-grid pattern via the `.bg-dot-grid` CSS class (defined in `src/styles/components.css`):
- Background color: `#EEF4F7`
- Dot: 1.5px circle, `#1A7A94` at 7% opacity, 24px grid
- No `border-y` on dot-grid sections — background color shift provides sufficient differentiation (no-line rule, see Decision 19)

**Applied to:** hero sections on all pages, testimonials, even-indexed service sections on homepage, blog listing/post headers.

**Not applied to:** `bg-light` sections (they already have color differentiation).

### Navigation

The header uses a glass effect:
- `background: rgba(247, 249, 250, 0.85)` — matches body surface, 85% opacity
- `backdrop-filter: blur(20px)` — blurs content behind the nav
- Ambient box-shadow (`0 0 40px rgba(25,28,29,0.05)`) replaces the old `border-b`
- See Decision 23

### Depth & Shadow System

Depth is achieved through **ambient shadows** (0 y-offset, 40px blur) and **background color shifts**. No directional shadows. See Decision 19.

**Shadow classes (defined in `src/styles/components.css`):**

| Class | Use case | Shadow |
|---|---|---|
| `.feature-card` | Interactive white cards | `0 0 40px rgba(25,28,29,0.04)` → `0.08` on hover |
| `.testimonial-card` | Testimonial cards (more presence) | `0 0 40px rgba(25,28,29,0.06)` |
| `.inset-panel` | Static bg-light panels | `0 0 40px rgba(25,28,29,0.04)` |

**Tabs and accordions:** No border. Container boundaries defined by `bg-light` fill + ambient shadow. Ghost border (`rgba(26,122,148,0.15)`) used only where accessibility requires a visible edge (tab nav row).

**Buttons:** Teal-tinted bloom (`rgba(26,122,148,0.15)`) at rest — tinting is appropriate since the button itself is teal. Collapses on hover (pressed feel).

### Buttons

**Primary (`.btn-primary`)**
- Background: `linear-gradient(135deg, #1A7A94, #2196B5)`
- Hover: Gradient deepens (`#125A6E → #1A7A94`), shadow collapses
- Border-radius: 4px (sharp, institutional — not pill-shaped)
- Text: uppercase, `font-size: 0.875rem`, `letter-spacing: 0.05em`

**Outline (`.btn-outline-primary`)**
- Border: `1px solid rgba(26,122,148,0.30)` ghost border
- Hover: border and text transition to solid primary, ambient shadow deepens

**Rule:** No size scaling on hover. No border-radius above 8px anywhere in the system. See Decisions 8 and 20.

### Cards & Sections

- **Interactive white cards** (`.feature-card`): ambient shadow, deepens on hover
- **Testimonial cards** (`.testimonial-card`): stronger ambient shadow + `border-t-4 border-primary`
- **bg-light panels** (`.inset-panel`): ambient shadow defines edges
- **Ghost borders** (`rgba(26,122,148,0.15)`): used on `.card` and `.tab-nav` — teal-tinted at 15% opacity, barely perceptible

### Trust Signals & Badges

- **Stat bars:** Large numbers (48px+) with supporting text (16px)
  - Format: "50%+" in primary blue, supporting text below in gray
- **Logo strips:** Monochrome client logos (grayscale filter, 40% opacity, hover: 100%)
  - Logo width: 120–140px on desktop, 80–100px on mobile
  - Smooth opacity transition on hover
- **Testimonial cards:** Border-left in primary blue (4–6px), company name and logo in card footer
- **Trust badges:** 3-column grid showing guarantees (14-day, 3-month, 65%+ savings)

### Process / Step Indicators

- **ProcessStep component:** Numbered steps with titles and descriptions
- **Visual:** Ghost number (large, faded primary at 10% opacity) in top-right corner only — no bubble badge
- **Layout:** Grid (2–3 columns) for 6-step process
- **Icon option:** Available but minimal — prefer text clarity

### Hero Sections

- **Headline + subheadline** above fold
- **Hero stat** (large number with context)
- **CTA button** visible above fold
- **Background:** Solid color (light) or subtle gradient, no photos
- **No hero video or animation** — static, fast-loading

---

## Page-Specific Design Notes

### Homepage
- Stat bar with 3 trust signals
- Trusted By logo strip with ~13 client logos
- Testimonials on white background with company logos
- Clean sections separated by light blue backgrounds
- No irrelevant images (workflow section removed)

### About Us
- Hero with company stat or mission statement
- Values grid (4 cards)
- Vetting process checklist (6 items, 2-column grid)
- No stretched or awkwardly-sized images

### Placement Process (formerly Services)
- No hero; selection process is the hero section
- 6-step process grid (ProcessStep components, no bubble numbers)
- Talent tier tabs (Tier 1, Tier 2, Tier 3) — interactive, uses astro:page-load event
- Skill sets list (bullet points)
- Security & compliance cards (2-column grid, moved to About Us)
- Icon + text, professional styling

### Careers
- Hero with company mission statement
- Life at Cayto — two-column layout with team photo placeholder
- Benefits grid (10 items in 2-column list inside inset panel)
- Job openings list (Accounting Manager, Senior Accountant, Staff Accountant, AR/AP Specialist, Financial Analyst)
- Shared CTA

### Contact
- Calendly scheduling embed (placeholder on localhost, live on production domain)
- "Reach Out Directly" email contact cards (no form)
- Contact info parsed from `src/content/contact/-index.md`
- Trust badges (14-day, 3-month guarantees)

---

## Accessibility

- **Color contrast:** All text meets WCAG AA standards (7:1 for body, 4.5:1 for large text)
- **Mobile:** All interactive elements at least 44×44px touch target
- **Images:** Descriptive alt text, especially for client logos
- **Forms:** Labels clearly associated with inputs
- **Semantic HTML:** Proper heading hierarchy, nav structure

---

## What Not To Do

- ❌ Don't scale buttons on hover (looks gimmicky for B2B)
- ❌ Don't use heavy animations or transitions
- ❌ Don't stretch images (use object-fit: cover with proper aspect ratios)
- ❌ Don't place random images in sections (every image needs context)
- ❌ Don't use more than 2–3 fonts
- ❌ Don't use jargon or superlatives ("revolutionize", "cutting-edge")
- ❌ Don't hide important info behind modals or reveal animations
- ❌ Don't auto-play video or audio
- ❌ Don't make CTAs subtle (they should be obvious)

---

## Design System

All design follows the Bigspring theme, customized for Cayto Group branding:
- **Typography:** Inter (body/UI, loaded via Google Fonts) + Newsreader (headings, serif, loaded via CSS @import)
- **Colors:** Primary blue-teal (#1A7A94) + professional grays
- **Spacing:** 8px base unit (Tailwind default)
- **Components:** Tailwind utility classes + custom CSS for buttons/cards
- **Responsiveness:** Tailwind breakpoints (sm, md, lg, xl)

CSS is organized as:
- `styles/navigation.css` — Nav/header styling
- `styles/buttons.css` — Button states and interactions
- `styles/components.css` — Card, section, and utility styles

All new styles should use Tailwind utilities first, then custom CSS if needed. Wrap custom CSS in `/* AI-Generated */` comments.
