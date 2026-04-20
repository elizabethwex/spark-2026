/**
 * "What Happens Next" timeline steps for the claim detail sheet.
 * Each status maps to a distinct sequence of steps.
 */

export type TimelineStepPhase = "complete" | "current"

export type WhatHappensNextStep = {
  id: string
  title: string
  description: string
  phase: TimelineStepPhase
  /** Display date shown beside this step in the timeline. */
  date?: string
}

// ---------------------------------------------------------------------------
// First-step helpers (Card Payment vs Claim Submitted variants)
// ---------------------------------------------------------------------------

function cardFirstStep(): WhatHappensNextStep {
  return {
    id: "card-payment",
    title: "Card Payment",
    description: "Payment was made via your WEX benefits card.",
    phase: "complete",
  }
}

function manualFirstStep(): WhatHappensNextStep {
  return {
    id: "claim-submitted",
    title: "Claim Submitted",
    description: "We received your claim.",
    phase: "complete",
  }
}

function firstStep(origin: "card" | "manual"): WhatHappensNextStep {
  return origin === "card" ? cardFirstStep() : manualFirstStep()
}

// ---------------------------------------------------------------------------
// Per-status timeline builders
// ---------------------------------------------------------------------------

function notSubmittedTimeline(): WhatHappensNextStep[] {
  return [
    {
      id: "draft-created",
      title: "Claim Draft Created",
      description: "Your draft has been saved. Submit when ready.",
      phase: "current",
    },
  ]
}

function submittedTimeline(origin: "card" | "manual"): WhatHappensNextStep[] {
  return [
    { ...firstStep(origin) },
    {
      id: "under-review",
      title: "Under Review",
      description: "Your claim is being reviewed.",
      phase: "current",
    },
  ]
}

function approvedTimeline(origin: "card" | "manual"): WhatHappensNextStep[] {
  return [
    { ...firstStep(origin) },
    {
      id: "reviewed",
      title: "Reviewed",
      description: "We checked the details.",
      phase: "complete",
    },
    {
      id: "approved",
      title: "Approved",
      description: "Your claim is preparing for payment processing.",
      phase: "current",
    },
  ]
}

function holdTimeline(origin: "card" | "manual", holdReason?: string): WhatHappensNextStep[] {
  return [
    { ...firstStep(origin) },
    {
      id: "under-review",
      title: "Under Review",
      description: "Your claim was being reviewed.",
      phase: "complete",
    },
    {
      id: "hold",
      title: "Hold",
      description: holdReason ?? "Your claim is on hold pending additional review.",
      phase: "current",
    },
  ]
}

function documentationNeededTimeline(origin: "card" | "manual"): WhatHappensNextStep[] {
  return [
    { ...firstStep(origin) },
    {
      id: "reviewed",
      title: "Reviewed",
      description: "We checked the details.",
      phase: "complete",
    },
    {
      id: "documentation-needed",
      title: "Documentation Needed",
      description: "We need additional documentation to complete your claim.",
      phase: "current",
    },
  ]
}

function documentationReviewTimeline(origin: "card" | "manual"): WhatHappensNextStep[] {
  return [
    { ...firstStep(origin) },
    {
      id: "documentation-needed",
      title: "Documentation Needed",
      description: "We requested additional documentation.",
      phase: "complete",
    },
    {
      id: "documentation-review",
      title: "Documentation Review",
      description: "We are reviewing your submitted documentation.",
      phase: "current",
    },
  ]
}

/** Final state — all steps complete, no Now tag. */
function deniedTimeline(origin: "card" | "manual", denialReason?: string): WhatHappensNextStep[] {
  return [
    { ...firstStep(origin) },
    {
      id: "reviewed",
      title: "Reviewed",
      description: "We checked the details.",
      phase: "complete",
    },
    {
      id: "documentation-needed",
      title: "Documentation Needed",
      description: "We requested additional documentation.",
      phase: "complete",
    },
    {
      id: "documentation-review",
      title: "Documentation Review",
      description: "Documentation was reviewed.",
      phase: "complete",
    },
    {
      id: "denied",
      title: "Denied",
      description: denialReason ?? "Expense is not eligible under your plan.",
      phase: "complete",
    },
  ]
}

/** Manual-only: card payments skip directly to Paid once approved. */
function paymentProcessingTimeline(): WhatHappensNextStep[] {
  return [
    {
      id: "claim-submitted",
      title: "Claim Submitted",
      description: "We received your claim.",
      phase: "complete",
    },
    {
      id: "reviewed",
      title: "Reviewed",
      description: "We checked the details.",
      phase: "complete",
    },
    {
      id: "approved",
      title: "Approved",
      description: "Your claim was approved.",
      phase: "complete",
    },
    {
      id: "payment-processing",
      title: "Payment Processing",
      description: "Your payment is being prepared.",
      phase: "current",
    },
  ]
}

/** Final state — all steps complete, no Now tag. */
function paidTimeline(origin: "card" | "manual"): WhatHappensNextStep[] {
  return [
    { ...firstStep(origin) },
    {
      id: "reviewed",
      title: "Reviewed",
      description: "We checked the details.",
      phase: "complete",
    },
    {
      id: "approved",
      title: "Approved",
      description: "Your claim was approved.",
      phase: "complete",
    },
    {
      id: "payment-processing",
      title: "Payment Processing",
      description: "Payment was prepared.",
      phase: "complete",
    },
    {
      id: "paid",
      title: "Paid",
      description: "Payment has been issued.",
      phase: "complete",
    },
  ]
}

function repaymentDueTimeline(denialReason?: string): WhatHappensNextStep[] {
  return [
    { ...cardFirstStep() },
    {
      id: "denied",
      title: "Denied",
      description: denialReason ?? "Goods or services deemed ineligible under your plan rules.",
      phase: "complete",
    },
    {
      id: "repayment-due",
      title: "Repayment Due",
      description: "A repayment is required.",
      phase: "current",
    },
  ]
}

// ---------------------------------------------------------------------------
// Status check helpers
// ---------------------------------------------------------------------------

export function isNotSubmittedStatus(s: string): boolean {
  return s.trim().toLowerCase() === "not submitted"
}

export function isSubmittedStatus(s: string): boolean {
  return s.trim().toLowerCase() === "submitted"
}

export function isApprovedStatus(s: string): boolean {
  return s.trim().toLowerCase() === "approved"
}

export function isHoldStatus(s: string): boolean {
  return s.trim().toLowerCase() === "hold"
}

export function isDocumentationNeededStatus(s: string): boolean {
  return s.trim().toLowerCase() === "documentation needed"
}

export function isDocumentationReviewStatus(s: string): boolean {
  return s.trim().toLowerCase() === "documentation review"
}

export function isDeniedStatus(s: string): boolean {
  return s.trim().toLowerCase() === "denied"
}

export function isPaymentProcessingStatus(s: string): boolean {
  return s.trim().toLowerCase() === "payment processing"
}

export function isPaidStatus(s: string): boolean {
  return s.trim().toLowerCase() === "paid"
}

export function isRepaymentDueStatus(s: string): boolean {
  return s.trim().toLowerCase() === "repayment due"
}

function fsaTransactionCompleteTimeline(): WhatHappensNextStep[] {
  return [
    {
      id: "fsa-request",
      title: "Request Date",
      description: "We received the request.",
      phase: "complete",
    },
    {
      id: "fsa-in-process",
      title: "In Process",
      description: "Finalizing details with your plan.",
      phase: "complete",
    },
    {
      id: "fsa-complete",
      title: "Complete",
      description: "Transaction completed.",
      phase: "complete",
    },
  ]
}

function fsaTransactionPaidTimeline(): WhatHappensNextStep[] {
  return [
    {
      id: "fsa-request",
      title: "Request Date",
      description: "We received the request.",
      phase: "complete",
    },
    {
      id: "fsa-processing",
      title: "Processing",
      description: "Your reimbursement is being prepared.",
      phase: "complete",
    },
    {
      id: "fsa-paid",
      title: "Paid",
      description: "Payment has been issued.",
      phase: "complete",
    },
  ]
}

function fsaTransactionDeniedTimeline(): WhatHappensNextStep[] {
  return [
    {
      id: "fsa-request",
      title: "Request Date",
      description: "We received the request.",
      phase: "complete",
    },
    {
      id: "denied",
      title: "Denied",
      description: "This transaction was not approved for reimbursement.",
      phase: "complete",
    },
  ]
}

// ---------------------------------------------------------------------------
// Main dispatcher
// ---------------------------------------------------------------------------

export type ClaimTimelineSheetKind = "claim" | "hsa" | "fsa"

export function getWhatHappensNextSteps(
  statusLabel: string,
  options: {
    origin?: "card" | "manual"
    holdReason?: string
    denialReason?: string
    /** When not `claim`, skips claim-status routing and uses account-transaction timelines. */
    sheetKind?: ClaimTimelineSheetKind
  } = {}
): WhatHappensNextStep[] {
  const { origin = "manual", holdReason, denialReason, sheetKind = "claim" } = options
  const normalized = statusLabel.trim().toLowerCase()

  if (sheetKind === "hsa") {
    if (normalized === "processed") return hsaTransactionProcessedTimeline()
    if (normalized === "pending") return hsaTransactionPendingTimeline()
    return [
      {
        id: "hsa-request",
        title: "Request Date",
        description: "We received the request.",
        phase: "complete",
      },
      {
        id: "hsa-in-process",
        title: "In Process",
        description: "Finalizing details with your bank.",
        phase: "current",
      },
    ]
  }

  if (sheetKind === "fsa") {
    if (normalized === "complete") return fsaTransactionCompleteTimeline()
    if (normalized === "paid") return fsaTransactionPaidTimeline()
    if (normalized === "denied") return fsaTransactionDeniedTimeline()
    return fsaTransactionCompleteTimeline()
  }

  if (isNotSubmittedStatus(statusLabel)) return notSubmittedTimeline()
  if (isSubmittedStatus(statusLabel)) return submittedTimeline(origin)
  if (isApprovedStatus(statusLabel)) return approvedTimeline(origin)
  if (isHoldStatus(statusLabel)) return holdTimeline(origin, holdReason)
  if (isDocumentationNeededStatus(statusLabel)) return documentationNeededTimeline(origin)
  if (isDocumentationReviewStatus(statusLabel)) return documentationReviewTimeline(origin)
  if (isDeniedStatus(statusLabel)) return deniedTimeline(origin, denialReason)
  if (isPaymentProcessingStatus(statusLabel)) return paymentProcessingTimeline()
  if (isPaidStatus(statusLabel)) return paidTimeline(origin)
  if (isRepaymentDueStatus(statusLabel)) return repaymentDueTimeline(denialReason)

  return [
    { id: "submitted", title: "Submitted", description: "We received your claim.", phase: "complete" },
    { id: "current", title: statusLabel, description: "Your claim is being processed.", phase: "current" },
  ]
}

function hsaTransactionProcessedTimeline(): WhatHappensNextStep[] {
  return [
    {
      id: "hsa-request",
      title: "Request Date",
      description: "We received the request.",
      phase: "complete",
    },
    {
      id: "hsa-in-process",
      title: "In Process",
      description: "Finalizing details with your bank.",
      phase: "complete",
    },
    {
      id: "hsa-processed",
      title: "Processed",
      description: "Transaction completed.",
      phase: "complete",
    },
  ]
}

function hsaTransactionPendingTimeline(): WhatHappensNextStep[] {
  return [
    {
      id: "hsa-request",
      title: "Request Date",
      description: "We received the request.",
      phase: "complete",
    },
    {
      id: "hsa-in-process",
      title: "In Process",
      description: "Finalizing details with your bank.",
      phase: "current",
    },
  ]
}
