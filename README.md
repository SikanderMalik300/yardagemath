# YardageMath

Free, static, US-focused construction & yard calculators — [yardagemath.com](https://yardagemath.com).

Built with **Next.js (App Router, static export)**, TypeScript (strict), Tailwind CSS and
self-hosted Inter via `next/font`. Calculations run client-side; formulas live in pure TypeScript
with unit tests.

## Scripts

```bash
npm run dev        # local dev server
npm run build      # static export → ./out
npm run test       # Vitest formula unit tests
npm run lint       # ESLint (next/core-web-vitals)
```

## Architecture

- `src/lib/formulas/*` — pure formula functions (one per tool + shared `volume.ts`, `units.ts`). No formula lives in a component.
- `src/lib/constants.ts` — every user-facing number, each with a source + date comment. Prices/densities flagged `VERIFY`.
- `src/data/calculators.ts` — the registry (single source of truth). Home, hubs, sitemap, related blocks, breadcrumbs and JSON-LD are generated from it.
- `src/components/calculator/*` — shared UI primitives + the 12 interactive calculators (`tools/`).
- `src/app/*` — one folder per route; `sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`, `icon.svg`, `apple-icon.tsx`.

Each calculator renders a **default example result in the initial static HTML** (SSG), so crawlers
and AI tools see a real answer.

## Deployment (Cloudflare Pages)

- Build command: `npx next build`
- Output directory: `out`
- Static files `public/_headers`, `public/llms.txt`, `public/ads.txt` ship as-is.
- Set env vars (see `.env.example`) in the Pages project for analytics / ads / contact form.

Canonical host is the apex `https://yardagemath.com` (no www). Configure the www→apex and
http→https 301 redirects and HSTS at Cloudflare (see the build spec, Part B).

## Adding a calculator

1. Add a pure formula in `src/lib/formulas/` + a test in `tests/formulas/`.
2. Add a registry entry in `src/data/calculators.ts`.
3. Add an interactive component in `src/components/calculator/tools/`.
4. Add `src/app/<slug>/page.tsx` (copy an existing one).
