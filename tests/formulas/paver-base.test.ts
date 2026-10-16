import { describe, it, expect } from "vitest";
import { round } from "@/lib/formulas/units";
import { DENSITY_TONS_PER_CUYD, PAVER_BASE_PROJECTS, PAVER_BASE_COMPACTION_PCT, PAVER_BASE_BAG_CUFT } from "@/lib/constants";
import { computePaverBase, type PaverBaseInput } from "@/lib/formulas/paverBase";

/**
 * Paver Base Calculator — known-answer tests (batch3 day2).
 * Every worked example, reference-table value and FAQ number is asserted here.
 * Crusher run 1.5 t/yd, 20% compaction, 0.5 cu ft bags.
 */

const Z: PaverBaseInput = {
  areas: [], baseDepthIn: 4, compactionPct: 20,
  baseDensity: DENSITY_TONS_PER_CUYD.crusherRun, // 1.5
  sandDepthIn: 1, sandWastePct: 10, sandDensity: DENSITY_TONS_PER_CUYD.sand, // 1.35
  bagCuFt: 0.5, basePricePerTon: 45, basePricePerBag: 6, sandPricePerBag: 6,
};
const rect = (L: number, W: number, over: Partial<PaverBaseInput> = {}) =>
  computePaverBase({ ...Z, areas: [{ shape: "rectangle", lengthFt: L, widthFt: W }], ...over });
const sqft = (a: number, over: Partial<PaverBaseInput> = {}) =>
  computePaverBase({ ...Z, areas: [{ shape: "area", directSqFt: a }], ...over });

describe("paver base — known answers", () => {
  it("constants: project depths 4/4/6/8, compaction 20, bag 0.5", () => {
    expect(PAVER_BASE_PROJECTS.walkway.depthIn).toBe(4);
    expect(PAVER_BASE_PROJECTS.patio.depthIn).toBe(4);
    expect(PAVER_BASE_PROJECTS.patioClay.depthIn).toBe(6);
    expect(PAVER_BASE_PROJECTS.driveway.depthIn).toBe(8);
    expect(PAVER_BASE_COMPACTION_PCT).toBe(20);
    expect(PAVER_BASE_BAG_CUFT).toBe(0.5);
  });

  it("example 1: patio 12x12, 4 in base = 57.6 cu ft loose, 2.13 cu yd, 3.20 tons, 116 bags; sand 0.60 t, 27 bags", () => {
    const r = rect(12, 12);
    expect(round(r.baseCuFtLoose, 1)).toBe(57.6); // 48 x 1.2
    expect(round(r.baseCuYd, 2)).toBe(2.13);
    expect(round(r.baseTons, 2)).toBe(3.2);
    expect(r.baseBags).toBe(116); // ceil(57.6 / 0.5)
    expect(round(r.sandTons, 2)).toBe(0.6);
    expect(r.sandBags).toBe(27); // ceil(12 * 1.1 / 0.5)
  });

  it("example 2: walkway 3x30, 4 in base = 36 cu ft loose, 1.33 cu yd, 2.00 tons, 72 bags", () => {
    const r = rect(3, 30);
    expect(round(r.baseCuFtLoose, 1)).toBe(36); // 30 x 1.2
    expect(round(r.baseCuYd, 2)).toBe(1.33);
    expect(round(r.baseTons, 2)).toBe(2.0);
    expect(r.baseBags).toBe(72);
  });

  it("example 3: driveway 12x40, 8 in base = 384 cu ft loose, 14.22 cu yd, 21.33 tons", () => {
    const r = rect(12, 40, { baseDepthIn: 8 });
    expect(round(r.baseCuFtLoose, 1)).toBe(384); // 320 x 1.2
    expect(round(r.baseCuYd, 2)).toBe(14.22);
    expect(round(r.baseTons, 2)).toBe(21.33);
  });

  it("example 4: no compaction (0%), 12x12 at 4 in = 1.78 cu yd, 2.67 tons", () => {
    const r = rect(12, 12, { compactionPct: 0 });
    expect(round(r.baseCuYd, 2)).toBe(1.78);
    expect(round(r.baseTons, 2)).toBe(2.67);
  });

  it("reference table: base tons (crusher run, 20% compaction) at 4/6/8 in", () => {
    // [sqft, 4in, 6in, 8in]
    const rows: [number, number, number, number][] = [
      [100, 2.2, 3.3, 4.4],
      [200, 4.4, 6.7, 8.9],
      [500, 11.1, 16.7, 22.2],
      [1000, 22.2, 33.3, 44.4],
    ];
    for (const [a, t4, t6, t8] of rows) {
      expect(round(sqft(a, { baseDepthIn: 4 }).baseTons, 1), `${a}@4`).toBe(t4);
      expect(round(sqft(a, { baseDepthIn: 6 }).baseTons, 1), `${a}@6`).toBe(t6);
      expect(round(sqft(a, { baseDepthIn: 8 }).baseTons, 1), `${a}@8`).toBe(t8);
    }
  });

  it("FAQ: 12x12 patio at 4 in needs about 3.2 tons and 116 bags", () => {
    expect(round(rect(12, 12).baseTons, 1)).toBe(3.2);
    expect(rect(12, 12).baseBags).toBe(116);
  });

  it("FAQ: 12x40 driveway at 8 in needs about 14.2 cu yd / 21.3 tons", () => {
    const r = rect(12, 40, { baseDepthIn: 8 });
    expect(round(r.baseCuYd, 1)).toBe(14.2);
    expect(round(r.baseTons, 1)).toBe(21.3);
  });

  it("#57 base is lighter than crusher run for the same volume", () => {
    const run = rect(12, 12).baseTons;
    const stone57 = rect(12, 12, { baseDensity: DENSITY_TONS_PER_CUYD.crushedStone }).baseTons;
    expect(stone57).toBeLessThan(run);
    expect(round(stone57, 2)).toBe(round(2.133 * 1.4, 2)); // 2.99
  });

  it("bulk vs bagged: bulk wins once the base is more than about a ton", () => {
    const r = rect(12, 12); // 3.2 t base
    expect(r.cheaper).toBe("bulk");
    expect(r.bulkCost).toBeLessThan(r.baggedCost);
  });

  it("cost = base (bulk or bagged) + sand bags", () => {
    const r = rect(12, 12);
    expect(r.bulkCost).toBeCloseTo(r.baseTons * 45 + r.sandBags * 6, 2);
    expect(r.baggedCost).toBeCloseTo(r.baseBags * 6 + r.sandBags * 6, 2);
  });

  it("sums several areas and is zero-safe when empty", () => {
    const r = computePaverBase({ ...Z, areas: [
      { shape: "rectangle", lengthFt: 12, widthFt: 12 },
      { shape: "area", directSqFt: 56 },
    ] });
    expect(r.areaSqFt).toBe(200);
    const empty = computePaverBase({ ...Z, areas: [] });
    expect(empty.baseTons).toBe(0);
    expect(empty.baseBags).toBe(0);
    expect(Number.isFinite(empty.bulkCost)).toBe(true);
  });
});
