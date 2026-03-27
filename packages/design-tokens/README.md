# @wex/design-tokens

WEX Design System tokens for React and Angular applications.

This package provides CSS variables and a Tailwind CSS preset that work with [@wex/components](../wex-components), [shadcn/ui](https://ui.shadcn.com/) (React), and [Spartan UI](https://www.spartan.ng/) (Angular).

## Installation

```bash
npm install @wex/design-tokens
```

## Quick Start

### Option 1: All-in-One Import (Recommended)

Import all theme layers with a single statement:

```tsx
// main.tsx or App.tsx
import '@wex/design-tokens/css';
```

This imports:
- `tokens.css` - Core design tokens (palette, semantics)
- `shadcn-bridge.css` - shadcn/ui variable mappings
- `components-bridge.css` - Component-specific slot tokens

### Option 2: Individual Imports

For more control, import specific layers:

```css
/* styles/globals.css */
@import "@wex/design-tokens/css/tokens";
@import "@wex/design-tokens/css/shadcn-bridge";
@import "@wex/design-tokens/css/components-bridge";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Configure Tailwind

Add the WEX preset to your Tailwind configuration:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import wexDesignTokensPreset from '@wex/design-tokens/tailwind-preset';

export default {
  presets: [wexDesignTokensPreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx,html}',
    // If using @wex/components:
    './node_modules/@wex/components/dist/**/*.js',
  ],
} satisfies Config;
```

### Done!

You can now use WEX design tokens in your components:

```tsx
<button className="bg-primary text-primary-foreground hover:bg-primary-hover">
  Click me
</button>
```

---

## What's Included

### CSS Variables

| File | Purpose |
|------|---------|
| `tokens.css` | Core WEX design tokens (palette, semantics, typography) |
| `shadcn-bridge.css` | Maps WEX tokens to shadcn/ui variable names |
| `components-bridge.css` | Component-specific slot tokens for fine-grained theming |
| `index.css` | All-in-one bundle that imports all of the above |

### Token Categories

| Category | Examples |
|----------|----------|
| **Palette** | `--wex-palette-blue-500`, `--wex-palette-red-600`, etc. |
| **Colors** | `--wex-primary`, `--wex-destructive`, `--wex-success` |
| **Surfaces** | `--wex-content-bg`, `--wex-surface-subtle` |
| **Text** | `--wex-text`, `--wex-text-muted` |
| **Typography** | `--wex-font-sans`, `--wex-font-display` |
| **Accessibility** | `--wex-min-target` (44px touch target), focus ring tokens |
| **Components** | `--wex-component-button-primary-bg`, `--wex-component-input-border`, etc. |

### Tailwind Preset

Pre-configured Tailwind theme with:

- All semantic color utilities (`bg-primary`, `text-destructive`, etc.)
- Border radius variants
- Font families
- Accessibility utilities (`min-h-target`, `min-w-target`)
- Radix UI animations

---

## Exports

| Import Path | Description |
|-------------|-------------|
| `@wex/design-tokens` | Tailwind preset (default) |
| `@wex/design-tokens/tailwind-preset` | Tailwind preset |
| `@wex/design-tokens/css` | All CSS bundles combined |
| `@wex/design-tokens/css/tokens` | Core tokens only |
| `@wex/design-tokens/css/shadcn-bridge` | shadcn/ui bridge only |
| `@wex/design-tokens/css/components-bridge` | Component tokens only |

---

## Dark Mode

Dark mode is included automatically. Add the `dark` class to your root element:

```html
<html class="dark">
  <!-- Your app -->
</html>
```

Or use a theme provider like `next-themes`:

```tsx
import { ThemeProvider } from 'next-themes';

<ThemeProvider attribute="class">
  <App />
</ThemeProvider>
```

---

## White-Labeling / Custom Themes

This package architecture supports creating custom branded themes:

### Creating a Custom Theme

1. **Fork this package** to your organization
2. **Rename** to your brand (e.g., `@acme/design-tokens`)
3. **Modify `tokens.css`** with your brand colors:

```css
:root {
  /* Replace WEX colors with your brand */
  --wex-primary: 220 90% 45%; /* Your brand blue */
  --wex-brand-red: 15 95% 50%; /* Your brand accent */
  
  /* Palette can be regenerated or hand-tuned */
  --wex-palette-blue-500: 220 90% 45%;
  --wex-palette-blue-600: 220 90% 40%;
  /* ... */
}
```

4. **Publish** your custom package
5. **Install** in consuming apps:

```bash
npm install @acme/design-tokens @wex/components
```

```tsx
// Uses your brand colors with WEX components
import '@acme/design-tokens/css';
import { WexButton } from '@wex/components';
```

Components automatically use your theme's CSS variable values!

---

## Available Colors

### Intent Colors

| Color | Usage | Tailwind Class |
|-------|-------|----------------|
| `primary` | Interactive elements, CTAs | `bg-primary`, `text-primary` |
| `destructive` | Errors, delete actions | `bg-destructive`, `text-destructive` |
| `success` | Success states | `bg-success`, `text-success` |
| `warning` | Warnings, caution | `bg-warning`, `text-warning` |
| `info` | Informational | `bg-info`, `text-info` |

### Surface Colors

| Color | Usage | Tailwind Class |
|-------|-------|----------------|
| `background` | Page background | `bg-background` |
| `foreground` | Primary text | `text-foreground` |
| `muted` | Subtle backgrounds | `bg-muted` |
| `accent` | Hover states | `bg-accent` |
| `card` | Card backgrounds | `bg-card` |

### Utility Colors

| Color | Usage | Tailwind Class |
|-------|-------|----------------|
| `border` | Borders | `border-border` |
| `input` | Input borders | `border-input` |
| `ring` | Focus rings | `ring-ring` |

---

## Component Token Layers

The `components-bridge.css` provides granular theming for each component:

```css
/* Example: Button component tokens */
--wex-component-button-primary-bg: var(--wex-primary);
--wex-component-button-primary-fg: var(--wex-primary-contrast);
--wex-component-button-primary-hover-bg: var(--wex-primary-hover);

/* Example: Input component tokens */
--wex-component-input-bg: var(--wex-content-bg);
--wex-component-input-border: var(--wex-input-border);
--wex-component-input-focus-ring: var(--wex-focus-ring-color);
```

This allows fine-grained customization without modifying components.

---

## Peer Dependencies

- `tailwindcss` >= 3.0.0 (optional, for using the preset)

---

## Browser Support

- Chrome 88+
- Firefox 78+
- Safari 14+
- Edge 88+

---

## Support

Contact the WEX Design System team for assistance.
