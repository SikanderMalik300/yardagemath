import type { Source } from "@/lib/sources";
import { fmtDate } from "@/lib/format";
import { OutboundLink } from "@/components/OutboundLink";

/** Renders a citation list. Links open in a new tab with rel="noopener" and are NOT nofollowed. */
export function SourcesList({ sources, compact = false }: { sources: Source[]; compact?: boolean }) {
  if (sources.length === 0) return null;
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: compact ? "0.375rem" : "0.5rem" }}>
      {sources.map((s) => (
        <li key={s.id} style={{ fontSize: compact ? "0.8125rem" : "0.875rem", color: "var(--text-secondary)" }}>
          <OutboundLink href={s.url} style={{ textDecoration: "underline" }}>
            {s.publisher}: {s.title}
          </OutboundLink>
          <span style={{ color: "var(--text-muted)" }}> — accessed {fmtDate(s.checked)}</span>
        </li>
      ))}
    </ul>
  );
}

/** Per-tool "Sources" block for calculator pages (audit P1 #1). */
export function ToolSources({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;
  return (
    <section
      aria-labelledby="sources-heading"
      style={{
        marginTop: "1.5rem",
        padding: "1.125rem 1.25rem",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        background: "var(--surface)",
      }}
    >
      <h2 id="sources-heading" style={{ fontSize: "1.0625rem", marginTop: 0, marginBottom: "0.625rem" }}>
        Sources
      </h2>
      <SourcesList sources={sources} compact />
    </section>
  );
}
