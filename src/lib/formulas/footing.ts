/** Concrete Footing Calculator formula (day4-5 spec, Day 4). */
import { concreteCubicFeet } from "./yardsOfConcrete";
import { CUFT_PER_CUYD, ceilCount } from "./units";

export type FootingType = "strip" | "pad" | "pier";

export interface FootingInput {
  type: FootingType;
  // strip: L x W x D ; pad: L x W x D x qty (all feet)
  lengthFt: number;
  widthFt: number;
  depthFt: number;
  // pier: diameter x depth x qty
  diameterFt: number;
  quantity: number;
  wastePct: number;
  pricePerCuYd: number;
  /** cu ft of mixed concrete per bag: 80 lb = 0.60, 60 lb = 0.45. */
  bagYieldCuFt: number;
}

export interface FootingResult {
  cubicFeet: number;
  cubicYards: number;
  cubicYardsWithWaste: number;
  bags: number;
  cost: number;
}

/** Zeroed base so we can reuse the shared geometry from yards of concrete. */
const BASE = {
  lengthFt: 0,
  widthFt: 0,
  thicknessIn: 0,
  stripLengthFt: 0,
  stripWidthFt: 0,
  stripDepthFt: 0,
  diameterFt: 0,
  heightFt: 0,
  quantity: 0,
  wastePct: 0,
  pricePerCuYd: 0,
  bagYieldCuFt: 0,
} as const;

/** Cubic feet of concrete for the chosen footing type (reuses strip + column). */
export function footingCubicFeet(input: FootingInput): number {
  switch (input.type) {
    case "strip":
      // continuous strip footing: L x W x D
      return concreteCubicFeet({
        ...BASE,
        shape: "strip",
        stripLengthFt: input.lengthFt,
        stripWidthFt: input.widthFt,
        stripDepthFt: input.depthFt,
      });
    case "pad":
      // square/rectangular pad footings: L x W x D, times quantity
      return (
        concreteCubicFeet({
          ...BASE,
          shape: "strip",
          stripLengthFt: input.lengthFt,
          stripWidthFt: input.widthFt,
          stripDepthFt: input.depthFt,
        }) * Math.max(0, input.quantity)
      );
    case "pier":
      // round pier footings: pi x (d/2)^2 x D x qty  (column geometry)
      return concreteCubicFeet({
        ...BASE,
        shape: "column",
        diameterFt: input.diameterFt,
        heightFt: input.depthFt,
        quantity: input.quantity,
      });
  }
}

export function computeFooting(input: FootingInput): FootingResult {
  const cuft = footingCubicFeet(input);
  const factor = 1 + input.wastePct / 100;
  const cubicYards = cuft / CUFT_PER_CUYD;
  const bags = input.bagYieldCuFt > 0 ? ceilCount((cuft * factor) / input.bagYieldCuFt) : 0;
  return {
    cubicFeet: cuft,
    cubicYards,
    cubicYardsWithWaste: cubicYards * factor,
    bags,
    cost: cubicYards * factor * input.pricePerCuYd,
  };
}