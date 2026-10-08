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
  /** A second worked example for a different common project (audit Task 1). */
  example2?: string[];
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
  /** Precomputed "common sizes" table, shown in addition to the reference tables (audit Task 1). */
  commonSizes?: RefTable;
  tips: string[];
  /** Optional personal note from the owner, shown above Tips (audit: humanized content). */
  fromSikander?: string;
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
  /** 150–250 word intro for the hub (audit Task 4). */
  intro: string;
  /** "Which calculator do I need?" table: project → tool slug. */
  whichTool: { project: string; slug: string }[];
  faqs: Faq[];
}

const UPDATED = "2026-10-08";

export const categories: Record<CategorySlug, Category> = {
  concrete: {
    slug: "concrete",
    title: "Concrete & Block Calculators",
    h1: "Concrete & Block Calculators",
    metaDescription:
      "Free concrete and block calculators: estimate concrete blocks, slab cost, and full block-wall materials with the math shown. US units, 2026 prices.",
    intro:
      "Planning a slab, footing or block wall? These calculators turn your measurements into the quantities a supplier actually sells — cubic yards of ready-mix, numbers of CMU blocks, bags of mortar, cap blocks, core-fill grout and total material cost. They are built for US homeowners and contractors working in feet and inches, with 2026 price estimates you can edit to match a local quote. Concrete and masonry are unforgiving if you under-order: a slab poured short leaves a cold joint, and running out of block mid-course stops the job. So each tool adds a sensible waste allowance and rounds bags and blocks up. Every result comes with a “Show the math” panel, so you can follow the formula with your own numbers instead of trusting a black box, plus a reference table of common sizes for quick planning. Start with the Concrete Block Calculator for a fast block count, the Concrete Slab Cost Calculator for a pour, or the Block Wall Calculator when you need the full material and cost breakdown including grout and rebar. Always confirm structural work, footings and permits with your local building department.",
    whichTool: [
      { project: "Pouring a patio, shed base or driveway slab", slug: "concrete-slab-cost-calculator" },
      { project: "Counting blocks for a wall", slug: "concrete-block-calculator" },
      { project: "Full block wall with mortar, grout and rebar", slug: "block-wall-calculator" },
      { project: "Ordering ready-mix by the cubic yard", slug: "cubic-yard-calculator" },
    ],
    faqs: [
      {
        q: "How much does concrete cost in 2026?",
        a: "Ready-mix concrete runs about $145–$195 per cubic yard delivered in 2026, with a national average near $160. Small loads under 3–4 yards usually carry a short-load fee. Bagged concrete mix costs more per yard but makes sense for pours under about one cubic yard.",
      },
      {
        q: "How do I estimate how many blocks I need?",
        a: "Multiply wall length by height for the area, subtract any openings, then multiply by 1.125 blocks per square foot for standard 8×8×16 block (112.5 per 100 sq ft). Add about 5% for waste. The Concrete Block Calculator does this for you.",
      },
      {
        q: "How thick should a concrete slab be?",
        a: "Four inches is standard for patios, walkways and shed bases; driveways and garage floors are usually 5–6 inches. Thicker slabs and heavier loads may need rebar or mesh. Always confirm against your local building code.",
      },
      {
        q: "Do I need a permit for a block wall?",
        a: "Often yes — especially retaining walls over about 3–4 feet, which usually need an engineer. Freestanding garden walls may not, but footing depth and reinforcement are set by local code. Check with your building department before you build.",
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
      "Buying soil, gravel, mulch or stone by the yard or ton is hard to picture from a tape measure. These calculators convert the area and depth of your project into cubic yards, tons and the number of bags, so you order the right amount — with a small buffer for waste — instead of a driveway full of extra material or a second trip to the yard. They are made for US homeowners and landscapers working in feet and inches, and they cover the full range of bulk materials: topsoil for lawns and beds, mulch and compost, pea gravel and river rock, decomposed granite, sand and crushed stone, plus square yards for carpet, turf and sod, and riprap for erosion control. Each material carries a sensible default depth and a density you can adjust, and every result shows the formula with your numbers plus a reference table of common sizes. Bulk material is sold by the cubic yard and bagged material by the cubic foot, so each tool shows both. Start with the Cubic Yard Calculator for any loose material, the Topsoil or Landscape Material Calculator for beds, or the Square Yard Calculator for flooring.",
    whichTool: [
      { project: "Topping up a lawn or filling garden beds", slug: "topsoil-calculator" },
      { project: "Mulch, rock, decomposed granite or compost", slug: "landscape-materials-calculator" },
      { project: "Pea gravel for a patio, path or playground", slug: "pea-gravel-calculator" },
      { project: "Any loose material by area and depth", slug: "cubic-yard-calculator" },
      { project: "Carpet, turf or sod in square yards", slug: "square-yard-calculator" },
      { project: "Riprap for a shoreline, ditch or slope", slug: "rip-rap-calculator" },
    ],
    faqs: [
      {
        q: "How many cubic yards do I need?",
        a: "Multiply the area in square feet by the depth in feet (depth in inches ÷ 12), then divide by 27. For example, 200 sq ft at 3 inches is 200 × 0.25 ÷ 27 ≈ 1.85 cubic yards. Add 5–10% for settling and waste.",
      },
      {
        q: "How much does a cubic yard cover?",
        a: "One cubic yard covers about 324 sq ft at 1 inch deep, 108 sq ft at 3 inches, or 81 sq ft at 4 inches. Divide 324 by your depth in inches to get the coverage for any material.",
      },
      {
        q: "Is it cheaper to buy in bulk or bags?",
        a: "Bulk by the cubic yard is almost always cheaper above about one cubic yard. Bags are convenient for small beds and easy to transport, but you pay more per yard and do more lifting. Most yards have a delivery minimum.",
      },
      {
        q: "How much does a yard of material weigh?",
        a: "It depends on the material: roughly 1.1 tons for topsoil, 1.4 tons for gravel, 1.35 tons for sand or river rock, and about 0.3 tons for bark mulch. Moisture changes these, so confirm tonnage with your supplier.",
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
      "Whether you are a homeowner checking a quote or a lawn-care pro pricing a route, these tools put real numbers behind mowing instead of a guess. Homeowners can estimate what a cut should cost from lawn size using 2026 average rates; pros can price a job from mower deck width, ground speed, field efficiency and an hourly rate, and see the price per cut, per month and per season. The same math tells you how long a lawn or field will take: acres per hour equals working width in inches times speed in mph times efficiency, divided by 99. Field efficiency — the share of time actually spent cutting after turns, overlap and stops — is usually 70–85%, never 100%, so the tools build that in. They are made for US lawns measured in square feet or acres, and every result shows the formula with your numbers plus a reference table of common sizes. Start with the Lawn Mowing Cost Calculator to price a cut either way, or the Acres per Hour Calculator to work out mowing time for any mower or tractor.",
    whichTool: [
      { project: "What a mow should cost (homeowner)", slug: "lawn-mowing-cost-calculator" },
      { project: "What to charge for a job (pro)", slug: "lawn-mowing-cost-calculator" },
      { project: "How long a lawn or field takes to mow", slug: "acres-per-hour-calculator" },
    ],
    faqs: [
      {
        q: "How much does lawn mowing cost in 2026?",
        a: "A typical visit runs about $40–$55 for a quarter-acre lot and $90 or more for a full acre, with a national average around $50–$60. Weekly service often costs a little less per visit than one-off cuts. Rates vary by region and terrain.",
      },
      {
        q: "How many acres can I mow per hour?",
        a: "Acres per hour = width (in) × speed (mph) × efficiency ÷ 99. A 60-inch zero-turn at 6 mph and 80% efficiency covers about 2.9 acres per hour; a 21-inch push mower at 3 mph does about 0.5 acres per hour.",
      },
      {
        q: "How do pros price mowing jobs?",
        a: "Estimate the mowing time from acres per hour, add trimming and travel time, multiply by your hourly rate, then add overhead for fuel and wear. Most add a minimum charge for small lots. The pro tab does this automatically.",
      },
      {
        q: "How long does it take to mow an acre?",
        a: "Roughly 30–60 minutes with a 42–60 inch riding or zero-turn mower, or 1.5–2 hours with a 21-inch push mower. Speed, obstacles and how much trimming is needed all change the time.",
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
      "Free cubic yard calculator. Enter length, width and depth to get cubic yards, cubic feet, tons and bags for gravel, soil, mulch or concrete.",
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
      "1 cubic yard = 27 cubic feet. Spread it 1 inch deep and it covers 324 sq ft. At 3 inches you get 108 sq ft, and at 4 inches it's 81 sq ft. Just enter your area and depth below and you'll see the cubic yards, tons and bags you need for gravel, soil, mulch or concrete.",
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
      example2: [
        "A 20 × 12 ft driveway, 4 inches deep:",
        "area = 20 × 12 = 240 sq ft",
        "volume = 240 × (4 ÷ 12) = 80 cu ft",
        "cubic yards = 80 ÷ 27 = 2.96 cu yd",
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
    commonSizes: {
      title: "Cubic yards by area and depth",
      columns: [{ label: "Area" }, { label: '2"', num: true }, { label: '3"', num: true }, { label: '4"', num: true }, { label: '6"', num: true }],
      rows: [
        ["100 sq ft", "0.62", "0.93", "1.23", "1.85"],
        ["200 sq ft", "1.23", "1.85", "2.47", "3.70"],
        ["500 sq ft", "3.09", "4.63", "6.17", "9.26"],
        ["1,000 sq ft", "6.17", "9.26", "12.35", "18.52"],
      ],
      footnote: "Cubic yards = area × (depth ÷ 12) ÷ 27. Add 5–10% for waste.",
    },
    fromSikander: "When I measured my own garden beds, I kept mixing up the depth. I'd measure in inches but think in feet, and my numbers came out way off. That's why this calculator asks for depth in inches and length in feet. My tip: measure depth with a ruler in inches, then let the calculator do the converting.",
    tips: [
      "Order about 5–10% extra. Material settles, ground is never perfectly flat, and some always ends up on the driveway.",
      "Bulk material is sold by the cubic yard, and bags are sold by the cubic foot. Mulch bags are usually 2 cu ft, soil 0.75 cu ft and gravel 0.5 cu ft.",
      "Lots of yards have a delivery minimum. Once you need more than roughly 1 cubic yard, bulk usually works out cheaper than bags.",
      "A standard pickup bed fits about 2–3 cubic yards of mulch. Gravel and soil are much heavier, so weight limits you to about 1 cubic yard.",
    ],
    faqs: [
      {
        q: "Is a cubic yard 3×3×3?",
        a: "Yep. Picture a box that's 3 feet on every side: 3 ft × 3 ft × 3 ft = 27 cubic feet. That's why you divide cubic feet by 27 to get cubic yards.",
      },
      {
        q: "How many square feet does a cubic yard cover?",
        a: "It comes down to how deep you go. One cubic yard covers 324 sq ft at 1 inch, 108 sq ft at 3 inches and 81 sq ft at 4 inches. Quick trick: divide 324 by your depth in inches.",
      },
      {
        q: "How many bags of mulch are in a yard?",
        a: "A yard holds 27 cubic feet, so that's 13.5 bags of the 2-cubic-foot kind. I'd round up to 14 bags if you want to fully match one bulk yard.",
      },
      {
        q: "How do I convert cubic feet to cubic yards?",
        a: "Just divide your cubic feet by 27. Say you've got 54 cubic feet: 54 ÷ 27 = 2 cubic yards. Going the other way? Multiply cubic yards by 27.",
      },
      {
        q: "How much does a cubic yard weigh?",
        a: "It depends on the material. Gravel comes in around 1.4 tons per cubic yard, topsoil about 1.1 tons, wet concrete about 2 tons, and bark mulch only 0.3 tons. Wet material weighs more, so treat these as ballpark figures.",
      },
      {
        q: "Can a pickup truck carry a cubic yard?",
        a: "Most half-ton pickups can safely carry about one cubic yard of soil or gravel. Mulch is much lighter, so you can usually fit two to three cubic yards. Check your truck's payload rating before you load up.",
      },
      {
        q: "How many cubic yards are in a ton?",
        a: "It depends on how dense the material is. A ton of gravel is about 0.7 cubic yards (1.4 t/yd³), a ton of topsoil about 0.9 cubic yards, and a ton of wet concrete about 0.5 cubic yards. To work it out, divide the tons by the material's tons-per-cubic-yard.",
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
    lastUpdated: "2026-10-09",
    imageAlt: "Cubic yard calculator diagram showing length, width and depth of an area",
  },

  /* ---------------------------------------------------------------- 2 */
  {
    slug: "concrete-block-calculator",
    category: "concrete",
    title: "Concrete Block Calculator – CMU & Cinder Blocks Needed",
    metaDescription:
      "Find how many concrete blocks (CMU or cinder) you need for a wall. Enter length and height, subtract openings, and get blocks, mortar bags and cost.",
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
      "Each standard 8×8×16 concrete block covers 8\" × 16\" of wall, so you need 1.125 blocks per square foot. That's 112.5 blocks for every 100 sq ft. Enter your wall length and height, take out any doors or windows, and you'll get the block count, mortar bags and cost below.",
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
      example2: [
        "A 40 ft × 4 ft garden wall, no openings, 5% waste:",
        "net area = 40 × 4 = 160 sq ft",
        "blocks = 160 × 1.125 = 180",
        "with 5% waste = 180 × 1.05 = 189 blocks",
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
    commonSizes: {
      title: "Common walls: blocks + mortar (incl. 5% waste)",
      columns: [{ label: "Wall (L × H)" }, { label: "Blocks", num: true }, { label: "Mortar bags", num: true }],
      rows: [
        ["10 × 4 ft", 48, 4],
        ["20 × 4 ft", 95, 8],
        ["20 × 6 ft", 142, 11],
        ["30 × 8 ft", 284, 22],
        ["40 × 8 ft", 378, 30],
      ],
      footnote: "Blocks include 5% waste; mortar at about 13 blocks per 80-lb bag.",
    },
    tips: [
      "Order about 5% extra. Some blocks always break, and you'll cut a few at corners and openings.",
      "A standard CMU weighs about 30–38 lb, and lightweight blocks are lighter. Get a helper if you can; lifting a few hundred of them adds up fast.",
      "One 80-lb bag of mortar mix lays about 13 standard blocks. Grab one spare bag so you don't run out mid-wall.",
      "Concrete blocks usually come by the pallet. Ask your supplier how many are on one so you can order full pallets and keep delivery simple.",
    ],
    faqs: [
      {
        q: "How many blocks are in 100 square feet?",
        a: "You need 112.5 standard 8×8×16 blocks for every 100 square feet of wall. Each block covers 8\" × 16\" of face, which works out to 1.125 blocks per square foot. Round up and add about 5% for waste.",
      },
      {
        q: "What are the actual dimensions of an 8×8×16 block?",
        a: "8×8×16 is the nominal size. The real block measures about 7⅝ × 7⅝ × 15⅝ inches. The missing ⅜ inch is left for the mortar joint, so once it's laid, each block takes up a full 8\" × 16\".",
      },
      {
        q: "What is the difference between a cinder block and a concrete block?",
        a: "Both are concrete masonry units (CMU). \"Cinder block\" is the older name for lighter blocks made with cinders or fly ash, while most blocks sold today use heavier concrete aggregate. For counting how many you need, treat them exactly the same.",
      },
      {
        q: "How much mortar do I need per block?",
        a: "Plan on about one 80-lb bag of mortar mix for every 13 standard blocks, laid with a ⅜-inch joint. So 142 blocks needs roughly 11 bags. Mix small batches so the mortar doesn't set before you use it.",
      },
      {
        q: "How much does a concrete block weigh?",
        a: "A standard 8×8×16 block weighs about 30–38 pounds, depending on whether it's normal-weight or lightweight aggregate. Solid blocks and wider 12-inch blocks weigh more.",
      },
      {
        q: "How many blocks are on a pallet?",
        a: "It depends on the block size and the supplier, but it's usually somewhere between 90 and 144 standard blocks per pallet. Ask your yard for the exact number so your order and delivery match.",
      },
      {
        q: "How many bags of mortar do I need for 100 blocks?",
        a: "About 8 bags of 80-lb mortar mix. One bag lays roughly 13 blocks, and 100 ÷ 13 ≈ 7.7, so round up to 8. It's worth buying one spare bag so you don't run short halfway through a course.",
      },
    ],
    sources: ["CMU nominal-face geometry (144 ÷ 128 = 1.125)", "Quikrete mortar coverage"],
    related: [
      "block-wall-calculator",
      "concrete-slab-cost-calculator",
      "cubic-yard-calculator",
      "rip-rap-calculator",
    ],
    lastUpdated: "2026-10-09",
    imageAlt: "Concrete block calculator diagram of a CMU wall with courses and openings",
  },

  /* ---------------------------------------------------------------- 3 */
  {
    slug: "concrete-slab-cost-calculator",
    category: "concrete",
    title: "Concrete Slab Cost Calculator – 2026 Price per Sq Ft",
    metaDescription:
      "Estimate concrete slab cost by size and thickness. Get cubic yards, bags or ready-mix, and total price with labor, rebar and base. 2026 prices.",
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
      "A 10 × 10 ft slab at 4 inches thick needs about 1.23 cubic yards of concrete, or 1.36 with 10% waste. At a 2026 average of roughly $160 per cubic yard delivered, that's about $220 in concrete before labor. Put in your own size below and you'll get the full cost breakdown.",
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
      example2: [
        "A 24 × 24 ft garage slab, 6 inches thick, 10% waste:",
        "cubic yards = 576 × (6 ÷ 12) ÷ 27 = 10.67",
        "with 10% waste = 11.73 cu yd (316.8 cu ft)",
        "ready-mix at ~$160/yd ≈ $1,877 of concrete",
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
    commonSizes: {
      title: "Common slabs: concrete + 80-lb bags",
      columns: [{ label: "Slab size" }, { label: 'Cu yd @ 4"', num: true }, { label: '80-lb bags @ 4"', num: true }, { label: 'Cu yd @ 6"', num: true }],
      rows: [
        ["10 × 10 ft", "1.23", 56, "1.85"],
        ["12 × 12 ft", "1.78", 80, "2.67"],
        ["16 × 16 ft", "3.16", 143, "4.74"],
        ["20 × 20 ft", "4.94", 223, "7.41"],
        ["24 × 24 ft", "7.11", 320, "10.67"],
        ["30 × 30 ft", "11.11", 500, "16.67"],
      ],
      footnote: "Bags shown for 4 inches (80-lb ≈ 0.60 cu ft). Above ~1 cu yd, ready-mix is cheaper and faster than bags.",
    },
    tips: [
      "Add about 10% for waste. Some concrete always spills, and the ground under a slab is never perfectly even.",
      "Bags make sense for small jobs under about 1 cubic yard. Past that, ready-mix delivery is usually cheaper and saves your back.",
      "Ask the ready-mix plant about its short-load fee. Orders under about 3–4 cubic yards often cost extra per yard.",
      "4 inches is the normal thickness for patios and walkways. Driveways and garage floors are usually 5–6 inches. Check your local code before you pour.",
    ],
    faqs: [
      {
        q: "How much does a 20×20 concrete slab cost?",
        a: "A 20×20 slab at 4 inches thick takes about 5 cubic yards of concrete. The concrete alone runs roughly $800–$1,000. Once you add finishing labor, rebar and a gravel base, most people pay somewhere around $2,400–$4,000, depending on where they live.",
      },
      {
        q: "Is it cheaper to mix bags or order ready-mix?",
        a: "Bags only win on small pours under about 1 cubic yard. A 10×10 slab already takes around 60 bags of 80-lb mix, and that's a lot of lifting and mixing. Above a yard, ready-mix costs less per yard and goes much faster.",
      },
      {
        q: "How thick should a concrete slab be?",
        a: "4 inches is standard for patios, shed bases and walkways. Driveways and garage floors are usually 5–6 inches, and areas for heavy trucks go thicker. Your local building code has the final say, so check it first.",
      },
      {
        q: "How many 80-lb bags of concrete are in a yard?",
        a: "About 45. Each 80-lb bag makes roughly 0.60 cubic feet of concrete, and a yard is 27 cubic feet. If you're using 60-lb bags, plan on about 60 per yard.",
      },
      {
        q: "Do I need rebar or wire mesh in a slab?",
        a: "For most slabs, yes. #4 rebar in a grid or welded wire mesh helps control cracking, especially on driveways and anything that carries weight. Small, lightly used pads can sometimes get by with fiber-reinforced concrete instead.",
      },
      {
        q: "What is the minimum ready-mix order?",
        a: "Many plants will deliver as little as about 1 cubic yard, but they add a short-load fee below roughly 3–4 yards. Ask about it when you call, so a small slab doesn't end up costing more than you planned.",
      },
      {
        q: "How much does a 30x30 concrete slab cost at 4 inches thick?",
        a: "A 30 × 30 slab at 4 inches needs about 11.1 cubic yards, or 12.2 with 10% waste. The concrete alone costs roughly $1,800–$2,300. With labor, rebar and base, installed prices usually land between $8,000 and $13,000, depending on your area and the finish you pick.",
      },
    ],
    sources: ["2026 ready-mix price guides", "Quikrete/Sakrete bag yields"],
    related: [
      "cubic-yard-calculator",
      "concrete-block-calculator",
      "block-wall-calculator",
      "square-yard-calculator",
    ],
    lastUpdated: "2026-10-09",
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
      "A 20 × 10 ft bed at 4 inches deep needs about 2.47 cubic yards of topsoil, which is roughly 2.7 tons. For a new lawn, spread 4–6 inches. For top-dressing an existing lawn, ¼–½ inch is plenty. Enter your area and depth below to get cubic yards, tons and bags.",
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
      example2: [
        "A 4 × 8 ft raised bed, 12 inches deep:",
        "area = 4 × 8 = 32 sq ft",
        "volume = 32 × (12 ÷ 12) = 32 cu ft",
        "cubic yards = 32 ÷ 27 = 1.19 cu yd",
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
    commonSizes: {
      title: "Topsoil by area and depth (cubic yards)",
      columns: [{ label: "Area" }, { label: '2"', num: true }, { label: '3"', num: true }, { label: '4"', num: true }, { label: '6"', num: true }],
      rows: [
        ["100 sq ft", "0.62", "0.93", "1.23", "1.85"],
        ["200 sq ft", "1.23", "1.85", "2.47", "3.70"],
        ["500 sq ft", "3.09", "4.63", "6.17", "9.26"],
        ["1,000 sq ft", "6.17", "9.26", "12.35", "18.52"],
      ],
      footnote: "At about 1.1 tons per cubic yard; 36 bags of 0.75 cu ft per yard.",
    },
    tips: [
      "Buy screened topsoil for lawns and garden beds. Unscreened fill dirt is for grading and filling holes, not for growing things.",
      "Topsoil settles after a rain or two, so order about 5% extra and rake it a little high.",
      "Once you need more than about 1 cubic yard, bulk delivery beats bags. One yard is about 36 bags of 0.75 cu ft.",
      "For raised beds, mix topsoil with compost instead of filling them with straight topsoil.",
    ],
    faqs: [
      {
        q: "How much area does a yard of topsoil cover?",
        a: "One cubic yard covers about 324 sq ft at 1 inch deep, 108 sq ft at 3 inches, or 81 sq ft at 4 inches. For any depth, divide 324 by the depth in inches.",
      },
      {
        q: "How much does a yard of topsoil weigh?",
        a: "Screened topsoil weighs about 1.1 tons per cubic yard, or roughly 2,200 lb, when it's fairly dry. Wet soil or heavy clay can weigh a lot more, so treat the tonnage as an estimate.",
      },
      {
        q: "What is the difference between topsoil, garden soil and fill dirt?",
        a: "Topsoil is screened soil from the surface layer, good for general use. Garden soil is topsoil with compost mixed in, made for planting. Fill dirt is subsoil with very little organic matter. Use it to raise or level ground, not to grow grass or plants in.",
      },
      {
        q: "How many bags of topsoil make a yard?",
        a: "With 0.75-cubic-foot bags, you need 36 bags for one cubic yard (27 ÷ 0.75). With 1-cubic-foot bags, it's 27. Past a yard, bulk delivery is usually the cheaper way to go.",
      },
      {
        q: "How deep should topsoil be for grass?",
        a: "For a new lawn, aim for 4–6 inches of good topsoil so the roots have room to grow. If you're just overseeding an existing lawn, a ¼–½ inch top-dressing raked into the surface is enough.",
      },
      {
        q: "How many cubic yards of topsoil for a 1,000 sq ft lawn?",
        a: "At 4 inches deep, a 1,000 sq ft lawn needs about 12.3 cubic yards of topsoil. At 2 inches, for a lighter regrade, it's about 6.2 cubic yards. The math is area times depth in feet, divided by 27.",
      },
      {
        q: "Is topsoil sold by the yard or the ton?",
        a: "Most suppliers sell bulk topsoil by the cubic yard, but some sell it by the ton. One cubic yard of screened topsoil weighs about 1.1 tons, so if you get a price per ton, multiply your cubic yards by about 1.1.",
      },
    ],
    sources: ["USDA topsoil bulk-density references"],
    related: [
      "cubic-yard-calculator",
      "landscape-materials-calculator",
      "pea-gravel-calculator",
      "lawn-mowing-cost-calculator",
    ],
    lastUpdated: "2026-10-09",
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
      "A 12 × 12 ft area at 3 inches deep needs about 1.33 cubic yards of pea gravel. That's roughly 1.87 tons, or 72 bags of 0.5 cu ft. Go 2–3 inches deep for paths and 3–4 inches for patios. Enter your measurements below for the exact amount.",
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
      example2: [
        "A 3 × 40 ft path, 2 inches deep:",
        "area = 3 × 40 = 120 sq ft",
        "volume = 120 × (2 ÷ 12) = 20 cu ft",
        "cubic yards = 20 ÷ 27 = 0.74 cu yd ≈ 1.04 tons",
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
    commonSizes: {
      title: "Pea gravel by area and depth (cubic yards)",
      columns: [{ label: "Area" }, { label: '2"', num: true }, { label: '3"', num: true }, { label: '4"', num: true }],
      rows: [
        ["100 sq ft", "0.62", "0.93", "1.23"],
        ["200 sq ft", "1.23", "1.85", "2.47"],
        ["500 sq ft", "3.09", "4.63", "6.17"],
        ["1,000 sq ft", "6.17", "9.26", "12.35"],
      ],
      footnote: "At about 1.4 tons per cubic yard; 54 bags of 0.5 cu ft per yard.",
    },
    tips: [
      "Put landscape fabric down first. It keeps the gravel from sinking into the dirt and cuts down on weeds.",
      "Use 2–3 inches for walkways and 3–4 inches for patios, with a solid edge to keep the stones from wandering.",
      "Pea gravel rolls around underfoot. For a driveway, crushed angular stone packs down much better.",
      "Order about 10% extra. Pea gravel spreads out and settles more than crushed stone does.",
    ],
    faqs: [
      {
        q: "How much area does a ton of pea gravel cover?",
        a: "About 115 sq ft at 2 inches deep, or roughly 77 sq ft at 3 inches. A ton is about 0.71 cubic yards (1 ÷ 1.4), so the deeper you go, the less ground it covers.",
      },
      {
        q: "How deep should pea gravel be for a patio?",
        a: "3 to 4 inches over a compacted base and landscape fabric makes a patio that feels solid. Go thinner and the stones shift and the ground shows through. Go much thicker and it feels loose to walk on.",
      },
      {
        q: "Is pea gravel or crushed stone better for a driveway?",
        a: "Crushed stone. Its sharp edges lock together and hold up under tires. Smooth, round pea gravel gets pushed around by cars, so it's better for patios and garden paths.",
      },
      {
        q: "How many bags of pea gravel are in a yard?",
        a: "About 54 bags of 0.5 cubic feet make one cubic yard (27 ÷ 0.5). At roughly 50 lb a bag, that's over 2,600 lb, so above a yard, bulk delivery usually costs less.",
      },
      {
        q: "Do I need landscape fabric under pea gravel?",
        a: "I'd always use it. Fabric keeps the gravel from sinking into the soil, keeps the layer clean and cuts down on weeds. Overlap the seams and pin down the edges.",
      },
      {
        q: "How much pea gravel do I need for a 10x10 patio?",
        a: "A 10 × 10 patio (100 sq ft) at 3 inches deep needs about 0.93 cubic yards of pea gravel. That's roughly 1.3 tons or 50 bags of 0.5 cubic feet. Add about 10% for raking and settling.",
      },
      {
        q: "How many tons of pea gravel are in a cubic yard?",
        a: "About 1.4 tons for dry pea gravel, so one cubic yard weighs around 2,800 lb. Wet stone and bigger stone sizes change that a bit, so check with your supplier on large orders.",
      },
    ],
    sources: ["landscape-supply gravel density", "CPSC playground surfacing guidance"],
    related: [
      "cubic-yard-calculator",
      "landscape-materials-calculator",
      "rip-rap-calculator",
      "topsoil-calculator",
    ],
    lastUpdated: "2026-10-09",
    imageAlt: "Pea gravel calculator diagram of a patio area with gravel depth labelled",
  },

  /* ---------------------------------------------------------------- 6 */
  {
    slug: "square-yard-calculator",
    category: "landscaping",
    title: "Square Yard Calculator – Feet & Inches to Square Yards",
    metaDescription:
      "Convert room or area dimensions to square yards for carpet, turf or sod. Add multiple rooms, include waste, and estimate cost per square yard.",
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
      example2: [
        "A 12 × 15 ft bedroom:",
        "area = 12 × 15 = 180 sq ft",
        "square yards = 180 ÷ 9 = 20 sq yd",
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
    commonSizes: {
      title: "Square feet to square yards",
      columns: [{ label: "Square feet", num: true }, { label: "Square yards", num: true }],
      rows: [
        [50, "5.6"],
        [100, "11.1"],
        [150, "16.7"],
        [200, "22.2"],
        [300, "33.3"],
        [450, "50.0"],
        [600, "66.7"],
      ],
      footnote: "Divide square feet by 9. Add about 10% for carpet waste and seams.",
    },
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
      {
        q: "How many square yards is a 10x12 room?",
        a: "A 10 × 12 ft room is 120 square feet, which is 13.3 square yards (120 ÷ 9). Order about 10% extra for carpet waste, so roughly 14.7 square yards.",
      },
      {
        q: "How do I convert square meters to square yards?",
        a: "Multiply square meters by 1.196 to get square yards (1 m² = 1.196 sq yd), or divide square yards by 1.196 to go the other way. One square yard is about 0.836 square meters.",
      },
      {
        q: "How much carpet do I need for a 12x12 room?",
        a: "A 12 × 12 ft room is 144 square feet, or 16 square yards. With a typical 10% waste allowance, order about 17.6 square yards. Carpet comes in 12- and 15-foot-wide rolls, so a 12-foot room often cuts with little waste.",
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
      "One calculator for all landscaping materials: mulch, river rock, topsoil, sand, decomposed granite, compost and gravel. Get yards, tons and bags.",
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
      example2: [
        "A 3 ft × 60 ft bed edge, mulch at 3 inches:",
        "area = 3 × 60 = 180 sq ft",
        "volume = 180 × (3 ÷ 12) = 45 cu ft",
        "cubic yards = 45 ÷ 27 = 1.67 cu yd",
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
    commonSizes: {
      title: "Material by area and depth (cubic yards)",
      columns: [{ label: "Area" }, { label: '2"', num: true }, { label: '3"', num: true }, { label: '4"', num: true }, { label: '6"', num: true }],
      rows: [
        ["100 sq ft", "0.62", "0.93", "1.23", "1.85"],
        ["200 sq ft", "1.23", "1.85", "2.47", "3.70"],
        ["500 sq ft", "3.09", "4.63", "6.17", "9.26"],
        ["1,000 sq ft", "6.17", "9.26", "12.35", "18.52"],
      ],
      footnote: "Cubic yards are the same for any material; multiply by its tons per cubic yard for weight.",
    },
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
      {
        q: "How much mulch do I need for 200 square feet?",
        a: "At the usual 3-inch depth, 200 square feet needs about 1.85 cubic yards of mulch — close to two bulk yards, or about 25 bags of 2 cubic feet. At 2 inches it is about 1.23 cubic yards.",
      },
      {
        q: "How many bags of river rock equal a cubic yard?",
        a: "About 54 bags of 0.5 cubic feet make one cubic yard (27 ÷ 0.5). River rock weighs roughly 1.35 tons per cubic yard, so a yard is over 2,700 lb — bulk delivery is usually cheaper for large areas.",
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
      example2: [
        "Pro job: 0.5 acre, 42-inch deck, 4 mph, 80% efficiency:",
        "acres per hour = (42 × 4 × 0.8) ÷ 99 = 1.36",
        "mow hours = 0.5 ÷ 1.36 = 0.37 h ≈ 22 min",
        "add trim + travel, then × your hourly rate",
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
        footnote: "Source: 2026 US lawn-care cost guides (e.g. LawnStarter). Local rates vary with region, terrain and service.",
      },
    ],
    commonSizes: {
      title: "Mowing time by lawn size (42-inch deck, 4 mph, 80%)",
      columns: [{ label: "Lawn size" }, { label: "Acres", num: true }, { label: "Mowing time", num: true }],
      rows: [
        ["¼ acre", "0.25", "11 min"],
        ["½ acre", "0.50", "22 min"],
        ["¾ acre", "0.75", "33 min"],
        ["1 acre", "1.00", "44 min"],
        ["2 acres", "2.00", "1 h 28 min"],
      ],
      footnote: "Mowing time only, before trimming and travel, at 1.36 acres per hour.",
    },
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
      {
        q: "How much should I charge to mow a half-acre lawn?",
        a: "Most pros charge about $55–$75 to mow a half-acre of open lawn in 2026. Price it from your time: a half-acre takes roughly 20–35 minutes of mowing with a 42–48 inch deck, plus trimming and travel, times your hourly rate and overhead.",
      },
      {
        q: "How do you price lawn mowing per 1,000 square feet?",
        a: "Divide the job price by the lawn's area in thousands of square feet. Many services land around $4–$8 per 1,000 sq ft for regular mowing, with a minimum charge for small lots. The pro tab shows your price per 1,000 sq ft automatically.",
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
      example2: [
        "A 50 ft × 3 ft wall, 8-inch block, capped, no openings:",
        "courses = 36 ÷ 8 = 5 (rounds up from 4.5)",
        "blocks = 150 sq ft × 1.125 × 1.05 = 178",
        "cap blocks = 600 ÷ 16 = 38",
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
    commonSizes: {
      title: "Common walls: blocks, caps & mortar (8-inch, incl. 5% waste)",
      columns: [{ label: "Wall (L × H)" }, { label: "Blocks", num: true }, { label: "Caps", num: true }, { label: "Mortar bags", num: true }],
      rows: [
        ["20 × 4 ft", 95, 15, 8],
        ["30 × 4 ft", 142, 23, 11],
        ["40 × 6 ft", 284, 30, 22],
        ["50 × 6 ft", 355, 38, 28],
      ],
      footnote: "Caps at one per 16 inches of length. Add grout and rebar if the wall is reinforced.",
    },
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
        a: "Yes. Block walls sit on a poured concrete footing, typically about twice the wall's width and below the local frost line. Confirm the size and depth with your building department before you dig.",
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
      {
        q: "How many blocks do I need for a 50-foot wall?",
        a: "A 50 ft wall at 4 feet tall is 200 sq ft, about 225 blocks before waste or 237 with 5% (200 × 1.125 × 1.05). At 3 feet tall it is about 178 blocks. Add cap blocks at one per 16 inches of length.",
      },
      {
        q: "How much does it cost to build a 50-foot block wall?",
        a: "Materials for a 50 ft × 4 ft unreinforced wall often run $1,200–$2,400 (blocks, mortar, caps). Installed with footing, grout, rebar and labor, expect roughly $6,000–$12,000 depending on height, reinforcement and your area.",
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
      example2: [
        "A 42-inch deck at 4 mph, 80% efficiency:",
        "acres per hour = (42 × 4 × 0.8) ÷ 99 = 1.36",
        "1 acre ÷ 1.36 = 0.74 h = 44 minutes",
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
    commonSizes: {
      title: "Time to cover an area by acres per hour",
      columns: [{ label: "Area" }, { label: "@1.0 ac/hr", num: true }, { label: "@2.0 ac/hr", num: true }, { label: "@3.0 ac/hr", num: true }],
      rows: [
        ["½ acre", "30 min", "15 min", "10 min"],
        ["1 acre", "1 h 00 min", "30 min", "20 min"],
        ["2 acres", "2 h 00 min", "1 h 00 min", "40 min"],
        ["5 acres", "5 h 00 min", "2 h 30 min", "1 h 40 min"],
      ],
      footnote: "Mowing time only; add travel and trimming. Pick the column matching your acres per hour.",
    },
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
      {
        q: "How many acres per hour can a 42-inch mower cut?",
        a: "About 1.0–1.4 acres per hour. At 4 mph and 80% efficiency a 42-inch deck covers 1.36 acres per hour; faster speeds raise it, but obstacles and trimming lower real output. Width (in) × mph × efficiency ÷ 99.",
      },
      {
        q: "How long does it take to mow 5 acres?",
        a: "Roughly 1.5–3.5 hours depending on the mower. A 60-inch zero-turn at 6 mph (about 2.9 ac/hr) does 5 acres in around 1 hour 45 minutes; a 42-inch deck at 4 mph takes closer to 3.5 hours.",
      },
      {
        q: "What speed should I mow at?",
        a: "Most lawn mowing is done at 3–5 mph. Go faster on open, even ground; slow down in thick or wet grass to avoid scalping and clumping, which cost more time in cleanup than you save.",
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
      "Find the right gutter slope and total drop for any run length. Get start and end heights, mid-run splits for long gutters, and downspout counts.",
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
        "so the far end sits 1 inch higher than the downspout end",
      ],
      example2: [
        "A 60 ft run with a downspout at each end:",
        "slope from the middle: each side = 60 ÷ 2 = 30 ft",
        "drop each side = (30 ÷ 10) × 0.25 = 0.75 inch",
        "the centre sits 0.75 inch above each outlet",
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
    commonSizes: {
      title: "Downspouts by gutter run",
      columns: [{ label: "Run length" }, { label: "Downspouts" }],
      rows: [
        ["Up to 30 ft", "1"],
        ["35–40 ft", "1–2"],
        ["40–75 ft", "2"],
        ["75–110 ft", "3"],
      ],
      footnote: "Rule of thumb: one downspout per 30–40 ft of run. At 35–40 ft, 1–2 depending on rainfall. Or size by roof area (2×3 in ≈ 600 sq ft; 3×4 in ≈ 1,200 sq ft).",
    },
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
      {
        q: "How far apart should gutter downspouts be?",
        a: "No more than about 30–40 feet apart along a run. Long runs drain better with a downspout at each end and a high point in the middle. In heavy-rain regions, add more and size them by roof area.",
      },
      {
        q: "What is the minimum slope for a gutter?",
        a: "A quarter inch of fall per 10 feet of run — just enough to keep water moving to the downspout. That is a 1-inch drop over a 40-foot run. Keep it under about ½ inch per 10 feet so it does not look crooked.",
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
      "Estimate riprap for shorelines, ditches and erosion control. Enter length, width and thickness to get cubic yards and tons, with a stone-class guide.",
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
      example2: [
        "A 30 ft × 8 ft slope, 18 inches thick:",
        "area = 30 × 8 = 240 sq ft",
        "volume = 240 × (18 ÷ 12) = 360 cu ft",
        "cubic yards = 360 ÷ 27 = 13.33 ≈ 20 tons",
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
    commonSizes: {
      title: "Riprap tons by area and thickness (1.5 t/yd³)",
      columns: [{ label: "Area" }, { label: '12"', num: true }, { label: '18"', num: true }, { label: '24"', num: true }],
      rows: [
        ["100 sq ft", "5.6", "8.3", "11.1"],
        ["200 sq ft", "11.1", "16.7", "22.2"],
        ["300 sq ft", "16.7", "25.0", "33.3"],
        ["500 sq ft", "27.8", "41.7", "55.6"],
      ],
      footnote: "At about 1.5 tons per cubic yard; one ton covers roughly 18 sq ft at 12 inches thick.",
    },
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
      {
        q: "How many tons of riprap do I need per square foot?",
        a: "At 12 inches thick and about 1.5 tons per cubic yard, you need roughly 0.056 tons (about 110 lb) per square foot. So 100 square feet at 12 inches is about 5.6 tons. Thicker layers need proportionally more.",
      },
      {
        q: "How much riprap do I need for a 100-foot shoreline?",
        a: "For a 100 ft shoreline 6 ft wide (600 sq ft) at 18 inches thick, you need about 33 cubic yards or 50 tons of riprap at 1.5 t/yd³. Confirm the thickness and stone class with your engineer or local permit.",
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
