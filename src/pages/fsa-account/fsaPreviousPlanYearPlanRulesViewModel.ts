/**
 * Plan Rules shown in the Previous Plan Year “View Plan Rules” modal.
 * Mirrors each account’s Plan Rules card layout, with dates and status for the closed plan year.
 */
import {
  dcfsaPreviousPlanYearViewModel,
  healthLpfsaPreviousPlanYearViewModel,
} from "./fsaPreviousPlanYearViewModel";

export type FsaPreviousPlanYearPlanRulesVariant = "healthFsa" | "lpfsa" | "dcfsa";

export type FsaPreviousPlanYearPlanRulesViewModel = {
  variant: FsaPreviousPlanYearPlanRulesVariant;
  /** Matches Previous Plan Year select, e.g. Jan 1, 2025 – Dec 31, 2025 */
  planYearRangeDisplay: string;
  /** First row label (Current Status vs Enrollment Status). */
  statusRowLabel: string;
  statusRowTooltip: string;
  /** Second row: label differs on LPFSA card (“Effective Date”). */
  effectiveDateRowLabel: string;
  effectiveDateRowTooltip: string;
  effectiveDateValue: string;
  finalFilingDateTooltip: string;
  finalFilingDateValue: string;
  finalServiceDateTooltip: string;
  finalServiceDateValue: string;
  /** Section title: Debit Card Rules vs Card Rules */
  cardRulesTitle: string;
  /** Card Transactions vs Cards Transactions (LPFSA card typo preserved). */
  cardTransactionsLabel: string;
  cardTransactionsValue: string;
  maxPerTransactionLabel: string;
  maxPerTransactionValue: string;
  /** Long-form dates used in the claim intro (rows use MM/DD/YYYY). */
  claimNarrativeSubmitBy: string;
  claimNarrativeServiceEnd: string;
};

/** Plan year ended 12/31/2025; runout filing Mar 31, 2026; services through plan year end. */
const PREV_YEAR_RULES_SHARED = {
  effectiveDateValue: "10/15/2024",
  finalFilingDateValue: "03/31/2026",
  finalServiceDateValue: "12/31/2025",
  finalFilingDateTooltip:
    "Final Filing Date is the last day that you could submit a claim for reimbursement for this plan year.",
  finalServiceDateTooltip:
    "Final Service Date is the last day you could incur a service or purchase for reimbursement under this plan year.",
  cardTransactionsValue: "Allowed",
  maxPerTransactionLabel: "Maximum per Transaction",
  maxPerTransactionValue: "No maximum",
  claimNarrativeSubmitBy: "Mar 31, 2026",
  claimNarrativeServiceEnd: "Dec 31, 2025",
} as const;

export const healthFsaPreviousPlanYearPlanRulesViewModel: FsaPreviousPlanYearPlanRulesViewModel = {
  variant: "healthFsa",
  planYearRangeDisplay: healthLpfsaPreviousPlanYearViewModel.planYearRangeDisplay,
  statusRowLabel: "Current Status",
  statusRowTooltip: "Plan year status shows this coverage period is closed.",
  effectiveDateRowLabel: "Status Effective Date",
  effectiveDateRowTooltip: "Status Effective Date is the date your active employment status began with your employer.",
  cardRulesTitle: "Debit Card Rules",
  cardTransactionsLabel: "Card Transactions",
  ...PREV_YEAR_RULES_SHARED,
};

export const lpfsaPreviousPlanYearPlanRulesViewModel: FsaPreviousPlanYearPlanRulesViewModel = {
  variant: "lpfsa",
  planYearRangeDisplay: healthLpfsaPreviousPlanYearViewModel.planYearRangeDisplay,
  statusRowLabel: "Current Status",
  statusRowTooltip: "Plan year status shows this coverage period is closed.",
  effectiveDateRowLabel: "Effective Date",
  effectiveDateRowTooltip: "Effective Date is the date your active employment status began with your employer.",
  cardRulesTitle: "Debit Card Rules",
  cardTransactionsLabel: "Cards Transactions",
  ...PREV_YEAR_RULES_SHARED,
};

export const dcfsaPreviousPlanYearPlanRulesViewModel: FsaPreviousPlanYearPlanRulesViewModel = {
  variant: "dcfsa",
  planYearRangeDisplay: dcfsaPreviousPlanYearViewModel.planYearRangeDisplay,
  statusRowLabel: "Enrollment Status",
  statusRowTooltip: "Enrollment Status reflects participation in this Dependent Care FSA for the selected plan year.",
  effectiveDateRowLabel: "Status Effective Date",
  effectiveDateRowTooltip: "Status Effective Date is the date your active enrollment status began with your employer.",
  cardRulesTitle: "Card Rules",
  cardTransactionsLabel: "Card Transactions",
  ...PREV_YEAR_RULES_SHARED,
};
