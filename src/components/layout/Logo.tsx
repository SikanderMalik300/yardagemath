import Image from "next/image";
import Link from "next/link";

/** Brand wordmark — the provided YardageMath logo (design.md §5). */
export function Logo({ height = 32 }: { height?: number }) {
  // logo-with-text.png is 858 × 202 (ratio ≈ 4.25).
  const width = Math.round((858 / 202) * height);
  return (
    <Link href="/" aria-label="YardageMath home" style={{ display: "inline-flex", alignItems: "center" }}>
      <Image
        src="/logo-with-text.png"
        alt="YardageMath"
        width={width}
        height={height}
        priority
        style={{ height, width: "auto" }}
      />
    </Link>
  );
}
