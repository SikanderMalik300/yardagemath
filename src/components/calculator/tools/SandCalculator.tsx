"use client";

import { useMemo, useState } from "react";
import { computeSand, SAND_TYPES, type SandShape, type SandTypeKey, type SandInput } from "@/lib/formulas/sand";
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

const SLUG = "sand-calculator";

interface Area {
  shape: SandShape;
  l: string;
  w: string;
  d: string; // diameter
  b: string; // base
  h: string; // height
  sqft: string;
}

const newArea = (): Area => ({ shape: "rectangle", l: "6", w: "6", d: "10", b: "10", h: "8", sqft: "100" });

const SHAPE_OPTS = [
  { value: "rectangle", label: "Rectangle (L × W)" },
  { value: "circle", label: "Circle (diameter)" },
  { value: "triangle", label: "Triangle (base × height)" },
  { value: "area", label: "I know the square feet" },
];

const TYPE_OPTS = (Object.keys(SAND_TYPES) as SandTypeKey[]).map((k) => ({ value: k, label: SAND_TYPES[k].label }));

const PRESETS = [
  { label: "Paver bedding (1 in)", depth: "1" },
  { label: "Leveling (2 in)", depth: "2" },
  { label: "Sandbox (12 in)", depth: "12" },
];

const BAG_CUFT = 0.5; // 50 lb bag of sand is about 0.5 cu ft

export function SandCalculator() {
  const [areas, setAreas] = useState<Area[]>([newArea()]);
  const [type, setType] = useState<SandTypeKey>("dry");
  const [customLb, setCustomLb] = useState("2700");
  const [depth, setDepth] = useState("2");
  const [waste, setWaste] = useState("10");
  const [price, setPrice] = useState(String(PRICES.sandPerTon));
  const [bagPrice, setBagPrice] = useState(String(PRICES.sandPerBag));

  const density = type === "custom" ? num(customLb) / 2000 : SAND_TYPES[type].density;

  const result = useMemo(() => {
    const input: SandInput = {
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
      bagSizeCuFt: BAG_CUFT,
      densityTonsPerCuYd: density,
      pricePerTon: num(price),
      pricePerBag: num(bagPrice),
    };
    return computeSand(input);
  }, [areas, depth, waste, density, price, bagPrice]);

  useFirstCalculate(SLUG, JSON.stringify({ areas, type, customLb, depth, waste, price, bagPrice }));

  const update = (i: number, patch: Partial<Area>) => setAreas(areas.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => setAreas([...areas, newArea()]);
  const remove = (i: number) => setAreas(areas.length > 1 ? areas.filter((_, idx) => idx !== i) : areas);
  const reset = () => {
    setAreas([newArea()]);
    setType("dry");
    setCustomLb("2700");
    setDepth("2");
    setWaste("10");
    setPrice(String(PRICES.sandPerTon));
    setBagPrice(String(PRICES.sandPerBag));
  };

  const cheaperBulk = result.cheaper === "bulk";
  const cheaperBagged = result.cheaper === "bagged";
  const summary = `Sand: ${fmtNumber(round(result.tonsWithWaste, 2))} tons (${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd) with ${waste}% waste, about ${fmtInt(result.bags)} bags of 50 lb. Bulk ${fmtUSD(result.bulkCost)} vs bagged ${fmtUSD(result.baggedCost)}. — yardagemath.com/${SLUG}/`;

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
                  <Select id={`shape-${i}`} value={a.shape} onChange={(v) => update(i, { shape: v as SandShape })} options={SHAPE_OPTS} />
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
            <GroupLabel>Project, depth &amp; sand type</GroupLabel>
            <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "0.375rem" }}>Project (sets the depth):</div>
            <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              {PRESETS.map((p) => (
                <button
                  key={p.depth}
                  type="button"
                  className="button-secondary"
                  aria-pressed={depth === p.depth}
                  onClick={() => setDepth(p.depth)}
                  style={{ minHeight: 40, padding: "0 0.75rem", borderColor: depth === p.depth ? "var(--brand)" : undefined, color: depth === p.depth ? "var(--brand)" : undefined }}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <Field label="Depth (inches)" htmlFor="depth" hint="About 1 in under pavers, 2 in for leveling, 12 in for a sandbox.">
              <NumberInput id="depth" value={depth} onChange={setDepth} suffix="in" />
            </Field>
            <Field label="Sand type" htmlFor="type" hint="Damp sand weighs more per yard than dry.">
              <Select id="type" value={type} onChange={(v) => setType(v as SandTypeKey)} options={TYPE_OPTS} />
            </Field>
            {type === "custom" && (
              <Field label="Custom weight (lb per cu yd)" htmlFor="customlb">
                <NumberInput id="customlb" value={customLb} onChange={setCustomLb} suffix="lb/yd" />
              </Field>
            )}
            <Field label="Waste / compaction (%)" htmlFor="waste">
              <NumberInput id="waste" value={waste} onChange={setWaste} suffix="%" />
            </Field>
            <Field label="Price per ton (bulk)" htmlFor="price">
              <NumberInput id="price" value={price} onChange={setPrice} suffix="$/ton" />
            </Field>
            <Field label="Price per 50-lb bag" htmlFor="bagprice">
              <NumberInput id="bagprice" value={bagPrice} onChange={setBagPrice} suffix="$/bag" />
            </Field>
          </div>
        }
        right={
          <div>
            <PrimaryResult
              label="Sand needed"
              value={fmtNumber(round(result.tons, 2))}
              unit="tons"
              sub={`With ${waste}% waste, order about ${fmtNumber(round(result.tonsWithWaste, 2))} tons (${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd).`}
            />
            <SecondaryResults>
              <SecondaryItem label="Cubic yards" value={`${fmtNumber(round(result.cubicYards, 2))} cu yd`} />
              <SecondaryItem label="With waste" value={`${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd`} />
              <SecondaryItem label="Cubic feet" value={`${fmtNumber(round(result.cubicFeet, 1))} cu ft`} />
              <SecondaryItem label="50 lb bags" value={fmtInt(result.bags)} />
              <SecondaryItem label="Coverage per ton" value={`${fmtInt(result.coveragePerTon)} sq ft`} />
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
              <MathLine>tons = {fmtNumber(round(result.cubicYards, 2))} × {fmtNumber(round(density, 2))} = {fmtNumber(round(result.tons, 2))}</MathLine>
              <MathLine>+ {waste}% waste = {fmtNumber(round(result.tonsWithWaste, 2))} tons</MathLine>
              <MathLine>bags = ceil({fmtNumber(round(result.cubicFeetWithWaste, 1))} ÷ 0.5) = {fmtInt(result.bags)}</MathLine>
            </ShowMath>

            <ResultActions
              slug={SLUG}
              getSummary={() => summary}
              getShareParams={() => ({ type, depth, waste })}
              onReset={reset}
            />
          </div>
        }
      />
    </div>
  );
}
