export type DcfsaStateV1 = {
  version: 1;
  electionCents: number;
  acknowledgedRules: boolean;
};

const STORAGE_KEY = "enrollment.dcfsa.v1";

export function loadDcfsaState(): DcfsaStateV1 {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: 1, electionCents: 0, acknowledgedRules: false };
    const parsed = JSON.parse(raw) as Partial<DcfsaStateV1>;
    if (parsed?.version !== 1) return { version: 1, electionCents: 0, acknowledgedRules: false };
    const electionCents = Number.isFinite(parsed.electionCents) ? Number(parsed.electionCents) : 0;
    const acknowledgedRules = Boolean(parsed.acknowledgedRules);
    return { version: 1, electionCents: Math.max(0, Math.round(electionCents)), acknowledgedRules };
  } catch {
    return { version: 1, electionCents: 0, acknowledgedRules: false };
  }
}

export function saveDcfsaState(next: DcfsaStateV1): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}
