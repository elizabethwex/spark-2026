/**
 * Conference prototype configuration (URLs and feature flags).
 * Override mobile app link via VITE_MOBILE_APP_FIGMA_URL in .env
 */
const envUrl = import.meta.env.VITE_MOBILE_APP_FIGMA_URL as string | undefined;

/** Figma (or other) URL for the mobile app prototype; opens in a new tab. */
export const MOBILE_APP_PROTOTYPE_URL =
  envUrl?.trim() ||
  "https://www.figma.com/proto/hn260IU0WqDWR76GStcB8M/Consumer-Experience-Redesign";
