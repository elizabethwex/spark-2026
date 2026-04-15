/**
 * Reads bank accounts saved from My Profile → Bank Accounts.
 * Key and fallback display must stay aligned with `DEFAULT_BANK_ACCOUNTS` / `loadBankAccountsFromStorage` in `MyProfile.tsx`.
 */
export const WEX_PROFILE_BANK_ACCOUNTS_KEY = "wex_profile_bank_accounts";

type RawBank = {
  accountNickname?: string;
  bankName?: string;
  accountType?: string;
  accountNumber?: string;
};

export function migrateLegacyEllaBankLabel(label: string | undefined): string | undefined {
  if (label === undefined) return undefined;
  const t = label.trim();
  if (t === "Ella's Bank" || t === "Ella\u2019s Bank") return "Wells Fargo Bank";
  return label;
}

/** Shown in Reimbursement Methods modal when session is empty (matches default seeded account). */
const FALLBACK_DIRECT_DEPOSIT_DISPLAY = {
  bankName: "Wells Fargo Bank",
  accountLine: "•••• 5423 Checking",
} as const;

function bankDisplayFromRaw(raw: RawBank): { bankName: string; accountLine: string } {
  const accountType = raw.accountType === "saving" ? "saving" : "checking";
  const nickname = (migrateLegacyEllaBankLabel(raw.accountNickname) ?? "").trim();
  const bank = (migrateLegacyEllaBankLabel(raw.bankName) ?? "").trim();
  const displayTitle =
    nickname ||
    bank ||
    `${accountType.charAt(0).toUpperCase() + accountType.slice(1)} Account`;
  const digits = String(raw.accountNumber ?? "").replace(/\D/g, "");
  const last4 = digits.length >= 4 ? digits.slice(-4) : digits || "—";
  const typeWord = accountType === "checking" ? "Checking" : "Saving";
  return { bankName: displayTitle, accountLine: `•••• ${last4} ${typeWord}` };
}

/** First saved account, or fallback matching the default seeded bank account. */
export function getDirectDepositModalBankDisplayFromSession(): {
  bankName: string;
  accountLine: string;
} {
  if (typeof window === "undefined") {
    return { bankName: FALLBACK_DIRECT_DEPOSIT_DISPLAY.bankName, accountLine: FALLBACK_DIRECT_DEPOSIT_DISPLAY.accountLine };
  }
  try {
    const stored = sessionStorage.getItem(WEX_PROFILE_BANK_ACCOUNTS_KEY);
    if (!stored) {
      return { bankName: FALLBACK_DIRECT_DEPOSIT_DISPLAY.bankName, accountLine: FALLBACK_DIRECT_DEPOSIT_DISPLAY.accountLine };
    }
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return { bankName: FALLBACK_DIRECT_DEPOSIT_DISPLAY.bankName, accountLine: FALLBACK_DIRECT_DEPOSIT_DISPLAY.accountLine };
    }
    return bankDisplayFromRaw(parsed[0] as RawBank);
  } catch {
    return { bankName: FALLBACK_DIRECT_DEPOSIT_DISPLAY.bankName, accountLine: FALLBACK_DIRECT_DEPOSIT_DISPLAY.accountLine };
  }
}
