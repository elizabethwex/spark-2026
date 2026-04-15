import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Badge,
  Button,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@wexinc-healthbenefits/ben-ui-kit";
import {
  AlertTriangle,
  Banknote,
  CalendarDays,
  CalendarSync,
  CircleCheck,
  CircleDollarSign,
  CircleX,
  Clock,
  Info,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

function SheetInfoTip({ label, children }: { label: string; children: React.ReactNode }) {
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
  compactPadding = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  borderBottom?: boolean;
  compactPadding?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-[48px] items-center justify-between gap-4 text-sm",
        compactPadding ? "py-3" : "py-4",
        borderBottom && "border-b border-[#b7c0da]"
      )}
    >
      <div className="flex min-w-0 items-center gap-2 text-[#5f6a94]">
        <span className="shrink-0 text-[#5f6a94]">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="shrink-0 text-right text-[#14182c]">{value}</span>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[17px] font-semibold leading-6 text-[#14182c]">{children}</h3>;
}

/**
 * Previous Plan Year “View more details” slideout (Consumer Experience Redesign — Figma 29641:15455).
 */
/** $2,500.00 in cents for count-up animation */
const ELIGIBLE_CENTS = 250000;
const BAR_ANIM_MS = 1100;
const AMOUNT_ANIM_MS = 950;

export function FsaPreviousPlanYearDetailSheet({
  open,
  onOpenChange,
  planYearRange = "01/01/2025 - 12/31/2025",
}: {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  /** Display string under the title, e.g. from plan period control */
  planYearRange?: string;
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
      setEligibleCents(ELIGIBLE_CENTS);
      setUsedBadgePct(100);
    }
  }, [open]);

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
      setEligibleCents(Math.round(eAmt * ELIGIBLE_CENTS));
      setUsedBadgePct(Math.round(eAmt * 100));
      if (tBar < 1 || tAmt < 1) {
        amountRafRef.current = requestAnimationFrame(step);
      } else {
        setBarPct(100);
        setEligibleCents(ELIGIBLE_CENTS);
        setUsedBadgePct(100);
      }
    };

    amountRafRef.current = requestAnimationFrame(step);
    return () => {
      if (amountRafRef.current != null) cancelAnimationFrame(amountRafRef.current);
    };
  }, [open]);

  const eligibleFormatted = `$${(eligibleCents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 overflow-hidden border-l border-[#e3e7f4] p-0 shadow-[0px_8px_16px_0px_rgba(2,13,36,0.15),0px_0px_1px_0px_rgba(2,13,36,0.3)] sm:max-w-[480px]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Flexible Spending Account plan details</SheetTitle>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-6 px-6 py-6">
            <div className="pr-14">
              <h2 className="text-[30px] font-bold leading-10 tracking-tight text-[#14182c]">
                Flexible Spending Account
              </h2>
              <p className="mt-2 text-[19px] font-normal leading-8 text-[#5f6a94]">
                Plan Year: {planYearRange}
              </p>
            </div>

            <div className="rounded-lg border border-[#b7c0da] p-4">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-[#5f6a94]">
                    <span>Eligible Amount</span>
                    <SheetInfoTip label="About eligible amount">
                      Total you could spend during the plan year
                    </SheetInfoTip>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-2xl font-semibold tabular-nums tracking-tight text-[#14182c]">
                      {eligibleFormatted}
                    </span>
                    <Badge
                      intent="success"
                      className="rounded-2xl bg-[#dcfce7] px-2 py-1 text-xs font-bold text-[#008375] tabular-nums"
                    >
                      {usedBadgePct}% used
                    </Badge>
                  </div>
                </div>
                <div className="h-5 overflow-hidden rounded-full bg-[#edeff0]">
                  <div className="h-full rounded-full bg-[#3958c3]" style={{ width: `${barPct}%` }} aria-hidden />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between gap-4 border-b border-[#b7c0da] py-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-medium text-[#14182c]">
                        <CircleCheck className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
                        <span>Used</span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#5f6a94]">Spent on claims</p>
                    </div>
                    <span className="shrink-0 text-sm text-[#14182c]">$2,500.00</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-b border-[#b7c0da] py-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-medium text-[#14182c]">
                        <RefreshCw className="h-4 w-4 shrink-0 text-[#3958c3]" aria-hidden />
                        <span>Rolled Over</span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#5f6a94]">Moved to next year</p>
                    </div>
                    <span className="shrink-0 text-sm text-[#14182c]">$0.00</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-medium text-[#14182c]">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
                        <span>Unused/Forfeited</span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#5f6a94]">Not used in time</p>
                    </div>
                    <span className="shrink-0 text-sm text-[#14182c]">$0.00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="text-sm text-[#5f6a94]">Available Balance (period start)</p>
                  <p className="text-base font-medium text-[#14182c]">$2,500.00</p>
                </div>
                <div
                  className="hidden shrink-0 self-stretch border-l border-[#b7c0da] sm:block"
                  aria-hidden
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="text-sm text-[#5f6a94]">Available Balance (period end)</p>
                  <p className="text-base font-medium text-[#14182c]">$0.00</p>
                </div>
              </div>
              <div className="flex gap-2 rounded-xl bg-[rgba(57,88,195,0.05)] px-4 py-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#5f6a94]" aria-hidden />
                <p className="text-sm font-medium leading-normal text-[#5f6a94]">
                  Nothing was rolled over and nothing expired.
                </p>
              </div>
            </div>

            <section className="flex flex-col gap-2">
              <SectionHeading>Election Details</SectionHeading>
              <div className="flex flex-col">
                <ListRow
                  icon={<CalendarDays className="h-4 w-4" aria-hidden />}
                  label="Effective Date"
                  value="Jan 1, 2025"
                />
                <ListRow
                  icon={<CalendarSync className="h-4 w-4" aria-hidden />}
                  label="My Annual Election"
                  value="$2,500.00"
                />
                <ListRow
                  icon={<Banknote className="h-4 w-4" aria-hidden />}
                  label="Estimated Payroll Deductions"
                  value="$75.76"
                  borderBottom={false}
                />
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <SectionHeading>How your funds were built</SectionHeading>
              <div className="flex flex-col">
                <ListRow
                  icon={<UserRound className="h-4 w-4" aria-hidden />}
                  label="My Contributions to Date"
                  value="$2,500.00"
                  borderBottom={false}
                />
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <SectionHeading>Claims Details</SectionHeading>
              <div className="flex flex-col">
                <ListRow
                  icon={<CircleDollarSign className="h-4 w-4" aria-hidden />}
                  label="Total Submitted"
                  value="$2,500.00"
                  compactPadding
                />
                <ListRow
                  icon={<CircleCheck className="h-4 w-4" aria-hidden />}
                  label="Total Paid"
                  value="$2,500.00"
                  compactPadding
                />
                <ListRow
                  icon={<Clock className="h-4 w-4" aria-hidden />}
                  label="Total Pending"
                  value="$0.00"
                  compactPadding
                />
                <ListRow
                  icon={<CircleX className="h-4 w-4" aria-hidden />}
                  label="Total Denied"
                  value="$0.00"
                  borderBottom={false}
                  compactPadding
                />
              </div>
            </section>
          </div>
        </ScrollArea>

        <div className="shrink-0 border-t border-[#e3e7f4] bg-white px-6 py-4">
          <div className="flex justify-end">
            <Button
              type="button"
              className="h-11 bg-[#3958c3] px-4 font-medium text-white hover:bg-[#3958c3]/90"
              asChild
            >
              <Link to="/claims" onClick={() => onOpenChange(false)}>
                View Claims
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
