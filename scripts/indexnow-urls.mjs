// IndexNow URL selection + submission.
//
// Page lastmod dates are written in the owner's local time (Pakistan, UTC+5),
// so a push between 00:00 and 05:00 PKT gives pages tomorrow's date compared
// with the runner's UTC date. To cover any time zone we submit every URL whose
// lastmod is yesterday, today or tomorrow in UTC (IndexNow allows re-submitting
// unchanged URLs). selectUrls() is pure so it can be unit-tested; main() is the
// entrypoint the workflow runs.

import fs from "node:fs";
import { fileURLToPath } from "node:url";

const HOST = "yardagemath.com";
const MAX_URLS = 100;
// Changing any of these in a push means there is real work to submit, so an
// empty URL list is treated as an error. (This repo's content lives under src/.)
const CONTENT_PREFIXES = ["src/app/", "src/data/", "src/lib/data/"];

function utcDateStr(d) {
  return d.toISOString().slice(0, 10);
}

/** The set of acceptable lastmod dates: yesterday, today, tomorrow (UTC). */
function windowDates(now) {
  const base = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const shift = (days) => {
    const d = new Date(base);
    d.setUTCDate(base.getUTCDate() + days);
    return utcDateStr(d);
  };
  return new Set([shift(-1), shift(0), shift(1)]);
}

/** The UTC calendar date of a lastmod value, or null if unparseable. */
function lastmodUtcDate(lastmod) {
  const s = lastmod.trim();
  if (!s) return null;
  // A bare YYYY-MM-DD is a calendar date; keep it as written (time-zone free).
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return utcDateStr(d);
}

/**
 * Select the sitemap URLs whose lastmod is within the yesterday/today/tomorrow
 * UTC window, newest lastmod first, capped at `max` (default 100).
 * @param {string} sitemapXml
 * @param {Date} now
 * @param {number} [max]
 * @returns {string[]}
 */
export function selectUrls(sitemapXml, now, max = MAX_URLS) {
  const win = windowDates(now);
  const items = [];
  const blocks = sitemapXml.match(/<url>[\s\S]*?<\/url>/g) || [];
  for (const block of blocks) {
    const loc = (block.match(/<loc>([\s\S]*?)<\/loc>/) || [])[1];
    const mod = (block.match(/<lastmod>([\s\S]*?)<\/lastmod>/) || [])[1];
    if (!loc || mod == null) continue;
    const dt = lastmodUtcDate(mod);
    if (!dt || !win.has(dt)) continue;
    items.push({ loc: loc.trim(), sortKey: mod.trim() });
  }
  // Newest lastmod first (ISO dates/timestamps sort lexicographically).
  items.sort((a, b) => (a.sortKey < b.sortKey ? 1 : a.sortKey > b.sortKey ? -1 : 0));
  return items.slice(0, max).map((i) => i.loc);
}

function changedContentFiles() {
  if (!fs.existsSync("changed.txt")) return [];
  return fs
    .readFileSync("changed.txt", "utf-8")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function main() {
  const KEY = process.env.INDEXNOW_KEY;
  const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

  const xml = fs.readFileSync("out/sitemap.xml", "utf-8");
  const urls = selectUrls(xml, new Date());

  const changed = changedContentFiles();
  const contentChanged = changed.some((f) => CONTENT_PREFIXES.some((p) => f.startsWith(p)));

  if (urls.length === 0) {
    if (contentChanged) {
      console.error(
        "ERROR: content changed (src/app, src/data or src/lib/data) but no sitemap " +
          "URL has a lastmod in the yesterday/today/tomorrow UTC window. " +
          "Check the lastUpdated dates on the changed pages."
      );
      process.exit(1);
    }
    console.log("No URLs with lastmod in the UTC window; nothing to submit (no content files changed).");
    return;
  }

  if (!KEY) {
    console.error("ERROR: INDEXNOW_KEY is not set.");
    process.exit(1);
  }

  console.log(`Submitting ${urls.length} URL(s) to IndexNow:`);
  for (const u of urls) console.log(`  ${u}`);

  const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls };
  const resp = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "User-Agent": "YardageMath-IndexNow/1.0 (+https://yardagemath.com)",
    },
    body: JSON.stringify(payload),
  });
  const body = await resp.text().catch(() => "");
  console.log(`IndexNow response: ${resp.status} ${resp.statusText}`);
  if (body.trim()) console.log(body.slice(0, 300));

  if (resp.status === 200 || resp.status === 202) {
    console.log("IndexNow submission succeeded.");
  } else {
    console.error(`IndexNow submission failed with status ${resp.status}.`);
    process.exit(1);
  }
}

// Run only when executed directly (not when imported by the tests).
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
