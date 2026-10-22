"use client";

import { useMemo, useState } from "react";
import { computeAsphalt, ASPHALT_MATERIALS, type AsphaltShape, type AsphaltMaterialKey, type AsphaltInput } from "@/lib/formulas/asphalt";
import { round } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { ASPHALT_PROJECTS, ASPHALT_BASE_DEPTH_IN, ASPHALT_TRUCK_TONS, PRICES } from "@/lib/constants";
import { fmtInt, fmtUSD, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, NumberInput, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "asphalt-calculator";

type CutoutShape = "rectangle" | "circle" | "area";
interface Cutout { shape: CutoutShape; l: string; w: string; d: string; sqft: string; }
interface Area { shape: AsphaltShape; l: string; w: string; d: string; b: string; h: string; sqft: string; cutouts: Cutout[]; }

const newCutout = (): Cutout => ({ shape: "rectangle", l: "3", w: "4", d: "3", sqft: "9" });
const newArea = (): Area => ({ shape: "rectangle", l: "12", w: "50", d: "10", b: "10", h: "8", sqft: "600", cutouts: [] });

const SHAPE_OPTS = [
  { value: "rectangle", label: "Rectangle (L × W)" },
  { value: "circle", label: "Circle (diameter)" },
  { value: "triangle", label: "Triangle (base × height)" },
  { value: "area", label: "I know the square feet" },
];
const CUTOUT_SHAPE_OPTS = [
  { value: "rectangle", label: "Island / rectangle (L × W)" },
  { value: "circle", label: "Planter / circle (diameter)" },
  { value: "area", label: "Square feet" },
];
const MATERIAL_OPTS = (Object.keys(ASPHALT_MATERIALS) as AsphaltMaterialKey[]).map((k) => ({ value: k, label: ASPHALT_MATERIALS[k].label }));
type ProjectKey = keyof typeof ASPHALT_PROJECTS | "custom";
const PROJECT_OPTS: { value: ProjectKey; label: string }[] = [
  ...(Object.keys(ASPHALT_PROJECTS) as (keyof typeof ASPHALT_PROJECTS)[]).map((k) => ({ value: k, label: ASPHALT_PROJECTS[k].label })),
  { value: "custom" as const, label: "Custom thickness" },
];

export function AsphaltCalculator() {
  const [areas, setAreas] = useState<Area[]>([newArea()]);
  const [project, setProject] = useState<ProjectKey>("driveway");
  const [thickness, setThickness] = useState(String(ASPHALT_PROJECTS.driveway.thicknessIn));
  const [material, setMaterial] = useState<AsphaltMaterialKey>("hotMix");
  const [customLb, setCustomLb] = useState("145");
  const [waste, setWaste] = useState("5");
  const [baseOn, setBaseOn] = useState(false);
  const [baseDepth, setBaseDepth] = useState(String(ASPHALT_BASE_DEPTH_IN));
  const [truck, setTruck] = useState(String(ASPHALT_TRUCK_TONS));
  const [customTruck, setCustomTruck] = useState("25");
  const [price, setPrice] = useState(String(PRICES.asphaltPerTon));
  const [basePrice, setBasePrice] = useState(String(PRICES.gravelPerTon));
  const [installed, setInstalled] = useState(String(PRICES.asphaltInstalledPerSqFt));

  const density = material === "custom" ? num(customLb) : ASPHALT_MATERIALS[material].densityLbPerCuFt;
  const truckTons = truck === "custom" ? num(customTruck) : num(truck);

  const result = useMemo(() => {
    const input: AsphaltInput = {
      areas: areas.map((a) => ({
        shape: a.shape,
        lengthFt: num(a.l),
        widthFt: num(a.w),
        diameterFt: num(a.d),
        baseFt: num(a.b),
        heightFt: num(a.h),
        directSqFt: num(a.sqft),
        cutouts: a.cutouts.map((c) => ({ shape: c.shape, lengthFt: num(c.l), widthFt: num(c.w), diameterFt: num(c.d), directSqFt: num(c.sqft) })),
      })),
      thicknessIn: num(thickness),
      wastePct: num(waste),
      densityLbPerCuFt: density,
      pricePerTon: num(price),
      truckTons,
      installedPerSqFt: num(installed),
      baseOn,
      baseDepthIn: num(baseDepth),
      basePricePerTon: num(basePrice),
    };
    return computeAsphalt(input);
  }, [areas, thickness, waste, density, price, truckTons, installed, baseOn, baseDepth, basePrice]);

  useFirstCalculate(SLUG, JSON.stringify({ areas, project, thickness, material, customLb, waste, baseOn, baseDepth, truck, customTruck, price, basePrice, installed }));

  const update = (i: number, patch: Partial<Area>) => setAreas(areas.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => setAreas([...areas, newArea()]);
  const remove = (i: number) => setAreas(areas.length > 1 ? areas.filter((_, idx) => idx !== i) : areas);
  const addCutout = (i: number) => update(i, { cutouts: areas[i].cutouts.length < 3 ? [...areas[i].cutouts, newCutout()] : areas[i].cutouts });
  const updateCutout = (i: number, j: number, patch: Partial<Cutout>) => update(i, { cutouts: areas[i].cutouts.map((c, idx) => (idx === j ? { ...c, ...patch } : c)) });
  const removeCutout = (i: number, j: number) => update(i, { cutouts: areas[i].cutouts.filter((_, idx) => idx !== j) });

  const changeProject = (v: string) => {
    const k = v as ProjectKey;
    setProject(k);
    if (k !== "custom") setThickness(String(ASPHALT_PROJECTS[k].thicknessIn));
  };
  const onThickness = (v: string) => { setThickness(v); setProject("custom"); };

  const reset = () => {
    setAreas([newArea()]);
    setProject("driveway");
    setThickness(String(ASPHALT_PROJECTS.driveway.thicknessIn));
    setMaterial("hotMix");
    setCustomLb("145");
    setWaste("5");
    setBaseOn(false);
    setBaseDepth(String(ASPHALT_BASE_DEPTH_IN));
    setTruck(String(ASPHALT_TRUCK_TONS));
    setCustomTruck("25");
    setPrice(String(PRICES.asphaltPerTon));
    setBasePrice(String(PRICES.gravelPerTon));
    setInstalled(String(PRICES.asphaltInstalledPerSqFt));
  };

  const summary = `Asphalt: ${fmtNumber(round(result.tonsWithWaste, 2))} tons (${fmtNumber(round(result.cubicYards, 2))} cu yd) with ${waste}% waste, ${fmtInt(result.truckloads)} truckload${result.truckloads === 1 ? "" : "s"}. Material ${fmtUSD(result.materialCost)}., yardagemath.com/${SLUG}/`;

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
                  <Select id={`shape-${i}`} value={a.shape} onChange={(v) => update(i, { shape: v as AsphaltShape })} options={SHAPE_OPTS} />
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
                    <button type="button" className="button-secondary" onClick={() => addCutout(i)} style={{ minHeight: 40 }}>+ Subtract a planter or island</button>
                  )}
                </div>
              </div>
            ))}
            <button type="button" className="button-secondary" onClick={add}>+ Add another area</button>

            <FormGroupDivider />
            <GroupLabel>Project, material &amp; thickness</GroupLabel>
            <Field label="Project" htmlFor="project" hint="Sets a typical compacted thickness. Driveways usually get about 3 inches.">
              <Select id="project" value={project} onChange={changeProject} options={PROJECT_OPTS} />
            </Field>
            <Field label="Compacted thickness (inches)" htmlFor="thickness">
              <NumberInput id="thickness" value={thickness} onChange={onThickness} suffix="in" />
            </Field>
            <Field label="Material" htmlFor="material" hint="Hot mix is standard. Millings (recycled asphalt) weigh a bit less.">
              <Select id="material" value={material} onChange={(v) => setMaterial(v as AsphaltMaterialKey)} options={MATERIAL_OPTS} />
            </Field>
            {material === "custom" && (
              <Field label="Custom weight (lb per cu ft)" htmlFor="customlb">
                <NumberInput id="customlb" value={customLb} onChange={setCustomLb} suffix="lb/cu ft" />
              </Field>
            )}
            <Field label="Waste / extra (%)" htmlFor="waste">
              <NumberInput id="waste" value={waste} onChange={setWaste} suffix="%" />
            </Field>

            <FormGroupDivider />
            <GroupLabel>Truck, base &amp; price</GroupLabel>
            <Field label="Truck size" htmlFor="truck" hint="A tri-axle holds about 20 tons.">
              <Select id="truck" value={truck} onChange={setTruck} options={[
                { value: "20", label: "20 tons (tri-axle)" },
                { value: "15", label: "15 tons" },
                { value: "10", label: "10 tons" },
                { value: "custom", label: "Custom" },
              ]} />
            </Field>
            {truck === "custom" && (
              <Field label="Custom truck size" htmlFor="customtruck"><NumberInput id="customtruck" value={customTruck} onChange={setCustomTruck} suffix="tons" /></Field>
            )}
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", fontSize: "0.9375rem" }}>
              <input type="checkbox" checked={baseOn} onChange={(e) => setBaseOn(e.target.checked)} style={{ width: 18, height: 18 }} />
              Add a compacted gravel base (crusher run)
            </label>
            {baseOn && (
              <Field label="Base depth (inches)" htmlFor="basedepth" hint="About 4 to 8 inches of compacted base under a driveway.">
                <NumberInput id="basedepth" value={baseDepth} onChange={setBaseDepth} suffix="in" />
              </Field>
            )}
            <Field label="Asphalt price per ton" htmlFor="price">
              <NumberInput id="price" value={price} onChange={setPrice} suffix="$/ton" />
            </Field>
            {baseOn && (
              <Field label="Base price per ton" htmlFor="baseprice"><NumberInput id="baseprice" value={basePrice} onChange={setBasePrice} suffix="$/ton" /></Field>
            )}
            <Field label="Installed price per sq ft (optional)" htmlFor="installed" hint="For an installed estimate. New asphalt driveways run about $5 to $12 per sq ft.">
              <NumberInput id="installed" value={installed} onChange={setInstalled} suffix="$/sq ft" />
            </Field>
          </div>
        }
        right={
          <div>
            <PrimaryResult
              label="Asphalt needed"
              value={fmtNumber(round(result.tonsWithWaste, 2))}
              unit="tons"
              sub={`${fmtNumber(round(result.tons, 2))} tons before waste · ${fmtNumber(round(result.cubicYards, 2))} cu yd · ${fmtInt(result.truckloads)} truckload${result.truckloads === 1 ? "" : "s"}.`}
            />
            <SecondaryResults>
              <SecondaryItem label="Tons before waste" value={`${fmtNumber(round(result.tons, 2))} t`} />
              <SecondaryItem label="Cubic yards" value={`${fmtNumber(round(result.cubicYards, 2))} cu yd`} />
              <SecondaryItem label="Cubic feet" value={`${fmtNumber(round(result.cubicFeet, 1))} cu ft`} />
              <SecondaryItem label="Square yards" value={`${fmtNumber(round(result.squareYards, 1))} sq yd`} />
              <SecondaryItem label={`${truckTons || 0} t truckloads`} value={fmtInt(result.truckloads)} />
              <SecondaryItem label="Coverage per ton" value={`${fmtInt(result.coveragePerTon)} sq ft`} />
            </SecondaryResults>

            {baseOn && (
              <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                Gravel base: <strong>{fmtNumber(round(result.baseTons, 1))} tons</strong> of crusher run ({fmtNumber(round(result.baseCubicYards, 2))} cu yd, incl. 20% compaction), about {fmtUSD(result.baseCost)}.
              </p>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "1rem" }}>
              <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", background: "var(--surface)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Asphalt material</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>{fmtUSD(result.materialCost)}</div>
              </div>
              <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", background: "var(--surface)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Installed estimate</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>{fmtUSD(result.installedCost)}</div>
              </div>
            </div>

            <ShowMath>
              <MathLine>area = {fmtNumber(round(result.areaSqFt, 1))} sq ft = {fmtNumber(round(result.squareYards, 1))} sq yd (net of cut-outs)</MathLine>
              <MathLine>cu ft = {fmtNumber(round(result.areaSqFt, 1))} × ({thickness} ÷ 12) = {fmtNumber(round(result.cubicFeet, 1))}</MathLine>
              <MathLine>tons = {fmtNumber(round(result.cubicFeet, 1))} × {fmtNumber(round(density, 0))} ÷ 2,000 = {fmtNumber(round(result.tons, 2))}</MathLine>
              <MathLine>+ {waste}% waste = {fmtNumber(round(result.tonsWithWaste, 2))} tons</MathLine>
              <MathLine>loads = ceil({fmtNumber(round(result.tonsWithWaste, 2))} ÷ {truckTons || 0}) = {fmtInt(result.truckloads)}</MathLine>
              <MathLine>coverage = (2,000 ÷ {fmtNumber(round(density, 0))}) ÷ ({thickness} ÷ 12) = {fmtInt(result.coveragePerTon)} sq ft per ton</MathLine>
              {baseOn && (
                <MathLine>base = {fmtNumber(round(result.areaSqFt, 1))} × ({baseDepth} ÷ 12) + 20% → {fmtNumber(round(result.baseCubicYards, 2))} cu yd × 1.5 = {fmtNumber(round(result.baseTons, 1))} tons</MathLine>
              )}
            </ShowMath>

            <ResultActions
              slug={SLUG}
              getSummary={() => summary}
              getShareParams={() => ({ project, thickness, material, waste, truck, base: baseOn ? baseDepth : "0" })}
              onReset={reset}
            />
          </div>
        }
      />
    </div>
  );
}
