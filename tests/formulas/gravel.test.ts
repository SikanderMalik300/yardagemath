import { describe, it, expect } from "vitest";
import { round, ceilCount } from "@/lib/formulas/units";
import {
  computeGravel,
  gravelArea,
  coveragePerTon,
  coveragePerYard,
  GRAVEL_TYPES,
  type GravelInput,
} from "@/lib/formulas/gravel";

/**
 * Gravel Calculator — known-answer tests (batch2 day2).
 * Every worked example, reference-table value and FAQ number is asserted here.
 * Density 1.4 t/yd (crushed stone / #57) unless noted.
 */

const Z: GravelInput = {
  areas: [],
  depthIn: 4,
  wastePct: 0,
  bagSizeCuFt: 0.5,
  densityTonsPerCuYd: 1.4,
  pricePerTon: 45,
  deliveryFee: 0,
};
const rect = (L: number, W: number, over: Partial<GravelInput> = {}) =>
  computeGravel({ ...Z, areas: [{ shape: "rectangle", lengthFt: L, widthFt: W }], ...over });
const area = (sqft: number, over: Partial<GravelInput> = {}) =>
  computeGravel({ ...Z, areas: [{ shape: "area", directSqFt: sqft }], ...over });

describe("gravel — known answers", () => {
  it("example 1: 12x50 driveway, 4 in = 200 cu ft, 7.41 cu yd, 10.37 tons, 400 bags (before waste)", () => {
    const r = rect(12, 50);
    expect(r.cubicFeet).toBe(200);
    expect(round(r.cubicYards, 2)).toBe(7.41);
    expect(round(r.tons, 2)).toBe(10.37);
    expect(r.bags).toBe(400); // ceil(200 / 0.5)
  });

  it("example 1 with 10% waste: 8.15 cu yd, 11.41 tons, 440 bags", () => {
    const r = rect(12, 50, { wastePct: 10 });
    expect(round(r.cubicYardsWithWaste, 2)).toBe(8.15);
    expect(round(r.tonsWithWaste, 2)).toBe(11.41);
    expect(r.bags).toBe(440); // ceil(220 / 0.5)
  });

  it("example 2: 3x40 path, 3 in = 30 cu ft, 1.11 cu yd, 1.56 tons, 60 bags", () => {
    const r = rect(3, 40, { depthIn: 3 });
    expect(r.cubicFeet).toBe(30);
    expect(round(r.cubicYards, 2)).toBe(1.11);
    expect(round(r.tons, 2)).toBe(1.56);
    expect(r.bags).toBe(60); // ceil(30 / 0.5)
  });

  it("example 3: 10x10 patio, 2 in = 16.67 cu ft, 0.62 cu yd, 0.86 tons, 34 bags", () => {
    const r = rect(10, 10, { depthIn: 2 });
    expect(round(r.cubicFeet, 2)).toBe(16.67);
    expect(round(r.cubicYards, 2)).toBe(0.62);
    expect(round(r.tons, 2)).toBe(0.86);
    expect(r.bags).toBe(34); // ceil(16.667 / 0.5)
  });

  it("coverage of 1 ton (1.4 t): 19.3 cu ft; 116/77/58/39 sq ft at 2/3/4/6 in", () => {
    expect(round(27 / 1.4, 1)).toBe(19.3);
    expect(round(coveragePerTon(2, 1.4), 0)).toBe(116);
    expect(round(coveragePerTon(3, 1.4), 0)).toBe(77);
    expect(round(coveragePerTon(4, 1.4), 0)).toBe(58);
    expect(round(coveragePerTon(6, 1.4), 0)).toBe(39);
  });

  it("coverage of 1 cu yd: 162/108/81/54 sq ft at 2/3/4/6 in", () => {
    expect(coveragePerYard(2)).toBe(162);
    expect(coveragePerYard(3)).toBe(108);
    expect(coveragePerYard(4)).toBe(81);
    expect(coveragePerYard(6)).toBe(54);
  });

  it("weight of 1 cu yd at 1.4 t = 2,800 lb", () => {
    expect(area(81, { depthIn: 4 }).tons).toBeCloseTo(1.4, 2); // 81 sq ft at 4 in = 1 cu yd
    expect(1.4 * 2000).toBe(2800);
  });

  it("reference table: cubic yards (2 dp) and tons (1 dp), density 1.4, before waste", () => {
    // [sqft, [cy2,t2], [cy3,t3], [cy4,t4]]
    const rows: [number, [number, number], [number, number], [number, number]][] = [
      [100, [0.62, 0.9], [0.93, 1.3], [1.23, 1.7]],
      [250, [1.54, 2.2], [2.31, 3.2], [3.09, 4.3]],
      [500, [3.09, 4.3], [4.63, 6.5], [6.17, 8.6]],
      [1000, [6.17, 8.6], [9.26, 13.0], [12.35, 17.3]],
    ];
    for (const [sqft, d2, d3, d4] of rows) {
      for (const [depth, [cy, t]] of [[2, d2], [3, d3], [4, d4]] as const) {
        const r = area(sqft, { depthIn: depth });
        expect(round(r.cubicYards, 2), `${sqft}@${depth} cy`).toBe(cy);
        expect(round(r.tons, 1), `${sqft}@${depth} t`).toBe(t);
      }
    }
  });

  it("FAQ: a ton is about 19.29 cu ft, so about 39 bags of 0.5 cu ft", () => {
    expect(round(27 / 1.4, 2)).toBe(19.29);
    expect(ceilCount((27 / 1.4) / 0.5)).toBe(39); // 38.6 -> 39
  });

  it("cost = tons (with waste) x price per ton + delivery", () => {
    const r = rect(12, 50, { wastePct: 10, pricePerTon: 45, deliveryFee: 60 });
    // 11.407 tons x 45 + 60 = 573.3
    expect(Math.round(r.cost)).toBe(Math.round(r.tonsWithWaste * 45 + 60));
    expect(Math.round(r.cost)).toBe(573);
  });

  it("gravel types: river rock lighter, crusher run heavier than crushed stone", () => {
    expect(GRAVEL_TYPES.crushedStone.density).toBe(1.4);
    expect(GRAVEL_TYPES.peaGravel.density).toBe(1.4);
    expect(GRAVEL_TYPES.riverRock.density).toBe(1.35);
    expect(GRAVEL_TYPES.crusherRun.density).toBe(1.5);
    // same area/depth: crusher run weighs more, river rock less
    const base = rect(10, 10, { depthIn: 4 }).tons;
    expect(rect(10, 10, { depthIn: 4, densityTonsPerCuYd: 1.5 }).tons).toBeGreaterThan(base);
    expect(rect(10, 10, { depthIn: 4, densityTonsPerCuYd: 1.35 }).tons).toBeLessThan(base);
  });

  it("gravelArea: triangle and direct square feet", () => {
    expect(gravelArea({ shape: "triangle", baseFt: 10, heightFt: 6 })).toBe(30);
    expect(gravelArea({ shape: "area", directSqFt: 150 })).toBe(150);
  });

  it("sums several areas", () => {
    const r = computeGravel({
      ...Z,
      depthIn: 4,
      areas: [
        { shape: "rectangle", lengthFt: 12, widthFt: 50 },
        { shape: "area", directSqFt: 100 },
      ],
    });
    expect(r.areaSqFt).toBe(700);
    expect(r.cubicFeet).toBeCloseTo(233.33, 2);
  });

  it("zero / empty input is safe", () => {
    const r = computeGravel({ ...Z, areas: [] });
    expect(r.tons).toBe(0);
    expect(r.bags).toBe(0);
    expect(r.cost).toBe(0);
    expect(Number.isFinite(r.coveragePerTon)).toBe(true);
  });
});
