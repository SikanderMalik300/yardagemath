import type { CategorySlug } from "@/data/calculators";
import { categories, calculatorsInCategory } from "@/data/calculators";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ToolCard } from "@/components/layout/ToolCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { collectionPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export function HubPage({ slug }: { slug: CategorySlug }) {
  const category = categories[slug];
  const tools = calculatorsInCategory(slug);

  return (
    <div className="container-content" style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
      <JsonLd
        data={[
          collectionPageJsonLd(category, tools),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: category.title, path: `/${slug}/` },
          ]),
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

      <section className="prose" style={{ maxWidth: "var(--reading-max-width)" }}>
        <h2>Which calculator do I need?</h2>
        <dl>
          {category.whichOne.map((item, i) => (
            <div key={i} style={{ marginBottom: "1rem" }}>
              <dt style={{ fontWeight: 600, color: "var(--text-primary)" }}>{item.q}</dt>
              <dd style={{ margin: "0.25rem 0 0", color: "var(--text-secondary)" }}>{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
