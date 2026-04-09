import { loadSpendingAccountsState, type SpendingAccountId } from "@/lib/spendingAccountsStorage";
import { isHDHPSelected } from "@/lib/medicalPlanStorage";

export type EnrollmentStep = {
  id: string;
  label: string;
  secondarySteps?: EnrollmentStep[];
};

function buildSpendingAccountsSecondary(selected: SpendingAccountId[]): EnrollmentStep[] {
  const out: EnrollmentStep[] = [];

  if (selected.includes("hsa")) {
    out.push({ id: "hsa", label: "HSA" });
    out.push({ id: "hsa-add-funds", label: "Add funds" });
    out.push({ id: "beneficiaries", label: "Beneficiaries" });
  } else if (selected.includes("fsa")) {
    out.push({ id: "fsa", label: "FSA" });
  }

  if (selected.includes("lpfsa")) out.push({ id: "lpfsa", label: "LPFSA" });
  if (selected.includes("dcfsa")) out.push({ id: "dcfsa", label: "DCFSA" });
  if (selected.includes("hra")) out.push({ id: "hra", label: "HRA" });

  return out;
}

export function getEnrollmentSteps(): EnrollmentStep[] {
  const spending = loadSpendingAccountsState();
  const isHDHP = isHDHPSelected();
  const spendingSecondary =
    spending.selected.length > 0 ? buildSpendingAccountsSecondary(spending.selected) : undefined;

  // Build select-plans secondary steps conditionally
  const selectPlansSecondary: EnrollmentStep[] = [
    { id: "medical-plans", label: "Medical plans" },
  ];

  // If HDHP is selected, insert HSA substeps after medical plans
  if (isHDHP) {
    selectPlansSecondary.push({ id: "hsa", label: "HSA" });
    selectPlansSecondary.push({ id: "hsa-add-funds", label: "Add funds" });
    selectPlansSecondary.push({ id: "beneficiaries", label: "Beneficiaries" });
  }

  // Add dental and vision
  selectPlansSecondary.push({ id: "dental-plans", label: "Dental plans" });
  selectPlansSecondary.push({ id: "vision-plans", label: "Vision plans" });

  return [
    { id: "profile", label: "Profile" },
    { id: "dependents", label: "Dependents" },
    {
      id: "select-plans",
      label: "Select plans",
      secondarySteps: selectPlansSecondary,
    },
    {
      id: "spending-accounts",
      label: "Spending accounts",
      secondarySteps: spendingSecondary,
    },
    {
      id: "voluntary-supplemental-benefits",
      label: "Supplemental Benefits",
      secondarySteps: [
        { id: "accident-insurance", label: "Accident insurance" },
        { id: "hospital-indemnity", label: "Hospital Indemnity" },
      ],
    },
    { id: "review-submit", label: "Review and submit" },
  ];
}

export function flattenEnrollmentStepIds(steps: EnrollmentStep[]): string[] {
  const ids: string[] = [];
  steps.forEach((step) => {
    ids.push(step.id);
    step.secondarySteps?.forEach((secondary) => ids.push(secondary.id));
  });
  return ids;
}

export function enrollmentLabelById(steps: EnrollmentStep[]): Record<string, string> {
  const map: Record<string, string> = {};
  steps.forEach((step) => {
    map[step.id] = step.label;
    step.secondarySteps?.forEach((secondary) => {
      map[secondary.id] = secondary.label;
    });
  });
  return map;
}
