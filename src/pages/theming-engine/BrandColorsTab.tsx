import { useFormContext, useWatch } from "react-hook-form";
import {
  Alert,
  AlertDescription,
  Input,
  Label,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { AlertTriangle } from "lucide-react";
import type { BrandColors, ThemingEngineFormValues } from "./schema";
import { useThemingEngineHighlight } from "./ThemingEngineHighlightContext";
import { getContrastWarnings } from "@/lib/accessibility";

// C1–C6: the 6 user-configurable brand colors (see src/requirements/theming-variables.md)
const COLOR_KEYS: (keyof BrandColors)[] = [
  "primary",
  "secondary",
  "pageBg",
  "headerBg",
  "illustration",
];

const COLOR_LABELS: Record<keyof BrandColors, string> = {
  primary:      "Primary color",
  secondary:    "Secondary color",
  pageBg:       "Page background",
  headerBg:     "Navigation background",
  illustration: "Illustration accent color",
  aiColor:      "AI agent color",
};

const COLOR_HELPER_TEXT: Record<keyof BrandColors, string> = {
  primary:      "Primary buttons, active states, key data visualizations",
  secondary:    "Secondary buttons, floating action buttons, active tab underlines",
  pageBg:       "The wallpaper behind all content cards",
  headerBg:     "Top navigation bar background — text color auto-computed for contrast",
  illustration: "Empty-state SVGs, hero graphics, decorative icons",
  aiColor:      "AI assistant surfaces, chat bubbles, agent branding",
};

export function BrandColorsTab() {
  const { register, watch, setValue } = useFormContext<ThemingEngineFormValues>();
  const { setActiveColorKey } = useThemingEngineHighlight();
  const brandColors = useWatch({ name: "brandColors" }) as BrandColors | undefined;

  const warnings = brandColors ? getContrastWarnings(brandColors) : [];
  const warningByField = new Map(warnings.map((w) => [w.field, w]));

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Set your 6 brand colors. All other system colors are locked for accessibility.
      </p>
      <div className="flex flex-col gap-4">
        {COLOR_KEYS.map((key) => {
          const warning = warningByField.get(key);
          const value = watch(`brandColors.${key}`) ?? "";

          return (
            <div key={key} className="space-y-1">
              <Label htmlFor={key} className="text-sm font-medium text-foreground">
                {COLOR_LABELS[key]}
              </Label>
              <p className="text-xs text-muted-foreground">{COLOR_HELPER_TEXT[key]}</p>
              <div
                className="flex items-center gap-2"
                onMouseEnter={() => setActiveColorKey(key)}
                onMouseLeave={() => setActiveColorKey(null)}
              >
                <input
                  type="color"
                  id={`${key}-swatch`}
                  className="h-9 w-12 shrink-0 cursor-pointer rounded border border-input bg-transparent p-0.5"
                  value={value}
                  onChange={(e) => setValue(`brandColors.${key}`, e.target.value)}
                  onFocus={() => setActiveColorKey(key)}
                  onBlur={() => setActiveColorKey(null)}
                />
                <Input
                  id={key}
                  className="flex-1 font-mono text-sm"
                  {...register(`brandColors.${key}`)}
                  onFocus={() => setActiveColorKey(key)}
                  onBlur={() => setActiveColorKey(null)}
                />
              </div>
              {warning && (
                <Alert intent="destructive" className="flex items-start gap-2 py-1.5">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <AlertDescription className="text-sm">{warning.message}</AlertDescription>
                </Alert>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
