import { useState } from "react";
import { CardContent } from "@wexinc-healthbenefits/ben-ui-kit";
import { ChevronRight, ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { quickLinksData } from "@/data/mockData";

const INITIAL_VISIBLE = 4;

export function QuickLinksSection() {
  const [expanded, setExpanded] = useState(false);

  const visibleLinks = expanded ? quickLinksData : quickLinksData.slice(0, INITIAL_VISIBLE);
  const hiddenCount = quickLinksData.length - INITIAL_VISIBLE;

  return (
    <GlassCard className="h-full">
      <CardContent className="p-6 flex flex-col h-full gap-6">

        <div className="flex flex-col">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Important Links
          </h2>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Resources customized by your employer
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          {visibleLinks.map((link, index) => (
            <a
              key={index}
              href="#"
              className="group flex items-center justify-between p-3.5 rounded-[16px] bg-white/50 border border-white/80 shadow-sm hover:bg-white hover:shadow-md hover:-translate-y-px transition-all duration-200"
              onClick={(e) => e.preventDefault()}
            >
              <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 pr-4">
                {link.label}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all shrink-0" />
            </a>
          ))}

          <button
            onClick={() => setExpanded(!expanded)}
            className="group flex items-center justify-between p-3.5 rounded-[16px] border border-dashed border-primary/20 bg-primary/[0.03] hover:bg-primary/[0.06] hover:border-primary/30 transition-all duration-200 mt-0.5"
          >
            <span className="text-sm font-semibold text-primary/80 group-hover:text-primary transition-colors">
              {expanded ? "Show less" : `Show ${hiddenCount} more`}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-primary/60 group-hover:text-primary transition-all duration-300 shrink-0 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>

      </CardContent>
    </GlassCard>
  );
}
