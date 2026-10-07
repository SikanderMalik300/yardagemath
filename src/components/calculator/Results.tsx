import type { ReactNode } from "react";

/** Primary result with aria-live region (design.md §8, build-spec A3 accessibility). */
export function PrimaryResult({
  label,
  value,
  unit,
  sub,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: ReactNode;
}) {
  return (
    <div className="primary-result" aria-live="polite">
      <div className="primary-result__label">{label}</div>
      <div className="primary-result__value">
        {value}
        {unit && (
          <span style={{ fontSize: "1.25rem", fontWeight: 600, marginLeft: "0.375rem", color: "var(--text-secondary)" }}>
            {unit}
          </span>
        )}
      </div>
      {sub && <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>{sub}</div>}
    </div>
  );
}

export function SecondaryResults({ children }: { children: ReactNode }) {
  return (
    <div className="secondary-results" style={{ marginTop: "0.75rem" }} aria-live="polite">
      {children}
    </div>
  );
}

export function SecondaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="secondary-result">
      <div className="secondary-result__label">{label}</div>
      <div className="secondary-result__value numeric">{value}</div>
    </div>
  );
}
