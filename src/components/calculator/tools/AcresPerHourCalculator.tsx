"use client";

import { useMemo, useState } from "react";
import { computeAcresPerHour, type WidthUnit, type AreaUnit } from "@/lib/formulas/acresPerHour";
import { round } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { FIELD_EFFICIENCY_PRESETS } from "@/lib/constants";
import { fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, NumberInput, Select, GroupLabel } from "../Fields";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "acres-per-hour-calculator";

export function AcresPerHourCalculator() {
  const [width, setWidth] = useState("60");
  const [widthUnit, setWidthUnit] = useState<WidthUnit>("in");
  const [speed, setSpeed] = useState("6");
  const [eff, setEff] = useState("80");
  const [area, setArea] = useState("5");
  const [areaUnit, setAreaUnit] = useState<AreaUnit>("acres");

  const result = useMemo(
    () =>
      computeAcresPerHour({
        width: num(width),
        widthUnit,
        speedMph: num(speed),
        efficiencyPct: num(eff),
        area: num(area),
        areaUnit,
      }),
    [width, widthUnit, speed, eff, area, areaUnit]
  );

  useFirstCalculate(SLUG, JSON.stringify({ width, widthUnit, speed, eff, area, areaUnit }));

  const reset = () => {
    setWidth("60"); setWidthUnit("in"); setSpeed("6"); setEff("80"); setArea("5"); setAreaUnit("acres");
  };

  const timeStr = `${result.hoursWhole} h ${result.minutes} min`;
  const summary = `${fmtNumber(round(result.acresPerHour, 2))} acres/hour; ${fmtNumber(round(result.areaAcres, 2))} acres takes ${timeStr}. — YardageMath`;

  return (
    <CalculatorShell
      left={
        <div>
          <GroupLabel>Equipment</GroupLabel>
          <Field label="Working width" htmlFor="width">
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <div style={{ flex: 2 }}>
                <NumberInput id="width" value={width} onChange={setWidth} />
              </div>
              <div style={{ flex: 1 }}>
                <Select id="wunit" value={widthUnit} onChange={(v) => setWidthUnit(v as WidthUnit)} options={[{ value: "in", label: "in" }, { value: "ft", label: "ft" }]} />
              </div>
            </div>
          </Field>
          <Field label="Ground speed (mph)" htmlFor="speed">
            <NumberInput id="speed" value={speed} onChange={setSpeed} suffix="mph" />
          </Field>
          <Field label="Field efficiency (%)" htmlFor="eff" hint="70–85% is realistic for most mowing.">
            <NumberInput id="eff" value={eff} onChange={setEff} suffix="%" />
          </Field>
          <Field label="Efficiency preset" htmlFor="preset">
            <Select
              id="preset"
              value={eff}
              onChange={setEff}
              options={FIELD_EFFICIENCY_PRESETS.map((p) => ({ value: String(Math.round(p.eff * 100)), label: p.label }))}
            />
          </Field>
          <GroupLabel>Area to cover</GroupLabel>
          <Field label="Total area" htmlFor="area">
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <div style={{ flex: 2 }}>
                <NumberInput id="area" value={area} onChange={setArea} />
              </div>
              <div style={{ flex: 1 }}>
                <Select id="aunit" value={areaUnit} onChange={(v) => setAreaUnit(v as AreaUnit)} options={[{ value: "acres", label: "acres" }, { value: "sqft", label: "sq ft" }]} />
              </div>
            </div>
          </Field>
        </div>
      }
      right={
        <div>
          <PrimaryResult label="Acres per hour" value={fmtNumber(round(result.acresPerHour, 2))} unit="ac/hr" sub={`${fmtNumber(round(result.areaAcres, 2))} acres takes about ${timeStr}.`} />
          <SecondaryResults>
            <SecondaryItem label="Area" value={`${fmtNumber(round(result.areaAcres, 2))} acres`} />
            <SecondaryItem label="Time to finish" value={timeStr} />
            <SecondaryItem label="Total hours" value={fmtNumber(round(result.hours, 2))} />
          </SecondaryResults>
          <ShowMath>
            <MathLine>width = {widthUnit === "ft" ? `${width} ft = ${num(width) * 12} in` : `${width} in`}</MathLine>
            <MathLine>acres/hour = ({widthUnit === "ft" ? num(width) * 12 : width} × {speed} × {round(num(eff) / 100, 2)}) ÷ 99 = {fmtNumber(round(result.acresPerHour, 2))}</MathLine>
            <MathLine>hours = {fmtNumber(round(result.areaAcres, 2))} ÷ {fmtNumber(round(result.acresPerHour, 2))} = {fmtNumber(round(result.hours, 2))} ({timeStr})</MathLine>
          </ShowMath>
          <ResultActions slug={SLUG} getSummary={() => summary} getShareParams={() => ({ w: width, wu: widthUnit, s: speed, e: eff, a: area, au: areaUnit })} onReset={reset} />
        </div>
      }
    />
  );
}
