import type { ExpenseRow } from "@/components/claims/expenseTypes";
import type { Transaction } from "./mockData";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Table uses MM/DD/YYYY; claim sheet header expects e.g. Mar 1, 2026 */
export function formatHsaTableDateLong(date: string): string {
  const parts = date.split("/").map((p) => Number.parseInt(p, 10));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return date;
  const [mm, dd, yyyy] = parts;
  if (mm < 1 || mm > 12) return date;
  return `${MONTH_NAMES[mm - 1]} ${dd}, ${yyyy}`;
}

function paymentNumberFromRowId(id: string): string {
  const digits = id.replace(/\D/g, "") || "0";
  const head = (digits + "12345").slice(0, 5);
  return `${head}A14745B`;
}

/**
 * Maps HSA account table rows to the claims {@link ExpenseRow} shape so we can reuse
 * {@link ClaimExpenseDetailSheet}. Status labels use **Processed** / **Pending** (HSA-specific).
 */
export function hsaTransactionToExpenseRow(t: Transaction): ExpenseRow {
  const isProcessed = t.status === "Complete";
  const dateLong = formatHsaTableDateLong(t.date);
  const taxYear = (() => {
    const y = t.date.split("/")[2];
    return y && /^\d{4}$/.test(y) ? y : "2026";
  })();

  return {
    id: t.id,
    dateOfService: dateLong,
    status: {
      label: isProcessed ? "Processed" : "Pending",
      tone: isProcessed ? "green" : "amber",
    },
    account: t.account,
    provider: t.description,
    recipient: "BS",
    category: t.category,
    categoryType: `${t.description} - ${t.category}`,
    documentIds: [],
    letterIds: [],
    amount: t.amount,
    origin: "manual",
    statusDate: isProcessed ? dateLong : undefined,
    hsaMeta: {
      tableDate: t.date,
      taxYear,
      paymentNumber: paymentNumberFromRowId(t.id),
    },
  };
}
