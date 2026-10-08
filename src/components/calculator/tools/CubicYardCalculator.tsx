"use client";

import { useMemo, useState } from "react";
import { computeCubicYard, type CubicYardMaterial } from "@/lib/formulas/cubicYard";
import { materialSlug } from "@/lib/constants";
import { round } from "@/lib/formulas/units";
import { fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { useVolumeInputs, ShapeDimensionFields, type VolumeState } from "../volumeInputs";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "cubic-yard-calculator";

// Example default: 10 ft × 10 ft × 3 in → 0.93 cu yd (build-spec A3/#1).
const INITIAL: VolumeState = {
  unit: "us",
  shape: "rectangle",
  lengthFt: "10",
  lengthIn: "0",
  widthFt: "10",
  widthIn: "0",
  diameterFt: "10",
  diameterIn: "0",
  baseFt: "10",
  baseIn: "0",
  heightFt: "6",
  heightIn: "0",
  depthIn: "3",
  wastePct: "5",
};

const MATERIALS: { value: CubicYardMaterial; label: string }[] = [
  { value: "none", label: "None (volume only)" },
  { value: "gravel", label: "Gravel" },
  { value: "topsoil", label: "Topsoil" },
  { value: "mulch", label: "Mulch" },
  { value: "sand", label: "Sand" },
  { value: "concreteWet", label: "Concrete (wet)" },
  { value: "crushedStone", label: "Crushed stone" },
];

export function CubicYardCalculator() {
  const { state, set, setUnit, reset, dims } = useVolumeInputs(INITIAL);
  const [material, setMaterial] = useState<CubicYardMaterial>("none");

  const result = useMemo(
    () => computeCubicYard({ ...dims, material }),
    [dims, material]
  );

  useFirstCalculate(SLUG, JSON.stringify({ ...state, material }));

  const resetAll = () => {
    reset();
    setMaterial("none");
  };

  const dimsStr =
    state.shape === "rectangle"
      ? `${state.lengthFt} ft × ${state.widthFt} ft × ${state.depthIn} in`
      : `${fmtNumber(round(result.areaSqFt, 1))} sq ft × ${state.depthIn} in`;
  const summary = `${dimsStr} = ${fmtNumber(round(result.cubicYards, 2))} cu yd (${fmtNumber(
    round(result.cubicYardsWithWaste, 2)
  )} with ${dims.wastePct}% waste) — yardagemath.com/${SLUG}/`;

  return (
    <CalculatorShell
      left={
        <div>
          <GroupLabel>Project dimensions</GroupLabel>
          <ShapeDimensionFields state={state} set={set} setUnit={setUnit} />
          <FormGroupDivider />
          <GroupLabel>Material (optional)</GroupLabel>
          <Field label="Material" htmlFor="material" hint="Choose a material to also estimate weight in tons.">
            <Select
              id="material"
              value={materialSlug(material)}
              onChange={(slug) =>
                setMaterial(MATERIALS.find((m) => materialSlug(m.value) === slug)?.value ?? "none")
              }
              options={MATERIALS.map((m) => ({ value: materialSlug(m.value), label: m.label }))}
            />
          </Field>
        </div>
      }
      right={
        <div>
          <PrimaryResult
            label="Cubic yards needed"
            value={fmtNumber(round(result.cubicYards, 2))}
            unit="cu yd"
            sub={`With ${dims.wastePct}% waste, order ${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd.`}
          />
          <SecondaryResults>
            <SecondaryItem label="Cubic feet" value={`${fmtNumber(round(result.volumeCuFt, 2))} cu ft`} />
            <SecondaryItem label="Cubic meters" value={`${fmtNumber(round(result.cubicMeters, 2))} m³`} />
            {result.tons !== null && (
              <SecondaryItem label="Weight" value={`${fmtNumber(round(result.tons, 2))} tons`} />
            )}
            <SecondaryItem label="Mulch bags (2 cu ft)" value={fmtNumber(result.bagsMulch, 0)} />
            <SecondaryItem label="Soil bags (0.75 cu ft)" value={fmtNumber(result.bagsSoil, 0)} />
            <SecondaryItem label="Gravel bags (0.5 cu ft)" value={fmtNumber(result.bagsGravel, 0)} />
          </SecondaryResults>

          <ShowMath>
            <MathLine>area = {fmtNumber(round(result.areaSqFt, 2))} sq ft</MathLine>
            <MathLine>
              depth = {dims.depthIn} in = {round(dims.depthIn / 12, 3)} ft
            </MathLine>
            <MathLine>
              volume = {fmtNumber(round(result.areaSqFt, 2))} × {round(dims.depthIn / 12, 3)} ={" "}
              {fmtNumber(round(result.volumeCuFt, 2))} cu ft
            </MathLine>
            <MathLine>
              cubic yards = {fmtNumber(round(result.volumeCuFt, 2))} ÷ 27 ={" "}
              {fmtNumber(round(result.cubicYards, 2))} cu yd
            </MathLine>
            <MathLine>
              + {dims.wastePct}% waste = {fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd
            </MathLine>
          </ShowMath>

          <ResultActions
            slug={SLUG}
            getSummary={() => summary}
            getShareParams={() => ({
              shape: state.shape,
              l: state.lengthFt,
              w: state.widthFt,
              d: state.depthIn,
              waste: state.wastePct,
              m: material,
            })}
            onReset={resetAll}
          />
        </div>
      }
    />
  );
}
