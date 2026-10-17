import { describe, it, expect } from "vitest";
import { round } from "@/lib/formulas/units";
import { DENSITY_TONS_PER_CUYD, RETAINING_BLOCKS } from "@/lib/constants";
import { computeRetainingWall, blocksPerSqFt, type RetainingInput } from "@/lib/formulas/retainingWall";

/**
 * Retaining Wall Calculator — known-answer tests (batch3 day3).
 * Every worked example, reference-table value and FAQ number is asserted here.
 */

const Z: RetainingInput = {
  sections: [], blockHeightIn: 6, blockLengthIn: 16, buriedCourses: 1, wastePct: 0,
  caps: true, capLengthIn: 16, padWidthIn: 24, padDepthIn: 6, drainWidthIn: 12, compactionPct: 20,
  padDensity: DENSITY_TONS_PER_CUYD.crusherRun, drainDensity: DENSITY_TONS_PER_CUYD.crushedStone, // 1.5 / 1.4
  pricePerBlock: 4, pricePerCap: 4, gravelPricePerTon: 45, pricePerPipeFt: 1.5, installedPerSqFt: 25,
};
const wall = (lengthFt: number, heightFt: number, over: Partial<RetainingInput> = {}) =>
  computeRetainingWall({ ...Z, sections: [{ lengthFt, heightFt }], ...over });

const blk = (k: keyof typeof RETAINING_BLOCKS) => ({ blockHeightIn: RETAINING_BLOCKS[k].heightIn, blockLengthIn: RETAINING_BLOCKS[k].lengthIn, capLengthIn: RETAINING_BLOCKS[k].lengthIn });

describe("retaining wall — known answers", () => {
  it("constant: 6x16 face = 96 sq in -> 1.5 blocks per sq ft; 3 for 4x12; 1 for 8x18", () => {
    expect(blocksPerSqFt(6, 16)).toBe(1.5);
    expect(blocksPerSqFt(4, 12)).toBe(3);
    expect(blocksPerSqFt(8, 18)).toBe(1);
  });

  it("example 1: 20 ft x 2 ft, 6x16, buried on = 75 blocks (79 at 5%), 15 caps, pad 1.33 t, drainage 2.59 t, 20 ft pipe", () => {
    const r = wall(20, 2);
    expect(r.blocks).toBe(75); // 15 per course x 5 courses
    expect(r.courses).toBe(5);
    expect(wall(20, 2, { wastePct: 5 }).blocksWithWaste).toBe(79);
    expect(r.caps).toBe(15);
    expect(round(r.padCuYd, 2)).toBe(0.89);
    expect(round(r.padTons, 2)).toBe(1.33);
    expect(round(r.drainCuYd, 2)).toBe(1.85);
    expect(round(r.drainTons, 2)).toBe(2.59);
    expect(r.pipeLinearFt).toBe(20);
  });

  it("example 2: 30 ft x 3 ft, 8x18 = 120 blocks (126 at 5%), 20 caps, pad 2.00 t, drainage 4.44 cu yd / 6.22 t", () => {
    const r = wall(30, 3, blk("large"));
    expect(r.blocks).toBe(120); // 20 x 6
    expect(r.courses).toBe(6);
    expect(wall(30, 3, { ...blk("large"), wastePct: 5 }).blocksWithWaste).toBe(126);
    expect(r.caps).toBe(20);
    expect(round(r.padTons, 2)).toBe(2.0);
    expect(round(r.drainCuYd, 2)).toBe(4.44);
    expect(round(r.drainTons, 2)).toBe(6.22);
  });

  it("example 3: 10 ft x 1.5 ft, 4x12 = 60 blocks (63 at 5%), 10 caps, pad 0.67 t, drainage 1.04 t", () => {
    const r = wall(10, 1.5, blk("garden"));
    expect(r.blocks).toBe(60); // 10 x 6
    expect(r.courses).toBe(6);
    expect(wall(10, 1.5, { ...blk("garden"), wastePct: 5 }).blocksWithWaste).toBe(63);
    expect(r.caps).toBe(10);
    expect(round(r.padTons, 2)).toBe(0.67);
    expect(round(r.drainTons, 2)).toBe(1.04);
  });

  it("reference table: blocks before waste (buried course included)", () => {
    // [lengthFt, heightFt, 4x12, 6x16, 8x18]
    const rows: [number, number, number, number, number][] = [
      [10, 2, 70, 40, 28],
      [20, 2, 140, 75, 56],
      [20, 3, 200, 105, 84],
      [40, 3, 400, 210, 162],
    ];
    for (const [L, H, g, s, lg] of rows) {
      expect(wall(L, H, blk("garden")).blocks, `${L}x${H} 4x12`).toBe(g);
      expect(wall(L, H, blk("standard")).blocks, `${L}x${H} 6x16`).toBe(s);
      expect(wall(L, H, blk("large")).blocks, `${L}x${H} 8x18`).toBe(lg);
    }
  });

  it("FAQ: 20 ft x 2 ft (6x16) needs about 75 blocks, 1.3 t base, 2.6 t drainage", () => {
    const r = wall(20, 2);
    expect(r.blocks).toBe(75);
    expect(round(r.padTons, 1)).toBe(1.3);
    expect(round(r.drainTons, 1)).toBe(2.6);
  });

  it("caps off removes the caps", () => {
    expect(wall(20, 2, { caps: false }).caps).toBe(0);
  });

  it("buried course off reduces courses by one", () => {
    expect(wall(20, 2, { buriedCourses: 0 }).courses).toBe(4); // 75 -> 60
    expect(wall(20, 2, { buriedCourses: 0 }).blocks).toBe(60);
  });

  it("height above 4 ft is reported for the warning", () => {
    expect(wall(20, 5).maxHeightFt).toBe(5);
    expect(wall(20, 4).maxHeightFt).toBe(4);
  });

  it("sums several sections (blocks and pipe add up)", () => {
    const r = computeRetainingWall({ ...Z, sections: [{ lengthFt: 20, heightFt: 2 }, { lengthFt: 10, heightFt: 2 }] });
    // section A: 15x5=75; section B: ceil(10/1.333)=8 per course x 5 = 40 -> 115
    expect(r.blocks).toBe(115);
    expect(r.pipeLinearFt).toBe(30);
  });

  it("material cost = blocks + caps + gravel + pipe; installed = face area x rate", () => {
    const r = wall(20, 2, { wastePct: 5 });
    const expected = 79 * 4 + 15 * 4 + (r.padTons + r.drainTons) * 45 + 20 * 1.5;
    expect(r.materialCost).toBeCloseTo(expected, 2);
    expect(r.installedCost).toBeCloseTo(40 * 25, 2); // 20 ft x 2 ft = 40 sq ft face
  });

  it("zero / empty input is safe", () => {
    const r = computeRetainingWall({ ...Z, sections: [] });
    expect(r.blocks).toBe(0);
    expect(r.caps).toBe(0);
    expect(Number.isFinite(r.materialCost)).toBe(true);
  });
});
