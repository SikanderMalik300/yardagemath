import { describe, it, expect } from "vitest";
import { round } from "@/lib/formulas/units";
import { PAVER_SIZES, PAVER_WASTE, DENSITY_TONS_PER_CUYD } from "@/lib/constants";
import { computePaver, paversPerSqFt, paverPerimeter, type PaverInput } from "@/lib/formulas/paver";

/**
 * Paver Calculator — known-answer tests (batch3 day1).
 * Every worked example, reference-table value and FAQ number is asserted here.
 */

const per = (k: keyof typeof PAVER_SIZES) => paversPerSqFt(PAVER_SIZES[k].lengthIn, PAVER_SIZES[k].widthIn);

const Z: PaverInput = {
  areas: [], cutouts: [], perSqFt: per("holland"), wastePct: 0,
  baseDepthIn: 4, baseDensity: DENSITY_TONS_PER_CUYD.crusherRun, // 1.5
  sandDepthIn: 1, sandDensity: DENSITY_TONS_PER_CUYD.sand, // 1.35
  sandBagCuFt: 0.5, baseCompactionPct: 20, sandWastePct: 10,
  priceMode: "perPaver", pricePerPaver: 0.65, pricePerSqFt: 4,
  basePricePerTon: 45, sandPricePerBag: 6,
};
const rect = (L: number, W: number, over: Partial<PaverInput> = {}) =>
  computePaver({ ...Z, areas: [{ shape: "rectangle", lengthFt: L, widthFt: W }], ...over });
const sqft = (a: number, over: Partial<PaverInput> = {}) =>
  computePaver({ ...Z, areas: [{ shape: "area", directSqFt: a }], ...over });

describe("paver — known answers", () => {
  it("pavers per sq ft from nominal size: 4.5 / 4.0 / 2.6667 / 1.0 / 0.5625 / 0.25", () => {
    expect(per("holland")).toBe(4.5);
    expect(per("square6")).toBe(4);
    expect(round(per("rect69"), 4)).toBe(2.6667);
    expect(per("slab12")).toBe(1);
    expect(per("slab16")).toBe(0.5625);
    expect(per("slab24")).toBe(0.25);
  });

  it("pattern waste: running bond 5, herringbone 10, diagonal 15", () => {
    expect(PAVER_WASTE.runningBond).toBe(5);
    expect(PAVER_WASTE.herringbone).toBe(10);
    expect(PAVER_WASTE.diagonal).toBe(15);
  });

  it("example 1: 12x12 patio, 4x8 pavers = 648; 681 at 5%, 713 at 10%", () => {
    expect(rect(12, 12).pavers).toBe(648); // 144 * 4.5
    expect(rect(12, 12, { wastePct: 5 }).paversWithWaste).toBe(681);
    expect(rect(12, 12, { wastePct: 10 }).paversWithWaste).toBe(713);
    expect(rect(12, 12).netAreaSqFt).toBe(144);
  });

  it("example 2: 12x12 with 6x9 pavers = 384; 404 at 5%", () => {
    expect(rect(12, 12, { perSqFt: per("rect69") }).pavers).toBe(384);
    expect(rect(12, 12, { perSqFt: per("rect69"), wastePct: 5 }).paversWithWaste).toBe(404);
  });

  it("example 3: 12x12 with 12x12 slabs = 144; 152 at 5%", () => {
    expect(rect(12, 12, { perSqFt: per("slab12") }).pavers).toBe(144);
    expect(rect(12, 12, { perSqFt: per("slab12"), wastePct: 5 }).paversWithWaste).toBe(152);
  });

  it("example 4: base for 144 sq ft at 4 in = 1.78 cu yd, 2.67 tons before compaction (3.20 t with 20%)", () => {
    const r = sqft(144);
    expect(round(r.baseCuYd, 2)).toBe(1.78);
    expect(round(r.baseTons, 2)).toBe(2.67);
    expect(round(r.baseTonsWithWaste, 2)).toBe(3.2); // 2.67 x 1.2
  });

  it("example 5: sand for 144 sq ft at 1 in = 0.44 cu yd, 0.60 tons, 24 bags (27 with 10%)", () => {
    const r = sqft(144);
    expect(round(r.sandCuYd, 2)).toBe(0.44);
    expect(round(r.sandTons, 2)).toBe(0.6);
    expect(r.sandBags).toBe(24);
    expect(r.sandBagsWithWaste).toBe(27);
  });

  it("example 6: edging for 12x12 = 48 linear ft", () => {
    expect(rect(12, 12).edgingLinearFt).toBe(48);
    expect(paverPerimeter({ shape: "rectangle", lengthFt: 12, widthFt: 12 })).toBe(48);
  });

  it("example 7: 10x20 patio, 4x8 = 900 pavers, 945 with 5%", () => {
    expect(rect(10, 20).pavers).toBe(900);
    expect(rect(10, 20, { wastePct: 5 }).paversWithWaste).toBe(945);
  });

  it("reference table: pavers before waste for 4x8 / 6x9 / 12x12 / 16x16", () => {
    // [sqft, 4x8, 6x9, 12x12, 16x16]
    const rows: [number, number, number, number, number][] = [
      [100, 450, 267, 100, 57],
      [200, 900, 534, 200, 113],
      [300, 1350, 800, 300, 169],
      [500, 2250, 1334, 500, 282],
    ];
    for (const [a, h, r69, s12, s16] of rows) {
      expect(sqft(a).pavers, `${a} 4x8`).toBe(h);
      expect(sqft(a, { perSqFt: per("rect69") }).pavers, `${a} 6x9`).toBe(r69);
      expect(sqft(a, { perSqFt: per("slab12") }).pavers, `${a} 12x12`).toBe(s12);
      expect(sqft(a, { perSqFt: per("slab16") }).pavers, `${a} 16x16`).toBe(s16);
    }
  });

  it("cut-outs are subtracted from the area", () => {
    const r = computePaver({ ...Z, areas: [{ shape: "rectangle", lengthFt: 12, widthFt: 12 }], cutouts: [{ widthFt: 4, heightFt: 4 }] });
    expect(r.netAreaSqFt).toBe(128); // 144 - 16
    expect(r.pavers).toBe(ceilPavers(128, 4.5));
  });

  it("material cost = pavers (with waste) x price + base + sand", () => {
    const r = rect(12, 12, { wastePct: 5 });
    expect(r.paverCost).toBeCloseTo(681 * 0.65, 2);
    expect(r.baseCost).toBeCloseTo(r.baseTonsWithWaste * 45, 2);
    expect(r.sandCost).toBeCloseTo(r.sandBagsWithWaste * 6, 2);
    expect(r.totalCost).toBeCloseTo(r.paverCost + r.baseCost + r.sandCost, 2);
  });

  it("zero / empty input is safe", () => {
    const r = computePaver({ ...Z, areas: [] });
    expect(r.pavers).toBe(0);
    expect(r.baseTons).toBe(0);
    expect(r.sandBags).toBe(0);
    expect(Number.isFinite(r.totalCost)).toBe(true);
  });
});

function ceilPavers(area: number, perSqFt: number) {
  return Math.ceil(area * perSqFt);
}
