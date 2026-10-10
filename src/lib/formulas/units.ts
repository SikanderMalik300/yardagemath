/**
 * Unit helpers — pure functions, no UI. (build-spec A0.3)
 *
 * US customary is the default throughout the site; metric is a toggle.
 * All internal geometry math is done in feet / cubic feet, then converted.
 */

/** Convert a feet + inches pair to decimal feet. ft = feet + inches / 12 */
export function feetInchesToFeet(feet: number, inches: number): number {
  return feet + inches / 12;
}

/** Convert decimal feet back to a { feet, inches } pair (inches rounded). */
export function feetToFeetInches(valueFt: number): { feet: number; inches: number } {
  const feet = Math.floor(valueFt);
  const inches = Math.round((valueFt - feet) * 12);
  return inches === 12 ? { feet: feet + 1, inches: 0 } : { feet, inches };
}

/* --- Length --- */
export const FT_PER_METER = 3.280839895;
export const M_PER_FT = 0.3048;
export const IN_PER_CM = 0.3937007874;
export const CM_PER_IN = 2.54;

export const metersToFeet = (m: number): number => m * FT_PER_METER;
export const feetToMeters = (ft: number): number => ft * M_PER_FT;
export const cmToInches = (cm: number): number => cm * IN_PER_CM;
export const inchesToCm = (inches: number): number => inches * CM_PER_IN;

/* --- Area --- */
export const SQFT_PER_SQM = 10.763910417;
export const SQFT_PER_ACRE = 43560;
export const SQFT_PER_SQYD = 9;

export const sqFtToSqYd = (sqft: number): number => sqft / SQFT_PER_SQYD;
export const sqFtToSqM = (sqft: number): number => sqft / SQFT_PER_SQM;
export const sqFtToAcres = (sqft: number): number => sqft / SQFT_PER_ACRE;
export const acresToSqFt = (acres: number): number => acres * SQFT_PER_ACRE;

/* --- Volume --- */
export const CUFT_PER_CUYD = 27;
export const CUM_PER_CUYD = 0.764555;

export const cuFtToCuYd = (cuft: number): number => cuft / CUFT_PER_CUYD;
export const cuYdToCuM = (cuyd: number): number => cuyd * CUM_PER_CUYD;

/**
 * Round to a fixed number of decimal places, returning a number.
 * Uses the standard half-up behaviour via toFixed to avoid float noise
 * (e.g. 0.9259 -> 0.93 at 2 dp), matching the worked examples in the spec.
 */
export function round(value: number, dp = 2): number {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(dp));
}

/** Clamp a parsed numeric input to a safe non-negative value. */
export function safeNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

/**
 * Round a count UP to a whole number, after clearing binary floating-point
 * noise at the 6th decimal. Without this, 48 * 1.1 / 0.6 computes as
 * 88.00000000000001 and Math.ceil would return 89 instead of 88.
 * Use for every whole-unit count: bags, blocks, caps, rebar, downspouts.
 */
export function ceilCount(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.ceil(Math.round(x * 1e6) / 1e6);
}

/**
 * Round a count DOWN to a whole number, after clearing binary floating-point
 * noise at the 6th decimal. Mirror of ceilCount for "how many whole units fit"
 * cases such as blocks per truck trip (floor(payload / block weight)).
 */
export function floorCount(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.floor(Math.round(x * 1e6) / 1e6);
}
