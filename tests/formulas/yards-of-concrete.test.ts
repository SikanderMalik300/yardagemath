import { describe, it, expect } from "vitest";
import { round, feetInchesToFeet, metersToFeet } from "@/lib/formulas/units";
import { computeYardsOfConcrete, type YardsOfConcreteInput } from "@/lib/formulas/yardsOfConcrete";

/**
 * Yards of Concrete Calculator — known-answer tests (next-5 page 13).
 * Every worked example, reference-table value and FAQ number is asserted here.
 */

const Z = {
  lengthFt: 0, widthFt: 0, thicknessIn: 0,
  stripLengthFt: 0, stripWidthFt: 0, stripDepthFt: 0,
  diameterFt: 0, heightFt: 0, quantity: 0,
};

const slab = (L: number, W: number, T: number, waste = 0, yield_ = 0.6, price = 160) =>
  computeYardsOfConcrete({ ...Z, shape: "slab", lengthFt: L, widthFt: W, thicknessIn: T, wastePct: waste, pricePerCuYd: price, bagYieldCuFt: yield_ } as YardsOfConcreteInput);
const strip = (L: number, W: number, D: number, waste = 0) =>
  computeYardsOfConcrete({ ...Z, shape: "strip", stripLengthFt: L, stripWidthFt: W, stripDepthFt: D, wastePct: waste, pricePerCuYd: 160, bagYieldCuFt: 0.6 } as YardsOfConcreteInput);
const col = (d: number, h: number, q: number, waste = 0) =>
  computeYardsOfConcrete({ ...Z, shape: "column", diameterFt: d, heightFt: h, quantity: q, wastePct: waste, pricePerCuYd: 160, bagYieldCuFt: 0.6 } as YardsOfConcreteInput);

describe("yards of concrete — known answers", () => {
  it("worked example 1: 12x12 patio at 4 in = 1.78 cu yd (1.96 with 10%)", () => {
    // 144 * (4/12) = 48 cu ft; 48/27 = 1.7778; *1.1 = 1.9556
    expect(slab(12, 12, 4).cubicFeet).toBe(48);
    expect(round(slab(12, 12, 4).cubicYards, 2)).toBe(1.78);
    expect(round(slab(12, 12, 4, 10).cubicYardsWithWaste, 2)).toBe(1.96);
  });

  it("worked example 2: four 12-in columns, 4 ft tall = 0.47 cu yd (0.51 with 10%)", () => {
    // pi * 0.5^2 * 4 * 4 = 12.566 cu ft; /27 = 0.4654; *1.1 = 0.512
    expect(round(col(1, 4, 4).cubicFeet, 2)).toBe(12.57);
    expect(round(col(1, 4, 4).cubicYards, 2)).toBe(0.47);
    expect(round(col(1, 4, 4, 10).cubicYardsWithWaste, 2)).toBe(0.51);
  });

  it("reference table @ 4 in: cu yd and 80-lb bags (no waste)", () => {
    // cu ft = area * (4/12); cy = cuft/27; bags = ceil(cuft/0.6)
    const rows: [number, number, number][] = [
      [10, 1.23, 56], // 33.33 cuft; 55.56 -> 56
      [12, 1.78, 80], // 48; 80
      [16, 3.16, 143], // 85.33; 142.2 -> 143
      [20, 4.94, 223], // 133.33; 222.2 -> 223
      [24, 7.11, 320], // 192; 320
      [30, 11.11, 500], // 300; 500
    ];
    for (const [s, cy, bags] of rows) {
      expect(round(slab(s, s, 4).cubicYards, 2)).toBe(cy);
      expect(slab(s, s, 4).bags).toBe(bags);
    }
  });

  it("reference table @ 6 in: cu yd and 80-lb bags (no waste)", () => {
    const rows: [number, number, number][] = [
      [10, 1.85, 84], // 50 cuft; 83.3 -> 84
      [12, 2.67, 120], // 72; 120
      [16, 4.74, 214], // 128; 213.3 -> 214
      [20, 7.41, 334], // 200; 333.3 -> 334
      [24, 10.67, 480], // 288; 480
      [30, 16.67, 750], // 450; 750
    ];
    for (const [s, cy, bags] of rows) {
      expect(round(slab(s, s, 6).cubicYards, 2)).toBe(cy);
      expect(slab(s, s, 6).bags).toBe(bags);
    }
  });

  it("FAQ: 10x10 slab = 1.23 cu yd @4 (1.36 w/10%), 1.85 @6", () => {
    expect(round(slab(10, 10, 4).cubicYards, 2)).toBe(1.23);
    expect(round(slab(10, 10, 4, 10).cubicYardsWithWaste, 2)).toBe(1.36);
    expect(round(slab(10, 10, 6).cubicYards, 2)).toBe(1.85);
  });

  it("FAQ: a yard covers 81 sq ft @4, 65 @5, 54 @6 (324/thickness)", () => {
    // area that uses exactly 1 cu yd at each depth -> cy == 1
    expect(round(slab(81, 1, 4).cubicYards, 2)).toBe(1);
    expect(round(slab(64.8, 1, 5).cubicYards, 2)).toBe(1); // 324/5 = 64.8
    expect(round(slab(54, 1, 6).cubicYards, 2)).toBe(1);
    expect(324 / 4).toBe(81);
    expect(324 / 6).toBe(54);
  });

  it("FAQ: about 45 80-lb bags make a yard (27 / 0.6)", () => {
    // a 27 cu ft pour -> ceil(27/0.6) = 45
    expect(slab(81, 1, 4).cubicFeet).toBe(27);
    expect(slab(81, 1, 4).bags).toBe(45);
  });

  it("whole-number case: 9x9x4 = 1.00 cu yd", () => {
    // 81 * 0.3333 = 27; /27 = 1
    expect(round(slab(9, 9, 4).cubicYards, 2)).toBe(1);
  });

  it("decimal case: 10.5x8x4 = 1.04 cu yd", () => {
    // 84 * 0.3333 = 28; /27 = 1.037
    expect(round(slab(10.5, 8, 4).cubicYards, 2)).toBe(1.04);
  });

  it("feet+inches with inches>=12: 5 ft 18 in = 6.5 ft", () => {
    // 6.5*10=65; *0.3333=21.67; /27 = 0.8025
    expect(feetInchesToFeet(5, 18)).toBe(6.5);
    expect(round(slab(feetInchesToFeet(5, 18), 10, 4).cubicYards, 2)).toBe(0.8);
  });

  it("waste 0% vs 10% (12x12x4)", () => {
    expect(round(slab(12, 12, 4, 0).cubicYardsWithWaste, 2)).toBe(1.78);
    expect(round(slab(12, 12, 4, 10).cubicYardsWithWaste, 2)).toBe(1.96);
  });

  it("bag counts round up: 10x10x4 no waste = 56 bags", () => {
    // 33.33/0.6 = 55.56 -> 56
    expect(slab(10, 10, 4).bags).toBe(56);
  });

  it("metric equivalence: 3.6576 m square ~ 12x12 ft", () => {
    const m = slab(metersToFeet(3.6576), metersToFeet(3.6576), 4);
    expect(m.cubicYards).toBeCloseTo(slab(12, 12, 4).cubicYards, 2);
  });

  it("zero input: no NaN/Infinity", () => {
    const z = slab(0, 0, 0);
    expect(z.cubicYards).toBe(0);
    expect(z.bags).toBe(0);
    expect(z.cost).toBe(0);
    expect(Number.isFinite(z.cost)).toBe(true);
  });

  it("large input stable: 100x100x6 = 185.19 cu yd", () => {
    // 10000*0.5 = 5000; /27 = 185.19
    expect(round(slab(100, 100, 6).cubicYards, 2)).toBe(185.19);
  });

  it("strip shape: 20 x 1 x 0.5 ft = 10 cu ft = 0.37 cu yd", () => {
    expect(strip(20, 1, 0.5).cubicFeet).toBe(10);
    expect(round(strip(20, 1, 0.5).cubicYards, 2)).toBe(0.37);
  });

  it("column shape: one 12-in column, 10 ft tall = 0.29 cu yd", () => {
    // pi*0.25*10 = 7.854; /27 = 0.291
    expect(round(col(1, 10, 1).cubicFeet, 2)).toBe(7.85);
    expect(round(col(1, 10, 1).cubicYards, 2)).toBe(0.29);
  });

  it("60-lb bag yield (0.45): 10x10x4 no waste = 75 bags", () => {
    // 33.33/0.45 = 74.07 -> 75
    expect(slab(10, 10, 4, 0, 0.45).bags).toBe(75);
  });

  it("cost: 12x12x4 + 10% at $160/yd = about $313", () => {
    // 1.9556 cu yd * 160 = 312.9
    expect(Math.round(slab(12, 12, 4, 10, 0.6, 160).cost)).toBe(313);
  });
});
