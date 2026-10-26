"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  computeGrassSeed,
  GRASS_SEED_TYPES,
  type GrassShape,
  type GrassTypeKey,
  type SeedJob,
  type GrassSeedInput,
} from "@/lib/formulas/grassSeed";
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

const SLUG = "grass-seed-calculator";

type CutoutShape = "rectangle" | "circle" | "area";
interface Cutout { shape: CutoutShape; l: string; w: string; d: string; sqft: string; }
interface Area { shape: GrassShape; l: string; w: string; d: string; b: string; h: string; sqft: string; acres: string; cutouts: Cutout[]; }

const newCutout = (): Cutout => ({ shape: "rectangle", l: "10", w: "12", d: "6", sqft: "120" });
const newArea = (): Area => ({ shape: "rectangle", l: "50", w: "20", d: "20", b: "20", h: "15", sqft: "1000", acres: "0.25", cutouts: [] });

const SHAPE_OPTS = [
  { value: "rectangle", label: "Rectangle (L × W)" },
  { value: "circle", label: "Circle (diameter)" },
  { value: "triangle", label: "Triangle (base × height)" },
  { value: "area", label: "I know the square feet" },
  { value: "acres", label: "I know the acres" },
];
const CUTOUT_SHAPE_OPTS = [
  { value: "rectangle", label: "Patio / rectangle (L × W)" },
  { value: "circle", label: "Bed / circle (diameter)" },
  { value: "area", label: "Square feet" },
];
const GRASS_OPTS = (Object.keys(GRASS_SEED_TYPES) as GrassTypeKey[]).map((k) => ({ value: k, label: GRASS_SEED_TYPES[k].label }));
const BAG_OPTS = [
  { value: "3", label: "3 lb box" },
  { value: "7", label: "7 lb bag" },
  { value: "20", label: "20 lb bag" },
  { value: "50", label: "50 lb bag" },
  { value: "custom", label: "Custom size" },
];

export function GrassSeedCalculator() {
  const [areas, setAreas] = useState<Area[]>([newArea()]);
  const [grass, setGrass] = useState<GrassTypeKey>("tallFescue");
  const [job, setJob] = useState<SeedJob>("new");
  const [customRate, setCustomRate] = useState("5");
  const [bag, setBag] = useState("20");
  const [customBag, setCustomBag] = useState("25");
  const [price, setPrice] = useState(String(PRICES.grassSeedBag20));

  const type = GRASS_SEED_TYPES[grass];
  const isWarm = type.season === "warm";
  const isCustom = grass === "custom";
  // Warm-season grasses are not overseeded with the same grass; force the new-lawn rate.
  const effectiveJob: SeedJob = isWarm ? "new" : job;
  const rate = isCustom
    ? num(customRate)
    : effectiveJob === "overseed" && type.overseed != null
      ? type.overseed
      : type.newLawn;
  const bagLb = bag === "custom" ? num(customBag) : num(bag);

  const result = useMemo(() => {
    const input: GrassSeedInput = {
      areas: areas.map((a) => ({
        shape: a.shape,
        lengthFt: num(a.l), widthFt: num(a.w), diameterFt: num(a.d), baseFt: num(a.b), heightFt: num(a.h), directSqFt: num(a.sqft), acres: num(a.acres),
        cutouts: a.cutouts.map((c) => ({ shape: c.shape, lengthFt: num(c.l), widthFt: num(c.w), diameterFt: num(c.d), directSqFt: num(c.sqft) })),
      })),
      ratePer1000: rate,
      bagLb,
      pricePerBag: num(price),
    };
    return computeGrassSeed(input);
  }, [areas, rate, bagLb, price]);

  useFirstCalculate(SLUG, JSON.stringify({ areas, grass, job, bag, price }));

  const update = (i: number, patch: Partial<Area>) => setAreas(areas.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => setAreas([...areas, newArea()]);
  const remove = (i: number) => setAreas(areas.length > 1 ? areas.filter((_, idx) => idx !== i) : areas);
  const addCutout = (i: number) => update(i, { cutouts: areas[i].cutouts.length < 3 ? [...areas[i].cutouts, newCutout()] : areas[i].cutouts });
  const updateCutout = (i: number, j: number, patch: Partial<Cutout>) => update(i, { cutouts: areas[i].cutouts.map((c, idx) => (idx === j ? { ...c, ...patch } : c)) });
  const removeCutout = (i: number, j: number) => update(i, { cutouts: areas[i].cutouts.filter((_, idx) => idx !== j) });

  const reset = () => {
    setAreas([newArea()]); setGrass("tallFescue"); setJob("new"); setCustomRate("5"); setBag("20"); setCustomBag("25"); setPrice(String(PRICES.grassSeedBag20));
  };

  const jobWord = effectiveJob === "overseed" ? "overseeding" : "new lawn";
  const summary = `Grass seed: ${fmtNumber(round(result.pounds, 1))} lb of ${type.label.toLowerCase()} for ${fmtInt(result.netSqFt)} sq ft (${jobWord}), ${fmtInt(result.bags)} bags of ${fmtInt(bagLb)} lb. Cost ${fmtUSD(result.cost)}., yardagemath.com/${SLUG}/`;

  return (
    <div>
      <CalculatorShell
        left={
          <div>
            <GroupLabel>Lawn areas</GroupLabel>
            {areas.map((a, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>Area {i + 1}</span>
                  <button type="button" className="button-secondary" onClick={() => remove(i)} aria-label={`Remove area ${i + 1}`} style={{ minHeight: 40, padding: "0 0.625rem" }} disabled={areas.length === 1}>✕</button>
                </div>
                <Field label="Shape" htmlFor={`shape-${i}`}>
                  <Select id={`shape-${i}`} value={a.shape} onChange={(v) => update(i, { shape: v as GrassShape })} options={SHAPE_OPTS} />
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
                {a.shape === "acres" && (
                  <Field label="Acres" htmlFor={`ac-${i}`} hint="1 acre = 43,560 sq ft."><NumberInput id={`ac-${i}`} value={a.acres} onChange={(v) => update(i, { acres: v })} suffix="acres" /></Field>
                )}
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
                    <button type="button" className="button-secondary" onClick={() => addCutout(i)} style={{ minHeight: 40 }}>+ Subtract a patio, bed or the house</button>
                  )}
                </div>
              </div>
            ))}
            <button type="button" className="button-secondary" onClick={add}>+ Add another area</button>

            <FormGroupDivider />
            <GroupLabel>Grass &amp; job</GroupLabel>
            <Field label="Grass type" htmlFor="grass">
              <Select id="grass" value={grass} onChange={(v) => setGrass(v as GrassTypeKey)} options={GRASS_OPTS} />
            </Field>
            {isCustom && (
              <Field label="Rate (lb per 1,000 sq ft)" htmlFor="crate" hint="Use the rate printed on your seed bag.">
                <NumberInput id="crate" value={customRate} onChange={setCustomRate} suffix="lb" />
              </Field>
            )}
            {!isWarm && !isCustom && (
              <Field label="Job" htmlFor="job">
                <Select id="job" value={job} onChange={(v) => setJob(v as SeedJob)} options={[
                  { value: "new", label: "New lawn (bare soil)" },
                  { value: "overseed", label: "Overseeding (existing lawn)" },
                ]} />
              </Field>
            )}
            {isWarm && (
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", margin: "0 0 0.875rem" }}>
                Warm-season lawns are usually not overseeded with the same grass. Use the new lawn rate for bare areas.
              </p>
            )}

            <FormGroupDivider />
            <GroupLabel>Bag &amp; price</GroupLabel>
            <Field label="Bag size" htmlFor="bag">
              <Select id="bag" value={bag} onChange={setBag} options={BAG_OPTS} />
            </Field>
            {bag === "custom" && (
              <Field label="Custom bag (lb)" htmlFor="cbag"><NumberInput id="cbag" value={customBag} onChange={setCustomBag} suffix="lb" /></Field>
            )}
            <Field label="Price per bag (optional)" htmlFor="price"><NumberInput id="price" value={price} onChange={setPrice} suffix="$/bag" /></Field>
          </div>
        }
        right={
          <div>
            <PrimaryResult
              label="Grass seed"
              value={fmtNumber(round(result.pounds, 1))}
              unit="lb"
              sub={`${fmtInt(result.bags)} bag${result.bags === 1 ? "" : "s"} of ${fmtInt(bagLb)} lb · ${fmtNumber(round(result.leftoverLb, 1))} lb left over.`}
            />
            <SecondaryResults>
              <SecondaryItem label="Lawn area" value={`${fmtNumber(round(result.netSqFt, 0))} sq ft`} />
              <SecondaryItem label="Bags" value={fmtInt(result.bags)} />
              <SecondaryItem label="Leftover seed" value={`${fmtNumber(round(result.leftoverLb, 1))} lb`} />
              <SecondaryItem label="Seed cost" value={fmtUSD(result.cost)} />
            </SecondaryResults>

            <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: "0.75rem" }}>
              Rate used: {fmtNumber(rate, 2)} lb per 1,000 sq ft ({type.label.toLowerCase()}, {jobWord}).
            </p>

            <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
              Laying sod instead?{" "}
              <Link href="/sod-calculator/" prefetch={false}>Use the Sod Calculator.</Link>
            </p>

            <ShowMath>
              <MathLine>area = {fmtNumber(round(result.netSqFt, 2))} sq ft (areas minus cut-outs)</MathLine>
              <MathLine>pounds = {fmtNumber(round(result.netSqFt, 2))} ÷ 1,000 × {fmtNumber(rate, 2)} = {fmtNumber(round(result.pounds, 2))} lb</MathLine>
              <MathLine>bags = ceil({fmtNumber(round(result.pounds, 2))} ÷ {fmtNumber(bagLb, 0)}) = {fmtInt(result.bags)}</MathLine>
              <MathLine>leftover = {fmtInt(result.bags)} × {fmtNumber(bagLb, 0)} - {fmtNumber(round(result.pounds, 2))} = {fmtNumber(round(result.leftoverLb, 2))} lb</MathLine>
            </ShowMath>

            <ResultActions
              slug={SLUG}
              getSummary={() => summary}
              getShareParams={() => ({ grass, job: effectiveJob, bag })}
              onReset={reset}
            />
          </div>
        }
      />
    </div>
  );
}
