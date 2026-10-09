import Link from "next/link";

export interface Crumb {
  name: string;
  href?: string; // omit for the current page
}

/** Breadcrumbs — small, muted, above the H1 (design.md §6). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: "0.75rem" }}>
      <ol
        style={{
          listStyle: "none",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.375rem",
          margin: 0,
          padding: 0,
          fontSize: "0.8125rem",
          color: "var(--text-muted)",
        }}
      >
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              {item.href && !last ? (
                <Link href={item.href} prefetch={false} style={{ color: "var(--text-secondary)" }}>
                  {item.name}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} style={{ color: "var(--text-muted)" }}>
                  {item.name}
                </span>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
