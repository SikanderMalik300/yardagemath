"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchCalculators, tileName } from "@/lib/data/homeSearch";
import styles from "./home.module.css";

/**
 * Homepage search (redesign fixes Task 5). Pill input with a results dropdown,
 * matching name/description/keywords (name first), max 8. Full combobox
 * keyboard support, and it closes on outside click or Escape. The full tool
 * directory is also in the static bands below, so this works without JS too.
 */
export function HomeSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const query = q.trim();
  const results = query ? searchCalculators(query) : [];
  const showList = open && query.length > 0;

  useEffect(() => {
    setActive(-1);
  }, [q]);

  useEffect(() => {
    if (!showList) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showList]);

  const go = (slug: string) => {
    setOpen(false);
    router.push(`/${slug}/`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (!results.length) return;
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      if (!showList) return;
      e.preventDefault();
      setActive((a) => Math.max(-1, a - 1));
    } else if (e.key === "Enter") {
      if (showList && results.length) {
        e.preventDefault();
        go(results[active >= 0 ? active : 0].slug);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const optId = (i: number) => `${listId}-opt-${i}`;

  return (
    <div className={styles.searchWrap} ref={wrapRef}>
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
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && active >= 0 ? optId(active) : undefined}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => query && setOpen(true)}
        onKeyDown={onKeyDown}
        autoComplete="off"
      />
      {showList && (
        <div className={styles.searchResults} id={listId} role="listbox" aria-label="Search results">
          {results.length === 0 ? (
            <p className={styles.resultEmpty} role="status">
              No calculator matches &ldquo;{q}&rdquo;. Try &ldquo;gravel&rdquo;, &ldquo;concrete&rdquo; or &ldquo;mulch&rdquo;.
            </p>
          ) : (
            results.map((c, i) => (
              <a
                key={c.slug}
                id={optId(i)}
                role="option"
                aria-selected={i === active}
                href={`/${c.slug}/`}
                className={`${styles.resultRow} ${i === active ? styles.resultRowActive : ""}`}
                onMouseEnter={() => setActive(i)}
                onClick={(e) => {
                  e.preventDefault();
                  go(c.slug);
                }}
              >
                <span className={styles.resultName}>{tileName(c)}</span>
                <span className={styles.resultDesc}>{c.cardDescription}</span>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}
