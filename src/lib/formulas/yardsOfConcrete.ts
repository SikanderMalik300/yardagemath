/** Yards of Concrete Calculator formula (next-5 spec, page 13). */
import { CUFT_PER_CUYD } from "./units";

export type ConcreteShape = "slab" | "strip" | "column";

export interface YardsOfConcreteInput {
  shape: ConcreteShape;
  // slab: L x W (ft) x thickness (in)
  lengthFt: number;
  widthFt: number;
  thicknessIn: number;
  // wall / footing strip: L x W x D (all ft)
  stripLengthFt: number;
  stripWidthFt: number;
  stripDepthFt: number;
  // round column / tube: diameter x height (ft), quantity
  diameterFt: number;
  heightFt: number;
  quantity: number;
  wastePct: number;
  pricePerCuYd: number;
  /** cu ft of mixed concrete per bag: 80 lb = 0.60, 60 lb = 0.45. */
  bagYieldCuFt: number;
}

export interface YardsOfConcreteResult {
  cubicFeet: number;
  cubicYards: number;
  cubicYardsWithWaste: number;
  bags: number;
  cost: number;
}

/** Cubic feet of concrete for the chosen shape. */
export function concreteCubicFeet(input: YardsOfConcreteInput): number {
  switch (input.shape) {
    case "slab":
      return input.lengthFt * input.widthFt * (input.thicknessIn / 12);
    case "strip":
      return input.stripLengthFt * input.stripWidthFt * input.stripDepthFt;
    case "column": {
      const r = input.diameterFt / 2;
      return Math.PI * r * r * input.heightFt * input.quantity;
    }
  }
}

export function computeYardsOfConcrete(input: YardsOfConcreteInput): YardsOfConcreteResult {
  const cuft = concreteCubicFeet(input);
  const factor = 1 + input.wastePct / 100;
  const cuftWithWaste = cuft * factor;
  const cubicYards = cuft / CUFT_PER_CUYD;
  const cubicYardsWithWaste = cubicYards * factor;
  const bags = input.bagYieldCuFt > 0 ? Math.ceil(cuftWithWaste / input.bagYieldCuFt) : 0;
  const cost = cubicYardsWithWaste * input.pricePerCuYd;
  return { cubicFeet: cuft, cubicYards, cubicYardsWithWaste, bags, cost };
}
