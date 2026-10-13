import { describe, it, expect } from "vitest";
import { round, ceilCount } from "@/lib/formulas/units";
import { DENSITY_TONS_PER_CUYD } from "@/lib/constants";
import {
  computeSand,
  sandArea,
  coveragePerTon,
  coveragePerYard,
  SAND_TYPES,
  type SandInput,
} from "@/lib/formulas/sand";

/**
 * Sand Calculator — known-answer tests (batch2 day3).
 * Every worked example, reference-table value and FAQ number is asserted here.
 * Dry sand density 1.35 t/yd, bags 0.5 cu ft.
 */

const Z: SandInput = {
  areas: [],
  depthIn: 2,
  wastePct: 0,
  bagSizeCuFt: 0.5,
  densityTonsPerCuYd: 1.35,
  pricePerTon: 40,
  pricePerBag: 6,
};
const rect = (L: number, W: number, over: Partial<SandInput> = {}) =>
  computeSand({ ...Z, areas: [{ shape: "rectangle", lengthFt: L, widthFt: W }], ...over });
const area = (sqft: number, over: Partial<SandInput> = {}) =>
  computeSand({ ...Z, areas: [{ shape: "area", directSqFt: sqft }], ...over });

describe("sand — known answers", () => {
  it("shared dry sand density is 1.35 t/yd", () => {
    expect(DENSITY_TONS_PER_CUYD.sand).toBe(1.35);
    expect(SAND_TYPES.dry.density).toBe(1.35);
    expect(SAND_TYPES.damp.density).toBe(1.5);
  });

  it("example 1: 12x12 paver bedding, 1 in = 12 cu ft, 0.44 cu yd, 0.60 tons, 24 bags; +10% = 27 bags", () => {
    const r = rect(12, 12, { depthIn: 1 });
    expect(r.cubicFeet).toBe(12);
    expect(round(r.cubicYards, 2)).toBe(0.44);
    expect(round(r.tons, 2)).toBe(0.6);
    expect(r.bags).toBe(24); // ceil(12 / 0.5)
    expect(rect(12, 12, { depthIn: 1, wastePct: 10 }).bags).toBe(27); // ceil(13.2/0.5)
  });

  it("example 2: 6x6 sandbox, 12 in = 36 cu ft, 1.33 cu yd, 1.80 tons, 72 bags; +10% = 80 bags", () => {
    const r = rect(6, 6, { depthIn: 12 });
    expect(r.cubicFeet).toBe(36);
    expect(round(r.cubicYards, 2)).toBe(1.33);
    expect(round(r.tons, 2)).toBe(1.8);
    expect(r.bags).toBe(72); // ceil(36 / 0.5)
    expect(rect(6, 6, { depthIn: 12, wastePct: 10 }).bags).toBe(80); // ceil(39.6/0.5)
  });

  it("example 3: 4x4 small sandbox, 6 in = 8 cu ft, 0.30 cu yd, 0.40 tons, 16 bags", () => {
    const r = rect(4, 4, { depthIn: 6 });
    expect(r.cubicFeet).toBe(8);
    expect(round(r.cubicYards, 2)).toBe(0.3);
    expect(round(r.tons, 2)).toBe(0.4);
    expect(r.bags).toBe(16); // ceil(8 / 0.5)
  });

  it("example 4: 10x20 leveling, 2 in = 33.33 cu ft, 1.23 cu yd, 1.67 tons, 67 bags", () => {
    const r = rect(10, 20, { depthIn: 2 });
    expect(round(r.cubicFeet, 2)).toBe(33.33);
    expect(round(r.cubicYards, 2)).toBe(1.23);
    expect(round(r.tons, 2)).toBe(1.67);
    expect(r.bags).toBe(67); // ceil(33.333 / 0.5)
  });

  it("coverage of 1 ton (1.35 t): 20 cu ft; 240/120/80/60 sq ft at 1/2/3/4 in", () => {
    expect(27 / 1.35).toBe(20);
    expect(round(coveragePerTon(1, 1.35), 0)).toBe(240);
    expect(round(coveragePerTon(2, 1.35), 0)).toBe(120);
    expect(round(coveragePerTon(3, 1.35), 0)).toBe(80);
    expect(round(coveragePerTon(4, 1.35), 0)).toBe(60);
  });

  it("coverage of 1 cu yd: 324/162/81 sq ft at 1/2/4 in", () => {
    expect(coveragePerYard(1)).toBe(324);
    expect(coveragePerYard(2)).toBe(162);
    expect(coveragePerYard(4)).toBe(81);
  });

  it("weight of 1 cu yd at 1.35 t = 2,700 lb", () => {
    expect(area(324, { depthIn: 1 }).tons).toBeCloseTo(1.35, 2); // 324 sq ft at 1 in = 1 cu yd
    expect(1.35 * 2000).toBe(2700);
  });

  it("reference table: cubic yards (2 dp) and tons (1 dp), dry sand 1.35, before waste", () => {
    // [sqft, [cy1,t1], [cy2,t2], [cy4,t4]]
    const rows: [number, [number, number], [number, number], [number, number]][] = [
      [100, [0.31, 0.4], [0.62, 0.8], [1.23, 1.7]],
      [250, [0.77, 1.0], [1.54, 2.1], [3.09, 4.2]],
      [500, [1.54, 2.1], [3.09, 4.2], [6.17, 8.3]],
      [1000, [3.09, 4.2], [6.17, 8.3], [12.35, 16.7]],
    ];
    for (const [sqft, d1, d2, d4] of rows) {
      for (const [depth, [cy, t]] of [[1, d1], [2, d2], [4, d4]] as const) {
        const r = area(sqft, { depthIn: depth });
        expect(round(r.cubicYards, 2), `${sqft}@${depth} cy`).toBe(cy);
        expect(round(r.tons, 1), `${sqft}@${depth} t`).toBe(t);
      }
    }
  });

  it("FAQ: 40 bags of 50 lb per ton (2,000 / 50); a ton of dry sand is about 20 cu ft", () => {
    expect(2000 / 50).toBe(40);
    expect(27 / 1.35).toBe(20);
  });

  it("bulk vs bagged: bulk wins at default prices; cheap bags can flip it", () => {
    // With defaults ($40/ton, $6 per 0.5 cu ft bag) bulk is cheaper per cubic foot.
    const big = area(1000, { depthIn: 4, wastePct: 10 });
    expect(big.cheaper).toBe("bulk");
    expect(big.bulkCost).toBeLessThan(big.baggedCost);
    // A very cheap bag price flips the cheaper label to bagged.
    const cheapBags = rect(4, 4, { depthIn: 6, wastePct: 10, pricePerBag: 0.5 });
    expect(cheapBags.cheaper).toBe("bagged");
  });

  it("damp sand weighs more than dry for the same volume", () => {
    const dry = rect(10, 20, { depthIn: 2, densityTonsPerCuYd: 1.35 }).tons;
    const damp = rect(10, 20, { depthIn: 2, densityTonsPerCuYd: 1.5 }).tons;
    expect(damp).toBeGreaterThan(dry);
  });

  it("sandArea: triangle and direct square feet", () => {
    expect(sandArea({ shape: "triangle", baseFt: 10, heightFt: 6 })).toBe(30);
    expect(sandArea({ shape: "area", directSqFt: 150 })).toBe(150);
  });

  it("sums several areas and is zero-safe when empty", () => {
    const r = computeSand({
      ...Z,
      depthIn: 2,
      areas: [
        { shape: "rectangle", lengthFt: 10, widthFt: 20 },
        { shape: "area", directSqFt: 44 },
      ],
    });
    expect(r.areaSqFt).toBe(244);
    const empty = computeSand({ ...Z, areas: [] });
    expect(empty.tons).toBe(0);
    expect(empty.bags).toBe(0);
    expect(ceilCount(0)).toBe(0);
  });
});
