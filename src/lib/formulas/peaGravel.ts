/** Pea Gravel Calculator formula (build-spec #5). */
import { DENSITY_TONS_PER_CUYD, BAG_SIZE_CUFT } from "../constants";
import { areaSqFt, computeVolume, tons, bags, type Shape } from "./volume";

export interface PeaGravelInput {
  shape: Shape;
  length: number;
  width: number;
  diameter: number;
  base: number;
  height: number;
  depthIn: number;
  wastePct: number;
  pricePerTon: number | null;
  pricePerCuYd: number | null;
}

export interface PeaGravelResult {
  areaSqFt: number;
  cubicYards: number;
  cubicYardsWithWaste: number;
  cubicFeetWithWaste: number;
  tons: number;
  bags: number; // 0.5 cu ft bags
  cost: number | null;
}

export function computePeaGravel(input: PeaGravelInput): PeaGravelResult {
  const area = areaSqFt(input.shape, input);
  const v = computeVolume(area, input.depthIn, input.wastePct);
  const tonnage = tons(v.cubicYardsWithWaste, DENSITY_TONS_PER_CUYD.gravel);

  let cost: number | null = null;
  if (input.pricePerTon !== null) cost = tonnage * input.pricePerTon;
  else if (input.pricePerCuYd !== null) cost = v.cubicYardsWithWaste * input.pricePerCuYd;

  return {
    areaSqFt: area,
    cubicYards: v.cubicYards,
    cubicYardsWithWaste: v.cubicYardsWithWaste,
    cubicFeetWithWaste: v.volumeCuFtWithWaste,
    tons: tonnage,
    bags: bags(v.volumeCuFtWithWaste, BAG_SIZE_CUFT.gravel),
    cost,
  };
}
