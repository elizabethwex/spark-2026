import type { ChartPaletteOption } from "./schema";

/** Color-blind accessible chart palettes. Each array provides at least 3 colors for --chart-1, --chart-2, --chart-3. */
export const CHART_PALETTE_HEX: Record<ChartPaletteOption, string[]> = {
  ocean: ["#0EA5E9", "#14B8A6", "#06B6D4"],
  vibrant: ["#7C3AED", "#2563EB", "#059669"],
  warm: ["#EA580C", "#DC2626", "#F59E0B"],
};
