/** Grass Seed Calculator formula (batch4 day4). Reuses shared area math + ceilCount. */
import { areaSqFt, type Shape } from "./volume";
import { ceilCount, SQFT_PER_ACRE } from "./units";

export type GrassShape = Shape | "area" | "acres";

/**
 * Seeding rates, pounds per 1,000 sq ft. VERIFY against university extension pages:
 *  - cool-season new lawn: Penn State (KBG 2-3, tall fescue 6-8, fine fescue 4-5);
 *    perennial ryegrass ~6-9 (Penn State lists 4-5 for a pure stand);
 *  - overseeding: about half the new-lawn rate (NC State / Maryland Extension);
 *  - warm-season new lawn: UGA (bermuda hulled 1-2, zoysia 1-3, centipede 0.25-1, bahia 3-8).
 */
export const GRASS_SEED_TYPES = {
  tallFescue: { label: "Tall fescue", season: "cool", newLawn: 7, overseed: 4 },
  bluegrass: { label: "Kentucky bluegrass", season: "cool", newLawn: 2.5, overseed: 1.5 },
  ryegrass: { label: "Perennial ryegrass", season: "cool", newLawn: 7, overseed: 4 },
  fineFescue: { label: "Fine fescue", season: "cool", newLawn: 4, overseed: 2 },
  bermuda: { label: "Bermudagrass (hulled)", season: "warm", newLawn: 1.5, overseed: null },
  zoysia: { label: "Zoysiagrass", season: "warm", newLawn: 1, overseed: null },
  centipede: { label: "Centipedegrass", season: "warm", newLawn: 0.5, overseed: null },
  bahia: { label: "Bahiagrass", season: "warm", newLawn: 8, overseed: null },
  custom: { label: "Custom (lb per 1,000 sq ft)", season: "cool", newLawn: 5, overseed: 3 },
} as const;
export type GrassTypeKey = keyof typeof GRASS_SEED_TYPES;

export type SeedJob = "new" | "overseed";

export const SEED_BAG_LB = [3, 7, 20, 50] as const;

export interface GrassCutout {
  shape: "rectangle" | "circle" | "area";
  lengthFt?: number;
  widthFt?: number;
  diameterFt?: number;
  directSqFt?: number;
}

export interface GrassArea {
  shape: GrassShape;
  lengthFt?: number;
  widthFt?: number;
  diameterFt?: number;
  baseFt?: number;
  heightFt?: number;
  directSqFt?: number;
  acres?: number;
  cutouts?: GrassCutout[];
}

export interface GrassSeedInput {
  areas: GrassArea[];
  /** Seeding rate in lb per 1,000 sq ft (component resolves type + job, incl. custom). */
  ratePer1000: number;
  bagLb: number;
  pricePerBag: number;
}

export interface GrassSeedResult {
  netSqFt: number;
  pounds: number;
  bags: number;
  leftoverLb: number;
  cost: number;
}

export function cutoutArea(c: GrassCutout): number {
  if (c.shape === "area") return Math.max(0, c.directSqFt ?? 0);
  if (c.shape === "circle") {
    const r = (c.diameterFt ?? 0) / 2;
    return Math.max(0, Math.PI * r * r);
  }
  return Math.max(0, (c.lengthFt ?? 0) * (c.widthFt ?? 0));
}

export function grassArea(a: GrassArea): number {
  let gross: number;
  if (a.shape === "acres") gross = Math.max(0, a.acres ?? 0) * SQFT_PER_ACRE;
  else if (a.shape === "area") gross = Math.max(0, a.directSqFt ?? 0);
  else gross = areaSqFt(a.shape, { length: a.lengthFt, width: a.widthFt, diameter: a.diameterFt, base: a.baseFt, height: a.heightFt });
  const cut = (a.cutouts ?? []).reduce((s, c) => s + cutoutArea(c), 0);
  return Math.max(0, gross - cut);
}

export function computeGrassSeed(input: GrassSeedInput): GrassSeedResult {
  const net = input.areas.reduce((sum, a) => sum + grassArea(a), 0);
  const pounds = (net / 1000) * input.ratePer1000;
  const bags = input.bagLb > 0 ? ceilCount(pounds / input.bagLb) : 0;
  const leftoverLb = Math.max(0, bags * input.bagLb - pounds);
  return {
    netSqFt: net,
    pounds,
    bags,
    leftoverLb,
    cost: bags * input.pricePerBag,
  };
}
