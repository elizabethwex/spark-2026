import * as React from "react";
import { Check, User } from "lucide-react";

import EnrollmentLayout from "./EnrollmentLayout";
import PlanCard, { type MedicalPlan } from "@/components/enrollment/plans/PlanCard";
import { cn } from "@/lib/utils";
import { getEnrolleesForStep } from "@/lib/enrollmentDependentsDefaults";

const STORAGE_KEY = "enrollment.dental-plans.v1";
const DEPENDENTS_STORAGE_KEY = "enrollment.dependents.v1";

type DentalPlansPageProps = {
  currentStepId: string;
  onStepChange: (stepId: string) => void;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
};

type DependentFromStorage = {
  id: string;
  name: string;
  ageLabel: string;
};

type DentalPlansState = {
  enrollees: string[];
  selectedPlanId: string | null;
};

const plans: MedicalPlan[] = [
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

function loadDependentsFromStorage(): DependentFromStorage[] {
  try {
    const raw = localStorage.getItem(DEPENDENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1 || !Array.isArray(parsed.dependents)) return [];
    return parsed.dependents;
  } catch {
    return [];
  }
}

export default function DentalPlansPage({
  currentStepId,
  onStepChange,
  onBack,
  onNext,
  onCancel,
}: DentalPlansPageProps) {
  const [dependents, setDependents] = React.useState<DependentFromStorage[]>([]);
  const [state, setState] = React.useState<DentalPlansState>({
    enrollees: ["myself"],
    selectedPlanId: null,
  });

  React.useEffect(() => {
    setDependents(loadDependentsFromStorage());

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as DentalPlansState;
        setState((prev) => ({ ...prev, enrollees: getEnrolleesForStep(parsed.enrollees) }));
        if (typeof parsed.selectedPlanId === "string" || parsed.selectedPlanId === null) {
          setState((prev) => ({ ...prev, selectedPlanId: parsed.selectedPlanId }));
        }
      } else {
        setState((prev) => ({
          ...prev,
          enrollees: getEnrolleesForStep(undefined),
          selectedPlanId: plans[0].id
        }));
      }
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const toggleEnrollee = (id: string) => {
    setState((prev) => {
      const exists = prev.enrollees.includes(id);
      if (exists) {
        return { ...prev, enrollees: prev.enrollees.filter((x) => x !== id) };
      }
      return { ...prev, enrollees: [...prev.enrollees, id] };
    });
  };

  const selectedDependentsCount = state.enrollees.filter((id) => id !== "myself").length;
  const coverageTier = (() => {
    if (selectedDependentsCount === 0) return "employeeOnly";
    if (selectedDependentsCount === 1) return "employeeSpouse";
    return "family";
  })();

  const coverageLabel = (() => {
    if (selectedDependentsCount === 0) return "Employee only";
    if (selectedDependentsCount === 1) return "Employee + Spouse";
    return "Family";
  })();

  return (
    <EnrollmentLayout
      currentStepId={currentStepId}
      cancelAction={{ label: "Cancel", onClick: onCancel }}
      onStepChange={onStepChange}
      onBack={onBack}
      onNext={onNext}
      primaryActionDisabled={state.selectedPlanId === null}
    >
      <div className="pt-14 flex justify-center">
        <div className="w-[min(900px,92vw)]">
          <h2 className="text-[24px] font-bold leading-8 tracking-[-0.456px] text-foreground">
            Dental Plans
          </h2>
          <p className="mt-2 text-[14px] leading-6 tracking-[-0.084px] text-muted-foreground">
            Select your dental coverage and choose who to enroll.
          </p>

          <div className="mt-8">
            <div className="text-[16px] font-semibold text-foreground">Who do you want to enroll?</div>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div
                className={cn(
                  "w-full text-left rounded-xl border bg-background px-4 py-3 shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]",
                  "border-primary ring-1 ring-primary/10",
                )}
                aria-pressed={true}
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-[14px] font-semibold leading-5 text-foreground">Myself</div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                        <Check className="h-3 w-3" />
                        Selected
                      </span>
                    </div>
                    <div className="text-[13px] leading-5 text-muted-foreground">Employee</div>
                  </div>
                </div>
              </div>

              {dependents.map((dep) => {
                const selected = state.enrollees.includes(dep.id);
                return (
                  <button
                    key={dep.id}
                    type="button"
                    onClick={() => toggleEnrollee(dep.id)}
                    className={cn(
                      "w-full text-left rounded-xl border bg-background px-4 py-3 shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]",
                      "transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selected ? "border-primary ring-1 ring-primary/10" : "border-border",
                    )}
                    aria-pressed={selected}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center",
                          selected ? "bg-primary/10" : "bg-muted",
                        )}
                      >
                        <User className={cn("h-4 w-4", selected ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-[14px] font-semibold leading-5 text-foreground">
                            {dep.name}
                          </div>
                          {selected && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                              <Check className="h-3 w-3" />
                              Selected
                            </span>
                          )}
                        </div>
                        <div className="text-[13px] leading-5 text-muted-foreground">{dep.ageLabel}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {plans.map((plan) => {
              const costs = plan.costs[coverageTier];
              const youPay = Math.max(0, costs.total - costs.employerPays);
              const details = plan.isWaive
                ? []
                : plan.id === "premium"
                  ? [
                      { label: "Annual Maximum", value: "$2,000" },
                      { label: "Deductible", value: "$50" },
                      { label: "Preventive Coverage", value: "100%" },
                      { label: "Basic Coverage", value: "80%" },
                      { label: "Major Coverage", value: "50%" },
                    ]
                  : [
                      { label: "Annual Maximum", value: "$1,500" },
                      { label: "Deductible", value: "$100" },
                      { label: "Preventive Coverage", value: "100%" },
                      { label: "Basic Coverage", value: "70%" },
                      { label: "Major Coverage", value: "40%" },
                    ];

              return (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  coverageLabel={plan.isWaive ? "Waive" : coverageLabel}
                  coveredDependents={plan.isWaive ? 0 : selectedDependentsCount}
                  youPay={youPay}
                  totalCost={costs.total}
                  employerPays={costs.employerPays}
                  details={details}
                  selected={state.selectedPlanId === plan.id}
                  onSelect={() => setState((prev) => ({ ...prev, selectedPlanId: plan.id }))}
                />
              );
            })}
          </div>
        </div>
      </div>
    </EnrollmentLayout>
  );
}