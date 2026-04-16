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
}

/** Returns a human-readable attachment label, or null when there are no documents. */
export function attachmentLabel(count: number): string | null {
  if (count === 0) return null
  return count === 1 ? "1 Document" : `${count} Documents`
}

export function expenseStatusBadgeClass(tone: ExpenseRow["status"]["tone"]): string {
  switch (tone) {
    case "blue":
      return "bg-blue-100 text-blue-700 border-transparent"
    case "green":
      return "bg-green-100 text-green-700 border-transparent"
    case "amber":
      return "bg-amber-100 text-amber-700 border-transparent"
    case "red":
      return "bg-red-100 text-red-700 border-transparent"
    default:
      return "bg-gray-100 text-gray-600 border-transparent"
  }
}
