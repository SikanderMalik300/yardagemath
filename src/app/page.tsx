import Link from "next/link";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolCard } from "@/components/layout/ToolCard";
import { AdSlot } from "@/components/layout/AdSlot";
import {
  calculators,
  categoryList,
  calculatorsInCategory,
  getCalculator,
  popularSlugs,
} from "@/data/calculators";
import { fmtDate } from "@/lib/format";

export const metadata = buildMetadata({
  title: "YardageMath – Free Construction & Yard Calculators",
  description:
    "Free, accurate calculators for concrete, blocks, gravel, topsoil, mulch, gutters and lawn care. Get cubic yards, tons, bags and costs in seconds, with the math shown.",
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
              Each page shows when it was last reviewed. Built and maintained by Neo —{" "}
              <Link href="/about/">about the site</Link>.
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
