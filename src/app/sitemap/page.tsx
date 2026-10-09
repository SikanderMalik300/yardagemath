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
  { label: "About", href: "/about/", desc: "Who builds and tests the calculators, and how." },
  { label: "Sikander Mushtaq (author)", href: "/authors/sikander-mushtaq/", desc: "The author who builds and maintains every tool." },
  { label: "Contact", href: "/contact/", desc: "Send a question, suggestion or correction." },
  { label: "How We Calculate", href: "/how-we-calculate/", desc: "Every formula and figure with its source and date." },
  { label: "Editorial Policy", href: "/editorial-policy/", desc: "How pages are written, checked, sourced and corrected." },
];
const LEGAL = [
  { label: "Privacy Policy", href: "/privacy-policy/", desc: "What we collect, cookies, analytics and your rights." },
  { label: "Terms of Use", href: "/terms/", desc: "The terms governing use of the site." },
  { label: "Disclaimer", href: "/disclaimer/", desc: "Results are estimates for planning only." },
  { label: "Affiliate Disclosure", href: "/affiliate-disclosure/", desc: "How the site may earn from some links." },
];

function LinkList({ items }: { items: { label: string; href: string; desc: string }[] }) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.75rem" }}>
      {items.map((i) => (
        <li key={i.href}>
          <Link href={i.href} style={{ fontWeight: 600 }}>
            {i.label}
          </Link>
          <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>{i.desc}</div>
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
        Every tool and page on YardageMath, grouped by category, with a one-line description.
      </p>

      <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        {categoryList.map((cat) => (
          <section key={cat.slug}>
            <h2 style={{ fontSize: "1.125rem", marginBottom: "0.75rem" }}>
              <Link href={`/${cat.slug}/`}>{cat.title}</Link>
            </h2>
            <LinkList
              items={calculatorsInCategory(cat.slug).map((c) => ({
                label: c.h1.replace(/\s*\(.*\)/, ""),
                href: `/${c.slug}/`,
                desc: c.cardDescription,
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
