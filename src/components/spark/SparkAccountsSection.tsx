import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@wexinc-healthbenefits/ben-ui-kit";
import { CalendarCheck2, PiggyBank, TrendingUp, CircleDollarSign, Info, Lightbulb, ChevronRight } from "lucide-react";
import {
  sparkHsaSummary,
  sparkLpfsaSummary,
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
export function SparkAccountsSection() {
  const navigate = useNavigate();
  const h = sparkHsaSummary;
  const l = sparkLpfsaSummary;

  const { ref, isInView } = useInView({ threshold: 0.3, rootMargin: "0px 0px -15% 0px" });

  return (
    <section className="space-y-4" aria-labelledby="spark-accounts-heading">
      <div className="flex items-center justify-between w-full">
        <h2 id="spark-accounts-heading" className="text-[12px] font-black uppercase tracking-[3px] text-[#5f6a94] leading-[16px]">
          Your Accounts
        </h2>
        <button 
          type="button" 
          className="text-[12px] font-bold uppercase tracking-[1.2px] text-[#1c6eff] leading-[16px] hover:underline"
          onClick={() => navigate("/plans")}
        >
          View All Plans
        </button>
      </div>

      <div ref={ref} className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-2">
        {/* HSA Card */}
        <div className="group/card flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-white/60 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition-shadow hover:shadow-md">
          {/* Header */}
          <div className="flex items-start px-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[#3958c3] transition-transform group-hover/card:scale-110">
                <PiggyBank className="h-5 w-5 transition-transform group-hover/card:rotate-12" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-[16px] font-bold leading-[24px] text-[#14182c]">Health Savings Account</h3>
                <p className="text-[12px] font-bold uppercase leading-[16px] tracking-[0.6px] text-[#5f6a94]">
                  Health Savings
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-6">
            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-[2px]">
                <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#5f6a94]">
                  Total Account Value
                </p>
                <p className="text-[12px] leading-[16px] text-[#5f6a94]">
                  Cash + Invested Assets
                </p>
              </div>
              <p className="text-[40px] font-bold leading-[40px] tracking-[-0.9px] text-[#14182c]">
                {h.totalValue}
              </p>
            </div>

            {/* Balances Box */}
            <div className="flex flex-col gap-3 rounded-xl bg-[#f1f3fb] px-4 py-3">
              <div className="flex h-[44px] items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center text-[#3958c3]">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.176px] text-[#14182c]">
                    Invested assets
                  </p>
                  <div className="flex items-center gap-4">
                    <p className="text-[14px] font-semibold leading-[24px] tracking-[-0.084px] text-[#009966]">
                      {h.ytdReturnPct} YTD
                    </p>
                    <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#14182c]">
                      {h.investedAssets}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="h-px w-full bg-[#d1d5db]" />
              
              <div className="flex h-[44px] items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center text-[#3958c3]">
                  <CircleDollarSign className="h-5 w-5" />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.176px] text-[#14182c]">
                    Cash Balance
                  </p>
                  <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#14182c]">
                    {h.cashBalance}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center justify-between">
                <p className="text-[12px] leading-[16px] text-[#5f6a94]">
                  {h.contributionPctUsed}% of {h.planYear} contribution limit used
                </p>
                <p className="text-[12px] leading-[16px] text-[#14182c]">
                  {h.remainingLimit} remaining
                </p>
              </div>
              <div className="flex h-[6px] w-full items-center overflow-hidden rounded-[6px] bg-[#eef2ff]">
                <div
                  className="h-full rounded-[6px] bg-[#3958c3]"
                  style={{ 
                    width: isInView ? `${h.contributionPctUsed}%` : "0%",
                    transition: 'width 2.2s cubic-bezier(0.22, 1, 0.36, 1) 0.15s'
                  }}
                />
              </div>
              <p className="text-[10px] leading-[15px] text-[#5f6a94]">
                {h.planYear} IRS limit: $4,300.00 (individual)
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 mt-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl border-[#3958c3] py-[9.75px] text-[15.75px] font-medium text-[#3958c3] hover:bg-[#3958c3]/5"
              onClick={() => navigate("/account-overview")}
            >
              Manage Investments
            </Button>
          </div>
        </div>

        {/* LPFSA Card */}
        <div className="group/card flex h-full w-full flex-col rounded-[24px] border border-white/60 bg-white shadow-[0_3px_9px_rgba(43,49,78,0.04),0_6px_18px_rgba(43,49,78,0.06)] transition-shadow hover:shadow-md">
          {/* Header */}
          <div className="flex items-start px-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef2ff] text-[#3958c3] transition-transform group-hover/card:scale-110">
                <CalendarCheck2 className="h-5 w-5 transition-transform group-hover/card:rotate-12" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-bold leading-[24px] text-[#14182c]">Limited Purpose FSA</h3>
                  <Info className="h-4 w-4 text-[#5f6a94]" />
                </div>
                <p className="text-[12px] font-bold leading-[16px] tracking-[0.6px] text-[#5f6a94]">
                  {l.planRange}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-6">
            <div className="flex w-full items-start justify-between">
              <div className="flex flex-col gap-1">
                <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#5f6a94]">
                  Available balance
                </p>
                <p className="text-[40px] font-bold leading-[36px] tracking-[-0.9px] text-[#14182c]">
                  {l.balance}
                </p>
                <p className="mt-1 text-[12px] text-[#5f6a94]">
                  <span className="font-normal leading-[16px]">Max rollover: </span>
                  <span className="font-bold leading-[16px]">$500</span>
                </p>
              </div>

              {/* Spend Ring */}
              <div className="group relative flex h-[112px] w-[112px] shrink-0 items-center justify-center">
                {/* Background Ring */}
                <svg className="absolute inset-0 h-full w-full -rotate-90 transform" viewBox="0 0 112 112">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="none"
                    stroke="#e3e7f4"
                    strokeWidth="10"
                  />
                  {/* Progress Ring */}
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    fill="none"
                    stroke="#3958c3"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 48}`}
                    strokeDashoffset={isInView ? `${2 * Math.PI * 48 * (1 - Math.min(Math.max(l.daysToSpend, 0), 90) / 90)}` : "0"}
                    style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1) 0.15s' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-[24px] font-bold leading-[32px] text-[#1f2636]">
                    {l.daysToSpend}
                  </span>
                  <span className="-mt-[2px] text-center text-[10px] font-bold uppercase leading-[15px] tracking-[0.5px] text-[#5d688c]">
                    days<br />to spend
                  </span>
                </div>
                {l.spendByTag && (
                  <div className="pointer-events-none absolute left-[-72px] top-[10px] opacity-0 transition-opacity group-hover:opacity-100 shadow-[0_1.5px_4.5px_rgba(43,49,78,0.04)]">
                    <div className="flex items-center rounded-full border border-[#fff9e6] bg-[#fffbeb] px-[7px] py-[3px]">
                      <span className="text-[10px] font-bold leading-[15px] text-[#bf8a00]">
                        {l.spendByTag}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info Box */}
            <div className="flex w-full items-center justify-between rounded-xl bg-[#3958c3]/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center text-[#3958c3]">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-[2px]">
                  <p className="text-[14px] font-bold leading-[20px] text-[#14182c]">
                    {l.eligibleLabel}
                  </p>
                  <p className="text-[12px] leading-[16px] text-[#5f6a94]">
                    Covers dental & vision expenses only
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="flex items-center gap-2 text-[14px] leading-[20px] text-[#3958c3] hover:underline"
              >
                View Eligible Expenses
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 mt-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl border-[#3958c3] py-[9.75px] text-[15.75px] font-medium text-[#3958c3] hover:bg-[#3958c3]/5"
              onClick={() => navigate("/reimburse")}
            >
              Reimburse Myself
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
