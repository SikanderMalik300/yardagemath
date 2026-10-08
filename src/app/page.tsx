import Link from "next/link";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolCard } from "@/components/layout/ToolCard";
import { AdSlot } from "@/components/layout/AdSlot";
import { HomeSearch } from "@/components/HomeSearch";
import {
  calculators,
  categoryList,
  calculatorsInCategory,
  getCalculator,
  popularSlugs,
  type CategorySlug,
} from "@/data/calculators";
import { fmtDate } from "@/lib/format";

const CATEGORY_BLURB: Record<CategorySlug, string> = {
  concrete: "Estimate slabs, blocks and full walls — cubic yards, block counts, mortar and cost.",
  landscaping: "Work out soil, gravel, mulch, stone and square yards from your area and depth.",
  lawn: "Price a mow, or work out how fast you can cover a lawn or field.",
};

const POPULAR_ANSWERS: { fact: string; href: string; cta: string }[] = [
  { fact: "1 cubic yard covers 108 sq ft at 3 in deep", href: "/cubic-yard-calculator/", cta: "Cubic Yard Calculator" },
  { fact: "112.5 blocks per 100 sq ft of wall", href: "/concrete-block-calculator/", cta: "Concrete Block Calculator" },
  { fact: "≈45 bags of 80-lb concrete per cubic yard", href: "/concrete-slab-cost-calculator/", cta: "Slab Cost Calculator" },
];

export const metadata = buildMetadata({
  title: "YardageMath – Free Construction & Yard Calculators",
  description:
    "Free calculators for concrete, blocks, gravel, topsoil, mulch, gutters and lawn care. Get cubic yards, tons, bags and costs fast, with the math shown.",
  path: "/",
  absoluteTitle: true,
});

function SectionHeading({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} style={{ fontSize: "1.5rem", marginBottom: "1rem", marginTop: 0 }}>
      {children}
    </h2>
  );
}

export default function HomePage() {
  const popular = popularSlugs.map((s) => getCalculator(s)).filter(Boolean);
  const latest = [...calculators]
    .sort((a, b) => (a.lastUpdated < b.lastUpdated ? 1 : -1))
    .slice(0, 6);

  return (
    <div className="container-content" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
      <JsonLd data={itemListJsonLd(calculators)} />

      {/* Compact intro — no marketing hero (design.md §10) */}
      <section style={{ marginBottom: "2rem", maxWidth: "var(--reading-max-width)" }}>
        <h1 className="page-h1" style={{ marginBottom: "0.75rem" }}>
          Free Construction &amp; Yard Calculators
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.0625rem" }}>
          Fast, accurate calculators for concrete, blocks, gravel, topsoil, mulch, gutters and
          lawn care. Enter your measurements and get cubic yards, tons, bags and costs in
          seconds — with the formula shown so you can check every result. Built for homeowners,
          contractors and landscapers in the US.
        </p>
        <HomeSearch />
      </section>

      {/* Popular answers (featured-snippet facts + internal links) */}
      <section aria-labelledby="popular-answers" style={{ marginBottom: "2.5rem" }}>
        <h2 id="popular-answers" style={{ fontSize: "1.125rem", marginBottom: "0.75rem" }}>
          Popular answers
        </h2>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.5rem" }}>
          {POPULAR_ANSWERS.map((a) => (
            <li
              key={a.href}
              style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "baseline", fontSize: "0.9375rem" }}
            >
              <span style={{ color: "var(--text-secondary)" }}>{a.fact}</span>
              <span aria-hidden="true" style={{ color: "var(--text-muted)" }}>→</span>
              <Link href={a.href} style={{ fontWeight: 600 }}>
                {a.cta}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Most popular */}
      <section style={{ marginBottom: "2.5rem" }}>
        <SectionHeading>Most popular calculators</SectionHeading>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}>
          {popular.map((c) => c && <ToolCard key={c.slug} cal={c} />)}
        </div>
      </section>

      <AdSlot minHeight={120} />

      {/* Category sections */}
      {categoryList.map((cat) => (
        <section key={cat.slug} style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem" }}>
            <SectionHeading>{cat.title}</SectionHeading>
            <Link href={`/${cat.slug}/`} style={{ fontSize: "0.875rem", fontWeight: 600, flexShrink: 0 }}>
              View all →
            </Link>
          </div>
          <p style={{ color: "var(--text-secondary)", marginTop: "-0.5rem", marginBottom: "1rem", fontSize: "0.9375rem", maxWidth: "var(--reading-max-width)" }}>
            {CATEGORY_BLURB[cat.slug]}
          </p>
          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}>
            {calculatorsInCategory(cat.slug).map((c) => (
              <ToolCard key={c.slug} cal={c} showCategory={false} />
            ))}
          </div>
        </section>
      ))}

      {/* Trust / methodology */}
      <section
        style={{
          marginBottom: "2.5rem",
          padding: "1.5rem",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          background: "var(--surface)",
        }}
      >
        <SectionHeading>Why trust these calculators</SectionHeading>
        <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div>
            <h3 style={{ fontSize: "1.0625rem", marginBottom: "0.375rem" }}>The math is shown</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
              Every tool has a &ldquo;Show the math&rdquo; panel with your numbers plugged into the
              formula — nothing is hidden.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: "1.0625rem", marginBottom: "0.375rem" }}>Sources are cited</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
              Densities, bag yields and slope rules come from manufacturer and industry sources,
              listed on <Link href="/how-we-calculate/">How We Calculate</Link>.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: "1.0625rem", marginBottom: "0.375rem" }}>Kept up to date</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9375rem" }}>
              Each page shows when it was last reviewed. Built and maintained by{" "}
              <Link href="/about/">Sikander Mushtaq</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Latest updates */}
      <section style={{ marginBottom: "1rem" }}>
        <SectionHeading>Latest updates</SectionHeading>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.5rem" }}>
          {latest.map((c) => (
            <li
              key={c.slug}
              style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "0.9375rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}
            >
              <Link href={`/${c.slug}/`}>{c.h1.replace(/\s*\(.*\)/, "")}</Link>
              <time dateTime={c.lastUpdated} style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                {fmtDate(c.lastUpdated)}
              </time>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
