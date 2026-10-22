"use client";

import { useMemo, useState } from "react";
import { computeFillDirt, type FillKind, type FillArea, type FillDirtInput } from "@/lib/formulas/fillDirt";
import { round } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { FILL_DIRT_DENSITY, FILL_COMPACTION_PCT, FILL_TRUCKLOADS, PRICES } from "@/lib/constants";
import { fmtInt, fmtUSD, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, NumberInput, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "fill-dirt-calculator";

type WeightKey = "typical" | "wet" | "custom";
type LoadKey = "tandem" | "small" | "large" | "custom";

interface Area {
  kind: FillKind;
  l: string; w: string; sqft: string; useSqFt: boolean;
  depthIn: string; depthFt: string; dia: string; d1: string; d2: string;
}
const newArea = (): Area => ({ kind: "raise", l: "20", w: "30", sqft: "600", useSqFt: false, depthIn: "6", depthFt: "3", dia: "3", d1: "0", d2: "12" });

const KIND_OPTS = [
  { value: "raise", label: "Raise an area" },
  { value: "hole", label: "Rectangular hole or trench" },
  { value: "round", label: "Round hole" },
  { value: "sloped", label: "Sloped spot" },
];

export function FillDirtCalculator() {
  const [areas, setAreas] = useState<Area[]>([newArea()]);
  const [compaction, setCompaction] = useState(String(FILL_COMPACTION_PCT));
  const [weight, setWeight] = useState<WeightKey>("typical");
  const [customWeight, setCustomWeight] = useState("1.3");
  const [load, setLoad] = useState<LoadKey>("tandem");
  const [customLoad, setCustomLoad] = useState("12");
  const [price, setPrice] = useState(String(PRICES.fillDirtPerCuYd));
  const [delivery, setDelivery] = useState(String(PRICES.fillDeliveryPerLoad));

  const density = weight === "custom" ? num(customWeight) : weight === "wet" ? FILL_DIRT_DENSITY.wet : FILL_DIRT_DENSITY.typical;
  const loadSize = load === "custom" ? num(customLoad) : FILL_TRUCKLOADS[load];

  const result = useMemo(() => {
    const input: FillDirtInput = {
      areas: areas.map((a): FillArea => ({
        kind: a.kind,
        lengthFt: num(a.l), widthFt: num(a.w), directSqFt: num(a.sqft), useSqFt: a.useSqFt,
        depthIn: num(a.depthIn), depthFt: num(a.depthFt), diameterFt: num(a.dia),
        depth1In: num(a.d1), depth2In: num(a.d2),
      })),
      compactionPct: num(compaction),
      density,
      loadSizeCuYd: loadSize,
      pricePerCuYd: num(price),
      deliveryPerLoad: num(delivery),
    };
    return computeFillDirt(input);
  }, [areas, compaction, density, loadSize, price, delivery]);

  useFirstCalculate(SLUG, JSON.stringify({ areas, compaction, weight, customWeight, load, customLoad, price, delivery }));

  const update = (i: number, patch: Partial<Area>) => setAreas(areas.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  const add = () => setAreas([...areas, newArea()]);
  const remove = (i: number) => setAreas(areas.length > 1 ? areas.filter((_, idx) => idx !== i) : areas);
  const reset = () => {
    setAreas([newArea()]); setCompaction(String(FILL_COMPACTION_PCT)); setWeight("typical"); setCustomWeight("1.3");
    setLoad("tandem"); setCustomLoad("12"); setPrice(String(PRICES.fillDirtPerCuYd)); setDelivery(String(PRICES.fillDeliveryPerLoad));
  };

  const summary = `Fill dirt: ${fmtNumber(round(result.cubicYardsCompacted, 2))} cu yd with ${compaction}% compaction (${fmtNumber(round(result.cubicYards, 2))} before), ${fmtNumber(round(result.tons, 2))} tons, ${fmtInt(result.loads)} truckloads. Cost ${fmtUSD(result.cost)}., yardagemath.com/${SLUG}/`;

  return (
    <div>
      <CalculatorShell
        left={
          <div>
            <GroupLabel>What are you filling?</GroupLabel>
            {areas.map((a, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>Area {i + 1}</span>
                  <button type="button" className="button-secondary" onClick={() => remove(i)} aria-label={`Remove area ${i + 1}`} style={{ minHeight: 40, padding: "0 0.625rem" }} disabled={areas.length === 1}>✕</button>
                </div>
                <Field label="Filling" htmlFor={`kind-${i}`}>
                  <Select id={`kind-${i}`} value={a.kind} onChange={(v) => update(i, { kind: v as FillKind })} options={KIND_OPTS} />
                </Field>

                {a.kind === "raise" && (
                  <>
                    <Field label="Measure by" htmlFor={`mb-${i}`}>
                      <Select id={`mb-${i}`} value={a.useSqFt ? "sqft" : "lw"} onChange={(v) => update(i, { useSqFt: v === "sqft" })} options={[{ value: "lw", label: "Length × width" }, { value: "sqft", label: "I know the square feet" }]} />
                    </Field>
                    {a.useSqFt ? (
                      <Field label="Area (sq ft)" htmlFor={`sq-${i}`}><NumberInput id={`sq-${i}`} value={a.sqft} onChange={(v) => update(i, { sqft: v })} suffix="sq ft" /></Field>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                        <Field label="Length (ft)" htmlFor={`l-${i}`}><NumberInput id={`l-${i}`} value={a.l} onChange={(v) => update(i, { l: v })} suffix="ft" /></Field>
                        <Field label="Width (ft)" htmlFor={`w-${i}`}><NumberInput id={`w-${i}`} value={a.w} onChange={(v) => update(i, { w: v })} suffix="ft" /></Field>
                      </div>
                    )}
                    <Field label="Depth (inches)" htmlFor={`d-${i}`}><NumberInput id={`d-${i}`} value={a.depthIn} onChange={(v) => update(i, { depthIn: v })} suffix="in" /></Field>
                  </>
                )}

                {a.kind === "hole" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <Field label="Length (ft)" htmlFor={`hl-${i}`}><NumberInput id={`hl-${i}`} value={a.l} onChange={(v) => update(i, { l: v })} suffix="ft" /></Field>
                    <Field label="Width (ft)" htmlFor={`hw-${i}`}><NumberInput id={`hw-${i}`} value={a.w} onChange={(v) => update(i, { w: v })} suffix="ft" /></Field>
                    <Field label="Depth (ft)" htmlFor={`hd-${i}`}><NumberInput id={`hd-${i}`} value={a.depthFt} onChange={(v) => update(i, { depthFt: v })} suffix="ft" /></Field>
                  </div>
                )}

                {a.kind === "round" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <Field label="Diameter (ft)" htmlFor={`rd-${i}`}><NumberInput id={`rd-${i}`} value={a.dia} onChange={(v) => update(i, { dia: v })} suffix="ft" /></Field>
                    <Field label="Depth (ft)" htmlFor={`rdp-${i}`}><NumberInput id={`rdp-${i}`} value={a.depthFt} onChange={(v) => update(i, { depthFt: v })} suffix="ft" /></Field>
                  </div>
                )}

                {a.kind === "sloped" && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      <Field label="Length (ft)" htmlFor={`sl-${i}`}><NumberInput id={`sl-${i}`} value={a.l} onChange={(v) => update(i, { l: v })} suffix="ft" /></Field>
                      <Field label="Width (ft)" htmlFor={`sw-${i}`}><NumberInput id={`sw-${i}`} value={a.w} onChange={(v) => update(i, { w: v })} suffix="ft" /></Field>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      <Field label="Depth, shallow end (in)" htmlFor={`sd1-${i}`}><NumberInput id={`sd1-${i}`} value={a.d1} onChange={(v) => update(i, { d1: v })} suffix="in" /></Field>
                      <Field label="Depth, deep end (in)" htmlFor={`sd2-${i}`}><NumberInput id={`sd2-${i}`} value={a.d2} onChange={(v) => update(i, { d2: v })} suffix="in" /></Field>
                    </div>
                  </>
                )}
              </div>
            ))}
            <button type="button" className="button-secondary" onClick={add}>+ Add another area</button>

            <FormGroupDivider />
            <GroupLabel>Compaction, weight &amp; truck</GroupLabel>
            <Field label="Compaction allowance (%)" htmlFor="comp" hint="Loose fill settles when it's packed. 0 to 40%.">
              <NumberInput id="comp" value={compaction} onChange={setCompaction} suffix="%" />
            </Field>
            <Field label="Dirt weight" htmlFor="weight">
              <Select id="weight" value={weight} onChange={(v) => setWeight(v as WeightKey)} options={[
                { value: "typical", label: "Typical dry fill (1.2 t/yd)" },
                { value: "wet", label: "Wet / clay-heavy (1.4 t/yd)" },
                { value: "custom", label: "Custom" },
              ]} />
            </Field>
            {weight === "custom" && (
              <Field label="Custom weight (tons per cu yd)" htmlFor="cw"><NumberInput id="cw" value={customWeight} onChange={setCustomWeight} suffix="t/yd" /></Field>
            )}
            <Field label="Truck load size" htmlFor="load">
              <Select id="load" value={load} onChange={(v) => setLoad(v as LoadKey)} options={[
                { value: "tandem", label: "Tandem dump truck (10 cu yd)" },
                { value: "small", label: "Small truck (5 cu yd)" },
                { value: "large", label: "Large truck (14 cu yd)" },
                { value: "custom", label: "Custom" },
              ]} />
            </Field>
            {load === "custom" && (
              <Field label="Custom load (cu yd)" htmlFor="clo"><NumberInput id="clo" value={customLoad} onChange={setCustomLoad} suffix="cu yd" /></Field>
            )}

            <FormGroupDivider />
            <GroupLabel>Price</GroupLabel>
            <Field label="Price per cubic yard" htmlFor="price"><NumberInput id="price" value={price} onChange={setPrice} suffix="$/yd" /></Field>
            <Field label="Delivery fee per load" htmlFor="del"><NumberInput id="del" value={delivery} onChange={setDelivery} suffix="$/load" /></Field>
          </div>
        }
        right={
          <div>
            <PrimaryResult
              label="Fill dirt needed"
              value={fmtNumber(round(result.cubicYardsCompacted, 2))}
              unit="cu yd"
              sub={`${fmtNumber(round(result.cubicYards, 2))} cu yd before ${compaction}% compaction · ${fmtNumber(round(result.cubicFeet, 1))} cu ft`}
            />
            <SecondaryResults>
              <SecondaryItem label="Before compaction" value={`${fmtNumber(round(result.cubicYards, 2))} cu yd`} />
              <SecondaryItem label="Weight" value={`${fmtNumber(round(result.tons, 2))} tons`} />
              <SecondaryItem label="Truckloads" value={fmtInt(result.loads)} />
              <SecondaryItem label="Estimated cost" value={fmtUSD(result.cost)} />
            </SecondaryResults>

            <ShowMath>
              <MathLine>cubic feet = {fmtNumber(round(result.cubicFeet, 1))}</MathLine>
              <MathLine>cubic yards = {fmtNumber(round(result.cubicFeet, 1))} ÷ 27 = {fmtNumber(round(result.cubicYards, 2))}</MathLine>
              <MathLine>+ {compaction}% compaction → {fmtNumber(round(result.cubicYardsCompacted, 2))} cu yd</MathLine>
              <MathLine>tons = {fmtNumber(round(result.cubicYardsCompacted, 2))} × {fmtNumber(round(density, 2))} = {fmtNumber(round(result.tons, 2))}</MathLine>
              <MathLine>loads = ceil({fmtNumber(round(result.cubicYardsCompacted, 2))} ÷ {fmtNumber(round(loadSize, 0))}) = {fmtInt(result.loads)}</MathLine>
            </ShowMath>

            <ResultActions slug={SLUG} getSummary={() => summary} getShareParams={() => ({ comp: compaction, weight, load })} onReset={reset} />
          </div>
        }
      />
    </div>
  );
}
