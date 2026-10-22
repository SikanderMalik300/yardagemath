/** Fence Post Concrete Calculator formula (batch4 day2). */
import { ceilCount, cuFtToCuYd } from "./units";
import { CONCRETE_BAG_YIELD_CUFT, FAST_SET_50_YIELD_CUFT, BAG_SIZE_CUFT, PRICES } from "../constants";

const PI = 3.1416;

/** Post presets: actual sizes (inches) and a default hole diameter. */
export const FENCE_POSTS = {
  wood4x4: { label: "4 x 4 wood (3.5 x 3.5)", round: false, widthIn: 3.5, lengthIn: 3.5, diameterIn: 0, holeIn: 10 },
  wood4x6: { label: "4 x 6 wood (3.5 x 5.5)", round: false, widthIn: 3.5, lengthIn: 5.5, diameterIn: 0, holeIn: 12 },
  wood6x6: { label: "6 x 6 wood (5.5 x 5.5)", round: false, widthIn: 5.5, lengthIn: 5.5, diameterIn: 0, holeIn: 16 },
  metalRound: { label: "Round metal post", round: true, widthIn: 0, lengthIn: 0, diameterIn: 2.375, holeIn: 8 },
  custom: { label: "Custom", round: false, widthIn: 3.5, lengthIn: 3.5, diameterIn: 0, holeIn: 10 },
} as const;
export type FencePostKey = keyof typeof FENCE_POSTS;

/** Bag types with a yield in cubic feet and a default price per bag. */
export const FENCE_BAG_TYPES = {
  fastSet50: { label: "Fast-setting 50 lb", yieldCuFt: FAST_SET_50_YIELD_CUFT, price: PRICES.concreteBagFastSet50 },
  lb80: { label: "80 lb", yieldCuFt: CONCRETE_BAG_YIELD_CUFT.lb80, price: PRICES.concreteBag80 },
  lb60: { label: "60 lb", yieldCuFt: CONCRETE_BAG_YIELD_CUFT.lb60, price: PRICES.concreteBag60 },
  lb40: { label: "40 lb", yieldCuFt: CONCRETE_BAG_YIELD_CUFT.lb40, price: PRICES.concreteBag40 },
} as const;
export type FenceBagKey = keyof typeof FENCE_BAG_TYPES;

export const GRAVEL_BAG_CUFT = BAG_SIZE_CUFT.gravel; // 0.5

export interface FencePostInput {
  round: boolean;
  postWidthIn: number; // square/rectangle width (W)
  postLengthIn: number; // square/rectangle length (L)
  postDiameterIn: number; // round post diameter
  holeDiameterIn: number;
  holeDepthIn: number;
  gravelIn: number;
  posts: number;
  wastePct: number;
  bagYieldCuFt: number;
  pricePerBag: number;
  gravelPricePerBag: number;
}

export interface FencePostResult {
  concreteDepthIn: number;
  perPostCuFt: number;
  totalCuFt: number;
  totalCuFtWithWaste: number;
  totalCuYd: number;
  bagsPerPost: number; // before waste
  totalBags: number; // with waste, rounded up
  gravelCuFt: number;
  gravelBags: number;
  cost: number;
}

/** Cross-section area of the post in square inches. */
export function postAreaSqIn(input: Pick<FencePostInput, "round" | "postWidthIn" | "postLengthIn" | "postDiameterIn">): number {
  if (input.round) {
    const r = Math.max(0, input.postDiameterIn) / 2;
    return PI * r * r;
  }
  return Math.max(0, input.postWidthIn) * Math.max(0, input.postLengthIn);
}

export function computeFencePost(input: FencePostInput): FencePostResult {
  const concreteDepth = Math.max(0, input.holeDepthIn - input.gravelIn);
  const holeR = Math.max(0, input.holeDiameterIn) / 2;
  const holeCuIn = PI * holeR * holeR * concreteDepth;
  const postCuIn = postAreaSqIn(input) * concreteDepth;
  const perPostCuFt = Math.max(0, (holeCuIn - postCuIn) / 1728);
  const posts = Math.max(0, input.posts);
  const totalCuFt = perPostCuFt * posts;
  const totalCuFtWithWaste = totalCuFt * (1 + input.wastePct / 100);
  const bagsPerPost = input.bagYieldCuFt > 0 ? perPostCuFt / input.bagYieldCuFt : 0;
  const totalBags = input.bagYieldCuFt > 0 ? ceilCount(totalCuFtWithWaste / input.bagYieldCuFt) : 0;
  const gravelCuFt = (PI * holeR * holeR * Math.max(0, input.gravelIn) / 1728) * posts;
  const gravelBags = GRAVEL_BAG_CUFT > 0 ? ceilCount(gravelCuFt / GRAVEL_BAG_CUFT) : 0;
  const cost = totalBags * input.pricePerBag + gravelBags * input.gravelPricePerBag;
  return {
    concreteDepthIn: concreteDepth,
    perPostCuFt,
    totalCuFt,
    totalCuFtWithWaste,
    totalCuYd: cuFtToCuYd(totalCuFt),
    bagsPerPost,
    totalBags,
    gravelCuFt,
    gravelBags,
    cost,
  };
}

/** Hole helper: suggested depth (in) from the post height above ground, using the
 *  one-third rule plus the gravel base. */
export function suggestedDepthIn(heightAboveGroundIn: number, gravelIn: number): number {
  return Math.max(0, heightAboveGroundIn) / 3 + Math.max(0, gravelIn);
}
