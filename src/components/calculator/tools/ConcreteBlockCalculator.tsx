"use client";

import { useMemo, useState } from "react";
import { computeConcreteBlock } from "@/lib/formulas/concreteBlock";
import { feetInchesToFeet } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { fmtInt, fmtUSD, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, FeetInches, NumberInput, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { OpeningsEditor, openingRowsToModel, type OpeningRow } from "../Openings";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "concrete-block-calculator";

export function ConcreteBlockCalculator() {
  const [lenFt, setLenFt] = useState("20");
  const [lenIn, setLenIn] = useState("0");
  const [htFt, setHtFt] = useState("6");
  const [htIn, setHtIn] = useState("0");
  const [blockSize, setBlockSize] = useState("8x8x16");
  const [waste, setWaste] = useState("5");
  const [price, setPrice] = useState("");
  const [openings, setOpenings] = useState<OpeningRow[]>([]);

  const result = useMemo(
    () =>
      computeConcreteBlock({
        wallLengthFt: feetInchesToFeet(num(lenFt), num(lenIn)),
        wallHeightFt: feetInchesToFeet(num(htFt), num(htIn)),
        openings: openingRowsToModel(openings),
        wastePct: num(waste),
        pricePerBlock: price === "" ? null : num(price),
      }),
    [lenFt, lenIn, htFt, htIn, openings, waste, price]
  );

  useFirstCalculate(SLUG, JSON.stringify({ lenFt, lenIn, htFt, htIn, blockSize, waste, price, openings }));

  const reset = () => {
    setLenFt("20");
    setLenIn("0");
    setHtFt("6");
    setHtIn("0");
    setBlockSize("8x8x16");
    setWaste("5");
    setPrice("");
    setOpenings([]);
  };

  const summary = `${fmtInt(result.blocks)} blocks (${result.courses} courses), ${result.mortarBags} mortar bags. — yardagemath.com/${SLUG}/`;

  return (
    <CalculatorShell
      left={
        <div>
          <GroupLabel>Wall dimensions</GroupLabel>
          <FeetInches idBase="len" label="Wall length" feet={lenFt} inches={lenIn} onFeet={setLenFt} onInches={setLenIn} />
          <FeetInches idBase="ht" label="Wall height" feet={htFt} inches={htIn} onFeet={setHtFt} onInches={setHtIn} />
          <Field label="Block size (nominal face 8″ × 16″)" htmlFor="bs">
            <Select
              id="bs"
              value={blockSize}
              onChange={setBlockSize}
              options={[
                { value: "8x8x16", label: "8 × 8 × 16 (standard)" },
                { value: "6x8x16", label: "6 × 8 × 16" },
                { value: "12x8x16", label: "12 × 8 × 16" },
                { value: "4x8x16", label: "4 × 8 × 16" },
              ]}
            />
          </Field>
          <FormGroupDivider />
          <OpeningsEditor rows={openings} onChange={setOpenings} />
          <FormGroupDivider />
          <GroupLabel>Options</GroupLabel>
          <Field label="Waste / extra (%)" htmlFor="waste">
            <NumberInput id="waste" value={waste} onChange={setWaste} suffix="%" />
          </Field>
          <Field label="Price per block (optional)" htmlFor="price">
            <NumberInput id="price" value={price} onChange={setPrice} suffix="$" placeholder="e.g. 2.00" />
          </Field>
        </div>
      }
      right={
        <div>
          <PrimaryResult
            label="Concrete blocks needed"
            value={fmtInt(result.blocks)}
            unit="blocks"
            sub={`Includes ${waste}% waste. ${result.courses} courses × ${result.blocksPerCourse} per course.`}
          />
          <SecondaryResults>
            <SecondaryItem label="Net wall area" value={`${fmtNumber(result.netAreaSqFt, 1)} sq ft`} />
            <SecondaryItem label="Courses" value={fmtInt(result.courses)} />
            <SecondaryItem label="Mortar bags (80 lb)" value={fmtInt(result.mortarBags)} />
            {result.totalCost !== null && <SecondaryItem label="Block cost" value={fmtUSD(result.totalCost)} />}
          </SecondaryResults>

          <ShowMath>
            <MathLine>net area = {fmtNumber(result.netAreaSqFt, 1)} sq ft (after openings)</MathLine>
            <MathLine>blocks = {fmtNumber(result.netAreaSqFt, 1)} × 1.125 = {fmtNumber(result.blocksBeforeWaste, 2)}</MathLine>
            <MathLine>+ {waste}% waste → {fmtInt(result.blocks)} blocks</MathLine>
            <MathLine>mortar = ceil({fmtInt(result.blocks)} ÷ 13) = {fmtInt(result.mortarBags)} bags</MathLine>
          </ShowMath>

          <ResultActions
            slug={SLUG}
            getSummary={() => summary}
            getShareParams={() => ({ l: lenFt, h: htFt, waste })}
            onReset={reset}
          />
        </div>
      }
    />
  );
}
