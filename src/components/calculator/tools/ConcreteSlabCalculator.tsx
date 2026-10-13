"use client";

import { useMemo, useState } from "react";
import { computeConcreteSlab, type BagSize, type SupplyMode } from "@/lib/formulas/concreteSlab";
import { feetInchesToFeet, metersToFeet, cmToInches, round } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { PRICES } from "@/lib/constants";
import { fmtInt, fmtUSD, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, FeetInches, NumberInput, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { UnitToggle, type UnitSystem } from "../UnitToggle";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "concrete-slab-cost-calculator";

export function ConcreteSlabCalculator() {
  const [unit, setUnit] = useState<UnitSystem>("us");
  const [lenFt, setLenFt] = useState("10");
  const [lenIn, setLenIn] = useState("0");
  const [widFt, setWidFt] = useState("10");
  const [widIn, setWidIn] = useState("0");
  const [thickness, setThickness] = useState("4");
  const metric = unit === "metric";
  const [waste, setWaste] = useState("10");
  const [supplyMode, setSupplyMode] = useState<SupplyMode>("readymix");
  const [bagSize, setBagSize] = useState<BagSize>("lb80");
  const [pricePerCuYd, setPricePerCuYd] = useState(String(PRICES.concretePerCuYd));
  const [pricePerBag, setPricePerBag] = useState(String(PRICES.concreteBag80));
  // Installed (with labor) is the default; Materials only (DIY) zeroes labor + rebar.
  const [costMode, setCostMode] = useState<"installed" | "materials">("installed");
  const [labor, setLabor] = useState(String(PRICES.concreteLaborPerSqFt));
  const [rebar, setRebar] = useState(String(PRICES.rebarMeshPerSqFt));
  const [gravelBase, setGravelBase] = useState("0");

  const setMode = (mode: "installed" | "materials") => {
    setCostMode(mode);
    if (mode === "installed") {
      setLabor(String(PRICES.concreteLaborPerSqFt));
      setRebar(String(PRICES.rebarMeshPerSqFt));
    } else {
      setLabor("0");
      setRebar("0");
    }
  };

  const result = useMemo(
    () =>
      computeConcreteSlab({
        lengthFt: metric ? metersToFeet(num(lenFt)) : feetInchesToFeet(num(lenFt), num(lenIn)),
        widthFt: metric ? metersToFeet(num(widFt)) : feetInchesToFeet(num(widFt), num(widIn)),
        thicknessIn: metric ? cmToInches(num(thickness)) : num(thickness),
        wastePct: num(waste),
        supplyMode,
        bagSize,
        pricePerCuYd: num(pricePerCuYd),
        pricePerBag: num(pricePerBag),
        laborPerSqFt: num(labor),
        rebarPerSqFt: num(rebar),
        gravelBaseDepthIn: num(gravelBase),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lenFt, lenIn, widFt, widIn, thickness, waste, supplyMode, bagSize, pricePerCuYd, pricePerBag, labor, rebar, gravelBase, unit]
  );

  useFirstCalculate(
    SLUG,
    JSON.stringify({ lenFt, widFt, thickness, waste, supplyMode, bagSize, pricePerCuYd, pricePerBag, labor, rebar, gravelBase, unit })
  );

  const reset = () => {
    setUnit("us");
    setLenFt("10"); setLenIn("0"); setWidFt("10"); setWidIn("0");
    setThickness("4"); setWaste("10"); setSupplyMode("readymix"); setBagSize("lb80");
    setPricePerCuYd(String(PRICES.concretePerCuYd)); setPricePerBag(String(PRICES.concreteBag80));
    setCostMode("installed");
    setLabor(String(PRICES.concreteLaborPerSqFt)); setRebar(String(PRICES.rebarMeshPerSqFt)); setGravelBase("0");
  };

  // Both comparison figures, independent of the toggle, using the installed defaults.
  const installedTotal = result.materialCost + (PRICES.concreteLaborPerSqFt + PRICES.rebarMeshPerSqFt) * result.areaSqFt;
  const materialsTotal = result.materialCost;
  const installedPerSqFt = result.areaSqFt > 0 ? installedTotal / result.areaSqFt : 0;
  const materialsPerSqFt = result.areaSqFt > 0 ? materialsTotal / result.areaSqFt : 0;

  const summary = `Concrete slab: ${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd, total ${fmtUSD(
    result.totalCost
  )} (${fmtUSD(result.costPerSqFt)}/sq ft). — yardagemath.com/${SLUG}/`;

  return (
    <CalculatorShell
      left={
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <UnitToggle value={unit} onChange={setUnit} />
          </div>
          <GroupLabel>Slab dimensions</GroupLabel>
          {metric ? (
            <>
              <Field label="Length (m)" htmlFor="len-m">
                <NumberInput id="len-m" value={lenFt} onChange={setLenFt} suffix="m" />
              </Field>
              <Field label="Width (m)" htmlFor="wid-m">
                <NumberInput id="wid-m" value={widFt} onChange={setWidFt} suffix="m" />
              </Field>
              <Field label="Thickness (cm)" htmlFor="thick" hint="10 cm for patios/walkways, 13–15 cm for driveways.">
                <NumberInput id="thick" value={thickness} onChange={setThickness} suffix="cm" />
              </Field>
            </>
          ) : (
            <>
              <FeetInches idBase="len" label="Length" feet={lenFt} inches={lenIn} onFeet={setLenFt} onInches={setLenIn} />
              <FeetInches idBase="wid" label="Width" feet={widFt} inches={widIn} onFeet={setWidFt} onInches={setWidIn} />
              <Field label="Thickness (inches)" htmlFor="thick" hint="4″ for patios/walkways, 5–6″ for driveways.">
                <NumberInput id="thick" value={thickness} onChange={setThickness} suffix="in" />
              </Field>
            </>
          )}
          <Field label="Waste / extra (%)" htmlFor="waste">
            <NumberInput id="waste" value={waste} onChange={setWaste} suffix="%" />
          </Field>

          <FormGroupDivider />
          <GroupLabel>Supply &amp; pricing</GroupLabel>
          <div role="group" aria-label="Cost mode" style={{ display: "flex", gap: "0.375rem", marginBottom: "0.875rem" }}>
            {([["installed", "Installed (with labor)"], ["materials", "Materials only (DIY)"]] as const).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                className="button-secondary"
                aria-pressed={costMode === mode}
                onClick={() => setMode(mode)}
                style={{ flex: 1, minHeight: 40, borderColor: costMode === mode ? "var(--brand)" : undefined, color: costMode === mode ? "var(--brand)" : undefined, fontWeight: costMode === mode ? 600 : undefined }}
              >
                {label}
              </button>
            ))}
          </div>
          <Field label="Supply mode" htmlFor="supply">
            <Select
              id="supply"
              value={supplyMode}
              onChange={(v) => setSupplyMode(v as SupplyMode)}
              options={[
                { value: "readymix", label: "Ready-mix truck" },
                { value: "bags", label: "Bags" },
              ]}
            />
          </Field>
          {supplyMode === "readymix" ? (
            <Field label="Price per cubic yard" htmlFor="ppy">
              <NumberInput id="ppy" value={pricePerCuYd} onChange={setPricePerCuYd} suffix="$/yd" />
            </Field>
          ) : (
            <>
              <Field label="Bag size" htmlFor="bag">
                <Select
                  id="bag"
                  value={bagSize}
                  onChange={(v) => setBagSize(v as BagSize)}
                  options={[
                    { value: "lb80", label: "80 lb (0.60 cu ft)" },
                    { value: "lb60", label: "60 lb (0.45 cu ft)" },
                    { value: "lb40", label: "40 lb (0.30 cu ft)" },
                  ]}
                />
              </Field>
              <Field label="Price per bag" htmlFor="ppb">
                <NumberInput id="ppb" value={pricePerBag} onChange={setPricePerBag} suffix="$" />
              </Field>
            </>
          )}

          <FormGroupDivider />
          <GroupLabel>Optional extras</GroupLabel>
          <Field label="Labor ($/sq ft)" htmlFor="labor">
            <NumberInput id="labor" value={labor} onChange={setLabor} suffix="$" />
          </Field>
          <Field label="Rebar / mesh ($/sq ft)" htmlFor="rebar">
            <NumberInput id="rebar" value={rebar} onChange={setRebar} suffix="$" />
          </Field>
          <Field label="Gravel base depth (inches)" htmlFor="base">
            <NumberInput id="base" value={gravelBase} onChange={setGravelBase} suffix="in" />
          </Field>
        </div>
      }
      right={
        <div>
          <PrimaryResult
            label={costMode === "installed" ? "Installed cost (with labor)" : "Materials cost (DIY)"}
            value={fmtUSD(result.totalCost)}
            sub={`${fmtUSD(result.costPerSqFt)} per sq ft · ${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd of concrete`}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.875rem", margin: "0.5rem 0 0.25rem" }}>
            <div>
              <strong>Installed:</strong> {fmtUSD(installedTotal)} ({fmtUSD(installedPerSqFt)} per sq ft)
            </div>
            <div>
              <strong>Materials only:</strong> {fmtUSD(materialsTotal)} ({fmtUSD(materialsPerSqFt)} per sq ft)
            </div>
          </div>
          <SecondaryResults>
            <SecondaryItem label="Concrete (with waste)" value={`${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd`} />
            {supplyMode === "bags" && <SecondaryItem label={`Bags (${bagSize.replace("lb", "")} lb)`} value={fmtInt(result.bags)} />}
            <SecondaryItem label="Material cost" value={fmtUSD(result.materialCost)} />
            {result.laborCost > 0 && <SecondaryItem label="Labor" value={fmtUSD(result.laborCost)} />}
            {result.rebarCost > 0 && <SecondaryItem label="Rebar / mesh" value={fmtUSD(result.rebarCost)} />}
            {result.gravelBaseCuYd > 0 && <SecondaryItem label="Gravel base" value={`${fmtNumber(round(result.gravelBaseCuYd, 2))} cu yd`} />}
          </SecondaryResults>

          <ShowMath>
            <MathLine>area = {fmtNumber(result.areaSqFt, 1)} sq ft</MathLine>
            <MathLine>
              cubic yards = area × ({thickness} ÷ 12) ÷ 27 = {fmtNumber(round(result.cubicYards, 2))}
            </MathLine>
            <MathLine>+ {waste}% waste = {fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd</MathLine>
            {supplyMode === "bags" && (
              <MathLine>
                bags = ceil({fmtNumber(round(result.cubicFeetWithWaste, 1))} cu ft ÷ yield) = {fmtInt(result.bags)}
              </MathLine>
            )}
            <MathLine>total = material + labor + rebar = {fmtUSD(result.totalCost)}</MathLine>
          </ShowMath>

          <ResultActions
            slug={SLUG}
            getSummary={() => summary}
            getShareParams={() => ({ l: lenFt, w: widFt, t: thickness, waste })}
            onReset={reset}
          />
        </div>
      }
    />
  );
}
