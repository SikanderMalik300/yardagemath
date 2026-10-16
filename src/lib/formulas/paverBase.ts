/** Paver Base Calculator formula (batch3 day2). Reuses shared area/volume math + ceilCount. */
import { areaSqFt, volumeCuFt, cubicYards, withWaste, tons as tonsFrom, bags as bagsNeeded, type Shape } from "./volume";
import { DENSITY_TONS_PER_CUYD } from "../constants";

export type PaverBaseShape = Shape | "area";

export interface PaverBaseArea {
  shape: PaverBaseShape;
  lengthFt?: number;
  widthFt?: number;
  diameterFt?: number;
  baseFt?: number;
  heightFt?: number;
  directSqFt?: number;
}

export interface PaverBaseInput {
  areas: PaverBaseArea[];
  baseDepthIn: number;
  compactionPct: number; // order this much extra loose stone (20)
  baseDensity: number; // tons per cu yd (crusher run 1.5 / #57 1.4 / custom)
  sandDepthIn: number; // 1
  sandWastePct: number; // 10
  sandDensity: number; // dry sand 1.35
  bagCuFt: number; // 0.5
  basePricePerTon: number;
  basePricePerBag: number;
  sandPricePerBag: number;
}

export interface PaverBaseResult {
  areaSqFt: number;
  baseCuFtLoose: number;
  baseCuYd: number;
  baseTons: number;
  baseBags: number;
  sandCuYd: number;
  sandTons: number;
  sandBags: number;
  bulkCost: number;
  baggedCost: number;
  cheaper: "bulk" | "bagged" | "equal";
}

/** Area of one entry, in square feet. */
export function paverBaseArea(a: PaverBaseArea): number {
  if (a.shape === "area") return Math.max(0, a.directSqFt ?? 0);
  return areaSqFt(a.shape, {
    length: a.lengthFt,
    width: a.widthFt,
    diameter: a.diameterFt,
    base: a.baseFt,
    height: a.heightFt,
  });
}

export function computePaverBase(input: PaverBaseInput): PaverBaseResult {
  const area = input.areas.reduce((s, a) => s + paverBaseArea(a), 0);

  const compactedCuFt = volumeCuFt(area, input.baseDepthIn);
  const looseCuFt = withWaste(compactedCuFt, input.compactionPct);
  const baseCuYd = cubicYards(looseCuFt);
  const baseTons = tonsFrom(baseCuYd, input.baseDensity);
  const baseBags = bagsNeeded(looseCuFt, input.bagCuFt);

  const sandCuFt = volumeCuFt(area, input.sandDepthIn);
  const sandCuYd = cubicYards(sandCuFt);
  const sandTons = tonsFrom(sandCuYd, input.sandDensity);
  const sandBags = bagsNeeded(withWaste(sandCuFt, input.sandWastePct), input.bagCuFt);

  const sandCost = sandBags * input.sandPricePerBag;
  const bulkCost = baseTons * input.basePricePerTon + sandCost;
  const baggedCost = baseBags * input.basePricePerBag + sandCost;
  const cheaper = bulkCost < baggedCost ? "bulk" : bulkCost > baggedCost ? "bagged" : "equal";

  return {
    areaSqFt: area,
    baseCuFtLoose: looseCuFt,
    baseCuYd,
    baseTons,
    baseBags,
    sandCuYd,
    sandTons,
    sandBags,
    bulkCost,
    baggedCost,
    cheaper,
  };
}

/** Convenience density lookups for the component. */
export const PAVER_BASE_DENSITIES = {
  crusherRun: DENSITY_TONS_PER_CUYD.crusherRun, // 1.5
  crushedStone: DENSITY_TONS_PER_CUYD.crushedStone, // 1.4
} as const;
