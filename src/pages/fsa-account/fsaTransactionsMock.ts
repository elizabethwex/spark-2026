export type FsaTransactionRow = {
  id: string;
  date: string;
  status: "Complete" | "Pending";
  account: string;
  description: string;
  category: string;
  amount: string;
  runningBalance: string;
  isPositive?: boolean;
};

/** Mock FSA transactions aligned with the Consumer Experience FSA account design. */
export const fsaTransactionsData: FsaTransactionRow[] = [
  {
    id: "1",
    date: "04/27/2026",
    status: "Complete",
    account: "FSA",
    description: "Prescription Medicine",
    category: "Pharmacy",
    amount: "$42.50",
    runningBalance: "$765.00",
    isPositive: true,
  },
  {
    id: "2",
    date: "04/25/2026",
    status: "Complete",
    account: "FSA",
    description: "OTC Medicine",
    category: "Pharmacy",
    amount: "$28.10",
    runningBalance: "$807.50",
    isPositive: true,
  },
  {
    id: "3",
    date: "04/20/2026",
    status: "Complete",
    account: "FSA",
    description: "Health Products",
    category: "Retail",
    amount: "$34.99",
    runningBalance: "$835.60",
    isPositive: true,
  },
  {
    id: "4",
    date: "04/18/2026",
    status: "Pending",
    account: "FSA",
    description: "Prescription Medicine",
    category: "Pharmacy",
    amount: "$19.50",
    runningBalance: "$870.59",
    isPositive: true,
  },
  {
    id: "5",
    date: "03/18/2026",
    status: "Complete",
    account: "FSA",
    description: "Primary Care Visit",
    category: "Medical",
    amount: "$30.00",
    runningBalance: "$890.09",
    isPositive: true,
  },
  {
    id: "6",
    date: "03/05/2026",
    status: "Complete",
    account: "FSA",
    description: "Dental Cleaning",
    category: "Dental",
    amount: "$125.00",
    runningBalance: "$920.09",
    isPositive: true,
  },
  {
    id: "7",
    date: "02/22/2026",
    status: "Complete",
    account: "FSA",
    description: "Vision Exam",
    category: "Vision",
    amount: "$75.00",
    runningBalance: "$1,045.09",
    isPositive: true,
  },
  {
    id: "8",
    date: "02/10/2026",
    status: "Complete",
    account: "FSA",
    description: "Lab Services",
    category: "Medical",
    amount: "$48.33",
    runningBalance: "$1,120.09",
    isPositive: true,
  },
  {
    id: "9",
    date: "01/28/2026",
    status: "Complete",
    account: "FSA",
    description: "Specialist Visit",
    category: "Medical",
    amount: "$200.00",
    runningBalance: "$1,168.42",
    isPositive: true,
  },
  {
    id: "10",
    date: "01/15/2026",
    status: "Complete",
    account: "FSA",
    description: "Urgent Care Copay",
    category: "Medical",
    amount: "$60.00",
    runningBalance: "$1,368.42",
    isPositive: true,
  },
];
