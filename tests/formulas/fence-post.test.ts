import { describe, it, expect } from "vitest";
import { round } from "@/lib/formulas/units";
import {
  computeFencePost,
  suggestedDepthIn,
  postAreaSqIn,
  FENCE_BAG_TYPES,
  type FencePostInput,
} from "@/lib/formulas/fencePost";

/**
 * Fence Post Concrete Calculator — known-answer tests (batch4 day2).
 * 10% waste. Fast-setting 50 lb = 0.375 cu ft, 80 lb = 0.60 cu ft.
 * Every worked example, reference-table value and FAQ number is asserted here.
 */

const FAST = FENCE_BAG_TYPES.fastSet50.yieldCuFt; // 0.375
const LB80 = FENCE_BAG_TYPES.lb80.yieldCuFt; // 0.60

const base: FencePostInput = {
  round: false,
  postWidthIn: 3.5,
  postLengthIn: 3.5,
  postDiameterIn: 0,
  holeDiameterIn: 10,
  holeDepthIn: 30,
  gravelIn: 6,
  posts: 1,
  wastePct: 10,
  bagYieldCuFt: FAST,
  pricePerBag: 8,
  gravelPricePerBag: 6,
};
const run = (over: Partial<FencePostInput> = {}) => computeFencePost({ ...base, ...over });

describe("fence post concrete — known answers", () => {
  it("bag yields: fast-setting 50 lb = 0.375, 80 lb = 0.60 cu ft", () => {
    expect(FAST).toBe(0.375);
    expect(LB80).toBe(0.6);
  });

  it("example 1: one 4x4 post, 10 in hole, 30 in deep, 6 in gravel = 24 in concrete, 0.92 cu ft", () => {
    const r = run();
    expect(r.concreteDepthIn).toBe(24);
    expect(round(r.perPostCuFt, 2)).toBe(0.92);
    expect(round(r.bagsPerPost, 2)).toBe(2.46); // 0.9206 / 0.375
    expect(r.totalBags).toBe(3); // ceil(0.9206 x 1.1 / 0.375)
    expect(run({ bagYieldCuFt: LB80 }).bagsPerPost).toBeCloseTo(1.53, 2);
    expect(run({ bagYieldCuFt: LB80 }).totalBags).toBe(2);
    expect(round(r.gravelCuFt, 2)).toBe(0.27);
    expect(r.gravelBags).toBe(1);
  });

  it("example 2: 10 of those posts = 9.21 cu ft (0.34 cu yd), 10.13 with waste, 28 fast-set / 17 of 80 lb, 6 gravel bags", () => {
    const r = run({ posts: 10 });
    expect(round(r.totalCuFt, 2)).toBe(9.21);
    expect(round(r.totalCuYd, 2)).toBe(0.34);
    expect(round(r.totalCuFtWithWaste, 2)).toBe(10.13);
    expect(r.totalBags).toBe(28); // ceil(10.127 / 0.375)
    expect(run({ posts: 10, bagYieldCuFt: LB80 }).totalBags).toBe(17); // ceil(10.127 / 0.6)
    expect(round(r.gravelCuFt, 2)).toBe(2.73);
    expect(r.gravelBags).toBe(6); // ceil(2.727 / 0.5)
  });

  it("example 3: 4 posts, 6x6, 16 in hole, 36 in deep, 6 in gravel = 2.97 cu ft per post, 11.86 total, 35 fast-set / 22 of 80 lb", () => {
    const o = { postWidthIn: 5.5, postLengthIn: 5.5, holeDiameterIn: 16, holeDepthIn: 36, posts: 4 };
    const r = run(o);
    expect(round(r.perPostCuFt, 2)).toBe(2.97);
    expect(round(r.totalCuFt, 2)).toBe(11.86);
    expect(r.totalBags).toBe(35);
    expect(run({ ...o, bagYieldCuFt: LB80 }).totalBags).toBe(22);
  });

  it("example 4: 20 round metal posts, 2.375 in, 8 in hole, 30 in deep, 6 in gravel = 0.64 cu ft per post, 12.73 total, 38 fast-set / 24 of 80 lb", () => {
    const o = { round: true, postDiameterIn: 2.375, holeDiameterIn: 8, holeDepthIn: 30, posts: 20 };
    const r = run(o);
    expect(round(r.perPostCuFt, 2)).toBe(0.64);
    expect(round(r.totalCuFt, 2)).toBe(12.73);
    expect(r.totalBags).toBe(38);
    expect(run({ ...o, bagYieldCuFt: LB80 }).totalBags).toBe(24);
  });

  it("example 5: hole helper, 6 ft fence (72 in above ground) = 72 / 3 + 6 = 30 in", () => {
    expect(suggestedDepthIn(72, 6)).toBe(30);
  });

  it("reference table: concrete per post (before waste), fast-set and 80 lb bags per post", () => {
    // [W, hole, depth, cuft, fastBags(1dp), lb80Bags(1dp)]
    const rows: [number, number, number, number, number, number][] = [
      [3.5, 8, 24, 0.53, 1.4, 0.9],
      [3.5, 10, 24, 0.92, 2.5, 1.5],
      [3.5, 12, 24, 1.4, 3.7, 2.3],
      [5.5, 12, 30, 1.44, 3.8, 2.4],
      [5.5, 16, 30, 2.97, 7.9, 4.9],
    ];
    for (const [w, hole, depth, cuft, fast, lb80] of rows) {
      const r = run({ postWidthIn: w, postLengthIn: w, holeDiameterIn: hole, holeDepthIn: depth, gravelIn: 0 });
      expect(round(r.perPostCuFt, 2), `${w}@${hole}/${depth} cuft`).toBe(cuft);
      expect(round(r.perPostCuFt / FAST, 1), `${w}@${hole} fast`).toBe(fast);
      expect(round(r.perPostCuFt / LB80, 1), `${w}@${hole} 80lb`).toBe(lb80);
    }
  });

  it("FAQ: 17 of 80 lb bags for 10 posts (4x4, 10 in, 24 in concrete, 10% extra)", () => {
    expect(run({ posts: 10, bagYieldCuFt: LB80 }).totalBags).toBe(17);
  });

  it("concrete depth subtracts gravel, and gravel 0 keeps full depth", () => {
    expect(run({ holeDepthIn: 30, gravelIn: 6 }).concreteDepthIn).toBe(24);
    expect(run({ holeDepthIn: 30, gravelIn: 0 }).concreteDepthIn).toBe(30);
    expect(run({ gravelIn: 0 }).gravelBags).toBe(0);
  });

  it("post cross-section: square vs round", () => {
    expect(postAreaSqIn({ round: false, postWidthIn: 3.5, postLengthIn: 3.5, postDiameterIn: 0 })).toBeCloseTo(12.25, 2);
    expect(postAreaSqIn({ round: true, postWidthIn: 0, postLengthIn: 0, postDiameterIn: 2.375 })).toBeCloseTo(4.4302, 3);
  });

  it("cost = total bags x price per bag + gravel bags x gravel price", () => {
    const r = run({ posts: 10 });
    expect(r.cost).toBe(r.totalBags * 8 + r.gravelBags * 6);
    expect(r.cost).toBe(28 * 8 + 6 * 6);
  });

  it("zero / empty input is safe", () => {
    const r = run({ posts: 0 });
    expect(r.totalCuFt).toBe(0);
    expect(r.totalBags).toBe(0);
    expect(r.gravelBags).toBe(0);
  });

  it("a bigger hole needs more concrete per post", () => {
    expect(run({ holeDiameterIn: 12 }).perPostCuFt).toBeGreaterThan(run({ holeDiameterIn: 10 }).perPostCuFt);
  });
});
