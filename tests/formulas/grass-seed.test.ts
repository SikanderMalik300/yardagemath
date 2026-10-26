import { describe, it, expect } from "vitest";
import { round } from "@/lib/formulas/units";
import { computeGrassSeed, grassArea, GRASS_SEED_TYPES, type GrassSeedInput } from "@/lib/formulas/grassSeed";

/**
 * Grass Seed Calculator - known-answer tests (batch4 day4).
 * Rates in lb per 1,000 sq ft. Every worked example, reference-table value and
 * FAQ number is asserted here.
 */

const R = {
  tallFescue: GRASS_SEED_TYPES.tallFescue,
  bluegrass: GRASS_SEED_TYPES.bluegrass,
  ryegrass: GRASS_SEED_TYPES.ryegrass,
  fineFescue: GRASS_SEED_TYPES.fineFescue,
  bermuda: GRASS_SEED_TYPES.bermuda,
  zoysia: GRASS_SEED_TYPES.zoysia,
  centipede: GRASS_SEED_TYPES.centipede,
  bahia: GRASS_SEED_TYPES.bahia,
};

const run = (sqft: number, ratePer1000: number, bagLb: number, pricePerBag = 70) =>
  computeGrassSeed({ areas: [{ shape: "area", directSqFt: sqft }], ratePer1000, bagLb, pricePerBag });

describe("grass seed - known answers", () => {
  it("rates: tall fescue 7/4, KBG 2.5/1.5, ryegrass 7/4, fine fescue 4/2, bermuda 1.5, zoysia 1, centipede 0.5, bahia 8", () => {
    expect([R.tallFescue.newLawn, R.tallFescue.overseed]).toEqual([7, 4]);
    expect([R.bluegrass.newLawn, R.bluegrass.overseed]).toEqual([2.5, 1.5]);
    expect([R.ryegrass.newLawn, R.ryegrass.overseed]).toEqual([7, 4]);
    expect([R.fineFescue.newLawn, R.fineFescue.overseed]).toEqual([4, 2]);
    expect(R.bermuda.newLawn).toBe(1.5);
    expect(R.zoysia.newLawn).toBe(1);
    expect(R.centipede.newLawn).toBe(0.5);
    expect(R.bahia.newLawn).toBe(8);
    expect(R.bermuda.overseed).toBeNull();
  });

  it("example 1: 5,000 sq ft new tall fescue (7) = 35 lb -> 2 bags of 20 (5 lb left) or 1 bag of 50", () => {
    const r = run(5000, 7, 20);
    expect(r.pounds).toBe(35);
    expect(r.bags).toBe(2);
    expect(r.leftoverLb).toBe(5);
    expect(run(5000, 7, 50).bags).toBe(1);
  });

  it("example 2: 5,000 sq ft overseed tall fescue (4) = 20 lb -> 1 bag of 20", () => {
    const r = run(5000, 4, 20);
    expect(r.pounds).toBe(20);
    expect(r.bags).toBe(1);
  });

  it("example 3: 2,000 sq ft overseed Kentucky bluegrass (1.5) = 3 lb -> 1 bag of 3", () => {
    const r = run(2000, 1.5, 3);
    expect(r.pounds).toBe(3);
    expect(r.bags).toBe(1);
  });

  it("example 4: bare patch 10 x 20 ft, perennial ryegrass (7) = 200 sq ft -> 1.4 lb -> 1 bag of 3", () => {
    const r = computeGrassSeed({ areas: [{ shape: "rectangle", lengthFt: 10, widthFt: 20 }], ratePer1000: 7, bagLb: 3, pricePerBag: 18 });
    expect(round(r.pounds, 2)).toBe(1.4);
    expect(r.bags).toBe(1);
  });

  it("example 5: 1 acre new bermudagrass (1.5) = 43,560 sq ft -> 65.34 lb -> 2 bags of 50", () => {
    const r = computeGrassSeed({ areas: [{ shape: "acres", acres: 1 }], ratePer1000: 1.5, bagLb: 50, pricePerBag: 130 });
    expect(r.netSqFt).toBe(43560);
    expect(round(r.pounds, 2)).toBe(65.34);
    expect(r.bags).toBe(2);
  });

  it("FAQ: an acre of tall fescue (7) is about 305 lb; bermuda (1.5) about 65 lb", () => {
    expect(round((43560 / 1000) * 7, 0)).toBe(305);
    expect(round((43560 / 1000) * 1.5, 0)).toBe(65);
  });

  it("reference table: new-lawn pounds for a 5,000 sq ft lawn by grass", () => {
    const rows: [number, number][] = [
      [R.bluegrass.newLawn, 12.5],
      [R.tallFescue.newLawn, 35],
      [R.ryegrass.newLawn, 35],
      [R.fineFescue.newLawn, 20],
      [R.bermuda.newLawn, 7.5],
      [R.zoysia.newLawn, 5],
      [R.centipede.newLawn, 2.5],
      [R.bahia.newLawn, 40],
    ];
    for (const [rate, lb] of rows) {
      expect(round(run(5000, rate, 20).pounds, 2), `rate ${rate}`).toBe(lb);
    }
  });

  it("leftover = bags x bag lb - pounds", () => {
    const r = run(5000, 7, 20); // 35 lb, 2 bags of 20 = 40, leftover 5
    expect(r.leftoverLb).toBe(5);
  });

  it("cost = bags x price per bag", () => {
    expect(run(5000, 7, 20, 70).cost).toBe(2 * 70);
  });

  it("acres area converts at 43,560 sq ft; cut-outs subtract", () => {
    expect(grassArea({ shape: "acres", acres: 2 })).toBe(87120);
    const net = grassArea({ shape: "rectangle", lengthFt: 100, widthFt: 100, cutouts: [{ shape: "rectangle", lengthFt: 20, widthFt: 25 }] });
    expect(net).toBe(9500);
  });

  it("ceilCount rounds bags up and zero input is safe", () => {
    expect(run(1000, 7, 20).bags).toBe(1); // 7 lb -> 1 bag
    const z = computeGrassSeed({ areas: [], ratePer1000: 7, bagLb: 20, pricePerBag: 70 });
    expect(z.pounds).toBe(0);
    expect(z.bags).toBe(0);
    expect(z.cost).toBe(0);
  });
});
