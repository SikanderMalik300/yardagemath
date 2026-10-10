import { describe, it, expect } from "vitest";
import { round, floorCount } from "@/lib/formulas/units";
import { computeBlockWeight, unitWeightLb, type BlockWeightInput } from "@/lib/formulas/blockWeight";

/**
 * Concrete Block Weight — known-answer tests (next-5 page 14).
 * Every chart value, worked example and FAQ number is asserted here.
 * Weights verified 10 Oct 2026 against Terrehill (manufacturer), the ESCSI/NCMA
 * unit-weight study, and ASTM C90 density classes (Masonry Institute of Michigan).
 */

const run = (over: Partial<BlockWeightInput>) =>
  computeBlockWeight({
    block: "8x8x16",
    weightClass: "normal",
    quantity: 1,
    blocksPerPallet: 90,
    payloadLb: 1500,
    ...over,
  });

describe("concrete block weight — known answers", () => {
  it("chart: 8x8x16 standard = 38 lb normal, 28 lb lightweight", () => {
    expect(unitWeightLb("8x8x16", "normal")).toBe(38);
    expect(unitWeightLb("8x8x16", "light")).toBe(28);
  });

  it("chart: 4x8x16 = 26 / 19 lb", () => {
    expect(unitWeightLb("4x8x16", "normal")).toBe(26);
    expect(unitWeightLb("4x8x16", "light")).toBe(19);
  });

  it("chart: 6x8x16 = 32 / 24 lb", () => {
    expect(unitWeightLb("6x8x16", "normal")).toBe(32);
    expect(unitWeightLb("6x8x16", "light")).toBe(24);
  });

  it("chart: 10x8x16 = 45 / 33 lb", () => {
    expect(unitWeightLb("10x8x16", "normal")).toBe(45);
    expect(unitWeightLb("10x8x16", "light")).toBe(33);
  });

  it("chart: 12x8x16 = 52 / 38 lb", () => {
    expect(unitWeightLb("12x8x16", "normal")).toBe(52);
    expect(unitWeightLb("12x8x16", "light")).toBe(38);
  });

  it("chart: 8x8x8 half block = 19 / 14 lb", () => {
    expect(unitWeightLb("half", "normal")).toBe(19);
    expect(unitWeightLb("half", "light")).toBe(14);
  });

  it("chart: 8x8x16 solid = 65 lb, no lightweight (falls back to normal)", () => {
    expect(unitWeightLb("solid", "normal")).toBe(65);
    expect(unitWeightLb("solid", "light")).toBe(65);
  });

  it("worked example 1: 142 blocks x 38 lb = 5,396 lb = 2.70 tons", () => {
    const r = run({ quantity: 142 });
    expect(r.totalLb).toBe(5396);
    expect(round(r.tons, 2)).toBe(2.7);
  });

  it("worked example 2: pallet of 90 x 38 = 3,420 lb; 1,500-lb payload -> 39 blocks per trip", () => {
    const r = run({ quantity: 90 });
    expect(r.palletLb).toBe(3420);
    expect(r.blocksPerTrip).toBe(39); // floor(1500 / 38) = floor(39.47)
  });

  it("FAQ: a pallet of 90 standard blocks is roughly 3,400 lb", () => {
    expect(run({ quantity: 90 }).palletLb).toBeCloseTo(3400, -2);
  });

  it("FAQ: a half-ton pickup carries about 39 standard 38-lb blocks", () => {
    expect(run({ quantity: 90 }).blocksPerTrip).toBe(39);
  });

  it("FAQ: a pallet of 12-inch block tops 4,000 lb (90 x 52 = 4,680)", () => {
    const r = run({ block: "12x8x16", quantity: 90 });
    expect(r.palletLb).toBe(4680);
  });

  it("floorCount: 1,500 / 38 = 39 (rounds down)", () => {
    expect(floorCount(1500 / 38)).toBe(39);
  });

  it("floorCount clears float noise at an exact boundary: 1,500 / 37.5 = 40", () => {
    // 1500 / 37.5 === 40 mathematically; guard against 39.999999999 -> 39
    expect(floorCount(1500 / 37.5)).toBe(40);
    expect(floorCount(40.0000001)).toBe(40);
    expect(floorCount(39.9999999)).toBe(40); // within 1e-6 rounds up to 40 then floors
  });

  it("tons: 200 twelve-inch blocks x 52 = 10,400 lb = 5.2 tons", () => {
    const r = run({ block: "12x8x16", quantity: 200 });
    expect(r.totalLb).toBe(10400);
    expect(round(r.tons, 2)).toBe(5.2);
  });

  it("lightweight is about 10 lb lighter per 8-inch block", () => {
    expect(unitWeightLb("8x8x16", "normal") - unitWeightLb("8x8x16", "light")).toBe(10);
  });

  it("zero / empty input is safe (no NaN)", () => {
    const r = run({ quantity: 0 });
    expect(r.totalLb).toBe(0);
    expect(r.tons).toBe(0);
    expect(Number.isFinite(r.blocksPerTrip)).toBe(true);
  });

  it("custom payload: 3,000-lb trailer carries 78 standard blocks", () => {
    expect(run({ payloadLb: 3000 }).blocksPerTrip).toBe(78); // floor(3000/38)=78
  });
});
