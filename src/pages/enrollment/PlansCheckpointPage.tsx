import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  CircleDollarSign,
  ChevronDown,
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
import { loadHsaState } from "@/lib/hsaStorage";
import { isHDHPSelected } from "@/lib/medicalPlanStorage";

const DEPENDENTS_STORAGE_KEY = "enrollment.dependents.v1";
const MEDICAL_KEY = "enrollment.medical-plans.v1";
const DENTAL_KEY = "enrollment.dental-plans.v1";
const VISION_KEY = "enrollment.vision-plans.v1";
const SUBMISSION_KEY = "enrollment.plan-submissions.v1";

type PlanPickState = { enrollees: string[]; selectedPlanId: string | null };
type DependentsState = { version: 1; dependents: { id: string; name: string; ageLabel: string }[] };
type PlanSnapshot = { medical: PlanPickState | null; dental: PlanPickState | null; vision: PlanPickState | null };
type PlanSubmissionState = { version: 1; submittedAtIso: string; snapshot: PlanSnapshot };

function safeReadJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch { return null; }
}

function formatCurrency(amount: number): string {
  const fixed = amount.toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${withCommas}.${decPart ?? "00"}`;
}

function enrolleeNames(enrolleeIds: string[] | undefined, dependents: DependentsState | null): string {
  const ids = enrolleeIds ?? [];
  const depMap = new Map((dependents?.dependents ?? []).map((d) => [d.id, d.name] as const));
  const names = ids.filter((id) => id !== "myself").map((id) => depMap.get(id) ?? "Dependent");
  return ["Myself", ...names].join(", ");
}

function sameSnapshot(a: PlanSnapshot, b: PlanSnapshot): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function medicalPlanLabel(planId: string | null): string {
  switch (planId) {
    case "acme-hdhp": return "ACME HDHP HSA";
    case "acme-ppo": return "ACME Enhanced PPO";
    case "waive": return "Waive Coverage";
    default: return "No selection";
  }
}

function dentalPlanLabel(planId: string | null): string {
  switch (planId) {
    case "premium": return "Premium";
    case "basic": return "Basic";
    case "waive": return "Waive Coverage";
    default: return "No selection";
  }
}

function visionPlanLabel(planId: string | null): string {
  switch (planId) {
    case "premium": return "Premium";
    case "basic": return "Basic";
    case "waive": return "Waive Coverage";
    default: return "No selection";
  }
}

function medicalYouPay(planId: string | null, dependentCount: number): number {
  const tier = dependentCount === 0 ? "employeeOnly" : dependentCount === 1 ? "employeeSpouse" : "family";
  const tables: Record<string, Record<string, { total: number; employerPays: number }>> = {
    "acme-hdhp": { employeeOnly: { total: 215.87, employerPays: 138.46 }, employeeSpouse: { total: 242.31, employerPays: 138.46 }, family: { total: 265.44, employerPays: 138.46 } },
    "acme-ppo": { employeeOnly: { total: 204.16, employerPays: 138.46 }, employeeSpouse: { total: 242.31, employerPays: 138.46 }, family: { total: 259.05, employerPays: 138.46 } },
    waive: { employeeOnly: { total: 0, employerPays: 0 }, employeeSpouse: { total: 0, employerPays: 0 }, family: { total: 0, employerPays: 0 } },
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

type SelectionRowProps = {
  icon: React.ReactNode; title: string; planLine: string;
  status: "pending" | "submitted"; amount: string; onEdit: () => void;
};

function SelectionRow({ icon, title, planLine, status, amount, onEdit }: SelectionRowProps) {
  return (
    <div className="rounded-2xl border border-border bg-background px-6 py-5 elevation-3">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-[18px] font-bold text-foreground">{title}</div>
            <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold",
              status === "pending" ? "bg-[#FFF9E6] text-[#BF8A00]" : "bg-success/10 text-success-text")}>
              {status === "pending" ? "Pending submission" : "Submitted"}
            </span>
          </div>
          <div className="mt-1 text-[14px] text-muted-foreground flex items-center gap-2 flex-wrap">
            <span className="truncate inline-flex items-center gap-2">{planLine}<Users className="h-4 w-4 text-muted-foreground" /></span>
            <button type="button" onClick={onEdit} className="text-primary font-semibold hover:underline">Edit selection</button>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[28px] font-bold tracking-[-0.5px] leading-9 text-[#14182c]">{amount}</div>
          <div className="text-[13px] text-muted-foreground mt-1">bi-weekly</div>
        </div>
      </div>
    </div>
  );
}

function RemainingStepRow({ icon, label, statusLabel }: { icon: React.ReactNode; label: string; statusLabel: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background px-6 py-3 elevation-3">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">{icon}</div>
        <div className="flex-1 min-w-0"><div className="text-[16px] font-bold text-foreground capitalize">{label}</div></div>
        <span className="inline-flex items-center rounded-full bg-[#FFF9E6] px-3 py-1 text-[12px] font-semibold text-[#BF8A00]">{statusLabel}</span>
      </div>
    </div>
  );
}

export default function PlansCheckpointPage() {
  const navigate = useNavigate();
  const dependents = safeReadJSON<DependentsState>(DEPENDENTS_STORAGE_KEY);
  const medical = safeReadJSON<PlanPickState>(MEDICAL_KEY);
  const dental = safeReadJSON<PlanPickState>(DENTAL_KEY);
  const vision = safeReadJSON<PlanPickState>(VISION_KEY);
  const isHDHP = isHDHPSelected();
  const hsaState = loadHsaState();

  const currentSnapshot: PlanSnapshot = { medical: medical ?? null, dental: dental ?? null, vision: vision ?? null };
  const submission = safeReadJSON<PlanSubmissionState>(SUBMISSION_KEY);
  const isSubmitted = submission?.version === 1 && submission?.snapshot ? sameSnapshot(submission.snapshot, currentSnapshot) : false;

  const [submitOpen, setSubmitOpen] = React.useState(false);
  const [warningOpen, setWarningOpen] = React.useState(false);
  const [remainingStepsOpen, setRemainingStepsOpen] = React.useState(true);

  const dependentCountForMedical = (medical?.enrollees ?? []).filter((id) => id !== "myself").length;
  const medicalAmount = medicalYouPay(medical?.selectedPlanId ?? null, dependentCountForMedical);
  const dentalAmount = dentalYouPay(dental?.selectedPlanId ?? null);
  const visionAmount = visionYouPay(vision?.selectedPlanId ?? null);
  const plansTotal = medicalAmount + dentalAmount + visionAmount;
  const status: "pending" | "submitted" = isSubmitted ? "submitted" : "pending";

  const hsaAmount = hsaState.electionCents / 100;
  const hsaConfigured = isHDHP && hsaState.electionCents > 0;

  const hasAnyDependentsCovered = (() => {
    const medicalDeps = (medical?.enrollees ?? []).filter((id) => id !== "myself");
    const dentalDeps = (dental?.enrollees ?? []).filter((id) => id !== "myself");
    const visionDeps = (vision?.enrollees ?? []).filter((id) => id !== "myself");
    return medicalDeps.length > 0 || dentalDeps.length > 0 || visionDeps.length > 0;
  })();

  const handleSubmitClick = () => {
    if (!hasAnyDependentsCovered) {
      setWarningOpen(true);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    try {
      localStorage.setItem(SUBMISSION_KEY, JSON.stringify({ version: 1, submittedAtIso: new Date().toISOString(), snapshot: currentSnapshot }));
    } catch { /* ignore */ }
    setWarningOpen(false);
    setSubmitOpen(true);
  };

  return (
    <EnrollmentLayout
      progressStepId="spending-accounts"
      onStepChange={(id) => {
        if (id === "select-plans") return navigate("/enrollment/medical-plans");
        if (id === "spending-accounts") return navigate("/enrollment/spending-accounts");
        navigate(`/enrollment/${id}`);
      }}
      onBack={() => navigate("/enrollment/vision-plans")}
      onNext={() => {}}
      primaryAction={{ label: "Save & Continue", onClick: () => navigate("/enrollment/spending-accounts") }}
      secondaryAction={{ label: "Submit selected plans", onClick: handleSubmitClick }}
    >
      <div className="pt-14 flex justify-center">
        <div className="w-[min(860px,92vw)]">
          <h2 className="text-[44px] font-black tracking-[-0.8px] text-foreground text-center">Enrollment Checkpoint</h2>
          <p className="mt-2 text-[15px] text-muted-foreground text-center">
            Your progress is saved. You can confirm these plans now, or simply save them and keep going—you'll have one final chance to review everything at the end.
          </p>

          

          <div className="mt-10 text-center">
            <div className="text-[22px] font-bold text-foreground">Your Enrollment Selections so Far…</div>
          </div>

          <div className="mt-6 space-y-4">
            <SelectionRow icon={<Heart className="h-6 w-6" />} title="Medical Plan" status={status}
              planLine={`${medicalPlanLabel(medical?.selectedPlanId ?? null)} • ${enrolleeNames(medical?.enrollees, dependents)}`}
              amount={formatCurrency(medicalAmount)} onEdit={() => navigate("/enrollment/medical-plans")} />
            {hsaConfigured && (
              <SelectionRow icon={<Wallet className="h-6 w-6" />} title="HSA" status={status}
                planLine={`Annual contribution: ${formatCurrency(hsaAmount * 26)}`}
                amount={formatCurrency(hsaAmount)} onEdit={() => navigate("/enrollment/hsa")} />
            )}
            <SelectionRow icon={<Smile className="h-6 w-6" />} title="Dental Plan" status={status}
              planLine={`${dentalPlanLabel(dental?.selectedPlanId ?? null)} • ${enrolleeNames(dental?.enrollees, dependents)}`}
              amount={formatCurrency(dentalAmount)} onEdit={() => navigate("/enrollment/dental-plans")} />
            <SelectionRow icon={<Eye className="h-6 w-6" />} title="Vision Plan" status={status}
              planLine={`${visionPlanLabel(vision?.selectedPlanId ?? null)} • ${(vision?.selectedPlanId ?? "") === "waive" ? "No coverage" : enrolleeNames(vision?.enrollees, dependents)}`}
              amount={formatCurrency(visionAmount)} onEdit={() => navigate("/enrollment/vision-plans")} />
          </div>

          <div className="mt-6 flex justify-end">
            <div className="rounded-2xl border border-border bg-background px-6 py-4 elevation-3">
              <div className="text-[14px] font-semibold text-foreground">Plans Total (you pay)</div>
              <div className="mt-1 flex items-end justify-between gap-6">
                <div className="text-[14px] text-muted-foreground">
                  {hsaConfigured ? "Medical + HSA + Dental + Vision" : "Medical + Dental + Vision"}
                </div>
                <div className="text-right">
                  <div className="text-[26px] font-bold tracking-[-0.4px] leading-7 text-[#14182c]">{formatCurrency(plansTotal)}</div>
                  <div className="text-[12px] text-muted-foreground mt-1">bi-weekly</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <button type="button"
              className="mx-auto flex items-center justify-center gap-2 rounded-md px-2 py-1 text-center hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
              onClick={() => setRemainingStepsOpen((v) => !v)}>
              <span className="text-[22px] font-bold text-foreground">Your Remaining Enrollment steps…</span>
              <ChevronDown className={cn("h-5 w-5 text-foreground transition-transform", remainingStepsOpen ? "rotate-180" : "rotate-0")} />
            </button>
          </div>

          <div className={cn("mt-6 space-y-4", !remainingStepsOpen && "hidden")}>
            <RemainingStepRow icon={<CircleDollarSign className="h-5 w-5" />} label="Spending Accounts" statusLabel="Not started" />
            <RemainingStepRow icon={<Send className="h-5 w-5" />} label="Supplemental Benefits" statusLabel="Not started" />
            <RemainingStepRow icon={<ClipboardCheck className="h-5 w-5" />} label="Review and submit" statusLabel="Not started" />
          </div>

          <div className="mt-8 text-center text-[14px] leading-4 text-muted-foreground">
            <p>Choose &quot;Submit selected plans&quot; to confirm these selections now. You can still make changes until the enrollment deadline.</p>
            <p className="mt-2">Choose &quot;Save &amp; Continue&quot; to move to the next step and submit all your choices together at the end.</p>
          </div>
        </div>
      </div>

      <WexDialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <WexDialog.Content size="lg" aria-describedby={undefined} className="pt-12 pb-4">
          <div className="flex justify-center pt-6 pb-2">
            <EnrollmentSuccessIllustration className="w-[280px] h-auto" alt="Success illustration" />
          </div>
          
          <WexDialog.Header className="text-center">
            <WexDialog.Title className="text-[28px] font-bold text-center text-[#14182c]">
              Plans Submitted!
            </WexDialog.Title>
          </WexDialog.Header>
          
          <div className="px-10 pb-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 mb-4">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span className="text-[14px] font-semibold text-success">Successfully Submitted</span>
            </div>
            
            <p className="text-[16px] leading-6 text-[#7a87b2] w-fit mx-auto">
              You&apos;ve submitted the plan choices you&apos;ve made so far. You can update them until the end of the enrollment period.
            </p>
            
            <p className="mt-3 text-[14px] text-muted-foreground">
              You still have other enrollment steps to complete.
            </p>
          </div>
          
          <WexDialog.Footer className="justify-center items-center pb-6 sm:justify-center text-center">
            <WexButton 
              intent="primary" 
              onClick={() => { setSubmitOpen(false); navigate("/enrollment/spending-accounts"); }}
              className="min-w-[200px]"
            >
              Continue to Next Step
            </WexButton>
          </WexDialog.Footer>
        </WexDialog.Content>
      </WexDialog>

      <WexDialog open={warningOpen} onOpenChange={setWarningOpen}>
        <WexDialog.Content aria-describedby={undefined}>
          <WexDialog.Header><WexDialog.Title>No Dependents Selected</WexDialog.Title></WexDialog.Header>
          <div className="px-6 pb-2 text-[14px] text-foreground">
            <p>You haven&apos;t selected any dependents for coverage on any of your plans.</p>
            <p className="mt-3">Are you sure you want to submit with self-only coverage?</p>
          </div>
          <WexDialog.Footer className="justify-end gap-2">
            <WexButton variant="outline" onClick={() => setWarningOpen(false)}>
              Go back
            </WexButton>
            <WexButton intent="primary" onClick={handleSubmit}>
              Yes, submit anyway
            </WexButton>
          </WexDialog.Footer>
        </WexDialog.Content>
      </WexDialog>
    </EnrollmentLayout>
  );
}