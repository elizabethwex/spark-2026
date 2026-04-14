/**
 * Default "Penny bank" prototype account — merged into in-memory bank lists on load when absent.
 * Never persisted to sessionStorage (filtered out on save). Users may remove it for the current
 * page session; it returns after a full page refresh.
 */
export const SESSION_SEED_PENNY_BANK_ID = "seed-penny-bank" as const;

export const SESSION_SEED_PENNY_BANK_FIELDS = {
  id: SESSION_SEED_PENNY_BANK_ID,
  routingNumber: "12345679",
  accountNumber: "444555666",
  confirmAccountNumber: "444555666",
  accountNickname: "Penny bank",
  accountType: "checking" as const,
};

export function withoutSessionSeedBankForStorage<T extends { id: string }>(accounts: T[]): T[] {
  return accounts.filter((b) => b.id !== SESSION_SEED_PENNY_BANK_ID);
}

export function mergeSessionSeedPennyBankIfMissing<T extends { id: string }>(
  seedRow: T,
  stored: T[]
): T[] {
  const hasSeed = stored.some((b) => b.id === SESSION_SEED_PENNY_BANK_ID);
  return hasSeed ? stored : [seedRow, ...stored];
}
