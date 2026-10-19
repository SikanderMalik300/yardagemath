/** Fill Dirt Calculator formula (batch3 day4). Reuses the shared yard math + ceilCount. */
import { cubicYards, withWaste, tons as tonsFrom } from "./volume";
import { ceilCount } from "./units";

export type FillKind = "raise" | "hole" | "round" | "sloped";

export interface FillArea {
  kind: FillKind;
  // raise: area (lengthFt x widthFt OR directSqFt) x depthIn
  // hole: lengthFt x widthFt x depthFt
  // round: diameterFt x depthFt
  // sloped: lengthFt x widthFt x average of depth1In and depth2In
  lengthFt?: number;
  widthFt?: number;
  directSqFt?: number;
  useSqFt?: boolean;
  depthIn?: number;
  depthFt?: number;
  diameterFt?: number;
  depth1In?: number;
  depth2In?: number;
}

export interface FillDirtInput {
  areas: FillArea[];
  compactionPct: number; // 20
  density: number; // tons per cu yd (typical 1.2, wet 1.4, custom)
  loadSizeCuYd: number; // 10
  pricePerCuYd: number;
  deliveryPerLoad: number;
}

export interface FillDirtResult {
  cubicFeet: number;
  cubicYards: number; // before compaction
  cubicYardsCompacted: number;
  tons: number;
  loads: number;
  cost: number;
}

/** Cubic feet for one fill entry. */
export function fillAreaCuFt(a: FillArea): number {
  const pos = (n?: number) => Math.max(0, n ?? 0);
  switch (a.kind) {
    case "raise": {
      const area = a.useSqFt ? pos(a.directSqFt) : pos(a.lengthFt) * pos(a.widthFt);
      return area * (pos(a.depthIn) / 12);
    }
    case "hole":
      return pos(a.lengthFt) * pos(a.widthFt) * pos(a.depthFt);
    case "round": {
      const r = pos(a.diameterFt) / 2;
      return Math.PI * r * r * pos(a.depthFt);
    }
    case "sloped": {
      const area = pos(a.lengthFt) * pos(a.widthFt);
      const avgIn = (pos(a.depth1In) + pos(a.depth2In)) / 2;
      return area * (avgIn / 12);
    }
  }
}

export function computeFillDirt(input: FillDirtInput): FillDirtResult {
  const cuft = input.areas.reduce((s, a) => s + fillAreaCuFt(a), 0);
  const cuyd = cubicYards(cuft);
  const cuydComp = withWaste(cuyd, input.compactionPct);
  const tons = tonsFrom(cuydComp, input.density);
  const loads = input.loadSizeCuYd > 0 ? ceilCount(cuydComp / input.loadSizeCuYd) : 0;
  const cost = cuydComp * input.pricePerCuYd + loads * input.deliveryPerLoad;

  return {
    cubicFeet: cuft,
    cubicYards: cuyd,
    cubicYardsCompacted: cuydComp,
    tons,
    loads,
    cost,
  };
}
