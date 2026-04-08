import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Printer,
  Heart,
  Smile,
  Eye,
  CircleDollarSign,
  ShieldCheck,
  Building2,
  Users,
  Info,
} from "lucide-react";
import { WexButton } from "@wex/components-react/actions";
import { WexBadge } from "@wex/components-react/data-display";
import { WexSeparator } from "@wex/components-react/layout";
import { WexDialog } from "@wex/components-react/overlays";
import { loadEnrollmentSubmission } from "@/lib/enrollmentSubmissionStorage";
import {
  coveragePeriodFromEffectiveDate,
  EFFECTIVE_DATE,
} from "@/lib/enrollmentCoveragePeriod";
import { loadHsaState } from "@/lib/hsaStorage";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PAY_PERIODS = 26;
const coveragePeriod = coveragePeriodFromEffectiveDate(EFFECTIVE_DATE);

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmtCents(cents: number): string {
  const dollars = (cents / 100).toFixed(2);
  const [intPart, decPart] = dollars.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${withCommas}.${decPart ?? "00"}`;
}

function formatCurrency(amount: number): string {
  const fixed = amount.toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${withCommas}.${decPart ?? "00"}`;
}

function planLabel(
  kind: "medical" | "dental" | "vision",
  id: string | null,
): string {
  if (!id) return "No selection";
  if (id === "waive") return "Waive Coverage";
  if (kind === "medical")
    return id === "acme-hdhp"
      ? "ACME HDHP HSA"
      : id === "acme-ppo"
        ? "ACME Enhanced PPO"
        : id;
  return id === "premium" ? "Premium" : id === "basic" ? "Basic" : id;
}

function enrolleeLabel(
  enrolleeIds: string[] | undefined,
  dependents: { id: string; name: string }[],
): string {
  const ids = enrolleeIds ?? [];
  const depMap = new Map(dependents.map((d) => [d.id, d.name] as const));
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
  const tables: Record<string, Record<string, number>> = {
    "acme-hdhp": {
      employeeOnly: 138.46,
      employeeSpouse: 138.46,
      family: 138.46,
    },
    "acme-ppo": {
      employeeOnly: 138.46,
      employeeSpouse: 138.46,
      family: 138.46,
    },
    waive: { employeeOnly: 0, employeeSpouse: 0, family: 0 },
  };
  const table = tables[planId ?? ""] ?? tables.waive;
  return table[tier] ?? 0;
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

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    }) + ", " + d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return iso;
  }
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Column header row for Plans / Supplemental tables */
function BenefitTableHeader() {
  return (
    <div className="grid grid-cols-[1fr_1.4fr_auto_auto] items-center gap-4 px-6 py-3 text-[12px] text-muted-foreground tracking-wide bg-muted/50 border-b border-border">
      <span className="font-semibold">Benefit</span>
      <span className="font-semibold">Plan &amp; coverage</span>
      <span className="font-semibold w-[140px]">Status</span>
      <span className="font-semibold w-[100px] text-right italic">
        Cost (bi-weekly)
      </span>
    </div>
  );
}

/** Column header row for Spending Accounts table */
function SpendingTableHeader() {
  return (
    <div className="grid grid-cols-[1fr_1.4fr_auto_auto] items-center gap-4 px-6 py-3 text-[12px] text-muted-foreground tracking-wide bg-muted/50 border-b border-border">
      <span className="font-semibold">Account</span>
      <span className="font-semibold">Election &amp; plan year</span>
      <span className="font-semibold w-[140px]">Status</span>
      <span className="font-semibold w-[100px] text-right italic">
        Cost (bi-weekly)
      </span>
    </div>
  );
}

type PlanRowProps = {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  planName: string;
  enrolledLabel: string;
  employerPays: string;
  docsNeededFor?: string[];
  costAmount: string;
  showDocsWarning?: boolean;
};

function PlanRow({
  icon,
  iconBg,
  title,
  planName,
  enrolledLabel,
  employerPays,
  docsNeededFor,
  costAmount,
  showDocsWarning,
}: PlanRowProps) {
  const [docsModalOpen, setDocsModalOpen] = React.useState(false);

  return (
    <>
      <div className="grid grid-cols-[1fr_1.4fr_auto_auto] items-start gap-4 px-6 py-5 border-t border-border">
        {/* Benefit column */}
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
          >
            {icon}
          </div>
          <span className="text-[14px] font-semibold text-foreground">
            {title}
          </span>
        </div>

        {/* Plan & coverage column */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-semibold text-foreground">
            {planName}
          </span>
          <span className="text-[13px] text-muted-foreground flex items-center gap-1.5">
            Enrolled: {enrolledLabel}
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
          </span>
          {docsNeededFor && docsNeededFor.length > 0 && (
            null
          )}
          <span className="text-[13px] text-muted-foreground">
            Employer pays: {employerPays} bi-weekly
          </span>
          <span className="text-[13px] text-muted-foreground">
            Coverage period: {coveragePeriod}
          </span>
        </div>

        {/* Status column */}
        <div className="w-[140px] pt-0.5 flex flex-col gap-1 items-start">
          <WexBadge intent="success" pill style={{ backgroundColor: "#D0FAE5", color: "#006045", boxShadow: "none" }}>
            Submitted
          </WexBadge>
          {showDocsWarning && (
            null
          )}
        </div>

        {/* Cost column */}
        <div className="w-[100px] text-right">
          <div className="text-[18px] font-bold text-[#14182c]">
            {costAmount}
          </div>
          <div className="text-[11px] text-muted-foreground">
            you pay: bi-weekly
          </div>
          {showDocsWarning && (
            <div className="mt-1 text-[11px] text-muted-foreground">
              if docs not approved:
              <br />
              {costAmount}
            </div>
          )}
        </div>
      </div>

      {/* Missing documentation modal */}
      <WexDialog open={docsModalOpen} onOpenChange={setDocsModalOpen}>
        <WexDialog.Content size="md" aria-describedby={undefined}>
          <WexDialog.Header>
            <WexDialog.Title>Missing dependent documentation</WexDialog.Title>
          </WexDialog.Header>

          <div className="flex flex-col gap-4 py-2">
            <p className="text-[14px] text-foreground">
              <span className="font-semibold">Benefit:</span> {title}
            </p>

            <div>
              <p className="text-[14px] font-semibold text-foreground mb-2">
                Dependents missing documents
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                {(docsNeededFor ?? []).map((name) => (
                  <li key={name} className="text-[14px] text-foreground">
                    {name}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[14px] font-semibold text-foreground mb-2">
                Required documents
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li className="text-[14px] text-foreground">Birth certificate</li>
                <li className="text-[14px] text-foreground">Marriage certificate</li>
                <li className="text-[14px] text-foreground">Adoption papers</li>
              </ul>
            </div>

            <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3">
              <p className="text-[13px] text-warning-text">
                Documents must be submitted for each dependent to finalize
                coverage and pricing.
              </p>
            </div>
          </div>

          <WexDialog.Footer className="gap-2 sm:gap-0">
            <WexDialog.Close asChild>
              <WexButton variant="ghost" intent="secondary">
                Close
              </WexButton>
            </WexDialog.Close>
            <WexButton
              variant="outline"
              intent="primary"
              onClick={() => setDocsModalOpen(false)}
            >
              Remind me later
            </WexButton>
            <WexButton intent="primary">
              Upload documents
            </WexButton>
          </WexDialog.Footer>
        </WexDialog.Content>
      </WexDialog>
    </>
  );
}

function SpendingRow({
  label,
  annualCents,
}: {
  label: string;
  annualCents: number;
}) {
  const biWeekly = PAY_PERIODS > 0 ? annualCents / 100 / PAY_PERIODS : 0;
  return (
    <div className="grid grid-cols-[1fr_1.4fr_auto_auto] items-start gap-4 px-6 py-5 border-t border-border">
      {/* Account column */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 bg-success/10">
          <CircleDollarSign className="h-5 w-5 text-success-text" />
        </div>
        <span className="text-[14px] font-semibold text-foreground">
          {label}
        </span>
      </div>

      {/* Election & plan year column */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[14px] text-foreground">
          Annual election: {fmtCents(annualCents)}
        </span>
        <span className="text-[13px] text-muted-foreground">
          Plan year: {coveragePeriod}
        </span>
      </div>

      {/* Status column */}
      <div className="w-[140px] pt-0.5">
        <WexBadge intent="success" pill style={{ backgroundColor: "#D0FAE5", color: "#006045", boxShadow: "none" }}>
          Submitted
        </WexBadge>
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
}

function SupplementalRow({
  icon,
  iconBg,
  title,
  planName,
  enrolledLabel,
  monthlyPremium,
  biWeeklyCost,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  planName: string;
  enrolledLabel: string;
  monthlyPremium: number;
  biWeeklyCost: number;
}) {
  return (
    <div className="grid grid-cols-[1fr_1.4fr_auto_auto] items-start gap-4 px-6 py-5 border-t border-border">
      {/* Benefit column */}
      <div className="flex items-center gap-3">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
        >
          {icon}
        </div>
        <span className="text-[14px] font-semibold text-foreground">
          {title}
        </span>
      </div>

      {/* Plan & coverage column */}
      <div className="flex flex-col gap-0.5">
        <span className="text-[14px] font-semibold text-foreground">
          {planName}
        </span>
        <span className="text-[13px] text-muted-foreground flex items-center gap-1.5">
          {enrolledLabel}
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
        </span>
        <span className="text-[13px] text-muted-foreground">
          Premium: {formatCurrency(monthlyPremium)} monthly
        </span>
        <span className="text-[13px] text-muted-foreground">
          Coverage period: {coveragePeriod}
        </span>
      </div>

      {/* Status column */}
      <div className="w-[140px] pt-0.5">
        <WexBadge intent="success" pill style={{ backgroundColor: "#D0FAE5", color: "#006045", boxShadow: "none" }}>
          Submitted
        </WexBadge>
      </div>

      {/* Cost column */}
      <div className="w-[100px] text-right">
        <div className="text-[18px] font-bold text-[#14182c]">
          {formatCurrency(biWeeklyCost)}
        </div>
        <div className="text-[11px] text-muted-foreground">
          you pay: bi-weekly
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pending docs alert banner + modal                                  */
/* ------------------------------------------------------------------ */

function PendingDocsAlert({
  medicalDocsNeeded,
  dentalDocsNeeded,
}: {
  medicalDocsNeeded: string[];
  dentalDocsNeeded: string[];
}) {
  const [open, setOpen] = React.useState(false);

  const planSections: { label: string; dependents: string[] }[] = [
    ...(medicalDocsNeeded.length > 0
      ? [{ label: "Medical Plan", dependents: medicalDocsNeeded }]
      : []),
    ...(dentalDocsNeeded.length > 0
      ? [{ label: "Dental Plan", dependents: dentalDocsNeeded }]
      : []),
  ];

  return (
    <>
      <div className="mt-4 mb-6 rounded-xl border border-warning/30 bg-warning/10 px-5 py-4">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-warning-text mt-0.5 shrink-0" />
          <div>
            <div className="text-[14px] font-semibold text-warning-text">
              Documentation required for dependents
            </div>
            <p className="text-[13px] text-warning-text mt-0.5">
              Please upload dependent verification documents for Medical
              Plan and Dental Plan by Jan 31, 2025.
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="text-[13px] text-primary font-semibold underline mt-1 inline-block hover:opacity-80"
            >
              See pending documentation
            </button>
          </div>
        </div>
      </div>

      <WexDialog open={open} onOpenChange={setOpen}>
        <WexDialog.Content size="md" aria-describedby={undefined}>
          <WexDialog.Header>
            <WexDialog.Title>Missing dependent documentation</WexDialog.Title>
          </WexDialog.Header>

          <div className="flex flex-col gap-4 py-2">
            {planSections.map(({ label, dependents }) => (
              <div key={label}>
                <p className="text-[14px] font-semibold text-foreground mb-2">
                  {label}
                </p>
                <ul className="list-disc pl-5 flex flex-col gap-1">
                  {dependents.map((name) => (
                    <li key={name} className="text-[14px] text-foreground">
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <p className="text-[14px] font-semibold text-foreground mb-2">
                Required documents
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li className="text-[14px] text-foreground">Birth certificate</li>
                <li className="text-[14px] text-foreground">Marriage certificate</li>
                <li className="text-[14px] text-foreground">Adoption papers</li>
              </ul>
            </div>

            <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3">
              <p className="text-[13px] text-warning-text">
                Documents must be submitted for each dependent to finalize
                coverage and pricing.
              </p>
            </div>
          </div>

          <WexDialog.Footer className="gap-2 sm:gap-0">
            <WexDialog.Close asChild>
              <WexButton variant="ghost" intent="secondary">
                Close
              </WexButton>
            </WexDialog.Close>
            <WexButton
              variant="outline"
              intent="primary"
              onClick={() => setOpen(false)}
            >
              Remind me later
            </WexButton>
            <WexButton intent="primary">
              Upload documents
            </WexButton>
          </WexDialog.Footer>
        </WexDialog.Content>
      </WexDialog>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function EnrollmentStatementPage() {
  const navigate = useNavigate();
  const submission = React.useMemo(() => loadEnrollmentSubmission(), []);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("print") === "1") {
      setTimeout(() => window.print(), 500);
    }
  }, []);

  if (!submission) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-[400px]">
          <h1 className="text-[24px] font-bold text-foreground">
            No enrollment found
          </h1>
          <p className="mt-2 text-[14px] text-muted-foreground">
            Complete your enrollment to view your statement.
          </p>
          <WexButton
            intent="primary"
            className="mt-6"
            onClick={() => navigate("/enrollment/profile")}
          >
            Start Enrollment
          </WexButton>
        </div>
      </div>
    );
  }

  const { plans, spendingAccounts: spending, supplemental, household } =
    submission.snapshot;
  const dependentsList = household?.dependents ?? [];
  const selectedDepIds = household?.selectedIds ?? [];

  // Load HSA state
  const hsaState = loadHsaState();

  /* ---- Plan cost calculations ---- */
  const medDepCount = (plans.medical?.enrollees ?? []).filter(
    (id) => id !== "myself",
  ).length;
  const medicalCost = medicalYouPay(
    plans.medical?.selectedPlanId ?? null,
    medDepCount,
  );
  const medicalEmployer = medicalEmployerPays(
    plans.medical?.selectedPlanId ?? null,
    medDepCount,
  );
  const dentalCost = dentalYouPay(plans.dental?.selectedPlanId ?? null);
  const visionCost = visionYouPay(plans.vision?.selectedPlanId ?? null);
  const plansCostBiWeekly = medicalCost + dentalCost + visionCost;
  const employerPaysBiWeekly = medicalEmployer;

  /* ---- Spending calculations ---- */
  const { fsa, lpfsa, dcfsa, hra } = spending.elections;
  const hsaElectionCents = hsaState?.electionCents ?? 0;
  const spendingTotalCents =
    fsa.electionCents +
    lpfsa.electionCents +
    dcfsa.electionCents +
    hra.electionCents +
    hsaElectionCents;
  const spendingBiWeekly =
    PAY_PERIODS > 0 ? spendingTotalCents / 100 / PAY_PERIODS : 0;

  /* ---- Supplemental calculations ---- */
  const accidentMonthly = accidentInsuranceMonthly(
    supplemental?.accidentInsurance?.selectedPlanId ?? null,
  );
  const hospitalMonthly = hospitalIndemnityMonthly(
    supplemental?.hospitalIndemnity?.selectedPlanId ?? null,
  );
  // Monthly premiums divided by 2 for bi-weekly
  const accidentBiWeekly = accidentMonthly / 2;
  const hospitalBiWeekly = hospitalMonthly / 2;
  const supplementalBiWeekly = accidentBiWeekly + hospitalBiWeekly;

  const totalYouPayBiWeekly =
    plansCostBiWeekly + spendingBiWeekly + supplementalBiWeekly;

  /* ---- Docs needed logic ---- */
  const docsNeededDeps = dependentsList.filter((d) =>
    selectedDepIds.includes(d.id) && d.userAdded === true,
  );
  const hasPendingDocs = docsNeededDeps.length > 0;

  // Which plans have dependents enrolled (docs needed for those)
  const medicalDocsNeeded = (plans.medical?.enrollees ?? [])
    .filter((id) => id !== "myself")
    .map((id) => dependentsList.find((d) => d.id === id)?.name)
    .filter(Boolean) as string[];
  const dentalDocsNeeded = (plans.dental?.enrollees ?? [])
    .filter((id) => id !== "myself")
    .map((id) => dependentsList.find((d) => d.id === id)?.name)
    .filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-background py-10 px-4 print:bg-white print:py-0">
      <div className="max-w-[960px] mx-auto">
        {/* ---- Header ---- */}
        <div className="flex items-start justify-between mb-2 print:hidden">
          <div>
            <h1 className="text-[24px] font-bold leading-8 tracking-[-0.456px] text-foreground">
              Enrollment statement
            </h1>
            <p className="mt-1 text-[14px] leading-6 tracking-[-0.084px] text-muted-foreground">
              Submitted: {formatTimestamp(submission.submittedAtIso)}
            </p>
          </div>
          <div className="flex gap-2">
            <WexButton
              variant="outline"
              intent="primary"
              onClick={() => navigate("/enrollment/home")}
            >
              Go Home
            </WexButton>
            <WexButton intent="primary" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Print
            </WexButton>
          </div>
        </div>

        {/* Print-only header */}
        <div className="hidden print:block mb-6">
          <h1 className="text-[24px] font-bold">
            WEX Enrollment Statement
          </h1>
          <p className="text-[13px] text-muted-foreground">
            Submitted: {formatTimestamp(submission.submittedAtIso)}
          </p>
        </div>

        {/* ---- Documentation alert ---- */}
        {hasPendingDocs && (
          <PendingDocsAlert
            medicalDocsNeeded={medicalDocsNeeded}
            dentalDocsNeeded={dentalDocsNeeded}
          />
        )}

        {/* ============================================================ */}
        {/*  PLANS                                                        */}
        {/* ============================================================ */}
        <section className="mt-6">
          <h3 className="text-[20px] font-bold text-foreground mb-4">Plans</h3>
          <div className="rounded-2xl border border-border bg-background elevation-3 overflow-hidden">
            <BenefitTableHeader />
            <PlanRow
              icon={<Heart className="h-5 w-5 text-primary" />}
              iconBg="bg-primary/10"
              title="Medical Plan"
              planName={planLabel(
                "medical",
                plans.medical?.selectedPlanId ?? null,
              )}
              enrolledLabel={enrolleeLabel(
                plans.medical?.enrollees,
                dependentsList,
              )}
              employerPays={formatCurrency(medicalEmployer)}
              docsNeededFor={
                medicalDocsNeeded.length > 0 ? medicalDocsNeeded : undefined
              }
              costAmount={formatCurrency(medicalCost)}
              showDocsWarning={medicalDocsNeeded.length > 0}
            />
            <PlanRow
              icon={<Smile className="h-5 w-5 text-primary" />}
              iconBg="bg-primary/10"
              title="Dental Plan"
              planName={planLabel(
                "dental",
                plans.dental?.selectedPlanId ?? null,
              )}
              enrolledLabel={enrolleeLabel(
                plans.dental?.enrollees,
                dependentsList,
              )}
              employerPays={formatCurrency(0)}
              docsNeededFor={
                dentalDocsNeeded.length > 0 ? dentalDocsNeeded : undefined
              }
              costAmount={formatCurrency(dentalCost)}
              showDocsWarning={dentalDocsNeeded.length > 0}
            />
            <PlanRow
              icon={<Eye className="h-5 w-5 text-primary" />}
              iconBg="bg-primary/10"
              title="Vision Plan"
              planName={planLabel(
                "vision",
                plans.vision?.selectedPlanId ?? null,
              )}
              enrolledLabel={enrolleeLabel(
                plans.vision?.enrollees,
                dependentsList,
              )}
              employerPays={formatCurrency(0)}
              costAmount={formatCurrency(visionCost)}
            />
          </div>
        </section>

        {/* ============================================================ */}
        {/*  SPENDING ACCOUNTS                                            */}
        {/* ============================================================ */}
        {(spending.selected.length > 0 || hsaElectionCents > 0) && (
          <section className="mt-10">
            <h3 className="text-[20px] font-bold text-foreground mb-4">
              Spending Accounts
            </h3>
            <div className="rounded-2xl border border-border bg-background elevation-3 overflow-hidden">
              <SpendingTableHeader />
              {spending.selected.includes("fsa") &&
                fsa.electionCents > 0 && (
                  <SpendingRow label="FSA" annualCents={fsa.electionCents} />
                )}
              {spending.selected.includes("lpfsa") &&
                lpfsa.electionCents > 0 && (
                  <SpendingRow
                    label="LPFSA"
                    annualCents={lpfsa.electionCents}
                  />
                )}
              {spending.selected.includes("dcfsa") &&
                dcfsa.electionCents > 0 && (
                  <SpendingRow
                    label="DCFSA"
                    annualCents={dcfsa.electionCents}
                  />
                )}
              {spending.selected.includes("hra") &&
                hra.electionCents > 0 && (
                  <SpendingRow label="HRA" annualCents={hra.electionCents} />
                )}
              {hsaElectionCents > 0 && (
                <SpendingRow label="HSA" annualCents={hsaElectionCents} />
              )}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/*  SUPPLEMENTAL BENEFITS                                        */}
        {/* ============================================================ */}
        <section className="mt-10">
          <h3 className="text-[20px] font-bold text-foreground mb-4">
            Supplemental Benefits
          </h3>
          <div className="rounded-2xl border border-border bg-background elevation-3 overflow-hidden">
            <BenefitTableHeader />
            <SupplementalRow
              icon={<ShieldCheck className="h-5 w-5 text-success-text" />}
              iconBg="bg-success/10"
              title="Accident insurance"
              planName={
                supplemental?.accidentInsurance?.selectedPlanId ??
                "No selection"
              }
              enrolledLabel={enrolleeLabel(
                supplemental?.accidentInsurance?.enrollees,
                dependentsList,
              )}
              monthlyPremium={accidentInsuranceMonthly(
                supplemental?.accidentInsurance?.selectedPlanId ?? null,
              )}
              biWeeklyCost={accidentBiWeekly}
            />
            <SupplementalRow
              icon={<Building2 className="h-5 w-5 text-destructive" />}
              iconBg="bg-destructive/10"
              title="Hospital indemnity"
              planName={
                supplemental?.hospitalIndemnity?.selectedPlanId ??
                "No selection"
              }
              enrolledLabel={enrolleeLabel(
                supplemental?.hospitalIndemnity?.enrollees,
                dependentsList,
              )}
              monthlyPremium={hospitalIndemnityMonthly(
                supplemental?.hospitalIndemnity?.selectedPlanId ?? null,
              )}
              biWeeklyCost={hospitalBiWeekly}
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
                <span className="text-[20px] font-bold text-foreground">
                  {formatCurrency(employerPaysBiWeekly)}
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

        {/* ---- Footer ---- */}
        
      </div>
    </div>
  );
}