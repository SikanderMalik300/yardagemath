/** Acres per Hour Calculator formula (build-spec #10). */
import { ACRES_PER_HOUR_CONST_IN } from "../constants";
import { SQFT_PER_ACRE } from "./units";

export type WidthUnit = "in" | "ft";
export type AreaUnit = "acres" | "sqft";

export interface AcresPerHourInput {
  width: number;
  widthUnit: WidthUnit;
  speedMph: number;
  efficiencyPct: number; // 0–100
  area: number;
  areaUnit: AreaUnit;
}

export interface AcresPerHourResult {
  acresPerHour: number;
  areaAcres: number;
  hours: number;
  hoursWhole: number;
  minutes: number;
}

/** acresPerHour = (width_in × mph × eff) / 99 */
export function acresPerHourFrom(
  widthIn: number,
  speedMph: number,
  efficiencyFraction: number
): number {
  return (widthIn * speedMph * efficiencyFraction) / ACRES_PER_HOUR_CONST_IN;
}

export function computeAcresPerHour(input: AcresPerHourInput): AcresPerHourResult {
  const widthIn = input.widthUnit === "in" ? input.width : input.width * 12;
  const eff = input.efficiencyPct / 100;
  const aph = acresPerHourFrom(widthIn, input.speedMph, eff);

  const areaAcres = input.areaUnit === "acres" ? input.area : input.area / SQFT_PER_ACRE;
  const hours = aph > 0 ? areaAcres / aph : 0;

  return {
    acresPerHour: aph,
    areaAcres,
    hours,
    hoursWhole: Math.floor(hours),
    minutes: Math.round((hours - Math.floor(hours)) * 60),
  };
}
