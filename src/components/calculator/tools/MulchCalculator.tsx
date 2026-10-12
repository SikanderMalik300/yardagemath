"use client";

import { useMemo, useState } from "react";
import { computeMulch, type BedShape, type MulchInput } from "@/lib/formulas/mulch";
import { round } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { PRICES } from "@/lib/constants";
import { fmtInt, fmtUSD, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, NumberInput, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "mulch-calculator";

interface Bed {
  shape: BedShape;
  l: string;
  w: string;
  d: string; // diameter
  b: string; // base
  h: string; // height
  sqft: string;
}

const newBed = (): Bed => ({ shape: "rectangle", l: "10", w: "20", d: "6", b: "10", h: "8", sqft: "200" });

const SHAPE_OPTS = [
  { value: "rectangle", label: "Rectangle (L × W)" },
  { value: "circle", label: "Circle / tree ring (diameter)" },
  { value: "triangle", label: "Triangle (base × height)" },
  { value: "area", label: "I know the square feet" },
];

export function MulchCalculator() {
  const [beds, setBeds] = useState<Bed[]>([newBed()]);
  const [depth, setDepth] = useState("3");
  const [waste, setWaste] = useState("10");
  const [bag, setBag] = useState("2");
  const [price, setPrice] = useState(String(PRICES.mulchPerCuYd));
  const [bagPrice, setBagPrice] = useState(String(PRICES.mulchPerBag));

  const result = useMemo(() => {
    const input: MulchInput = {
      beds: beds.map((r) => ({
        shape: r.shape,
        lengthFt: num(r.l),
        widthFt: num(r.w),
        diameterFt: num(r.d),
        baseFt: num(r.b),
        heightFt: num(r.h),
        directSqFt: num(r.sqft),
      })),
      depthIn: num(depth),
      wastePct: num(waste),
      bagSizeCuFt: num(bag),
      pricePerCuYd: num(price),
      pricePerBag: num(bagPrice),
    };
    return computeMulch(input);
  }, [beds, depth, waste, bag, price, bagPrice]);

  useFirstCalculate(SLUG, JSON.stringify({ beds, depth, waste, bag, price, bagPrice }));

  const update = (i: number, patch: Partial<Bed>) => setBeds(beds.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => setBeds([...beds, newBed()]);
  const remove = (i: number) => setBeds(beds.length > 1 ? beds.filter((_, idx) => idx !== i) : beds);
  const reset = () => {
    setBeds([newBed()]);
    setDepth("3");
    setWaste("10");
    setBag("2");
    setPrice(String(PRICES.mulchPerCuYd));
    setBagPrice(String(PRICES.mulchPerBag));
  };

  const cheaperBulk = result.cheaper === "bulk";
  const cheaperBagged = result.cheaper === "bagged";
  const summary = `Mulch: ${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd with ${waste}% waste (${fmtInt(result.bags)} bags of ${bag} cu ft). Bulk ${fmtUSD(result.bulkCost)} vs bagged ${fmtUSD(result.baggedCost)}. — yardagemath.com/${SLUG}/`;

  const setDepthQuick = (d: string) => setDepth(d);

  return (
    <div>
      <CalculatorShell
        left={
          <div>
            <GroupLabel>Beds</GroupLabel>
            {beds.map((bed, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>Bed {i + 1}</span>
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => remove(i)}
                    aria-label={`Remove bed ${i + 1}`}
                    style={{ minHeight: 40, padding: "0 0.625rem" }}
                    disabled={beds.length === 1}
                  >
                    ✕
                  </button>
                </div>
                <Field label="Shape" htmlFor={`shape-${i}`}>
                  <Select id={`shape-${i}`} value={bed.shape} onChange={(v) => update(i, { shape: v as BedShape })} options={SHAPE_OPTS} />
                </Field>
                {bed.shape === "rectangle" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <Field label="Length (ft)" htmlFor={`l-${i}`}><NumberInput id={`l-${i}`} value={bed.l} onChange={(v) => update(i, { l: v })} suffix="ft" /></Field>
                    <Field label="Width (ft)" htmlFor={`w-${i}`}><NumberInput id={`w-${i}`} value={bed.w} onChange={(v) => update(i, { w: v })} suffix="ft" /></Field>
                  </div>
                )}
                {bed.shape === "circle" && (
                  <Field label="Diameter (ft)" htmlFor={`d-${i}`}><NumberInput id={`d-${i}`} value={bed.d} onChange={(v) => update(i, { d: v })} suffix="ft" /></Field>
                )}
                {bed.shape === "triangle" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <Field label="Base (ft)" htmlFor={`b-${i}`}><NumberInput id={`b-${i}`} value={bed.b} onChange={(v) => update(i, { b: v })} suffix="ft" /></Field>
                    <Field label="Height (ft)" htmlFor={`h-${i}`}><NumberInput id={`h-${i}`} value={bed.h} onChange={(v) => update(i, { h: v })} suffix="ft" /></Field>
                  </div>
                )}
                {bed.shape === "area" && (
                  <Field label="Area (sq ft)" htmlFor={`a-${i}`}><NumberInput id={`a-${i}`} value={bed.sqft} onChange={(v) => update(i, { sqft: v })} suffix="sq ft" /></Field>
                )}
              </div>
            ))}
            <button type="button" className="button-secondary" onClick={add}>+ Add another bed</button>

            <FormGroupDivider />
            <GroupLabel>Depth, waste &amp; price</GroupLabel>
            <Field label="Depth (inches)" htmlFor="depth" hint="Two to four inches; three is a good default.">
              <NumberInput id="depth" value={depth} onChange={setDepth} suffix="in" />
            </Field>
            <div style={{ display: "flex", gap: "0.375rem", marginBottom: "0.75rem" }}>
              {["2", "3", "4"].map((d) => (
                <button
                  key={d}
                  type="button"
                  className="button-secondary"
                  aria-pressed={depth === d}
                  onClick={() => setDepthQuick(d)}
                  style={{ minHeight: 40, padding: "0 0.875rem", borderColor: depth === d ? "var(--brand)" : undefined, color: depth === d ? "var(--brand)" : undefined }}
                >
                  {d}&Prime;
                </button>
              ))}
            </div>
            <Field label="Waste / extra (%)" htmlFor="waste">
              <NumberInput id="waste" value={waste} onChange={setWaste} suffix="%" />
            </Field>
            <Field label="Bag size" htmlFor="bag">
              <Select
                id="bag"
                value={bag}
                onChange={setBag}
                options={[
                  { value: "2", label: "2 cu ft (most common)" },
                  { value: "3", label: "3 cu ft" },
                  { value: "1.5", label: "1.5 cu ft" },
                ]}
              />
            </Field>
            <Field label="Price per cubic yard (bulk)" htmlFor="price">
              <NumberInput id="price" value={price} onChange={setPrice} suffix="$/yd" />
            </Field>
            <Field label="Price per bag" htmlFor="bagprice">
              <NumberInput id="bagprice" value={bagPrice} onChange={setBagPrice} suffix="$/bag" />
            </Field>
          </div>
        }
        right={
          <div>
            <PrimaryResult
              label="Cubic yards needed"
              value={fmtNumber(round(result.cubicYards, 2))}
              unit="cu yd"
              sub={`With ${waste}% waste, order ${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd.`}
            />
            <SecondaryResults>
              <SecondaryItem label="With waste" value={`${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd`} />
              <SecondaryItem label="Cubic feet" value={`${fmtNumber(round(result.cubicFeet, 1))} cu ft`} />
              <SecondaryItem label={`${bag} cu ft bags`} value={fmtInt(result.bags)} />
              <SecondaryItem label="Coverage per yard" value={`${fmtInt(result.coveragePerYard)} sq ft`} />
            </SecondaryResults>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "1rem" }}>
              <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", background: cheaperBulk ? "var(--brand-soft)" : "var(--surface)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Bulk{cheaperBulk ? " · cheaper" : ""}</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 600, color: cheaperBulk ? "var(--brand)" : "var(--text-primary)" }}>{fmtUSD(result.bulkCost)}</div>
              </div>
              <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", background: cheaperBagged ? "var(--brand-soft)" : "var(--surface)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Bagged{cheaperBagged ? " · cheaper" : ""}</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 600, color: cheaperBagged ? "var(--brand)" : "var(--text-primary)" }}>{fmtUSD(result.baggedCost)}</div>
              </div>
            </div>

            <ShowMath>
              <MathLine>area = {fmtNumber(round(result.areaSqFt, 1))} sq ft</MathLine>
              <MathLine>cu ft = {fmtNumber(round(result.areaSqFt, 1))} × ({depth} ÷ 12) = {fmtNumber(round(result.cubicFeet, 2))}</MathLine>
              <MathLine>cubic yards = {fmtNumber(round(result.cubicFeet, 2))} ÷ 27 = {fmtNumber(round(result.cubicYards, 2))}</MathLine>
              <MathLine>+ {waste}% waste = {fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd</MathLine>
              <MathLine>bags = ceil({fmtNumber(round(result.cubicFeetWithWaste, 1))} ÷ {bag}) = {fmtInt(result.bags)}</MathLine>
            </ShowMath>

            <ResultActions
              slug={SLUG}
              getSummary={() => summary}
              getShareParams={() => ({ depth, waste, bag })}
              onReset={reset}
            />
          </div>
        }
      />
    </div>
  );
}
