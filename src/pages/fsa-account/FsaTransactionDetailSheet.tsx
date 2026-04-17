import type { ReactNode } from "react";
import {
  Badge,
  Button,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@wexinc-healthbenefits/ben-ui-kit";
import {
  Building2,
  CalendarDays,
  CreditCard,
  FileText,
  Hash,
  ReceiptText,
  UserRound,
} from "lucide-react";
import { useReimburseWorkspace } from "@/context/ReimburseWorkspaceContext";
import type { FsaTransactionRow } from "./fsaTransactionsMock";

function DetailLine({
  icon,
  label,
  value,
  valueNode,
}: {
  icon?: ReactNode;
  label: string;
  value?: string;
  valueNode?: ReactNode;
}) {
  return (
    <div className="relative flex min-h-[48px] items-center justify-between gap-4 border-b border-[#b7c0da] py-3 text-sm last:border-b-0">
      <div className="flex min-w-0 items-center gap-2 text-[#5f6a94]">
        {icon ? <span className="shrink-0 text-[#5f6a94]">{icon}</span> : null}
        <span>{label}</span>
      </div>
      {valueNode ?? <span className="shrink-0 text-right text-[#14182c]">{value}</span>}
    </div>
  );
}

/**
 * Right slideout for FSA transaction details (Consumer Experience Redesign — Figma 30062:11931).
 */
export function FsaTransactionDetailSheet({
  open,
  onOpenChange,
  row,
}: {
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  row: FsaTransactionRow | null;
}) {
  const { openReimburseWorkspace } = useReimburseWorkspace();

  if (!row) return null;

  const summaryAmount = row.amount.replace(/^-/, "");
  const headerDate = row.date;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 overflow-hidden border-l border-[#e3e7f4] p-0 shadow-[0px_8px_16px_0px_rgba(2,13,36,0.15),0px_0px_1px_0px_rgba(2,13,36,0.3)] sm:max-w-[480px]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Transaction details</SheetTitle>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-6 px-6 py-6">
            <div className="pr-14">
              <div className="min-w-0 space-y-2">
                <h2 className="text-[30px] font-bold leading-10 tracking-tight text-[#14182c]">
                  Transaction Details
                </h2>
                <p className="text-[19px] font-normal leading-8 text-[#5f6a94]">Date: {headerDate}</p>
              </div>
            </div>

            <div className="rounded-lg border border-[#b7c0da] p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm text-[#5f6a94]">Total paid</span>
                <Badge
                  intent="warning"
                  className="rounded-2xl bg-[#FEE2E2] px-2 py-1 text-xs font-bold text-[#C8102E] border-transparent"
                >
                  Denied
                </Badge>
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-[#14182c]">{summaryAmount}</p>
              <div className="my-4 h-px w-full bg-[#b7c0da]" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#5f6a94]">Total Submitted</span>
                <span className="text-[#14182c]">{summaryAmount}</span>
              </div>
            </div>

            <section>
              <h3 className="mb-2 text-[17px] font-semibold leading-6 text-[#14182c]">Claim Details</h3>
              <div className="flex flex-col">
                <DetailLine
                  icon={<Building2 className="h-4 w-4" aria-hidden />}
                  label="Merchant/Provider"
                  value={row.description}
                />
                <DetailLine
                  icon={<UserRound className="h-4 w-4" aria-hidden />}
                  label="Recipient"
                  value="Emily Rose"
                />
                <DetailLine label="Payee" value="Emily Rose" />
                <DetailLine
                  icon={<CalendarDays className="h-4 w-4" aria-hidden />}
                  label="Date of Service"
                  value={headerDate}
                />
                <DetailLine
                  icon={<Hash className="h-4 w-4" aria-hidden />}
                  label="Claim Number"
                  value="12345250909D0000101"
                />
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-[17px] font-semibold leading-6 text-[#14182c]">Payment Details</h3>
              <div className="flex flex-col">
                <DetailLine
                  icon={<FileText className="h-4 w-4" aria-hidden />}
                  label="Description"
                  value="Claim Submission"
                />
                <DetailLine
                  icon={<CreditCard className="h-4 w-4" aria-hidden />}
                  label="Source"
                  value="Debit Card"
                />
                <DetailLine
                  icon={<ReceiptText className="h-4 w-4" aria-hidden />}
                  label="Receipt Status"
                  valueNode={
                    <Badge
                      intent="warning"
                      className="rounded-2xl bg-[#FFF1BF] px-2 py-1 text-xs font-bold text-[#735300] border-transparent"
                    >
                      New Needed
                    </Badge>
                  }
                />
                <DetailLine
                  icon={<CalendarDays className="h-4 w-4" aria-hidden />}
                  label="Plan Year"
                  value={row.planYear.replace(/\s*-\s*/, " - ")}
                />
                <div className="flex min-h-[48px] items-center justify-between gap-4 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="text-sm text-[#5f6a94]">Running Balance</p>
                    <p className="mt-0.5 text-xs text-[#5f6a94]">Available balance after payment</p>
                  </div>
                  <span className="shrink-0 text-sm text-[#14182c]">$2,225.00</span>
                </div>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-[17px] font-semibold leading-6 text-[#14182c]">Uploaded documents</h3>
              <div className="rounded-lg border border-[#b7c0da] p-4">
                <p className="text-base text-[#14182c]">walgreens_doc.pdf</p>
                <button
                  type="button"
                  className="mt-1 text-left text-base font-normal text-[#1c6eff] hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
                >
                  View File
                </button>
              </div>
            </section>
          </div>
        </ScrollArea>

        <div className="shrink-0 border-t border-[#e3e7f4] bg-white px-6 py-4">
          <div className="flex justify-end">
            <Button
              type="button"
              className="h-11 bg-[#3958c3] px-4 font-medium text-white hover:bg-[#3958c3]/90"
              onClick={() => {
                onOpenChange(false);
                openReimburseWorkspace();
              }}
            >
              Upload Receipt
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
