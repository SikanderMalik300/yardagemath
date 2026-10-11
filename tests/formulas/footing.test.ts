import { describe, it, expect } from "vitest";
import { round, feetInchesToFeet, ceilCount } from "@/lib/formulas/units";
import { computeFooting, footingCubicFeet, type FootingInput } from "@/lib/formulas/footing";

/**
 * Concrete Footing Calculator — known-answer tests (day4-5 spec, Day 4).
 * Every worked example, reference-table value and FAQ number is asserted here.
 */

const Z = { lengthFt: 0, widthFt: 0, depthFt: 0, diameterFt: 0, quantity: 0 };

const strip = (L: number, W: number, D: number, waste = 0, yield_ = 0.6, price = 160) =>
  computeFooting({ ...Z, type: "strip", lengthFt: L, widthFt: W, depthFt: D, wastePct: waste, pricePerCuYd: price, bagYieldCuFt: yield_ } as FootingInput);
const pad = (L: number, W: number, D: number, qty: number, waste = 0, yield_ = 0.6) =>
  computeFooting({ ...Z, type: "pad", lengthFt: L, widthFt: W, depthFt: D, quantity: qty, wastePct: waste, pricePerCuYd: 160, bagYieldCuFt: yield_ } as FootingInput);
const pier = (d: number, D: number, qty: number, waste = 0, yield_ = 0.6) =>
  computeFooting({ ...Z, type: "pier", diameterFt: d, depthFt: D, quantity: qty, wastePct: waste, pricePerCuYd: 160, bagYieldCuFt: yield_ } as FootingInput);

const IN = (ft: number, inch: number) => feetInchesToFeet(ft, inch);

describe("concrete footing — known answers", () => {
  it("worked example 1: 40 ft strip, 16 in x 8 in = 1.32 cu yd (1.45 w/10%)", () => {
    // 40 x 1.333 x 0.667 = 35.56 cu ft; /27 = 1.317; x1.1 = 1.449
    const r = strip(40, IN(0, 16), IN(0, 8));
    expect(round(r.cubicFeet, 2)).toBe(35.56);
    expect(round(r.cubicYards, 2)).toBe(1.32);
    expect(round(strip(40, IN(0, 16), IN(0, 8), 10).cubicYardsWithWaste, 2)).toBe(1.45);
  });

  it("worked example 2: six 24x24 in pads, 12 in deep = 0.89 cu yd, 40 bags (44 w/10%)", () => {
    // 2 x 2 x 1 x 6 = 24 cu ft; /27 = 0.889; x1.1 = 0.978
    const r = pad(IN(0, 24), IN(0, 24), IN(0, 12), 6);
    expect(r.cubicFeet).toBe(24);
    expect(round(r.cubicYards, 2)).toBe(0.89);
    expect(round(pad(IN(0, 24), IN(0, 24), IN(0, 12), 6, 10).cubicYardsWithWaste, 2)).toBe(0.98);
    expect(pad(IN(0, 24), IN(0, 24), IN(0, 12), 6, 0).bags).toBe(40); // 24/0.6 = 40
  });

  it("REQUIRED: 24 cu ft with 10% waste = 44 bags of 80-lb (not 45)", () => {
    // 24 x 1.10 = 26.4; 26.4 / 0.6 = 44 exactly (ceilCount clears float)
    expect(pad(IN(0, 24), IN(0, 24), IN(0, 12), 6, 10).bags).toBe(44);
    expect(ceilCount((24 * 1.1) / 0.6)).toBe(44);
  });

  it("worked example 3 / FAQ: one 12 in round pier, 3 ft deep = 2.36 cu ft -> 4 bags", () => {
    // pi x 0.5^2 x 3 = 2.356 cu ft; /0.6 = 3.93 -> 4 bags
    const r = pier(IN(0, 12), 3, 1);
    expect(round(r.cubicFeet, 2)).toBe(2.36);
    expect(r.bags).toBe(4);
  });

  it("reference table 16 x 8 in strip: cu yd and 80-lb bags (no waste)", () => {
    // W = 16 in = 1.333 ft, D = 8 in = 0.667 ft -> 0.8889 cu ft per ft
    const rows: [number, number, number][] = [
      [20, 0.66, 30],
      [40, 1.32, 60],
      [60, 1.98, 89],
      [80, 2.63, 119],
      [100, 3.29, 149],
    ];
    for (const [len, cy, bags] of rows) {
      const r = strip(len, IN(0, 16), IN(0, 8));
      expect(round(r.cubicYards, 2)).toBe(cy);
      expect(r.bags).toBe(bags);
    }
  });

  it("reference table 20 x 10 in strip: cu yd and 80-lb bags (no waste)", () => {
    // W = 20 in = 1.667 ft, D = 10 in = 0.833 ft -> 1.389 cu ft per ft
    const rows: [number, number, number][] = [
      [20, 1.03, 47],
      [40, 2.06, 93],
      [60, 3.09, 139],
      [80, 4.12, 186],
      [100, 5.14, 232],
    ];
    for (const [len, cy, bags] of rows) {
      const r = strip(len, IN(0, 20), IN(0, 10));
      expect(round(r.cubicYards, 2)).toBe(cy);
      expect(r.bags).toBe(bags);
    }
  });

  it("FAQ: a footing with 24 cu ft needs about 40 bags (44 with 10%)", () => {
    expect(strip(27, IN(0, 16), IN(0, 8)).cubicFeet).toBeCloseTo(24, 0); // ~24 cu ft
    expect(pad(IN(0, 24), IN(0, 24), IN(0, 12), 6, 0).bags).toBe(40);
  });

  it("pad footing reuses strip x qty: one 2x2x1 pad = 4 cu ft", () => {
    expect(pad(2, 2, 1, 1).cubicFeet).toBe(4);
    expect(pad(2, 2, 1, 6).cubicFeet).toBe(24);
  });

  it("feet + inches: 16 in = 1.333 ft, 8 in = 0.667 ft", () => {
    expect(round(IN(0, 16), 3)).toBe(1.333);
    expect(round(IN(0, 8), 3)).toBe(0.667);
  });

  it("60-lb bags (0.45 yield): 24 cu ft = 54 bags before waste", () => {
    // 24 / 0.45 = 53.3 -> 54
    expect(pad(IN(0, 24), IN(0, 24), IN(0, 12), 6, 0, 0.45).bags).toBe(54);
  });

  it("cost: 40 ft strip 16x8 + 10% at $160 = about $232", () => {
    // 1.449 cu yd x 160 = 231.9
    expect(Math.round(strip(40, IN(0, 16), IN(0, 8), 10, 0.6, 160).cost)).toBe(232);
  });

  it("zero input is safe (no NaN)", () => {
    const r = strip(0, 0, 0);
    expect(r.cubicYards).toBe(0);
    expect(r.bags).toBe(0);
    expect(Number.isFinite(r.cost)).toBe(true);
  });

  it("geometry: strip 40x1.333x0.667 via footingCubicFeet", () => {
    expect(round(footingCubicFeet({ ...Z, type: "strip", lengthFt: 40, widthFt: IN(0, 16), depthFt: IN(0, 8), quantity: 0, wastePct: 0, pricePerCuYd: 0, bagYieldCuFt: 0 }), 2)).toBe(35.56);
  });
});