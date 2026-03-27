import { useState } from "react";
import {
  CardContent,
  Button,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { GlassCard } from "@/components/ui/GlassCard";
import { PiggyBank } from "lucide-react";
import { HSAPiggyBank } from "@/components/HSAPiggyBank";
import { hsaPlannerData } from "@/data/mockData";

function fmt(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export function HSAPlannerCard() {
  const [activeTab, setActiveTab] = useState<"annual" | "longterm">("annual");
  const data = hsaPlannerData;
  const current =
    activeTab === "annual" ? data.annualGoal : data.longTermGoal;
  const pct =
    current.target > 0
      ? Math.round((current.contributed / current.target) * 100)
      : 0;
  const isOnTrack = current.status === "on-track";

  return (
    <GlassCard hoverable className="group/card flex h-full flex-col">
      <div className="flex items-start justify-between p-6 pb-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PiggyBank className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-foreground">
              My HSA Planner
            </h2>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Start planning your health savings
            </p>
          </div>
        </div>
      </div>

      <CardContent className="flex-1 space-y-5 p-6">
        <div className="flex rounded-xl bg-muted p-1">
          <button
            onClick={() => setActiveTab("annual")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "annual"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            2025 Goal
          </button>
          <button
            onClick={() => setActiveTab("longterm")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === "longterm"
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Long Term Goal
          </button>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-4xl font-bold tracking-tight text-foreground">
                {fmt(current.contributed)}
              </p>
              <p className="text-sm text-muted-foreground">
                of {fmt(current.target)}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground">
                Goal Status:{" "}
                <span
                  className={
                    isOnTrack ? "text-green-600" : "text-orange-500"
                  }
                >
                  {isOnTrack ? "On Track" : "Behind"}
                </span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {current.message}
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              Estimated out of pocket expenses:{" "}
              <span className="font-semibold text-foreground">
                {fmt(current.estimatedExpenses)}
              </span>
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-center shrink-0">
            <HSAPiggyBank
              percentage={pct}
              fillColor={isOnTrack ? "hsl(160, 100%, 38%)" : "hsl(38, 92%, 50%)"}
              className="w-[140px] h-auto"
            />
            <div className="mt-1 text-center">
              <p className="text-2xl font-bold text-foreground">{pct}%</p>
              <p className="text-xs text-muted-foreground">to your goal</p>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 sm:hidden">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{pct}% to your goal</span>
            <span className="font-medium text-foreground">
              {fmt(current.target - current.contributed)} remaining
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-border">
            <div
              className={`h-full rounded-full transition-all ${
                isOnTrack ? "bg-green-500" : "bg-orange-500"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </CardContent>

      <div className="mt-auto p-6 pt-0">
        <Button
          intent="primary"
          className="w-full rounded-xl px-8 py-3 text-base font-medium"
        >
          Update My Goal
        </Button>
      </div>
    </GlassCard>
  );
}
