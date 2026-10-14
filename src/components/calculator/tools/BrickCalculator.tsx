"use client";

import { useMemo, useState } from "react";
import { computeBrick, customBricksPerSqFt, type BrickTypeKey, type BrickInput } from "@/lib/formulas/brick";
import { feetInchesToFeet, round } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { BRICK_PER_SQFT, BRICKS_PER_MORTAR_BAG_80, PRICES } from "@/lib/constants";
import { fmtInt, fmtUSD, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, FeetInches, NumberInput, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { OpeningsEditor, type OpeningRow } from "../Openings";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "brick-calculator";

const SIZE_OPTS = [
  { value: "modular", label: "Modular — 3⅝ × 2¼ × 7⅝ (6.75/sq ft)" },
  { value: "queen", label: "Queen (5.76/sq ft)" },
  { value: "king", label: "King (4.8/sq ft)" },
  { value: "utility", label: "Utility (3.0/sq ft)" },
  { value: "custom", label: "Custom size" },
];

export function BrickCalculator() {
  const [mode, setMode] = useState<"size" | "sqft">("size");
  const [lenFt, setLenFt] = useState("20");
  const [lenIn, setLenIn] = useState("0");
  const [htFt, setHtFt] = useState("4");
  const [htIn, setHtIn] = useState("0");
  const [sqft, setSqft] = useState("80");
  const [brick, setBrick] = useState<BrickTypeKey>("modular");
  const [customL, setCustomL] = useState("7.625");
  const [customH, setCustomH] = useState("2.25");
  const [wythes, setWythes] = useState("1");
  const [waste, setWaste] = useState("5");
  const [price, setPrice] = useState(String(PRICES.brickEach));
  const [bagPrice, setBagPrice] = useState(String(PRICES.mortarBag));
  const [openings, setOpenings] = useState<OpeningRow[]>([]);

  const perSqFt = brick === "custom" ? customBricksPerSqFt(num(customL), num(customH)) : BRICK_PER_SQFT[brick];

  const result = useMemo(() => {
    const input: BrickInput = {
      useSqFt: mode === "sqft",
      lengthFt: feetInchesToFeet(num(lenFt), num(lenIn)),
      heightFt: feetInchesToFeet(num(htFt), num(htIn)),
      directSqFt: num(sqft),
      // Expand each opening row (count x width x height) into individual openings.
      openings: openings.flatMap((o) =>
        Array.from({ length: Math.max(0, Math.round(num(o.count) || 0)) }, () => ({ widthFt: num(o.widthFt), heightFt: num(o.heightFt) }))
      ),
      perSqFt,
      wythes: num(wythes),
      wastePct: num(waste),
      bricksPerBag: BRICKS_PER_MORTAR_BAG_80,
      pricePerBrick: num(price),
      pricePerBag: num(bagPrice),
    };
    return computeBrick(input);
  }, [mode, lenFt, lenIn, htFt, htIn, sqft, openings, perSqFt, wythes, waste, price, bagPrice]);

  useFirstCalculate(SLUG, JSON.stringify({ mode, lenFt, htFt, sqft, brick, customL, customH, wythes, waste, price, bagPrice, openings }));

  const reset = () => {
    setMode("size");
    setLenFt("20"); setLenIn("0"); setHtFt("4"); setHtIn("0"); setSqft("80");
    setBrick("modular"); setCustomL("7.625"); setCustomH("2.25");
    setWythes("1"); setWaste("5");
    setPrice(String(PRICES.brickEach)); setBagPrice(String(PRICES.mortarBag));
    setOpenings([]);
  };

  const summary = `Brick: ${fmtInt(result.bricksWithWaste)} bricks with ${waste}% waste (${fmtInt(result.bricks)} before), ${fmtInt(result.bags)} bags of mortar. Total ${fmtUSD(result.totalCost)}. — yardagemath.com/${SLUG}/`;

  return (
    <div>
      <CalculatorShell
        left={
          <div>
            <GroupLabel>Wall</GroupLabel>
            <Field label="Enter the wall as" htmlFor="mode">
              <Select id="mode" value={mode} onChange={(v) => setMode(v as "size" | "sqft")} options={[
                { value: "size", label: "Length × height" },
                { value: "sqft", label: "I know the square feet" },
              ]} />
            </Field>
            {mode === "size" ? (
              <>
                <FeetInches idBase="len" label="Wall length" feet={lenFt} inches={lenIn} onFeet={setLenFt} onInches={setLenIn} />
                <FeetInches idBase="ht" label="Wall height" feet={htFt} inches={htIn} onFeet={setHtFt} onInches={setHtIn} />
              </>
            ) : (
              <Field label="Wall area (sq ft)" htmlFor="sqft"><NumberInput id="sqft" value={sqft} onChange={setSqft} suffix="sq ft" /></Field>
            )}

            <FormGroupDivider />
            <OpeningsEditor rows={openings} onChange={(r) => setOpenings(r.slice(0, 5))} />

            <FormGroupDivider />
            <GroupLabel>Brick &amp; options</GroupLabel>
            <Field label="Brick size" htmlFor="brick" hint="Modular is the most common in the US.">
              <Select id="brick" value={brick} onChange={(v) => setBrick(v as BrickTypeKey)} options={SIZE_OPTS} />
            </Field>
            {brick === "custom" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <Field label="Brick length (in)" htmlFor="cl"><NumberInput id="cl" value={customL} onChange={setCustomL} suffix="in" /></Field>
                <Field label="Brick height (in)" htmlFor="ch"><NumberInput id="ch" value={customH} onChange={setCustomH} suffix="in" /></Field>
              </div>
            )}
            <Field label="Wythes (layers)" htmlFor="wythes">
              <Select id="wythes" value={wythes} onChange={setWythes} options={[
                { value: "1", label: "Single (one brick thick)" },
                { value: "2", label: "Double" },
              ]} />
            </Field>
            <Field label="Waste / extra (%)" htmlFor="waste" hint="Use 10% for lots of cuts, corners or a pattern.">
              <NumberInput id="waste" value={waste} onChange={setWaste} suffix="%" />
            </Field>
            <Field label="Price per brick" htmlFor="price">
              <NumberInput id="price" value={price} onChange={setPrice} suffix="$" />
            </Field>
            <Field label="Price per 80-lb mortar bag" htmlFor="bagprice">
              <NumberInput id="bagprice" value={bagPrice} onChange={setBagPrice} suffix="$" />
            </Field>
          </div>
        }
        right={
          <div>
            <PrimaryResult
              label="Bricks needed"
              value={fmtInt(result.bricksWithWaste)}
              unit="bricks"
              sub={`${fmtInt(result.bricks)} before ${waste}% waste · ${fmtNumber(round(result.netAreaSqFt, 1))} net sq ft`}
            />
            <SecondaryResults>
              <SecondaryItem label="Net wall area" value={`${fmtNumber(round(result.netAreaSqFt, 1))} sq ft`} />
              <SecondaryItem label="Mortar bags (80 lb)" value={fmtInt(result.bags)} />
              <SecondaryItem label="Brick cost" value={fmtUSD(result.brickCost)} />
              <SecondaryItem label="Mortar cost" value={fmtUSD(result.mortarCost)} />
              <SecondaryItem label="Total cost" value={fmtUSD(result.totalCost)} />
            </SecondaryResults>

            <ShowMath>
              <MathLine>net area = {fmtNumber(round(result.netAreaSqFt, 1))} sq ft (after openings)</MathLine>
              <MathLine>bricks = {fmtNumber(round(result.netAreaSqFt, 1))} × {fmtNumber(round(perSqFt, 2))} × {wythes} = {fmtNumber(round(result.netAreaSqFt * perSqFt * num(wythes), 1))}</MathLine>
              <MathLine>+ {waste}% waste → {fmtInt(result.bricksWithWaste)} bricks</MathLine>
              <MathLine>mortar = ceil({fmtInt(result.bricksWithWaste)} ÷ {BRICKS_PER_MORTAR_BAG_80}) = {fmtInt(result.bags)} bags</MathLine>
            </ShowMath>

            <ResultActions
              slug={SLUG}
              getSummary={() => summary}
              getShareParams={() => ({ brick, l: lenFt, h: htFt, waste })}
              onReset={reset}
            />
          </div>
        }
      />
    </div>
  );
}
