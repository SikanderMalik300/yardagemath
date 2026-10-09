/** Gutter Slope Calculator formula (build-spec #11). */
import {
  DOWNSPOUT_CAPACITY_SQFT,
  DOWNSPOUT_SPACING_FT,
} from "../constants";
import { ceilCount } from "./units";

export type DownspoutPosition = "one-end" | "both-ends" | "middle";

export interface GutterSlopeInput {
  runLengthFt: number;
  slopeInPer10ft: number;
  downspoutPosition: DownspoutPosition;
  roofAreaSqFt: number | null;
}

export interface GutterSlopeResult {
  /** Effective slope length — halved when water runs from the centre to two ends. */
  slopeRunFt: number;
  totalDropIn: number;
  /** Drop expressed as a start (high) and end (low) relative height. */
  highEndIn: number;
  lowEndIn: number;
  downspoutsBySpacing: number;
  downspoutsByArea2x3: number | null;
  downspoutsByArea3x4: number | null;
}

export function computeGutterSlope(input: GutterSlopeInput): GutterSlopeResult {
  // With a downspout at each end (or feeding from the middle) each slope run is half the length.
  const slopeRunFt =
    input.downspoutPosition === "one-end" ? input.runLengthFt : input.runLengthFt / 2;

  const totalDropIn = (slopeRunFt / 10) * input.slopeInPer10ft;

  const downspoutsBySpacing = Math.max(1, ceilCount(input.runLengthFt / DOWNSPOUT_SPACING_FT));

  const byArea = (cap: number) =>
    input.roofAreaSqFt === null ? null : Math.max(1, ceilCount(input.roofAreaSqFt / cap));

  return {
    slopeRunFt,
    totalDropIn,
    highEndIn: totalDropIn,
    lowEndIn: 0,
    downspoutsBySpacing,
    downspoutsByArea2x3: byArea(DOWNSPOUT_CAPACITY_SQFT.size2x3),
    downspoutsByArea3x4: byArea(DOWNSPOUT_CAPACITY_SQFT.size3x4),
  };
}
