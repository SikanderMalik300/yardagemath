import { describe, it, expect } from "vitest";
import { round } from "@/lib/formulas/units";
import { computeCubicYard } from "@/lib/formulas/cubicYard";
import { computeConcreteBlock } from "@/lib/formulas/concreteBlock";
import { computeConcreteSlab } from "@/lib/formulas/concreteSlab";
import { computeTopsoil } from "@/lib/formulas/topsoil";
import { computePeaGravel } from "@/lib/formulas/peaGravel";
import { computeSquareYard } from "@/lib/formulas/squareYard";
import { computeLandscape } from "@/lib/formulas/landscapeMaterials";
import { computePro } from "@/lib/formulas/lawnMowing";
import { computeBlockWall } from "@/lib/formulas/blockWall";
import { computeAcresPerHour } from "@/lib/formulas/acresPerHour";
import { computeGutterSlope } from "@/lib/formulas/gutterSlope";
import { computeRipRap } from "@/lib/formulas/ripRap";

const base = { diameter: 0, base: 0, height: 0 };

/* Day-2 second worked examples (audit Task 1). Numbers shown on each page must match. */
describe("second worked examples", () => {
  it("cubic yard: 20 x 12 ft driveway at 4 in = 2.96 cu yd", () => {
    const r = computeCubicYard({ shape: "rectangle", length: 20, width: 12, depthIn: 4, wastePct: 0, material: "none", ...base });
    expect(r.volumeCuFt).toBe(80);
    expect(round(r.cubicYards, 2)).toBe(2.96);
  });

  it("concrete block: 40 x 4 ft wall + 5% = 189 blocks", () => {
    const r = computeConcreteBlock({ wallLengthFt: 40, wallHeightFt: 4, openings: [], wastePct: 5, pricePerBlock: null });
    expect(r.netAreaSqFt).toBe(160);
    expect(r.blocks).toBe(189);
  });

  it("slab: 24 x 24 ft at 6 in = 10.67 cu yd (11.73 with 10% waste)", () => {
    const r = computeConcreteSlab({ lengthFt: 24, widthFt: 24, thicknessIn: 6, wastePct: 10, supplyMode: "readymix", bagSize: "lb80", pricePerCuYd: 160, pricePerBag: 7, laborPerSqFt: 0, rebarPerSqFt: 0, gravelBaseDepthIn: 0 });
    expect(round(r.cubicYards, 2)).toBe(10.67);
    expect(round(r.cubicYardsWithWaste, 2)).toBe(11.73);
  });

  it("topsoil: 4 x 8 ft raised bed 12 in deep = 1.19 cu yd", () => {
    const r = computeTopsoil({ shape: "rectangle", length: 4, width: 8, depthIn: 12, wastePct: 0, bagSizeCuFt: 0.75, ...base });
    expect(r.cubicFeetWithWaste).toBe(32);
    expect(round(r.cubicYards, 2)).toBe(1.19);
  });

  it("pea gravel: 3 x 40 ft path at 2 in = 0.74 cu yd ~ 1.04 t", () => {
    const r = computePeaGravel({ shape: "rectangle", length: 3, width: 40, depthIn: 2, wastePct: 0, pricePerTon: null, pricePerCuYd: null, ...base });
    expect(r.cubicFeetWithWaste).toBe(20);
    expect(round(r.cubicYards, 2)).toBe(0.74);
    expect(round(r.tons, 2)).toBe(1.04);
  });

  it("square yard: 12 x 15 ft bedroom = 20 sq yd", () => {
    const r = computeSquareYard({ areas: [{ lengthFt: 12, widthFt: 15, directSqFt: null }], wastePct: 0, pricePerSqYd: null });
    expect(r.totalSqYd).toBe(20);
  });

  it("landscape mulch: 3 x 60 ft bed at 3 in = 1.67 cu yd", () => {
    const r = computeLandscape({ material: "mulch", shape: "rectangle", length: 3, width: 60, depthIn: 3, wastePct: 0, ...base });
    expect(r.cubicFeetWithWaste).toBe(45);
    expect(round(r.cubicYards, 2)).toBe(1.67);
  });

  it("lawn pro: 0.5 acre, 42 in, 4 mph, 80% = 1.36 ac/hr, ~22 min", () => {
    const r = computePro({ areaSqFt: 0.5 * 43560, deckWidthIn: 42, speedMph: 4, efficiencyPct: 80, trimMinutes: 0, travelMinutes: 0, hourlyRate: 60, overheadPct: 0 });
    expect(round(r.acresPerHour, 2)).toBe(1.36);
    expect(Math.round(r.mowHours * 60)).toBe(22);
  });

  it("block wall: 50 x 3 ft = 178 blocks, 38 caps, 15 mortar", () => {
    const r = computeBlockWall({ lengthFt: 50, heightFt: 3, blockWidth: "in8", openings: [], capBlocks: true, coreFill: "none", rebarSpacingIn: 32, prices: { block: 2, cap: 2.5, mortarBag: 7.5, groutPerCuYd: 170, rebar20ftBar: 9 } });
    expect(r.blocks).toBe(178);
    expect(r.capBlocks).toBe(38);
    expect(r.mortarBags).toBe(15); // ceil(178/12) = 14.83 -> 15
  });

  it("acres per hour: 42 in at 4 mph, 80% = 1.36 ac/hr", () => {
    const r = computeAcresPerHour({ width: 42, widthUnit: "in", speedMph: 4, efficiencyPct: 80, area: 1, areaUnit: "acres" });
    expect(round(r.acresPerHour, 2)).toBe(1.36);
  });

  it("gutter: 60 ft run, both ends = 0.75 in drop each side", () => {
    const r = computeGutterSlope({ runLengthFt: 60, slopeInPer10ft: 0.25, downspoutPosition: "both-ends", roofAreaSqFt: null });
    expect(r.slopeRunFt).toBe(30);
    expect(round(r.totalDropIn, 2)).toBe(0.75);
  });

  it("rip rap: 30 x 8 ft x 18 in = 13.33 cu yd ~ 20 t", () => {
    const r = computeRipRap({ lengthFt: 30, widthFt: 8, thicknessIn: 18, densityTonsPerCuYd: 1.5, wastePct: 0, pricePerTon: null });
    expect(round(r.cubicYards, 2)).toBe(13.33);
    expect(round(r.tons, 1)).toBe(20);
  });
});
