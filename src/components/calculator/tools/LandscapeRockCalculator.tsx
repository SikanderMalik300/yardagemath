"use client";

import { useMemo, useState } from "react";
import { computeRock, ROCK_TYPES, type RockShape, type RockTypeKey, type RockInput } from "@/lib/formulas/landscapeRock";
import { round } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { LANDSCAPE_ROCK_DEPTH, PRICES } from "@/lib/constants";
import { fmtInt, fmtUSD, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, NumberInput, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "landscape-rock-calculator";

type CutoutShape = "rectangle" | "circle" | "area";

interface Cutout {
  shape: CutoutShape;
  l: string;
  w: string;
  d: string; // diameter
  sqft: string;
}

interface Area {
  shape: RockShape;
  l: string;
  w: string;
  d: string; // diameter
  b: string; // base
  h: string; // height
  sqft: string;
  cutouts: Cutout[];
}

const newCutout = (): Cutout => ({ shape: "circle", l: "2", w: "2", d: "2", sqft: "4" });
const newArea = (): Area => ({ shape: "rectangle", l: "10", w: "20", d: "6", b: "10", h: "8", sqft: "200", cutouts: [] });

const SHAPE_OPTS = [
  { value: "rectangle", label: "Rectangle (L × W)" },
  { value: "circle", label: "Circle / tree ring (diameter)" },
  { value: "triangle", label: "Triangle (base × height)" },
  { value: "area", label: "I know the square feet" },
];
const CUTOUT_SHAPE_OPTS = [
  { value: "circle", label: "Plant / circle (diameter)" },
  { value: "rectangle", label: "Paver / rectangle (L × W)" },
  { value: "area", label: "Square feet" },
];
const TYPE_OPTS = (Object.keys(ROCK_TYPES) as RockTypeKey[]).map((k) => ({ value: k, label: ROCK_TYPES[k].label }));

const DEPTH_PRESETS = [
  { label: `Small rock · ${LANDSCAPE_ROCK_DEPTH.small}″`, depth: String(LANDSCAPE_ROCK_DEPTH.small) },
  { label: `Medium · ${LANDSCAPE_ROCK_DEPTH.medium}″`, depth: String(LANDSCAPE_ROCK_DEPTH.medium) },
  { label: `Large · ${LANDSCAPE_ROCK_DEPTH.large}″`, depth: String(LANDSCAPE_ROCK_DEPTH.large) },
];

export function LandscapeRockCalculator() {
  const [areas, setAreas] = useState<Area[]>([newArea()]);
  const [type, setType] = useState<RockTypeKey>("riverRock");
  const [customLb, setCustomLb] = useState("2700");
  const [depth, setDepth] = useState(String(LANDSCAPE_ROCK_DEPTH.medium));
  const [waste, setWaste] = useState("10");
  const [bag, setBag] = useState("0.5");
  const [price, setPrice] = useState(String(ROCK_TYPES.riverRock.pricePerTon));
  const [bagPrice, setBagPrice] = useState(String(PRICES.rockPerBag));

  const density = type === "custom" ? num(customLb) / 2000 : ROCK_TYPES[type].density;

  const result = useMemo(() => {
    const input: RockInput = {
      areas: areas.map((a) => ({
        shape: a.shape,
        lengthFt: num(a.l),
        widthFt: num(a.w),
        diameterFt: num(a.d),
        baseFt: num(a.b),
        heightFt: num(a.h),
        directSqFt: num(a.sqft),
        cutouts: a.cutouts.map((c) => ({
          shape: c.shape,
          lengthFt: num(c.l),
          widthFt: num(c.w),
          diameterFt: num(c.d),
          directSqFt: num(c.sqft),
        })),
      })),
      depthIn: num(depth),
      wastePct: num(waste),
      bagSizeCuFt: num(bag),
      densityTonsPerCuYd: density,
      pricePerTon: num(price),
      pricePerBag: num(bagPrice),
    };
    return computeRock(input);
  }, [areas, depth, waste, bag, density, price, bagPrice]);

  useFirstCalculate(SLUG, JSON.stringify({ areas, type, customLb, depth, waste, bag, price, bagPrice }));

  const update = (i: number, patch: Partial<Area>) => setAreas(areas.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => setAreas([...areas, newArea()]);
  const remove = (i: number) => setAreas(areas.length > 1 ? areas.filter((_, idx) => idx !== i) : areas);

  const addCutout = (i: number) =>
    update(i, { cutouts: areas[i].cutouts.length < 3 ? [...areas[i].cutouts, newCutout()] : areas[i].cutouts });
  const updateCutout = (i: number, j: number, patch: Partial<Cutout>) =>
    update(i, { cutouts: areas[i].cutouts.map((c, idx) => (idx === j ? { ...c, ...patch } : c)) });
  const removeCutout = (i: number, j: number) => update(i, { cutouts: areas[i].cutouts.filter((_, idx) => idx !== j) });

  const changeType = (v: string) => {
    const k = v as RockTypeKey;
    setType(k);
    setPrice(String(ROCK_TYPES[k].pricePerTon));
  };

  const reset = () => {
    setAreas([newArea()]);
    setType("riverRock");
    setCustomLb("2700");
    setDepth(String(LANDSCAPE_ROCK_DEPTH.medium));
    setWaste("10");
    setBag("0.5");
    setPrice(String(ROCK_TYPES.riverRock.pricePerTon));
    setBagPrice(String(PRICES.rockPerBag));
  };

  const cheaperBulk = result.cheaper === "bulk";
  const cheaperBagged = result.cheaper === "bagged";
  const typeLabel = ROCK_TYPES[type].label;
  const summary = `${typeLabel}: ${fmtNumber(round(result.tons, 2))} tons (${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd with ${waste}% waste), about ${fmtInt(result.bags)} bags of ${bag} cu ft. Bulk ${fmtUSD(result.bulkCost)} vs bagged ${fmtUSD(result.baggedCost)}. — yardagemath.com/${SLUG}/`;

  return (
    <div>
      <CalculatorShell
        left={
          <div>
            <GroupLabel>Beds &amp; borders</GroupLabel>
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
                  <Select id={`shape-${i}`} value={a.shape} onChange={(v) => update(i, { shape: v as RockShape })} options={SHAPE_OPTS} />
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

                {/* Cut-outs for plants and pavers (up to 3) */}
                <div style={{ marginTop: "0.5rem" }}>
                  {a.cutouts.map((c, j) => (
                    <div key={j} style={{ borderLeft: "3px solid var(--border)", paddingLeft: "0.625rem", marginBottom: "0.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Cut-out {j + 1} (subtracted)</span>
                        <button type="button" className="button-secondary" onClick={() => removeCutout(i, j)} aria-label={`Remove cut-out ${j + 1} from area ${i + 1}`} style={{ minHeight: 36, padding: "0 0.5rem" }}>✕</button>
                      </div>
                      <Field label="Cut-out shape" htmlFor={`cs-${i}-${j}`}>
                        <Select id={`cs-${i}-${j}`} value={c.shape} onChange={(v) => updateCutout(i, j, { shape: v as CutoutShape })} options={CUTOUT_SHAPE_OPTS} />
                      </Field>
                      {c.shape === "rectangle" && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                          <Field label="Length (ft)" htmlFor={`cl-${i}-${j}`}><NumberInput id={`cl-${i}-${j}`} value={c.l} onChange={(v) => updateCutout(i, j, { l: v })} suffix="ft" /></Field>
                          <Field label="Width (ft)" htmlFor={`cw-${i}-${j}`}><NumberInput id={`cw-${i}-${j}`} value={c.w} onChange={(v) => updateCutout(i, j, { w: v })} suffix="ft" /></Field>
                        </div>
                      )}
                      {c.shape === "circle" && (
                        <Field label="Diameter (ft)" htmlFor={`cd-${i}-${j}`}><NumberInput id={`cd-${i}-${j}`} value={c.d} onChange={(v) => updateCutout(i, j, { d: v })} suffix="ft" /></Field>
                      )}
                      {c.shape === "area" && (
                        <Field label="Area (sq ft)" htmlFor={`ca-${i}-${j}`}><NumberInput id={`ca-${i}-${j}`} value={c.sqft} onChange={(v) => updateCutout(i, j, { sqft: v })} suffix="sq ft" /></Field>
                      )}
                    </div>
                  ))}
                  {a.cutouts.length < 3 && (
                    <button type="button" className="button-secondary" onClick={() => addCutout(i)} style={{ minHeight: 40 }}>
                      + Subtract a plant or paver
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button type="button" className="button-secondary" onClick={add}>+ Add another bed</button>

            <FormGroupDivider />
            <GroupLabel>Rock type, depth &amp; price</GroupLabel>
            <Field label="Rock type" htmlFor="type" hint="Lava rock weighs far less than river rock, so you need fewer tons.">
              <Select id="type" value={type} onChange={changeType} options={TYPE_OPTS} />
            </Field>
            {type === "custom" && (
              <Field label="Custom weight (lb per cu yd)" htmlFor="customlb">
                <NumberInput id="customlb" value={customLb} onChange={setCustomLb} suffix="lb/yd" />
              </Field>
            )}
            <Field label="Depth (inches)" htmlFor="depth" hint="About 2 in for small rock, 3 for medium, 4 for large.">
              <NumberInput id="depth" value={depth} onChange={setDepth} suffix="in" />
            </Field>
            <div style={{ display: "flex", gap: "0.375rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
              {DEPTH_PRESETS.map((p) => (
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
            <Field label="Waste / extra (%)" htmlFor="waste">
              <NumberInput id="waste" value={waste} onChange={setWaste} suffix="%" />
            </Field>
            <Field label="Bag size" htmlFor="bag">
              <Select
                id="bag"
                value={bag}
                onChange={setBag}
                options={[
                  { value: "0.5", label: "0.5 cu ft (most common)" },
                  { value: "0.4", label: "0.4 cu ft" },
                ]}
              />
            </Field>
            <Field label="Price per ton (bulk)" htmlFor="price">
              <NumberInput id="price" value={price} onChange={setPrice} suffix="$/ton" />
            </Field>
            <Field label="Price per bag" htmlFor="bagprice">
              <NumberInput id="bagprice" value={bagPrice} onChange={setBagPrice} suffix="$/bag" />
            </Field>
          </div>
        }
        right={
          <div>
            <PrimaryResult
              label={`${typeLabel} needed`}
              value={fmtNumber(round(result.tons, 2))}
              unit="tons"
              sub={`With ${waste}% waste, order about ${fmtNumber(round(result.tonsWithWaste, 2))} tons (${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd).`}
            />
            <SecondaryResults>
              <SecondaryItem label="Cubic yards" value={`${fmtNumber(round(result.cubicYards, 2))} cu yd`} />
              <SecondaryItem label="Cubic feet" value={`${fmtNumber(round(result.cubicFeet, 1))} cu ft`} />
              <SecondaryItem label={`${bag} cu ft bags`} value={fmtInt(result.bags)} />
              <SecondaryItem label={`Bags with ${waste}% waste`} value={fmtInt(result.bagsWithWaste)} />
              <SecondaryItem label="Coverage per ton" value={`${fmtInt(result.coveragePerTon)} sq ft`} />
            </SecondaryResults>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "1rem" }}>
              <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", background: cheaperBulk ? "var(--brand-soft)" : "var(--surface)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Bulk by the ton{cheaperBulk ? " · cheaper" : ""}</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 600, color: cheaperBulk ? "var(--brand)" : "var(--text-primary)" }}>{fmtUSD(result.bulkCost)}</div>
              </div>
              <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", background: cheaperBagged ? "var(--brand-soft)" : "var(--surface)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Bagged{cheaperBagged ? " · cheaper" : ""}</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 600, color: cheaperBagged ? "var(--brand)" : "var(--text-primary)" }}>{fmtUSD(result.baggedCost)}</div>
              </div>
            </div>

            <ShowMath>
              <MathLine>area = {fmtNumber(round(result.areaSqFt, 1))} sq ft (net of cut-outs)</MathLine>
              <MathLine>cu ft = {fmtNumber(round(result.areaSqFt, 1))} × ({depth} ÷ 12) = {fmtNumber(round(result.cubicFeet, 2))}</MathLine>
              <MathLine>cubic yards = {fmtNumber(round(result.cubicFeet, 2))} ÷ 27 = {fmtNumber(round(result.cubicYards, 2))}</MathLine>
              <MathLine>tons = {fmtNumber(round(result.cubicYards, 2))} × {fmtNumber(round(density, 2))} = {fmtNumber(round(result.tons, 2))}</MathLine>
              <MathLine>+ {waste}% waste = {fmtNumber(round(result.tonsWithWaste, 2))} tons</MathLine>
              <MathLine>bags = ceil({fmtNumber(round(result.cubicFeet, 1))} ÷ {bag}) = {fmtInt(result.bags)} ({fmtInt(result.bagsWithWaste)} with waste)</MathLine>
              <MathLine>coverage = (27 ÷ {fmtNumber(round(density, 2))}) ÷ ({depth} ÷ 12) = {fmtInt(result.coveragePerTon)} sq ft per ton</MathLine>
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
