import type { ExpenseRow } from "@/components/claims/expenseTypes";
import { formatHsaTableDateLong } from "@/pages/hsa-details/hsaTransactionToExpenseRow";
import type { FsaTransactionRow } from "./fsaTransactionsMock";

function paymentNumberFromRowId(id: string): string {
  const digits = id.replace(/\D/g, "") || "0";
  const head = (digits + "12345").slice(0, 5);
  return `${head}A14745B`;
}

/**
 * Maps FSA account table rows to the claims {@link ExpenseRow} shape so we can reuse
 * {@link ClaimExpenseDetailSheet} (`variant="fsa"`). Status labels match the table: Complete, Denied, Paid.
 */
export function fsaTransactionToExpenseRow(t: FsaTransactionRow): ExpenseRow {
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
    account: "Healthcare FSA",
    provider: t.description,
    recipient: "BS",
    category: "Healthcare FSA",
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
