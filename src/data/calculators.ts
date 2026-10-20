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
  /** Optional intro paragraph shown above the table. */
  intro?: string;
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
  /** "What this calculator doesn't cover" note, shown after the worked examples. */
  notCovered?: string;
  tables: RefTable[];
  /** Precomputed "common sizes" table, shown in addition to the reference tables (audit Task 1). */
  commonSizes?: RefTable;
  tips: string[];
  /** Optional personal note from the owner, shown above Tips (audit: humanized content). */
  fromSikander?: string;
  /** Optional photo for the "From Sikander" note (WebP, explicit dimensions, lazy-loaded). */
  fromSikanderImage?: { src: string; alt: string; width: number; height: number };
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
      { project: "How many yards of concrete for a pour", slug: "yards-of-concrete-calculator" },
      { project: "Counting blocks for a wall", slug: "concrete-block-calculator" },
      { project: "Bricks and mortar for a brick wall or veneer", slug: "brick-calculator" },
      { project: "Full block wall with mortar, grout and rebar", slug: "block-wall-calculator" },
      { project: "How much a load of block weighs", slug: "concrete-block-weight" },
      { project: "Looking up block sizes and dimensions", slug: "cmu-block-sizes" },
      { project: "Concrete for strip, pad or pier footings", slug: "concrete-footing-calculator" },
      { project: "Filling block cores with concrete or grout", slug: "cinder-block-fill-calculator" },
      { project: "Landscape retaining wall blocks", slug: "retaining-wall-calculator" },
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
      { project: "Filling a hole or raising a low spot with fill dirt", slug: "fill-dirt-calculator" },
      { project: "Mulch for beds, borders and tree rings", slug: "mulch-calculator" },
      { project: "Mulch, rock, decomposed granite or compost", slug: "landscape-materials-calculator" },
      { project: "Decorative rock for beds and borders (river, lava, pebbles)", slug: "landscape-rock-calculator" },
      { project: "Pavers for a patio or walkway, with base and sand", slug: "paver-calculator" },
      { project: "Gravel base and bedding sand under pavers", slug: "paver-base-calculator" },
      { project: "Dry-stacked block retaining wall", slug: "retaining-wall-calculator" },
      { project: "Gravel for a driveway, path or patio", slug: "gravel-calculator" },
      { project: "Sand for a sandbox, paver base or fill", slug: "sand-calculator" },
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
    notCovered: "It assumes a flat, even area. Sloped ground, low spots and compaction all use more material, so measure depth in a few places and keep some waste. For odd shapes, split the area into rectangles, circles and triangles and add them up.",
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
      "yards-of-concrete-calculator",
      "gravel-calculator",
      "fill-dirt-calculator",
      "sand-calculator",
      "topsoil-calculator",
      "mulch-calculator",
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
        "mortar bags ≈ ceil(blocks ÷ 12)",
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
    notCovered: "It assumes standard 8 × 16 inch block faces with ⅜-inch mortar joints. It doesn't count special corner, pilaster or bond-beam blocks, and it doesn't size your footing. Use the Block Wall Calculator for caps, grout and rebar.",
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
        ["20 × 6 ft", 142, 12],
        ["30 × 8 ft", 284, 24],
        ["40 × 8 ft", 378, 32],
      ],
      footnote: "Blocks include 5% waste; mortar at about 12 blocks per 80-lb bag.",
    },
    fromSikander: "When I ran 142 blocks through Quikrete's mortar calculator, it said 12 bags. My first version said 11, because I'd used a slightly higher blocks-per-bag figure. I switched to Quikrete's number, since running out of mortar halfway up a wall is worse than having a bag left over.",
    tips: [
      "Order about 5% extra. Some blocks always break, and you'll cut a few at corners and openings.",
      "A standard CMU weighs about 30–38 lb, and lightweight blocks are lighter. Get a helper if you can; lifting a few hundred of them adds up fast.",
      "One 80-lb bag of mortar mix lays about 12 standard blocks. Grab one spare bag so you don't run out mid-wall.",
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
        a: "Plan on about one 80-lb bag of mortar mix for every 12 standard blocks, laid with a ⅜-inch joint. So 142 blocks needs about 12 bags. Mix small batches so the mortar doesn't set before you use it.",
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
        a: "About 9 bags of 80-lb mortar mix. One bag lays roughly 12 blocks, and 100 ÷ 12 ≈ 8.3, so round up to 9. It's worth buying one spare bag so you don't run short halfway through a course.",
      },
    ],
    sources: ["CMU nominal-face geometry (144 ÷ 128 = 1.125)", "Quikrete mortar coverage"],
    related: [
      "block-wall-calculator",
      "retaining-wall-calculator",
      "brick-calculator",
      "cinder-block-fill-calculator",
      "concrete-block-weight",
      "cmu-block-sizes",
      "yards-of-concrete-calculator",
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
      "A 10 × 10 ft concrete slab at 4 inches thick costs about $220 in concrete alone, or roughly $650 installed with labor. That's about $2.17 per square foot for materials and $6 to $12 per square foot for a finished slab. Enter your size below for a full breakdown.",
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
    notCovered: "Prices are 2026 national averages, not a quote. It doesn't include permits, removing an old slab, major site prep, a pump truck or decorative finishes. Get local bids before you budget the job.",
    tables: [
      {
        title: "Concrete cost per square foot (2026)",
        intro:
          "Ready-mix concrete alone costs about $2 to $3.30 per square foot, depending on thickness. A finished slab with labor usually runs about $6 to $12 per square foot. Decorative finishes like stamping cost more.",
        columns: [
          { label: "Thickness" },
          { label: "No waste", num: true },
          { label: "With 10% waste", num: true },
        ],
        rows: [
          ['4 in', "$1.98", "$2.17"],
          ['5 in', "$2.47", "$2.72"],
          ['6 in', "$2.96", "$3.26"],
        ],
        footnote: "Concrete only, at $160 per cubic yard. Formula: thickness ÷ 12 ÷ 27 × price per yard.",
      },
      {
        title: "Installed cost per square foot by project",
        columns: [
          { label: "Project" },
          { label: "Typical installed cost per sq ft" },
        ],
        rows: [
          ["Basic patio or walkway (4 in, broom finish)", "$4 to $12"],
          ["Driveway (4 to 6 in, with base)", "$6 to $15"],
          ["Garage floor (4 to 6 in)", "$6 to $12"],
          ["Stamped or colored concrete", "$8 to $19"],
        ],
        footnote: "Ranges are 2026 national averages from HomeGuide. Local prices vary a lot, so get two or three quotes.",
      },
      {
        title: "How much does a concrete slab cost by size?",
        columns: [
          { label: "Slab size" },
          { label: "Area", num: true },
          { label: "Concrete (cu yd, with waste)", num: true },
          { label: "Concrete cost", num: true },
          { label: "Installed estimate", num: true },
        ],
        rows: [
          ["10 × 10 ft", "100 sq ft", "1.36", "$217", "$652"],
          ["12 × 12 ft", "144 sq ft", "1.96", "$313", "$939"],
          ["16 × 16 ft", "256 sq ft", "3.48", "$556", "$1,670"],
          ["20 × 20 ft", "400 sq ft", "5.43", "$869", "$2,609"],
          ["24 × 24 ft", "576 sq ft", "7.82", "$1,252", "$3,757"],
          ["30 × 30 ft", "900 sq ft", "12.22", "$1,956", "$5,871"],
        ],
        footnote: "Concrete at 4 inches, 10% waste and $160/yd. The installed estimate adds labor ($4/sq ft) and welded wire mesh ($0.35/sq ft); it excludes a gravel base, site prep and decorative finishes. Get local quotes.",
      },
    ],
    commonSizes: {
      title: "Common slabs: 80-lb bags and 6-inch volume",
      columns: [{ label: "Slab size" }, { label: '80-lb bags @ 4"', num: true }, { label: 'Cu yd @ 6"', num: true }],
      rows: [
        ["10 × 10 ft", 56, "1.85"],
        ["12 × 12 ft", 80, "2.67"],
        ["16 × 16 ft", 143, "4.74"],
        ["20 × 20 ft", 223, "7.41"],
        ["24 × 24 ft", 320, "10.67"],
        ["30 × 30 ft", 500, "16.67"],
      ],
      footnote: "Bags shown for 4 inches (80-lb ≈ 0.60 cu ft). Above ~1 cu yd, ready-mix is cheaper and faster than bags.",
    },
    fromSikander: "I checked this calculator against Quikrete's own concrete calculator. For a 100 sq ft slab at 4 inches, both say 56 bags of 80-lb mix. Quikrete's number has no waste built in, so I'd still add the 10% this page uses.",
    tips: [
      "Add about 10% for waste. Some concrete always spills, and the ground under a slab is never perfectly even.",
      "Bags make sense for small jobs under about 1 cubic yard. Past that, ready-mix delivery is usually cheaper and saves your back.",
      "Ask the ready-mix plant about its short-load fee. Orders under about 3–4 cubic yards often cost extra per yard.",
      "4 inches is the normal thickness for patios and walkways. Driveways and garage floors are usually 5–6 inches. Check your local code before you pour.",
    ],
    faqs: [
      {
        q: "How much does a 20×20 concrete slab cost?",
        a: "A 20 × 20 slab at 4 inches takes about 4.94 cubic yards, or 5.43 with 10% waste. The concrete alone is about $869. With labor and wire mesh, our installed estimate is about $2,609, and finished prices usually run about $2,400 to $4,800, depending on where you live and the finish.",
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
        a: "A 30 × 30 slab at 4 inches needs about 11.1 cubic yards, or 12.2 with 10% waste. The concrete alone costs about $1,956. Our installed estimate is about $5,871, and finished prices usually run about $5,400 to $10,800, depending on your area and the finish you pick.",
      },
      {
        q: "How much does concrete cost per square foot?",
        a: "About $2 to $3.30 per square foot for the concrete alone, depending on whether the slab is 4, 5 or 6 inches thick. A finished slab with labor usually costs about $6 to $12 per square foot.",
      },
      {
        q: "Is it cheaper to pour concrete yourself?",
        a: "Usually, if the slab is small. Doing it yourself saves the labor, which is often more than half the installed price. Past about 100 square feet, or for a driveway, most people hire a crew because the pour and finishing have to happen fast.",
      },
    ],
    sources: ["2026 installed cost guide (HomeGuide)", "Rebar and mesh prices (HomeGuide)", "Quikrete/Sakrete bag yields"],
    related: [
      "yards-of-concrete-calculator",
      "paver-calculator",
      "concrete-footing-calculator",
      "cubic-yard-calculator",
      "concrete-block-calculator",
      "block-wall-calculator",
      "square-yard-calculator",
    ],
    lastUpdated: "2026-10-14",
    imageAlt: "Concrete slab cost diagram: slab thickness, gravel base and rebar, plus the length and width the calculator uses.",
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
    notCovered: "It doesn't know your existing grade or how much your soil will settle beyond the waste percentage. It also doesn't work out compost or amendment ratios for raised beds.",
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
      "fill-dirt-calculator",
      "cubic-yard-calculator",
      "sand-calculator",
      "mulch-calculator",
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
    notCovered: "It covers the gravel layer only. It doesn't add the compacted base, landscape fabric or edging, and it assumes the gravel isn't compacted.",
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
    fromSikander: "I compared the bag counts with Quikrete's sand and stone calculator. For 100 sq ft, it says 34, 51 and 67 bags of 50-lb stone at 2, 3 and 4 inches. This page gives 34, 50 and 67, the same apart from one bag of rounding.",
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
      "gravel-calculator",
      "landscape-rock-calculator",
      "sand-calculator",
      "cubic-yard-calculator",
      "mulch-calculator",
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
      "1 square yard = 9 square feet = 0.836 square meters. A 12 × 12 ft room is 144 sq ft, which works out to 16 square yards. Add each room below, include a little extra for carpet waste, and you'll get the total square yards and cost.",
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
    notCovered: "It adds up area and waste. It doesn't plan seam placement, pattern matching or how pieces fit on a 12- or 15-foot roll, so ask your installer for the final cut list.",
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
      "Carpet is usually priced by the square yard, while tile and laminate are priced by the square foot. Convert before you compare prices.",
      "Add about 10% for carpet waste, and more if the layout is diagonal or the carpet has a pattern.",
      "Measure every room on its own and add them up. Averaging rooms together is how people end up short.",
      "Round up to the nearest half or full square yard when you order from a roll.",
    ],
    faqs: [
      {
        q: "How many square feet are in a square yard?",
        a: "9. A yard is 3 feet, and 3 × 3 = 9. To turn square feet into square yards, divide by 9.",
      },
      {
        q: "How do I calculate square yards for carpet?",
        a: "Measure each room's length and width in feet and multiply them to get square feet. Add all the rooms together, then divide by 9. Add about 10% for waste and seams before you order.",
      },
      {
        q: "What is the difference between square yards and cubic yards?",
        a: "Square yards measure a flat area, like the floor you're covering with carpet. Cubic yards measure volume, meaning material with depth, like concrete or soil. You can't swap one for the other.",
      },
      {
        q: "How many square yards is a 12×15 room?",
        a: "A 12 × 15 room is 180 square feet, which is 20 square yards (180 ÷ 9). Add a waste allowance when you order carpet or turf.",
      },
      {
        q: "How many square yards is a 10x12 room?",
        a: "A 10 × 12 room is 120 square feet, or 13.3 square yards (120 ÷ 9). With about 10% extra for carpet waste, order roughly 14.7 square yards.",
      },
      {
        q: "How do I convert square meters to square yards?",
        a: "Multiply square meters by 1.196 to get square yards, since 1 m² = 1.196 sq yd. To go back, divide square yards by 1.196. One square yard is about 0.836 square meters.",
      },
      {
        q: "How much carpet do I need for a 12x12 room?",
        a: "A 12 × 12 room is 144 square feet, or 16 square yards. With the usual 10% for waste, order about 17.6 square yards. Carpet comes in 12- and 15-foot-wide rolls, so a 12-foot room often cuts with very little waste.",
      },
    ],
    sources: ["standard unit conversions (1 sq yd = 9 sq ft)"],
    related: [
      "cubic-yard-calculator",
      "concrete-slab-cost-calculator",
      "landscape-materials-calculator",
    ],
    lastUpdated: "2026-10-09",
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
      "One yard of mulch covers about 108 sq ft at 3 inches deep. One yard of rock or soil covers about 81 sq ft at 4 inches. Pick your material below (mulch, rock, decomposed granite, compost, topsoil, sand or gravel) and you'll get cubic yards, tons and bags.",
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
    notCovered: "Weights use typical dry densities. Real products vary by supplier and moisture, so check the tonnage on your quote before you order a truckload.",
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
      "Spread mulch 2–3 inches deep. That's enough to block weeds and hold moisture, and going deeper can smother plant roots.",
      "Above about 1 cubic yard, buying in bulk is usually much cheaper than bags.",
      "Bark mulch breaks down, so plan to top it up every year. Rock and decomposed granite last for years.",
      "River rock and gravel are heavy. On big orders, confirm the tonnage and make sure the delivery truck can reach your spot.",
    ],
    faqs: [
      {
        q: "How much does a yard of mulch cover?",
        a: "About 108 sq ft at 3 inches deep, or 162 sq ft at 2 inches. Keep it 2–3 inches thick if you want it to stop weeds and hold moisture.",
      },
      {
        q: "How deep should mulch be?",
        a: "2 to 3 inches. That blocks light to weeds and slows evaporation without smothering the roots. Keep the mulch a couple of inches back from tree trunks and plant stems.",
      },
      {
        q: "How many bags of mulch are in a yard?",
        a: "13.5 bags of 2-cubic-foot mulch (27 ÷ 2). Round up to 14 to match one bulk yard. Once you need more than a yard or two, bulk delivery is usually cheaper.",
      },
      {
        q: "Is it cheaper to buy mulch in bulk?",
        a: "Almost always, once you need more than about one cubic yard. Bulk mulch usually costs a fraction of the same amount in bags. Bags still make sense for small beds and are easier to haul home.",
      },
      {
        q: "How much does river rock weigh per yard?",
        a: "About 1.35 tons per cubic yard, or roughly 2,700 lb. Stone size and moisture change the weight, so ask your supplier for their exact number.",
      },
      {
        q: "How much mulch do I need for 200 square feet?",
        a: "At the usual 3-inch depth, 200 square feet needs about 1.85 cubic yards of mulch. That's close to two bulk yards, or about 25 bags of 2 cubic feet. At 2 inches, it's about 1.23 cubic yards.",
      },
      {
        q: "How many bags of river rock equal a cubic yard?",
        a: "About 54 bags of 0.5 cubic feet (27 ÷ 0.5). River rock weighs around 1.35 tons per cubic yard, so one yard is over 2,700 lb. For large areas, bulk delivery is usually cheaper.",
      },
    ],
    sources: ["landscape-supply density tables", "USDA references"],
    related: [
      "landscape-rock-calculator",
      "paver-calculator",
      "gravel-calculator",
      "sand-calculator",
      "mulch-calculator",
      "cubic-yard-calculator",
      "topsoil-calculator",
      "pea-gravel-calculator",
      "rip-rap-calculator",
    ],
    lastUpdated: "2026-10-09",
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
      "In 2026, a typical lawn mowing visit in the US costs about $40–$55 for a quarter-acre lot and $90 or more for a full acre. Homeowners can check a fair price by lawn size, and pros can price a job from mower width, speed and hourly rate. Both tabs are below.",
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
    notCovered: "Prices are national averages. It doesn't know your local market, taxes, insurance or how many obstacles a yard has, and steep or rough lawns take longer than the math shows.",
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
      "Weekly mowing usually costs less per visit than one-off cuts, because short grass is quicker to cut.",
      "Pros: count your drive time and fuel. A small lawn that's far away can lose you money.",
      "Charge more for overgrown or first-of-the-season cuts. They take a lot longer.",
      "A clear estimate lists mowing, edging, trimming and cleanup separately, so customers know exactly what they're paying for.",
    ],
    faqs: [
      {
        q: "How much should I charge to mow an acre?",
        a: "Most pros charge about $50–$90 for an acre of open, flat lawn, and more if there are slopes or lots of obstacles. Base it on your time. An acre takes roughly 0.5–1 hour depending on your mower, so multiply that by your hourly rate and add overhead.",
      },
      {
        q: "How do I calculate lawn mowing prices?",
        a: "Work out the mowing time from your acres per hour, then add time for trimming and driving. Multiply by your hourly rate and add a bit for fuel and wear on the equipment. The pro tab above does the math for you.",
      },
      {
        q: "How long does it take to mow an acre?",
        a: "With a 21-inch push mower, about 1.5–2 hours. With a 42–60 inch riding or zero-turn mower, roughly 30–60 minutes. Your speed and the number of obstacles make a big difference.",
      },
      {
        q: "How much does weekly lawn mowing cost?",
        a: "For an average suburban lot, weekly service usually runs $40–$60 per visit in 2026. Bigger lots cost more. Many companies charge a little less for weekly than for every-other-week service, since regular cuts go faster.",
      },
      {
        q: "What should a lawn care estimate include?",
        a: "A good estimate lists each service (mowing, edging, string trimming and blowing off hard surfaces), the price per visit and how often they'll come. It should also mention extras like bagging or seasonal cleanups. Always get it in writing.",
      },
      {
        q: "How much should I charge to mow a half-acre lawn?",
        a: "Most pros charge about $55–$75 for a half-acre of open lawn in 2026. To price it from your time: a half-acre takes roughly 20–35 minutes of mowing with a 42–48 inch deck. Add trimming and travel, then multiply by your hourly rate and overhead.",
      },
      {
        q: "How do you price lawn mowing per 1,000 square feet?",
        a: "Divide the job price by the lawn size in thousands of square feet. For regular mowing, many services land around $4–$8 per 1,000 sq ft, with a minimum charge for small lots. The pro tab shows your price per 1,000 sq ft automatically.",
      },
    ],
    sources: ["2026 US lawn-care cost guides", "ASABE field-efficiency ranges"],
    related: ["acres-per-hour-calculator", "topsoil-calculator", "landscape-materials-calculator"],
    lastUpdated: "2026-10-09",
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
      "A 30 ft × 4 ft block wall takes 6 courses and about 142 standard blocks with 5% waste, plus about 12 bags of mortar. This calculator also works out cap blocks, core-fill grout, rebar and your total material cost. Enter your wall below.",
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
    notCovered: "This is a materials estimate, not a structural design. It doesn't size footings or rebar to code. Retaining walls over about 3–4 feet usually need an engineer and a permit.",
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
          ["30 × 4 ft", 6, 142, 12],
          ["40 × 6 ft", 9, 284, 24],
          ["50 × 6 ft", 9, 355, 30],
        ],
        footnote: "Add cap blocks (one per 16 inches of length) and grout/rebar if reinforced.",
      },
    ],
    commonSizes: {
      title: "Common walls: blocks, caps & mortar (8-inch, incl. 5% waste)",
      columns: [{ label: "Wall (L × H)" }, { label: "Blocks", num: true }, { label: "Caps", num: true }, { label: "Mortar bags", num: true }],
      rows: [
        ["20 × 4 ft", 95, 15, 8],
        ["30 × 4 ft", 142, 23, 12],
        ["40 × 6 ft", 284, 30, 24],
        ["50 × 6 ft", 355, 38, 30],
      ],
      footnote: "Caps at one per 16 inches of length. Add grout and rebar if the wall is reinforced.",
    },
    fromSikander: "The mortar count here matches Quikrete's own calculator: about 12 bags of 80-lb mix for 142 standard blocks. I still buy one spare bag, because the first few batches always go slower than you expect.",
    tips: [
      "A block wall needs a proper concrete footing below the frost line. Budget for it separately.",
      "Reinforced walls need vertical rebar in grouted cores, spaced the way your local code requires.",
      "Cap blocks finish the top course and shed water. Plan on one for every 16 inches of wall length.",
      "Buy a spare bag of mortar and a few extra blocks. Running out halfway through a course costs you time and money.",
    ],
    faqs: [
      {
        q: "How much does a block wall cost per square foot?",
        a: "Materials for a basic, unreinforced CMU wall often run $6–$12 per square foot of wall face. Built by a pro with footing, grout, rebar and labor, it's typically $15–$30 or more per square foot. Reinforcement and fancy finishes push it higher.",
      },
      {
        q: "Do I need a footing for a block wall?",
        a: "Yes. Block walls sit on a poured concrete footing, usually about twice as wide as the wall and below your local frost line. Check the size and depth with your building department before you start digging.",
      },
      {
        q: "How tall can a block wall be without rebar?",
        a: "That depends on your local code, how thick the wall is, and whether it stands alone or holds back soil. Many places require reinforcement once a wall goes above a few feet. Don't guess on this one. Check your local code and permit rules.",
      },
      {
        q: "How much grout fills block cores?",
        a: "Filling every core in an 8-inch wall takes roughly 0.26 cubic feet of grout per square foot of wall. Filling every other core uses about half that. Six- and twelve-inch blocks are different, so use the calculator's numbers for those.",
      },
      {
        q: "How many courses are in a 4-foot wall?",
        a: "Six. Each course of standard block is 8 inches tall including the mortar joint, so 48 inches ÷ 8 = 6 courses.",
      },
      {
        q: "How many blocks do I need for a 50-foot wall?",
        a: "A 50-foot wall that's 4 feet tall covers 200 sq ft. That's about 225 blocks before waste, or 237 with 5% extra (200 × 1.125 × 1.05). At 3 feet tall, it's about 178 blocks. Add cap blocks at one per 16 inches of length.",
      },
      {
        q: "How much does it cost to build a 50-foot block wall?",
        a: "For a 50 ft × 4 ft unreinforced wall, materials (blocks, mortar and caps) often run $1,200–$2,400. Built by a pro with footing, grout, rebar and labor, expect roughly $6,000–$12,000, depending on height, reinforcement and where you live.",
      },
    ],
    sources: ["NCMA TEK grout-quantity tables", "Quikrete mortar coverage"],
    warning:
      "Retaining walls over about 3–4 feet usually need an engineer and a permit. Always check local codes.",
    related: [
      "retaining-wall-calculator",
      "concrete-block-calculator",
      "brick-calculator",
      "cinder-block-fill-calculator",
      "concrete-footing-calculator",
      "concrete-block-weight",
      "cmu-block-sizes",
      "concrete-slab-cost-calculator",
      "cubic-yard-calculator",
    ],
    lastUpdated: "2026-10-09",
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
      "Acres per hour = (working width in inches × speed in mph × efficiency) ÷ 99. A 60-inch deck at 6 mph and 80% efficiency covers about 2.91 acres an hour, so 5 acres takes roughly 1 hour 43 minutes. Enter your mower or equipment below.",
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
    notCovered: "It assumes a steady speed and a fixed efficiency. Hills, trees, tight turns and wet grass all slow you down, so treat the result as a best case for open ground.",
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
      "Efficiency covers the time lost to overlap, turns and stops. For most mowing, 70–85% is realistic.",
      "Overlapping each pass by a few inches shrinks your real cutting width, and your acres per hour drop with it.",
      "Going faster doesn't always save time. If you scalp the grass or leave clumps, the cleanup eats up what you gained.",
      "When you plan a route, add travel and trimming time on top of the mowing hours.",
    ],
    faqs: [
      {
        q: "How many acres per hour does a zero-turn mow?",
        a: "A 60-inch zero-turn at 6 mph and about 80% efficiency covers roughly 2.9 acres an hour. A wider deck or higher speed raises that, but obstacles and trimming bring the real number down.",
      },
      {
        q: "How long does it take to mow 1 acre with a push mower?",
        a: "With a 21-inch push mower at walking speed (about 3 mph) and 75–80% efficiency, one acre takes roughly 1.5–2 hours. Hills and lots of trimming add to that.",
      },
      {
        q: "What is field efficiency?",
        a: "It's the share of your time spent actually cutting at full width, after you take out turns, overlap, refueling and stops. Mowing usually runs 70–85% efficient. It's never 100%.",
      },
      {
        q: "Where does the 99 (or 8.25) come from?",
        a: "It's a unit conversion. There are 5,280 feet in a mile and 43,560 square feet in an acre. Width in inches × mph × efficiency ÷ 99 gives you acres per hour. If you measure width in feet, divide by 8.25 instead.",
      },
      {
        q: "How many acres per hour can a 42-inch mower cut?",
        a: "About 1.0–1.4 acres an hour. At 4 mph and 80% efficiency, a 42-inch deck covers 1.36 acres per hour. Going faster raises it, while obstacles and trimming lower it. The formula is width (in) × mph × efficiency ÷ 99.",
      },
      {
        q: "How long does it take to mow 5 acres?",
        a: "Roughly 1.5–3.5 hours, depending on the mower. A 60-inch zero-turn at 6 mph (about 2.9 acres an hour) finishes 5 acres in around 1 hour 45 minutes. A 42-inch deck at 4 mph takes closer to 3.5 hours.",
      },
      {
        q: "What speed should I mow at?",
        a: "Most mowing happens at 3–5 mph. Speed up on open, even ground and slow down in thick or wet grass. Scalping and clumps take longer to clean up than the time you save by rushing.",
      },
    ],
    sources: ["ASABE D497 machinery management data"],
    related: ["lawn-mowing-cost-calculator", "topsoil-calculator", "square-yard-calculator"],
    lastUpdated: "2026-10-09",
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
      "Gutters should slope at least ¼ inch for every 10 feet toward a downspout. On a 40-foot run, that means a 1-inch total drop from the high end to the low end. Enter your run length and downspout layout below to get the exact start and end heights.",
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
    notCovered: "It uses common slope and downspout rules of thumb. It doesn't size gutters for your local rainfall intensity, and it isn't meant for flat or low-slope roof drainage design.",
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
      "A slope of ¼ inch per 10 feet keeps water moving without making the gutter look crooked.",
      "On runs longer than about 35–40 feet, put the high point in the middle and slope down to a downspout at each end.",
      "More slope isn't better. Too much looks off from the street, and in heavy rain the water can shoot right past the outlet.",
      "Add a downspout about every 30–40 feet, or size them by roof area if you get a lot of heavy rain.",
    ],
    faqs: [
      {
        q: "What is the correct slope for gutters?",
        a: "At least ¼ inch of drop for every 10 feet of gutter, sloping toward the downspout. Some installers go up to ½ inch per 10 feet so it drains faster. Either way, the gutter should always tilt toward its outlet.",
      },
      {
        q: "Can gutters have too much slope?",
        a: "Yes. Too much slope is easy to spot against the roofline, and in a downpour the water can rush right past the downspout opening. Stick to about ¼–½ inch per 10 feet unless the manufacturer says otherwise.",
      },
      {
        q: "How many downspouts do I need?",
        a: "A good rule is one downspout for every 30–40 feet of gutter. For big roofs or heavy rain, size them by roof area instead. A 2×3-inch downspout handles roughly 600 sq ft of roof, and a 3×4-inch about 1,200 sq ft.",
      },
      {
        q: "How do I measure gutter slope?",
        a: "Measure the length of the run, multiply by the slope, and mark the high and low ends on the fascia. For example, a 20-foot run at ¼ inch per 10 feet drops ½ inch from end to end. Snap a chalk line between the two marks and hang the gutter along it.",
      },
      {
        q: "Should long gutters slope both ways?",
        a: "Yes. On runs longer than about 35–40 feet, set the high point in the middle and slope down to a downspout at each end. That cuts the drop on each side in half and keeps the gutter looking close to level.",
      },
      {
        q: "How far apart should gutter downspouts be?",
        a: "No more than about 30–40 feet apart. Long runs drain best with a downspout at each end and the high point in the middle. If you live somewhere with heavy rain, add more and size them by roof area.",
      },
      {
        q: "What is the minimum slope for a gutter?",
        a: "A quarter inch of drop for every 10 feet of run. That's just enough to keep water moving toward the downspout, and it works out to a 1-inch drop over 40 feet. Keep it under about ½ inch per 10 feet so the gutter doesn't look crooked.",
      },
    ],
    sources: ["gutter manufacturer installation guides", "SMACNA downspout sizing"],
    related: ["square-yard-calculator", "concrete-slab-cost-calculator", "cubic-yard-calculator"],
    lastUpdated: "2026-10-09",
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
      "A 50 ft × 6 ft area covered 12 inches thick needs about 11.1 cubic yards of riprap. At 1.5 tons per cubic yard, that's roughly 16.7 tons. The layer is usually 1.5–2 times the stone's D50 size. Enter your measurements and stone class below.",
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
    notCovered: "This is a quantity estimate, not a hydraulic design. Stone size and thickness for streams, channels and shorelines should come from an engineer or your state DOT specification.",
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
      "Lay riprap over filter fabric or a gravel filter layer. Without it, the soil underneath washes out through the gaps.",
      "Make the layer at least 1.5 times as thick as the largest stone so the stones lock together.",
      "On a slope, dig the bottom edge (the toe) in below grade so the whole layer doesn't slide.",
      "Order about 10% extra. Angular stone leaves gaps, and no one places it perfectly even.",
    ],
    faqs: [
      {
        q: "How much area does a ton of riprap cover?",
        a: "At 12 inches thick and about 1.5 tons per cubic yard, one ton covers roughly 18 square feet. A thinner layer covers more. At 6 inches, it's about 36 square feet per ton.",
      },
      {
        q: "What size riprap do I need?",
        a: "It depends on how fast the water moves and how steep the slope is. Light classes (4–6 inch stone) work for gentle ditches and low banks, and heavier classes hold up against faster water. For streams, channels or shorelines, follow an engineer's or your state DOT's specification.",
      },
      {
        q: "How thick should riprap be?",
        a: "At least 1.5 to 2 times the D50 stone size, and never thinner than your biggest stone. A typical light riprap layer is about 12 inches. Heavier classes run 18 inches or more.",
      },
      {
        q: "Do I need filter fabric under riprap?",
        a: "Almost always. Filter fabric or a gravel filter layer keeps the soil underneath from washing out through the gaps between the stones. If that soil goes, the riprap sinks. Overlap the seams generously.",
      },
      {
        q: "How much does riprap cost per ton?",
        a: "In 2026, riprap usually runs about $45–$100 per ton delivered. Where you land depends on the stone class, how far the quarry is and how much you buy. Get a local quote, since the trucking distance drives a lot of the price.",
      },
      {
        q: "How many tons of riprap do I need per square foot?",
        a: "At 12 inches thick and about 1.5 tons per cubic yard, you need roughly 0.056 tons, or about 110 lb, per square foot. So 100 square feet at 12 inches comes to about 5.6 tons. Thicker layers need proportionally more.",
      },
      {
        q: "How much riprap do I need for a 100-foot shoreline?",
        a: "For a 100-foot shoreline 6 feet wide (600 sq ft) at 18 inches thick, you need about 33 cubic yards, or 50 tons, at 1.5 tons per cubic yard. Check the thickness and stone class with your engineer or permit office before you order.",
      },
    ],
    sources: ["state DOT riprap gradation tables", "USACE/FHWA riprap design guidance"],
    warning:
      "For shoreline or channel work, follow your engineer or local permit requirements.",
    related: ["gravel-calculator", "cubic-yard-calculator", "pea-gravel-calculator", "landscape-materials-calculator"],
    lastUpdated: "2026-10-09",
    imageAlt: "Rip rap calculator diagram of a stone layer on a slope with thickness labelled",
  },

  /* ---------------------------------------------------------------- 13 */
  {
    slug: "yards-of-concrete-calculator",
    category: "concrete",
    title: "Yards of Concrete Calculator – How Many Yards Do I Need?",
    metaDescription:
      "Find how many cubic yards of concrete you need for a slab, footing or round column. Includes waste, 80-lb bag count and cost at your price per yard.",
    h1: "Yards of Concrete Calculator",
    primaryKeyword: "how many yards of concrete do i need",
    secondaryKeywords: [
      "yard of concrete",
      "how much is a yard of concrete",
      "concrete yardage",
      "concrete calculator yards",
      "how to calculate yards of concrete",
    ],
    cardDescription: "How many cubic yards of concrete for a slab, strip or column.",
    shortAnswer:
      "One cubic yard of concrete is 27 cubic feet. That fills a 10 × 10 ft slab about 3¼ inches thick, or about 81 sq ft at 4 inches. Pick your shape below, enter the size, and you'll get the cubic yards, the bag count and the cost.",
    howTo: [
      "Pick the shape: slab, wall or footing strip, or round column.",
      "Enter the size in feet and inches. Thickness is in inches.",
      "Leave waste at 10% unless you have a reason to change it.",
      "Add your local price per yard if you have a quote.",
      "Read the cubic yards. Round up when you order.",
    ],
    formula: {
      plain: [
        "slab cu ft = L × W × (thickness ÷ 12)",
        "strip cu ft = L × W × D   (all in feet)",
        "column cu ft = π × (diameter ÷ 2)² × height × quantity",
        "cubic yards = cu ft ÷ 27",
        "bags = ceil(cu ft × (1 + waste%) ÷ yield)   (80 lb = 0.60, 60 lb = 0.45)",
      ],
      example: [
        "A 12 × 12 ft patio, 4 inches thick:",
        "cu ft = 144 × (4 ÷ 12) = 48",
        "cubic yards = 48 ÷ 27 = 1.78",
        "+ 10% waste = 1.96 cu yd",
      ],
      example2: [
        "Four 12-inch round columns, 4 ft tall:",
        "cu ft = π × 0.5² × 4 × 4 = 12.57",
        "cubic yards = 12.57 ÷ 27 = 0.47",
        "+ 10% waste = 0.51 cu yd",
      ],
    },
    notCovered:
      "It gives the volume of concrete for slabs, footings and round columns. It doesn't allow for an uneven subgrade, forms that bow, or concrete left in the truck or pump line, so order the extra it suggests. Ask your supplier about minimum orders and short-load fees.",
    tables: [
      {
        title: "Cubic yards and 80-lb bags for common slabs",
        columns: [
          { label: "Slab size" },
          { label: 'Cu yd @ 4"', num: true },
          { label: 'Cu yd @ 6"', num: true },
          { label: '80-lb bags @ 4"', num: true },
          { label: '80-lb bags @ 6"', num: true },
        ],
        rows: [
          ["10 × 10 ft", "1.23", "1.85", 56, 84],
          ["12 × 12 ft", "1.78", "2.67", 80, 120],
          ["16 × 16 ft", "3.16", "4.74", 143, 214],
          ["20 × 20 ft", "4.94", "7.41", 223, 334],
          ["24 × 24 ft", "7.11", "10.67", 320, 480],
          ["30 × 30 ft", "11.11", "16.67", 500, 750],
        ],
        footnote: "Volumes and bags exclude waste; add about 10% when you order. An 80-lb bag yields about 0.60 cu ft.",
      },
    ],
    tips: [
      "Always round your order up. Running out of concrete halfway through a pour leaves a cold joint, and that's a weak spot.",
      "Ready-mix plants usually sell in quarter- or half-yard steps, so round up to the next step.",
      "Small orders often carry a short-load fee. If you need under about 1 cubic yard, bags can make more sense.",
      "Measure thickness in a few spots. If your base dips an inch, a big slab can eat a lot more concrete than you planned.",
    ],
    faqs: [
      {
        q: "How many yards of concrete do I need for a 10x10 slab?",
        a: "About 1.23 cubic yards at 4 inches thick, or 1.36 with 10% extra. At 6 inches thick it's about 1.85 cubic yards.",
      },
      {
        q: "How much is a yard of concrete?",
        a: "In 2026 a cubic yard of ready-mix usually costs around $145–$195 delivered, depending on your area and the mix strength. Small loads cost more per yard because of short-load fees, so get a local quote.",
      },
      {
        q: "How many square feet does a yard of concrete cover?",
        a: "It depends on thickness. One yard covers about 81 sq ft at 4 inches, 65 sq ft at 5 inches and 54 sq ft at 6 inches. Divide 324 by the thickness in inches.",
      },
      {
        q: "How do I calculate yards of concrete?",
        a: "Multiply length × width × thickness, all in feet, to get cubic feet. Then divide by 27. A 12 × 12 slab at 4 inches is 12 × 12 × 0.333 = 48 cubic feet, which is 1.78 yards.",
      },
      {
        q: "How many 80-lb bags make a yard of concrete?",
        a: "About 45. Each 80-lb bag makes about 0.60 cubic feet, and a yard is 27 cubic feet.",
      },
      {
        q: "Should I order extra concrete?",
        a: "Yes, about 10%. Uneven ground, form bulges and spills all use more than the math says. Being short is a much bigger problem than having a little left over.",
      },
      {
        q: "What is the minimum amount of concrete I can order?",
        a: "Many plants deliver as little as 1 cubic yard, but loads under about 3–4 yards often carry a short-load fee. Ask about it when you call.",
      },
    ],
    sources: ["Quikrete 80-lb concrete mix yield", "2026 ready-mix cost guide"],
    fromSikander: "I checked this page against Quikrete's own concrete calculator. For a 12 × 12 slab, both say 80 bags of 80-lb mix at 4 inches and 120 at 6 inches. Quikrete's numbers leave out waste, so this page adds 10% on top by default.",
    related: [
      "concrete-footing-calculator",
      "concrete-slab-cost-calculator",
      "cubic-yard-calculator",
      "concrete-block-calculator",
      "block-wall-calculator",
    ],
    lastUpdated: "2026-10-10",
    imageAlt: "Yards of concrete diagram: slab, strip footing and round column with the dimensions the calculator uses.",
  },

  /* ---------------------------------------------------------------- 14 */
  {
    slug: "concrete-block-weight",
    category: "concrete",
    title: "Concrete Block Weight Chart – CMU & Cinder Block Weights",
    metaDescription:
      "How much does a concrete block weigh? Weights for 4, 6, 8, 10 and 12 inch CMU, normal and lightweight, plus a calculator for total load and pallet weight.",
    h1: "Concrete Block Weight Chart & Calculator",
    primaryKeyword: "how much does a concrete block weigh",
    secondaryKeywords: [
      "cement block weight",
      "how much does a cmu block weigh",
      "how much does a cinder block weigh",
      "8x8x16 concrete block weight",
      "cmu weight",
    ],
    cardDescription: "Weights for 4, 6, 8, 10 and 12 inch CMU, plus total load and pallet weight.",
    shortAnswer:
      "A standard 8×8×16 concrete block weighs about 38 lb in normal-weight concrete and about 28 lb as a lightweight block. A pallet of 90 standard blocks is around 3,400 lb. Use the chart for other sizes, or the calculator to get the total weight of your order.",
    howTo: [
      "Pick your block size and whether it's normal-weight or lightweight.",
      "Enter how many blocks you have.",
      "Read the total weight in pounds and tons.",
      "Optional: set blocks per pallet to see the pallet weight.",
      "Optional: enter your truck's payload to see blocks per trip.",
    ],
    formula: {
      plain: [
        "total weight = number of blocks × weight per block",
        "tons = total lb ÷ 2,000",
        "pallet weight = blocks per pallet × weight per block",
        "blocks per trip = floor(payload ÷ weight per block)",
      ],
      example: [
        "142 standard 8×8×16 blocks at 38 lb each:",
        "142 × 38 = 5,396 lb",
        "5,396 ÷ 2,000 = 2.70 tons",
      ],
      example2: [
        "One pallet of 90 standard blocks at 38 lb:",
        "90 × 38 = 3,420 lb",
        "half-ton pickup, 1,500 lb payload: floor(1,500 ÷ 38) = 39 blocks per trip",
      ],
    },
    notCovered:
      "Weights are typical ranges for dry blocks. Real weight depends on the aggregate, the plant and how wet the blocks are, so check the supplier's spec sheet before you plan a load for a truck, trailer or floor.",
    tables: [
      {
        title: "Concrete block weight chart (typical, dry)",
        columns: [
          { label: "Block (nominal)" },
          { label: "Normal weight" },
          { label: "Lightweight" },
        ],
        rows: [
          ["4 × 8 × 16", "about 26 lb", "about 19 lb"],
          ["6 × 8 × 16", "about 32 lb", "about 24 lb"],
          ["8 × 8 × 16", "about 38 lb", "about 28 lb"],
          ["10 × 8 × 16", "about 45 lb", "about 33 lb"],
          ["12 × 8 × 16", "about 52 lb", "about 38 lb"],
          ["8 × 8 × 8 half block", "about 19 lb", "about 14 lb"],
          ["8 × 8 × 16 solid", "about 60–70 lb", "n/a"],
        ],
        footnote:
          "Typical dry weights. Manufacturer and NCMA figures vary by a few pounds: an 8-inch normal-weight block runs about 34–42 lb and a lightweight one about 25–30 lb. Checked against Terrehill, the ESCSI/NCMA unit-weight study and ASTM C90 density classes.",
      },
    ],
    tips: [
      "Ask your yard whether their blocks are normal-weight or lightweight. The difference is about 10 lb a block, and on a big wall that adds up to tons.",
      "A half-ton pickup can usually carry only about 35–40 standard blocks. Check your payload sticker before loading a pallet's worth.",
      "Wet blocks weigh more. Blocks left in the rain soak up water, so weigh-limited trips get shorter.",
      "Lift with your legs, and get help for 12-inch and solid blocks. They're heavier than they look.",
    ],
    faqs: [
      {
        q: "How much does an 8x8x16 concrete block weigh?",
        a: "About 38 lb for a normal-weight block and about 28 lb for a lightweight one. Exact weight varies by manufacturer and mix, so check the spec sheet if it matters.",
      },
      {
        q: "How much does a cinder block weigh?",
        a: "Most blocks sold as \"cinder blocks\" today are regular concrete blocks, so a standard 8×8×16 weighs about 28–38 lb. True old-style cinder blocks were lighter, closer to the lightweight numbers.",
      },
      {
        q: "How much does a pallet of concrete blocks weigh?",
        a: "A pallet of 90 standard 8-inch blocks weighs roughly 3,400 lb, plus about 40–50 lb for the pallet itself. Pallets with more or bigger blocks can top 4,000 lb.",
      },
      {
        q: "How many concrete blocks can a pickup truck carry?",
        a: "A half-ton pickup with about 1,500 lb of payload can carry roughly 39 standard 38-lb blocks. A three-quarter-ton truck can carry more. Always go by your truck's payload rating, not by how much fits in the bed.",
      },
      {
        q: "What is the difference between normal-weight and lightweight block?",
        a: "Lightweight blocks use lighter aggregate like expanded shale or slag, so they're about 25–30% lighter and easier to lay. Normal-weight blocks are denser and a little stronger. For most garden and yard walls, either works.",
      },
      {
        q: "How much does a 12-inch concrete block weigh?",
        a: "About 52 lb for a normal-weight 12×8×16 block and about 38 lb for a lightweight one.",
      },
      {
        q: "How much does a solid concrete block weigh?",
        a: "A solid 8×8×16 block weighs roughly 60–70 lb, nearly twice a hollow one. Solid blocks are used for caps, footings and places that need extra strength.",
      },
    ],
    sources: ["Terrehill per-unit block weights", "ESCSI/NCMA unit-weight study", "ASTM C90 density classes"],
    related: [
      "cmu-block-sizes",
      "concrete-block-calculator",
      "brick-calculator",
      "block-wall-calculator",
      "yards-of-concrete-calculator",
    ],
    lastUpdated: "2026-10-10",
    imageAlt: "Concrete block weight: a standard 8×8×16 block and a 90-block pallet.",
  },

  /* ---------------------------------------------------------------- 15 */
  {
    slug: "cmu-block-sizes",
    category: "concrete",
    title: "CMU Block Sizes & Dimensions – Nominal vs Actual Chart",
    metaDescription:
      "Standard CMU block sizes with nominal and actual dimensions, half blocks and half-high units, plus a course converter for wall height and length.",
    h1: "CMU Block Sizes and Dimensions",
    primaryKeyword: "cmu block dimensions",
    secondaryKeywords: [
      "standard cmu sizes",
      "concrete masonry block dimensions",
      "concrete block height",
      "8 cmu block dimensions",
      "what is the size of a cinder block",
    ],
    cardDescription: "Nominal vs actual CMU sizes, half and half-high units, plus a course converter.",
    shortAnswer:
      "A standard CMU is 8 × 8 × 16 inches nominal, but the block itself measures 7⅝ × 7⅝ × 15⅝ inches. The missing ⅜ inch is the mortar joint, so every laid block takes up exactly 8 × 16 inches of wall. The chart below covers 4, 6, 8, 10 and 12-inch blocks, half blocks and half-high units.",
    howTo: [
      "Read the chart for the nominal and actual size of each block.",
      "For a wall, enter the height in feet and inches.",
      "Enter the wall length to get blocks per course.",
      "Read the course count and the built height.",
      "Plan heights in 8-inch steps and lengths in 16-inch steps to cut fewer blocks.",
    ],
    formula: {
      plain: [
        "actual size = nominal size − ⅜ inch (the mortar joint)",
        "courses = ceil(wall height in inches ÷ 8)",
        "built height = courses × 8 inches",
        "blocks per course = ceil(wall length in inches ÷ 16)",
      ],
      example: [
        "A 6 ft wall:",
        "72 ÷ 8 = 9 courses",
        "built height = 9 × 8 = 72 in, exactly 6 ft",
      ],
      example2: [
        "A 52-inch wall:",
        "52 ÷ 8 = 6.5, round up to 7 courses (56 in)",
        "or 6 courses plus one half-high row (52 in)",
      ],
    },
    notCovered:
      "These are standard US nominal and actual sizes. Local plants also make special shapes, split-face and lightweight units that can differ, so confirm the exact size with your supplier.",
    tables: [
      {
        title: "Standard CMU sizes: nominal vs actual",
        columns: [
          { label: "Nominal (W × H × L)" },
          { label: "Actual (W × H × L)" },
          { label: "Common use" },
        ],
        rows: [
          ["4 × 8 × 16", "3⅝ × 7⅝ × 15⅝", "veneers, partitions"],
          ["6 × 8 × 16", "5⅝ × 7⅝ × 15⅝", "interior walls"],
          ["8 × 8 × 16", "7⅝ × 7⅝ × 15⅝", "standard walls, foundations"],
          ["10 × 8 × 16", "9⅝ × 7⅝ × 15⅝", "taller or loaded walls"],
          ["12 × 8 × 16", "11⅝ × 7⅝ × 15⅝", "retaining, heavy loads"],
          ["8 × 8 × 8 (half)", "7⅝ × 7⅝ × 7⅝", "wall ends, openings"],
          ["8 × 4 × 16 (half-high)", "7⅝ × 3⅝ × 15⅝", "adjusting course height"],
        ],
        footnote:
          "Actual (specified) size is 3/8 in. less than nominal in each direction, leaving room for a 3/8-in. mortar joint. Verified against NCMA TEK 2-1A and a manufacturer spec.",
      },
    ],
    tips: [
      "Plan walls in 8-inch steps of height and 16-inch steps of length. You'll cut far fewer blocks.",
      "\"8-inch block\" means the wall thickness, not the height. Every standard size is 8 inches tall.",
      "Use half blocks at wall ends and openings to keep the running bond pattern without cutting.",
      "If your height doesn't land on an 8-inch step, a row of half-high blocks gets you there.",
    ],
    faqs: [
      {
        q: "What are the standard CMU block sizes?",
        a: "The common sizes are 4, 6, 8, 10 and 12 inches wide, all 8 inches tall and 16 inches long (nominal). The 8 × 8 × 16 is by far the most used.",
      },
      {
        q: "What are the actual dimensions of an 8x8x16 block?",
        a: "7⅝ × 7⅝ × 15⅝ inches. The ⅜-inch difference is left for the mortar joint.",
      },
      {
        q: "Why are CMU blocks smaller than their nominal size?",
        a: "So the math works once they're laid. A 7⅝-inch block plus a ⅜-inch mortar joint equals 8 inches, which makes walls easy to plan in clean 8-inch and 16-inch units.",
      },
      {
        q: "How tall is a concrete block course?",
        a: "8 inches, including the mortar joint. That gives you 1.5 courses per foot, so a 4-foot wall has 6 courses.",
      },
      {
        q: "What size is a cinder block?",
        a: "Same as a concrete block. A standard \"cinder block\" is 8 × 8 × 16 nominal, or 7⅝ × 7⅝ × 15⅝ actual.",
      },
      {
        q: "What is a half block?",
        a: "A block that's 8 inches long instead of 16 (nominal 8 × 8 × 8). It's used at wall ends, corners and openings so you don't have to cut full blocks.",
      },
      {
        q: "How many blocks are in one course?",
        a: "Divide the wall length in inches by 16 and round up. A 20-foot wall is 240 inches, so it takes 15 blocks per course.",
      },
    ],
    sources: ["NCMA TEK 2-1A unit sizes", "Manufacturer CMU spec (nominal vs actual)"],
    related: [
      "cinder-block-fill-calculator",
      "concrete-block-weight",
      "concrete-block-calculator",
      "brick-calculator",
      "block-wall-calculator",
      "yards-of-concrete-calculator",
    ],
    lastUpdated: "2026-10-10",
    imageAlt: "CMU nominal vs actual size: a 15⅝ × 7⅝ in block plus a ⅜ in joint fills 16 × 8 in.",
  },

  /* ---------------------------------------------------------------- 16 */
  {
    slug: "concrete-footing-calculator",
    category: "concrete",
    title: "Concrete Footing Calculator – Yards & Bags for Footings",
    metaDescription:
      "Work out concrete for continuous wall footings, square pad footings and round pier footings. Get cubic yards, 80-lb bags and cost, with waste included.",
    h1: "Concrete Footing Calculator",
    primaryKeyword: "concrete footing calculator",
    secondaryKeywords: [
      "footing calculator concrete",
      "concrete foundation calculator",
      "footing concrete calculator",
      "how much concrete for footings",
    ],
    cardDescription: "Concrete for strip, pad and round pier footings, with yards, bags and cost.",
    shortAnswer:
      "A 40-foot strip footing that's 16 inches wide and 8 inches deep takes about 1.32 cubic yards of concrete, or about 1.45 with 10% extra. Pick strip, pad or round pier footings below and enter your sizes to get yards, bags and cost.",
    howTo: [
      "Pick the footing type: continuous strip, square pads or round piers.",
      "Enter the size in feet and inches, and the number of footings.",
      "Keep 10% waste. Trenches are never perfectly square.",
      "Read the cubic yards and round up when you order.",
    ],
    formula: {
      plain: [
        "strip cu ft = L × W × D",
        "pads cu ft = L × W × D × quantity",
        "piers cu ft = π × (d ÷ 2)² × D × quantity",
        "cubic yards = cu ft ÷ 27",
        "bags = ceil(cu ft × (1 + waste%) ÷ yield)   (80 lb = 0.60, 60 lb = 0.45)",
      ],
      example: [
        "A 40 ft strip footing, 16 in wide and 8 in deep:",
        "cu ft = 40 × 1.333 × 0.667 = 35.56",
        "cubic yards = 35.56 ÷ 27 = 1.32",
        "+ 10% waste = 1.45 cu yd",
      ],
      example2: [
        "Six 24 × 24 in pad footings, 12 in deep:",
        "cu ft = 2 × 2 × 1 × 6 = 24",
        "cubic yards = 24 ÷ 27 = 0.89",
        "40 bags of 80-lb before waste, 44 with 10%",
      ],
    },
    notCovered:
      "This is a concrete quantity estimate, not a footing design. Footing width, depth and rebar depend on your soil, frost line and local code, so check with your building department or an engineer.",
    tables: [
      {
        title: "Cubic yards and 80-lb bags for strip footings (before waste)",
        columns: [
          { label: "Length" },
          { label: 'Cu yd (16 × 8")', num: true },
          { label: '80-lb bags (16 × 8")', num: true },
          { label: 'Cu yd (20 × 10")', num: true },
          { label: '80-lb bags (20 × 10")', num: true },
        ],
        rows: [
          ["20 ft", "0.66", 30, "1.03", 47],
          ["40 ft", "1.32", 60, "2.06", 93],
          ["60 ft", "1.98", 89, "3.09", 139],
          ["80 ft", "2.63", 119, "4.12", 186],
          ["100 ft", "3.29", 149, "5.14", 232],
        ],
        footnote: "Volumes and bags exclude waste; add about 10% when you order. An 80-lb bag yields about 0.60 cu ft.",
      },
    ],
    tips: [
      "Dig footings to undisturbed soil and below your local frost line. Your building department can tell you the depth.",
      "Trenches are rarely cut clean. Measure the real width and depth in a few places before you order.",
      "For a small shed or deck, bags may be enough. Past about 1 cubic yard, ready-mix is usually easier and cheaper.",
      "Most footings need rebar. Ask your inspector what size and how many runs your project needs.",
    ],
    faqs: [
      {
        q: "How big should a concrete footing be?",
        a: "A common rule is twice the width of the wall, so an 8-inch block wall gets a 16-inch footing. Many codes call for at least 12 inches wide and 6 inches thick for light structures. Your local building code sets the actual size.",
      },
      {
        q: "How deep should footings be?",
        a: "Below the frost line, which ranges from a few inches in the south to 4 feet or more up north. Footings also need to sit on undisturbed or compacted soil. Check your local code for the exact depth.",
      },
      {
        q: "How much concrete do I need for a footing?",
        a: "Multiply length × width × depth in feet, then divide by 27 for cubic yards. A 40-foot footing, 16 inches wide and 8 inches deep, is about 1.32 yards before waste.",
      },
      {
        q: "How many bags of concrete for a footing?",
        a: "Divide the footing's cubic feet by 0.6 for 80-lb bags. A footing with 24 cubic feet of concrete needs about 40 bags, or 44 with 10% extra.",
      },
      {
        q: "Do footings need rebar?",
        a: "Most do. Two runs of #4 rebar is common for residential strip footings, but requirements vary. Follow your plans or ask your local inspector.",
      },
      {
        q: "How much concrete for a deck footing?",
        a: "A 12-inch round pier footing 3 feet deep takes about 2.4 cubic feet of concrete, which is 4 bags of 80-lb mix. Multiply by the number of piers.",
      },
      {
        q: "Can I pour a footing and wall at the same time?",
        a: "Sometimes, with a monolithic pour, but most block walls go on a footing that's poured and cured first. Your plans and local code decide which method you use.",
      },
    ],
    sources: ["IRC R403.1 footing sizes", "Quikrete 80-lb concrete mix yield", "2026 ready-mix cost guide"],
    warning:
      "Footings are commonly about twice the wall width, at least 12 in wide and 6 in thick for light structures, and below the frost line. Always follow your local code.",
    related: [
      "yards-of-concrete-calculator",
      "block-wall-calculator",
      "concrete-slab-cost-calculator",
      "cubic-yard-calculator",
    ],
    lastUpdated: "2026-10-12",
    imageAlt: "Concrete footing diagram: strip, pad and round pier footings with the dimensions the calculator uses.",
  },

  /* ---------------------------------------------------------------- 17 */
  {
    slug: "cinder-block-fill-calculator",
    category: "concrete",
    title: "Cinder Block Fill Calculator – Concrete to Fill Block Cores",
    metaDescription:
      "How much concrete or grout to fill cinder block cores. Enter blocks or wall size, pick full or partial fill, and get cubic feet, yards and 80-lb bags.",
    h1: "Cinder Block Fill Calculator",
    primaryKeyword: "cinder block fill calculator",
    secondaryKeywords: [
      "cinder block concrete fill calculator",
      "how much concrete to fill cinder blocks",
      "block fill calculator",
      "grout fill calculator",
      "core fill concrete",
    ],
    cardDescription: "Concrete or grout to fill cinder block cores, by blocks or wall size.",
    shortAnswer:
      "Filling every core of an 8-inch concrete block wall takes about 0.26 cubic feet of concrete per square foot of wall. That's roughly 0.23 cubic feet per block, so one 80-lb bag fills about 2½ blocks. Enter your blocks or wall size below to get cubic feet, yards and bags.",
    howTo: [
      "Enter the number of blocks, or the wall length and height.",
      "Pick the block width: 6, 8 or 12 inches.",
      "Choose all cores, every other core, or only the rebar cores.",
      "Keep about 10% extra and read the bags or yards.",
    ],
    formula: {
      plain: [
        "wall area = blocks ÷ 1.125, or L × H",
        "cu ft = area × grout per sq ft × fill fraction",
        "grout per sq ft: 6 in = 0.17, 8 in = 0.26, 12 in = 0.42",
        "cubic yards = cu ft ÷ 27",
        "bags = ceil(cu ft × (1 + waste%) ÷ 0.60)",
      ],
      example: [
        "100 standard 8-inch blocks, all cores:",
        "cu ft = 100 × (0.26 ÷ 1.125) = 23.1",
        "cubic yards = 23.1 ÷ 27 = 0.86",
        "bags = 23.1 ÷ 0.60 = 39 (before waste)",
      ],
      example2: [
        "A 20 × 4 ft wall of 8-inch block, every other core:",
        "cu ft = 80 × 0.26 × 0.5 = 10.4",
        "bags = 10.4 ÷ 0.60 = 18",
      ],
    },
    notCovered:
      "It estimates the grout or concrete needed to fill block cores. It assumes standard hollow cores, doesn't subtract rebar, and doesn't count grout lost into gaps and cleanouts. For structural walls, follow the engineer's grout spec.",
    tables: [
      {
        title: "Cubic feet and 80-lb bags to fill all cores (before waste)",
        columns: [
          { label: "Blocks" },
          { label: 'Cu ft (6")', num: true },
          { label: 'Cu ft (8")', num: true },
          { label: 'Cu ft (12")', num: true },
          { label: 'Bags (6")', num: true },
          { label: 'Bags (8")', num: true },
          { label: 'Bags (12")', num: true },
        ],
        rows: [
          [50, "7.6", "11.6", "18.7", 13, 20, 32],
          [100, "15.1", "23.1", "37.3", 26, 39, 63],
          [200, "30.2", "46.2", "74.7", 51, 78, 125],
          [500, "75.6", "115.6", "186.7", 126, 193, 312],
        ],
        footnote: "All cores filled, before waste; add about 10%. Cubic yards = cu ft ÷ 27. An 80-lb bag yields about 0.60 cu ft.",
      },
    ],
    tips: [
      "Use a pourable mix. Regular concrete with big stones can bridge in narrow cores and leave empty pockets. Ask your supplier for core-fill grout or a pea-gravel mix.",
      "Fill in lifts of about 4 feet or less and rod each lift so the concrete settles all the way down.",
      "For more than about half a yard, a small ready-mix load or a grout pump saves a lot of bag mixing.",
      "Only fill the cores your plans call for. Filling every core uses twice the concrete of every other core.",
    ],
    faqs: [
      {
        q: "How much concrete does it take to fill a cinder block?",
        a: "About 0.23 cubic feet for a standard 8-inch block, based on 0.26 cubic feet per square foot of wall. One 80-lb bag fills about 2½ blocks.",
      },
      {
        q: "How many bags of concrete to fill 100 cinder blocks?",
        a: "About 39 bags of 80-lb mix for 100 standard 8-inch blocks with every core filled, before waste. Filling every other core takes about half that.",
      },
      {
        q: "Can I use regular concrete to fill block cores?",
        a: "You can, but a mix with small aggregate pours better. Big stones can jam in the cores and leave voids. Core-fill grout or a pea-gravel mix is made for this job.",
      },
      {
        q: "Do I need to fill every core?",
        a: "No. Many walls only need cores filled where there's vertical rebar, often every 16 to 48 inches. Fill every core only if your plans or engineer call for a fully grouted wall.",
      },
      {
        q: "How much grout per square foot of block wall?",
        a: "About 0.17 cubic feet for 6-inch block, 0.26 for 8-inch and 0.42 for 12-inch when every core is filled.",
      },
      {
        q: "How many cinder blocks does a yard of concrete fill?",
        a: "About 117 standard 8-inch blocks with every core filled, since a yard is 27 cubic feet and each block takes about 0.23 cubic feet. Plan on closer to 105 once you allow 10% for waste.",
      },
      {
        q: "Should I fill cinder blocks with concrete or gravel?",
        a: "Use concrete or grout where the wall carries load or has rebar. Gravel adds weight but no strength, so it's only used in some landscape and garden walls where the plans allow it.",
      },
    ],
    sources: ["Core-fill grout coverage (TCC Materials)", "NCMA CMU geometry (TEK 2-1A)", "Quikrete 80-lb concrete mix yield"],
    related: [
      "block-wall-calculator",
      "concrete-block-calculator",
      "cmu-block-sizes",
      "concrete-block-weight",
    ],
    lastUpdated: "2026-10-12",
    imageAlt: "Cinder block fill diagram: a block's two cores and a wall with every other core filled.",
  },

  /* ---------------------------------------------------------------- 18 (batch 2) */
  {
    slug: "mulch-calculator",
    category: "landscaping",
    title: "Mulch Calculator – Cubic Yards & Bags of Mulch Needed",
    metaDescription:
      "Find how much mulch you need for beds, borders and tree rings. Enter the area and depth to get cubic yards, 2 or 3 cu ft bags, coverage and cost.",
    h1: "Mulch Calculator",
    primaryKeyword: "mulch calculator",
    secondaryKeywords: [
      "how much mulch do i need",
      "yard of mulch",
      "mulch coverage calculator",
      "bags of mulch calculator",
      "how many bags of mulch in a yard",
      "how much does a yard of mulch cover",
    ],
    cardDescription: "How much mulch for beds and tree rings: cubic yards, bags, coverage and cost.",
    shortAnswer:
      "One cubic yard of mulch covers about 108 square feet at 3 inches deep, or 162 square feet at 2 inches. A 10 by 20 foot bed at 3 inches needs about 1.85 cubic yards, or 25 bags of 2 cubic feet. Enter your beds below to get yards, bags and cost.",
    howTo: [
      "Pick a shape and enter the size of each bed. Add more beds if you have several.",
      "Choose the depth. Three inches is a good default for most beds.",
      "Keep 10% extra for uneven ground and settling.",
      "Compare the bulk and bagged cost, then round up when you order.",
    ],
    formula: {
      plain: [
        "cu ft = area (sq ft) × depth (in) ÷ 12",
        "cubic yards = cu ft ÷ 27",
        "bags = ceil(cu ft × (1 + waste%) ÷ bag size)",
        "coverage per yard (sq ft) = 324 ÷ depth (in)",
      ],
      example: [
        "A 10 × 20 ft bed, 3 inches deep:",
        "cu ft = 200 × 3 ÷ 12 = 50",
        "cubic yards = 50 ÷ 27 = 1.85",
        "25 bags of 2 cu ft, or 17 bags of 3 cu ft (before waste)",
      ],
      example2: [
        "A tree ring 6 ft across, 3 inches deep:",
        "cu ft = π × 3² × 0.25 = 7.07",
        "cubic yards = 7.07 ÷ 27 = 0.26",
        "4 bags of 2 cu ft",
      ],
    },
    notCovered:
      "It estimates loose mulch volume for flat beds. It doesn't account for slopes, mulch that's already there, or how much fresh mulch settles in the first few weeks. Rubber mulch and stone are sold by weight, so check the supplier's coverage chart for those.",
    tables: [
      {
        title: "Cubic yards of mulch by area and depth",
        columns: [
          { label: "Area" },
          { label: '2 in', num: true },
          { label: '3 in', num: true },
          { label: '4 in', num: true },
          { label: "2 cu ft bags at 3 in", num: true },
        ],
        rows: [
          ["100 sq ft", "0.62", "0.93", "1.23", 13],
          ["200 sq ft", "1.23", "1.85", "2.47", 25],
          ["500 sq ft", "3.09", "4.63", "6.17", 63],
          ["1,000 sq ft", "6.17", "9.26", "12.35", 125],
        ],
        footnote: "Cubic yards and bags exclude waste; add about 10% when you order. A cubic yard is 27 cu ft; a 2 cu ft bag covers about 8 sq ft at 3 inches.",
      },
    ],
    tips: [
      "Check the depth of the old mulch first. If there's already 2 inches, you may only need to top up an inch.",
      "Keep mulch a few inches away from tree trunks and plant stems. Piling it against the bark invites rot and pests.",
      "Past about 2 or 3 cubic yards, bulk delivery is usually cheaper than bags, even with the delivery fee.",
      "Bags are easier for small beds, steep yards or places a truck can't reach.",
    ],
    faqs: [
      {
        q: "How much mulch do I need?",
        a: "Multiply the bed's square feet by the depth in inches, divide by 12 for cubic feet, then divide by 27 for cubic yards. A 200 square foot bed at 3 inches needs about 1.85 cubic yards.",
      },
      {
        q: "How much does a yard of mulch cover?",
        a: "About 324 square feet at 1 inch deep. That's 162 square feet at 2 inches, 108 at 3 inches and 81 at 4 inches.",
      },
      {
        q: "How many bags of mulch are in a yard?",
        a: "About 13.5 bags of 2 cubic feet, or 9 bags of 3 cubic feet. A cubic yard is 27 cubic feet.",
      },
      {
        q: "How deep should mulch be?",
        a: "Two to four inches for most beds. Two inches is enough for fine mulch, and three inches is a good default. Going much deeper can keep water and air from reaching the roots.",
      },
      {
        q: "Is it cheaper to buy mulch in bulk or bags?",
        a: "Bulk is usually cheaper once you need more than about 2 or 3 cubic yards, even with a delivery fee. For a small bed or two, bags often cost less overall.",
      },
      {
        q: "How much mulch for a tree ring?",
        a: "A ring 6 feet across at 3 inches deep takes about 7 cubic feet, which is 4 bags of 2 cubic feet. Keep the mulch a few inches away from the trunk.",
      },
      {
        q: "How often should I replace mulch?",
        a: "Most wood mulch breaks down in about a year or two. Many people add an inch each spring rather than replacing it all.",
      },
    ],
    sources: ["K-State Extension mulch depth", "Vigoro 2 cu ft bag coverage", "2026 mulch cost guide"],
    related: [
      "gravel-calculator",
      "landscape-rock-calculator",
      "landscape-materials-calculator",
      "cubic-yard-calculator",
      "topsoil-calculator",
      "pea-gravel-calculator",
    ],
    lastUpdated: "2026-10-12",
    imageAlt: "Mulch calculator diagram: bed depth and a tree ring, the measurements the calculator uses.",
  },

  /* ---------------------------------------------------------------- 19 (batch 2) */
  {
    slug: "gravel-calculator",
    category: "landscaping",
    title: "Gravel Calculator – Tons & Cubic Yards of Gravel Needed",
    metaDescription:
      "Work out how much gravel you need for a driveway, path or patio. Pick the gravel type and depth to get cubic yards, tons, bags and cost.",
    h1: "Gravel Calculator",
    primaryKeyword: "gravel calculator",
    secondaryKeywords: [
      "gravel driveway calculator",
      "driveway gravel calculator",
      "how much gravel do i need",
      "how to calculate yards of gravel",
      "how much does a ton of gravel cover",
      "how much does a yard of gravel weigh",
    ],
    cardDescription: "How much gravel for a driveway, path or patio: cubic yards, tons, bags and cost.",
    shortAnswer:
      "One ton of gravel covers about 77 square feet at 3 inches deep, or 58 square feet at 4 inches. A 12 by 50 foot driveway at 4 inches needs about 7.4 cubic yards, or 10.4 tons. Enter your area, depth and gravel type below to get tons, yards, bags and cost.",
    howTo: [
      "Measure each area and pick a shape. Add more areas if you have several.",
      "Choose the gravel type. Crushed stone and road base are heavier than river rock.",
      "Pick a depth: about 2 to 3 inches for paths and patios, 4 inches or more for driveways.",
      "Keep 10% extra for compaction and uneven ground, then round up when you order.",
    ],
    formula: {
      plain: [
        "cu ft = area (sq ft) × depth (in) ÷ 12",
        "cubic yards = cu ft ÷ 27",
        "tons = cubic yards × density (about 1.4 for most gravel)",
        "bags = ceil(cu ft × (1 + waste%) ÷ bag size)",
        "sq ft per ton = (27 ÷ density) ÷ (depth ÷ 12)",
      ],
      example: [
        "A 12 × 50 ft driveway, 4 inches deep (density 1.4):",
        "cu ft = 600 × 4 ÷ 12 = 200",
        "cubic yards = 200 ÷ 27 = 7.41",
        "tons = 7.41 × 1.4 = 10.37, about 400 bags of 0.5 cu ft before waste",
      ],
      example2: [
        "A 3 × 40 ft path, 3 inches deep:",
        "cu ft = 120 × 3 ÷ 12 = 30",
        "cubic yards = 30 ÷ 27 = 1.11, about 1.56 tons",
        "60 bags of 0.5 cu ft",
      ],
    },
    notCovered:
      "It estimates loose gravel for a flat area. It doesn't design a driveway base, account for slopes, or figure out how much the ground will settle under heavy trucks. Weights vary with moisture and stone size, so check the supplier's tons-per-yard figure before you order.",
    tables: [
      {
        title: "Cubic yards and tons of gravel by area and depth",
        columns: [
          { label: "Area" },
          { label: "2 in (yd / t)", num: true },
          { label: "3 in (yd / t)", num: true },
          { label: "4 in (yd / t)", num: true },
        ],
        rows: [
          ["100 sq ft", "0.62 / 0.9", "0.93 / 1.3", "1.23 / 1.7"],
          ["250 sq ft", "1.54 / 2.2", "2.31 / 3.2", "3.09 / 4.3"],
          ["500 sq ft", "3.09 / 4.3", "4.63 / 6.5", "6.17 / 8.6"],
          ["1,000 sq ft", "6.17 / 8.6", "9.26 / 13.0", "12.35 / 17.3"],
        ],
        footnote: "Cubic yards and tons at density 1.4 t/yd, before waste; add about 10% when you order. A cubic yard is 27 cu ft and weighs about 1.4 tons (2,800 lb) for typical gravel.",
      },
    ],
    tips: [
      "Most suppliers sell gravel by the ton. If they quote by the yard, ask how many tons a yard of that stone weighs.",
      "For a driveway, lay a compacted base of crusher run or larger stone first, then a top layer of #57 or similar.",
      "Put landscape fabric under paths and patios to keep weeds down and stop the gravel sinking into the soil.",
      "Past about 1 ton, bulk delivery is almost always cheaper than bags.",
    ],
    faqs: [
      {
        q: "How much gravel do I need?",
        a: "Multiply length × width in feet to get square feet, multiply by the depth in inches and divide by 12 for cubic feet, then divide by 27 for cubic yards. Multiply cubic yards by about 1.4 to get tons for most gravel.",
      },
      {
        q: "How much does a ton of gravel cover?",
        a: "About 116 square feet at 2 inches deep, 77 square feet at 3 inches and 58 square feet at 4 inches. Heavier stone covers a little less.",
      },
      {
        q: "How much does a yard of gravel weigh?",
        a: "About 1.4 tons, or 2,800 pounds, for typical crushed stone or pea gravel. Road base and crusher run are heavier, and river rock is a little lighter.",
      },
      {
        q: "How much gravel do I need for a driveway?",
        a: "A 12 by 50 foot driveway at 4 inches deep needs about 7.4 cubic yards, or about 10.4 tons. A brand new driveway often needs 6 inches or more including the base layer.",
      },
      {
        q: "How deep should gravel be?",
        a: "About 2 inches for a decorative layer, 3 inches for paths and patios, and 4 to 6 inches for driveways. Driveways on soft ground need a deeper base.",
      },
      {
        q: "How many bags of gravel are in a ton?",
        a: "About 39 bags of 0.5 cubic feet, since a ton is about 19.3 cubic feet. That's a lot of bags, so bulk is usually cheaper past a ton.",
      },
      {
        q: "What is the best gravel for a driveway?",
        a: "Crusher run or road base packs down well as a base. Many people top it with #57 crushed stone. Pea gravel and river rock are round and tend to shift under car tires.",
      },
    ],
    sources: ["#57 gravel weight (1.4 t/yd)", "Driveway gravel layers (Gravelshop)", "2026 gravel prices"],
    related: [
      "landscape-rock-calculator",
      "paver-calculator",
      "paver-base-calculator",
      "retaining-wall-calculator",
      "fill-dirt-calculator",
      "sand-calculator",
      "pea-gravel-calculator",
      "cubic-yard-calculator",
      "landscape-materials-calculator",
      "rip-rap-calculator",
      "mulch-calculator",
    ],
    lastUpdated: "2026-10-14",
    imageAlt: "Gravel calculator diagram: driveway layers and the length, width and depth the calculator uses.",
  },

  /* ---------------------------------------------------------------- 20 (batch 2) */
  {
    slug: "sand-calculator",
    category: "landscaping",
    title: "Sand Calculator – Tons, Cubic Yards & Bags of Sand",
    metaDescription:
      "Find how much sand you need for a sandbox, paver base or fill. Enter the area and depth to get cubic yards, tons, 50-lb bags and cost.",
    h1: "Sand Calculator",
    primaryKeyword: "sand calculator",
    secondaryKeywords: [
      "paver sand calculator",
      "play sand calculator",
      "how much sand do i need",
      "how many bags of sand do i need",
      "how much does a yard of sand weigh",
      "sandbox sand calculator",
    ],
    cardDescription: "How much sand for a sandbox, paver base or fill: cubic yards, tons, 50-lb bags and cost.",
    shortAnswer:
      "A ton of dry sand covers about 120 square feet at 2 inches deep, or 240 square feet at 1 inch for paver bedding. A 6 by 6 foot sandbox filled 12 inches deep takes about 1.8 tons, or 72 bags of 50-lb play sand. Enter your area and depth below to get tons, yards, bags and cost.",
    howTo: [
      "Measure each area and pick a shape. Add more areas if you need to.",
      "Pick a project or type your own depth: about 1 inch under pavers, 2 inches for leveling, 12 inches for a sandbox.",
      "Choose dry or damp sand. Damp sand weighs more per yard.",
      "Keep 10% extra for compaction and spillage, then compare bulk and bagged cost.",
    ],
    formula: {
      plain: [
        "cu ft = area (sq ft) × depth (in) ÷ 12",
        "cubic yards = cu ft ÷ 27",
        "tons = cubic yards × density (about 1.35 for dry sand)",
        "bags = ceil(cu ft × (1 + waste%) ÷ 0.5)",
        "sq ft per ton = (27 ÷ density) ÷ (depth ÷ 12)",
      ],
      example: [
        "A 6 × 6 ft sandbox, 12 inches deep (dry sand, 1.35):",
        "cu ft = 36 × 12 ÷ 12 = 36",
        "cubic yards = 36 ÷ 27 = 1.33",
        "tons = 1.33 × 1.35 = 1.80, or 72 bags of 50-lb play sand",
      ],
      example2: [
        "A 12 × 12 ft paver patio, 1 inch of bedding sand:",
        "cu ft = 144 × 1 ÷ 12 = 12",
        "cubic yards = 12 ÷ 27 = 0.44, about 0.60 tons",
        "24 bags of 50-lb sand",
      ],
    },
    notCovered:
      "It estimates loose sand for a flat area. It doesn't size the gravel base under pavers, the sand needed to fill paver joints, or pool filter sand, which is sold by the filter maker's spec. Weights change a lot with moisture, so check the supplier's tons-per-yard figure.",
    tables: [
      {
        title: "Cubic yards and tons of dry sand by area and depth",
        columns: [
          { label: "Area" },
          { label: "1 in (yd / t)", num: true },
          { label: "2 in (yd / t)", num: true },
          { label: "4 in (yd / t)", num: true },
        ],
        rows: [
          ["100 sq ft", "0.31 / 0.4", "0.62 / 0.8", "1.23 / 1.7"],
          ["250 sq ft", "0.77 / 1.0", "1.54 / 2.1", "3.09 / 4.2"],
          ["500 sq ft", "1.54 / 2.1", "3.09 / 4.2", "6.17 / 8.3"],
          ["1,000 sq ft", "3.09 / 4.2", "6.17 / 8.3", "12.35 / 16.7"],
        ],
        footnote: "Cubic yards and tons for dry sand at 1.35 t/yd, before waste; add about 10% when you order. A cubic yard is 27 cu ft and weighs about 1.35 tons (2,700 lb) of dry sand.",
      },
    ],
    tips: [
      "Use the right sand. Play sand is washed and fine. Concrete or coarse sand is best for paver bedding. Mason sand is for mortar.",
      "Under pavers, about 1 inch of bedding sand goes on top of a compacted gravel base, not straight on soil.",
      "Sand is sold by the ton or the yard. Ask which, and how much a yard weighs, before you compare prices.",
      "Bags make sense for a small sandbox or a few pavers. Past about a ton, bulk delivery is usually cheaper.",
    ],
    faqs: [
      {
        q: "How much sand do I need?",
        a: "Multiply length × width in feet, multiply by the depth in inches and divide by 12 for cubic feet, then divide by 27 for cubic yards. Multiply cubic yards by about 1.35 to get tons of dry sand.",
      },
      {
        q: "How much does a yard of sand weigh?",
        a: "About 1.35 tons, or 2,700 pounds, for dry sand. Damp sand can weigh 1.5 tons or more per yard.",
      },
      {
        q: "How much area does a ton of sand cover?",
        a: "About 240 square feet at 1 inch deep, 120 square feet at 2 inches and 60 square feet at 4 inches.",
      },
      {
        q: "How much sand do I need for a sandbox?",
        a: "A 6 by 6 foot sandbox filled 12 inches deep needs about 36 cubic feet, which is about 1.8 tons or 72 bags of 50-lb play sand. A 4 by 4 foot box at 6 inches needs about 16 bags.",
      },
      {
        q: "How much sand do I need under pavers?",
        a: "About 1 inch of bedding sand on top of a compacted gravel base. A 12 by 12 foot patio needs about 12 cubic feet, or 24 bags of 50-lb sand.",
      },
      {
        q: "How many bags of sand are in a ton?",
        a: "About 40 bags of 50 lb, since a ton is 2,000 pounds. By volume, a ton of dry sand is about 20 cubic feet.",
      },
      {
        q: "What kind of sand should I use?",
        a: "Play sand for sandboxes, coarse concrete sand for paver bedding, mason sand for mortar, and polymeric sand only for filling paver joints.",
      },
    ],
    sources: ["Sand unit weight (supplier)", "Paver bedding depth (Belgard)", "2026 sand prices"],
    related: [
      "paver-base-calculator",
      "gravel-calculator",
      "fill-dirt-calculator",
      "landscape-materials-calculator",
      "cubic-yard-calculator",
      "pea-gravel-calculator",
      "topsoil-calculator",
    ],
    lastUpdated: "2026-10-14",
    imageAlt: "Sand calculator diagram: paver bedding layer and a sandbox, the measurements the calculator uses.",
  },

  /* ---------------------------------------------------------------- 21 (batch 2) */
  {
    slug: "brick-calculator",
    category: "concrete",
    title: "Brick Calculator – How Many Bricks & Mortar Bags You Need",
    metaDescription:
      "Work out how many bricks you need for a wall, veneer or garden wall. Pick the brick size, subtract doors and windows, and get bricks, mortar bags and cost.",
    h1: "Brick Calculator",
    primaryKeyword: "brick calculator",
    secondaryKeywords: [
      "how many bricks do i need",
      "brick wall calculator",
      "bricks per square foot",
      "brick mortar calculator",
      "how many bricks in a square foot",
    ],
    cardDescription: "How many bricks and mortar bags for a wall or veneer, with cost.",
    shortAnswer:
      "A standard modular brick wall takes about 6.75 bricks per square foot, so a 20 by 4 foot wall needs about 540 bricks, or 567 with 5% extra for cuts and breakage. Pick your brick size, subtract doors and windows, and get bricks, mortar bags and cost below.",
    howTo: [
      "Enter the wall length and height, or the square feet.",
      "Add any doors, windows or other openings so they're taken off the area.",
      "Pick the brick size. Modular is the most common in the US.",
      "Keep 5% extra, or 10% for walls with lots of cuts, then read the bricks and mortar bags.",
    ],
    formula: {
      plain: [
        "bricks = net area (sq ft) × bricks per sq ft × wythes",
        "bricks per sq ft = 144 ÷ ((length + joint) × (height + joint))   (modular ≈ 6.75)",
        "with waste = ceil(bricks × (1 + waste%))",
        "mortar bags = ceil(bricks ÷ 37)   (80-lb bag)",
      ],
      example: [
        "A 20 × 4 ft modular brick wall (6.75 per sq ft):",
        "net area = 80 sq ft",
        "bricks = 80 × 6.75 = 540, or 567 with 5% waste",
        "mortar = ceil(567 ÷ 37) = 16 bags",
      ],
      example2: [
        "A 12 × 8 ft wall minus a 3 × 7 ft door:",
        "net area = 96 - 21 = 75 sq ft",
        "bricks = 75 × 6.75 = 507, or 532 with 5% waste",
      ],
    },
    notCovered:
      "It counts bricks and mortar for a flat wall face. It doesn't design the wall, size footings, add wall ties or lintels, or count the extra bricks for corners, piers, arches or patterns. For a load-bearing or tall wall, follow your plans or an engineer.",
    tables: [
      {
        title: "Bricks needed by wall area (before waste)",
        columns: [
          { label: "Wall area" },
          { label: "Modular (6.75)", num: true },
          { label: "King (4.8)", num: true },
          { label: "Utility (3.0)", num: true },
        ],
        rows: [
          ["50 sq ft", 338, 240, 150],
          ["100 sq ft", 675, 480, 300],
          ["250 sq ft", "1,688", "1,200", 750],
          ["500 sq ft", "3,375", "2,400", "1,500"],
        ],
        footnote: "Bricks exclude waste; add 5% for a plain wall or 10% for lots of cuts. Figures are for a single wythe with a 3/8 inch mortar joint.",
      },
    ],
    tips: [
      "Buy all your bricks at once, ideally from the same batch. Color can vary between runs.",
      "Mix bricks from several pallets as you lay them so any color difference is spread across the wall.",
      "Use Type N mortar for most above-grade veneer and garden walls, and Type S for walls below grade or that hold back soil. Check your local code.",
      "Keep a few spare bricks after the job for future repairs.",
    ],
    faqs: [
      {
        q: "How many bricks are in a square foot?",
        a: "About 6.75 standard modular bricks per square foot of wall, with a 3/8 inch mortar joint. King bricks take about 4.8 per square foot and utility bricks about 3.",
      },
      {
        q: "How many bricks do I need for a wall?",
        a: "Multiply the wall length by the height to get square feet, subtract doors and windows, then multiply by 6.75 for modular brick. A 20 by 4 foot wall needs about 540 bricks, or 567 with 5% extra.",
      },
      {
        q: "How much mortar do I need for bricks?",
        a: "One 80-lb bag of premixed mortar lays about 37 standard bricks. So 567 bricks need about 16 bags.",
      },
      {
        q: "How many bricks are in a pallet?",
        a: "It depends on the brick and the maker, but a pallet of modular brick often holds about 500 bricks. Check with your supplier before you order.",
      },
      {
        q: "How much extra brick should I buy?",
        a: "About 5% for a plain wall and up to 10% for walls with lots of cuts, corners or a pattern. Bricks chip and break in delivery and cutting.",
      },
      {
        q: "What size is a standard brick?",
        a: "A US modular brick is 3⅝ by 2¼ by 7⅝ inches. With a 3/8 inch joint it takes up 4 by 2⅔ by 8 inches, which is why three courses equal 8 inches of wall height.",
      },
      {
        q: "What is the difference between brick and block?",
        a: "Bricks are small, solid or cored clay units laid by hand, at about 6.75 per square foot. Concrete blocks are much larger, at 1.125 per square foot, and are often used for structural walls behind brick.",
      },
    ],
    sources: ["Brick sizes (BIA Technical Note 10)", "Mortar yield (Quikrete)", "2026 brick prices"],
    related: [
      "concrete-block-calculator",
      "block-wall-calculator",
      "cmu-block-sizes",
      "concrete-block-weight",
      "concrete-slab-cost-calculator",
      "paver-calculator",
      "paver-base-calculator",
    ],
    lastUpdated: "2026-10-15",
    imageAlt: "Brick calculator diagram: wall length and height with an opening, and a modular brick's actual and nominal size.",
  },

  /* ---------------------------------------------------------------- 22 (batch 3) */
  {
    slug: "paver-calculator",
    category: "landscaping",
    title: "Paver Calculator – How Many Pavers, Base & Sand You Need",
    metaDescription:
      "Work out how many pavers you need for a patio or walkway, plus gravel base, bedding sand and edging. Pick paver size and pattern to get totals and cost.",
    h1: "Paver Calculator",
    primaryKeyword: "paver calculator",
    secondaryKeywords: [
      "how many pavers do i need",
      "paver calculator square feet",
      "how many pavers for a 12x12 patio",
      "paver patio calculator",
      "pavers per square foot",
    ],
    cardDescription: "How many pavers plus gravel base, bedding sand and edging for a patio or walkway.",
    shortAnswer:
      "Standard 4 by 8 inch pavers take 4.5 per square foot, so a 12 by 12 foot patio needs about 648 pavers, or 681 with 5% extra for cuts. Pick your paver size and pattern below to get pavers, gravel base, bedding sand and edging.",
    howTo: [
      "Measure the patio or walkway and pick a shape. Add more areas, or subtract a fire pit or planter.",
      "Choose the paver size. Holland 4 by 8 is the most common.",
      "Pick the pattern. Herringbone and diagonal layouts need more extra pavers for cuts.",
      "Read the pavers, base, sand and edging, then round up when you order.",
    ],
    formula: {
      plain: [
        "pavers = net area (sq ft) × pavers per sq ft",
        "pavers per sq ft = 144 ÷ (length × width in inches)   (4 × 8 ≈ 4.5)",
        "with waste = ceil(pavers × (1 + waste%))   (5% bond, 10% herringbone, 15% diagonal)",
        "base tons = net area × depth ÷ 12 ÷ 27 × 1.5   (4 in default)",
        "sand bags = ceil(net area × 1 ÷ 12 ÷ 0.5)",
      ],
      example: [
        "A 12 × 12 ft patio with 4 × 8 pavers (4.5 per sq ft):",
        "net area = 144 sq ft",
        "pavers = 144 × 4.5 = 648, or 681 with 5% waste",
        "base = 3.20 tons (2.67 before compaction), sand = 27 bags, edging = 48 ft",
      ],
      example2: [
        "The same patio with 6 × 9 pavers:",
        "pavers = 144 × 2.67 = 384, or 404 with 5% waste",
      ],
    },
    notCovered:
      "It estimates materials for a flat patio or walkway on stable ground. It doesn't design a driveway base, plan drainage or slopes, or count steps, walls and borders made from a different paver. Clay soil, heavy traffic or freezing winters may need a deeper base, so follow the paver maker's guide.",
    tables: [
      {
        title: "Pavers needed by area (before waste)",
        columns: [
          { label: "Area" },
          { label: "4 × 8", num: true },
          { label: "6 × 9", num: true },
          { label: "12 × 12", num: true },
          { label: "16 × 16", num: true },
        ],
        rows: [
          ["100 sq ft", 450, 267, 100, 57],
          ["200 sq ft", 900, 534, 200, 113],
          ["300 sq ft", "1,350", 800, 300, 169],
          ["500 sq ft", "2,250", "1,334", 500, 282],
        ],
        footnote: "Pavers exclude waste; add 5% for a running bond, 10% for herringbone or up to 15% for a diagonal layout. From 144 ÷ the nominal paver size.",
      },
    ],
    tips: [
      "Order all your pavers from the same production run. Colors can vary between batches.",
      "Pull pavers from several pallets as you lay them so color differences blend in.",
      "Compact the gravel base in layers of about 2 inches with a plate compactor. A soft base is the most common reason pavers sink.",
      "Leave the bedding sand loose and screeded flat. Don't compact it before you set the pavers.",
    ],
    faqs: [
      {
        q: "How many pavers do I need?",
        a: "Multiply length by width to get square feet, then multiply by the pavers per square foot for your size. Standard 4 by 8 inch pavers take 4.5 per square foot, so 100 square feet needs 450 pavers before extra for cuts.",
      },
      {
        q: "How many pavers do I need for a 12x12 patio?",
        a: "About 648 standard 4 by 8 pavers, or 681 with 5% extra. With 12 by 12 inch slabs, it's 144, or 152 with extra.",
      },
      {
        q: "How many pavers are in a square foot?",
        a: "4.5 for 4 by 8 inch pavers, 4 for 6 by 6, about 2.7 for 6 by 9, and 1 for 12 by 12 inch slabs.",
      },
      {
        q: "How much extra should I buy for cuts?",
        a: "About 5% for a simple running bond, around 10% for herringbone, and up to 15% for diagonal layouts or patios with lots of curves.",
      },
      {
        q: "How much gravel base do I need under pavers?",
        a: "About 4 inches of compacted base for a patio or walkway. A 12 by 12 foot patio needs about 1.8 cubic yards, or 2.7 tons of crusher run. Driveways need a deeper base.",
      },
      {
        q: "How much sand do I need under pavers?",
        a: "About 1 inch of bedding sand. A 12 by 12 foot patio needs about 12 cubic feet, or 24 bags of 50-lb sand.",
      },
      {
        q: "Do I need edging for pavers?",
        a: "Yes. Edge restraints hold the pavers in place so they don't spread over time. A 12 by 12 foot patio needs about 48 feet of edging.",
      },
    ],
    sources: ["Paver sizes and coverage (Nicolock)", "Base and bedding (Belgard)", "2026 paver prices"],
    related: [
      "paver-base-calculator",
      "retaining-wall-calculator",
      "sand-calculator",
      "gravel-calculator",
      "landscape-rock-calculator",
      "brick-calculator",
      "concrete-slab-cost-calculator",
      "landscape-materials-calculator",
    ],
    lastUpdated: "2026-10-16",
    imageAlt: "Paver calculator diagram: pavers, sand bedding, gravel base and edging, with the length and width the calculator uses.",
  },

  /* ---------------------------------------------------------------- 23 (batch 3) */
  {
    slug: "paver-base-calculator",
    category: "landscaping",
    title: "Paver Base Calculator – Gravel Base & Sand for Pavers",
    metaDescription:
      "How much gravel base and bedding sand you need under pavers. Pick patio, walkway or driveway depth to get tons, cubic yards, bags and cost.",
    h1: "Paver Base Calculator",
    primaryKeyword: "paver base calculator",
    secondaryKeywords: [
      "how much paver base do i need",
      "paver base depth calculator",
      "calculate paver base",
      "how many bags of paver base do i need",
      "paver base and sand calculator",
    ],
    cardDescription: "How much gravel base and bedding sand under pavers: tons, yards, bags and cost.",
    shortAnswer:
      "A 12 by 12 foot paver patio needs about 3.2 tons of crusher run for a 4-inch compacted base, plus about 27 bags of bedding sand. Pick your project below to get base tons, yards, bags and cost.",
    howTo: [
      "Measure the area and pick a shape. Add more areas if you need to.",
      "Pick the project. Walkways and patios usually need about 4 inches of base, driveways about 8.",
      "Keep the compaction allowance. Loose gravel shrinks when you compact it.",
      "Read the base and bedding sand, then compare bulk and bagged cost.",
    ],
    formula: {
      plain: [
        "base cu ft = area (sq ft) × depth (in) ÷ 12 × (1 + compaction%)",
        "cubic yards = base cu ft ÷ 27,  tons = cubic yards × 1.5 (crusher run)",
        "base bags = ceil(base cu ft ÷ 0.5)",
        "sand cu ft = area × 1 ÷ 12,  sand bags = ceil(sand cu ft × 1.1 ÷ 0.5)",
      ],
      example: [
        "A 12 × 12 ft patio, 4 in compacted base, 20% compaction:",
        "base = 144 × 4 ÷ 12 × 1.2 = 57.6 cu ft (2.13 cu yd)",
        "tons = 2.13 × 1.5 = 3.20, or 116 bags of 0.5 cu ft",
        "sand = 12 cu ft, 27 bags with 10% extra",
      ],
      example2: [
        "A 12 × 40 ft driveway, 8 in base:",
        "base = 480 × 8 ÷ 12 × 1.2 = 384 cu ft (14.22 cu yd)",
        "tons = 14.22 × 1.5 = 21.33",
      ],
    },
    notCovered:
      "It estimates base and bedding sand for a flat paver area. It doesn't design drainage, account for slopes, or size the base for heavy trucks, poor soil or deep frost. For a driveway or soft ground, follow the paver maker's guide or a local installer.",
    tables: [
      {
        title: "Base tons by area and depth (crusher run, 20% compaction)",
        columns: [
          { label: "Area" },
          { label: "4 in", num: true },
          { label: "6 in", num: true },
          { label: "8 in", num: true },
        ],
        rows: [
          ["100 sq ft", "2.2", "3.3", "4.4"],
          ["200 sq ft", "4.4", "6.7", "8.9"],
          ["500 sq ft", "11.1", "16.7", "22.2"],
          ["1,000 sq ft", "22.2", "33.3", "44.4"],
        ],
        footnote: "Tons of crusher run (1.5 t/yd) including 20% for compaction. A cubic yard is 27 cu ft; #57 stone is a touch lighter at 1.4 t/yd.",
      },
    ],
    tips: [
      "Use angular crushed stone with fines, sold as crusher run, road base or paver base. Round pea gravel won't lock together.",
      "Compact the base in layers of about 2 inches, wetting it lightly, with a plate compactor.",
      "Dig the area wider than the pavers, about 6 inches past each edge, so the base supports the edge restraint.",
      "Past about a ton, bulk delivery is almost always cheaper than bags.",
    ],
    faqs: [
      {
        q: "How much paver base do I need?",
        a: "Multiply the area in square feet by the base depth in inches, divide by 12, then add about 20% for compaction. Divide by 27 for cubic yards and multiply by 1.5 for tons. A 12 by 12 foot patio at 4 inches needs about 3.2 tons.",
      },
      {
        q: "How deep should paver base be?",
        a: "About 4 inches for walkways and patios on firm soil, 6 inches on clay or soft ground, and about 8 inches for a residential driveway. Follow your paver maker's guide.",
      },
      {
        q: "How many bags of paver base do I need?",
        a: "About 116 bags of 0.5 cubic feet for a 12 by 12 foot patio at 4 inches, including compaction. Past a ton, bulk delivery is usually cheaper.",
      },
      {
        q: "Why add extra for compaction?",
        a: "Loose crushed stone shrinks by roughly a fifth when you compact it, so you need more loose stone than the finished base volume.",
      },
      {
        q: "How much sand do I need under pavers?",
        a: "About 1 inch of bedding sand. A 12 by 12 foot patio needs about 12 cubic feet, or 27 bags of 50-lb sand with 10% extra.",
      },
      {
        q: "What is the best base for pavers?",
        a: "Crushed stone with fines, sold as crusher run, road base or paver base, because it packs down hard. Avoid round gravel and plain dirt.",
      },
      {
        q: "How much paver base for a driveway?",
        a: "A 12 by 40 foot driveway with an 8 inch base needs about 14.2 cubic yards, or about 21.3 tons of crusher run including compaction.",
      },
    ],
    sources: ["Base depth and compaction (Belgard)", "Paver base bag size (Quikrete)", "2026 base prices"],
    related: [
      "paver-calculator",
      "retaining-wall-calculator",
      "gravel-calculator",
      "sand-calculator",
      "brick-calculator",
      "landscape-materials-calculator",
    ],
    lastUpdated: "2026-10-16",
    imageAlt: "Paver base diagram: compacted gravel base and bedding sand under pavers, with the length and width the calculator uses.",
  },

  /* ---------------------------------------------------------------- 24 (batch 3) */
  {
    slug: "retaining-wall-calculator",
    category: "landscaping",
    title: "Retaining Wall Calculator – Blocks, Caps, Gravel & Cost",
    metaDescription:
      "Work out how many retaining wall blocks and caps you need, plus base gravel, drainage stone and pipe. Pick your block size to get totals and cost.",
    h1: "Retaining Wall Calculator",
    primaryKeyword: "retaining wall calculator",
    secondaryKeywords: [
      "retaining wall block calculator",
      "how many retaining wall blocks do i need",
      "retaining wall cost calculator",
      "retaining wall blocks calculator",
    ],
    cardDescription: "How many retaining wall blocks and caps, plus base gravel, drainage stone and pipe.",
    shortAnswer:
      "A 20 foot retaining wall 2 feet high takes about 75 standard 6 by 16 inch blocks, including one buried course, plus 15 caps. You'll also need about 1.3 tons of base gravel and 2.6 tons of drainage stone. Enter your wall size and block below to get totals and cost.",
    howTo: [
      "Enter the wall length and the height above the ground. Add a section for each straight run.",
      "Pick your block size. Check the face height and length on the block's label.",
      "Keep the buried course on. Most walls need the first row set below ground.",
      "Read the blocks, caps, gravel and pipe, then add a few spare blocks for cuts.",
    ],
    formula: {
      plain: [
        "blocks per course = ceil(length ft ÷ block length ft)",
        "courses = ceil(height ft ÷ block height ft) + 1 buried course",
        "blocks = per course × courses,  with waste = ceil(blocks × (1 + waste%))",
        "base pad tons = length × 2 ft × 0.5 ft × 1.2 ÷ 27 × 1.5",
        "drainage tons = length × 1 ft × wall height ÷ 27 × 1.4",
      ],
      example: [
        "A 20 ft wall, 2 ft high, 6 × 16 blocks, buried course on:",
        "blocks per course = ceil(20 ÷ 1.33) = 15; courses = ceil(2 ÷ 0.5) + 1 = 5",
        "blocks = 15 × 5 = 75, plus 15 caps",
        "base 1.33 tons, drainage 2.59 tons, 20 ft of pipe",
      ],
      example2: [
        "A 30 ft wall, 3 ft high, 8 × 18 blocks:",
        "blocks = 20 per course × 6 courses = 120",
        "base 2.00 tons, drainage 6.22 tons",
      ],
    },
    notCovered:
      "It estimates materials for a straight, gravity-style block wall on firm ground. It doesn't design the wall, add geogrid, plan curves and corners exactly, or account for slopes, surcharges or poor soil. Walls over about 4 feet, or walls holding back a driveway or building, need an engineer and often a permit.",
    tables: [
      {
        title: "Blocks needed by wall size (buried course included, before waste)",
        columns: [
          { label: "Wall" },
          { label: "4 × 12", num: true },
          { label: "6 × 16", num: true },
          { label: "8 × 18", num: true },
        ],
        rows: [
          ["10 ft × 2 ft", 70, 40, 28],
          ["20 ft × 2 ft", 140, 75, 56],
          ["20 ft × 3 ft", 200, 105, 84],
          ["40 ft × 3 ft", 400, 210, 162],
        ],
        footnote: "Whole blocks including one buried course, before waste; add about 5% for cuts. Blocks per course = length ÷ block length, rounded up.",
      },
    ],
    tips: [
      "Set the first course perfectly level on a compacted gravel pad. Every course above it depends on it.",
      "Backfill behind the wall with clean drainage stone and a perforated pipe so water can't build up pressure.",
      "Each course steps back slightly into the slope. Use blocks with a built-in lip or setback, and follow the maker's guide.",
      "Glue the caps on with masonry adhesive so they stay put.",
    ],
    faqs: [
      {
        q: "How many retaining wall blocks do I need?",
        a: "Divide the wall length by the block length to get blocks per row, then divide the height by the block height for rows, and add one buried row. A 20 foot wall 2 feet high with 6 by 16 inch blocks needs about 75 blocks.",
      },
      {
        q: "How many retaining wall blocks are in a square foot?",
        a: "About 1.5 for a 6 by 16 inch block face, 3 for small 4 by 12 inch garden blocks, and 1 for large 8 by 18 inch blocks.",
      },
      {
        q: "How much gravel do I need for a retaining wall?",
        a: "For the base, about a 24 inch wide by 6 inch deep compacted pad. For drainage, about 12 inches of stone behind the wall. A 20 foot wall 2 feet high needs about 1.3 tons of base and 2.6 tons of drainage stone.",
      },
      {
        q: "Do I need to bury the first row of blocks?",
        a: "Usually, yes. Most makers recommend burying the first course, or about 1 inch for every 8 inches of wall height, so the wall doesn't slide.",
      },
      {
        q: "How tall can a retaining wall be without an engineer?",
        a: "Many areas allow about 4 feet before an engineered design and permit are needed, and less if the wall holds back a slope, driveway or building. Check your local code.",
      },
      {
        q: "Do retaining walls need drainage?",
        a: "Yes. Clean gravel behind the wall and a perforated drain pipe at the base let water out. Trapped water is the most common reason walls lean or fail.",
      },
      {
        q: "How much does a retaining wall cost?",
        a: "Block walls often run about $15 to $35 per square foot of wall face installed, depending on the block and site. Materials for a small DIY wall cost much less.",
      },
    ],
    sources: ["Block face sizes (Pavestone)", "Base pad and drainage (Allan Block)", "Height limit (CMHA)", "2026 retaining wall costs (HomeGuide)"],
    related: [
      "block-wall-calculator",
      "paver-calculator",
      "paver-base-calculator",
      "gravel-calculator",
      "fill-dirt-calculator",
      "concrete-block-calculator",
    ],
    lastUpdated: "2026-10-17",
    imageAlt: "Retaining wall diagram: base pad, buried course, setback blocks, cap, drainage stone and pipe, with the length and height the calculator uses.",
  },

  /* ---------------------------------------------------------------- 25 (batch 3) */
  {
    slug: "fill-dirt-calculator",
    category: "landscaping",
    title: "Fill Dirt Calculator – Cubic Yards, Tons & Truckloads",
    metaDescription:
      "Work out how much fill dirt you need to fill a hole, raise a yard or level a low spot. Get cubic yards, tons and dump truck loads, compaction included.",
    h1: "Fill Dirt Calculator",
    primaryKeyword: "fill dirt calculator",
    secondaryKeywords: [
      "how much fill dirt do i need",
      "calculate dirt fill",
      "how much dirt to fill a hole",
      "how many tons of fill dirt",
      "how much does a yard of fill dirt weigh",
    ],
    cardDescription: "How much fill dirt to fill a hole or raise a yard: cubic yards, tons and truckloads.",
    shortAnswer:
      "To raise a 20 by 30 foot area by 6 inches you need about 11 cubic yards of fill dirt, or about 13.3 cubic yards once you allow 20% for compaction. That's roughly 16 tons, or 2 dump truck loads. Enter your area or hole below to get yards, tons and truckloads.",
    howTo: [
      "Pick what you're filling: an area to raise, a hole or trench, a round hole, or a sloped spot.",
      "Enter the size in feet and the depth in inches or feet.",
      "Keep the compaction allowance. Fill dirt settles once it's packed down.",
      "Read the cubic yards, tons and truckloads, then round up when you order.",
    ],
    formula: {
      plain: [
        "cu ft = area (sq ft) × depth (in) ÷ 12   (hole: L × W × D; round: π × (d ÷ 2)² × D)",
        "sloped: area × ((depth1 + depth2) ÷ 2) ÷ 12",
        "cubic yards = cu ft ÷ 27,  with compaction = cu yd × (1 + 20%)",
        "tons = cu yd × 1.2,  loads = ceil(cu yd ÷ load size)",
      ],
      example: [
        "Raise a 20 × 30 ft area by 6 inches (20% compaction):",
        "cu ft = 600 × 6 ÷ 12 = 300, cubic yards = 300 ÷ 27 = 11.11",
        "with 20% = 13.33 cu yd, about 16 tons",
        "loads = ceil(13.33 ÷ 10) = 2 truckloads",
      ],
      example2: [
        "Fill a 4 × 4 × 3 ft hole:",
        "cu ft = 48, cubic yards = 1.78, with 20% = 2.13",
        "about 2.56 tons",
      ],
    },
    notCovered:
      "It estimates fill dirt volume and weight for a simple fill. It doesn't plan drainage or grading slopes, test soil, or design fill under a house, driveway or pool, which usually needs engineered fill and compaction testing. Weight changes a lot with moisture, so ask your supplier.",
    tables: [
      {
        title: "Fill dirt cubic yards by area and depth (20% compaction)",
        columns: [
          { label: "Area" },
          { label: "2 in", num: true },
          { label: "4 in", num: true },
          { label: "6 in", num: true },
          { label: "12 in", num: true },
        ],
        rows: [
          ["100 sq ft", "0.7", "1.5", "2.2", "4.4"],
          ["500 sq ft", "3.7", "7.4", "11.1", "22.2"],
          ["1,000 sq ft", "7.4", "14.8", "22.2", "44.4"],
          ["2,000 sq ft", "14.8", "29.6", "44.4", "88.9"],
        ],
        footnote: "Cubic yards including 20% for compaction. Multiply by about 1.2 for tons; a tandem dump truck holds about 10 cubic yards of dirt.",
      },
    ],
    tips: [
      "Fill dirt is subsoil with little organic matter, so it packs down well. Use topsoil only for the top few inches where you want grass or plants to grow.",
      "Spread and compact fill in layers of about 4 to 6 inches, watering lightly, instead of dumping it all at once.",
      "Ask whether the supplier sells by the yard or the ton, and how big their truck is, before you compare prices.",
      "Some suppliers and builders give away clean fill. Make sure it's free of trash, roots and large rocks.",
    ],
    faqs: [
      {
        q: "How much fill dirt do I need?",
        a: "Multiply the area in square feet by the depth in inches, divide by 12 for cubic feet, then divide by 27 for cubic yards. Add about 20% for compaction. Raising a 20 by 30 foot area by 6 inches takes about 13.3 cubic yards.",
      },
      {
        q: "How much does a yard of fill dirt weigh?",
        a: "About 1.2 tons, or 2,400 pounds, for typical dry fill. Wet or clay-heavy dirt can weigh 1.4 tons or more per yard.",
      },
      {
        q: "How much fill dirt to fill a hole?",
        a: "Multiply length, width and depth in feet, then divide by 27 for cubic yards and add about 20%. A 4 by 4 foot hole 3 feet deep takes about 2.1 cubic yards.",
      },
      {
        q: "How many yards of dirt are in a dump truck?",
        a: "A typical tandem dump truck carries about 10 to 14 cubic yards. Smaller trucks carry about 5. Ask your supplier for their load size.",
      },
      {
        q: "Why add extra for compaction?",
        a: "Loose fill dirt settles and packs down, often by about a fifth, so you need more loose dirt than the finished space you're filling.",
      },
      {
        q: "What is the difference between fill dirt and topsoil?",
        a: "Fill dirt is subsoil with little organic matter, used to fill and raise ground. Topsoil is the darker, richer top layer used for lawns and gardens. Use fill below and a few inches of topsoil on top.",
      },
      {
        q: "How much does fill dirt cost?",
        a: "Fill dirt often costs about $5 to $25 per cubic yard, plus delivery. It's usually much cheaper than topsoil.",
      },
    ],
    sources: ["Fill dirt weight and truck size (Ottr Supply)", "2026 fill dirt prices (HomeGuide)"],
    related: [
      "topsoil-calculator",
      "cubic-yard-calculator",
      "gravel-calculator",
      "sand-calculator",
      "retaining-wall-calculator",
    ],
    lastUpdated: "2026-10-18",
    imageAlt: "Fill dirt diagram: raising a low area in layers and filling a hole, with the measurements the calculator uses.",
  },
  /* ---------------------------------------------------------------- 26 */
  {
    slug: "landscape-rock-calculator",
    category: "landscaping",
    title: "Landscape Rock Calculator – Tons, Yards & Bags of Rock",
    metaDescription:
      "Find how much landscape rock you need for beds and borders. Pick river rock, lava rock or pebbles and a depth to get tons, cubic yards, bags and cost.",
    h1: "Landscape Rock Calculator",
    primaryKeyword: "landscape rock calculator",
    secondaryKeywords: [
      "landscaping rock calculator",
      "how much landscape rock do i need",
      "river rock calculator",
      "lava rock calculator",
      "how much does a ton of river rock cover",
    ],
    cardDescription: "How much decorative rock for beds and borders: tons, cubic yards, bags and cost by rock type.",
    shortAnswer:
      "A ton of river rock covers about 80 square feet at 3 inches deep, but a ton of lightweight lava rock covers about 196 square feet. A 10 by 20 foot bed at 3 inches needs about 1.85 cubic yards, which is 2.5 tons of river rock or about 1 ton of lava rock. Pick your rock and depth below to get tons, yards, bags and cost.",
    howTo: [
      "Measure each bed and pick a shape. Add more beds, or subtract plants and pavers.",
      "Choose the rock type. Lava rock weighs far less than river rock, so you need fewer tons.",
      "Pick a depth that suits the rock size: about 2 inches for small rock, 3 for medium, 4 for large.",
      "Keep 10% extra, then compare bulk and bagged cost.",
    ],
    formula: {
      plain: [
        "cu ft = area (sq ft) × depth (in) ÷ 12",
        "cubic yards = cu ft ÷ 27",
        "tons = cubic yards × density (river rock 1.35, lava rock 0.55, pebbles or marble 1.40 t/yd)",
        "bags = ceil(cu ft × (1 + waste) ÷ bag size)",
        "sq ft per ton = (27 ÷ density) ÷ (depth ÷ 12)",
      ],
      example: [
        "10 × 20 ft bed, 3 in deep, river rock:",
        "cu ft = 200 × 3 ÷ 12 = 50, cubic yards = 50 ÷ 27 = 1.85",
        "tons = 1.85 × 1.35 = 2.5 (lava rock 1.02, pebbles or marble 2.59)",
        "bags = 100 of 0.5 cu ft (110 with 10% waste)",
      ],
      example2: [
        "Tree ring 6 ft across, 3 in, river rock:",
        "area = π × 3² = 28.3 sq ft, cu ft = 7.07, cubic yards = 0.26",
        "tons = 0.35, bags = 15",
      ],
    },
    notCovered:
      "It estimates loose decorative rock for flat beds and borders. It doesn't count boulders, edging, landscape fabric or the base under walkways and driveways. Rock weights vary by size and moisture, so check the supplier's tons-per-yard figure before you order.",
    tables: [
      {
        title: "Landscape rock: cubic yards and tons by area (before waste)",
        columns: [
          { label: "Area" },
          { label: "cu yd at 2 in", num: true },
          { label: "cu yd at 3 in", num: true },
          { label: "River rock tons at 3 in", num: true },
          { label: "Lava rock tons at 3 in", num: true },
        ],
        rows: [
          ["50 sq ft", "0.31", "0.46", "0.6", "0.3"],
          ["100 sq ft", "0.62", "0.93", "1.3", "0.5"],
          ["200 sq ft", "1.23", "1.85", "2.5", "1.0"],
          ["500 sq ft", "3.09", "4.63", "6.3", "2.5"],
        ],
        footnote: "Cubic yards before waste. Multiply cubic yards by the density for tons: river rock 1.35, lava rock 0.55, pebbles or marble 1.40 tons per cubic yard. Add about 10% for waste when you order.",
      },
      {
        title: "How much one ton of rock covers (sq ft)",
        intro: "A ton of light lava rock spreads much further than a ton of river rock or pebbles, because it weighs less per cubic yard.",
        columns: [
          { label: "Rock type" },
          { label: "2 in deep", num: true },
          { label: "3 in deep", num: true },
          { label: "4 in deep", num: true },
        ],
        rows: [
          ["River rock (1.35 t/yd)", "120", "80", "60"],
          ["Lava rock (0.55 t/yd)", "295", "196", "147"],
          ["Pebbles or marble (1.40 t/yd)", "116", "77", "58"],
        ],
        footnote: "Square feet one ton covers at each depth: (27 ÷ density) ÷ (depth ÷ 12).",
      },
    ],
    tips: [
      "Lay landscape fabric under rock beds to keep weeds down and stop rock sinking into the soil.",
      "Use edging so rock doesn't spill into the lawn, where it can damage a mower.",
      "Rock is sold by the ton, but lava rock is often sold by the yard because it's so light. Ask before you compare prices.",
      "Bags are handy for small beds and accents. Past about half a ton, bulk is usually cheaper.",
    ],
    faqs: [
      {
        q: "How much landscape rock do I need?",
        a: "Multiply the bed's square feet by the depth in inches, divide by 12 for cubic feet, then by 27 for cubic yards. Multiply by about 1.35 for tons of river rock. A 10 by 20 foot bed at 3 inches needs about 2.5 tons.",
      },
      {
        q: "How much does a ton of river rock cover?",
        a: "About 120 square feet at 2 inches deep, 80 square feet at 3 inches and 60 square feet at 4 inches.",
      },
      {
        q: "How much does a ton of lava rock cover?",
        a: "About 196 square feet at 3 inches, because lava rock weighs only about 0.55 tons per cubic yard, less than half as much as river rock.",
      },
      {
        q: "How deep should landscape rock be?",
        a: "About 2 inches for small rock up to ¾ inch, 3 inches for 1 to 2 inch rock, and 4 inches for larger rock.",
      },
      {
        q: "How many bags of river rock do I need?",
        a: "About 100 bags of 0.5 cubic feet for a 10 by 20 foot bed at 3 inches, or 110 with 10% extra. Bulk is usually cheaper past about half a ton.",
      },
      {
        q: "How much does a yard of river rock weigh?",
        a: "About 1.35 tons, or 2,700 pounds. Larger rock and wet rock can weigh a little more.",
      },
      {
        q: "Should I put landscape fabric under rock?",
        a: "Usually, yes. It keeps weeds down and stops the rock working into the soil. Skip it in beds where you plan to add plants often.",
      },
    ],
    sources: [
      "Lava rock weight (Outdoor Warehouse Supply)",
      "Mexican beach pebble weight (Carroll's Building Materials)",
      "Depth by rock size (Earth Stone Rock)",
      "2026 landscape rock prices (HomeGuide)",
    ],
    related: [
      "gravel-calculator",
      "mulch-calculator",
      "landscape-materials-calculator",
      "pea-gravel-calculator",
      "paver-calculator",
    ],
    lastUpdated: "2026-10-20",
    imageAlt: "Landscape rock diagram: rock depth over landscape fabric, and suggested depth by rock size.",
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
