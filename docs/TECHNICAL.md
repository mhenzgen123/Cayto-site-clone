# Technical Architecture: Cayto Group Site

## Stack

- **Framework:** Astro 6.3.5 (static site generator)
- **Styling:** Tailwind CSS 4.3.0 (utility-first CSS)
- **Content:** Markdown via Astro Content Collections
- **Image Optimization:** Sharp (automatic at build time)
- **Deployment:** Cloudflare Pages
- **Package Manager:** npm (pnpm legacy support removed)
- **TypeScript:** 6.0.3 (strict mode enabled)

---

## Why These Choices?

### Astro
- Static site generation: Fast, secure, cheap to host
- Markdown-native: Content as code, version-controlled
- Theme ecosystem: Robust, mature themes with easy customization
- Progressive enhancement: Add interactivity only where needed (React components in Astro)
- Build-time optimizations: Sharp image service, pre-rendering, code splitting

**vs. alternatives:**
- ❌ Next.js: Over-engineered for static marketing site (server-side rendering overkill)
- ❌ Hugo/Jekyll: Less flexible component model, harder to customize
- ❌ Headless CMS + frontend: Extra complexity, cost, and maintenance

### Tailwind CSS
- Utility-first: Fast styling without context-switching to new CSS files
- Responsive design: Built-in breakpoints (sm, md, lg, xl) for mobile-first layouts
- JIT compilation: Only generated CSS for utilities actually used

### Cloudflare Pages
- Static hosting: Free tier covers this site's traffic
- Auto-deploy: Merge to main → automatic production deployment
- Preview environments: Create PR → Cloudflare generates shareable preview URL
- Edge caching: Content served globally via CDN
- Git-native: No external CI/CD service needed

**vs. alternatives:**
- ❌ Vercel: Good, but Cloudflare Pages equally capable and more cost-efficient
- ❌ Netlify: Same tier as Vercel, less integrated with theme updates

### Theme as Git Submodule
Bigspring theme is managed as a git submodule in `theme/` (not `themes/`). This allows:
- **Easy updates:** `git submodule update --remote` pulls latest theme changes
- **Customization:** Override theme components in `src/` without modifying theme files
- **Version control:** Track which theme version is deployed
- **Separation:** Keep marketing site code separate from theme infrastructure

---

## Project Structure

```
cayto-group-site/
├── src/
│   ├── pages/                    # Route-based pages (Astro components)
│   │   ├── index.astro           # Homepage
│   │   ├── about-us.astro        # About Us (dedicated page, not markdown)
│   │   ├── our-services.astro    # Placement Process (dedicated page, not markdown)
│   │   ├── careers.astro         # Careers (dedicated page, not markdown)
│   │   ├── contact.astro         # Contact page (email cards + Calendly)
│   │   ├── 404.astro             # Custom 404 page
│   │   ├── blog/                 # Blog index + [single].astro
│   │   └── [regular].astro       # Catch-all: renders markdown pages
│   │
│   ├── content/                  # Content collections (Markdown source)
│   │   ├── blog/                 # Blog posts
│   │   │   ├── -index.md         # Blog landing page
│   │   │   ├── offshore-accounting-staffing-101.md
│   │   │   ├── solving-the-nfp-accounting-squeeze.md
│   │   │   └── declining-cpa-candidates-accounting-graduates.md
│   │   ├── pages/                # Generic markdown pages
│   │   │   ├── privacy-policy.md
│   │   │   └── terms-conditions.md
│   │   ├── faq/                  # FAQ page
│   │   │   └── -index.md
│   │   ├── contact/              # Contact info (metadata only)
│   │   │   └── -index.md
│   │   └── homepage/             # Homepage metadata
│   │       └── -index.md
│   │
│   ├── content.config.ts         # Content collection schema definitions
│   │
│   ├── layouts/                  # Layout components
│   │   ├── Base.astro            # Main layout wrapper (HTML structure, nav, footer)
│   │   ├── components/           # Reusable components (Cta, ProcessStep, Post, Logo, etc.)
│   │   ├── partials/             # Header.astro, Footer.astro, PostSingle.astro
│   │   ├── shortcodes/           # Accordion, Button, Tabs, Notice, Video, Youtube
│   │   └── helpers/              # DynamicIcon.tsx
│   │
│   ├── lib/                      # Utility functions (dateFormat, readingTime, textConverter, etc.)
│   │
│   ├── config/                   # Single source of truth for config
│   │   ├── config.json           # Site metadata
│   │   ├── theme.json            # Font, color, theme settings
│   │   ├── menu.json             # Navigation menu
│   │   └── social.json           # Social media links
│   │
│   ├── tailwind-plugin/          # tw-theme.mjs (theme.json → CSS vars), tw-bs-grid.mjs
│   │
│   └── styles/                   # Custom CSS (Tailwind v4 entry + overrides)
│       ├── main.css              # Tailwind v4 entry point, @import loader
│       ├── utilities.css         # Custom @utility directives (font-secondary, etc.)
│       ├── components.css
│       ├── navigation.css
│       ├── buttons.css
│       ├── base.css
│       └── safe.css
│
├── public/                       # Static assets (images, PDFs, etc.)
│   ├── images/                   # Image files
│   │   ├── logo.png
│   │   ├── favicon.png
│   │   ├── hero-*.jpg            # Page hero images
│   │   ├── client-logo-*.png     # Client logos
│   │   ├── testimonial-*.jpg     # Headshots
│   │   └── trust-badge-*.jpg     # Guarantee badges
│
├── theme/                        # Git submodule: bigspring-light-astro
│
├── .github/                      # GitHub config
│   └── workflows/                # (if needed later)
│
├── astro.config.mjs              # Astro configuration (fonts, integrations)
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
├── package-lock.json             # Dependency lock file
├── CLAUDE.md                     # Claude Code entry point
└── docs/
    ├── PRODUCT_SENSE.md          # What, who, why, scope
    ├── DESIGN.md                 # Visual and UX direction
    ├── TECHNICAL.md              # This file
    ├── DECISIONS.md              # Architectural decisions
    └── references/               # (optional) In-depth docs
```

---

## Content Collection Schema

### Blog Posts (`src/content/blog/*.md`)

```markdown
---
title: "Post Title"
description: "Short summary for meta and listing"
date: "2025-01-15"
image: "/images/hero-image.jpg"
---

# Markdown content here
```

### Pages (`src/content/pages/*.md`)

```markdown
---
title: "Page Title"
description: "Meta description"
---

# Markdown content here
```

### Config Files (`src/content/homepage/-index.md`, etc.)

```markdown
---
banner:
  enable: true
  title: "Main headline"
  image: "/images/banner.png"
  # ... more data
---
```

---

## Key Configuration Files

### `astro.config.mjs`
- Integrations: MDX, React, Sitemap
- Image service: Sharp (auto-optimization)
- Font provider: Google Fonts (dynamic from theme.json)
- Base URL and path setup for Cloudflare Pages

### Tailwind Configuration (no `tailwind.config.mjs`)
Tailwind CSS v4 uses a CSS-based configuration, not a JavaScript config file. Theme tokens are injected via a custom plugin:
- `src/tailwind-plugin/tw-theme.mjs` — reads `theme.json`, generates CSS variables and Tailwind utilities (colors, font families, font sizes)
- `src/styles/main.css` — entry point; loads Tailwind, registers plugins, imports style modules
- `src/styles/utilities.css` — custom `@utility` directives (e.g. `font-secondary`, `shadow`)

**Do not create `tailwind.config.mjs`** — it is not used in this project.

### `tsconfig.json`
- Strict mode enabled
- Path aliases (optional, for cleaner imports)

### `src/config/theme.json`
**Single source of truth for visual styling:**
- Font families and weights
- Color palette
- Spacing scale (if customized)
- Theme-wide settings

Update this file to change fonts or colors site-wide.

### `src/config/config.json`
**Site metadata:**
- `site.title` — Browser tab title
- `site.base_url` — https://caytogroup.com
- `site.logo` — Logo image path
- `nav_button` — "Client Portal" link in nav
- `params.footer_content` — Footer text
- `params.copyright` — Copyright line

### `src/config/menu.json`
**Navigation menu links:**
- Add/remove nav items here
- Affects the top navigation bar

---

## Build & Deployment

### Local Development
```bash
npm install
npm run dev
# Opens http://localhost:3000 with hot reload
```

### Production Build
```bash
npm run build
# Outputs to dist/ directory
```

### Format Code
```bash
npm run format
# Runs Prettier on all files
```

### Type Check
```bash
npm run check
# Runs Astro type checking (no build)
```

### Deployment to Cloudflare Pages

**Prerequisites:**
- Repository on GitHub (https://github.com/jonanderson10/cayto-group)
- Cloudflare account connected to GitHub

**Setup (one-time):**
1. Log into Cloudflare Dashboard
2. Pages → Create project → Connect to GitHub
3. Select `jonanderson10/cayto-group` repository
4. Build settings:
   - Framework: Astro
   - Build command: `npm run build`
   - Build output directory: `dist/`
   - (Cloudflare auto-detects these)
5. Set environment variables if needed (none currently)
6. Deploy

**Auto-deployment workflow:**
1. Create feature branch: `git checkout -b feature/my-change`
2. Make changes, commit, push
3. Open PR to `main` on GitHub
4. **Cloudflare automatically builds a preview URL** (shareable, ephemeral)
5. Test on preview environment
6. Merge PR to `main`
7. **Cloudflare automatically deploys to production** (caytogroup.com)

**Preview URLs** persist until branch is deleted. Useful for stakeholder review.

---

## Image Handling

### Image Optimization

Sharp automatically:
- Converts to modern formats (WebP, AVIF)
- Compresses for file size
- Generates multiple sizes for responsive images
- Handles aspect ratio preservation

**Do NOT pre-compress images.** Upload originals; Sharp will optimize at build time.

### Image Naming Convention

```
/public/images/
├── logo.png                           # Site logo
├── favicon.png                        # Browser tab icon
├── hero-homepage.jpg                  # Hero image for page
├── client-logo-olukai.png             # Client logos (with company name)
├── client-logo-bravo-store.jpg
├── testimonial-john-smith.jpg         # Headshots for testimonials
├── trust-badge-14-day-guarantee.jpg   # Guarantee/badge images
├── icon-check.svg                     # Icons (if used)
└── [page-name]-[content-type].jpg     # Other images by page
```

**Pattern:** `[type]-[specific-description].[ext]`

Never: `image1.png`, `photo.jpg`, `img_001.png` (non-descriptive)

### Using Images in Content

```markdown
![Alt text](/images/client-logo-olukai.png)
```

In Astro components:
```astro
<img src="/images/logo.png" alt="Cayto Group logo" />
```

Astro's Image component (if needed for advanced optimization):
```astro
import { Image } from 'astro:assets'
import logoImage from '@/images/logo.png'

<Image src={logoImage} alt="Logo" />
```

---

## Interactive Sections

### Event Handling

**DO use:** `document.addEventListener("astro:page-load", ...)` for ClientRouter-compatible scripts

**DON'T use:** `DOMContentLoaded` (Astro's ClientRouter bypasses it after initial load)

Example (from Services page tabs):
```javascript
document.addEventListener("astro:page-load", () => {
  const tabButtons = document.querySelectorAll(".tab-button")
  const panels = document.querySelectorAll(".tab-content-panel")

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Switch active tab and panel visibility
    })
  })
})
```

### Minimal Client-Side JavaScript

- Keep scripts minimal and focused on specific interactions
- Prefer CSS for hover states, animations, and simple toggles
- Use React components sparingly, only when state management is needed
- No heavy frontend frameworks unless justified

---

## Theme Updates

### Pulling Updates from Upstream

```bash
# Fetch latest theme updates
git submodule update --remote

# Commit the submodule update
git add theme
git commit -m "chore: update bigspring theme to latest"
git push origin main
```

### Resolving Conflicts

If a theme update conflicts with local customizations:
1. Review the conflict in the relevant file
2. Keep local version if it's intentional customization
3. Update to theme version if local version is outdated
4. Test thoroughly (npm run dev, npm run build)

---

## Dependencies

### Core
- `astro` (6.3.5) — Framework
- `tailwindcss` (4.3.0) — Styling
- `@tailwindcss/vite` (4.3.0) — Vite plugin for Tailwind
- `sharp` (0.34.5) — Image optimization
- `react` & `react-dom` — For interactive components (optional)

### Astro Integrations
- `@astrojs/mdx` (5.0.6) — MDX content support
- `@astrojs/react` (5.0.5) — React component support
- `@astrojs/sitemap` (3.7.2) — Auto-generate XML sitemap
- `astro-auto-import` — Auto-import shortcodes in markdown
- `astro-swiper` (2.6.1) — Carousel/slider component library

### Utilities
- `date-fns` (4.2.1) — Date formatting
- `github-slugger` — URL-safe slugs for headings
- `marked` (18.0.4) — Markdown parsing

### Dev Tools
- `typescript` (6.0.3) — Type checking
- `prettier` (3.8.3) — Code formatting
- `@astrojs/check` (0.9.9) — Astro type checking

---

## Performance Considerations

- **Static generation:** All HTML is pre-built, zero server latency
- **Image optimization:** Sharp ensures images are compressed and modern formats
- **Caching:** Cloudflare Pages caches all static assets globally
- **Minification:** Astro auto-minifies HTML, CSS, JS in production builds
- **Code splitting:** Astro chunks code intelligently

**Typical metrics:**
- LCP (Largest Contentful Paint): < 1s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

No server-side rendering needed; static files are incredibly fast.

---

## Maintenance

### Regular Tasks
- **Update dependencies:** Run `npm outdated`, evaluate upgrades carefully
- **Security audits:** `npm audit fix` for vulnerabilities
- **Link checks:** Periodically verify all internal and external links work
- **Image cleanup:** Remove unused images from `public/images/`

### Monitoring
- Cloudflare Analytics: View traffic, errors, performance metrics
- Google Analytics (if configured): User behavior, traffic sources
- Search Console: Monitor indexing and search performance

### Common Issues

**Build fails with "image not found"**
- Check file path in markdown or component
- Ensure file exists in `public/images/`
- Restart dev server if needed

**CSS not updating**
- Clear `.astro` directory: `rm -rf .astro`
- Restart dev server
- Ensure custom CSS is in `src/styles/`

**Active nav link stuck on first page visited**
- Cause: `<header>` uses `transition:persist` — the DOM node is kept alive across ClientRouter navigations, freezing server-rendered active state
- Fix: A script in `Header.astro` runs on `astro:page-load` to re-evaluate the active link from `window.location.pathname`
- Do not remove this script or replace with server-rendered active state only — it breaks after any in-app navigation

**CSS visual effects broken after ClientRouter navigation (mix-blend-mode, CSS variables, etc.)**
- Cause: Astro's ClientRouter renders incoming pages inside `::view-transition-new` — an isolated compositing layer. Effects that depend on the surrounding DOM (like `mix-blend-mode`) blend against the transition layer's background, not the real page background.
- Fix: Use `astro:page-load` to force a repaint after each transition (see logo blend-mode repaint in `index.astro`). `DOMContentLoaded` fires only once and will not fix post-navigation issues.
- Pattern: briefly set an inline style to override the CSS property, then remove it in `requestAnimationFrame` to force re-composite

**Images huge file sizes**
- Check `sharp` is properly installed
- Ensure `image: { service: sharpImageService() }` in `astro.config.mjs`
- Don't pre-compress; upload originals

---

## Testing

No automated tests currently configured. Manual testing recommended:
- Local dev server: `npm run dev`
- Production build: `npm run build && npm run preview`
- Cloudflare preview environment (created automatically on PR)
- Mobile responsiveness via Chrome DevTools

---

## Security Notes

- No user input being processed (static site)
- PDF downloads are static files, safe to host
- Contact form removed; page now shows email contact cards and Calendly embed only
- Calendly embed only loads on whitelisted domains (not localhost)

---

## Resources

- [Astro Docs](https://docs.astro.build/)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Cloudflare Pages Guide](https://developers.cloudflare.com/pages/)
- [Sharp Image Service](https://github.com/lovell/sharp)
- [Bigspring Theme Repo](https://github.com/nicholasio/bigspring-light-astro) — upstream theme (forked, original at themefisher is 404)
