import { describe, it, expect } from "vitest";
import { round } from "@/lib/formulas/units";
import { computeMulch, bedArea, coveragePerYard, type MulchInput, type MulchBed } from "@/lib/formulas/mulch";

/**
 * Mulch Calculator — known-answer tests (batch2 day1).
 * Every worked example, reference-table value and FAQ number is asserted here.
 */

const Z: MulchInput = { beds: [], depthIn: 3, wastePct: 0, bagSizeCuFt: 2, pricePerCuYd: 40, pricePerBag: 4 };
const rect = (L: number, W: number, over: Partial<MulchInput> = {}) =>
  computeMulch({ ...Z, beds: [{ shape: "rectangle", lengthFt: L, widthFt: W }], ...over });
const circle = (d: number, over: Partial<MulchInput> = {}) =>
  computeMulch({ ...Z, beds: [{ shape: "circle", diameterFt: d }], ...over });
const area = (sqft: number, over: Partial<MulchInput> = {}) =>
  computeMulch({ ...Z, beds: [{ shape: "area", directSqFt: sqft }], ...over });

describe("mulch — known answers", () => {
  it("worked example 1: 10x20 bed, 3 in = 50 cu ft, 1.85 cu yd, 25 bags (2cf) / 17 bags (3cf)", () => {
    const r = rect(10, 20);
    expect(r.cubicFeet).toBe(50);
    expect(round(r.cubicYards, 2)).toBe(1.85);
    expect(r.bags).toBe(25); // 50 / 2
    expect(rect(10, 20, { bagSizeCuFt: 3 }).bags).toBe(17); // ceil(50/3)=17
  });

  it("worked example 1 with 10% waste: 2.04 cu yd, 28 bags of 2 cu ft", () => {
    const r = rect(10, 20, { wastePct: 10 });
    expect(round(r.cubicYardsWithWaste, 2)).toBe(2.04);
    expect(r.bags).toBe(28); // ceil(55/2) = 28
  });

  it("worked example 2: 6 ft tree ring, 3 in = 7.07 cu ft, 0.26 cu yd, 4 bags", () => {
    const r = circle(6);
    expect(round(r.cubicFeet, 2)).toBe(7.07);
    expect(round(r.cubicYards, 2)).toBe(0.26);
    expect(r.bags).toBe(4); // ceil(7.07/2) = 4
  });

  it("coverage of 1 cu yd: 324 @1in, 162 @2in, 108 @3in, 81 @4in", () => {
    expect(coveragePerYard(1)).toBe(324);
    expect(coveragePerYard(2)).toBe(162);
    expect(coveragePerYard(3)).toBe(108);
    expect(coveragePerYard(4)).toBe(81);
  });

  it("bags per yard: 27/2 = 13.5 (2 cu ft), 27/3 = 9 (3 cu ft)", () => {
    expect(round(27 / 2, 1)).toBe(13.5);
    expect(27 / 3).toBe(9);
  });

  it("reference table: cubic yards at 2/3/4 in and 2 cu ft bags at 3 in (before waste)", () => {
    // [sqft, cy@2, cy@3, cy@4, bags@3in(2cf)]
    const rows: [number, number, number, number, number][] = [
      [100, 0.62, 0.93, 1.23, 13],
      [200, 1.23, 1.85, 2.47, 25],
      [500, 3.09, 4.63, 6.17, 63],
      [1000, 6.17, 9.26, 12.35, 125],
    ];
    for (const [sqft, cy2, cy3, cy4, bags3] of rows) {
      expect(round(area(sqft, { depthIn: 2 }).cubicYards, 2), `${sqft}@2`).toBe(cy2);
      expect(round(area(sqft, { depthIn: 3 }).cubicYards, 2), `${sqft}@3`).toBe(cy3);
      expect(round(area(sqft, { depthIn: 4 }).cubicYards, 2), `${sqft}@4`).toBe(cy4);
      expect(area(sqft, { depthIn: 3, bagSizeCuFt: 2 }).bags, `${sqft} bags@3`).toBe(bags3);
    }
  });

  it("FAQ: 200 sq ft bed at 3 in is about 1.85 cubic yards", () => {
    expect(round(area(200, { depthIn: 3 }).cubicYards, 2)).toBe(1.85);
  });

  it("bulk vs bagged cost: 10x20 bed at 10% waste, bulk ($40/yd) beats bagged ($4/bag)", () => {
    const r = rect(10, 20, { wastePct: 10 });
    // bulk = 2.037 cu yd x 40 = 81.5 ; bagged = 28 x 4 = 112
    expect(Math.round(r.bulkCost)).toBe(81);
    expect(r.baggedCost).toBe(112);
    expect(r.cheaper).toBe("bulk");
  });

  it("sums several beds: 10x20 + 6 ft ring at 3 in", () => {
    const r = computeMulch({ ...Z, beds: [
      { shape: "rectangle", lengthFt: 10, widthFt: 20 },
      { shape: "circle", diameterFt: 6 },
    ] });
    expect(round(r.areaSqFt, 2)).toBe(round(200 + Math.PI * 9, 2));
    expect(round(r.cubicFeet, 2)).toBe(round(57.07, 2)); // 50 + 7.07
  });

  it("bedArea: triangle and direct area", () => {
    expect(bedArea({ shape: "triangle", baseFt: 10, heightFt: 6 })).toBe(30);
    expect(bedArea({ shape: "area", directSqFt: 150 })).toBe(150);
  });

  it("direct square feet input matches rectangle of same area", () => {
    expect(area(200, { depthIn: 3 }).cubicFeet).toBe(rect(10, 20).cubicFeet);
  });

  it("zero / empty input is safe", () => {
    const r = computeMulch({ ...Z, beds: [] });
    expect(r.cubicYards).toBe(0);
    expect(r.bags).toBe(0);
    expect(Number.isFinite(r.bulkCost)).toBe(true);
  });
});