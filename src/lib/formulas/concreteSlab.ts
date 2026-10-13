/** Concrete Slab Cost Calculator formula (build-spec #3). */
import { CONCRETE_BAG_YIELD_CUFT } from "../constants";
import { areaSqFt, computeVolume } from "./volume";
import { ceilCount } from "./units";

export type BagSize = "lb80" | "lb60" | "lb40";
export type SupplyMode = "readymix" | "bags";

export interface ConcreteSlabInput {
  lengthFt: number;
  widthFt: number;
  thicknessIn: number;
  wastePct: number;
  supplyMode: SupplyMode;
  bagSize: BagSize;
  pricePerCuYd: number;
  pricePerBag: number;
  laborPerSqFt: number;
  rebarPerSqFt: number;
  gravelBaseDepthIn: number;
}

export interface ConcreteSlabResult {
  areaSqFt: number;
  cubicYards: number;
  cubicYardsWithWaste: number;
  cubicFeetWithWaste: number;
  bags: number;
  gravelBaseCuYd: number;
  materialCost: number;
  laborCost: number;
  rebarCost: number;
  totalCost: number;
  costPerSqFt: number;
}

/**
 * Concrete material cost per square foot at a given thickness:
 *   thickness (in) ÷ 12 ÷ 27 × price per cubic yard, times (1 + waste%).
 */
export function concreteCostPerSqFt(thicknessIn: number, pricePerCuYd: number, wastePct = 0): number {
  return (thicknessIn / 12 / 27) * pricePerCuYd * (1 + wastePct / 100);
}

export function computeConcreteSlab(input: ConcreteSlabInput): ConcreteSlabResult {
  const area = areaSqFt("rectangle", {
    length: input.lengthFt,
    width: input.widthFt,
  });
  const v = computeVolume(area, input.thicknessIn, input.wastePct);

  const yield_ = CONCRETE_BAG_YIELD_CUFT[input.bagSize];
  const bagCount = ceilCount(v.volumeCuFtWithWaste / yield_);

  const gravelBaseVol = computeVolume(area, input.gravelBaseDepthIn, 0);

  const materialCost =
    input.supplyMode === "readymix"
      ? v.cubicYardsWithWaste * input.pricePerCuYd
      : bagCount * input.pricePerBag;
  const laborCost = input.laborPerSqFt * area;
  const rebarCost = input.rebarPerSqFt * area;
  const totalCost = materialCost + laborCost + rebarCost;

  return {
    areaSqFt: area,
    cubicYards: v.cubicYards,
    cubicYardsWithWaste: v.cubicYardsWithWaste,
    cubicFeetWithWaste: v.volumeCuFtWithWaste,
    bags: bagCount,
    gravelBaseCuYd: gravelBaseVol.cubicYards,
    materialCost,
    laborCost,
    rebarCost,
    totalCost,
    costPerSqFt: area > 0 ? totalCost / area : 0,
  };
}
