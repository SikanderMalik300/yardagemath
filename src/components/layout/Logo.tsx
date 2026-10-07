import Link from "next/link";

/** Text wordmark — no AI sparkle / robot / gradient (design.md §5). */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-baseline font-bold tracking-tight ${className}`}
      aria-label="YardageMath home"
      style={{ fontSize: "1.25rem", color: "var(--text-primary)", textDecoration: "none" }}
    >
      <span>Yardage</span>
      <span style={{ color: "var(--brand)" }}>Math</span>
    </Link>
  );
}
