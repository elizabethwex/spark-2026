import { useFormContext } from "react-hook-form";
import {
  Label,
} from "@wexinc-healthbenefits/ben-ui-kit";
import type {
  CardBorderOption,
  CardShadowOption,
  CornerRadiusOption,
  ThemingEngineFormValues,
} from "./schema";
import { cn } from "@/lib/utils";

const CORNER_OPTIONS: { value: CornerRadiusOption; label: string; icon: string }[] = [
  { value: "square", label: "Square", icon: "corder-radius-sharp.svg" },
  { value: "soft", label: "Soft", icon: "corder-radius-soft.svg" },
  { value: "round", label: "Round", icon: "corder-radius-round.svg" },
];

const CARD_SHADOW_OPTIONS: { value: CardShadowOption; label: string; icon: string }[] = [
  { value: "subtle", label: "Subtle", icon: "card-shadow-subtle.svg" },
  { value: "medium", label: "Medium", icon: "card-shadow-medium.svg" },
  { value: "elevated", label: "Elevated", icon: "card-shadow-elevated.svg" },
];

const CARD_BORDER_OPTIONS: { value: CardBorderOption; label: string; icon: string }[] = [
  { value: "withBorder", label: "With border", icon: "card-border-with-border.svg" },
  { value: "withoutBorder", label: "Without border", icon: "card-border-without-border.svg" },
];

export function ComponentStylingTab() {
  const { register, watch, setValue } = useFormContext<ThemingEngineFormValues>();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-sm font-medium text-foreground">
            Corner Radius
          </Label>
          <p className="text-xs text-muted-foreground">
            Select a style for all cards, buttons, and text fields
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {CORNER_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm font-medium transition-colors",
                watch("globalCornerRadius") === opt.value
                  ? "border-[#5F6A94] border-2 bg-white text-primary"
                  : "border-[#9CA7C7] bg-white text-foreground hover:bg-muted/50"
              )}
              style={watch("globalCornerRadius") === opt.value ? { borderImage: "none" } : undefined}
            >
              <input
                type="radio"
                value={opt.value}
                className="sr-only"
                {...register("globalCornerRadius")}
              />
              <img src={`/theming-icons/${opt.icon}`} alt="" className="h-8 w-8 shrink-0" />
              <span style={{ color: "var(--system-text-primary)" }}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Card Shadow</Label>
        <div className="grid grid-cols-3 gap-2">
          {CARD_SHADOW_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm font-medium transition-colors",
                watch("cardShadow") === opt.value
                  ? "border-[#5F6A94] border-2 bg-white text-primary"
                  : "border-[#9CA7C7] bg-white text-foreground hover:bg-muted/50"
              )}
              style={watch("cardShadow") === opt.value ? { borderImage: "none" } : undefined}
            >
              <input
                type="radio"
                value={opt.value}
                className="sr-only"
                {...register("cardShadow")}
              />
              <img src={`/theming-icons/${opt.icon}`} alt="" className="h-8 w-8 shrink-0" />
              <span style={{ color: "var(--system-text-primary)" }}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Card Border</Label>
        <div className="grid grid-cols-2 gap-2">
          {CARD_BORDER_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm font-medium transition-colors",
                watch("cardBorder") === opt.value
                  ? "border-[#5F6A94] border-2 bg-white text-primary"
                  : "border-[#9CA7C7] bg-white text-foreground hover:bg-muted/50"
              )}
              style={watch("cardBorder") === opt.value ? { borderImage: "none" } : undefined}
            >
              <input
                type="radio"
                value={opt.value}
                className="sr-only"
                {...register("cardBorder")}
              />
              <img src={`/theming-icons/${opt.icon}`} alt="" className="h-8 w-8 shrink-0" />
              <span style={{ color: "var(--system-text-primary)" }}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
