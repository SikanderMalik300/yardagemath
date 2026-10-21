import { describe, it, expect } from "vitest";
import { round, ceilCount } from "@/lib/formulas/units";
import {
  computeAsphalt,
  asphaltArea,
  cutoutArea,
  coveragePerTon,
  ASPHALT_MATERIALS,
  type AsphaltInput,
} from "@/lib/formulas/asphalt";

/**
 * Asphalt Calculator — known-answer tests (batch4 day1).
 * Hot mix at 145 lb/cu ft, 5% waste, 20 t truck. Every worked example,
 * reference-table value and FAQ number is asserted here.
 */

const HOTMIX = ASPHALT_MATERIALS.hotMix.densityLbPerCuFt; // 145
const MILLINGS = ASPHALT_MATERIALS.millings.densityLbPerCuFt; // 120

const Z: AsphaltInput = {
  areas: [],
  thicknessIn: 3,
  wastePct: 5,
  densityLbPerCuFt: HOTMIX,
  pricePerTon: 60,
  truckTons: 20,
  installedPerSqFt: 8,
  baseOn: false,
  baseDepthIn: 6,
  basePricePerTon: 45,
};
const rect = (L: number, W: number, over: Partial<AsphaltInput> = {}) =>
  computeAsphalt({ ...Z, areas: [{ shape: "rectangle", lengthFt: L, widthFt: W }], ...over });
const sqft = (a: number, over: Partial<AsphaltInput> = {}) =>
  computeAsphalt({ ...Z, areas: [{ shape: "area", directSqFt: a }], ...over });

describe("asphalt — known answers", () => {
  it("material unit weights: hot mix 145, millings 120 lb/cu ft", () => {
    expect(HOTMIX).toBe(145);
    expect(MILLINGS).toBe(120);
  });

  it("example 1: driveway 12x50, 3 in = 600 sq ft, 66.67 sq yd, 150 cu ft, 5.56 cu yd, 10.88 t, 11.42 with 5%, 1 load", () => {
    const r = rect(12, 50);
    expect(r.areaSqFt).toBe(600);
    expect(round(r.squareYards, 2)).toBe(66.67);
    expect(r.cubicFeet).toBe(150);
    expect(round(r.cubicYards, 2)).toBe(5.56);
    expect(round(r.tons, 2)).toBe(10.88);
    expect(round(r.tonsWithWaste, 2)).toBe(11.42);
    expect(r.truckloads).toBe(1);
  });

  it("example 2: parking pad 20x24, 2 in = 480 sq ft, 80 cu ft, 2.96 cu yd, 5.80 t, 6.09 with 5%", () => {
    const r = rect(20, 24, { thicknessIn: 2 });
    expect(r.cubicFeet).toBe(80);
    expect(round(r.cubicYards, 2)).toBe(2.96);
    expect(round(r.tons, 2)).toBe(5.8);
    expect(round(r.tonsWithWaste, 2)).toBe(6.09);
  });

  it("example 3: parking area 2,000 sq ft, 3 in = 500 cu ft, 18.52 cu yd, 36.25 t, 38.06 with 5%, 2 loads", () => {
    const r = sqft(2000);
    expect(r.cubicFeet).toBe(500);
    expect(round(r.cubicYards, 2)).toBe(18.52);
    expect(round(r.tons, 2)).toBe(36.25);
    expect(round(r.tonsWithWaste, 2)).toBe(38.06);
    expect(r.truckloads).toBe(2); // ceil(38.06 / 20)
  });

  it("example 4: coverage of 1 ton = 82.8 sq ft at 2 in, 55.2 sq ft at 3 in", () => {
    expect(round(coveragePerTon(2, HOTMIX), 1)).toBe(82.8);
    expect(round(coveragePerTon(3, HOTMIX), 1)).toBe(55.2);
  });

  it("example 5: a cubic yard of hot mix = 3,915 lb = 1.96 tons", () => {
    expect(HOTMIX * 27).toBe(3915);
    expect(round((HOTMIX * 27) / 2000, 2)).toBe(1.96);
  });

  it("example 6: spread rate, 1 sq yd at 1 in = 0.75 cu ft = 108.75 lb (about 110)", () => {
    const cuftPerSyIn = 9 * (1 / 12); // 0.75
    expect(cuftPerSyIn).toBe(0.75);
    expect(round(cuftPerSyIn * HOTMIX, 2)).toBe(108.75);
  });

  it("example 7: optional base 12x50 at 6 in = 300 cu ft +20% = 360 cu ft = 13.33 cu yd = 20.0 t crusher run", () => {
    const r = rect(12, 50, { baseOn: true, baseDepthIn: 6 });
    expect(round(r.baseCubicYards, 2)).toBe(13.33);
    expect(round(r.baseTons, 1)).toBe(20);
    // base off by default -> zero
    expect(rect(12, 50).baseTons).toBe(0);
  });

  it("FAQ: tonnage via 110 lb/sy/in, 66.7 sq yd at 3 in is about 11 tons", () => {
    expect(round((66.7 * 3 * 110) / 2000, 0)).toBe(11);
  });

  it("reference table: tons of hot mix (145) before waste at 2 / 3 / 4 in", () => {
    const rows: [number, number, number, number][] = [
      [100, 1.2, 1.8, 2.4],
      [250, 3.0, 4.5, 6.0],
      [500, 6.0, 9.1, 12.1],
      [1000, 12.1, 18.1, 24.2],
    ];
    for (const [a, t2, t3, t4] of rows) {
      expect(round(sqft(a, { thicknessIn: 2 }).tons, 1), `${a}@2`).toBe(t2);
      expect(round(sqft(a, { thicknessIn: 3 }).tons, 1), `${a}@3`).toBe(t3);
      expect(round(sqft(a, { thicknessIn: 4 }).tons, 1), `${a}@4`).toBe(t4);
    }
  });

  it("millings weigh less than hot mix for the same area and thickness", () => {
    expect(sqft(1000, { densityLbPerCuFt: MILLINGS }).tons).toBeLessThan(sqft(1000, { densityLbPerCuFt: HOTMIX }).tons);
    // 1,000 sq ft at 3 in of millings (120 lb): 250 cu ft x 120 / 2000 = 15.0 t
    expect(round(sqft(1000, { densityLbPerCuFt: MILLINGS }).tons, 1)).toBe(15);
  });

  it("truckloads round up and follow truck size", () => {
    expect(sqft(2000).truckloads).toBe(2); // 38.06 t / 20
    expect(sqft(2000, { truckTons: 15 }).truckloads).toBe(3); // 38.06 / 15
    expect(sqft(2000, { truckTons: 10 }).truckloads).toBe(4); // 38.06 / 10
    expect(ceilCount(38.06 / 20)).toBe(2);
  });

  it("cut-outs (planter or island) subtract from the area", () => {
    expect(cutoutArea({ shape: "rectangle", lengthFt: 3, widthFt: 4 })).toBe(12);
    expect(cutoutArea({ shape: "circle", diameterFt: 2 })).toBeCloseTo(Math.PI, 5);
    const net = asphaltArea({ shape: "rectangle", lengthFt: 12, widthFt: 50, cutouts: [{ shape: "rectangle", lengthFt: 3, widthFt: 4 }] });
    expect(net).toBe(588);
    expect(asphaltArea({ shape: "area", directSqFt: 5, cutouts: [{ shape: "area", directSqFt: 9 }] })).toBe(0);
  });

  it("sums several areas and converts to square yards", () => {
    const r = computeAsphalt({
      ...Z,
      areas: [
        { shape: "rectangle", lengthFt: 12, widthFt: 50 },
        { shape: "area", directSqFt: 300 },
      ],
    });
    expect(r.areaSqFt).toBe(900);
    expect(r.squareYards).toBe(100);
  });

  it("material and installed cost, and empty input is safe", () => {
    const r = rect(12, 50, { pricePerTon: 60, installedPerSqFt: 8 });
    expect(Math.round(r.materialCost)).toBe(Math.round(r.tonsWithWaste * 60));
    expect(r.installedCost).toBe(600 * 8);
    const z = computeAsphalt({ ...Z, areas: [] });
    expect(z.tons).toBe(0);
    expect(z.truckloads).toBe(0);
    expect(Number.isFinite(z.coveragePerTon)).toBe(true);
  });
});
