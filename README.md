# Cayto Group

Marketing site for [caytogroup.com](https://caytogroup.com) — static-first, zero-server.

**Stack:** Astro 6 + Tailwind CSS 4 + Cloudflare Pages

## Quick start

```bash
npm install
npm run dev     # localhost:3000
npm run build   # production build
npm run check   # type checking
```

## Deploy

Feature branch → PR to `main` → Cloudflare Pages auto-deploys. Preview URLs on every PR.

## Structure

```
src/
├── pages/         # Route-based pages (.astro)
├── content/       # Markdown content collections (blog, pages, faq, etc.)
├── layouts/       # Base layout, components, partials, shortcodes
├── lib/           # Utility functions
├── config/        # config.json, theme.json, menu.json, social.json
└── styles/        # Tailwind v4 entry point, utilities, components
```

## Theme

Managed via git submodule at `theme/`. Pull updates:

```bash
git submodule update --remote
```

## Key docs

- `CLAUDE.md` — full project reference
- `docs/DECISIONS.md` — architecture decisions
- `docs/DESIGN.md` — brand & design system
