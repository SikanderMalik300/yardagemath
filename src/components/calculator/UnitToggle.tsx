"use client";

export type UnitSystem = "us" | "metric";

/** Segmented control for unit system (design.md §7). Text labels, not flags. */
export function UnitToggle({
  value,
  onChange,
}: {
  value: UnitSystem;
  onChange: (v: UnitSystem) => void;
}) {
  const options: { value: UnitSystem; label: string }[] = [
    { value: "us", label: "US customary" },
    { value: "metric", label: "Metric" },
  ];
  return (
    <div
      role="group"
      aria-label="Unit system"
      style={{
        display: "inline-flex",
        border: "1px solid var(--border-strong)",
        borderRadius: "999px",
        padding: 3,
        background: "var(--surface-muted)",
      }}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            style={{
              minHeight: 36,
              padding: "0.25rem 0.875rem",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.8125rem",
              fontWeight: 600,
              background: active ? "var(--brand)" : "transparent",
              color: active ? "var(--text-inverse)" : "var(--text-secondary)",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
