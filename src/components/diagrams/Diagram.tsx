/**
 * Original inline-SVG diagrams (build-spec A5, design.md §16).
 * Neutral lines, one restrained accent, accessible <title>. No stock art.
 */
import type { CategorySlug } from "@/data/calculators";

const BRAND = "#236b4b";
const LINE = "#53605a";
const SOFT = "#e7f1eb";

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 320 180"
      role="img"
      aria-label={title}
      style={{ width: "100%", height: "auto", maxWidth: 360, display: "block" }}
    >
      <title>{title}</title>
      {children}
    </svg>
  );
}

function VolumeBox({ title }: { title: string }) {
  return (
    <Frame title={title}>
      <polygon points="40,70 200,70 240,45 80,45" fill={SOFT} stroke={LINE} strokeWidth="1.5" />
      <polygon points="200,70 200,130 240,105 240,45" fill="#d9e6de" stroke={LINE} strokeWidth="1.5" />
      <polygon points="40,70 200,70 200,130 40,130" fill="#fff" stroke={LINE} strokeWidth="1.5" />
      <text x="120" y="150" textAnchor="middle" fill={BRAND} fontSize="13" fontWeight="600">Length</text>
      <text x="25" y="104" textAnchor="middle" fill={BRAND} fontSize="13" fontWeight="600" transform="rotate(-90 25 104)">Width</text>
      <text x="255" y="78" textAnchor="start" fill={BRAND} fontSize="13" fontWeight="600">Depth</text>
    </Frame>
  );
}

function WallCourses({ title }: { title: string }) {
  return (
    <Frame title={title}>
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={30 + col * 52 + (row % 2) * 6}
            y={40 + row * 26}
            width="48"
            height="22"
            rx="2"
            fill="#fff"
            stroke={LINE}
            strokeWidth="1.3"
          />
        ))
      )}
      <rect x="30" y="34" width="266" height="6" fill={SOFT} stroke={LINE} strokeWidth="1" />
      <text x="163" y="162" textAnchor="middle" fill={BRAND} fontSize="13" fontWeight="600">Wall length</text>
      <text x="18" y="96" textAnchor="middle" fill={BRAND} fontSize="13" fontWeight="600" transform="rotate(-90 18 96)">Height</text>
    </Frame>
  );
}

function GutterSlopeDiagram({ title }: { title: string }) {
  return (
    <Frame title={title}>
      <line x1="30" y1="55" x2="290" y2="95" stroke={BRAND} strokeWidth="4" strokeLinecap="round" />
      <line x1="30" y1="55" x2="30" y2="120" stroke={LINE} strokeWidth="1" strokeDasharray="3 3" />
      <line x1="290" y1="95" x2="290" y2="120" stroke={LINE} strokeWidth="1" strokeDasharray="3 3" />
      <line x1="30" y1="120" x2="290" y2="120" stroke={LINE} strokeWidth="1" />
      <rect x="283" y="95" width="14" height="45" fill={SOFT} stroke={LINE} strokeWidth="1.3" />
      <text x="160" y="140" textAnchor="middle" fill={BRAND} fontSize="13" fontWeight="600">Run length</text>
      <text x="150" y="60" textAnchor="middle" fill={LINE} fontSize="12">High end</text>
      <text x="255" y="90" textAnchor="middle" fill={LINE} fontSize="12">Low / drop</text>
    </Frame>
  );
}

function MowerPath({ title }: { title: string }) {
  return (
    <Frame title={title}>
      <rect x="35" y="35" width="250" height="110" rx="4" fill={SOFT} stroke={LINE} strokeWidth="1.3" />
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="45"
          x2="275"
          y1={55 + i * 24}
          y2={55 + i * 24}
          stroke={BRAND}
          strokeWidth="6"
          opacity={0.25 + i * 0.18}
          strokeLinecap="round"
        />
      ))}
      <text x="160" y="165" textAnchor="middle" fill={BRAND} fontSize="13" fontWeight="600">Working width × passes</text>
    </Frame>
  );
}

/** Yards of concrete: slab, strip footing and round column side by side. */
function ConcreteShapes({ title }: { title: string }) {
  return (
    <Frame title={title}>
      {/* Slab */}
      <polygon points="28,78 86,78 100,66 42,66" fill={SOFT} stroke={LINE} strokeWidth="1.3" />
      <polygon points="86,78 100,66 100,92 86,104" fill="#d9e6de" stroke={LINE} strokeWidth="1.3" />
      <polygon points="28,78 86,78 86,104 28,104" fill="#fff" stroke={LINE} strokeWidth="1.3" />
      <text x="57" y="118" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600">L</text>
      <text x="20" y="94" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600" transform="rotate(-90 20 94)">W</text>
      <text x="105" y="84" textAnchor="start" fill={BRAND} fontSize="11" fontWeight="600">T</text>
      <text x="60" y="140" textAnchor="middle" fill={LINE} fontSize="11">Slab</text>

      {/* Strip footing */}
      <polygon points="132,66 176,66 190,54 146,54" fill={SOFT} stroke={LINE} strokeWidth="1.3" />
      <polygon points="176,66 190,54 190,96 176,108" fill="#d9e6de" stroke={LINE} strokeWidth="1.3" />
      <polygon points="132,66 176,66 176,108 132,108" fill="#fff" stroke={LINE} strokeWidth="1.3" />
      <text x="154" y="122" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600">L</text>
      <text x="124" y="90" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600" transform="rotate(-90 124 90)">W</text>
      <text x="195" y="86" textAnchor="start" fill={BRAND} fontSize="11" fontWeight="600">D</text>
      <text x="158" y="140" textAnchor="middle" fill={LINE} fontSize="11">Footing</text>

      {/* Round column */}
      <path d="M236 64 V104 A24 8 0 0 0 284 104 V64" fill="#fff" stroke={LINE} strokeWidth="1.3" />
      <ellipse cx="260" cy="64" rx="24" ry="8" fill={SOFT} stroke={LINE} strokeWidth="1.3" />
      <text x="260" y="50" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600">d</text>
      <text x="226" y="88" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600" transform="rotate(-90 226 88)">h</text>
      <text x="260" y="140" textAnchor="middle" fill={LINE} fontSize="11">Column</text>
    </Frame>
  );
}

/** Concrete block weight: a standard 8x8x16 block and a 90-block pallet. */
function BlockWeightDiagram({ title }: { title: string }) {
  return (
    <Frame title={title}>
      {/* CMU block, 3D with two cores */}
      <polygon points="28,64 116,64 136,52 48,52" fill={SOFT} stroke={LINE} strokeWidth="1.3" />
      <polygon points="116,64 136,52 136,98 116,110" fill="#d9e6de" stroke={LINE} strokeWidth="1.3" />
      <polygon points="28,64 116,64 116,110 28,110" fill="#fff" stroke={LINE} strokeWidth="1.3" />
      <polygon points="50,62 74,62 86,54 62,54" fill="#fff" stroke={LINE} strokeWidth="1" />
      <polygon points="84,62 108,62 120,54 96,54" fill="#fff" stroke={LINE} strokeWidth="1" />
      <text x="82" y="128" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600">8 × 8 × 16 block</text>
      <text x="82" y="142" textAnchor="middle" fill={LINE} fontSize="9.5">≈ 38 lb normal · ≈ 28 lb lightweight</text>

      {/* Pallet stack of blocks */}
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={204 + c * 21}
            y={58 + r * 15}
            width="19"
            height="13"
            rx="1.5"
            fill="#fff"
            stroke={LINE}
            strokeWidth="1.1"
          />
        ))
      )}
      <rect x="201" y="104" width="90" height="7" fill={SOFT} stroke={LINE} strokeWidth="1.1" />
      <line x1="210" y1="111" x2="210" y2="118" stroke={LINE} strokeWidth="1.1" />
      <line x1="246" y1="111" x2="246" y2="118" stroke={LINE} strokeWidth="1.1" />
      <line x1="282" y1="111" x2="282" y2="118" stroke={LINE} strokeWidth="1.1" />
      <text x="246" y="132" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600">90-block pallet</text>
      <text x="246" y="142" textAnchor="middle" fill={LINE} fontSize="9.5">≈ 3,420 lb</text>
    </Frame>
  );
}

/** CMU sizes: actual 15 5/8 x 7 5/8 block inside the dashed nominal 16 x 8 module. */
function CmuSizeDiagram({ title }: { title: string }) {
  return (
    <Frame title={title}>
      {/* Nominal module (dashed), extends right + down by the joint */}
      <rect x="58" y="50" width="184" height="72" fill="none" stroke={LINE} strokeWidth="1.2" strokeDasharray="5 4" />
      {/* Actual block (solid) seated in the top-left of the module */}
      <rect x="58" y="50" width="176" height="64" rx="2" fill="#fff" stroke={LINE} strokeWidth="1.6" />
      <rect x="80" y="62" width="62" height="40" rx="3" fill={SOFT} stroke={LINE} strokeWidth="1.2" />
      <rect x="150" y="62" width="62" height="40" rx="3" fill={SOFT} stroke={LINE} strokeWidth="1.2" />
      {/* Actual dimensions (brand) */}
      <text x="146" y="130" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600">actual 15⅝ in</text>
      <text x="49" y="82" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600" transform="rotate(-90 49 82)">7⅝ in</text>
      {/* Nominal label (gray) */}
      <text x="150" y="44" textAnchor="middle" fill={LINE} fontSize="10">nominal 16 × 8 in</text>
      {/* Mortar-joint callout, pointing at the gap on the right */}
      <line x1="236" y1="88" x2="256" y2="88" stroke={LINE} strokeWidth="1" />
      <text x="258" y="91" textAnchor="start" fill={LINE} fontSize="9.5">⅜ in</text>
      <text x="146" y="150" textAnchor="middle" fill={LINE} fontSize="10">dashed = nominal · gap = ⅜ in mortar joint</text>
    </Frame>
  );
}

/** Pick a diagram appropriate to the tool. */
export function Diagram({
  slug,
  category,
  alt,
}: {
  slug: string;
  category: CategorySlug;
  alt: string;
}) {
  let node: React.ReactNode;
  if (slug === "concrete-block-calculator" || slug === "block-wall-calculator") {
    node = <WallCourses title={alt} />;
  } else if (slug === "yards-of-concrete-calculator") {
    node = <ConcreteShapes title={alt} />;
  } else if (slug === "concrete-block-weight") {
    node = <BlockWeightDiagram title={alt} />;
  } else if (slug === "cmu-block-sizes") {
    node = <CmuSizeDiagram title={alt} />;
  } else if (slug === "gutter-slope-calculator") {
    node = <GutterSlopeDiagram title={alt} />;
  } else if (slug === "lawn-mowing-cost-calculator" || slug === "acres-per-hour-calculator") {
    node = <MowerPath title={alt} />;
  } else if (slug === "square-yard-calculator") {
    node = <MowerPath title={alt} />;
  } else {
    // All volume / yardage tools
    void category;
    node = <VolumeBox title={alt} />;
  }

  return (
    <figure style={{ margin: 0 }}>
      {node}
      <figcaption style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
        {alt}
      </figcaption>
    </figure>
  );
}
