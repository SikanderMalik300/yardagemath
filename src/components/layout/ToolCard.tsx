import Link from "next/link";
import type { Calculator } from "@/data/calculators";
import { categories } from "@/data/calculators";

/** Compact, consistent tool card (design.md §10). */
export function ToolCard({ cal, showCategory = true }: { cal: Calculator; showCategory?: boolean }) {
  return (
    <Link href={`/${cal.slug}/`} prefetch={false} className="tool-card">
      <div>
        {showCategory && (
          <span
            style={{
              display: "inline-block",
              fontSize: "0.6875rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "var(--brand)",
              background: "var(--brand-soft)",
              padding: "0.125rem 0.5rem",
              borderRadius: "999px",
              marginBottom: "0.5rem",
            }}
          >
            {categories[cal.category].title.replace(" Calculators", "")}
          </span>
        )}
        <div style={{ fontSize: "1.0625rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>
          {cal.h1.replace(/\s*\(.*\)/, "")}
        </div>
        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "0.375rem" }}>
          {cal.cardDescription}
        </p>
      </div>
      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--brand)" }}>
        Open calculator →
      </span>
    </Link>
  );
}
