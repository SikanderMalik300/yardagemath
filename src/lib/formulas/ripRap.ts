/** Rip Rap Calculator formula (build-spec #12). */
import { areaSqFt, computeVolume, tons } from "./volume";

export interface RipRapInput {
  lengthFt: number;
  widthFt: number;
  thicknessIn: number;
  densityTonsPerCuYd: number;
  wastePct: number;
  pricePerTon: number | null;
}

export interface RipRapResult {
  areaSqFt: number;
  cubicYards: number;
  cubicYardsWithWaste: number;
  tons: number;
  cost: number | null;
}

export function computeRipRap(input: RipRapInput): RipRapResult {
  const area = areaSqFt("rectangle", {
    length: input.lengthFt,
    width: input.widthFt,
  });
  const v = computeVolume(area, input.thicknessIn, input.wastePct);
  const tonnage = tons(v.cubicYardsWithWaste, input.densityTonsPerCuYd);
  return {
    areaSqFt: area,
    cubicYards: v.cubicYards,
    cubicYardsWithWaste: v.cubicYardsWithWaste,
    tons: tonnage,
    cost: input.pricePerTon === null ? null : tonnage * input.pricePerTon,
  };
}
