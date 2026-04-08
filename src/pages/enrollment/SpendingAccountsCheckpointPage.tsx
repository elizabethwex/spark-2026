import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Eye,
  Heart,
  Send,
  Smile,
  Users,
  Wallet,
} from "lucide-react";
import EnrollmentLayout from "./EnrollmentLayout";
import { WexButton } from "@wex/components-react/actions";
import { WexDialog } from "@wex/components-react/overlays";
import { cn } from "@/lib/utils";
import { EnrollmentSuccessIllustration } from "@/components/enrollment/EnrollmentSuccessIllustration";
import {
  loadSpendingAccountsState,
  saveSpendingAccountsSubmission,
  markSpendingAccountsSubmitted,
} from "@/lib/spendingAccountsStorage";
import { loadFsaState } from "@/lib/fsaStorage";
import { loadLpfsaState } from "@/lib/lpfsaStorage";
import { loadDcfsaState } from "@/lib/dcfsaStorage";
import { loadHraState } from "@/lib/hraStorage";
import { loadHsaState } from "@/lib/hsaStorage";
import { isHDHPSelected } from "@/lib/medicalPlanStorage";

/* ------------------------------------------------------------------ */
/*  Constants & types                                                  */
/* ------------------------------------------------------------------ */

const DEPENDENTS_STORAGE_KEY = "enrollment.dependents.v1";
const MEDICAL_KEY = "enrollment.medical-plans.v1";
const DENTAL_KEY = "enrollment.dental-plans.v1";
const VISION_KEY = "enrollment.vision-plans.v1";
const PLAN_SUBMISSION_KEY = "enrollment.plan-submissions.v1";

const PAY_PERIODS = 26;
const TAX_RATE = 0.3;

type PlanPickState = { enrollees: string[]; selectedPlanId: string | null };
type DependentsState = {
  version: 1;
  dependents: { id: string; name: string; ageLabel: string }[];
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

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function safeReadJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function formatCurrency(amount: number): string {
  const fixed = amount.toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${withCommas}.${decPart ?? "00"}`;
}

function fmtCents(cents: number): string {
  const dollars = (cents / 100).toFixed(2);
  const [intPart, decPart] = dollars.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${withCommas}.${decPart ?? "00"}`;
}

function enrolleeNames(
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

function sameSnapshot(a: PlanSnapshot, b: PlanSnapshot): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
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

function dentalYouPay(planId: string | null): number {
  return planId === "premium" ? 18.5 : planId === "basic" ? 12 : 0;
}

function visionYouPay(planId: string | null): number {
  return planId === "premium" ? 8.5 : planId === "basic" ? 5 : 0;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Plan selection row (Medical / Dental / Vision) */
function PlanSelectionRow({
  icon,
  title,
  planLine,
  status,
  amount,
  onEdit,
}: {
  icon: React.ReactNode;
  title: string;
  planLine: string;
  status: "pending" | "submitted";
  amount: string;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background px-6 py-5 elevation-3">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-[18px] font-bold text-foreground">
              {title}
            </div>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold",
                status === "pending"
                  ? "bg-[#FFF9E6] text-[#BF8A00]"
                  : "bg-success/10 text-success-text",
              )}
            >
              {status === "pending" ? "Pending submission" : "Submitted"}
            </span>
          </div>
          <div className="mt-1 text-[14px] text-muted-foreground flex items-center gap-2 flex-wrap">
            <span className="truncate inline-flex items-center gap-2">
              {planLine}
              <Users className="h-4 w-4 text-muted-foreground" />
            </span>
            <button
              type="button"
              onClick={onEdit}
              className="text-primary font-semibold hover:underline"
            >
              Edit selection
            </button>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[28px] font-bold tracking-[-0.5px] leading-9 text-[#14182c]">
            {amount}
          </div>
          <div className="text-[13px] text-muted-foreground mt-1">
            bi-weekly
          </div>
        </div>
      </div>
    </div>
  );
}

/** Spending account selection row */
function SpendingAccountRow({
  label,
  status,
  annualCents,
  onEdit,
}: {
  label: string;
  status: "pending" | "submitted";
  annualCents: number;
  onEdit: () => void;
}) {
  if (annualCents === 0) return null;
  return (
    <div className="rounded-2xl border border-border bg-background px-6 py-5 elevation-3">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center text-success-text shrink-0">
          <CircleDollarSign className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-[18px] font-bold text-foreground">
              {label}
            </div>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold",
                status === "pending"
                  ? "bg-[#FFF9E6] text-[#BF8A00]"
                  : "bg-success/10 text-success-text",
              )}
            >
              {status === "pending" ? "Pending submission" : "Submitted"}
            </span>
          </div>
          <div className="mt-1">
            <button
              type="button"
              onClick={onEdit}
              className="text-primary text-[14px] font-semibold hover:underline"
            >
              Edit selection
            </button>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[28px] font-bold tracking-[-0.5px] leading-9 text-[#14182c]">
            {fmtCents(annualCents)}
          </div>
          <div className="text-[13px] text-muted-foreground mt-1">per year</div>
        </div>
      </div>
    </div>
  );
}

function RemainingStepRow({
  icon,
  label,
  statusLabel,
}: {
  icon: React.ReactNode;
  label: string;
  statusLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background px-6 py-3 elevation-3">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[16px] font-bold text-foreground">{label}</div>
        </div>
        <span className="inline-flex items-center rounded-full bg-[#FFF9E6] px-3 py-1 text-[12px] font-semibold text-[#BF8A00]">
          {statusLabel}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function SpendingAccountsCheckpointPage() {
  const navigate = useNavigate();

  /* ---- Plans data ---- */
  const dependents = safeReadJSON<DependentsState>(DEPENDENTS_STORAGE_KEY);
  const medical = safeReadJSON<PlanPickState>(MEDICAL_KEY);
  const dental = safeReadJSON<PlanPickState>(DENTAL_KEY);
  const vision = safeReadJSON<PlanPickState>(VISION_KEY);

  const currentPlanSnapshot: PlanSnapshot = {
    medical: medical ?? null,
    dental: dental ?? null,
    vision: vision ?? null,
  };
  const planSubmission = safeReadJSON<PlanSubmissionState>(PLAN_SUBMISSION_KEY);
  const plansSubmitted =
    planSubmission?.version === 1 && planSubmission?.snapshot
      ? sameSnapshot(planSubmission.snapshot, currentPlanSnapshot)
      : false;
  const planStatus: "pending" | "submitted" = plansSubmitted
    ? "submitted"
    : "pending";

  const dependentCountForMedical = (medical?.enrollees ?? []).filter(
    (id) => id !== "myself",
  ).length;
  const medicalAmount = medicalYouPay(
    medical?.selectedPlanId ?? null,
    dependentCountForMedical,
  );
  const dentalAmount = dentalYouPay(dental?.selectedPlanId ?? null);
  const visionAmount = visionYouPay(vision?.selectedPlanId ?? null);
  const plansTotal = medicalAmount + dentalAmount + visionAmount;

  /* ---- Spending data ---- */
  const spending = loadSpendingAccountsState();
  const fsa = loadFsaState();
  const lpfsa = loadLpfsaState();
  const dcfsa = loadDcfsaState();
  const hra = loadHraState();
  const hsa = loadHsaState();

  const isHDHP = isHDHPSelected();
  const hsaAmount = hsa.electionCents / 100;
  const hsaConfigured = isHDHP && hsa.electionCents > 0;

  const totalCents =
    fsa.electionCents +
    lpfsa.electionCents +
    dcfsa.electionCents +
    hra.electionCents +
    hsa.electionCents;
  const taxSavingsCents = Math.round(totalCents * TAX_RATE);
  const perPayCents =
    PAY_PERIODS > 0 ? Math.round(totalCents / PAY_PERIODS) : 0;

  const spendingStatus: "pending" | "submitted" = spending.submitted ? "submitted" : "pending";

  // Include HSA in displayed accounts if HDHP selected and configured
  const displayedSpendingAccounts = [...spending.selected];
  if (isHDHP && hsa.electionCents > 0 && !displayedSpendingAccounts.includes("hsa")) {
    displayedSpendingAccounts.push("hsa");
  }

  const [submitOpen, setSubmitOpen] = React.useState(false);
  const [stepsOpen, setStepsOpen] = React.useState(true);

  // Track whether plans were also submitted in this action (for dialog messaging)
  const [plansAlsoSubmitted, setPlansAlsoSubmitted] = React.useState(false);

  const handleSubmit = () => {
    // If plans haven't been submitted yet, submit them now along with spending accounts
    if (!plansSubmitted) {
      try {
        localStorage.setItem(
          PLAN_SUBMISSION_KEY,
          JSON.stringify({
            version: 1,
            submittedAtIso: new Date().toISOString(),
            snapshot: currentPlanSnapshot,
          }),
        );
      } catch { /* ignore */ }
      setPlansAlsoSubmitted(true);
    }
    saveSpendingAccountsSubmission({ fsa, lpfsa, dcfsa, hra });
    markSpendingAccountsSubmitted();
    setSubmitOpen(true);
  };

  const goToSupplemental = () =>
    navigate("/enrollment/accident-insurance");

  const accountRoute = (id: string) => {
    if (id === "fsa") return "/enrollment/fsa";
    if (id === "lpfsa") return "/enrollment/lpfsa";
    if (id === "dcfsa") return "/enrollment/dcfsa";
    if (id === "hsa") return "/enrollment/hsa";
    return "/enrollment/hra";
  };

  return (
    <EnrollmentLayout
      progressStepId="voluntary-supplemental-benefits"
      onStepChange={(id) => {
        if (id === "select-plans")
          return navigate("/enrollment/medical-plans");
        if (id === "spending-accounts")
          return navigate("/enrollment/spending-accounts");
        if (id === "voluntary-supplemental-benefits")
          return navigate("/enrollment/accident-insurance");
        navigate(`/enrollment/${id}`);
      }}
      onBack={() => {
        const lastStep = spending.selected[spending.selected.length - 1];
        navigate(
          lastStep
            ? `/enrollment/${lastStep}`
            : "/enrollment/spending-accounts",
        );
      }}
      onNext={() => {}}
      primaryAction={{ label: "Save & Continue", onClick: goToSupplemental }}
      secondaryAction={{
        label: plansSubmitted ? "Submit selected accounts" : "Submit plans & accounts",
        onClick: handleSubmit,
      }}
    >
      <div className="pt-14 flex justify-center">
        <div className="w-[min(860px,92vw)] pb-8">
          {/* ---- Page header ---- */}
          <h2 className="text-[44px] font-black tracking-[-0.8px] text-foreground text-center">
            Enrollment Checkpoint
          </h2>
          <p className="mt-2 text-[15px] text-muted-foreground text-center max-w-[600px] mx-auto">
            Your progress is saved. You can confirm these accounts now, or
            simply save them and keep going—you&apos;ll have one final chance to
            review everything at the end.
          </p>

          {/* ---- Icon ---- */}
          

          {/* ============================================================ */}
          {/*  PLAN SELECTIONS                                              */}
          {/* ============================================================ */}
          <div className="mt-10 text-center">
            <div className="text-[22px] font-bold text-foreground">
              Your Plan Selections…
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <PlanSelectionRow
              icon={<Heart className="h-6 w-6" />}
              title="Medical Plan"
              status={planStatus}
              planLine={`${medicalPlanLabel(medical?.selectedPlanId ?? null)} • ${enrolleeNames(medical?.enrollees, dependents)}`}
              amount={formatCurrency(medicalAmount)}
              onEdit={() => navigate("/enrollment/medical-plans")}
            />
            {hsaConfigured && (
              <PlanSelectionRow
                icon={<Wallet className="h-6 w-6" />}
                title="HSA"
                status={spendingStatus}
                planLine={`Annual contribution: ${formatCurrency(hsaAmount * 26)}`}
                amount={formatCurrency(hsaAmount)}
                onEdit={() => navigate("/enrollment/hsa")}
              />
            )}
            <PlanSelectionRow
              icon={<Smile className="h-6 w-6" />}
              title="Dental Plan"
              status={planStatus}
              planLine={`${dentalPlanLabel(dental?.selectedPlanId ?? null)} • ${enrolleeNames(dental?.enrollees, dependents)}`}
              amount={formatCurrency(dentalAmount)}
              onEdit={() => navigate("/enrollment/dental-plans")}
            />
            <PlanSelectionRow
              icon={<Eye className="h-6 w-6" />}
              title="Vision Plan"
              status={planStatus}
              planLine={`${visionPlanLabel(vision?.selectedPlanId ?? null)} • ${(vision?.selectedPlanId ?? "") === "waive" ? "No coverage" : enrolleeNames(vision?.enrollees, dependents)}`}
              amount={formatCurrency(visionAmount)}
              onEdit={() => navigate("/enrollment/vision-plans")}
            />
          </div>

          {/* Plans total card */}
          <div className="mt-6 flex justify-end">
            <div className="rounded-2xl border border-border bg-background px-6 py-4 elevation-3">
              <div className="text-[14px] font-semibold text-foreground">
                Plans Total (you pay)
              </div>
              <div className="mt-1 flex items-end justify-between gap-6">
                <div className="text-[14px] text-muted-foreground">
                  {hsaConfigured ? "Medical + HSA + Dental + Vision" : "Medical + Dental + Vision"}
                </div>
                <div className="text-right">
                  <div className="text-[26px] font-bold tracking-[-0.4px] leading-7 text-[#14182c]">
                    {formatCurrency(plansTotal)}
                  </div>
                  <div className="text-[12px] text-muted-foreground mt-1">
                    bi-weekly
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/*  SPENDING ACCOUNT SELECTIONS                                  */}
          {/* ============================================================ */}
          <div className="mt-10 text-center">
            <div className="text-[22px] font-bold text-foreground">
              Your Spending Account Selections…
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {displayedSpendingAccounts.map((id) => {
              const annualCents =
                id === "fsa"
                  ? fsa.electionCents
                  : id === "lpfsa"
                    ? lpfsa.electionCents
                    : id === "dcfsa"
                      ? dcfsa.electionCents
                      : id === "hra"
                        ? hra.electionCents
                        : hsa.electionCents;
              return (
                <SpendingAccountRow
                  key={id}
                  label={id.toUpperCase()}
                  status={spendingStatus}
                  annualCents={annualCents}
                  onEdit={() => navigate(accountRoute(id))}
                />
              );
            })}
          </div>

          {/* Total spending accounts card */}
          {totalCents > 0 && (
            <div className="mt-6 flex justify-end">
              <div className="rounded-2xl border border-border bg-background px-6 py-4 elevation-3">
                <div className="text-[14px] font-semibold text-foreground mb-2">
                  Total Spending Accounts
                </div>
                <div className="space-y-1 text-[14px] text-muted-foreground">
                  <div className="flex justify-between gap-6">
                    <span>Election for the year:</span>
                    <span className="font-semibold text-[#14182c]">
                      {fmtCents(totalCents)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span>Tax savings (est.):</span>
                    <span className="font-semibold text-[#14182c]">
                      {fmtCents(taxSavingsCents)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span>Bi-weekly:</span>
                    <span className="font-semibold text-[#14182c]">
                      {fmtCents(perPayCents)}
                    </span>
                  </div>
                  
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/*  REMAINING STEPS                                              */}
          {/* ============================================================ */}
          <div className="mt-10">
            <button
              type="button"
              className="mx-auto flex items-center justify-center gap-2 rounded-md px-2 py-1 text-center hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
              onClick={() => setStepsOpen((v) => !v)}
            >
              <span className="text-[22px] font-bold text-foreground">
                Your Remaining Enrollment Steps…
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-foreground transition-transform",
                  stepsOpen ? "rotate-180" : "rotate-0",
                )}
              />
            </button>
          </div>

          <div className={cn("mt-6 space-y-4", !stepsOpen && "hidden")}>
            <RemainingStepRow
              icon={<Send className="h-5 w-5" />}
              label="Supplemental Benefits"
              statusLabel="Not started"
            />
            <RemainingStepRow
              icon={<ClipboardCheck className="h-5 w-5" />}
              label="Review and submit"
              statusLabel="Not started"
            />
          </div>

          {/* ---- Footer disclaimer ---- */}
          <div className="mt-8 text-center text-[14px] leading-5 text-muted-foreground">
            <p>
              {plansSubmitted
                ? "Choose \"Submit selected accounts\" to confirm these selections now. You can still make changes until the enrollment deadline."
                : "Choose \"Submit plans & accounts\" to confirm all pending selections now. You can still make changes until the enrollment deadline."}
            </p>
            <p className="mt-2">
              Choose &quot;Save &amp; Continue&quot; to move to the next step
              and submit all your choices together at the end.
            </p>
          </div>
        </div>
      </div>

      {/* ---- Submit confirmation dialog (matches Plans submitted modal style) ---- */}
      <WexDialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <WexDialog.Content size="lg" aria-describedby={undefined} className="pt-12 pb-4">
          <div className="flex justify-center pt-6 pb-2">
            <EnrollmentSuccessIllustration className="w-[280px] h-auto" alt="Success illustration" />
          </div>

          <WexDialog.Header className="text-center">
            <WexDialog.Title className="text-[28px] font-bold text-center text-[#14182c]">
              {plansAlsoSubmitted ? "Plans & Accounts Submitted!" : "Spending Accounts Submitted!"}
            </WexDialog.Title>
          </WexDialog.Header>

          <div className="px-10 pb-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-[14px] font-semibold text-success">Successfully Submitted</span>
            </div>

            <p className="text-[16px] leading-6 text-[#7a87b2] w-fit mx-auto">
              {plansAlsoSubmitted
                ? "You've submitted your plan selections and spending account elections. You can update them until the end of the enrollment period."
                : "You've submitted your spending account elections. You can update them until the end of the enrollment period."}
            </p>

            <p className="mt-3 text-[14px] text-muted-foreground">
              You still have other enrollment steps to complete.
            </p>
          </div>

          <WexDialog.Footer className="justify-center items-center pb-6 sm:justify-center text-center">
            <WexButton
              intent="primary"
              onClick={() => {
                setSubmitOpen(false);
                goToSupplemental();
              }}
              className="min-w-[200px]"
            >
              Continue to Next Step
            </WexButton>
          </WexDialog.Footer>
        </WexDialog.Content>
      </WexDialog>
    </EnrollmentLayout>
  );
}