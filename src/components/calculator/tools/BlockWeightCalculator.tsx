"use client";

import { useMemo, useState } from "react";
import {
  computeBlockWeight,
  type BlockWeightInput,
  type WeightClass,
} from "@/lib/formulas/blockWeight";
import { num } from "@/lib/analytics";
import { round } from "@/lib/formulas/units";
import {
  CMU_WEIGHTS,
  type CmuWeightKey,
  BLOCKS_PER_PALLET_DEFAULT,
  PICKUP_PAYLOAD_LB_DEFAULT,
} from "@/lib/constants";
import { fmtInt, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, NumberInput, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "concrete-block-weight";

const BLOCK_OPTIONS = (Object.keys(CMU_WEIGHTS) as CmuWeightKey[]).map((k) => ({
  value: k,
  label: CMU_WEIGHTS[k].label,
}));

export function BlockWeightCalculator() {
  const [block, setBlock] = useState<CmuWeightKey>("8x8x16");
  const [weightClass, setWeightClass] = useState<WeightClass>("normal");
  const [quantity, setQuantity] = useState("142");
  const [blocksPerPallet, setBlocksPerPallet] = useState(String(BLOCKS_PER_PALLET_DEFAULT));
  const [payload, setPayload] = useState(String(PICKUP_PAYLOAD_LB_DEFAULT));

  const hasLight = CMU_WEIGHTS[block].light != null;

  const result = useMemo(() => {
    const input: BlockWeightInput = {
      block,
      weightClass: hasLight ? weightClass : "normal",
      quantity: num(quantity),
      blocksPerPallet: num(blocksPerPallet),
      payloadLb: num(payload),
    };
    return computeBlockWeight(input);
  }, [block, weightClass, hasLight, quantity, blocksPerPallet, payload]);

  useFirstCalculate(
    SLUG,
    JSON.stringify({ block, weightClass, quantity, blocksPerPallet, payload })
  );

  const reset = () => {
    setBlock("8x8x16");
    setWeightClass("normal");
    setQuantity("142");
    setBlocksPerPallet(String(BLOCKS_PER_PALLET_DEFAULT));
    setPayload(String(PICKUP_PAYLOAD_LB_DEFAULT));
  };

  const summary = `${fmtInt(num(quantity))} × ${CMU_WEIGHTS[block].label} block (${hasLight ? weightClass : "normal"}): ${fmtInt(result.totalLb)} lb (${fmtNumber(round(result.tons, 2))} tons), about ${fmtInt(result.blocksPerTrip)} per trip. — yardagemath.com/${SLUG}/`;

  return (
    <CalculatorShell
      left={
        <div>
          <GroupLabel>Block</GroupLabel>
          <Field label="Block size (nominal)" htmlFor="block">
            <Select
              id="block"
              value={block}
              onChange={(v) => setBlock(v as CmuWeightKey)}
              options={BLOCK_OPTIONS}
            />
          </Field>
          <Field label="Weight class" htmlFor="class" hint={hasLight ? undefined : "Solid blocks are made normal-weight only."}>
            <Select
              id="class"
              value={hasLight ? weightClass : "normal"}
              onChange={(v) => setWeightClass(v as WeightClass)}
              options={[
                { value: "normal", label: "Normal weight" },
                { value: "light", label: "Lightweight" },
              ]}
            />
          </Field>
          <Field label="Number of blocks" htmlFor="qty">
            <NumberInput id="qty" value={quantity} onChange={setQuantity} />
          </Field>

          <FormGroupDivider />
          <GroupLabel>Pallet &amp; truck (optional)</GroupLabel>
          <Field label="Blocks per pallet" htmlFor="pallet">
            <NumberInput id="pallet" value={blocksPerPallet} onChange={setBlocksPerPallet} />
          </Field>
          <Field label="Truck payload" htmlFor="payload" hint="Half-ton pickup is about 1,500 lb.">
            <NumberInput id="payload" value={payload} onChange={setPayload} suffix="lb" />
          </Field>
        </div>
      }
      right={
        <div>
          <PrimaryResult
            label="Total weight"
            value={fmtInt(result.totalLb)}
            unit="lb"
            sub={`${fmtNumber(round(result.tons, 2))} tons · ${fmtInt(result.unitLb)} lb per block`}
          />
          <SecondaryResults>
            <SecondaryItem label="Weight in tons" value={`${fmtNumber(round(result.tons, 2))} tons`} />
            <SecondaryItem label="Pallet weight" value={`${fmtInt(result.palletLb)} lb`} />
            <SecondaryItem label="Blocks per trip" value={fmtInt(result.blocksPerTrip)} />
            <SecondaryItem label="Weight per block" value={`${fmtInt(result.unitLb)} lb`} />
          </SecondaryResults>

          <ShowMath>
            <MathLine>
              total = {fmtInt(num(quantity))} × {fmtInt(result.unitLb)} = {fmtInt(result.totalLb)} lb
            </MathLine>
            <MathLine>
              tons = {fmtInt(result.totalLb)} ÷ 2,000 = {fmtNumber(round(result.tons, 2))}
            </MathLine>
            <MathLine>
              pallet = {fmtInt(num(blocksPerPallet))} × {fmtInt(result.unitLb)} = {fmtInt(result.palletLb)} lb
            </MathLine>
            <MathLine>
              per trip = floor({fmtInt(num(payload))} ÷ {fmtInt(result.unitLb)}) = {fmtInt(result.blocksPerTrip)}
            </MathLine>
          </ShowMath>

          <ResultActions
            slug={SLUG}
            getSummary={() => summary}
            getShareParams={() => ({ block, weightClass: hasLight ? weightClass : "normal", quantity })}
            onReset={reset}
          />
        </div>
      }
    />
  );
}
