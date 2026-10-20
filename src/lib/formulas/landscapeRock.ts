/** Landscape Rock Calculator formula (batch3 day5). Reuses the shared area + yard math. */
import { areaSqFt, volumeCuFt, cubicYards, withWaste, tons as tonsFrom, bags as bagsNeeded, type Shape } from "./volume";
import { LANDSCAPE_ROCK_DENSITY, PRICES } from "../constants";

export type RockShape = Shape | "area";

/**
 * Decorative rock types, each with a density in tons per cubic yard and a
 * default bulk price per ton. River rock reuses the shared constant (1.35).
 */
export const ROCK_TYPES = {
  riverRock: { label: "River rock", density: LANDSCAPE_ROCK_DENSITY.riverRock, pricePerTon: PRICES.rockRiverPerTon },
  lavaRock: { label: "Lava rock", density: LANDSCAPE_ROCK_DENSITY.lavaRock, pricePerTon: PRICES.rockLavaPerTon },
  beachPebbles: { label: "Mexican beach pebbles", density: LANDSCAPE_ROCK_DENSITY.beachPebbles, pricePerTon: PRICES.rockPebblesPerTon },
  marbleChips: { label: "White marble chips", density: LANDSCAPE_ROCK_DENSITY.marbleChips, pricePerTon: PRICES.rockMarblePerTon },
  custom: { label: "Custom (lb per cu yd)", density: LANDSCAPE_ROCK_DENSITY.riverRock, pricePerTon: PRICES.rockRiverPerTon },
} as const;

export type RockTypeKey = keyof typeof ROCK_TYPES;

/** A cut-out (plants or pavers) subtracted from an area. */
export interface RockCutout {
  shape: "rectangle" | "circle" | "area";
  lengthFt?: number;
  widthFt?: number;
  diameterFt?: number;
  directSqFt?: number;
}

export interface RockArea {
  shape: RockShape;
  lengthFt?: number;
  widthFt?: number;
  diameterFt?: number;
  baseFt?: number;
  heightFt?: number;
  directSqFt?: number;
  cutouts?: RockCutout[];
}

export interface RockInput {
  areas: RockArea[];
  depthIn: number;
  wastePct: number;
  bagSizeCuFt: number;
  /** Density in tons per cubic yard (the component resolves the type, incl. a custom lb/yd entry). */
  densityTonsPerCuYd: number;
  pricePerTon: number;
  pricePerBag: number;
}

export interface RockResult {
  areaSqFt: number; // net of cut-outs
  cubicFeet: number;
  cubicYards: number;
  cubicFeetWithWaste: number;
  cubicYardsWithWaste: number;
  tons: number;
  tonsWithWaste: number;
  bags: number; // before waste
  bagsWithWaste: number;
  coveragePerTon: number; // sq ft one ton covers at this depth
  bulkCost: number;
  baggedCost: number;
  cheaper: "bulk" | "bagged" | "equal";
}

/** Area of one cut-out, in square feet. */
export function cutoutArea(c: RockCutout): number {
  if (c.shape === "area") return Math.max(0, c.directSqFt ?? 0);
  if (c.shape === "circle") {
    const r = (c.diameterFt ?? 0) / 2;
    return Math.max(0, Math.PI * r * r);
  }
  return Math.max(0, (c.lengthFt ?? 0) * (c.widthFt ?? 0));
}

/** Net area of one entry (gross shape minus its cut-outs), in square feet, floored at 0. */
export function rockArea(a: RockArea): number {
  const gross =
    a.shape === "area"
      ? Math.max(0, a.directSqFt ?? 0)
      : areaSqFt(a.shape, {
          length: a.lengthFt,
          width: a.widthFt,
          diameter: a.diameterFt,
          base: a.baseFt,
          height: a.heightFt,
        });
  const cut = (a.cutouts ?? []).reduce((s, c) => s + cutoutArea(c), 0);
  return Math.max(0, gross - cut);
}

/** Square feet one ton covers at the given depth: (27 / density) / (depth / 12). */
export function coveragePerTon(depthIn: number, densityTonsPerCuYd: number): number {
  if (depthIn <= 0 || densityTonsPerCuYd <= 0) return 0;
  return (27 / densityTonsPerCuYd) / (depthIn / 12);
}

export function computeRock(input: RockInput): RockResult {
  const area = input.areas.reduce((sum, a) => sum + rockArea(a), 0);
  const cuft = volumeCuFt(area, input.depthIn);
  const cuftWaste = withWaste(cuft, input.wastePct);
  const cuyd = cubicYards(cuft);
  const cuydWaste = withWaste(cuyd, input.wastePct);
  const t = tonsFrom(cuyd, input.densityTonsPerCuYd);
  const tWaste = tonsFrom(cuydWaste, input.densityTonsPerCuYd);
  const bags = bagsNeeded(cuft, input.bagSizeCuFt);
  const bagsWithWaste = bagsNeeded(cuftWaste, input.bagSizeCuFt);
  const bulkCost = tWaste * input.pricePerTon;
  const baggedCost = bagsWithWaste * input.pricePerBag;
  const cheaper = bulkCost === baggedCost ? "equal" : bulkCost < baggedCost ? "bulk" : "bagged";
  return {
    areaSqFt: area,
    cubicFeet: cuft,
    cubicYards: cuyd,
    cubicFeetWithWaste: cuftWaste,
    cubicYardsWithWaste: cuydWaste,
    tons: t,
    tonsWithWaste: tWaste,
    bags,
    bagsWithWaste,
    coveragePerTon: coveragePerTon(input.depthIn, input.densityTonsPerCuYd),
    bulkCost,
    baggedCost,
    cheaper,
  };
}
