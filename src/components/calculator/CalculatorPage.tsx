import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Calculator } from "@/data/calculators";
import { categories } from "@/data/calculators";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RelatedTools } from "@/components/layout/RelatedTools";
import { AuthorBox, DisclaimerLine } from "@/components/layout/AuthorBox";
import { AdSlot } from "@/components/layout/AdSlot";
import { FaqSection } from "./Faq";
import { RefTableView } from "./RefTableView";
import { Diagram } from "@/components/diagrams/Diagram";
import { ToolSources } from "@/components/SourcesList";
import { sourcesForTool } from "@/lib/sources";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbJsonLd,
  webApplicationJsonLd,
  faqJsonLd,
} from "@/lib/seo";

/**
 * On-page template shared by every calculator page (build-spec A5).
 * The interactive calculator is passed as `children` and includes a default
 * example result in the initial static HTML.
 */
export function CalculatorPage({ cal, children }: { cal: Calculator; children: ReactNode }) {
  const category = categories[cal.category];
  const crumbs = [
    { name: "Home", href: "/" },
    { name: category.title.replace(" Calculators", ""), href: `/${category.slug}/` },
    { name: cal.h1.replace(/\s*\(.*\)/, "") },
  ];

  return (
    <article className="container-content" style={{ paddingTop: "1.5rem", paddingBottom: "2rem", maxWidth: "var(--calculator-max-width)" }}>
      <JsonLd
        data={[
          webApplicationJsonLd(cal),
          // Names match the visible breadcrumb text exactly (audit Task 6).
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: category.title.replace(" Calculators", ""), path: `/${category.slug}/` },
            { name: cal.h1.replace(/\s*\(.*\)/, ""), path: `/${cal.slug}/` },
          ]),
          faqJsonLd(cal),
        ]}
      />

      {/* 1. Breadcrumbs */}
      <Breadcrumbs items={crumbs} />

      {/* 2. H1 */}
      <h1 className="page-h1" style={{ marginBottom: "0.75rem" }}>
        {cal.h1}
      </h1>

      {/* 3. Quick answer (GEO block) */}
      <div className="quick-answer" style={{ marginBottom: "1.5rem", maxWidth: "var(--reading-max-width)" }}>
        <p style={{ margin: 0, fontSize: "1rem" }}>{cal.shortAnswer}</p>
      </div>

      {/* 4. The calculator (above the fold on mobile) */}
      {children}

      {/* 5. How to use */}
      <section style={{ marginTop: "2.5rem" }} className="prose">
        <h2>How to use this calculator</h2>
        <ol>
          {cal.howTo.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      {/* 6. Formula + worked example, with diagram */}
      <section style={{ marginTop: "1.5rem" }}>
        <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "minmax(0,1fr)", alignItems: "start" }} className="formula-grid">
          <div className="prose" style={{ maxWidth: "var(--reading-max-width)" }}>
            <h2>Formula</h2>
            <div
              style={{
                background: "var(--surface-muted)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "1rem",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                overflowX: "auto",
              }}
            >
              {cal.formula.plain.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
            <h3>Worked example</h3>
            <div
              style={{
                background: "var(--brand-soft)",
                border: "1px solid #cfe1d6",
                borderRadius: "var(--radius-sm)",
                padding: "1rem",
                fontSize: "0.9375rem",
                lineHeight: 1.7,
              }}
            >
              {cal.formula.example.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
            {cal.formula.example2 && (
              <>
                <h3>Second example</h3>
                <div
                  style={{
                    background: "var(--surface-muted)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "1rem",
                    fontSize: "0.9375rem",
                    lineHeight: 1.7,
                  }}
                >
                  {cal.formula.example2.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div style={{ paddingTop: "2.5rem" }}>
            <Diagram slug={cal.slug} category={cal.category} alt={cal.imageAlt} />
          </div>
        </div>
      </section>

      {/* What this calculator doesn't cover (after worked examples, before tables) */}
      {cal.notCovered && (
        <section className="prose" style={{ marginTop: "1.5rem", maxWidth: "var(--reading-max-width)" }}>
          <h2>What this calculator doesn&apos;t cover</h2>
          <p>{cal.notCovered}</p>
        </section>
      )}

      {/* In-content ad slot (after the formula section — never between inputs and results) */}
      <AdSlot minHeight={120} />

      {/* 7. Reference table(s) */}
      <section style={{ marginTop: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Reference tables</h2>
        {cal.tables.map((t, i) => (
          <RefTableView key={i} table={t} />
        ))}
        {cal.commonSizes && <RefTableView table={cal.commonSizes} />}
      </section>

      {/* Personal note from the owner, with optional photo (shown only where provided) */}
      {(cal.fromSikander || cal.fromSikanderImage) && (
        <aside
          aria-label="A note from Sikander"
          style={{
            marginTop: "2rem",
            borderLeft: "3px solid var(--brand)",
            borderRadius: "var(--radius-sm)",
            background: "var(--brand-soft)",
            padding: "1rem 1.125rem",
            maxWidth: "var(--reading-max-width)",
          }}
        >
          <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            From Sikander
          </div>
          {cal.fromSikanderImage ? (
            <figure style={{ display: "flex", gap: "1rem", alignItems: "flex-start", margin: 0 }}>
              <Image
                src={cal.fromSikanderImage.src}
                alt={cal.fromSikanderImage.alt}
                width={cal.fromSikanderImage.width}
                height={cal.fromSikanderImage.height}
                loading="lazy"
                style={{ borderRadius: "var(--radius-sm)", flexShrink: 0, height: "auto" }}
              />
              <figcaption style={{ margin: 0, color: "var(--text-secondary)" }}>
                {cal.fromSikander}
              </figcaption>
            </figure>
          ) : (
            <p style={{ margin: 0, color: "var(--text-secondary)" }}>{cal.fromSikander}</p>
          )}
        </aside>
      )}

      {/* 8. Tips / buying advice */}
      <section className="prose" style={{ marginTop: "1.5rem" }}>
        <h2>Tips &amp; buying advice</h2>
        <ul>
          {cal.tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </section>

      {/* Optional warning note */}
      {cal.warning && (
        <p className="notice notice-warning" style={{ marginTop: "1rem", maxWidth: "var(--reading-max-width)" }}>
          {cal.warning}
        </p>
      )}

      {/* 9. FAQ */}
      <FaqSection faqs={cal.faqs} />

      {/* 10. Related calculators */}
      <RelatedTools cal={cal} />

      {/* Sources (citations for this tool's figures) */}
      <ToolSources sources={sourcesForTool(cal.slug)} />

      {/* 11. Author & update box */}
      <AuthorBox sources={cal.sources} lastUpdated={cal.lastUpdated} />

      {/* 12. Disclaimer line */}
      <DisclaimerLine />

      <p style={{ marginTop: "0.75rem", fontSize: "0.8125rem" }}>
        <Link href={`/${category.slug}/`} prefetch={false}>← Back to {category.title}</Link>
      </p>
    </article>
  );
}
