import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import { createRequire } from "node:module";

/** Local design tokens preset (maps semantic colors to CSS vars from packages/design-tokens). */
const require = createRequire(import.meta.url);
const designTokensPreset = require(
  "./packages/design-tokens/tailwind-preset.js"
) as Config;

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
