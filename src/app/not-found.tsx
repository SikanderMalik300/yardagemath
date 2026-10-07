import Link from "next/link";
import { NotFoundSearch } from "@/components/NotFoundSearch";

export default function NotFound() {
  return (
    <div className="container-content" style={{ paddingTop: "3rem", paddingBottom: "3rem", maxWidth: "var(--reading-max-width)" }}>
      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--brand)", marginBottom: "0.5rem" }}>404</p>
      <h1 className="page-h1" style={{ marginBottom: "0.75rem" }}>
        Page not found
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
        The page you&apos;re looking for doesn&apos;t exist or may have moved. Search for a
        calculator, or head back to the <Link href="/">home page</Link>.
      </p>
      <NotFoundSearch />
      <p style={{ marginTop: "1.5rem" }}>
        <Link href="/sitemap/">See all calculators →</Link>
      </p>
    </div>
  );
}
