"use client";

import { useMemo, useState } from "react";
import {
  computeBlockWall,
  type BlockWidth,
  type CoreFill,
  type RebarSpacing,
} from "@/lib/formulas/blockWall";
import { feetInchesToFeet, round } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { PRICES } from "@/lib/constants";
import { fmtInt, fmtUSD, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, FeetInches, NumberInput, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { OpeningsEditor, openingRowsToModel, type OpeningRow } from "../Openings";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "block-wall-calculator";

export function BlockWallCalculator() {
  const [lenFt, setLenFt] = useState("30");
  const [lenIn, setLenIn] = useState("0");
  const [htFt, setHtFt] = useState("4");
  const [htIn, setHtIn] = useState("0");
  const [blockWidth, setBlockWidth] = useState<BlockWidth>("in8");
  const [cap, setCap] = useState(true);
  const [coreFill, setCoreFill] = useState<CoreFill>("none");
  const [rebarSpacing, setRebarSpacing] = useState<RebarSpacing>(32);
  const [openings, setOpenings] = useState<OpeningRow[]>([]);
  const [pBlock, setPBlock] = useState(String(PRICES.blockEach));
  const [pCap, setPCap] = useState(String(PRICES.capBlockEach));
  const [pMortar, setPMortar] = useState(String(PRICES.mortarBag));
  const [pGrout, setPGrout] = useState(String(PRICES.groutPerCuYd));
  const [pRebar, setPRebar] = useState(String(PRICES.rebar20ftBar));

  const result = useMemo(
    () =>
      computeBlockWall({
        lengthFt: feetInchesToFeet(num(lenFt), num(lenIn)),
        heightFt: feetInchesToFeet(num(htFt), num(htIn)),
        blockWidth,
        openings: openingRowsToModel(openings),
        capBlocks: cap,
        coreFill,
        rebarSpacingIn: rebarSpacing,
        prices: {
          block: num(pBlock),
          cap: num(pCap),
          mortarBag: num(pMortar),
          groutPerCuYd: num(pGrout),
          rebar20ftBar: num(pRebar),
        },
      }),
    [lenFt, lenIn, htFt, htIn, blockWidth, openings, cap, coreFill, rebarSpacing, pBlock, pCap, pMortar, pGrout, pRebar]
  );

  useFirstCalculate(
    SLUG,
    JSON.stringify({ lenFt, lenIn, htFt, htIn, blockWidth, cap, coreFill, rebarSpacing, openings, pBlock, pCap, pMortar, pGrout, pRebar })
  );

  const reset = () => {
    setLenFt("30"); setLenIn("0"); setHtFt("4"); setHtIn("0"); setBlockWidth("in8");
    setCap(true); setCoreFill("none"); setRebarSpacing(32); setOpenings([]);
    setPBlock(String(PRICES.blockEach)); setPCap(String(PRICES.capBlockEach));
    setPMortar(String(PRICES.mortarBag)); setPGrout(String(PRICES.groutPerCuYd)); setPRebar(String(PRICES.rebar20ftBar));
  };

  const summary = `Block wall: ${fmtInt(result.blocks)} blocks, ${result.courses} courses, ${result.mortarBags} mortar bags, total ${fmtUSD(result.cost.total)}. — YardageMath`;

  return (
    <CalculatorShell
      left={
        <div>
          <GroupLabel>Wall dimensions</GroupLabel>
          <FeetInches idBase="len" label="Wall length" feet={lenFt} inches={lenIn} onFeet={setLenFt} onInches={setLenIn} />
          <FeetInches idBase="ht" label="Wall height" feet={htFt} inches={htIn} onFeet={setHtFt} onInches={setHtIn} />
          <Field label="Block width" htmlFor="bw">
            <Select
              id="bw"
              value={blockWidth}
              onChange={(v) => setBlockWidth(v as BlockWidth)}
              options={[
                { value: "in6", label: '6" block' },
                { value: "in8", label: '8" block' },
                { value: "in12", label: '12" block' },
              ]}
            />
          </Field>

          <FormGroupDivider />
          <OpeningsEditor rows={openings} onChange={setOpenings} />

          <FormGroupDivider />
          <GroupLabel>Reinforcement &amp; finish</GroupLabel>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", fontSize: "0.9375rem" }}>
            <input type="checkbox" checked={cap} onChange={(e) => setCap(e.target.checked)} style={{ width: 18, height: 18 }} />
            Add cap blocks to the top course
          </label>
          <Field label="Core fill (grout)" htmlFor="cf">
            <Select
              id="cf"
              value={coreFill}
              onChange={(v) => setCoreFill(v as CoreFill)}
              options={[
                { value: "none", label: "None" },
                { value: "everyOther", label: "Every other core" },
                { value: "full", label: "Full grout" },
              ]}
            />
          </Field>
          {coreFill !== "none" && (
            <Field label="Vertical rebar spacing" htmlFor="rb">
              <Select
                id="rb"
                value={String(rebarSpacing)}
                onChange={(v) => setRebarSpacing(Number(v) as RebarSpacing)}
                options={[
                  { value: "16", label: '16" on center' },
                  { value: "24", label: '24" on center' },
                  { value: "32", label: '32" on center' },
                  { value: "48", label: '48" on center' },
                ]}
              />
            </Field>
          )}

          <FormGroupDivider />
          <GroupLabel>Prices</GroupLabel>
          <Field label="Price per block" htmlFor="pb"><NumberInput id="pb" value={pBlock} onChange={setPBlock} suffix="$" /></Field>
          <Field label="Price per cap block" htmlFor="pc"><NumberInput id="pc" value={pCap} onChange={setPCap} suffix="$" /></Field>
          <Field label="Price per mortar bag" htmlFor="pm"><NumberInput id="pm" value={pMortar} onChange={setPMortar} suffix="$" /></Field>
          {coreFill !== "none" && (
            <>
              <Field label="Grout price (per cu yd)" htmlFor="pg"><NumberInput id="pg" value={pGrout} onChange={setPGrout} suffix="$/yd" /></Field>
              <Field label="Rebar price (per 20 ft bar)" htmlFor="pr"><NumberInput id="pr" value={pRebar} onChange={setPRebar} suffix="$" /></Field>
            </>
          )}
        </div>
      }
      right={
        <div>
          <PrimaryResult
            label="Total material cost"
            value={fmtUSD(result.cost.total)}
            sub={`${fmtInt(result.blocks)} blocks · ${result.courses} courses · ${result.mortarBags} mortar bags`}
          />
          <SecondaryResults>
            <SecondaryItem label="Blocks (+waste)" value={fmtInt(result.blocks)} />
            <SecondaryItem label="Courses" value={fmtInt(result.courses)} />
            <SecondaryItem label="Cap blocks" value={fmtInt(result.capBlocks)} />
            <SecondaryItem label="Mortar bags" value={fmtInt(result.mortarBags)} />
            {result.groutCuYd > 0 && <SecondaryItem label="Grout" value={`${fmtNumber(round(result.groutCuYd, 2))} cu yd`} />}
            {result.rebarBars > 0 && <SecondaryItem label="Rebar bars (20 ft)" value={fmtInt(result.rebarBars)} />}
          </SecondaryResults>

          <ShowMath>
            <MathLine>courses = ceil({num(htFt) * 12 + num(htIn)} ÷ 8) = {result.courses}</MathLine>
            <MathLine>net area = {fmtNumber(round(result.netAreaSqFt, 1))} sq ft</MathLine>
            <MathLine>blocks = {fmtNumber(round(result.netAreaSqFt, 1))} × 1.125 × 1.05 = {fmtInt(result.blocks)}</MathLine>
            <MathLine>cap = ceil(length ÷ 16) = {fmtInt(result.capBlocks)}</MathLine>
            <MathLine>cost = blocks + cap + mortar + grout + rebar = {fmtUSD(result.cost.total)}</MathLine>
          </ShowMath>

          <ResultActions slug={SLUG} getSummary={() => summary} getShareParams={() => ({ l: lenFt, h: htFt, bw: blockWidth, cf: coreFill })} onReset={reset} />
        </div>
      }
    />
  );
}
