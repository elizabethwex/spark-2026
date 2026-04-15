import { useFormContext } from "react-hook-form";
import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button } from "@wexinc-healthbenefits/ben-ui-kit";
import { Sparkles, Upload, Circle, MessageCircle } from "lucide-react";
import type { AiIconPreset, CornerRadiusOption, ThemingEngineFormValues } from "./schema";
import { cn } from "@/lib/utils";

const PRESETS: { value: AiIconPreset; label: string; icon: React.ElementType }[] = [
  { value: "orb", label: "Orb", icon: Circle },
  { value: "sparkle", label: "Sparkles", icon: Sparkles },
  { value: "chat", label: "Chat", icon: MessageCircle },
];

const RADIUS: { value: CornerRadiusOption; label: string; icon: string }[] = [
  { value: "square", label: "Square", icon: "corder-radius-sharp.svg" },
  { value: "soft", label: "Soft", icon: "corder-radius-soft.svg" },
  { value: "round", label: "Round", icon: "corder-radius-round.svg" },
];

export function AiAgentCustomizationTab() {
  const { register, watch, setValue } = useFormContext<ThemingEngineFormValues>();

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="ai-agent-name" className="text-sm font-medium text-foreground">
          Agent name
        </Label>
        <Input id="ai-agent-name" {...register("aiAgent.name")} maxLength={80} />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Agent Icon</Label>
        <div className="flex items-center gap-2">
          <Select
            value={watch("aiAgent.iconPreset")}
            onValueChange={(value: AiIconPreset) => setValue("aiAgent.iconPreset", value)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select icon">
                {(() => {
                  const selected = PRESETS.find(p => p.value === watch("aiAgent.iconPreset"));
                  if (!selected) return null;
                  const Icon = selected.icon;
                  return (
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{selected.label}</span>
                    </div>
                  );
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PRESETS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span>{opt.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex-1 text-primary border-primary hover:bg-primary/5 [&_svg]:text-current">
            <Upload className="mr-2 h-4 w-4" />
            Upload custom icon
          </Button>
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
        <Label className="text-sm font-medium text-foreground">Corner Radius</Label>
        <div className="grid grid-cols-3 gap-2">
          {RADIUS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm font-medium transition-colors",
                watch("aiAgent.borderRadius") === opt.value
                  ? "border-[#5F6A94] border-2 bg-white text-primary"
                  : "border-[#9CA7C7] bg-white text-foreground hover:bg-muted/50"
              )}
              style={watch("aiAgent.borderRadius") === opt.value ? { borderImage: "none" } : undefined}
            >
              <input
                type="radio"
                className="sr-only"
                checked={watch("aiAgent.borderRadius") === opt.value}
                onChange={() => setValue("aiAgent.borderRadius", opt.value)}
              />
              <img src={`${import.meta.env.BASE_URL}theming-icons/${opt.icon}`} alt="" className="h-8 w-8 shrink-0" />
              <span style={{ color: "var(--system-text-primary)" }}>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
