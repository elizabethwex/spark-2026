export interface PlanDetails {
  id: string;
  name: string;
  individualDeductible: number;
  familyDeductible: number;
  individualOopMax: number;
  familyOopMax: number;
}

const PLAN_CATALOG: Record<string, PlanDetails> = {
  "acme-hdhp": {
    id: "acme-hdhp",
    name: "ACME HDHP HSA",
    individualDeductible: 3000,
    familyDeductible: 6000,
    individualOopMax: 5000,
    familyOopMax: 10000,
  },
  "acme-ppo": {
    id: "acme-ppo",
    name: "ACME Enhanced PPO",
    individualDeductible: 1500,
    familyDeductible: 3000,
    individualOopMax: 4000,
    familyOopMax: 8000,
  },
};

export function getPlanDetails(planId: string | null): PlanDetails | null {
  if (!planId || planId === "waive") return null;
  return PLAN_CATALOG[planId] ?? null;
}

/**
 * Returns the cost difference (savings) between the selected plan
 * and the next-most-expensive alternative for the employee-only tier.
 * Positive = the user saves money with their current selection.
 */
export function estimatedSavingsVsAlternative(planId: string | null): number {
  if (planId === "acme-hdhp") return 480;
  if (planId === "acme-ppo") return 0;
  return 0;
}
