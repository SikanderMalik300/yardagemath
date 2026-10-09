/**
 * constants.ts — every user-facing number lives here with a source + date.
 * (build-spec A0.8, A6, A7 "How We Calculate")
 *
 * Values flagged `VERIFY` are industry/manufacturer figures the owner must
 * re-confirm against the cited source before relying on them commercially.
 * Prices are national-average ESTIMATES for planning, not quotes.
 * Checked: 2026-10-07.
 *
 * The /how-we-calculate/ page is generated partly from the metadata here.
 */

export interface SourcedValue {
  value: number;
  unit: string;
  /** Short human label for the How We Calculate table. */
  label: string;
  /** Where the figure comes from. */
  source: string;
  sourceUrl?: string;
  checked: string; // ISO date
  verify?: boolean;
}

/* =========================================================================
   Material densities — US tons per cubic yard
   ========================================================================= */
export const DENSITY_TONS_PER_CUYD = {
  gravel: 1.4, // VERIFY: common landscape-supply figure for 3/4" gravel
  crushedStone: 1.4, // VERIFY
  sand: 1.35, // VERIFY
  topsoil: 1.1, // VERIFY: screened topsoil, varies with moisture
  mulch: 0.3, // VERIFY: bark mulch is light and highly variable
  concreteWet: 2.0, // VERIFY: wet ready-mix ~4000 lb/cu yd
  riverRock: 1.35, // VERIFY
  decomposedGranite: 1.3, // VERIFY
  compost: 0.6, // VERIFY
  ripRap: 1.5, // VERIFY: varies by stone class / state DOT tables
} as const;

export type MaterialKey = keyof typeof DENSITY_TONS_PER_CUYD;

/** Kebab-case slug for a material key, so internal code names never appear in the DOM. */
export function materialSlug(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

/** Human-readable labels for materials (never show internal code names to users). */
export const MATERIAL_LABELS: Record<MaterialKey, string> = {
  gravel: "Gravel",
  crushedStone: "Crushed stone",
  sand: "Sand",
  topsoil: "Topsoil",
  mulch: "Mulch",
  concreteWet: "Concrete (wet)",
  riverRock: "River rock",
  decomposedGranite: "Decomposed granite",
  compost: "Compost",
  ripRap: "Riprap",
};

/** Density sources for the How We Calculate page. */
export const DENSITY_SOURCES: Record<string, { source: string; sourceUrl: string }> = {
  general: {
    source:
      "Densities are nominal, dry, loose values aggregated from landscape-supply yards and USDA/engineering references. Bulk density varies with moisture and material; confirm tonnage with your supplier.",
    sourceUrl: "https://www.nrcs.usda.gov/",
  },
};

/* =========================================================================
   Bag sizes (cubic feet of loose material per bag)
   ========================================================================= */
export const BAG_SIZE_CUFT = {
  mulch: 2, // 2 cu ft bag (most common retail mulch bag)
  gravel: 0.5, // 0.5 cu ft bag (~50 lb)
  soil: 0.75, // 0.75 cu ft bag (~40 lb) — also 1.0 cu ft sold
  soil1: 1.0,
  compost: 1, // 1 cu ft bag
  sand: 0.5, // 0.5 cu ft play-sand bag (~50 lb)
} as const;

/* =========================================================================
   Concrete bag yields — cubic feet of mixed concrete per bag
   VERIFY against the bag label (Quikrete / Sakrete concrete mix).
   ========================================================================= */
export const CONCRETE_BAG_YIELD_CUFT = {
  lb80: 0.6, // VERIFY: Quikrete 80 lb ≈ 0.60 cu ft
  lb60: 0.45, // VERIFY: 60 lb ≈ 0.45 cu ft
  lb40: 0.3, // VERIFY: 40 lb ≈ 0.30 cu ft
} as const;

/* =========================================================================
   Concrete block (CMU) constants
   ========================================================================= */
// Nominal face of a standard block = 8" × 16" = 128 sq in.
// Blocks per sq ft = 144 / 128 = 1.125 (build-spec #2).
export const BLOCKS_PER_SQFT = 1.125;
export const BLOCKS_PER_100_SQFT = 112.5;

// Standard block nominal face height 8", length 16".
export const BLOCK_NOMINAL_HEIGHT_IN = 8;
export const BLOCK_NOMINAL_LENGTH_IN = 16;

// Mortar: ~12 standard blocks per 80-lb bag of mortar mix.
// Quikrete Mortar Mix online calculator: 142 blocks → 12 bags (accessed 9 Oct 2026).
export const BLOCKS_PER_MORTAR_BAG = 12;

// Core-fill grout per sq ft of fully grouted wall (cu ft), by block width.
// VERIFY with NCMA TEK grout-quantity tables.
export const GROUT_CUFT_PER_SQFT = {
  in6: 0.17, // VERIFY (NCMA TEK)
  in8: 0.26, // VERIFY (NCMA TEK)
  in12: 0.42, // VERIFY (NCMA TEK)
} as const;

/* =========================================================================
   Prices — 2026 national-average ESTIMATES (editable in every calculator)
   VERIFY: figures below are planning estimates; the owner must cite a 2026
   source (e.g. HomeAdvisor/Angi cost guides, ready-mix supplier) before use.
   ========================================================================= */
export const PRICES = {
  concretePerCuYd: 160, // VERIFY: 2026 ready-mix national avg $/cu yd (delivered, small load higher)
  concreteBag80: 7.0, // VERIFY: retail 80 lb concrete mix
  concreteBag60: 5.5, // VERIFY
  concreteBag40: 4.5, // VERIFY
  concreteLaborPerSqFt: 4.5, // VERIFY: finishing labor only, varies widely
  rebarMeshPerSqFt: 0.35, // VERIFY: #4 rebar grid or WWM
  blockEach: 2.0, // VERIFY: standard 8×8×16 CMU
  capBlockEach: 2.5, // VERIFY
  mortarBag: 7.5, // VERIFY: 80 lb mortar mix
  rebar20ftBar: 9.0, // VERIFY: #4 x 20 ft
  groutPerCuYd: 170, // VERIFY
  peaGravelPerTon: 55, // VERIFY: bulk pea gravel national avg
  ripRapPerTon: 70, // VERIFY: varies by class & haul distance
  topsoilPerCuYd: 40, // VERIFY: bulk screened topsoil
  mulchPerCuYd: 40, // VERIFY: bulk bark mulch
} as const;

/* =========================================================================
   Coverage of 1 cubic yard by depth (sq ft) — build-spec #1 table
   324 at 1", 162 at 2", 108 at 3", 81 at 4", 54 at 6", 27 at 12"
   Derived: 27 cu ft ÷ (depth_in / 12).
   ========================================================================= */
export const CUYD_COVERAGE_BY_DEPTH: { depthIn: number; sqft: number }[] = [
  { depthIn: 1, sqft: 324 },
  { depthIn: 2, sqft: 162 },
  { depthIn: 3, sqft: 108 },
  { depthIn: 4, sqft: 81 },
  { depthIn: 6, sqft: 54 },
  { depthIn: 12, sqft: 27 },
];

/* =========================================================================
   Lawn mowing — 2026 average homeowner price tiers by lawn size
   VERIFY: figures are planning estimates aggregated from US lawn-care cost
   guides (e.g. LawnStarter / Angi 2026). Rates vary by region and service.
   ========================================================================= */
export const LAWN_PRICE_TIERS: { label: string; acres: number; perCut: number }[] = [
  { label: "¼ acre or less", acres: 0.25, perCut: 40 },
  { label: "½ acre", acres: 0.5, perCut: 55 },
  { label: "¾ acre", acres: 0.75, perCut: 70 },
  { label: "1 acre", acres: 1, perCut: 90 },
  { label: "2 acres", acres: 2, perCut: 150 },
];

export const LAWN_SEASON_WEEKS_DEFAULT = 28; // US mowing season ≈ 26–30 weeks (editable)

/* =========================================================================
   Acres-per-hour / field efficiency — ASABE field-efficiency ranges
   VERIFY with ASABE D497 machinery management data.
   acresPerHour = (width_in × mph × eff) / 99  (eff as a fraction)
   ========================================================================= */
export const FIELD_EFFICIENCY_PRESETS: { label: string; eff: number }[] = [
  { label: "Zero-turn mower (80–85%)", eff: 0.82 },
  { label: "Push mower (70–80%)", eff: 0.75 },
  { label: "Tractor + implement (70–85%)", eff: 0.78 },
];
export const ACRES_PER_HOUR_CONST_IN = 99; // (5280 ÷ 43560) × 12 × 60 ⁻¹ factor → width_in·mph·eff / 99
export const ACRES_PER_HOUR_CONST_FT = 8.25;

/* =========================================================================
   Gutter slope — manufacturer install guidance
   VERIFY with gutter manufacturer installation guides.
   ========================================================================= */
export const GUTTER_SLOPE_PRESETS: { label: string; inchPer10ft: number }[] = [
  { label: '¼" per 10 ft (minimum)', inchPer10ft: 0.25 },
  { label: '½" per 10 ft', inchPer10ft: 0.5 },
  { label: '¼" per foot (fast drainage)', inchPer10ft: 2.5 },
];
// Downspout capacity by size (sq ft of roof drained). VERIFY with SMACNA / manufacturer sizing.
export const DOWNSPOUT_CAPACITY_SQFT = {
  size2x3: 600, // VERIFY
  size3x4: 1200, // VERIFY
};
export const DOWNSPOUT_SPACING_FT = 35; // one per ~30–40 ft of run (VERIFY)

/* =========================================================================
   Rip rap stone classes — representative D50 ranges + layer thickness
   VERIFY with your state DOT riprap gradation tables (values vary by state).
   ========================================================================= */
export const RIPRAP_CLASSES: {
  key: string;
  label: string;
  d50In: string;
  thicknessIn: number;
}[] = [
  { key: "light", label: "Light / Class I", d50In: "4–6 in", thicknessIn: 12 },
  { key: "medium", label: "Medium / Class II", d50In: "9–12 in", thicknessIn: 18 },
  { key: "heavy", label: "Heavy / Class III", d50In: "15–18 in", thicknessIn: 27 },
];

/* =========================================================================
   Default waste percentages per tool (build-spec A6)
   ========================================================================= */
export const DEFAULT_WASTE = {
  yardage: 5,
  concreteSlab: 10,
  block: 5,
  carpet: 10,
  peaGravel: 8,
} as const;

export const SITE = {
  name: "YardageMath",
  domain: "yardagemath.com",
  url: "https://yardagemath.com",
  email: "hello@yardagemath.com",
  founder: "Sikander Mushtaq",
  twitter: "@yardagemath",
} as const;
