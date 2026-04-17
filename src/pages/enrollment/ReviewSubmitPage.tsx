import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Smile,
  Eye,
  ShieldCheck,
  Building2,
  Users,
  CircleDollarSign,
} from "lucide-react";
import EnrollmentLayout from "./EnrollmentLayout";
import { WexSeparator } from "@wex/components-react/layout";
import { saveEnrollmentSubmission } from "@/lib/enrollmentSubmissionStorage";
import { loadFsaState } from "@/lib/fsaStorage";
import { loadLpfsaState } from "@/lib/lpfsaStorage";
import { loadDcfsaState } from "@/lib/dcfsaStorage";
import { loadHraState } from "@/lib/hraStorage";
import { loadHsaState } from "@/lib/hsaStorage";
import { loadSpendingAccountsState, loadSpendingAccountsSubmission } from "@/lib/spendingAccountsStorage";
import { coveragePeriodFromEffectiveDate, EFFECTIVE_DATE } from "@/lib/enrollmentCoveragePeriod";
import { cn } from "@/lib/utils";
import { isHDHPSelected } from "@/lib/medicalPlanStorage";

/* ------------------------------------------------------------------ */
/*  Types & constants                                                  */
/* ------------------------------------------------------------------ */

type ReviewSubmitPageProps = {
  currentStepId: string;
  onStepChange: (stepId: string) => void;
  onBack: () => void;
  onCancel: () => void;
};

type PlanPickState = { enrollees: string[]; selectedPlanId: string | null };
type DependentsState = {
  version: 1;
  dependents: { id: string; name: string; ageLabel: string; userAdded?: boolean }[];
  selectedIds: string[];
  selfOnly: boolean;
};
type PlanSnapshot = {
  medical: PlanPickState | null;
  dental: PlanPickState | null;
  vision: PlanPickState | null;
};
type PlanSubmissionState = {
  version: 1;
  submittedAtIso: string;
  snapshot: PlanSnapshot;
};

const MEDICAL_KEY = "enrollment.medical-plans.v1";
const DENTAL_KEY = "enrollment.dental-plans.v1";
const VISION_KEY = "enrollment.vision-plans.v1";
const DEPENDENTS_KEY = "enrollment.dependents.v1";
const ACCIDENT_KEY = "enrollment.accident-insurance.v1";
const HOSPITAL_KEY = "enrollment.hospital-indemnity.v1";
const PLAN_SUBMISSION_KEY = "enrollment.plan-submissions.v1";

const coveragePeriod = coveragePeriodFromEffectiveDate(EFFECTIVE_DATE);

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function safeJSON<T>(key: string): T | null {
  try {
    const r = localStorage.getItem(key);
    return r ? (JSON.parse(r) as T) : null;
  } catch {
    return null;
  }
}

function medicalPlanLabel(planId: string | null): string {
  switch (planId) {
    case "acme-hdhp":
      return "ACME HDHP HSA";
    case "acme-ppo":
      return "ACME Enhanced PPO";
    case "waive":
      return "Waive Coverage";
    default:
      return "No selection";
  }
}

function dentalPlanLabel(planId: string | null): string {
  switch (planId) {
    case "premium":
      return "Premium";
    case "basic":
      return "Basic";
    case "waive":
      return "Waive Coverage";
    default:
      return "No selection";
  }
}

function visionPlanLabel(planId: string | null): string {
  switch (planId) {
    case "premium":
      return "Premium";
    case "basic":
      return "Basic";
    case "waive":
      return "Waive Coverage";
    default:
      return "No selection";
  }
}

function enrolleeLabel(
  enrolleeIds: string[] | undefined,
  dependents: DependentsState | null,
): string {
  const ids = enrolleeIds ?? [];
  const depMap = new Map(
    (dependents?.dependents ?? []).map((d) => [d.id, d.name] as const),
  );
  const names = ids
    .filter((id) => id !== "myself")
    .map((id) => depMap.get(id) ?? "Dependent");
  return ["Myself", ...names].join(", ");
}

function medicalYouPay(planId: string | null, dependentCount: number): number {
  const tier =
    dependentCount === 0
      ? "employeeOnly"
      : dependentCount === 1
        ? "employeeSpouse"
        : "family";
  const tables: Record<
    string,
    Record<string, { total: number; employerPays: number }>
  > = {
    "acme-hdhp": {
      employeeOnly: { total: 215.87, employerPays: 138.46 },
      employeeSpouse: { total: 242.31, employerPays: 138.46 },
      family: { total: 265.44, employerPays: 138.46 },
    },
    "acme-ppo": {
      employeeOnly: { total: 204.16, employerPays: 138.46 },
      employeeSpouse: { total: 242.31, employerPays: 138.46 },
      family: { total: 259.05, employerPays: 138.46 },
    },
    waive: {
      employeeOnly: { total: 0, employerPays: 0 },
      employeeSpouse: { total: 0, employerPays: 0 },
      family: { total: 0, employerPays: 0 },
    },
  };
  const table = tables[planId ?? ""] ?? tables.waive;
  const row = table[tier] ?? table.employeeOnly;
  return Math.max(0, row.total - row.employerPays);
}

function medicalEmployerPays(
  planId: string | null,
  dependentCount: number,
): number {
  const tier =
    dependentCount === 0
      ? "employeeOnly"
      : dependentCount === 1
        ? "employeeSpouse"
        : "family";
  const tables: Record<
    string,
    Record<string, { employerPays: number }>
  > = {
    "acme-hdhp": {
      employeeOnly: { employerPays: 138.46 },
      employeeSpouse: { employerPays: 138.46 },
      family: { employerPays: 138.46 },
    },
    "acme-ppo": {
      employeeOnly: { employerPays: 138.46 },
      employeeSpouse: { employerPays: 138.46 },
      family: { employerPays: 138.46 },
    },
    waive: {
      employeeOnly: { employerPays: 0 },
      employeeSpouse: { employerPays: 0 },
      family: { employerPays: 0 },
    },
  };
  const table = tables[planId ?? ""] ?? tables.waive;
  const row = table[tier] ?? table.employeeOnly;
  return row.employerPays;
}

function dentalYouPay(planId: string | null): number {
  return planId === "premium" ? 18.5 : planId === "basic" ? 12 : 0;
}

function visionYouPay(planId: string | null): number {
  return planId === "premium" ? 8.5 : planId === "basic" ? 5 : 0;
}

function accidentInsuranceMonthly(planId: string | null): number {
  if (planId === "basic") return 12.5;
  if (planId === "enhanced") return 28.75;
  return 0;
}

function hospitalIndemnityMonthly(planId: string | null): number {
  if (planId === "basic") return 18.0;
  if (planId === "enhanced") return 42.5;
  return 0;
}

function formatCurrency(amount: number): string {
  const fixed = amount.toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${withCommas}.${decPart ?? "00"}`;
}

const PAY_PERIODS = 26;

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Column headers for the benefit tables */
function BenefitTableHeader() {
  return (
    <div className="grid grid-cols-[1fr_1.4fr_auto_auto] items-center gap-4 px-6 py-3 text-[12px] text-muted-foreground tracking-wide bg-muted/50 border-b border-border">
      <span className="font-semibold">Benefit</span>
      <span className="font-semibold">Plan &amp; coverage</span>
      <span className="font-semibold w-[160px]">Status</span>
      <span className="font-semibold w-[100px] text-right italic">Cost (bi-weekly)</span>
    </div>
  );
}

type BenefitRowProps = {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  planName: string;
  enrolledLabel: string;
  costDetail: string;
  coveragePeriod: string;
  status: "pending" | "submitted";
  costAmount: string;
  onEdit: () => void;
};

function BenefitRow({
  icon,
  iconBg,
  title,
  planName,
  enrolledLabel,
  costDetail,
  coveragePeriod: period,
  status,
  costAmount,
  onEdit,
}: BenefitRowProps) {
  return (
    <div className="grid grid-cols-[1fr_1.4fr_auto_auto] items-start gap-4 px-6 py-5 border-t border-border">
      {/* Benefit column */}
      <div className="flex items-center gap-3">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
        >
          {icon}
        </div>
        <span className="text-[14px] font-semibold text-foreground">{title}</span>
      </div>

      {/* Plan & coverage column */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[14px] font-semibold text-foreground">{planName}</span>
        <span className="text-[13px] text-muted-foreground flex items-center gap-1.5">
          Enrolled: {enrolledLabel}
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
        </span>
        <span className="text-[13px] text-muted-foreground">{costDetail}</span>
        <span className="text-[13px] text-muted-foreground">
          Coverage period: {period}{" "}
          <button
            type="button"
            className="text-primary font-semibold hover:underline ml-1"
            onClick={onEdit}
          >
            Edit
          </button>
        </span>
      </div>

      {/* Status column */}
      <div className="w-[160px] pt-0.5">
        <span className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold whitespace-nowrap",
          status === "pending" ? "bg-[#FFF9E6] text-[#BF8A00]" : "bg-success/10 text-success-text"
        )}>
          {status === "pending" ? "Pending submission" : "Submitted"}
        </span>
      </div>

      {/* Cost column */}
      <div className="w-[100px] text-right">
        <div className="text-[18px] font-bold text-[#14182c]">{costAmount}</div>
        <div className="text-[11px] text-muted-foreground">you pay: bi-weekly</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function ReviewSubmitPage({
  currentStepId,
  onStepChange,
  onBack,
  onCancel,
}: ReviewSubmitPageProps) {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = React.useState(false);

  /* ---- Load data ---- */
  const dependentsData = safeJSON<DependentsState>(DEPENDENTS_KEY);
  const medical = safeJSON<PlanPickState>(MEDICAL_KEY);
  const dental = safeJSON<PlanPickState>(DENTAL_KEY);
  const vision = safeJSON<PlanPickState>(VISION_KEY);
  const accidentData = safeJSON<PlanPickState>(ACCIDENT_KEY);
  const hospitalData = safeJSON<PlanPickState>(HOSPITAL_KEY);
  const spending = loadSpendingAccountsState();
  const fsa = loadFsaState();
  const lpfsa = loadLpfsaState();
  const dcfsa = loadDcfsaState();
  const hra = loadHraState();
  const hsa = loadHsaState();
  const isHDHP = isHDHPSelected();

  /* ---- Calculations ---- */
  const medDepCount = (medical?.enrollees ?? []).filter(
    (id) => id !== "myself",
  ).length;
  const medicalCost = medicalYouPay(
    medical?.selectedPlanId ?? null,
    medDepCount,
  );
  const medicalEmployer = medicalEmployerPays(
    medical?.selectedPlanId ?? null,
    medDepCount,
  );
  const dentalCost = dentalYouPay(dental?.selectedPlanId ?? null);
  const visionCost = visionYouPay(vision?.selectedPlanId ?? null);
  const plansCostBiWeekly = medicalCost + dentalCost + visionCost;
  const employerPaysBiWeekly = medicalEmployer; // dental/vision employer pays not modeled

  const spendingTotalCents =
    fsa.electionCents + lpfsa.electionCents + dcfsa.electionCents + hra.electionCents + hsa.electionCents;
  const spendingBiWeekly =
    PAY_PERIODS > 0 ? spendingTotalCents / 100 / PAY_PERIODS : 0;

  const displayedSpendingAccounts = [...spending.selected];
  if (isHDHP && hsa.electionCents > 0 && !displayedSpendingAccounts.includes("hsa")) {
    displayedSpendingAccounts.push("hsa");
  }

  // Supplemental – currently $0 monthly placeholder
  const supplementalMonthly =
    accidentInsuranceMonthly(accidentData?.selectedPlanId ?? null) +
    hospitalIndemnityMonthly(hospitalData?.selectedPlanId ?? null);
  const supplementalBiWeekly = (supplementalMonthly * 12) / PAY_PERIODS;

  const totalYouPayBiWeekly =
    plansCostBiWeekly + spendingBiWeekly + supplementalBiWeekly;
  const totalEmployerPaysBiWeekly = employerPaysBiWeekly;

  /* ---- Submit ---- */
  const handleSubmit = () => {
    saveEnrollmentSubmission({
      snapshot: {
        plans: {
          medical: medical ?? null,
          dental: dental ?? null,
          vision: vision ?? null,
        },
        spendingAccounts: {
          selected: displayedSpendingAccounts,
          elections: { fsa, lpfsa, dcfsa, hra },
        },
        hsaRelated: hsa,
        supplemental: {
          accidentInsurance: accidentData ?? null,
          hospitalIndemnity: hospitalData ?? null,
        },
        household: dependentsData
          ? {
              dependents: dependentsData.dependents.map((d) => ({
                id: d.id,
                name: d.name,
                ageLabel: "",
                userAdded: d.userAdded ?? false,
              })),
              selectedIds: dependentsData.selectedIds,
              selfOnly: dependentsData.selfOnly,
            }
          : null,
      },
      totals: {
        plansBiWeeklyCents: Math.round(plansCostBiWeekly * 100),
        spendingAnnualCents: spendingTotalCents,
        spendingTaxSavingsAnnualCents: Math.round(spendingTotalCents * 0.3),
        spendingPerPayDeductionCents: Math.round(spendingBiWeekly * 100),
        supplementalMonthlyCents: supplementalMonthly,
      },
    });
    setSubmitted(true);
    navigate("/enrollment/success");
  };

  if (submitted) return null;

  /* ---- Derive plan status from checkpoint submission ---- */
  const planSubmission = safeJSON<PlanSubmissionState>(PLAN_SUBMISSION_KEY);
  const currentPlanSnapshot: PlanSnapshot = {
    medical: medical ?? null,
    dental: dental ?? null,
    vision: vision ?? null,
  };
  const plansSubmitted =
    planSubmission?.version === 1 && planSubmission?.snapshot
      ? JSON.stringify(planSubmission.snapshot) === JSON.stringify(currentPlanSnapshot)
      : false;
  const planStatus: "pending" | "submitted" = plansSubmitted ? "submitted" : "pending";

  /* ---- Derive spending status from checkpoint submission ---- */
  const spendingSubmission = loadSpendingAccountsSubmission();
  const spendingSubmittedAndUnchanged = (() => {
    if (!spendingSubmission || spendingSubmission.version !== 1) return false;
    // The spending checkpoint saves fsa, lpfsa, dcfsa, hra snapshots.
    // Compare each account's electionCents and acknowledgedRules against current values.
    const snap = spendingSubmission.snapshot;
    const fsaMatch = snap.fsa.electionCents === fsa.electionCents && snap.fsa.acknowledgedRules === fsa.acknowledgedRules;
    const lpfsaMatch = snap.lpfsa.electionCents === lpfsa.electionCents && snap.lpfsa.acknowledgedRules === lpfsa.acknowledgedRules;
    const dcfsaMatch = snap.dcfsa.electionCents === dcfsa.electionCents && snap.dcfsa.acknowledgedRules === dcfsa.acknowledgedRules;
    const hraMatch = snap.hra.electionCents === hra.electionCents && snap.hra.acknowledgedRules === hra.acknowledgedRules;
    return fsaMatch && lpfsaMatch && dcfsaMatch && hraMatch;
  })();
  const spendingStatus: "pending" | "submitted" = spendingSubmittedAndUnchanged ? "submitted" : "pending";

  /* ---- Supplemental benefits have no checkpoint, always pending ---- */
  const supplementalStatus: "pending" | "submitted" = "pending";

  return (
    <EnrollmentLayout
      currentStepId={currentStepId}
      cancelAction={{ label: "Cancel", onClick: onCancel }}
      onStepChange={onStepChange}
      onBack={onBack}
      onNext={handleSubmit}
      primaryAction={{ label: "Submit Enrollment", onClick: handleSubmit }}
    >
      <div className="pt-14 flex justify-center">
        <div className="w-[min(960px,92vw)] pb-8">
          {/* ---- Page header ---- */}
          <h2 className="text-[24px] font-bold leading-8 tracking-[-0.456px] text-foreground">
            Review and Submit
          </h2>
          <p className="mt-2 text-[14px] leading-6 tracking-[-0.084px] text-muted-foreground">
            Please review your selections below. You can edit any section before
            submitting. When you submit, we'll save a confirmation record for
            your enrollment.
          </p>

          {/* ============================================================ */}
          {/*  PLANS                                                        */}
          {/* ============================================================ */}
          <section className="mt-10">
            <h3 className="text-[20px] font-bold text-foreground mb-4">Plans</h3>
            <div className="rounded-2xl border border-border bg-background elevation-3 shadow-md overflow-hidden">
              <BenefitTableHeader />
              <BenefitRow
                icon={<Heart className="h-5 w-5 text-primary" />}
                iconBg="bg-primary/10"
                title="Medical Plan"
                planName={medicalPlanLabel(medical?.selectedPlanId ?? null)}
                enrolledLabel={enrolleeLabel(medical?.enrollees, dependentsData)}
                costDetail={`Employer pays: ${formatCurrency(medicalEmployer)} bi-weekly`}
                coveragePeriod={coveragePeriod}
                status={planStatus}
                costAmount={formatCurrency(medicalCost)}
                onEdit={() => navigate("/enrollment/medical-plans")}
              />
              <BenefitRow
                icon={<Smile className="h-5 w-5 text-primary" />}
                iconBg="bg-primary/10"
                title="Dental Plan"
                planName={dentalPlanLabel(dental?.selectedPlanId ?? null)}
                enrolledLabel={enrolleeLabel(dental?.enrollees, dependentsData)}
                costDetail={`Employer pays: ${formatCurrency(0)} bi-weekly`}
                coveragePeriod={coveragePeriod}
                status={planStatus}
                costAmount={formatCurrency(dentalCost)}
                onEdit={() => navigate("/enrollment/dental-plans")}
              />
              <BenefitRow
                icon={<Eye className="h-5 w-5 text-primary" />}
                iconBg="bg-primary/10"
                title="Vision Plan"
                planName={visionPlanLabel(vision?.selectedPlanId ?? null)}
                enrolledLabel={enrolleeLabel(vision?.enrollees, dependentsData)}
                costDetail={`Employer pays: ${formatCurrency(0)} bi-weekly`}
                coveragePeriod={coveragePeriod}
                status={planStatus}
                costAmount={formatCurrency(visionCost)}
                onEdit={() => navigate("/enrollment/vision-plans")}
              />
            </div>
          </section>

          {/* ============================================================ */}
          {/*  SPENDING ACCOUNTS                                            */}
          {/* ============================================================ */}
          <section className="mt-10">
            <h3 className="text-[20px] font-bold text-foreground mb-4">
              Spending Accounts
            </h3>
            <div className="rounded-2xl border border-border bg-background elevation-3 shadow-md overflow-hidden">
              {displayedSpendingAccounts.length === 0 ? (
                <div className="px-6 py-5">
                  <span className="text-[14px] text-muted-foreground">
                    No spending accounts selected.{" "}
                    <button
                      type="button"
                      className="text-primary font-semibold hover:underline"
                      onClick={() =>
                        navigate("/enrollment/spending-accounts")
                      }
                    >
                      Edit
                    </button>
                  </span>
                </div>
              ) : (
                <>
                  {/* Column headers */}
                  <div className="grid grid-cols-[1fr_1.4fr_auto_auto] items-center gap-4 px-6 py-3 text-[12px] text-muted-foreground tracking-wide bg-muted/50 border-b border-border">
                    <span className="font-semibold">Account</span>
                    <span className="font-semibold">Election &amp; plan year</span>
                    <span className="font-semibold w-[160px]">Status</span>
                    <span className="font-semibold w-[100px] text-right italic">Cost (bi-weekly)</span>
                  </div>

                  {/* Account rows */}
                  {displayedSpendingAccounts.map((id) => {
                    const cents =
                      id === "fsa"
                        ? fsa.electionCents
                        : id === "lpfsa"
                          ? lpfsa.electionCents
                          : id === "dcfsa"
                            ? dcfsa.electionCents
                            : id === "hra"
                              ? hra.electionCents
                              : hsa.electionCents;
                    const biWeekly = PAY_PERIODS > 0 ? cents / 100 / PAY_PERIODS : 0;
                    const stepRoute =
                      id === "fsa" ? "fsa" : id === "lpfsa" ? "lpfsa" : id === "dcfsa" ? "dcfsa" : id === "hra" ? "hra" : "hsa";

                    return (
                      <div
                        key={id}
                        className="grid grid-cols-[1fr_1.4fr_auto_auto] items-start gap-4 px-6 py-5 border-t border-border"
                      >
                        {/* Account column */}
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 bg-success/10">
                            <CircleDollarSign className="h-5 w-5 text-success-text" />
                          </div>
                          <span className="text-[14px] font-semibold text-foreground">
                            {id.toUpperCase()}
                          </span>
                        </div>

                        {/* Election & plan year column */}
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[14px] text-foreground">
                            Annual election: {formatCurrency(cents / 100)}
                          </span>
                          <span className="text-[13px] text-muted-foreground">
                            Plan year: {coveragePeriod}{" "}
                            <button
                              type="button"
                              className="text-primary font-semibold hover:underline ml-1"
                              onClick={() =>
                                navigate(`/enrollment/${stepRoute}`)
                              }
                            >
                              Edit
                            </button>
                          </span>
                        </div>

                        {/* Status column */}
                        <div className="w-[160px] pt-0.5">
                          <span className={cn(
                            "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold whitespace-nowrap",
                            spendingStatus === "pending" ? "bg-[#FFF9E6] text-[#BF8A00]" : "bg-success/10 text-success-text"
                          )}>
                            {spendingStatus === "pending" ? "Pending submission" : "Submitted"}
                          </span>
                        </div>

                        {/* Cost column */}
                        <div className="w-[100px] text-right">
                          <div className="text-[18px] font-bold text-[#14182c]">
                            {formatCurrency(biWeekly)}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            you pay: bi-weekly
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </section>

          {/* ============================================================ */}
          {/*  SUPPLEMENTAL BENEFITS                                        */}
          {/* ============================================================ */}
          <section className="mt-10">
            <h3 className="text-[20px] font-bold text-foreground mb-4">
              Supplemental Benefits
            </h3>
            <div className="rounded-2xl border border-border bg-background elevation-3 shadow-md overflow-hidden">
              <BenefitTableHeader />
              <BenefitRow
                icon={<ShieldCheck className="h-5 w-5 text-success-text" />}
                iconBg="bg-success/10"
                title="Accident insurance"
                planName={
                  accidentData?.selectedPlanId
                    ? accidentData.selectedPlanId
                    : "No selection"
                }
                enrolledLabel={enrolleeLabel(
                  accidentData?.enrollees,
                  dependentsData,
                )}
                costDetail={`Premium: ${formatCurrency(accidentInsuranceMonthly(accidentData?.selectedPlanId ?? null))} monthly`}
                coveragePeriod={coveragePeriod}
                status={supplementalStatus}
                costAmount={formatCurrency(
                  (accidentInsuranceMonthly(accidentData?.selectedPlanId ?? null) * 12) / PAY_PERIODS
                )}
                onEdit={() => navigate("/enrollment/accident-insurance")}
              />
              <BenefitRow
                icon={<Building2 className="h-5 w-5 text-destructive" />}
                iconBg="bg-destructive/10"
                title="Hospital indemnity"
                planName={
                  hospitalData?.selectedPlanId
                    ? hospitalData.selectedPlanId
                    : "No selection"
                }
                enrolledLabel={enrolleeLabel(
                  hospitalData?.enrollees,
                  dependentsData,
                )}
                costDetail={`Premium: ${formatCurrency(hospitalIndemnityMonthly(hospitalData?.selectedPlanId ?? null))} monthly`}
                coveragePeriod={coveragePeriod}
                status={supplementalStatus}
                costAmount={formatCurrency(
                  (hospitalIndemnityMonthly(hospitalData?.selectedPlanId ?? null) * 12) / PAY_PERIODS
                )}
                onEdit={() => navigate("/enrollment/hospital-indemnity")}
              />
            </div>
          </section>

          {/* ============================================================ */}
          {/*  TOTAL COST                                                   */}
          {/* ============================================================ */}
          <section className="mt-10">
            <div className="grid grid-cols-2 gap-4">
              {/* Employer Total Cost card */}
              <div className="rounded-2xl border border-border bg-muted elevation-3 px-6 py-5">
                <h3 className="text-[16px] font-semibold text-muted-foreground">
                  Employer Total Cost
                </h3>
                <p className="text-[13px] text-muted-foreground italic mt-0.5">
                  (bi-weekly)
                </p>
                <WexSeparator className="my-4" />
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-muted-foreground">
                    Employer Pays
                  </span>
                  <span className="text-[20px] font-bold text-[#7a87b2]">
                    {formatCurrency(totalEmployerPaysBiWeekly)}
                  </span>
                </div>
              </div>

              {/* Your Total Cost card */}
              <div className="rounded-2xl border border-primary/30 bg-primary/5 elevation-3 px-6 py-5">
                <h3 className="text-[16px] font-semibold text-[#14182c]">
                  Your Total Cost
                </h3>
                <p className="text-[13px] text-primary/70 italic mt-0.5">
                  (bi-weekly)
                </p>
                <WexSeparator className="my-4" />
                <div className="flex items-center justify-between">
                  <span className="text-[14px] text-foreground">
                    You Pay
                  </span>
                  <span className="text-[20px] font-bold text-[#14182c]">
                    {formatCurrency(totalYouPayBiWeekly)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/*  ADDITIONAL INFORMATION                                       */}
          {/* ============================================================ */}
          <section className="mt-10">
            <h3 className="text-[20px] font-bold text-foreground mb-4">
              Additional Information
            </h3>
            <ul className="list-disc pl-6 space-y-3 text-[13px] text-muted-foreground leading-5">
              <li>
                I understand that I am making an election concerning the above
                described benefits. I authorize applicable payroll deductions
                for the plan choices indicated. This election is subject to any
                changes required to comply with Federal or State Tax laws.
              </li>
              <li>
                I certify that all of the information, including effective dates
                is correct.
              </li>
              <li>
                I certify that all members covered under my plans continue to
                meet eligibility requirements (if dependents are covered).
              </li>
              <li>
                I understand that for retroactive terminations (effective dates
                greater than 31 days prior to today) I will be responsible for
                repayment of the full premium paid for coverage of the dependent
                who was not qualified for coverage under the terms of my plan.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </EnrollmentLayout>
  );
}