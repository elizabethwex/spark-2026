export type ExpenseRow = {
  id: string
  dateOfService: string
  status: {
    label: string
    tone: "blue" | "green" | "amber" | "red" | "gray"
    icon?: boolean
  }
  account: string
  provider: string
  recipient: string
  category: string
  /** Descriptor shown alongside category in the Details tab, e.g. "Office Visit" */
  categoryType?: string
  /** IDs of documents from the shared DOCUMENTS store attached to this claim. */
  documentIds: string[]
  /** IDs of system-generated letters (denial notices, receipt requests, etc.) for this claim. */
  letterIds: string[]
  amount: string
  /** Payment method the reimbursement is sent to */
  payTo?: {
    cardholderName: string
    last4: string
  }
  /** Whether the claim originated from a card swipe or a manual submission */
  origin?: "card" | "manual"
  holdReason?: string
  denialReason?: string
  /** Date the current status was set — shown on the active timeline step. Distinct from dateOfService. */
  statusDate?: string
  /** When reusing {@link ClaimExpenseDetailSheet} for HSA transactions (`variant="hsa"`). */
  hsaMeta?: {
    tableDate: string
    taxYear: string
    paymentNumber: string
  }
  /** When reusing {@link ClaimExpenseDetailSheet} for FSA transactions (`variant="fsa"`). */
  fsaMeta?: {
    tableDate: string
    planYear: string
    paymentNumber: string
  }
}

/** Returns a human-readable attachment label, or null when there are no documents. */
export function attachmentLabel(count: number): string | null {
  if (count === 0) return null
  return count === 1 ? "1 Document" : `${count} Documents`
}

export function expenseStatusBadgeClass(tone: ExpenseRow["status"]["tone"]): string {
  switch (tone) {
    case "blue":
      return "bg-[#DBEAFE] text-[#1E40AF] border-transparent"
    case "green":
      return "bg-[#D0FAE5] text-[#006045] border-transparent"
    case "amber":
      return "bg-[#FFF1BF] text-[#735300] border-transparent"
    case "red":
      return "bg-[#FEE2E2] text-[#C8102E] border-transparent"
    default:
      return "bg-[#F1F3FB] text-[#444C72] border-transparent"
  }
}

export function expenseStatusBadgeIntent(
  tone: ExpenseRow["status"]["tone"]
): "info" | "success" | "warning" | "destructive" | "default" {
  switch (tone) {
    case "blue":
      return "info"
    case "green":
      return "success"
    case "amber":
      return "warning"
    case "red":
      return "destructive"
    default:
      return "default"
  }
}
