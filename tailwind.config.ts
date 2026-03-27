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
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
