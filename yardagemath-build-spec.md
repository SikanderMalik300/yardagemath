# YardageMath.com: Complete Build & SEO Spec

Owner: Neo · Prepared 7 Oct 2026 · Domain: **yardagemath.com**

This file has two parts:

- **Part A: for your AI coding agent.** Everything needed to build the site in Next.js + shadcn/ui: architecture, technical SEO, on-page SEO, GEO, schema, the 12 calculator specs (formulas included), legal pages and launch checks. Design is NOT covered here; it lives in your separate `design.md`.
- **Part B: browser tasks.** Domain, DNS, hosting, Search Console, Bing, analytics, email, and later AdSense. Claude does these in your Chrome; you handle logins, payments and account creation.

Research basis: Semrush US database, Oct 2026 (keyword volumes, KD, SERP checks). Competitors that rank with small sites: concreteblockcalculator.com, calcformula.com, elmwoodbark.com, lawnbeast.com, topsoilcalculator.net, acresperhourcalculator.app. What they share: **a working calculator at the top of the page, short helpful content, FAQ, related-tool links**. Few real backlinks.

---

# PART A: INSTRUCTIONS FOR THE AI CODING AGENT

> Give the agent this whole Part A plus your `design.md`. Tell it: "Follow every MUST. Ask before changing any formula or URL."

## A0. Goal and non-negotiables

Build a fast, static, US-focused calculator website. Every calculator page is one tool plus a short guide, and each page targets one keyword cluster.

MUST:

1. Every page is **statically pre-rendered HTML** (SSG). All text, headings, tables, FAQ and the calculator form, *including a default example result*, must be in the initial HTML. No content that only appears after JavaScript runs.
2. Calculations run **client-side** (instant, no server, no API).
3. **Formulas live in pure TypeScript functions with unit tests.** No formula inside a React component.
4. US customary units by default (feet, inches, cubic yards, tons, gallons), with a metric toggle.
5. Lighthouse (mobile) ≥ 95 for Performance, Accessibility, Best Practices and SEO on every page.
6. Core Web Vitals targets: LCP < 2.0 s, INP < 200 ms, CLS < 0.05.
7. No fake reviews, ratings, review schema, testimonials or invented "users served" counts.
8. Every number shown to users (prices, densities, coverage) comes from the constants file, and every constant has a source comment.

## A1. Tech stack

- **Next.js** (latest stable, App Router, TypeScript strict mode).
- **shadcn/ui** + Tailwind CSS, for components only: Input, Select, Tabs, Card, Accordion (FAQ), Table, Button, Toggle, Tooltip, Separator, Breadcrumb.
- **next/font** for self-hosted fonts (no Google Fonts network request at runtime).
- **Vitest** for formula unit tests.
- **No** heavy libraries (no chart libraries, no moment.js, no lodash). Total JS per page should be small.
- **Static export**: in `next.config.ts` set `output: 'export'`, `trailingSlash: true` and `images: { unoptimized: true }`. Pre-size images as WebP/AVIF yourself.

### Hosting recommendation

Use a **static export on Cloudflare Pages** (free, commercial use allowed, global CDN, free SSL, HTTP/3). Alternative: upload the `out/` folder to Hostinger web hosting if you bought a hosting plan.

**Do not use Vercel's free Hobby plan.** Vercel limits Hobby to non-commercial use, and an ad-supported site is commercial (Vercel Pro is fine if you prefer Vercel).

## A2. Site architecture and URLs

Flat, short, keyword-matching URLs, all lowercase with a trailing slash.

```
/                                   Home: calculator directory (H1: "Free Construction & Yard Calculators")
/cubic-yard-calculator/
/concrete-block-calculator/
/concrete-slab-cost-calculator/
/topsoil-calculator/
/pea-gravel-calculator/
/square-yard-calculator/
/landscape-materials-calculator/
/lawn-mowing-cost-calculator/
/block-wall-calculator/
/acres-per-hour-calculator/
/gutter-slope-calculator/
/rip-rap-calculator/
/concrete/                          Category hub: lists concrete & block tools + intro
/landscaping/                       Category hub: yardage, soil, gravel, rip rap, materials
/lawn/                              Category hub: mowing cost, acres per hour
/about/
/contact/
/privacy-policy/
/terms/
/disclaimer/
/affiliate-disclosure/              (add now even before affiliate links)
/how-we-calculate/                  Methodology + sources (E-E-A-T)
/sitemap/                           HTML sitemap (all pages, for users and crawlers)
404 page                            Custom, with search box and links to top tools
```

Rules:

- Calculator pages sit at the root (not `/calculators/x/`). Shorter URLs and every tool is one click from home.
- Category hubs link to their tools, and each tool links back to its hub through the breadcrumb.
- Guides come later under `/guides/slug/` (not today).
- Never change a URL after launch. If you must, add a 301 redirect.

### Calculator registry (single source of truth)

Create `src/data/calculators.ts`, an array where each entry has: `slug, category, title, metaDescription, h1, primaryKeyword, secondaryKeywords[], shortAnswer, related[] (slugs), lastUpdated (ISO date), faqs[]`. The homepage, hubs, sitemap, related-tool blocks, breadcrumbs and JSON-LD are all generated from it. Adding a tool later means adding one entry plus one component.

Suggested structure:

```
src/
  app/
    layout.tsx                 root metadata, fonts, Organization+WebSite JSON-LD
    page.tsx                   home
    [category]/page.tsx        hubs (generateStaticParams)
    cubic-yard-calculator/page.tsx   (one folder per tool; or a dynamic [slug] route + component map)
    about/ contact/ privacy-policy/ terms/ disclaimer/ affiliate-disclosure/ how-we-calculate/ sitemap/
    not-found.tsx
    sitemap.ts                 XML sitemap
    robots.ts
    manifest.ts
    opengraph-image.tsx        default OG image (static at build)
  components/
    calculator/                shared: NumberInput (ft+in), UnitToggle, ResultCard, CopyResult, ShareLink
    seo/JsonLd.tsx
    layout/Header.tsx Footer.tsx Breadcrumbs.tsx RelatedTools.tsx AuthorBox.tsx AdSlot.tsx
  lib/
    formulas/                  pure functions, one file per tool + shared volume.ts, units.ts
    constants.ts               densities, coverage, prices, each with a source + date comment
    seo.ts                     buildMetadata(), buildJsonLd() helpers
  data/calculators.ts
tests/formulas/*.test.ts
```

## A3. Technical SEO checklist (all MUST)

### Metadata (Next.js Metadata API)

- `metadataBase: new URL('https://yardagemath.com')` in the root layout.
- Per page: `title`, `description` and `alternates.canonical` (absolute, with trailing slash, self-referencing).
- Root title template: `%s | YardageMath`. Keep page titles under 60 characters before the template; the homepage title has no template.
- `openGraph` (title, description, url, siteName "YardageMath", type "website", locale "en_US", image 1200×630) and `twitter` (card `summary_large_image`).
- `<html lang="en-US">`.
- `robots`: index, follow on all public pages. `noindex` on: 404, any search-results page, and URLs with calculator query params (see sharing below).
- Favicon set: `icon.svg`, `icon.png` 32×32, `apple-icon.png` 180×180, plus `manifest.ts` with name, short_name and theme color.

### Canonical domain and redirects

- Canonical host: **https://yardagemath.com** (no www). 301-redirect `www` → apex and `http` → `https` at the host/DNS level (Cloudflare rule).
- Use trailing slashes consistently. The other variant 301s to the canonical.
- One URL per page. No duplicate pages reachable at two paths.

### Sitemap and robots

- `app/sitemap.ts`: every indexable page with an absolute URL and `lastModified` taken from the registry's `lastUpdated`. Exclude legal pages? **No, include them** (they're small, and showing they exist helps trust). Exclude the 404 page.
- `app/robots.ts`:

```
User-agent: *
Allow: /
Sitemap: https://yardagemath.com/sitemap.xml
```

  Do not block CSS or JS. Allow AI search crawlers (OAI-SearchBot, PerplexityBot, Bingbot): they send traffic from AI answers. Whether to allow `GPTBot` and `Google-Extended` (model training) is the owner's choice. Neither affects Google Search ranking. Default: allow.
- Add `/llms.txt`, a short markdown list of the site's tools with one-line descriptions and URLs. It's optional, cheap and harmless. Google doesn't use it.

### Rendering and crawlability

- All content in the static HTML, including the calculator rendered with **default example inputs and their computed result** (for example, cubic yard calculator preset to 10 ft × 10 ft × 3 in = 0.93 cu yd). Crawlers and AI tools then see a real answer.
- Use real `<a href>` links for all navigation (Next `<Link>`). No JS-only click handlers for navigation.
- Exactly **one H1 per page**, followed by a logical H2 → H3 order.
- Breadcrumbs on every page except home: Home › Category › Tool.
- Each calculator page links to 3–5 related tools (from the registry) and to its category hub.
- Footer links: all categories, all legal pages, About, Contact, How We Calculate, HTML sitemap.

### Performance (Core Web Vitals)

- Static pages served from a CDN with long cache headers on hashed assets.
- Fonts: at most 2 weights, via `next/font`, `display: swap`.
- Images: WebP/AVIF, explicit `width`/`height`, `loading="lazy"` below the fold, a descriptive `alt`. Diagrams as inline SVG where possible.
- **Reserve space for future ad slots** (fixed min-height containers in `AdSlot.tsx`, empty for now). This prevents layout shift (CLS) when ads are added.
- No third-party scripts in the initial load except analytics (deferred). Load ad scripts later with `next/script` `strategy="lazyOnload"`.
- Interactions must stay under 200 ms INP: calculations are synchronous and light. Debounce input recalculation by about 150 ms or recalculate on change.

### Accessibility (it also affects SEO and UX)

- Every input has a visible `<label>`, `inputMode="decimal"`, sensible `min`/`step`, and an error message for invalid input.
- Results area uses `aria-live="polite"`.
- Color contrast meets WCAG AA. The whole calculator works with the keyboard only.
- Tables use `<th scope>`, and the FAQ accordion is keyboard-accessible.

### Security and hygiene headers (set at the host)

HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a basic `Permissions-Policy`. Add a Content-Security-Policy once the ad scripts are known.

### Sharing results (optional but useful)

"Copy link" puts the inputs in query params (`?l=10&w=10&d=3`). Those URLs keep `canonical` pointing to the clean URL. Never link to parameter URLs internally.

## A4. Structured data (JSON-LD)

Render with a `<JsonLd>` server component and `<script type="application/ld+json">`.

- **Root layout (every page):** `Organization` (name "YardageMath", url, logo, `email` on your domain, `founder` Person "Neo") and `WebSite` (name, url). Don't add SearchAction unless there is a real search page.
- **Every calculator page:**
  - `WebApplication` with name (tool name), url, `applicationCategory: "UtilitiesApplication"`, `operatingSystem: "Any"`, `offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }`, `description`, `dateModified`, and `author`/`publisher` pointing to the Organization. **No `aggregateRating`.**
  - `BreadcrumbList` matching the visible breadcrumbs.
  - `FAQPage` for the visible FAQ. Google shows FAQ rich results mainly for authoritative government and health sites now, so don't expect stars or dropdowns in Google. Still add it: it describes the page clearly for Bing and AI search. The FAQ text must be visible on the page, word for word.
- **Hub pages:** `CollectionPage` + `BreadcrumbList` + `ItemList` of the tools.
- **About page:** `AboutPage` + `Person` (Neo, with `sameAs` links to any real public profiles).
- **Do not use:** HowTo (deprecated), Review or AggregateRating (fake), Product.
- Validate every template with Google's Rich Results Test and validator.schema.org before launch.

## A5. On-page SEO template: every calculator page, in this order

1. **Breadcrumbs.**
2. **H1** = the primary keyword, naturally (for example, "Cubic Yard Calculator").
3. **Quick answer (GEO block), 40–60 words** in a visually distinct box, directly under the H1. It states the core fact with numbers, for example: *"1 cubic yard = 27 cubic feet. It covers 324 sq ft at 1 inch deep, 108 sq ft at 3 inches, or 81 sq ft at 4 inches. Enter your area and depth below to get cubic yards, tons and bags."* AI answers and featured snippets quote blocks like this.
4. **The calculator** (above the fold on mobile):
   - Inputs accept feet + inches, with a unit toggle (US/metric).
   - Shape selector where relevant (rectangle, circle, triangle).
   - Waste/extra % input (default given per tool).
   - "Add another area" for multi-area projects where relevant.
   - Results: large primary number + secondary outputs (cu ft, cu m, tons, bags), each with units.
   - "Show the math" expandable section that shows the formula with the user's numbers plugged in. This is a strong trust signal that competitors lack.
   - Copy result, Share link, Print/Save buttons. Reset to the example.
5. **How to use this calculator:** a 3–6 step numbered list.
6. **Formula:** the formula in plain text plus a math-style block, and a **worked example** with real numbers.
7. **Reference table:** a static HTML table of common values (for example, coverage by depth, or bags per yard). Featured snippets and AI tools love tables.
8. **Tips / buying advice:** 3–5 practical bullets (order 5–10% extra, how materials are sold, delivery minimums).
9. **FAQ:** 5–7 questions, matching real "People also ask" questions, each with a 40–80-word direct answer.
10. **Related calculators:** 3–5 cards.
11. **Author & update box:** "Built and maintained by Neo · Formulas checked against [sources] · Last updated: [date]", linking to `/about/` and `/how-we-calculate/`.
12. **Disclaimer line:** "Estimates only. Confirm quantities with your supplier or contractor." (Link `/disclaimer/`.)

Content rules:

- 600–1,200 words per page (excluding the tool). **No filler and no generic intros** ("Concrete is a versatile material…"). Every paragraph must help someone finish their project.
- The primary keyword goes in: title, H1, first sentence of the quick answer, one H2, the image alt and the URL. Secondary keywords go naturally into H2s and FAQs. Don't keyword-stuff.
- Write for US readers: US spelling, US units, US prices, US store names (Home Depot, Lowe's) where natural.
- Use original diagrams (simple SVG: a slab with L/W/D labelled, a wall with courses). Use no stock photos as filler.
- The owner must review every page before publishing. Google's spam policies target mass-produced, unreviewed AI content ("scaled content abuse"). Each page needs original worked examples, a unique table and accurate numbers.
- Put the visible "Last updated" date in `dateModified` too, and only change it when the content really changes.

## A6. The 12 calculator page specs

US monthly search volume and KD are from Semrush (Oct 2026). Titles are under 60 characters before the template.

> **Constants marked `VERIFY`**: the agent must confirm each against a cited manufacturer or industry source before publishing, then put the source URL in a comment in `constants.ts` and on `/how-we-calculate/`. Never invent prices.

Shared formula (`lib/formulas/volume.ts`):

```
areaSqFt(rectangle) = L_ft × W_ft
areaSqFt(circle)    = π × (D_ft / 2)²
areaSqFt(triangle)  = 0.5 × base_ft × height_ft
volumeCuFt          = areaSqFt × (depth_in / 12)
cubicYards          = volumeCuFt / 27
cubicMeters         = cubicYards × 0.764555
withWaste           = value × (1 + waste% / 100)
tons                = cubicYards × densityTonsPerCuYd (material)
bags                = ceil(volumeCuFt / bagSizeCuFt)
feet+inches input   → ft = feet + inches / 12
```

### 1. Cubic Yard Calculator: `/cubic-yard-calculator/`

- Primary: **cubic yard calculator** (27,100/mo, KD 10). Secondary: cy calculator (1,300), cu yd calculator (720), how to figure a cubic yard (720), how to compute cubic yards (590), formula for cubic yards (480), cubic yard measurement (320).
- Title: `Cubic Yard Calculator – Gravel, Soil, Mulch & Concrete`
- Meta description: `Free cubic yard calculator. Enter length, width and depth in feet or inches to get cubic yards, cubic feet, tons and bags for gravel, soil, mulch or concrete.`
- H1: `Cubic Yard Calculator`
- Inputs: shape (rectangle/circle/triangle); length, width (or diameter, or base/height) in ft+in; depth in inches; material select (none, gravel, topsoil, mulch, sand, concrete, crushed stone); waste % (default 5%); multi-area.
- Outputs: cubic yards (primary), cubic feet, cubic meters, tons (if a material is chosen), bags (2 cu ft for mulch, 0.5 cu ft for gravel, 0.75 cu ft for soil).
- Example default: 10 ft × 10 ft × 3 in → 25 cu ft → **0.93 cu yd**.
- Table: coverage of 1 cubic yard by depth: 1" = 324 sq ft, 2" = 162, 3" = 108, 4" = 81, 6" = 54, 12" = 27.
- Density defaults (tons per cu yd, `VERIFY`): gravel 1.4, crushed stone 1.4, sand 1.35, topsoil 1.1, mulch 0.3, concrete (wet) 2.0.
- FAQ ideas: Is a cubic yard 3×3×3? (yes, 3 ft × 3 ft × 3 ft = 27 cu ft) · How many square feet does a cubic yard cover? · How many bags of mulch in a yard? (13.5 of 2 cu ft) · How do I convert cubic feet to cubic yards? · How much does a cubic yard weigh? · Can a pickup truck carry a cubic yard?
- Related: topsoil, pea gravel, landscape materials, concrete slab cost, rip rap.

### 2. Concrete Block Calculator: `/concrete-block-calculator/`

- Primary: **concrete block calculator** (6,600, KD 24) + **cinder block calculator** (4,400, KD 26). Secondary: cmu block calculator (2,900), block calculator (2,400), cement block calculator (1,600), how many concrete blocks do i need (880), block estimator (880), cinder blocks calculator (720), cmu calculator (390).
- Title: `Concrete Block Calculator – CMU & Cinder Blocks Needed`
- Meta: `Find how many concrete blocks (CMU or cinder blocks) you need for a wall. Enter length and height, subtract doors and windows, and get blocks, mortar bags and cost.`
- H1: `Concrete Block Calculator (CMU / Cinder Block)`
- Intent difference from #9: this page answers "how many blocks". Keep it quick and focused on count. #9 is the full wall cost estimator.
- Inputs: wall length (ft+in), wall height (ft+in); block size (8×8×16 standard, 6×8×16, 12×8×16, 4×8×16 — nominal face 8"×16" for all); openings (count × W × H); waste % (default 5%); optional price per block.
- Formula: `netArea = L × H − Σ openings`; blocks per sq ft for 8×16 nominal face = 144 / (8 × 16) = **1.125**; `blocks = ceil(netArea × 1.125 × (1 + waste))`. Also show courses = `ceil(H_in / 8)` and blocks per course = `ceil(L_in / 16)`.
- Mortar (`VERIFY` against the bag manufacturer, e.g. Quikrete Mortar Mix): about 13 standard blocks per 80-lb bag of premixed mortar → `bags = ceil(blocks / 13)`. Show it as an estimate.
- Example default: 20 ft × 6 ft wall, no openings → 120 sq ft × 1.125 = 135 blocks + 5% = **142 blocks**.
- Table: blocks per 100 sq ft = 112.5; blocks by common wall sizes (10×4, 20×4, 20×6, 30×8, 40×8).
- FAQ: How many blocks are in 100 square feet? · What are the actual dimensions of an 8×8×16 block (7⅝ × 7⅝ × 15⅝)? · Cinder block vs concrete block? · How much mortar per block? · How much does a concrete block weigh? (link the future weight guide) · How many blocks are on a pallet? (`VERIFY`, typically 90–144 depending on size and supplier)
- Related: block wall, concrete slab cost, cubic yard, rip rap.

### 3. Concrete Slab Cost Calculator: `/concrete-slab-cost-calculator/`

- Primary: **concrete slab cost calculator** (5,400–8,100, KD 16–22). Secondary: concrete pad cost calculator (2,900), cement slab price (1,300), calculating concrete slab cost (880), concrete slab price calculator (480).
- Title: `Concrete Slab Cost Calculator – 2026 Price per Sq Ft`
- Meta: `Estimate concrete slab cost by size and thickness. Get cubic yards, bags or ready-mix, and total price with optional labor, rebar and base gravel. Updated for 2026.`
- H1: `Concrete Slab Cost Calculator`
- SERP note: this keyword shows an AI Overview, so a good working tool plus a clear price table is how you win the click.
- Inputs: length, width (ft+in), thickness (inches, default 4); waste % (default 10%); supply mode (ready-mix truck or bags: 40/60/80 lb); price per cubic yard (editable, default from a cited 2026 national average, `VERIFY`); price per bag (editable); optional labor $/sq ft, rebar/mesh $/sq ft, gravel base depth.
- Formula: `cuYd = L × W × (T / 12) / 27 × (1 + waste)`. Bags: 80 lb ≈ 0.60 cu ft, 60 lb ≈ 0.45, 40 lb ≈ 0.30 (`VERIFY` against the bag label) → `bags = ceil(cuFt / yield)`. `materialCost = cuYd × pricePerYd` (or bags × bagPrice); `total = material + labor × area + rebar × area`; `costPerSqFt = total / area`.
- Example default: 10 × 10 ft × 4 in → 1.23 cu yd → +10% → **1.36 cu yd** (36.7 cu ft ÷ 0.60 = 62 bags of 80 lb).
- Table: cubic yards and bags for common slabs (10×10, 12×12, 20×20, 24×24, 30×30 at 4" and 6"). This covers "cost of 30x30 concrete slab 4 inches thick" (1,600/mo).
- FAQ: How much does a 20×20 slab cost? · Is it cheaper to mix bags or order ready-mix? (bags make sense under about 1 cu yd) · How thick should a slab be? (4" patios/walkways, 5–6" driveways and garages, `VERIFY`) · How many 80-lb bags in a yard? (≈45) · Do I need rebar or mesh? · What's the minimum ready-mix order / short-load fee?
- Related: cubic yard, concrete block, block wall, square yard.

### 4. Topsoil Calculator: `/topsoil-calculator/`

- Primary: **topsoil calculator** (8,100, KD 13). Secondary: loam calculator (1,000), how much topsoil do I need.
- Title: `Topsoil Calculator – Cubic Yards, Tons & Bags Needed`
- Meta: `Calculate how much topsoil you need for a lawn, garden bed or raised bed. Get cubic yards, tons and bags from your area and depth, with recommended depths.`
- H1: `Topsoil Calculator`
- Inputs: shape, dimensions, depth (default 4"), raised-bed mode (L × W × H), waste % (default 5%), bag size (0.75 or 1 cu ft, 40 lb).
- Outputs: cu yd, cu ft, tons (density 1.1 t/cu yd, `VERIFY`), bags.
- Example: 20 × 10 ft at 4" → 66.7 cu ft → **2.47 cu yd**.
- Table: recommended depths (new lawn 4–6", overseeding/topdressing ¼–½", garden bed 8–12", raised bed = full height) + coverage per yard.
- FAQ: How much area does a yard of topsoil cover? · How much does a yard of topsoil weigh? · Topsoil vs garden soil vs fill dirt? · How many bags of topsoil make a yard? (27 / 0.75 = 36) · How deep should topsoil be for grass?
- Related: cubic yard, landscape materials, pea gravel, lawn mowing cost.

### 5. Pea Gravel Calculator: `/pea-gravel-calculator/`

- Primary: **pea gravel calculator** (4,400, KD 9). Secondary: calculating pea gravel (880), pea gravel estimator (390).
- Title: `Pea Gravel Calculator – Yards, Tons & Bags Needed`
- Meta: `Work out how much pea gravel you need for a patio, path, playground or driveway. Enter size and depth to get cubic yards, tons and 0.5 cu ft bags.`
- H1: `Pea Gravel Calculator`
- Inputs: shape, dimensions, depth (default 3"; presets: path 2–3", patio 3–4", playground 9–12", `VERIFY` playground guidance with CPSC), waste 5–10%, price per ton or yard (optional).
- Outputs: cu yd, tons (≈1.4 t/cu yd, `VERIFY`), 0.5 cu ft bags (≈50 lb).
- Example: 12 × 12 ft at 3" → 36 cu ft → **1.33 cu yd ≈ 1.87 tons**.
- Table: coverage by depth + bags per yard (54 × 0.5 cu ft).
- FAQ: How much area does a ton of pea gravel cover? · How deep should pea gravel be for a patio? · Pea gravel vs crushed stone for a driveway? · How many bags of pea gravel per yard? · Do I need landscape fabric?
- Related: cubic yard, landscape materials, rip rap, topsoil.

### 6. Square Yard Calculator: `/square-yard-calculator/`

- Primary: **square yard calculator** (2,900, KD 19). Secondary: yard measurement, square feet to square yards.
- Title: `Square Yard Calculator – Feet & Inches to Square Yards`
- Meta: `Convert room or area dimensions to square yards for carpet, turf, sod or concrete. Add multiple rooms, include waste, and estimate total cost per square yard.`
- H1: `Square Yard Calculator`
- Inputs: multiple areas (L × W in ft+in, or sq ft directly), waste % (default 10% for carpet), price per sq yd (optional).
- Formula: `sqYd = sqFt / 9`.
- Example: 12 × 12 ft room → 144 sq ft → **16 sq yd**.
- Table: common room sizes in sq ft and sq yd; conversions (1 sq yd = 9 sq ft = 0.836 m²).
- FAQ: How many square feet in a square yard? · How do I calculate square yards for carpet? · Square yards vs cubic yards? · How many square yards is a 12×15 room? (20)
- Related: cubic yard, concrete slab cost, landscape materials.

### 7. Landscape Materials Calculator: `/landscape-materials-calculator/`

- Primary: **material calculator** (2,400, KD 14) + **landscape calculator** (1,000, KD 17). Secondary: yard of mulch (1,000), cubic yard of mulch (880). Note: "mulch calculator" itself is KD 50, so it's not a target yet.
- Title: `Landscape Material Calculator – Mulch, Rock, Soil & Sand`
- Meta: `One calculator for all landscaping materials: mulch, river rock, topsoil, sand, decomposed granite, compost and gravel. Get yards, tons and bags for your project.`
- H1: `Landscape Material Calculator`
- Inputs: material (mulch, river rock, decomposed granite, compost, topsoil, sand, gravel, crushed stone), shape, dimensions, depth (default changes by material: mulch 3", rock 2–3", DG 3", compost 2"), waste %.
- Outputs: cu yd, tons, bags (per-material bag size), and a "how it's sold" note.
- Densities (t/cu yd, `VERIFY` each): mulch 0.3, river rock 1.35, decomposed granite 1.3, compost 0.6, topsoil 1.1, sand 1.35, gravel 1.4, crushed stone 1.4.
- Table: recommended depth by material + bags per yard.
- FAQ: How much does a yard of mulch cover? (108 sq ft at 3") · How deep should mulch be? · How many bags of mulch in a yard? · Is it cheaper to buy mulch in bulk? · How much does river rock weigh per yard?
- Related: cubic yard, topsoil, pea gravel, rip rap.

### 8. Lawn Mowing Cost Calculator: `/lawn-mowing-cost-calculator/`

- Primary: **lawn mowing cost calculator** (1,000–1,300, KD 1–5). Secondary: lawn mowing calculator (390), lawn care estimate (320), lawn cutting calculator (210), lawn care cost calculator (210), lawn mowing pricing formula (210), lawn mowing price calculator (170).
- Two audiences, so use **two tabs**: "Homeowner: what should I pay?" and "Lawn care pro: what should I charge?"
- Title: `Lawn Mowing Cost Calculator – Price per Cut & per Acre`
- Meta: `Estimate lawn mowing prices by lawn size, or price your mowing jobs as a pro using hourly rate, mower width and travel time. Includes 2026 average rates.`
- H1: `Lawn Mowing Cost Calculator`
- Homeowner tab inputs: lawn size (sq ft or acres; sq ft → acres ÷ 43,560), frequency (weekly, bi-weekly), extras (edging, trimming, bagging). Uses a size-tier price table from a cited 2026 source (`VERIFY`; don't invent). Output: per cut, per month, per season (US season ≈ 26–30 weeks, editable).
- Pro tab inputs: lawn size, mower deck width (in), mowing speed (mph, default 3), efficiency (default 80%), trimming/edging minutes, travel minutes, hourly rate ($), fuel/overhead %. Formula: `acresPerHour = (deckIn × mph × eff) / 99`; `mowHours = acres / acresPerHour`; `totalHours = mowHours + (trim + travel) / 60`; `price = totalHours × rate × (1 + overhead)`. Also show price per 1,000 sq ft.
- Example (pro): 0.25 acre, 21" deck, 3 mph, 80% → 0.51 ac/hr → 0.49 h mowing + 15 min trim/travel → ≈ 0.74 h × $60 = **≈ $45**.
- Table: typical price by lawn size (¼, ½, ¾, 1, 2 acres), sourced.
- FAQ: How much should I charge to mow an acre? · How do I calculate lawn mowing prices? · How long does it take to mow an acre? · How much does weekly lawn mowing cost? · What should a lawn care estimate include?
- Related: acres per hour, topsoil, landscape materials.

### 9. Block Wall Calculator: `/block-wall-calculator/`

- Primary: **block wall calculator** (1,000, KD 14). Secondary: cinder block wall calculator (590), concrete block wall calculator (590), block wall estimator (390), concrete block wall cost calculator (320), cinder block wall cost calculator (210).
- Title: `Block Wall Calculator – Blocks, Mortar, Grout & Cost`
- Meta: `Plan a concrete block wall: number of courses, blocks, cap blocks, mortar, sand, core-fill grout, rebar and total material cost. Free CMU wall estimator.`
- H1: `Block Wall Calculator (Cost & Materials)`
- Inputs: length, height, block size (6/8/12" thick), openings, cap block yes/no, core fill (none / every other core / full grout), vertical rebar spacing (16"/24"/32"/48"), prices (block, cap, mortar bag, grout per cu yd or bag, rebar per 20-ft bar).
- Formulas: courses = `ceil(H_in / 8)`; blocks per course = `ceil(L_in / 16)`; blocks = from net area as in #2; cap blocks = `ceil(L_in / 16)`; mortar bags as in #2; grout: per sq ft of wall when fully grouted 8" ≈ 0.26 cu ft (`VERIFY` with NCMA TEK grout-quantity tables; for 6" and 12", use the NCMA values); rebar bars = `ceil(L_in / spacing) + 1`, each bar = H + lap; cost = Σ items.
- Example: 30 ft × 4 ft, 8" block, no openings → 6 courses × 23 blocks ≈ 135 blocks (+5% = 142), 23 cap blocks, ~11 mortar bags.
- Table: materials for common wall sizes.
- FAQ: How much does a block wall cost per square foot? · Do I need a footing? (Yes; typical footing is twice the wall width, `VERIFY`, check local code) · How tall can a block wall be without rebar? (depends on local code; say so plainly) · How much grout to fill block cores? · How many courses for a 4-ft wall? (6)
- Related: concrete block, concrete slab cost, cubic yard.
- Add a visible note: "Retaining walls over 3–4 ft usually need an engineer and a permit. Check local codes."

### 10. Acres per Hour Calculator: `/acres-per-hour-calculator/`

- Primary: **acres per hour calculator** (1,000, KD 7).
- Title: `Acres per Hour Calculator – Mowing & Field Work Time`
- Meta: `Calculate acres per hour for mowers, tractors and field equipment from width, speed and efficiency, and how long it takes to cover your lawn or field.`
- H1: `Acres per Hour Calculator`
- Inputs: working width (in or ft), speed (mph), field efficiency % (default 80; presets: zero-turn 80–85, push mower 70–80, tractor implement 70–85, `VERIFY` using ASABE field-efficiency ranges), total area (acres or sq ft).
- Formula: `acresPerHour = (width_in × mph × eff) / 99` (equivalently `width_ft × mph × eff / 8.25`); `hours = area / acresPerHour`.
- Example: 60" deck at 6 mph, 80% → **2.91 ac/hr**; 5 acres → 1 h 43 min.
- Table: acres per hour for common deck widths (21, 42, 48, 54, 60, 72 in) at 3, 5, 7 mph.
- FAQ: How many acres per hour does a zero-turn mow? · How long does it take to mow 1 acre with a push mower? · What is field efficiency? · Where does the 99 (or 8.25) come from? (explain the derivation: 5,280 ft per mile ÷ 43,560 sq ft per acre)
- Related: lawn mowing cost, topsoil, square yard.

### 11. Gutter Slope Calculator: `/gutter-slope-calculator/`

- Primary: **gutter slope calculator** (1,000, KD 11, CPC $4.73). Secondary: gutter fall calculator (320), gutter pitch.
- Title: `Gutter Slope Calculator – Pitch, Drop & Downspouts`
- Meta: `Find the right gutter slope and total drop for any run length. Get start and end heights, mid-run splits for long gutters, and how many downspouts you need.`
- H1: `Gutter Slope Calculator`
- SERP note: shows an AI Overview, so make the "Show the math" result and the diagram excellent.
- Inputs: gutter run length (ft), slope (presets: ¼" per 10 ft minimum, ½" per 10 ft, ¼" per ft for fast drainage; or custom; `VERIFY` with manufacturer installation guides), downspout position (one end / both ends / middle), roof area draining (optional).
- Formula: `drop_in = (length_ft / 10) × slopeIn_per10ft`. With both-end downspouts, slope from the middle: each half = length / 2. Downspouts: one per 30–40 ft of run, or by roof drainage area (`VERIFY` sizing guidance; e.g. a 2×3" downspout handles about 600 sq ft of roof, 3×4" about 1,200 sq ft, check sources).
- Example: 40 ft run, ¼" per 10 ft → **1" total drop**.
- Diagram: SVG showing the high end, low end and drop.
- Table: drop for common lengths (10–60 ft) at ¼" and ½" per 10 ft.
- FAQ: What is the correct slope for gutters? · Can gutters have too much slope? · How many downspouts do I need? · How do I measure gutter slope? · Should long gutters slope both ways?
- Related: square yard, concrete slab cost, cubic yard.

### 12. Rip Rap Calculator: `/rip-rap-calculator/`

- Primary: **rip rap calculator** (880, KD 4) + riprap calculator (320).
- Title: `Rip Rap Calculator – Tons & Cubic Yards of Riprap`
- Meta: `Estimate riprap for shorelines, ditches and erosion control. Enter length, width and thickness to get cubic yards and tons, with stone class and thickness guide.`
- H1: `Rip Rap Calculator`
- Inputs: length, width/slope length, layer thickness (in or ft), stone size class (light/medium/heavy, with D50 ranges, `VERIFY` with state DOT riprap class tables), density (default ≈1.5 t/cu yd, editable, `VERIFY`), waste %.
- Formula: `cuYd = L × W × (T_in / 12) / 27`; `tons = cuYd × density`. Guidance: thickness ≈ 1.5–2 × D50 (`VERIFY` with USACE/FHWA guidance).
- Example: 50 ft × 6 ft × 12 in → 300 cu ft → **11.1 cu yd ≈ 16.7 tons**.
- Table: typical stone classes, sizes and layer thicknesses (sourced).
- FAQ: How much area does a ton of riprap cover? · What size riprap do I need? · How thick should riprap be? · Do I need filter fabric under riprap? · How much does riprap cost per ton?
- Disclaimer: "For shoreline or channel work, follow your engineer or local permit requirements."
- Related: cubic yard, pea gravel, landscape materials.

### Home page `/`

- Title (no template): `YardageMath – Free Construction & Yard Calculators`
- Meta: `Free, accurate calculators for concrete, blocks, gravel, topsoil, mulch, gutters and lawn care. Get cubic yards, tons, bags and costs in seconds, with the math shown.`
- H1: `Free Construction & Yard Calculators`
- Content: a short intro (2–3 sentences: what the site is and who it's for), category sections with tool cards (name + one-line description + link), "Most popular" row, "Why trust these calculators" (formulas shown, sources cited, updated dates, built by Neo), latest updates list.
- JSON-LD: Organization + WebSite + ItemList of tools.

### Category hubs

Each hub has an H1 (e.g. "Concrete & Block Calculators"), a 100–200-word intro, tool cards, and a short "Which calculator do I need?" section. Titles: `Concrete & Block Calculators`, `Landscaping Material Calculators`, `Lawn Care Calculators`.

## A7. Trust pages (E-E-A-T) and legal pages

### About (`/about/`)

Must include:

- Real owner name (Neo) and photo if comfortable.
- Why you built the site.
- How the calculators are made and checked (link `/how-we-calculate/`).
- Contact email on the domain (hello@yardagemath.com).
- Any relevant experience. Be honest; don't claim to be a contractor if you aren't. "I check every formula against manufacturer and industry sources" is fine.
- Editorial policy: corrections welcome, and how updates happen.

### How We Calculate (`/how-we-calculate/`)

Lists every constant (density, coverage, bag yields, slope rules) with its source link and the date it was checked. It also explains the rounding and waste defaults. This page is a strong trust signal and AI tools cite it.

### Contact (`/contact/`)

Email address + simple form. A static site has no backend, so use a form service (Formspree, Web3Forms or Basin) with a honeypot spam field, no CAPTCHA wall. Expected reply time. No street address needed (it's an online business).

### Privacy Policy (`/privacy-policy/`)

Must cover:

- What's collected (analytics, contact form data), cookies used, and analytics provider (GA4 or other).
- **Google AdSense language** (required once ads run): third-party vendors including Google use cookies to serve ads based on prior visits; Google's advertising cookies let it and its partners serve ads; users can opt out via Google Ads Settings and aboutads.info / youronlinechoices (EU).
- Amazon Associates/affiliate cookies.
- User rights (GDPR/UK GDPR for EU/UK visitors; CCPA/CPRA "do not sell or share" for California).
- Children (not directed at under-13s, COPPA).
- Contact email, effective date.

Use a reputable generator (e.g. Termly, TermsFeed) as a base, then edit it to match the site. Don't copy another site's policy.

### Terms of Use (`/terms/`)

Covers: use of the site, no warranty, limitation of liability, intellectual property, external links, changes, governing law.

### Disclaimer (`/disclaimer/`)

"All results are estimates for planning. Not professional engineering, construction, legal or financial advice. Verify with suppliers, contractors and local building codes." Link it from every calculator.

### Affiliate disclosure (`/affiliate-disclosure/`)

States that the site earns commissions. Once in Amazon Associates, show exactly: "As an Amazon Associate I earn from qualifying purchases." Also add a short disclosure line near any affiliate links on a page.

### Cookie consent

Google requires a Google-certified CMP for visitors in the EEA, UK and Switzerland when serving personalized ads. Easiest option: AdSense's built-in "Privacy & messaging" consent message, enabled when AdSense is approved. If using GA4 before that, implement **Consent Mode v2** with denied defaults for EEA/UK visitors.

## A8. GEO: getting cited by AI search (Google AI Overviews, ChatGPT, Perplexity, Bing Copilot)

1. Quick-answer box with exact numbers on every page (A5 step 3).
2. Use question-style H2/H3s that match real searches ("How many bags of mulch are in a yard?") and answer in the first sentence below.
3. Give facts with units and sources: "1 cubic yard = 27 cubic feet", "112.5 blocks per 100 sq ft". AI tools quote precise, checkable statements.
4. Use tables for comparisons and reference values.
5. Keep the same entity details everywhere (name "YardageMath", logo, founder Neo, email) on site, in schema and on any social profiles.
6. Make sure Bing indexes you (ChatGPT search relies heavily on Bing): Bing Webmaster Tools + IndexNow (Part B).
7. Allow OAI-SearchBot, PerplexityBot and Bingbot in robots.txt.
8. Keep "Last updated" dates visible and honest.
9. Add `/llms.txt` (optional).

## A9. Analytics and measurement (code side)

- Add a cookieless analytics script (Cloudflare Web Analytics is free) and/or **GA4** via `next/script` `afterInteractive`, with Consent Mode v2 defaults for the EEA/UK. The measurement ID goes in an env var `NEXT_PUBLIC_GA_ID`.
- Track a custom event `calculate` (tool slug) on first result change, plus `copy_result` and `share_link`. This shows which tools people actually use.
- No session-recording tools at launch (they slow pages down; add Microsoft Clarity later if needed).

## A10. Monetization-ready code (build now, switch on later)

- `AdSlot` component: reserved heights (e.g. 280 px mobile below the result, a sidebar slot on desktop, one in-content slot after the formula section). It renders nothing until `NEXT_PUBLIC_ADSENSE_ID` is set.
- **Never place ads between the inputs and the result**, and never above the calculator on mobile. It hurts UX and can break ad policies.
- `/ads.txt` served from `public/ads.txt` (content added after AdSense approval: `google.com, pub-XXXXXXXX, DIRECT, f08c47fec0942fa0`).
- Affiliate link component: adds `rel="sponsored nofollow noopener"` and `target="_blank"`, and shows a disclosure line.

## A11. Quality: tests and launch checks (agent must run all)

1. **Unit tests** for every formula: at least the worked example on each page plus edge cases (zero, decimals, inches over 12, metric). The worked examples in A6 must match the test output exactly (rounded to 2 decimals).
2. `next build` with zero TypeScript or ESLint errors.
3. Lighthouse mobile ≥ 95 on all four categories, on home + 3 tool pages.
4. Validate schema on every template (Rich Results Test + validator.schema.org).
5. Crawl the built site (Screaming Frog free mode, up to 500 URLs, or `npx linkinator`): no broken links, no redirect chains, every page has a unique title and meta description, one H1, a self-referencing canonical, and is in the sitemap.
6. Mobile check at 360 px width: no horizontal scroll, tap targets ≥ 44 px, calculator usable one-handed.
7. View-source check: the H1, quick answer, default result, FAQ and tables are all in the raw HTML.
8. 404 page returns HTTP 404 (not 200).
9. `https://yardagemath.com/sitemap.xml`, `/robots.txt`, `/llms.txt` and `/ads.txt` all load.
10. www and http both 301 to `https://yardagemath.com/`.
11. Spell-check and number-check every page (an owner review is required).

## A12. Definition of done for today

- [ ] 12 calculator pages live, tested, owner-reviewed
- [ ] Home + 3 category hubs
- [ ] About, Contact (working form), Privacy, Terms, Disclaimer, Affiliate Disclosure, How We Calculate, HTML sitemap, custom 404
- [ ] XML sitemap, robots.txt, llms.txt, favicon/manifest, OG images
- [ ] JSON-LD on all templates, validated
- [ ] Analytics installed
- [ ] Lighthouse ≥ 95, all A11 checks pass
- [ ] Deployed on HTTPS at the apex domain

---

# PART B: BROWSER TASKS (Claude does these in your Chrome)

Claude can navigate, click through settings and fill non-sensitive fields. **You** must: create accounts, enter passwords, enter payment details, and approve purchases. Claude will ask before any submit/confirm click.

## B1. Today: domain and hosting

1. **Buy yardagemath.com** at Hostinger (you complete payment). Check the renewal price; turn on WHOIS privacy (usually free) and auto-renew.
2. **Create a Cloudflare account** (you), then add yardagemath.com to Cloudflare (Free plan). Claude walks through it.
3. At Hostinger, **change the nameservers** to the two Cloudflare nameservers Cloudflare shows (Claude does this in the Hostinger panel once you're logged in). Propagation takes minutes to hours.
4. **Cloudflare Pages:** connect the GitHub repo (you authorize GitHub). Build command `npx next build`, output directory `out`. Add the custom domain `yardagemath.com` (and `www`).
5. Cloudflare settings (Claude): SSL/TLS = Full (strict); Always Use HTTPS = on; HSTS on (after you confirm the site works); a redirect rule `www.yardagemath.com/*` → `https://yardagemath.com/$1` (301); Brotli on; Web Analytics on.
6. **Email:** Cloudflare Email Routing so hello@yardagemath.com forwards to your Gmail (free). Then in Gmail, set "Send mail as" so you can reply from it (needs an app password or SMTP; you enter that).

## B2. Today, after the site is live: Google and Bing

7. **Google Search Console:** add a *Domain* property `yardagemath.com`, verify by DNS TXT record (Claude copies the TXT into Cloudflare DNS). Submit `https://yardagemath.com/sitemap.xml`. Use **URL Inspection → Request indexing** for the homepage and the 12 calculator pages (there's a daily limit of roughly 10–12 requests, so finish the rest tomorrow).
8. **Bing Webmaster Tools:** "Import from Google Search Console" (fastest), submit the sitemap, and turn on **IndexNow** through Cloudflare (Caching → Configuration → Crawler Hints) so Bing and Yandex hear about updates automatically.
9. **Google Analytics 4** (if using GA4): create the property and a web data stream for `https://yardagemath.com`, copy the Measurement ID into the agent's env var, and link GA4 to Search Console.
10. Check in Search Console: the sitemap shows "Success", and URL Inspection shows "URL is on Google" or "Discovered" for the inspected pages. The Page indexing report usually takes a few days to fill in.

## B3. This week

11. **Rich Results Test / PageSpeed Insights** on live URLs (Claude runs them and reports issues to fix).
12. **Brand profiles** for entity consistency (you create the accounts; Claude fills the bios): Pinterest business account (DIY and landscaping do well there), and optionally YouTube or X. Use the same name, logo and link everywhere, then add them to the Organization `sameAs`.
13. **Google Business Profile:** not needed (it's an online tool, not a local business).

## B4. After 15–20 solid pages and some traffic (weeks 2–6)

14. **Google AdSense:** apply with the site URL, add the `ads.txt` line, and set up the "Privacy & messaging" EU/UK consent message. Claude prepares everything; you submit.
15. **Amazon Associates (US):** apply once the site has content and some traffic. Check eligibility and payout options for Pakistan-based publishers on the signup page. Add the required disclosure.
16. **Mediavine Journey:** apply at 1,000+ monthly sessions (per Mediavine's stated requirement).

## B5. Ongoing (weekly, Claude can run these with you)

17. Search Console → Performance → filter positions 8–20 → list queries to add as H2s/FAQs on the page that already ranks.
18. Page indexing report: fix any "Crawled – currently not indexed" pages by improving them (more examples, a better table, more internal links).
19. Semrush: re-check rankings and the weak competitors' new pages, and add the next tools from the keyword plan spreadsheet (priority 2 list).
20. Link building, the real kind: find DIY blogs and forums that link to older calculators (Semrush Backlink Analytics on calculatorsoup.com and omnicalculator.com filtered to DIY sites) and draft outreach emails for you to send.

---

# PART C: AFTER LAUNCH (next 30 days)

- **Next 10 tools** (from the plan spreadsheet): concrete block weight chart, yards of concrete calculator, concrete slab/pad calculator, concrete footing calculator, mortar calculator, flooring calculator, GPM calculator, stone weight calculator, slope (drainage/shower) calculator, cinder block fill calculator.
- **Supporting guides** (2–3 per week, each linking to its tool): "how much is a yard of concrete (2026 prices)", "cost of a 30×30 concrete slab", "CMU block sizes chart", "how deep should mulch be", "best time to aerate lawn".
- **Seasonality:** concrete, landscaping and lawn searches rise in spring. Have the core tools indexed by January–February 2027.
- **Don't:** buy links, publish unreviewed bulk AI pages, add fake ratings, put pop-ups over the calculator, or change URLs.

## Realistic expectations

- Indexing: days to a few weeks. First impressions in Search Console: weeks 2–6.
- First page-one rankings for low-KD tools: around months 2–4.
- Income (from the plan spreadsheet): priority-1 pages roughly $150–350/month once ranking; all 52 planned pages roughly $280–640/month in ads, plus affiliate income. These are estimates, not guarantees, and the low-CPC keywords (cubic yard, gravel, topsoil) pull the average toward the low end.
