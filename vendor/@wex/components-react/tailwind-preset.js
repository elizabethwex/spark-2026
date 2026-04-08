/**
 * @wex/components-react Tailwind CSS Preset
 *
 * This preset provides the component-specific Tailwind configuration
 * for WEX components. It defines custom utilities that map to CSS variables.
 *
 * IMPORTANT: You should also include the @wex/design-tokens preset
 * to get the full theme configuration (colors, typography, etc.).
 *
 * @example
 * // tailwind.config.ts
 * import wexComponentsPreset from '@wex/components-react/tailwind-preset';
 * import wexDesignTokensPreset from '@wex/design-tokens/tailwind-preset';
 *
 * export default {
 *   presets: [wexDesignTokensPreset, wexComponentsPreset],
 *   content: [
 *     './src/**\/*.{js,ts,jsx,tsx}',
 *     './node_modules/@wex/components-react/dist/**\/*.js',
 *   ],
 * };
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      // Component-specific colors that reference CSS variables
      // These are flat mappings for use in component class names
      colors: {
        // ============================================================
        // Button Solid Variants
        // ============================================================
        'wex-button-primary-bg': 'hsl(var(--wex-component-button-primary-bg) / <alpha-value>)',
        'wex-button-primary-fg': 'hsl(var(--wex-component-button-primary-fg) / <alpha-value>)',
        'wex-button-primary-border': 'hsl(var(--wex-component-button-primary-border) / <alpha-value>)',
        'wex-button-primary-hover-bg': 'hsl(var(--wex-component-button-primary-hover-bg) / <alpha-value>)',
        'wex-button-primary-active-bg': 'hsl(var(--wex-component-button-primary-active-bg) / <alpha-value>)',
        'wex-button-primary-disabled-bg': 'hsl(var(--wex-component-button-primary-disabled-bg) / <alpha-value>)',
        'wex-button-primary-disabled-fg': 'hsl(var(--wex-component-button-primary-disabled-fg) / <alpha-value>)',

        'wex-button-secondary-bg': 'hsl(var(--wex-component-button-secondary-bg) / <alpha-value>)',
        'wex-button-secondary-fg': 'hsl(var(--wex-component-button-secondary-fg) / <alpha-value>)',
        'wex-button-secondary-border': 'hsl(var(--wex-component-button-secondary-border) / <alpha-value>)',
        'wex-button-secondary-hover-bg': 'hsl(var(--wex-component-button-secondary-hover-bg) / <alpha-value>)',
        'wex-button-secondary-active-bg': 'hsl(var(--wex-component-button-secondary-active-bg) / <alpha-value>)',
        'wex-button-secondary-disabled-bg': 'hsl(var(--wex-component-button-secondary-disabled-bg) / <alpha-value>)',
        'wex-button-secondary-disabled-fg': 'hsl(var(--wex-component-button-secondary-disabled-fg) / <alpha-value>)',

        'wex-button-destructive-bg': 'hsl(var(--wex-component-button-destructive-bg) / <alpha-value>)',
        'wex-button-destructive-fg': 'hsl(var(--wex-component-button-destructive-fg) / <alpha-value>)',
        'wex-button-destructive-border': 'hsl(var(--wex-component-button-destructive-border) / <alpha-value>)',
        'wex-button-destructive-hover-bg': 'hsl(var(--wex-component-button-destructive-hover-bg) / <alpha-value>)',
        'wex-button-destructive-active-bg': 'hsl(var(--wex-component-button-destructive-active-bg) / <alpha-value>)',
        'wex-button-destructive-disabled-bg': 'hsl(var(--wex-component-button-destructive-disabled-bg) / <alpha-value>)',
        'wex-button-destructive-disabled-fg': 'hsl(var(--wex-component-button-destructive-disabled-fg) / <alpha-value>)',

        'wex-button-success-bg': 'hsl(var(--wex-component-button-success-bg) / <alpha-value>)',
        'wex-button-success-fg': 'hsl(var(--wex-component-button-success-fg) / <alpha-value>)',
        'wex-button-success-border': 'hsl(var(--wex-component-button-success-border) / <alpha-value>)',
        'wex-button-success-hover-bg': 'hsl(var(--wex-component-button-success-hover-bg) / <alpha-value>)',
        'wex-button-success-active-bg': 'hsl(var(--wex-component-button-success-active-bg) / <alpha-value>)',
        'wex-button-success-disabled-bg': 'hsl(var(--wex-component-button-success-disabled-bg) / <alpha-value>)',
        'wex-button-success-disabled-fg': 'hsl(var(--wex-component-button-success-disabled-fg) / <alpha-value>)',

        'wex-button-info-bg': 'hsl(var(--wex-component-button-info-bg) / <alpha-value>)',
        'wex-button-info-fg': 'hsl(var(--wex-component-button-info-fg) / <alpha-value>)',
        'wex-button-info-border': 'hsl(var(--wex-component-button-info-border) / <alpha-value>)',
        'wex-button-info-hover-bg': 'hsl(var(--wex-component-button-info-hover-bg) / <alpha-value>)',
        'wex-button-info-active-bg': 'hsl(var(--wex-component-button-info-active-bg) / <alpha-value>)',
        'wex-button-info-disabled-bg': 'hsl(var(--wex-component-button-info-disabled-bg) / <alpha-value>)',
        'wex-button-info-disabled-fg': 'hsl(var(--wex-component-button-info-disabled-fg) / <alpha-value>)',

        'wex-button-warning-bg': 'hsl(var(--wex-component-button-warning-bg) / <alpha-value>)',
        'wex-button-warning-fg': 'hsl(var(--wex-component-button-warning-fg) / <alpha-value>)',
        'wex-button-warning-border': 'hsl(var(--wex-component-button-warning-border) / <alpha-value>)',
        'wex-button-warning-hover-bg': 'hsl(var(--wex-component-button-warning-hover-bg) / <alpha-value>)',
        'wex-button-warning-active-bg': 'hsl(var(--wex-component-button-warning-active-bg) / <alpha-value>)',
        'wex-button-warning-disabled-bg': 'hsl(var(--wex-component-button-warning-disabled-bg) / <alpha-value>)',
        'wex-button-warning-disabled-fg': 'hsl(var(--wex-component-button-warning-disabled-fg) / <alpha-value>)',

        'wex-button-help-bg': 'hsl(var(--wex-component-button-help-bg) / <alpha-value>)',
        'wex-button-help-fg': 'hsl(var(--wex-component-button-help-fg) / <alpha-value>)',
        'wex-button-help-border': 'hsl(var(--wex-component-button-help-border) / <alpha-value>)',
        'wex-button-help-hover-bg': 'hsl(var(--wex-component-button-help-hover-bg) / <alpha-value>)',
        'wex-button-help-active-bg': 'hsl(var(--wex-component-button-help-active-bg) / <alpha-value>)',
        'wex-button-help-disabled-bg': 'hsl(var(--wex-component-button-help-disabled-bg) / <alpha-value>)',
        'wex-button-help-disabled-fg': 'hsl(var(--wex-component-button-help-disabled-fg) / <alpha-value>)',

        'wex-button-contrast-bg': 'hsl(var(--wex-component-button-contrast-bg) / <alpha-value>)',
        'wex-button-contrast-fg': 'hsl(var(--wex-component-button-contrast-fg) / <alpha-value>)',
        'wex-button-contrast-border': 'hsl(var(--wex-component-button-contrast-border) / <alpha-value>)',
        'wex-button-contrast-hover-bg': 'hsl(var(--wex-component-button-contrast-hover-bg) / <alpha-value>)',
        'wex-button-contrast-active-bg': 'hsl(var(--wex-component-button-contrast-active-bg) / <alpha-value>)',
        'wex-button-contrast-disabled-bg': 'hsl(var(--wex-component-button-contrast-disabled-bg) / <alpha-value>)',
        'wex-button-contrast-disabled-fg': 'hsl(var(--wex-component-button-contrast-disabled-fg) / <alpha-value>)',

        'wex-button-tertiary-fg': 'hsl(var(--wex-component-button-tertiary-fg) / <alpha-value>)',
        'wex-button-tertiary-hover-bg': 'hsl(var(--wex-component-button-tertiary-hover-bg) / <alpha-value>)',
        'wex-button-tertiary-active-bg': 'hsl(var(--wex-component-button-tertiary-active-bg) / <alpha-value>)',
        'wex-button-tertiary-disabled-fg': 'hsl(var(--wex-component-button-tertiary-disabled-fg) / <alpha-value>)',

        'wex-button-link-fg': 'hsl(var(--wex-component-button-link-fg) / <alpha-value>)',
        'wex-button-link-hover-fg': 'hsl(var(--wex-component-button-link-hover-fg) / <alpha-value>)',
        'wex-button-link-active-fg': 'hsl(var(--wex-component-button-link-active-fg) / <alpha-value>)',
        'wex-button-link-disabled-fg': 'hsl(var(--wex-component-button-link-disabled-fg) / <alpha-value>)',

        // ============================================================
        // Button Outline Variants (NEW)
        // ============================================================
        'wex-button-primary-outline-fg': 'hsl(var(--wex-component-button-primary-outline-fg) / <alpha-value>)',
        'wex-button-primary-outline-border': 'hsl(var(--wex-component-button-primary-outline-border) / <alpha-value>)',
        'wex-button-primary-outline-hover-bg': 'hsl(var(--wex-component-button-primary-outline-hover-bg) / <alpha-value>)',
        'wex-button-primary-outline-active-bg': 'hsl(var(--wex-component-button-primary-outline-active-bg) / <alpha-value>)',
        'wex-button-primary-outline-disabled-fg': 'hsl(var(--wex-component-button-primary-outline-disabled-fg) / <alpha-value>)',
        'wex-button-primary-outline-disabled-border': 'hsl(var(--wex-component-button-primary-outline-disabled-border) / <alpha-value>)',

        'wex-button-secondary-outline-fg': 'hsl(var(--wex-component-button-secondary-outline-fg) / <alpha-value>)',
        'wex-button-secondary-outline-border': 'hsl(var(--wex-component-button-secondary-outline-border) / <alpha-value>)',
        'wex-button-secondary-outline-hover-bg': 'hsl(var(--wex-component-button-secondary-outline-hover-bg) / <alpha-value>)',
        'wex-button-secondary-outline-active-bg': 'hsl(var(--wex-component-button-secondary-outline-active-bg) / <alpha-value>)',
        'wex-button-secondary-outline-disabled-fg': 'hsl(var(--wex-component-button-secondary-outline-disabled-fg) / <alpha-value>)',
        'wex-button-secondary-outline-disabled-border': 'hsl(var(--wex-component-button-secondary-outline-disabled-border) / <alpha-value>)',

        'wex-button-destructive-outline-fg': 'hsl(var(--wex-component-button-destructive-outline-fg) / <alpha-value>)',
        'wex-button-destructive-outline-border': 'hsl(var(--wex-component-button-destructive-outline-border) / <alpha-value>)',
        'wex-button-destructive-outline-hover-bg': 'hsl(var(--wex-component-button-destructive-outline-hover-bg) / <alpha-value>)',
        'wex-button-destructive-outline-active-bg': 'hsl(var(--wex-component-button-destructive-outline-active-bg) / <alpha-value>)',
        'wex-button-destructive-outline-disabled-fg': 'hsl(var(--wex-component-button-destructive-outline-disabled-fg) / <alpha-value>)',
        'wex-button-destructive-outline-disabled-border': 'hsl(var(--wex-component-button-destructive-outline-disabled-border) / <alpha-value>)',

        'wex-button-success-outline-fg': 'hsl(var(--wex-component-button-success-outline-fg) / <alpha-value>)',
        'wex-button-success-outline-border': 'hsl(var(--wex-component-button-success-outline-border) / <alpha-value>)',
        'wex-button-success-outline-hover-bg': 'hsl(var(--wex-component-button-success-outline-hover-bg) / <alpha-value>)',
        'wex-button-success-outline-active-bg': 'hsl(var(--wex-component-button-success-outline-active-bg) / <alpha-value>)',
        'wex-button-success-outline-disabled-fg': 'hsl(var(--wex-component-button-success-outline-disabled-fg) / <alpha-value>)',
        'wex-button-success-outline-disabled-border': 'hsl(var(--wex-component-button-success-outline-disabled-border) / <alpha-value>)',

        'wex-button-info-outline-fg': 'hsl(var(--wex-component-button-info-outline-fg) / <alpha-value>)',
        'wex-button-info-outline-border': 'hsl(var(--wex-component-button-info-outline-border) / <alpha-value>)',
        'wex-button-info-outline-hover-bg': 'hsl(var(--wex-component-button-info-outline-hover-bg) / <alpha-value>)',
        'wex-button-info-outline-active-bg': 'hsl(var(--wex-component-button-info-outline-active-bg) / <alpha-value>)',
        'wex-button-info-outline-disabled-fg': 'hsl(var(--wex-component-button-info-outline-disabled-fg) / <alpha-value>)',
        'wex-button-info-outline-disabled-border': 'hsl(var(--wex-component-button-info-outline-disabled-border) / <alpha-value>)',

        'wex-button-warning-outline-fg': 'hsl(var(--wex-component-button-warning-outline-fg) / <alpha-value>)',
        'wex-button-warning-outline-border': 'hsl(var(--wex-component-button-warning-outline-border) / <alpha-value>)',
        'wex-button-warning-outline-hover-bg': 'hsl(var(--wex-component-button-warning-outline-hover-bg) / <alpha-value>)',
        'wex-button-warning-outline-active-bg': 'hsl(var(--wex-component-button-warning-outline-active-bg) / <alpha-value>)',
        'wex-button-warning-outline-disabled-fg': 'hsl(var(--wex-component-button-warning-outline-disabled-fg) / <alpha-value>)',
        'wex-button-warning-outline-disabled-border': 'hsl(var(--wex-component-button-warning-outline-disabled-border) / <alpha-value>)',

        'wex-button-help-outline-fg': 'hsl(var(--wex-component-button-help-outline-fg) / <alpha-value>)',
        'wex-button-help-outline-border': 'hsl(var(--wex-component-button-help-outline-border) / <alpha-value>)',
        'wex-button-help-outline-hover-bg': 'hsl(var(--wex-component-button-help-outline-hover-bg) / <alpha-value>)',
        'wex-button-help-outline-active-bg': 'hsl(var(--wex-component-button-help-outline-active-bg) / <alpha-value>)',
        'wex-button-help-outline-disabled-fg': 'hsl(var(--wex-component-button-help-outline-disabled-fg) / <alpha-value>)',
        'wex-button-help-outline-disabled-border': 'hsl(var(--wex-component-button-help-outline-disabled-border) / <alpha-value>)',

        'wex-button-contrast-outline-fg': 'hsl(var(--wex-component-button-contrast-outline-fg) / <alpha-value>)',
        'wex-button-contrast-outline-border': 'hsl(var(--wex-component-button-contrast-outline-border) / <alpha-value>)',
        'wex-button-contrast-outline-hover-bg': 'hsl(var(--wex-component-button-contrast-outline-hover-bg) / <alpha-value>)',
        'wex-button-contrast-outline-active-bg': 'hsl(var(--wex-component-button-contrast-outline-active-bg) / <alpha-value>)',
        'wex-button-contrast-outline-disabled-fg': 'hsl(var(--wex-component-button-contrast-outline-disabled-fg) / <alpha-value>)',
        'wex-button-contrast-outline-disabled-border': 'hsl(var(--wex-component-button-contrast-outline-disabled-border) / <alpha-value>)',

        // ============================================================
        // Float label tokens
        // ============================================================
        'wex-floatlabel-label-fg': 'hsl(var(--wex-component-floatlabel-label-fg) / <alpha-value>)',
        'wex-floatlabel-label-focus-fg': 'hsl(var(--wex-component-floatlabel-label-focus-fg) / <alpha-value>)',
        'wex-floatlabel-label-filled-fg': 'hsl(var(--wex-component-floatlabel-label-filled-fg) / <alpha-value>)',

        // ============================================================
        // Alert tokens
        // ============================================================
        'wex-alert-default-bg': 'hsl(var(--wex-component-alert-default-bg) / <alpha-value>)',
        'wex-alert-default-fg': 'hsl(var(--wex-component-alert-default-fg) / <alpha-value>)',
        'wex-alert-default-border': 'hsl(var(--wex-component-alert-default-border) / <alpha-value>)',
        'wex-alert-default-icon': 'hsl(var(--wex-component-alert-default-icon) / <alpha-value>)',

        'wex-alert-info-bg': 'hsl(var(--wex-component-alert-info-bg) / <alpha-value>)',
        'wex-alert-info-fg': 'hsl(var(--wex-component-alert-info-fg) / <alpha-value>)',
        'wex-alert-info-border': 'hsl(var(--wex-component-alert-info-border) / <alpha-value>)',
        'wex-alert-info-icon': 'hsl(var(--wex-component-alert-info-icon) / <alpha-value>)',

        'wex-alert-success-bg': 'hsl(var(--wex-component-alert-success-bg) / <alpha-value>)',
        'wex-alert-success-fg': 'hsl(var(--wex-component-alert-success-fg) / <alpha-value>)',
        'wex-alert-success-border': 'hsl(var(--wex-component-alert-success-border) / <alpha-value>)',
        'wex-alert-success-icon': 'hsl(var(--wex-component-alert-success-icon) / <alpha-value>)',

        'wex-alert-warning-bg': 'hsl(var(--wex-component-alert-warning-bg) / <alpha-value>)',
        'wex-alert-warning-fg': 'hsl(var(--wex-component-alert-warning-fg) / <alpha-value>)',
        'wex-alert-warning-border': 'hsl(var(--wex-component-alert-warning-border) / <alpha-value>)',
        'wex-alert-warning-icon': 'hsl(var(--wex-component-alert-warning-icon) / <alpha-value>)',

        'wex-alert-destructive-bg': 'hsl(var(--wex-component-alert-destructive-bg) / <alpha-value>)',
        'wex-alert-destructive-fg': 'hsl(var(--wex-component-alert-destructive-fg) / <alpha-value>)',
        'wex-alert-destructive-border': 'hsl(var(--wex-component-alert-destructive-border) / <alpha-value>)',
        'wex-alert-destructive-icon': 'hsl(var(--wex-component-alert-destructive-icon) / <alpha-value>)',

        // ============================================================
        // Badge tokens
        // ============================================================
        'wex-badge-neutral-bg': 'hsl(var(--wex-component-badge-neutral-bg) / <alpha-value>)',
        'wex-badge-neutral-fg': 'hsl(var(--wex-component-badge-neutral-fg) / <alpha-value>)',
        'wex-badge-neutral-border': 'hsl(var(--wex-component-badge-neutral-border) / <alpha-value>)',

        'wex-badge-primary-bg': 'hsl(var(--wex-component-badge-primary-bg) / <alpha-value>)',
        'wex-badge-primary-fg': 'hsl(var(--wex-component-badge-primary-fg) / <alpha-value>)',
        'wex-badge-primary-border': 'hsl(var(--wex-component-badge-primary-border) / <alpha-value>)',

        'wex-badge-info-bg': 'hsl(var(--wex-component-badge-info-bg) / <alpha-value>)',
        'wex-badge-info-fg': 'hsl(var(--wex-component-badge-info-fg) / <alpha-value>)',
        'wex-badge-info-border': 'hsl(var(--wex-component-badge-info-border) / <alpha-value>)',

        'wex-badge-success-bg': 'hsl(var(--wex-component-badge-success-bg) / <alpha-value>)',
        'wex-badge-success-fg': 'hsl(var(--wex-component-badge-success-fg) / <alpha-value>)',
        'wex-badge-success-border': 'hsl(var(--wex-component-badge-success-border) / <alpha-value>)',

        'wex-badge-warning-bg': 'hsl(var(--wex-component-badge-warning-bg) / <alpha-value>)',
        'wex-badge-warning-fg': 'hsl(var(--wex-component-badge-warning-fg) / <alpha-value>)',
        'wex-badge-warning-border': 'hsl(var(--wex-component-badge-warning-border) / <alpha-value>)',

        'wex-badge-destructive-bg': 'hsl(var(--wex-component-badge-destructive-bg) / <alpha-value>)',
        'wex-badge-destructive-fg': 'hsl(var(--wex-component-badge-destructive-fg) / <alpha-value>)',
        'wex-badge-destructive-border': 'hsl(var(--wex-component-badge-destructive-border) / <alpha-value>)',

        'wex-badge-contrast-bg': 'hsl(var(--wex-component-badge-contrast-bg) / <alpha-value>)',
        'wex-badge-contrast-fg': 'hsl(var(--wex-component-badge-contrast-fg) / <alpha-value>)',
        'wex-badge-contrast-border': 'hsl(var(--wex-component-badge-contrast-border) / <alpha-value>)',

        // ============================================================
        // Toast tokens
        // ============================================================
        'wex-toast-info-bg': 'hsl(var(--wex-component-toast-info-bg) / <alpha-value>)',
        'wex-toast-info-fg': 'hsl(var(--wex-component-toast-info-fg) / <alpha-value>)',
        'wex-toast-info-border': 'hsl(var(--wex-component-toast-info-border) / <alpha-value>)',
        'wex-toast-info-icon': 'hsl(var(--wex-component-toast-info-icon) / <alpha-value>)',

        'wex-toast-success-bg': 'hsl(var(--wex-component-toast-success-bg) / <alpha-value>)',
        'wex-toast-success-fg': 'hsl(var(--wex-component-toast-success-fg) / <alpha-value>)',
        'wex-toast-success-border': 'hsl(var(--wex-component-toast-success-border) / <alpha-value>)',
        'wex-toast-success-icon': 'hsl(var(--wex-component-toast-success-icon) / <alpha-value>)',

        'wex-toast-destructive-bg': 'hsl(var(--wex-component-toast-destructive-bg) / <alpha-value>)',
        'wex-toast-destructive-fg': 'hsl(var(--wex-component-toast-destructive-fg) / <alpha-value>)',
        'wex-toast-destructive-border': 'hsl(var(--wex-component-toast-destructive-border) / <alpha-value>)',
        'wex-toast-destructive-icon': 'hsl(var(--wex-component-toast-destructive-icon) / <alpha-value>)',
      },

      // Minimum touch target sizes for WCAG 2.5.5
      minHeight: {
        target: '44px',
      },
      minWidth: {
        target: '44px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};
