/** CMU Block Sizes converter (next-5 spec, page 15). */
import { ceilCount } from "./units";

/** A standard CMU course (unit + one bed joint) is 8 in. tall. */
export const CMU_COURSE_HEIGHT_IN = 8;
/** A standard CMU (unit + one head joint) is 16 in. long. */
export const CMU_UNIT_LENGTH_IN = 16;
/** Standard mortar joint; actual unit size = nominal − 3/8 in. (NCMA TEK 2-1A). */
export const MORTAR_JOINT_IN = 0.375;

/** Actual (specified) dimension from a nominal one: 3/8 in. less for the joint. */
export function actualInches(nominalIn: number): number {
  return nominalIn - MORTAR_JOINT_IN;
}

export interface CmuConverterInput {
  wallHeightIn: number;
  wallLengthIn: number;
}

export interface CmuConverterResult {
  courses: number; // ceil(height / 8)
  builtHeightIn: number; // courses × 8
  blocksPerCourse: number; // ceil(length / 16)
  coursesPerFoot: number; // 12 / 8 = 1.5
}

export function computeCmuConverter(input: CmuConverterInput): CmuConverterResult {
  const h = Math.max(0, input.wallHeightIn);
  const l = Math.max(0, input.wallLengthIn);
  const courses = ceilCount(h / CMU_COURSE_HEIGHT_IN);
  return {
    courses,
    builtHeightIn: courses * CMU_COURSE_HEIGHT_IN,
    blocksPerCourse: ceilCount(l / CMU_UNIT_LENGTH_IN),
    coursesPerFoot: 12 / CMU_COURSE_HEIGHT_IN,
  };
}
