/** Landscape Material Calculator formula (build-spec #7). */
import { DENSITY_TONS_PER_CUYD, type MaterialKey, BAG_SIZE_CUFT } from "../constants";
import { areaSqFt, computeVolume, tons, bags, type Shape } from "./volume";

/** Per-material default depth (in), bag size (cu ft) and "how it's sold" note. */
export const LANDSCAPE_MATERIALS: Record<
  string,
  { key: MaterialKey; label: string; defaultDepthIn: number; bagCuFt: number; soldAs: string }
> = {
  mulch: {
    key: "mulch",
    label: "Mulch (bark)",
    defaultDepthIn: 3,
    bagCuFt: BAG_SIZE_CUFT.mulch,
    soldAs: "2 cu ft bags or bulk by the cubic yard",
  },
  riverRock: {
    key: "riverRock",
    label: "River rock",
    defaultDepthIn: 2.5,
    bagCuFt: BAG_SIZE_CUFT.gravel,
    soldAs: "0.5 cu ft bags or bulk by the ton",
  },
  decomposedGranite: {
    key: "decomposedGranite",
    label: "Decomposed granite",
    defaultDepthIn: 3,
    bagCuFt: BAG_SIZE_CUFT.gravel,
    soldAs: "bulk by the ton or cubic yard",
  },
  compost: {
    key: "compost",
    label: "Compost",
    defaultDepthIn: 2,
    bagCuFt: BAG_SIZE_CUFT.compost,
    soldAs: "1–1.5 cu ft bags or bulk",
  },
  topsoil: {
    key: "topsoil",
    label: "Topsoil",
    defaultDepthIn: 4,
    bagCuFt: BAG_SIZE_CUFT.soil,
    soldAs: "0.75–1 cu ft bags or bulk by the yard",
  },
  sand: {
    key: "sand",
    label: "Sand",
    defaultDepthIn: 2,
    bagCuFt: BAG_SIZE_CUFT.sand,
    soldAs: "0.5 cu ft bags or bulk by the ton",
  },
  gravel: {
    key: "gravel",
    label: "Gravel",
    defaultDepthIn: 3,
    bagCuFt: BAG_SIZE_CUFT.gravel,
    soldAs: "0.5 cu ft bags or bulk by the ton",
  },
  crushedStone: {
    key: "crushedStone",
    label: "Crushed stone",
    defaultDepthIn: 3,
    bagCuFt: BAG_SIZE_CUFT.gravel,
    soldAs: "bulk by the ton",
  },
};

export type LandscapeMaterialKey = keyof typeof LANDSCAPE_MATERIALS;

export interface LandscapeInput {
  material: LandscapeMaterialKey;
  shape: Shape;
  length: number;
  width: number;
  diameter: number;
  base: number;
  height: number;
  depthIn: number;
  wastePct: number;
}

export interface LandscapeResult {
  areaSqFt: number;
  cubicYards: number;
  cubicYardsWithWaste: number;
  cubicFeetWithWaste: number;
  tons: number;
  bags: number;
  soldAs: string;
}

export function computeLandscape(input: LandscapeInput): LandscapeResult {
  const spec = LANDSCAPE_MATERIALS[input.material];
  const area = areaSqFt(input.shape, input);
  const v = computeVolume(area, input.depthIn, input.wastePct);
  return {
    areaSqFt: area,
    cubicYards: v.cubicYards,
    cubicYardsWithWaste: v.cubicYardsWithWaste,
    cubicFeetWithWaste: v.volumeCuFtWithWaste,
    tons: tons(v.cubicYardsWithWaste, DENSITY_TONS_PER_CUYD[spec.key]),
    bags: bags(v.volumeCuFtWithWaste, spec.bagCuFt),
    soldAs: spec.soldAs,
  };
}
