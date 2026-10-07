"use client";

import { useMemo, useState } from "react";
import { computeTopsoil } from "@/lib/formulas/topsoil";
import { round } from "@/lib/formulas/units";
import { fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { useVolumeInputs, ShapeDimensionFields, type VolumeState } from "../volumeInputs";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "topsoil-calculator";

// Example default: 20 × 10 ft at 4" → 2.47 cu yd (build-spec #4).
const INITIAL: VolumeState = {
  unit: "us",
  shape: "rectangle",
  lengthFt: "20",
  lengthIn: "0",
  widthFt: "10",
  widthIn: "0",
  diameterFt: "10",
  diameterIn: "0",
  baseFt: "10",
  baseIn: "0",
  heightFt: "6",
  heightIn: "0",
  depthIn: "4",
  wastePct: "5",
};

export function TopsoilCalculator() {
  const { state, set, setUnit, reset, dims } = useVolumeInputs(INITIAL);
  const [bagSize, setBagSize] = useState("0.75");

  const result = useMemo(
    () => computeTopsoil({ ...dims, bagSizeCuFt: parseFloat(bagSize) }),
    [dims, bagSize]
  );

  useFirstCalculate(SLUG, JSON.stringify({ ...state, bagSize }));

  const resetAll = () => {
    reset();
    setBagSize("0.75");
  };

  const summary = `Topsoil: ${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd (${fmtNumber(
    round(result.tons, 2)
  )} tons, ${result.bags} bags). — YardageMath`;

  return (
    <CalculatorShell
      left={
        <div>
          <GroupLabel>Area &amp; depth</GroupLabel>
          <ShapeDimensionFields state={state} set={set} setUnit={setUnit} depthLabel="Depth (or raised-bed height)" />
          <FormGroupDivider />
          <GroupLabel>Bags</GroupLabel>
          <Field label="Bag size" htmlFor="bag">
            <Select
              id="bag"
              value={bagSize}
              onChange={setBagSize}
              options={[
                { value: "0.75", label: "0.75 cu ft (40 lb)" },
                { value: "1", label: "1 cu ft" },
              ]}
            />
          </Field>
        </div>
      }
      right={
        <div>
          <PrimaryResult
            label="Topsoil needed"
            value={fmtNumber(round(result.cubicYardsWithWaste, 2))}
            unit="cu yd"
            sub={`Base ${fmtNumber(round(result.cubicYards, 2))} cu yd + ${dims.wastePct}% waste.`}
          />
          <SecondaryResults>
            <SecondaryItem label="Weight" value={`${fmtNumber(round(result.tons, 2))} tons`} />
            <SecondaryItem label="Cubic feet" value={`${fmtNumber(round(result.cubicFeetWithWaste, 1))} cu ft`} />
            <SecondaryItem label="Cubic meters" value={`${fmtNumber(round(result.cubicMeters, 2))} m³`} />
            <SecondaryItem label={`Bags (${bagSize} cu ft)`} value={fmtNumber(result.bags, 0)} />
          </SecondaryResults>

          <ShowMath>
            <MathLine>area = {fmtNumber(round(result.areaSqFt, 2))} sq ft</MathLine>
            <MathLine>
              volume = {fmtNumber(round(result.areaSqFt, 2))} × {round(dims.depthIn / 12, 3)} ft ={" "}
              {fmtNumber(round(result.cubicFeetWithWaste / (1 + dims.wastePct / 100), 2))} cu ft
            </MathLine>
            <MathLine>
              cubic yards = {fmtNumber(round(result.cubicYards, 2))} → +{dims.wastePct}% ={" "}
              {fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd
            </MathLine>
            <MathLine>tons = {fmtNumber(round(result.cubicYardsWithWaste, 2))} × 1.1 = {fmtNumber(round(result.tons, 2))}</MathLine>
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
