import type { ReactNode } from "react";

/* Presentational form controls (design.md §7). Controlled via props so they
   work inside client calculator components without their own state. */

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div style={{ marginBottom: "0.875rem" }}>
      <label className="field-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && !error && <div className="field-hint" style={{ marginTop: "0.25rem" }}>{hint}</div>}
      {error && (
        <div className="field-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export function NumberInput({
  id,
  value,
  onChange,
  min = 0,
  step = "any",
  suffix,
  ariaInvalid,
  ariaLabel,
  enterKeyHint,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  min?: number;
  step?: number | "any";
  suffix?: string;
  ariaInvalid?: boolean;
  ariaLabel?: string;
  enterKeyHint?: "next" | "done" | "go";
  placeholder?: string;
}) {
  const input = (
    <input
      id={id}
      className="input"
      type="text"
      inputMode="decimal"
      enterKeyHint={enterKeyHint}
      value={value}
      min={min}
      step={step}
      placeholder={placeholder}
      aria-label={ariaLabel}
      aria-invalid={ariaInvalid || undefined}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
    />
  );
  if (!suffix) return input;
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: "0.375rem" }}>
      <div style={{ flex: 1 }}>{input}</div>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "0 0.625rem",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          background: "var(--surface-muted)",
          color: "var(--text-secondary)",
          fontSize: "0.875rem",
          fontWeight: 500,
        }}
      >
        {suffix}
      </span>
    </div>
  );
}

/** Feet + inches pair on one row (design.md §7 "Feet and Inches Controls"). */
export function FeetInches({
  idBase,
  label,
  feet,
  inches,
  onFeet,
  onInches,
  error,
}: {
  idBase: string;
  label: string;
  feet: string;
  inches: string;
  onFeet: (v: string) => void;
  onInches: (v: string) => void;
  error?: string;
}) {
  return (
    <div style={{ marginBottom: "0.875rem" }}>
      <label className="field-label" htmlFor={`${idBase}-ft`}>
        {label}
      </label>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <div style={{ flex: 2 }}>
          <NumberInput
            id={`${idBase}-ft`}
            value={feet}
            onChange={onFeet}
            suffix="ft"
            ariaLabel={`${label}, feet`}
            ariaInvalid={Boolean(error)}
          />
        </div>
        <div style={{ flex: 1 }}>
          <NumberInput
            id={`${idBase}-in`}
            value={inches}
            onChange={onInches}
            suffix="in"
            ariaLabel={`${label}, inches`}
          />
        </div>
      </div>
      {error && (
        <div className="field-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export function Select({
  id,
  value,
  onChange,
  options,
  ariaLabel,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  ariaLabel?: string;
}) {
  return (
    <select
      id={id}
      className="select"
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** Subtle divider between form groups. */
export function FormGroupDivider() {
  return <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "1.25rem 0" }} />;
}

export function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: "0.75rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: "var(--text-muted)",
        marginBottom: "0.625rem",
      }}
    >
      {children}
    </div>
  );
}
