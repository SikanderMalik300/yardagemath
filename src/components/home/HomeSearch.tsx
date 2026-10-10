"use client";

import { useState } from "react";
import { calculators } from "@/data/calculators";
import { HomeTile } from "./HomeTile";
import styles from "./home.module.css";

/**
 * Homepage search, styled as a pill (redesign spec 2). Filters tools as you
 * type. Every tool is also listed in the static category bands below, so the
 * full directory is in the HTML and the page works with JavaScript disabled.
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
    <div>
      <div className={styles.searchWrap}>
        <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
          <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12.5 12.5 16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          id="home-search"
          type="search"
          className={styles.searchInput}
          inputMode="search"
          enterKeyHint="search"
          placeholder="e.g. gravel, concrete, mulch, topsoil…"
          aria-label="Search calculators"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
        />
      </div>
      {query && (
        <div aria-live="polite" style={{ marginTop: "20px" }}>
          {matches.length === 0 ? (
            <p className={styles.trustText}>
              No calculator matches &ldquo;{q}&rdquo;. Try &ldquo;gravel&rdquo;, &ldquo;concrete&rdquo; or &ldquo;mulch&rdquo;.
            </p>
          ) : (
            <div className={styles.tileGrid}>
              {matches.map((c) => (
                <HomeTile key={c.slug} cal={c} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
