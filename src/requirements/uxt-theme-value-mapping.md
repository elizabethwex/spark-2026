# UXT Theme Value Mapping — Design Guide (summary)

> **Source:** UXT-Theme Value Mapping - Design Guide (internal). **Confidential:** Do not share outside WEX without explicit permission.  
> This file is a **developer-facing summary** for implementation alignment; keep in sync with the authoritative PDF.

## Partner-configurable colors (C1–C6)

| Key | Label | Role | Default hex (guide) | Notes |
|-----|--------|------|----------------------|--------|
| **C1** | Primary brand color | Main buttons, active tabs, icons | `#3958C3` (Primary 600) | Anchors OKLCH ramp at **token 600** when generating ramps. |
| **C2** | Secondary color | Secondary actions | — | Guide notes *currently unused*; keep field for future use. |
| **C3** | Page background | Page background | `#F8F9FE` | Maps to Neutral 50 in guide. |
| **C4** | Navigation background | Top navigation background | `#FFFFFF` | Maps to Neutral 00. |
| **C5** | Illustration accent | Illustration accents | `#1C6EFF` | Info 600 in guide. |
| **C6** | AI color | Solid for customizations; gradient for WEX Direct only | Solid default `#C8102E`; gradient TL `#25146F` → BR `#C8102E` | Not yet fully wired in cxr-ux schema; document when adding AI theming. |

### Mapping to this codebase (`schema.ts` / `themeToCssVars.ts`)

| UXT | Current field / token |
|-----|------------------------|
| C1 | `brandColors.primary` → `--theme-primary`, `--primary`, etc. |
| C2 | `brandColors.secondary` |
| C3 | `brandColors.pageBg` → `--theme-page-bg`, `--background` |
| C4 | `brandColors.headerBg` → `--theme-header-bg`, `--wex-header-bg` |
| C5 | `brandColors.illustration` → `--theme-illustration` |
| C6 | *Future:* extend schema + `themeToCssVars` for AI surfaces |

Default hex values in code may differ from the guide until an explicit migration; when changing defaults, prefer the table above.

## Immutable system guardrails (N1–N10 + ramps)

Partners **must not** override these via brand colors. They define neutrals, text hierarchy, card surfaces, semantic utilities, and WCAG guardrails.

| Key | Label | Light default (guide) | Ramp ref |
|-----|--------|-------------------------|----------|
| N1 | Primary text | `#14182C` | Neutral 900 |
| N2 | Secondary text | `#5F6A94` | Neutral 700 |
| N4 | Card surface | `#FFFFFF` | Neutral 00 |
| N5 | Border & dividers | `#E3E7F4` | Neutral 200 |
| N6 | Link color | `#1C6EFF` | Info 600 |
| N7 | Utility / success | `#009966` | Success 600 |
| N8 | Utility / warning | `#E6A800` | Warning 600 |
| N9 | Utility / info | `#1C6EFF` | Info 600 |
| N10 | Utility / critical | `#DC2626` | Critical 600 |

**Implementation:** These align with [theming-variables.md](./theming-variables.md) **Section 3 (System Locks)**. When updating locks, reconcile hex values with this guide (e.g. border `#E3E7F4` vs legacy `#E2E8F0`).

## Card shadows (three tiers)

Use **#2B314E** at stated opacity for shadow color unless design system updates.

| Option | Name | Typical use | Parameters (guide) |
|--------|------|-------------|---------------------|
| 1 | Subtle surface | Light elevation | Y `1.51px`, Blur `4.53px`, Spread `0`, color **2B314E @ 4%** |
| 2 | Medium surface | Elevation 1 | Y `6.03px`, Blur `18.1px`, Spread `0`, color **2B314E @ 6%** |
| 3 | Elevated surface | Elevation 1 (strong) | Y `18.1px`, Blur `42.24px`, Spread `0`, color **2B314E @ 6%** |

**Stacked “Elevation 2”** (two drops, guide): e.g. Y `3.02` / Blur `9.05` @ 4%, plus Y `1.51` / Blur `4.53` @ 8% — use where the design specifies composite elevation.

**Implementation:** Map to `--theme-card-shadow` (and preview-scoped overrides) in `themeToCssVars.ts`; extend `cardShadow` enum beyond `flat`/`shadow` when implementing Figma parity.

## Card borders

- Optional **on/off** only; when **on**, border is **`#E3E7F4`**, **`1.5px`**. Partners cannot customize border color.

## Corner radius (global)

Applied globally by tier **Sharp / Soft / Round** (guide default for WEX Direct: **Soft**).

| Element | Sharp | Soft | Round |
|---------|-------|------|-------|
| Input fields | 0px | 6px | 24px |
| Buttons | 0px | 8px | 24px |
| Cards | 0px | 12px | 32px |

**Implementation:** Already approximated via per-control radius in `themeToCssVars` + preview scoped CSS; align pixel values when auditing.

## Primary color ramp (OKLCH / culori)

- **One input:** partner primary hex → anchored at **token 600** (verbatim, no round-trip).
- **Algorithm:** OKLCH; fixed **TARGET_LIGHTNESS** and **CHROMA_MULTIPLIER** tables per step (50–950); `H` = anchor hue; gamut clamp + chroma floor for gray-out prevention.
- **Library:** **`culori`** (`culori/fn`) for conversion, `displayable`, `clampChroma`.
- **Worked example** in the PDF for `#3958C3` lists each step’s L/C/H → hex.

**Implementation status:** cxr-ux today uses simpler derivations (darken primary, hsl mapping). Migrating to full UXT ramps is a **separate epic**; do not rip out locks until product signs off.

## Quick reference (algorithm)

1. One input → 600 anchor  
2. L, C, H in OKLCH  
3. Two lookup tables (lightness + chroma multipliers)  
4. Formulas: `L_s = TARGET_LIGHTNESS[s]`, `C_s = C_a × CHROMA_MULTIPLIER[s]`, `H_s = H_a`  
5. Gamut clamp + gray floor (chroma min when anchor not near-gray)

## Related files

| File | Purpose |
|------|---------|
| [theming-variables.md](./theming-variables.md) | Repo contract for admin vars + system locks |
| `src/pages/theming-engine/schema.ts` | Form + export shape |
| `src/pages/theming-engine/themeToCssVars.ts` | CSS var mapping |
| `.cursor/rules/theming-engine-uxt-mapping.mdc` | AI agent guardrails when editing theming code |
