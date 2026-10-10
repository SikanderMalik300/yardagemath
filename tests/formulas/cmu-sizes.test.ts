import { describe, it, expect } from "vitest";
import { feetInchesToFeet } from "@/lib/formulas/units";
import {
  actualInches,
  computeCmuConverter,
  CMU_COURSE_HEIGHT_IN,
  CMU_UNIT_LENGTH_IN,
  MORTAR_JOINT_IN,
} from "@/lib/formulas/cmuSizes";

/**
 * CMU Block Sizes — known-answer tests (next-5 page 15).
 * Every size-chart value, worked example and FAQ number is asserted here.
 * Sizes verified 10 Oct 2026 against NCMA TEK 2-1A and a Building Products Corp
 * manufacturer spec: actual = nominal − 3/8 in.; 8×8×16 nominal = 7⅝×7⅝×15⅝.
 */

const conv = (hIn: number, lIn: number) =>
  computeCmuConverter({ wallHeightIn: hIn, wallLengthIn: lIn });

describe("cmu block sizes — known answers", () => {
  it("actual = nominal − 3/8 in. (mortar joint)", () => {
    expect(MORTAR_JOINT_IN).toBe(0.375);
    expect(actualInches(8)).toBe(7.625); // 7 5/8
    expect(actualInches(16)).toBe(15.625); // 15 5/8
    expect(actualInches(4)).toBe(3.625); // 3 5/8
  });

  it("size chart widths: actual width for 4,6,8,10,12 in nominal", () => {
    expect(actualInches(4)).toBe(3.625); // 3 5/8
    expect(actualInches(6)).toBe(5.625); // 5 5/8
    expect(actualInches(8)).toBe(7.625); // 7 5/8
    expect(actualInches(10)).toBe(9.625); // 9 5/8
    expect(actualInches(12)).toBe(11.625); // 11 5/8
  });

  it("half block 8×8×8 actual = 7 5/8 × 7 5/8 × 7 5/8", () => {
    expect(actualInches(8)).toBe(7.625);
  });

  it("half-high 8×4×16 actual height = 3 5/8 in.", () => {
    expect(actualInches(4)).toBe(3.625); // height 4 → 3 5/8
    expect(actualInches(16)).toBe(15.625); // length 16 → 15 5/8
  });

  it("course and unit modules are 8 and 16 inches", () => {
    expect(CMU_COURSE_HEIGHT_IN).toBe(8);
    expect(CMU_UNIT_LENGTH_IN).toBe(16);
  });

  it("worked example 1: 6 ft wall = 9 courses, built height exactly 6 ft", () => {
    // 72 / 8 = 9 courses; 9 × 8 = 72 in = 6 ft
    const r = conv(72, 0);
    expect(r.courses).toBe(9);
    expect(r.builtHeightIn).toBe(72);
    expect(r.builtHeightIn / 12).toBe(6);
  });

  it("worked example 2: 52 in wall = 7 courses (56 in)", () => {
    // 52 / 8 = 6.5 -> 7 courses; 7 × 8 = 56 in
    const r = conv(52, 0);
    expect(r.courses).toBe(7);
    expect(r.builtHeightIn).toBe(56);
  });

  it("worked example 2 alt: 6 courses plus one half-high row = 52 in", () => {
    // 6 full courses (48 in) + one 4 in half-high course = 52 in
    expect(6 * CMU_COURSE_HEIGHT_IN + 4).toBe(52);
  });

  it("FAQ: a 4-foot wall has 6 courses", () => {
    const r = conv(48, 0);
    expect(r.courses).toBe(6); // 48 / 8
    expect(r.builtHeightIn).toBe(48);
  });

  it("FAQ: 1.5 courses per foot", () => {
    expect(conv(12, 0).coursesPerFoot).toBe(1.5);
  });

  it("FAQ: a 20-foot wall is 240 inches and takes 15 blocks per course", () => {
    // 240 / 16 = 15
    const r = conv(0, 240);
    expect(r.blocksPerCourse).toBe(15);
  });

  it("blocks per course rounds up: 16 ft 4 in = 196 in -> 13 blocks", () => {
    // 196 / 16 = 12.25 -> 13
    const r = conv(0, feetInchesToFeet(16, 4) * 12);
    expect(r.blocksPerCourse).toBe(13);
  });

  it("courses round up for an in-between height: 50 in -> 7 courses", () => {
    expect(conv(50, 0).courses).toBe(7); // 6.25 -> 7
  });

  it("8 ft x 16 ft wall: 12 courses, 12 blocks per course", () => {
    const r = conv(96, 192);
    expect(r.courses).toBe(12); // 96 / 8
    expect(r.blocksPerCourse).toBe(12); // 192 / 16
  });

  it("zero input is safe (no NaN)", () => {
    const r = conv(0, 0);
    expect(r.courses).toBe(0);
    expect(r.blocksPerCourse).toBe(0);
    expect(r.builtHeightIn).toBe(0);
    expect(Number.isFinite(r.coursesPerFoot)).toBe(true);
  });
});
