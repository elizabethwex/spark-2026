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

const CORNER_OPTIONS: { value: CornerRadiusOption; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "soft", label: "Soft" },
  { value: "round", label: "Round" },
];

const CARD_SHADOW_OPTIONS: { value: CardShadowOption; label: string; description: string }[] = [
  { value: "subtle", label: "Subtle", description: "Light elevation (UXT)" },
  { value: "medium", label: "Medium", description: "Default surface elevation" },
  { value: "elevated", label: "Elevated", description: "Strong elevation" },
];

const CARD_BORDER_OPTIONS: { value: CardBorderOption; label: string }[] = [
  { value: "withBorder", label: "With border" },
  { value: "withoutBorder", label: "Without border" },
];

export function ComponentStylingTab() {
  const { register, watch, setValue } = useFormContext<ThemingEngineFormValues>();
  const globalCornerRadiusEnabled = watch("globalCornerRadiusEnabled");

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Corner radius, shadows, and card borders (UXT Theme Value Mapping).
      </p>

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

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Card shadow</Label>
        <p className="text-xs text-muted-foreground">
          Three elevation tiers; preview uses scoped CSS only.
        </p>
        <div className="flex flex-col gap-2">
          {CARD_SHADOW_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer flex-col gap-0.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                watch("cardShadow") === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input bg-background text-foreground hover:bg-muted/50"
              )}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  value={opt.value}
                  className="sr-only"
                  {...register("cardShadow")}
                />
                {opt.label}
              </span>
              <span className="text-xs font-normal text-muted-foreground">{opt.description}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Card border</Label>
        <p className="text-xs text-muted-foreground">
          When on, border is fixed at 1.5px #E3E7F4 (not customizable per UXT).
        </p>
        <div className="flex gap-2 flex-wrap">
          {CARD_BORDER_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                watch("cardBorder") === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input bg-background text-foreground hover:bg-muted/50"
              )}
            >
              <input
                type="radio"
                value={opt.value}
                className="sr-only"
                {...register("cardBorder")}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="global-corner-radius" className="text-sm font-medium text-foreground">
            Global corner radius
          </Label>
          <Switch
            id="global-corner-radius"
            checked={globalCornerRadiusEnabled}
            onCheckedChange={(checked) => setValue("globalCornerRadiusEnabled", checked)}
          />
        </div>

        {globalCornerRadiusEnabled ? (
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              One radius tier for cards, buttons, and inputs (UXT-aligned pixel steps).
            </Label>
            <div className="flex gap-2 flex-wrap">
              {CORNER_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                    watch("globalCornerRadius") === opt.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input bg-background text-foreground hover:bg-muted/50"
                  )}
                >
                  <input
                    type="radio"
                    value={opt.value}
                    className="sr-only"
                    {...register("globalCornerRadius")}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 pl-0">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Card style</Label>
              <div className="flex gap-2 flex-wrap">
                {CORNER_OPTIONS.map((opt) => (
                  <label
                    key={`card-${opt.value}`}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                      watch("cardRadius") === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-input bg-background text-foreground hover:bg-muted/50"
                    )}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      className="sr-only"
                      {...register("cardRadius")}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Button style</Label>
              <div className="flex gap-2 flex-wrap">
                {CORNER_OPTIONS.map((opt) => (
                  <label
                    key={`button-${opt.value}`}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                      watch("buttonRadius") === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-input bg-background text-foreground hover:bg-muted/50"
                    )}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      className="sr-only"
                      {...register("buttonRadius")}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Input style</Label>
              <div className="flex gap-2 flex-wrap">
                {CORNER_OPTIONS.map((opt) => (
                  <label
                    key={`input-${opt.value}`}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                      watch("inputRadius") === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-input bg-background text-foreground hover:bg-muted/50"
                    )}
                  >
                    <input
                      type="radio"
                      value={opt.value}
                      className="sr-only"
                      {...register("inputRadius")}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
