import type { LucideIcon } from "lucide-react";
import { CreditCard, DollarSign, Send, ShoppingBag } from "lucide-react";
import {
  HSA_2026_CONTRIBUTION_MOCK,
  hsa2026ContributionPctUsed,
} from "@/data/hsaSharedContributions";

/**
 * Copy and structure aligned with SPARK-2026 Figma (AI-forward homepage).
 */

export const SPARK_MEMBER_FIRST_NAME = "Penny";

export const sparkAccountQuickActions: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Lost or Stolen Card", href: "/my-profile?subPage=debit-card", icon: CreditCard },
  { label: "Send Payment", href: "/send-payment", icon: Send },
  { label: "HSA Store", href: "https://hsastore.com/", icon: ShoppingBag },
  { label: "Reimburse Myself", href: "/reimburse", icon: DollarSign },
];

const fmtUsd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const hsaC = HSA_2026_CONTRIBUTION_MOCK;

export const sparkHsaSummary = {
  totalValue: "$15,900.00",
  investedAssets: "$12,700.00",
  ytdReturnPct: "+12.5% YTD",
  cashBalance: "$3,200.00",
  contributionPctUsed: hsa2026ContributionPctUsed(),
  planYear: hsaC.planYear,
  remainingLimit: fmtUsd(hsaC.leftToContribute),
  irsLimitFormatted: fmtUsd(hsaC.contributionLimit),
};

export const sparkLpfsaSummary = {
  balance: "$1,000.00",
  planRange: "01/01/2026 – 12/31/2026",
  daysToSpend: 28,
  spendByTag: "spend by 12/31",
  eligibleLabel: "Vision & Dental",
  contributionPctUsed: 60,
  contributionLimit: "$2,500",
  rolloverAmount: "$500.00",
  useItOrLoseIt: "$500.00",
  finalFilingDate: "3/1/27",
};

export const sparkLpfsaPrimarySummary = {
  balance: "$2,425.00",
  planRange: "01/01/2026 – 12/31/2026",
  daysToSpend: 28,
  spendByTag: null,
  eligibleLabel: "Vision & Dental",
  contributionPctUsed: 11,
  contributionLimit: "$2,500",
  rolloverAmount: "$500.00",
  useItOrLoseIt: "$1,925.00",
  finalFilingDate: "3/1/27",
};

export const sparkFsaSummary = {
  balance: "$1,000.00",
  planRange: "01/01/2026 - 4/15/2026",
  daysToSpend: 28,
  spendByTag: "spend by 12/31",
  eligibleLabel: "Health FSA",
  eligibleDesc: "Medical, Dental, Vision, RX, OTC meds.",
  contributionPctUsed: 60,
  contributionLimit: "$2,500",
  rolloverAmount: "$500.00",
  useItOrLoseIt: "$500.00",
  finalFilingDate: "3/1/27",
};

export const sparkFsaPrimarySummary = {
  balance: "$2,425.00",
  planRange: "01/01/2026 - 4/15/2026",
  daysToSpend: 28,
  spendByTag: null,
  eligibleLabel: "Health FSA",
  eligibleDesc: "Medical, Dental, Vision, RX, OTC meds.",
  contributionPctUsed: 11,
  contributionLimit: "$2,500",
  rolloverAmount: "$500.00",
  useItOrLoseIt: "$1,925.00",
  finalFilingDate: "3/1/27",
};

export const sparkDcfsaSummary = {
  balance: "$300.00",
  planRange: "01/01/2025 - 12/31/2025",
  daysToSpend: 28,
  spendByTag: "spend by 12/31",
  eligibleLabel: "Using DCFSA funds",
  eligibleDesc: "Daycare, Preschool, Day Camps, Adult Care.",
  contributionPctUsed: 80,
  contributionLimit: "$1,500",
  useItOrLoseIt: "$300.00",
  finalFilingDate: "3/1/26",
};

export const sparkDcfsaPrimarySummary = {
  balance: "$620.00",
  planRange: "01/01/2025 - 12/31/2025",
  daysToSpend: 28,
  spendByTag: null,
  eligibleLabel: "Using DCFSA funds",
  eligibleDesc: "Daycare, Preschool, Day Camps, Adult Care.",
  contributionPctUsed: 41,
  contributionLimit: "$1,500",
  useItOrLoseIt: "$620.00",
  finalFilingDate: "3/1/26",
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
