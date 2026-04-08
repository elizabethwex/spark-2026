/**
 * @wex/components-react - WEX Design System React Components
 *
 * Theme-agnostic UI components built on Radix UI and shadcn/ui primitives.
 * These components consume CSS variables for styling but do not define their values.
 *
 * IMPORTANT: You must install and import a theme package (e.g., @wex/design-tokens)
 * for components to be styled correctly. Without a theme, components will render
 * with browser defaults.
 *
 * @example
 * // Import theme CSS first
 * import '@wex/design-tokens/css';
 *
 * // Then use components
 * import { WexButton, WexInput } from '@wex/components-react';
 *
 * // You can also import from specific categories:
 * import { WexButton } from '@wex/components-react/actions';
 * import { WexInput } from '@wex/components-react/form-inputs';
 */

// ===== UTILITY FUNCTION =====
export { cn } from "./lib/utils";

// ===== ACTIONS =====
export * from "./actions";

// ===== FORM INPUTS =====
export * from "./form-inputs";

// ===== FORM STRUCTURE =====
export * from "./form-structure";

// ===== LAYOUT =====
export * from "./layout";

// ===== DATA DISPLAY =====
export * from "./data-display";

// ===== FEEDBACK =====
export * from "./feedback";

// ===== NAVIGATION =====
export * from "./navigation";

// ===== OVERLAYS =====
export * from "./overlays";
