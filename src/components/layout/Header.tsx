import Link from "next/link";
import { Logo } from "./Logo";

const NAV = [
  { label: "Calculators", href: "/sitemap/" },
  { label: "Concrete", href: "/concrete/" },
  { label: "Landscaping", href: "/landscaping/" },
  { label: "Lawn", href: "/lawn/" },
  { label: "How We Calculate", href: "/how-we-calculate/" },
  { label: "About", href: "/about/" },
] as const;

/**
 * Site header. Desktop nav inline; mobile nav uses a native <details> panel
 * so it works with zero JavaScript and is fully keyboard accessible.
 */
export function Header() {
  return (
    <header
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        className="container-content"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 64 }}
      >
        <Logo />

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:block">
          <ul style={{ display: "flex", gap: "1.25rem", alignItems: "center", listStyle: "none", margin: 0, padding: 0 }}>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile nav (native disclosure) */}
        <details className="md:hidden" style={{ position: "relative" }}>
          <summary
            aria-label="Open menu"
            className="button-secondary"
            style={{ minHeight: 44, minWidth: 44, listStyle: "none", padding: "0.5rem 0.75rem" }}
          >
            <span aria-hidden="true" style={{ fontSize: "1.1rem", lineHeight: 1 }}>
              ☰
            </span>
            <span style={{ fontSize: "0.9375rem" }}>Menu</span>
          </summary>
          <nav
            aria-label="Mobile"
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 0.5rem)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-card)",
              minWidth: 220,
              padding: "0.5rem",
            }}
          >
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      display: "block",
                      padding: "0.625rem 0.75rem",
                      borderRadius: "var(--radius-sm)",
                      color: "var(--text-primary)",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
