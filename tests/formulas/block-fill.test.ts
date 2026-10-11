import { describe, it, expect } from "vitest";
import { round } from "@/lib/formulas/units";
import { computeBlockFill, fillFraction, type BlockFillInput } from "@/lib/formulas/blockFill";
import { GROUT_CUFT_PER_SQFT, BLOCKS_PER_SQFT } from "@/lib/constants";

/**
 * Cinder Block Fill Calculator — known-answer tests (day4-5 spec, Day 5).
 * Every worked example, reference-table value and FAQ number is asserted here.
 * Grout per sq ft (0.17 / 0.26 / 0.42) reuses the block wall constants.
 */

const byBlocks = (blocks: number, width: BlockFillInput["width"], pattern: BlockFillInput["pattern"] = "all", waste = 0, rebarSpacingIn = 32, yield_ = 0.6) =>
  computeBlockFill({ mode: "blocks", blocks, wallLengthFt: 0, wallHeightFt: 0, width, pattern, rebarSpacingIn, wastePct: waste, bagYieldCuFt: yield_ });
const byWall = (L: number, H: number, width: BlockFillInput["width"], pattern: BlockFillInput["pattern"] = "all", waste = 0, yield_ = 0.6) =>
  computeBlockFill({ mode: "wall", blocks: 0, wallLengthFt: L, wallHeightFt: H, width, pattern, rebarSpacingIn: 32, wastePct: waste, bagYieldCuFt: yield_ });

describe("cinder block fill — known answers", () => {
  it("worked example 1: 100 eight-inch blocks, all cores = 23.1 cu ft, 0.86 cu yd, 39 bags", () => {
    // 100 x (0.26 / 1.125) = 23.11 cu ft; /27 = 0.856; 23.11/0.6 = 38.5 -> 39
    const r = byBlocks(100, "in8", "all");
    expect(round(r.cubicFeet, 1)).toBe(23.1);
    expect(round(r.cubicYards, 2)).toBe(0.86);
    expect(r.bags).toBe(39);
  });

  it("worked example 2: 20x4 ft wall of 8-inch block, every other core = 10.4 cu ft, 0.39 cu yd, 18 bags", () => {
    // 80 sq ft x 0.26 x 0.5 = 10.4 cu ft; /27 = 0.385; 10.4/0.6 = 17.3 -> 18
    const r = byWall(20, 4, "in8", "everyOther");
    expect(round(r.cubicFeet, 1)).toBe(10.4);
    expect(round(r.cubicYards, 2)).toBe(0.39);
    expect(r.bags).toBe(18);
  });

  it("constant: 0.26 / 1.125 = 0.231 cu ft per block; 27 / 0.231 = 116.9 blocks per cu yd", () => {
    expect(round(GROUT_CUFT_PER_SQFT.in8 / BLOCKS_PER_SQFT, 3)).toBe(0.231);
    expect(round(27 / 0.231, 1)).toBe(116.9);
  });

  it("quick answer / FAQ: one 80-lb bag fills about 2.6 blocks (2 1/2) of 8-inch, all cores", () => {
    // 0.6 / 0.231 = 2.6
    expect(round(byBlocks(100, "in8", "all").blocksPerBag, 1)).toBe(2.6);
  });

  it("FAQ: grout per sq ft = 0.17 (6 in), 0.26 (8 in), 0.42 (12 in)", () => {
    expect(GROUT_CUFT_PER_SQFT.in6).toBe(0.17);
    expect(GROUT_CUFT_PER_SQFT.in8).toBe(0.26);
    expect(GROUT_CUFT_PER_SQFT.in12).toBe(0.42);
  });

  it("FAQ: a yard of concrete fills about 117 blocks (105 with 10% waste)", () => {
    const perBlock = GROUT_CUFT_PER_SQFT.in8 / BLOCKS_PER_SQFT;
    expect(Math.round(27 / perBlock)).toBe(117);
    expect(Math.round((27 / perBlock) * 0.9)).toBe(105); // allow 10% for waste
  });

  it("reference table: cu ft, cu yd and 80-lb bags, all cores (no waste)", () => {
    // rows: [blocks, 6in[cuft,cy,bags], 8in[...], 12in[...]]
    const checks: [number, "in6" | "in8" | "in12", number, number, number][] = [
      [50, "in6", 7.6, 0.28, 13],
      [50, "in8", 11.6, 0.43, 20],
      [50, "in12", 18.7, 0.69, 32],
      [100, "in6", 15.1, 0.56, 26],
      [100, "in8", 23.1, 0.86, 39],
      [100, "in12", 37.3, 1.38, 63],
      [200, "in8", 46.2, 1.71, 78],
      [500, "in8", 115.6, 4.28, 193],
      [500, "in12", 186.7, 6.91, 312],
    ];
    for (const [blocks, width, cuft, cy, bags] of checks) {
      const r = byBlocks(blocks, width, "all");
      expect(round(r.cubicFeet, 1), `${blocks} ${width} cuft`).toBe(cuft);
      expect(round(r.cubicYards, 2), `${blocks} ${width} cy`).toBe(cy);
      expect(r.bags, `${blocks} ${width} bags`).toBe(bags);
    }
  });

  it("fill patterns: all = 1, every other = 0.5, rebar @32 in = 0.25", () => {
    expect(fillFraction("all", 32)).toBe(1);
    expect(fillFraction("everyOther", 32)).toBe(0.5);
    expect(fillFraction("rebar", 32)).toBe(0.25); // 8 / 32
    expect(fillFraction("rebar", 16)).toBe(0.5); // 8 / 16
    expect(fillFraction("rebar", 8)).toBe(1); // 8 / 8, capped at 1
  });

  it("wall mode blocks per sq ft: 20x4 wall = 90 blocks", () => {
    // 80 sq ft x 1.125 = 90 blocks
    expect(round(byWall(20, 4, "in8", "all").blocks, 0)).toBe(90);
  });

  it("every other core uses half: 100 blocks 8-inch = 11.6 cu ft (half of 23.1)", () => {
    expect(round(byBlocks(100, "in8", "everyOther").cubicFeet, 1)).toBe(11.6);
    expect(byBlocks(100, "in8", "everyOther").bags).toBe(20); // 11.556/0.6 = 19.3 -> 20
  });

  it("with 10% waste: 100 blocks 8-inch all cores = 43 bags", () => {
    // 23.111 x 1.1 = 25.42; /0.6 = 42.4 -> 43
    expect(byBlocks(100, "in8", "all", 10).bags).toBe(43);
  });

  it("zero / empty input is safe", () => {
    const r = byBlocks(0, "in8", "all");
    expect(r.cubicFeet).toBe(0);
    expect(r.bags).toBe(0);
    expect(Number.isFinite(r.blocksPerBag)).toBe(true);
  });
});
