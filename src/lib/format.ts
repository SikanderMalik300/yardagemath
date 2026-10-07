/** Display formatting helpers (presentation only — kept out of formula files). */

export function fmtNumber(value: number, dp = 2): string {
  if (!Number.isFinite(value)) return "0";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: dp,
  });
}

export function fmtInt(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

export function fmtUSD(value: number): string {
  if (!Number.isFinite(value)) return "$0";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value < 100 ? 2 : 0,
    maximumFractionDigits: value < 100 ? 2 : 0,
  });
}

export function fmtDate(iso: string): string {
  // Avoid timezone drift by parsing the date parts directly.
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
