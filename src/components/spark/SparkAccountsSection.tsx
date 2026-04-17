import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { CalendarCheck2, TrendingUp, CircleDollarSign, Info, ChevronRight, HeartPulse, Baby, RotateCw, ClockAlert, CalendarClock, Calendar, ChartNoAxesCombined, Landmark, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Tooltip, TooltipTrigger, TooltipContent } from "@wexinc-healthbenefits/ben-ui-kit";
import {
  sparkHsaSummary,
  sparkLpfsaSummary,
  sparkLpfsaPrimarySummary,
  sparkFsaSummary,
  sparkFsaPrimarySummary,
  sparkDcfsaSummary,
  sparkDcfsaPrimarySummary,
} from "@/data/sparkAiForwardMock";

function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, isInView };
}

/**
 * SPARK-2026 “Your accounts” two-card row (HSA + LPFSA).
 */
export function SparkAccountsSection({ 
  variant = "modern",
  activeView = 1
}: { 
  variant?: "modern" | "partner-safe";
  activeView?: 1 | 2 | 3;
}) {
  const navigate = useNavigate();
  const [showInvestments, setShowInvestments] = useState(true);
  const [isPrimary, setIsPrimary] = useState(true);

  const h = sparkHsaSummary;
  const l = isPrimary ? sparkLpfsaPrimarySummary : sparkLpfsaSummary;
  const fsa = isPrimary ? sparkFsaPrimarySummary : sparkFsaSummary;
  const dcfsa = isPrimary ? sparkDcfsaPrimarySummary : sparkDcfsaSummary;

  const { ref, isInView } = useInView({ threshold: 0.3, rootMargin: "0px 0px -15% 0px" });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof Element && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        if (e.key.toLowerCase() === 'i') {
          setShowInvestments(prev => !prev);
        }
        if (e.key.toLowerCase() === 'z') {
          setIsPrimary(prev => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="space-y-4" aria-labelledby="spark-accounts-heading">
      {variant === "partner-safe" ? (
        <SectionHeader
          title="Your Accounts"
        />
      ) : (
        <div className="flex items-center justify-between w-full">
          <h2 id="spark-accounts-heading" className="text-[12px] font-black uppercase tracking-[3px] text-[#5f6a94] leading-[16px]">
            Your Accounts
          </h2>
        </div>
      )}

      <div ref={ref} className={cn("grid grid-cols-1 gap-x-6 gap-y-10", activeView !== 3 ? "lg:grid-cols-2" : "")}>
        {(activeView === 1 || activeView === 3) && (
          <>
            {/* HSA Card */}
        <div
          className={cn(
            "group/card flex h-full w-full flex-col overflow-hidden rounded-[24px]",
            variant === "partner-safe"
              ? "bg-card border border-border shadow-sm text-card-foreground"
              : "border border-white/60 bg-white shadow-[0_3px_9px_rgba(43,49,78,0.04),0_6px_18px_rgba(43,49,78,0.06)]"
          )}
          style={{ borderRadius: "24px" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--app-secondary-50)] text-[var(--theme-secondary)] transition-transform group-hover/card:scale-110">
                <Landmark className="h-5 w-5 transition-transform group-hover/card:rotate-12 text-[var(--theme-secondary)]" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[16px] font-bold leading-[24px] text-[var(--system-text-primary)]">HSA</h3>
                <p className="text-[12px] font-bold uppercase leading-[16px] tracking-[0.6px] text-[#5f6a94]">
                  Health Savings
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/hsa-details")}
              className="flex items-center gap-[7px] rounded-[6px] px-[12px] py-[8px] text-[15.75px] font-medium text-[color:var(--system-link,#1c6eff)] hover:underline transition-colors -mr-3"
            >
              View Details
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-6">
            {showInvestments ? (
              <>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex flex-col gap-[2px]">
                    <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#5f6a94]">
                      Total Account Value
                    </p>
                    <p className="text-[12px] leading-[16px] text-[#5f6a94]">
                      Cash + Invested Assets
                    </p>
                  </div>
                  <p className="text-[40px] font-bold leading-[56px] tracking-[-0.88px] text-[#14182c]">
                    {h.totalValue}
                  </p>
                </div>

                {/* Balances Box */}
                <div className="flex flex-col gap-3 rounded-xl bg-[#f1f3fb] px-4 py-3 w-full">
                  <div className="flex h-[44px] items-center gap-3 w-full">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center text-[#3958c3]">
                      <CircleDollarSign className="h-5 w-5" />
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#14182c]">
                        Cash Balance
                      </p>
                      <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.176px] text-[#14182c]">
                        {h.cashBalance}
                      </p>
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-[#d1d5db]" />
                  
                  <div className="flex h-[44px] items-center gap-3 w-full">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center text-[#3958c3]">
                      <ChartNoAxesCombined className="h-5 w-5" />
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#14182c]">
                        Invested assets
                      </p>
                      <div className="flex items-center gap-4">
                        <p className="text-[14px] font-semibold leading-[24px] tracking-[-0.084px] text-[#009966]">
                          {h.ytdReturnPct}
                        </p>
                        <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.176px] text-[#14182c]">
                          {h.investedAssets}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#5f6a94]">
                    Cash Balance
                  </p>
                  <p className="text-[40px] font-bold leading-[56px] tracking-[-0.88px] text-[#14182c]">
                    {h.cashBalance}
                  </p>
                </div>

                {/* Promo Box */}
                <div className="flex items-center justify-between rounded-xl bg-[#f1f3fb] px-4 py-2 w-full">
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center text-[#3958c3]">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <p className="text-[14px] font-bold leading-[20px] text-foreground">
                        Invest Your HSA
                      </p>
                      <p className="text-[12px] leading-[16px] text-[#5f6a94]">
                        Grow your healthcare funds tax-free
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-[7px] rounded-[6px] px-[12px] py-[8px] text-[15.75px] font-medium text-[color:var(--system-link,#1c6eff)] hover:underline transition-colors -mr-3"
                  >
                    Start Investing
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}

            {/* Progress Section */}
            <div className="flex flex-col gap-1.5 items-end w-full">
              <div className="flex items-center justify-between w-full">
                <p className="text-[12px] leading-[16px] text-[#5f6a94]">
                  {h.contributionPctUsed}% of {h.planYear} contribution limit used
                </p>
                <div className="flex items-center gap-1 px-[7px] py-[3.5px] rounded-[16px] bg-[#f7f7f7]">
                  <p className="text-[12.25px] font-bold text-[#515f6b]">
                    {h.remainingLimit} remaining
                  </p>
                </div>
              </div>
              <div className="relative h-[20px] w-full overflow-hidden rounded-full bg-[#eef2ff]">
                <div 
                  className={cn(
                    "absolute left-0 top-0 h-full transition-all duration-1000 ease-out",
                    isPrimary ? "bg-[#3958c3]" : "bg-[#e6a800]"
                  )}
                  style={{ width: isInView ? `${h.contributionPctUsed}%` : "0%" }}
                />
                <div 
                  className="absolute top-0 h-full w-px bg-[#cefafe] transition-all duration-1000 ease-out"
                  style={{ left: isInView ? `${h.contributionPctUsed}%` : "0%" }}
                />
              </div>
              <div className="flex w-full">
                <p className="text-[12px] leading-[15px] text-[#5f6a94]">
                  {h.planYear} IRS limit: {h.irsLimitFormatted} (individual)
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* LPFSA Card */}
        {activeView === 1 && (
        <div 
          className={cn(
            "group/card flex h-full w-full flex-col overflow-hidden rounded-[24px]",
            variant === "partner-safe"
              ? "bg-card border border-border shadow-sm text-card-foreground"
              : "border border-white/60 bg-white shadow-[0_3px_9px_rgba(43,49,78,0.04),0_6px_18px_rgba(43,49,78,0.06)]"
          )}
          style={{ borderRadius: '24px' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--app-secondary-50)] text-[var(--theme-secondary)] transition-transform group-hover/card:scale-110">
                <CalendarCheck2 className="h-5 w-5 transition-transform group-hover/card:rotate-12 text-[var(--theme-secondary)]" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[16px] font-bold leading-[24px] text-[var(--system-text-primary)]">Limited Purpose FSA</h3>
                <p className="text-[12px] font-bold leading-[16px] tracking-[0.6px] text-[#5f6a94]">
                  {l.planRange}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-[7px] rounded-[6px] px-[12px] py-[8px] text-[15.75px] font-medium text-[color:var(--system-link,#1c6eff)] -mr-3 cursor-default">
              View Details
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-6">
            <div className="flex flex-col gap-4 w-full">
              {/* Top part */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center gap-2">
                  <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#5f6a94]">
                    Available balance
                  </p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="focus:outline-none">
                        <Info className="h-4 w-4 text-[#5f6a94]" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm max-w-[220px] text-center">
                        Your available balance reflects the funds available for payment requests made at this time
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-[40px] font-bold leading-[56px] tracking-[-0.88px] text-[#14182c]">
                  {l.balance}
                </p>
              </div>

              {/* Progress bar */}
              <div className="flex flex-col gap-1.5 items-end w-full">
                <div className="flex items-center gap-1 px-[7px] py-[3.5px] rounded-[16px] bg-[#f7f7f7]">
                  <p className="text-[12.25px] font-bold text-[#515f6b]">
                    {l.contributionPctUsed}% of {l.contributionLimit} used
                  </p>
                </div>
                <div className="relative h-[20px] w-full overflow-hidden rounded-full bg-[#eef2ff]">
                  <div 
                    className={cn(
                      "absolute left-0 top-0 h-full transition-all duration-1000 ease-out",
                      isPrimary ? "bg-[#3958c3]" : "bg-[#e6a800]"
                    )}
                    style={{ width: isInView ? `${l.contributionPctUsed}%` : "0%" }}
                  />
                  <div 
                    className="absolute top-0 h-full w-px bg-[#cefafe] transition-all duration-1000 ease-out"
                    style={{ left: isInView ? `${l.contributionPctUsed}%` : "0%" }}
                  />
                </div>
              </div>
            </div>

            {/* Gray box */}
            <div className="flex flex-col gap-3 rounded-xl bg-[#f1f3fb] px-4 py-3 w-full">
              {/* Row 1 */}
              <div className="flex h-[44px] items-center gap-3 w-full">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center text-[#3958c3]">
                  <RotateCw className="h-5 w-5" />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#14182c]">
                      Available to rollover
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="focus:outline-none">
                          <Info className="h-4 w-4 text-[#5f6a94]" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm max-w-[220px] text-center">
                          Unused funds that carry over to next year- up to $500.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.176px] text-[#14182c]">
                    {l.rolloverAmount}
                  </p>
                </div>
              </div>
              
              <div className="h-px w-full bg-[#d1d5db]" />
              
              {/* Row 2 */}
              <div className="flex h-[44px] items-center gap-3 w-full">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center text-[#3958c3]">
                  <ClockAlert className="h-5 w-5" />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#14182c]">
                    Use it or lose it
                  </p>
                  <div className="flex items-center gap-4">
                    {l.spendByTag && (
                      <div className="flex items-center gap-1 rounded-md bg-[#fff9e6] px-[7px] py-[3.5px]">
                        <Calendar className="h-3 w-3 text-[#4a3500]" />
                        <span className="text-[12.25px] font-bold text-[#4a3500]">
                          {l.spendByTag}
                        </span>
                      </div>
                    )}
                    <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.176px] text-[#14182c]">
                      {l.useItOrLoseIt}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-[#d1d5db]" />

              {/* Row 3 */}
              <div className="flex h-[44px] items-center gap-3 w-full">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center text-[#3958c3]">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#14182c]">
                    Final Filing Date
                  </p>
                  <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.176px] text-[#14182c]">
                    {l.finalFilingDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
        )}
        </>
        )}
        {activeView === 2 && (
          <>
            {/* FSA Card */}
            <div 
              className={cn(
                "group/card flex h-full w-full flex-col overflow-hidden rounded-[24px]",
                variant === "partner-safe"
                  ? "bg-card border border-border shadow-sm text-card-foreground"
                  : "border border-white/60 bg-white shadow-[0_3px_9px_rgba(43,49,78,0.04),0_6px_18px_rgba(43,49,78,0.06)]"
              )}
              style={{ borderRadius: '24px' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--app-secondary-50)] text-[var(--theme-secondary)] transition-transform group-hover/card:scale-110">
                    <HeartPulse className="h-5 w-5 transition-transform group-hover/card:rotate-12 text-[var(--theme-secondary)]" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[16px] font-bold leading-[24px] text-[var(--system-text-primary)]">Healthcare FSA</h3>
                    <p className="text-[12px] font-bold leading-[16px] tracking-[0.6px] text-[#5f6a94]">
                      {fsa.planRange}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/account-overview?account=fsa")}
                  className="flex items-center gap-[7px] rounded-[6px] px-[12px] py-[8px] text-[15.75px] font-medium text-[color:var(--system-link,#1c6eff)] hover:underline transition-colors -mr-3"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-6">
            <div className="flex flex-col gap-4 w-full">
              {/* Top part */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center gap-2">
                  <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#5f6a94]">
                    Available balance
                  </p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="focus:outline-none">
                        <Info className="h-4 w-4 text-[#5f6a94]" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm max-w-[220px] text-center">
                        Your available balance reflects the funds available for payment requests made at this time
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-[40px] font-bold leading-[56px] tracking-[-0.88px] text-[#14182c]">
                  {fsa.balance}
                </p>
              </div>

              {/* Progress bar */}
              <div className="flex flex-col gap-1.5 items-end w-full">
                <div className="flex items-center gap-1 px-[7px] py-[3.5px] rounded-[16px] bg-[#f7f7f7]">
                  <p className="text-[12.25px] font-bold text-[#515f6b]">
                    {fsa.contributionPctUsed}% of {fsa.contributionLimit} used
                  </p>
                </div>
                <div className="relative h-[20px] w-full overflow-hidden rounded-full bg-[#eef2ff]">
                  <div 
                    className={cn(
                      "absolute left-0 top-0 h-full transition-all duration-1000 ease-out",
                      isPrimary ? "bg-[#3958c3]" : "bg-[#e6a800]"
                    )}
                    style={{ width: isInView ? `${fsa.contributionPctUsed}%` : "0%" }}
                  />
                  <div 
                    className="absolute top-0 h-full w-px bg-[#cefafe] transition-all duration-1000 ease-out"
                    style={{ left: isInView ? `${fsa.contributionPctUsed}%` : "0%" }}
                  />
                </div>
              </div>
            </div>

            {/* Gray box */}
            <div className="flex flex-col gap-3 rounded-xl bg-[#f1f3fb] px-4 py-3 w-full">
              {/* Row 1 */}
              <div className="flex h-[44px] items-center gap-3 w-full">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center text-[#3958c3]">
                  <RotateCw className="h-5 w-5" />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#14182c]">
                      Available to rollover
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="focus:outline-none">
                          <Info className="h-4 w-4 text-[#5f6a94]" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm max-w-[220px] text-center">
                          Unused funds that carry over to next year- up to $500.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.176px] text-[#14182c]">
                    {fsa.rolloverAmount}
                  </p>
                </div>
              </div>
              
              <div className="h-px w-full bg-[#d1d5db]" />
              
              {/* Row 2 */}
              <div className="flex h-[44px] items-center gap-3 w-full">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center text-[#3958c3]">
                  <ClockAlert className="h-5 w-5" />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#14182c]">
                    Use it or lose it
                  </p>
                  <div className="flex items-center gap-4">
                    {fsa.spendByTag && (
                      <div className="flex items-center gap-1 rounded-md bg-[#fff9e6] px-[7px] py-[3.5px]">
                        <Calendar className="h-3 w-3 text-[#4a3500]" />
                        <span className="text-[12.25px] font-bold text-[#4a3500]">
                          {fsa.spendByTag}
                        </span>
                      </div>
                    )}
                    <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.176px] text-[#14182c]">
                      {fsa.useItOrLoseIt}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-[#d1d5db]" />

              {/* Row 3 */}
              <div className="flex h-[44px] items-center gap-3 w-full">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center text-[#3958c3]">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#14182c]">
                    Final Filing Date
                  </p>
                  <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.176px] text-[#14182c]">
                    {fsa.finalFilingDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

            </div>

            {/* DCFSA Card */}
            <div 
              className={cn(
                "group/card flex h-full w-full flex-col overflow-hidden rounded-[24px]",
                variant === "partner-safe"
                  ? "bg-card border border-border shadow-sm text-card-foreground"
                  : "border border-white/60 bg-white shadow-[0_3px_9px_rgba(43,49,78,0.04),0_6px_18px_rgba(43,49,78,0.06)]"
              )}
              style={{ borderRadius: '24px' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--app-secondary-50)] text-[var(--theme-secondary)] transition-transform group-hover/card:scale-110">
                    <Baby className="h-5 w-5 transition-transform group-hover/card:rotate-12 text-[var(--theme-secondary)]" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[16px] font-bold leading-[24px] text-[var(--system-text-primary)]">DCFSA</h3>
                    <p className="text-[12px] font-bold leading-[16px] tracking-[0.6px] text-[#5f6a94]">
                      {dcfsa.planRange}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-[7px] rounded-[6px] px-[12px] py-[8px] text-[15.75px] font-medium text-[color:var(--system-link,#1c6eff)] -mr-3 cursor-default">
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-6">
            <div className="flex flex-col gap-4 w-full">
              {/* Top part */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center gap-2">
                  <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#5f6a94]">
                    Available balance
                  </p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="focus:outline-none">
                        <Info className="h-4 w-4 text-[#5f6a94]" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm max-w-[220px] text-center">
                        Your available balance reflects the funds available for payment requests made at this time
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-[40px] font-bold leading-[56px] tracking-[-0.88px] text-[#14182c]">
                  {dcfsa.balance}
                </p>
              </div>

              {/* Progress bar */}
              <div className="flex flex-col gap-1.5 items-end w-full">
                <div className="flex items-center gap-1 px-[7px] py-[3.5px] rounded-[16px] bg-[#f7f7f7]">
                  <p className="text-[12.25px] font-bold text-[#515f6b]">
                    {dcfsa.contributionPctUsed}% of {dcfsa.contributionLimit} used
                  </p>
                </div>
                <div className="relative h-[20px] w-full overflow-hidden rounded-full bg-[#eef2ff]">
                  <div 
                    className={cn(
                      "absolute left-0 top-0 h-full transition-all duration-1000 ease-out",
                      isPrimary ? "bg-[#3958c3]" : "bg-[#e6a800]"
                    )}
                    style={{ width: isInView ? `${dcfsa.contributionPctUsed}%` : "0%" }}
                  />
                  <div 
                    className="absolute top-0 h-full w-px bg-[#cefafe] transition-all duration-1000 ease-out"
                    style={{ left: isInView ? `${dcfsa.contributionPctUsed}%` : "0%" }}
                  />
                </div>
              </div>

            </div>

            {/* Gray box */}
            <div className="flex flex-col gap-3 rounded-xl bg-[#f1f3fb] px-4 py-3 w-full">
              {/* Row 1 */}
              <div className="flex h-[44px] items-center gap-3 w-full">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center text-[#3958c3]">
                  <ClockAlert className="h-5 w-5" />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#14182c]">
                    Use it or lose it
                  </p>
                  <div className="flex items-center gap-4">
                    {dcfsa.spendByTag && (
                      <div className="flex items-center gap-1 rounded-md bg-[#fff9e6] px-[7px] py-[3.5px]">
                        <Calendar className="h-3 w-3 text-[#4a3500]" />
                        <span className="text-[12.25px] font-bold text-[#4a3500]">
                          {dcfsa.spendByTag}
                        </span>
                      </div>
                    )}
                    <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.176px] text-[#14182c]">
                      {dcfsa.useItOrLoseIt}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-[#d1d5db]" />

              {/* Row 2 */}
              <div className="flex h-[44px] items-center gap-3 w-full">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center text-[#3958c3]">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#14182c]">
                    Final Filing Date
                  </p>
                  <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.176px] text-[#14182c]">
                    {dcfsa.finalFilingDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

            </div>
          </>
        )}
      </div>
    </section>
  );
}
