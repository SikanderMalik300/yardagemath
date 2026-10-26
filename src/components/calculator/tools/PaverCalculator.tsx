"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { computePaver, paversPerSqFt, type PaverShape, type PaverSizeKey, type PaverInput } from "@/lib/formulas/paver";
import { round } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { PAVER_SIZES, PAVER_WASTE, PAVER_SAND_DEPTH_IN, PAVER_BASE_SAND_WASTE_PCT, PAVER_BASE_COMPACTION_PCT, DENSITY_TONS_PER_CUYD, PRICES } from "@/lib/constants";
import { fmtInt, fmtUSD, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, NumberInput, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "paver-calculator";

interface Area {
  shape: PaverShape;
  l: string; w: string; d: string; b: string; h: string; sqft: string; perim: string;
}
const newArea = (): Area => ({ shape: "rectangle", l: "12", w: "12", d: "10", b: "10", h: "8", sqft: "144", perim: "0" });

interface Cutout { w: string; h: string; }

const SHAPE_OPTS = [
  { value: "rectangle", label: "Rectangle (L × W)" },
  { value: "circle", label: "Circle (diameter)" },
  { value: "triangle", label: "Triangle (base × height)" },
  { value: "area", label: "I know the square feet" },
];
const SIZE_OPTS = [
  ...(Object.keys(PAVER_SIZES) as (keyof typeof PAVER_SIZES)[]).map((k) => ({ value: k, label: PAVER_SIZES[k].label })),
  { value: "custom", label: "Custom size" },
];
const PATTERN_OPTS = [
  { value: "runningBond", label: `Running bond / basket weave (${PAVER_WASTE.runningBond}%)` },
  { value: "herringbone", label: `Herringbone (${PAVER_WASTE.herringbone}%)` },
  { value: "diagonal", label: `45° or curves (${PAVER_WASTE.diagonal}%)` },
];

export function PaverCalculator() {
  const [areas, setAreas] = useState<Area[]>([newArea()]);
  const [cutouts, setCutouts] = useState<Cutout[]>([]);
  const [size, setSize] = useState<PaverSizeKey>("holland");
  const [customL, setCustomL] = useState("8");
  const [customW, setCustomW] = useState("4");
  const [pattern, setPattern] = useState<keyof typeof PAVER_WASTE>("runningBond");
  const [waste, setWaste] = useState(String(PAVER_WASTE.runningBond));
  const [baseDepth, setBaseDepth] = useState("4");
  const [priceMode, setPriceMode] = useState<"perPaver" | "perSqFt">("perPaver");
  const [pricePerPaver, setPricePerPaver] = useState(String(PRICES.paverEach));
  const [pricePerSqFt, setPricePerSqFt] = useState(String(PRICES.paverPerSqFt));
  const [basePrice, setBasePrice] = useState(String(PRICES.gravelPerTon));
  const [sandBagPrice, setSandBagPrice] = useState(String(PRICES.sandPerBag));

  const perSqFt = size === "custom" ? paversPerSqFt(num(customL), num(customW)) : paversPerSqFt(PAVER_SIZES[size].lengthIn, PAVER_SIZES[size].widthIn);

  const result = useMemo(() => {
    const input: PaverInput = {
      areas: areas.map((a) => ({
        shape: a.shape,
        lengthFt: num(a.l), widthFt: num(a.w), diameterFt: num(a.d), baseFt: num(a.b), heightFt: num(a.h),
        directSqFt: num(a.sqft), directPerimeterFt: num(a.perim),
      })),
      cutouts: cutouts.map((c) => ({ widthFt: num(c.w), heightFt: num(c.h) })),
      perSqFt,
      wastePct: num(waste),
      baseDepthIn: num(baseDepth),
      baseDensity: DENSITY_TONS_PER_CUYD.crusherRun,
      sandDepthIn: PAVER_SAND_DEPTH_IN,
      sandDensity: DENSITY_TONS_PER_CUYD.sand,
      sandBagCuFt: 0.5,
      baseCompactionPct: PAVER_BASE_COMPACTION_PCT,
      sandWastePct: PAVER_BASE_SAND_WASTE_PCT,
      priceMode,
      pricePerPaver: num(pricePerPaver),
      pricePerSqFt: num(pricePerSqFt),
      basePricePerTon: num(basePrice),
      sandPricePerBag: num(sandBagPrice),
    };
    return computePaver(input);
  }, [areas, cutouts, perSqFt, waste, baseDepth, priceMode, pricePerPaver, pricePerSqFt, basePrice, sandBagPrice]);

  useFirstCalculate(SLUG, JSON.stringify({ areas, cutouts, size, customL, customW, pattern, waste, baseDepth, priceMode, pricePerPaver, pricePerSqFt, basePrice, sandBagPrice }));

  const update = (i: number, patch: Partial<Area>) => setAreas(areas.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => setAreas([...areas, newArea()]);
  const remove = (i: number) => setAreas(areas.length > 1 ? areas.filter((_, idx) => idx !== i) : areas);
  const setPatternWaste = (p: string) => { setPattern(p as keyof typeof PAVER_WASTE); setWaste(String(PAVER_WASTE[p as keyof typeof PAVER_WASTE])); };
  const reset = () => {
    setAreas([newArea()]); setCutouts([]); setSize("holland"); setCustomL("8"); setCustomW("4");
    setPattern("runningBond"); setWaste(String(PAVER_WASTE.runningBond)); setBaseDepth("4");
    setPriceMode("perPaver"); setPricePerPaver(String(PRICES.paverEach)); setPricePerSqFt(String(PRICES.paverPerSqFt));
    setBasePrice(String(PRICES.gravelPerTon)); setSandBagPrice(String(PRICES.sandPerBag));
  };

  const summary = `Pavers: ${fmtInt(result.paversWithWaste)} with ${waste}% waste (${fmtInt(result.pavers)} before). Base ${fmtNumber(round(result.baseTonsWithWaste, 2))} t, sand ${fmtInt(result.sandBagsWithWaste)} bags, edging ${fmtInt(Math.ceil(result.edgingLinearFt))} ft. Total ${fmtUSD(result.totalCost)}., yardagemath.com/${SLUG}/`;

  return (
    <div>
      <CalculatorShell
        left={
          <div>
            <GroupLabel>Patio / walkway area</GroupLabel>
            {areas.map((a, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>Area {i + 1}</span>
                  <button type="button" className="button-secondary" onClick={() => remove(i)} aria-label={`Remove area ${i + 1}`} style={{ minHeight: 40, padding: "0 0.625rem" }} disabled={areas.length === 1}>✕</button>
                </div>
                <Field label="Shape" htmlFor={`shape-${i}`}>
                  <Select id={`shape-${i}`} value={a.shape} onChange={(v) => update(i, { shape: v as PaverShape })} options={SHAPE_OPTS} />
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
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <Field label="Area (sq ft)" htmlFor={`a-${i}`}><NumberInput id={`a-${i}`} value={a.sqft} onChange={(v) => update(i, { sqft: v })} suffix="sq ft" /></Field>
                    <Field label="Perimeter (ft)" htmlFor={`p-${i}`} hint="Optional, for edging."><NumberInput id={`p-${i}`} value={a.perim} onChange={(v) => update(i, { perim: v })} suffix="ft" /></Field>
                  </div>
                )}
              </div>
            ))}
            <button type="button" className="button-secondary" onClick={add}>+ Add another area</button>

            <FormGroupDivider />
            <GroupLabel>Cut-outs (fire pit, planter)</GroupLabel>
            {cutouts.length === 0 && <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: 0 }}>None. Add up to 3 to subtract their area.</p>}
            {cutouts.map((c, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.5rem", alignItems: "end", marginBottom: "0.5rem" }}>
                <Field label="Width (ft)" htmlFor={`cw-${i}`}><NumberInput id={`cw-${i}`} value={c.w} onChange={(v) => setCutouts(cutouts.map((x, idx) => idx === i ? { ...x, w: v } : x))} /></Field>
                <Field label="Length (ft)" htmlFor={`ch-${i}`}><NumberInput id={`ch-${i}`} value={c.h} onChange={(v) => setCutouts(cutouts.map((x, idx) => idx === i ? { ...x, h: v } : x))} /></Field>
                <button type="button" className="button-secondary" onClick={() => setCutouts(cutouts.filter((_, idx) => idx !== i))} aria-label={`Remove cut-out ${i + 1}`} style={{ minHeight: 46, padding: "0 0.75rem" }}>✕</button>
              </div>
            ))}
            {cutouts.length < 3 && <button type="button" className="button-secondary" onClick={() => setCutouts([...cutouts, { w: "3", h: "3" }])}>+ Add cut-out</button>}

            <FormGroupDivider />
            <GroupLabel>Paver &amp; pattern</GroupLabel>
            <Field label="Paver size" htmlFor="size" hint="Holland 4 × 8 is the most common.">
              <Select id="size" value={size} onChange={(v) => setSize(v as PaverSizeKey)} options={SIZE_OPTS} />
            </Field>
            {size === "custom" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <Field label="Paver length (in)" htmlFor="cl"><NumberInput id="cl" value={customL} onChange={setCustomL} suffix="in" /></Field>
                <Field label="Paver width (in)" htmlFor="cw"><NumberInput id="cw" value={customW} onChange={setCustomW} suffix="in" /></Field>
              </div>
            )}
            <Field label="Pattern" htmlFor="pattern">
              <Select id="pattern" value={pattern} onChange={setPatternWaste} options={PATTERN_OPTS} />
            </Field>
            <Field label="Waste / extra (%)" htmlFor="waste">
              <NumberInput id="waste" value={waste} onChange={setWaste} suffix="%" />
            </Field>

            <FormGroupDivider />
            <GroupLabel>Base, sand &amp; price</GroupLabel>
            <Field label="Base depth (inches)" htmlFor="base" hint="About 4 inches for a patio or walkway.">
              <NumberInput id="base" value={baseDepth} onChange={setBaseDepth} suffix="in" />
            </Field>
            <Field label="Price mode" htmlFor="pmode">
              <Select id="pmode" value={priceMode} onChange={(v) => setPriceMode(v as "perPaver" | "perSqFt")} options={[{ value: "perPaver", label: "Per paver" }, { value: "perSqFt", label: "Per sq ft" }]} />
            </Field>
            {priceMode === "perPaver" ? (
              <Field label="Price per paver" htmlFor="ppp"><NumberInput id="ppp" value={pricePerPaver} onChange={setPricePerPaver} suffix="$" /></Field>
            ) : (
              <Field label="Price per sq ft" htmlFor="pps"><NumberInput id="pps" value={pricePerSqFt} onChange={setPricePerSqFt} suffix="$/sq ft" /></Field>
            )}
            <Field label="Base price per ton" htmlFor="bp"><NumberInput id="bp" value={basePrice} onChange={setBasePrice} suffix="$/ton" /></Field>
            <Field label="Sand price per bag" htmlFor="sbp"><NumberInput id="sbp" value={sandBagPrice} onChange={setSandBagPrice} suffix="$/bag" /></Field>
          </div>
        }
        right={
          <div>
            <PrimaryResult
              label="Pavers needed"
              value={fmtInt(result.paversWithWaste)}
              unit="pavers"
              sub={`${fmtInt(result.pavers)} before ${waste}% waste · ${fmtNumber(round(result.netAreaSqFt, 1))} net sq ft`}
            />
            <SecondaryResults>
              <SecondaryItem label="Net area" value={`${fmtNumber(round(result.netAreaSqFt, 1))} sq ft`} />
              <SecondaryItem label="Gravel base" value={`${fmtNumber(round(result.baseTonsWithWaste, 2))} tons`} />
              <SecondaryItem label="Bedding sand" value={`${fmtInt(result.sandBagsWithWaste)} bags (${fmtNumber(round(result.sandTons, 2))} t)`} />
              <SecondaryItem label="Edging" value={`${fmtInt(Math.ceil(result.edgingLinearFt))} linear ft`} />
              <SecondaryItem label="Material cost" value={fmtUSD(result.totalCost)} />
            </SecondaryResults>

            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
              Base and sand are a summary ({fmtNumber(round(result.baseCuYd, 2))} cu yd base at {baseDepth} in, {PAVER_SAND_DEPTH_IN} in sand).{" "}
              For base depth by project and bags vs bulk, use the{" "}
              <Link href="/paver-base-calculator/" prefetch={false}>Paver Base Calculator</Link>.{" "}
              For bagged bedding sand,{" "}
              <Link href="/sand-calculator/" prefetch={false}>use the Sand Calculator.</Link>
            </p>

            <ShowMath>
              <MathLine>net area = {fmtNumber(round(result.netAreaSqFt, 1))} sq ft (after cut-outs)</MathLine>
              <MathLine>pavers = {fmtNumber(round(result.netAreaSqFt, 1))} × {fmtNumber(round(perSqFt, 4))} = {fmtNumber(round(result.netAreaSqFt * perSqFt, 1))}</MathLine>
              <MathLine>+ {waste}% waste → {fmtInt(result.paversWithWaste)} pavers</MathLine>
              <MathLine>base = {fmtNumber(round(result.baseCuYd, 2))} cu yd × 1.5 = {fmtNumber(round(result.baseTons, 2))} tons, + {PAVER_BASE_COMPACTION_PCT}% compaction → {fmtNumber(round(result.baseTonsWithWaste, 2))} tons</MathLine>
              <MathLine>sand = {fmtNumber(round(result.netAreaSqFt * PAVER_SAND_DEPTH_IN / 12, 1))} cu ft, + {PAVER_BASE_SAND_WASTE_PCT}% → ceil({fmtNumber(round(result.netAreaSqFt * PAVER_SAND_DEPTH_IN / 12 * (1 + PAVER_BASE_SAND_WASTE_PCT / 100), 1))} ÷ 0.5) = {fmtInt(result.sandBagsWithWaste)} bags</MathLine>
            </ShowMath>

            <ResultActions
              slug={SLUG}
              getSummary={() => summary}
              getShareParams={() => ({ size, pattern, waste })}
              onReset={reset}
            />
          </div>
        }
      />
    </div>
  );
}
