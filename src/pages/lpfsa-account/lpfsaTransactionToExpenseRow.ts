import type { ExpenseRow } from "@/components/claims/expenseTypes";
import { formatHsaTableDateLong } from "@/pages/hsa-details/hsaTransactionToExpenseRow";
import type { FsaTransactionRow } from "@/pages/fsa-account/fsaTransactionsMock";

function paymentNumberFromRowId(id: string): string {
  const digits = id.replace(/\D/g, "") || "0";
  const head = (digits + "88310").slice(0, 5);
  return `${head}L14745C`;
}

/**
 * Maps LPFSA account table rows to {@link ExpenseRow} for {@link ClaimExpenseDetailSheet} (`variant="fsa"`).
 */
export function lpfsaTransactionToExpenseRow(t: FsaTransactionRow): ExpenseRow {
  const dateLong = formatHsaTableDateLong(t.date);
  const status =
    t.status === "Denied"
      ? { label: "Denied" as const, tone: "red" as const }
      : t.status === "Paid"
        ? { label: "Paid" as const, tone: "green" as const }
        : { label: "Complete" as const, tone: "green" as const };

  return {
    id: t.id,
    dateOfService: dateLong,
    status,
    account: "Limited Purpose FSA",
    provider: t.description,
    recipient: "BS",
    category: "Limited Purpose FSA",
    categoryType: t.description,
    documentIds: [],
    letterIds: [],
    amount: t.amount,
    origin: "manual",
    statusDate: dateLong,
    denialReason:
      t.status === "Denied"
        ? "Additional documentation may be required to substantiate this transaction. Upload a detailed receipt if prompted."
        : undefined,
    fsaMeta: {
      tableDate: t.date,
      planYear: t.planYear,
      paymentNumber: paymentNumberFromRowId(t.id),
    },
  };
}
