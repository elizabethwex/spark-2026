import * as React from "react";
import { Check, User } from "lucide-react";

import EnrollmentLayout from "./EnrollmentLayout";
import { cn } from "@/lib/utils";
import { getEnrolleesForStep } from "@/lib/enrollmentDependentsDefaults";

const STORAGE_KEY = "enrollment.accident-insurance.v1";
const DEPENDENTS_STORAGE_KEY = "enrollment.dependents.v1";

type AccidentInsurancePageProps = {
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

type AccidentInsuranceState = {
  enrollees: string[];
  selectedPlanId: string | null;
};

type AccidentPlan = {
  id: string;
  name: string;
  description: string;
  tierLabel: string;
  benefits: { label: string; value: string }[];
  monthlyPremium: number;
  isWaive?: boolean;
};

const plans: AccidentPlan[] = [
  {
    id: "basic",
    name: "Basic Accident Coverage",
    description: "Essential protection for accidental injuries",
    tierLabel: "Employee Only",
    benefits: [
      { label: "Emergency Room:", value: "$250" },
      { label: "Ambulance:", value: "$150" },
      { label: "Fractures:", value: "Up to $2,500" },
      { label: "Hospital Admission:", value: "$1,000" },
    ],
    monthlyPremium: 12.5,
  },
  {
    id: "enhanced",
    name: "Enhanced Accident Coverage",
    description: "Comprehensive accident protection for you and your family",
    tierLabel: "Employee + Family",
    benefits: [
      { label: "Emergency Room:", value: "$500" },
      { label: "Ambulance:", value: "$300" },
      { label: "Fractures:", value: "Up to $5,000" },
      { label: "Hospital Admission:", value: "$2,000" },
      { label: "Physical Therapy:", value: "$50/visit" },
      { label: "Follow-up Care:", value: "$100" },
    ],
    monthlyPremium: 28.75,
  },
  {
    id: "waive",
    name: "Waive Coverage",
    description: "Decline accident insurance",
    tierLabel: "Waive",
    benefits: [],
    monthlyPremium: 0,
    isWaive: true,
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

function currency(amount: number): string {
  const fixed = amount.toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${withCommas}.${decPart ?? "00"}`;
}

type PlanCardProps = {
  plan: AccidentPlan;
  selected: boolean;
  onSelect: () => void;
};

function AccidentPlanCard({ plan, selected, onSelect }: PlanCardProps) {
  const isWaive = Boolean(plan.isWaive);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full h-full text-left rounded-2xl border px-6 py-5 elevation-3",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? isWaive
            ? "border-slate-400 ring-1 ring-slate-200 bg-slate-50/80"
            : "border-primary ring-1 ring-primary/10 bg-primary/5"
          : isWaive
            ? "border-dashed border-slate-200 bg-slate-50/80 hover:bg-slate-100/60"
            : "border-border bg-background hover:bg-muted",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[16px] font-semibold text-foreground">{plan.name}</div>
            {isWaive && (
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-200/70 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                Waive option
              </div>
            )}
          </div>
          {selected && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                isWaive ? "bg-slate-200/70 text-slate-700" : "bg-primary/10 text-primary",
              )}
            >
              <Check className="h-3 w-3" />
              Selected
            </span>
          )}
        </div>

        {!isWaive && (
          <>
            <div className="mt-2 text-[14px] text-muted-foreground">{plan.description}</div>

            <div className="mt-3 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[12px] font-medium text-primary w-fit">
              {plan.tierLabel}
            </div>
          </>
        )}

        {isWaive && (
          <div className="mt-4 space-y-1 text-[13px] text-muted-foreground">
            <div>
              Covered Dependents:{" "}
              <span className="font-semibold text-foreground">0</span>
            </div>
            <div>
              Coverage: <span className="font-semibold text-foreground">Waive</span>
            </div>
          </div>
        )}

        {!isWaive && plan.benefits.length > 0 && (
          <div className="mt-4 space-y-2 flex-1">
            {plan.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-success-text mt-0.5 shrink-0" />
                <div className="text-[14px] text-foreground">
                  <span className="font-medium">{benefit.label}</span> {benefit.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {isWaive && (
          <div className="mt-4 mb-4 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-[12px] text-slate-600">
            You will not have accident insurance coverage for this plan year.
          </div>
        )}

        {isWaive ? (
          <>
            <div className="text-[13px] text-muted-foreground">
              <div className="font-semibold text-foreground">Per Pay Period:</div>
              <div className="mt-1 flex justify-between">
                <span>Total Cost:</span>
                <span className="font-semibold text-foreground">{currency(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Employer Pays:</span>
                <span className="font-semibold text-foreground">{currency(0)}</span>
              </div>
            </div>

            <div className="my-4 h-px bg-border" />

            <div className="mt-auto text-center">
              <div className="text-[12px] text-muted-foreground">You Pay</div>
              <div className="text-[28px] font-bold tracking-[-0.5px] text-foreground">
                {currency(0)}
              </div>
            </div>
          </>
        ) : (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-end justify-between">
              <div className="text-[14px] text-muted-foreground">Monthly Premium:</div>
              <div className="text-[24px] font-bold text-foreground">{currency(plan.monthlyPremium)}</div>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

export default function AccidentInsurancePage({
  currentStepId,
  onStepChange,
  onBack,
  onNext,
  onCancel,
}: AccidentInsurancePageProps) {
  const [dependents, setDependents] = React.useState<DependentFromStorage[]>([]);
  const [state, setState] = React.useState<AccidentInsuranceState>({
    enrollees: ["myself"],
    selectedPlanId: null,
  });

  React.useEffect(() => {
    setDependents(loadDependentsFromStorage());

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AccidentInsuranceState;
        setState((prev) => ({ ...prev, enrollees: getEnrolleesForStep(parsed.enrollees) }));
        if (typeof parsed.selectedPlanId === "string" || parsed.selectedPlanId === null) {
          setState((prev) => ({ ...prev, selectedPlanId: parsed.selectedPlanId }));
        }
      } else {
        setState((prev) => ({
          ...prev,
          enrollees: getEnrolleesForStep(undefined),
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
            Accident Insurance
          </h2>
          <p className="mt-2 text-[14px] leading-6 tracking-[-0.084px] text-muted-foreground">
            Protect yourself and your family from unexpected medical costs due to accidents.
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
                          <div className="text-[14px] font-semibold leading-5 text-foreground">{dep.name}</div>
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
            {plans.map((plan) => (
              <AccidentPlanCard
                key={plan.id}
                plan={plan}
                selected={state.selectedPlanId === plan.id}
                onSelect={() => setState((prev) => ({ ...prev, selectedPlanId: plan.id }))}
              />
            ))}
          </div>
        </div>
      </div>
    </EnrollmentLayout>
  );
}