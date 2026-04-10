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
    <div className="flex h-full flex-col space-y-4 overflow-y-auto bg-white pl-8 pr-6 py-5">
      <Accordion
        type="multiple"
        defaultValue={["logos", "brand-colors", "charts", "component-styling", "ai-agent"]}
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

        <AccordionItem value="ai-agent" className="border-border">
          <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
            AI agent customization
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <AiAgentCustomizationTab />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
