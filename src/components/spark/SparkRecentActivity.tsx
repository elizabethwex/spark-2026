import { useState } from "react";
import { Clock, ChevronRight } from "lucide-react";
import {
  getSparkRecentActivity,
  type SparkActivityStatus,
  type SparkActivityRow,
} from "@/data/sparkAiForwardMock";
import { ClaimExpenseDetailSheet } from "@/components/claims/ClaimExpenseDetailSheet";
import type { ExpenseRow } from "@/components/claims/expenseTypes";
import { cn } from "@/lib/utils";

function statusStyles(status: SparkActivityStatus): { wrapper: string; text: string } {
  switch (status) {
    case "approved":
    case "completed":
      return { wrapper: "border-[#D0FAE5] bg-[#D0FAE5]", text: "text-[#006045]" };
    case "needs_attention":
      return { wrapper: "border-[#FFF1BF] bg-[#FFF1BF]", text: "text-[#735300]" };
    default:
      return { wrapper: "border-[#F1F3FB] bg-[#F1F3FB]", text: "text-[#444C72]" };
  }
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/** Parses "4/27/26" or "12/14/26" → "Apr 27, 2026" */
function formatMetaDate(dateStr: string): string {
  const parts = dateStr.trim().split("/").map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some(Number.isNaN)) return dateStr;
  const [mm, dd, yy] = parts;
  if (mm < 1 || mm > 12) return dateStr;
  const yyyy = yy < 100 ? 2000 + yy : yy;
  return `${MONTH_NAMES[mm - 1]} ${dd}, ${yyyy}`;
}

function planVariant(meta: string): "hsa" | "fsa" {
  const plan = (meta.split(" • ")[1] ?? "").toUpperCase();
  return plan.includes("HSA") && !plan.includes("FSA") ? "hsa" : "fsa";
}

let _rowCounter = 0;
function sparkActivityRowToExpenseRow(row: SparkActivityRow, meta: string): ExpenseRow {
  const id = `spark-activity-${++_rowCounter}`;
  const [datePart, planPart] = meta.split(" • ");
  const dateFormatted = formatMetaDate(datePart ?? "");
  const variant = planVariant(meta);
  const planLabel = planPart ?? (variant === "hsa" ? "HSA" : "FSA");

  const statusLabel =
    row.status === "needs_attention"
      ? "Documentation Needed"
      : variant === "hsa"
        ? "Processed"
        : "Paid";

  const tone: ExpenseRow["status"]["tone"] =
    row.status === "needs_attention" ? "amber" : "green";

  const taxYear = (() => {
    const y = (datePart ?? "").split("/")[2];
    if (!y) return "2026";
    const n = parseInt(y, 10);
    return String(n < 100 ? 2000 + n : n);
  })();

  const paymentNumber = `${id.replace(/\D/g, "").padStart(5, "1").slice(0, 5)}A14745B`;

  return {
    id,
    dateOfService: dateFormatted,
    status: { label: statusLabel, tone },
    account: planLabel,
    provider: row.merchant,
    recipient: "BS",
    category: planLabel,
    documentIds: [],
    letterIds: [],
    amount: row.amount,
    origin: "manual",
    statusDate: row.status === "needs_attention" ? undefined : dateFormatted,
    hsaMeta:
      variant === "hsa"
        ? { tableDate: datePart ?? "", taxYear, paymentNumber }
        : undefined,
    fsaMeta:
      variant === "fsa"
        ? { tableDate: datePart ?? "", planYear: "01/01/2026 - 12/31/2026", paymentNumber }
        : undefined,
  };
}

/**
 * SPARK-2026 simplified recent activity list (Figma).
 */
export function SparkRecentActivity({ activeView = 1 }: { activeView?: 1 | 2 | 3 }) {
  const [selectedRow, setSelectedRow] = useState<{ row: SparkActivityRow; meta: string } | null>(null);

  const displayActivity = getSparkRecentActivity(activeView);

  const sheetExpenseRow = selectedRow
    ? sparkActivityRowToExpenseRow(selectedRow.row, selectedRow.meta)
    : null;

  const sheetVariant: "hsa" | "fsa" = selectedRow
    ? planVariant(selectedRow.meta)
    : "hsa";

  return (
    <>
      <section className="space-y-4" aria-labelledby="spark-activity-heading">
        <div className="flex items-center justify-between w-full">
          <h2 id="spark-activity-heading" className="text-[12px] font-black uppercase tracking-[3px] text-[#5f6a94] leading-[16px]">
            Recent Activity
          </h2>
        </div>

        <div className="flex flex-col gap-[12px]">
          {displayActivity.map((row, index) => (
            <button
              key={`${row.merchant}-${row.meta}-${index}`}
              type="button"
              onClick={() => setSelectedRow({ row, meta: row.meta })}
              className={cn(
                "group relative flex w-full flex-col items-start overflow-hidden rounded-[16px] border border-white bg-white p-px text-left shadow-[0_3px_9px_rgba(43,49,78,0.04),0_6px_18px_rgba(43,49,78,0.06)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "hover:border-[#3958c3]/20 hover:shadow-md cursor-pointer"
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

                  <div className="flex items-center gap-[12px]">
                    <div className="flex flex-col items-end gap-1">
                      <p className="text-[14px] font-bold leading-[20px] text-foreground">
                        {row.amount}
                      </p>
                      <div
                        className={cn(
                          "flex items-center rounded-full border px-[7px] py-[3px]",
                          statusStyles(row.status).wrapper
                        )}
                      >
                        <span
                          className={cn(
                            "text-[10px] font-bold leading-[15px] capitalize",
                            statusStyles(row.status).text
                          )}
                        >
                          {row.statusLabel.toLowerCase()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      className="h-4 w-4 text-[#5f6a94] transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <ClaimExpenseDetailSheet
        key={selectedRow ? `${selectedRow.row.merchant}-${selectedRow.meta}` : "closed"}
        open={selectedRow !== null}
        onOpenChange={(next) => {
          if (!next) setSelectedRow(null);
        }}
        row={sheetExpenseRow}
        variant={sheetVariant}
      />
    </>
  );
}
