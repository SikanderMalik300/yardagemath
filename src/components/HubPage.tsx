import Link from "next/link";
import type { CategorySlug } from "@/data/calculators";
import { categories, calculatorsInCategory, getCalculator } from "@/data/calculators";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ToolCard } from "@/components/layout/ToolCard";
import { FaqSection } from "@/components/calculator/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { collectionPageJsonLd, breadcrumbJsonLd, hubWebPageJsonLd, absUrl } from "@/lib/seo";
import { SITE } from "@/lib/constants";
import { fmtDate } from "@/lib/format";

export function HubPage({ slug }: { slug: CategorySlug }) {
  const category = categories[slug];
  const tools = calculatorsInCategory(slug);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: category.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="container-content" style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
      <JsonLd
        data={[
          collectionPageJsonLd(category, tools),
          hubWebPageJsonLd(category),
          breadcrumbJsonLd(
            [
              { name: "Home", path: "/" },
              { name: category.title, path: `/${slug}/` },
            ],
            `${absUrl(`/${slug}/`)}#breadcrumb`
          ),
          faqJsonLd,
        ]}
      />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: category.title }]} />

      <h1 className="page-h1" style={{ marginBottom: "0.75rem" }}>
        {category.h1}
      </h1>
      <p style={{ color: "var(--text-secondary)", maxWidth: "var(--reading-max-width)", marginBottom: "2rem" }}>
        {category.intro}
      </p>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", marginBottom: "2.5rem" }}>
        {tools.map((c) => (
          <ToolCard key={c.slug} cal={c} showCategory={false} />
        ))}
      </div>

      <section style={{ marginBottom: "1rem" }}>
        <div className="table-wrapper">
          <table>
            <caption style={{ captionSide: "top", textAlign: "left", fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem", color: "var(--text-primary)" }}>
              Which calculator do I need?
            </caption>
            <thead>
              <tr>
                <th scope="col">Your project</th>
                <th scope="col">Use this calculator</th>
              </tr>
            </thead>
            <tbody>
              {category.whichTool.map((item, i) => {
                const tool = getCalculator(item.slug);
                return (
                  <tr key={i}>
                    <th scope="row" style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                      {item.project}
                    </th>
                    <td>
                      <Link href={`/${item.slug}/`} prefetch={false}>{tool ? tool.h1.replace(/\s*\(.*\)/, "") : item.slug}</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <FaqSection faqs={category.faqs} />

      <p style={{ marginTop: "1.5rem", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
        Last updated {fmtDate(category.lastUpdated)}. Estimates for planning. Built and maintained by{" "}
        <Link href="/about/" prefetch={false}>{SITE.founder}</Link>.
      </p>
    </div>
  );
}
