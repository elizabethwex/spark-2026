import { type MedicalPlan } from "@/components/enrollment/plans/PlanCard";

export type PlanType = "medical" | "dental" | "vision";
export type CoverageTier = "employeeOnly" | "employeeSpouse" | "employeeChildren" | "family";

export const MEDICAL_PLANS: MedicalPlan[] = [
  {
    id: "acme-hdhp",
    name: "ACME HDHP HSA",
    isRecommended: true,
    individualDeductible: 1500,
    familyDeductible: 3000,
    copayment: 20,
    costs: {
      employeeOnly: { total: 215.87, employerPays: 138.46 },
      employeeSpouse: { total: 242.31, employerPays: 138.46 },
      employeeChildren: { total: 238.11, employerPays: 138.46 },
      family: { total: 265.44, employerPays: 138.46 },
    },
  },
  {
    id: "acme-ppo",
    name: "ACME Enhanced PPO",
    individualDeductible: 1500,
    familyDeductible: 3000,
    copayment: 20,
    costs: {
      employeeOnly: { total: 204.16, employerPays: 138.46 },
      employeeSpouse: { total: 242.31, employerPays: 138.46 },
      employeeChildren: { total: 228.04, employerPays: 138.46 },
      family: { total: 259.05, employerPays: 138.46 },
    },
  },
  {
    id: "waive",
    name: "Waive Coverage",
    isWaive: true,
    costs: {
      employeeOnly: { total: 0, employerPays: 0 },
      employeeSpouse: { total: 0, employerPays: 0 },
      employeeChildren: { total: 0, employerPays: 0 },
      family: { total: 0, employerPays: 0 },
    },
  },
];

export const DENTAL_PLANS: MedicalPlan[] = [
  {
    id: "premium",
    name: "Premium",
    costs: {
      employeeOnly: { total: 45, employerPays: 26.5 },
      employeeSpouse: { total: 45, employerPays: 26.5 },
      employeeChildren: { total: 45, employerPays: 26.5 },
      family: { total: 45, employerPays: 26.5 },
    },
  },
  {
    id: "basic",
    name: "Basic",
    costs: {
      employeeOnly: { total: 30, employerPays: 18 },
      employeeSpouse: { total: 30, employerPays: 18 },
      employeeChildren: { total: 30, employerPays: 18 },
      family: { total: 30, employerPays: 18 },
    },
  },
  {
    id: "waive",
    name: "Waive Coverage",
    isWaive: true,
    costs: {
      employeeOnly: { total: 0, employerPays: 0 },
      employeeSpouse: { total: 0, employerPays: 0 },
      employeeChildren: { total: 0, employerPays: 0 },
      family: { total: 0, employerPays: 0 },
    },
  },
];

export const VISION_PLANS: MedicalPlan[] = [
  {
    id: "premium",
    name: "Premium",
    costs: {
      employeeOnly: { total: 15, employerPays: 6.5 },
      employeeSpouse: { total: 15, employerPays: 6.5 },
      employeeChildren: { total: 15, employerPays: 6.5 },
      family: { total: 15, employerPays: 6.5 },
    },
  },
  {
    id: "basic",
    name: "Basic",
    costs: {
      employeeOnly: { total: 10, employerPays: 5 },
      employeeSpouse: { total: 10, employerPays: 5 },
      employeeChildren: { total: 10, employerPays: 5 },
      family: { total: 10, employerPays: 5 },
    },
  },
  {
    id: "waive",
    name: "Waive Coverage",
    isWaive: true,
    costs: {
      employeeOnly: { total: 0, employerPays: 0 },
      employeeSpouse: { total: 0, employerPays: 0 },
      employeeChildren: { total: 0, employerPays: 0 },
      family: { total: 0, employerPays: 0 },
    },
  },
];

export function getPlanByType(
  planType: PlanType,
  planId: string | null
): MedicalPlan | null {
  if (!planId || planId === "waive") return null;

  const catalog = planType === "medical" 
    ? MEDICAL_PLANS 
    : planType === "dental" 
    ? DENTAL_PLANS 
    : VISION_PLANS;

  return catalog.find((p) => p.id === planId) ?? null;
}

export function calculateCoverageTier(enrollees: string[]): CoverageTier {
  const hasMyself = enrollees.includes("myself");
  const others = enrollees.filter((e) => e !== "myself");

  if (!hasMyself || others.length === 0) {
    return "employeeOnly";
  }

  const hasSpouse = others.some((id) => id.includes("spouse"));
  const hasChildren = others.some((id) => id.includes("child"));

  if (hasSpouse && hasChildren) {
    return "family";
  }

  if (hasSpouse) {
    return "employeeSpouse";
  }

  if (hasChildren) {
    return "employeeChildren";
  }

  return "employeeOnly";
}

export function getPlanCostsByType(
  planType: PlanType,
  planId: string | null,
  coverageTier: CoverageTier
): { total: number; employerPays: number } | null {
  const plan = getPlanByType(planType, planId);
  if (!plan) return null;

  return plan.costs[coverageTier];
}
