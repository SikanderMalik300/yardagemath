import { describe, it, expect } from "vitest";
import { ceilCount } from "@/lib/formulas/units";
import { BRICK_PER_SQFT, BRICKS_PER_MORTAR_BAG_80 } from "@/lib/constants";
import { computeBrick, customBricksPerSqFt, type BrickInput } from "@/lib/formulas/brick";

/**
 * Brick Calculator — known-answer tests (batch2 day5).
 * Every worked example, reference-table value and FAQ number is asserted here.
 * Modular brick 6.75 per sq ft; 37 bricks per 80-lb mortar bag.
 */

const Z: BrickInput = {
  useSqFt: false, lengthFt: 0, heightFt: 0, directSqFt: 0, openings: [],
  perSqFt: BRICK_PER_SQFT.modular, wythes: 1, wastePct: 0,
  bricksPerBag: BRICKS_PER_MORTAR_BAG_80, pricePerBrick: 0.7, pricePerBag: 7.5,
};
const wall = (L: number, H: number, over: Partial<BrickInput> = {}) =>
  computeBrick({ ...Z, lengthFt: L, heightFt: H, ...over });
const sqft = (a: number, over: Partial<BrickInput> = {}) =>
  computeBrick({ ...Z, useSqFt: true, directSqFt: a, ...over });

describe("brick — known answers", () => {
  it("constants: modular 6.75, queen 5.76, king 4.80, utility 3.00 per sq ft; 37 bricks per bag", () => {
    expect(BRICK_PER_SQFT.modular).toBe(6.75);
    expect(BRICK_PER_SQFT.queen).toBe(5.76);
    expect(BRICK_PER_SQFT.king).toBe(4.8);
    expect(BRICK_PER_SQFT.utility).toBe(3.0);
    expect(BRICKS_PER_MORTAR_BAG_80).toBe(37);
  });

  it("constant test: 144 / (8 x 2.667) = 6.75 bricks per sq ft for modular", () => {
    expect(Math.round((144 / (8 * 2.667)) * 100) / 100).toBe(6.75);
  });

  it("example 1: 20 x 4 ft = 80 sq ft -> 540 bricks; 567 at 5%, 594 at 10%", () => {
    expect(wall(20, 4).bricks).toBe(540); // 80 * 6.75
    expect(wall(20, 4, { wastePct: 5 }).bricksWithWaste).toBe(567);
    expect(wall(20, 4, { wastePct: 10 }).bricksWithWaste).toBe(594);
    expect(wall(20, 4).netAreaSqFt).toBe(80);
  });

  it("example 2: 10 x 3 ft = 30 sq ft -> 202.5 -> 203 bricks; 213 at 5%", () => {
    expect(wall(10, 3).bricks).toBe(203); // ceil(202.5)
    expect(wall(10, 3, { wastePct: 5 }).bricksWithWaste).toBe(213); // ceil(212.625)
  });

  it("example 3: 12 x 8 minus a 3 x 7 door = 75 sq ft -> 507 bricks; 532 at 5%", () => {
    const r = wall(12, 8, { openings: [{ widthFt: 3, heightFt: 7 }] });
    expect(r.netAreaSqFt).toBe(75); // 96 - 21
    expect(r.bricks).toBe(507); // ceil(506.25)
    expect(wall(12, 8, { openings: [{ widthFt: 3, heightFt: 7 }], wastePct: 5 }).bricksWithWaste).toBe(532);
  });

  it("example 4: 100 sq ft -> 675 modular, 480 king, 300 utility", () => {
    expect(sqft(100).bricks).toBe(675);
    expect(sqft(100, { perSqFt: BRICK_PER_SQFT.king }).bricks).toBe(480);
    expect(sqft(100, { perSqFt: BRICK_PER_SQFT.utility }).bricks).toBe(300);
  });

  it("mortar: 567 bricks need ceil(567 / 37) = 16 bags", () => {
    expect(ceilCount(567 / 37)).toBe(16);
    expect(wall(20, 4, { wastePct: 5 }).bags).toBe(16);
  });

  it("reference table: bricks before waste for modular / king / utility", () => {
    // [sqft, modular, king, utility]
    const rows: [number, number, number, number][] = [
      [50, 338, 240, 150],
      [100, 675, 480, 300],
      [250, 1688, 1200, 750],
      [500, 3375, 2400, 1500],
    ];
    for (const [a, mod, king, util] of rows) {
      expect(sqft(a).bricks, `${a} modular`).toBe(mod); // ceil(a*6.75)
      expect(sqft(a, { perSqFt: BRICK_PER_SQFT.king }).bricks, `${a} king`).toBe(king);
      expect(sqft(a, { perSqFt: BRICK_PER_SQFT.utility }).bricks, `${a} utility`).toBe(util);
    }
  });

  it("custom bricks per sq ft: modular actual 7.625 x 2.25 with 3/8 joint", () => {
    expect(Math.round(customBricksPerSqFt(7.625, 2.25) * 1000) / 1000).toBe(6.857);
    // king actual 9.625 x 2.625 -> 4.8
    expect(Math.round(customBricksPerSqFt(9.625, 2.625) * 100) / 100).toBe(4.8);
  });

  it("double wythe doubles the bricks", () => {
    expect(wall(20, 4, { wythes: 2 }).bricks).toBe(1080); // 540 * 2
  });

  it("openings larger than the wall clamp to zero", () => {
    const r = wall(5, 5, { openings: [{ widthFt: 10, heightFt: 10 }] });
    expect(r.netAreaSqFt).toBe(0);
    expect(r.bricks).toBe(0);
    expect(r.bags).toBe(0);
  });

  it("brick, mortar and total cost for the default 20x4 wall at 5% waste", () => {
    const r = wall(20, 4, { wastePct: 5 });
    expect(r.brickCost).toBeCloseTo(567 * 0.7, 2); // 396.90
    expect(r.mortarCost).toBeCloseTo(16 * 7.5, 2); // 120
    expect(r.totalCost).toBeCloseTo(567 * 0.7 + 16 * 7.5, 2);
  });

  it("zero / empty input is safe", () => {
    const r = computeBrick({ ...Z });
    expect(r.bricks).toBe(0);
    expect(r.bags).toBe(0);
    expect(Number.isFinite(r.totalCost)).toBe(true);
  });
});
