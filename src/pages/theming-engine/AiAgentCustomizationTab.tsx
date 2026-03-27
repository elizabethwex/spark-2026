import { useFormContext } from "react-hook-form";
import { Input, Label } from "@wexinc-healthbenefits/ben-ui-kit";
import type { AiIconPreset, CornerRadiusOption, ThemingEngineFormValues } from "./schema";
import { cn } from "@/lib/utils";

const PRESETS: { value: AiIconPreset; label: string }[] = [
  { value: "orb", label: "Orb" },
  { value: "sparkle", label: "Sparkle" },
  { value: "chat", label: "Chat" },
];

const RADIUS: { value: CornerRadiusOption; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "soft", label: "Soft" },
  { value: "round", label: "Round" },
];

export function AiAgentCustomizationTab() {
  const { register, watch, setValue } = useFormContext<ThemingEngineFormValues>();

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Preview-only styling for the AI assistant chip. Does not change system semantic colors.
      </p>

      <div className="space-y-2">
        <Label htmlFor="ai-agent-name" className="text-sm font-medium text-foreground">
          Agent name
        </Label>
        <Input id="ai-agent-name" {...register("aiAgent.name")} maxLength={80} />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Agent icon</Label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                watch("aiAgent.iconPreset") === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input bg-background hover:bg-muted/50"
              )}
            >
              <input
                type="radio"
                className="sr-only"
                checked={watch("aiAgent.iconPreset") === opt.value}
                onChange={() => setValue("aiAgent.iconPreset", opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ai-accent" className="text-sm font-medium text-foreground">
          Accent color
        </Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            id="ai-accent-swatch"
            className="h-9 w-12 shrink-0 cursor-pointer rounded border border-input bg-transparent p-0.5"
            value={watch("aiAgent.accentColor")}
            onChange={(e) => setValue("aiAgent.accentColor", e.target.value)}
          />
          <Input id="ai-accent" className="font-mono text-sm" {...register("aiAgent.accentColor")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Border radius</Label>
        <div className="flex flex-wrap gap-2">
          {RADIUS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                watch("aiAgent.borderRadius") === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input bg-background hover:bg-muted/50"
              )}
            >
              <input
                type="radio"
                className="sr-only"
                checked={watch("aiAgent.borderRadius") === opt.value}
                onChange={() => setValue("aiAgent.borderRadius", opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
