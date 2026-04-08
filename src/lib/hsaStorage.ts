export type HsaStateV1 = {
  version: 1;
  isEligible: boolean | null;
  authorizeAccount: boolean;
  electionCents: number;
  acknowledgedRules: boolean;
};

const STORAGE_KEY = "enrollment.hsa.v1";

export function loadHsaState(): HsaStateV1 {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: 1, isEligible: null, authorizeAccount: false, electionCents: 0, acknowledgedRules: false };
    const parsed = JSON.parse(raw) as Partial<HsaStateV1>;
    if (parsed?.version !== 1) return { version: 1, isEligible: null, authorizeAccount: false, electionCents: 0, acknowledgedRules: false };
    
    const isEligible = parsed.isEligible === true ? true : parsed.isEligible === false ? false : null;
    const authorizeAccount = Boolean(parsed.authorizeAccount);
    const electionCents = Number.isFinite(parsed.electionCents) ? Number(parsed.electionCents) : 0;
    const acknowledgedRules = Boolean(parsed.acknowledgedRules);
    
    return { version: 1, isEligible, authorizeAccount, electionCents: Math.max(0, Math.round(electionCents)), acknowledgedRules };
  } catch {
    return { version: 1, isEligible: null, authorizeAccount: false, electionCents: 0, acknowledgedRules: false };
  }
}

export function saveHsaState(next: HsaStateV1): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}