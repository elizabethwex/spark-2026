export type SpendingAccountId = "hsa" | "fsa" | "lpfsa" | "dcfsa" | "hra";

export type SpendingAccountsStateV1 = {
  version: 1;
  selected: SpendingAccountId[];
  submitted: boolean;
};

const STORAGE_KEY = "enrollment.spending-accounts.v1";

export function loadSpendingAccountsState(): SpendingAccountsStateV1 {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: 1, selected: [], submitted: false };
    const parsed = JSON.parse(raw) as Partial<SpendingAccountsStateV1>;
    if (parsed?.version !== 1) return { version: 1, selected: [], submitted: false };
    const selected = Array.isArray(parsed.selected) ? (parsed.selected.filter(Boolean) as SpendingAccountId[]) : [];
    const submitted = Boolean(parsed.submitted);
    return { version: 1, selected, submitted };
  } catch {
    return { version: 1, selected: [], submitted: false };
  }
}

export function saveSpendingAccountsSelected(selected: SpendingAccountId[]): void {
  try {
    const next: SpendingAccountsStateV1 = {
      version: 1,
      selected,
      submitted: false,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function markSpendingAccountsSubmitted(): void {
  try {
    const current = loadSpendingAccountsState();
    const next: SpendingAccountsStateV1 = { ...current, version: 1, submitted: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

type AccountElectionSnapshot = {
  electionCents: number;
  acknowledgedRules: boolean;
};

export type SpendingAccountsSubmissionState = {
  version: 1;
  submittedAtIso: string;
  snapshot: {
    fsa: AccountElectionSnapshot;
    lpfsa: AccountElectionSnapshot;
    dcfsa: AccountElectionSnapshot;
    hra: AccountElectionSnapshot;
  };
};

const SUBMISSION_KEY = "enrollment.spending-accounts-submissions.v1";

export function saveSpendingAccountsSubmission(snapshot: SpendingAccountsSubmissionState["snapshot"]): void {
  try {
    const payload: SpendingAccountsSubmissionState = {
      version: 1,
      submittedAtIso: new Date().toISOString(),
      snapshot,
    };
    localStorage.setItem(SUBMISSION_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function loadSpendingAccountsSubmission(): SpendingAccountsSubmissionState | null {
  try {
    const raw = localStorage.getItem(SUBMISSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SpendingAccountsSubmissionState>;
    if (parsed?.version !== 1) return null;
    return parsed as SpendingAccountsSubmissionState;
  } catch {
    return null;
  }
}
