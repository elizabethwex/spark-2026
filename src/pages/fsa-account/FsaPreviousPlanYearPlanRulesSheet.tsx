import { Badge, Tooltip, TooltipContent, TooltipTrigger } from "@wexinc-healthbenefits/ben-ui-kit";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { FsaPreviousPlanYearPlanRulesViewModel } from "./fsaPreviousPlanYearPlanRulesViewModel";

function RowTip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex text-[#5f6a94] hover:text-[#14182c] focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
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

function ClaimIntro({ model }: { model: FsaPreviousPlanYearPlanRulesViewModel }) {
  const { planYearRangeDisplay, claimNarrativeSubmitBy, claimNarrativeServiceEnd } = model;

  if (model.variant === "dcfsa") {
    return (
      <p className="text-sm font-medium leading-5 text-[#5f6a94]">
        For the <strong className="font-bold text-[#14182c]">{planYearRangeDisplay}</strong> plan year, claims had to
        be submitted by <strong className="font-bold text-[#14182c]">{claimNarrativeSubmitBy}.</strong> Based on your{" "}
        <strong className="font-bold text-[#14182c]">Active</strong> employment status during that year, only dependent
        care services received on or before{" "}
        <strong className="font-bold text-[#14182c]">{claimNarrativeServiceEnd}</strong> were
        eligible for reimbursement.
      </p>
    );
  }

  if (model.variant === "lpfsa") {
    return (
      <p className="text-sm font-medium leading-5 text-[#5f6a94]">
        For the <strong className="font-bold text-[#14182c]">{planYearRangeDisplay}</strong> plan year, claims had to
        be submitted by <strong className="font-bold text-[#14182c]">{claimNarrativeSubmitBy}.</strong> Based on your{" "}
        <strong className="font-bold text-[#14182c]">Active</strong> employment status during that year, only dental and
        vision services received on or before{" "}
        <strong className="font-bold text-[#14182c]">{claimNarrativeServiceEnd}</strong> were
        eligible for reimbursement.
      </p>
    );
  }

  return (
    <p className="text-sm font-medium leading-5 text-[#5f6a94]">
      For the <strong className="font-bold text-[#14182c]">{planYearRangeDisplay}</strong> plan year, claims had to be
      submitted by <strong className="font-bold text-[#14182c]">{claimNarrativeSubmitBy}.</strong> Based on your{" "}
      <strong className="font-bold text-[#14182c]">Active</strong> employment status during that year, only healthcare
      services received on or before{" "}
      <strong className="font-bold text-[#14182c]">{claimNarrativeServiceEnd}</strong> were eligible for
      reimbursement.
    </p>
  );
}

/**
 * Previous Plan Year — “View Plan Rules” modal (same sections as the Plan Rules card, for the selected plan year).
 */
export function FsaPreviousPlanYearPlanRulesSheet({
  open,
  onOpenChange,
  planRules,
  sheetAriaTitle = "Plan rules for previous plan year",
}: {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  planRules: FsaPreviousPlanYearPlanRulesViewModel;
  /** When the visible title differs, e.g. account-specific. */
  sheetAriaTitle?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className={cn(
          "flex max-h-[min(90vh,880px)] w-[calc(100vw-2rem)] max-w-[640px] flex-col gap-0 overflow-hidden rounded-xl border border-[#e3e7f4] bg-white p-0",
          "shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]",
          "sm:rounded-xl"
        )}
      >
        <div className="flex shrink-0 flex-col px-6 pb-0 pt-6 pr-14">
          <DialogTitle className="text-left text-[17.5px] font-semibold leading-6 tracking-normal text-[#14182c]">
            Plan Rules
          </DialogTitle>
          <p className="mt-1 text-sm font-normal leading-6 text-[#5f6a94]">
            Plan year: {planRules.planYearRangeDisplay}
          </p>
          <span className="sr-only">{sheetAriaTitle}</span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 pt-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-[20px] font-semibold leading-8 text-[#14182c]">Claim Deadlines</h3>
              <div className="mt-4 rounded-xl bg-[#f8f9fe] p-4">
                <div className="flex gap-3">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#5f6a94]" aria-hidden />
                  <ClaimIntro model={planRules} />
                </div>
              </div>

              <div className="mt-4 space-y-0">
                <div className="flex flex-wrap items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
                  <div className="flex min-w-0 flex-1 items-center gap-2 text-[#5f6a94]">
                    <span>{planRules.statusRowLabel}</span>
                    <RowTip label={`About ${planRules.statusRowLabel}`}>{planRules.statusRowTooltip}</RowTip>
                  </div>
                  <Badge
                    intent="default"
                    className="w-max max-w-none shrink-0 justify-center rounded-md border border-[#e3e7f4] bg-[#f4f5f7] px-2 py-1 text-xs font-bold text-[#5f6a94]"
                  >
                    Closed
                  </Badge>
                </div>
                <div className="flex items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
                  <div className="flex items-center gap-2 text-[#5f6a94]">
                    <span>{planRules.effectiveDateRowLabel}</span>
                    <RowTip label={`About ${planRules.effectiveDateRowLabel}`}>
                      {planRules.effectiveDateRowTooltip}
                    </RowTip>
                  </div>
                  <span className="font-medium text-[#14182c]">{planRules.effectiveDateValue}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
                  <div className="flex items-center gap-2 text-[#5f6a94]">
                    <span>Final Filing Date</span>
                    <RowTip label="About Final Filing Date">{planRules.finalFilingDateTooltip}</RowTip>
                  </div>
                  <span className="font-medium text-[#14182c]">{planRules.finalFilingDateValue}</span>
                </div>
                <div className="flex items-center justify-between py-3 text-sm">
                  <div className="flex items-center gap-2 text-[#5f6a94]">
                    <span>Final Service Date</span>
                    <RowTip label="About Final Service Date">{planRules.finalServiceDateTooltip}</RowTip>
                  </div>
                  <span className="font-medium text-[#14182c]">{planRules.finalServiceDateValue}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[20px] font-semibold leading-8 text-[#14182c]">{planRules.cardRulesTitle}</h3>
              <div className="mt-4 space-y-0">
                <div className="flex items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
                  <span className="text-[#5f6a94]">{planRules.cardTransactionsLabel}</span>
                  <span className="font-medium text-[#14182c]">{planRules.cardTransactionsValue}</span>
                </div>
                <div className="flex items-center justify-between py-3 text-sm">
                  <span className="text-[#5f6a94]">{planRules.maxPerTransactionLabel}</span>
                  <span className="font-medium text-[#14182c]">{planRules.maxPerTransactionValue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
