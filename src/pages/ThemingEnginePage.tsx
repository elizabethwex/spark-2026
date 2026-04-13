import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { themingEngineSchema, defaultThemingEngineValues } from "./theming-engine/schema";
import type { ThemingEngineFormValues } from "./theming-engine/schema";
import { ThemingEngineHighlightProvider } from "./theming-engine/ThemingEngineHighlightContext";
import { ThemingEngineTopBar } from "./theming-engine/ThemingEngineTopBar";
import { ThemingEngineConfigPane } from "./theming-engine/ThemingEngineConfigPane";
import { ThemingEnginePreviewPane } from "./theming-engine/ThemingEnginePreviewPane";
import { loadPortalTheme } from "@/lib/portalTheme";
import { cn } from "@/lib/utils";

export default function ThemingEnginePage() {
  const form = useForm<ThemingEngineFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- zod resolver output type has optional fields from .default()
    resolver: zodResolver(themingEngineSchema) as any,
    defaultValues: loadPortalTheme() || defaultThemingEngineValues,
  });

  return (
    <FormProvider {...form}>
      <ThemingEngineHighlightProvider>
      <div className={cn("min-h-screen flex flex-col bg-background")}>
        <ConsumerNavigation hideNav />
        <ThemingEngineTopBar />
        <div className="flex flex-1 min-h-0">
          <aside className="min-w-[443px] w-[443px] shrink-0 border-r border-border bg-background flex flex-col overflow-hidden">
            <ThemingEngineConfigPane />
          </aside>
          <main className="flex-1 min-w-0 flex flex-col overflow-hidden bg-background">
            <ThemingEnginePreviewPane />
          </main>
        </div>
      </div>
      </ThemingEngineHighlightProvider>
    </FormProvider>
  );
}
