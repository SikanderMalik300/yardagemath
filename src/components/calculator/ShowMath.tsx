import type { ReactNode } from "react";

/**
 * "Show the math" disclosure (build-spec A5 step 4, design.md §8).
 * Native <details> — closed by default, keyboard accessible, zero JS, and the
 * content is present in the static HTML for crawlers.
 */
export function ShowMath({ children }: { children: ReactNode }) {
  return (
    <details style={{ marginTop: "1rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
      <summary
        style={{
          padding: "0.75rem 1rem",
          fontWeight: 600,
          fontSize: "0.9375rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "var(--text-primary)",
        }}
      >
        <span>Show the math</span>
        <span aria-hidden="true" style={{ color: "var(--text-muted)" }}>
          ▾
        </span>
      </summary>
      <div
        style={{
          padding: "0.25rem 1rem 1rem",
          background: "var(--surface-muted)",
          fontSize: "0.875rem",
          color: "var(--text-secondary)",
          lineHeight: 1.7,
        }}
      >
        {children}
      </div>
    </details>
  );
}

/** A single math line "label = value" with monospace value. */
export function MathLine({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", padding: "0.125rem 0" }}>
      {children}
    </div>
  );
}
