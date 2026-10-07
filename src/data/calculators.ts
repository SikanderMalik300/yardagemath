/**
 * Calculator registry — the single source of truth (build-spec A2).
 * The homepage, hubs, sitemap, related-tool blocks, breadcrumbs and JSON-LD
 * are all generated from this file. Adding a tool = one entry + one component.
 */

export type CategorySlug = "concrete" | "landscaping" | "lawn";

export interface Faq {
  q: string;
  a: string;
}

export interface RefTable {
  title: string;
  columns: { label: string; num?: boolean }[];
  rows: (string | number)[][];
  footnote?: string;
}

export interface FormulaSpec {
  /** Plain-text formula lines. */
  plain: string[];
  /** A worked example with real numbers. */
  example: string[];
}

export interface Calculator {
  slug: string;
  category: CategorySlug;
  title: string; // <title> before the template
  metaDescription: string;
  h1: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  /** One-line description for cards / hubs / llms.txt. */
  cardDescription: string;
  /** 40–60 word quick-answer (GEO block). */
  shortAnswer: string;
  howTo: string[];
  formula: FormulaSpec;
  tables: RefTable[];
  tips: string[];
  faqs: Faq[];
  /** Short source labels for the author box. */
  sources: string[];
  /** Optional extra warning note shown above the disclaimer. */
  warning?: string;
  related: string[]; // slugs
  lastUpdated: string; // ISO date
  /** Alt text for the page's diagram / image (primary keyword goes here). */
  imageAlt: string;
}

export interface Category {
  slug: CategorySlug;
  title: string;
  h1: string;
  metaDescription: string;
  intro: string;
  whichOne: { q: string; a: string }[];
}

const UPDATED = "2026-10-07";

export const categories: Record<CategorySlug, Category> = {
  concrete: {
    slug: "concrete",
    title: "Concrete & Block Calculators",
    h1: "Concrete & Block Calculators",
    metaDescription:
      "Free concrete and block calculators: estimate concrete blocks, slab cost, and full block-wall materials with the math shown. US units, 2026 prices.",
    intro:
      "Planning a slab, footing or block wall? These calculators turn your dimensions into the quantities suppliers actually sell: cubic yards of concrete, numbers of blocks, bags of mortar and total material cost. Every tool shows the formula with your numbers plugged in, so you can check the estimate before you order.",
    whichOne: [
      {
        q: "I just need a block count",
        a: "Use the Concrete Block Calculator — enter wall length and height, subtract openings, and get the number of blocks and mortar bags.",
      },
      {
        q: "I'm pouring a slab or pad",
        a: "Use the Concrete Slab Cost Calculator for cubic yards, bags vs ready-mix, and a price per square foot.",
      },
      {
        q: "I'm building a full wall",
        a: "Use the Block Wall Calculator for courses, blocks, cap blocks, mortar, core-fill grout, rebar and total cost.",
      },
    ],
  },
  landscaping: {
    slug: "landscaping",
    title: "Landscaping Material Calculators",
    h1: "Landscaping & Yardage Calculators",
    metaDescription:
      "Free landscaping calculators for cubic yards, topsoil, pea gravel, mulch, rock, square yards and riprap. Get yards, tons and bags from your area and depth.",
    intro:
      "Buying soil, gravel, mulch or stone by the yard or ton is hard to picture. These calculators convert the area and depth of your project into cubic yards, tons and the number of bags, so you order the right amount with a small buffer for waste — not a driveway full of extra material.",
    whichOne: [
      {
        q: "I know the area and depth",
        a: "Start with the Cubic Yard Calculator — it covers any loose material and shows coverage by depth.",
      },
      {
        q: "I'm filling beds or a lawn",
        a: "Use the Topsoil Calculator or the Landscape Material Calculator, which set sensible default depths per material.",
      },
      {
        q: "I'm measuring for carpet, turf or sod",
        a: "Use the Square Yard Calculator to convert room sizes to square yards with a waste allowance.",
      },
    ],
  },
  lawn: {
    slug: "lawn",
    title: "Lawn Care Calculators",
    h1: "Lawn Care Calculators",
    metaDescription:
      "Free lawn care calculators: estimate lawn mowing cost per cut and per season, and work out acres per hour for any mower from width, speed and efficiency.",
    intro:
      "Whether you are a homeowner checking a quote or a lawn-care pro pricing a route, these tools put real numbers behind mowing. Estimate what a cut should cost by lawn size, or price a job from your mower width, speed and hourly rate.",
    whichOne: [
      {
        q: "I want to know what mowing should cost",
        a: "Use the homeowner tab of the Lawn Mowing Cost Calculator, based on lawn size and 2026 average rates.",
      },
      {
        q: "I need to price jobs as a pro",
        a: "Use the pro tab of the Lawn Mowing Cost Calculator, or the Acres per Hour Calculator to estimate mowing time.",
      },
    ],
  },
};

export const calculators: Calculator[] = [
  /* ---------------------------------------------------------------- 1 */
  {
    slug: "cubic-yard-calculator",
    category: "landscaping",
    title: "Cubic Yard Calculator – Gravel, Soil, Mulch & Concrete",
    metaDescription:
      "Free cubic yard calculator. Enter length, width and depth in feet or inches to get cubic yards, cubic feet, tons and bags for gravel, soil, mulch or concrete.",
    h1: "Cubic Yard Calculator",
    primaryKeyword: "cubic yard calculator",
    secondaryKeywords: [
      "cy calculator",
      "cu yd calculator",
      "how to figure a cubic yard",
      "how to compute cubic yards",
      "formula for cubic yards",
      "cubic yard measurement",
    ],
    cardDescription:
      "Area and depth to cubic yards, tons and bags for any loose material.",
    shortAnswer:
      "1 cubic yard = 27 cubic feet. It covers 324 sq ft at 1 inch deep, 108 sq ft at 3 inches, or 81 sq ft at 4 inches. Enter your area and depth below to get cubic yards, tons and bags for gravel, soil, mulch or concrete.",
    howTo: [
      "Pick the shape of your area: rectangle, circle or triangle.",
      "Enter the dimensions in feet and inches.",
      "Enter the depth of material in inches.",
      "Choose a material to also get an estimated weight in tons.",
      "Add a waste allowance (5% is a sensible default) and read your cubic yards.",
    ],
    formula: {
      plain: [
        "volume (cu ft) = area (sq ft) × depth (ft)",
        "cubic yards = volume (cu ft) ÷ 27",
        "tons = cubic yards × material density (tons per cu yd)",
      ],
      example: [
        "A 10 ft × 10 ft area, 3 inches deep:",
        "area = 10 × 10 = 100 sq ft",
        "depth = 3 ÷ 12 = 0.25 ft",
        "volume = 100 × 0.25 = 25 cu ft",
        "cubic yards = 25 ÷ 27 = 0.93 cu yd",
      ],
    },
    tables: [
      {
        title: "Coverage of 1 cubic yard by depth",
        columns: [
          { label: "Depth" },
          { label: "Area covered", num: true },
        ],
        rows: [
          ['1"', "324 sq ft"],
          ['2"', "162 sq ft"],
          ['3"', "108 sq ft"],
          ['4"', "81 sq ft"],
          ['6"', "54 sq ft"],
          ['12"', "27 sq ft"],
        ],
        footnote: "1 cubic yard = 27 cubic feet, so coverage = 324 ÷ depth in inches.",
      },
    ],
    tips: [
      "Order about 5–10% extra for settling, uneven ground and spillage.",
      "Bulk material is sold by the cubic yard; bagged material is sold by the cubic foot (commonly 2 cu ft for mulch, 0.75 cu ft for soil, 0.5 cu ft for gravel).",
      "Many yards have a delivery minimum — buying in bulk usually beats bags above roughly 1 cubic yard.",
      "A standard pickup bed holds roughly 2–3 cubic yards of mulch but only about 1 cubic yard of gravel or soil by weight.",
    ],
    faqs: [
      {
        q: "Is a cubic yard 3×3×3?",
        a: "Yes. A cubic yard is a cube 3 feet on each side: 3 ft × 3 ft × 3 ft = 27 cubic feet. That is why you divide cubic feet by 27 to get cubic yards.",
      },
      {
        q: "How many square feet does a cubic yard cover?",
        a: "It depends on depth. One cubic yard covers 324 sq ft at 1 inch, 108 sq ft at 3 inches, and 81 sq ft at 4 inches. Divide 324 by the depth in inches to get the coverage.",
      },
      {
        q: "How many bags of mulch are in a yard?",
        a: "A cubic yard is 27 cubic feet, so it equals 13.5 bags of 2-cubic-foot mulch. Round up to 14 bags to fully replace one bulk yard.",
      },
      {
        q: "How do I convert cubic feet to cubic yards?",
        a: "Divide the number of cubic feet by 27. For example, 54 cubic feet ÷ 27 = 2 cubic yards. To go the other way, multiply cubic yards by 27.",
      },
      {
        q: "How much does a cubic yard weigh?",
        a: "Weight depends on the material. A cubic yard is roughly 1.4 tons of gravel, 1.1 tons of topsoil, 2 tons of wet concrete, or just 0.3 tons of bark mulch. Moisture changes these figures.",
      },
      {
        q: "Can a pickup truck carry a cubic yard?",
        a: "Most half-ton pickups can safely carry about one cubic yard of soil or gravel by weight, or two to three cubic yards of lighter mulch. Check your truck's payload rating before loading.",
      },
    ],
    sources: ["USDA bulk-density references", "landscape-supply yard figures"],
    related: [
      "topsoil-calculator",
      "pea-gravel-calculator",
      "landscape-materials-calculator",
      "concrete-slab-cost-calculator",
      "rip-rap-calculator",
    ],
    lastUpdated: UPDATED,
    imageAlt: "Cubic yard calculator diagram showing length, width and depth of an area",
  },

  /* ---------------------------------------------------------------- 2 */
  {
    slug: "concrete-block-calculator",
    category: "concrete",
    title: "Concrete Block Calculator – CMU & Cinder Blocks Needed",
    metaDescription:
      "Find how many concrete blocks (CMU or cinder blocks) you need for a wall. Enter length and height, subtract doors and windows, and get blocks, mortar bags and cost.",
    h1: "Concrete Block Calculator (CMU / Cinder Block)",
    primaryKeyword: "concrete block calculator",
    secondaryKeywords: [
      "cinder block calculator",
      "cmu block calculator",
      "block calculator",
      "cement block calculator",
      "how many concrete blocks do i need",
      "block estimator",
      "cmu calculator",
    ],
    cardDescription:
      "How many CMU or cinder blocks a wall needs, plus mortar and cost.",
    shortAnswer:
      "A standard 8×8×16 concrete block covers 8\" × 16\" of wall face, so you need 1.125 blocks per square foot — 112.5 blocks per 100 sq ft. Enter your wall length and height, subtract any openings, and get the block count, mortar bags and cost below.",
    howTo: [
      "Enter the wall length and height in feet and inches.",
      "Pick your block size (8×8×16 is the standard).",
      "Add any door or window openings to subtract their area.",
      "Add a waste allowance (5% is typical for cuts and breakage).",
      "Optionally enter a price per block to estimate material cost.",
    ],
    formula: {
      plain: [
        "net area = (length × height) − openings",
        "blocks per sq ft = 144 ÷ (8 × 16) = 1.125",
        "blocks = ceil(net area × 1.125 × (1 + waste%))",
        "mortar bags ≈ ceil(blocks ÷ 13)",
      ],
      example: [
        "A 20 ft × 6 ft wall, no openings, 5% waste:",
        "net area = 20 × 6 = 120 sq ft",
        "blocks = 120 × 1.125 = 135",
        "with 5% waste = 135 × 1.05 = 141.75 → 142 blocks",
      ],
    },
    tables: [
      {
        title: "Blocks by common wall size (8×8×16, before waste)",
        columns: [
          { label: "Wall (L × H)" },
          { label: "Area", num: true },
          { label: "Blocks", num: true },
        ],
        rows: [
          ["10 × 4 ft", "40 sq ft", 45],
          ["20 × 4 ft", "80 sq ft", 90],
          ["20 × 6 ft", "120 sq ft", 135],
          ["30 × 8 ft", "240 sq ft", 270],
          ["40 × 8 ft", "320 sq ft", 360],
        ],
        footnote: "112.5 blocks per 100 sq ft. Add about 5% for waste.",
      },
    ],
    tips: [
      "Order about 5% extra for breakage and cut blocks at corners and openings.",
      "A standard CMU weighs roughly 30–38 lb; a lightweight block is lighter. Plan for help lifting.",
      "One 80-lb bag of mortar mix lays about 13 standard blocks — buy a spare bag.",
      "Blocks are usually sold on pallets; ask your supplier how many per pallet to save on handling.",
    ],
    faqs: [
      {
        q: "How many blocks are in 100 square feet?",
        a: "You need 112.5 standard 8×8×16 blocks per 100 square feet of wall, because each block covers 8\" × 16\" of face (1.125 blocks per square foot). Round up and add about 5% for waste.",
      },
      {
        q: "What are the actual dimensions of an 8×8×16 block?",
        a: "The nominal size is 8×8×16 inches, but the actual block measures about 7⅝ × 7⅝ × 15⅝ inches. The missing ⅜ inch on each side leaves room for a standard mortar joint.",
      },
      {
        q: "What is the difference between a cinder block and a concrete block?",
        a: "Both are concrete masonry units (CMU). \"Cinder block\" is an older term for lighter blocks made with cinders or fly ash; modern blocks are usually heavier aggregate concrete. For estimating counts, treat them the same.",
      },
      {
        q: "How much mortar do I need per block?",
        a: "About one 80-lb bag of mortar mix per 13 standard blocks laid with a ⅜-inch joint. For 142 blocks you would plan on roughly 11 bags. Mix in small batches so it does not set before use.",
      },
      {
        q: "How much does a concrete block weigh?",
        a: "A standard 8×8×16 block weighs about 30–38 pounds depending on whether it is normal-weight or lightweight aggregate. Solid and larger 12-inch blocks weigh more.",
      },
      {
        q: "How many blocks are on a pallet?",
        a: "It varies by block size and supplier — typically 90 to 144 standard blocks per pallet. Confirm the exact count with your yard so your delivery and totals line up.",
      },
    ],
    sources: ["CMU nominal-face geometry (144 ÷ 128 = 1.125)", "Quikrete mortar coverage"],
    related: [
      "block-wall-calculator",
      "concrete-slab-cost-calculator",
      "cubic-yard-calculator",
      "rip-rap-calculator",
    ],
    lastUpdated: UPDATED,
    imageAlt: "Concrete block calculator diagram of a CMU wall with courses and openings",
  },

  /* ---------------------------------------------------------------- 3 */
  {
    slug: "concrete-slab-cost-calculator",
    category: "concrete",
    title: "Concrete Slab Cost Calculator – 2026 Price per Sq Ft",
    metaDescription:
      "Estimate concrete slab cost by size and thickness. Get cubic yards, bags or ready-mix, and total price with optional labor, rebar and base gravel. Updated for 2026.",
    h1: "Concrete Slab Cost Calculator",
    primaryKeyword: "concrete slab cost calculator",
    secondaryKeywords: [
      "concrete pad cost calculator",
      "cement slab price",
      "calculating concrete slab cost",
      "concrete slab price calculator",
    ],
    cardDescription:
      "Slab cubic yards, bags vs ready-mix, and total cost per square foot.",
    shortAnswer:
      "A 10 × 10 ft slab at 4 inches thick needs about 1.23 cubic yards of concrete (1.36 with 10% waste). At a 2026 average of roughly $160 per cubic yard delivered, that is about $220 in concrete before labor. Enter your size below for a full cost breakdown.",
    howTo: [
      "Enter the slab length and width in feet and inches.",
      "Set the thickness (4 inches is standard for patios and walkways).",
      "Choose ready-mix delivery or bags (40, 60 or 80 lb).",
      "Adjust the price per cubic yard or per bag to your local quote.",
      "Optionally add labor, rebar/mesh and a gravel base to see the full cost.",
    ],
    formula: {
      plain: [
        "cubic yards = length × width × (thickness ÷ 12) ÷ 27 × (1 + waste%)",
        "bags = ceil(cubic feet ÷ bag yield)   (80 lb ≈ 0.60 cu ft)",
        "total = material + labor × area + rebar × area",
        "cost per sq ft = total ÷ area",
      ],
      example: [
        "A 10 × 10 ft slab, 4 inches thick, 10% waste:",
        "cubic yards = 100 × (4 ÷ 12) ÷ 27 = 1.23",
        "with 10% waste = 1.36 cu yd (36.7 cu ft)",
        "bags of 80 lb = 36.7 ÷ 0.60 = 62 bags",
      ],
    },
    tables: [
      {
        title: "Concrete needed for common slabs",
        columns: [
          { label: "Slab size" },
          { label: 'Cu yd @ 4"', num: true },
          { label: 'Cu yd @ 6"', num: true },
        ],
        rows: [
          ["10 × 10 ft", "1.23", "1.85"],
          ["12 × 12 ft", "1.78", "2.67"],
          ["20 × 20 ft", "4.94", "7.41"],
          ["24 × 24 ft", "7.11", "10.67"],
          ["30 × 30 ft", "11.11", "16.67"],
        ],
        footnote:
          "Volumes exclude waste. A 30×30 slab at 4 inches is about 11.1 cubic yards; add 10% and order 12.2.",
      },
    ],
    tips: [
      "Add about 10% waste for spillage, uneven subgrade and over-excavation.",
      "Bags make sense under roughly 1 cubic yard; above that, ready-mix delivery is usually cheaper and far less work.",
      "Ask about the ready-mix short-load fee — small orders under about 3–4 cubic yards often carry a surcharge.",
      "A 4-inch slab suits patios and walkways; driveways and garage floors are usually 5–6 inches. Confirm with local code.",
    ],
    faqs: [
      {
        q: "How much does a 20×20 concrete slab cost?",
        a: "A 20×20 ft slab at 4 inches needs about 5 cubic yards of concrete. Material runs roughly $800–$1,000, and with finishing labor, rebar and base the installed cost is often $2,400–$4,000 depending on your area.",
      },
      {
        q: "Is it cheaper to mix bags or order ready-mix?",
        a: "Bags win only for small pours under about 1 cubic yard. A 10×10 slab takes around 60 bags of 80-lb mix — heavy, slow work. Above a yard, ready-mix delivery is cheaper per yard and much faster.",
      },
      {
        q: "How thick should a concrete slab be?",
        a: "Four inches is standard for patios, sheds and walkways. Driveways and garage floors are usually 5–6 inches, and heavy vehicle areas thicker. Always confirm against your local building code.",
      },
      {
        q: "How many 80-lb bags of concrete are in a yard?",
        a: "About 45 bags of 80-lb concrete mix make one cubic yard, since each bag yields roughly 0.60 cubic feet and a yard is 27 cubic feet. Sixty-pound bags take about 60 per yard.",
      },
      {
        q: "Do I need rebar or wire mesh in a slab?",
        a: "Most slabs benefit from #4 rebar on a grid or welded wire mesh to control cracking, especially driveways and anything bearing loads. Thin, lightly loaded pads can sometimes use fiber-reinforced mix instead.",
      },
      {
        q: "What is the minimum ready-mix order?",
        a: "Many suppliers deliver a minimum of about 1 cubic yard and add a short-load fee below roughly 3–4 yards. Ask when you order so a small slab does not cost more than you expect.",
      },
    ],
    sources: ["2026 ready-mix price guides", "Quikrete/Sakrete bag yields"],
    related: [
      "cubic-yard-calculator",
      "concrete-block-calculator",
      "block-wall-calculator",
      "square-yard-calculator",
    ],
    lastUpdated: UPDATED,
    imageAlt: "Concrete slab cost calculator diagram with length, width and thickness labelled",
  },

  /* ---------------------------------------------------------------- 4 */
  {
    slug: "topsoil-calculator",
    category: "landscaping",
    title: "Topsoil Calculator – Cubic Yards, Tons & Bags Needed",
    metaDescription:
      "Calculate how much topsoil you need for a lawn, garden bed or raised bed. Get cubic yards, tons and bags from your area and depth, with recommended depths.",
    h1: "Topsoil Calculator",
    primaryKeyword: "topsoil calculator",
    secondaryKeywords: ["loam calculator", "how much topsoil do i need"],
    cardDescription: "Topsoil cubic yards, tons and bags for lawns and beds.",
    shortAnswer:
      "A 20 × 10 ft bed at 4 inches deep needs about 2.47 cubic yards of topsoil (roughly 2.7 tons). For a new lawn, spread 4–6 inches; for top-dressing, ¼–½ inch. Enter your area and depth below for cubic yards, tons and bags.",
    howTo: [
      "Choose your shape and enter the area dimensions, or use raised-bed mode (length × width × height).",
      "Set the depth — 4 inches is a common default for beds.",
      "Add a small waste allowance for settling.",
      "Pick a bag size (0.75 or 1 cubic foot) to see bag counts.",
      "Read your cubic yards, tons and bags.",
    ],
    formula: {
      plain: [
        "volume (cu ft) = area (sq ft) × depth (ft)",
        "cubic yards = cu ft ÷ 27",
        "tons = cubic yards × 1.1   (screened topsoil)",
      ],
      example: [
        "A 20 × 10 ft bed, 4 inches deep:",
        "area = 200 sq ft, depth = 0.333 ft",
        "volume = 200 × 0.333 = 66.7 cu ft",
        "cubic yards = 66.7 ÷ 27 = 2.47 cu yd",
      ],
    },
    tables: [
      {
        title: "Recommended topsoil depth by use",
        columns: [{ label: "Use" }, { label: "Depth" }],
        rows: [
          ["New lawn (seed or sod)", '4–6"'],
          ["Top-dressing / overseeding", '¼–½"'],
          ["Vegetable or flower bed", '8–12"'],
          ["Raised bed", "Full bed height"],
        ],
        footnote: "One cubic yard covers about 81 sq ft at 4 inches deep.",
      },
    ],
    tips: [
      "Buy screened topsoil for lawns and beds; unscreened fill dirt is for grading, not planting.",
      "Topsoil settles — order about 5% extra and rake it slightly high.",
      "Bulk delivery beats bags above roughly 1 cubic yard (a yard is about 36 bags of 0.75 cu ft).",
      "For raised beds, mix topsoil with compost rather than using pure topsoil.",
    ],
    faqs: [
      {
        q: "How much area does a yard of topsoil cover?",
        a: "One cubic yard of topsoil covers about 324 sq ft at 1 inch, 108 sq ft at 3 inches, or 81 sq ft at 4 inches deep. Divide 324 by your depth in inches to get the coverage.",
      },
      {
        q: "How much does a yard of topsoil weigh?",
        a: "Screened topsoil weighs roughly 1.1 tons (about 2,200 lb) per cubic yard when moderately dry. Wet or heavy clay soil can weigh noticeably more, so treat tonnage as an estimate.",
      },
      {
        q: "What is the difference between topsoil, garden soil and fill dirt?",
        a: "Topsoil is screened surface soil for general use; garden soil is topsoil amended with compost for planting; fill dirt is subsoil with little organic matter, used to raise or level ground, not to grow in.",
      },
      {
        q: "How many bags of topsoil make a yard?",
        a: "At 0.75 cubic feet per bag, one cubic yard equals 36 bags (27 ÷ 0.75). At 1 cubic foot per bag it is 27 bags. Above a yard, bulk delivery is usually cheaper.",
      },
      {
        q: "How deep should topsoil be for grass?",
        a: "Aim for 4–6 inches of quality topsoil for a new lawn so roots can establish. For over-seeding an existing lawn, a ¼–½ inch top-dressing worked into the surface is enough.",
      },
    ],
    sources: ["USDA topsoil bulk-density references"],
    related: [
      "cubic-yard-calculator",
      "landscape-materials-calculator",
      "pea-gravel-calculator",
      "lawn-mowing-cost-calculator",
    ],
    lastUpdated: UPDATED,
    imageAlt: "Topsoil calculator diagram showing a garden bed with depth labelled",
  },

  /* ---------------------------------------------------------------- 5 */
  {
    slug: "pea-gravel-calculator",
    category: "landscaping",
    title: "Pea Gravel Calculator – Yards, Tons & Bags Needed",
    metaDescription:
      "Work out how much pea gravel you need for a patio, path, playground or driveway. Enter size and depth to get cubic yards, tons and 0.5 cu ft bags.",
    h1: "Pea Gravel Calculator",
    primaryKeyword: "pea gravel calculator",
    secondaryKeywords: ["calculating pea gravel", "pea gravel estimator"],
    cardDescription: "Pea gravel cubic yards, tons and bags by area and depth.",
    shortAnswer:
      "A 12 × 12 ft area at 3 inches deep needs about 1.33 cubic yards of pea gravel, roughly 1.87 tons or 72 bags of 0.5 cu ft. Use 2–3 inches for paths, 3–4 inches for patios. Enter your dimensions below for an exact amount.",
    howTo: [
      "Choose the shape and enter your area dimensions.",
      "Set the depth — use a preset for a path, patio or playground.",
      "Add 5–10% waste for raking and settling.",
      "Optionally enter a price per ton or per yard.",
      "Read cubic yards, tons and the number of bags.",
    ],
    formula: {
      plain: [
        "volume (cu ft) = area (sq ft) × depth (ft)",
        "cubic yards = cu ft ÷ 27",
        "tons = cubic yards × 1.4",
      ],
      example: [
        "A 12 × 12 ft patio, 3 inches deep:",
        "area = 144 sq ft, depth = 0.25 ft",
        "volume = 144 × 0.25 = 36 cu ft",
        "cubic yards = 36 ÷ 27 = 1.33 cu yd ≈ 1.87 tons",
      ],
    },
    tables: [
      {
        title: "Pea gravel coverage by depth (1 cubic yard)",
        columns: [{ label: "Depth" }, { label: "Area covered", num: true }],
        rows: [
          ['2"', "162 sq ft"],
          ['3"', "108 sq ft"],
          ['4"', "81 sq ft"],
        ],
        footnote: "One cubic yard ≈ 54 bags of 0.5 cu ft (about 50 lb each).",
      },
    ],
    tips: [
      "Lay landscape fabric underneath to stop gravel sinking into the soil and to limit weeds.",
      "Use 2–3 inches for walkways, 3–4 inches for patios, and a deeper border edge to keep gravel contained.",
      "Pea gravel shifts underfoot; for driveways a crushed, angular stone compacts better.",
      "Order about 10% extra — pea gravel spreads and settles more than angular stone.",
    ],
    faqs: [
      {
        q: "How much area does a ton of pea gravel cover?",
        a: "About 100 sq ft at 2 inches deep, or roughly 65–70 sq ft at 3 inches, since a ton is about 0.7 cubic yards. Coverage drops as depth increases.",
      },
      {
        q: "How deep should pea gravel be for a patio?",
        a: "Three to four inches over a compacted base and landscape fabric gives a stable patio surface. Shallower layers shift and show the ground underneath; deeper layers feel loose to walk on.",
      },
      {
        q: "Is pea gravel or crushed stone better for a driveway?",
        a: "Crushed, angular stone is better for driveways because its edges lock together and resist rutting. Smooth, round pea gravel migrates under tires and is better suited to patios and paths.",
      },
      {
        q: "How many bags of pea gravel are in a yard?",
        a: "About 54 bags of 0.5 cubic feet make one cubic yard (27 ÷ 0.5). At roughly 50 lb per bag that is over 2,600 lb, so bulk delivery is usually cheaper above a yard.",
      },
      {
        q: "Do I need landscape fabric under pea gravel?",
        a: "It is strongly recommended. Fabric separates the gravel from the soil so stones do not sink, keeps the layer cleaner, and reduces weeds. Overlap seams and pin the edges.",
      },
    ],
    sources: ["landscape-supply gravel density", "CPSC playground surfacing guidance"],
    related: [
      "cubic-yard-calculator",
      "landscape-materials-calculator",
      "rip-rap-calculator",
      "topsoil-calculator",
    ],
    lastUpdated: UPDATED,
    imageAlt: "Pea gravel calculator diagram of a patio area with gravel depth labelled",
  },

  /* ---------------------------------------------------------------- 6 */
  {
    slug: "square-yard-calculator",
    category: "landscaping",
    title: "Square Yard Calculator – Feet & Inches to Square Yards",
    metaDescription:
      "Convert room or area dimensions to square yards for carpet, turf, sod or concrete. Add multiple rooms, include waste, and estimate total cost per square yard.",
    h1: "Square Yard Calculator",
    primaryKeyword: "square yard calculator",
    secondaryKeywords: ["yard measurement", "square feet to square yards"],
    cardDescription: "Convert feet and rooms to square yards, with waste and cost.",
    shortAnswer:
      "1 square yard = 9 square feet = 0.836 square meters. A 12 × 12 ft room is 144 sq ft, which is 16 square yards. Add each room below, include a waste allowance for carpet, and get the total square yards and cost.",
    howTo: [
      "Enter each room or area as length × width in feet, or type a square-foot value directly.",
      'Use "Add another area" for multiple rooms.',
      "Add a waste allowance — 10% is typical for carpet.",
      "Optionally enter a price per square yard.",
      "Read the total in square yards.",
    ],
    formula: {
      plain: ["square yards = square feet ÷ 9", "square feet = length (ft) × width (ft)"],
      example: [
        "A 12 × 12 ft room:",
        "area = 12 × 12 = 144 sq ft",
        "square yards = 144 ÷ 9 = 16 sq yd",
      ],
    },
    tables: [
      {
        title: "Common room sizes in square yards",
        columns: [
          { label: "Room (ft)" },
          { label: "Square feet", num: true },
          { label: "Square yards", num: true },
        ],
        rows: [
          ["10 × 10", 100, "11.1"],
          ["12 × 12", 144, "16.0"],
          ["12 × 15", 180, "20.0"],
          ["15 × 20", 300, "33.3"],
          ["20 × 20", 400, "44.4"],
        ],
        footnote: "1 sq yd = 9 sq ft = 0.836 m².",
      },
    ],
    tips: [
      "Carpet is usually sold by the square yard; tile and laminate by the square foot — convert before you compare prices.",
      "Add about 10% for carpet waste, more for diagonal or patterned layouts.",
      "Measure each room separately and add them, rather than averaging, to avoid under-ordering.",
      "Round up to the nearest half or full square yard when ordering rolls.",
    ],
    faqs: [
      {
        q: "How many square feet are in a square yard?",
        a: "There are 9 square feet in a square yard, because a yard is 3 feet and 3 × 3 = 9. To convert square feet to square yards, divide by 9.",
      },
      {
        q: "How do I calculate square yards for carpet?",
        a: "Measure each room's length and width in feet, multiply to get square feet, add the rooms together, then divide by 9. Add about 10% for waste and seams before ordering.",
      },
      {
        q: "What is the difference between square yards and cubic yards?",
        a: "Square yards measure area (a flat surface, like carpet). Cubic yards measure volume (a quantity of material with depth, like concrete or soil). They are not interchangeable.",
      },
      {
        q: "How many square yards is a 12×15 room?",
        a: "A 12 × 15 ft room is 180 square feet, which is 20 square yards (180 ÷ 9). Add a waste allowance when ordering carpet or turf.",
      },
    ],
    sources: ["standard unit conversions (1 sq yd = 9 sq ft)"],
    related: [
      "cubic-yard-calculator",
      "concrete-slab-cost-calculator",
      "landscape-materials-calculator",
    ],
    lastUpdated: UPDATED,
    imageAlt: "Square yard calculator diagram converting a room in feet to square yards",
  },

  /* ---------------------------------------------------------------- 7 */
  {
    slug: "landscape-materials-calculator",
    category: "landscaping",
    title: "Landscape Material Calculator – Mulch, Rock, Soil & Sand",
    metaDescription:
      "One calculator for all landscaping materials: mulch, river rock, topsoil, sand, decomposed granite, compost and gravel. Get yards, tons and bags for your project.",
    h1: "Landscape Material Calculator",
    primaryKeyword: "landscape material calculator",
    secondaryKeywords: [
      "material calculator",
      "landscape calculator",
      "yard of mulch",
      "cubic yard of mulch",
    ],
    cardDescription: "Yards, tons and bags for mulch, rock, soil, sand and more.",
    shortAnswer:
      "One yard of mulch covers about 108 sq ft at 3 inches deep; one yard of rock or soil covers about 81 sq ft at 4 inches. Pick your material below — mulch, rock, decomposed granite, compost, topsoil, sand or gravel — and get cubic yards, tons and bags.",
    howTo: [
      "Choose your material; the depth default updates to a sensible value.",
      "Select the shape and enter the area dimensions.",
      "Adjust the depth if needed.",
      "Add a waste allowance.",
      'Read cubic yards, tons, bags and the "how it\'s sold" note.',
    ],
    formula: {
      plain: [
        "volume (cu ft) = area (sq ft) × depth (ft)",
        "cubic yards = cu ft ÷ 27",
        "tons = cubic yards × material density",
      ],
      example: [
        "Mulch over 108 sq ft, 3 inches deep:",
        "volume = 108 × 0.25 = 27 cu ft",
        "cubic yards = 27 ÷ 27 = 1 cu yd (≈ 0.3 tons)",
      ],
    },
    tables: [
      {
        title: "Recommended depth and density by material",
        columns: [
          { label: "Material" },
          { label: "Typical depth" },
          { label: "Tons / cu yd", num: true },
        ],
        rows: [
          ["Mulch (bark)", '3"', "0.3"],
          ["River rock", '2–3"', "1.35"],
          ["Decomposed granite", '3"', "1.3"],
          ["Compost", '2"', "0.6"],
          ["Topsoil", '4"', "1.1"],
          ["Sand", '2"', "1.35"],
          ["Gravel", '3"', "1.4"],
          ["Crushed stone", '3"', "1.4"],
        ],
        footnote: "Densities are nominal and vary with moisture; confirm tonnage with your supplier.",
      },
    ],
    tips: [
      "Mulch 2–3 inches deep suppresses weeds and holds moisture; deeper can suffocate roots.",
      "Buying in bulk by the yard is usually far cheaper than bags above about 1 cubic yard.",
      "Refresh bark mulch yearly; it breaks down. Rock and decomposed granite last for years.",
      "River rock and gravel are heavy — confirm tonnage and delivery access for large orders.",
    ],
    faqs: [
      {
        q: "How much does a yard of mulch cover?",
        a: "One cubic yard of mulch covers about 108 sq ft at 3 inches deep, or 162 sq ft at 2 inches. Spread it 2–3 inches thick for effective weed control and moisture retention.",
      },
      {
        q: "How deep should mulch be?",
        a: "Two to three inches is ideal. That is enough to block light to weeds and slow evaporation without smothering plant roots. Keep mulch a couple of inches away from trunks and stems.",
      },
      {
        q: "How many bags of mulch are in a yard?",
        a: "A cubic yard equals 13.5 bags of 2-cubic-foot mulch (27 ÷ 2). Round up to 14 bags to match one bulk yard. Above a yard or two, bulk delivery is usually cheaper.",
      },
      {
        q: "Is it cheaper to buy mulch in bulk?",
        a: "Yes, almost always above about one cubic yard. Bulk mulch by the yard typically costs a fraction of the equivalent bagged price, though bags are convenient for small beds and easier to transport.",
      },
      {
        q: "How much does river rock weigh per yard?",
        a: "River rock weighs roughly 1.35 tons (about 2,700 lb) per cubic yard. Confirm the exact figure with your supplier, as stone size and moisture change the weight.",
      },
    ],
    sources: ["landscape-supply density tables", "USDA references"],
    related: [
      "cubic-yard-calculator",
      "topsoil-calculator",
      "pea-gravel-calculator",
      "rip-rap-calculator",
    ],
    lastUpdated: UPDATED,
    imageAlt: "Landscape material calculator diagram with material depth over an area",
  },

  /* ---------------------------------------------------------------- 8 */
  {
    slug: "lawn-mowing-cost-calculator",
    category: "lawn",
    title: "Lawn Mowing Cost Calculator – Price per Cut & per Acre",
    metaDescription:
      "Estimate lawn mowing prices by lawn size, or price your mowing jobs as a pro using hourly rate, mower width and travel time. Includes 2026 average rates.",
    h1: "Lawn Mowing Cost Calculator",
    primaryKeyword: "lawn mowing cost calculator",
    secondaryKeywords: [
      "lawn mowing calculator",
      "lawn care estimate",
      "lawn cutting calculator",
      "lawn care cost calculator",
      "lawn mowing pricing formula",
      "lawn mowing price calculator",
    ],
    cardDescription: "What a cut should cost, or what to charge as a pro.",
    shortAnswer:
      "A typical US lawn mowing visit runs about $40–$55 for a quarter-acre lot and $90 or more for a full acre in 2026. Homeowners can estimate a fair price by lawn size; pros can price a job from mower width, speed and hourly rate. Both tabs are below.",
    howTo: [
      'Homeowners: pick the "What should I pay?" tab and enter your lawn size and mowing frequency.',
      "Add extras like edging, trimming or bagging.",
      'Pros: switch to the "What should I charge?" tab.',
      "Enter mower deck width, speed, efficiency, trim and travel time, and your hourly rate.",
      "Read the price per cut, per month and per season.",
    ],
    formula: {
      plain: [
        "acres per hour = (deck width in × mph × efficiency) ÷ 99",
        "mow hours = acres ÷ acres per hour",
        "total hours = mow hours + (trim + travel) ÷ 60",
        "price = total hours × hourly rate × (1 + overhead%)",
      ],
      example: [
        "Pro job: 0.25 acre, 21-inch deck, 3 mph, 80% efficiency:",
        "acres per hour = (21 × 3 × 0.8) ÷ 99 = 0.51",
        "mow hours = 0.25 ÷ 0.51 = 0.49 h",
        "+ 15 min trim/travel ≈ 0.74 h × $60 ≈ $45",
      ],
    },
    tables: [
      {
        title: "Typical 2026 mowing price by lawn size",
        columns: [{ label: "Lawn size" }, { label: "Per cut", num: true }],
        rows: [
          ["¼ acre or less", "$40"],
          ["½ acre", "$55"],
          ["¾ acre", "$70"],
          ["1 acre", "$90"],
          ["2 acres", "$150"],
        ],
        footnote: "Planning estimates; local rates vary with region, terrain and service level.",
      },
    ],
    tips: [
      "Weekly mowing usually costs less per visit than one-off cuts because the grass is easier to manage.",
      "Pros: factor in drive time and fuel — a cheap small lawn far away can lose money.",
      "Price overgrown or first-of-season cuts higher; they take far longer.",
      "A clear estimate lists mowing, edging, trimming and cleanup separately so customers know what they are paying for.",
    ],
    faqs: [
      {
        q: "How much should I charge to mow an acre?",
        a: "Most pros charge about $50–$90 to mow an acre of open, level lawn, more for obstacles or slopes. Base it on your time: an acre takes roughly 0.5–1 hour depending on mower width and speed, times your hourly rate plus overhead.",
      },
      {
        q: "How do I calculate lawn mowing prices?",
        a: "Estimate the mowing time from your acres per hour, add trimming and travel time, multiply by your hourly rate, then add overhead for fuel and wear. The pro tab above does this automatically.",
      },
      {
        q: "How long does it take to mow an acre?",
        a: "With a 21-inch push mower, about 1.5–2 hours. With a 42–60 inch riding or zero-turn mower, roughly 30–60 minutes. Speed and obstacles make a big difference.",
      },
      {
        q: "How much does weekly lawn mowing cost?",
        a: "Weekly service for an average suburban lot commonly runs $40–$60 per visit in 2026. Larger lots cost more. Many companies offer a small discount versus bi-weekly because regular cuts are quicker.",
      },
      {
        q: "What should a lawn care estimate include?",
        a: "A good estimate lists the services (mowing, edging, string trimming, blowing off hard surfaces), the price per visit, the frequency, and any extras like bagging or seasonal cleanups. Get it in writing.",
      },
    ],
    sources: ["2026 US lawn-care cost guides", "ASABE field-efficiency ranges"],
    related: ["acres-per-hour-calculator", "topsoil-calculator", "landscape-materials-calculator"],
    lastUpdated: UPDATED,
    imageAlt: "Lawn mowing cost calculator showing price per cut by lawn size",
  },

  /* ---------------------------------------------------------------- 9 */
  {
    slug: "block-wall-calculator",
    category: "concrete",
    title: "Block Wall Calculator – Blocks, Mortar, Grout & Cost",
    metaDescription:
      "Plan a concrete block wall: number of courses, blocks, cap blocks, mortar, sand, core-fill grout, rebar and total material cost. Free CMU wall estimator.",
    h1: "Block Wall Calculator (Cost & Materials)",
    primaryKeyword: "block wall calculator",
    secondaryKeywords: [
      "cinder block wall calculator",
      "concrete block wall calculator",
      "block wall estimator",
      "concrete block wall cost calculator",
      "cinder block wall cost calculator",
    ],
    cardDescription: "Courses, blocks, cap, mortar, grout, rebar and total cost.",
    shortAnswer:
      "A 30 ft × 4 ft block wall takes 6 courses and about 142 standard blocks with 5% waste, plus roughly 11 bags of mortar. This calculator adds cap blocks, core-fill grout, rebar and total material cost. Enter your wall below.",
    howTo: [
      "Enter the wall length and height.",
      "Choose the block width (6, 8 or 12 inches).",
      "Add any openings, and choose whether to cap the wall.",
      "Set core-fill grout and rebar spacing if the wall is reinforced.",
      "Enter prices to get a full material cost.",
    ],
    formula: {
      plain: [
        "courses = ceil(height in ÷ 8)",
        "blocks per course = ceil(length in ÷ 16)",
        "blocks = ceil(net area × 1.125 × (1 + 5% waste))",
        "cap blocks = ceil(length in ÷ 16)",
        "rebar bars = ceil(length in ÷ spacing) + 1",
      ],
      example: [
        "A 30 ft × 4 ft wall, 8-inch block, no openings:",
        "courses = 48 ÷ 8 = 6",
        "blocks = 120 sq ft × 1.125 × 1.05 = 142",
        "cap blocks = 360 ÷ 16 = 23",
      ],
    },
    tables: [
      {
        title: "Materials for common block walls (8-inch, no openings)",
        columns: [
          { label: "Wall (L × H)" },
          { label: "Courses", num: true },
          { label: "Blocks +5%", num: true },
          { label: "Mortar bags", num: true },
        ],
        rows: [
          ["20 × 4 ft", 6, 95, 8],
          ["30 × 4 ft", 6, 142, 11],
          ["40 × 6 ft", 9, 284, 22],
          ["50 × 6 ft", 9, 355, 28],
        ],
        footnote: "Add cap blocks (one per 16 inches of length) and grout/rebar if reinforced.",
      },
    ],
    tips: [
      "A block wall needs a proper concrete footing below the frost line — budget for it separately.",
      "Reinforced walls need vertical rebar in grouted cores at the spacing your local code requires.",
      "Cap blocks finish the top course and shed water; add one per 16 inches of wall length.",
      "Buy a spare bag of mortar and a few extra blocks — running short mid-course is costly.",
    ],
    faqs: [
      {
        q: "How much does a block wall cost per square foot?",
        a: "Material for a basic unreinforced CMU wall often runs $6–$12 per square foot of wall face; installed with footing, grout, rebar and labor it is typically $15–$30+ per square foot. Reinforcement and finishes push it higher.",
      },
      {
        q: "Do I need a footing for a block wall?",
        a: "Yes. Block walls sit on a poured concrete footing, typically about twice the wall's width and below the local frost line. Verify the size and depth with your building department before you dig.",
      },
      {
        q: "How tall can a block wall be without rebar?",
        a: "It depends entirely on local code, wall thickness and whether it is freestanding or retaining. Many jurisdictions require reinforcement above a few feet. Do not guess — check your local code and permit requirements.",
      },
      {
        q: "How much grout fills block cores?",
        a: "Fully grouting an 8-inch wall takes roughly 0.26 cubic feet of grout per square foot of wall. Filling every other core uses about half that. Six- and twelve-inch blocks differ; use the calculator's values.",
      },
      {
        q: "How many courses are in a 4-foot wall?",
        a: "Six courses. Each standard block course is 8 inches tall including the mortar joint, so 48 inches ÷ 8 = 6 courses.",
      },
    ],
    sources: ["NCMA TEK grout-quantity tables", "Quikrete mortar coverage"],
    warning:
      "Retaining walls over about 3–4 feet usually need an engineer and a permit. Always check local codes.",
    related: [
      "concrete-block-calculator",
      "concrete-slab-cost-calculator",
      "cubic-yard-calculator",
    ],
    lastUpdated: UPDATED,
    imageAlt: "Block wall calculator diagram showing courses, cap blocks and rebar",
  },

  /* ---------------------------------------------------------------- 10 */
  {
    slug: "acres-per-hour-calculator",
    category: "lawn",
    title: "Acres per Hour Calculator – Mowing & Field Work Time",
    metaDescription:
      "Calculate acres per hour for mowers, tractors and field equipment from width, speed and efficiency, and how long it takes to cover your lawn or field.",
    h1: "Acres per Hour Calculator",
    primaryKeyword: "acres per hour calculator",
    secondaryKeywords: ["mowing time calculator", "field work time"],
    cardDescription: "Acres per hour from width, speed and efficiency.",
    shortAnswer:
      "Acres per hour = (working width in inches × speed in mph × efficiency) ÷ 99. A 60-inch deck at 6 mph and 80% efficiency covers about 2.91 acres per hour, so 5 acres takes roughly 1 hour 43 minutes. Enter your equipment below.",
    howTo: [
      "Enter the working width in inches or feet.",
      "Enter the ground speed in mph.",
      "Set a field efficiency — pick a preset for your equipment.",
      "Enter the total area in acres or square feet.",
      "Read acres per hour and the time to finish.",
    ],
    formula: {
      plain: [
        "acres per hour = (width in × mph × efficiency) ÷ 99",
        "(equivalently width ft × mph × efficiency ÷ 8.25)",
        "hours = area (acres) ÷ acres per hour",
      ],
      example: [
        "A 60-inch deck at 6 mph, 80% efficiency:",
        "acres per hour = (60 × 6 × 0.8) ÷ 99 = 2.91",
        "5 acres ÷ 2.91 = 1.72 h = 1 h 43 min",
      ],
    },
    tables: [
      {
        title: "Acres per hour by deck width and speed (80% efficiency)",
        columns: [
          { label: "Deck width" },
          { label: "3 mph", num: true },
          { label: "5 mph", num: true },
          { label: "7 mph", num: true },
        ],
        rows: [
          ['21"', "0.51", "0.85", "1.19"],
          ['42"', "1.02", "1.70", "2.38"],
          ['48"', "1.16", "1.94", "2.72"],
          ['54"', "1.31", "2.18", "3.05"],
          ['60"', "1.45", "2.42", "3.39"],
          ['72"', "1.75", "2.91", "4.07"],
        ],
        footnote: "Theoretical coverage × field efficiency. Real output is lower with obstacles and overlap.",
      },
    ],
    tips: [
      "Field efficiency accounts for overlap, turns and stops — 70–85% is realistic for most mowing.",
      "Overlapping each pass by a few inches lowers your effective width and your acres per hour.",
      "Faster is not always better: ground speed that scalps or leaves clumps costs time on cleanup.",
      "For planning a route, add travel and trimming time on top of the mowing hours.",
    ],
    faqs: [
      {
        q: "How many acres per hour does a zero-turn mow?",
        a: "A 60-inch zero-turn at 6 mph and about 80% efficiency covers roughly 2.9 acres per hour. Wider decks and higher speeds raise that, but obstacles and trimming lower real-world output.",
      },
      {
        q: "How long does it take to mow 1 acre with a push mower?",
        a: "With a 21-inch push mower at walking speed (about 3 mph) and 75–80% efficiency, one acre takes roughly 1.5–2 hours, depending on the terrain and how much trimming is needed.",
      },
      {
        q: "What is field efficiency?",
        a: "Field efficiency is the share of time you are actually cutting at full width, after subtracting turns, overlap, refueling and stops. Mowing is typically 70–85% efficient; it is never 100%.",
      },
      {
        q: "Where does the 99 (or 8.25) come from?",
        a: "It converts units. There are 5,280 feet per mile and 43,560 square feet per acre. Width in inches × mph × efficiency ÷ 99 gives acres per hour; using width in feet, the divisor is 8.25.",
      },
    ],
    sources: ["ASABE D497 machinery management data"],
    related: ["lawn-mowing-cost-calculator", "topsoil-calculator", "square-yard-calculator"],
    lastUpdated: UPDATED,
    imageAlt: "Acres per hour calculator diagram of a mower width and travel path",
  },

  /* ---------------------------------------------------------------- 11 */
  {
    slug: "gutter-slope-calculator",
    category: "landscaping",
    title: "Gutter Slope Calculator – Pitch, Drop & Downspouts",
    metaDescription:
      "Find the right gutter slope and total drop for any run length. Get start and end heights, mid-run splits for long gutters, and how many downspouts you need.",
    h1: "Gutter Slope Calculator",
    primaryKeyword: "gutter slope calculator",
    secondaryKeywords: ["gutter fall calculator", "gutter pitch"],
    cardDescription: "Gutter drop, pitch and downspouts for any run length.",
    shortAnswer:
      'Gutters should slope at least ¼ inch per 10 feet toward a downspout. A 40-foot run at that pitch needs a 1-inch total drop from the high end to the low end. Enter your run length and downspout layout below for exact start and end heights.',
    howTo: [
      "Enter the gutter run length in feet.",
      "Choose a slope — ¼ inch per 10 feet is the common minimum.",
      "Select where the downspouts are (one end, both ends, or the middle).",
      "Optionally enter the roof area draining to size downspouts.",
      "Read the total drop and the high and low end heights.",
    ],
    formula: {
      plain: [
        "total drop (in) = (run length ÷ 10) × slope per 10 ft",
        "with downspouts at both ends, each slope run = length ÷ 2",
        "downspouts ≈ one per 30–40 ft of run",
      ],
      example: [
        "A 40 ft run at ¼ inch per 10 ft:",
        "drop = (40 ÷ 10) × 0.25 = 1 inch total",
        "so the far end sits 1 inch below the downspout end",
      ],
    },
    tables: [
      {
        title: "Gutter drop by run length",
        columns: [
          { label: "Run length" },
          { label: '¼" per 10 ft', num: true },
          { label: '½" per 10 ft', num: true },
        ],
        rows: [
          ["10 ft", '0.25"', '0.5"'],
          ["20 ft", '0.5"', '1.0"'],
          ["30 ft", '0.75"', '1.5"'],
          ["40 ft", '1.0"', '2.0"'],
          ["50 ft", '1.25"', '2.5"'],
          ["60 ft", '1.5"', '3.0"'],
        ],
        footnote: "For long runs, slope from a high mid-point down to a downspout at each end.",
      },
    ],
    tips: [
      "A minimum of ¼ inch of fall per 10 feet keeps water moving without the gutter looking crooked.",
      "For runs over about 35–40 feet, peak in the middle and slope to a downspout at each end.",
      "Too much slope looks off and lets water overshoot the outlet in heavy rain — more is not better.",
      "Add a downspout roughly every 30–40 feet, or size by roof area for heavy rainfall.",
    ],
    faqs: [
      {
        q: "What is the correct slope for gutters?",
        a: "A minimum of ¼ inch of fall per 10 feet of run toward the downspout. Some installers use up to ½ inch per 10 feet for faster drainage. The gutter should always tilt toward its outlet.",
      },
      {
        q: "Can gutters have too much slope?",
        a: "Yes. Excessive slope is visually obvious against the roofline and can let water race past the downspout opening in a downpour. Stick to about ¼–½ inch per 10 feet unless a manufacturer says otherwise.",
      },
      {
        q: "How many downspouts do I need?",
        a: "As a rule of thumb, one downspout per 30–40 feet of gutter. For heavy rainfall or large roofs, size by drainage area — a 2×3-inch downspout handles roughly 600 sq ft of roof and a 3×4-inch about 1,200 sq ft.",
      },
      {
        q: "How do I measure gutter slope?",
        a: "Measure the run length, multiply by the slope rate, and mark the high and low ends. For example, a 20-foot run at ¼ inch per 10 feet drops ½ inch end to end. Snap a chalk line between the marks.",
      },
      {
        q: "Should long gutters slope both ways?",
        a: "Yes. For runs longer than about 35–40 feet, set the high point in the middle and slope down to a downspout at each end. That halves the required drop and keeps the gutter closer to level.",
      },
    ],
    sources: ["gutter manufacturer installation guides", "SMACNA downspout sizing"],
    related: ["square-yard-calculator", "concrete-slab-cost-calculator", "cubic-yard-calculator"],
    lastUpdated: UPDATED,
    imageAlt: "Gutter slope calculator diagram showing the high end, low end and total drop",
  },

  /* ---------------------------------------------------------------- 12 */
  {
    slug: "rip-rap-calculator",
    category: "landscaping",
    title: "Rip Rap Calculator – Tons & Cubic Yards of Riprap",
    metaDescription:
      "Estimate riprap for shorelines, ditches and erosion control. Enter length, width and thickness to get cubic yards and tons, with stone class and thickness guide.",
    h1: "Rip Rap Calculator",
    primaryKeyword: "rip rap calculator",
    secondaryKeywords: ["riprap calculator", "riprap tons"],
    cardDescription: "Riprap cubic yards and tons by area and layer thickness.",
    shortAnswer:
      "A 50 ft × 6 ft area covered 12 inches thick needs about 11.1 cubic yards of riprap, roughly 16.7 tons at 1.5 tons per cubic yard. Layer thickness is usually 1.5–2 times the stone's D50 size. Enter your dimensions and stone class below.",
    howTo: [
      "Enter the length and width (or slope length) of the area.",
      "Set the layer thickness in inches.",
      "Pick a stone size class, or enter a custom density.",
      "Add a waste allowance for voids and uneven placement.",
      "Read cubic yards and tons.",
    ],
    formula: {
      plain: [
        "cubic yards = length × width × (thickness ÷ 12) ÷ 27",
        "tons = cubic yards × density (≈ 1.5 tons per cu yd)",
        "layer thickness ≈ 1.5–2 × stone D50",
      ],
      example: [
        "A 50 ft × 6 ft area, 12 inches thick:",
        "volume = 300 × 1 = 300 cu ft",
        "cubic yards = 300 ÷ 27 = 11.1",
        "tons = 11.1 × 1.5 = 16.7 tons",
      ],
    },
    tables: [
      {
        title: "Typical riprap stone classes",
        columns: [
          { label: "Class" },
          { label: "D50 size" },
          { label: "Layer thickness", num: true },
        ],
        rows: [
          ["Light / Class I", "4–6 in", '12"'],
          ["Medium / Class II", "9–12 in", '18"'],
          ["Heavy / Class III", "15–18 in", '27"'],
        ],
        footnote: "Classes and gradations vary by state DOT. Confirm against your local specification.",
      },
    ],
    tips: [
      "Place riprap over a filter fabric or granular filter layer to stop the soil beneath from washing out.",
      "Make the layer at least 1.5 times the largest stone thick so stones interlock.",
      "Key the toe of a slope in below grade so the blanket does not slide.",
      "Order about 10% extra — angular stone leaves voids and placement is never perfectly even.",
    ],
    faqs: [
      {
        q: "How much area does a ton of riprap cover?",
        a: "At 12 inches thick and about 1.5 tons per cubic yard, one ton covers roughly 18 square feet. Thinner layers cover more; a 6-inch layer covers about 36 square feet per ton.",
      },
      {
        q: "What size riprap do I need?",
        a: "It depends on flow velocity and slope. Light classes (4–6 inch stone) suit gentle ditches and low banks; heavier classes resist faster water. For channel or shoreline work, follow an engineer's or DOT specification.",
      },
      {
        q: "How thick should riprap be?",
        a: "Make the blanket at least 1.5 to 2 times the D50 stone size, and never less than the largest stone. A typical light riprap layer is about 12 inches; heavier classes are 18 inches or more.",
      },
      {
        q: "Do I need filter fabric under riprap?",
        a: "Almost always. A geotextile filter fabric or granular filter layer keeps the underlying soil from eroding out through the stone voids, which would undermine the riprap. Overlap seams generously.",
      },
      {
        q: "How much does riprap cost per ton?",
        a: "Riprap commonly runs about $45–$100 per ton delivered in 2026, depending on stone class, quarry distance and quantity. Get a local quote, since haul distance drives much of the cost.",
      },
    ],
    sources: ["state DOT riprap gradation tables", "USACE/FHWA riprap design guidance"],
    warning:
      "For shoreline or channel work, follow your engineer or local permit requirements.",
    related: ["cubic-yard-calculator", "pea-gravel-calculator", "landscape-materials-calculator"],
    lastUpdated: UPDATED,
    imageAlt: "Rip rap calculator diagram of a stone layer on a slope with thickness labelled",
  },
];

/* ---------------------------------------------------------------- helpers */
export function getCalculator(slug: string): Calculator | undefined {
  return calculators.find((c) => c.slug === slug);
}

export function calculatorsInCategory(category: CategorySlug): Calculator[] {
  return calculators.filter((c) => c.category === category);
}

export function getRelated(cal: Calculator): Calculator[] {
  return cal.related
    .map((slug) => getCalculator(slug))
    .filter((c): c is Calculator => Boolean(c));
}

export const categoryList: Category[] = [
  categories.concrete,
  categories.landscaping,
  categories.lawn,
];

/** Most-popular tools for the homepage row (by search volume in the spec). */
export const popularSlugs = [
  "cubic-yard-calculator",
  "concrete-block-calculator",
  "topsoil-calculator",
  "concrete-slab-cost-calculator",
  "pea-gravel-calculator",
];
