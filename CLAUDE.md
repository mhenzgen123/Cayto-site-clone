# Cayto Group Marketing Site

**Stack:** Astro 6.3.5 + Tailwind CSS 4.3.0 + Cloudflare Pages

**Purpose:** Marketing and sales site for Cayto Group LLC. Trust-building now; lead generation (email drip campaigns) later.

**Key principle:** Static-first with minimal client-side JS. Theme updates pulled via git submodule.

---

## Quick Start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # Production build
npm run format       # Code formatting (Prettier)
npm run check        # Astro type checking
```

**Deploy:** Feature branch → PR to main → Cloudflare preview → merge to main → auto-deploy

---

## File Structure

```
src/
├── pages/              # Route-based pages (.astro files)
│   ├── index.astro     # Homepage
│   ├── about-us.astro  # About Us page
│   ├── managed-accounting.astro  # Managed Accounting service line
│   ├── staffing.astro      # Dedicated Professionals (was our-services.astro)
│   ├── careers.astro       # Careers page
│   ├── contact.astro
│   ├── 404.astro
│   ├── blog/               # Blog index + [single].astro
│   └── [regular].astro     # Catch-all for markdown pages
├── content/            # Content collections (Markdown)
│   ├── blog/           # Blog posts
│   ├── pages/          # Generic markdown pages (privacy, terms)
│   ├── faq/
│   ├── contact/
│   └── homepage/
├── content.config.ts   # Content collection schema definitions
├── layouts/
│   ├── Base.astro      # Main layout wrapper
│   ├── components/     # Reusable components (Cta, ProcessStep, Post, Logo, etc.)
│   ├── partials/       # Header.astro, Footer.astro, PostSingle.astro
│   ├── shortcodes/     # Accordion, Button, Tabs, Notice, Video, Youtube
│   └── helpers/        # DynamicIcon.tsx
├── lib/                # Utility functions (dateFormat, readingTime, textConverter, etc.)
├── config/             # Single source of truth for config
│   ├── config.json     # Site metadata (title, logo, nav button, etc.)
│   ├── theme.json      # Font and color definitions
│   ├── menu.json
│   └── social.json
├── tailwind-plugin/    # tw-theme.mjs (theme.json → CSS vars), tw-bs-grid.mjs
└── styles/
    ├── main.css        # Tailwind v4 entry point, @import loader
    ├── utilities.css   # Custom @utility directives (font-secondary, etc.)
    ├── components.css
    ├── navigation.css
    ├── buttons.css
    ├── base.css
    └── safe.css
```

---

## Key Design Decisions

@docs/DECISIONS.md

---

## Design & Brand

@docs/DESIGN.md

---

## Technical Architecture

@docs/TECHNICAL.md

---

## Product Context

@docs/PRODUCT_SENSE.md

---

## Common Tasks

### Add a Blog Post

1. Create `src/content/blog/my-post.md`
2. Include frontmatter: `title`, `description`, `date`, `image`
3. Sharp auto-optimizes images at build time

### Update Config

- **Site metadata:** `src/config/config.json`
- **Fonts/colors:** `src/config/theme.json`
- **Navigation:** `src/config/menu.json`
- **Socials:** `src/config/social.json`

### Add a New Page

1. Create `src/pages/my-page.astro` for rich component layouts
2. _Or_ create `src/content/pages/my-page.md` + `[regular].astro` for generic markdown
3. Update `src/config/menu.json` if nav link needed

### Image Guidelines

- Place in `public/images/`
- Use descriptive names: `client-logo-olukai.png`, `hero-trust-badge.jpg`, not `image1.png`
- Sharp handles compression and format conversion automatically
- Reference as `/images/filename.png` in Astro/Markdown

---

## Deployment

Feature branch → PR to main → Cloudflare preview → merge to main → auto-deploy. Full workflow: @docs/TECHNICAL.md

---

## Important Notes

- Theme is managed via git submodule at `theme/` — pull updates: `git submodule update --remote`
- Tailwind v4 uses CSS-based config (no `tailwind.config.mjs`). Theme tokens flow: `theme.json` → `tailwind-plugin/tw-theme.mjs` → CSS custom properties. Entry point: `src/styles/main.css`. `@tailwindcss/vite` is at 4.3.0.
- Interactive sections use `astro:page-load` event (not `DOMContentLoaded`). `transition:persist` on `<header>` freezes server-rendered state; `astro:page-load` re-evaluates after every ClientRouter navigation.
- Image optimization is automatic via Sharp — don't pre-resize
- Contact page uses email cards, not a form (Calendly is primary CTA; embed disabled on localhost)
- Pricing page removed entirely (pricing.astro, pricing.md, and pricing PDF deleted; `/pricing` returns 404)
- Two service lines. Teal (#1A7A94) is the staffing accent and shared chrome; navy (#000A48, token: accent) is reserved for Managed Accounting. Do not repaint global elements.
- Nav dropdown classes (.nav-dropdown-list / -item / -link) are styled in navigation.css. Header.astro renders them for any menu entry with hasChildren:true.
