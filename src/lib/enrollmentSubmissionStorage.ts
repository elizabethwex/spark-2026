export type EnrollmentSubmissionV1 = {
  version: 1;
  submittedAtIso: string;
  snapshot: {
    plans: {
      medical: { enrollees: string[]; selectedPlanId: string | null } | null;
      dental: { enrollees: string[]; selectedPlanId: string | null } | null;
      vision: { enrollees: string[]; selectedPlanId: string | null } | null;
    };
    spendingAccounts: {
      selected: string[];
      elections: {
        fsa: { electionCents: number; acknowledgedRules: boolean };
        lpfsa: { electionCents: number; acknowledgedRules: boolean };
        dcfsa: { electionCents: number; acknowledgedRules: boolean };
        hra: { electionCents: number; acknowledgedRules: boolean };
      };
    };
    supplemental: {
      accidentInsurance: { enrollees: string[]; selectedPlanId: string | null } | null;
      hospitalIndemnity: { enrollees: string[]; selectedPlanId: string | null } | null;
    };
    household: {
      dependents: { id: string; name: string; ageLabel: string; userAdded?: boolean }[];
      selectedIds: string[];
      selfOnly: boolean;
    } | null;
    hsaRelated?: Record<string, unknown> | null;
  };
  totals: {
    plansBiWeeklyCents: number;
    spendingAnnualCents: number;
    spendingTaxSavingsAnnualCents: number;
    spendingPerPayDeductionCents: number;
    supplementalMonthlyCents: number;
  };
};

const STORAGE_KEY = "enrollment.final-submission.v1";

export function loadEnrollmentSubmission(): EnrollmentSubmissionV1 | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<EnrollmentSubmissionV1>;
    if (parsed?.version !== 1) return null;
    return parsed as EnrollmentSubmissionV1;
  } catch {
    return null;
  }
}

export function saveEnrollmentSubmission(payload: Omit<EnrollmentSubmissionV1, "version" | "submittedAtIso">): void {
  try {
    const out: EnrollmentSubmissionV1 = {
      version: 1,
      submittedAtIso: new Date().toISOString(),
      ...payload,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
  } catch {
    // ignore
  }
}