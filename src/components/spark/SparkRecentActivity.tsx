import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, ChevronDown, Check } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@wexinc-healthbenefits/ben-ui-kit";
import {
  sparkRecentActivity,
  type SparkActivityStatus,
  type SparkActivityRow,
} from "@/data/sparkAiForwardMock";
import { cn } from "@/lib/utils";

function statusStyles(status: SparkActivityStatus): string {
  switch (status) {
    case "approved":
      return "text-[#009966]";
    case "needs_attention":
      return "text-[#996e00]";
    case "completed":
      return "text-[#009966]";
    default:
      return "text-[#5f6a94]";
  }
}

const STEP_TOOLTIPS: Record<string, string> = {
  "Submitted": "Your claim is currently being submitted and queued for review.",
  "Processing": "Your claim is currently being reviewed and verified against your plan's eligible expenses.",
  "Action Required": "Missing documentation required. Please upload your receipt or EOB to continue processing this claim.",
  "Complete": "Your claim has been approved and the funds are being disbursed to your account.",
};

function TimelineTracker({ steps }: { steps: NonNullable<SparkActivityRow["timeline"]> }) {
  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, i) => {
        const stepContent = (
          <div className={`flex flex-col items-center gap-1 ${step.active ? "cursor-help" : ""}`}>
            <div
              className={[
                "h-5 w-5 rounded-full flex items-center justify-center text-white transition-all duration-500",
                step.completed
                  ? "bg-[#009966]"
                  : step.active
                    ? "bg-[#3958c3] animate-pulse"
                    : "bg-slate-200",
              ].join(" ")}
              style={{ animationDelay: `${i * 150}ms`, animationDuration: step.active ? "3s" : undefined }}
            >
              {step.completed ? (
                <Check className="h-3 w-3" strokeWidth={3} />
              ) : step.active ? (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              ) : null}
            </div>
            <span className={[
              "text-[10px] leading-tight text-center whitespace-nowrap",
              step.completed || step.active ? "text-foreground font-medium" : "text-[#5f6a94]",
            ].join(" ")}>
              {step.label}
            </span>
            {step.date && (
              <span className="text-[10px] text-[#5f6a94] leading-tight">
                {step.date}
              </span>
            )}
          </div>
        );

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            {step.active ? (
              <Tooltip>
                <TooltipTrigger asChild>{stepContent}</TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm max-w-[220px]">
                    {STEP_TOOLTIPS[step.label] ?? step.label}
                  </p>
                </TooltipContent>
              </Tooltip>
            ) : (
              stepContent
            )}
            {i < steps.length - 1 && (
              <div className={[
                "h-0.5 flex-1 mx-1 rounded-full transition-all duration-500",
                step.completed ? "bg-[#009966]" : "bg-slate-200",
              ].join(" ")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * SPARK-2026 simplified recent activity list (Figma).
 */
export function SparkRecentActivity({ activeView = 1 }: { activeView?: 1 | 2 | 3 }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const displayActivity = sparkRecentActivity.map((row) => {
    if (activeView === 2) {
      if (row.meta.includes("LPFSA")) {
        return { ...row, meta: row.meta.replace("LPFSA", "FSA") };
      }
      if (row.merchant === "Vanguard Invest") {
        return {
          ...row,
          merchant: "Bright Horizons Daycare",
          meta: "12/14/25 • DCFSA Account",
        };
      }
    } else if (activeView === 3) {
      if (row.meta.includes("LPFSA")) {
        return { ...row, meta: row.meta.replace("LPFSA", "HSA") };
      }
    }
    return row;
  });

  return (
    <section className="space-y-4" aria-labelledby="spark-activity-heading">
      <div className="flex items-center justify-between w-full">
        <h2 id="spark-activity-heading" className="text-[12px] font-black uppercase tracking-[3px] text-[#5f6a94] leading-[16px]">
          Recent Activity
        </h2>
        <Link
          to="/account-overview"
          className="text-[12px] font-bold uppercase tracking-[1.2px] text-[color:var(--system-link,#1c6eff)] leading-[16px] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-[12px]">
        {displayActivity.map((row, index) => {
          const isExpanded = expandedIndex === index;
          const hasTimeline = row.timeline && row.timeline.length > 0;

          return (
            <button
              key={`${row.merchant}-${row.meta}`}
              type="button"
              onClick={() => hasTimeline && setExpandedIndex(isExpanded ? null : index)}
              className={cn(
                "group relative flex w-full flex-col items-start overflow-hidden rounded-[16px] border border-white bg-white p-px text-left shadow-[0_3px_9px_rgba(43,49,78,0.04),0_6px_18px_rgba(43,49,78,0.06)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                hasTimeline ? "hover:border-[#3958c3]/20 hover:shadow-md cursor-pointer" : "cursor-default"
              )}
            >
              <div className="relative w-full bg-white/40">
                <div className="flex w-full items-center justify-between p-[16px]">
                  <div className="flex items-center gap-[16px]">
                    <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[var(--app-secondary-50)] text-[var(--theme-secondary)]">
                      <Clock className="h-[18px] w-[18px] text-[var(--theme-secondary)]" />
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="text-[14px] font-bold leading-[20px] text-foreground">
                        {row.merchant}
                      </p>
                      <p className="text-[12px] font-medium leading-[16px] text-[#5f6a94]">
                        {row.meta}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-[24px]">
                    <div className="flex flex-col items-end">
                      <p className="text-[14px] font-bold leading-[20px] text-foreground">
                        {row.amount}
                      </p>
                      <p
                        className={cn(
                          "text-[12px] font-bold uppercase tracking-[1.2px] leading-[16px]",
                          statusStyles(row.status)
                        )}
                      >
                        {row.statusLabel}
                      </p>
                    </div>
                    {hasTimeline ? (
                      <ChevronDown 
                        className={cn(
                          "h-4 w-4 text-[#5f6a94] transition-transform duration-200",
                          isExpanded ? "rotate-180" : "group-hover:translate-y-0.5"
                        )} 
                        aria-hidden 
                      />
                    ) : (
                      <div className="w-4" />
                    )}
                  </div>
                </div>

                {hasTimeline && (
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-out",
                      isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="px-4 pb-4 pt-0">
                      <div className="rounded-xl border border-slate-100/80 bg-slate-50/80 p-4">
                        <TimelineTracker steps={row.timeline!} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
