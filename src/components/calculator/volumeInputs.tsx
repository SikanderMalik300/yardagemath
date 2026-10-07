"use client";

import { useMemo, useState } from "react";
import {
  feetInchesToFeet,
  metersToFeet,
  cmToInches,
  feetToMeters,
  inchesToCm,
} from "@/lib/formulas/units";
import type { Shape } from "@/lib/formulas/volume";
import { num } from "@/lib/analytics";
import { Field, FeetInches, NumberInput, Select } from "./Fields";
import { UnitToggle, type UnitSystem } from "./UnitToggle";

export interface VolumeState {
  unit: UnitSystem;
  shape: Shape;
  // In US mode these are feet + inches; in metric mode the "...Ft" field holds
  // meters and the "...In" field is unused. depthIn holds inches (US) or cm (metric).
  lengthFt: string;
  lengthIn: string;
  widthFt: string;
  widthIn: string;
  diameterFt: string;
  diameterIn: string;
  baseFt: string;
  baseIn: string;
  heightFt: string;
  heightIn: string;
  depthIn: string;
  wastePct: string;
}

export interface VolumeDims {
  shape: Shape;
  length: number;
  width: number;
  diameter: number;
  base: number;
  height: number;
  depthIn: number;
  wastePct: number;
}

/** Convert a stored field pair to decimal feet, respecting the unit system. */
function toFeet(unit: UnitSystem, ft: string, inches: string): number {
  return unit === "metric" ? metersToFeet(num(ft)) : feetInchesToFeet(num(ft), num(inches));
}

export function useVolumeInputs(initial: VolumeState) {
  const [state, setState] = useState<VolumeState>(initial);
  const set = <K extends keyof VolumeState>(key: K, value: VolumeState[K]) =>
    setState((s) => ({ ...s, [key]: value }));
  const reset = () => setState(initial);

  /** Toggle units and convert current values so the physical size is preserved. */
  const setUnit = (unit: UnitSystem) =>
    setState((s) => {
      if (unit === s.unit) return s;
      const convLen = (ft: string, inch: string) =>
        unit === "metric"
          ? { ft: round4(feetToMeters(feetInchesToFeet(num(ft), num(inch)))), in: "0" }
          : { ft: round4(metersToFeet(num(ft))), in: "0" };
      const l = convLen(s.lengthFt, s.lengthIn);
      const w = convLen(s.widthFt, s.widthIn);
      const d = convLen(s.diameterFt, s.diameterIn);
      const b = convLen(s.baseFt, s.baseIn);
      const h = convLen(s.heightFt, s.heightIn);
      const depth =
        unit === "metric" ? round4(inchesToCm(num(s.depthIn))) : round4(cmToInches(num(s.depthIn)));
      return {
        ...s,
        unit,
        lengthFt: l.ft, lengthIn: l.in,
        widthFt: w.ft, widthIn: w.in,
        diameterFt: d.ft, diameterIn: d.in,
        baseFt: b.ft, baseIn: b.in,
        heightFt: h.ft, heightIn: h.in,
        depthIn: depth,
      };
    });

  const dims: VolumeDims = useMemo(
    () => ({
      shape: state.shape,
      length: toFeet(state.unit, state.lengthFt, state.lengthIn),
      width: toFeet(state.unit, state.widthFt, state.widthIn),
      diameter: toFeet(state.unit, state.diameterFt, state.diameterIn),
      base: toFeet(state.unit, state.baseFt, state.baseIn),
      height: toFeet(state.unit, state.heightFt, state.heightIn),
      depthIn: state.unit === "metric" ? cmToInches(num(state.depthIn)) : num(state.depthIn),
      wastePct: num(state.wastePct),
    }),
    [state]
  );

  return { state, set, setUnit, reset, dims };
}

function round4(n: number): string {
  return String(Math.round(n * 10000) / 10000);
}

/** Renders the unit toggle, shape selector and the relevant dimension inputs. */
export function ShapeDimensionFields({
  state,
  set,
  setUnit,
  depthLabel = "Depth",
}: {
  state: VolumeState;
  set: <K extends keyof VolumeState>(key: K, value: VolumeState[K]) => void;
  setUnit: (u: UnitSystem) => void;
  depthLabel?: string;
}) {
  const metric = state.unit === "metric";
  const lenUnit = metric ? "m" : undefined;
  const depthUnit = metric ? "cm" : "in";

  const lengthField = (
    key: "length" | "width" | "diameter" | "base" | "height",
    label: string
  ) => {
    const ftKey = `${key}Ft` as keyof VolumeState;
    const inKey = `${key}In` as keyof VolumeState;
    if (metric) {
      return (
        <Field key={key} label={`${label} (m)`} htmlFor={`${key}-m`}>
          <NumberInput id={`${key}-m`} value={state[ftKey]} onChange={(v) => set(ftKey, v)} suffix={lenUnit} />
        </Field>
      );
    }
    return (
      <FeetInches
        key={key}
        idBase={key}
        label={label}
        feet={state[ftKey]}
        inches={state[inKey]}
        onFeet={(v) => set(ftKey, v)}
        onInches={(v) => set(inKey, v)}
      />
    );
  };

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <UnitToggle value={state.unit} onChange={setUnit} />
      </div>

      <Field label="Shape" htmlFor="shape">
        <Select
          id="shape"
          value={state.shape}
          onChange={(v) => set("shape", v as Shape)}
          options={[
            { value: "rectangle", label: "Rectangle / square" },
            { value: "circle", label: "Circle" },
            { value: "triangle", label: "Triangle" },
          ]}
        />
      </Field>

      {state.shape === "rectangle" && (
        <>
          {lengthField("length", "Length")}
          {lengthField("width", "Width")}
        </>
      )}
      {state.shape === "circle" && lengthField("diameter", "Diameter")}
      {state.shape === "triangle" && (
        <>
          {lengthField("base", "Base")}
          {lengthField("height", "Height")}
        </>
      )}

      <Field label={`${depthLabel} (${depthUnit})`} htmlFor="depth">
        <NumberInput id="depth" value={state.depthIn} onChange={(v) => set("depthIn", v)} suffix={depthUnit} />
      </Field>

      <Field label="Waste / extra (%)" htmlFor="waste" hint="A small buffer for settling and spillage.">
        <NumberInput id="waste" value={state.wastePct} onChange={(v) => set("wastePct", v)} suffix="%" />
      </Field>
    </>
  );
}
