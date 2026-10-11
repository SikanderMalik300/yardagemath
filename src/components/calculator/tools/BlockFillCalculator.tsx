"use client";

import { useMemo, useState } from "react";
import {
  computeBlockFill,
  type BlockFillWidth,
  type FillPattern,
  type BlockFillInput,
} from "@/lib/formulas/blockFill";
import { feetInchesToFeet, round } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { CONCRETE_BAG_YIELD_CUFT } from "@/lib/constants";
import { fmtInt, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, FeetInches, NumberInput, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "cinder-block-fill-calculator";
type BagSize = "lb80" | "lb60";
type Mode = "blocks" | "wall";

const GROUT_DISPLAY: Record<BlockFillWidth, string> = { in6: "0.17", in8: "0.26", in12: "0.42" };

export function BlockFillCalculator() {
  const [mode, setMode] = useState<Mode>("blocks");
  const [blocks, setBlocks] = useState("100");
  const [wLenFt, setWLenFt] = useState("20");
  const [wLenIn, setWLenIn] = useState("0");
  const [wHtFt, setWHtFt] = useState("4");
  const [wHtIn, setWHtIn] = useState("0");
  const [width, setWidth] = useState<BlockFillWidth>("in8");
  const [pattern, setPattern] = useState<FillPattern>("all");
  const [rebarSpacing, setRebarSpacing] = useState("32");
  const [waste, setWaste] = useState("10");
  const [bagSize, setBagSize] = useState<BagSize>("lb80");

  const result = useMemo(() => {
    const input: BlockFillInput = {
      mode,
      blocks: num(blocks),
      wallLengthFt: feetInchesToFeet(num(wLenFt), num(wLenIn)),
      wallHeightFt: feetInchesToFeet(num(wHtFt), num(wHtIn)),
      width,
      pattern,
      rebarSpacingIn: num(rebarSpacing),
      wastePct: num(waste),
      bagYieldCuFt: bagSize === "lb80" ? CONCRETE_BAG_YIELD_CUFT.lb80 : CONCRETE_BAG_YIELD_CUFT.lb60,
    };
    return computeBlockFill(input);
  }, [mode, blocks, wLenFt, wLenIn, wHtFt, wHtIn, width, pattern, rebarSpacing, waste, bagSize]);

  useFirstCalculate(
    SLUG,
    JSON.stringify({ mode, blocks, wLenFt, wLenIn, wHtFt, wHtIn, width, pattern, rebarSpacing, waste, bagSize })
  );

  const reset = () => {
    setMode("blocks"); setBlocks("100");
    setWLenFt("20"); setWLenIn("0"); setWHtFt("4"); setWHtIn("0");
    setWidth("in8"); setPattern("all"); setRebarSpacing("32"); setWaste("10"); setBagSize("lb80");
  };

  const bagLabel = bagSize === "lb80" ? "80-lb bags" : "60-lb bags";
  const summary = `Block fill: ${fmtNumber(round(result.cubicFeet, 1))} cu ft (${fmtNumber(round(result.cubicYards, 2))} cu yd, ${fmtInt(result.bags)} bags of 80 lb). — yardagemath.com/${SLUG}/`;

  return (
    <CalculatorShell
      left={
        <div>
          <GroupLabel>Wall or blocks</GroupLabel>
          <Field label="Measure by" htmlFor="mode">
            <Select
              id="mode"
              value={mode}
              onChange={(v) => setMode(v as Mode)}
              options={[
                { value: "blocks", label: "Number of blocks" },
                { value: "wall", label: "Wall size (L × H)" },
              ]}
            />
          </Field>
          {mode === "blocks" ? (
            <Field label="Number of blocks" htmlFor="blocks">
              <NumberInput id="blocks" value={blocks} onChange={setBlocks} />
            </Field>
          ) : (
            <>
              <FeetInches idBase="wlen" label="Wall length" feet={wLenFt} inches={wLenIn} onFeet={setWLenFt} onInches={setWLenIn} />
              <FeetInches idBase="wht" label="Wall height" feet={wHtFt} inches={wHtIn} onFeet={setWHtFt} onInches={setWHtIn} />
            </>
          )}
          <Field label="Block width" htmlFor="width">
            <Select
              id="width"
              value={width}
              onChange={(v) => setWidth(v as BlockFillWidth)}
              options={[
                { value: "in6", label: "6 inch" },
                { value: "in8", label: "8 inch (standard)" },
                { value: "in12", label: "12 inch" },
              ]}
            />
          </Field>
          <Field label="Fill pattern" htmlFor="pattern">
            <Select
              id="pattern"
              value={pattern}
              onChange={(v) => setPattern(v as FillPattern)}
              options={[
                { value: "all", label: "All cores" },
                { value: "everyOther", label: "Every other core" },
                { value: "rebar", label: "Only rebar cores" },
              ]}
            />
          </Field>
          {pattern === "rebar" && (
            <Field label="Rebar spacing (inches)" htmlFor="rebar" hint="A filled core every spacing; cores are 8 in apart.">
              <NumberInput id="rebar" value={rebarSpacing} onChange={setRebarSpacing} suffix="in" />
            </Field>
          )}

          <FormGroupDivider />
          <GroupLabel>Waste &amp; bags</GroupLabel>
          <Field label="Waste / extra (%)" htmlFor="waste">
            <NumberInput id="waste" value={waste} onChange={setWaste} suffix="%" />
          </Field>
          <Field label="Bag size" htmlFor="bag">
            <Select
              id="bag"
              value={bagSize}
              onChange={(v) => setBagSize(v as BagSize)}
              options={[
                { value: "lb80", label: "80 lb (0.60 cu ft)" },
                { value: "lb60", label: "60 lb (0.45 cu ft)" },
              ]}
            />
          </Field>
        </div>
      }
      right={
        <div>
          <PrimaryResult
            label="Concrete to fill"
            value={fmtNumber(round(result.cubicFeet, 1))}
            unit="cu ft"
            sub={`${fmtNumber(round(result.cubicYards, 2))} cu yd · ${fmtInt(result.bags)} ${bagLabel} (with ${waste}% waste).`}
          />
          <SecondaryResults>
            <SecondaryItem label="Cubic yards" value={`${fmtNumber(round(result.cubicYards, 2))} cu yd`} />
            <SecondaryItem label={bagLabel} value={fmtInt(result.bags)} />
            <SecondaryItem label="Blocks per bag" value={fmtNumber(round(result.blocksPerBag, 1))} />
            <SecondaryItem label="Blocks" value={fmtInt(Math.round(result.blocks))} />
          </SecondaryResults>

          <ShowMath>
            <MathLine>
              {mode === "blocks"
                ? `area = ${fmtInt(num(blocks))} ÷ 1.125 = ${fmtNumber(round(result.blocks / 1.125, 1))} sq ft`
                : `area = L × H = ${fmtNumber(round(feetInchesToFeet(num(wLenFt), num(wLenIn)) * feetInchesToFeet(num(wHtFt), num(wHtIn)), 1))} sq ft`}
            </MathLine>
            <MathLine>
              cu ft = area × {GROUT_DISPLAY[width]} × {fmtNumber(round(result.fillFraction, 3))} = {fmtNumber(round(result.cubicFeet, 2))}
            </MathLine>
            <MathLine>
              cubic yards = {fmtNumber(round(result.cubicFeet, 2))} ÷ 27 = {fmtNumber(round(result.cubicYards, 2))}
            </MathLine>
            <MathLine>
              bags = ceil({fmtNumber(round(result.cubicFeet * (1 + num(waste) / 100), 1))} ÷ {bagSize === "lb80" ? "0.60" : "0.45"}) = {fmtInt(result.bags)}
            </MathLine>
          </ShowMath>

          <ResultActions
            slug={SLUG}
            getSummary={() => summary}
            getShareParams={() => ({ mode, width, pattern })}
            onReset={reset}
          />
        </div>
      }
    />
  );
}
