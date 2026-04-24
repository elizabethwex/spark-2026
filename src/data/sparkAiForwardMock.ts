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

export type SparkAccountQuickAction = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Opens Assist IQ modal instead of navigating */
  assistModal?: "upload-claim-documents";
};

export const sparkAccountQuickActions: SparkAccountQuickAction[] = [
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

/** LPFSA figures aligned with `/lpfsa-account` (Account Overview). */
export const sparkLpfsaSummary = {
  balance: "$2,925.00",
  planRange: "Jan 1, 2026 - Dec 31, 2026",
  daysToSpend: 28,
  spendByTag: null,
  eligibleLabel: "Vision & Dental",
  contributionPctUsed: 8.6,
  contributionLimit: "$2,925",
  rolloverAmount: "$0.00",
  useItOrLoseIt: "$2,925.00",
  finalFilingDate: "Mar 31, 2027",
};

export const sparkLpfsaPrimarySummary = {
  ...sparkLpfsaSummary,
};

/** Healthcare FSA — aligned with `/fsa-account` (Account Overview). */
export const sparkFsaSummary = {
  balance: "$2,225.00",
  planRange: "Jan 1, 2026 – Dec 31, 2026",
  daysToSpend: 28,
  spendByTag: null,
  eligibleLabel: "Health FSA",
  eligibleDesc: "Medical, Dental, Vision, RX, OTC meds.",
  contributionPctUsed: 11,
  contributionLimit: "$2,500",
  rolloverAmount: "$0.00",
  useItOrLoseIt: "$2,225.00",
  finalFilingDate: "Mar 31, 2027",
};

export const sparkFsaPrimarySummary = {
  ...sparkFsaSummary,
};

/** DCFSA — aligned with `/dependent-care-fsa` (Account Overview; use-it-or-lose-it = plan year balance). */
export const sparkDcfsaSummary = {
  balance: "$0.00",
  planRange: "Jan 1, 2026 – Dec 31, 2026",
  daysToSpend: 28,
  spendByTag: null,
  eligibleLabel: "Using DCFSA funds",
  eligibleDesc: "Daycare, Preschool, Day Camps, Adult Care.",
  contributionPctUsed: 50,
  contributionLimit: "$5,000",
  useItOrLoseIt: "$1,153.86",
  finalFilingDate: "Mar 31, 2027",
};

export const sparkDcfsaPrimarySummary = {
  ...sparkDcfsaSummary,
};

export type { SparkActivityRow, SparkActivityStatus } from "./sparkRecentActivity";
export { getSparkRecentActivity } from "./sparkRecentActivity";
