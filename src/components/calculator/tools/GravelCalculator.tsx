"use client";

import { useMemo, useState } from "react";
import { computeGravel, GRAVEL_TYPES, type GravelShape, type GravelTypeKey, type GravelInput } from "@/lib/formulas/gravel";
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

const SLUG = "gravel-calculator";

interface Area {
  shape: GravelShape;
  l: string;
  w: string;
  d: string; // diameter
  b: string; // base
  h: string; // height
  sqft: string;
}

const newArea = (): Area => ({ shape: "rectangle", l: "12", w: "50", d: "10", b: "10", h: "8", sqft: "600" });

const SHAPE_OPTS = [
  { value: "rectangle", label: "Rectangle (L × W)" },
  { value: "circle", label: "Circle (diameter)" },
  { value: "triangle", label: "Triangle (base × height)" },
  { value: "area", label: "I know the square feet" },
];

const TYPE_OPTS = (Object.keys(GRAVEL_TYPES) as GravelTypeKey[]).map((k) => ({ value: k, label: GRAVEL_TYPES[k].label }));

export function GravelCalculator() {
  const [areas, setAreas] = useState<Area[]>([newArea()]);
  const [type, setType] = useState<GravelTypeKey>("crushedStone");
  const [customLb, setCustomLb] = useState("2800");
  const [depth, setDepth] = useState("4");
  const [waste, setWaste] = useState("10");
  const [bag, setBag] = useState("0.5");
  const [price, setPrice] = useState(String(PRICES.gravelPerTon));
  const [delivery, setDelivery] = useState("0");

  const density = type === "custom" ? num(customLb) / 2000 : GRAVEL_TYPES[type].density;

  const result = useMemo(() => {
    const input: GravelInput = {
      areas: areas.map((r) => ({
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
      densityTonsPerCuYd: density,
      pricePerTon: num(price),
      deliveryFee: num(delivery),
    };
    return computeGravel(input);
  }, [areas, depth, waste, bag, density, price, delivery]);

  useFirstCalculate(SLUG, JSON.stringify({ areas, type, customLb, depth, waste, bag, price, delivery }));

  const update = (i: number, patch: Partial<Area>) => setAreas(areas.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => setAreas([...areas, newArea()]);
  const remove = (i: number) => setAreas(areas.length > 1 ? areas.filter((_, idx) => idx !== i) : areas);
  const reset = () => {
    setAreas([newArea()]);
    setType("crushedStone");
    setCustomLb("2800");
    setDepth("4");
    setWaste("10");
    setBag("0.5");
    setPrice(String(PRICES.gravelPerTon));
    setDelivery("0");
  };

  const summary = `Gravel: ${fmtNumber(round(result.tonsWithWaste, 2))} tons (${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd) with ${waste}% waste, about ${fmtInt(result.bags)} bags of ${bag} cu ft. Cost ${fmtUSD(result.cost)}., yardagemath.com/${SLUG}/`;

  return (
    <div>
      <CalculatorShell
        left={
          <div>
            <GroupLabel>Areas</GroupLabel>
            {areas.map((a, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>Area {i + 1}</span>
                  <button
                    type="button"
                    className="button-secondary"
                    onClick={() => remove(i)}
                    aria-label={`Remove area ${i + 1}`}
                    style={{ minHeight: 40, padding: "0 0.625rem" }}
                    disabled={areas.length === 1}
                  >
                    ✕
                  </button>
                </div>
                <Field label="Shape" htmlFor={`shape-${i}`}>
                  <Select id={`shape-${i}`} value={a.shape} onChange={(v) => update(i, { shape: v as GravelShape })} options={SHAPE_OPTS} />
                </Field>
                {a.shape === "rectangle" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <Field label="Length (ft)" htmlFor={`l-${i}`}><NumberInput id={`l-${i}`} value={a.l} onChange={(v) => update(i, { l: v })} suffix="ft" /></Field>
                    <Field label="Width (ft)" htmlFor={`w-${i}`}><NumberInput id={`w-${i}`} value={a.w} onChange={(v) => update(i, { w: v })} suffix="ft" /></Field>
                  </div>
                )}
                {a.shape === "circle" && (
                  <Field label="Diameter (ft)" htmlFor={`d-${i}`}><NumberInput id={`d-${i}`} value={a.d} onChange={(v) => update(i, { d: v })} suffix="ft" /></Field>
                )}
                {a.shape === "triangle" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <Field label="Base (ft)" htmlFor={`b-${i}`}><NumberInput id={`b-${i}`} value={a.b} onChange={(v) => update(i, { b: v })} suffix="ft" /></Field>
                    <Field label="Height (ft)" htmlFor={`h-${i}`}><NumberInput id={`h-${i}`} value={a.h} onChange={(v) => update(i, { h: v })} suffix="ft" /></Field>
                  </div>
                )}
                {a.shape === "area" && (
                  <Field label="Area (sq ft)" htmlFor={`a-${i}`}><NumberInput id={`a-${i}`} value={a.sqft} onChange={(v) => update(i, { sqft: v })} suffix="sq ft" /></Field>
                )}
              </div>
            ))}
            <button type="button" className="button-secondary" onClick={add}>+ Add another area</button>

            <FormGroupDivider />
            <GroupLabel>Gravel type, depth &amp; price</GroupLabel>
            <Field label="Gravel type" htmlFor="type" hint="Crushed stone and road base are heavier than river rock.">
              <Select id="type" value={type} onChange={(v) => setType(v as GravelTypeKey)} options={TYPE_OPTS} />
            </Field>
            {type === "custom" && (
              <Field label="Custom weight (lb per cu yd)" htmlFor="customlb">
                <NumberInput id="customlb" value={customLb} onChange={setCustomLb} suffix="lb/yd" />
              </Field>
            )}
            <Field label="Depth (inches)" htmlFor="depth" hint="Two to three inches for paths, four or more for driveways.">
              <NumberInput id="depth" value={depth} onChange={setDepth} suffix="in" />
            </Field>
            <div style={{ display: "flex", gap: "0.375rem", marginBottom: "0.75rem" }}>
              {["2", "3", "4", "6"].map((d) => (
                <button
                  key={d}
                  type="button"
                  className="button-secondary"
                  aria-pressed={depth === d}
                  onClick={() => setDepth(d)}
                  style={{ minHeight: 40, padding: "0 0.875rem", borderColor: depth === d ? "var(--brand)" : undefined, color: depth === d ? "var(--brand)" : undefined }}
                >
                  {d}&Prime;
                </button>
              ))}
            </div>

            <details style={{ marginBottom: "0.875rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.5rem 0.75rem" }}>
              <summary style={{ cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>Driveway helper</summary>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0.5rem 0" }}>
                For a new driveway, many builders use about 4 to 6 inches of crusher run or #3 stone as a base, with 2 to 3 inches of #57 or similar on top.
              </p>
              <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                <button type="button" className="button-secondary" onClick={() => setDepth("3")} style={{ minHeight: 40 }}>Top layer (3 in)</button>
                <button type="button" className="button-secondary" onClick={() => setDepth("6")} style={{ minHeight: 40 }}>New driveway (6 in)</button>
              </div>
            </details>

            <Field label="Waste / compaction (%)" htmlFor="waste">
              <NumberInput id="waste" value={waste} onChange={setWaste} suffix="%" />
            </Field>
            <Field label="Bag size" htmlFor="bag">
              <Select
                id="bag"
                value={bag}
                onChange={setBag}
                options={[
                  { value: "0.5", label: "0.5 cu ft (most common)" },
                  { value: "0.75", label: "0.75 cu ft" },
                ]}
              />
            </Field>
            <Field label="Price per ton" htmlFor="price">
              <NumberInput id="price" value={price} onChange={setPrice} suffix="$/ton" />
            </Field>
            <Field label="Delivery fee" htmlFor="delivery">
              <NumberInput id="delivery" value={delivery} onChange={setDelivery} suffix="$" />
            </Field>
          </div>
        }
        right={
          <div>
            <PrimaryResult
              label="Gravel needed"
              value={fmtNumber(round(result.tons, 2))}
              unit="tons"
              sub={`With ${waste}% waste, order about ${fmtNumber(round(result.tonsWithWaste, 2))} tons (${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd).`}
            />
            <SecondaryResults>
              <SecondaryItem label="Cubic yards" value={`${fmtNumber(round(result.cubicYards, 2))} cu yd`} />
              <SecondaryItem label="With waste" value={`${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd`} />
              <SecondaryItem label="Cubic feet" value={`${fmtNumber(round(result.cubicFeet, 1))} cu ft`} />
              <SecondaryItem label={`${bag} cu ft bags`} value={fmtInt(result.bags)} />
              <SecondaryItem label="Coverage per ton" value={`${fmtInt(result.coveragePerTon)} sq ft`} />
              <SecondaryItem label="Estimated cost" value={fmtUSD(result.cost)} />
            </SecondaryResults>

            <ShowMath>
              <MathLine>area = {fmtNumber(round(result.areaSqFt, 1))} sq ft</MathLine>
              <MathLine>cu ft = {fmtNumber(round(result.areaSqFt, 1))} × ({depth} ÷ 12) = {fmtNumber(round(result.cubicFeet, 2))}</MathLine>
              <MathLine>cubic yards = {fmtNumber(round(result.cubicFeet, 2))} ÷ 27 = {fmtNumber(round(result.cubicYards, 2))}</MathLine>
              <MathLine>tons = {fmtNumber(round(result.cubicYards, 2))} × {fmtNumber(round(density, 2))} = {fmtNumber(round(result.tons, 2))}</MathLine>
              <MathLine>+ {waste}% waste = {fmtNumber(round(result.tonsWithWaste, 2))} tons</MathLine>
              <MathLine>bags = ceil({fmtNumber(round(result.cubicFeetWithWaste, 1))} ÷ {bag}) = {fmtInt(result.bags)}</MathLine>
            </ShowMath>

            <ResultActions
              slug={SLUG}
              getSummary={() => summary}
              getShareParams={() => ({ type, depth, waste, bag })}
              onReset={reset}
            />
          </div>
        }
      />
    </div>
  );
}
