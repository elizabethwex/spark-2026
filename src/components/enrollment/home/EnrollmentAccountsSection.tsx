import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CalendarCheck2,
  ChevronRight,
  CircleDollarSign,
  Info,
  Lightbulb,
  PiggyBank,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type SimulationMode } from "@/lib/simulatedExpenses";

const PAY_PERIODS = 26;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function fmt(cents: number): string {
  const dollars = (cents / 100).toFixed(2);
  const [intPart, decPart] = dollars.split(".");
  return `$${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${decPart ?? "00"}`;
}

function perPay(annualCents: number): string {
  return fmt(Math.round(annualCents / PAY_PERIODS));
}

/** Estimate 25% marginal tax savings on FSA/HSA contributions */
function taxSavings(annualCents: number): string {
  return fmt(Math.round(annualCents * 0.25));
}

function useInView(opts?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setIsInView(true);
    }, opts);
    obs.observe(el);
    return () => obs.unobserve(el);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { ref, isInView };
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface Elections {
  fsa: { electionCents: number };
  lpfsa: { electionCents: number };
  dcfsa: { electionCents: number };
  hra: { electionCents: number };
  hsa?: { electionCents: number };
}

interface Props {
  selectedAccounts: string[];
  elections: Elections;
  coveragePeriod: string;
  isFamilyCoverage: boolean;
  simulationMode?: SimulationMode;
}

/* ------------------------------------------------------------------ */
/* Main Section                                                        */
/* ------------------------------------------------------------------ */

export function EnrollmentAccountsSection({
  selectedAccounts,
  elections,
  coveragePeriod,
  isFamilyCoverage,
  simulationMode = "modern",
}: Props) {
  const isSimulated = simulationMode === "simulated";
  const isCobra = simulationMode === "cobra";
  const navigate = useNavigate();
  const { ref, isInView } = useInView({ threshold: 0.3, rootMargin: "0px 0px -15% 0px" });

  const hsaCents = (elections as Elections & { hsa?: { electionCents: number } }).hsa?.electionCents ?? 0;
  const showHsa = selectedAccounts.includes("hsa") && hsaCents > 0;
  const showFsa = selectedAccounts.includes("fsa") && elections.fsa.electionCents > 0;
  const showLpfsa = selectedAccounts.includes("lpfsa") && elections.lpfsa.electionCents > 0;
  const showDcfsa = selectedAccounts.includes("dcfsa") && elections.dcfsa.electionCents > 0;
  const showHra = selectedAccounts.includes("hra") && elections.hra.electionCents > 0;

  const cards: React.ReactNode[] = [];

  if (showHsa) {
    cards.push(
      <HsaCard
        key="hsa"
        annualCents={hsaCents}
        isFamilyCoverage={isFamilyCoverage}
        isInView={isInView}
        onNavigate={() => navigate("/hsa-details")}
        spentCents={isCobra ? Math.round(hsaCents * 0.75) : isSimulated ? Math.round(hsaCents * 0.35) : 0}
        contributionsFrozen={isCobra}
      />
    );
  }

  if (showLpfsa) {
    cards.push(
      <FsaRingCard
        key="lpfsa"
        accountName="Limited Purpose FSA"
        subtitle="LPFSA"
        annualCents={elections.lpfsa.electionCents}
        coveragePeriod={coveragePeriod}
        eligibleLabel="Vision & Dental"
        eligibleDescription="Covers dental & vision expenses only"
        isInView={isInView}
        onReimburse={() => navigate("/reimburse")}
        spentCents={isCobra ? Math.round(elections.lpfsa.electionCents * 0.8) : isSimulated ? Math.round(elections.lpfsa.electionCents * 0.45) : 0}
        daysOverride={isCobra ? 30 : undefined}
      />
    );
  }

  if (showFsa) {
    cards.push(
      <FsaRingCard
        key="fsa"
        accountName="Flexible Spending Account"
        subtitle="FSA"
        annualCents={elections.fsa.electionCents}
        coveragePeriod={coveragePeriod}
        eligibleLabel="Medical, Dental & Vision"
        eligibleDescription="Covers most eligible medical expenses"
        isInView={isInView}
        onReimburse={() => navigate("/reimburse")}
        spentCents={isCobra ? Math.round(elections.fsa.electionCents * 0.8) : isSimulated ? Math.round(elections.fsa.electionCents * 0.45) : 0}
        daysOverride={isCobra ? 30 : undefined}
      />
    );
  }

  if (showDcfsa) {
    cards.push(
      <SimpleAccountCard
        key="dcfsa"
        accountName="Dependent Care FSA"
        subtitle="DCFSA"
        icon={<CalendarCheck2 className="h-5 w-5 transition-transform group-hover/card:rotate-12" />}
        annualCents={elections.dcfsa.electionCents}
        coveragePeriod={coveragePeriod}
        spentCents={isCobra ? Math.round(elections.dcfsa.electionCents * 0.7) : isSimulated ? Math.round(elections.dcfsa.electionCents * 0.45) : 0}
      />
    );
  }

  if (showHra) {
    cards.push(
      <SimpleAccountCard
        key="hra"
        accountName="Health Reimbursement Arrangement"
        subtitle="HRA"
        icon={<CircleDollarSign className="h-5 w-5 transition-transform group-hover/card:rotate-12" />}
        annualCents={elections.hra.electionCents}
        coveragePeriod={coveragePeriod}
        employerFunded
        spentCents={isCobra ? Math.round(elections.hra.electionCents * 0.7) : isSimulated ? Math.round(elections.hra.electionCents * 0.3) : 0}
      />
    );
  }

  if (cards.length === 0) return null;

  return (
    <section className="space-y-4" aria-labelledby="enroll-accounts-heading">
      <div className="flex items-center justify-between w-full">
        <h2
          id="enroll-accounts-heading"
          className="text-[12px] font-black uppercase tracking-[3px] text-[#5f6a94] leading-[16px]"
        >
          Your Accounts
        </h2>
      </div>

      <div
        ref={ref}
        className={cn(
          "grid grid-cols-1 gap-x-6 gap-y-6",
          cards.length > 1 ? "lg:grid-cols-2" : ""
        )}
      >
        {cards}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* HSA Card                                                            */
/* ------------------------------------------------------------------ */

interface HsaCardProps {
  annualCents: number;
  isFamilyCoverage: boolean;
  isInView: boolean;
  onNavigate: () => void;
  spentCents?: number;
  contributionsFrozen?: boolean;
}

function HsaCard({ annualCents, isFamilyCoverage, isInView, onNavigate, spentCents = 0, contributionsFrozen = false }: HsaCardProps) {
  const irsLimit = isFamilyCoverage ? 8550 : 4300;
  const irsLimitLabel = isFamilyCoverage ? "$8,550.00 (family)" : "$4,300.00 (individual)";
  const annualDollars = annualCents / 100;
  const pctUsed = Math.min((annualDollars / irsLimit) * 100, 100);
  const hasSpent = spentCents > 0;
  const remainingCents = annualCents - spentCents;
  const spentPct = annualCents > 0 ? Math.round((spentCents / annualCents) * 100) : 0;

  return (
    <div
      className="group/card flex h-full w-full flex-col overflow-hidden rounded-[24px] transition-shadow hover:shadow-md border border-white/60 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
      style={{ borderRadius: "24px" }}
    >
      {/* Header */}
      <div className="flex items-start px-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--theme-secondary-ramp-50)] text-[var(--theme-secondary)] transition-transform group-hover/card:scale-110">
            <PiggyBank className="h-5 w-5 transition-transform group-hover/card:rotate-12" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-[16px] font-bold leading-[24px] text-[#14182c]">
              Health Savings Account
            </h3>
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
              Annual Election
            </p>
            <p className="text-[12px] leading-[16px] text-[#5f6a94]">
              Per-pay deduction × {PAY_PERIODS}
            </p>
          </div>
          <p className="text-[40px] font-bold leading-[40px] tracking-[-0.9px] text-[#14182c]">
            {fmt(annualCents)}
          </p>
        </div>

        {/* Balances Box */}
        <div className="flex flex-col gap-3 rounded-xl bg-[#f1f3fb] px-4 py-3">
          <div className="flex h-[44px] items-center gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center text-neutral-700">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="flex flex-1 items-center justify-between">
              <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.176px] text-[#14182c]">
                Est. tax savings
              </p>
              <p className="text-[14px] font-semibold leading-[24px] tracking-[-0.084px] text-[#009966]">
                {taxSavings(annualCents)} / yr
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-[#d1d5db]" />

          <div className="flex h-[44px] items-center gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center text-neutral-700">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <div className="flex flex-1 items-center justify-between">
              <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.176px] text-[#14182c]">
                Per Pay Deduction
              </p>
              <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#14182c]">
                {perPay(annualCents)}
              </p>
            </div>
          </div>
        </div>

        {/* Spending progress */}
        {hasSpent && (
          <div className="flex flex-col gap-[6px] rounded-xl border border-[#e0f0e8] bg-[#f0faf5] px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold leading-[16px] text-[#009966]">
                {spentPct}% spent ({fmt(spentCents)})
              </p>
              <p className="text-[12px] leading-[16px] text-[#14182c]">
                {fmt(remainingCents)} remaining
              </p>
            </div>
            <div className="flex h-[6px] w-full items-center overflow-hidden rounded-[6px] bg-[#e0f0e8]">
              <div
                className="h-full rounded-[6px] bg-[#009966]"
                style={{
                  width: isInView ? `${spentPct}%` : "0%",
                  transition: "width 2.2s cubic-bezier(0.22, 1, 0.36, 1) 0.15s",
                }}
              />
            </div>
          </div>
        )}

        {contributionsFrozen && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-[12px] font-semibold leading-[16px] text-amber-700">
              Contributions frozen — no payroll deductions since COBRA began
            </p>
          </div>
        )}

        {/* Contribution progress */}
        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <p className="text-[12px] leading-[16px] text-[#5f6a94]">
              {hasSpent ? `${Math.round(pctUsed)}%` : "0%"} of annual IRS limit used
            </p>
            <p className="text-[12px] leading-[16px] text-[#14182c]">
              {fmt(irsLimit * 100)} remaining
            </p>
          </div>
          <div className="flex h-[6px] w-full items-center overflow-hidden rounded-[6px] bg-[#eef2ff]">
            <div
              className="h-full rounded-[6px] bg-[#3958c3]"
              style={{
                width: isInView ? `${pctUsed}%` : "0%",
                transition: "width 2.2s cubic-bezier(0.22, 1, 0.36, 1) 0.15s",
              }}
            />
          </div>
          <p className="text-[10px] leading-[15px] text-[#5f6a94]">
            2025 IRS limit: {irsLimitLabel}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 mt-auto">
        <button
          type="button"
          className="w-full rounded-xl border border-[#3958c3] py-[9.75px] text-[15.75px] font-medium text-neutral-700 hover:bg-[#3958c3]/5 transition-colors"
          onClick={onNavigate}
        >
          Set Up Investments
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FSA / LPFSA Ring Card                                               */
/* ------------------------------------------------------------------ */

interface FsaRingCardProps {
  accountName: string;
  subtitle: string;
  annualCents: number;
  coveragePeriod: string;
  eligibleLabel: string;
  eligibleDescription: string;
  isInView: boolean;
  onReimburse: () => void;
  spentCents?: number;
  daysOverride?: number;
}

function FsaRingCard({
  accountName,
  subtitle,
  annualCents,
  coveragePeriod,
  eligibleLabel,
  eligibleDescription,
  isInView,
  onReimburse,
  spentCents = 0,
  daysOverride,
}: FsaRingCardProps) {
  const hasSpent = spentCents > 0;
  const daysRemaining = daysOverride ?? (hasSpent ? 30 : 90);
  const ringMax = 90;
  const ringCircumference = 2 * Math.PI * 48;
  const dashOffset = isInView
    ? ringCircumference * (1 - Math.min(daysRemaining, ringMax) / ringMax)
    : ringCircumference;

  return (
    <div
      className="group/card flex h-full w-full flex-col overflow-hidden rounded-[24px] transition-shadow hover:shadow-md border border-white/60 bg-white shadow-[0_3px_9px_rgba(43,49,78,0.04),0_6px_18px_rgba(43,49,78,0.06)]"
      style={{ borderRadius: "24px" }}
    >
      {/* Header */}
      <div className="flex items-start px-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--theme-secondary-ramp-50)] text-[var(--theme-secondary)] transition-transform group-hover/card:scale-110">
            <CalendarCheck2 className="h-5 w-5 transition-transform group-hover/card:rotate-12" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-bold leading-[24px] text-[#14182c]">
                {accountName}
              </h3>
              <Info className="h-4 w-4 text-[#5f6a94]" />
            </div>
            <p className="text-[12px] font-bold leading-[16px] tracking-[0.6px] text-[#5f6a94]">
              {subtitle} · {coveragePeriod}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-6">
        <div className="flex w-full items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#5f6a94]">
              Annual Election
            </p>
            <p className="text-[40px] font-bold leading-[36px] tracking-[-0.9px] text-[#14182c]">
              {fmt(annualCents)}
            </p>
            <div className="mt-1 flex flex-col items-start gap-2">
              <p className="text-[12px] text-[#5f6a94]">
                <span className="font-normal leading-[16px]">Per pay deduction: </span>
                <span className="font-bold leading-[16px]">{perPay(annualCents)}</span>
              </p>
              {hasSpent ? (
                <div className="flex items-center rounded-full border border-[#3958c3]/20 bg-[#eef2ff] px-[7px] py-[3px]">
                  <span className="text-[10px] font-bold leading-[15px] text-neutral-700">
                    {fmt(spentCents)} spent · {fmt(annualCents - spentCents)} remaining
                  </span>
                </div>
              ) : (
                <div className="flex items-center rounded-full border border-[#e0f0e8] bg-[#f0faf5] px-[7px] py-[3px]">
                  <span className="text-[10px] font-bold leading-[15px] text-[#009966]">
                    Just enrolled — full year available
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Days ring */}
          {daysOverride !== undefined && daysRemaining <= 90 && (
            <div className="relative flex h-[112px] w-[112px] shrink-0 items-center justify-center">
              <svg
                className="absolute inset-0 h-full w-full -rotate-90 transform"
                viewBox="0 0 112 112"
              >
                <circle cx="56" cy="56" r="48" fill="none" stroke="#e3e7f4" strokeWidth="10" />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="none"
                  stroke="var(--neutral-700)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1) 0.15s" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center rounded-full bg-white">
                <span className="text-[24px] font-bold leading-[32px] text-[#1f2636]">
                  {daysRemaining}
                </span>
                <span className="-mt-[2px] text-center text-[10px] font-bold uppercase leading-[15px] tracking-[0.5px] text-[#5d688c]">
                  days
                  <br />
                  to spend
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="flex w-full items-center justify-between rounded-xl bg-[#3958c3]/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center text-neutral-700">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-[2px]">
              <p className="text-[14px] font-bold leading-[20px] text-[#14182c]">
                {eligibleLabel}
              </p>
              <p className="text-[12px] leading-[16px] text-[#5f6a94]">
                {eligibleDescription}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 text-[14px] leading-[20px] text-neutral-700 hover:underline"
          >
            View Eligible Expenses
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 mt-auto">
        <button
          type="button"
          className="w-full rounded-xl border border-[#3958c3] py-[9.75px] text-[15.75px] font-medium text-neutral-700 hover:bg-[#3958c3]/5 transition-colors"
          onClick={onReimburse}
        >
          Reimburse Myself
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Simple Account Card (DCFSA / HRA)                                  */
/* ------------------------------------------------------------------ */

interface SimpleAccountCardProps {
  accountName: string;
  subtitle: string;
  icon: React.ReactNode;
  annualCents: number;
  coveragePeriod: string;
  employerFunded?: boolean;
  spentCents?: number;
}

function SimpleAccountCard({
  accountName,
  subtitle,
  icon,
  annualCents,
  coveragePeriod,
  employerFunded,
  spentCents = 0,
}: SimpleAccountCardProps) {
  const hasSpent = spentCents > 0;
  const remainingCents = annualCents - spentCents;
  const spentPct = annualCents > 0 ? Math.round((spentCents / annualCents) * 100) : 0;
  return (
    <div
      className="group/card flex h-full w-full flex-col overflow-hidden rounded-[24px] transition-shadow hover:shadow-md border border-white/60 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
      style={{ borderRadius: "24px" }}
    >
      {/* Header */}
      <div className="flex items-start px-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--theme-secondary-ramp-50)] text-[var(--theme-secondary)] transition-transform group-hover/card:scale-110">
            {icon}
          </div>
          <div className="flex flex-col">
            <h3 className="text-[16px] font-bold leading-[24px] text-[#14182c]">
              {accountName}
            </h3>
            <p className="text-[12px] font-bold uppercase leading-[16px] tracking-[0.6px] text-[#5f6a94]">
              {subtitle} · {coveragePeriod}
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 px-6 pb-8 pt-6">
        <div className="flex flex-col gap-1">
          <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#5f6a94]">
            {employerFunded ? "Employer Contribution" : "Annual Election"}
          </p>
          <p className="text-[40px] font-bold leading-[40px] tracking-[-0.9px] text-[#14182c]">
            {fmt(annualCents)}
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-xl bg-[#f1f3fb] px-4 py-3">
          <div className="flex h-[44px] items-center gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center text-neutral-700">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <div className="flex flex-1 items-center justify-between">
              <p className="text-[16px] font-semibold leading-[24px] tracking-[-0.176px] text-[#14182c]">
                {employerFunded ? "Per Pay Employer Credit" : "Per Pay Deduction"}
              </p>
              <p className="text-[16px] leading-[24px] tracking-[-0.176px] text-[#14182c]">
                {employerFunded ? "$0.00" : perPay(annualCents)}
              </p>
            </div>
          </div>
        </div>

        {hasSpent && (
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold leading-[16px] text-neutral-700">
                {spentPct}% used ({fmt(spentCents)})
              </p>
              <p className="text-[12px] leading-[16px] text-[#14182c]">
                {fmt(remainingCents)} remaining
              </p>
            </div>
            <div className="flex h-[6px] w-full items-center overflow-hidden rounded-[6px] bg-[#eef2ff]">
              <div
                className="h-full rounded-[6px] bg-[#3958c3]"
                style={{ width: `${spentPct}%`, transition: "width 1.5s ease-out" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
