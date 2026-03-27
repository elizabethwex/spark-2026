import {
  CardContent,
  Button,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { PiggyBank, Lightbulb } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export interface HSACardData {
  cashBalance: number;
  investedAssets?: number;
  ytdReturn?: number;
  contributedYTD: number;
  annualLimit: number;
}

export const HSA_SCENARIOS = {
  "new-employee": {
    label: "New Employee",
    data: { cashBalance: 0, contributedYTD: 0, annualLimit: 4_300 },
  },
  "cash-only": {
    label: "Cash Only",
    data: { cashBalance: 3_450, contributedYTD: 3_450, annualLimit: 4_300 },
  },
  "full-account": {
    label: "Full Account",
    data: {
      cashBalance: 3_450,
      investedAssets: 12_450,
      ytdReturn: 12.5,
      contributedYTD: 3_450,
      annualLimit: 4_300,
    },
  },
} as const satisfies Record<string, { label: string; data: HSACardData }>;

export type HSAScenarioKey = keyof typeof HSA_SCENARIOS;

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function HSACard({ data }: { data: HSACardData }) {
  const { cashBalance, investedAssets, ytdReturn, contributedYTD, annualLimit } = data;
  const hasInvestments = investedAssets !== undefined && investedAssets > 0;
  const isNewEmployee = cashBalance === 0 && !hasInvestments;
  const totalValue = cashBalance + (investedAssets ?? 0);
  const contributionPct = annualLimit > 0
    ? Math.round((contributedYTD / annualLimit) * 100) : 0;
  const remaining = annualLimit - contributedYTD;

  return (
    <GlassCard hoverable className="group/card flex h-full flex-col">
      <div className="flex items-start justify-between p-6 pb-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover/card:scale-110">
            <PiggyBank className="h-5 w-5 transition-transform group-hover/card:rotate-12" />
          </div>
          <div>
            <h2 className="font-display font-bold text-foreground">HSA</h2>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Health Savings
            </p>
          </div>
        </div>
      </div>

      <CardContent className="flex-1 space-y-4 p-6">
        <div>
          <p className="text-sm text-muted-foreground">Cash balance</p>
          <p className="text-4xl font-bold tracking-tight text-foreground">
            {fmt(cashBalance)}
          </p>
        </div>

        {isNewEmployee && (
          <div className="flex items-start gap-3 rounded-xl bg-muted px-4 py-3">
            <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Your HSA is ready to fund
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Contribute pre-tax dollars to save on eligible medical expenses.
              </p>
            </div>
          </div>
        )}

        {hasInvestments && (
          <div className="space-y-2 rounded-xl bg-muted px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Invested assets</span>
              <span className="text-sm font-semibold text-foreground">
                {fmt(investedAssets)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              {ytdReturn !== undefined && (
                <span className="text-xs font-medium text-info">
                  +{ytdReturn}% YTD
                </span>
              )}
              <button className="h-auto p-0 text-xs font-medium text-info underline-offset-4 hover:underline bg-transparent border-none cursor-pointer">
                View performance
              </button>
            </div>
          </div>
        )}

        {hasInvestments && (
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Total Account Value
              </p>
              <p className="text-xs text-muted-foreground">Cash + Invested Assets</p>
            </div>
            <p className="text-xl font-bold text-foreground">{fmt(totalValue)}</p>
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{contributionPct}% of contribution limit used</span>
            <span className="font-medium text-foreground">
              {fmt(remaining)} remaining
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-info transition-all"
              style={{ width: `${contributionPct}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">
            2025 IRS limit: {fmt(annualLimit)} (individual)
          </p>
        </div>
      </CardContent>

      <div className="mt-auto p-6 pt-0">
        <Button
          variant="outline"
          className="w-full rounded-xl border-2 border-info bg-transparent px-8 py-3 text-base font-medium text-primary transition-colors hover:bg-muted"
        >
          {isNewEmployee ? "Make your first contribution" : "Make a contribution"}
        </Button>
      </div>
    </GlassCard>
  );
}
