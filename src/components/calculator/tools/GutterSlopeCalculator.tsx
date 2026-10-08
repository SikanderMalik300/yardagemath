"use client";

import { useMemo, useState } from "react";
import { computeGutterSlope, type DownspoutPosition } from "@/lib/formulas/gutterSlope";
import { round } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { GUTTER_SLOPE_PRESETS } from "@/lib/constants";
import { fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, NumberInput, Select, GroupLabel } from "../Fields";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "gutter-slope-calculator";

export function GutterSlopeCalculator() {
  const [runLength, setRunLength] = useState("40");
  const [slope, setSlope] = useState("0.25");
  const [position, setPosition] = useState<DownspoutPosition>("one-end");
  const [roofArea, setRoofArea] = useState("");

  const result = useMemo(
    () =>
      computeGutterSlope({
        runLengthFt: num(runLength),
        slopeInPer10ft: num(slope),
        downspoutPosition: position,
        roofAreaSqFt: roofArea === "" ? null : num(roofArea),
      }),
    [runLength, slope, position, roofArea]
  );

  useFirstCalculate(SLUG, JSON.stringify({ runLength, slope, position, roofArea }));

  const reset = () => {
    setRunLength("40"); setSlope("0.25"); setPosition("one-end"); setRoofArea("");
  };

  const summary = `Gutter: ${fmtNumber(round(result.totalDropIn, 2))}" total drop over a ${runLength} ft run. — yardagemath.com/${SLUG}/`;

  return (
    <CalculatorShell
      left={
        <div>
          <GroupLabel>Gutter run</GroupLabel>
          <Field label="Run length (ft)" htmlFor="run">
            <NumberInput id="run" value={runLength} onChange={setRunLength} suffix="ft" />
          </Field>
          <Field label="Slope" htmlFor="slope" hint="¼″ per 10 ft is the common minimum.">
            <Select
              id="slope"
              value={slope}
              onChange={setSlope}
              options={GUTTER_SLOPE_PRESETS.map((p) => ({ value: String(p.inchPer10ft), label: p.label }))}
            />
          </Field>
          <Field label="Downspout position" htmlFor="pos">
            <Select
              id="pos"
              value={position}
              onChange={(v) => setPosition(v as DownspoutPosition)}
              options={[
                { value: "one-end", label: "One end" },
                { value: "both-ends", label: "Both ends" },
                { value: "middle", label: "Feeds from middle" },
              ]}
            />
          </Field>
          <GroupLabel>Downspout sizing (optional)</GroupLabel>
          <Field label="Roof area draining (sq ft)" htmlFor="roof">
            <NumberInput id="roof" value={roofArea} onChange={setRoofArea} suffix="sq ft" placeholder="e.g. 800" />
          </Field>
        </div>
      }
      right={
        <div>
          <PrimaryResult
            label="Total drop"
            value={`${fmtNumber(round(result.totalDropIn, 2))}"`}
            sub={`High end sits ${fmtNumber(round(result.totalDropIn, 2))}" above the outlet over a ${fmtNumber(round(result.slopeRunFt, 1))} ft slope run.`}
          />
          <SecondaryResults>
            <SecondaryItem label="Slope run" value={`${fmtNumber(round(result.slopeRunFt, 1))} ft`} />
            <SecondaryItem label="Downspouts (by spacing)" value={String(result.downspoutsBySpacing)} />
            {result.downspoutsByArea2x3 !== null && <SecondaryItem label="2×3″ downspouts" value={String(result.downspoutsByArea2x3)} />}
            {result.downspoutsByArea3x4 !== null && <SecondaryItem label="3×4″ downspouts" value={String(result.downspoutsByArea3x4)} />}
          </SecondaryResults>
          <ShowMath>
            <MathLine>slope run = {fmtNumber(round(result.slopeRunFt, 1))} ft {position !== "one-end" ? "(half the length)" : ""}</MathLine>
            <MathLine>drop = ({fmtNumber(round(result.slopeRunFt, 1))} ÷ 10) × {slope} = {fmtNumber(round(result.totalDropIn, 2))}&quot;</MathLine>
            <MathLine>downspouts ≈ one per 35 ft of run = {result.downspoutsBySpacing}</MathLine>
          </ShowMath>
          <ResultActions slug={SLUG} getSummary={() => summary} getShareParams={() => ({ run: runLength, slope, pos: position })} onReset={reset} />
        </div>
      }
    />
  );
}
