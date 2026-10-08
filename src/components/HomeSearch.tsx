"use client";

import { useState } from "react";
import { calculators } from "@/data/calculators";
import { ToolCard } from "@/components/layout/ToolCard";

/**
 * Hero tool search (audit Task 3). Filters the tool cards as you type.
 * Every tool also appears in the static category sections below, so the full
 * directory is in the HTML and the site works with JavaScript disabled
 * (the input is simply inert without JS).
 */
export function HomeSearch() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const matches = query
    ? calculators.filter(
        (c) =>
          c.h1.toLowerCase().includes(query) ||
          c.primaryKeyword.toLowerCase().includes(query) ||
          c.cardDescription.toLowerCase().includes(query) ||
          c.secondaryKeywords.some((k) => k.toLowerCase().includes(query))
      )
    : [];

  return (
    <div style={{ marginTop: "1.25rem" }}>
      <label htmlFor="tool-search" className="field-label">
        What are you measuring?
      </label>
      <input
        id="tool-search"
        type="search"
        className="input"
        inputMode="search"
        enterKeyHint="search"
        placeholder="e.g. gravel, concrete, mulch, topsoil…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-describedby="tool-search-hint"
        style={{ maxWidth: 520, fontSize: "1rem" }}
        autoComplete="off"
      />
      {query && (
        <div aria-live="polite" style={{ marginTop: "1rem" }}>
          {matches.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>
              No calculator matches &ldquo;{q}&rdquo;. Try &ldquo;gravel&rdquo;, &ldquo;concrete&rdquo; or &ldquo;mulch&rdquo;.
            </p>
          ) : (
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}>
              {matches.map((c) => (
                <ToolCard key={c.slug} cal={c} />
              ))}
            </div>
          )}
        </div>
      )}
      <p id="tool-search-hint" style={{ display: "none" }}>
        Type to filter the calculators. All tools are listed by category below.
      </p>
    </div>
  );
}
