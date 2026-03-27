# Style Dictionary Build Guide

This guide documents how to set up Style Dictionary for multi-platform token generation. Use this when you need to output tokens for platforms beyond web (iOS, Android, etc.) or want a programmatic token build system.

> **Note:** The current `@wex/design-tokens` package uses pre-built CSS files. This guide describes an alternative approach using Style Dictionary for more advanced use cases.

---

## Overview

The `@wex/design-tokens` package provides design tokens (colors, spacing, typography, etc.) in multiple formats for consumption by any framework.

### Package Outputs

| Format | File | Layer | Purpose |
|--------|------|-------|---------|
| CSS Variables (L1) | `dist/css/tokens.css` | 1 | Primitives & semantic tokens |
| shadcn Bridge (L2) | `dist/css/shadcn-bridge.css` | 2 | Maps WEX → shadcn/Spartan variable names |
| Components Bridge (L3) | `dist/css/components-bridge.css` | 3 | Component-specific slots for granular theming |
| TypeScript/ESM | `dist/js/tokens.js` + `tokens.d.ts` | — | Programmatic access with type safety |
| Tailwind Preset | `tailwind-preset.js` | 4 | Drop-in Tailwind configuration |
| JSON | `dist/json/tokens.json` | — | Raw token data for tooling |

---

## Token Layer Architecture

The package follows a 4-layer token architecture:

```
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 1: tokens.css                                                │
│  ─────────────────────────────────────────────────────────────────  │
│  Primitives (palette ramps) + Semantic roles                        │
│  --wex-palette-blue-700, --wex-primary, --wex-destructive           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 2: shadcn-bridge.css                                         │
│  ─────────────────────────────────────────────────────────────────  │
│  Maps WEX tokens → shadcn required variable names                   │
│  --primary: var(--wex-primary)                                      │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 3: components-bridge.css                                     │
│  ─────────────────────────────────────────────────────────────────  │
│  Component-specific slots for granular theming                      │
│  --wex-component-button-primary-bg: var(--wex-primary)              │
│  --wex-component-input-border: var(--wex-input-border)              │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  LAYER 4: tailwind-preset.js                                        │
│  ─────────────────────────────────────────────────────────────────  │
│  Exposes all CSS variables as Tailwind utilities                    │
│  bg-wex-button-primary-bg, border-wex-input-border                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Why Layer 3 Exists

Layer 3 solves the "primary bleed" problem where generic tokens like `--primary` are overused across components. With Layer 3:

- **Isolated customization** - Change button colors without affecting inputs
- **Variant richness** - Each button variant (primary, destructive, success) has explicit slots
- **Disabled states** - Components have dedicated `disabled-bg`, `disabled-fg`, `disabled-border` tokens
- **PrimeNG-level granularity** - Enables rich theming comparable to PrimeNG

---

## Prerequisites

Install Style Dictionary:

```bash
npm install -D style-dictionary
```

---

## Step 1: Convert Tokens to Style Dictionary Format

Style Dictionary uses JSON (or JS) as input. Convert the existing `wex.tokens.css` to JSON format.

### Source Token Structure

Create `tokens/` directory with organized token files:

```
tokens/
├── color/
│   ├── base.json        # Raw color values (palette ramps)
│   ├── semantic.json    # Semantic color assignments
│   └── component.json   # Component-specific colors (Layer 3)
├── spacing.json
├── typography.json
├── radius.json
├── shadow.json
└── animation.json
```

### Example: tokens/color/base.json

```json
{
  "color": {
    "base": {
      "white": { "value": "#ffffff" },
      "black": { "value": "#000000" },
      "blue": {
        "50": { "value": "#eff6ff" },
        "100": { "value": "#dbeafe" },
        "200": { "value": "#bfdbfe" },
        "300": { "value": "#93c5fd" },
        "400": { "value": "#60a5fa" },
        "500": { "value": "#3b82f6" },
        "600": { "value": "#2563eb" },
        "700": { "value": "#1d4ed8" },
        "800": { "value": "#1e40af" },
        "900": { "value": "#1e3a8a" },
        "950": { "value": "#172554" }
      }
    }
  }
}
```

### Example: tokens/color/semantic.json

```json
{
  "color": {
    "semantic": {
      "primary": {
        "value": "{color.base.blue.600}",
        "comment": "Primary brand color"
      },
      "primary-foreground": {
        "value": "{color.base.white}",
        "comment": "Text on primary backgrounds"
      },
      "destructive": {
        "value": "{color.base.red.600}",
        "comment": "Error and destructive actions"
      },
      "success": {
        "value": "{color.base.green.600}",
        "comment": "Success states"
      },
      "warning": {
        "value": "{color.base.amber.500}",
        "comment": "Warning states"
      },
      "info": {
        "value": "{color.base.blue.500}",
        "comment": "Informational states"
      }
    }
  }
}
```

### Example: tokens/color/component.json (Layer 3)

```json
{
  "component": {
    "button": {
      "primary": {
        "bg": { "value": "{color.semantic.primary}" },
        "fg": { "value": "{color.semantic.primary-foreground}" },
        "hover-bg": { "value": "{color.semantic.primary-hover}" },
        "disabled-bg": { "value": "{color.semantic.primary}" },
        "disabled-fg": { "value": "{color.semantic.primary-foreground}" }
      },
      "destructive": {
        "bg": { "value": "{color.semantic.destructive}" },
        "fg": { "value": "{color.semantic.destructive-foreground}" },
        "hover-bg": { "value": "{color.semantic.destructive-hover}" }
      }
    },
    "input": {
      "bg": { "value": "{color.semantic.background}" },
      "border": { "value": "{color.semantic.input}" },
      "focus-ring": { "value": "{color.semantic.ring}" },
      "disabled-bg": { "value": "{color.semantic.muted}" },
      "disabled-fg": { "value": "{color.semantic.muted-foreground}" }
    },
    "form": {
      "comment": "Shared form control tokens",
      "border": { "value": "{color.semantic.input}" },
      "focus-ring": { "value": "{color.semantic.ring}" },
      "checked-bg": { "value": "{color.semantic.primary}" },
      "checked-fg": { "value": "{color.semantic.primary-foreground}" }
    }
  }
}
```

### Example: tokens/spacing.json

```json
{
  "spacing": {
    "0": { "value": "0px" },
    "1": { "value": "4px" },
    "2": { "value": "8px" },
    "3": { "value": "12px" },
    "4": { "value": "16px" },
    "5": { "value": "20px" },
    "6": { "value": "24px" },
    "8": { "value": "32px" },
    "10": { "value": "40px" },
    "12": { "value": "48px" },
    "16": { "value": "64px" },
    "target": { 
      "value": "44px",
      "comment": "Minimum touch target size for accessibility"
    }
  }
}
```

### Example: tokens/radius.json

```json
{
  "radius": {
    "none": { "value": "0px" },
    "sm": { "value": "4px" },
    "md": { "value": "6px" },
    "lg": { "value": "8px" },
    "xl": { "value": "12px" },
    "2xl": { "value": "16px" },
    "full": { "value": "9999px" }
  }
}
```

---

## Step 2: Style Dictionary Configuration

Create `style-dictionary.config.js`:

```javascript
const StyleDictionary = require('style-dictionary');

// Custom format for TypeScript with const assertions
StyleDictionary.registerFormat({
  name: 'typescript/esm',
  formatter: function({ dictionary }) {
    const tokens = {};
    
    dictionary.allTokens.forEach(token => {
      const path = token.path;
      let current = tokens;
      
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = token.value;
    });
    
    return `// Auto-generated by Style Dictionary
// Do not edit directly

${Object.entries(tokens).map(([key, value]) => 
  `export const ${key} = ${JSON.stringify(value, null, 2)} as const;`
).join('\n\n')}

export type TokenValue = string | number;
export type TokenCategory = keyof typeof color | keyof typeof spacing | keyof typeof radius;
`;
  }
});

// Custom format for CSS custom properties with WEX prefix
StyleDictionary.registerFormat({
  name: 'css/wex-variables',
  formatter: function({ dictionary, options }) {
    const tokens = dictionary.allTokens
      .map(token => {
        const name = token.path.join('-');
        return `  --wex-${name}: ${token.value};`;
      })
      .join('\n');
    
    return `/* WEX Design Tokens - Auto-generated */
/* Do not edit directly */

:root {
${tokens}
}
`;
  }
});

// Custom format for component tokens (Layer 3)
StyleDictionary.registerFormat({
  name: 'css/wex-component-variables',
  formatter: function({ dictionary }) {
    const componentTokens = dictionary.allTokens
      .filter(token => token.path[0] === 'component')
      .map(token => {
        const name = token.path.join('-');
        return `  --wex-${name}: ${token.value};`;
      })
      .join('\n');
    
    return `/* WEX Component Tokens (Layer 3) - Auto-generated */
/* These tokens provide granular component-level theming */
/* All values reference Layer 1 semantic tokens */

:root {
${componentTokens}
}
`;
  }
});

module.exports = {
  source: ['tokens/**/*.json'],
  
  platforms: {
    // CSS Custom Properties (Layer 1)
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/wex-variables',
          filter: (token) => token.path[0] !== 'component'
        }
      ]
    },
    
    // Component tokens (Layer 3)
    'css-components': {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'components-bridge.css',
          format: 'css/wex-component-variables',
          filter: (token) => token.path[0] === 'component'
        }
      ]
    },
    
    // TypeScript/ESM
    js: {
      transformGroup: 'js',
      buildPath: 'dist/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'typescript/esm',
        }
      ]
    },
    
    // JSON for tooling
    json: {
      transformGroup: 'js',
      buildPath: 'dist/json/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/nested',
        }
      ]
    }
  }
};
```

---

## Step 3a: Create the shadcn Bridge (Layer 2)

The `shadcn-bridge.css` file maps WEX tokens to shadcn/ui variable names. This file is maintained manually (not generated by Style Dictionary) because it represents semantic mappings.

**dist/css/shadcn-bridge.css**

```css
/* WEX to shadcn/ui Variable Bridge (Layer 2) */
/* Maps WEX design tokens to shadcn component variable names */
/* This enables drop-in compatibility with shadcn/ui and Spartan UI */

:root {
  /* Background and foreground */
  --background: var(--wex-color-semantic-background);
  --foreground: var(--wex-color-semantic-foreground);
  
  /* Card */
  --card: var(--wex-color-semantic-card);
  --card-foreground: var(--wex-color-semantic-card-foreground);
  
  /* Popover */
  --popover: var(--wex-color-semantic-popover);
  --popover-foreground: var(--wex-color-semantic-popover-foreground);
  
  /* Primary */
  --primary: var(--wex-color-semantic-primary);
  --primary-foreground: var(--wex-color-semantic-primary-foreground);
  
  /* Secondary */
  --secondary: var(--wex-color-semantic-secondary);
  --secondary-foreground: var(--wex-color-semantic-secondary-foreground);
  
  /* Muted */
  --muted: var(--wex-color-semantic-muted);
  --muted-foreground: var(--wex-color-semantic-muted-foreground);
  
  /* Accent */
  --accent: var(--wex-color-semantic-accent);
  --accent-foreground: var(--wex-color-semantic-accent-foreground);
  
  /* Destructive */
  --destructive: var(--wex-color-semantic-destructive);
  --destructive-foreground: var(--wex-color-semantic-destructive-foreground);
  
  /* Semantic states */
  --success: var(--wex-color-semantic-success);
  --success-foreground: var(--wex-color-semantic-success-foreground);
  --warning: var(--wex-color-semantic-warning);
  --warning-foreground: var(--wex-color-semantic-warning-foreground);
  --info: var(--wex-color-semantic-info);
  --info-foreground: var(--wex-color-semantic-info-foreground);
  
  /* Border and input */
  --border: var(--wex-color-semantic-border);
  --input: var(--wex-color-semantic-input);
  --ring: var(--wex-color-semantic-ring);
  
  /* Radius */
  --radius: var(--wex-radius-md);
}

/* Dark mode overrides */
.dark {
  --background: var(--wex-color-semantic-background-dark);
  --foreground: var(--wex-color-semantic-foreground-dark);
  /* ... additional dark mode mappings ... */
}
```

---

## Step 3b: Create the Components Bridge (Layer 3)

The `components-bridge.css` file provides granular component-level tokens. This enables:

- **No "primary bleed"** - Components have explicit tokens instead of sharing `--primary`
- **Variant richness** - Each button variant (primary, destructive, success, etc.) has its own slots
- **Isolated customization** - Change button colors without affecting inputs
- **Disabled states** - Explicit tokens for disabled backgrounds, text, and borders

**Naming convention:** `--wex-component-{component}-{variant?}-{slot}`

**dist/css/components-bridge.css** (excerpt)

```css
/* WEX Component Tokens (Layer 3) */
/* These tokens provide granular component-level theming */
/* All values MUST reference Layer 1 tokens - NO raw hex values */

:root {
  /* ============================================================
     SHARED FORM CONTROL TOKENS
     Used by: Input, Textarea, Select, Checkbox, Radio, Switch
     ============================================================ */
  --wex-component-form-bg: var(--wex-content-bg);
  --wex-component-form-fg: var(--wex-text);
  --wex-component-form-border: var(--wex-input-border);
  --wex-component-form-border-hover: var(--wex-palette-slate-500);
  --wex-component-form-border-focus: var(--wex-primary);
  --wex-component-form-focus-ring: var(--wex-focus-ring-color);
  --wex-component-form-disabled-bg: var(--wex-surface-subtle);
  --wex-component-form-disabled-fg: var(--wex-text-muted);
  --wex-component-form-disabled-border: var(--wex-content-border);
  --wex-component-form-checked-bg: var(--wex-primary);
  --wex-component-form-checked-fg: var(--wex-primary-contrast);

  /* ============================================================
     BUTTON VARIANTS
     ============================================================ */
  
  /* Button: Primary */
  --wex-component-button-primary-bg: var(--wex-primary);
  --wex-component-button-primary-fg: var(--wex-primary-contrast);
  --wex-component-button-primary-border: var(--wex-primary);
  --wex-component-button-primary-hover-bg: var(--wex-primary-hover);
  --wex-component-button-primary-active-bg: var(--wex-primary-active);
  --wex-component-button-primary-focus-ring: var(--wex-focus-ring-color);
  --wex-component-button-primary-disabled-bg: var(--wex-primary);
  --wex-component-button-primary-disabled-fg: var(--wex-primary-contrast);
  
  /* Button: Secondary */
  --wex-component-button-secondary-bg: var(--wex-surface-subtle);
  --wex-component-button-secondary-fg: var(--wex-text);
  --wex-component-button-secondary-border: var(--wex-content-border);
  --wex-component-button-secondary-hover-bg: var(--wex-content-border);
  --wex-component-button-secondary-disabled-bg: var(--wex-surface-subtle);
  --wex-component-button-secondary-disabled-fg: var(--wex-text-muted);
  
  /* Button: Destructive */
  --wex-component-button-destructive-bg: var(--wex-destructive);
  --wex-component-button-destructive-fg: var(--wex-destructive-foreground);
  --wex-component-button-destructive-hover-bg: var(--wex-destructive-hover);
  --wex-component-button-destructive-disabled-bg: var(--wex-destructive);
  --wex-component-button-destructive-disabled-fg: var(--wex-destructive-foreground);

  /* Button: Success, Warning, Info, Help, Contrast, Link... */
  /* (See full file for all variants) */

  /* ============================================================
     INPUT
     ============================================================ */
  --wex-component-input-bg: var(--wex-component-form-bg);
  --wex-component-input-fg: var(--wex-component-form-fg);
  --wex-component-input-placeholder: var(--wex-text-muted);
  --wex-component-input-border: var(--wex-component-form-border);
  --wex-component-input-border-hover: var(--wex-component-form-border-hover);
  --wex-component-input-border-focus: var(--wex-component-form-border-focus);
  --wex-component-input-focus-ring: var(--wex-component-form-focus-ring);
  --wex-component-input-disabled-bg: var(--wex-component-form-disabled-bg);
  --wex-component-input-disabled-fg: var(--wex-component-form-disabled-fg);

  /* ============================================================
     TABLE
     ============================================================ */
  --wex-component-table-header-bg: var(--wex-surface-subtle);
  --wex-component-table-header-fg: var(--wex-text);
  --wex-component-table-row-bg: var(--wex-content-bg);
  --wex-component-table-row-alt-bg: var(--wex-surface-subtle);
  --wex-component-table-row-hover-bg: var(--wex-surface-subtle);
  --wex-component-table-selected-bg: var(--wex-highlight-bg);
  --wex-component-table-selected-fg: var(--wex-highlight-fg);

  /* ============================================================
     BADGE, ALERT, TOAST (with semantic variants)
     ============================================================ */
  --wex-component-badge-info-bg: var(--wex-info);
  --wex-component-badge-info-fg: var(--wex-info-foreground);
  --wex-component-badge-success-bg: var(--wex-success);
  --wex-component-badge-success-fg: var(--wex-success-foreground);
  /* ... etc ... */

  /* ============================================================
     DIALOG, CARD, TABS, and 40+ more components
     ============================================================ */
  /* See full components-bridge.css for complete token list */
}
```

---

## Step 4: Create Tailwind Preset (Layer 4)

**tailwind-preset.js**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Layer 2: Map to shadcn CSS variables
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Layer 3: Component-specific utilities
        wex: {
          button: {
            primary: {
              bg: "hsl(var(--wex-component-button-primary-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-button-primary-fg) / <alpha-value>)",
              "hover-bg": "hsl(var(--wex-component-button-primary-hover-bg) / <alpha-value>)",
              "disabled-bg": "hsl(var(--wex-component-button-primary-disabled-bg) / <alpha-value>)",
              "disabled-fg": "hsl(var(--wex-component-button-primary-disabled-fg) / <alpha-value>)",
            },
            secondary: {
              bg: "hsl(var(--wex-component-button-secondary-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-button-secondary-fg) / <alpha-value>)",
            },
            destructive: {
              bg: "hsl(var(--wex-component-button-destructive-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-button-destructive-fg) / <alpha-value>)",
            },
            // ... other button variants
          },
          input: {
            bg: "hsl(var(--wex-component-input-bg) / <alpha-value>)",
            fg: "hsl(var(--wex-component-input-fg) / <alpha-value>)",
            border: "hsl(var(--wex-component-input-border) / <alpha-value>)",
            "focus-ring": "hsl(var(--wex-component-input-focus-ring) / <alpha-value>)",
            "disabled-bg": "hsl(var(--wex-component-input-disabled-bg) / <alpha-value>)",
          },
          table: {
            "header-bg": "hsl(var(--wex-component-table-header-bg) / <alpha-value>)",
            "row-bg": "hsl(var(--wex-component-table-row-bg) / <alpha-value>)",
            "row-hover-bg": "hsl(var(--wex-component-table-row-hover-bg) / <alpha-value>)",
          },
          // ... 50+ more component token utilities
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      minHeight: {
        target: "44px", // Accessibility: minimum touch target
      },
      minWidth: {
        target: "44px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

---

## Step 5: Package Structure

Create the package directory structure:

```
packages/design-tokens/
├── package.json
├── README.md
├── LICENSE
├── style-dictionary.config.js
├── tailwind-preset.js
├── tokens/                      # Source tokens
│   ├── color/
│   │   ├── base.json           # Palette ramps
│   │   ├── semantic.json       # Semantic roles
│   │   └── component.json      # Component tokens (Layer 3)
│   ├── spacing.json
│   ├── typography.json
│   ├── radius.json
│   ├── shadow.json
│   └── animation.json
├── static/                      # Non-generated files
│   └── shadcn-bridge.css       # Layer 2 (manually maintained)
└── dist/                        # Generated outputs (gitignored)
    ├── css/
    │   ├── tokens.css          # Layer 1
    │   ├── shadcn-bridge.css   # Layer 2 (copied from static/)
    │   └── components-bridge.css # Layer 3
    ├── js/
    │   ├── tokens.js
    │   └── tokens.d.ts
    └── json/
        └── tokens.json
```

---

## Step 6: Package.json

**packages/design-tokens/package.json**

```json
{
  "name": "@wex/design-tokens",
  "version": "1.0.0",
  "description": "WEX Design System tokens - CSS variables, TypeScript, and Tailwind preset",
  "main": "dist/js/tokens.js",
  "module": "dist/js/tokens.js",
  "types": "dist/js/tokens.d.ts",
  "exports": {
    ".": {
      "import": "./dist/js/tokens.js",
      "require": "./dist/js/tokens.cjs",
      "types": "./dist/js/tokens.d.ts"
    },
    "./css": "./dist/css/tokens.css",
    "./css/tokens": "./dist/css/tokens.css",
    "./css/shadcn-bridge": "./dist/css/shadcn-bridge.css",
    "./css/components-bridge": "./dist/css/components-bridge.css",
    "./tailwind-preset": "./tailwind-preset.js",
    "./json": "./dist/json/tokens.json"
  },
  "files": [
    "dist",
    "tailwind-preset.js",
    "README.md"
  ],
  "scripts": {
    "build": "style-dictionary build && npm run copy-static",
    "copy-static": "cp static/shadcn-bridge.css dist/css/",
    "clean": "rm -rf dist",
    "prepublishOnly": "npm run clean && npm run build"
  },
  "devDependencies": {
    "style-dictionary": "^3.9.0"
  },
  "peerDependencies": {
    "tailwindcss": ">=3.0.0"
  },
  "peerDependenciesMeta": {
    "tailwindcss": {
      "optional": true
    }
  },
  "keywords": [
    "wex",
    "design-system",
    "design-tokens",
    "css-variables",
    "tailwind",
    "theme"
  ],
  "author": "WEX Design System Team",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/wex/design-tokens.git"
  }
}
```

---

## Step 7: Build the Package

```bash
cd packages/design-tokens

# Install dependencies
npm install

# Build all outputs
npm run build
```

This generates:
- `dist/css/tokens.css` - Layer 1: Primitives & semantics
- `dist/css/shadcn-bridge.css` - Layer 2: shadcn compatibility
- `dist/css/components-bridge.css` - Layer 3: Component slots
- `dist/js/tokens.js` - ESM JavaScript
- `dist/js/tokens.d.ts` - TypeScript declarations
- `dist/json/tokens.json` - Raw JSON

---

## Step 8: Publishing

### Option A: Artifactory (Private)

1. **Configure .npmrc** for Artifactory:

```bash
# .npmrc in package root
@wex:registry=https://artifactory.wexinc.com/artifactory/api/npm/npm-local/
//artifactory.wexinc.com/artifactory/api/npm/npm-local/:_authToken=${ARTIFACTORY_TOKEN}
```

2. **Authenticate:**

```bash
# Set environment variable
export ARTIFACTORY_TOKEN=your-token-here

# Or use npm login
npm login --registry=https://artifactory.wexinc.com/artifactory/api/npm/npm-local/
```

3. **Publish:**

```bash
npm publish
```

### Option B: Private NPM (GitHub Packages)

1. **Configure .npmrc:**

```bash
# .npmrc
@wex:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

2. **Update package.json repository field:**

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/wex-inc/design-tokens.git"
  },
  "publishConfig": {
    "@wex:registry": "https://npm.pkg.github.com"
  }
}
```

3. **Publish:**

```bash
npm publish
```

---

## Consumer Usage

### React (with shadcn/ui)

**1. Install:**

```bash
npm install @wex/design-tokens
```

**2. Import CSS (in global stylesheet or entry point):**

```css
/* styles/globals.css */

/* Layer 1: Core tokens (primitives, semantics) */
@import "@wex/design-tokens/css/tokens";

/* Layer 2: shadcn compatibility */
@import "@wex/design-tokens/css/shadcn-bridge";

/* Layer 3: Component-specific slots (optional but recommended) */
@import "@wex/design-tokens/css/components-bridge";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

**3. Configure Tailwind:**

```javascript
// tailwind.config.js
const wexPreset = require("@wex/design-tokens/tailwind-preset");

module.exports = {
  presets: [wexPreset],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
};
```

**4. Done!** shadcn components now use WEX colors with full Layer 3 granularity.

---

### Angular (with Spartan UI)

**1. Install:**

```bash
npm install @wex/design-tokens
```

**2. Import CSS (in angular.json):**

```json
{
  "styles": [
    "node_modules/@wex/design-tokens/dist/css/tokens.css",
    "node_modules/@wex/design-tokens/dist/css/shadcn-bridge.css",
    "node_modules/@wex/design-tokens/dist/css/components-bridge.css",
    "src/styles.scss"
  ]
}
```

**3. Configure Tailwind:**

```javascript
// tailwind.config.js
const wexPreset = require("@wex/design-tokens/tailwind-preset");

module.exports = {
  presets: [wexPreset],
  content: ["./src/**/*.{html,ts}"],
};
```

**4. Done!** Spartan components now use WEX colors.

---

### Programmatic Access (TypeScript)

```typescript
import { color, spacing, radius, component } from "@wex/design-tokens";

// Type-safe token access
const primaryColor = color.semantic.primary; // "var(--wex-color-semantic-primary)"
const targetSize = spacing.target; // "44px"

// Layer 3 component tokens
const buttonBg = component.button.primary.bg; // "var(--wex-component-button-primary-bg)"

// Use in dynamic styles
const buttonStyle = {
  backgroundColor: buttonBg,
  minHeight: targetSize,
};
```

---

## Versioning Strategy

Follow semantic versioning:

| Change Type | Version Bump | Example |
|-------------|--------------|---------|
| New tokens added | Minor | 1.0.0 → 1.1.0 |
| New component tokens added | Minor | 1.0.0 → 1.1.0 |
| Token value changed | Patch | 1.0.0 → 1.0.1 |
| Token renamed/removed | Major | 1.0.0 → 2.0.0 |
| Breaking structure change | Major | 1.0.0 → 2.0.0 |

---

## CI/CD Integration

### GitHub Actions Example

**.github/workflows/publish.yml**

```yaml
name: Publish Design Tokens

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://npm.pkg.github.com'
      
      - name: Install dependencies
        run: npm ci
        working-directory: packages/design-tokens
      
      - name: Build
        run: npm run build
        working-directory: packages/design-tokens
      
      - name: Publish
        run: npm publish
        working-directory: packages/design-tokens
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## Checklist

Before publishing:

### Source Files
- [ ] All token files are valid JSON
- [ ] Layer 3 component tokens reference Layer 1 (no raw hex values)
- [ ] `npm run build` succeeds

### Generated Outputs
- [ ] `dist/` contains all expected files:
  - [ ] `dist/css/tokens.css` (Layer 1)
  - [ ] `dist/css/shadcn-bridge.css` (Layer 2)
  - [ ] `dist/css/components-bridge.css` (Layer 3)
  - [ ] `dist/js/tokens.js`
  - [ ] `dist/json/tokens.json`
- [ ] `tailwind-preset.js` exports correctly

### Integration
- [ ] `shadcn-bridge.css` maps all required shadcn variables
- [ ] `components-bridge.css` covers all component tokens
- [ ] Package version bumped appropriately
- [ ] README updated if API changed
- [ ] Tested in consumer project (React and/or Angular)

---

## Troubleshooting

### "Cannot find module '@wex/design-tokens'"

Ensure the package is installed and your `.npmrc` is configured for the private registry.

### Tailwind colors not applying

1. Check that CSS files are imported before Tailwind directives
2. Verify `tailwind.config.js` includes the preset
3. Ensure content paths include your component files

### Layer 3 component tokens not applying

1. Ensure `components-bridge.css` is imported after `tokens.css`
2. Check import order:
   ```css
   @import "@wex/design-tokens/css/tokens";           /* Layer 1 first */
   @import "@wex/design-tokens/css/shadcn-bridge";    /* Layer 2 */
   @import "@wex/design-tokens/css/components-bridge"; /* Layer 3 last */
   ```
3. Verify the component token exists in the CSS file
4. Check browser DevTools for `--wex-component-*` variables on `:root`

### TypeScript types not working

Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "types": ["@wex/design-tokens"]
  }
}
```

### Component colors not matching Theme Builder

1. Re-export all 3 layers from Theme Builder
2. Ensure `components-bridge.css` was updated (not just `tokens.css`)
3. Verify Layer 3 tokens reference Layer 1 (check for `var(--wex-*)` not hex values)

---

## Questions?

Contact the Design System Team for assistance with package creation or publishing.
