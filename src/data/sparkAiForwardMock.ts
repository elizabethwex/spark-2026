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
  planYear: "2025",
  remainingLimit: "$1,100.00",
};

export const sparkLpfsaSummary = {
  balance: "$850.00",
  planRange: "01/01/2025 – 12/31/2025",
  daysToSpend: 28,
  spendByTag: "Spend $350 by 12/31",
  eligibleLabel: "Vision & Dental",
};

export type SparkActivityStatus = "approved" | "needs_attention" | "completed";

export interface SparkActivityRow {
  merchant: string;
  meta: string;
  amount: string;
  status: SparkActivityStatus;
  statusLabel: string;
}

export const sparkRecentActivity: SparkActivityRow[] = [
  {
    merchant: "Walgreens",
    meta: "4/27/26 • LPFSA Account",
    amount: "$42.50",
    status: "approved",
    statusLabel: "APPROVED",
  },
  {
    merchant: "Dr. Miller DDS",
    meta: "4/27/26 • LPFSA Account",
    amount: "$340.00",
    status: "needs_attention",
    statusLabel: "NEEDS ATTENTION",
  },
  {
    merchant: "Vanguard Invest",
    meta: "Dec 14 • HSA Account",
    amount: "$500.00",
    status: "completed",
    statusLabel: "COMPLETED",
  },
];
