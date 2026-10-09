import { describe, it, expect } from "vitest";
import { round } from "@/lib/formulas/units";
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

const base = { diameter: 0, base: 0, height: 0 };

/* 1. Cubic Yard — 10×10×3in → 25 cu ft → 0.93 cu yd (spec #1) */
describe("cubic yard calculator", () => {
  const r = computeCubicYard({
    shape: "rectangle",
    length: 10,
    width: 10,
    depthIn: 3,
    wastePct: 0,
    material: "none",
    ...base,
  });
  it("matches worked example", () => {
    expect(r.volumeCuFt).toBe(25);
    expect(round(r.cubicYards, 2)).toBe(0.93);
  });
  it("mulch bags: 13.5 → 14 of 2 cu ft for a full yard (27 cu ft)", () => {
    const full = computeCubicYard({
      shape: "rectangle",
      length: 54,
      width: 2,
      depthIn: 3,
      wastePct: 0,
      material: "mulch",
      ...base,
    });
    // 54*2 = 108 sqft * 0.25 ft = 27 cu ft → 27/2 = 13.5 → 14 bags
    expect(full.volumeCuFt).toBe(27);
    expect(full.bagsMulch).toBe(14);
  });
  it("tons when a material is chosen", () => {
    const g = computeCubicYard({
      shape: "rectangle",
      length: 10,
      width: 10,
      depthIn: 3,
      wastePct: 0,
      material: "gravel",
      ...base,
    });
    expect(round(g.tons ?? 0, 2)).toBe(round(0.9259 * 1.4, 2));
  });
  it("zero input yields zero", () => {
    const z = computeCubicYard({
      shape: "rectangle",
      length: 0,
      width: 0,
      depthIn: 0,
      wastePct: 5,
      material: "none",
      ...base,
    });
    expect(z.cubicYards).toBe(0);
  });
});

/* 2. Concrete Block — 20×6 wall → 135 blocks +5% = 142 (spec #2) */
describe("concrete block calculator", () => {
  const r = computeConcreteBlock({
    wallLengthFt: 20,
    wallHeightFt: 6,
    openings: [],
    wastePct: 5,
    pricePerBlock: null,
  });
  it("matches worked example", () => {
    expect(r.netAreaSqFt).toBe(120);
    expect(r.blocksBeforeWaste).toBe(135);
    expect(r.blocks).toBe(142);
  });
  it("courses and blocks per course", () => {
    expect(r.courses).toBe(9); // 72in / 8
    expect(r.blocksPerCourse).toBe(15); // 240in / 16
  });
  it("subtracts openings", () => {
    const o = computeConcreteBlock({
      wallLengthFt: 20,
      wallHeightFt: 6,
      openings: [{ count: 1, widthFt: 3, heightFt: 4 }],
      wastePct: 0,
      pricePerBlock: null,
    });
    expect(o.netAreaSqFt).toBe(108);
    expect(o.blocks).toBe(Math.ceil(108 * 1.125));
  });
  it("mortar bags ~12 blocks/bag", () => {
    // ceil(142/12) = 12 (matches Quikrete's Mortar Mix calculator)
    expect(r.mortarBags).toBe(Math.ceil(142 / 12));
    expect(r.mortarBags).toBe(12);
  });
});

/* 3. Concrete Slab — 10×10×4in → 1.36 cu yd, 62 bags of 80 lb (spec #3) */
describe("concrete slab calculator", () => {
  const r = computeConcreteSlab({
    lengthFt: 10,
    widthFt: 10,
    thicknessIn: 4,
    wastePct: 10,
    supplyMode: "bags",
    bagSize: "lb80",
    pricePerCuYd: 160,
    pricePerBag: 7,
    laborPerSqFt: 0,
    rebarPerSqFt: 0,
    gravelBaseDepthIn: 0,
  });
  it("matches worked example", () => {
    expect(round(r.cubicYards, 2)).toBe(1.23);
    expect(round(r.cubicYardsWithWaste, 2)).toBe(1.36);
    expect(r.bags).toBe(62);
  });
  it("cost per sq ft computed", () => {
    const c = computeConcreteSlab({
      lengthFt: 10,
      widthFt: 10,
      thicknessIn: 4,
      wastePct: 10,
      supplyMode: "readymix",
      bagSize: "lb80",
      pricePerCuYd: 160,
      pricePerBag: 7,
      laborPerSqFt: 4.5,
      rebarPerSqFt: 0.35,
      gravelBaseDepthIn: 0,
    });
    expect(c.areaSqFt).toBe(100);
    expect(c.costPerSqFt).toBeGreaterThan(0);
  });
});

/* 4. Topsoil — 20×10×4in → 66.7 cu ft → 2.47 cu yd (spec #4) */
describe("topsoil calculator", () => {
  const r = computeTopsoil({
    shape: "rectangle",
    length: 20,
    width: 10,
    depthIn: 4,
    wastePct: 0,
    bagSizeCuFt: 0.75,
    ...base,
  });
  it("matches worked example", () => {
    expect(round(r.cubicFeetWithWaste, 1)).toBe(66.7);
    expect(round(r.cubicYards, 2)).toBe(2.47);
  });
  it("bags: 36 per yard at 0.75 cu ft", () => {
    const yard = computeTopsoil({
      shape: "rectangle",
      length: 27,
      width: 4,
      depthIn: 3,
      wastePct: 0,
      bagSizeCuFt: 0.75,
      ...base,
    });
    expect(yard.cubicFeetWithWaste).toBe(27);
    expect(yard.bags).toBe(36);
  });
});

/* 5. Pea Gravel — 12×12×3in → 1.33 cu yd ≈ 1.87 tons (spec #5) */
describe("pea gravel calculator", () => {
  const r = computePeaGravel({
    shape: "rectangle",
    length: 12,
    width: 12,
    depthIn: 3,
    wastePct: 0,
    pricePerTon: null,
    pricePerCuYd: null,
    ...base,
  });
  it("matches worked example", () => {
    expect(round(r.cubicYards, 2)).toBe(1.33);
    expect(round(r.tons, 2)).toBe(1.87);
  });
});

/* 6. Square Yard — 12×12 room → 144 sq ft → 16 sq yd (spec #6) */
describe("square yard calculator", () => {
  it("matches worked example", () => {
    const r = computeSquareYard({
      areas: [{ lengthFt: 12, widthFt: 12, directSqFt: null }],
      wastePct: 0,
      pricePerSqYd: null,
    });
    expect(r.totalSqFt).toBe(144);
    expect(r.totalSqYd).toBe(16);
  });
  it("12×15 room → 20 sq yd", () => {
    const r = computeSquareYard({
      areas: [{ lengthFt: 12, widthFt: 15, directSqFt: null }],
      wastePct: 0,
      pricePerSqYd: null,
    });
    expect(r.totalSqYd).toBe(20);
  });
  it("sums multiple rooms + direct sqft", () => {
    const r = computeSquareYard({
      areas: [
        { lengthFt: 12, widthFt: 12, directSqFt: null },
        { lengthFt: 0, widthFt: 0, directSqFt: 90 },
      ],
      wastePct: 0,
      pricePerSqYd: null,
    });
    expect(r.totalSqFt).toBe(234);
  });
});

/* 7. Landscape materials — mulch 108 sqft at 3" = 1 yard */
describe("landscape materials calculator", () => {
  it("mulch yard of coverage", () => {
    const r = computeLandscape({
      material: "mulch",
      shape: "rectangle",
      length: 54,
      width: 2,
      depthIn: 3,
      wastePct: 0,
      ...base,
    });
    expect(round(r.cubicYards, 2)).toBe(1);
    expect(round(r.tons, 2)).toBe(0.3);
  });
});

/* 8. Lawn mowing — pro: 0.25 ac, 21" deck, 3 mph, 80% → ~$45 (spec #8) */
describe("lawn mowing calculator", () => {
  it("pro acres per hour", () => {
    expect(round(acresPerHour(21, 3, 0.8), 2)).toBe(0.51);
  });
  it("pro price ~$45", () => {
    const r = computePro({
      areaSqFt: 0.25 * 43560,
      deckWidthIn: 21,
      speedMph: 3,
      efficiencyPct: 80,
      trimMinutes: 10,
      travelMinutes: 5,
      hourlyRate: 60,
      overheadPct: 0,
    });
    expect(round(r.acresPerHour, 2)).toBe(0.51);
    expect(Math.round(r.price)).toBeGreaterThanOrEqual(43);
    expect(Math.round(r.price)).toBeLessThanOrEqual(47);
  });
  it("homeowner tier pricing", () => {
    const r = computeHomeowner({
      areaSqFt: 0.25 * 43560,
      frequency: "weekly",
      seasonWeeks: 28,
      edging: false,
      trimming: false,
      bagging: false,
    });
    expect(r.perCut).toBe(40);
    expect(r.perSeason).toBe(40 * 28);
  });
});

/* 9. Block wall — 30×4, 8" block → 135 blocks +5%=142, ~12 mortar bags (spec #9) */
describe("block wall calculator", () => {
  const r = computeBlockWall({
    lengthFt: 30,
    heightFt: 4,
    blockWidth: "in8",
    openings: [],
    capBlocks: true,
    coreFill: "none",
    rebarSpacingIn: 32,
    prices: { block: 2, cap: 2.5, mortarBag: 7.5, groutPerCuYd: 170, rebar20ftBar: 9 },
  });
  it("courses, blocks, caps, mortar", () => {
    expect(r.courses).toBe(6); // 48in / 8
    expect(r.blocks).toBe(142); // 120 * 1.125 * 1.05 = 141.75 → 142
    expect(r.capBlocks).toBe(23); // 360in / 16 = 22.5 → 23
    expect(r.mortarBags).toBe(12); // ceil(142/12)
  });
  it("no rebar/grout when core fill is none", () => {
    expect(r.rebarBars).toBe(0);
    expect(r.groutCuYd).toBe(0);
  });
  it("full grout adds volume", () => {
    const g = computeBlockWall({
      lengthFt: 30,
      heightFt: 4,
      blockWidth: "in8",
      openings: [],
      capBlocks: false,
      coreFill: "full",
      rebarSpacingIn: 32,
      prices: { block: 2, cap: 2.5, mortarBag: 7.5, groutPerCuYd: 170, rebar20ftBar: 9 },
    });
    expect(g.groutCuYd).toBeGreaterThan(0);
    expect(g.rebarBars).toBeGreaterThan(0);
  });
});

/* 10. Acres per hour — 60" deck, 6 mph, 80% → 2.91 ac/hr; 5 ac → 1h43m (spec #10) */
describe("acres per hour calculator", () => {
  const r = computeAcresPerHour({
    width: 60,
    widthUnit: "in",
    speedMph: 6,
    efficiencyPct: 80,
    area: 5,
    areaUnit: "acres",
  });
  it("matches worked example", () => {
    expect(round(r.acresPerHour, 2)).toBe(2.91);
    expect(r.hoursWhole).toBe(1);
    expect(r.minutes).toBe(43);
  });
});

/* 11. Gutter slope — 40 ft, ¼" per 10 ft → 1" total drop (spec #11) */
describe("gutter slope calculator", () => {
  const r = computeGutterSlope({
    runLengthFt: 40,
    slopeInPer10ft: 0.25,
    downspoutPosition: "one-end",
    roofAreaSqFt: null,
  });
  it("matches worked example", () => {
    expect(r.totalDropIn).toBe(1);
  });
  it("both-ends halves the slope run", () => {
    const b = computeGutterSlope({
      runLengthFt: 40,
      slopeInPer10ft: 0.25,
      downspoutPosition: "both-ends",
      roofAreaSqFt: null,
    });
    expect(b.totalDropIn).toBe(0.5);
  });
});

/* 12. Rip rap — 50×6×12in → 11.1 cu yd ≈ 16.7 tons (spec #12) */
describe("rip rap calculator", () => {
  const r = computeRipRap({
    lengthFt: 50,
    widthFt: 6,
    thicknessIn: 12,
    densityTonsPerCuYd: 1.5,
    wastePct: 0,
    pricePerTon: null,
  });
  it("matches worked example", () => {
    expect(round(r.cubicYards, 1)).toBe(11.1);
    expect(round(r.tons, 1)).toBe(16.7);
  });
});

/* Float round-up: counts must not land one too high at exact integer boundaries.
   Each case produces an exact whole count whose IEEE-754 product is N + 1e-14,
   which naive Math.ceil would push to N + 1. ceilCount() clears the noise. */
describe("floating-point round-up (count never one too high)", () => {
  it("concrete slab: 12x12x4 + 10% waste, 80-lb = 88 bags (not 89)", () => {
    const r = computeConcreteSlab({
      lengthFt: 12,
      widthFt: 12,
      thicknessIn: 4,
      wastePct: 10, // 48 * 1.10 = 52.8 cu ft; 52.8 / 0.60 = 88 exactly
      supplyMode: "bags",
      bagSize: "lb80",
      pricePerCuYd: 160,
      pricePerBag: 7,
      laborPerSqFt: 0,
      rebarPerSqFt: 0,
      gravelBaseDepthIn: 0,
    });
    expect(r.bags).toBe(88);
  });

  it("concrete block: 20x4 wall + 10% waste = 99 blocks (not 100)", () => {
    // 80 sq ft * 1.125 = 90; 90 * 1.10 = 99.00000000000001
    const r = computeConcreteBlock({
      wallLengthFt: 20,
      wallHeightFt: 4,
      openings: [],
      wastePct: 10,
      pricePerBlock: null,
    });
    expect(r.blocksBeforeWaste).toBe(90);
    expect(r.blocks).toBe(99);
  });

  it("block wall: 40x4 + 5% default waste = 189 blocks (not 190)", () => {
    // 160 sq ft * 1.125 = 180; 180 * 1.05 = 189.00000000000003
    const r = computeBlockWall({
      lengthFt: 40,
      heightFt: 4,
      blockWidth: "in8",
      openings: [],
      capBlocks: false,
      coreFill: "none",
      rebarSpacingIn: 32,
      prices: { block: 2, cap: 2.5, mortarBag: 7.5, groutPerCuYd: 170, rebar20ftBar: 9 },
    });
    expect(r.blocks).toBe(189);
  });
});
