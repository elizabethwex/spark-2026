import React, { useState } from "react"
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
import { expenseStatusBadgeClass, type ExpenseRow } from "@/components/claims/expenseTypes"
import {
  AlertTriangle,
  Check,
  Clock,
  CreditCard,
  FileEdit,
  FileText,
  Paperclip,
  Upload,
} from "lucide-react"

export interface ClaimExpenseDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  row: ExpenseRow | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function recipientFullName(initials: string): string {
  switch (initials.toUpperCase()) {
    case "ES": return "Emily Smith"
    case "JS": return "Julia Smith"
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

function getInlineToast(row: ExpenseRow): InlineToastConfig | null {
  const label = row.status.label

  if (isDocumentationNeededStatus(label)) {
    return {
      variant: "red",
      headline: "Documentation Needed",
      subtext: `Requested ${row.dateOfService}`,
      tag: "28 Days Remaining",
      body: "Document is missing Date of Service. Please upload new documentation that includes all required info.",
    }
  }

  if (isRepaymentDueStatus(label)) {
    return {
      variant: "red",
      headline: "Repayment Due",
      subtext: `Requested ${row.dateOfService}`,
      tag: "14 Days Remaining",
      body: `Your previously approved claim has been reviewed and deemed ineligible under your plan rules. Please repay the claim amount of ${row.amount}.`,
    }
  }

  if (isHoldStatus(label)) {
    return {
      variant: "amber",
      headline: "Claim On Hold",
      subtext: `Placed on hold ${row.dateOfService}`,
      body: row.holdReason ?? "Your claim is on hold pending additional review.",
    }
  }

  if (isDeniedStatus(label)) {
    return {
      variant: "amber",
      headline: "Claim Denied",
      subtext: `Denied on ${row.dateOfService}`,
      tag: "30 Days to Appeal",
      body: row.denialReason ?? "Expense is not eligible under your plan.",
    }
  }

  return null
}

// ---------------------------------------------------------------------------
// Footer action type
// ---------------------------------------------------------------------------

type FooterActionType = "cancel-upload" | "edit-submit" | "repayment" | "none"

function getFooterActionType(statusLabel: string): FooterActionType {
  if (isNotSubmittedStatus(statusLabel)) return "edit-submit"
  if (
    isSubmittedStatus(statusLabel) ||
    isDocumentationNeededStatus(statusLabel) ||
    isDocumentationReviewStatus(statusLabel)
  ) {
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
        "flex gap-4 py-2.5",
        !last && "border-b border-border"
      )}
    >
      <span className="w-36 shrink-0 text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{children}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Timeline step icon
// ---------------------------------------------------------------------------

function StepIcon({ step, isComplete }: { step: WhatHappensNextStep; isComplete: boolean }) {
  const cls = "h-3.5 w-3.5"
  if (!isComplete) {
    return <FileEdit className={cn(cls, "text-muted-foreground")} aria-hidden />
  }
  switch (step.id) {
    case "card-payment":
      return <CreditCard className={cn(cls, "text-emerald-600")} aria-hidden />
    case "documentation-needed":
    case "reviewed":
    case "under-review":
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
}: ClaimExpenseDetailSheetProps) {
  const [tab, setTab] = useState("overview")

  if (!row) return null

  const categoryLabel = row.category.toUpperCase()
  const toast = getInlineToast(row)
  const footerType = getFooterActionType(row.status.label)
  const isDenied = isDeniedStatus(row.status.label)

  const timelineSteps = getWhatHappensNextSteps(row.status.label, {
    origin: row.origin,
    holdReason: row.holdReason,
    denialReason: row.denialReason,
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-[420px]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Claim details</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-col gap-6 px-4 pb-6 pt-2 sm:px-[17.5px]">

            {/* Header — category, provider, amount, status, date */}
            <div className="flex flex-col gap-4 pr-8 pt-2">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-[12px] font-bold uppercase leading-4 tracking-[0.6px] text-[#515E6C]">
                    {categoryLabel}
                  </p>
                  <p className="text-lg font-semibold leading-6 tracking-[-0.25px] text-foreground">
                    {row.provider}
                  </p>
                </div>
                <p className="shrink-0 text-xl font-semibold leading-8 tracking-[-0.34px] text-foreground">
                  {row.amount}
                </p>
              </div>
              {!toast && (
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={cn(
                      "inline-flex max-w-full items-center gap-1 truncate rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      expenseStatusBadgeClass(row.status.tone)
                    )}
                  >
                    {row.status.icon && (
                      <AlertTriangle className="h-3 w-3 shrink-0 text-current" aria-hidden />
                    )}
                    <span className="min-w-0 truncate">{row.status.label}</span>
                  </span>
                  <p className="shrink-0 text-[10px] leading-4 tracking-[0.1px] text-muted-foreground">
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
                    ? "border-red-200 bg-red-50/95"
                    : "border-amber-200 bg-amber-50/95"
                )}
              >
                <div className="flex gap-2">
                  <AlertTriangle
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      toast.variant === "red" ? "text-red-600" : "text-amber-600"
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0 space-y-2">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        toast.variant === "red" ? "text-red-800" : "text-amber-800"
                      )}
                    >
                      {toast.headline}
                    </p>
                    <p className="text-xs text-foreground">{toast.subtext}</p>
                    {toast.tag && (
                      <Badge
                        intent={toast.variant === "red" ? "destructive" : "warning"}
                        size="sm"
                        pill
                        className="uppercase"
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
                        toast.variant === "red" ? "bg-red-200/80" : "bg-amber-200/80"
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
                <TabsTrigger
                  value="letters"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Letters
                </TabsTrigger>
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
                      const isDeniedStep = isDenied && step.id === "denied"

                      return (
                        <li key={step.id} className="flex gap-2">
                          {/* Step indicator */}
                          <div className="flex flex-col items-center">
                            <span
                              className={cn(
                                "flex shrink-0 items-center justify-center rounded-full border bg-background",
                                isComplete
                                  ? "h-6 w-6 border-emerald-600"
                                  : "h-8 w-8 border-muted-foreground/40"
                              )}
                            >
                              <StepIcon step={step} isComplete={isComplete} />
                            </span>
                            {!isLast && (
                              <span
                                className={cn(
                                  "w-0.5 flex-1 bg-border",
                                  isComplete ? "my-1 min-h-[12px]" : "mt-1 min-h-[32px]"
                                )}
                              />
                            )}
                          </div>

                          {/* Step content */}
                          <div
                            className={cn(
                              "min-w-0 flex-1",
                              isComplete ? "pb-0 pt-0.5" : "space-y-1 pb-4"
                            )}
                          >
                            {isDeniedStep ? (
                              /* Denied step — inline Appeal button, no Now tag */
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="text-base font-medium text-foreground">
                                    {step.title}
                                  </p>
                                  <p className="text-[10px] text-muted-foreground">
                                    {row.dateOfService}
                                  </p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {step.description}
                                </p>
                                <Button
                                  type="button"
                                  intent="secondary"
                                  size="sm"
                                  className="w-fit"
                                >
                                  Appeal
                                </Button>
                              </div>
                            ) : isComplete ? (
                              /* Completed step — condensed: title only, no description or date */
                              <p className="text-sm font-medium text-muted-foreground">
                                {step.title}
                              </p>
                            ) : (
                              /* Current step — full detail */
                              <>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-base font-medium text-foreground">
                                      {step.title}
                                    </p>
                                    <Badge
                                      intent="success"
                                      size="sm"
                                      pill
                                      className="text-[11px]"
                                    >
                                      Now
                                    </Badge>
                                  </div>
                                  <p className="text-[10px] text-muted-foreground">
                                    {row.dateOfService}
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

                {/* Documents */}
                <section className="space-y-3">
                  <h3 className="text-base font-medium leading-6 text-foreground">
                    Documents
                  </h3>
                  {row.attachments ? (
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-2 py-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate text-sm font-medium text-foreground">
                          receipt_dec.jpg
                        </span>
                        <span className="text-sm text-muted-foreground">—</span>
                        <span className="text-sm text-muted-foreground">3mb</span>
                      </div>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {row.dateOfService}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No documents uploaded.</p>
                  )}
                </section>
              </TabsContent>

              <TabsContent value="details" className="mt-4 text-sm">
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
              </TabsContent>

              <TabsContent value="letters" className="mt-4">
                <p className="text-sm text-muted-foreground">
                  No letters are available for this claim yet.
                </p>
              </TabsContent>
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
              className="gap-1.5"
            >
              <Upload className="h-3.5 w-3.5 text-current" aria-hidden />
              Upload Documentation
            </Button>
          </div>
        )}

        {footerType === "edit-submit" && (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border bg-background px-4 py-3.5 sm:px-[17.5px]">
            <Button
              type="button"
              intent="primary"
              variant="outline"
              size="sm"
            >
              Edit
            </Button>
            <Button
              type="button"
              intent="primary"
              variant="solid"
              size="sm"
            >
              Submit Claim
            </Button>
          </div>
        )}

        {footerType === "repayment" && (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border bg-background px-4 py-3.5 sm:px-[17.5px]">
            <Button
              type="button"
              intent="primary"
              variant="outline"
              size="sm"
            >
              Appeal
            </Button>
            <Button
              type="button"
              intent="primary"
              variant="solid"
              size="sm"
            >
              Repay
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
