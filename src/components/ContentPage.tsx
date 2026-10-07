import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { fmtDate } from "@/lib/format";

/** Shared layout for article/legal/trust pages: breadcrumbs, H1, narrow prose. */
export function ContentPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-content" style={{ paddingTop: "1.5rem", paddingBottom: "2rem" }}>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: title }]} />
      <div className="prose" style={{ maxWidth: "var(--reading-max-width)" }}>
        <h1 className="page-h1" style={{ marginBottom: intro ? "0.5rem" : "1rem" }}>
          {title}
        </h1>
        {intro && <p style={{ fontSize: "1.0625rem", color: "var(--text-secondary)" }}>{intro}</p>}
        {updated && (
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "-0.25rem" }}>
            Last updated: <time dateTime={updated}>{fmtDate(updated)}</time>
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
