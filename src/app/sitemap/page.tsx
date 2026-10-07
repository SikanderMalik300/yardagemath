import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { categoryList, calculatorsInCategory } from "@/data/calculators";

export const metadata = buildMetadata({
  title: "All Calculators & Pages",
  description:
    "A complete list of every calculator and page on YardageMath, organized by category — concrete and block, landscaping, and lawn care tools.",
  path: "/sitemap/",
});

const TRUST = [
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
  { label: "How We Calculate", href: "/how-we-calculate/" },
];
const LEGAL = [
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Terms of Use", href: "/terms/" },
  { label: "Disclaimer", href: "/disclaimer/" },
  { label: "Affiliate Disclosure", href: "/affiliate-disclosure/" },
];

function LinkList({ items }: { items: { label: string; href: string }[] }) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.5rem" }}>
      {items.map((i) => (
        <li key={i.href}>
          <Link href={i.href}>{i.label}</Link>
        </li>
      ))}
    </ul>
  );
}

export default function SitemapPage() {
  return (
    <div className="container-content" style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "All calculators" }]} />
      <h1 className="page-h1" style={{ marginBottom: "0.75rem" }}>
        All calculators &amp; pages
      </h1>
      <p style={{ color: "var(--text-secondary)", maxWidth: "var(--reading-max-width)", marginBottom: "2rem" }}>
        Every tool and page on YardageMath, grouped by category.
      </p>

      <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {categoryList.map((cat) => (
          <section key={cat.slug}>
            <h2 style={{ fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              <Link href={`/${cat.slug}/`}>{cat.title}</Link>
            </h2>
            <LinkList
              items={calculatorsInCategory(cat.slug).map((c) => ({
                label: c.h1.replace(/\s*\(.*\)/, ""),
                href: `/${c.slug}/`,
              }))}
            />
          </section>
        ))}

        <section>
          <h2 style={{ fontSize: "1.125rem", marginBottom: "0.75rem" }}>About &amp; methodology</h2>
          <LinkList items={TRUST} />
        </section>

        <section>
          <h2 style={{ fontSize: "1.125rem", marginBottom: "0.75rem" }}>Legal</h2>
          <LinkList items={LEGAL} />
        </section>
      </div>
    </div>
  );
}
