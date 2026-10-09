/** Concrete Block Calculator formula (build-spec #2). */
import {
  BLOCKS_PER_SQFT,
  BLOCKS_PER_MORTAR_BAG,
  BLOCK_NOMINAL_HEIGHT_IN,
  BLOCK_NOMINAL_LENGTH_IN,
} from "../constants";
import { ceilCount } from "./units";

export interface Opening {
  count: number;
  widthFt: number;
  heightFt: number;
}

export interface ConcreteBlockInput {
  wallLengthFt: number;
  wallHeightFt: number;
  openings: Opening[];
  wastePct: number;
  pricePerBlock: number | null;
}

export interface ConcreteBlockResult {
  grossAreaSqFt: number;
  openingsAreaSqFt: number;
  netAreaSqFt: number;
  courses: number;
  blocksPerCourse: number;
  blocksBeforeWaste: number;
  blocks: number; // with waste, rounded up
  mortarBags: number;
  totalCost: number | null;
}

export function computeConcreteBlock(input: ConcreteBlockInput): ConcreteBlockResult {
  const grossArea = input.wallLengthFt * input.wallHeightFt;
  const openingsArea = input.openings.reduce(
    (sum, o) => sum + o.count * o.widthFt * o.heightFt,
    0
  );
  const netArea = Math.max(0, grossArea - openingsArea);

  const lengthIn = input.wallLengthFt * 12;
  const heightIn = input.wallHeightFt * 12;
  const courses = ceilCount(heightIn / BLOCK_NOMINAL_HEIGHT_IN);
  const blocksPerCourse = ceilCount(lengthIn / BLOCK_NOMINAL_LENGTH_IN);

  const blocksBeforeWaste = netArea * BLOCKS_PER_SQFT;
  const blocks = ceilCount(blocksBeforeWaste * (1 + input.wastePct / 100));
  const mortarBags = ceilCount(blocks / BLOCKS_PER_MORTAR_BAG);

  const totalCost =
    input.pricePerBlock === null ? null : blocks * input.pricePerBlock;

  return {
    grossAreaSqFt: grossArea,
    openingsAreaSqFt: openingsArea,
    netAreaSqFt: netArea,
    courses,
    blocksPerCourse,
    blocksBeforeWaste,
    blocks,
    mortarBags,
    totalCost,
  };
}
