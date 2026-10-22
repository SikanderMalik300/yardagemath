"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { computeFooting, type FootingType, type FootingInput } from "@/lib/formulas/footing";
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

const SLUG = "concrete-footing-calculator";
type BagSize = "lb80" | "lb60";

const TABS: { value: FootingType; label: string }[] = [
  { value: "strip", label: "Continuous (strip)" },
  { value: "pad", label: "Pad footings" },
  { value: "pier", label: "Round piers" },
];

export function FootingCalculator() {
  const [type, setType] = useState<FootingType>("strip");

  // Strip footing
  const [sLenFt, setSLenFt] = useState("40");
  const [sLenIn, setSLenIn] = useState("0");
  const [sWidFt, setSWidFt] = useState("1");
  const [sWidIn, setSWidIn] = useState("4");
  const [sDepFt, setSDepFt] = useState("0");
  const [sDepIn, setSDepIn] = useState("8");

  // Pad footings
  const [pLenFt, setPLenFt] = useState("2");
  const [pLenIn, setPLenIn] = useState("0");
  const [pWidFt, setPWidFt] = useState("2");
  const [pWidIn, setPWidIn] = useState("0");
  const [pDepFt, setPDepFt] = useState("1");
  const [pDepIn, setPDepIn] = useState("0");
  const [pQty, setPQty] = useState("6");

  // Round piers
  const [diaFt, setDiaFt] = useState("1");
  const [diaIn, setDiaIn] = useState("0");
  const [piDepFt, setPiDepFt] = useState("3");
  const [piDepIn, setPiDepIn] = useState("0");
  const [piQty, setPiQty] = useState("4");

  // Shared
  const [waste, setWaste] = useState("10");
  const [price, setPrice] = useState(String(PRICES.concretePerCuYd));
  const [bagSize, setBagSize] = useState<BagSize>("lb80");

  const result = useMemo(() => {
    const input: FootingInput = {
      type,
      lengthFt: type === "pad" ? feetInchesToFeet(num(pLenFt), num(pLenIn)) : feetInchesToFeet(num(sLenFt), num(sLenIn)),
      widthFt: type === "pad" ? feetInchesToFeet(num(pWidFt), num(pWidIn)) : feetInchesToFeet(num(sWidFt), num(sWidIn)),
      depthFt:
        type === "strip"
          ? feetInchesToFeet(num(sDepFt), num(sDepIn))
          : type === "pad"
          ? feetInchesToFeet(num(pDepFt), num(pDepIn))
          : feetInchesToFeet(num(piDepFt), num(piDepIn)),
      diameterFt: feetInchesToFeet(num(diaFt), num(diaIn)),
      quantity: type === "pad" ? num(pQty) : type === "pier" ? num(piQty) : 1,
      wastePct: num(waste),
      pricePerCuYd: num(price),
      bagYieldCuFt: bagSize === "lb80" ? CONCRETE_BAG_YIELD_CUFT.lb80 : CONCRETE_BAG_YIELD_CUFT.lb60,
    };
    return computeFooting(input);
  }, [type, sLenFt, sLenIn, sWidFt, sWidIn, sDepFt, sDepIn, pLenFt, pLenIn, pWidFt, pWidIn, pDepFt, pDepIn, pQty, diaFt, diaIn, piDepFt, piDepIn, piQty, waste, price, bagSize]);

  useFirstCalculate(
    SLUG,
    JSON.stringify({ type, sLenFt, sLenIn, sWidFt, sWidIn, sDepFt, sDepIn, pLenFt, pWidFt, pDepFt, pQty, diaFt, piDepFt, piQty, waste, price, bagSize })
  );

  const reset = () => {
    setType("strip");
    setSLenFt("40"); setSLenIn("0"); setSWidFt("1"); setSWidIn("4"); setSDepFt("0"); setSDepIn("8");
    setPLenFt("2"); setPLenIn("0"); setPWidFt("2"); setPWidIn("0"); setPDepFt("1"); setPDepIn("0"); setPQty("6");
    setDiaFt("1"); setDiaIn("0"); setPiDepFt("3"); setPiDepIn("0"); setPiQty("4");
    setWaste("10"); setPrice(String(PRICES.concretePerCuYd)); setBagSize("lb80");
  };

  const summary = `Footing concrete: ${fmtNumber(round(result.cubicYardsWithWaste, 2))} cu yd with ${waste}% waste (${fmtInt(result.bags)} bags of 80 lb, ${fmtUSD(result.cost)})., yardagemath.com/${SLUG}/`;
  const bagLabel = bagSize === "lb80" ? "80-lb bags" : "60-lb bags";

  return (
    <div>
      <div role="tablist" aria-label="Footing type" style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        {TABS.map((t) => {
          const active = type === t.value;
          return (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setType(t.value)}
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
            {type === "strip" && (
              <>
                <FeetInches idBase="slen" label="Length" feet={sLenFt} inches={sLenIn} onFeet={setSLenFt} onInches={setSLenIn} />
                <FeetInches idBase="swid" label="Width" feet={sWidFt} inches={sWidIn} onFeet={setSWidFt} onInches={setSWidIn} />
                <FeetInches idBase="sdep" label="Depth" feet={sDepFt} inches={sDepIn} onFeet={setSDepFt} onInches={setSDepIn} />
              </>
            )}
            {type === "pad" && (
              <>
                <FeetInches idBase="plen" label="Length" feet={pLenFt} inches={pLenIn} onFeet={setPLenFt} onInches={setPLenIn} />
                <FeetInches idBase="pwid" label="Width" feet={pWidFt} inches={pWidIn} onFeet={setPWidFt} onInches={setPWidIn} />
                <FeetInches idBase="pdep" label="Depth" feet={pDepFt} inches={pDepIn} onFeet={setPDepFt} onInches={setPDepIn} />
                <Field label="Number of pads" htmlFor="pqty">
                  <NumberInput id="pqty" value={pQty} onChange={setPQty} />
                </Field>
              </>
            )}
            {type === "pier" && (
              <>
                <FeetInches idBase="dia" label="Diameter" feet={diaFt} inches={diaIn} onFeet={setDiaFt} onInches={setDiaIn} />
                <FeetInches idBase="pidep" label="Depth" feet={piDepFt} inches={piDepIn} onFeet={setPiDepFt} onInches={setPiDepIn} />
                <Field label="Number of piers" htmlFor="piqty">
                  <NumberInput id="piqty" value={piQty} onChange={setPiQty} />
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

            <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
              Setting fence or deck posts?{" "}
              <Link href="/fence-post-concrete-calculator/" prefetch={false}>Use the Fence Post Concrete Calculator.</Link>{" "}
              It subtracts the post and counts bags per post.
            </p>

            <ShowMath>
              {type === "strip" && <MathLine>cu ft = L × W × D = {fmtNumber(round(result.cubicFeet, 2))}</MathLine>}
              {type === "pad" && <MathLine>cu ft = L × W × D × {pQty} = {fmtNumber(round(result.cubicFeet, 2))}</MathLine>}
              {type === "pier" && <MathLine>cu ft = 3.1416 × (d ÷ 2)² × D × {piQty} = {fmtNumber(round(result.cubicFeet, 2))}</MathLine>}
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
              getShareParams={() => ({ type, waste, price })}
              onReset={reset}
            />
          </div>
        }
      />
    </div>
  );
}