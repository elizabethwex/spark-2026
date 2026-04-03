import { hexToLuminance } from "@/lib/accessibility";
import { generateColorRamp, rampToRecord, type RampStep } from "@/lib/colorRamp";
import type { ChartPaletteOption, ThemingEngineFormValues } from "./schema";
import { CHART_PALETTE_HEX } from "./chartPalettes";

// ─── Hex / HSL helpers ────────────────────────────────────────────────────────

function hexToHsl(hex: string): string {
  let h = hex.replace(/^#/, "");
  if (h.length === 3) h = h[0]! + h[0]! + h[1]! + h[1]! + h[2]! + h[2]!;
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let lightness = (max + min) / 2;
  let s = 0;
  let h_deg = 0;
  if (max !== min) {
    const d = max - min;
    s = lightness > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h_deg = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h_deg = ((b - r) / d + 2) / 6; break;
      default: h_deg = ((r - g) / d + 4) / 6;
    }
  }
  return `${Math.round(h_deg * 360)} ${Math.round(s * 100)}% ${Math.round(lightness * 100)}%`;
}

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace(/^#/, "");
  if (h.length === 3) h = h[0]! + h[0]! + h[1]! + h[1]! + h[2]! + h[2]!;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Blend hex with black by `amount` (0–1) to darken. */
function darkenHex(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const dr = Math.round(r * (1 - amount));
  const dg = Math.round(g * (1 - amount));
  const db = Math.round(b * (1 - amount));
  return `#${dr.toString(16).padStart(2, "0")}${dg.toString(16).padStart(2, "0")}${db.toString(16).padStart(2, "0")}`;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** UXT guide: cards — Sharp / Soft / Round */
const CARD_RADIUS = { square: "0px", soft: "12px", round: "32px" } as const;
/** UXT guide: buttons */
const BUTTON_RADIUS = { square: "0px", soft: "8px", round: "24px" } as const;
/** UXT guide: inputs */
const INPUT_RADIUS = { square: "0px", soft: "6px", round: "24px" } as const;
/** Preview AI chip / pill */
const AI_CHIP_RADIUS = { square: "0px", soft: "8px", round: "24px" } as const;

/** UXT Theme Value Mapping — card elevation (#2B314E at % opacity) */
const CARD_SHADOW_CSS: Record<"subtle" | "medium" | "elevated", string> = {
  subtle: "0 1.51px 4.53px 0 rgba(43, 49, 78, 0.04)",
  medium: "0 6.03px 18.1px 0 rgba(43, 49, 78, 0.06)",
  elevated: "0 18.1px 42.24px 0 rgba(43, 49, 78, 0.06)",
};

const UXT_CARD_BORDER_HEX = "#E3E7F4";

// System locks — aligned to UXT guide N1–N10. See src/requirements/theming-variables.md §3.
const LOCK_CARD_LIGHT       = "#FFFFFF";   // N4  Neutral 00
const LOCK_CARD_DARK        = "#1E293B";
const LOCK_BORDER           = "#E3E7F4";   // N5  Neutral 200
const LOCK_TEXT_PRIMARY     = "#14182C";   // N1  Neutral 900
const LOCK_TEXT_PRIMARY_DARK = "#F5F5F5";
const LOCK_MUTED_LIGHT      = "#5F6A94";   // N2  Neutral 700
const LOCK_MUTED_DARK       = "#94A3B8";
const LOCK_DISABLED_BG      = "#E3E7F4";   // N5  Neutral 200
const LOCK_ERROR            = "#DC2626";   // N10 Critical 600
const LOCK_SUCCESS          = "#009966";   // N7  Success 600
const LOCK_LINK             = "#1C6EFF";   // N6  Info 600; header links use --theme-header-text
const LOCK_FOCUS_RING_LIGHT = "#14182C";   // N1  high-contrast on light backgrounds
const LOCK_FOCUS_RING_DARK  = "#FFFFFF";   // white on dark backgrounds

const PRIMARY_FG_LUMINANCE_THRESHOLD = 0.4;

function getPrimaryForegroundHex(primaryHex: string): string {
  return hexToLuminance(primaryHex) < PRIMARY_FG_LUMINANCE_THRESHOLD ? "#FFFFFF" : "#1A1A1A";
}

// ─── User-input → CSS var mapping ─────────────────────────────────────────────

/** Auto-compute nav text: white on dark backgrounds, N1 on light. */
function getHeaderTextHex(headerBgHex: string): string {
  return hexToLuminance(headerBgHex) < 0.4 ? "#FFFFFF" : LOCK_TEXT_PRIMARY;
}

/**
 * Build CSS vars for an OKLCH color ramp.
 * Emits `--{prefix}-{step}: #hex` for each of the 11 steps.
 */
function buildRampVars(hex: string, prefix: string): Record<string, string> {
  const ramp = rampToRecord(generateColorRamp(hex));
  const vars: Record<string, string> = {};
  for (const step of Object.keys(ramp) as unknown as RampStep[]) {
    vars[`--${prefix}-${step}`] = ramp[step];
  }
  return vars;
}

function buildUserVars(brandColors: ThemingEngineFormValues["brandColors"], aiAgent: ThemingEngineFormValues["aiAgent"]): Record<string, string> {
  const { primary, secondary, pageBg, headerBg, illustration } = brandColors;
  const [pr, pg, pb] = hexToRgb(primary);
  const headerText = getHeaderTextHex(headerBg);

  const primaryRamp = buildRampVars(primary, "theme-primary-ramp");
  const secondaryRamp = buildRampVars(secondary, "theme-secondary-ramp");

  return {
    // OKLCH color ramps (11 steps each, 50–950)
    ...primaryRamp,
    ...secondaryRamp,

    // Passthrough semantic vars (used by consuming components that read --theme-*)
    "--theme-primary":      primary,
    "--theme-secondary":    secondary,
    "--theme-page-bg":      pageBg,
    "--theme-header-bg":    headerBg,
    "--theme-header-text":  headerText,
    "--theme-illustration": illustration,
    "--theme-ai-color":     aiAgent.accentColor,

    // Auto-computed — Section 2 of requirements doc
    "--theme-primary-hover":   darkenHex(primary, 0.15),
    "--theme-primary-surface": `rgba(${pr}, ${pg}, ${pb}, 0.10)`,

    // Internal ben-ui-kit / Tailwind CSS vars driven by user inputs
    "--primary":                              hexToHsl(primary),
    "--wex-primary":                          hexToHsl(primary),
    "--wex-component-button-primary-bg":      hexToHsl(primary),
    "--wex-component-button-primary-border":  hexToHsl(primary),
    "--wex-component-button-primary-hover-bg":hexToHsl(darkenHex(primary, 0.15)),
    "--wex-component-button-primary-active-bg":hexToHsl(darkenHex(primary, 0.15)),
    "--wex-component-button-secondary-fg":    hexToHsl(primary),
    "--wex-component-button-secondary-border":hexToHsl(primary),
    "--wex-component-button-secondary-outline-fg":    hexToHsl(primary),
    "--wex-component-button-secondary-outline-border":hexToHsl(primary),
    "--wex-nav-hover":    hexToHsl(primary),
    "--wex-nav-selected": hexToHsl(primary),
    "--wex-stepper-active":hexToHsl(primary),
    "--secondary":            hexToHsl(secondary),
    "--secondary-foreground":  hexToHsl(LOCK_TEXT_PRIMARY),
    "--wex-assist-iq-bg": hexToHsl(secondary),

    "--background": hexToHsl(pageBg),
    "--wex-header-bg": hexToHsl(headerBg),
    "--wex-header-fg": hexToHsl(headerText),

    // C6: AI agent color — cascades to --app-ai-color via app-tokens.css
    "--wex-ai-color": aiAgent.accentColor,
    "--wex-ai-color-hsl": hexToHsl(aiAgent.accentColor),
  };
}

// ─── Chart palette ─────────────────────────────────────────────────────────────

function getChartVars(paletteId: ChartPaletteOption): Record<string, string> {
  const hexes = CHART_PALETTE_HEX[paletteId];
  return {
    "--chart-1": hexToHsl(hexes[0] ?? "#0EA5E9"),
    "--chart-2": hexToHsl(hexes[1] ?? "#14B8A6"),
    "--chart-3": hexToHsl(hexes[2] ?? "#06B6D4"),
  };
}

// ─── System locks — applied last, always ──────────────────────────────────────

/**
 * Overwrites vars with hardcoded system values.
 * These must never be driven by partner brand colors — see requirements doc Section 3.
 */
function applySystemLocks(
  vars: Record<string, string>,
  darkMode: boolean,
  primaryHex: string
): void {
  // Card / modal backgrounds
  const cardHex = darkMode ? LOCK_CARD_DARK : LOCK_CARD_LIGHT;
  vars["--system-card-bg"]          = cardHex;
  vars["--card"]                    = hexToHsl(cardHex);
  vars["--wex-component-card-bg"]   = hexToHsl(cardHex);

  // Borders & dividers
  vars["--system-border"]           = LOCK_BORDER;
  vars["--border"]                  = hexToHsl(LOCK_BORDER);
  vars["--input"]                   = hexToHsl(LOCK_BORDER);
  vars["--wex-component-card-border"]  = hexToHsl(LOCK_BORDER);
  vars["--wex-component-input-border"] = hexToHsl(LOCK_BORDER);

  // Disabled states
  vars["--system-disabled-bg"] = LOCK_DISABLED_BG;

  // Primary text
  const textHex = darkMode ? LOCK_TEXT_PRIMARY_DARK : LOCK_TEXT_PRIMARY;
  vars["--system-text-primary"]     = textHex;
  vars["--foreground"]              = hexToHsl(textHex);
  vars["--card-foreground"]         = hexToHsl(textHex);
  vars["--wex-component-card-fg"]   = hexToHsl(textHex);
  vars["--wex-component-input-fg"]  = hexToHsl(textHex);

  // Muted text
  const mutedHex = darkMode ? LOCK_MUTED_DARK : LOCK_MUTED_LIGHT;
  vars["--muted-foreground"] = hexToHsl(mutedHex);

  // Status
  vars["--system-error"]       = LOCK_ERROR;
  vars["--destructive"]        = hexToHsl(LOCK_ERROR);
  vars["--system-success"]     = LOCK_SUCCESS;
  vars["--success"]            = hexToHsl(LOCK_SUCCESS);

  // Hyperlinks (outside header)
  vars["--system-link"] = LOCK_LINK;

  // Focus ring — computed from page-bg luminance, then locked
  const pageBgHex = vars["--theme-page-bg"] ?? LOCK_CARD_LIGHT;
  const focusRingHex = hexToLuminance(pageBgHex) < 0.4 ? LOCK_FOCUS_RING_DARK : LOCK_FOCUS_RING_LIGHT;
  vars["--theme-focus-ring"] = focusRingHex;
  vars["--ring"] = hexToHsl(focusRingHex);

  // Primary button foreground — computed, not user-controlled
  const primaryFg = getPrimaryForegroundHex(primaryHex);
  vars["--primary-foreground"]                 = hexToHsl(primaryFg);
  vars["--wex-component-button-primary-fg"]    = hexToHsl(primaryFg);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Maps theming engine form values to CSS variables for the preview pane.
 *
 * Order of application (later entries win):
 *  1. User-input vars (6 brand colors + their internal mappings + computed hover/surface)
 *  2. Chart palette vars
 *  3. Radius vars
 *  4. System locks (card, border, text, status, link, focus-ring, primary-fg) — always last
 *
 * See src/requirements/theming-variables.md for the full contract.
 */
export function themeToCssVars(
  values: ThemingEngineFormValues,
  darkMode = false
): Record<string, string> {
  const {
    brandColors,
    chartPalette,
    globalCornerRadiusEnabled,
    globalCornerRadius,
    cardRadius,
    buttonRadius,
    inputRadius,
    cardShadow,
    cardBorder,
    aiAgent,
  } = values;

  const cMode = globalCornerRadiusEnabled ? globalCornerRadius : null;
  const cardR = cMode ? CARD_RADIUS[cMode] : CARD_RADIUS[cardRadius];
  const buttonR = cMode ? BUTTON_RADIUS[cMode] : BUTTON_RADIUS[buttonRadius];
  const inputR = cMode ? INPUT_RADIUS[cMode] : INPUT_RADIUS[inputRadius];
  const aiChipR = AI_CHIP_RADIUS[aiAgent.borderRadius];

  const vars = buildUserVars(brandColors, aiAgent);

  Object.assign(vars, getChartVars(chartPalette));

  // Do NOT set --radius globally. The kit maps all Tailwind rounded-* utilities to
  // calc(var(--radius) ± Xpx), so a global change would affect checkboxes, badges,
  // alerts, tabs, and every other component. Instead, expose per-element radius vars
  // consumed by the scoped <style> block in ThemingEnginePreviewPane, which targets
  // only cards, buttons, and inputs.
  vars["--preview-card-radius"]   = cardR;
  vars["--preview-button-radius"] = buttonR;
  vars["--preview-input-radius"]  = inputR;
  vars["--preview-ai-chip-radius"] = aiChipR;

  // AI agent (preview-scoped; does not replace system semantic colors)
  vars["--theme-ai-accent"] = aiAgent.accentColor;
  vars["--theme-ai-accent-hsl"] = hexToHsl(aiAgent.accentColor);

  // Card shadow — UXT three tiers; preview + portal scoped overrides only.
  vars["--theme-card-shadow"] = CARD_SHADOW_CSS[cardShadow];

  // Card border — optional; fixed UXT color when on. Scoped in preview CSS, not --border lock.
  if (cardBorder === "withBorder") {
    vars["--theme-preview-card-border-width"] = "1.5px";
    vars["--theme-preview-card-border-color"] = UXT_CARD_BORDER_HEX;
  } else {
    vars["--theme-preview-card-border-width"] = "0px";
    vars["--theme-preview-card-border-color"] = "transparent";
  }

  // System locks must always be applied last — they cannot be overridden by user input
  applySystemLocks(vars, darkMode, brandColors.primary);

  return vars;
}
