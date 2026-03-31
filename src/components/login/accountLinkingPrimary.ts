export type PrimaryOptionId = "ux-nicole" | "n.jackson"

export const PASSWORD_MASKED_BY_ID: Record<PrimaryOptionId, string> = {
  "ux-nicole": "UX****23!",
  "n.jackson": "NJ****91!",
}

export function getPrimaryCredentialsDisplay(
  selected: PrimaryOptionId,
  sessionUsername: string
): { username: string; passwordMasked: string } {
  const trimmed = sessionUsername.trim()
  return {
    username: selected === "ux-nicole" ? trimmed || "ux-nicole" : "n.jackson",
    passwordMasked: PASSWORD_MASKED_BY_ID[selected],
  }
}
