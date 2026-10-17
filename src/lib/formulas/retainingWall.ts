/** Retaining Wall Calculator formula (batch3 day3) — segmental block walls. */
import { cubicYards, tons as tonsFrom } from "./volume";
import { ceilCount } from "./units";

export interface RetainingSection {
  lengthFt: number;
  heightFt: number; // height above ground
}

export interface RetainingInput {
  sections: RetainingSection[];
  blockHeightIn: number;
  blockLengthIn: number;
  buriedCourses: number; // 0 or 1
  wastePct: number;
  caps: boolean;
  capLengthIn: number;
  padWidthIn: number; // 24
  padDepthIn: number; // 6
  drainWidthIn: number; // 12
  compactionPct: number; // 20 (base pad)
  padDensity: number; // crusher run 1.5
  drainDensity: number; // #57 1.4
  pricePerBlock: number;
  pricePerCap: number;
  gravelPricePerTon: number;
  pricePerPipeFt: number;
  installedPerSqFt: number;
}

export interface RetainingResult {
  blocks: number; // before waste
  blocksWithWaste: number;
  courses: number; // max across sections
  caps: number;
  padCuYd: number;
  padTons: number;
  drainCuYd: number;
  drainTons: number;
  pipeLinearFt: number;
  faceAreaSqFt: number; // above ground, for installed estimate
  materialCost: number;
  installedCost: number;
  maxHeightFt: number; // tallest section (above ground)
}

/** Blocks per square foot of wall face from the block face size: 144 / (H x L). */
export function blocksPerSqFt(heightIn: number, lengthIn: number): number {
  return heightIn > 0 && lengthIn > 0 ? 144 / (heightIn * lengthIn) : 0;
}

export function computeRetainingWall(input: RetainingInput): RetainingResult {
  const blockHtFt = input.blockHeightIn / 12;
  const blockLenFt = input.blockLengthIn / 12;
  const capLenFt = input.capLengthIn / 12;

  let totalBlocks = 0;
  let totalCaps = 0;
  let padCuFt = 0;
  let drainCuFt = 0;
  let totalLen = 0;
  let maxCourses = 0;
  let maxHeight = 0;
  let faceArea = 0;

  for (const s of input.sections) {
    const len = Math.max(0, s.lengthFt);
    const ht = Math.max(0, s.heightFt);
    if (len <= 0) continue;

    const perCourse = blockLenFt > 0 ? ceilCount(len / blockLenFt) : 0;
    const courses = (blockHtFt > 0 ? ceilCount(ht / blockHtFt) : 0) + input.buriedCourses;
    totalBlocks += perCourse * courses;
    if (input.caps) totalCaps += capLenFt > 0 ? ceilCount(len / capLenFt) : 0;

    padCuFt += len * (input.padWidthIn / 12) * (input.padDepthIn / 12) * (1 + input.compactionPct / 100);
    const totalHeightFt = courses * blockHtFt; // built height incl. buried course
    drainCuFt += len * (input.drainWidthIn / 12) * totalHeightFt;

    totalLen += len;
    maxCourses = Math.max(maxCourses, courses);
    maxHeight = Math.max(maxHeight, ht);
    faceArea += len * ht;
  }

  const blocksWithWaste = ceilCount(totalBlocks * (1 + input.wastePct / 100));
  const padCuYd = cubicYards(padCuFt);
  const padTons = tonsFrom(padCuYd, input.padDensity);
  const drainCuYd = cubicYards(drainCuFt);
  const drainTons = tonsFrom(drainCuYd, input.drainDensity);

  const materialCost =
    blocksWithWaste * input.pricePerBlock +
    totalCaps * input.pricePerCap +
    (padTons + drainTons) * input.gravelPricePerTon +
    totalLen * input.pricePerPipeFt;
  const installedCost = faceArea * input.installedPerSqFt;

  return {
    blocks: totalBlocks,
    blocksWithWaste,
    courses: maxCourses,
    caps: totalCaps,
    padCuYd,
    padTons,
    drainCuYd,
    drainTons,
    pipeLinearFt: totalLen,
    faceAreaSqFt: faceArea,
    materialCost,
    installedCost,
    maxHeightFt: maxHeight,
  };
}
