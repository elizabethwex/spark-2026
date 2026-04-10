import { z } from "zod";

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const cornerRadiusOptions = ["square", "soft", "round"] as const;
/** UXT / Figma: Subtle | Medium | Elevated. Legacy `flat`/`shadow` normalized on import. */
const cardShadowOptions = ["subtle", "medium", "elevated"] as const;
const cardBorderOptions = ["withBorder", "withoutBorder"] as const;
const iconSetOptions = ["solid", "outline", "duotone"] as const;
const chartPaletteOptions = ["ocean", "vibrant", "warm"] as const;
const aiIconPresetOptions = ["orb", "sparkle", "chat"] as const;

/**
 * The 6 user-configurable brand color fields (C1–C6).
 * These are the ONLY colors an admin can set. See src/requirements/theming-variables.md.
 *
 * Navigation text (formerly `headerText`) is now auto-computed from `headerBg`
 * luminance — see `themeToCssVars.ts`.
 */
export const brandColorsSchema = z.object({
  primary:      z.string().regex(hexColorRegex).default("#3958C3"),
  secondary:    z.string().regex(hexColorRegex).default("#3958C3"),
  pageBg:       z.string().regex(hexColorRegex).default("#F8F9FE"),
  headerBg:     z.string().regex(hexColorRegex).default("#FFFFFF"),
  illustration: z.string().regex(hexColorRegex).default("#1C6EFF"),
  aiColor:      z.string().regex(hexColorRegex).default("#C8102E"),
});

export const aiAgentSchema = z.object({
  name: z.string().max(80).default("AI Assistant"),
  iconPreset: z.enum(aiIconPresetOptions).default("orb"),
  accentColor: z.string().regex(hexColorRegex).default("#3958C3"),
  borderRadius: z.enum(cornerRadiusOptions).default("soft"),
});

export type AiAgentValues = z.infer<typeof aiAgentSchema>;

const LOGO_MAX_BYTES = 2 * 1024 * 1024;
const LOGO_ALLOWED_TYPES = ["image/png", "image/svg+xml"] as const;

function isValidLogoFile(file: File | null | undefined): boolean {
  if (file == null || !(file instanceof File)) return true;
  return file.size <= LOGO_MAX_BYTES && LOGO_ALLOWED_TYPES.includes(file.type as (typeof LOGO_ALLOWED_TYPES)[number]);
}

/** Normalize legacy theme JSON `cardShadow` values. */
export function normalizeCardShadowImport(
  v: unknown
): "subtle" | "medium" | "elevated" {
  if (v === "flat") return "subtle";
  if (v === "shadow") return "medium";
  if (v === "subtle" || v === "medium" || v === "elevated") return v;
  return "medium";
}

const cardShadowFieldSchema = z
  .union([
    z.enum(cardShadowOptions),
    z.literal("flat"),
    z.literal("shadow"),
  ])
  .transform((v) => normalizeCardShadowImport(v));

const defaultAiAgentValues: AiAgentValues = {
  name: "AI Assistant",
  iconPreset: "orb",
  accentColor: "#3958C3",
  borderRadius: "soft",
};

export const themingEngineSchema = z
  .object({
    headerLogoFile: z.union([z.instanceof(File), z.null()]).optional(),
    secondaryLogoFile: z.union([z.instanceof(File), z.null()]).optional(),
    brandColors: brandColorsSchema,
    chartPalette: z.enum(chartPaletteOptions).default("ocean"),
    iconSet: z.enum(iconSetOptions).default("outline"),
    globalCornerRadiusEnabled: z.boolean().default(true),
    globalCornerRadius: z.enum(cornerRadiusOptions).default("soft"),
    cardRadius: z.enum(cornerRadiusOptions).default("soft"),
    buttonRadius: z.enum(cornerRadiusOptions).default("soft"),
    inputRadius: z.enum(cornerRadiusOptions).default("soft"),
    cardShadow: z.enum(cardShadowOptions).default("medium"),
    cardBorder: z.enum(cardBorderOptions).default("withBorder"),
    aiAgent: aiAgentSchema.default(defaultAiAgentValues),
  })
  .refine((data) => isValidLogoFile(data.headerLogoFile ?? undefined), {
    message: "Logo must be PNG or SVG and max 2MB.",
    path: ["headerLogoFile"],
  })
  .refine((data) => isValidLogoFile(data.secondaryLogoFile ?? undefined), {
    message: "Secondary logo must be PNG or SVG and max 2MB.",
    path: ["secondaryLogoFile"],
  });

/**
 * Legacy-compatible brand colors for import: accepts old `headerText` (stripped)
 * and new `aiColor` (falls back to default).
 */
const brandColorsImportSchema = z
  .object({
    primary:      z.string().regex(hexColorRegex).default("#3958C3"),
    secondary:    z.string().regex(hexColorRegex).default("#3958C3"),
    pageBg:       z.string().regex(hexColorRegex).default("#F8F9FE"),
    headerBg:     z.string().regex(hexColorRegex).default("#FFFFFF"),
    headerText:   z.string().regex(hexColorRegex).optional(),
    illustration: z.string().regex(hexColorRegex).default("#1C6EFF"),
    aiColor:      z.string().regex(hexColorRegex).default("#C8102E"),
  })
  .transform(({ headerText: _legacy, ...rest }) => rest);

/** Raw import shape before normalization (allows legacy cardShadow). */
const themingEngineImportRawSchema = z.object({
  headerLogoFile: z.union([z.null(), z.undefined()]).optional(),
  secondaryLogoFile: z.union([z.null(), z.undefined()]).optional(),
  brandColors: brandColorsImportSchema,
  chartPalette: z.enum(chartPaletteOptions).default("ocean"),
  iconSet: z.enum(iconSetOptions).default("outline"),
  globalCornerRadiusEnabled: z.boolean().default(true),
  globalCornerRadius: z.enum(cornerRadiusOptions).default("soft"),
  cardRadius: z.enum(cornerRadiusOptions).default("soft"),
  buttonRadius: z.enum(cornerRadiusOptions).default("soft"),
  inputRadius: z.enum(cornerRadiusOptions).default("soft"),
  cardShadow: cardShadowFieldSchema,
  cardBorder: z.enum(cardBorderOptions).default("withBorder"),
  aiAgent: z
    .object({
      name: z.string().max(80).optional(),
      iconPreset: z.enum(aiIconPresetOptions).optional(),
      accentColor: z.string().regex(hexColorRegex).optional(),
      borderRadius: z.enum(cornerRadiusOptions).optional(),
    })
    .optional()
    .transform(
      (partial) =>
        ({
          name: partial?.name ?? defaultAiAgentValues.name,
          iconPreset: partial?.iconPreset ?? defaultAiAgentValues.iconPreset,
          accentColor: partial?.accentColor ?? defaultAiAgentValues.accentColor,
          borderRadius: partial?.borderRadius ?? defaultAiAgentValues.borderRadius,
        }) satisfies AiAgentValues
    ),
});

export const themingEngineImportSchema = themingEngineImportRawSchema;

/** Serializable theme payload for export; File fields omitted or null. */
export type ThemingEngineExportPayload = Omit<
  ThemingEngineFormValues,
  "headerLogoFile" | "secondaryLogoFile"
> & {
  headerLogoFile?: null;
  secondaryLogoFile?: null;
};

export type BrandColors = z.infer<typeof brandColorsSchema>;
export type ThemingEngineFormValues = z.infer<typeof themingEngineSchema>;
export type CornerRadiusOption = (typeof cornerRadiusOptions)[number];
export type CardShadowOption = (typeof cardShadowOptions)[number];
export type CardBorderOption = (typeof cardBorderOptions)[number];
export type IconSetOption = (typeof iconSetOptions)[number];
export type ChartPaletteOption = (typeof chartPaletteOptions)[number];
export type AiIconPreset = (typeof aiIconPresetOptions)[number];

const defaultBrandColors: BrandColors = {
  primary:      "#3958C3",
  secondary:    "#3958C3",
  pageBg:       "#F8F9FE",
  headerBg:     "#FFFFFF",
  illustration: "#1C6EFF",
  aiColor:      "#C8102E",
};

export const defaultThemingEngineValues: ThemingEngineFormValues = {
  headerLogoFile: undefined,
  secondaryLogoFile: undefined,
  brandColors: defaultBrandColors,
  chartPalette: "ocean",
  iconSet: "outline",
  globalCornerRadiusEnabled: true,
  globalCornerRadius: "soft",
  cardRadius: "soft",
  buttonRadius: "soft",
  inputRadius: "soft",
  cardShadow: "medium",
  cardBorder: "withBorder",
  aiAgent: defaultAiAgentValues,
};
