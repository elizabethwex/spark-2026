export type FsaTransactionStatus = "Complete" | "Denied" | "Paid";

export type FsaTransactionRow = {
  id: string;
  date: string;
  status: FsaTransactionStatus;
  description: string;
  planYear: string;
  /** Display string including minus for outflows, e.g. "-$60.00" */
  amount: string;
  /** True when amount is an outflow / negative display */
  amountIsNegative?: boolean;
  /** When set, show an action control in the Actions column */
  action?: "upload_receipt";
};

/** Mock FSA transactions — matches Consumer Experience Transactions table reference. */
export const fsaTransactionsData: FsaTransactionRow[] = [
  {
    id: "1",
    date: "03/01/2026",
    status: "Complete",
    description: "Payroll Deduction",
    planYear: "01/01/2026 - 12/31/2026",
    amount: "$75.76",
  },
  {
    id: "2",
    date: "02/28/2026",
    status: "Denied",
    description: "Walgreens",
    planYear: "01/01/2026 - 12/31/2026",
    amount: "-$60.00",
    amountIsNegative: true,
    action: "upload_receipt",
  },
  {
    id: "3",
    date: "02/15/2026",
    status: "Complete",
    description: "Payroll Deduction",
    planYear: "01/01/2026 - 12/31/2026",
    amount: "$75.76",
  },
  {
    id: "4",
    date: "01/30/2026",
    status: "Complete",
    description: "Payroll Deduction",
    planYear: "01/01/2026 - 12/31/2026",
    amount: "$75.76",
  },
  {
    id: "5",
    date: "01/15/2026",
    status: "Complete",
    description: "Payroll Deduction",
    planYear: "01/01/2026 - 12/31/2026",
    amount: "$75.76",
  },
  {
    id: "6",
    date: "01/10/2026",
    status: "Paid",
    description: "Pearl Vision",
    planYear: "01/01/2026 - 12/31/2026",
    amount: "-$215.00",
    amountIsNegative: true,
  },
  {
    id: "7",
    date: "01/01/2026",
    status: "Complete",
    description: "Payroll Deduction",
    planYear: "01/01/2026 - 12/31/2026",
    amount: "$75.76",
  },
  {
    id: "8",
    date: "01/01/2026",
    status: "Complete",
    description: "Participant Election",
    planYear: "01/01/2026 - 12/31/2026",
    amount: "$2,500.00",
  },
  {
    id: "9",
    date: "12/17/2025",
    status: "Complete",
    description: "SMILE Dental",
    planYear: "01/01/2025 - 12/31/2025",
    amount: "-$67.25",
    amountIsNegative: true,
  },
  {
    id: "10",
    date: "12/10/2025",
    status: "Complete",
    description: "SMILE Dental",
    planYear: "01/01/2025 - 12/31/2025",
    amount: "-$1,027.55",
    amountIsNegative: true,
  },
];
