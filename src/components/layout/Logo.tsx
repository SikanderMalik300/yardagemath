import Link from "next/link";

/**
 * Inline-SVG brand wordmark (audit P1 #4). No image request — the mark ships in
 * the HTML, so it never blocks LCP and can never serve a stale (orange) cache.
 * A simple geometric cube + wordmark (design.md §5): no sparkle/robot/gradient.
 */
export function Logo({ height = 32 }: { height?: number }) {
  const cube = Math.round(height * 0.92);
  return (
    <Link
      href="/"
      aria-label="YardageMath home"
      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}
    >
      <svg width={cube} height={cube} viewBox="0 0 24 24" fill="none" aria-hidden="true" role="presentation">
        <path
          d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
          stroke="#236b4b"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M3.3 7 12 12l8.7-5" stroke="#236b4b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 22V12" stroke="#236b4b" strokeWidth="2" strokeLinecap="round" />
        <path d="M16.5 9.5v3.2" stroke="#236b4b" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      </svg>
      <span style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1 }}>
        <span style={{ color: "var(--text-primary)" }}>Yardage</span>
        <span style={{ color: "var(--brand)" }}>Math</span>
      </span>
    </Link>
  );
}
