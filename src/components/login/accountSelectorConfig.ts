import { MATCHED_ACCOUNT_ROWS } from "@/components/login/accountLinkingShared"

/** Session key so `/select-profile` and the login wizard share linked-account rows for the prototype. */
export const LINKED_ACCOUNT_IDS_SESSION_KEY = "spark_linked_account_selector_ids"

export type AccountGroup = {
  employerName: string
  accounts: { id: string; label: string; icon: "building" | "landmark" }[]
}

export const ACCOUNT_GROUPS: AccountGroup[] = [
  {
    employerName: "Dunder Mifflin Paper Co.",
    accounts: [
      { id: "dm-reimb", label: "Reimbursement Account(s)", icon: "building" },
      { id: "dm-mbe", label: "My Benefit Express", icon: "building" },
    ],
  },
  {
    employerName: "ACME Company",
    accounts: [{ id: "acme-hsa", label: "Health Savings Account", icon: "landmark" }],
  },
]

/** Prototype: only Reimbursement Account(s) may continue; other selections keep Continue disabled. */
export const ACCOUNT_SELECTION_ALLOWED_ID = "dm-reimb"

export function buildAccountGroupsForDisplay(linkedAccountIds: string[]): AccountGroup[] {
  if (linkedAccountIds.length === 0) return ACCOUNT_GROUPS
  const groups = ACCOUNT_GROUPS.map((g) => ({
    ...g,
    accounts: [...g.accounts],
  }))
  const dmIdx = groups.findIndex((g) => g.employerName === "Dunder Mifflin Paper Co.")
  if (dmIdx === -1) return groups
  for (const linkId of linkedAccountIds) {
    const row = MATCHED_ACCOUNT_ROWS.find((r) => r.id === linkId)
    if (!row) continue
    const selectorId = `linked-${linkId}`
    if (groups[dmIdx].accounts.some((a) => a.id === selectorId)) continue
    groups[dmIdx].accounts.push({
      id: selectorId,
      label: row.productLabel,
      icon: "building",
    })
  }
  return groups
}
