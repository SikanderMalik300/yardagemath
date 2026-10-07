import { describe, it, expect } from "vitest";
import {
  areaSqFt,
  volumeCuFt,
  cubicYards,
  cubicMeters,
  withWaste,
  tons,
  bags,
} from "@/lib/formulas/volume";
import { feetInchesToFeet, round, sqFtToSqYd } from "@/lib/formulas/units";

describe("shared volume math", () => {
  it("rectangle area", () => {
    expect(areaSqFt("rectangle", { length: 10, width: 10 })).toBe(100);
  });

  it("circle area (10 ft diameter)", () => {
    expect(round(areaSqFt("circle", { diameter: 10 }), 2)).toBe(78.54);
  });

  it("triangle area", () => {
    expect(areaSqFt("triangle", { base: 10, height: 6 })).toBe(30);
  });

  it("volume cu ft from area + depth", () => {
    expect(volumeCuFt(100, 3)).toBe(25);
  });

  it("cubic yards from cubic feet", () => {
    expect(round(cubicYards(25), 2)).toBe(0.93);
  });

  it("cubic meters from cubic yards", () => {
    expect(round(cubicMeters(1), 2)).toBe(0.76);
  });

  it("withWaste applies percentage", () => {
    expect(withWaste(100, 5)).toBe(105);
    expect(withWaste(1.2346, 10)).toBeCloseTo(1.358, 3);
  });

  it("tons from cubic yards", () => {
    expect(round(tons(1.33, 1.4), 2)).toBe(1.86);
  });

  it("bags rounds up", () => {
    expect(bags(25, 2)).toBe(13);
    expect(bags(27, 2)).toBe(14);
    expect(bags(0, 2)).toBe(0);
  });

  it("feet + inches to decimal feet", () => {
    expect(feetInchesToFeet(10, 6)).toBe(10.5);
    expect(feetInchesToFeet(3, 0)).toBe(3);
  });

  it("handles inches over 12", () => {
    expect(feetInchesToFeet(3, 18)).toBe(4.5);
  });

  it("sq ft to sq yd", () => {
    expect(sqFtToSqYd(144)).toBe(16);
  });
});
