/** Asphalt Calculator formula (batch4 day1). Reuses the shared area + yard math. */
import { areaSqFt, volumeCuFt, cubicYards, withWaste, type Shape } from "./volume";
import { ceilCount } from "./units";
import { ASPHALT_DENSITY_LB_PER_CUFT, DENSITY_TONS_PER_CUYD, PAVER_BASE_COMPACTION_PCT } from "../constants";

export type AsphaltShape = Shape | "area";

/** Asphalt materials, each with a compacted unit weight in pounds per cubic foot. */
export const ASPHALT_MATERIALS = {
  hotMix: { label: "Hot mix asphalt", densityLbPerCuFt: ASPHALT_DENSITY_LB_PER_CUFT.hotMix },
  millings: { label: "Asphalt millings", densityLbPerCuFt: ASPHALT_DENSITY_LB_PER_CUFT.millings },
  custom: { label: "Custom (lb per cu ft)", densityLbPerCuFt: ASPHALT_DENSITY_LB_PER_CUFT.hotMix },
} as const;

export type AsphaltMaterialKey = keyof typeof ASPHALT_MATERIALS;

/** A cut-out (planter or island) subtracted from an area. */
export interface AsphaltCutout {
  shape: "rectangle" | "circle" | "area";
  lengthFt?: number;
  widthFt?: number;
  diameterFt?: number;
  directSqFt?: number;
}

export interface AsphaltArea {
  shape: AsphaltShape;
  lengthFt?: number;
  widthFt?: number;
  diameterFt?: number;
  baseFt?: number;
  heightFt?: number;
  directSqFt?: number;
  cutouts?: AsphaltCutout[];
}

export interface AsphaltInput {
  areas: AsphaltArea[];
  thicknessIn: number;
  wastePct: number;
  /** Compacted unit weight in pounds per cubic foot (component resolves the material / custom). */
  densityLbPerCuFt: number;
  pricePerTon: number;
  truckTons: number;
  installedPerSqFt: number;
  /** Optional gravel base (crusher run 1.5 t/yd with 20% compaction). */
  baseOn: boolean;
  baseDepthIn: number;
  basePricePerTon: number;
}

export interface AsphaltResult {
  areaSqFt: number; // net of cut-outs
  squareYards: number;
  cubicFeet: number;
  cubicYards: number;
  tons: number; // before waste
  tonsWithWaste: number;
  coveragePerTon: number; // sq ft one ton covers at this thickness
  truckloads: number;
  materialCost: number;
  installedCost: number;
  baseCubicYards: number;
  baseTons: number;
  baseCost: number;
}

/** Area of one cut-out, in square feet. */
export function cutoutArea(c: AsphaltCutout): number {
  if (c.shape === "area") return Math.max(0, c.directSqFt ?? 0);
  if (c.shape === "circle") {
    const r = (c.diameterFt ?? 0) / 2;
    return Math.max(0, Math.PI * r * r);
  }
  return Math.max(0, (c.lengthFt ?? 0) * (c.widthFt ?? 0));
}

/** Net area of one entry (gross shape minus its cut-outs), in square feet, floored at 0. */
export function asphaltArea(a: AsphaltArea): number {
  const gross =
    a.shape === "area"
      ? Math.max(0, a.directSqFt ?? 0)
      : areaSqFt(a.shape, {
          length: a.lengthFt,
          width: a.widthFt,
          diameter: a.diameterFt,
          base: a.baseFt,
          height: a.heightFt,
        });
  const cut = (a.cutouts ?? []).reduce((s, c) => s + cutoutArea(c), 0);
  return Math.max(0, gross - cut);
}

/** Square feet one ton covers at the given thickness: (2000 / density) / (thickness / 12). */
export function coveragePerTon(thicknessIn: number, densityLbPerCuFt: number): number {
  if (thicknessIn <= 0 || densityLbPerCuFt <= 0) return 0;
  return (2000 / densityLbPerCuFt) / (thicknessIn / 12);
}

export function computeAsphalt(input: AsphaltInput): AsphaltResult {
  const area = input.areas.reduce((sum, a) => sum + asphaltArea(a), 0);
  const cuft = volumeCuFt(area, input.thicknessIn);
  const cuyd = cubicYards(cuft);
  const tons = (cuft * input.densityLbPerCuFt) / 2000;
  const tonsWithWaste = withWaste(tons, input.wastePct);
  const truckloads = input.truckTons > 0 ? ceilCount(tonsWithWaste / input.truckTons) : 0;

  // Optional gravel base: crusher run (1.5 t/yd) with 20% compaction.
  const baseCuFt = input.baseOn ? withWaste(volumeCuFt(area, input.baseDepthIn), PAVER_BASE_COMPACTION_PCT) : 0;
  const baseCuYd = cubicYards(baseCuFt);
  const baseTons = baseCuYd * DENSITY_TONS_PER_CUYD.crusherRun;

  return {
    areaSqFt: area,
    squareYards: area / 9,
    cubicFeet: cuft,
    cubicYards: cuyd,
    tons,
    tonsWithWaste,
    coveragePerTon: coveragePerTon(input.thicknessIn, input.densityLbPerCuFt),
    truckloads,
    materialCost: tonsWithWaste * input.pricePerTon,
    installedCost: area * input.installedPerSqFt,
    baseCubicYards: baseCuYd,
    baseTons,
    baseCost: baseTons * input.basePricePerTon,
  };
}
