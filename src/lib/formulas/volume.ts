/**
 * Shared volume + area math (build-spec A6 "Shared formula").
 * Pure functions only — no React, no formatting.
 *
 *   areaSqFt(rectangle) = L_ft × W_ft
 *   areaSqFt(circle)    = π × (D_ft / 2)²
 *   areaSqFt(triangle)  = 0.5 × base_ft × height_ft
 *   volumeCuFt          = areaSqFt × (depth_in / 12)
 *   cubicYards          = volumeCuFt / 27
 *   cubicMeters         = cubicYards × 0.764555
 *   withWaste           = value × (1 + waste% / 100)
 *   tons                = cubicYards × densityTonsPerCuYd
 *   bags                = ceil(volumeCuFt / bagSizeCuFt)
 */
import { CUFT_PER_CUYD, cuYdToCuM } from "./units";

export type Shape = "rectangle" | "circle" | "triangle";

/** Area in square feet for the supported shapes. Dimensions in feet. */
export function areaSqFt(
  shape: Shape,
  dims: { length?: number; width?: number; diameter?: number; base?: number; height?: number }
): number {
  switch (shape) {
    case "rectangle":
      return (dims.length ?? 0) * (dims.width ?? 0);
    case "circle": {
      const r = (dims.diameter ?? 0) / 2;
      return Math.PI * r * r;
    }
    case "triangle":
      return 0.5 * (dims.base ?? 0) * (dims.height ?? 0);
  }
}

/** Volume in cubic feet from an area (sq ft) and a depth in inches. */
export function volumeCuFt(areaSquareFeet: number, depthInches: number): number {
  return areaSquareFeet * (depthInches / 12);
}

/** Cubic yards from cubic feet. */
export function cubicYards(cuft: number): number {
  return cuft / CUFT_PER_CUYD;
}

/** Cubic meters from cubic yards. */
export function cubicMeters(cuyd: number): number {
  return cuYdToCuM(cuyd);
}

/** Apply a waste / extra percentage. */
export function withWaste(value: number, wastePct: number): number {
  return value * (1 + wastePct / 100);
}

/** Weight in US tons from cubic yards and a density (tons per cubic yard). */
export function tons(cuyd: number, densityTonsPerCuYd: number): number {
  return cuyd * densityTonsPerCuYd;
}

/** Number of bags needed, rounded up, from a volume and bag size (both cu ft). */
export function bags(cuft: number, bagSizeCuFt: number): number {
  if (bagSizeCuFt <= 0) return 0;
  return Math.ceil(cuft / bagSizeCuFt);
}

/**
 * Full volume result bundle used by the yardage-style calculators.
 * `depthInches` is the material depth; waste is applied to the final quantities.
 */
export interface VolumeResult {
  areaSqFt: number;
  volumeCuFt: number;
  cubicYards: number;
  cubicMeters: number;
  volumeCuFtWithWaste: number;
  cubicYardsWithWaste: number;
}

export function computeVolume(
  areaSquareFeet: number,
  depthInches: number,
  wastePct: number
): VolumeResult {
  const vCuFt = volumeCuFt(areaSquareFeet, depthInches);
  const cuYd = cubicYards(vCuFt);
  const vCuFtWaste = withWaste(vCuFt, wastePct);
  const cuYdWaste = withWaste(cuYd, wastePct);
  return {
    areaSqFt: areaSquareFeet,
    volumeCuFt: vCuFt,
    cubicYards: cuYd,
    cubicMeters: cubicMeters(cuYd),
    volumeCuFtWithWaste: vCuFtWaste,
    cubicYardsWithWaste: cuYdWaste,
  };
}
