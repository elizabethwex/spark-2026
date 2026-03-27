/**
 * Style Dictionary Configuration for @wex/design-tokens
 * 
 * Generates platform-specific outputs (iOS, Android) from design-tokens.json
 * Web formats (CSS, SCSS, TS, JSON) are handled by build-tokens.cjs
 */

const fs = require('fs');
const path = require('path');

// Transform our flat token structure to Style Dictionary format
function transformTokensForStyleDictionary() {
  const tokensPath = path.join(__dirname, 'design-tokens.json');
  const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
  
  const transformed = {
    color: {}
  };
  
  // Transform light mode tokens (we'll use light mode for iOS/Android)
  Object.entries(tokens.light || {}).forEach(([key, value]) => {
    // Only process color tokens (skip fonts, spacing, etc.)
    if (key.includes('palette') || 
        key.includes('primary') || 
        key.includes('destructive') || 
        key.includes('success') || 
        key.includes('warning') || 
        key.includes('info') ||
        key.includes('chart') ||
        key.includes('brand')) {
      
      // Remove --wex- prefix and convert to nested structure
      const cleanKey = key.replace(/^--wex-/, '').replace(/-/g, '_');
      
      // Convert HSL format "H S% L%" to hex for Style Dictionary
      let hexValue = value;
      if (/^\d+\s+\d+%\s+\d+%$/.test(value)) {
        const [h, s, l] = value.split(/\s+/).map(v => parseFloat(v));
        hexValue = hslToHex(h, parseFloat(s), parseFloat(l));
      }
      
      transformed.color[cleanKey] = {
        value: hexValue,
        type: 'color'
      };
    }
  });
  
  return transformed;
}

// Convert HSL to hex
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  
  r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  b = Math.round((b + m) * 255).toString(16).padStart(2, '0');
  
  return `#${r}${g}${b}`;
}

// Create temporary transformed tokens file for Style Dictionary
const transformedTokens = transformTokensForStyleDictionary();
const tempTokensPath = path.join(__dirname, '.style-dictionary-tokens.json');
fs.writeFileSync(tempTokensPath, JSON.stringify(transformedTokens, null, 2));

module.exports = {
  source: ['.style-dictionary-tokens.json'],
  platforms: {
    ios: {
      transformGroup: 'ios',
      buildPath: 'ios/',
      files: [
        {
          destination: 'design-tokens.h',
          format: 'ios/colors.h'
        },
        {
          destination: 'design-tokens.m',
          format: 'ios/colors.m'
        }
      ]
    },
    android: {
      transformGroup: 'android',
      buildPath: 'android/',
      files: [
        {
          destination: 'design-tokens.xml',
          format: 'android/colors'
        }
      ]
    }
  }
};
