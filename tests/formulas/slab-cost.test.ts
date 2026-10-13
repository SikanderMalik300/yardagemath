import { describe, it, expect } from "vitest";
import { round } from "@/lib/formulas/units";
import { PRICES } from "@/lib/constants";
import { computeConcreteSlab, concreteCostPerSqFt } from "@/lib/formulas/concreteSlab";

/**
 * Concrete Slab Cost upgrade (batch2 day4) — known-answer tests.
 * Covers Table A (material cost per sq ft), the cost-by-size table's concrete
 * cost and installed columns, and the quick-answer numbers.
 */

const PRICE = 160;
const LABOR = PRICES.concreteLaborPerSqFt; // 4.0 (HomeGuide midpoint of $3-5)
const REBAR = PRICES.rebarMeshPerSqFt; // 0.35 (welded wire mesh)

const slab = (L: number, W: number, installed: boolean) =>
  computeConcreteSlab({
    lengthFt: L, widthFt: W, thicknessIn: 4, wastePct: 10,
    supplyMode: "readymix", bagSize: "lb80", pricePerCuYd: PRICE, pricePerBag: 7,
    laborPerSqFt: installed ? LABOR : 0, rebarPerSqFt: installed ? REBAR : 0, gravelBaseDepthIn: 0,
  });

describe("slab cost — Table A: concrete material cost per sq ft", () => {
  it("defaults match the installed/mesh constants", () => {
    expect(LABOR).toBe(4);
    expect(REBAR).toBe(0.35);
  });

  it("4 / 5 / 6 in, no waste and with 10% waste, at $160/yd", () => {
    // [thickness, noWaste, withWaste]
    const rows: [number, number, number][] = [
      [4, 1.98, 2.17],
      [5, 2.47, 2.72],
      [6, 2.96, 3.26],
    ];
    for (const [t, noWaste, withWaste] of rows) {
      expect(round(concreteCostPerSqFt(t, PRICE, 0), 2), `${t}in no waste`).toBe(noWaste);
      expect(round(concreteCostPerSqFt(t, PRICE, 10), 2), `${t}in +10%`).toBe(withWaste);
    }
  });
});

describe("slab cost — cost by size (4 in, 10% waste, $160/yd)", () => {
  // [size, area, cuYdWaste, concreteCost, installed]
  const rows: [string, number, number, number, number, number][] = [
    ["10x10", 10, 1.36, 217, 652, 100],
    ["12x12", 12, 1.96, 313, 939, 144],
    ["16x16", 16, 3.48, 556, 1670, 256],
    ["20x20", 20, 5.43, 869, 2609, 400],
    ["24x24", 24, 7.82, 1252, 3757, 576],
    ["30x30", 30, 12.22, 1956, 5871, 900],
  ];

  for (const [name, side, cuYd, concreteCost, installed, area] of rows) {
    it(`${name}: ${cuYd} cu yd, $${concreteCost} concrete, $${installed} installed`, () => {
      const m = slab(side, side, false); // materials only
      const i = slab(side, side, true); // installed
      expect(i.areaSqFt).toBe(area);
      expect(round(m.cubicYardsWithWaste, 2), `${name} cu yd`).toBe(cuYd);
      expect(Math.round(m.materialCost), `${name} concrete cost`).toBe(concreteCost);
      expect(Math.round(m.totalCost), `${name} materials total`).toBe(concreteCost); // no labor/rebar
      expect(Math.round(i.totalCost), `${name} installed`).toBe(installed);
    });
  }
});

describe("slab cost — quick answer numbers", () => {
  it("10x10: ~$220 materials, ~$650 installed (to nearest $10), $2.17/sq ft materials", () => {
    const m = slab(10, 10, false);
    const i = slab(10, 10, true);
    expect(Math.round(m.totalCost / 10) * 10).toBe(220);
    expect(Math.round(i.totalCost / 10) * 10).toBe(650);
    expect(round(m.costPerSqFt, 2)).toBe(2.17);
  });
});
