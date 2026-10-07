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
