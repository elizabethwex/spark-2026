import { useFormContext } from "react-hook-form";
import { Label } from "@wexinc-healthbenefits/ben-ui-kit";
import type { ChartPaletteOption, ThemingEngineFormValues } from "./schema";
import { cn } from "@/lib/utils";

const CHART_PALETTE_OPTIONS: { value: ChartPaletteOption; label: string }[] = [
  { value: "ocean", label: "Ocean (Blues/Teals)" },
  { value: "vibrant", label: "Vibrant (High Contrast)" },
  { value: "warm", label: "Warm (Oranges/Reds)" },
];

export function ChartCustomizationSection() {
  const { register, watch } = useFormContext<ThemingEngineFormValues>();

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-6 text-center">
        <p className="text-sm font-medium text-foreground">Chart color selections</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Placeholder for future per-series chart tokens. Palettes below are color-blind friendly presets.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Chart palette</Label>
        <p className="text-xs text-muted-foreground">
          Applied to Recharts in the preview. Brand colors do not drive chart series.
        </p>
        <div className="flex gap-2 flex-wrap">
          {CHART_PALETTE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                watch("chartPalette") === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input bg-background text-foreground hover:bg-muted/50"
              )}
            >
              <input
                type="radio"
                value={opt.value}
                className="sr-only"
                {...register("chartPalette")}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
