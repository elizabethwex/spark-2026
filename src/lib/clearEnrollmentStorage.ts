const ENROLLMENT_KEYS = [
  "enrollment.dependents.v1",
  "enrollment.medical-plans.v1",
  "enrollment.dental-plans.v1",
  "enrollment.vision-plans.v1",
  "enrollment.accident-insurance.v1",
  "enrollment.hospital-indemnity.v1",
  "enrollment.spending-accounts.v1",
  "enrollment.spending-accounts-submissions.v1",
  "enrollment.fsa.v1",
  "enrollment.lpfsa.v1",
  "enrollment.dcfsa.v1",
  "enrollment.hra.v1",
  "enrollment.hsa.v1",
  "enrollment.beneficiaries.v1",
  "enrollment.decision-support-opt-in.v1",
  "enrollment.plan-submissions.v1",
  "enrollment.final-submission.v1",
  "spendingAccountsIqPromptDismissed",
];

export function clearEnrollmentStorage(): void {
  for (const key of ENROLLMENT_KEYS) {
    localStorage.removeItem(key);
  }
}
