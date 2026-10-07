/** Topsoil Calculator formula (build-spec #4). */
import { DENSITY_TONS_PER_CUYD } from "../constants";
import { areaSqFt, computeVolume, tons, bags, type Shape } from "./volume";

export interface TopsoilInput {
  shape: Shape;
  length: number;
  width: number;
  diameter: number;
  base: number;
  height: number;
  depthIn: number;
  wastePct: number;
  bagSizeCuFt: number; // 0.75 or 1.0
}

export interface TopsoilResult {
  areaSqFt: number;
  cubicYards: number;
  cubicYardsWithWaste: number;
  cubicFeetWithWaste: number;
  cubicMeters: number;
  tons: number;
  bags: number;
}

export function computeTopsoil(input: TopsoilInput): TopsoilResult {
  const area = areaSqFt(input.shape, input);
  const v = computeVolume(area, input.depthIn, input.wastePct);
  return {
    areaSqFt: area,
    cubicYards: v.cubicYards,
    cubicYardsWithWaste: v.cubicYardsWithWaste,
    cubicFeetWithWaste: v.volumeCuFtWithWaste,
    cubicMeters: v.cubicMeters,
    tons: tons(v.cubicYardsWithWaste, DENSITY_TONS_PER_CUYD.topsoil),
    bags: bags(v.volumeCuFtWithWaste, input.bagSizeCuFt),
  };
}
