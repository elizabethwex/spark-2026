/**
 * Shared styles for selectable cards in the login / account-linking flows.
 */
export const loginSelectableUnselected =
  "border border-[#E3E7F4] bg-card hover:bg-accent/50"

export const loginSelectableSelected = "border border-[#3958C3] bg-[#EEF2FF]"

/** Matched-account rows use a lighter hover than the account selector. */
export const loginSelectableUnselectedIntro =
  "border border-[#E3E7F4] bg-card hover:bg-accent/40"

/** Email / SMS method rows (no persistent selected state). */
export const loginMfaMethodCardClass =
  "border border-[#E3E7F4] rounded-lg hover:border-[#3958C3] hover:bg-[#EEF2FF] transition-colors cursor-pointer"
