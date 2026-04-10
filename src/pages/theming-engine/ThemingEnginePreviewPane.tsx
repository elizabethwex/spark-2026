import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@wexinc-healthbenefits/ben-ui-kit";
import { Moon, Sun } from "lucide-react";
import type { BrandColors } from "./schema";
import type { ThemingEngineFormValues } from "./schema";
import { themeToCssVars } from "./themeToCssVars";
import { useThemingEngineHighlight } from "./ThemingEngineHighlightContext";
import { MemberDashboardPreview } from "./MemberDashboardPreview";
import { cn } from "@/lib/utils";

const PREVIEW_MAX_WIDTH = {
  desktop: 1200,
  tablet: 768,
  mobile: 390,
} as const;

function getHighlightStyle(activeColorKey: keyof BrandColors): string {
  const selector = `[data-theming-preview] [data-theme-token="${activeColorKey}"]`;
  return `
  @keyframes theming-highlight-pulse {
    0%, 100% { box-shadow: 0 0 0 2px rgb(59 130 246); opacity: 1; }
    50% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.6); opacity: 0.9; }
  }
  ${selector} {
    outline: none;
    animation: theming-highlight-pulse 1.5s ease-in-out infinite;
    border-radius: var(--radius, 6px);
  }
`;
}

const PREVIEW_SCOPED_STYLE = `
  [data-theming-preview] [data-preview-card] {
    border-radius: var(--preview-card-radius, 12px) !important;
    box-shadow: var(--theme-card-shadow, none) !important;
    border-width: var(--theme-preview-card-border-width, 0px) !important;
    border-style: solid !important;
    border-color: var(--theme-preview-card-border-color, transparent) !important;
  }
  [data-theming-preview] [data-preview-button] {
    border-radius: var(--preview-button-radius, 8px) !important;
  }
  [data-theming-preview] input,
  [data-theming-preview] [role="combobox"],
  [data-theming-preview] textarea {
    border-radius: var(--preview-input-radius, 6px) !important;
  }
`;

export function ThemingEnginePreviewPane() {
  const { watch } = useFormContext<ThemingEngineFormValues>();
  const values = watch() as ThemingEngineFormValues | undefined;
  const { activeColorKey } = useThemingEngineHighlight();
  const [darkMode, setDarkMode] = useState(false);
  const themeVars = values ? themeToCssVars(values, darkMode) : {};
  const style = { ...themeVars } as React.CSSProperties;
  const showHighlight = activeColorKey != null;
  const maxW = PREVIEW_MAX_WIDTH["desktop"];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <div className="flex-1 overflow-hidden bg-white px-4 pb-4 min-[400px]:px-6 min-[400px]:pb-6 lg:px-8 lg:pb-8">
        <div
          className={cn(
            "flex h-full w-full flex-col overflow-hidden rounded-[24px] bg-[#F7F7F7] transition-colors my-6",
            darkMode && "dark bg-zinc-900"
          )}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-border/50 px-6 py-4 md:px-8 md:py-6">
            <h2 className="text-2xl font-display font-semibold text-foreground">Preview</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDarkMode((d) => !d)}
              className="gap-2"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-4 w-4 text-icon-default" /> : <Moon className="h-4 w-4 text-icon-default" />}
              {darkMode ? "Light" : "Dark"}
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div
              className="mx-auto min-h-full w-full transition-[max-width] duration-300 ease-out"
              style={{ maxWidth: maxW }}
            >
            <div
              className={cn(
                "relative overflow-hidden rounded-xl border border-border bg-background shadow-xl min-h-full text-foreground",
                darkMode && "bg-zinc-800 text-zinc-100"
              )}
              style={style}
              data-theming-preview
            >
              <style dangerouslySetInnerHTML={{ __html: PREVIEW_SCOPED_STYLE }} />
              {showHighlight && activeColorKey && (
                <style dangerouslySetInnerHTML={{ __html: getHighlightStyle(activeColorKey) }} />
              )}
              <MemberDashboardPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
