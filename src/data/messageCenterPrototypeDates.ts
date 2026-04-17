/** Top-of-inbox (newest) prototype message — dates count backward from here by row index. */
const PROTOTYPE_NEWEST = new Date(2026, 3, 27); // April 27, 2026

/** One delivery time per inbox row (24h HH:mm) — business-hour spread, no duplicate wall times. */
const PROTOTYPE_DELIVERY_TIME_24: readonly string[] = [
  "09:42",
  "10:07",
  "11:19",
  "12:03",
  "13:28",
  "14:51",
  "15:14",
  "16:36",
  "08:55",
  "09:22",
  "10:48",
  "11:11",
  "13:09",
  "14:44",
  "15:02",
  "16:17",
  "17:33",
  "09:08",
  "10:31",
  "11:52",
];

function time24To12hParts(time24: string): { compact: string; detail: string } {
  const [hRaw, minRaw] = time24.split(":").map((s) => parseInt(s, 10));
  const period = hRaw >= 12 ? "PM" : "AM";
  let h12 = hRaw % 12;
  if (h12 === 0) h12 = 12;
  const mm = String(minRaw).padStart(2, "0");
  return {
    compact: `${h12}:${mm}${period}`,
    detail: `${h12}:${mm} ${period}`,
  };
}

export function getPrototypeRowDate(rowIndex: number): Date {
  const d = new Date(PROTOTYPE_NEWEST);
  d.setDate(d.getDate() - rowIndex);
  return d;
}

/** Desktop table: `M/DD/YY 9:42AM` (compact, no space before AM — matches prior Message Center style). */
export function formatDesktopMessageDeliveryDate(rowIndex: number): string {
  const d = getPrototypeRowDate(rowIndex);
  const m = d.getMonth() + 1;
  const day = String(d.getDate()).padStart(2, "0");
  const yy = String(d.getFullYear() % 100).padStart(2, "0");
  const time24 =
    PROTOTYPE_DELIVERY_TIME_24[rowIndex % PROTOTYPE_DELIVERY_TIME_24.length];
  const { compact } = time24To12hParts(time24);
  return `${m}/${day}/${yy} ${compact}`;
}

/** App message detail line: `9:42 AM` (spaced, for “April 27, 2026 · …”). */
export function formatDetailSheetTime(rowIndex: number): string {
  const time24 =
    PROTOTYPE_DELIVERY_TIME_24[rowIndex % PROTOTYPE_DELIVERY_TIME_24.length];
  return time24To12hParts(time24).detail;
}

/** App inbox list: `April 27` (month name + day; detail sheet adds year). */
export function formatAppInboxRowDateLabel(rowIndex: number): string {
  const d = getPrototypeRowDate(rowIndex);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}
