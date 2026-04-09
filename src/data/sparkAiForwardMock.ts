import type { LucideIcon } from "lucide-react";
import { CreditCard, DollarSign, Send, ShoppingBag } from "lucide-react";

/**
 * Copy and structure aligned with SPARK-2026 Figma (AI-forward homepage).
 */

export const SPARK_MEMBER_FIRST_NAME = "Penny";

export const sparkAccountQuickActions: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Lost or Stolen Card", href: "/my-profile?subPage=debit-card", icon: CreditCard },
  { label: "Send Payment", href: "/send-payment", icon: Send },
  { label: "HSA Store", href: "/resources", icon: ShoppingBag },
  { label: "Reimburse Myself", href: "/reimburse", icon: DollarSign },
];

export const sparkHsaSummary = {
  totalValue: "$15,900.00",
  investedAssets: "$12,700.00",
  ytdReturnPct: "+12.5%",
  cashBalance: "$3,200.00",
  contributionPctUsed: 74,
  planYear: "2026",
  remainingLimit: "$1,100.00",
};

export const sparkLpfsaSummary = {
  balance: "$850.00",
  planRange: "01/01/2026 – 12/31/2026",
  daysToSpend: 28,
  spendByTag: "Spend $350 by 12/31",
  eligibleLabel: "Vision & Dental",
};

export const sparkFsaSummary = {
  balance: "$850.00",
  planRange: "01/01/2026 - 4/15/2026",
  daysToSpend: 28,
  spendByTag: "Spend $350 by 12/31",
  eligibleLabel: "Health FSA",
  eligibleDesc: "Medical, Dental, Vision, RX, OTC meds.",
};

export const sparkDcfsaSummary = {
  balance: "$620.00",
  planRange: "01/01/2025 - 12/31/2025",
  daysToSpend: 28,
  spendByTag: "Spend $120 by 12/31",
  eligibleLabel: "Using DCFSA funds",
  eligibleDesc: "Daycare, Preschool, Day Camps, Adult Care.",
};

export type SparkActivityStatus = "approved" | "needs_attention" | "completed";

export interface SparkActivityRow {
  merchant: string;
  meta: string;
  amount: string;
  status: SparkActivityStatus;
  statusLabel: string;
  timeline?: {
    label: string;
    date?: string;
    completed: boolean;
    active: boolean;
  }[];
}

export const sparkRecentActivity: SparkActivityRow[] = [
  {
    merchant: "Walgreens",
    meta: "4/27/26 • LPFSA Account",
    amount: "$42.50",
    status: "approved",
    statusLabel: "APPROVED",
    timeline: [
      { label: "Submitted", date: "Apr 27", completed: true, active: false },
      { label: "Processing", date: "Apr 28", completed: true, active: false },
      { label: "Complete", date: "Apr 29", completed: true, active: true },
    ],
  },
  {
    merchant: "Bigtown Dentistry",
    meta: "4/27/26 • LPFSA Account",
    amount: "$210.00",
    status: "needs_attention",
    statusLabel: "NEEDS ATTENTION",
    timeline: [
      { label: "Submitted", date: "Apr 27", completed: true, active: false },
      { label: "Action Required", date: "Apr 28", completed: false, active: true },
      { label: "Complete", completed: false, active: false },
    ],
  },
  {
    merchant: "Vanguard Invest",
    meta: "12/14/25 • HSA Account",
    amount: "$500.00",
    status: "completed",
    statusLabel: "COMPLETED",
    timeline: [
      { label: "Submitted", date: "Dec 14", completed: true, active: false },
      { label: "Processing", date: "Dec 15", completed: true, active: false },
      { label: "Complete", date: "Dec 16", completed: true, active: true },
    ],
  },
  {
    merchant: "Target",
    meta: "11/20/25 • HSA Account",
    amount: "$15.99",
    status: "completed",
    statusLabel: "COMPLETED",
    timeline: [
      { label: "Submitted", date: "Nov 20", completed: true, active: false },
      { label: "Processing", date: "Nov 21", completed: true, active: false },
      { label: "Complete", date: "Nov 22", completed: true, active: true },
    ],
  },
  {
    merchant: "Dr. Smith Vision",
    meta: "11/15/25 • LPFSA Account",
    amount: "$120.00",
    status: "completed",
    statusLabel: "COMPLETED",
    timeline: [
      { label: "Submitted", date: "Nov 15", completed: true, active: false },
      { label: "Processing", date: "Nov 16", completed: true, active: false },
      { label: "Complete", date: "Nov 17", completed: true, active: true },
    ],
  },
];
