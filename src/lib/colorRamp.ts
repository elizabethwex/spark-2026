/**
 * OKLCH Color Ramp Generator
 *
 * Takes a single hex color (anchored at token 600) and generates an 11-step
 * ramp (50–950) using the OKLCH perceptual color space.
 *
 * Algorithm source: UXT-Theme Value Mapping - Design Guide (internal).
 * Library: culori (tree-shakeable via culori/fn).
 */

import {
  useMode,
  modeOklch,
  modeRgb,
  modeP3,
  converter,
  formatHex,
  displayable,
  clampChroma,
} from "culori/fn";

useMode(modeOklch);
useMode(modeRgb);
useMode(modeP3);

const toOklch = converter("oklch");
const toRgb = converter("rgb");

export const RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type RampStep = (typeof RAMP_STEPS)[number];

const TARGET_LIGHTNESS: Record<RampStep, number> = {
  50:  0.9619,
  100: 0.9299,
  200: 0.8699,
  300: 0.7853,
  400: 0.6939,
  500: 0.6024,
  600: 0.4997,
  700: 0.3730,
  800: 0.3170,
  900: 0.2601,
  950: 0.1958,
};

const CHROMA_MULTIPLIER: Record<RampStep, number> = {
  50:  0.1048,
  100: 0.1954,
  200: 0.3637,
  300: 0.6087,
  400: 0.7890,
  500: 0.9087,
  600: 1.0000,
  700: 1.0809,
  800: 0.8949,
  900: 0.6923,
  950: 0.4898,
};

const NEAR_GRAY_THRESHOLD = 0.03;
const CHROMA_FLOOR = 0.012;
const CHROMA_FLOOR_TRIGGER = 0.008;

export interface ColorRampStep {
  token: RampStep;
  hex: string;
}

/**
 * Generate an 11-step color ramp from a single hex input.
 * The input is anchored at token 600 (used verbatim).
 */
export function generateColorRamp(inputHex: string): ColorRampStep[] {
  const normalized = inputHex.startsWith("#") ? inputHex : `#${inputHex}`;
  const anchor = toOklch(normalized);
  if (!anchor) throw new Error(`Invalid hex color: ${inputHex}`);

  const cAnchor = anchor.c ?? 0;
  const hAnchor = anchor.h ?? 0;
  const isNearGray = cAnchor < NEAR_GRAY_THRESHOLD;

  return RAMP_STEPS.map((step) => {
    if (step === 600) {
      return { token: 600, hex: normalized.toLowerCase() };
    }

    const l = TARGET_LIGHTNESS[step];
    let c = cAnchor * CHROMA_MULTIPLIER[step];
    const h = hAnchor;

    if (!isNearGray && c < CHROMA_FLOOR_TRIGGER) {
      c = CHROMA_FLOOR;
    }

    let color = { mode: "oklch" as const, l, c, h };

    const rgb = toRgb(color);
    if (!rgb || !displayable(rgb)) {
      color = clampChroma(color, "oklch") as typeof color;
    }

    const hex = formatHex(color);
    return { token: step, hex: hex ?? "#000000" };
  });
}

/**
 * Convert a ramp array to a Record<step, hex> for easy lookup.
 */
export function rampToRecord(ramp: ColorRampStep[]): Record<RampStep, string> {
  return Object.fromEntries(ramp.map((s) => [s.token, s.hex])) as Record<RampStep, string>;
}
