/**
 * External source citations (audit P1 #1). Every figure in constants.ts maps to
 * one or more of these. URLs were opened on the "checked" date below; cite only
 * real, reachable sources — never invent URLs.
 */

export interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  checked: string; // ISO date the URL was last opened
}

const CHECKED = "2026-10-08";

export const SOURCES = {
  quikreteConcrete: {
    id: "quikreteConcrete",
    title: "Concrete Mix No. 1101 — product data sheet (80 lb ≈ 0.60 cu ft)",
    publisher: "QUIKRETE",
    url: "https://www.quikrete.com/pdfs/data_sheet-concrete%20mix%201101.pdf",
    checked: CHECKED,
  },
  quikreteMortar: {
    id: "quikreteMortar",
    title: "Mortar Mix No. 1102 — product data sheet",
    publisher: "QUIKRETE",
    url: "https://www.quikrete.com/pdfs/data_sheet-mortar%20mix%201102.pdf",
    checked: CHECKED,
  },
  quikreteMortarCalc: {
    id: "quikreteMortarCalc",
    title: "Mortar Mix online calculator: 142 standard blocks → 12 bags of 80 lb",
    publisher: "QUIKRETE",
    url: "https://www.quikrete.com/calculator/main.asp",
    checked: "2026-10-09",
  },
  ncmaTek: {
    id: "ncmaTek",
    title: "TEK 14-13A, Concrete Masonry — units and grout per square foot",
    publisher: "NCMA / Concrete Masonry & Hardscapes Association",
    url: "https://www.superblock.com.mx/files/TEK-14-13A.pdf",
    checked: CHECKED,
  },
  asabeD497: {
    id: "asabeD497",
    title: "ASAE/ASABE D497 — Agricultural Machinery Management Data (field efficiency)",
    publisher: "ASABE (ANSI preview)",
    url: "https://webstore.ansi.org/preview-pages/ASABE/preview_ASAE+D497.7+MAR2011+(R2015).pdf",
    checked: CHECKED,
  },
  isuFieldCapacity: {
    id: "isuFieldCapacity",
    title: "Estimating Field Capacity of Farm Machines (A3-24), citing ASABE D497",
    publisher: "Iowa State University Extension",
    url: "https://www.extension.iastate.edu/AGDm/crops/pdf/a3-24.pdf",
    checked: CHECKED,
  },
  fhwaHec11: {
    id: "fhwaHec11",
    title: "HEC-11, Design of Riprap Revetment — gradation and blanket thickness",
    publisher: "US Federal Highway Administration",
    url: "https://www.fhwa.dot.gov/engineering/hydraulics/pubs/hec/hec11si.pdf",
    checked: CHECKED,
  },
  nchrp568: {
    id: "nchrp568",
    title: "NCHRP Report 568 — Riprap Design Criteria, Specifications and Quality Control",
    publisher: "Transportation Research Board",
    url: "https://onlinepubs.trb.org/onlinepubs/nchrp/nchrp_rpt_568.pdf",
    checked: CHECKED,
  },
  inchGravel: {
    id: "inchGravel",
    title: "Gravel Calculator — weight per cubic yard (gravel ≈ 1.4 t/yd³)",
    publisher: "Inch Calculator",
    url: "https://www.inchcalculator.com/gravel-calculator/",
    checked: CHECKED,
  },
  inchSand: {
    id: "inchSand",
    title: "Sand Calculator — weight per cubic yard (dry sand ≈ 1.35 t/yd³)",
    publisher: "Inch Calculator",
    url: "https://www.inchcalculator.com/sand-calculator/",
    checked: CHECKED,
  },
  cuydWeightChart: {
    id: "cuydWeightChart",
    title: "Cubic Yard Weight Chart — topsoil, mulch, stone densities",
    publisher: "Cubic Yard Estimator",
    url: "https://cubicyardestimator.com/guides/cubic-yard-weight-chart/",
    checked: CHECKED,
  },
  pnnlGutters: {
    id: "pnnlGutters",
    title: "Gutters and Downspouts — slope and downspout spacing guidance",
    publisher: "PNNL Building America Solution Center",
    url: "https://basc.pnnl.gov/resource-guides/gutters-and-downspouts",
    checked: CHECKED,
  },
  englertGutters: {
    id: "englertGutters",
    title: "Gutter installation — pitch and sizing guidance",
    publisher: "Englert",
    url: "https://www.englertinc.com/articles/avoid-these-mistakes-when-installing-gutters-size-seams-more",
    checked: CHECKED,
  },
  slabCost2026: {
    id: "slabCost2026",
    title: "Concrete Cost Per Yard — 2026 ready-mix prices ($145–195/yd³)",
    publisher: "SlabCalc (2026 cost guide)",
    url: "https://www.slabcalc.co/guides/concrete-cost-per-yard",
    checked: CHECKED,
  },
  lawnCost2026: {
    id: "lawnCost2026",
    title: "How Much Does Lawn Mowing Cost in 2026? — price by lawn size",
    publisher: "LawnStarter (2026 cost guide)",
    url: "https://www.lawnstarter.com/blog/cost/lawn-mowing-price/",
    checked: CHECKED,
  },
  inchSquare: {
    id: "inchSquare",
    title: "Square Footage Calculator — area and square-yard conversions",
    publisher: "Inch Calculator",
    url: "https://www.inchcalculator.com/square-footage-calculator/",
    checked: CHECKED,
  },
  inchCarpet: {
    id: "inchCarpet",
    title: "Carpet Calculator — measuring carpet in square yards (1 sq yd = 9 sq ft)",
    publisher: "Inch Calculator",
    url: "https://www.inchcalculator.com/carpet-calculator/",
    checked: CHECKED,
  },
} as const;

export type SourceKey = keyof typeof SOURCES;

/** Sources shown in the per-tool "Sources" block (audit P1 #1). */
export const CALCULATOR_SOURCES: Record<string, SourceKey[]> = {
  "cubic-yard-calculator": ["inchGravel", "cuydWeightChart"],
  "concrete-block-calculator": ["ncmaTek", "quikreteMortar", "quikreteMortarCalc"],
  "concrete-slab-cost-calculator": ["quikreteConcrete", "slabCost2026"],
  "yards-of-concrete-calculator": ["quikreteConcrete", "slabCost2026"],
  "topsoil-calculator": ["cuydWeightChart", "inchSand"],
  "pea-gravel-calculator": ["inchGravel", "cuydWeightChart"],
  "square-yard-calculator": ["inchSquare", "inchCarpet"],
  "landscape-materials-calculator": ["inchGravel", "cuydWeightChart"],
  "lawn-mowing-cost-calculator": ["lawnCost2026", "asabeD497"],
  "block-wall-calculator": ["ncmaTek", "quikreteMortar", "quikreteMortarCalc"],
  "acres-per-hour-calculator": ["asabeD497", "isuFieldCapacity"],
  "gutter-slope-calculator": ["pnnlGutters", "englertGutters"],
  "rip-rap-calculator": ["fhwaHec11", "nchrp568"],
};

export function sourcesForTool(slug: string): Source[] {
  return (CALCULATOR_SOURCES[slug] ?? []).map((k) => SOURCES[k]);
}
