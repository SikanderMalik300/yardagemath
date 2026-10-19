import { describe, it, expect } from "vitest";
import { round } from "@/lib/formulas/units";
import { FILL_DIRT_DENSITY, FILL_COMPACTION_PCT, FILL_TRUCKLOADS } from "@/lib/constants";
import { computeFillDirt, fillAreaCuFt, type FillDirtInput } from "@/lib/formulas/fillDirt";

/**
 * Fill Dirt Calculator — known-answer tests (batch3 day4).
 * Every worked example, reference-table value and FAQ number is asserted here.
 * 20% compaction, 1.2 t/yd, 10 cu yd loads.
 */

const Z: FillDirtInput = {
  areas: [], compactionPct: 20, density: FILL_DIRT_DENSITY.typical, // 1.2
  loadSizeCuYd: FILL_TRUCKLOADS.tandem, // 10
  pricePerCuYd: 15, deliveryPerLoad: 75,
};
const run = (areas: FillDirtInput["areas"], over: Partial<FillDirtInput> = {}) =>
  computeFillDirt({ ...Z, areas, ...over });

describe("fill dirt — known answers", () => {
  it("constants: typical 1.2 t/yd, wet 1.4, 20% compaction, loads 5/10/14", () => {
    expect(FILL_DIRT_DENSITY.typical).toBe(1.2);
    expect(FILL_DIRT_DENSITY.wet).toBe(1.4);
    expect(FILL_COMPACTION_PCT).toBe(20);
    expect(FILL_TRUCKLOADS.tandem).toBe(10);
    expect(FILL_TRUCKLOADS.small).toBe(5);
    expect(FILL_TRUCKLOADS.large).toBe(14);
  });

  it("example 1: raise 20x30 by 6 in = 300 cu ft, 11.11 cu yd, 13.33 with compaction, 16.0 tons, 2 loads", () => {
    const r = run([{ kind: "raise", lengthFt: 20, widthFt: 30, depthIn: 6 }]);
    expect(r.cubicFeet).toBe(300);
    expect(round(r.cubicYards, 2)).toBe(11.11);
    expect(round(r.cubicYardsCompacted, 2)).toBe(13.33);
    expect(round(r.tons, 1)).toBe(16.0);
    expect(r.loads).toBe(2);
  });

  it("example 2: fill a 4x4x3 ft hole = 48 cu ft, 1.78 cu yd, 2.13 compacted, 2.56 tons", () => {
    const r = run([{ kind: "hole", lengthFt: 4, widthFt: 4, depthFt: 3 }]);
    expect(r.cubicFeet).toBe(48);
    expect(round(r.cubicYards, 2)).toBe(1.78);
    expect(round(r.cubicYardsCompacted, 2)).toBe(2.13);
    expect(round(r.tons, 2)).toBe(2.56);
  });

  it("example 3: round hole 3 ft across, 4 ft deep = 28.27 cu ft, 1.05 cu yd, 1.26 compacted, 1.51 tons", () => {
    const r = run([{ kind: "round", diameterFt: 3, depthFt: 4 }]);
    expect(round(r.cubicFeet, 2)).toBe(28.27);
    expect(round(r.cubicYards, 2)).toBe(1.05);
    expect(round(r.cubicYardsCompacted, 2)).toBe(1.26);
    expect(round(r.tons, 2)).toBe(1.51);
  });

  it("example 4: sloped 10x40, 0 to 12 in (avg 6) = 200 cu ft, 7.41 cu yd, 8.89 compacted, 10.67 tons", () => {
    const r = run([{ kind: "sloped", lengthFt: 10, widthFt: 40, depth1In: 0, depth2In: 12 }]);
    expect(r.cubicFeet).toBe(200);
    expect(round(r.cubicYards, 2)).toBe(7.41);
    expect(round(r.cubicYardsCompacted, 2)).toBe(8.89);
    expect(round(r.tons, 2)).toBe(10.67);
  });

  it("reference table: cubic yards with 20% compaction by area and depth", () => {
    // [sqft, 2in, 4in, 6in, 12in]
    const rows: [number, number, number, number, number][] = [
      [100, 0.7, 1.5, 2.2, 4.4],
      [500, 3.7, 7.4, 11.1, 22.2],
      [1000, 7.4, 14.8, 22.2, 44.4],
      [2000, 14.8, 29.6, 44.4, 88.9],
    ];
    for (const [a, d2, d4, d6, d12] of rows) {
      for (const [depth, v] of [[2, d2], [4, d4], [6, d6], [12, d12]] as const) {
        const r = run([{ kind: "raise", useSqFt: true, directSqFt: a, depthIn: depth }]);
        expect(round(r.cubicYardsCompacted, 1), `${a}@${depth}`).toBe(v);
      }
    }
  });

  it("FAQ: raise 20x30 by 6 in is about 13.3 cu yd; 4x4x3 hole about 2.1 cu yd", () => {
    expect(round(run([{ kind: "raise", lengthFt: 20, widthFt: 30, depthIn: 6 }]).cubicYardsCompacted, 1)).toBe(13.3);
    expect(round(run([{ kind: "hole", lengthFt: 4, widthFt: 4, depthFt: 3 }]).cubicYardsCompacted, 1)).toBe(2.1);
  });

  it("FAQ: a yard of typical fill dirt weighs about 1.2 tons (2,400 lb)", () => {
    expect(1.2 * 2000).toBe(2400);
    const r = run([{ kind: "raise", useSqFt: true, directSqFt: 81, depthIn: 4 }]); // 1 cu yd before compaction
    expect(round(r.cubicYards, 2)).toBe(1);
  });

  it("wet/clay dirt weighs more than typical for the same volume", () => {
    const typical = run([{ kind: "hole", lengthFt: 4, widthFt: 4, depthFt: 3 }]).tons;
    const wet = run([{ kind: "hole", lengthFt: 4, widthFt: 4, depthFt: 3 }], { density: FILL_DIRT_DENSITY.wet }).tons;
    expect(wet).toBeGreaterThan(typical);
  });

  it("truckloads scale with load size; small 5 cu yd needs more loads", () => {
    const big = run([{ kind: "raise", lengthFt: 20, widthFt: 30, depthIn: 6 }]); // 13.33 compacted
    expect(big.loads).toBe(2); // ceil(13.33/10)
    expect(run([{ kind: "raise", lengthFt: 20, widthFt: 30, depthIn: 6 }], { loadSizeCuYd: 5 }).loads).toBe(3); // ceil(13.33/5)
  });

  it("cost = compacted cu yd x price + loads x delivery", () => {
    const r = run([{ kind: "raise", lengthFt: 20, widthFt: 30, depthIn: 6 }]);
    expect(r.cost).toBeCloseTo(r.cubicYardsCompacted * 15 + r.loads * 75, 2);
  });

  it("fillAreaCuFt handles each shape; sums several areas; zero-safe", () => {
    expect(fillAreaCuFt({ kind: "raise", useSqFt: true, directSqFt: 100, depthIn: 6 })).toBe(50);
    expect(round(fillAreaCuFt({ kind: "round", diameterFt: 3, depthFt: 4 }), 2)).toBe(28.27);
    const r = run([
      { kind: "hole", lengthFt: 4, widthFt: 4, depthFt: 3 },
      { kind: "raise", lengthFt: 20, widthFt: 30, depthIn: 6 },
    ]);
    expect(r.cubicFeet).toBe(348); // 48 + 300
    const empty = run([]);
    expect(empty.tons).toBe(0);
    expect(empty.loads).toBe(0);
  });
});
