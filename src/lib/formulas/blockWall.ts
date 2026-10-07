/** Block Wall Calculator formula (build-spec #9). Full wall cost estimator. */
import {
  BLOCKS_PER_SQFT,
  BLOCKS_PER_MORTAR_BAG,
  BLOCK_NOMINAL_HEIGHT_IN,
  BLOCK_NOMINAL_LENGTH_IN,
  GROUT_CUFT_PER_SQFT,
} from "../constants";
import type { Opening } from "./concreteBlock";
import { CUFT_PER_CUYD } from "./units";

export type BlockWidth = "in6" | "in8" | "in12";
export type CoreFill = "none" | "everyOther" | "full";
export type RebarSpacing = 16 | 24 | 32 | 48;

export interface BlockWallInput {
  lengthFt: number;
  heightFt: number;
  blockWidth: BlockWidth;
  openings: Opening[];
  capBlocks: boolean;
  coreFill: CoreFill;
  rebarSpacingIn: RebarSpacing;
  prices: {
    block: number;
    cap: number;
    mortarBag: number;
    groutPerCuYd: number;
    rebar20ftBar: number;
  };
}

export interface BlockWallResult {
  courses: number;
  blocksPerCourse: number;
  netAreaSqFt: number;
  blocks: number;
  capBlocks: number;
  mortarBags: number;
  groutCuYd: number;
  rebarBars: number;
  cost: {
    block: number;
    cap: number;
    mortar: number;
    grout: number;
    rebar: number;
    total: number;
  };
}

const WASTE = 5; // default waste % for block walls (build-spec example)

export function computeBlockWall(input: BlockWallInput): BlockWallResult {
  const lengthIn = input.lengthFt * 12;
  const heightIn = input.heightFt * 12;
  const courses = Math.ceil(heightIn / BLOCK_NOMINAL_HEIGHT_IN);
  const blocksPerCourse = Math.ceil(lengthIn / BLOCK_NOMINAL_LENGTH_IN);

  const grossArea = input.lengthFt * input.heightFt;
  const openingsArea = input.openings.reduce(
    (sum, o) => sum + o.count * o.widthFt * o.heightFt,
    0
  );
  const netArea = Math.max(0, grossArea - openingsArea);

  const blocks = Math.ceil(netArea * BLOCKS_PER_SQFT * (1 + WASTE / 100));
  const capBlocks = input.capBlocks ? Math.ceil(lengthIn / BLOCK_NOMINAL_LENGTH_IN) : 0;
  const mortarBags = Math.ceil(blocks / BLOCKS_PER_MORTAR_BAG);

  // Grout (core fill): cu ft per sq ft of wall × fill fraction.
  const fillFraction = input.coreFill === "full" ? 1 : input.coreFill === "everyOther" ? 0.5 : 0;
  const groutCuFt = netArea * GROUT_CUFT_PER_SQFT[input.blockWidth] * fillFraction;
  const groutCuYd = groutCuFt / CUFT_PER_CUYD;

  // Vertical rebar bars: one per spacing across the length, + 1, each bar = height + lap.
  const rebarBars =
    input.coreFill === "none" ? 0 : Math.ceil(lengthIn / input.rebarSpacingIn) + 1;

  const costBlock = blocks * input.prices.block;
  const costCap = capBlocks * input.prices.cap;
  const costMortar = mortarBags * input.prices.mortarBag;
  const costGrout = groutCuYd * input.prices.groutPerCuYd;
  const costRebar = rebarBars * input.prices.rebar20ftBar;
  const total = costBlock + costCap + costMortar + costGrout + costRebar;

  return {
    courses,
    blocksPerCourse,
    netAreaSqFt: netArea,
    blocks,
    capBlocks,
    mortarBags,
    groutCuYd,
    rebarBars,
    cost: {
      block: costBlock,
      cap: costCap,
      mortar: costMortar,
      grout: costGrout,
      rebar: costRebar,
      total,
    },
  };
}
