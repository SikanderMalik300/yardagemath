import { describe, it, expect } from "vitest";
import { round } from "@/lib/formulas/units";
import { computeSod, sodArea, cutoutArea, SOD_PIECES, type SodInput } from "@/lib/formulas/sod";

/**
 * Sod Calculator - known-answer tests (batch4 day3).
 * 5% waste, 450 sq ft pallets. Slab 16x24 in (2.6667 sq ft), roll 2x5 ft (10 sq ft).
 * Every worked example, reference-table value and FAQ number is asserted.
 */

const SLAB = SOD_PIECES.slab.sqFt; // 2.6667
const ROLL = SOD_PIECES.roll.sqFt; // 10

const Z: SodInput = {
  areas: [],
  wastePct: 5,
  palletSqFt: 450,
  pieceSqFt: SLAB,
  pricePerSqFt: 0.5,
  pricePerPallet: 0,
  deliveryFee: 0,
  installedPerSqFt: 1.5,
};
const sqft = (a: number, over: Partial<SodInput> = {}) => computeSod({ ...Z, areas: [{ shape: "area", directSqFt: a }], ...over });

describe("sod - known answers", () => {
  it("piece sizes: slab 16x24 = 2.67 sq ft, roll 2x5 = 10 sq ft", () => {
    expect(round(SLAB, 2)).toBe(2.67);
    expect(ROLL).toBe(10);
  });

  it("example 1: 1,000 sq ft lawn -> order 1,050, 3 pallets, 394 slabs or 105 rolls", () => {
    const r = sqft(1000);
    expect(round(r.orderSqFt, 0)).toBe(1050);
    expect(r.pallets).toBe(3); // ceil(1050/450)=ceil(2.33)
    expect(r.pieces).toBe(394); // ceil(1050/2.6667)
    expect(sqft(1000, { pieceSqFt: ROLL }).pieces).toBe(105); // ceil(1050/10)
  });

  it("example 2: 50x30 minus 10x12 patio -> net 1,380, order 1,449, 4 pallets, 544 slabs or 145 rolls", () => {
    const r = computeSod({ ...Z, areas: [{ shape: "rectangle", lengthFt: 50, widthFt: 30, cutouts: [{ shape: "rectangle", lengthFt: 10, widthFt: 12 }] }] });
    expect(r.netSqFt).toBe(1380);
    expect(round(r.orderSqFt, 0)).toBe(1449);
    expect(r.pallets).toBe(4); // ceil(1449/450)=ceil(3.22)
    expect(r.pieces).toBe(544); // ceil(1449/2.6667)
    expect(computeSod({ ...Z, pieceSqFt: ROLL, areas: [{ shape: "rectangle", lengthFt: 50, widthFt: 30, cutouts: [{ shape: "rectangle", lengthFt: 10, widthFt: 12 }] }] }).pieces).toBe(145);
  });

  it("example 3: round area 20 ft across -> net 314.16, order 329.87, 1 pallet, 124 slabs or 33 rolls", () => {
    const r = computeSod({ ...Z, areas: [{ shape: "circle", diameterFt: 20 }] });
    expect(round(r.netSqFt, 2)).toBe(314.16);
    expect(round(r.orderSqFt, 2)).toBe(329.87);
    expect(r.pallets).toBe(1);
    expect(r.pieces).toBe(124); // ceil(329.87/2.6667)
    expect(computeSod({ ...Z, pieceSqFt: ROLL, areas: [{ shape: "circle", diameterFt: 20 }] }).pieces).toBe(33);
  });

  it("FAQ: a 450 sq ft pallet holds about 169 slabs or 45 rolls", () => {
    expect(Math.ceil(450 / SLAB)).toBe(169); // 168.75 -> 169
    expect(450 / ROLL).toBe(45);
  });

  it("reference table: pallets (400/450/500) and slabs/rolls with 5% extra", () => {
    // [lawn, p400, p450, p500, slabs, rolls]
    const rows: [number, number, number, number, number, number][] = [
      [500, 2, 2, 2, 197, 53],
      [1000, 3, 3, 3, 394, 105],
      [2000, 6, 5, 5, 788, 210],
      [5000, 14, 12, 11, 1969, 525],
    ];
    for (const [lawn, p400, p450, p500, slabs, rolls] of rows) {
      expect(sqft(lawn, { palletSqFt: 400 }).pallets, `${lawn}@400`).toBe(p400);
      expect(sqft(lawn, { palletSqFt: 450 }).pallets, `${lawn}@450`).toBe(p450);
      expect(sqft(lawn, { palletSqFt: 500 }).pallets, `${lawn}@500`).toBe(p500);
      expect(sqft(lawn, { pieceSqFt: SLAB }).pieces, `${lawn} slabs`).toBe(slabs);
      expect(sqft(lawn, { pieceSqFt: ROLL }).pieces, `${lawn} rolls`).toBe(rolls);
    }
  });

  it("ceilCount is exact: 1,050 / 10 = 105 rolls, not 106", () => {
    expect(sqft(1000, { pieceSqFt: ROLL }).pieces).toBe(105);
  });

  it("cut-outs subtract from the net area", () => {
    expect(cutoutArea({ shape: "rectangle", lengthFt: 10, widthFt: 12 })).toBe(120);
    expect(cutoutArea({ shape: "circle", diameterFt: 2 })).toBeCloseTo(Math.PI, 5);
    const net = sodArea({ shape: "rectangle", lengthFt: 50, widthFt: 30, cutouts: [{ shape: "rectangle", lengthFt: 10, widthFt: 12 }] });
    expect(net).toBe(1380);
  });

  it("material cost: per sq ft, or per pallet when a pallet price is given", () => {
    const perSqFt = sqft(1000, { pricePerSqFt: 0.5 });
    expect(perSqFt.materialCost).toBeCloseTo(1050 * 0.5, 4); // 525
    const perPallet = sqft(1000, { pricePerPallet: 300, deliveryFee: 80 });
    expect(perPallet.materialCost).toBe(3 * 300 + 80); // 980
  });

  it("installed estimate = order sq ft x installed price", () => {
    expect(round(sqft(1000, { installedPerSqFt: 1.5 }).installedCost, 2)).toBe(1575);
  });

  it("sums several areas", () => {
    const r = computeSod({ ...Z, areas: [{ shape: "area", directSqFt: 600 }, { shape: "rectangle", lengthFt: 20, widthFt: 20 }] });
    expect(r.netSqFt).toBe(1000);
  });

  it("zero / empty input is safe", () => {
    const z = computeSod({ ...Z, areas: [] });
    expect(z.orderSqFt).toBe(0);
    expect(z.pallets).toBe(0);
    expect(z.pieces).toBe(0);
    expect(z.materialCost).toBe(0);
  });
});
