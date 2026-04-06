import { useFormContext } from "react-hook-form";
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@wexinc-healthbenefits/ben-ui-kit";
import type {
  CardBorderOption,
  CardShadowOption,
  CornerRadiusOption,
  IconSetOption,
  ThemingEngineFormValues,
} from "./schema";
import { cn } from "@/lib/utils";

const ICON_SET_OPTIONS: { value: IconSetOption; label: string }[] = [
  { value: "solid", label: "Solid" },
  { value: "outline", label: "Outline" },
  { value: "duotone", label: "Duotone" },
];

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
  const globalCornerRadiusEnabled = watch("globalCornerRadiusEnabled");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Icon set</Label>
        <Select
          value={watch("iconSet")}
          onValueChange={(v) => setValue("iconSet", v as IconSetOption)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select icon set" />
          </SelectTrigger>
          <SelectContent>
            {ICON_SET_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <Label htmlFor="global-corner-radius" className="text-sm font-medium text-foreground">
              Corner Radius
            </Label>
            <p className="text-xs text-muted-foreground">
              Select a style for all cards, buttons, and text fields
            </p>
          </div>
          <Switch
            id="global-corner-radius"
            checked={globalCornerRadiusEnabled}
            onCheckedChange={(checked) => setValue("globalCornerRadiusEnabled", checked)}
          />
        </div>

        {globalCornerRadiusEnabled ? (
          <div className="grid grid-cols-3 gap-2">
            {CORNER_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm font-medium transition-colors",
                  watch("globalCornerRadius") === opt.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-input bg-background text-foreground hover:bg-muted/50"
                )}
              >
                <input
                  type="radio"
                  value={opt.value}
                  className="sr-only"
                  {...register("globalCornerRadius")}
                />
                <img src={`/theming-icons/${opt.icon}`} alt="" className="h-8 w-8 shrink-0" />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="space-y-4 pl-0">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Card style</Label>
              <div className="grid grid-cols-3 gap-2">
                {CORNER_OPTIONS.map((opt) => (
                  <label
                    key={`card-${opt.value}`}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm font-medium transition-colors",
                      watch("cardRadius") === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-input bg-background text-foreground hover:bg-muted/50"
                    )}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      className="sr-only"
                      {...register("cardRadius")}
                    />
                    <img src={`/theming-icons/${opt.icon}`} alt="" className="h-8 w-8 shrink-0" />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Button style</Label>
              <div className="grid grid-cols-3 gap-2">
                {CORNER_OPTIONS.map((opt) => (
                  <label
                    key={`button-${opt.value}`}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm font-medium transition-colors",
                      watch("buttonRadius") === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-input bg-background text-foreground hover:bg-muted/50"
                    )}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      className="sr-only"
                      {...register("buttonRadius")}
                    />
                    <img src={`/theming-icons/${opt.icon}`} alt="" className="h-8 w-8 shrink-0" />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Input style</Label>
              <div className="grid grid-cols-3 gap-2">
                {CORNER_OPTIONS.map((opt) => (
                  <label
                    key={`input-${opt.value}`}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm font-medium transition-colors",
                      watch("inputRadius") === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-input bg-background text-foreground hover:bg-muted/50"
                    )}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      className="sr-only"
                      {...register("inputRadius")}
                    />
                    <img src={`/theming-icons/${opt.icon}`} alt="" className="h-8 w-8 shrink-0" />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
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
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-input bg-background text-foreground hover:bg-muted/50"
              )}
            >
              <input
                type="radio"
                value={opt.value}
                className="sr-only"
                {...register("cardShadow")}
              />
              <img src={`/theming-icons/${opt.icon}`} alt="" className="h-8 w-8 shrink-0" />
              <span>{opt.label}</span>
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
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-input bg-background text-foreground hover:bg-muted/50"
              )}
            >
              <input
                type="radio"
                value={opt.value}
                className="sr-only"
                {...register("cardBorder")}
              />
              <img src={`/theming-icons/${opt.icon}`} alt="" className="h-8 w-8 shrink-0" />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
