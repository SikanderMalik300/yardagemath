"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { computeCmuConverter } from "@/lib/formulas/cmuSizes";
import { feetInchesToFeet } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { fmtInt, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { FeetInches, GroupLabel } from "../Fields";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "cmu-block-sizes";

function inchesFrom(ft: string, inch: string): number {
  return feetInchesToFeet(num(ft), num(inch)) * 12;
}

export function CmuSizesConverter() {
  const [hFt, setHFt] = useState("6");
  const [hIn, setHIn] = useState("0");
  const [lFt, setLFt] = useState("20");
  const [lIn, setLIn] = useState("0");

  const heightIn = inchesFrom(hFt, hIn);
  const lengthIn = inchesFrom(lFt, lIn);

  const result = useMemo(
    () => computeCmuConverter({ wallHeightIn: heightIn, wallLengthIn: lengthIn }),
    [heightIn, lengthIn]
  );

  useFirstCalculate(SLUG, JSON.stringify({ hFt, hIn, lFt, lIn }));

  const reset = () => {
    setHFt("6");
    setHIn("0");
    setLFt("20");
    setLIn("0");
  };

  const builtFt = result.builtHeightIn / 12;
  const summary = `CMU wall: ${fmtInt(result.courses)} courses (${fmtInt(result.builtHeightIn)} in / ${fmtNumber(builtFt, 2)} ft built) and ${fmtInt(result.blocksPerCourse)} blocks per course. — yardagemath.com/${SLUG}/`;

  return (
    <CalculatorShell
      left={
        <div>
          <GroupLabel>Wall size</GroupLabel>
          <FeetInches idBase="h" label="Wall height" feet={hFt} inches={hIn} onFeet={setHFt} onInches={setHIn} />
          <FeetInches idBase="l" label="Wall length" feet={lFt} inches={lIn} onFeet={setLFt} onInches={setLIn} />
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "1rem" }}>
            For full block, mortar and cost counts, use the{" "}
            <Link href="/concrete-block-calculator/" prefetch={false}>
              concrete block calculator
            </Link>
            .
          </p>
        </div>
      }
      right={
        <div>
          <PrimaryResult
            label="Courses"
            value={fmtInt(result.courses)}
            unit="courses"
            sub={`Built height ${fmtInt(result.builtHeightIn)} in (${fmtNumber(builtFt, 2)} ft) at 8 in per course.`}
          />
          <SecondaryResults>
            <SecondaryItem label="Built height" value={`${fmtInt(result.builtHeightIn)} in`} />
            <SecondaryItem label="Blocks per course" value={fmtInt(result.blocksPerCourse)} />
            <SecondaryItem label="Courses per foot" value={fmtNumber(result.coursesPerFoot, 1)} />
            <SecondaryItem label="Module" value={'8" × 16" per block'} />
          </SecondaryResults>

          <ShowMath>
            <MathLine>
              courses = ceil({fmtInt(heightIn)} ÷ 8) = {fmtInt(result.courses)}
            </MathLine>
            <MathLine>
              built height = {fmtInt(result.courses)} × 8 = {fmtInt(result.builtHeightIn)} in
            </MathLine>
            <MathLine>
              blocks per course = ceil({fmtInt(lengthIn)} ÷ 16) = {fmtInt(result.blocksPerCourse)}
            </MathLine>
          </ShowMath>

          <ResultActions
            slug={SLUG}
            getSummary={() => summary}
            getShareParams={() => ({ hFt, hIn, lFt, lIn })}
            onReset={reset}
          />
        </div>
      }
    />
  );
}
