import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  toast,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { Sparkles } from "lucide-react";
import { BrandColorsTab } from "./BrandColorsTab";
import { LogoUploadsSection } from "./LogoUploadsSection";
import { ChartCustomizationSection } from "./ChartCustomizationSection";
import { ComponentStylingTab } from "./ComponentStylingTab";
import { AiAgentCustomizationTab } from "./AiAgentCustomizationTab";

export function ThemingEngineConfigPane() {
  return (
    <div className="flex h-full flex-col space-y-4 overflow-y-auto px-6 py-5">
      <p className="text-sm text-muted-foreground">
        Customize appearance to match your brand. Changes in Preview; use Publish to apply the full portal prototype.
      </p>

      <Accordion
        type="multiple"
        defaultValue={["logos", "brand-colors", "ai-agent", "charts", "component-styling"]}
        className="w-full"
      >
        <AccordionItem value="logos" className="border-border">
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
            Logos
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <LogoUploadsSection />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand-colors" className="border-border">
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
            Brand colors
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <BrandColorsTab />
            <div className="mt-6 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() =>
                  toast.success("Extract with AI — demo only, no API connected.")
                }
              >
                <Sparkles className="h-4 w-4" />
                Extract with AI
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                Suggest brand colors from your assets (prototype — not wired to a service).
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ai-agent" className="border-border">
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
            AI agent customization
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <AiAgentCustomizationTab />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="charts" className="border-border">
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
            Chart customization
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <ChartCustomizationSection />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="component-styling" className="border-border">
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
            Component styling
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <ComponentStylingTab />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
