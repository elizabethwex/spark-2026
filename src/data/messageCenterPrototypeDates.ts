/** Top-of-inbox (newest) prototype message — dates count backward from here by row index. */
const PROTOTYPE_NEWEST = new Date(2026, 3, 27); // April 27, 2026

export function getPrototypeRowDate(rowIndex: number): Date {
  const d = new Date(PROTOTYPE_NEWEST);
  d.setDate(d.getDate() - rowIndex);
  return d;
}

/** Desktop table: `M/DD/YY 11:05AM` (matches existing Message Center formatting). */
export function formatDesktopMessageDeliveryDate(rowIndex: number): string {
  const d = getPrototypeRowDate(rowIndex);
  const m = d.getMonth() + 1;
  const day = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear() % 100).padStart(2, "0");
  return `${m}/${day}/${yy} 11:05AM`;
}

/** App inbox list: `April 27` (month name + day; detail sheet adds year). */
export function formatAppInboxRowDateLabel(rowIndex: number): string {
  const d = getPrototypeRowDate(rowIndex);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}
