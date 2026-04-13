import { cn } from "@/lib/utils";
import { useFormContext, useWatch } from "react-hook-form";
import {
  Button,
  Input,
  Label,
  toast,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { Sparkles } from "lucide-react";
import type { BrandColors, ThemingEngineFormValues } from "./schema";
import { useThemingEngineHighlight } from "./ThemingEngineHighlightContext";
import { getBrandColorAccessibility } from "@/lib/accessibility";
import { AccessibilityTag } from "./AccessibilityTag";
import { SuggestedFixBanner } from "./SuggestedFixBanner";

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

  const accessibilityResults = brandColors ? getBrandColorAccessibility(brandColors) : {};

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5 w-full"
        onClick={() =>
          toast.success("Extract with AI — demo only, no API connected.")
        }
      >
        <Sparkles className="h-4 w-4 text-icon-default" />
        Extract with AI
      </Button>
      <div className="flex flex-col gap-4">
        {COLOR_KEYS.map((key) => {
          const a11yResult = accessibilityResults[key];
          const value = watch(`brandColors.${key}`) ?? "";

          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor={key} className="text-sm font-medium text-foreground">
                  {COLOR_LABELS[key]}
                </Label>
                {a11yResult && (
                  <AccessibilityTag status={a11yResult.status} ratio={a11yResult.ratio} />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{COLOR_HELPER_TEXT[key]}</p>
              <div
                className="flex items-center gap-2"
                onMouseEnter={() => setActiveColorKey(key)}
                onMouseLeave={() => setActiveColorKey(null)}
              >
                <input
                  type="color"
                  id={`${key}-swatch`}
                  className={cn(
                    "h-9 w-12 shrink-0 cursor-pointer rounded border bg-transparent p-0.5",
                    a11yResult?.status === "warn" ? "border-warning" : "border-input"
                  )}
                  value={value}
                  onChange={(e) => setValue(`brandColors.${key}`, e.target.value)}
                  onFocus={() => setActiveColorKey(key)}
                  onBlur={() => setActiveColorKey(null)}
                />
                <Input
                  id={key}
                  className={cn(
                    "flex-1 font-mono text-sm",
                    a11yResult?.status === "warn" && "border-warning focus-visible:ring-warning"
                  )}
                  {...register(`brandColors.${key}`)}
                  onFocus={() => setActiveColorKey(key)}
                  onBlur={() => setActiveColorKey(null)}
                />
              </div>
              {a11yResult?.status === 'warn' && a11yResult.suggestedColor && (
                <SuggestedFixBanner
                  suggestedColor={a11yResult.suggestedColor}
                  onApply={() => setValue(`brandColors.${key}`, a11yResult.suggestedColor!)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
