import { useState } from "react";
import {
  CardContent,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  ChevronDown,
  Calendar,
  Check,
  X,
} from "lucide-react";
import { transactionsData } from "@/data/mockData";
import type { TransactionStatus, TransactionTimelineStep } from "@/data/mockData";

const STATUS_BADGE: Record<TransactionStatus, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  pending: {
    bg: "bg-amber-50 border-amber-200/60",
    text: "text-amber-600",
    icon: <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />,
    label: "Pending",
  },
  processing: {
    bg: "bg-blue-50 border-blue-200/60",
    text: "text-blue-600",
    icon: <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />,
    label: "Processing",
  },
  paid: {
    bg: "bg-emerald-50 border-emerald-200/60",
    text: "text-emerald-600",
    icon: <Check className="h-3 w-3" />,
    label: "Complete",
  },
  denied: {
    bg: "bg-red-50 border-red-200/60",
    text: "text-red-600",
    icon: <X className="h-3 w-3" />,
    label: "Denied",
  },
};

function getMemberColor(_name: string): string {
  return "bg-blue-100 text-blue-700";
}

function getMemberInitial(name: string): string {
  if (name === "You") return "Y";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(dateStr: string): string {
  const [month, day, year] = dateStr.split("/");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = months[parseInt(month, 10) - 1];
  return m ? `${m} ${day}, ${year}` : dateStr;
}

function capitalizeCategory(cat: string): string {
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

const STEP_TOOLTIPS: Record<string, string> = {
  Submitted: "Your claim is currently being submitted and queued for review.",
  Processing: "Your claim is currently being reviewed and verified against your plan's eligible expenses. This typically takes 3–5 business days.",
  Complete: "Your claim has been approved and the funds are being disbursed to your account.",
};

function TimelineTracker({ steps }: { steps: TransactionTimelineStep[] }) {
  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center flex-1 last:flex-none">
          {(() => {
            const stepContent = (
              <div className={`flex flex-col items-center gap-1 ${step.active ? "cursor-help" : ""}`}>
                <div
                  className={[
                    "h-5 w-5 rounded-full flex items-center justify-center text-white transition-all duration-500",
                    step.completed
                      ? "bg-emerald-500"
                      : step.active
                        ? "bg-blue-500 animate-pulse"
                        : "bg-slate-200",
                  ].join(" ")}
                  style={{ animationDelay: `${i * 150}ms`, animationDuration: step.active ? "3s" : undefined }}
                >
                  {step.completed && <Check className="h-3 w-3" />}
                  {step.active && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
                <span className={[
                  "text-[10px] leading-tight text-center whitespace-nowrap",
                  step.completed || step.active ? "text-foreground font-medium" : "text-muted-foreground",
                ].join(" ")}>
                  {step.label}
                </span>
                {step.date && (
                  <span className="text-[10px] text-muted-foreground leading-tight">
                    {step.date}
                  </span>
                )}
              </div>
            );

            return step.active ? (
              <Tooltip>
                <TooltipTrigger asChild>{stepContent}</TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm max-w-[220px]">
                    {STEP_TOOLTIPS[step.label] ?? step.label}
                  </p>
                </TooltipContent>
              </Tooltip>
            ) : stepContent;
          })()}
          {i < steps.length - 1 && (
            <div className={[
              "h-0.5 flex-1 mx-1 rounded-full transition-all duration-500",
              step.completed ? "bg-emerald-500" : "bg-slate-200",
            ].join(" ")} />
          )}
        </div>
      ))}
    </div>
  );
}

const ROW_GRID =
  "grid grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1.5fr)_minmax(0,1.2fr)_auto_minmax(0,1.2fr)_28px] gap-x-5 items-center";

export function TransactionsAndLinks() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const lastThree = transactionsData.slice(0, 3);

  return (
    <GlassCard>
      <CardContent className="p-6">
        <div className="space-y-6">
          <SectionHeader
            title="Recent Transactions"
            actionLabel="View All Transactions"
            actionHref="/account-overview"
          />

          <div
            className={`hidden md:grid ${ROW_GRID} text-sm font-medium tracking-normal text-muted-foreground px-5 py-0`}
            aria-hidden
          >
            <span>Date</span>
            <span>Status</span>
            <span>Account</span>
            <span>Description</span>
            <span>Category</span>
            <span>Member</span>
            <span className="text-right">Amount</span>
            <span />
          </div>

          <div className="space-y-3">
            {lastThree.map((tx, index) => {
              const isExpanded = expandedIndex === index;
              const badge = STATUS_BADGE[tx.status];
              const memberColor = getMemberColor(tx.member);
              const memberInitial = getMemberInitial(tx.member);

              return (
                <div
                  key={index}
                  className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-300"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <div className="rounded-xl border border-white/60 bg-white/60 backdrop-blur-md shadow-[0_2px_8px_rgb(0,0,0,0.04)] transition-all duration-200 hover:shadow-[0_4px_12px_rgb(0,0,0,0.06)]">

                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className={`hidden md:grid w-full ${ROW_GRID} gap-y-0 px-5 py-4 text-left rounded-xl transition-colors duration-150 hover:bg-slate-50/50`}
                    >
                      <div className="flex items-center gap-1.5 text-sm text-foreground min-w-0">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{formatDate(tx.date)}</span>
                      </div>

                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold w-fit ${badge.bg} ${badge.text}`}
                      >
                        {badge.icon}
                        {badge.label}
                      </div>

                      <span className="text-sm text-foreground truncate">{tx.account}</span>

                      <span className="text-sm font-medium text-foreground truncate">
                        {tx.merchant}
                      </span>

                      <span className="inline-flex w-fit rounded-full bg-muted/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground capitalize">
                        {capitalizeCategory(tx.category)}
                      </span>

                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${memberColor}`}
                        title={tx.member}
                      >
                        {memberInitial}
                      </div>

                      <div
                        className={`text-sm font-semibold tabular-nums text-right ${
                          tx.amount.startsWith("-") ? "text-foreground" : "text-emerald-600"
                        }`}
                      >
                        {tx.amount}
                      </div>

                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : index)}
                      className="md:hidden w-full flex flex-col gap-2.5 p-4 text-left rounded-xl transition-colors duration-150 hover:bg-slate-50/50"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-foreground truncate">
                          {tx.merchant}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-sm font-semibold tabular-nums ${
                              tx.amount.startsWith("-") ? "text-foreground" : "text-emerald-600"
                            }`}
                          >
                            {tx.amount}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span>{formatDate(tx.date)}</span>
                        <span>·</span>
                        <span>{tx.account}</span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${badge.bg} ${badge.text}`}
                        >
                          {badge.icon}
                          {badge.label}
                        </div>
                        <span className="inline-flex rounded-full bg-muted/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground capitalize">
                          {capitalizeCategory(tx.category)}
                        </span>
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${memberColor}`}
                          title={tx.member}
                        >
                          {memberInitial}
                        </div>
                      </div>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${
                        isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-4 pb-4 pt-0">
                        <div className="rounded-xl border border-slate-100/80 bg-slate-50/80 p-4">
                          <TimelineTracker steps={tx.timeline} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </GlassCard>
  );
}
