import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type PlanCosts = {
  total: number;
  employerPays: number;
};

export type MedicalPlan = {
  id: string;
  name: string;
  isRecommended?: boolean;
  isWaive?: boolean;
  individualDeductible?: number;
  familyDeductible?: number;
  copayment?: number;
  costs: {
    employeeOnly: PlanCosts;
    employeeSpouse: PlanCosts;
    employeeChildren: PlanCosts;
    family: PlanCosts;
  };
};

type PlanCardProps = {
  plan: MedicalPlan;
  coverageLabel: string;
  coveredDependents: number;
  youPay: number;
  totalCost: number;
  employerPays: number;
  details?: { label: string; value: string }[];
  selected: boolean;
  onSelect: () => void;
  className?: string;
};

function currency(amount: number): string {
  const fixed = amount.toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${withCommas}.${decPart ?? "00"}`;
}

export default function PlanCard({
  plan,
  coverageLabel,
  coveredDependents,
  youPay,
  totalCost,
  employerPays,
  details,
  selected,
  onSelect,
  className,
}: PlanCardProps) {
  const isWaive = Boolean(plan.isWaive);
  const detailRows =
    details ??
    (plan.isWaive
      ? []
      : [
          { label: "Individual Deductible", value: currency(plan.individualDeductible ?? 0) },
          { label: "Family Deductible", value: currency(plan.familyDeductible ?? 0) },
          { label: "Copayment", value: currency(plan.copayment ?? 0) },
        ]);

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
        className,
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-[16px] font-semibold text-foreground">{plan.name}</div>
            {plan.isRecommended && (
              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success-text">
                <Check className="h-3 w-3" />
                Recommended
              </div>
            )}
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

        <div className="mt-4 space-y-1 text-[13px] text-muted-foreground">
          <div>
            Covered Dependents:{" "}
            <span className="font-semibold text-foreground">{coveredDependents}</span>
          </div>
          <div>
            Coverage: <span className="font-semibold text-foreground">{coverageLabel}</span>
          </div>
          {detailRows.map((detail) => (
            <div key={detail.label}>
              {detail.label}: <span className="font-semibold text-foreground">{detail.value}</span>
            </div>
          ))}
        </div>

        {detailRows.length > 0 && <div className="my-4 h-px bg-border" />}

        {isWaive && (
          <div className="mt-4 mb-4 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-[12px] text-slate-600">
            You will not have medical coverage for this plan year.
          </div>
        )}

        <div className="text-[13px] text-muted-foreground">
          <div className="font-semibold text-foreground">Per Pay Period:</div>
          <div className="mt-1 flex justify-between">
            <span>Total Cost:</span>
            <span className="font-semibold text-foreground">{currency(totalCost)}</span>
          </div>
          <div className="flex justify-between">
            <span>Employer Pays:</span>
            <span className="font-semibold text-foreground">{currency(employerPays)}</span>
          </div>
        </div>

        <div className="my-4 h-px bg-border" />

        <div className="mt-auto text-center">
          <div className="text-[12px] text-muted-foreground">You Pay</div>
          <div className="text-[28px] font-bold tracking-[-0.5px] text-foreground">
            {currency(youPay)}
          </div>
        </div>
      </div>
    </button>
  );
}