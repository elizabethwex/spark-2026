import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { themingEngineSchema, defaultThemingEngineValues } from "./theming-engine/schema";
import type { ThemingEngineFormValues } from "./theming-engine/schema";
import { ThemingEngineHighlightProvider } from "./theming-engine/ThemingEngineHighlightContext";
import { ThemingEngineTopBar } from "./theming-engine/ThemingEngineTopBar";
import { ThemingEngineConfigPane } from "./theming-engine/ThemingEngineConfigPane";
import { ThemingEnginePreviewPane } from "./theming-engine/ThemingEnginePreviewPane";
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground";
import { cn } from "@/lib/utils";

export default function ThemingEnginePage() {
  const form = useForm<ThemingEngineFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- zod resolver output type has optional fields from .default()
    resolver: zodResolver(themingEngineSchema) as any,
    defaultValues: defaultThemingEngineValues,
  });

  return (
    <FormProvider {...form}>
      <ThemingEngineHighlightProvider>
      <div className={cn("min-h-screen flex flex-col")} style={consumerPageBackgroundStyle}>
        <ConsumerNavigation hideNav />
        <ThemingEngineTopBar />
        <div className="flex flex-1 min-h-0">
          <aside className="w-96 shrink-0 border-r border-border bg-card flex flex-col overflow-hidden">
            <ThemingEngineConfigPane />
          </aside>
          <main className="flex-1 min-w-0 flex flex-col overflow-hidden bg-muted/30">
            <ThemingEnginePreviewPane />
          </main>
        </div>
      </div>
      </ThemingEngineHighlightProvider>
    </FormProvider>
  );
}
