import { type EnrollmentSubmissionV1 } from "@/lib/enrollmentSubmissionStorage";
import { getPlanDetails } from "@/lib/planDetailsLookup";

export type SimulationMode = "modern" | "simulated" | "cobra" | "cobraEnroll";

export interface SimulatedData {
  medicalDeductibleSpent: number;
  medicalOopSpent: number;
  dentalDeductibleSpent: number;
  submittedAtIsoOverride: string;
  spendingAccountUsage: Record<string, number>;
  insightMessage: string;
  isCobraMode: boolean;
}

function sixMonthsAgo(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 6);
  return d.toISOString();
}

export function generate6MonthSimulation(
  submission: EnrollmentSubmissionV1
): SimulatedData {
  const medicalPlanId = submission.snapshot.plans.medical?.selectedPlanId ?? null;
  const isFamilyCoverage = !submission.snapshot.household?.selfOnly;
  const medicalPlan = getPlanDetails(medicalPlanId);

  let medicalDeductibleSpent = 0;
  let medicalOopSpent = 0;

  if (medicalPlan) {
    const deductible = isFamilyCoverage
      ? medicalPlan.familyDeductible
      : medicalPlan.individualDeductible;
    const oopMax = isFamilyCoverage
      ? medicalPlan.familyOopMax
      : medicalPlan.individualOopMax;

    medicalDeductibleSpent = Math.round(deductible * 0.4);
    medicalOopSpent = Math.round(oopMax * 0.15);
  }

  const dentalPlanId = submission.snapshot.plans.dental?.selectedPlanId;
  const dentalDeductibleSpent = dentalPlanId && dentalPlanId !== "waive" ? 450 : 0;

  const elections = submission.snapshot.spendingAccounts.elections;
  const selected = submission.snapshot.spendingAccounts.selected;
  const spendingAccountUsage: Record<string, number> = {};

  for (const accountId of selected) {
    const key = accountId as keyof typeof elections;
    const election = elections[key];
    if (election && election.electionCents > 0) {
      const rate = accountId === "hsa" ? 0.35 : 0.45;
      spendingAccountUsage[accountId] = Math.round(
        election.electionCents * rate
      );
    }
  }

  const deductiblePct = medicalPlan
    ? Math.round(
        (medicalDeductibleSpent /
          (isFamilyCoverage
            ? medicalPlan.familyDeductible
            : medicalPlan.individualDeductible)) *
          100
      )
    : 0;

  const insightMessage =
    deductiblePct > 0
      ? `You've used ${deductiblePct}% of your medical deductible after 6 months — you're on pace to stay well within your plan limits this year`
      : "You're halfway through your plan year with healthy utilization across all your benefits";

  return {
    medicalDeductibleSpent,
    medicalOopSpent,
    dentalDeductibleSpent,
    submittedAtIsoOverride: sixMonthsAgo(),
    spendingAccountUsage,
    insightMessage,
    isCobraMode: false,
  };
}

function twelveMonthsAgo(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return d.toISOString();
}

export function generateCobraSimulation(
  submission: EnrollmentSubmissionV1
): SimulatedData {
  const medicalPlanId = submission.snapshot.plans.medical?.selectedPlanId ?? null;
  const isFamilyCoverage = !submission.snapshot.household?.selfOnly;
  const medicalPlan = getPlanDetails(medicalPlanId);

  let medicalDeductibleSpent = 0;
  let medicalOopSpent = 0;

  if (medicalPlan) {
    const deductible = isFamilyCoverage
      ? medicalPlan.familyDeductible
      : medicalPlan.individualDeductible;
    const oopMax = isFamilyCoverage
      ? medicalPlan.familyOopMax
      : medicalPlan.individualOopMax;

    medicalDeductibleSpent = Math.round(deductible * 0.85);
    medicalOopSpent = Math.round(oopMax * 0.4);
  }

  const dentalPlanId = submission.snapshot.plans.dental?.selectedPlanId;
  const dentalDeductibleSpent = dentalPlanId && dentalPlanId !== "waive" ? 1500 : 0;

  const elections = submission.snapshot.spendingAccounts.elections;
  const selected = submission.snapshot.spendingAccounts.selected;
  const spendingAccountUsage: Record<string, number> = {};

  for (const accountId of selected) {
    const key = accountId as keyof typeof elections;
    const election = elections[key];
    if (election && election.electionCents > 0) {
      const rate = accountId === "hsa" ? 0.75 : 0.8;
      spendingAccountUsage[accountId] = Math.round(
        election.electionCents * rate
      );
    }
  }

  const insightMessage =
    "You're paying the full COBRA premium plus a 2% admin fee — consider comparing marketplace plans during the next Special Enrollment Period";

  return {
    medicalDeductibleSpent,
    medicalOopSpent,
    dentalDeductibleSpent,
    submittedAtIsoOverride: twelveMonthsAgo(),
    spendingAccountUsage,
    insightMessage,
    isCobraMode: true,
  };
}
