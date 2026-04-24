/**
 * Single source of truth for Previous Plan Year card + “View more details” modal
 * (Consumer Experience prototypes).
 */
export type FsaPreviousPlanYearViewModel = {
  /** Label before the plan-period control (e.g. “Plan Period:”, “Plan Year:”). */
  planPeriodLabel: string;
  /** Same string shown in the plan-period select for the default year. */
  planYearRangeDisplay: string;
  /** First column under Total Used: “Elected” vs “Annual Election”. */
  electedColumnLabel: "Elected" | "Annual Election";

  totalUsedFormatted: string;
  /** Whole number 0–100 for the Total Used badge. */
  usedPercent: number;

  electedAmountFormatted: string;
  unusedForfeitedFormatted: string;
  rolledOverFormatted: string;
  deniedClaimsFormatted: string;

  lostAmountFormatted: string;
  deniedClaimCount: number;

  /** Eligible / annual election amount in cents (for modal count-up). */
  eligibleCents: number;
  usedAmountFormatted: string;
  estimatedPayrollDeductions: string;
  effectiveDate: string;
  annualElectionFormatted: string;
  contributionsToDateFormatted: string;
  claimsTotalSubmitted: string;
  claimsTotalPaid: string;
  claimsTotalPending: string;
  claimsTotalDenied: string;
  availableBalancePeriodStart: string;
  availableBalancePeriodEnd: string;
  rolloverInfoMessage: string;
};

const SHARED_PERIOD = {
  planYearRangeDisplay: "Jan 1, 2025 – Dec 31, 2025",
  effectiveDate: "Jan 1, 2025",
} as const;

/** Health FSA + LPFSA previous plan year (prototype). */
export const healthLpfsaPreviousPlanYearViewModel: FsaPreviousPlanYearViewModel = {
  planPeriodLabel: "Plan Period:",
  ...SHARED_PERIOD,
  electedColumnLabel: "Elected",
  totalUsedFormatted: "$2,500.00",
  usedPercent: 100,
  electedAmountFormatted: "$2,500.00",
  unusedForfeitedFormatted: "$0.00",
  rolledOverFormatted: "$0.00",
  deniedClaimsFormatted: "$0.00",
  lostAmountFormatted: "$0.00",
  deniedClaimCount: 0,
  eligibleCents: 250_000,
  usedAmountFormatted: "$2,500.00",
  estimatedPayrollDeductions: "$75.76",
  annualElectionFormatted: "$2,500.00",
  contributionsToDateFormatted: "$2,500.00",
  claimsTotalSubmitted: "$2,500.00",
  claimsTotalPaid: "$2,500.00",
  claimsTotalPending: "$0.00",
  claimsTotalDenied: "$0.00",
  availableBalancePeriodStart: "$2,500.00",
  availableBalancePeriodEnd: "$0.00",
  rolloverInfoMessage: "Nothing was rolled over and nothing expired.",
};

/** Dependent Care FSA previous plan year (prototype). */
export const dcfsaPreviousPlanYearViewModel: FsaPreviousPlanYearViewModel = {
  planPeriodLabel: "Plan Year:",
  ...SHARED_PERIOD,
  electedColumnLabel: "Annual Election",
  totalUsedFormatted: "$5,000.00",
  usedPercent: 100,
  electedAmountFormatted: "$5,000.00",
  unusedForfeitedFormatted: "$0.00",
  rolledOverFormatted: "$0.00",
  deniedClaimsFormatted: "$0.00",
  lostAmountFormatted: "$0.00",
  deniedClaimCount: 0,
  eligibleCents: 500_000,
  usedAmountFormatted: "$5,000.00",
  estimatedPayrollDeductions: "$151.52",
  annualElectionFormatted: "$5,000.00",
  contributionsToDateFormatted: "$5,000.00",
  claimsTotalSubmitted: "$5,000.00",
  claimsTotalPaid: "$5,000.00",
  claimsTotalPending: "$0.00",
  claimsTotalDenied: "$0.00",
  availableBalancePeriodStart: "$5,000.00",
  availableBalancePeriodEnd: "$0.00",
  rolloverInfoMessage: "Nothing was rolled over and nothing expired.",
};
