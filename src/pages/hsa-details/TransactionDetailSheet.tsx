import { useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@wexinc-healthbenefits/ben-ui-kit";
import { Button } from "@wexinc-healthbenefits/ben-ui-kit";
import { ScrollArea } from "@wexinc-healthbenefits/ben-ui-kit";
import { type Transaction, type TransactionDetail, transactionDetailData } from "./mockData";

interface TransactionDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

/**
 * Transaction Detail Sheet Component
 * 
 * Slide-out panel from the left displaying detailed transaction/plan information.
 * Follows the Figma design with:
 * - Title bar with "Plan details" heading
 * - Year range and account name sub-header
 * - Data rows with label-value pairs
 * - Claims section
 * - Action buttons at the bottom
 */
export function TransactionDetailSheet({ 
  open, 
  onOpenChange, 
  transaction 
}: TransactionDetailSheetProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  // Get the detail data for this transaction
  const detail: TransactionDetail | undefined = transaction 
    ? transactionDetailData[transaction.id] 
    : undefined;

  useEffect(() => {
    if (!open || !contentRef.current || !transaction || !detail) return;
    const closeEls = contentRef.current.querySelectorAll("[data-radix-dialog-close]");
    const className = contentRef.current.className;
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/0f2d92c4-4c76-48a6-a34a-0a7a7699a103", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "H1",
        location: "TransactionDetailSheet.tsx:contentRef",
        message: "Close elements detected in sheet content",
        data: {
          className,
          closeCount: closeEls.length,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [open]);

  if (!transaction || !detail) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[480px] max-w-[90vw] p-0"
        ref={contentRef}
      >
        <ScrollArea className="h-full">
          <div className="p-6 space-y-4">
            {/* Header */}
            <SheetHeader className="space-y-1 relative">
              <SheetTitle className="text-[30px] font-bold tracking-tight leading-10">
                Plan details
              </SheetTitle>
            </SheetHeader>

            {/* Sub-header: Year and Account Name */}
            <div className="space-y-0.5">
              <p className="text-sm text-muted-foreground">
                Year {detail.yearRange}
              </p>
              <p className="text-xl font-medium text-foreground/90">
                {detail.accountName}
              </p>
            </div>

            {/* Data Rows */}
            <div className="space-y-0">
              <DataRow label="Election Amount" value={detail.electionAmount} />
              <DataRow label="Amount Forfeited" value={detail.amountForfeited} />
              <DataRow label="Amount Rollover" value={detail.amountRollover} />
              <DataRow label="Available Balance" value={detail.availableBalance} />
              <DataRow label="Effective" value={detail.effective} />
              <DataRow label="My Annual Election" value={detail.myAnnualElection} />
              <DataRow label="Company Contributions" value={detail.companyContributions} />
              <DataRow label="My contributions to Date" value={detail.myContributionsToDate} />
              <DataRow label="Estimated Payroll Deductions" value={detail.estimatedPayrollDeductions} />
              <DataRow label="Plan Year Balance" value={detail.planYearBalance} />
            </div>

            {/* Claims Section */}
            <div className="space-y-3 pt-8">
              <h3 className="text-[17px] font-semibold text-foreground pb-2">
                Claims
              </h3>
              <ClaimRow label="Submitted" value={detail.claims.submitted} />
              <ClaimRow label="Paid" value={detail.claims.paid} />
              <ClaimRow label="Pending" value={detail.claims.pending} />
              <ClaimRow label="Denied" value={detail.claims.denied} />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-8 pb-4">
              <Button
                variant="outline"
                size="md"
                className="text-primary border-primary hover:bg-primary/10 active:bg-primary/20"
              >
                View Transactions
              </Button>
              <Button
                variant="outline"
                size="md"
                className="text-primary border-primary hover:bg-primary/10 active:bg-primary/20"
              >
                View Claims
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Data Row Component - Label/Value pair with bottom border
 */
function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-foreground text-right">
        {value}
      </span>
    </div>
  );
}

/**
 * Claim Row Component - Simpler layout for claims section
 */
function ClaimRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-foreground text-right">
        {value}
      </span>
    </div>
  );
}

