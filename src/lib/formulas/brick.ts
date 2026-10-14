/** Brick Calculator formula (batch2 day5). Reuses shared area math + ceilCount. */
import { areaSqFt } from "./volume";
import { ceilCount } from "./units";
import { BRICK_PER_SQFT, BRICK_JOINT_IN } from "../constants";

export type BrickTypeKey = keyof typeof BRICK_PER_SQFT | "custom";

export interface BrickOpening {
  widthFt: number;
  heightFt: number;
}

export interface BrickInput {
  /** Wall size; when useSqFt is true, directSqFt is used instead of length x height. */
  useSqFt: boolean;
  lengthFt: number;
  heightFt: number;
  directSqFt: number;
  openings: BrickOpening[];
  /** Bricks per square foot (component resolves preset vs custom). */
  perSqFt: number;
  wythes: number; // 1 (single) or 2 (double)
  wastePct: number;
  bricksPerBag: number;
  pricePerBrick: number;
  pricePerBag: number;
}

export interface BrickResult {
  grossAreaSqFt: number;
  openingsAreaSqFt: number;
  netAreaSqFt: number;
  bricks: number; // before waste, rounded up
  bricksWithWaste: number;
  bags: number;
  brickCost: number;
  mortarCost: number;
  totalCost: number;
}

/** Bricks per sq ft for a custom unit: 144 / ((length + joint) x (height + joint)). */
export function customBricksPerSqFt(lengthIn: number, heightIn: number, jointIn = BRICK_JOINT_IN): number {
  const l = lengthIn + jointIn;
  const h = heightIn + jointIn;
  if (l <= 0 || h <= 0) return 0;
  return 144 / (l * h);
}

export function computeBrick(input: BrickInput): BrickResult {
  const gross = input.useSqFt
    ? Math.max(0, input.directSqFt)
    : areaSqFt("rectangle", { length: input.lengthFt, width: input.heightFt });
  const openingsArea = input.openings.reduce((s, o) => s + Math.max(0, o.widthFt) * Math.max(0, o.heightFt), 0);
  const net = Math.max(0, gross - openingsArea);

  const base = net * input.perSqFt * Math.max(1, input.wythes);
  const bricks = ceilCount(base);
  const bricksWithWaste = ceilCount(base * (1 + input.wastePct / 100));
  const bags = input.bricksPerBag > 0 ? ceilCount(bricksWithWaste / input.bricksPerBag) : 0;
  const brickCost = bricksWithWaste * input.pricePerBrick;
  const mortarCost = bags * input.pricePerBag;

  return {
    grossAreaSqFt: gross,
    openingsAreaSqFt: openingsArea,
    netAreaSqFt: net,
    bricks,
    bricksWithWaste,
    bags,
    brickCost,
    mortarCost,
    totalCost: brickCost + mortarCost,
  };
}
