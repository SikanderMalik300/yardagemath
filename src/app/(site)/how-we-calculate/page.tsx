import Link from "next/link";
import { buildMetadata, utilityWebPageJsonLd } from "@/lib/seo";
import { ContentPage } from "@/components/ContentPage";
import { SourcesList } from "@/components/SourcesList";
import { SOURCES, type SourceKey } from "@/lib/sources";
import {
  MATERIAL_LABELS,
  DENSITY_TONS_PER_CUYD,
  BAG_SIZE_CUFT,
  CONCRETE_BAG_YIELD_CUFT,
  BLOCKS_PER_SQFT,
  BLOCKS_PER_MORTAR_BAG,
  GROUT_CUFT_PER_SQFT,
  GUTTER_SLOPE_PRESETS,
  RIPRAP_CLASSES,
  FIELD_EFFICIENCY_PRESETS,
  DEFAULT_WASTE,
} from "@/lib/constants";
import { ceilCount } from "@/lib/formulas/units";

export const metadata = buildMetadata({
  title: "How We Calculate",
  description:
    "The formulas, densities, bag yields, coverage and slope rules behind every YardageMath calculator, each with its source and the date checked.",
  path: "/how-we-calculate/",
});

const CHECKED = "October 8, 2026";

/** Inline "Sources: …" line linking the cited references for a section. */
function Cite({ keys }: { keys: SourceKey[] }) {
  return (
    <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "-0.5rem" }}>
      Sources:{" "}
      {keys.map((k, i) => (
        <span key={k}>
          {i > 0 && "; "}
          <a href={SOURCES[k].url} target="_blank" rel="noopener" style={{ textDecoration: "underline" }}>
            {SOURCES[k].publisher}
          </a>
        </span>
      ))}{" "}
      . Accessed {CHECKED}.
    </p>
  );
}

const ALL_SOURCE_KEYS: SourceKey[] = [
  "quikreteConcrete",
  "quikreteMortar",
  "quikreteMortarCalc",
  "ncmaTek",
  "asabeD497",
  "isuFieldCapacity",
  "fhwaHec11",
  "nchrp568",
  "inchGravel",
  "inchSand",
  "cuydWeightChart",
  "pnnlGutters",
  "englertGutters",
  "slabCost2026",
  "lawnCost2026",
];

function SimpleTable({ head, rows, caption }: { head: string[]; rows: (string | number)[][]; caption: string }) {
  return (
    <div className="table-wrapper" style={{ marginBottom: "1.5rem" }}>
      <table>
        <caption style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>
          {caption}
        </caption>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col" className={i > 0 ? "num" : undefined}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className={j > 0 ? "num" : undefined}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function HowWeCalculatePage() {
  return (
    <ContentPage
      title="How We Calculate"
      intro="Every number our calculators show comes from the sources below. Values are checked against the sources listed. Materials vary, so every value is editable in the calculator. Confirm final quantities with your supplier."
      updated="2026-10-22"
      jsonLd={utilityWebPageJsonLd({ path: "/how-we-calculate/", name: "How We Calculate", datePublished: "2026-10-07", dateModified: "2026-10-22", withAuthor: true })}
    >
      <h2>Core formulas</h2>
      <p>All volume tools share the same geometry, done in feet and converted at the end:</p>
      <ul>
        <li>Volume (cu ft) = area (sq ft) × depth (ft)</li>
        <li>Cubic yards = cubic feet ÷ 27 (a cubic yard is 3 × 3 × 3 ft)</li>
        <li>Cubic meters = cubic yards × 0.764555</li>
        <li>Tons = cubic yards × material density</li>
        <li>Bags = volume (cu ft) ÷ bag size, rounded up</li>
        <li>Feet + inches → decimal feet = feet + inches ÷ 12</li>
      </ul>

      <h2>Material densities (tons per cubic yard)</h2>
      <p>
        Nominal dry, loose values aggregated from landscape-supply yards and USDA/engineering
        references. Bulk density changes with moisture and material; confirm tonnage with your
        supplier. Checked {CHECKED}.
      </p>
      <SimpleTable
        caption="Material densities in tons per cubic yard"
        head={["Material", "Tons / cu yd"]}
        rows={Object.entries(DENSITY_TONS_PER_CUYD).map(([k, v]) => [
          MATERIAL_LABELS[k as keyof typeof MATERIAL_LABELS],
          v,
        ])}
      />
      <Cite keys={["inchGravel", "inchSand", "cuydWeightChart"]} />

      <h2>Bag sizes (cubic feet per bag)</h2>
      <SimpleTable
        caption="Bag sizes in cubic feet per bag"
        head={["Material", "Cu ft / bag"]}
        rows={[
          ["Mulch", BAG_SIZE_CUFT.mulch],
          ["Gravel / sand", BAG_SIZE_CUFT.gravel],
          ["Soil (40 lb)", BAG_SIZE_CUFT.soil],
          ["Soil (large)", BAG_SIZE_CUFT.soil1],
          ["Compost", BAG_SIZE_CUFT.compost],
        ]}
      />

      <h2>Concrete bag yields</h2>
      <p>Mixed-concrete yield per bag, per the manufacturer data sheet (Quikrete). Checked {CHECKED}.</p>
      <SimpleTable
        caption="Concrete bag yields in cubic feet"
        head={["Bag", "Cu ft yield", "Bags per cu yd"]}
        rows={[
          ["80 lb", CONCRETE_BAG_YIELD_CUFT.lb80, ceilCount(27 / CONCRETE_BAG_YIELD_CUFT.lb80)],
          ["60 lb", CONCRETE_BAG_YIELD_CUFT.lb60, ceilCount(27 / CONCRETE_BAG_YIELD_CUFT.lb60)],
          ["40 lb", CONCRETE_BAG_YIELD_CUFT.lb40, ceilCount(27 / CONCRETE_BAG_YIELD_CUFT.lb40)],
        ]}
      />
      <Cite keys={["quikreteConcrete"]} />

      <h2>Concrete block (CMU)</h2>
      <ul>
        <li>
          Blocks per sq ft = 144 ÷ (8 × 16) = <strong>{BLOCKS_PER_SQFT}</strong> (112.5 per 100 sq ft)
        </li>
        <li>Mortar ≈ {BLOCKS_PER_MORTAR_BAG} standard blocks per 80-lb bag (matches Quikrete&apos;s Mortar Mix calculator)</li>
        <li>
          Core-fill grout per sq ft of fully grouted wall: 6″ = {GROUT_CUFT_PER_SQFT.in6}, 8″ ={" "}
          {GROUT_CUFT_PER_SQFT.in8}, 12″ = {GROUT_CUFT_PER_SQFT.in12} cu ft (the net core volume; per
          block = per sq ft ÷ 1.125). A manufacturer core-fill grout confirms about 0.26 cu ft per sq
          ft for 8-inch block.
        </li>
      </ul>
      <Cite keys={["ncmaTek", "tccCoreFill", "quikreteMortar", "quikreteMortarCalc"]} />

      <h2>Concrete footings</h2>
      <p>
        Footing concrete uses the same geometry as the slab and column tools: strip = L × W × D, pads
        = L × W × D × quantity, piers = 3.1416 × (d ÷ 2)² × D × quantity, then ÷ 27 for cubic yards. Footing
        size and depth (commonly about twice the wall width, at least 12 in wide and 6 in thick, and
        below the frost line) follow IRC R403.1 and your local code.
      </p>
      <Cite keys={["ircR403", "quikreteConcrete"]} />

      <h2>Mulch</h2>
      <p>
        Mulch volume uses the shared area and yard math: cu ft = area × depth ÷ 12, then ÷ 27 for cubic
        yards. One cubic yard covers 324 ÷ depth square feet (108 sq ft at 3 in). Recommended depth is 2
        to 4 inches (3 in is a good default), kept a few inches off trunks and stems. A standard bag is 2
        cu ft and covers about 8 sq ft at 3 in, so 13.5 bags make a cubic yard. Default prices are 2026
        estimates: about $40/cu yd bulk and $4 for a 2 cu ft bag.
      </p>
      <Cite keys={["kstateMulch", "mulchBag2026", "mulchCost2026"]} />

      <h2>Gravel</h2>
      <p>
        Gravel uses the same area and yard math: cu ft = area × depth ÷ 12, then ÷ 27 for cubic yards,
        and tons = cubic yards × density. Typical crushed stone, #57 and pea gravel weigh about 1.4
        tons per cubic yard (2,800 lb); river rock is a little lighter (about 1.35) and crusher run or
        road base packs heavier (about 1.5). One ton covers (27 ÷ density) ÷ (depth ÷ 12) square feet,
        so about 77 sq ft at 3 in or 58 sq ft at 4 in for 1.4-ton gravel. For a new driveway, builders
        commonly lay 4 to 6 inches of crusher run or larger stone as a base, with a couple of inches of
        #57 or similar on top. The default price is a 2026 estimate of about $45 per ton.
      </p>
      <Cite keys={["gravelDensity57", "gravelDriveway", "gravelCost2026"]} />

      <h2>Sand</h2>
      <p>
        Sand uses the same area and yard math: cu ft = area × depth ÷ 12, then ÷ 27 for cubic yards,
        and tons = cubic yards × density. Dry play, mason or concrete sand weighs about 1.35 tons per
        cubic yard (2,700 lb, at roughly 100 lb per cubic foot); damp sand holds water in the gaps and
        runs about 1.5 tons per yard or more. Because 50 lb at 100 lb per cubic foot is half a cubic
        foot, a 50-lb bag is about 0.5 cu ft, so a ton (about 20 cu ft of dry sand) is close to 40
        bags. One ton covers (27 ÷ density) ÷ (depth ÷ 12) square feet, so about 120 sq ft at 2 in or
        240 sq ft at 1 in for bedding. Under pavers, the bedding sand is a uniform 1 inch over a
        compacted gravel base. Default prices are 2026 estimates: about $40 per ton and $6 for a 50-lb
        bag.
      </p>
      <Cite keys={["sandSupplierWeight", "paverBedBelgard", "sandCost2026"]} />

      <h2>Brick</h2>
      <p>
        Bricks per square foot of wall face come from the Brick Industry Association, using a 3/8 inch
        mortar joint: a standard modular brick (3.625 × 2.25 × 7.625 in) takes 6.75 per sq ft, queen 5.76, king
        4.80 and utility 3.00. For a custom brick, bricks per sq ft = 144 ÷ ((length + joint) × (height
        + joint)). Multiply by the net wall area (after subtracting doors and windows) and by the number
        of wythes, then add 5% waste for a plain wall or 10% for lots of cuts. Mortar uses the Quikrete
        Mortar Mix data sheet: one 80-lb bag lays about 37 standard bricks, so bags = bricks ÷ 37,
        rounded up. Default prices are 2026 estimates: about $0.70 per modular brick and $7.50 for an
        80-lb bag of mortar.
      </p>
      <Cite keys={["biaTn10", "quikreteMortar", "homeGuideBrick"]} />

      <h2>Pavers</h2>
      <p>
        Pavers per square foot come from the nominal size: pavers per sq ft = 144 ÷ (length × width in
        inches). A 4 by 8 inch paver takes 4.5 per sq ft, 6 by 6 takes 4, 6 by 9 about 2.67, and a 12
        by 12 inch slab is 1 per sq ft. Add about 5% for a running bond, 10% for herringbone and up to
        15% for a 45 degree or curved layout. The base and bedding reuse the gravel and sand math: a
        patio or walkway uses about 4 inches of compacted crusher run (1.5 tons per cubic yard) and 1
        inch of bedding sand (1.35 tons per cubic yard, 0.5 cu ft bags), each with about 10% for
        compaction. Edging is the perimeter of the area. Default prices are 2026 estimates: about $0.65
        per 4 by 8 concrete paver.
      </p>
      <Cite keys={["nicolockPaver", "paverBedBelgard", "homeGuidePaver"]} />

      <h2>Paver base</h2>
      <p>
        The gravel base reuses the volume and yard math with a compaction allowance: base cu ft = area
        × depth ÷ 12 × (1 + compaction), then ÷ 27 for cubic yards and × 1.5 for tons of crusher run
        (1.4 for #57 stone). Loose crushed stone packs down when you compact it, so you order more than
        the finished volume; we default to about 20%, which sits in the 15 to 20% range for dense-graded
        crusher run. Base depth follows the install guide: about 4 inches for a walkway or patio, 6
        inches on clay or soft soil, and 8 inches for a residential driveway, compacted in lifts no
        greater than 4 to 6 inches. Bedding sand is 1 inch with 10% extra, in 0.5 cu ft bags. Default
        prices are 2026 estimates: about $45 per ton bulk, $6 for a 0.5 cu ft base bag, and $6 for a
        bag of bedding sand.
      </p>
      <Cite keys={["paverBedBelgard", "quikretePaverBase", "gravelCost2026"]} />

      <h2>Retaining wall (segmental block)</h2>
      <p>
        Blocks per square foot of face come from the block size: 144 ÷ (face height × length in
        inches), so a 6 by 16 inch block is 1.5 per sq ft, 4 by 12 is 3 and 8 by 18 is 1. For the count
        we work whole blocks: blocks per course = ceil(length ÷ block length), courses = ceil(height ÷
        block height) plus one buried course, and blocks = per course × courses. Makers recommend
        burying the first course, roughly 1 inch for every 8 inches of height. The base leveling pad is
        about 24 inches wide and 6 inches deep of crushed stone (with 20% for compaction, 1.5 tons per
        cubic yard), and drainage stone is about 12 inches wide behind the full wall height in #57
        stone (1.4 tons per cubic yard), with a perforated pipe at the base. Walls over about 4 feet
        measured from the base pad need an engineered design and a permit. Default prices are 2026
        estimates: about $4 per block and cap, $1.50 per foot of pipe, and $15 to $35 per square foot
        installed.
      </p>
      <Cite keys={["pavestoneWallBlock", "allanBlockInstall", "cmhaSrwHeight", "homeGuideRetainingWall"]} />

      <h2>Fill dirt</h2>
      <p>
        Fill dirt uses the shared yard math with a compaction allowance. Cubic feet = area × depth ÷ 12
        (a hole is length × width × depth, a round hole is 3.1416 × radius² × depth, and a sloped spot uses
        the average of the two end depths), then ÷ 27 for cubic yards. Loose fill settles when it is
        packed, so we add about 20% for compaction, which sits inside the 10 to 25% that common soil
        shrinks. Typical fill dirt weighs about 1.2 tons per cubic yard (2,400 lb); wet or clay-heavy
        dirt runs about 1.4 tons. A tandem dump truck carries about 10 cubic yards of dirt (up to 14
        by volume), so loads = cubic yards with compaction ÷ load size, rounded up. Default prices are
        2026 estimates: about $15 per cubic yard (within $5 to $25) plus a delivery fee.
      </p>
      <Cite keys={["ottrFillDirt", "homeGuideFillDirt"]} />

      <h2>Landscape rock</h2>
      <p>
        Decorative rock uses the shared yard math: cubic feet = area × depth ÷ 12, then ÷ 27 for cubic
        yards, and tons = cubic yards × density. Bags = cubic feet × (1 + waste) ÷ bag size, rounded up,
        and the coverage of one ton = (27 ÷ density) ÷ (depth ÷ 12). Rock weight varies a lot by type:
        river rock about 1.35 tons per cubic yard (2,700 lb, the shared value), heavy Mexican beach
        pebbles about 1.40 tons (Carroll&apos;s Building Materials lists 2,400 to 2,900 lb) and white marble
        chips about 1.40 tons (Patuxent Nursery lists 2,800 lb), and
        lightweight, porous lava rock only about 0.55 tons (roughly 900 to 1,300 lb), so a ton of lava
        rock covers more than twice the area of a ton of river rock. We suggest depth by rock size,
        about 2 inches for small rock, 3 for medium and 4 for larger rock, and a 0.5 cubic foot bag.
        Default bulk prices are 2026 estimates, per ton by type: river rock about $80 (within $45 to
        $130), lava rock about $130 ($80 to $240), pebbles about $500 ($475 to $800) and marble about
        $700, plus about $7 per 0.5 cubic foot bag.
      </p>
      <Cite keys={["owsLavaRock", "carrollsPebbles", "patuxentMarble", "earthStoneRockSizes", "quikretePaverBase", "homeGuideLandscapeRock"]} />

      <h2>Asphalt</h2>
      <p>
        Asphalt uses the shared area math, then weight from a unit weight. Cubic feet = area × thickness
        ÷ 12; tons = cubic feet × density ÷ 2,000; square yards = sq ft ÷ 9; and one ton covers (2,000 ÷
        density) ÷ (thickness ÷ 12) square feet. Compacted hot mix asphalt weighs about 145 pounds per
        cubic foot, which matches the Asphalt Institute rule of thumb of about 110 pounds per square yard
        per inch of compacted thickness, so a ton covers about 55 square feet at 3 inches. Recycled
        asphalt millings are lighter, about 120 pounds per cubic foot (PennDOT lists reclaimed asphalt
        pavement at 120 to 140 lb/ft³, and 100 to 125 compacted). Residential driveways are usually 2 to
        3 inches of compacted asphalt over 4 to 8 inches of compacted gravel base. We keep 5% for waste
        and size truckloads at 20 tons for a tri-axle (loads = tons with waste ÷ truck tons, rounded up).
        An optional gravel base uses crusher run at 1.5 tons per cubic yard with 20% compaction. Default
        prices are 2026 estimates: hot mix about $60 per ton (within $40 to $80) and an installed
        estimate about $8 per square foot (within $5 to $12 for a driveway).
      </p>
      <Cite keys={["asphaltInstituteWeight", "iapaDriveway", "penndotRap", "gernattTruck", "homeGuideAsphaltDriveway", "homeGuideAsphaltPrices"]} />

      <h2>Fence post concrete</h2>
      <p>
        Concrete for a post fills the hole around it. Concrete depth = hole depth - gravel; the hole
        volume = 3.1416 × (diameter ÷ 2)² × concrete depth (a round post subtracts 3.1416 × (post
        diameter ÷ 2)² × depth, a square post subtracts width × length × depth), all in cubic inches,
        divided by 1,728 for cubic feet per post. Bags = total cubic feet × (1 + waste) ÷ bag yield,
        rounded up. Fast-setting mix yields about 0.375 cu ft per 50 lb bag and sets in 20 to 40 minutes;
        the 80, 60 and 40 lb regular bags yield 0.60, 0.45 and 0.30 cu ft. For sizing a hole we use the
        common rule of about 3 times the post width across, and a depth of about one third of the post&apos;s
        total length plus 6 inches of gravel for drainage. Go below the local frost line where
        code requires it.
      </p>
      <Cite keys={["quikreteFastSet", "quikreteSettingPosts", "quikreteConcrete"]} />

      <h2>Sod</h2>
      <p>
        Sod uses the shared area math. Net area = sum of the areas minus any cut-outs; order = net ×
        (1 + waste); pallets = net-with-waste ÷ pallet coverage, rounded up; and pieces = net-with-waste
        ÷ piece area, rounded up, where a 16 by 24 inch slab is 2.67 sq ft and a 2 by 5 ft roll is 10 sq
        ft. We default to 5% waste (extension guides suggest about 5%, up to 10% for curvy yards) and a
        450 sq ft pallet, though pallet coverage runs about 400 to 500 sq ft and varies by farm. Default
        prices are 2026 estimates: about $0.50 per sq ft for the grass (within $0.30 to $0.80) and an
        installed estimate about $1.50 per sq ft (within $1 to $2).
      </p>
      <Cite keys={["grassOutletPallet", "ctSodPallet", "msuSod", "homeGuideSod"]} />

      <h2>Grass seed</h2>
      <p>
        Seed uses the same area math (acres convert at 43,560 sq ft). Pounds = area ÷ 1,000 × the
        seeding rate for your grass; bags = pounds ÷ bag size, rounded up; and leftover = bags × bag
        size - pounds. Rates are pounds per 1,000 sq ft for a new lawn, with overseeding at about half
        that. New-lawn defaults follow university extension ranges: Kentucky bluegrass 2 to 3, turf-type
        tall fescue and perennial ryegrass 6 to 8, fine fescue 4 to 5, hulled bermudagrass 1 to 2,
        zoysiagrass 1 to 3, centipedegrass 0.25 to 1, and bahiagrass 3 to 8. A 20 lb bag of tall fescue
        runs about $67 (2026). If your seed bag lists its own rate, use the custom setting.
      </p>
      <Cite keys={["pennStateSeed", "ncStateLawns", "ugaLawns", "scottsSeed"]} />

      <h2>Acres per hour &amp; field efficiency</h2>
      <p>
        Acres per hour = (width in inches × mph × efficiency) ÷ 99 (equivalently width ft × mph ×
        efficiency ÷ 8.25). The constant converts 5,280 ft/mile and 43,560 sq ft/acre. Efficiency
        presets follow ASABE field-efficiency ranges:
      </p>
      <SimpleTable
        caption="Mower field-efficiency presets"
        head={["Equipment", "Efficiency"]}
        rows={FIELD_EFFICIENCY_PRESETS.map((p) => [p.label, `${Math.round(p.eff * 100)}%`])}
      />
      <Cite keys={["asabeD497", "isuFieldCapacity"]} />

      <h2>Gutter slope</h2>
      <p>Drop (in) = (run length ÷ 10) × slope per 10 ft. Presets follow manufacturer install guides:</p>
      <SimpleTable caption="Gutter slope presets" head={["Preset", "Inches per 10 ft"]} rows={GUTTER_SLOPE_PRESETS.map((p) => [p.label, p.inchPer10ft])} />
      <Cite keys={["pnnlGutters", "englertGutters"]} />

      <h2>Riprap stone classes</h2>
      <p>Representative gradations and layer thicknesses, per FHWA HEC-11 and NCHRP 568; your state DOT tables govern.</p>
      <SimpleTable
        caption="Riprap stone classes"
        head={["Class", "D50 size", "Layer thickness"]}
        rows={RIPRAP_CLASSES.map((c) => [c.label, c.d50In, `${c.thicknessIn}"`])}
      />
      <Cite keys={["fhwaHec11", "nchrp568"]} />

      <h2>Rounding &amp; waste</h2>
      <p>
        Results are rounded for display (usually to two decimals); counts of bags, blocks and bars
        are always rounded up so you don&apos;t come up short. Default waste allowances: yardage{" "}
        {DEFAULT_WASTE.yardage}%, concrete slab {DEFAULT_WASTE.concreteSlab}%, block{" "}
        {DEFAULT_WASTE.block}%, carpet {DEFAULT_WASTE.carpet}%. You can change the waste percentage
        on every tool.
      </p>

      <h2>Concrete slab installed cost</h2>
      <p>
        The slab calculator can show a materials-only (DIY) total or an installed total with labor.
        A finished slab runs about $6 to $12 per square foot installed, averaging around $8. We default
        labor to $4 per square foot, the midpoint of a 2026 placing-and-finishing range of $3 to $5,
        and welded wire mesh to about $0.35 per square foot for a basic slab. By project the installed
        range is about $4 to $12 per sq ft for a basic patio or walkway, $6 to $15 for a driveway, $6
        to $12 for a garage floor and $8 to $19 for stamped or colored concrete. Local prices vary a
        lot, so get two or three quotes.
      </p>
      <Cite keys={["homeGuideSlab", "homeGuideRebar"]} />

      <h2>Prices</h2>
      <p>
        All prices are editable 2026 national-average <em>estimates</em> for planning, not quotes.
        The default ready-mix price (~$160/cu yd) and lawn-mowing tiers sit within the ranges in the
        2026 cost guides below; confirm with a local supplier. See the{" "}
        <Link href="/disclaimer/">disclaimer</Link>.
      </p>
      <Cite keys={["slabCost2026", "lawnCost2026"]} />

      <h2>References</h2>
      <p>Every figure above links to the source it was checked against. Full list:</p>
      <SourcesList sources={ALL_SOURCE_KEYS.map((k) => SOURCES[k])} />

      <p style={{ marginTop: "1.5rem" }}>
        For how these pages are written, checked and corrected, see our{" "}
        <Link href="/editorial-policy/">editorial policy</Link>.
      </p>
    </ContentPage>
  );
}
