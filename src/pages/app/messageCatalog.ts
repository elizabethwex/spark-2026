import type { AppVariant } from "@/context/AppVariantContext";

/**
 * Message types, category tags, and "Attention Needed" flags follow the product source:
 * **Mapping Sheet — Bucketing / Categorization** (Money Activity, Account & Security, Tax & Statements).
 * Each row maps `Message` title → category tag + whether it belongs in the Attention Needed bucket.
 */
export type MessageTag = "account-security" | "money-activity" | "tax-statements";

export interface CatalogEntry {
  title: string;
  /** Urgent / requires user attention per spreadsheet */
  attentionNeeded: boolean;
  tag: MessageTag;
  /** Optional copy for mobile prototype (e.g. FSA-focused preview body) */
  previewBody?: string;
  /** When set, overrides default PDF badge in the Messages prototype */
  pdfAttached?: boolean;
}

/** Body copy for catalog rows that include an attachment (app + desktop message center). */
export const MESSAGE_BODY_WITH_ATTACHMENT = "Please see attachment.";

/** Max rows that show the Attention Needed stripe in FSA/HSA prototype inboxes (story stays readable). */
export const MAX_PROTOTYPE_ATTENTION_STRIPES = 4;

/** 💰 Money Activity */
const MONEY: CatalogEntry[] = [
  { title: "HSA Advice of Deposit", attentionNeeded: false, tag: "money-activity" },
  { title: "HSA Payment Issued Notification", attentionNeeded: false, tag: "money-activity" },
  { title: "HSA Excess Contribution Notification", attentionNeeded: true, tag: "money-activity" },
  {
    title: "FSA Final Filing Date and Remaining Balance Notification",
    attentionNeeded: true,
    tag: "money-activity",
  },
  { title: "Hold Claim Requiring Attestation Notification", attentionNeeded: true, tag: "money-activity" },
  { title: "Recurring Claim Coverage Attestation", attentionNeeded: true, tag: "money-activity" },
  { title: "Recurring Claim Coverage Attestation Alert", attentionNeeded: true, tag: "money-activity" },
  { title: "HRA Contribution Notification", attentionNeeded: false, tag: "money-activity" },
  { title: "Smart Commute Order Confirmation", attentionNeeded: false, tag: "money-activity" },
  { title: "Smart Commute Order Not Processed", attentionNeeded: true, tag: "money-activity" },
  { title: "Smart Commute Order Recurrence Schedule", attentionNeeded: false, tag: "money-activity" },
  {
    title: "Smart Commute Order Recurrence Schedule Expiration",
    attentionNeeded: true,
    tag: "money-activity",
  },
  { title: "Smart Commute Order Price Change", attentionNeeded: false, tag: "money-activity" },
  { title: "Repayment Processed", attentionNeeded: false, tag: "money-activity" },
  { title: "Cancel Repayment", attentionNeeded: false, tag: "money-activity" },
  { title: "Denial Letter", attentionNeeded: true, tag: "money-activity" },
  { title: "Denial Letter With Repayment", attentionNeeded: true, tag: "money-activity" },
  { title: "Medicare Advantage Denial Letter", attentionNeeded: true, tag: "money-activity" },
  { title: "Claim Confirmation", attentionNeeded: false, tag: "money-activity" },
  { title: "Claim Applied to Repayment", attentionNeeded: false, tag: "money-activity" },
  { title: "Claim Applied to Repayment Alert", attentionNeeded: true, tag: "money-activity" },
  { title: "Claim to Repayment", attentionNeeded: false, tag: "money-activity" },
  { title: "Receipt Reminder", attentionNeeded: true, tag: "money-activity" },
  { title: "Receipt Needed for Debit Card Transaction", attentionNeeded: true, tag: "money-activity" },
  { title: "Request for More Information (RMI)", attentionNeeded: true, tag: "money-activity" },
  { title: "Advice of Deposit (for Claim Reimbursement)", attentionNeeded: false, tag: "money-activity" },
  { title: "Payment Issued (Payment Notification)", attentionNeeded: false, tag: "money-activity" },
  { title: "Recurring Claim Confirmation", attentionNeeded: false, tag: "money-activity" },
  { title: "Deductible Met Notification", attentionNeeded: false, tag: "money-activity" },
  { title: "HSA Excess Distribution Notification", attentionNeeded: true, tag: "money-activity" },
  { title: "HSA Contribution Notification", attentionNeeded: false, tag: "money-activity" },
  { title: "HSA Cash Balance Warning", attentionNeeded: true, tag: "money-activity" },
  { title: "HSA Contribution Maximum Warning", attentionNeeded: true, tag: "money-activity" },
  { title: "HSA Withdrawal Warning/Notification", attentionNeeded: false, tag: "money-activity" },
  { title: "HSA Consumer Move Notification", attentionNeeded: false, tag: "money-activity" },
  { title: "HSA Recurring Contribution Created", attentionNeeded: false, tag: "money-activity" },
  { title: "HSA Recurring Contribution Updated", attentionNeeded: false, tag: "money-activity" },
  { title: "HSA Recurring Contribution Cancelled", attentionNeeded: true, tag: "money-activity" },
  { title: "Eligible for Investment Account", attentionNeeded: false, tag: "money-activity" },
  { title: "Expense Notification", attentionNeeded: false, tag: "money-activity" },
  { title: "Enhanced First Letter", attentionNeeded: true, tag: "money-activity" },
  { title: "Enhanced Second Letter", attentionNeeded: true, tag: "money-activity" },
  { title: "Enhanced Overdue Letter", attentionNeeded: true, tag: "money-activity" },
  { title: "Enhanced Ineligible Letter", attentionNeeded: true, tag: "money-activity" },
  { title: "Enhanced RMI Letter", attentionNeeded: true, tag: "money-activity" },
  { title: "Hold Claim Attestation Required Alert", attentionNeeded: true, tag: "money-activity" },
  { title: "Push Notification", attentionNeeded: false, tag: "money-activity" },
];

/** 🔒 Account & Security */
const ACCOUNT: CatalogEntry[] = [
  { title: "Password Successfully Changed", attentionNeeded: true, tag: "account-security" },
  { title: "HSA Account Closure Notification", attentionNeeded: true, tag: "account-security" },
  { title: "Debit Card Suspend Notification", attentionNeeded: true, tag: "account-security" },
  { title: "Debit Card Purse Suspend Notification", attentionNeeded: true, tag: "account-security" },
  { title: "Account Locked", attentionNeeded: true, tag: "account-security" },
  { title: "Red Flags Notification", attentionNeeded: true, tag: "account-security" },
  { title: "Missing Custodial Agreements Acceptance", attentionNeeded: true, tag: "account-security" },
  { title: "Missing Identity Verification Documentation", attentionNeeded: true, tag: "account-security" },
  { title: "Enrollment Reminder", attentionNeeded: true, tag: "account-security" },
  { title: "Debit Card Purchase Notification", attentionNeeded: false, tag: "account-security" },
  { title: "Debit Card Added to Mobile Wallet Notification", attentionNeeded: false, tag: "account-security" },
  { title: "Card BIN Change Notification", attentionNeeded: false, tag: "account-security" },
  { title: "Consumer Move Debit Card Notification", attentionNeeded: false, tag: "account-security" },
  { title: "Debit Card Unsuspend Notification", attentionNeeded: false, tag: "account-security" },
  { title: "Debit Card Purse Unsuspend Notification", attentionNeeded: false, tag: "account-security" },
  { title: "Debit Card Mailed Notification", attentionNeeded: false, tag: "account-security" },
  { title: "Enrollment Confirmation", attentionNeeded: false, tag: "account-security" },
  { title: "Enrollment Confirmation Open-Ended Plan Year", attentionNeeded: false, tag: "account-security" },
  { title: "Bank Account Activation (Checking Pre-Note)", attentionNeeded: false, tag: "account-security" },
  { title: "Plan Change Letter", attentionNeeded: false, tag: "account-security" },
  { title: "Text Alert", attentionNeeded: false, tag: "account-security" },
];

/** 🗂️ Tax & Statements */
const TAX: CatalogEntry[] = [
  { title: "HSA Tax Documents", attentionNeeded: false, tag: "tax-statements" },
  { title: "HSA Account Summary", attentionNeeded: false, tag: "tax-statements" },
  { title: "Notional Account Statement", attentionNeeded: false, tag: "tax-statements" },
  { title: "Activity Account Statement Report", attentionNeeded: false, tag: "tax-statements" },
];

export const MESSAGE_CATALOG: CatalogEntry[] = [...MONEY, ...ACCOUNT, ...TAX];

/**
 * Whether a message subject should show as "Attention Needed" (desktop / table UI), per the mapping sheet.
 * Uses exact title match against {@link MESSAGE_CATALOG} (case-insensitive fallback).
 */
export function isAttentionNeededForMessageSubject(subject: string): boolean {
  const t = subject.trim();
  const entry = MESSAGE_CATALOG.find(
    (e) => e.title === t || e.title.toLowerCase() === t.toLowerCase()
  );
  return entry?.attentionNeeded ?? false;
}

/**
 * 20 inbox rows — one cohesive Health FSA participant story (top ≈ newest / most urgent).
 *
 * Arc (read downward): run-out deadline → claim friction (receipts → RMI → denial → reminder) →
 * other holds & card/OEP issues → repayment alert → then “how things got paid” (claim → payment →
 * payroll deposit) → repayment resolution → card use → activity statement; last row archived in UI.
 *
 * Top of inbox: only some rows use “Attention Needed” so the list isn’t all red for real-user demos.
 * Rows 11–20: mostly routine; last = archived.
 */
const FSA_PROTOTYPE_INBOX: CatalogEntry[] = [
  /* --- 1–10: mix of urgent stripes + routine-looking rows (attention spread out, not stacked) --- */
  {
    title: "FSA Final Filing Date and Remaining Balance Notification",
    attentionNeeded: true,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "Your plan’s run-out period ends soon. Submit any remaining 2024 claims and use leftover dependent-care FSA funds before the deadline in your plan documents.",
  },
  {
    title: "Plan Change Letter",
    attentionNeeded: false,
    pdfAttached: true,
    tag: "account-security",
    previewBody:
      "Your employer updated FSA eligible expenses and carryover rules effective next plan year. Review the summary attached.",
  },
  {
    title: "Request for More Information (RMI)",
    attentionNeeded: false,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "Your daycare claim is on hold. Reply with the provider’s tax ID or a completed dependent care statement so we can finish review.",
  },
  {
    title: "Denial Letter",
    attentionNeeded: true,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "This expense isn’t eligible under your Health FSA plan rules. See the denial reason and your appeal options in the attached letter.",
  },
  {
    title: "Notional Account Statement",
    attentionNeeded: false,
    pdfAttached: true,
    tag: "tax-statements",
    previewBody:
      "Notional balance snapshot for employer reporting. Personal use is informational only.",
  },
  {
    title: "Hold Claim Requiring Attestation Notification",
    attentionNeeded: true,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "Confirm that this recurring therapy charge is still eligible under your plan so we can release payment.",
  },
  {
    title: "Recurring Claim Coverage Attestation",
    attentionNeeded: false,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "Annual attestation is due for your recurring dependent care expenses. Confirm amounts and provider information.",
  },
  {
    title: "Debit Card Suspend Notification",
    attentionNeeded: false,
    pdfAttached: false,
    tag: "account-security",
    previewBody:
      "Your FSA card was temporarily suspended after multiple declined receipt requests. Upload documents to restore card use.",
  },
  {
    title: "Enrollment Reminder",
    attentionNeeded: false,
    pdfAttached: false,
    tag: "account-security",
    previewBody:
      "Open enrollment ends Friday. Confirm your Health FSA election so you don’t miss pretax savings for the year ahead.",
  },
  {
    title: "Claim Applied to Repayment Alert",
    attentionNeeded: true,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "This claim was applied to an outstanding overpayment balance. Review the breakdown and contact us if you have questions.",
  },
  /* --- 11–20: claims paid, funding, repayment closure --- */
  {
    title: "Claim Confirmation",
    attentionNeeded: false,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "We received your claim for vision expenses. You can track status under Claims — most reimbursements post within a few business days.",
  },
  {
    title: "Payment Issued (Payment Notification)",
    attentionNeeded: false,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "$142.18 was sent to your linked bank account for your recent Health FSA reimbursement.",
  },
  {
    title: "Advice of Deposit (for Claim Reimbursement)",
    attentionNeeded: false,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "Your employer notified us of a payroll contribution to your Health FSA. Funds are available per your plan’s schedule.",
  },
  {
    title: "Activity Account Statement Report",
    attentionNeeded: false,
    pdfAttached: true,
    tag: "tax-statements",
    previewBody:
      "Detailed transaction listing for your Health FSA for the statement period, including card and manual claims.",
  },
  {
    title: "Recurring Claim Confirmation",
    attentionNeeded: false,
    pdfAttached: false,
    tag: "money-activity",
    previewBody:
      "Your recurring orthodontia installment was processed for this plan year. Next auto-pay date is listed in your claim details.",
  },
  {
    title: "Repayment Processed",
    attentionNeeded: false,
    pdfAttached: false,
    tag: "money-activity",
    previewBody:
      "We received your repayment for a prior ineligible reimbursement. Your FSA balance has been updated.",
  },
  {
    title: "Claim to Repayment",
    attentionNeeded: false,
    pdfAttached: false,
    tag: "money-activity",
    previewBody:
      "Summary of how your latest claim was applied to your repayment arrangement.",
  },
  {
    title: "Claim Applied to Repayment",
    attentionNeeded: false,
    pdfAttached: false,
    tag: "money-activity",
    previewBody:
      "Your approved claim was offset by a small prior balance. Net payment details are inside.",
  },
  {
    title: "Debit Card Mailed Notification",
    attentionNeeded: false,
    pdfAttached: false,
    tag: "account-security",
    previewBody:
      "Your new FSA debit card should arrive within 7–10 business days. Activate it before first use.",
  },
  /* --- 20: archived in UI — older housekeeping --- */
  {
    title: "Quarterly FSA substantiation summary",
    attentionNeeded: false,
    pdfAttached: false,
    tag: "tax-statements",
    previewBody:
      "Items still needing receipts or documentation before the next quarterly deadline.",
  },
];

/**
 * 20 inbox rows — HSA / HDHP participant story (variants 1 and 3).
 * Same row shape as FSA list; Attention Needed capped like {@link FSA_PROTOTYPE_INBOX}.
 */
const HSA_PROTOTYPE_INBOX: CatalogEntry[] = [
  {
    title: "HSA Contribution Maximum Warning",
    attentionNeeded: true,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "You’re approaching the IRS annual contribution limit. Review payroll deductions and one-time contributions before year-end.",
  },
  {
    title: "Plan Change Letter",
    attentionNeeded: false,
    pdfAttached: true,
    tag: "account-security",
    previewBody:
      "Your employer updated HDHP eligibility and HSA contribution rules for the next plan year. Review the summary attached.",
  },
  {
    title: "Request for More Information (RMI)",
    attentionNeeded: false,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "Your HSA reimbursement is on hold. Reply with an itemized receipt or explanation of benefits so we can finish review.",
  },
  {
    title: "Denial Letter",
    attentionNeeded: true,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "This expense isn’t eligible for HSA reimbursement under current plan rules. See the denial reason and your appeal options in the attached letter.",
  },
  {
    title: "Notional Account Statement",
    attentionNeeded: false,
    pdfAttached: true,
    tag: "tax-statements",
    previewBody:
      "Notional balance snapshot for employer reporting. Personal use is informational only.",
  },
  {
    title: "Hold Claim Requiring Attestation Notification",
    attentionNeeded: true,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "Confirm that this recurring physical therapy charge is still an eligible medical expense so we can release payment from your HSA.",
  },
  {
    title: "Recurring Claim Coverage Attestation",
    attentionNeeded: false,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "Annual attestation is due for your recurring eligible expenses paid from your HSA. Confirm amounts and provider information.",
  },
  {
    title: "Debit Card Suspend Notification",
    attentionNeeded: false,
    pdfAttached: false,
    tag: "account-security",
    previewBody:
      "Your HSA debit card was temporarily suspended after multiple declined receipt requests. Upload documents to restore card use.",
  },
  {
    title: "Enrollment Reminder",
    attentionNeeded: false,
    pdfAttached: false,
    tag: "account-security",
    previewBody:
      "Open enrollment ends Friday. Confirm your HDHP election and HSA contribution amount so you don’t miss pretax savings.",
  },
  {
    title: "Claim Applied to Repayment Alert",
    attentionNeeded: true,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "This claim was applied to an outstanding overpayment balance on your HSA. Review the breakdown and contact us if you have questions.",
  },
  {
    title: "Claim Confirmation",
    attentionNeeded: false,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "We received your claim for vision expenses. You can track status under Claims — most reimbursements post within a few business days.",
  },
  {
    title: "Payment Issued (Payment Notification)",
    attentionNeeded: false,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "$142.18 was sent to your linked bank account for your recent HSA reimbursement.",
  },
  {
    title: "Advice of Deposit (for Claim Reimbursement)",
    attentionNeeded: false,
    pdfAttached: true,
    tag: "money-activity",
    previewBody:
      "Your employer notified us of a payroll contribution to your HSA. Funds are available per your plan’s schedule.",
  },
  {
    title: "Activity Account Statement Report",
    attentionNeeded: false,
    pdfAttached: true,
    tag: "tax-statements",
    previewBody:
      "Detailed transaction listing for your HSA for the statement period, including card and manual claims.",
  },
  {
    title: "Recurring Claim Confirmation",
    attentionNeeded: false,
    pdfAttached: false,
    tag: "money-activity",
    previewBody:
      "Your recurring orthodontia installment was processed for this plan year. Next auto-pay date is listed in your claim details.",
  },
  {
    title: "Repayment Processed",
    attentionNeeded: false,
    pdfAttached: false,
    tag: "money-activity",
    previewBody:
      "We received your repayment for a prior ineligible reimbursement. Your HSA balance has been updated.",
  },
  {
    title: "Claim to Repayment",
    attentionNeeded: false,
    pdfAttached: false,
    tag: "money-activity",
    previewBody:
      "Summary of how your latest claim was applied to your repayment arrangement.",
  },
  {
    title: "Claim Applied to Repayment",
    attentionNeeded: false,
    pdfAttached: false,
    tag: "money-activity",
    previewBody:
      "Your approved claim was offset by a small prior balance. Net payment details are inside.",
  },
  {
    title: "Debit Card Mailed Notification",
    attentionNeeded: false,
    pdfAttached: false,
    tag: "account-security",
    previewBody:
      "Your new HSA debit card should arrive within 7–10 business days. Activate it before first use.",
  },
  {
    title: "HSA Tax Documents",
    attentionNeeded: false,
    pdfAttached: false,
    tag: "tax-statements",
    previewBody:
      "Year-end tax documents and contribution summaries will post here when available.",
  },
];

/** FSA-style when variant 2; HSA-style for variants 1 (HSA + LPFSA) and 3 (HSA only). */
export function getPrototypeInboxEntries(variant: AppVariant): CatalogEntry[] {
  if (variant === 2) return FSA_PROTOTYPE_INBOX;
  return HSA_PROTOTYPE_INBOX;
}
