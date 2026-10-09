"use client";

import { useMemo, useState } from "react";
import {
  computeYardsOfConcrete,
  type ConcreteShape,
  type YardsOfConcreteInput,
} from "@/lib/formulas/yardsOfConcrete";
import { feetInchesToFeet, round } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { PRICES, CONCRETE_BAG_YIELD_CUFT } from "@/lib/constants";
import { fmtInt, fmtUSD, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, FeetInches, NumberInput, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "yards-of-concrete-calculator";
type BagSize = "lb80" | "lb60";

const TABS: { value: ConcreteShape; label: string }[] = [
  { value: "slab", label: "Slab / patio" },
  { value: "strip", label: "Wall / footing strip" },
  { value: "column", label: "Round column" },
];

export function YardsOfConcreteCalculator() {
  const [shape, setShape] = useState<ConcreteShape>("slab");

  // Slab
  const [lenFt, setLenFt] = useState("12");
  const [lenIn, setLenIn] = useState("0");
  const [widFt, setWidFt] = useState("12");
  const [widIn, setWidIn] = useState("0");
  const [thick, setThick] = useState("4");

  // Strip
  const [sLenFt, setSLenFt] = useState("40");
  const [sLenIn, setSLenIn] = useState("0");
  const [sWidFt, setSWidFt] = useState("1");
  const [sWidIn, setSWidIn] = useState("4");
  const [sDepFt, setSDepFt] = useState("0");
  const [sDepIn, setSDepIn] = useState("8");

  // Column
  const [diaFt, setDiaFt] = useState("1");
  const [diaIn, setDiaIn] = useState("0");
  const [htFt, setHtFt] = useState("4");
  const [htIn, setHtIn] = useState("0");
  const [qty, setQty] = useState("4");

  // Shared
  const [waste, setWaste] = useState("10");
  const [price, setPrice] = useState(String(PRICES.concretePerCuYd));
  const [bagSize, setBagSize] = useState<BagSize>("lb80");

  const result = useMemo(() => {
    const input: YardsOfConcreteInput = {
      shape,
      lengthFt: feetInchesToFeet(num(lenFt), num(lenIn)),
      widthFt: feetInchesToFeet(num(widFt), num(widIn)),
      thicknessIn: num(thick),
      stripLengthFt: feetInchesToFeet(num(sLenFt), num(sLenIn)),
      stripWidthFt: feetInchesToFeet(num(sWidFt), num(sWidIn)),
      stripDepthFt: feetInchesToFeet(num(sDepFt), num(sDepIn)),
      diameterFt: feetInchesToFeet(num(diaFt), num(diaIn)),
      heightFt: feetInchesToFeet(num(htFt), num(htIn)),
      quantity: num(qty),
      wastePct: num(waste),
      pricePerCuYd: num(price),
      bagYieldCuFt: bagSize === "lb80" ? CONCRETE_BAG_YIELD_CUFT.lb80 : CONCRETE_BAG_YIELD_CUFT.lb60,
    };
    return computeYardsOfConcrete(input);
  }, [shape, lenFt, lenIn, widFt, widIn, thick, sLenFt, sLenIn, sWidFt, sWidIn, sDepFt, sDepIn, diaFt, diaIn, htFt, htIn, qty, waste, price, bagSize]);

  useFirstCalculate(
    SLUG,
    JSON.stringify({ shape, lenFt, lenIn, widFt, widIn, thick, sLenFt, sLenIn, sWidFt, sWidIn, sDepFt, sDepIn, diaFt, diaIn, htFt, htIn, qty, waste, price, bagSize })
  );

  const reset = () => {
    setShape("slab");
    setLenFt("12"); setLenIn("0"); setWidFt("12"); setWidIn("0"); setThick("4");
    setSLenFt("40"); setSLenIn("0"); setSWidFt("1"); setSWidIn("4"); setSDepFt("0"); setSDepIn("8");
    setDiaFt("1"); setDiaIn("0"); setHtFt("4"); setHtIn("0"); setQty("4");
    setWaste("10"); setPrice(String(PRICES.concretePerCuYd)); setBagSize("lb80");
  };

  const summary = `Concrete: ${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd with ${waste}% waste (${fmtInt(result.bags)} bags of 80 lb, ${fmtUSD(result.cost)}). — yardagemath.com/${SLUG}/`;

  const bagLabel = bagSize === "lb80" ? "80-lb bags" : "60-lb bags";

  return (
    <div>
      <div role="tablist" aria-label="Pour shape" style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {TABS.map((t) => {
          const active = shape === t.value;
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setShape(t.value)}
              style={{
                minHeight: 44,
                padding: "0.5rem 0.875rem",
                border: "1px solid var(--border-strong)",
                borderBottom: active ? "2px solid var(--brand)" : "1px solid var(--border-strong)",
                background: active ? "var(--brand-soft)" : "var(--surface)",
                color: active ? "var(--brand)" : "var(--text-secondary)",
                fontWeight: 600,
                fontSize: "0.9375rem",
                cursor: "pointer",
                borderRadius: active ? "var(--radius-sm) var(--radius-sm) 0 0" : "var(--radius-sm)",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <CalculatorShell
        left={
          <div>
            <GroupLabel>Dimensions</GroupLabel>
            {shape === "slab" && (
              <>
                <FeetInches idBase="len" label="Length" feet={lenFt} inches={lenIn} onFeet={setLenFt} onInches={setLenIn} />
                <FeetInches idBase="wid" label="Width" feet={widFt} inches={widIn} onFeet={setWidFt} onInches={setWidIn} />
                <Field label="Thickness (inches)" htmlFor="thick" hint="4″ for patios/walkways, 5–6″ for driveways.">
                  <NumberInput id="thick" value={thick} onChange={setThick} suffix="in" />
                </Field>
              </>
            )}
            {shape === "strip" && (
              <>
                <FeetInches idBase="slen" label="Length" feet={sLenFt} inches={sLenIn} onFeet={setSLenFt} onInches={setSLenIn} />
                <FeetInches idBase="swid" label="Width" feet={sWidFt} inches={sWidIn} onFeet={setSWidFt} onInches={setSWidIn} />
                <FeetInches idBase="sdep" label="Depth" feet={sDepFt} inches={sDepIn} onFeet={setSDepFt} onInches={setSDepIn} />
              </>
            )}
            {shape === "column" && (
              <>
                <FeetInches idBase="dia" label="Diameter" feet={diaFt} inches={diaIn} onFeet={setDiaFt} onInches={setDiaIn} />
                <FeetInches idBase="ht" label="Height" feet={htFt} inches={htIn} onFeet={setHtFt} onInches={setHtIn} />
                <Field label="Number of columns" htmlFor="qty">
                  <NumberInput id="qty" value={qty} onChange={setQty} />
                </Field>
              </>
            )}

            <FormGroupDivider />
            <GroupLabel>Waste, price &amp; bags</GroupLabel>
            <Field label="Waste / extra (%)" htmlFor="waste">
              <NumberInput id="waste" value={waste} onChange={setWaste} suffix="%" />
            </Field>
            <Field label="Price per cubic yard" htmlFor="price">
              <NumberInput id="price" value={price} onChange={setPrice} suffix="$/yd" />
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
              label="Cubic yards needed"
              value={fmtNumber(round(result.cubicYards, 2))}
              unit="cu yd"
              sub={`With ${waste}% waste, order ${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd.`}
            />
            <SecondaryResults>
              <SecondaryItem label="With waste" value={`${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd`} />
              <SecondaryItem label="Cubic feet" value={`${fmtNumber(round(result.cubicFeet, 1))} cu ft`} />
              <SecondaryItem label={bagLabel} value={fmtInt(result.bags)} />
              <SecondaryItem label="Estimated cost" value={fmtUSD(result.cost)} />
            </SecondaryResults>

            <ShowMath>
              {shape === "slab" && (
                <MathLine>
                  cu ft = {fmtNumber(round(feetInchesToFeet(num(lenFt), num(lenIn)) * feetInchesToFeet(num(widFt), num(widIn)), 2))} × ({thick} ÷ 12) ={" "}
                  {fmtNumber(round(result.cubicFeet, 2))}
                </MathLine>
              )}
              {shape === "strip" && (
                <MathLine>
                  cu ft = L × W × D = {fmtNumber(round(result.cubicFeet, 2))}
                </MathLine>
              )}
              {shape === "column" && (
                <MathLine>
                  cu ft = π × (d ÷ 2)² × h × {qty} = {fmtNumber(round(result.cubicFeet, 2))}
                </MathLine>
              )}
              <MathLine>
                cubic yards = {fmtNumber(round(result.cubicFeet, 2))} ÷ 27 = {fmtNumber(round(result.cubicYards, 2))}
              </MathLine>
              <MathLine>+ {waste}% waste = {fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd</MathLine>
              <MathLine>
                bags = ceil({fmtNumber(round(result.cubicFeet * (1 + num(waste) / 100), 1))} ÷ {bagSize === "lb80" ? "0.60" : "0.45"}) = {fmtInt(result.bags)}
              </MathLine>
            </ShowMath>

            <ResultActions
              slug={SLUG}
              getSummary={() => summary}
              getShareParams={() => ({ shape, waste, price })}
              onReset={reset}
            />
          </div>
        }
      />
    </div>
  );
}
