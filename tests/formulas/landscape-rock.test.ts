import { describe, it, expect } from "vitest";
import { round } from "@/lib/formulas/units";
import {
  computeRock,
  rockArea,
  cutoutArea,
  coveragePerTon,
  ROCK_TYPES,
  type RockInput,
} from "@/lib/formulas/landscapeRock";

/**
 * Landscape Rock Calculator — known-answer tests (batch3 day5).
 * Every worked example, reference-table value and FAQ number is asserted here.
 * Densities: river rock 1.35 (shared), lava rock 0.55, pebbles/marble 1.40.
 */

const D = {
  river: ROCK_TYPES.riverRock.density,
  lava: ROCK_TYPES.lavaRock.density,
  pebbles: ROCK_TYPES.beachPebbles.density,
  marble: ROCK_TYPES.marbleChips.density,
};

const Z: RockInput = {
  areas: [],
  depthIn: 3,
  wastePct: 0,
  bagSizeCuFt: 0.5,
  densityTonsPerCuYd: D.river,
  pricePerTon: 80,
  pricePerBag: 7,
};
const rect = (L: number, W: number, over: Partial<RockInput> = {}) =>
  computeRock({ ...Z, areas: [{ shape: "rectangle", lengthFt: L, widthFt: W }], ...over });
const circle = (dia: number, over: Partial<RockInput> = {}) =>
  computeRock({ ...Z, areas: [{ shape: "circle", diameterFt: dia }], ...over });
const sqft = (a: number, over: Partial<RockInput> = {}) =>
  computeRock({ ...Z, areas: [{ shape: "area", directSqFt: a }], ...over });

describe("landscape rock — known answers", () => {
  it("densities: river 1.35 (shared), lava 0.55, pebbles 1.40, marble 1.40", () => {
    expect(D.river).toBe(1.35);
    expect(D.lava).toBe(0.55);
    expect(D.pebbles).toBe(1.4);
    expect(D.marble).toBe(1.4);
  });

  it("example 1: 10x20 bed, 3 in = 50 cu ft, 1.85 cu yd, river 2.50 tons, 100 bags", () => {
    const r = rect(10, 20);
    expect(r.cubicFeet).toBe(50);
    expect(round(r.cubicYards, 2)).toBe(1.85);
    expect(round(r.tons, 2)).toBe(2.5);
    expect(r.bags).toBe(100); // ceil(50 / 0.5)
  });

  it("example 1: lava 1.02 tons, pebbles/marble 2.59 tons (same bed)", () => {
    expect(round(rect(10, 20, { densityTonsPerCuYd: D.lava }).tons, 2)).toBe(1.02);
    expect(round(rect(10, 20, { densityTonsPerCuYd: D.pebbles }).tons, 2)).toBe(2.59);
    expect(round(rect(10, 20, { densityTonsPerCuYd: D.marble }).tons, 2)).toBe(2.59);
  });

  it("example 1 with 10% waste: 2.04 cu yd, river 2.75 tons, 110 bags", () => {
    const r = rect(10, 20, { wastePct: 10 });
    expect(round(r.cubicYardsWithWaste, 2)).toBe(2.04);
    expect(round(r.tonsWithWaste, 2)).toBe(2.75);
    expect(r.bagsWithWaste).toBe(110); // ceil(55 / 0.5)
  });

  it("example 2: tree ring 6 ft across, 3 in = 7.07 cu ft, 0.26 cu yd, river 0.35 tons, 15 bags", () => {
    const r = circle(6);
    expect(round(r.cubicFeet, 2)).toBe(7.07);
    expect(round(r.cubicYards, 2)).toBe(0.26);
    expect(round(r.tons, 2)).toBe(0.35);
    expect(r.bags).toBe(15); // ceil(7.069 / 0.5)
  });

  it("coverage of 1 ton — river rock: 120 / 80 / 60 sq ft at 2 / 3 / 4 in", () => {
    expect(round(coveragePerTon(2, D.river), 0)).toBe(120);
    expect(round(coveragePerTon(3, D.river), 0)).toBe(80);
    expect(round(coveragePerTon(4, D.river), 0)).toBe(60);
  });

  it("coverage of 1 ton — lava rock: 295 / 196 / 147 sq ft at 2 / 3 / 4 in", () => {
    expect(round(coveragePerTon(2, D.lava), 0)).toBe(295);
    expect(round(coveragePerTon(3, D.lava), 0)).toBe(196);
    expect(round(coveragePerTon(4, D.lava), 0)).toBe(147);
  });

  it("coverage of 1 ton — pebbles / marble: 116 / 77 / 58 sq ft at 2 / 3 / 4 in", () => {
    expect(round(coveragePerTon(2, D.pebbles), 0)).toBe(116);
    expect(round(coveragePerTon(3, D.pebbles), 0)).toBe(77);
    expect(round(coveragePerTon(4, D.pebbles), 0)).toBe(58);
  });

  it("reference table: cu yd at 2/3 in, river & lava tons at 3 in (before waste)", () => {
    // [sqft, cy@2, cy@3, riverT@3, lavaT@3]
    const rows: [number, number, number, number, number][] = [
      [50, 0.31, 0.46, 0.6, 0.3],
      [100, 0.62, 0.93, 1.3, 0.5],
      [200, 1.23, 1.85, 2.5, 1.0],
      [500, 3.09, 4.63, 6.3, 2.5],
    ];
    for (const [a, cy2, cy3, rt3, lt3] of rows) {
      expect(round(sqft(a, { depthIn: 2 }).cubicYards, 2), `${a}@2 cy`).toBe(cy2);
      expect(round(sqft(a, { depthIn: 3 }).cubicYards, 2), `${a}@3 cy`).toBe(cy3);
      expect(round(sqft(a, { depthIn: 3, densityTonsPerCuYd: D.river }).tons, 1), `${a} riverT`).toBe(rt3);
      expect(round(sqft(a, { depthIn: 3, densityTonsPerCuYd: D.lava }).tons, 1), `${a} lavaT`).toBe(lt3);
    }
  });

  it("FAQ: a yard of river rock weighs about 1.35 tons = 2,700 lb", () => {
    expect(D.river * 2000).toBe(2700);
    // 10x20 at 3 in needs about 2.5 tons of river rock
    expect(round(rect(10, 20).tons, 1)).toBe(2.5);
  });

  it("cut-outs subtract from the area (plants and pavers)", () => {
    // rectangle cut-out 2x3 = 6 sq ft; circle cut-out 2 ft across = pi sq ft
    expect(cutoutArea({ shape: "rectangle", lengthFt: 2, widthFt: 3 })).toBe(6);
    expect(cutoutArea({ shape: "circle", diameterFt: 2 })).toBeCloseTo(Math.PI, 5);
    expect(cutoutArea({ shape: "area", directSqFt: 9 })).toBe(9);
    const net = rockArea({
      shape: "rectangle",
      lengthFt: 10,
      widthFt: 20,
      cutouts: [
        { shape: "rectangle", lengthFt: 2, widthFt: 3 },
        { shape: "circle", diameterFt: 2 },
      ],
    });
    expect(net).toBeCloseTo(200 - 6 - Math.PI, 5);
    // cut-outs never drive area below zero
    expect(rockArea({ shape: "area", directSqFt: 5, cutouts: [{ shape: "area", directSqFt: 9 }] })).toBe(0);
  });

  it("sums several areas", () => {
    const r = computeRock({
      ...Z,
      areas: [
        { shape: "rectangle", lengthFt: 10, widthFt: 20 },
        { shape: "area", directSqFt: 100 },
      ],
    });
    expect(r.areaSqFt).toBe(300);
    expect(r.cubicFeet).toBe(75); // 300 x 3/12
  });

  it("bulk vs bagged: bulk is far cheaper for the default bed, label follows the price", () => {
    const r = rect(10, 20, { wastePct: 10 }); // 2.75 t bulk @ $80; 110 bags @ $7
    expect(Math.round(r.bulkCost)).toBe(220);
    expect(r.baggedCost).toBe(770);
    expect(r.cheaper).toBe("bulk");
    // flip the prices and bagged wins
    const b = rect(10, 20, { wastePct: 10, pricePerTon: 1000, pricePerBag: 1 });
    expect(b.cheaper).toBe("bagged");
  });

  it("custom density and empty input are safe", () => {
    expect(rect(10, 20, { densityTonsPerCuYd: 2600 / 2000 }).tons).toBeCloseTo(1.8519 * 1.3, 3);
    const z = computeRock({ ...Z, areas: [] });
    expect(z.tons).toBe(0);
    expect(z.bags).toBe(0);
    expect(z.bulkCost).toBe(0);
    expect(Number.isFinite(z.coveragePerTon)).toBe(true);
  });
});
