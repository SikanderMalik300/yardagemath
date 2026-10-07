"use client";

import type { Opening } from "@/lib/formulas/concreteBlock";
import { num } from "@/lib/analytics";
import { NumberInput, GroupLabel } from "./Fields";

export interface OpeningRow {
  count: string;
  widthFt: string;
  heightFt: string;
}

export function openingRowsToModel(rows: OpeningRow[]): Opening[] {
  return rows.map((r) => ({ count: num(r.count), widthFt: num(r.widthFt), heightFt: num(r.heightFt) }));
}

/** Editable list of wall openings (doors/windows) to subtract. */
export function OpeningsEditor({
  rows,
  onChange,
}: {
  rows: OpeningRow[];
  onChange: (rows: OpeningRow[]) => void;
}) {
  const update = (i: number, patch: Partial<OpeningRow>) =>
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => onChange([...rows, { count: "1", widthFt: "3", heightFt: "4" }]);
  const remove = (i: number) => onChange(rows.filter((_, idx) => idx !== i));

  return (
    <div>
      <GroupLabel>Openings (doors / windows)</GroupLabel>
      {rows.length === 0 && (
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: 0 }}>
          No openings. Add a door or window to subtract its area.
        </p>
      )}
      {rows.map((row, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr auto",
            gap: "0.5rem",
            alignItems: "end",
            marginBottom: "0.5rem",
          }}
        >
          <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Count
            <NumberInput id={`op-count-${i}`} value={row.count} onChange={(v) => update(i, { count: v })} />
          </label>
          <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Width (ft)
            <NumberInput id={`op-w-${i}`} value={row.widthFt} onChange={(v) => update(i, { widthFt: v })} />
          </label>
          <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Height (ft)
            <NumberInput id={`op-h-${i}`} value={row.heightFt} onChange={(v) => update(i, { heightFt: v })} />
          </label>
          <button
            type="button"
            className="button-secondary"
            onClick={() => remove(i)}
            aria-label={`Remove opening ${i + 1}`}
            style={{ minHeight: 46, padding: "0 0.75rem" }}
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="button-secondary" onClick={add} style={{ marginTop: "0.25rem" }}>
        + Add opening
      </button>
    </div>
  );
}
