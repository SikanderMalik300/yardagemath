"use client";

import { useState } from "react";
import Link from "next/link";
import { calculators } from "@/data/calculators";

/** Client-side filter over the calculator list — a static site has no search backend. */
export function NotFoundSearch() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const matches = query
    ? calculators.filter(
        (c) =>
          c.h1.toLowerCase().includes(query) ||
          c.primaryKeyword.toLowerCase().includes(query) ||
          c.secondaryKeywords.some((k) => k.toLowerCase().includes(query))
      )
    : calculators.slice(0, 6);

  return (
    <div style={{ maxWidth: 520 }}>
      <label className="field-label" htmlFor="nf-search">
        Search calculators
      </label>
      <input
        id="nf-search"
        className="input"
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="e.g. gravel, concrete, topsoil"
        autoComplete="off"
      />
      <ul style={{ listStyle: "none", margin: "1rem 0 0", padding: 0, display: "grid", gap: "0.5rem" }}>
        {matches.map((c) => (
          <li key={c.slug}>
            <Link href={`/${c.slug}/`}>{c.h1.replace(/\s*\(.*\)/, "")}</Link>
          </li>
        ))}
        {matches.length === 0 && <li style={{ color: "var(--text-muted)" }}>No matching calculator — try another word.</li>}
      </ul>
    </div>
  );
}
