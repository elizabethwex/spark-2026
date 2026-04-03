# Theming Variables — Requirements

> **How to update this file:**
> This document is the single source of truth for the theming system's variable contract.
> Update the relevant section when adding, renaming, or removing variables.
> After updating this file, also update `schema.ts`, `themeToCssVars.ts`, and `BrandColorsTab.tsx`
> to keep the implementation in sync.

**UXT alignment:** Partner and system color **roles**, **defaults**, **card shadows**, **borders**, **radius**, and **OKLCH ramp** guidance from the internal *UXT-Theme Value Mapping - Design Guide* are summarized in [**uxt-theme-value-mapping.md**](./uxt-theme-value-mapping.md). When changing locks or admin fields, reconcile with that doc.

---

## Architecture Overview

The theming system uses a three-tier model:

1. **User-Configurable** — The only 6 variables an admin can set in the panel.
2. **Auto-Computed** — Derived from user inputs in JavaScript at runtime; never shown in the UI.
3. **System Locks** — Hardcoded constants. Mapping any partner brand color to these is a **V1 requirement violation**.

```
User Input (6 vars)
      │
      ├─► Auto-Computed (primary-hover, primary-surface, focus-ring)
      │
      └─► Internal CSS vars (--primary, --background, --wex-header-bg, etc.)
                │
                └─► System Locks overlay last (card, border, text, status, link)
```

---

## Section 1 — User-Configurable Variables (Admin Panel Inputs)

These are the **only** 6 colors an admin can change (C1–C6). No other color fields should appear in the UI.

| Key | Variable | Schema field | Role | Applied To |
|-----|---|---|---|---|
| C1 | `--theme-primary` | `brandColors.primary` | The anchor brand color | Primary buttons, active states, key data visualizations |
| C2 | `--theme-secondary` | `brandColors.secondary` | The accent color | Secondary buttons, floating action buttons, active tab underlines |
| C3 | `--theme-page-bg` | `brandColors.pageBg` | The wallpaper behind content | Main `<body>` or root container |
| C4 | `--theme-header-bg` | `brandColors.headerBg` | Top navigation background | Navigation bar background |
| C5 | `--theme-illustration` | `brandColors.illustration` | Decorative accent color | Empty-state SVGs, hero graphics, decorative icons |
| C6 | `--theme-ai-color` | `brandColors.aiColor` | AI agent branding | AI assistant surfaces, chat bubbles, agent branding |

> **Navigation text** (`--theme-header-text` / `--wex-header-fg`) is **auto-computed** from
> `--theme-header-bg` luminance: white on dark backgrounds, `#14182C` on light. It is no longer
> a user-configurable field.

### Default Values

| Variable | Default Hex |
|---|---|
| `--theme-primary` | `#0073C2` |
| `--theme-secondary` | `#E2E5EA` |
| `--theme-page-bg` | `#F7F7F7` |
| `--theme-header-bg` | `#253746` |
| `--theme-illustration` | `#0EA5E9` |
| `--theme-ai-color` | `#C8102E` |

---

## Section 2 — Auto-Computed Derived Variables (Never Exposed in UI)

Calculated from user inputs at runtime in JavaScript. Do **not** add these to the admin panel.

### `--theme-header-text` / `--wex-header-fg`

- **Calculation:** Derived from `--theme-header-bg` luminance. White (`#FFFFFF`) when luminance < 0.4; primary text (`#0F172A`) otherwise.
- **JS implementation:** `getHeaderTextHex(headerBgHex)` in `themeToCssVars.ts`.
- **Usage:** Navigation bar text and icon fills. Guaranteed WCAG 2.1 AA contrast against the header background.

### `--theme-primary-hover`

- **Calculation:** Darken `--theme-primary` by 10–15%.
- **CSS equivalent:** `color-mix(in srgb, var(--theme-primary) 85%, black)`
- **JS implementation:** Darken the primary hex by blending ~15% black.
- **Usage:** Hover and active states on primary buttons.

### `--theme-primary-surface`

- **Calculation:** Apply 8–12% opacity to `--theme-primary`.
- **JS implementation:** `rgba(r, g, b, 0.10)` derived from the primary hex.
- **Usage:** Table header backgrounds, selected row highlights in data grids, background of Ghost buttons.

### `--theme-focus-ring`

- **Calculation:** Hard-locked (see Section 3). Listed here as a reminder that it is **not** derived from user input and must **not** be exposed in the UI.

---

## Section 3 — Strictly Hardcoded System Variables (V1 Non-Negotiable Locks)

> **V1 Enforcement Rule:**
> If the AI or any developer maps a partner's brand color to any variable in this section,
> it is a violation of V1 requirements. These values must never change based on admin input.

These are applied **last** in `themeToCssVars.ts`, overwriting anything set by user inputs or computed vars.

| Variable | Light Mode Value | Dark Mode Value | UXT Ref | Notes |
|---|---|---|---|---|
| `--system-card-bg` / `--card` | `#FFFFFF` | `#1E293B` | N4 | Cards and modals. Prevents brand colors on data containers. |
| `--system-border` / `--border` | `#E3E7F4` (Neutral 200) | `#E3E7F4` | N5 | Borders and dividers. Prevents neon table borders. |
| `--system-text-primary` / `--foreground` | `#14182C` (Neutral 900) | `#F5F5F5` | N1 | Primary text. Maximum readability. |
| `--muted-foreground` | `#5F6A94` (Neutral 700) | `#94A3B8` | N2 | Secondary / muted text. |
| `--system-disabled-bg` | `#E3E7F4` (Neutral 200) | `#E3E7F4` | N5 | Disabled state backgrounds. |
| `--system-error` / `--destructive` | `#DC2626` (Critical 600) | `#DC2626` | N10 | Error and destructive states. |
| `--system-success` / `--success` | `#009966` (Success 600) | `#009966` | N7 | Success states. |
| `--system-link` | `#1C6EFF` (Info 600) | `#1C6EFF` | N6 | Hyperlinks. Exception: links inside the header inherit `--theme-header-text`. |
| `--theme-focus-ring` | `#14182C` (Neutral 900, light bg) | `#FFFFFF` (dark bg) | N1 | Computed from page-bg luminance, then locked. |

---

## Section 4 — Preview-scoped card chrome (does not replace Section 3 locks)

These are set in `themeToCssVars.ts` **before** system locks. They must **not** overwrite `--border` / `--card` globals. Consumed only by scoped CSS in `ThemingEnginePreviewPane` (`[data-theming-preview] [data-preview-card]`) and the same vars when applied to the portal root for prototype demos.

| Variable | Purpose |
|---|---|
| `--theme-card-shadow` | UXT three-tier elevation (subtle / medium / elevated). |
| `--theme-preview-card-border-width` | `0px` or `1.5px` when card border is enabled. |
| `--theme-preview-card-border-color` | Fixed `#E3E7F4` when border on; `transparent` when off. |
| `--preview-card-radius`, `--preview-button-radius`, `--preview-input-radius` | UXT-aligned pixel radii per control. |
| `--preview-ai-chip-radius` | AI assistant chip in preview. |
| `--theme-ai-accent`, `--theme-ai-accent-hsl` | AI agent accent (preview chip); driven by `aiAgent.accentColor`, not `brandColors.aiColor`. |
| `--theme-ai-color` | C6 brand AI color. Cascades to `--wex-ai-color` and `--app-ai-color`. |
| `--wex-ai-color`, `--wex-ai-color-hsl` | WEX-layer AI color; consumed by `app-tokens.css` → `--app-ai-color`. |

**Theme JSON (export/import)** may also include: `cardShadow` (`subtle` \| `medium` \| `elevated`; legacy `flat`→`subtle`, `shadow`→`medium`), `cardBorder` (`withBorder` \| `withoutBorder`), `aiAgent` `{ name, iconPreset, accentColor, borderRadius }`, `secondaryLogoFile` omitted (always `null` in JSON). Legacy exports with `brandColors.headerText` are accepted on import (the field is stripped; header text is now auto-computed).

---

## Implementation Files

When updating this doc, keep these files in sync:

| File | Responsibility |
|---|---|
| `src/pages/theming-engine/schema.ts` | Zod schema: brand colors, logos, chart, styling, `aiAgent` |
| `src/pages/theming-engine/themeToCssVars.ts` | Maps inputs → CSS vars, applies computed and locked overrides |
| `src/pages/theming-engine/BrandColorsTab.tsx` | Admin UI — 6 brand color inputs |
| `src/pages/theming-engine/ComponentStylingTab.tsx` | Icon set, card shadow/border, corner radius |
| `src/pages/theming-engine/ChartCustomizationSection.tsx` | Chart palette + placeholder |
| `src/pages/theming-engine/LogoUploadsSection.tsx` | Primary / secondary logo uploads |
| `src/pages/theming-engine/AiAgentCustomizationTab.tsx` | AI preview chip fields |
| `src/pages/theming-engine/MemberDashboardPreview.tsx` | Preview layout + `data-theme-token` / `data-preview-card` |
| `src/styles/app-tokens.css` | Mobile `--app-*` theming bridge tokens (C1–C6 cascade) |
| `src/lib/accessibility.ts` | WCAG contrast checks for `BrandColorsForContrast` |
