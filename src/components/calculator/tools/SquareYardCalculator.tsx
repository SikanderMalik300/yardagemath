"use client";

import { useMemo, useState } from "react";
import { computeSquareYard } from "@/lib/formulas/squareYard";
import { round, metersToFeet } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { fmtNumber, fmtUSD } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, NumberInput, GroupLabel, FormGroupDivider } from "../Fields";
import { UnitToggle, type UnitSystem } from "../UnitToggle";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "square-yard-calculator";

interface Row {
  lengthFt: string;
  widthFt: string;
}

export function SquareYardCalculator() {
  const [unit, setUnit] = useState<UnitSystem>("us");
  const [rows, setRows] = useState<Row[]>([{ lengthFt: "12", widthFt: "12" }]);
  const [waste, setWaste] = useState("10");
  const [price, setPrice] = useState("");

  const toFt = (v: string) => (unit === "metric" ? metersToFeet(num(v)) : num(v));

  const result = useMemo(
    () =>
      computeSquareYard({
        areas: rows.map((r) => ({ lengthFt: toFt(r.lengthFt), widthFt: toFt(r.widthFt), directSqFt: null })),
        wastePct: num(waste),
        pricePerSqYd: price === "" ? null : num(price),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, waste, price, unit]
  );

  useFirstCalculate(SLUG, JSON.stringify({ rows, waste, price, unit }));

  const update = (i: number, patch: Partial<Row>) => setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => setRows([...rows, { lengthFt: "10", widthFt: "10" }]);
  const remove = (i: number) => setRows(rows.length > 1 ? rows.filter((_, idx) => idx !== i) : rows);
  const reset = () => {
    setRows([{ lengthFt: "12", widthFt: "12" }]);
    setWaste("10");
    setPrice("");
  };

  const summary = `${fmtNumber(round(result.totalSqYd, 2))} sq yd (${fmtNumber(round(result.totalSqFt, 1))} sq ft). With ${waste}% waste: ${fmtNumber(round(result.totalSqYdWithWaste, 2))} sq yd. — yardagemath.com/${SLUG}/`;

  return (
    <CalculatorShell
      left={
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <UnitToggle value={unit} onChange={setUnit} />
          </div>
          <GroupLabel>Rooms / areas</GroupLabel>
          {rows.map((row, i) => (
            <div
              key={i}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.5rem", alignItems: "end", marginBottom: "0.5rem" }}
            >
              <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Length ({unit === "metric" ? "m" : "ft"})
                <NumberInput id={`l-${i}`} value={row.lengthFt} onChange={(v) => update(i, { lengthFt: v })} />
              </label>
              <label style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Width ({unit === "metric" ? "m" : "ft"})
                <NumberInput id={`w-${i}`} value={row.widthFt} onChange={(v) => update(i, { widthFt: v })} />
              </label>
              <button
                type="button"
                className="button-secondary"
                onClick={() => remove(i)}
                aria-label={`Remove area ${i + 1}`}
                style={{ minHeight: 46, padding: "0 0.75rem" }}
                disabled={rows.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="button-secondary" onClick={add}>
            + Add another area
          </button>

          <FormGroupDivider />
          <GroupLabel>Options</GroupLabel>
          <Field label="Waste / extra (%)" htmlFor="waste" hint="10% is typical for carpet.">
            <NumberInput id="waste" value={waste} onChange={setWaste} suffix="%" />
          </Field>
          <Field label="Price per square yard (optional)" htmlFor="price">
            <NumberInput id="price" value={price} onChange={setPrice} suffix="$/yd²" placeholder="e.g. 30" />
          </Field>
        </div>
      }
      right={
        <div>
          <PrimaryResult
            label="Total square yards"
            value={fmtNumber(round(result.totalSqYd, 2))}
            unit="sq yd"
            sub={`${fmtNumber(round(result.totalSqFt, 1))} sq ft · with ${waste}% waste, order ${fmtNumber(round(result.totalSqYdWithWaste, 2))} sq yd.`}
          />
          <SecondaryResults>
            <SecondaryItem label="Square feet" value={`${fmtNumber(round(result.totalSqFt, 1))} sq ft`} />
            <SecondaryItem label="Square meters" value={`${fmtNumber(round(result.totalSqM, 2))} m²`} />
            <SecondaryItem label="With waste" value={`${fmtNumber(round(result.totalSqYdWithWaste, 2))} sq yd`} />
            {result.cost !== null && <SecondaryItem label="Estimated cost" value={fmtUSD(result.cost)} />}
          </SecondaryResults>

          <ShowMath>
            <MathLine>total area = {fmtNumber(round(result.totalSqFt, 1))} sq ft</MathLine>
            <MathLine>square yards = {fmtNumber(round(result.totalSqFt, 1))} ÷ 9 = {fmtNumber(round(result.totalSqYd, 2))}</MathLine>
            <MathLine>+ {waste}% waste = {fmtNumber(round(result.totalSqYdWithWaste, 2))} sq yd</MathLine>
          </ShowMath>

          <ResultActions
            slug={SLUG}
            getSummary={() => summary}
            getShareParams={() => ({ l: rows[0]?.lengthFt ?? "", w: rows[0]?.widthFt ?? "", waste })}
            onReset={reset}
          />
        </div>
      }
    />
  );
}
