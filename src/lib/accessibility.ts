/**
 * WCAG 2.1 contrast ratio utilities.
 * Used for warning-only accessibility feedback in the theming engine.
 */

/** Normalize hex to 6-char form and return [r, g, b] in 0–255 */
function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace(/^#/, "");
  if (h.length === 3) {
    h = h[0]! + h[0]! + h[1]! + h[1]! + h[2]! + h[2]!;
  }
  const n = parseInt(h, 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/**
 * Relative luminance per WCAG 2.1
 * https://www.w3.org/WAI/GL/wiki/Relative_luminance
 */
export function hexToLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

/**
 * Contrast ratio per WCAG 2.1 (1 to 21).
 * foreground: text color, background: background color
 */
export function getContrastRatio(foregroundHex: string, backgroundHex: string): number {
  const l1 = hexToLuminance(foregroundHex);
  const l2 = hexToLuminance(backgroundHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** WCAG 2.1 AA normal text minimum ratio */
export const WCAG_AA_NORMAL_MIN_RATIO = 4.5;

export interface ContrastWarning {
  field: string;
  message: string;
  ratio: number;
}

/** Brand colors shape for contrast checks — matches the 6-field schema (C1–C6). */
export interface BrandColorsForContrast {
  primary:      string;
  secondary:    string;
  pageBg:       string;
  headerBg:     string;
  illustration: string;
  aiColor:      string;
}

const REFERENCE_WHITE = "#FFFFFF";

/**
 * Returns warnings when a color used as text on white, or white on color as background,
 * fails WCAG 2.1 AA (4.5:1). Used for inline warnings only; does not block publish.
 * One warning per field (the worst ratio is reported).
 */
export function getContrastWarnings(colors: BrandColorsForContrast): ContrastWarning[] {
  const byField = new Map<string, ContrastWarning>();
  const entries = Object.entries(colors) as [string, string][];

  for (const [field, hex] of entries) {
    if (!hex || typeof hex !== "string" || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) continue;

    let worst: ContrastWarning | null = null;

    const ratioOnWhite = getContrastRatio(hex, REFERENCE_WHITE);
    if (ratioOnWhite < WCAG_AA_NORMAL_MIN_RATIO && ratioOnWhite >= 1) {
      worst = {
        field,
        message: `Contrast ratio ${ratioOnWhite.toFixed(1)}:1 on white background is below WCAG 2.1 AA (4.5:1) for normal text.`,
        ratio: ratioOnWhite,
      };
    }

    const ratioWhiteOnColor = getContrastRatio(REFERENCE_WHITE, hex);
    if (ratioWhiteOnColor < WCAG_AA_NORMAL_MIN_RATIO && ratioWhiteOnColor >= 1) {
      const w = {
        field,
        message: `White text on this color has contrast ${ratioWhiteOnColor.toFixed(1)}:1, below WCAG 2.1 AA (4.5:1).`,
        ratio: ratioWhiteOnColor,
      };
      if (!worst || w.ratio < worst.ratio) worst = w;
    }

    if (worst) byField.set(field, worst);
  }

  return Array.from(byField.values());
}

/**
 * Returns a warning when Header Text & Icons (foreground) on Header Background fails WCAG 2.1 AA (4.5:1).
 * Used for inline warning under Header Text & Icons; does not block publish.
 */
export function getHeaderContrastWarning(
  headerBgHex: string,
  headerTextHex: string
): ContrastWarning | null {
  if (
    !headerBgHex ||
    !headerTextHex ||
    !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(headerBgHex) ||
    !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(headerTextHex)
  ) {
    return null;
  }
  const ratio = getContrastRatio(headerTextHex, headerBgHex);
  if (ratio < WCAG_AA_NORMAL_MIN_RATIO && ratio >= 1) {
    return {
      field: "headerText",
      message: `Header text on header background has contrast ${ratio.toFixed(1)}:1, below WCAG 2.1 AA (4.5:1).`,
      ratio,
    };
  }
  return null;
}
