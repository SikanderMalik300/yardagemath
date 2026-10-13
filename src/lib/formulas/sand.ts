/** Sand Calculator formula (batch2 day3). Reuses the shared area + yard math. */
import { areaSqFt, volumeCuFt, cubicYards, withWaste, tons as tonsFrom, bags as bagsNeeded, type Shape } from "./volume";
import { DENSITY_TONS_PER_CUYD } from "../constants";

export type SandShape = Shape | "area";

/** Sand types the calculator offers, with a density in tons per cubic yard. */
export const SAND_TYPES = {
  // Dry play, mason or concrete sand reuses the shared sand density (1.35 t/yd).
  dry: { label: "Dry sand (play, mason or concrete)", density: DENSITY_TONS_PER_CUYD.sand },
  // Damp sand holds water in the gaps and weighs about 1.5 t/yd or more.
  damp: { label: "Damp sand", density: 1.5 },
  custom: { label: "Custom (lb per cu yd)", density: DENSITY_TONS_PER_CUYD.sand },
} as const;

export type SandTypeKey = keyof typeof SAND_TYPES;

export interface SandArea {
  shape: SandShape;
  lengthFt?: number;
  widthFt?: number;
  diameterFt?: number;
  baseFt?: number;
  heightFt?: number;
  directSqFt?: number;
}

export interface SandInput {
  areas: SandArea[];
  depthIn: number;
  wastePct: number;
  bagSizeCuFt: number;
  /** Density in tons per cubic yard (the component resolves the type, incl. a custom lb/yd entry). */
  densityTonsPerCuYd: number;
  pricePerTon: number;
  pricePerBag: number;
}

export interface SandResult {
  areaSqFt: number;
  cubicFeet: number;
  cubicYards: number;
  cubicFeetWithWaste: number;
  cubicYardsWithWaste: number;
  tons: number;
  tonsWithWaste: number;
  bags: number;
  bulkCost: number;
  baggedCost: number;
  cheaper: "bulk" | "bagged" | "equal";
  coveragePerTon: number; // sq ft one ton covers at this depth
  coveragePerYard: number; // sq ft one cubic yard covers at this depth
}

/** Area of one entry, in square feet. */
export function sandArea(a: SandArea): number {
  if (a.shape === "area") return Math.max(0, a.directSqFt ?? 0);
  return areaSqFt(a.shape, {
    length: a.lengthFt,
    width: a.widthFt,
    diameter: a.diameterFt,
    base: a.baseFt,
    height: a.heightFt,
  });
}

/** Square feet one ton covers at the given depth: (27 / density) / (depth / 12). */
export function coveragePerTon(depthIn: number, densityTonsPerCuYd: number): number {
  if (depthIn <= 0 || densityTonsPerCuYd <= 0) return 0;
  return (27 / densityTonsPerCuYd) / (depthIn / 12);
}

/** Square feet one cubic yard covers at the given depth: 324 / depth. */
export function coveragePerYard(depthIn: number): number {
  return depthIn > 0 ? 324 / depthIn : 0;
}

export function computeSand(input: SandInput): SandResult {
  const area = input.areas.reduce((sum, a) => sum + sandArea(a), 0);
  const cuft = volumeCuFt(area, input.depthIn);
  const cuftWaste = withWaste(cuft, input.wastePct);
  const cuyd = cubicYards(cuft);
  const cuydWaste = withWaste(cuyd, input.wastePct);
  const t = tonsFrom(cuyd, input.densityTonsPerCuYd);
  const tWaste = tonsFrom(cuydWaste, input.densityTonsPerCuYd);
  const bags = bagsNeeded(cuftWaste, input.bagSizeCuFt);
  const bulkCost = tWaste * input.pricePerTon;
  const baggedCost = bags * input.pricePerBag;
  const cheaper = bulkCost < baggedCost ? "bulk" : bulkCost > baggedCost ? "bagged" : "equal";
  return {
    areaSqFt: area,
    cubicFeet: cuft,
    cubicYards: cuyd,
    cubicFeetWithWaste: cuftWaste,
    cubicYardsWithWaste: cuydWaste,
    tons: t,
    tonsWithWaste: tWaste,
    bags,
    bulkCost,
    baggedCost,
    cheaper,
    coveragePerTon: coveragePerTon(input.depthIn, input.densityTonsPerCuYd),
    coveragePerYard: coveragePerYard(input.depthIn),
  };
}
