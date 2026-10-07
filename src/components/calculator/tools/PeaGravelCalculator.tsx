"use client";

import { useMemo, useState } from "react";
import { computePeaGravel } from "@/lib/formulas/peaGravel";
import { round } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { fmtNumber, fmtUSD } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, Select, NumberInput, GroupLabel, FormGroupDivider } from "../Fields";
import { useVolumeInputs, ShapeDimensionFields, type VolumeState } from "../volumeInputs";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "pea-gravel-calculator";

// Example default: 12 × 12 ft at 3" → 1.33 cu yd ≈ 1.87 tons (build-spec #5).
const INITIAL: VolumeState = {
  unit: "us",
  shape: "rectangle",
  lengthFt: "12",
  lengthIn: "0",
  widthFt: "12",
  widthIn: "0",
  diameterFt: "10",
  diameterIn: "0",
  baseFt: "10",
  baseIn: "0",
  heightFt: "6",
  heightIn: "0",
  depthIn: "3",
  wastePct: "8",
};

export function PeaGravelCalculator() {
  const { state, set, setUnit, reset, dims } = useVolumeInputs(INITIAL);
  const [pricePerTon, setPricePerTon] = useState("");

  const result = useMemo(
    () =>
      computePeaGravel({
        ...dims,
        pricePerTon: pricePerTon === "" ? null : num(pricePerTon),
        pricePerCuYd: null,
      }),
    [dims, pricePerTon]
  );

  useFirstCalculate(SLUG, JSON.stringify({ ...state, pricePerTon }));

  const resetAll = () => {
    reset();
    setPricePerTon("");
  };

  const summary = `Pea gravel: ${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd ≈ ${fmtNumber(
    round(result.tons, 2)
  )} tons (${result.bags} bags of 0.5 cu ft). — YardageMath`;

  return (
    <CalculatorShell
      left={
        <div>
          <GroupLabel>Area &amp; depth</GroupLabel>
          <Field label="Depth preset" htmlFor="preset" hint="Path 2–3″, patio 3–4″, playground 9–12″.">
            <Select
              id="preset"
              value={state.depthIn}
              onChange={(v) => set("depthIn", v)}
              options={[
                { value: "2", label: 'Path — 2"' },
                { value: "3", label: 'Patio — 3"' },
                { value: "4", label: 'Patio (deep) — 4"' },
                { value: "9", label: 'Playground — 9"' },
                { value: "12", label: 'Playground (deep) — 12"' },
              ]}
            />
          </Field>
          <ShapeDimensionFields state={state} set={set} setUnit={setUnit} />
          <FormGroupDivider />
          <GroupLabel>Price (optional)</GroupLabel>
          <Field label="Price per ton" htmlFor="ppt">
            <NumberInput id="ppt" value={pricePerTon} onChange={setPricePerTon} suffix="$/ton" placeholder="e.g. 55" />
          </Field>
        </div>
      }
      right={
        <div>
          <PrimaryResult
            label="Pea gravel needed"
            value={fmtNumber(round(result.cubicYardsWithWaste, 2))}
            unit="cu yd"
            sub={`≈ ${fmtNumber(round(result.tons, 2))} tons (incl. ${dims.wastePct}% waste).`}
          />
          <SecondaryResults>
            <SecondaryItem label="Weight" value={`${fmtNumber(round(result.tons, 2))} tons`} />
            <SecondaryItem label="Bags (0.5 cu ft)" value={fmtNumber(result.bags, 0)} />
            <SecondaryItem label="Cubic feet" value={`${fmtNumber(round(result.cubicFeetWithWaste, 1))} cu ft`} />
            {result.cost !== null && <SecondaryItem label="Estimated cost" value={fmtUSD(result.cost)} />}
          </SecondaryResults>

          <ShowMath>
            <MathLine>area = {fmtNumber(round(result.areaSqFt, 2))} sq ft</MathLine>
            <MathLine>
              cubic yards = {fmtNumber(round(result.cubicYards, 2))} → +{dims.wastePct}% ={" "}
              {fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd
            </MathLine>
            <MathLine>
              tons = {fmtNumber(round(result.cubicYardsWithWaste, 2))} × 1.4 = {fmtNumber(round(result.tons, 2))}
            </MathLine>
          </ShowMath>

          <ResultActions
            slug={SLUG}
            getSummary={() => summary}
            getShareParams={() => ({ shape: state.shape, l: state.lengthFt, w: state.widthFt, d: state.depthIn, waste: state.wastePct })}
            onReset={resetAll}
          />
        </div>
      }
    />
  );
}
