"use client";

import { useMemo, useState } from "react";
import { computeRipRap } from "@/lib/formulas/ripRap";
import { round, metersToFeet, cmToInches } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { RIPRAP_CLASSES, DENSITY_TONS_PER_CUYD } from "@/lib/constants";
import { fmtNumber, fmtUSD } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, NumberInput, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { UnitToggle, type UnitSystem } from "../UnitToggle";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "rip-rap-calculator";

export function RipRapCalculator() {
  const [unit, setUnit] = useState<UnitSystem>("us");
  const [length, setLength] = useState("50");
  const [width, setWidth] = useState("6");
  const [thickness, setThickness] = useState("12");
  const metric = unit === "metric";
  const [stoneClass, setStoneClass] = useState("light");
  const [density, setDensity] = useState(String(DENSITY_TONS_PER_CUYD.ripRap));
  const [waste, setWaste] = useState("10");
  const [price, setPrice] = useState("");

  function changeClass(key: string) {
    setStoneClass(key);
    const c = RIPRAP_CLASSES.find((rc) => rc.key === key);
    if (c) setThickness(String(c.thicknessIn));
  }

  const result = useMemo(
    () =>
      computeRipRap({
        lengthFt: metric ? metersToFeet(num(length)) : num(length),
        widthFt: metric ? metersToFeet(num(width)) : num(width),
        thicknessIn: metric ? cmToInches(num(thickness)) : num(thickness),
        densityTonsPerCuYd: num(density),
        wastePct: num(waste),
        pricePerTon: price === "" ? null : num(price),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [length, width, thickness, density, waste, price, unit]
  );

  useFirstCalculate(SLUG, JSON.stringify({ length, width, thickness, stoneClass, density, waste, price, unit }));

  const reset = () => {
    setUnit("us");
    setLength("50"); setWidth("6"); setThickness("12"); setStoneClass("light");
    setDensity(String(DENSITY_TONS_PER_CUYD.ripRap)); setWaste("10"); setPrice("");
  };

  const summary = `Riprap: ${fmtNumber(round(result.cubicYardsWithWaste, 1))} cu yd ≈ ${fmtNumber(round(result.tons, 1))} tons. — YardageMath`;

  return (
    <CalculatorShell
      left={
        <div>
          <div style={{ marginBottom: "1rem" }}>
            <UnitToggle value={unit} onChange={setUnit} />
          </div>
          <GroupLabel>Area &amp; layer</GroupLabel>
          <Field label={`Length (${metric ? "m" : "ft"})`} htmlFor="len">
            <NumberInput id="len" value={length} onChange={setLength} suffix={metric ? "m" : "ft"} />
          </Field>
          <Field label={`Width / slope length (${metric ? "m" : "ft"})`} htmlFor="wid">
            <NumberInput id="wid" value={width} onChange={setWidth} suffix={metric ? "m" : "ft"} />
          </Field>
          <Field label="Stone size class" htmlFor="class">
            <Select
              id="class"
              value={stoneClass}
              onChange={changeClass}
              options={RIPRAP_CLASSES.map((c) => ({ value: c.key, label: `${c.label} (D50 ${c.d50In})` }))}
            />
          </Field>
          <Field label={`Layer thickness (${metric ? "cm" : "inches"})`} htmlFor="thick">
            <NumberInput id="thick" value={thickness} onChange={setThickness} suffix={metric ? "cm" : "in"} />
          </Field>
          <FormGroupDivider />
          <GroupLabel>Density &amp; waste</GroupLabel>
          <Field label="Density (tons per cu yd)" htmlFor="density">
            <NumberInput id="density" value={density} onChange={setDensity} suffix="t/yd³" />
          </Field>
          <Field label="Waste / extra (%)" htmlFor="waste">
            <NumberInput id="waste" value={waste} onChange={setWaste} suffix="%" />
          </Field>
          <Field label="Price per ton (optional)" htmlFor="price">
            <NumberInput id="price" value={price} onChange={setPrice} suffix="$/ton" placeholder="e.g. 70" />
          </Field>
        </div>
      }
      right={
        <div>
          <PrimaryResult
            label="Riprap needed"
            value={fmtNumber(round(result.tons, 1))}
            unit="tons"
            sub={`${fmtNumber(round(result.cubicYardsWithWaste, 1))} cu yd (incl. ${waste}% waste).`}
          />
          <SecondaryResults>
            <SecondaryItem label="Cubic yards" value={`${fmtNumber(round(result.cubicYardsWithWaste, 1))} cu yd`} />
            <SecondaryItem label="Base (no waste)" value={`${fmtNumber(round(result.cubicYards, 1))} cu yd`} />
            {result.cost !== null && <SecondaryItem label="Estimated cost" value={fmtUSD(result.cost)} />}
          </SecondaryResults>
          <ShowMath>
            <MathLine>area = {fmtNumber(round(result.areaSqFt, 1))} sq ft</MathLine>
            <MathLine>cubic yards = area × ({thickness} ÷ 12) ÷ 27 = {fmtNumber(round(result.cubicYards, 1))}</MathLine>
            <MathLine>+ {waste}% waste = {fmtNumber(round(result.cubicYardsWithWaste, 1))} cu yd</MathLine>
            <MathLine>tons = {fmtNumber(round(result.cubicYardsWithWaste, 1))} × {density} = {fmtNumber(round(result.tons, 1))}</MathLine>
          </ShowMath>
          <ResultActions slug={SLUG} getSummary={() => summary} getShareParams={() => ({ l: length, w: width, t: thickness, c: stoneClass })} onReset={reset} />
        </div>
      }
    />
  );
}
