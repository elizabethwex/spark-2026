import { Button, CardContent } from "@wexinc-healthbenefits/ben-ui-kit";
import { ChevronRight } from "lucide-react";
import { infoCardsData } from "@/data/mockData";
import { GlassCard } from "@/components/ui/GlassCard";

export function InfoCardsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {infoCardsData.map((card, index) => (
        <GlassCard key={index} hoverable className="flex flex-row p-0">
          <CardContent className="p-6 flex gap-6 w-full">
            <div className="flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                <h3 className="text-xl font-semibold leading-tight text-foreground">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </div>
              <div className="mt-6">
                <Button
                  intent="primary"
                  variant="link"
                  size="md"
                  className="px-0 h-auto p-0 flex items-center gap-1"
                >
                  {card.buttonText}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="shrink-0 w-[160px] h-[264px]">
              <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/10 to-info/10">
                <span className="text-sm text-muted-foreground">{card.imageAlt}</span>
              </div>
            </div>
          </CardContent>
        </GlassCard>
      ))}
    </div>
  );
}
