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

/** Concrete footing: strip (under a wall), square pad and round pier. */
function FootingDiagram({ title }: { title: string }) {
  return (
    <Frame title={title}>
      {/* Strip footing in a trench under a block wall */}
      <rect x="40" y="44" width="40" height="24" fill={SOFT} stroke={LINE} strokeWidth="1.1" />
      <line x1="60" y1="44" x2="60" y2="68" stroke={LINE} strokeWidth="0.8" />
      <polygon points="28,78 86,78 98,70 40,70" fill="#d9e6de" stroke={LINE} strokeWidth="1.3" />
      <polygon points="86,78 98,70 98,100 86,108" fill="#cfe0d6" stroke={LINE} strokeWidth="1.3" />
      <polygon points="28,78 86,78 86,108 28,108" fill="#fff" stroke={LINE} strokeWidth="1.3" />
      <text x="57" y="122" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600">L</text>
      <text x="20" y="94" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600" transform="rotate(-90 20 94)">W</text>
      <text x="103" y="90" textAnchor="start" fill={BRAND} fontSize="11" fontWeight="600">D</text>
      <text x="58" y="140" textAnchor="middle" fill={LINE} fontSize="11">Strip</text>

      {/* Square pad */}
      <polygon points="134,74 174,74 188,64 148,64" fill={SOFT} stroke={LINE} strokeWidth="1.3" />
      <polygon points="174,74 188,64 188,96 174,106" fill="#cfe0d6" stroke={LINE} strokeWidth="1.3" />
      <polygon points="134,74 174,74 174,106 134,106" fill="#fff" stroke={LINE} strokeWidth="1.3" />
      <text x="154" y="120" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600">L</text>
      <text x="126" y="90" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600" transform="rotate(-90 126 90)">W</text>
      <text x="193" y="88" textAnchor="start" fill={BRAND} fontSize="11" fontWeight="600">D</text>
      <text x="158" y="140" textAnchor="middle" fill={LINE} fontSize="11">Pad</text>

      {/* Round pier */}
      <path d="M238 62 V104 A22 7 0 0 0 282 104 V62" fill="#fff" stroke={LINE} strokeWidth="1.3" />
      <ellipse cx="260" cy="62" rx="22" ry="7" fill={SOFT} stroke={LINE} strokeWidth="1.3" />
      <text x="260" y="50" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600">d</text>
      <text x="228" y="86" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600" transform="rotate(-90 228 86)">D</text>
      <text x="260" y="140" textAnchor="middle" fill={LINE} fontSize="11">Pier</text>
    </Frame>
  );
}

/** Cinder block fill: one block's two cores (one filled with rebar), plus a
    wall elevation with every other core shaded. */
function CinderFillDiagram({ title }: { title: string }) {
  return (
    <Frame title={title}>
      {/* Top-down view of one 8-inch block with two cores */}
      <rect x="28" y="58" width="104" height="52" rx="2" fill="#fff" stroke={LINE} strokeWidth="1.5" />
      {/* left core: filled + rebar dot */}
      <rect x="40" y="68" width="34" height="32" rx="2" fill="#cfe0d6" stroke={LINE} strokeWidth="1.2" />
      <circle cx="57" cy="84" r="3.5" fill={BRAND} />
      {/* right core: empty */}
      <rect x="86" y="68" width="34" height="32" rx="2" fill="#fff" stroke={LINE} strokeWidth="1.2" />
      <text x="57" y="126" textAnchor="middle" fill={BRAND} fontSize="10.5" fontWeight="600">filled core</text>
      <text x="103" y="126" textAnchor="middle" fill={LINE} fontSize="10.5">open core</text>
      <text x="80" y="140" textAnchor="middle" fill={LINE} fontSize="10.5">One block, two cores</text>

      {/* Wall elevation: every other core shaded */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => {
          const x = 170 + col * 30;
          const y = 50 + row * 24;
          const filled = (col + row) % 2 === 0;
          return (
            <g key={`${row}-${col}`}>
              <rect x={x} y={y} width="28" height="22" fill={filled ? "#cfe0d6" : "#fff"} stroke={LINE} strokeWidth="1.1" />
            </g>
          );
        })
      )}
      <text x="228" y="140" textAnchor="middle" fill={LINE} fontSize="10.5">Every other core filled</text>
    </Frame>
  );
}

/** Mulch: a bed in side view with a mulch layer + depth arrow, and a tree ring. */
function MulchDiagram({ title }: { title: string }) {
  return (
    <Frame title={title}>
      {/* Side view: soil with a mulch layer on top */}
      <rect x="24" y="78" width="130" height="34" fill="#efe7d4" stroke={LINE} strokeWidth="1.2" />
      <rect x="24" y="64" width="130" height="14" fill={SOFT} stroke={LINE} strokeWidth="1.2" />
      {/* depth arrow for the mulch layer */}
      <line x1="40" y1="64" x2="40" y2="78" stroke={BRAND} strokeWidth="1.3" />
      <path d="M40 64 l-2.5 4 h5 z" fill={BRAND} />
      <path d="M40 78 l-2.5 -4 h5 z" fill={BRAND} />
      <text x="47" y="75" textAnchor="start" fill={BRAND} fontSize="11" fontWeight="600">3&Prime;</text>
      <text x="89" y="100" textAnchor="middle" fill={LINE} fontSize="10">soil</text>
      <text x="89" y="128" textAnchor="middle" fill={LINE} fontSize="11">Bed (side view)</text>

      {/* Top view: tree ring with diameter + gap around trunk */}
      <circle cx="245" cy="78" r="38" fill="#efe7d4" stroke={LINE} strokeWidth="1.3" />
      <circle cx="245" cy="78" r="9" fill="#fff" stroke={LINE} strokeWidth="1.1" />
      <circle cx="245" cy="78" r="3.5" fill="#8a6a4a" />
      {/* diameter line */}
      <line x1="207" y1="78" x2="283" y2="78" stroke={BRAND} strokeWidth="1.2" strokeDasharray="3 3" />
      <path d="M207 78 l4 -2.5 v5 z" fill={BRAND} />
      <path d="M283 78 l-4 -2.5 v5 z" fill={BRAND} />
      <text x="245" y="60" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600">diameter</text>
      <text x="245" y="128" textAnchor="middle" fill={LINE} fontSize="11">Tree ring (top view)</text>
    </Frame>
  );
}

function GravelDiagram({ title }: { title: string }) {
  return (
    <Frame title={title}>
      {/* Side view: a driveway cross-section with a base layer and a top layer */}
      <rect x="26" y="92" width="120" height="26" fill="#d8d2c4" stroke={LINE} strokeWidth="1.2" />
      <rect x="26" y="72" width="120" height="20" fill={SOFT} stroke={LINE} strokeWidth="1.2" />
      {/* base depth arrow (left) */}
      <line x1="40" y1="92" x2="40" y2="118" stroke={BRAND} strokeWidth="1.3" />
      <path d="M40 92 l-2.5 4 h5 z" fill={BRAND} />
      <path d="M40 118 l-2.5 -4 h5 z" fill={BRAND} />
      <text x="47" y="108" textAnchor="start" fill={BRAND} fontSize="10" fontWeight="600">base 4&Prime;</text>
      {/* top depth arrow (right) */}
      <line x1="132" y1="72" x2="132" y2="92" stroke={BRAND} strokeWidth="1.3" />
      <path d="M132 72 l-2.5 4 h5 z" fill={BRAND} />
      <path d="M132 92 l-2.5 -4 h5 z" fill={BRAND} />
      <text x="126" y="86" textAnchor="end" fill={BRAND} fontSize="10" fontWeight="600">top 2&Prime;</text>
      <text x="86" y="138" textAnchor="middle" fill={LINE} fontSize="11">Driveway (side view)</text>

      {/* Top view: a rectangle labelled L and W */}
      <rect x="200" y="62" width="82" height="44" fill="#fff" stroke={LINE} strokeWidth="1.3" />
      <text x="241" y="120" textAnchor="middle" fill={BRAND} fontSize="12" fontWeight="600">L</text>
      <text x="190" y="84" textAnchor="middle" fill={BRAND} fontSize="12" fontWeight="600" transform="rotate(-90 190 84)">W</text>
      <text x="241" y="138" textAnchor="middle" fill={LINE} fontSize="11">Area (top view)</text>
    </Frame>
  );
}

function SandDiagram({ title }: { title: string }) {
  return (
    <Frame title={title}>
      {/* Left: paver cross-section with pavers, a thin sand bedding layer and a gravel base */}
      {[0, 1, 2].map((c) => (
        <rect key={c} x={26 + c * 40} y="54" width="38" height="14" fill="#fff" stroke={LINE} strokeWidth="1.2" />
      ))}
      <rect x="26" y="68" width="120" height="12" fill={SOFT} stroke={LINE} strokeWidth="1.2" />
      <rect x="26" y="80" width="120" height="26" fill="#d8d2c4" stroke={LINE} strokeWidth="1.2" />
      {/* sand bedding depth arrow (right) */}
      <line x1="134" y1="68" x2="134" y2="80" stroke={BRAND} strokeWidth="1.3" />
      <path d="M134 68 l-2.5 4 h5 z" fill={BRAND} />
      <path d="M134 80 l-2.5 -4 h5 z" fill={BRAND} />
      <text x="128" y="78" textAnchor="end" fill={BRAND} fontSize="10" fontWeight="600">sand 1&Prime;</text>
      <text x="86" y="95" textAnchor="middle" fill={LINE} fontSize="10">gravel base</text>
      <text x="86" y="124" textAnchor="middle" fill={LINE} fontSize="11">Pavers (side view)</text>

      {/* Right: top view of a square sandbox labelled L, W and depth */}
      <rect x="200" y="58" width="80" height="48" fill="#efe7d4" stroke={LINE} strokeWidth="1.3" />
      <text x="240" y="118" textAnchor="middle" fill={BRAND} fontSize="12" fontWeight="600">L</text>
      <text x="190" y="82" textAnchor="middle" fill={BRAND} fontSize="12" fontWeight="600" transform="rotate(-90 190 82)">W</text>
      <text x="240" y="82" textAnchor="middle" fill={BRAND} fontSize="10" fontWeight="600">depth 12&Prime;</text>
      <text x="240" y="124" textAnchor="middle" fill={LINE} fontSize="11">Sandbox (top view)</text>
    </Frame>
  );
}

function SlabCostDiagram({ title }: { title: string }) {
  return (
    <Frame title={title}>
      {/* Cross-section: concrete slab over a gravel base, with rebar/mesh inside */}
      <rect x="26" y="90" width="118" height="24" fill="#d8d2c4" stroke={LINE} strokeWidth="1.2" />
      <rect x="26" y="62" width="118" height="28" fill="#e3e6e4" stroke={LINE} strokeWidth="1.2" />
      <line x1="72" y1="76" x2="138" y2="76" stroke={BRAND} strokeWidth="1.2" strokeDasharray="5 3" />
      {/* slab thickness arrow */}
      <line x1="40" y1="62" x2="40" y2="90" stroke={BRAND} strokeWidth="1.3" />
      <path d="M40 62 l-2.5 4 h5 z" fill={BRAND} />
      <path d="M40 90 l-2.5 -4 h5 z" fill={BRAND} />
      <text x="46" y="79" textAnchor="start" fill={BRAND} fontSize="10" fontWeight="600">4 in</text>
      {/* gravel base arrow */}
      <line x1="40" y1="90" x2="40" y2="114" stroke={BRAND} strokeWidth="1.3" />
      <path d="M40 90 l-2.5 4 h5 z" fill={BRAND} />
      <path d="M40 114 l-2.5 -4 h5 z" fill={BRAND} />
      <text x="46" y="106" textAnchor="start" fill={BRAND} fontSize="10" fontWeight="600">base 4 in</text>
      <text x="100" y="56" textAnchor="middle" fill={LINE} fontSize="10">concrete + rebar</text>
      <text x="85" y="130" textAnchor="middle" fill={LINE} fontSize="11">Slab (side view)</text>
      {/* Top view rectangle */}
      <rect x="200" y="62" width="82" height="44" fill="#fff" stroke={LINE} strokeWidth="1.3" />
      <text x="241" y="120" textAnchor="middle" fill={BRAND} fontSize="12" fontWeight="600">L</text>
      <text x="190" y="84" textAnchor="middle" fill={BRAND} fontSize="12" fontWeight="600" transform="rotate(-90 190 84)">W</text>
      <text x="241" y="138" textAnchor="middle" fill={LINE} fontSize="11">Area (top view)</text>
    </Frame>
  );
}

function BrickDiagram({ title }: { title: string }) {
  const brick = "#d79a7a";
  return (
    <Frame title={title}>
      {/* Left: running-bond wall elevation with a door opening, labelled L and H */}
      <rect x="24" y="48" width="118" height="70" fill={brick} stroke={LINE} strokeWidth="1.2" />
      {/* course lines */}
      {[65, 82, 99].map((y) => (
        <line key={y} x1="24" y1={y} x2="142" y2={y} stroke="#fff" strokeWidth="1.1" />
      ))}
      {/* head joints, offset each course (running bond) */}
      {[48, 65, 82, 99].map((y, r) =>
        [0, 1, 2, 3].map((c) => (
          <line key={`${y}-${c}`} x1={24 + c * 30 + (r % 2) * 15} y1={y} x2={24 + c * 30 + (r % 2) * 15} y2={y + 17} stroke="#fff" strokeWidth="1.1" />
        ))
      )}
      {/* door opening */}
      <rect x="34" y="90" width="24" height="28" fill="#fff" stroke={LINE} strokeWidth="1.2" />
      {/* L and H labels */}
      <text x="83" y="134" textAnchor="middle" fill={BRAND} fontSize="12" fontWeight="600">L</text>
      <text x="15" y="83" textAnchor="middle" fill={BRAND} fontSize="12" fontWeight="600" transform="rotate(-90 15 83)">H</text>

      {/* Right: one brick, actual size with a dashed nominal outline (with joint) */}
      <rect x="196" y="62" width="80" height="30" fill="none" stroke={BRAND} strokeWidth="1.2" strokeDasharray="4 3" />
      <rect x="200" y="66" width="72" height="22" fill={brick} stroke={LINE} strokeWidth="1.2" />
      <text x="236" y="58" textAnchor="middle" fill={BRAND} fontSize="10" fontWeight="600">nominal 8 × 2⅔</text>
      <text x="236" y="104" textAnchor="middle" fill={LINE} fontSize="10">actual 7⅝ × 2¼ in</text>
    </Frame>
  );
}

function PaverDiagram({ title }: { title: string }) {
  const paver = "#cf9e86";
  return (
    <Frame title={title}>
      {/* Left: patio cross-section (pavers, sand bedding, gravel base, soil) with edging */}
      {[0, 1, 2, 3, 4].map((c) => (
        <rect key={c} x={28 + c * 21} y="54" width="19" height="10" fill={paver} stroke={LINE} strokeWidth="0.9" />
      ))}
      <rect x="26" y="64" width="107" height="6" fill={SOFT} stroke={LINE} strokeWidth="1" />
      <rect x="26" y="70" width="107" height="26" fill="#d8d2c4" stroke={LINE} strokeWidth="1.1" />
      <rect x="26" y="96" width="107" height="14" fill="#efe7d4" stroke={LINE} strokeWidth="1" />
      {/* edge restraint holding the pavers at the left */}
      <rect x="21" y="54" width="5" height="42" fill={BRAND} opacity="0.8" />
      {/* layer labels */}
      <text x="137" y="61" fill={LINE} fontSize="9">pavers</text>
      <text x="137" y="70" fill={BRAND} fontSize="9" fontWeight="600">1 in sand</text>
      <text x="137" y="86" fill={BRAND} fontSize="9" fontWeight="600">4 in base</text>
      <text x="137" y="106" fill={LINE} fontSize="9">soil</text>
      <text x="80" y="126" textAnchor="middle" fill={LINE} fontSize="10">edging + patio (side view)</text>

      {/* Right: running-bond top view with L and W */}
      {[58, 70, 82, 94].map((y, r) =>
        [0, 1, 2].map((c) => (
          <rect key={`${y}-${c}`} x={200 + c * 28 + (r % 2) * 14} y={y} width="26" height="10" fill={paver} stroke={LINE} strokeWidth="0.8" />
        ))
      )}
      <text x="241" y="120" textAnchor="middle" fill={BRAND} fontSize="12" fontWeight="600">L</text>
      <text x="190" y="80" textAnchor="middle" fill={BRAND} fontSize="12" fontWeight="600" transform="rotate(-90 190 80)">W</text>
      <text x="241" y="134" textAnchor="middle" fill={LINE} fontSize="10">running bond (top)</text>
    </Frame>
  );
}

function PaverBaseDiagram({ title }: { title: string }) {
  const paver = "#cf9e86";
  return (
    <Frame title={title}>
      {/* Pavers (ending before the base edge), bedding sand, compacted base, soil */}
      {[0, 1, 2, 3].map((c) => (
        <rect key={c} x={32 + c * 21} y="54" width="19" height="10" fill={paver} stroke={LINE} strokeWidth="0.9" />
      ))}
      <rect x="28" y="64" width="90" height="6" fill={SOFT} stroke={LINE} strokeWidth="1" />
      <rect x="24" y="70" width="120" height="30" fill="#d8d2c4" stroke={LINE} strokeWidth="1.1" />
      <rect x="24" y="100" width="120" height="13" fill="#efe7d4" stroke={LINE} strokeWidth="1" />
      {/* base extends past the paver edge + edge restraint */}
      <rect x="116" y="54" width="5" height="46" fill={BRAND} opacity="0.8" />
      {/* 4 in patio level (dashed) */}
      <line x1="24" y1="85" x2="144" y2="85" stroke={BRAND} strokeWidth="1" strokeDasharray="4 3" />
      {/* stacked depth arrows: top 4 in (patio), full 8 in (driveway) */}
      <line x1="44" y1="70" x2="44" y2="85" stroke={BRAND} strokeWidth="1.2" />
      <path d="M44 70 l-2 3.5 h4 z" fill={BRAND} />
      <path d="M44 85 l-2 -3.5 h4 z" fill={BRAND} />
      <line x1="44" y1="85" x2="44" y2="100" stroke={BRAND} strokeWidth="1.2" />
      <path d="M44 100 l-2 -3.5 h4 z" fill={BRAND} />
      <text x="50" y="81" fill={BRAND} fontSize="8.5" fontWeight="600">4 in patio</text>
      <text x="50" y="96" fill={BRAND} fontSize="8.5" fontWeight="600">to 8 in drive</text>
      <text x="123" y="61" fill={LINE} fontSize="8">base past edge</text>
      <text x="74" y="128" textAnchor="middle" fill={LINE} fontSize="10">pavers, sand &amp; base (side view)</text>

      {/* Right: top view with L and W */}
      <rect x="200" y="62" width="82" height="44" fill="#fff" stroke={LINE} strokeWidth="1.3" />
      <text x="241" y="120" textAnchor="middle" fill={BRAND} fontSize="12" fontWeight="600">L</text>
      <text x="190" y="84" textAnchor="middle" fill={BRAND} fontSize="12" fontWeight="600" transform="rotate(-90 190 84)">W</text>
      <text x="241" y="138" textAnchor="middle" fill={LINE} fontSize="10">area (top view)</text>
    </Frame>
  );
}

function RetainingWallDiagram({ title }: { title: string }) {
  const block = "#c7c2b8";
  const courses = [
    { x: 30, y: 99 }, // buried
    { x: 34, y: 88 },
    { x: 38, y: 77 },
    { x: 42, y: 66 },
  ];
  return (
    <Frame title={title}>
      {/* base leveling pad */}
      <rect x="26" y="110" width="58" height="8" fill="#d8d2c4" stroke={LINE} strokeWidth="1" />
      {/* soil retained behind */}
      <polygon points="88,66 150,52 150,118 88,118" fill="#efe7d4" stroke={LINE} strokeWidth="1" />
      {/* drainage stone behind the blocks */}
      <rect x="80" y="66" width="10" height="44" fill={SOFT} stroke={LINE} strokeWidth="0.8" strokeDasharray="2 2" />
      {/* blocks, stepping back */}
      {courses.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width="46" height="11" fill={block} stroke={LINE} strokeWidth="1" />
      ))}
      {/* cap */}
      <rect x="40" y="60" width="50" height="6" fill="#b7b1a6" stroke={LINE} strokeWidth="1" />
      {/* grade line in front */}
      <line x1="10" y1="99" x2="30" y2="99" stroke={BRAND} strokeWidth="1" strokeDasharray="3 2" />
      {/* perforated pipe at base */}
      <circle cx="86" cy="106" r="3.5" fill="#fff" stroke={BRAND} strokeWidth="1.2" />
      {/* labels */}
      <text x="66" y="57" textAnchor="middle" fill={LINE} fontSize="8.5">cap</text>
      <text x="8" y="96" fill={BRAND} fontSize="8">grade</text>
      <text x="30" y="128" fill={LINE} fontSize="8">base pad + buried course</text>
      <text x="96" y="64" fill={LINE} fontSize="8">drainage + pipe</text>

      {/* Right: front view with L and H */}
      <rect x="204" y="60" width="80" height="50" fill={block} stroke={LINE} strokeWidth="1.2" />
      <line x1="204" y1="76" x2="284" y2="76" stroke="#fff" strokeWidth="0.9" />
      <line x1="204" y1="93" x2="284" y2="93" stroke="#fff" strokeWidth="0.9" />
      <text x="244" y="124" textAnchor="middle" fill={BRAND} fontSize="12" fontWeight="600">L</text>
      <text x="194" y="85" textAnchor="middle" fill={BRAND} fontSize="12" fontWeight="600" transform="rotate(-90 194 85)">H</text>
      <text x="244" y="138" textAnchor="middle" fill={LINE} fontSize="10">front view</text>
    </Frame>
  );
}

function FillDirtDiagram({ title }: { title: string }) {
  const fill = "#cdb79a";
  return (
    <Frame title={title}>
      {/* Left: a low area being filled in layers up to the finished grade */}
      <path d="M24,70 L50,70 L62,100 L98,100 L110,70 L138,70 L138,116 L24,116 Z" fill="#efe7d4" stroke={LINE} strokeWidth="1" />
      <path d="M50,70 L62,100 L98,100 L110,70 Z" fill={fill} stroke={LINE} strokeWidth="0.8" />
      {/* fill layers */}
      <line x1="55" y1="85" x2="105" y2="85" stroke="#fff" strokeWidth="0.8" />
      <line x1="60" y1="93" x2="100" y2="93" stroke="#fff" strokeWidth="0.8" />
      {/* finished grade (dashed) */}
      <line x1="46" y1="70" x2="114" y2="70" stroke={BRAND} strokeWidth="1" strokeDasharray="4 3" />
      {/* fill depth arrow */}
      <line x1="68" y1="70" x2="68" y2="99" stroke={BRAND} strokeWidth="1.2" />
      <path d="M68 70 l-2.5 4 h5 z" fill={BRAND} />
      <path d="M68 99 l-2.5 -4 h5 z" fill={BRAND} />
      <text x="72" y="88" fill={BRAND} fontSize="8.5" fontWeight="600">fill depth</text>
      <text x="118" y="68" fill={BRAND} fontSize="8">finished grade</text>
      <text x="26" y="128" fill={LINE} fontSize="8.5">fill a low area in layers</text>

      {/* Right: a hole with L, W and D */}
      <polygon points="202,66 258,66 272,56 216,56" fill="#d9c7ad" stroke={LINE} strokeWidth="1" />
      <polygon points="202,66 258,66 258,98 202,98" fill={fill} stroke={LINE} strokeWidth="1" />
      <polygon points="258,66 272,56 272,88 258,98" fill="#bfa98a" stroke={LINE} strokeWidth="1" />
      <text x="230" y="112" textAnchor="middle" fill={BRAND} fontSize="11" fontWeight="600">L</text>
      <text x="270" y="78" textAnchor="start" fill={BRAND} fontSize="11" fontWeight="600">W</text>
      <text x="196" y="84" textAnchor="end" fill={BRAND} fontSize="11" fontWeight="600">D</text>
      <text x="236" y="128" textAnchor="middle" fill={LINE} fontSize="8.5">fill a hole</text>
    </Frame>
  );
}

/** Landscape rock: a rock bed over fabric with a depth arrow and edging, plus
    three size swatches labelled with their suggested depth. */
function LandscapeRockDiagram({ title }: { title: string }) {
  const rock = "#cbc8bf";
  return (
    <Frame title={title}>
      {/* Left: side view — rock layer over landscape fabric over soil, with edging */}
      <rect x="30" y="62" width="116" height="26" fill={rock} stroke={LINE} strokeWidth="1.2" />
      {/* a few pebbles in the rock layer */}
      {[
        [44, 72], [58, 80], [72, 70], [86, 79], [100, 72], [114, 80], [128, 71],
      ].map(([cx, cy], k) => (
        <circle key={k} cx={cx} cy={cy} r="4.2" fill="#fff" stroke={LINE} strokeWidth="0.8" />
      ))}
      {/* landscape fabric (thin) */}
      <rect x="30" y="88" width="116" height="5" fill={SOFT} stroke={LINE} strokeWidth="1" />
      {/* soil */}
      <rect x="30" y="93" width="116" height="20" fill="#efe7d4" stroke={LINE} strokeWidth="1" />
      {/* edge restraint holding the rock on the left */}
      <rect x="25" y="58" width="5" height="35" fill={BRAND} opacity="0.8" />
      {/* depth arrow for the rock layer (right side) */}
      <line x1="136" y1="62" x2="136" y2="88" stroke={BRAND} strokeWidth="1.3" />
      <path d="M136 62 l-2.5 4 h5 z" fill={BRAND} />
      <path d="M136 88 l-2.5 -4 h5 z" fill={BRAND} />
      <text x="131" y="78" textAnchor="end" fill={BRAND} fontSize="10" fontWeight="600">3&Prime;</text>
      <text x="152" y="80" textAnchor="start" fill={LINE} fontSize="8.5">fabric</text>
      <text x="152" y="102" textAnchor="start" fill={LINE} fontSize="8.5">soil</text>
      <text x="80" y="128" textAnchor="middle" fill={LINE} fontSize="10.5">rock over fabric (side view)</text>

      {/* Right: three size swatches with suggested depths */}
      <text x="243" y="48" textAnchor="middle" fill={LINE} fontSize="9.5">depth by rock size</text>
      {[
        { x: 196, r: 2.4, label: "small 2″", depth: 2 },
        { x: 234, r: 3.6, label: "med 3″", depth: 3 },
        { x: 272, r: 5, label: "large 4″", depth: 4 },
      ].map((s, k) => {
        const pts: [number, number][] = [
          [s.x + 6, 62], [s.x + 18, 68], [s.x + 8, 74], [s.x + 20, 80], [s.x + 7, 86], [s.x + 17, 90],
        ];
        return (
          <g key={k}>
            <rect x={s.x} y="56" width="30" height="40" rx="3" fill={SOFT} stroke={LINE} strokeWidth="1.1" />
            {pts.map(([cx, cy], j) => (
              <circle key={j} cx={cx} cy={cy} r={s.r} fill="#fff" stroke={LINE} strokeWidth="0.7" />
            ))}
            <text x={s.x + 15} y="110" textAnchor="middle" fill={BRAND} fontSize="9" fontWeight="600">{s.label}</text>
          </g>
        );
      })}
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
  } else if (slug === "concrete-slab-cost-calculator") {
    node = <SlabCostDiagram title={alt} />;
  } else if (slug === "brick-calculator") {
    node = <BrickDiagram title={alt} />;
  } else if (slug === "paver-calculator") {
    node = <PaverDiagram title={alt} />;
  } else if (slug === "paver-base-calculator") {
    node = <PaverBaseDiagram title={alt} />;
  } else if (slug === "retaining-wall-calculator") {
    node = <RetainingWallDiagram title={alt} />;
  } else if (slug === "fill-dirt-calculator") {
    node = <FillDirtDiagram title={alt} />;
  } else if (slug === "landscape-rock-calculator") {
    node = <LandscapeRockDiagram title={alt} />;
  } else if (slug === "yards-of-concrete-calculator") {
    node = <ConcreteShapes title={alt} />;
  } else if (slug === "concrete-block-weight") {
    node = <BlockWeightDiagram title={alt} />;
  } else if (slug === "cmu-block-sizes") {
    node = <CmuSizeDiagram title={alt} />;
  } else if (slug === "concrete-footing-calculator") {
    node = <FootingDiagram title={alt} />;
  } else if (slug === "cinder-block-fill-calculator") {
    node = <CinderFillDiagram title={alt} />;
  } else if (slug === "mulch-calculator") {
    node = <MulchDiagram title={alt} />;
  } else if (slug === "gravel-calculator") {
    node = <GravelDiagram title={alt} />;
  } else if (slug === "sand-calculator") {
    node = <SandDiagram title={alt} />;
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
