/** Paver Calculator formula (batch3 day1). Reuses shared area/volume math + ceilCount. */
import { areaSqFt, volumeCuFt, cubicYards, withWaste, tons as tonsFrom, bags as bagsNeeded, type Shape } from "./volume";
import { ceilCount } from "./units";
import { PAVER_SIZES } from "../constants";

export type PaverShape = Shape | "area";
export type PaverSizeKey = keyof typeof PAVER_SIZES | "custom";

export interface PaverArea {
  shape: PaverShape;
  lengthFt?: number;
  widthFt?: number;
  diameterFt?: number;
  baseFt?: number;
  heightFt?: number;
  directSqFt?: number;
  directPerimeterFt?: number;
}

export interface PaverCutout {
  widthFt: number;
  heightFt: number;
}

export interface PaverInput {
  areas: PaverArea[];
  cutouts: PaverCutout[];
  perSqFt: number; // resolved by the component (preset or custom)
  wastePct: number; // paver pattern waste
  baseDepthIn: number;
  baseDensity: number; // tons per cu yd (crusher run 1.5)
  sandDepthIn: number;
  sandDensity: number; // tons per cu yd (dry sand 1.35)
  sandBagCuFt: number; // 0.5
  baseCompactionPct: number; // gravel base compaction allowance (20)
  sandWastePct: number; // bedding sand extra (10)
  priceMode: "perPaver" | "perSqFt";
  pricePerPaver: number;
  pricePerSqFt: number;
  basePricePerTon: number;
  sandPricePerBag: number;
}

export interface PaverResult {
  grossAreaSqFt: number;
  cutoutAreaSqFt: number;
  netAreaSqFt: number;
  pavers: number;
  paversWithWaste: number;
  baseCuYd: number;
  baseTons: number;
  baseTonsWithWaste: number;
  sandCuYd: number;
  sandTons: number;
  sandBags: number;
  sandBagsWithWaste: number;
  edgingLinearFt: number;
  paverCost: number;
  baseCost: number;
  sandCost: number;
  totalCost: number;
}

/** Pavers per square foot from a nominal size: 144 / (length x width), in inches. */
export function paversPerSqFt(lengthIn: number, widthIn: number): number {
  return lengthIn > 0 && widthIn > 0 ? 144 / (lengthIn * widthIn) : 0;
}

/** Area of one entry, in square feet. */
export function paverArea(a: PaverArea): number {
  if (a.shape === "area") return Math.max(0, a.directSqFt ?? 0);
  return areaSqFt(a.shape, {
    length: a.lengthFt,
    width: a.widthFt,
    diameter: a.diameterFt,
    base: a.baseFt,
    height: a.heightFt,
  });
}

/** Edge-restraint perimeter of one entry (rectangle and circle; optional for known sq ft). */
export function paverPerimeter(a: PaverArea): number {
  if (a.shape === "rectangle") return 2 * ((a.lengthFt ?? 0) + (a.widthFt ?? 0));
  if (a.shape === "circle") return Math.PI * (a.diameterFt ?? 0);
  if (a.shape === "area") return Math.max(0, a.directPerimeterFt ?? 0);
  return 0;
}

export function computePaver(input: PaverInput): PaverResult {
  const gross = input.areas.reduce((s, a) => s + paverArea(a), 0);
  const cutoutArea = input.cutouts.reduce((s, c) => s + Math.max(0, c.widthFt) * Math.max(0, c.heightFt), 0);
  const net = Math.max(0, gross - cutoutArea);

  const pavers = ceilCount(net * input.perSqFt);
  const paversWithWaste = ceilCount(net * input.perSqFt * (1 + input.wastePct / 100));

  const baseCuFt = volumeCuFt(net, input.baseDepthIn);
  const baseCuYd = cubicYards(baseCuFt);
  const baseTons = tonsFrom(baseCuYd, input.baseDensity);
  const baseTonsWithWaste = withWaste(baseTons, input.baseCompactionPct);

  const sandCuFt = volumeCuFt(net, input.sandDepthIn);
  const sandCuYd = cubicYards(sandCuFt);
  const sandTons = tonsFrom(sandCuYd, input.sandDensity);
  const sandBags = bagsNeeded(sandCuFt, input.sandBagCuFt);
  const sandBagsWithWaste = bagsNeeded(withWaste(sandCuFt, input.sandWastePct), input.sandBagCuFt);

  const edgingLinearFt = input.areas.reduce((s, a) => s + paverPerimeter(a), 0);

  const paverCost = input.priceMode === "perPaver" ? paversWithWaste * input.pricePerPaver : net * input.pricePerSqFt;
  const baseCost = baseTonsWithWaste * input.basePricePerTon;
  const sandCost = sandBagsWithWaste * input.sandPricePerBag;

  return {
    grossAreaSqFt: gross,
    cutoutAreaSqFt: cutoutArea,
    netAreaSqFt: net,
    pavers,
    paversWithWaste,
    baseCuYd,
    baseTons,
    baseTonsWithWaste,
    sandCuYd,
    sandTons,
    sandBags,
    sandBagsWithWaste,
    edgingLinearFt,
    paverCost,
    baseCost,
    sandCost,
    totalCost: paverCost + baseCost + sandCost,
  };
}
