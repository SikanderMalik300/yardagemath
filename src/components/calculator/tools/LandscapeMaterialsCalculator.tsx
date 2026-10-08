"use client";

import { useMemo, useState } from "react";
import {
  computeLandscape,
  LANDSCAPE_MATERIALS,
  type LandscapeMaterialKey,
} from "@/lib/formulas/landscapeMaterials";
import { round } from "@/lib/formulas/units";
import { materialSlug } from "@/lib/constants";
import { fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, Select, GroupLabel } from "../Fields";
import { useVolumeInputs, ShapeDimensionFields, type VolumeState } from "../volumeInputs";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "landscape-materials-calculator";

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
  depthIn: "3",
  wastePct: "10",
};

const MATERIAL_OPTIONS = Object.entries(LANDSCAPE_MATERIALS).map(([value, m]) => ({
  value: materialSlug(value),
  label: m.label,
}));
const KEY_BY_SLUG: Record<string, LandscapeMaterialKey> = Object.fromEntries(
  Object.keys(LANDSCAPE_MATERIALS).map((k) => [materialSlug(k), k as LandscapeMaterialKey])
);

export function LandscapeMaterialsCalculator() {
  const { state, set, setUnit, reset, dims } = useVolumeInputs(INITIAL);
  const [material, setMaterial] = useState<LandscapeMaterialKey>("mulch");

  function changeMaterial(slug: string) {
    const k = KEY_BY_SLUG[slug];
    setMaterial(k);
    set("depthIn", String(LANDSCAPE_MATERIALS[k].defaultDepthIn));
  }

  const result = useMemo(
    () => computeLandscape({ ...dims, material }),
    [dims, material]
  );

  useFirstCalculate(SLUG, JSON.stringify({ ...state, material }));

  const resetAll = () => {
    reset();
    setMaterial("mulch");
  };

  const summary = `${LANDSCAPE_MATERIALS[material].label}: ${fmtNumber(
    round(result.cubicYardsWithWaste, 2)
  )} cu yd (${fmtNumber(round(result.tons, 2))} tons, ${result.bags} bags). — yardagemath.com/${SLUG}/`;

  return (
    <CalculatorShell
      left={
        <div>
          <GroupLabel>Material</GroupLabel>
          <Field label="Material" htmlFor="material" hint="The default depth updates to suit each material.">
            <Select id="material" value={materialSlug(material)} onChange={changeMaterial} options={MATERIAL_OPTIONS} />
          </Field>
          <GroupLabel>Area &amp; depth</GroupLabel>
          <ShapeDimensionFields state={state} set={set} setUnit={setUnit} />
        </div>
      }
      right={
        <div>
          <PrimaryResult
            label={`${LANDSCAPE_MATERIALS[material].label} needed`}
            value={fmtNumber(round(result.cubicYardsWithWaste, 2))}
            unit="cu yd"
            sub={`≈ ${fmtNumber(round(result.tons, 2))} tons (incl. ${dims.wastePct}% waste).`}
          />
          <SecondaryResults>
            <SecondaryItem label="Weight" value={`${fmtNumber(round(result.tons, 2))} tons`} />
            <SecondaryItem label="Cubic feet" value={`${fmtNumber(round(result.cubicFeetWithWaste, 1))} cu ft`} />
            <SecondaryItem label="Bags" value={fmtNumber(result.bags, 0)} />
          </SecondaryResults>

          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
            Sold as: {result.soldAs}.
          </p>

          <ShowMath>
            <MathLine>area = {fmtNumber(round(result.areaSqFt, 2))} sq ft</MathLine>
            <MathLine>
              cubic yards = {fmtNumber(round(result.cubicYards, 2))} → +{dims.wastePct}% ={" "}
              {fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd
            </MathLine>
            <MathLine>tons = cu yd × density = {fmtNumber(round(result.tons, 2))}</MathLine>
          </ShowMath>

          <ResultActions
            slug={SLUG}
            getSummary={() => summary}
            getShareParams={() => ({ m: material, shape: state.shape, l: state.lengthFt, w: state.widthFt, d: state.depthIn, waste: state.wastePct })}
            onReset={resetAll}
          />
        </div>
      }
    />
  );
}
