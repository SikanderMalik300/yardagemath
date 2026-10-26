/** Sod Calculator formula (batch4 day3). Reuses the shared area math + ceilCount. */
import { areaSqFt, withWaste, type Shape } from "./volume";
import { ceilCount } from "./units";
import { PRICES } from "../constants";

export type SodShape = Shape | "area";

/** Sod piece types, each with an area in square feet. */
export const SOD_PIECES = {
  slab: { label: "Slab (16 x 24 in)", sqFt: (16 * 24) / 144 }, // 2.6667 sq ft
  roll: { label: "Roll (2 x 5 ft)", sqFt: 10 },
  custom: { label: "Custom size", sqFt: (16 * 24) / 144 },
} as const;
export type SodPieceKey = keyof typeof SOD_PIECES;

export interface SodCutout {
  shape: "rectangle" | "circle" | "area";
  lengthFt?: number;
  widthFt?: number;
  diameterFt?: number;
  directSqFt?: number;
}

export interface SodArea {
  shape: SodShape;
  lengthFt?: number;
  widthFt?: number;
  diameterFt?: number;
  baseFt?: number;
  heightFt?: number;
  directSqFt?: number;
  cutouts?: SodCutout[];
}

export interface SodInput {
  areas: SodArea[];
  wastePct: number;
  palletSqFt: number;
  /** Area of one piece (slab/roll/custom), in square feet. */
  pieceSqFt: number;
  pricePerSqFt: number;
  /** If > 0, overrides the per-square-foot price. */
  pricePerPallet: number;
  deliveryFee: number;
  installedPerSqFt: number;
}

export interface SodResult {
  netSqFt: number;
  orderSqFt: number; // net + waste
  pallets: number;
  pieces: number;
  materialCost: number; // sod only, no delivery
  deliveryFee: number;
  totalCost: number; // material + delivery
  installedCost: number;
}

/** Area of one cut-out, in square feet. */
export function cutoutArea(c: SodCutout): number {
  if (c.shape === "area") return Math.max(0, c.directSqFt ?? 0);
  if (c.shape === "circle") {
    const r = (c.diameterFt ?? 0) / 2;
    return Math.max(0, Math.PI * r * r);
  }
  return Math.max(0, (c.lengthFt ?? 0) * (c.widthFt ?? 0));
}

/** Net area of one entry (gross shape minus its cut-outs), in square feet. */
export function sodArea(a: SodArea): number {
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

/** Square feet of a piece from its dimensions (inches or feet). */
export function pieceSqFtFromDims(lengthIn: number, widthIn: number): number {
  return (Math.max(0, lengthIn) * Math.max(0, widthIn)) / 144;
}

export function computeSod(input: SodInput): SodResult {
  const net = input.areas.reduce((sum, a) => sum + sodArea(a), 0);
  const order = withWaste(net, input.wastePct);
  const pallets = input.palletSqFt > 0 ? ceilCount(order / input.palletSqFt) : 0;
  const pieces = input.pieceSqFt > 0 ? ceilCount(order / input.pieceSqFt) : 0;
  const materialCost =
    input.pricePerPallet > 0 ? pallets * input.pricePerPallet : order * input.pricePerSqFt;
  const deliveryFee = Math.max(0, input.deliveryFee);
  return {
    netSqFt: net,
    orderSqFt: order,
    pallets,
    pieces,
    materialCost,
    deliveryFee,
    totalCost: materialCost + deliveryFee,
    installedCost: order * input.installedPerSqFt,
  };
}

export const SOD_PRICE_DEFAULTS = { perSqFt: PRICES.sodPerSqFt, installedPerSqFt: PRICES.sodInstalledPerSqFt };
