const { createRequire } = require("node:module");
const require = createRequire(process.cwd() + "/");
const designTokensPreset = require("./packages/design-tokens/tailwind-preset.js");

if (designTokensPreset.theme && designTokensPreset.theme.extend && designTokensPreset.theme.extend.colors && designTokensPreset.theme.extend.colors.wex) {
  delete designTokensPreset.theme.extend.colors.wex;
  console.log("Deleted wex tokens");
} else {
  console.log("Could not find wex tokens");
}
