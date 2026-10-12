/** Mulch Calculator formula (batch2 day1). Reuses the shared area + yard math. */
import { areaSqFt, volumeCuFt, cubicYards, withWaste, bags as bagsNeeded, type Shape } from "./volume";

export type BedShape = Shape | "area";

export interface MulchBed {
  shape: BedShape;
  lengthFt?: number;
  widthFt?: number;
  diameterFt?: number;
  baseFt?: number;
  heightFt?: number;
  directSqFt?: number;
}

export interface MulchInput {
  beds: MulchBed[];
  depthIn: number;
  wastePct: number;
  bagSizeCuFt: number;
  pricePerCuYd: number;
  pricePerBag: number;
}

export interface MulchResult {
  areaSqFt: number;
  cubicFeet: number;
  cubicYards: number;
  cubicFeetWithWaste: number;
  cubicYardsWithWaste: number;
  bags: number;
  coveragePerYard: number; // sq ft covered by 1 cu yd at this depth
  bulkCost: number;
  baggedCost: number;
  cheaper: "bulk" | "bagged" | "equal";
}

/** Area of one bed, in square feet. */
export function bedArea(bed: MulchBed): number {
  if (bed.shape === "area") return Math.max(0, bed.directSqFt ?? 0);
  return areaSqFt(bed.shape, {
    length: bed.lengthFt,
    width: bed.widthFt,
    diameter: bed.diameterFt,
    base: bed.baseFt,
    height: bed.heightFt,
  });
}

/** Square feet one cubic yard covers at the given depth: 324 / depth. */
export function coveragePerYard(depthIn: number): number {
  return depthIn > 0 ? 324 / depthIn : 0;
}

export function computeMulch(input: MulchInput): MulchResult {
  const area = input.beds.reduce((sum, b) => sum + bedArea(b), 0);
  const cuft = volumeCuFt(area, input.depthIn);
  const cuftWaste = withWaste(cuft, input.wastePct);
  const cuyd = cubicYards(cuft);
  const cuydWaste = withWaste(cuyd, input.wastePct);
  const bags = bagsNeeded(cuftWaste, input.bagSizeCuFt);
  const bulkCost = cuydWaste * input.pricePerCuYd;
  const baggedCost = bags * input.pricePerBag;
  const cheaper = bulkCost < baggedCost ? "bulk" : bulkCost > baggedCost ? "bagged" : "equal";
  return {
    areaSqFt: area,
    cubicFeet: cuft,
    cubicYards: cuyd,
    cubicFeetWithWaste: cuftWaste,
    cubicYardsWithWaste: cuydWaste,
    bags,
    coveragePerYard: coveragePerYard(input.depthIn),
    bulkCost,
    baggedCost,
    cheaper,
  };
}