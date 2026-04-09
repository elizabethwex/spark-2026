const MEDICAL_PLANS_KEY = "enrollment.medical-plans.v1";

type MedicalPlansState = {
  enrollees: string[];
  selectedPlanId: string | null;
};

export function loadMedicalPlanSelection(): string | null {
  try {
    const raw = localStorage.getItem(MEDICAL_PLANS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MedicalPlansState;
    return parsed.selectedPlanId ?? null;
  } catch {
    return null;
  }
}

export function isHDHPSelected(): boolean {
  const planId = loadMedicalPlanSelection();
  return planId === "acme-hdhp";
}
