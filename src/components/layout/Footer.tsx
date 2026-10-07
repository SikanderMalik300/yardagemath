import Link from "next/link";
import { categoryList, calculatorsInCategory } from "@/data/calculators";
import { SITE } from "@/lib/constants";

const LEGAL = [
  { label: "Privacy Policy", href: "/privacy-policy/" },
  { label: "Terms of Use", href: "/terms/" },
  { label: "Disclaimer", href: "/disclaimer/" },
  { label: "Affiliate Disclosure", href: "/affiliate-disclosure/" },
] as const;

const SITE_LINKS = [
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
  { label: "How We Calculate", href: "/how-we-calculate/" },
  { label: "All Calculators", href: "/sitemap/" },
] as const;

export function Footer() {
  const year = 2026; // build-time constant; bump on a real content update

  return (
    <footer className="site-footer" style={{ marginTop: "4rem", borderTop: "1px solid var(--border)", background: "#eef1ee", color: "var(--text-secondary)" }}>
      <div className="container-content" style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
        <div
          style={{
            display: "grid",
            gap: "2rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <div>
            <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
              YardageMath
            </div>
            <p style={{ fontSize: "0.875rem", maxWidth: 260 }}>
              Free, accurate construction and yard calculators with the math shown. Estimates
              for planning — always confirm with your supplier.
            </p>
          </div>

          {categoryList.map((cat) => (
            <div key={cat.slug}>
              <div style={{ fontSize: "0.8125rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.625rem" }}>
                {cat.title}
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.375rem", fontSize: "0.875rem" }}>
                {calculatorsInCategory(cat.slug).map((c) => (
                  <li key={c.slug}>
                    <Link href={`/${c.slug}/`}>{c.h1.replace(/\s*\(.*\)/, "")}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <div style={{ fontSize: "0.8125rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.625rem" }}>
              Site
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.375rem", fontSize: "0.875rem" }}>
              {SITE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{ fontSize: "0.8125rem", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--text-muted)", fontWeight: 600, marginBottom: "0.625rem" }}>
              Legal
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.375rem", fontSize: "0.875rem" }}>
              {LEGAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: "2rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)", fontSize: "0.8125rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "space-between" }}>
          <span>
            © {year} {SITE.name}. Built and maintained by {SITE.founder}.
          </span>
          <span>
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
