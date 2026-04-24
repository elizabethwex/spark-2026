import React, { useEffect, useState } from "react"
import {
  Badge,
  Button,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@wexinc-healthbenefits/ben-ui-kit"
import { cn } from "@/lib/utils"
import {
  getWhatHappensNextSteps,
  isDeniedStatus,
  isDocumentationNeededStatus,
  isHoldStatus,
  isNotSubmittedStatus,
  isRepaymentDueStatus,
  isSubmittedStatus,
  isDocumentationReviewStatus,
  type WhatHappensNextStep,
} from "@/components/claims/claimTimeline"
import {
  expenseRowStatusBadgeTone,
  expenseStatusBadgeClass,
  type ExpenseRow,
} from "@/components/claims/expenseTypes"
import { LETTERS, type LetterItem } from "@/components/claims/letterData"
import { DOCUMENTS, type DocumentItem } from "@/components/documents/documentData"
import { FilePreviewModal } from "@/components/documents/FilePreviewModal"
import {
  AlertTriangle,
  Check,
  Clock,
  CreditCard,
  FileEdit,
  FileText,
  List,
  Mail,
  Paperclip,
  Upload,
  X,
} from "lucide-react"

export interface ClaimExpenseDetailSheetProps {
  open: boolean
  onOpenChange: (_open: boolean) => void
  row: ExpenseRow | null
  /** `hsa` / `fsa` reuse this sheet for account transaction rows (hides Letters; account-specific Details). */
  variant?: "claim" | "hsa" | "fsa"
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function recipientFullName(initials: string): string {
  switch (initials.toUpperCase()) {
    case "BS": return "Ben Smith"
    case "JS": return "James Smith"
    default: return initials
  }
}

// ---------------------------------------------------------------------------
// Inline toast
// ---------------------------------------------------------------------------

type ToastVariant = "red" | "amber"

type InlineToastConfig = {
  variant: ToastVariant
  headline: string
  subtext: string
  tag?: string
  body: string
}

function getInlineToast(
  row: ExpenseRow,
  stepDate?: string,
  sheetVariant: "claim" | "hsa" | "fsa" = "claim"
): InlineToastConfig | null {
  const label = row.status.label
  const date = stepDate ?? row.dateOfService

  if (isDocumentationNeededStatus(label)) {
    const isAccountVariant = sheetVariant === "hsa" || sheetVariant === "fsa"
    return {
      variant: isAccountVariant ? "amber" : "red",
      headline: "Documentation Needed",
      subtext: `Requested ${date}`,
      tag: isAccountVariant ? undefined : "28 Days Remaining",
      body: "Document is missing Date of Service. Please upload new documentation that includes all required info.",
    }
  }

  if (isRepaymentDueStatus(label)) {
    return {
      variant: "red",
      headline: "Repayment Due",
      subtext: `Requested ${date}`,
      tag: "14 Days Remaining",
      body: `Goods or services deemed ineligible under your plan rules. Please repay the claim amount of ${row.amount}.`,
    }
  }

  if (isHoldStatus(label)) {
    return {
      variant: "amber",
      headline: "Claim On Hold",
      subtext: `Placed on hold ${date}`,
      body: row.holdReason ?? "Your claim is on hold pending additional review.",
    }
  }

  if (isDeniedStatus(label)) {
    if (sheetVariant === "fsa") {
      return {
        variant: "amber",
        headline: "Not approved",
        subtext: `Denied on ${date}`,
        body: row.denialReason ?? "This transaction was not approved for reimbursement under your plan.",
      }
    }
    return {
      variant: "amber",
      headline: "Claim Denied",
      subtext: `Denied on ${date}`,
      body: row.denialReason ?? "Expense is not eligible under your plan.",
    }
  }

  return null
}

/** Returns the step id whose date should appear in the inline toast for a given status. */
function toastStepId(statusLabel: string): string | null {
  if (isDocumentationNeededStatus(statusLabel)) return "documentation-needed"
  if (isRepaymentDueStatus(statusLabel)) return "repayment-due"
  if (isHoldStatus(statusLabel)) return "hold"
  if (isDeniedStatus(statusLabel)) return "denied"
  return null
}

// ---------------------------------------------------------------------------
// Footer action type
// ---------------------------------------------------------------------------

type FooterActionType = "cancel-upload" | "cancel-only" | "edit-submit" | "repayment" | "none"

function getFooterActionType(statusLabel: string, origin?: "card" | "manual"): FooterActionType {
  if (isNotSubmittedStatus(statusLabel)) return "edit-submit"
  if (isDocumentationReviewStatus(statusLabel)) {
    // Card-originated claims cannot be canceled; upload is always removed for doc review
    return origin === "card" ? "none" : "cancel-only"
  }
  if (isSubmittedStatus(statusLabel) || isDocumentationNeededStatus(statusLabel)) {
    return "cancel-upload"
  }
  if (isRepaymentDueStatus(statusLabel)) return "repayment"
  return "none"
}

// ---------------------------------------------------------------------------
// Details tab row
// ---------------------------------------------------------------------------

function DetailRow({
  label,
  last,
  children,
}: {
  label: string
  last: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex w-full items-start justify-between gap-4 py-2.5",
        !last && "border-b border-border"
      )}
    >
      <span className="max-w-[45%] shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 flex-1 text-right font-medium text-foreground break-words">
        {children}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Timeline step date helpers
// ---------------------------------------------------------------------------

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

function offsetDate(dateStr: string, days: number): string {
  const match = dateStr.match(/([A-Za-z]+)\s+(\d+),?\s+(\d+)/)
  if (!match) return dateStr
  const monthIdx = MONTH_NAMES.findIndex(m => m.toLowerCase() === match[1].toLowerCase().slice(0, 3))
  if (monthIdx === -1) return dateStr
  const d = new Date(parseInt(match[3]), monthIdx, parseInt(match[2]) + days)
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

/** Parses display dates like "Jan 15, 2026" for ordering (local noon to avoid TZ drift). */
function parseSheetDateMs(dateStr: string): number {
  const match = dateStr.match(/([A-Za-z]+)\s+(\d+),?\s+(\d+)/)
  if (!match) return Number.NaN
  const monthIdx = MONTH_NAMES.findIndex(m => m.toLowerCase() === match[1].toLowerCase().slice(0, 3))
  if (monthIdx === -1) return Number.NaN
  const y = Number.parseInt(match[3], 10)
  const day = Number.parseInt(match[2], 10)
  return new Date(y, monthIdx, day, 12, 0, 0, 0).getTime()
}

/** Returns the earlier of two display dates (chronological min). */
function earlierSheetDate(a: string, b: string): string {
  const ta = parseSheetDateMs(a)
  const tb = parseSheetDateMs(b)
  if (Number.isNaN(ta) || Number.isNaN(tb)) return a
  return ta <= tb ? a : b
}

/**
 * Assigns a display date to every step. The first step anchors to
 * `baseDate`, each subsequent step adds `intervalDays`, and the final
 * step is pinned to `endDate` when provided (e.g. statusDate).
 * Earlier steps are clamped so they are never **after** a later step
 * (so "In process" is never dated after "Complete"); steps may share the same date.
 */
function assignStepDates(
  steps: WhatHappensNextStep[],
  baseDate: string,
  endDate?: string,
  intervalDays = 4,
): WhatHappensNextStep[] {
  const n = steps.length
  if (n === 0) return steps

  const raw = steps.map((_, i) => {
    const isLast = i === n - 1
    return isLast && endDate ? endDate : offsetDate(baseDate, i * intervalDays)
  })

  const dates = [...raw]
  for (let i = n - 2; i >= 0; i--) {
    dates[i] = earlierSheetDate(dates[i], dates[i + 1])
  }

  return steps.map((step, i) => ({ ...step, date: dates[i] }))
}

// ---------------------------------------------------------------------------
// Timeline step icon
// ---------------------------------------------------------------------------

function StepIcon({
  step,
  isComplete,
  isDenied = false,
  sheetVariant = "claim",
}: {
  step: WhatHappensNextStep
  isComplete: boolean
  isDenied?: boolean
  sheetVariant?: "claim" | "hsa" | "fsa"
}) {
  const cls = "h-3.5 w-3.5"
  if (!isComplete) {
    if (step.id === "documentation-needed" && (sheetVariant === "hsa" || sheetVariant === "fsa")) {
      return <List className={cn(cls, "text-amber-500")} aria-hidden />
    }
    return <FileEdit className={cn(cls, "text-muted-foreground")} aria-hidden />
  }
  if (isDenied) {
    return <X className={cn(cls, "text-amber-500")} aria-hidden />
  }
  switch (step.id) {
    case "card-payment":
      return <CreditCard className={cn(cls, "text-emerald-600")} aria-hidden />
    case "documentation-needed":
    case "reviewed":
    case "under-review":
    case "hsa-in-process":
      return <FileText className={cn(cls, "text-emerald-600")} aria-hidden />
    default:
      return <Check className={cn(cls, "text-emerald-600")} aria-hidden />
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ClaimExpenseDetailSheet({
  open,
  onOpenChange,
  row,
  variant = "claim",
}: ClaimExpenseDetailSheetProps) {
  const [tab, setTab] = useState("overview")
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null)

  useEffect(() => {
    setTab("overview")
    setPreviewDoc(null)
  }, [row?.id, open])

  if (!row) return null

  const categoryLabel = row.category.toUpperCase()
  const footerType =
    variant === "claim" ? getFooterActionType(row.status.label, row.origin) : "none"

  const timelineSteps = assignStepDates(
    getWhatHappensNextSteps(row.status.label, {
      origin: row.origin,
      holdReason: row.holdReason,
      denialReason: row.denialReason,
      // hsa/fsa sheetKind routes only handle account-specific statuses; fall back
      // to the general "claim" timeline for statuses like "Documentation Needed"
      // so the correct steps are generated regardless of which variant opened the sheet.
      sheetKind: (variant === "hsa" || variant === "fsa") && isDocumentationNeededStatus(row.status.label)
        ? "claim"
        : variant,
    }),
    row.dateOfService,
    row.statusDate,
  )

  const toastStepDate = timelineSteps.find(s => s.id === toastStepId(row.status.label))?.date
  const toast = getInlineToast(row, toastStepDate, variant)

  const claimDocs = row.documentIds
    .map((id) => DOCUMENTS.find((d) => d.id === id))
    .filter((d): d is DocumentItem => d !== undefined)

  const claimLetters = row.letterIds
    .map((id) => LETTERS.find((l) => l.id === id))
    .filter((l): l is LetterItem => l !== undefined)

  function letterAsDoc(letter: LetterItem): DocumentItem {
    return { ...letter, status: "attached", folderId: null }
  }

  return (
  <>
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-[420px]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>
            {variant === "claim" ? "Claim details" : "Transaction details"}
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-col gap-6 px-4 pb-6 pt-2 sm:px-[17.5px]">

            {/* Header — category, provider, amount, status, date */}
            <div className="flex flex-col gap-4 pr-8 pt-2">
              <div className="flex w-full items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-[12px] font-bold uppercase leading-4 tracking-[0.6px] text-[#515E6C]">
                    {categoryLabel}
                  </p>
                  <p className="text-lg font-semibold leading-6 tracking-[-0.25px] text-foreground">
                    {row.provider}
                  </p>
                </div>
                <p className="shrink-0 text-right text-xl font-semibold leading-8 tracking-[-0.34px] text-foreground tabular-nums">
                  {row.amount}
                </p>
              </div>
              {!toast && (
                <div className="flex w-full items-center justify-between gap-4">
                  <span
                    className={cn(
                      "inline-flex max-w-full items-center gap-1 truncate rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      expenseStatusBadgeClass(expenseRowStatusBadgeTone(row.status))
                    )}
                  >
                    {row.status.icon && (
                      <AlertTriangle className="h-3 w-3 shrink-0 text-current" aria-hidden />
                    )}
                    <span className="min-w-0 truncate">{row.status.label}</span>
                  </span>
                  <p className="shrink-0 text-right text-[10px] leading-4 tracking-[0.1px] text-muted-foreground">
                    {row.dateOfService}
                  </p>
                </div>
              )}
            </div>

            {/* Inline toast — Documentation Needed, Repayment Due, Hold, Denied */}
            {toast && (
              <div
                className={cn(
                  "rounded-md border p-2.5 shadow-sm",
                  toast.variant === "red"
                    ? "border-red-100 bg-red-50"
                    : "border-amber-100 bg-amber-50"
                )}
              >
                <div className="flex gap-2">
                  <AlertTriangle
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      toast.variant === "red" ? "text-[#C8102E]" : "text-[#735300]"
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0 space-y-2">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        toast.variant === "red" ? "text-[#C8102E]" : "text-[#735300]"
                      )}
                    >
                      {toast.headline}
                    </p>
                    <p className="text-xs text-muted-foreground">{toast.subtext}</p>
                    {toast.tag && (
                      <Badge
                        intent={toast.variant === "red" ? "destructive" : "warning"}
                        size="sm"
                        pill
                        className={toast.variant === "red"
                          ? "uppercase bg-[#FEE2E2] text-[#C8102E] border-[#C8102E]/20"
                          : "uppercase bg-[#FFF1BF] text-[#735300] border-[#735300]/20"}
                      >
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 shrink-0 text-current" aria-hidden />
                          {toast.tag}
                        </span>
                      </Badge>
                    )}
                    <div
                      className={cn(
                        "h-px w-full",
                        toast.variant === "red" ? "bg-[#C8102E]/20" : "bg-[#735300]/20"
                      )}
                      aria-hidden
                    />
                    <p className="text-sm leading-relaxed text-foreground">{toast.body}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="h-auto w-full justify-start rounded-none border-b border-border bg-transparent p-0">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Details
                </TabsTrigger>
                {variant === "claim" ? (
                  <TabsTrigger
                    value="letters"
                    className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Letters
                  </TabsTrigger>
                ) : null}
              </TabsList>

              <TabsContent value="overview" className="mt-4 space-y-6">
                {/* What Happens Next timeline */}
                <section className="space-y-4">
                  <h3 className="text-base font-medium leading-6 tracking-[-0.18px] text-foreground">
                    What Happens Next
                  </h3>
                  <ol className="flex flex-col">
                    {timelineSteps.map((step, index) => {
                      const isLast = index === timelineSteps.length - 1
                      const isComplete = step.phase === "complete"
                      const isDeniedStep = step.id === "denied"
                      const isActionRequired = !isComplete && step.id === "documentation-needed"
                        && (variant === "hsa" || variant === "fsa")

                      return (
                        <li key={step.id} className="flex gap-2">
                          {/* Step indicator */}
                          <div className="flex flex-col items-center">
                            <span
                              className={cn(
                                "flex shrink-0 items-center justify-center rounded-full border bg-background",
                                isDeniedStep || isActionRequired
                                  ? "h-6 w-6 border-amber-500"
                                  : isComplete
                                    ? "h-6 w-6 border-emerald-600"
                                    : "h-6 w-6 border-muted-foreground/40"
                              )}
                            >
                              <StepIcon step={step} isComplete={isComplete} isDenied={isDeniedStep} sheetVariant={variant} />
                            </span>
                            {!isLast && (
                              <span
                                className={cn(
                                  "w-0.5 flex-1 bg-border",
                                  isComplete ? "my-1" : "mt-1"
                                )}
                              />
                            )}
                          </div>

                          {/* Step content */}
                          <div
                            className={cn(
                              "min-w-0 flex-1",
                              isComplete ? "pb-6 pt-0.5" : "space-y-1 pb-6"
                            )}
                          >
                            {isDeniedStep ? (
                              /* Denied step — no Now tag */
                              <div className="space-y-1">
                                <div className="flex w-full flex-wrap items-center justify-between gap-2">
                                  <p className="text-sm font-medium text-foreground">
                                    {step.title}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {step.date}
                                  </p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {step.description}
                                </p>
                              </div>
                            ) : isComplete ? (
                              /* Completed step — title + date */
                              <div className="flex w-full flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                  {step.title}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  {step.date}
                                </p>
                              </div>
                            ) : (
                              /* Current step — full detail */
                              <>
                                <div className="flex w-full flex-wrap items-center justify-between gap-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-sm font-medium text-foreground">
                                      {step.title}
                                    </p>
                                    {variant !== "hsa" && variant !== "fsa" && (
                                      <Badge
                                        intent="info"
                                        size="sm"
                                        pill
                                        className="text-[11px] bg-[#DBEAFE] text-[#1E40AF] border-transparent"
                                      >
                                        Now
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-muted-foreground">
                                    {step.date}
                                  </p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {step.description}
                                </p>
                              </>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ol>
                </section>

                {(variant === "claim" || variant === "fsa") ? (
                  <>
                    {/* Documents — same pattern as claims; FSA rows often have no attachments */}
                    <section className="space-y-3">
                      <h3 className="text-base font-medium leading-6 text-foreground">
                        Documents
                      </h3>
                      {claimDocs.length > 0 ? (
                        <ul className="space-y-2">
                          {claimDocs.map((doc) => (
                            <li key={doc.id}>
                              <button
                                type="button"
                                onClick={() => setPreviewDoc(doc)}
                                className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-2 py-2 transition-colors hover:border-border/80 hover:bg-muted/60 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                  <span className="truncate text-sm font-medium text-foreground">
                                    {doc.title}
                                  </span>
                                  <span className="text-sm text-muted-foreground">—</span>
                                  <span className="text-sm text-muted-foreground">3mb</span>
                                </div>
                                <span className="shrink-0 text-[10px] text-muted-foreground">
                                  {doc.date}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No documents uploaded.</p>
                      )}
                    </section>
                  </>
                ) : null}
              </TabsContent>

              <TabsContent value="details" className="mt-4 text-sm">
                {variant === "hsa" && row.hsaMeta ? (
                  <div className="space-y-6">
                    <section className="space-y-2">
                      <h3 className="text-base font-semibold leading-6 text-foreground">
                        Transaction Details
                      </h3>
                      <DetailRow label="Request Date" last={false}>
                        {row.hsaMeta.tableDate}
                      </DetailRow>
                      <DetailRow label="Process Date" last={false}>
                        {row.status.label === "Processed" ? row.hsaMeta.tableDate : "—"}
                      </DetailRow>
                      <DetailRow label="Category" last>
                        {row.categoryType ?? `${row.provider} - ${row.category}`}
                      </DetailRow>
                    </section>
                    <section className="space-y-2">
                      <h3 className="text-base font-semibold leading-6 text-foreground">
                        Payment Details
                      </h3>
                      <DetailRow label="Payment Number" last={false}>
                        {row.hsaMeta.paymentNumber}
                      </DetailRow>
                      <DetailRow label="Method" last>
                        EFT
                      </DetailRow>
                    </section>
                    <section className="space-y-2">
                      <h3 className="text-base font-semibold leading-6 text-foreground">
                        Tax Details
                      </h3>
                      <DetailRow label="Tax Year" last={false}>
                        {row.hsaMeta.taxYear}
                      </DetailRow>
                      <DetailRow label="Contrib. Amount in Tax Year" last={false}>
                        {row.amount}
                      </DetailRow>
                      <DetailRow label="Contrib. Applied from Future Year" last={false}>
                        $0.00
                      </DetailRow>
                      <DetailRow label="Contrib. Rollover Amount During Tax Year" last>
                        $0.00
                      </DetailRow>
                    </section>
                  </div>
                ) : variant === "fsa" && row.fsaMeta ? (
                  <div className="space-y-6">
                    <section className="space-y-2">
                      <h3 className="text-base font-semibold leading-6 text-foreground">
                        Transaction Details
                      </h3>
                      <DetailRow label="Request Date" last={false}>
                        {row.fsaMeta.tableDate}
                      </DetailRow>
                      <DetailRow label="Process Date" last={false}>
                        {row.fsaMeta.tableDate}
                      </DetailRow>
                      <DetailRow label="Plan Year" last={false}>
                        {row.fsaMeta.planYear}
                      </DetailRow>
                      <DetailRow label="Description" last>
                        {row.provider}
                      </DetailRow>
                    </section>
                    <section className="space-y-2">
                      <h3 className="text-base font-semibold leading-6 text-foreground">
                        Payment Details
                      </h3>
                      <DetailRow label="Reference Number" last={false}>
                        {row.fsaMeta.paymentNumber}
                      </DetailRow>
                      <DetailRow label="Method" last>
                        {row.status.label === "Paid" ? "EFT" : "—"}
                      </DetailRow>
                    </section>
                  </div>
                ) : (
                  <>
                    {/* Pay from */}
                    <DetailRow label="Pay from" last={false}>
                      {row.account}
                    </DetailRow>

                    {/* Pay to — debit card format matching My Account */}
                    <DetailRow label="Pay to" last={false}>
                      {row.payTo ? (
                        <span className="inline-flex items-center gap-1.5">
                          <CreditCard className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                          •••• {row.payTo.last4}
                        </span>
                      ) : "—"}
                    </DetailRow>

                    {/* Remaining fields */}
                    <DetailRow label="Recipient" last={false}>
                      {recipientFullName(row.recipient)}
                    </DetailRow>
                    <DetailRow label="Date of Service" last={false}>
                      {row.dateOfService}
                    </DetailRow>
                    <DetailRow label="Category & Type" last={false}>
                      {row.categoryType ? `${row.category} — ${row.categoryType}` : row.category}
                    </DetailRow>
                    <DetailRow label="Provider" last={false}>
                      {row.provider}
                    </DetailRow>
                    <DetailRow label="Amount" last>
                      {row.amount}
                    </DetailRow>
                  </>
                )}
              </TabsContent>

              {variant === "claim" ? (
                <TabsContent value="letters" className="mt-4">
                  {claimLetters.length > 0 ? (
                    <ul className="space-y-2">
                      {claimLetters.map((letter) => (
                        <li key={letter.id}>
                          <button
                            type="button"
                            onClick={() => setPreviewDoc(letterAsDoc(letter))}
                            className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-2 py-2 transition-colors hover:border-border/80 hover:bg-muted/60 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              <span className="truncate text-sm font-medium text-foreground">
                                {letter.title}
                              </span>
                            </div>
                            <span className="shrink-0 text-[10px] text-muted-foreground">
                              {letter.date}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No letters are available for this claim yet.
                    </p>
                  )}
                </TabsContent>
              ) : null}
            </Tabs>
          </div>
        </ScrollArea>

        {/* Footer actions — conditional per status */}
        {footerType === "cancel-upload" && (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border bg-background px-4 py-3.5 sm:px-[17.5px]">
            <Button
              type="button"
              intent="destructive"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel Claim
            </Button>
            <Button
              type="button"
              intent="primary"
              variant="solid"
              size="sm"
              className="gap-1.5 btn-primary-theme"
            >
              <Upload className="h-3.5 w-3.5 text-current" aria-hidden />
              Upload Documentation
            </Button>
          </div>
        )}

        {footerType === "cancel-only" && (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border bg-background px-4 py-3.5 sm:px-[17.5px]">
            <Button
              type="button"
              intent="destructive"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel Claim
            </Button>
          </div>
        )}

        {footerType === "edit-submit" && (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border bg-background px-4 py-3.5 sm:px-[17.5px]">
            <Button
              type="button"
              intent="destructive"
              variant="outline"
              size="sm"
            >
              Delete Draft
            </Button>
            <Button
              type="button"
              intent="primary"
              variant="solid"
              size="sm"
              className="btn-primary-theme"
            >
              Continue Claim
            </Button>
          </div>
        )}

        {footerType === "repayment" && (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border bg-background px-4 py-3.5 sm:px-[17.5px]">
            <Button
              type="button"
              intent="primary"
              variant="solid"
              size="sm"
              className="btn-primary-theme"
            >
              Repay
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>

    <FilePreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
  </>
  )
}
