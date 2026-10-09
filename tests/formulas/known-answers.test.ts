import { describe, it, expect } from "vitest";
import { round, feetInchesToFeet, metersToFeet, cmToInches, SQFT_PER_ACRE } from "@/lib/formulas/units";
import { computeCubicYard } from "@/lib/formulas/cubicYard";
import { computeConcreteBlock } from "@/lib/formulas/concreteBlock";
import { computeConcreteSlab } from "@/lib/formulas/concreteSlab";
import { computeTopsoil } from "@/lib/formulas/topsoil";
import { computePeaGravel } from "@/lib/formulas/peaGravel";
import { computeSquareYard } from "@/lib/formulas/squareYard";
import { computeLandscape } from "@/lib/formulas/landscapeMaterials";
import { computeHomeowner, computePro, acresPerHour } from "@/lib/formulas/lawnMowing";
import { computeBlockWall } from "@/lib/formulas/blockWall";
import { computeAcresPerHour } from "@/lib/formulas/acresPerHour";
import { computeGutterSlope } from "@/lib/formulas/gutterSlope";
import { computeRipRap } from "@/lib/formulas/ripRap";

/**
 * Task 5: at least 10 known-answer tests per calculator. Each case carries the
 * hand calculation in a comment. Reference-table and FAQ numbers are asserted
 * against the same functions that drive the pages.
 */

const base = { diameter: 0, base: 0, height: 0 };

/* ============================ 1. Cubic Yard ============================ */
describe("cubic yard — known answers", () => {
  const cy = (length: number, width: number, depthIn: number, wastePct = 0, material: "none" | "gravel" | "mulch" = "none") =>
    computeCubicYard({ shape: "rectangle", length, width, depthIn, wastePct, material, ...base });

  it("example 1: 10x10x3in", () => {
    // 100 sq ft * 0.25 ft = 25 cu ft; 25/27 = 0.9259
    expect(cy(10, 10, 3).volumeCuFt).toBe(25);
    expect(round(cy(10, 10, 3).cubicYards, 2)).toBe(0.93);
  });
  it("example 2: 20x12x4in driveway", () => {
    // 240 * 0.3333 = 80 cu ft; 80/27 = 2.963
    expect(cy(20, 12, 4).volumeCuFt).toBe(80);
    expect(round(cy(20, 12, 4).cubicYards, 2)).toBe(2.96);
  });
  it("whole-number case: 54x2x3in = 1.00 cu yd", () => {
    // 108 * 0.25 = 27 cu ft; 27/27 = 1
    expect(round(cy(54, 2, 3).cubicYards, 2)).toBe(1);
  });
  it("decimal case: 7.5x4x2in = 0.19 cu yd", () => {
    // 30 * 0.1667 = 5 cu ft; 5/27 = 0.1852
    expect(round(cy(7.5, 4, 2).cubicYards, 2)).toBe(0.19);
  });
  it("feet+inches with inches>=12: 5 ft 18 in = 6.5 ft", () => {
    // feetInchesToFeet(5,18)=6.5; 6.5*10=65 sq ft; 65*0.25=16.25; /27=0.6019
    expect(feetInchesToFeet(5, 18)).toBe(6.5);
    expect(round(cy(feetInchesToFeet(5, 18), 10, 3).cubicYards, 2)).toBe(0.6);
  });
  it("waste 0% vs 10%", () => {
    // 0.9259 base; *1.1 = 1.0185
    expect(round(cy(10, 10, 3, 0).cubicYardsWithWaste, 2)).toBe(0.93);
    expect(round(cy(10, 10, 3, 10).cubicYardsWithWaste, 2)).toBe(1.02);
  });
  it("bag counts round up (mulch, 2 cu ft)", () => {
    // 25 * 1.05 = 26.25 cu ft; 26.25/2 = 13.125 -> 14
    expect(cy(10, 10, 3, 5).bagsMulch).toBe(14);
  });
  it("metric equivalence: 3.048 m square, 7.62 cm deep ~ 10x10x3in", () => {
    // metersToFeet(3.048)=10; cmToInches(7.62)=3
    const m = computeCubicYard({ shape: "rectangle", length: metersToFeet(3.048), width: metersToFeet(3.048), depthIn: cmToInches(7.62), wastePct: 0, material: "none", ...base });
    expect(m.cubicYards).toBeCloseTo(cy(10, 10, 3).cubicYards, 2);
  });
  it("zero input: no NaN/Infinity", () => {
    const z = cy(0, 0, 0);
    expect(Number.isFinite(z.cubicYards)).toBe(true);
    expect(z.cubicYards).toBe(0);
  });
  it("large input stays stable: 100x100x12in", () => {
    // 10000 * 1 = 10000 cu ft; /27 = 370.37
    expect(round(cy(100, 100, 12).cubicYards, 2)).toBe(370.37);
  });
  it("FAQ/table: 1 cu yd covers 108 sq ft at 3 in", () => {
    // area 108, depth 3in -> 27 cu ft -> 1 cu yd
    expect(round(cy(108, 1, 3).cubicYards, 2)).toBe(1);
  });
});

/* ============================ 2. Concrete Block ============================ */
describe("concrete block — known answers", () => {
  const cb = (L: number, H: number, waste = 0, openings: { count: number; widthFt: number; heightFt: number }[] = []) =>
    computeConcreteBlock({ wallLengthFt: L, wallHeightFt: H, openings, wastePct: waste, pricePerBlock: null });

  it("example 1: 20x6 wall + 5% = 142", () => {
    // 120 * 1.125 = 135; *1.05 = 141.75 -> 142
    expect(cb(20, 6, 5).blocksBeforeWaste).toBe(135);
    expect(cb(20, 6, 5).blocks).toBe(142);
  });
  it("example 2: 40x4 wall + 5% = 189", () => {
    // 160 * 1.125 = 180; *1.05 = 189
    expect(cb(40, 4, 5).blocks).toBe(189);
  });
  it("whole-number: 10x4 = 45 blocks", () => {
    // 40 * 1.125 = 45
    expect(cb(10, 4, 0).blocks).toBe(45);
  });
  it("decimal: 12.5x8 = 113 blocks", () => {
    // 100 * 1.125 = 112.5 -> ceil 113
    expect(cb(12.5, 8, 0).blocks).toBe(113);
  });
  it("feet+inches with inches>=12 via 6.5 ft", () => {
    // 6.5*8 = 52; *1.125 = 58.5 -> 59
    expect(cb(feetInchesToFeet(5, 18), 8, 0).blocks).toBe(59);
  });
  it("waste 0% vs 10%", () => {
    // 135 vs ceil(135*1.1)=149
    expect(cb(20, 6, 0).blocks).toBe(135);
    expect(cb(20, 6, 10).blocks).toBe(149);
  });
  it("block count rounds up: 9x4 = 41", () => {
    // 36 * 1.125 = 40.5 -> ceil 41
    expect(cb(9, 4, 0).blocks).toBe(41);
  });
  it("courses and blocks per course: 20x6", () => {
    // courses ceil(72/8)=9; per course ceil(240/16)=15
    expect(cb(20, 6).courses).toBe(9);
    expect(cb(20, 6).blocksPerCourse).toBe(15);
  });
  it("openings subtract area: 20x6 minus 3x4 door", () => {
    // net 120-12=108; 108*1.125=121.5 -> ceil 122
    expect(cb(20, 6, 0, [{ count: 1, widthFt: 3, heightFt: 4 }]).blocks).toBe(122);
  });
  it("mortar bags round up: 142 blocks -> 11", () => {
    // ceil(142/13)=11
    expect(cb(20, 6, 5).mortarBags).toBe(11);
  });
  it("zero input: no NaN", () => {
    expect(cb(0, 0).blocks).toBe(0);
  });
  it("large input stable: 1000x10 + 5%", () => {
    // 10000*1.125=11250; *1.05=11812.5 -> 11813
    expect(cb(1000, 10, 5).blocks).toBe(11813);
  });
  it("table: 112.5 blocks per 100 sq ft", () => {
    expect(cb(10, 10, 0).blocksBeforeWaste).toBe(112.5);
  });
});

/* ============================ 3. Concrete Slab ============================ */
describe("concrete slab — known answers", () => {
  const slab = (L: number, W: number, T: number, waste = 0, supplyMode: "readymix" | "bags" = "readymix", bagSize: "lb80" | "lb60" | "lb40" = "lb80", laborPerSqFt = 0, rebarPerSqFt = 0) =>
    computeConcreteSlab({ lengthFt: L, widthFt: W, thicknessIn: T, wastePct: waste, supplyMode, bagSize, pricePerCuYd: 160, pricePerBag: 7, laborPerSqFt, rebarPerSqFt, gravelBaseDepthIn: 0 });

  it("example 1: 10x10x4in, 10% waste, 80-lb bags = 62", () => {
    // 100*(4/12)/27 = 1.2346; *1.1 = 1.358; cu ft 36.67 / 0.6 = 61.1 -> 62
    expect(round(slab(10, 10, 4, 10, "bags").cubicYards, 2)).toBe(1.23);
    expect(round(slab(10, 10, 4, 10, "bags").cubicYardsWithWaste, 2)).toBe(1.36);
    expect(slab(10, 10, 4, 10, "bags").bags).toBe(62);
  });
  it("example 2: 24x24x6in, 10% waste", () => {
    // 576*0.5/27 = 10.667; *1.1 = 11.73
    expect(round(slab(24, 24, 6, 10).cubicYards, 2)).toBe(10.67);
    expect(round(slab(24, 24, 6, 10).cubicYardsWithWaste, 2)).toBe(11.73);
  });
  it("whole-ish: 12x12x3in = 1.33 cu yd", () => {
    // 144*0.25/27 = 1.333
    expect(round(slab(12, 12, 3).cubicYards, 2)).toBe(1.33);
  });
  it("decimal thickness: 10x10x4.5in = 1.39", () => {
    // 100*0.375/27 = 1.3889
    expect(round(slab(10, 10, 4.5).cubicYards, 2)).toBe(1.39);
  });
  it("feet+inches via 11.5 ft length", () => {
    // 11.5*10=115; 115*0.3333/27 = 1.4198
    expect(round(slab(feetInchesToFeet(10, 18), 10, 4).cubicYards, 2)).toBe(1.42);
  });
  it("waste 0% vs 10%", () => {
    expect(round(slab(10, 10, 4, 0).cubicYardsWithWaste, 2)).toBe(1.23);
    expect(round(slab(10, 10, 4, 10).cubicYardsWithWaste, 2)).toBe(1.36);
  });
  it("bags round up: 10x10x4in no waste = 56", () => {
    // 33.33/0.6 = 55.56 -> 56
    expect(slab(10, 10, 4, 0, "bags").bags).toBe(56);
  });
  it("metric equivalence: 3.048 m square, 10.16 cm thick ~ 10x10x4in", () => {
    const m = computeConcreteSlab({ lengthFt: metersToFeet(3.048), widthFt: metersToFeet(3.048), thicknessIn: cmToInches(10.16), wastePct: 0, supplyMode: "readymix", bagSize: "lb80", pricePerCuYd: 160, pricePerBag: 7, laborPerSqFt: 0, rebarPerSqFt: 0, gravelBaseDepthIn: 0 });
    expect(m.cubicYards).toBeCloseTo(slab(10, 10, 4).cubicYards, 2);
  });
  it("zero input: no NaN", () => {
    expect(slab(0, 0, 0).cubicYards).toBe(0);
    expect(Number.isFinite(slab(0, 0, 0).costPerSqFt)).toBe(true);
  });
  it("large input stable: 100x100x6in", () => {
    // 10000*0.5/27 = 185.19
    expect(round(slab(100, 100, 6).cubicYards, 2)).toBe(185.19);
  });
  it("cost per sq ft: 10x10x4in, 10% waste, labor 4.5, rebar 0.35", () => {
    // material 1.358*160=217.3; labor 450; rebar 35; total 702.3; /100 = 7.02
    const r = slab(10, 10, 4, 10, "readymix", "lb80", 4.5, 0.35);
    expect(round(r.costPerSqFt, 2)).toBe(7.02);
  });
  it("table: 30x30x4in = 11.11 cu yd", () => {
    expect(round(slab(30, 30, 4).cubicYards, 2)).toBe(11.11);
  });
});

/* ============================ 4. Topsoil ============================ */
describe("topsoil — known answers", () => {
  const ts = (L: number, W: number, depthIn: number, waste = 0, bag = 0.75) =>
    computeTopsoil({ shape: "rectangle", length: L, width: W, depthIn, wastePct: waste, bagSizeCuFt: bag, ...base });

  it("example 1: 20x10x4in = 2.47 cu yd", () => {
    // 200*0.3333 = 66.67; /27 = 2.469
    expect(round(ts(20, 10, 4).cubicFeetWithWaste, 1)).toBe(66.7);
    expect(round(ts(20, 10, 4).cubicYards, 2)).toBe(2.47);
  });
  it("example 2: 4x8x12in raised bed = 1.19", () => {
    // 32 cu ft; /27 = 1.185
    expect(ts(4, 8, 12).cubicFeetWithWaste).toBe(32);
    expect(round(ts(4, 8, 12).cubicYards, 2)).toBe(1.19);
  });
  it("whole-number: 27x4x3in = 1.00 cu yd, 36 bags", () => {
    // 108*0.25=27; cy 1; 27/0.75=36
    expect(round(ts(27, 4, 3).cubicYards, 2)).toBe(1);
    expect(ts(27, 4, 3).bags).toBe(36);
  });
  it("decimal: 10x10x2.5in = 0.77", () => {
    // 100*2.5/12=20.83; /27=0.7716
    expect(round(ts(10, 10, 2.5).cubicYards, 2)).toBe(0.77);
  });
  it("feet+inches via 6.5 ft", () => {
    // 6.5*10=65; 65*0.3333=21.67; /27=0.8025
    expect(round(ts(feetInchesToFeet(5, 18), 10, 4).cubicYards, 2)).toBe(0.8);
  });
  it("waste 0% vs 10%", () => {
    // 2.469 vs *1.1 = 2.716
    expect(round(ts(20, 10, 4, 0).cubicYardsWithWaste, 2)).toBe(2.47);
    expect(round(ts(20, 10, 4, 10).cubicYardsWithWaste, 2)).toBe(2.72);
  });
  it("bags round up: 20x10x4in, 0.75 cu ft = 89", () => {
    // 66.67/0.75 = 88.9 -> 89
    expect(ts(20, 10, 4).bags).toBe(89);
  });
  it("metric equivalence ~ 20x10x4in", () => {
    const m = computeTopsoil({ shape: "rectangle", length: metersToFeet(6.096), width: metersToFeet(3.048), depthIn: cmToInches(10.16), wastePct: 0, bagSizeCuFt: 0.75, ...base });
    expect(m.cubicYards).toBeCloseTo(ts(20, 10, 4).cubicYards, 2);
  });
  it("zero input: no NaN", () => {
    expect(ts(0, 0, 0).cubicYards).toBe(0);
  });
  it("large input stable: 100x100x6in", () => {
    expect(round(ts(100, 100, 6).cubicYards, 2)).toBe(185.19);
  });
  it("FAQ: 20x10x4in ~ 2.7 tons", () => {
    // 2.469 * 1.1(waste0 base) -> tons uses with-waste; waste0 so 2.469*1.1 density? tons=cy*1.1 density
    // 2.469 * 1.1 = 2.716 -> 2.7
    expect(round(ts(20, 10, 4).tons, 1)).toBe(2.7);
  });
  it("table: 1,000 sq ft at 4in = 12.35 cu yd", () => {
    // 1000*0.3333 = 333.33; /27 = 12.346
    expect(round(ts(100, 10, 4).cubicYards, 2)).toBe(12.35);
  });
});

/* ============================ 5. Pea Gravel ============================ */
describe("pea gravel — known answers", () => {
  const pg = (L: number, W: number, depthIn: number, waste = 0, pricePerTon: number | null = null) =>
    computePeaGravel({ shape: "rectangle", length: L, width: W, depthIn, wastePct: waste, pricePerTon, pricePerCuYd: null, ...base });

  it("example 1: 12x12x3in = 1.33 cu yd ~ 1.87 t", () => {
    // 36 cu ft; /27 = 1.333; *1.4 = 1.867
    expect(round(pg(12, 12, 3).cubicYards, 2)).toBe(1.33);
    expect(round(pg(12, 12, 3).tons, 2)).toBe(1.87);
  });
  it("example 2: 3x40x2in path = 0.74 cu yd ~ 1.04 t", () => {
    // 20 cu ft; /27 = 0.7407; *1.4 = 1.037
    expect(pg(3, 40, 2).cubicFeetWithWaste).toBe(20);
    expect(round(pg(3, 40, 2).cubicYards, 2)).toBe(0.74);
    expect(round(pg(3, 40, 2).tons, 2)).toBe(1.04);
  });
  it("whole-number: 54x2x3in = 1.00 cu yd", () => {
    expect(round(pg(54, 2, 3).cubicYards, 2)).toBe(1);
  });
  it("decimal: 10x10x2.5in = 0.77", () => {
    expect(round(pg(10, 10, 2.5).cubicYards, 2)).toBe(0.77);
  });
  it("feet+inches via 5.5 ft", () => {
    // 5.5*10=55; 55*0.25=13.75; /27=0.509
    expect(round(pg(feetInchesToFeet(4, 18), 10, 3).cubicYards, 2)).toBe(0.51);
  });
  it("waste 0% vs 10%", () => {
    expect(round(pg(12, 12, 3, 0).cubicYardsWithWaste, 2)).toBe(1.33);
    expect(round(pg(12, 12, 3, 10).cubicYardsWithWaste, 2)).toBe(1.47);
  });
  it("bags round up (0.5 cu ft): 12x12x3in + 5% = 76", () => {
    // 36*1.05 = 37.8; /0.5 = 75.6 -> 76
    expect(pg(12, 12, 3, 5).bags).toBe(76);
  });
  it("metric equivalence ~ 12x12x3in", () => {
    const m = computePeaGravel({ shape: "rectangle", length: metersToFeet(3.6576), width: metersToFeet(3.6576), depthIn: cmToInches(7.62), wastePct: 0, pricePerTon: null, pricePerCuYd: null, ...base });
    expect(m.cubicYards).toBeCloseTo(pg(12, 12, 3).cubicYards, 2);
  });
  it("zero input: no NaN", () => {
    expect(pg(0, 0, 0).cubicYards).toBe(0);
    expect(pg(0, 0, 0).tons).toBe(0);
  });
  it("large input stable: 100x100x4in", () => {
    // 10000*0.3333 = 3333.3; /27 = 123.46
    expect(round(pg(100, 100, 4).cubicYards, 2)).toBe(123.46);
  });
  it("density relationship: tons = cu yd x 1.4", () => {
    const r = pg(12, 12, 3);
    expect(round(r.tons / r.cubicYardsWithWaste, 2)).toBe(1.4);
  });
  it("price: 12x12x3in at $55/ton ~ $103", () => {
    // 1.867 t * 55 = 102.67
    expect(Math.round(pg(12, 12, 3, 0, 55).cost ?? 0)).toBe(103);
  });
});

/* ============================ 6. Square Yard ============================ */
describe("square yard — known answers", () => {
  const sy = (rows: { lengthFt: number; widthFt: number; directSqFt?: number | null }[], waste = 0, price: number | null = null) =>
    computeSquareYard({ areas: rows.map((r) => ({ lengthFt: r.lengthFt, widthFt: r.widthFt, directSqFt: r.directSqFt ?? null })), wastePct: waste, pricePerSqYd: price });

  it("example 1: 12x12 room = 16 sq yd", () => {
    // 144 / 9 = 16
    expect(sy([{ lengthFt: 12, widthFt: 12 }]).totalSqYd).toBe(16);
  });
  it("example 2: 12x15 room = 20 sq yd", () => {
    expect(sy([{ lengthFt: 12, widthFt: 15 }]).totalSqYd).toBe(20);
  });
  it("whole-number: 9x9 = 9 sq yd", () => {
    // 81 / 9 = 9
    expect(sy([{ lengthFt: 9, widthFt: 9 }]).totalSqYd).toBe(9);
  });
  it("decimal: 10x10.5 = 11.67 sq yd", () => {
    // 105 / 9 = 11.667
    expect(round(sy([{ lengthFt: 10, widthFt: 10.5 }]).totalSqYd, 2)).toBe(11.67);
  });
  it("multiple rooms add up: 12x12 + 10x12", () => {
    // 144 + 120 = 264; /9 = 29.33
    expect(round(sy([{ lengthFt: 12, widthFt: 12 }, { lengthFt: 10, widthFt: 12 }]).totalSqYd, 2)).toBe(29.33);
  });
  it("waste 0% vs 10%", () => {
    expect(sy([{ lengthFt: 12, widthFt: 12 }], 0).totalSqYdWithWaste).toBe(16);
    expect(round(sy([{ lengthFt: 12, widthFt: 12 }], 10).totalSqYdWithWaste, 2)).toBe(17.6);
  });
  it("direct square feet input: 90 sq ft = 10 sq yd", () => {
    expect(sy([{ lengthFt: 0, widthFt: 0, directSqFt: 90 }]).totalSqYd).toBe(10);
  });
  it("metric equivalence: 3.6576 m square ~ 12x12 ft", () => {
    const m = sy([{ lengthFt: metersToFeet(3.6576), widthFt: metersToFeet(3.6576) }]);
    expect(m.totalSqYd).toBeCloseTo(16, 2);
  });
  it("zero input: no NaN", () => {
    expect(sy([{ lengthFt: 0, widthFt: 0 }]).totalSqYd).toBe(0);
  });
  it("large input stable: 100x100 = 1111.11 sq yd", () => {
    // 10000 / 9 = 1111.11
    expect(round(sy([{ lengthFt: 100, widthFt: 100 }]).totalSqYd, 2)).toBe(1111.11);
  });
  it("FAQ: 10x12 room = 13.3 sq yd", () => {
    // 120 / 9 = 13.33
    expect(round(sy([{ lengthFt: 10, widthFt: 12 }]).totalSqYd, 1)).toBe(13.3);
  });
  it("table: 1 sq yd = 0.836 m^2 (144 sq ft -> 13.38 m^2)", () => {
    // 144 / 10.7639 = 13.38
    expect(round(sy([{ lengthFt: 12, widthFt: 12 }]).totalSqM, 2)).toBe(13.38);
  });
});

/* ============================ 7. Landscape Materials ============================ */
describe("landscape materials — known answers", () => {
  const lm = (material: "mulch" | "gravel" | "riverRock", L: number, W: number, depthIn: number, waste = 0) =>
    computeLandscape({ material, shape: "rectangle", length: L, width: W, depthIn, wastePct: waste, ...base });

  it("mulch 108 sq ft at 3in = 1 cu yd ~ 0.3 t", () => {
    // 27 cu ft; /27 = 1; *0.3 = 0.3
    expect(round(lm("mulch", 54, 2, 3).cubicYards, 2)).toBe(1);
    expect(round(lm("mulch", 54, 2, 3).tons, 2)).toBe(0.3);
  });
  it("example 2: 3x60 mulch at 3in = 1.67 cu yd", () => {
    // 45 cu ft; /27 = 1.667
    expect(lm("mulch", 3, 60, 3).cubicFeetWithWaste).toBe(45);
    expect(round(lm("mulch", 3, 60, 3).cubicYards, 2)).toBe(1.67);
  });
  it("whole-number: mulch 108x1x3in = 1 cu yd", () => {
    expect(round(lm("mulch", 108, 1, 3).cubicYards, 2)).toBe(1);
  });
  it("decimal: gravel 10x10x2.5in = 0.77", () => {
    expect(round(lm("gravel", 10, 10, 2.5).cubicYards, 2)).toBe(0.77);
  });
  it("feet+inches via 6.5 ft (mulch)", () => {
    expect(round(lm("mulch", feetInchesToFeet(5, 18), 10, 3).cubicYards, 2)).toBe(0.6);
  });
  it("waste 0% vs 10% (mulch)", () => {
    expect(round(lm("mulch", 54, 2, 3, 0).cubicYardsWithWaste, 2)).toBe(1);
    expect(round(lm("mulch", 54, 2, 3, 10).cubicYardsWithWaste, 2)).toBe(1.1);
  });
  it("mulch bags round up (2 cu ft): 27 cu ft = 14", () => {
    // 27/2 = 13.5 -> 14
    expect(lm("mulch", 54, 2, 3).bags).toBe(14);
  });
  it("metric equivalence (mulch) ~ 54x2x3in", () => {
    const m = computeLandscape({ material: "mulch", shape: "rectangle", length: metersToFeet(16.4592), width: metersToFeet(0.6096), depthIn: cmToInches(7.62), wastePct: 0, ...base });
    expect(m.cubicYards).toBeCloseTo(lm("mulch", 54, 2, 3).cubicYards, 2);
  });
  it("zero input: no NaN", () => {
    expect(lm("mulch", 0, 0, 0).cubicYards).toBe(0);
  });
  it("large input stable: mulch 100x100x3in", () => {
    // 10000*0.25 = 2500; /27 = 92.59
    expect(round(lm("mulch", 100, 100, 3).cubicYards, 2)).toBe(92.59);
  });
  it("river rock density: tons = cu yd x 1.35", () => {
    const r = lm("riverRock", 20, 10, 3);
    expect(round(r.tons / r.cubicYardsWithWaste, 2)).toBe(1.35);
  });
  it("FAQ: mulch 200 sq ft at 3in = 1.85 cu yd", () => {
    // 200*0.25 = 50; /27 = 1.852
    expect(round(lm("mulch", 20, 10, 3).cubicYards, 2)).toBe(1.85);
  });
});

/* ============================ 8. Lawn Mowing ============================ */
describe("lawn mowing — known answers", () => {
  const pro = (acres: number, deck: number, mph: number, eff: number, trim = 0, travel = 0, rate = 60, oh = 0) =>
    computePro({ areaSqFt: acres * SQFT_PER_ACRE, deckWidthIn: deck, speedMph: mph, efficiencyPct: eff, trimMinutes: trim, travelMinutes: travel, hourlyRate: rate, overheadPct: oh });
  const home = (acres: number, frequency: "weekly" | "biweekly" = "weekly", edging = false, trimming = false, bagging = false) =>
    computeHomeowner({ areaSqFt: acres * SQFT_PER_ACRE, frequency, seasonWeeks: 28, edging, trimming, bagging });

  it("acres/hr formula: 21in, 3mph, 80% = 0.51", () => {
    // 21*3*0.8 / 99 = 0.509
    expect(round(acresPerHour(21, 3, 0.8), 2)).toBe(0.51);
  });
  it("acres/hr formula: 60in, 6mph, 80% = 2.91", () => {
    // 288 / 99 = 2.909
    expect(round(acresPerHour(60, 6, 0.8), 2)).toBe(2.91);
  });
  it("pro example 1: 0.25 ac, 21in, 3mph ~ $45", () => {
    const r = pro(0.25, 21, 3, 80, 10, 5);
    expect(round(r.acresPerHour, 2)).toBe(0.51);
    expect(Math.round(r.price)).toBeGreaterThanOrEqual(43);
    expect(Math.round(r.price)).toBeLessThanOrEqual(47);
  });
  it("pro example 2: 0.5 ac, 42in, 4mph, 80% = 1.36 ac/hr, ~22 min", () => {
    const r = pro(0.5, 42, 4, 80);
    expect(round(r.acresPerHour, 2)).toBe(1.36);
    expect(Math.round(r.mowHours * 60)).toBe(22);
  });
  it("homeowner whole: 1 acre weekly = $90/cut", () => {
    expect(home(1).perCut).toBe(90);
  });
  it("homeowner tier + extras: 0.25 ac + edging/trim/bag", () => {
    // 40 + 8 + 7 + 10 = 65
    expect(home(0.25, "weekly", true, true, true).perCut).toBe(65);
  });
  it("decimal pro: 0.33 ac, 48in, 5mph, 80%", () => {
    // 48*5*0.8/99 = 1.939
    expect(round(pro(0.33, 48, 5, 80).acresPerHour, 2)).toBe(1.94);
  });
  it("season math: 0.25 ac weekly, 28 weeks", () => {
    // 40 * 28 = 1120
    expect(home(0.25).perSeason).toBe(1120);
  });
  it("zero input: no NaN/Infinity", () => {
    const r = computePro({ areaSqFt: 0, deckWidthIn: 0, speedMph: 0, efficiencyPct: 0, trimMinutes: 0, travelMinutes: 0, hourlyRate: 0, overheadPct: 0 });
    expect(Number.isFinite(r.price)).toBe(true);
    expect(r.mowHours).toBe(0);
    expect(r.price).toBe(0);
  });
  it("large input stable: 100 ac, 60in, 7mph, 85%", () => {
    // 60*7*0.85/99 = 3.606; 100/3.606 = 27.7
    const r = pro(100, 60, 7, 85);
    expect(Number.isFinite(r.totalHours)).toBe(true);
    expect(round(r.acresPerHour, 2)).toBe(3.61);
  });
  it("price per 1,000 sq ft is finite", () => {
    const r = pro(0.25, 21, 3, 80, 10, 5);
    expect(Number.isFinite(r.pricePer1000SqFt)).toBe(true);
    expect(r.pricePer1000SqFt).toBeGreaterThan(0);
  });
  it("table: 42in, 4mph, 80% = 1.36 ac/hr", () => {
    expect(round(acresPerHour(42, 4, 0.8), 2)).toBe(1.36);
  });
});

/* ============================ 9. Block Wall ============================ */
describe("block wall — known answers", () => {
  const prices = { block: 2, cap: 2.5, mortarBag: 7.5, groutPerCuYd: 170, rebar20ftBar: 9 };
  const bw = (L: number, H: number, opts: Partial<{ cap: boolean; coreFill: "none" | "everyOther" | "full" }> = {}) =>
    computeBlockWall({ lengthFt: L, heightFt: H, blockWidth: "in8", openings: [], capBlocks: opts.cap ?? true, coreFill: opts.coreFill ?? "none", rebarSpacingIn: 32, prices });

  it("example 1: 30x4 = 6 courses, 142 blocks, 23 caps, 11 mortar", () => {
    const r = bw(30, 4);
    expect(r.courses).toBe(6); // 48/8
    expect(r.blocks).toBe(142); // 120*1.125*1.05 = 141.75 -> 142
    expect(r.capBlocks).toBe(23); // ceil(360/16)
    expect(r.mortarBags).toBe(11); // ceil(142/13)
  });
  it("example 2: 50x3 = 178 blocks, 38 caps", () => {
    const r = bw(50, 3);
    expect(r.blocks).toBe(178); // 150*1.125*1.05 = 177.19 -> 178
    expect(r.capBlocks).toBe(38); // ceil(600/16)
  });
  it("whole-number courses: 30x4 = 6", () => {
    expect(bw(30, 4).courses).toBe(6);
  });
  it("decimal length: 25x4", () => {
    // 100 * 1.125 * 1.05 = 118.125 -> 119
    expect(bw(25, 4).blocks).toBe(119);
  });
  it("feet+inches: height 3 ft = 5 courses (rounds up from 4.5)", () => {
    // ceil(36/8) = 5
    expect(bw(50, 3).courses).toBe(5);
  });
  it("waste is built in at 5%", () => {
    // 120 * 1.125 = 135; *1.05 = 141.75 -> 142
    expect(bw(30, 4).blocks).toBe(142);
  });
  it("blocks round up: 9x4", () => {
    // 36*1.125*1.05 = 42.525 -> 43
    expect(bw(9, 4).blocks).toBe(43);
  });
  it("core fill none -> no grout, no rebar", () => {
    const r = bw(30, 4, { coreFill: "none" });
    expect(r.groutCuYd).toBe(0);
    expect(r.rebarBars).toBe(0);
  });
  it("full grout adds grout and rebar", () => {
    const r = bw(30, 4, { coreFill: "full" });
    expect(r.groutCuYd).toBeGreaterThan(0);
    expect(r.rebarBars).toBeGreaterThan(0);
  });
  it("zero input: no NaN", () => {
    expect(bw(0, 0).blocks).toBe(0);
  });
  it("large input stable: 500x8", () => {
    // 4000*1.125*1.05 = 4725 -> 4725
    expect(bw(500, 8).blocks).toBe(4725);
    expect(Number.isFinite(bw(500, 8).cost.total)).toBe(true);
  });
  it("table: 20x4 = 95 blocks, 8 mortar", () => {
    const r = bw(20, 4);
    expect(r.blocks).toBe(95); // 80*1.125*1.05 = 94.5 -> 95
    expect(r.mortarBags).toBe(8); // ceil(95/13)
  });
});

/* ============================ 10. Acres per Hour ============================ */
describe("acres per hour — known answers", () => {
  const ah = (width: number, widthUnit: "in" | "ft", mph: number, eff: number, area: number, areaUnit: "acres" | "sqft") =>
    computeAcresPerHour({ width, widthUnit, speedMph: mph, efficiencyPct: eff, area, areaUnit });

  it("example: 60in, 6mph, 80%, 5 ac = 2.91 ac/hr, 1h43m", () => {
    const r = ah(60, "in", 6, 80, 5, "acres");
    expect(round(r.acresPerHour, 2)).toBe(2.91);
    expect(r.hoursWhole).toBe(1);
    expect(r.minutes).toBe(43);
  });
  it("example 2: 42in, 4mph, 80%, 1 ac = 1.36 ac/hr, 44 min", () => {
    const r = ah(42, "in", 4, 80, 1, "acres");
    expect(round(r.acresPerHour, 2)).toBe(1.36);
    expect(r.minutes).toBe(44);
  });
  it("whole-number: 99in, 1mph, 100% = 1.00 ac/hr", () => {
    // 99*1*1 / 99 = 1
    expect(round(ah(99, "in", 1, 100, 1, "acres").acresPerHour, 2)).toBe(1);
  });
  it("decimal: 48in, 5mph, 80% = 1.94 ac/hr", () => {
    expect(round(ah(48, "in", 5, 80, 1, "acres").acresPerHour, 2)).toBe(1.94);
  });
  it("width unit ft == in: 5 ft = 60 in", () => {
    expect(ah(5, "ft", 3, 80, 1, "acres").acresPerHour).toBeCloseTo(ah(60, "in", 3, 80, 1, "acres").acresPerHour, 6);
  });
  it("area unit sqft == acres: 43,560 sq ft = 1 acre", () => {
    expect(ah(60, "in", 6, 80, 43560, "sqft").hours).toBeCloseTo(ah(60, "in", 6, 80, 1, "acres").hours, 6);
  });
  it("efficiency changes output: 60in, 6mph, 70%", () => {
    // 60*6*0.7 / 99 = 2.545
    expect(round(ah(60, "in", 6, 70, 1, "acres").acresPerHour, 2)).toBe(2.55);
  });
  it("zero width: no NaN/Infinity", () => {
    const r = ah(0, "in", 6, 80, 5, "acres");
    expect(r.acresPerHour).toBe(0);
    expect(r.hours).toBe(0);
  });
  it("large input stable: 72in, 7mph, 85%, 100 ac", () => {
    // 72*7*0.85 / 99 = 4.327; 100/4.327 = 23.11
    const r = ah(72, "in", 7, 85, 100, "acres");
    expect(round(r.acresPerHour, 2)).toBe(4.33);
    expect(Number.isFinite(r.hours)).toBe(true);
  });
  it("time breakdown: 5 ac at 2.91 = 1h 43m", () => {
    const r = ah(60, "in", 6, 80, 5, "acres");
    expect(r.hoursWhole).toBe(1);
    expect(r.minutes).toBe(43);
  });
  it("table: 72in, 5mph, 80% = 2.91 ac/hr", () => {
    expect(round(ah(72, "in", 5, 80, 1, "acres").acresPerHour, 2)).toBe(2.91);
  });
});

/* ============================ 11. Gutter Slope ============================ */
describe("gutter slope — known answers", () => {
  const gs = (run: number, slope: number, position: "one-end" | "both-ends" | "middle", roof: number | null = null) =>
    computeGutterSlope({ runLengthFt: run, slopeInPer10ft: slope, downspoutPosition: position, roofAreaSqFt: roof });

  it("example: 40 ft at 1/4in/10ft = 1in total drop", () => {
    // 40/10 * 0.25 = 1
    expect(gs(40, 0.25, "one-end").totalDropIn).toBe(1);
  });
  it("example 2: 60 ft both ends = 30 ft run, 0.75in each side", () => {
    expect(gs(60, 0.25, "both-ends").slopeRunFt).toBe(30);
    expect(gs(60, 0.25, "both-ends").totalDropIn).toBe(0.75);
  });
  it("whole-number: 20 ft at 1/2in/10ft = 1in", () => {
    expect(gs(20, 0.5, "one-end").totalDropIn).toBe(1);
  });
  it("decimal: 35 ft at 1/4in/10ft = 0.875in", () => {
    expect(round(gs(35, 0.25, "one-end").totalDropIn, 3)).toBe(0.875);
  });
  it("middle feed halves the slope run: 40 ft = 20 ft run, 0.5in", () => {
    expect(gs(40, 0.25, "middle").slopeRunFt).toBe(20);
    expect(gs(40, 0.25, "middle").totalDropIn).toBe(0.5);
  });
  it("downspouts by spacing: 100 ft = 3", () => {
    // ceil(100/35) = 3
    expect(gs(100, 0.25, "one-end").downspoutsBySpacing).toBe(3);
  });
  it("downspouts by roof area: 800 sq ft", () => {
    // 2x3: ceil(800/600)=2; 3x4: ceil(800/1200)=1
    expect(gs(40, 0.25, "one-end", 800).downspoutsByArea2x3).toBe(2);
    expect(gs(40, 0.25, "one-end", 800).downspoutsByArea3x4).toBe(1);
  });
  it("threshold run 10 ft: drop 0.25in, 1 downspout", () => {
    expect(gs(10, 0.25, "one-end").totalDropIn).toBe(0.25);
    expect(gs(10, 0.25, "one-end").downspoutsBySpacing).toBe(1);
  });
  it("zero run: no NaN, min 1 downspout", () => {
    expect(gs(0, 0.25, "one-end").totalDropIn).toBe(0);
    expect(gs(0, 0.25, "one-end").downspoutsBySpacing).toBe(1);
  });
  it("large input stable: 200 ft at 1/2in/10ft", () => {
    // 200/10 * 0.5 = 10
    expect(gs(200, 0.5, "one-end").totalDropIn).toBe(10);
    expect(gs(200, 0.5, "one-end").downspoutsBySpacing).toBe(6); // ceil(200/35)
  });
  it("table: 30 ft at 1/4in/10ft = 0.75in", () => {
    expect(gs(30, 0.25, "one-end").totalDropIn).toBe(0.75);
  });
  it("table: 60 ft at 1/2in/10ft = 3.0in", () => {
    expect(gs(60, 0.5, "one-end").totalDropIn).toBe(3);
  });
});

/* ============================ 12. Rip Rap ============================ */
describe("rip rap — known answers", () => {
  const rr = (L: number, W: number, T: number, waste = 0, density = 1.5, price: number | null = null) =>
    computeRipRap({ lengthFt: L, widthFt: W, thicknessIn: T, densityTonsPerCuYd: density, wastePct: waste, pricePerTon: price });

  it("example: 50x6x12in = 11.1 cu yd ~ 16.7 t", () => {
    // 300 cu ft; /27 = 11.11; *1.5 = 16.67
    expect(round(rr(50, 6, 12).cubicYards, 1)).toBe(11.1);
    expect(round(rr(50, 6, 12).tons, 1)).toBe(16.7);
  });
  it("example 2: 30x8x18in = 13.33 cu yd ~ 20 t", () => {
    // 360 cu ft; /27 = 13.33; *1.5 = 20
    expect(round(rr(30, 8, 18).cubicYards, 2)).toBe(13.33);
    expect(round(rr(30, 8, 18).tons, 1)).toBe(20);
  });
  it("whole-number: 54x6x12in = 12.00 cu yd", () => {
    // 324 cu ft; /27 = 12
    expect(round(rr(54, 6, 12).cubicYards, 2)).toBe(12);
  });
  it("decimal: 10x10x6in = 1.85 cu yd", () => {
    // 50 cu ft; /27 = 1.852
    expect(round(rr(10, 10, 6).cubicYards, 2)).toBe(1.85);
  });
  it("thickness 24in: 20x10x24in = 14.81 cu yd", () => {
    // 400 cu ft; /27 = 14.81
    expect(round(rr(20, 10, 24).cubicYards, 2)).toBe(14.81);
  });
  it("waste 0% vs 10%", () => {
    expect(round(rr(50, 6, 12, 0).cubicYardsWithWaste, 2)).toBe(11.11);
    expect(round(rr(50, 6, 12, 10).cubicYardsWithWaste, 2)).toBe(12.22);
  });
  it("density variation: 1.4 t/yd3", () => {
    // 11.11 * 1.4 = 15.56
    expect(round(rr(50, 6, 12, 0, 1.4).tons, 2)).toBe(15.56);
  });
  it("metric equivalence ~ 50x6x12in", () => {
    const m = computeRipRap({ lengthFt: metersToFeet(15.24), widthFt: metersToFeet(1.8288), thicknessIn: cmToInches(30.48), densityTonsPerCuYd: 1.5, wastePct: 0, pricePerTon: null });
    expect(m.cubicYards).toBeCloseTo(rr(50, 6, 12).cubicYards, 1);
  });
  it("zero input: no NaN", () => {
    expect(rr(0, 0, 0).cubicYards).toBe(0);
    expect(rr(0, 0, 0).tons).toBe(0);
  });
  it("large input stable: 500x50x24in", () => {
    // 50000 cu ft; /27 = 1851.85
    expect(round(rr(500, 50, 24).cubicYards, 2)).toBe(1851.85);
  });
  it("FAQ: 100 sq ft at 12in ~ 5.6 t", () => {
    // 100 cu ft; /27 = 3.70; *1.5 = 5.56
    expect(round(rr(10, 10, 12).tons, 1)).toBe(5.6);
  });
  it("price: 50x6x12in at $70/ton ~ $1,167", () => {
    // 16.67 t * 70 = 1166.9
    expect(Math.round(rr(50, 6, 12, 0, 1.5, 70).cost ?? 0)).toBe(1167);
  });
});
