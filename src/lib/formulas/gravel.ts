/** Gravel Calculator formula (batch2 day2). Reuses the shared area + yard math. */
import { areaSqFt, volumeCuFt, cubicYards, withWaste, tons as tonsFrom, bags as bagsNeeded, type Shape } from "./volume";
import { DENSITY_TONS_PER_CUYD } from "../constants";

export type GravelShape = Shape | "area";

/** Gravel types the calculator offers, with a density in tons per cubic yard. */
export const GRAVEL_TYPES = {
  crushedStone: { label: "Crushed stone (#57)", density: DENSITY_TONS_PER_CUYD.crushedStone },
  peaGravel: { label: "Pea gravel", density: DENSITY_TONS_PER_CUYD.gravel },
  riverRock: { label: "River rock", density: DENSITY_TONS_PER_CUYD.riverRock },
  crusherRun: { label: "Crusher run / road base", density: DENSITY_TONS_PER_CUYD.crusherRun },
  custom: { label: "Custom (lb per cu yd)", density: DENSITY_TONS_PER_CUYD.crushedStone },
} as const;

export type GravelTypeKey = keyof typeof GRAVEL_TYPES;

export interface GravelArea {
  shape: GravelShape;
  lengthFt?: number;
  widthFt?: number;
  diameterFt?: number;
  baseFt?: number;
  heightFt?: number;
  directSqFt?: number;
}

export interface GravelInput {
  areas: GravelArea[];
  depthIn: number;
  wastePct: number;
  bagSizeCuFt: number;
  /** Density in tons per cubic yard (the component resolves the type, incl. a custom lb/yd entry). */
  densityTonsPerCuYd: number;
  pricePerTon: number;
  deliveryFee: number;
}

export interface GravelResult {
  areaSqFt: number;
  cubicFeet: number;
  cubicYards: number;
  cubicFeetWithWaste: number;
  cubicYardsWithWaste: number;
  tons: number;
  tonsWithWaste: number;
  bags: number;
  cost: number;
  coveragePerTon: number; // sq ft one ton covers at this depth
  coveragePerYard: number; // sq ft one cubic yard covers at this depth
}

/** Area of one entry, in square feet. */
export function gravelArea(a: GravelArea): number {
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

export function computeGravel(input: GravelInput): GravelResult {
  const area = input.areas.reduce((sum, a) => sum + gravelArea(a), 0);
  const cuft = volumeCuFt(area, input.depthIn);
  const cuftWaste = withWaste(cuft, input.wastePct);
  const cuyd = cubicYards(cuft);
  const cuydWaste = withWaste(cuyd, input.wastePct);
  const t = tonsFrom(cuyd, input.densityTonsPerCuYd);
  const tWaste = tonsFrom(cuydWaste, input.densityTonsPerCuYd);
  const bags = bagsNeeded(cuftWaste, input.bagSizeCuFt);
  const cost = tWaste * input.pricePerTon + input.deliveryFee;
  return {
    areaSqFt: area,
    cubicFeet: cuft,
    cubicYards: cuyd,
    cubicFeetWithWaste: cuftWaste,
    cubicYardsWithWaste: cuydWaste,
    tons: t,
    tonsWithWaste: tWaste,
    bags,
    cost,
    coveragePerTon: coveragePerTon(input.depthIn, input.densityTonsPerCuYd),
    coveragePerYard: coveragePerYard(input.depthIn),
  };
}
