import { themeToCssVars } from "@/pages/theming-engine/themeToCssVars";
import {
  defaultThemingEngineValues,
  themingEngineImportSchema,
  type ThemingEngineExportPayload,
  type ThemingEngineFormValues,
} from "@/pages/theming-engine/schema";

/** localStorage key for portal-wide theme (conference prototype). */
export const PORTAL_THEME_STORAGE_KEY = "portal-prototype-theme";

export function savePortalTheme(payload: ThemingEngineExportPayload): void {
  window.localStorage.setItem(PORTAL_THEME_STORAGE_KEY, JSON.stringify(payload));
}

/**
 * Load and validate stored theme. Returns null if missing or invalid.
 */
export function loadPortalTheme(): ThemingEngineFormValues | null {
  const raw = window.localStorage.getItem(PORTAL_THEME_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    const result = themingEngineImportSchema.safeParse(parsed);
    if (!result.success) return null;
    return {
      ...result.data,
      headerLogoFile: undefined,
      secondaryLogoFile: undefined,
    } as ThemingEngineFormValues;
  } catch {
    return null;
  }
}

export function clearPortalTheme(): void {
  window.localStorage.removeItem(PORTAL_THEME_STORAGE_KEY);
}

/** All CSS custom property names produced by the theming engine (for cleanup). */
function getAllThemingCssVarNames(): string[] {
  const vars = themeToCssVars(defaultThemingEngineValues, false);
  return Object.keys(vars);
}

/**
 * Apply saved portal theme to the document root so all routes use the same variables.
 */
export function applyPortalThemeToDocument(): void {
  const theme = loadPortalTheme() ?? defaultThemingEngineValues;
  const vars = themeToCssVars(theme, false);
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}

/**
 * Remove theming-engine variables from the document root (revert to design tokens).
 */
export function removePortalThemeFromDocument(): void {
  const root = document.documentElement;
  for (const key of getAllThemingCssVarNames()) {
    root.style.removeProperty(key);
  }
}
