"use client";

import { useMemo, useState } from "react";
import { computePaverBase, type PaverBaseShape, type PaverBaseInput } from "@/lib/formulas/paverBase";
import { round } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { PAVER_BASE_PROJECTS, PAVER_BASE_COMPACTION_PCT, PAVER_BASE_BAG_CUFT, PAVER_SAND_DEPTH_IN, PAVER_BASE_SAND_WASTE_PCT, DENSITY_TONS_PER_CUYD, PRICES } from "@/lib/constants";
import { fmtInt, fmtUSD, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, NumberInput, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "paver-base-calculator";

interface Area { shape: PaverBaseShape; l: string; w: string; d: string; b: string; h: string; sqft: string; }
const newArea = (): Area => ({ shape: "rectangle", l: "12", w: "12", d: "10", b: "10", h: "8", sqft: "144" });

type ProjectKey = keyof typeof PAVER_BASE_PROJECTS | "custom";
type MaterialKey = "crusherRun" | "crushedStone" | "custom";

const SHAPE_OPTS = [
  { value: "rectangle", label: "Rectangle (L × W)" },
  { value: "circle", label: "Circle (diameter)" },
  { value: "triangle", label: "Triangle (base × height)" },
  { value: "area", label: "I know the square feet" },
];
const PROJECT_OPTS = [
  ...(Object.keys(PAVER_BASE_PROJECTS) as (keyof typeof PAVER_BASE_PROJECTS)[]).map((k) => ({ value: k, label: `${PAVER_BASE_PROJECTS[k].label} (${PAVER_BASE_PROJECTS[k].depthIn} in)` })),
  { value: "custom", label: "Custom depth" },
];
const MATERIAL_OPTS = [
  { value: "crusherRun", label: "Crusher run / road base (1.5 t/yd)" },
  { value: "crushedStone", label: "Crushed stone #57 (1.4 t/yd)" },
  { value: "custom", label: "Custom (lb per cu yd)" },
];

export function PaverBaseCalculator() {
  const [areas, setAreas] = useState<Area[]>([newArea()]);
  const [project, setProject] = useState<ProjectKey>("patio");
  const [baseDepth, setBaseDepth] = useState("4");
  const [compaction, setCompaction] = useState(String(PAVER_BASE_COMPACTION_PCT));
  const [sandDepth, setSandDepth] = useState(String(PAVER_SAND_DEPTH_IN));
  const [material, setMaterial] = useState<MaterialKey>("crusherRun");
  const [customLb, setCustomLb] = useState("3000");
  const [basePrice, setBasePrice] = useState(String(PRICES.gravelPerTon));
  const [baseBagPrice, setBaseBagPrice] = useState(String(PRICES.paverBasePerBag));
  const [sandBagPrice, setSandBagPrice] = useState(String(PRICES.sandPerBag));

  const density = material === "custom" ? num(customLb) / 2000 : material === "crushedStone" ? DENSITY_TONS_PER_CUYD.crushedStone : DENSITY_TONS_PER_CUYD.crusherRun;

  const result = useMemo(() => {
    const input: PaverBaseInput = {
      areas: areas.map((a) => ({
        shape: a.shape, lengthFt: num(a.l), widthFt: num(a.w), diameterFt: num(a.d), baseFt: num(a.b), heightFt: num(a.h), directSqFt: num(a.sqft),
      })),
      baseDepthIn: num(baseDepth),
      compactionPct: num(compaction),
      baseDensity: density,
      sandDepthIn: num(sandDepth),
      sandWastePct: PAVER_BASE_SAND_WASTE_PCT,
      sandDensity: DENSITY_TONS_PER_CUYD.sand,
      bagCuFt: PAVER_BASE_BAG_CUFT,
      basePricePerTon: num(basePrice),
      basePricePerBag: num(baseBagPrice),
      sandPricePerBag: num(sandBagPrice),
    };
    return computePaverBase(input);
  }, [areas, baseDepth, compaction, density, sandDepth, basePrice, baseBagPrice, sandBagPrice]);

  useFirstCalculate(SLUG, JSON.stringify({ areas, project, baseDepth, compaction, sandDepth, material, customLb, basePrice, baseBagPrice, sandBagPrice }));

  const update = (i: number, patch: Partial<Area>) => setAreas(areas.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => setAreas([...areas, newArea()]);
  const remove = (i: number) => setAreas(areas.length > 1 ? areas.filter((_, idx) => idx !== i) : areas);
  const setProjectDepth = (p: string) => {
    setProject(p as ProjectKey);
    if (p !== "custom") setBaseDepth(String(PAVER_BASE_PROJECTS[p as keyof typeof PAVER_BASE_PROJECTS].depthIn));
  };
  const reset = () => {
    setAreas([newArea()]); setProject("patio"); setBaseDepth("4"); setCompaction(String(PAVER_BASE_COMPACTION_PCT));
    setSandDepth(String(PAVER_SAND_DEPTH_IN)); setMaterial("crusherRun"); setCustomLb("3000");
    setBasePrice(String(PRICES.gravelPerTon)); setBaseBagPrice(String(PRICES.paverBasePerBag)); setSandBagPrice(String(PRICES.sandPerBag));
  };

  const cheaperBulk = result.cheaper === "bulk";
  const cheaperBagged = result.cheaper === "bagged";
  const summary = `Paver base: ${fmtNumber(round(result.baseTons, 2))} tons (${fmtNumber(round(result.baseCuYd, 2))} cu yd / ${fmtInt(result.baseBags)} bags), plus ${fmtInt(result.sandBags)} bags of bedding sand. Bulk ${fmtUSD(result.bulkCost)} vs bagged ${fmtUSD(result.baggedCost)}., yardagemath.com/${SLUG}/`;

  return (
    <div>
      <CalculatorShell
        left={
          <div>
            <GroupLabel>Area</GroupLabel>
            {areas.map((a, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>Area {i + 1}</span>
                  <button type="button" className="button-secondary" onClick={() => remove(i)} aria-label={`Remove area ${i + 1}`} style={{ minHeight: 40, padding: "0 0.625rem" }} disabled={areas.length === 1}>✕</button>
                </div>
                <Field label="Shape" htmlFor={`shape-${i}`}>
                  <Select id={`shape-${i}`} value={a.shape} onChange={(v) => update(i, { shape: v as PaverBaseShape })} options={SHAPE_OPTS} />
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
            <GroupLabel>Project &amp; base</GroupLabel>
            <Field label="Project" htmlFor="project" hint="Sets a typical base depth.">
              <Select id="project" value={project} onChange={setProjectDepth} options={PROJECT_OPTS} />
            </Field>
            <Field label="Base depth (inches)" htmlFor="base"><NumberInput id="base" value={baseDepth} onChange={setBaseDepth} suffix="in" /></Field>
            <Field label="Compaction allowance (%)" htmlFor="comp" hint="Loose stone shrinks when compacted, so order extra.">
              <NumberInput id="comp" value={compaction} onChange={setCompaction} suffix="%" />
            </Field>
            <Field label="Base material" htmlFor="mat">
              <Select id="mat" value={material} onChange={(v) => setMaterial(v as MaterialKey)} options={MATERIAL_OPTS} />
            </Field>
            {material === "custom" && (
              <Field label="Custom weight (lb per cu yd)" htmlFor="clb"><NumberInput id="clb" value={customLb} onChange={setCustomLb} suffix="lb/yd" /></Field>
            )}
            <Field label="Bedding sand depth (inches)" htmlFor="sand"><NumberInput id="sand" value={sandDepth} onChange={setSandDepth} suffix="in" /></Field>

            <FormGroupDivider />
            <GroupLabel>Prices</GroupLabel>
            <Field label="Base price per ton (bulk)" htmlFor="bp"><NumberInput id="bp" value={basePrice} onChange={setBasePrice} suffix="$/ton" /></Field>
            <Field label="Base price per bag" htmlFor="bbp"><NumberInput id="bbp" value={baseBagPrice} onChange={setBaseBagPrice} suffix="$/bag" /></Field>
            <Field label="Sand price per bag" htmlFor="sbp"><NumberInput id="sbp" value={sandBagPrice} onChange={setSandBagPrice} suffix="$/bag" /></Field>
          </div>
        }
        right={
          <div>
            <PrimaryResult
              label="Gravel base needed"
              value={fmtNumber(round(result.baseTons, 2))}
              unit="tons"
              sub={`${fmtNumber(round(result.baseCuYd, 2))} cu yd loose (incl. ${compaction}% compaction) · ${fmtNumber(round(result.areaSqFt, 1))} sq ft`}
            />
            <SecondaryResults>
              <SecondaryItem label="Base, loose" value={`${fmtNumber(round(result.baseCuFtLoose, 1))} cu ft`} />
              <SecondaryItem label="Base bags (0.5 cu ft)" value={fmtInt(result.baseBags)} />
              <SecondaryItem label="Bedding sand" value={`${fmtNumber(round(result.sandTons, 2))} tons`} />
              <SecondaryItem label="Sand bags (0.5 cu ft)" value={fmtInt(result.sandBags)} />
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
              <MathLine>base cu ft = {fmtNumber(round(result.areaSqFt, 1))} × ({baseDepth} ÷ 12) × (1 + {compaction}%) = {fmtNumber(round(result.baseCuFtLoose, 1))}</MathLine>
              <MathLine>cubic yards = {fmtNumber(round(result.baseCuFtLoose, 1))} ÷ 27 = {fmtNumber(round(result.baseCuYd, 2))}</MathLine>
              <MathLine>tons = {fmtNumber(round(result.baseCuYd, 2))} × {fmtNumber(round(density, 2))} = {fmtNumber(round(result.baseTons, 2))}</MathLine>
              <MathLine>base bags = ceil({fmtNumber(round(result.baseCuFtLoose, 1))} ÷ 0.5) = {fmtInt(result.baseBags)}</MathLine>
              <MathLine>sand bags = ceil({fmtNumber(round(result.areaSqFt * num(sandDepth) / 12, 1))} × 1.1 ÷ 0.5) = {fmtInt(result.sandBags)}</MathLine>
            </ShowMath>

            <ResultActions slug={SLUG} getSummary={() => summary} getShareParams={() => ({ project, baseDepth, compaction })} onReset={reset} />
          </div>
        }
      />
    </div>
  );
}
