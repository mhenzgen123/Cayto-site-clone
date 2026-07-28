# Architectural Decisions: Cayto Group Site

This document logs major decisions and their rationale. When in doubt about why something is built a certain way, start here.

---

## Decision 1: Use Astro as the Framework

**Decision:** Build on Astro 6.0.2 for static site generation.

**Rationale:**

- Static-first approach: No server needed, incredibly fast, cheap to host
- Markdown-native: Content is code, lives in version control, no CMS overhead
- Theme ecosystem: Mature, well-maintained themes (bigspring-light-astro) available and easy to customize
- Progressive enhancement: Can add React components where interactivity is needed (but default is zero JavaScript)
- Build-time optimizations: Sharp image service, pre-rendering, automatic optimization

**Alternatives considered:**

- Next.js: Over-engineered for a static marketing site. Would add complexity without proportional benefit.
- Hugo/Jekyll: Less flexible component model, harder to customize without rebuilding theme
- Headless CMS (Strapi, Contentful): Extra infrastructure, cost, maintenance burden. Not needed for a small marketing site.
- Plain HTML/CSS: No build system, harder to maintain, no asset optimization

**Trade-offs:**

- ✅ Fast, cheap, simple
- ❌ Not suitable for highly dynamic content (but this is a marketing site, not a SaaS app)
- ❌ No real-time features (not needed)

**Decision date:** Jan 2025 | **Status:** Stable, no changes expected

---

## Decision 2: Manage Theme as Git Submodule

**Decision:** Bigspring theme is a git submodule, not a direct fork or npm package.

**Rationale:**

- **Easy updates:** `git submodule update --remote` pulls latest upstream changes
- **Customization without forking:** Override theme components in `src/` without modifying theme files
- **Version tracking:** Know exactly which theme version is deployed
- **Separation of concerns:** Marketing site code and theme code in separate repos
- **Upstream agility:** If theme author fixes bugs or adds features, we get them cleanly

**Alternatives considered:**

- Fork the theme: Own copy, but painful to merge upstream updates
- npm package: Clean, but themes are rarely published as npm packages; bigspring isn't
- Clone into repo: No version control, can't pull updates easily
- Build custom theme from scratch: Too much work, reinvent the wheel

**Trade-offs:**

- ✅ Clean separation, easy to update
- ✅ Customizations tracked separately
- ❌ Developers unfamiliar with submodules may find setup confusing
- ❌ Need to understand git submodule workflow (add, update, remove)

**How to update:**

```bash
git submodule update --remote
git add theme
git commit -m "chore: update bigspring theme"
git push origin main
```

**Decision date:** Jan 2025 | **Status:** Stable, working well

---

## Decision 3: Dedicated .astro Pages, Not Just Markdown

**Decision:** About Us, Placement Process, Careers, and Contact are `.astro` files with component layouts, not generic markdown pages.

**Rationale:**

- **Visual richness:** Need more control over layout, spacing, and component composition than markdown allows
- **Component reusability:** Use ProcessStep, Cta, card grids, etc. across pages
- **Trust-building:** Professional, well-structured pages build credibility better than plain markdown
- **Future interactivity:** If we add tabs, accordion, forms, they fit naturally in `.astro` files

**Alternatives considered:**

- Pure markdown with [regular].astro catch-all: Too limited for complex layouts
- React SPA: Over-engineered, adds bundle size and complexity
- Static site generator limitations: Would require hacky workarounds

**Trade-offs:**

- ✅ Full control over layout and styling
- ✅ Components work seamlessly
- ❌ Not as easy to edit as markdown (requires understanding Astro syntax)
- ❌ Slightly higher maintenance (more code to review)

**Pattern:**

- Dedicated pages (index, about-us, our-services, careers, contact): `.astro` components
- Generic pages (privacy policy, terms, FAQ): Markdown with `[regular].astro` catch-all
- Blog posts: Markdown with `Post.astro` layout

**Decision date:** Jan 2025 | **Status:** Stable, working well

---

## Decision 4: Cloudflare Pages for Hosting

**Decision:** Deploy to Cloudflare Pages, not Vercel or Netlify.

**Rationale:**

- **Cost:** Free tier sufficient for current traffic, no build minutes limit
- **Git-native deployment:** Push to main → auto-deploy, no external CI/CD needed
- **Preview environments:** PR → automatic shareable preview URL
- **Global CDN:** Edge caching ensures fast delivery worldwide
- **Zero configuration:** Astro auto-detected, minimal setup required
- **GitHub native:** Already using GitHub, no OAuth complexity

**Alternatives considered:**

- Vercel: Excellent, but more opinionated toward Next.js
- Netlify: Solid, but Cloudflare equally capable and more cost-effective
- AWS/GCP: Too much infrastructure for a static site, higher operational overhead
- Self-hosted: Not worth the DevOps burden

**Trade-offs:**

- ✅ Zero cost, fast, simple
- ✅ Auto-deploy and previews
- ❌ Less community content than Vercel/Netlify (but Astro support is solid)
- ❌ If we need serverless functions, might need to reconsider

**Deployment workflow:**

1. Create feature branch
2. Push to GitHub
3. Open PR → Cloudflare auto-builds preview
4. Merge to main → auto-deploy to production

**Decision date:** Jan 2025 | **Status:** Stable, working well

---

## Decision 5: Single Repository, Not Monorepo

**Decision:** All site code in one repo, theme as submodule (not a separate monorepo).

**Rationale:**

- **Small project:** Not enough complexity to justify monorepo overhead
- **Git simplicity:** Single repo, one main branch, straightforward workflow
- **Theme is separate:** Submodule keeps theme code isolated while still being part of the repo
- **Team size:** Solo developer, no need for complex workspace management

**Alternatives considered:**

- Monorepo (Nx, Turborepo): Overkill for this project, adds complexity
- Separate theme repo (no submodule): Painful to track versions and pull updates
- Merged theme code: No ability to update theme independently

**Trade-offs:**

- ✅ Simple git workflow
- ✅ No monorepo tooling overhead
- ❌ Theme updates require submodule understanding (minor issue)

**Decision date:** Jan 2025 | **Status:** Stable, no changes expected

---

## Decision 6: Minimal Client-Side JavaScript

**Decision:** Default to zero JavaScript, add interactivity only where necessary.

**Rationale:**

- **Astro philosophy:** "Ship zero JavaScript by default"
- **Performance:** Less JavaScript = faster page load, better mobile experience
- **Reliability:** Fewer moving parts, fewer bugs
- **Maintenance:** Easier to maintain and update when interactive sections are minimal
- **Marketing site:** Doesn't need complex client-side logic

**Pattern:**

- Navigation, layout, static content: HTML + CSS only
- Interactive sections (tabs, accordions): Minimal JavaScript bound to `astro:page-load`
- Complex state (future): Add React component if needed, not before

**Example (Services page tabs):**

```javascript
document.addEventListener("astro:page-load", () => {
  // Simple tab switching logic
  // No framework, no bundle bloat
});
```

**Alternatives considered:**

- React everywhere: Overkill, adds 42KB+ bundle size
- Vue: Still adds bundle and complexity
- Alpine.js: Lightweight, but not needed yet (vanilla JS is simpler)

**Trade-offs:**

- ✅ Fast, simple, maintainable
- ✅ No hydration issues
- ❌ Complex interactions would be painful to build (but we don't have any)
- ❌ If needs change (e.g., real-time updates), would need to refactor

**When to add a framework:**

- Multiple interactive components with shared state
- Real-time updates needed
- Complex form validation or data handling
- Team needs a formal component library

**Decision date:** Jan 2025 | **Status:** Stable, working well

---

## Decision 7: Tailwind CSS for Styling

**Decision:** Use Tailwind CSS 4.2.1 for all styling.

**Rationale:**

- **Utility-first:** Fast styling without context-switching to CSS files
- **Responsive by default:** Built-in mobile-first breakpoints (sm, md, lg, xl)
- **No naming conflicts:** No need to invent class names or worry about CSS specificity
- **JIT compilation:** Only CSS for utilities actually used is generated
- **Theme consistency:** Custom theme plugin (`tailwind-plugin/tw-theme.mjs`) reads `theme.json` and generates CSS variables — ensures cohesive design

**Alternatives considered:**

- CSS Modules: More overhead, no real benefit for a small site
- BEM/SMACSS: Great for large teams, overkill for solo developer
- CSS-in-JS (styled-components, emotion): Adds runtime overhead, not needed for static site
- Plain CSS: No tooling, harder to maintain at scale

**Trade-offs:**

- ✅ Fast, simple, consistent
- ✅ Responsive design out of the box
- ✅ Easy to customize via theme config
- ❌ Utility-first can be verbose in HTML (mitigated by component abstraction)
- ❌ Learning curve if unfamiliar with Tailwind

**Custom CSS:**

- Custom CSS for components in `src/styles/` (navigation, buttons, cards)
- All custom CSS wrapped in `/* AI-Generated */` comments
- Prefer Tailwind utilities, use custom CSS only for non-standard styles

**Decision date:** Jan 2025 | **Status:** Stable, working well

---

## Decision 8: Button Interaction: Color Change + Shadow, Not Size Scale

**Decision:** Buttons use color-based hover effects and shadow depth, not scaling/size changes.

**Rationale:**

- **Professional tone:** Subtle color + shadow change fits B2B marketing site aesthetic
- **Accessibility:** Color change is less jarring than size change
- **Performance:** Color/shadow transitions are GPU-efficient
- **Visual stability:** No layout shift when hovering (no size change)
- **Depth language:** Shadow at rest (raised) → collapses on hover (pressed) — consistent with a single light source and the site-wide depth system

**Implementation:**

- Primary buttons: Dark blue on hover (`#1f4078`) + primary-tinted shadow collapses (pressed feel)
- Outline buttons: Text/border darken on hover + neutral shadow deepens (lifts feel)
- Smooth CSS transition on both `background-color` and `box-shadow`

**Alternative rejected:**

- ❌ Size scaling (110% scale on hover): Felt too playful/gimmicky for professional audience

**Decision date:** Feb 2025 | **Updated:** Apr 2026 | **Status:** Stable, user validated

---

## Decision 9: No CMS Integration (Yet)

**Decision:** Content is Markdown in git, not in a CMS.

**Rationale:**

- **Simplicity:** Single source of truth (git), no sync issues
- **Team size:** Solo developer, no need for non-technical content editors
- **Low content volume:** ~10 blog posts expected, not 1000+
- **Version control:** Content changes tracked in git with full history
- **Cost:** No CMS licensing or infrastructure cost

**When to reconsider:**

- If company hires dedicated content/marketing person
- If content volume grows to 100+ posts
- If non-technical stakeholders need to edit content without git knowledge

**Future CMS path (if needed):**

- Cloudflare CMS (new, native Astro integration)
- Sanity.io (flexible, Astro support)
- Strapi (self-hosted, open-source)

**Trade-offs:**

- ✅ Simple, cheap, version-controlled
- ✅ Developer-friendly
- ❌ Requires git knowledge to add/edit content
- ❌ Not suitable for large content teams

**Decision date:** Jan 2025 | **Status:** Stable, appropriate for current stage

---

## Decision 10: Mobile-First Responsive Design

**Decision:** Design for mobile first, scale up to desktop (not the reverse).

**Rationale:**

- **Mobile-heavy traffic:** Marketing sites see majority of traffic from mobile/tablet
- **Performance:** Simpler mobile layouts, add complexity for larger screens
- **Accessibility:** Mobile-first forces focus on touch targets and readability
- **Tailwind supports:** Breakpoint system is mobile-first by default

**Implementation:**

- Base styles are for mobile (375px+)
- Add `md:`, `lg:`, `xl:` prefixes for larger screens
- Test on actual mobile devices, not just desktop
- Touch targets at least 44x44px

**Trade-offs:**

- ✅ Better mobile experience
- ✅ Performance-focused
- ❌ Requires testing on mobile devices
- ❌ Some desktop optimizations might feel cramped on mobile

**Decision date:** Jan 2025 | **Status:** Stable, working well

---

## Decision 11: Image Optimization via Sharp

**Decision:** Use Sharp image service for automatic image optimization at build time.

**Rationale:**

- **Automatic compression:** No manual image resizing needed
- **Modern formats:** Auto-converts to WebP, AVIF where supported
- **Responsive images:** Generates multiple sizes for different screens
- **Built-in:** Astro integration, zero configuration beyond enabling
- **Performance:** Dramatically reduces image file sizes

**How it works:**

- Upload original image to `public/images/`
- Sharp processes during `npm run build`
- Optimized versions served to browsers

**Usage:**

- Don't pre-compress; upload originals
- Don't worry about formats; Sharp handles conversion
- Alt text still required for accessibility

**Trade-offs:**

- ✅ Automatic, fast, performant
- ✅ Reduces manual work
- ❌ Can't preview optimized images locally (but build preview shows them)
- ❌ Build times slightly slower due to image processing

**Decision date:** Jan 2025 | **Status:** Stable, working well

---

## Decision 12: No Automated Testing Framework (Yet)

**Decision:** No Jest, Vitest, or Cypress configured; manual testing only.

**Rationale:**

- **Small project:** Limited complexity, manual testing is feasible
- **Static site:** Few interactions to test, most bugs are visual/layout
- **Solo developer:** ROI on test automation is lower
- **Time to market:** Faster to iterate without test setup

**When to add tests:**

- If team grows and needs QA framework
- If interactive features become complex (form validation, state management)
- If business-critical logic is added

**Manual testing process:**

- Local: `npm run dev` → browser testing
- Production build: `npm run build && npm run preview`
- Cloudflare preview: Automatic on every PR

**Decision date:** Jan 2025 | **Status:** Appropriate for current stage

---

## Decision 13: Contact Form Replaced with Email Cards

**Decision:** The contact form was removed entirely; the contact page now displays direct email contact cards and a Calendly embed.

**Rationale:**

- **Form never integrated:** The placeholder form (see original Decision 13) was never wired to a backend
- **Email is sufficient:** Direct `mailto:` links to `info@caytogroup.com` and `careers@caytogroup.com` are simpler and more reliable
- **Calendly remains primary CTA:** Scheduling a call is still the preferred conversion path
- **Lower maintenance:** No backend service, no spam handling, no form validation needed

**Implementation:**

- Contact page (`src/pages/contact.astro`) renders email cards styled as `.feature-card` blocks
- Cards parse the contact info from `src/content/contact/-index.md` frontmatter
- Each card is a clickable `<a>` with `mailto:` href

**Decision date:** Feb 2025 | **Updated:** Apr 2026 | **Status:** Stable, no form integration planned

---

## Decision 14: Calendly Embed Disabled on Localhost

**Decision:** Calendly embed shows placeholder on localhost, lives on production domain only.

**Rationale:**

- **Domain whitelist:** Calendly requires domain whitelist for embed to load
- **Localhost not whitelisted:** Cannot test locally (not in Calendly's allowlist)
- **Production works:** Fully functional at caytogroup.com
- **Placeholder sufficient:** Shows intent, allows layout testing

**Placeholder copy:** "Calendly scheduling embed will appear here once deployed"

**Testing:**

- Local: See placeholder
- Production (caytogroup.com): See live Calendly widget
- Cloudflare preview: Depends on domain whitelist (may not work)

**Decision date:** Feb 2025 | **Status:** Accepted, not a blocker

---

## Decision 15: Image Naming Convention

**Decision:** Descriptive image filenames following pattern `[type]-[specific-description].[ext]`

**Rationale:**

- **Clarity:** Developers and designers know what each image is for
- **Maintainability:** Easier to find and delete unused images
- **SEO:** Descriptive filenames contribute to image alt text generation
- **Organization:** Consistent naming prevents chaos as image library grows

**Pattern:**

```
logo.png                           # Site logo
favicon.png                        # Browser tab icon
hero-homepage.jpg                  # Hero images (page-specific)
client-logo-olukai.png             # Company logos (with company name)
testimonial-john-smith.jpg         # Headshots
trust-badge-14-day-guarantee.jpg   # Guarantee/badge images
```

**Never use:**

- ❌ `image1.png`, `photo.jpg` (too generic)
- ❌ `img_001.png` (unclear purpose)
- ❌ Spaces in filenames (use hyphens instead)

**Decision date:** Feb 2025 | **Status:** Enforced going forward

---

## Decision 16: Removed Wrangler — Cloudflare Pages Native Deployment Only

**Decision:** Wrangler (`wrangler.jsonc`, `wrangler` npm dependency) was removed. Cloudflare Pages handles deployment natively without it.

**Rationale:**

- **Wrangler is for Workers, not Pages:** Wrangler is Cloudflare's CLI for Workers (serverless functions). This is a fully static Astro site deployed to Cloudflare Pages — Wrangler adds no value and created config compatibility issues.
- **Pages deploys automatically:** Merging to `main` triggers Cloudflare Pages build and deploy with zero additional tooling. PRs get preview URLs automatically.
- **Simpler dependency surface:** Removing Wrangler reduces `package.json` complexity and eliminates an unneeded dependency.

**Do not re-add Wrangler** unless the site adds Cloudflare Workers (serverless functions). Pages deployment requires only `npm run build` and a connected GitHub repo.

**Decision date:** Apr 2026 | **Status:** Stable

---

## Decision 17: Navbar Active Link Re-Evaluated on Every Navigation

**Decision:** The active nav link class is set via a script on `astro:page-load`, not via server-rendered Astro props alone.

**Rationale:**

- **`transition:persist` freezes server state:** The `<header>` uses `transition:persist` to prevent logo flash during Astro ClientRouter soft navigations. This keeps the header DOM node alive across page changes — but it also freezes the server-rendered active nav state from the first page visited.
- **`astro:page-load` fires on every navigation:** Unlike `DOMContentLoaded` (which only fires once), `astro:page-load` re-fires after each ClientRouter transition, allowing the script to re-evaluate which link matches `window.location.pathname`.
- **Trailing slash normalization:** The script strips trailing slashes (`/about-us/` → `/about-us`) to match the menu URL format.

**Do not replace this script with server-rendered active state only** — it will appear to work on initial load but break after any in-app navigation. Do not use `DOMContentLoaded` instead of `astro:page-load`.

**Decision date:** Apr 2026 | **Status:** Stable

---

## Decision 18: Monochromatic Tonal Color System

**Decision:** All background tints derive from the same hue as the primary color (~196° blue-teal), varying only in lightness and saturation.

**Rationale:**

- **Coherence:** Backgrounds that share a hue family read as a system, not disconnected colors
- **Predictability:** Adding a new background tier is mechanical — stay on the hue axis, adjust lightness
- **Brand consistency:** Even the darkest text color (`text-dark: #1A2D34`) carries the primary hue — the palette is monochromatic from near-black to near-white
- **Logo alignment:** Hue ~196° (blue-teal) matches the Cayto Group logo better than the prior ~180° (green-teal) from the Stitch spec

**Current palette (all values in `src/config/theme.json`):**
| Token | Hex | Role |
|---|---|---|
| `primary` | `#1A7A94` | CTAs, headlines, accent elements |
| `primary-container` | `#2196B5` | Gradient endpoint for buttons |
| `body` | `#F7F9FA` | Page canvas (slightly blue-tinted off-white) |
| `light` | `#EAF2F5` | Alternating tinted sections |
| `border` | `#C8D8DE` | Ghost borders, dividers |
| `text` | `#4a5568` | Body copy |
| `text-dark` | `#1A2D34` | Headings (near-black with hue baked in) |

**Dot-grid** (`#EEF4F7`) and **ghost borders** (`rgba(26,122,148,0.15)`) also derive from the same hue.

**Decision date:** Apr 2026 | **Updated:** Apr 2026 | **Status:** Stable

---

## Decision 19: Depth System — Ambient Shadows + No-Line Rule

**Decision:** Visual depth is achieved through ambient shadows (`0 0 40px` blur, 0 y-offset) and background color shifts. Explicit `border` lines are avoided for section separation ("no-line rule").

**Rationale:**

- **Ambient > directional:** `0 0 40px` diffuse glow has no implied light source direction — it reads as elevation rather than casting. Directional shadows (with y-offset) feel utilitarian; ambient shadows feel institutional.
- **No-line rule:** Borders used to divide sections create visual clutter. Background color shifts (`bg-body` → `bg-light` → `bg-dot-grid`) define section boundaries without lines.
- **Ghost borders where needed:** When accessibility requires a container edge (tabs, card outlines), use `rgba(26,122,148,0.15)` — 15% opacity, teal-tinted, barely perceptible.
- **Palette integration:** `rgba(25,28,29,0.04–0.08)` ambient shadows use the near-black `on-surface` color at very low opacity — neutral, not teal-tinted (teal tinting reserved for buttons only).

**Shadow classes:**

- `.feature-card` — `0 0 40px rgba(25,28,29,0.04)`, deepens to `0.08` on hover
- `.testimonial-card` — `0 0 40px rgba(25,28,29,0.06)` (slightly stronger, trust-critical)
- `.inset-panel` — `0 0 40px rgba(25,28,29,0.04)`
- Buttons — teal-tinted bloom (`rgba(26,122,148,0.15)`), collapses on hover

**What was removed:** `border-y border-border` on `.bg-dot-grid` sections (replaced by background color differentiation alone).

**Alternative rejected:**

- ❌ Directional shadows (y-offset): Implies single light source, reads as generic/template
- ❌ Solid section borders: Visual clutter, violates no-line rule

**Decision date:** Apr 2026 | **Updated:** Apr 2026 | **Status:** Stable

---

## Decision 20: "Financial Architect" Design System Refresh

**Decision:** Adopted a "Financial Architect" design language (from Google Stitch) as the basis for a visual upgrade. Layout unchanged; colors, typography, shadows, and component styling updated.

**What changed:**

- Typography: Lato → Inter (body/UI) + Newsreader serif (headings)
- Buttons: pill shape → 4px radius, solid fill → 135° gradient, normal case → uppercase with 0.05em tracking
- Shadows: directional → ambient (see Decision 19)
- Nav: solid `bg-white` → glass (`rgba(247,249,250,0.85)` + `backdrop-blur(20px)`)
- Borders: solid `border-border` on cards/accordions/tabs → removed or replaced with ghost borders
- Social icons: `rounded-full` → `rounded-[8px]`

**Rationale:** The prior design (built on the bigspring theme defaults) read as a polished template. The Financial Architect direction pushes toward an editorial, institutional feel appropriate for a B2B service targeting CFOs — authoritative without being stiff.

**What was kept:** All page layouts, section order, component structure, and content. The refresh is purely cosmetic.

**Decision date:** Apr 2026 | **Status:** Stable

---

## Decision 21: Typography — Inter + Newsreader via Direct CSS Import

**Decision:** Body text uses Inter (sans-serif); headings use Newsreader (serif). Newsreader is loaded via a direct `@import` in `main.css`, not via Astro's experimental font provider.

**Rationale:**

- **Newsreader for headings:** Serif with varied stroke weights conveys institutional authority. Tight tracking (`-0.02em`) gives a "printed" feel appropriate for a prestige financial context.
- **Inter for body:** Clean, neutral, highly legible at small sizes. Standard in professional UI.
- **Direct @import bypass:** Astro's built-in font provider (`fontProviders.google()`) threw `FontFamilyNotFound` for Newsreader — the experimental API doesn't reliably support all Google Fonts. Loading via CSS `@import url(...)` is the stable fallback.

**Implementation:**

- `src/config/theme.json` defines only `primary` font (Inter) — drives Astro's `<Font>` component loop
- `src/styles/main.css` loads Newsreader via `@import url(...Google Fonts...)`
- `--font-secondary` CSS variable defined in `:root` in `main.css`
- `@utility font-secondary` defined in `utilities.css` makes `font-secondary` a Tailwind utility

**Do not add `secondary` back to `theme.json`** — it will cause `FontFamilyNotFound` at runtime.

**Decision date:** Apr 2026 | **Status:** Stable

---

## Decision 22: Logo Blend Mode + astro:page-load Repaint Pattern

**Decision:** Client logos in the "Trusted By" section use `mix-blend-mode: multiply` to dissolve baked-in white backgrounds. A `astro:page-load` script in `index.astro` forces a repaint after ClientRouter transitions.

**Rationale:**

- **mix-blend-mode: multiply:** White pixels (1,1,1) multiplied by any background color = that color, making white transparent visually. On white backgrounds (testimonials), white × white = white — no visible change. Zero image editing required.
- **Repaint needed after transitions:** Astro's ClientRouter renders incoming pages inside `::view-transition-new` — an isolated compositing layer with a white/transparent background. `multiply` blends against white inside that layer, making logo boxes visible. After the transition, the browser may cache the wrongly-composited result.
- **astro:page-load fix:** Briefly overrides `mix-blend-mode` to `normal` inline, then removes the override in the next animation frame, forcing the browser to re-composite against the real section background. This is the same `astro:page-load` pattern used for the nav active link (Decision 17) — `DOMContentLoaded` would not work here.

**Watch-out:** If any logo has a dark (non-white) background, `multiply` will darken it rather than remove it. All current logos are on white.

**Decision date:** Apr 2026 | **Status:** Stable

---

## Decision 23: Glass Navigation

**Decision:** The sticky header uses a glass effect (`rgba(247,249,250,0.85)` + `backdrop-filter: blur(20px)`) instead of a solid `bg-white`.

**Rationale:**

- **No-line rule:** Removed the `border-b border-border` that previously separated the nav from page content — replaced with an ambient box-shadow (`0 0 40px rgba(25,28,29,0.05)`)
- **Depth without hardness:** Glass blur signals elevation (the nav floats above content) without a hard visual boundary
- **Brand surface color:** `rgba(247,249,250,...)` matches the `body` surface color token — the nav reads as a continuation of the page, not a separate element

**Watch-out:** `backdrop-filter` requires `-webkit-backdrop-filter` for Safari. Included. Test mobile menu open state — the blur should not clip oddly on overflow.

**Decision date:** Apr 2026 | **Status:** Stable

---

## Decision 24: Pricing Page Removed, Careers Page Added

**Decision:** The dedicated Pricing page (`src/pages/pricing.astro`) was deleted and removed from navigation. A new Careers page (`src/pages/careers.astro`) was added in its place.

**Rationale:**

- **Pricing consolidated:** Pricing information is now handled via direct sales conversations (Calendly) rather than a public page. The old pricing page pushed visitors toward a PDF download and contact form; removing it streamlines the conversion funnel.
- **Careers as employer brand:** Cayto Group is hiring in Sri Lanka and needs a destination for prospective candidates. The Careers page follows the same dedicated `.astro` pattern as other rich pages (hero, two-column layout, benefits grid, job openings).
- **Navigation balance:** "Placement Process" (formerly "Our Services"), "Careers", and "Contact" create a cleaner nav structure than the previous five-item layout.

**Implementation:**

- `src/pages/pricing.astro` deleted entirely
- `src/content/pages/pricing.md` deleted so `/pricing` returns 404
- `src/pages/careers.astro` added as a new dedicated page with hero, Life at Cayto, benefits list, and job openings
- `src/config/menu.json` updated: removed Pricing, added Careers, renamed Our Services → Placement Process
- `public/Cayto-Group-Pricing-Sheet.pdf` deleted

**Decision date:** Apr 2026 | **Status:** Stable

---

## Decision 25: Two Service Lines with a Split Accent Palette

**Decision:** Navy `#000A48` added as a second accent token (`accent`, `accent-container`), reserved for the new Managed Accounting service line. Shared chrome (header, footer, nav active state, body links, blog, contact) stays teal everywhere.

**Rationale:**

- Navy is already an official Cayto brand color, so this is the other half of the existing palette, not a new one.
- The visitor needs to feel that Managed Accounting is a different product without feeling it belongs to a different company — a second accent, not a second brand.

**Alternatives considered:**

- A separate microsite for Managed Accounting — rejected, fragments SEO and brand equity.
- Using teal for both lines — rejected, the visitor cannot tell the two products apart.

**Decision date:** Jul 2026 | **Status:** Stable

---

## Decision 26: `/our-services` Renamed to `/staffing` with a 301

**Decision:** `src/pages/our-services.astro` renamed to `src/pages/staffing.astro`. `/our-services` and `/our-services/` 301 to `/staffing` via `public/_redirects`.

**Rationale:** "Our services" is ambiguous once there are two service lines. The redirect preserves inbound links and search equity from the prior URL.

**Decision date:** Jul 2026 | **Status:** Stable

---

## Decision 27: Managed Accounting Intake via Calendly Custom Questions

**Decision:** Managed Accounting qualification (revenue band, transaction volume, current accounting system, how far behind the books are) is captured through Calendly custom questions on a dedicated event type, not a web form.

**Rationale:** Decision 13 removed the contact form deliberately, and Decision 16 prohibits Wrangler/Workers on this static Pages site. Calendly custom questions collect the needed qualification fields with zero backend.

**Decision date:** Jul 2026 | **Status:** Stable — pending the Managed Accounting Calendly event type being created (see `[VERIFY]` in contact.astro)

---

## Decision 28: Caytava Described as Sister Company and Preferred Platform Partner

**Decision:** Caytava, Inc. is described on this site only as a "sister company" and "preferred platform partner" — never as an affiliate, subsidiary, division, or parent.

**Rationale:** Cayto Group and Caytava are separate legal entities with shared founding and management. Clients contract with Cayto Group for services and subscribe to Caytava directly for the platform. Describing the relationship as affiliation, ownership, or a division would misstate the legal structure.

**Decision date:** Jul 2026 | **Status:** Stable

---

## Summary of Values

This project reflects these core values:

1. **Simplicity over feature completeness** — Astro static site over Next.js with API routes
2. **Minimal JavaScript by default** — Astro philosophy: zero JS unless needed
3. **Content as code** — Markdown in git, not a CMS (for now)
4. **Professional aesthetic** — Trust-building design, not flashy (color change, not scale)
5. **Performance-first** — Static generation, image optimization, edge caching
6. **Easy updates** — Theme as submodule, single-command deploy
7. **Developer experience** — Familiar tools (git, npm, Tailwind, Markdown)

These values guide future decisions. If a decision violates them, it should be questioned.
