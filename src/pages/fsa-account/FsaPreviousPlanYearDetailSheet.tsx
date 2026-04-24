import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Badge,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { AlertTriangle, CircleCheck, Info, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { FsaPreviousPlanYearViewModel } from "./fsaPreviousPlanYearViewModel";

function ModalInfoTip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex shrink-0 text-[#5f6a94] hover:text-[#14182c] focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={label}
        >
          <Info className="h-4 w-4" aria-hidden />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-[280px] text-left text-sm">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}

function ListRow({
  icon,
  label,
  value,
  borderBottom = true,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
  borderBottom?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-[48px] items-center justify-between gap-4 py-3 text-sm",
        borderBottom && "border-b border-[#b7c0da]"
      )}
    >
      <div className="flex min-w-0 items-center gap-2 text-[#5f6a94]">
        {icon ? <span className="shrink-0 text-[#5f6a94]">{icon}</span> : null}
        <span>{label}</span>
      </div>
      <span className="shrink-0 text-right text-[14px] leading-6 tracking-[-0.084px] text-[#14182c]">
        {value}
      </span>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[17px] font-semibold leading-6 tracking-[-0.221px] text-[#14182c]">
      {children}
    </h3>
  );
}

function StatCard({
  icon,
  label,
  hint,
  amount,
}: {
  icon: ReactNode;
  label: string;
  hint: string;
  amount: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-center rounded-lg border border-[#e4e6e9] px-2.5 py-2">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-[#5f6a94]">{icon}</span>
          <span className="text-[14px] font-normal leading-6 tracking-[-0.084px] text-[#5f6a94]">
            {label}
          </span>
        </div>
        <p className="text-xs leading-4 text-[#5f6a94]">{hint}</p>
        <p className="text-[14px] font-normal leading-6 tracking-[-0.084px] text-[#14182c]">{amount}</p>
      </div>
    </div>
  );
}

/**
 * Previous Plan Year “View more details” modal (Consumer Experience — Figma 34407:20764).
 */
const BAR_ANIM_MS = 1100;
const AMOUNT_ANIM_MS = 950;

export function FsaPreviousPlanYearDetailSheet({
  open,
  onOpenChange,
  viewModel,
  sheetAriaTitle = "Flexible Spending Account plan details",
  planHeading = "Flexible Spending Account",
}: {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  /** Must match the sibling `FsaPreviousPlanYearCard` `viewModel`. */
  viewModel: FsaPreviousPlanYearViewModel;
  /** Accessible title for the dialog (e.g. LPFSA reuse). */
  sheetAriaTitle?: string;
  /** Main visible heading (e.g. Healthcare FSA, Limited Purpose Flexible Spending Account). */
  planHeading?: string;
}) {
  const [barPct, setBarPct] = useState(0);
  const [eligibleCents, setEligibleCents] = useState(0);
  const [usedBadgePct, setUsedBadgePct] = useState(0);
  const amountRafRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      setBarPct(0);
      setEligibleCents(0);
      setUsedBadgePct(0);
      return;
    }
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBarPct(100);
      setEligibleCents(viewModel.eligibleCents);
      setUsedBadgePct(viewModel.usedPercent);
    }
  }, [open, viewModel.eligibleCents, viewModel.usedPercent]);

  useEffect(() => {
    if (!open) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let start: number | null = null;
    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

    const step = (now: number) => {
      if (start === null) start = now;
      const elapsed = now - start;
      const tBar = Math.min(1, elapsed / BAR_ANIM_MS);
      const tAmt = Math.min(1, elapsed / AMOUNT_ANIM_MS);
      setBarPct(easeOutQuad(tBar) * 100);
      const eAmt = easeOutQuad(tAmt);
      setEligibleCents(Math.round(eAmt * viewModel.eligibleCents));
      setUsedBadgePct(Math.round(eAmt * viewModel.usedPercent));
      if (tBar < 1 || tAmt < 1) {
        amountRafRef.current = requestAnimationFrame(step);
      } else {
        setBarPct(100);
        setEligibleCents(viewModel.eligibleCents);
        setUsedBadgePct(viewModel.usedPercent);
      }
    };

    amountRafRef.current = requestAnimationFrame(step);
    return () => {
      if (amountRafRef.current != null) cancelAnimationFrame(amountRafRef.current);
    };
  }, [open, viewModel.eligibleCents, viewModel.usedPercent]);

  const eligibleFormatted = `$${(eligibleCents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const usedLabel =
    usedBadgePct >= viewModel.usedPercent
      ? `${viewModel.usedPercent}% used`
      : `${Math.min(viewModel.usedPercent, usedBadgePct)}% used`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className={cn(
          "flex w-[calc(100vw-2rem)] max-w-[720px] flex-col gap-0 overflow-hidden rounded-xl border border-[#e3e7f4] bg-white p-0",
          "shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]",
          "max-h-[min(90vh,900px)] sm:rounded-xl"
        )}
      >
        <div className="flex shrink-0 items-start justify-between px-6 pb-0 pt-6 pr-14">
          <div>
            <DialogTitle className="text-left text-[17.5px] font-semibold leading-6 tracking-normal text-[#14182c]">
              {planHeading}
            </DialogTitle>
            <p className="mt-0 text-sm font-normal leading-6 text-[#5f6a94]">
              {viewModel.planPeriodLabel} {viewModel.planYearRangeDisplay}
            </p>
          </div>
        </div>
        {sheetAriaTitle !== planHeading ? (
          <span className="sr-only">{sheetAriaTitle}</span>
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 pt-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex h-6 items-center justify-between gap-2">
                <div className="flex flex-1 items-center gap-2 text-[14px] font-normal leading-6 tracking-[-0.084px] text-[#5f6a94]">
                  <span>Eligible Amount</span>
                  <ModalInfoTip label="About eligible amount">
                    Total you could spend during the plan year
                  </ModalInfoTip>
                </div>
              </div>
              <p className="text-2xl font-semibold tabular-nums leading-8 tracking-[-0.456px] text-[#14182c]">
                {eligibleFormatted}
              </p>
              <div className="flex items-start gap-4">
                <div className="min-h-[20px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#edeff0]">
                  <div
                    className="h-5 rounded-full bg-[#3958c3]"
                    style={{ width: `${barPct}%` }}
                    aria-hidden
                  />
                </div>
                <Badge
                  intent="success"
                  className="shrink-0 rounded-2xl bg-[#dcfce7] px-[7px] py-[3.5px] text-xs font-bold leading-none text-[#008375] tabular-nums"
                >
                  {usedLabel}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
              <StatCard
                icon={<CircleCheck className="h-4 w-4 text-emerald-700" aria-hidden />}
                label="Used"
                hint="Spent on claims"
                amount={viewModel.usedAmountFormatted}
              />
              <StatCard
                icon={<RefreshCw className="h-4 w-4 text-[var(--theme-secondary)]" aria-hidden />}
                label="Rolled Over"
                hint="Moved to next year"
                amount={viewModel.rolledOverFormatted}
              />
              <StatCard
                icon={<AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden />}
                label="Unused/Forfeited"
                hint="Not used in time"
                amount={viewModel.unusedForfeitedFormatted}
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="flex flex-wrap items-baseline gap-1 text-[14px] leading-6 tracking-[-0.084px] text-[#5f6a94]">
                  <span>Available Balance</span>
                  <span className="text-xs leading-4">(period start)</span>
                </p>
                <p className="text-base font-medium leading-6 tracking-[-0.176px] text-[#14182c]">
                  {viewModel.availableBalancePeriodStart}
                </p>
              </div>
              <div
                className="hidden h-auto w-px shrink-0 self-stretch bg-[#b7c0da] sm:block"
                aria-hidden
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="flex flex-wrap items-baseline gap-1 text-[14px] leading-6 tracking-[-0.084px] text-[#5f6a94]">
                  <span>Available Balance</span>
                  <span className="text-xs leading-4">(period end)</span>
                </p>
                <p className="text-base font-medium leading-6 tracking-[-0.176px] text-[#14182c]">
                  {viewModel.availableBalancePeriodEnd}
                </p>
              </div>
            </div>

            <div className="rounded-md shadow-[0px_4px_8px_0px_rgba(2,5,10,0.04)]">
              <div className="flex items-start gap-[7px] rounded-md bg-[#f8f9fe] p-2.5">
                <Info className="mt-0.5 h-[15.75px] w-[15.75px] shrink-0 text-[#5f6a94]" aria-hidden />
                <p className="text-[14px] font-medium leading-normal text-[#5f6a94]">
                  {viewModel.rolloverInfoMessage}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <section className="flex flex-col gap-4">
                <SectionHeading>Election Details</SectionHeading>
                <div className="flex flex-col">
                  <ListRow label="Effective Date" value={viewModel.effectiveDate} />
                  <ListRow label="My Annual Election" value={viewModel.annualElectionFormatted} />
                  <ListRow
                    label="Estimated Payroll Deductions"
                    value={viewModel.estimatedPayrollDeductions}
                    borderBottom={false}
                  />
                </div>
              </section>

              <section className="flex flex-col gap-4">
                <SectionHeading>How your funds were built</SectionHeading>
                <div className="flex flex-col">
                  <ListRow
                    label="My Contributions to Date"
                    value={viewModel.contributionsToDateFormatted}
                    borderBottom={false}
                  />
                </div>
              </section>

              <section className="flex flex-col gap-1">
                <SectionHeading>Claims Details</SectionHeading>
                <div className="flex flex-col">
                  <ListRow label="Total Submitted" value={viewModel.claimsTotalSubmitted} />
                  <ListRow label="Total Paid" value={viewModel.claimsTotalPaid} />
                  <ListRow label="Total Pending" value={viewModel.claimsTotalPending} />
                  <ListRow label="Total Denied" value={viewModel.claimsTotalDenied} borderBottom={false} />
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-4 border-t border-[#e3e7f4] px-6 py-4">
          <Button
            type="button"
            className="h-11 min-h-[44px] bg-[#3958c3] px-[13.25px] font-medium text-white hover:bg-[#3958c3]/90"
            asChild
          >
            <Link to="/claims" onClick={() => onOpenChange(false)}>
              View Claims
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
