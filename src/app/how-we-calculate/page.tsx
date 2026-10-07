import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { ContentPage } from "@/components/ContentPage";
import { SourcesList } from "@/components/SourcesList";
import { SOURCES, type SourceKey } from "@/lib/sources";
import {
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

export const metadata = buildMetadata({
  title: "How We Calculate",
  description:
    "The formulas, densities, bag yields, coverage figures and slope rules behind every YardageMath calculator — each with its source and the date it was checked.",
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
      — accessed {CHECKED}.
    </p>
  );
}

const ALL_SOURCE_KEYS: SourceKey[] = [
  "quikreteConcrete",
  "quikreteMortar",
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

function SimpleTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="table-wrapper" style={{ marginBottom: "1.5rem" }}>
      <table>
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
      intro="Every number our calculators show comes from the list below. Figures marked “verify” are industry or manufacturer values; because materials and prices vary, we let you edit them and we confirm them against the cited source."
      updated="2026-10-07"
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
        references. Bulk density changes with moisture and material — confirm tonnage with your
        supplier. Checked {CHECKED}.
      </p>
      <SimpleTable
        head={["Material", "Tons / cu yd"]}
        rows={Object.entries(DENSITY_TONS_PER_CUYD).map(([k, v]) => [k, v])}
      />
      <Cite keys={["inchGravel", "inchSand", "cuydWeightChart"]} />

      <h2>Bag sizes (cubic feet per bag)</h2>
      <SimpleTable
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
      <p>Mixed-concrete yield per bag — verify against the bag label (Quikrete / Sakrete). Checked {CHECKED}.</p>
      <SimpleTable
        head={["Bag", "Cu ft yield", "Bags per cu yd"]}
        rows={[
          ["80 lb", CONCRETE_BAG_YIELD_CUFT.lb80, Math.ceil(27 / CONCRETE_BAG_YIELD_CUFT.lb80)],
          ["60 lb", CONCRETE_BAG_YIELD_CUFT.lb60, Math.ceil(27 / CONCRETE_BAG_YIELD_CUFT.lb60)],
          ["40 lb", CONCRETE_BAG_YIELD_CUFT.lb40, Math.ceil(27 / CONCRETE_BAG_YIELD_CUFT.lb40)],
        ]}
      />
      <Cite keys={["quikreteConcrete"]} />

      <h2>Concrete block (CMU)</h2>
      <ul>
        <li>
          Blocks per sq ft = 144 ÷ (8 × 16) = <strong>{BLOCKS_PER_SQFT}</strong> (112.5 per 100 sq ft)
        </li>
        <li>Mortar ≈ {BLOCKS_PER_MORTAR_BAG} standard blocks per 80 lb bag (verify: Quikrete Mortar Mix)</li>
        <li>
          Core-fill grout per sq ft of wall (NCMA TEK, verify): 6″ = {GROUT_CUFT_PER_SQFT.in6}, 8″ ={" "}
          {GROUT_CUFT_PER_SQFT.in8}, 12″ = {GROUT_CUFT_PER_SQFT.in12} cu ft
        </li>
      </ul>
      <Cite keys={["ncmaTek", "quikreteMortar"]} />

      <h2>Acres per hour &amp; field efficiency</h2>
      <p>
        Acres per hour = (width in inches × mph × efficiency) ÷ 99 (equivalently width ft × mph ×
        efficiency ÷ 8.25). The constant converts 5,280 ft/mile and 43,560 sq ft/acre. Efficiency
        presets follow ASABE field-efficiency ranges (verify):
      </p>
      <SimpleTable
        head={["Equipment", "Efficiency"]}
        rows={FIELD_EFFICIENCY_PRESETS.map((p) => [p.label, `${Math.round(p.eff * 100)}%`])}
      />
      <Cite keys={["asabeD497", "isuFieldCapacity"]} />

      <h2>Gutter slope</h2>
      <p>Drop (in) = (run length ÷ 10) × slope per 10 ft. Presets (verify with manufacturer guides):</p>
      <SimpleTable head={["Preset", "Inches per 10 ft"]} rows={GUTTER_SLOPE_PRESETS.map((p) => [p.label, p.inchPer10ft])} />
      <Cite keys={["pnnlGutters", "englertGutters"]} />

      <h2>Riprap stone classes</h2>
      <p>Representative gradations and layer thicknesses — verify against your state DOT tables.</p>
      <SimpleTable
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
    </ContentPage>
  );
}
