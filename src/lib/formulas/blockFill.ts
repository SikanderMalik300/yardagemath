/** Cinder Block Fill Calculator formula (day4-5 spec, Day 5). */
import { GROUT_CUFT_PER_SQFT, BLOCKS_PER_SQFT } from "../constants";
import { CUFT_PER_CUYD, ceilCount } from "./units";

export type BlockFillWidth = "in6" | "in8" | "in12";
export type FillPattern = "all" | "everyOther" | "rebar";

/** A standard block has 2 cores over its 16 in length, so one core every 8 in. */
export const CORE_PITCH_IN = 16 / 2;

export interface BlockFillInput {
  mode: "blocks" | "wall";
  blocks: number;
  wallLengthFt: number;
  wallHeightFt: number;
  width: BlockFillWidth;
  pattern: FillPattern;
  rebarSpacingIn: number; // only used when pattern = "rebar"
  wastePct: number;
  bagYieldCuFt: number;
}

export interface BlockFillResult {
  blocks: number; // total blocks (from the count or the wall)
  fillFraction: number; // 1, 0.5, or cores filled / total cores
  cubicFeet: number;
  cubicYards: number;
  bags: number;
  blocksPerBag: number; // whole blocks one bag fills at this fill pattern
}

/** Fraction of cores filled for the chosen pattern. */
export function fillFraction(pattern: FillPattern, rebarSpacingIn: number): number {
  if (pattern === "all") return 1;
  if (pattern === "everyOther") return 0.5;
  // rebar cores only: one filled core every `spacing` in, one core every 8 in
  if (rebarSpacingIn <= 0) return 0;
  return Math.min(1, CORE_PITCH_IN / rebarSpacingIn);
}

export function computeBlockFill(input: BlockFillInput): BlockFillResult {
  const areaSqFt =
    input.mode === "blocks"
      ? Math.max(0, input.blocks) / BLOCKS_PER_SQFT
      : Math.max(0, input.wallLengthFt) * Math.max(0, input.wallHeightFt);
  const blocks = input.mode === "blocks" ? Math.max(0, input.blocks) : areaSqFt * BLOCKS_PER_SQFT;

  const groutPerSqFt = GROUT_CUFT_PER_SQFT[input.width];
  const ff = fillFraction(input.pattern, input.rebarSpacingIn);

  const cubicFeet = areaSqFt * groutPerSqFt * ff;
  const cubicYards = cubicFeet / CUFT_PER_CUYD;
  const bags =
    input.bagYieldCuFt > 0 ? ceilCount((cubicFeet * (1 + input.wastePct / 100)) / input.bagYieldCuFt) : 0;

  const perBlockFilled = (groutPerSqFt / BLOCKS_PER_SQFT) * ff;
  const blocksPerBag = perBlockFilled > 0 ? input.bagYieldCuFt / perBlockFilled : 0;

  return { blocks, fillFraction: ff, cubicFeet, cubicYards, bags, blocksPerBag };
}
