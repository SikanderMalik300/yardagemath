/** Lawn Mowing Cost Calculator formula (build-spec #8). Two audiences. */
import { ACRES_PER_HOUR_CONST_IN, LAWN_PRICE_TIERS } from "../constants";
import { SQFT_PER_ACRE, ceilCount } from "./units";

/* -------------------- Homeowner tab -------------------- */
export type Frequency = "weekly" | "biweekly";

export interface HomeownerInput {
  areaSqFt: number;
  frequency: Frequency;
  seasonWeeks: number;
  edging: boolean;
  trimming: boolean;
  bagging: boolean;
}

export interface HomeownerResult {
  acres: number;
  perCut: number;
  perMonth: number;
  perSeason: number;
}

/** Pick the price tier whose acreage is the closest match at or above the lawn size. */
export function pricePerCutForAcres(acres: number): number {
  for (const tier of LAWN_PRICE_TIERS) {
    if (acres <= tier.acres) return tier.perCut;
  }
  // Above the largest tier: scale the last tier linearly by acreage.
  const last = LAWN_PRICE_TIERS[LAWN_PRICE_TIERS.length - 1];
  return (last.perCut / last.acres) * acres;
}

export function computeHomeowner(input: HomeownerInput): HomeownerResult {
  const acres = input.areaSqFt / SQFT_PER_ACRE;
  let perCut = pricePerCutForAcres(acres);

  // Extras add a modest flat amount each (planning estimate).
  const extras = (input.edging ? 8 : 0) + (input.trimming ? 7 : 0) + (input.bagging ? 10 : 0);
  perCut += extras;

  const cutsPerSeason =
    input.frequency === "weekly" ? input.seasonWeeks : ceilCount(input.seasonWeeks / 2);
  const cutsPerMonth = input.frequency === "weekly" ? 4 : 2;

  return {
    acres,
    perCut,
    perMonth: perCut * cutsPerMonth,
    perSeason: perCut * cutsPerSeason,
  };
}

/* -------------------- Pro tab -------------------- */
export interface ProInput {
  areaSqFt: number;
  deckWidthIn: number;
  speedMph: number;
  efficiencyPct: number; // 0–100
  trimMinutes: number;
  travelMinutes: number;
  hourlyRate: number;
  overheadPct: number;
}

export interface ProResult {
  acres: number;
  acresPerHour: number;
  mowHours: number;
  totalHours: number;
  price: number;
  pricePer1000SqFt: number;
}

/** acresPerHour = (deckIn × mph × eff) / 99 */
export function acresPerHour(deckWidthIn: number, speedMph: number, efficiencyFraction: number): number {
  return (deckWidthIn * speedMph * efficiencyFraction) / ACRES_PER_HOUR_CONST_IN;
}

export function computePro(input: ProInput): ProResult {
  const acres = input.areaSqFt / SQFT_PER_ACRE;
  const eff = input.efficiencyPct / 100;
  const aph = acresPerHour(input.deckWidthIn, input.speedMph, eff);
  const mowHours = aph > 0 ? acres / aph : 0;
  const totalHours = mowHours + (input.trimMinutes + input.travelMinutes) / 60;
  const price = totalHours * input.hourlyRate * (1 + input.overheadPct / 100);
  const pricePer1000SqFt = input.areaSqFt > 0 ? (price / input.areaSqFt) * 1000 : 0;

  return { acres, acresPerHour: aph, mowHours, totalHours, price, pricePer1000SqFt };
}
