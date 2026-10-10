/** Concrete Block Weight Calculator formula (next-5 spec, page 14). */
import { CMU_WEIGHTS, type CmuWeightKey } from "../constants";
import { floorCount } from "./units";

export type WeightClass = "normal" | "light";

export interface BlockWeightInput {
  block: CmuWeightKey;
  weightClass: WeightClass;
  quantity: number;
  blocksPerPallet: number;
  payloadLb: number;
}

export interface BlockWeightResult {
  unitLb: number; // weight of one block, lb
  totalLb: number; // weight of all blocks, lb
  tons: number; // total weight in US short tons
  palletLb: number; // weight of one full pallet, lb
  blocksPerTrip: number; // whole blocks that fit under the payload limit
}

/** Weight of one block, lb. Solid blocks have no lightweight option. */
export function unitWeightLb(block: CmuWeightKey, weightClass: WeightClass): number {
  const row = CMU_WEIGHTS[block];
  if (weightClass === "light" && row.light != null) return row.light;
  return row.normal;
}

export function computeBlockWeight(input: BlockWeightInput): BlockWeightResult {
  const unitLb = unitWeightLb(input.block, input.weightClass);
  const quantity = Math.max(0, input.quantity);
  const totalLb = unitLb * quantity;
  const tons = totalLb / 2000;
  const palletLb = unitLb * Math.max(0, input.blocksPerPallet);
  const blocksPerTrip = unitLb > 0 ? floorCount(input.payloadLb / unitLb) : 0;
  return { unitLb, totalLb, tons, palletLb, blocksPerTrip };
}
