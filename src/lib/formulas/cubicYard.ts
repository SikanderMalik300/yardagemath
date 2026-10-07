/** Cubic Yard Calculator formula (build-spec #1). */
import { DENSITY_TONS_PER_CUYD, type MaterialKey, BAG_SIZE_CUFT } from "../constants";
import { areaSqFt, computeVolume, tons, bags, type Shape } from "./volume";

export type CubicYardMaterial = "none" | MaterialKey;

export interface CubicYardInput {
  shape: Shape;
  length: number; // ft
  width: number; // ft
  diameter: number; // ft
  base: number; // ft
  height: number; // ft
  depthIn: number; // inches
  wastePct: number;
  material: CubicYardMaterial;
}

export interface CubicYardResult {
  areaSqFt: number;
  volumeCuFt: number;
  cubicYards: number;
  cubicMeters: number;
  cubicYardsWithWaste: number;
  volumeCuFtWithWaste: number;
  tons: number | null;
  bagsMulch: number;
  bagsGravel: number;
  bagsSoil: number;
}

export function computeCubicYard(input: CubicYardInput): CubicYardResult {
  const area = areaSqFt(input.shape, input);
  const v = computeVolume(area, input.depthIn, input.wastePct);

  const density =
    input.material === "none" ? null : DENSITY_TONS_PER_CUYD[input.material];
  const tonnage = density === null ? null : tons(v.cubicYardsWithWaste, density);

  return {
    areaSqFt: v.areaSqFt,
    volumeCuFt: v.volumeCuFt,
    cubicYards: v.cubicYards,
    cubicMeters: v.cubicMeters,
    cubicYardsWithWaste: v.cubicYardsWithWaste,
    volumeCuFtWithWaste: v.volumeCuFtWithWaste,
    tons: tonnage,
    bagsMulch: bags(v.volumeCuFtWithWaste, BAG_SIZE_CUFT.mulch),
    bagsGravel: bags(v.volumeCuFtWithWaste, BAG_SIZE_CUFT.gravel),
    bagsSoil: bags(v.volumeCuFtWithWaste, BAG_SIZE_CUFT.soil),
  };
}
