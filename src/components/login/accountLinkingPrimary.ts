export type PrimaryOptionId = "pennysmith" | "p.smith"

export const PASSWORD_MASKED_BY_ID: Record<PrimaryOptionId, string> = {
  "pennysmith": "PS****23!",
  "p.smith": "PS****91!",
}

export function getPrimaryCredentialsDisplay(
  selected: PrimaryOptionId,
  sessionUsername: string
): { username: string; passwordMasked: string } {
  const trimmed = sessionUsername.trim()
  return {
    username: selected === "pennysmith" ? trimmed || "pennysmith" : "p.smith",
    passwordMasked: PASSWORD_MASKED_BY_ID[selected],
  }
}
