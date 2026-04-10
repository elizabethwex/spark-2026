import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import { createRequire } from "node:module";

/** Local design tokens preset (maps semantic colors to CSS vars from packages/design-tokens). */
const require = createRequire(import.meta.url);
const designTokensPreset = require(
  "./packages/design-tokens/tailwind-preset.js"
) as Config;

// Remove the WEX component tokens from the preset so they don't clutter the Tailwind UI inspector
if ((designTokensPreset.theme?.extend?.colors as any)?.wex) {
  delete (designTokensPreset.theme?.extend?.colors as any).wex;
}

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@wexinc-healthbenefits/ben-ui-kit/dist/**/*.js",
  ],
  presets: [designTokensPreset],
  theme: {
    extend: {
      colors: {
        neutral: {
          '00': 'var(--neutral-00)',
          50: 'var(--neutral-50)',
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
          900: 'var(--neutral-900)',
          950: 'var(--neutral-950)',
        },
        app: {
          primary: "var(--app-primary)",
          "primary-hover": "var(--app-primary-hover)",
          "primary-surface": "var(--app-primary-surface)",
          
          // Backgrounds & Surfaces
          bg: "var(--app-bg)",
          surface: "var(--app-surface)",
          "surface-raised": "var(--app-surface-raised)",
          
          // Text
          text: "var(--app-text)",
          "text-secondary": "var(--app-text-secondary)",
          "text-tertiary": "var(--app-text-tertiary)",
          "text-on-primary": "var(--app-text-on-primary)",
          
          // Semantic
          destructive: "var(--app-destructive)",
          success: "var(--app-success)",
          "success-surface": "var(--app-success-surface)",
          "success-text": "var(--app-success-text)",
          warning: "var(--app-warning)",
          "warning-surface": "var(--app-warning-surface)",
          "warning-text": "var(--app-warning-text)",
          info: "var(--app-info)",
          "info-surface": "var(--app-info-surface)",
          "info-text": "var(--app-info-text)",
        },
        icon: {
          default: "hsl(var(--icon-default))",
        }
      },
      screens: { mc: "400px" },
      animation: {
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        "shine-pulse": "shine-pulse 14s infinite linear",
      },
      keyframes: {
         "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        "shine-pulse": {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          "100%": {
            "background-position": "0% 0%",
          },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
