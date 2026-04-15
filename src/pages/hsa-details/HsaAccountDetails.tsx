import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@wexinc-healthbenefits/ben-ui-kit";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
} from "recharts";
import { Building2, CircleDollarSign, Info, TrendingUp, Wallet } from "lucide-react";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { ConsumerFooter } from "@/components/layout/Footer";
import { FadeInItem } from "@/components/layout/PageFadeIn";
import { HSAPiggyBank } from "@/components/HSAPiggyBank";
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground";
import { usePrototype } from "@/context/PrototypeContext";
import { useReimburseWorkspace } from "@/context/ReimburseWorkspaceContext";
import { cn, homepageAccountSurfaceClass } from "@/lib/utils";
import { hsaPlannerData } from "@/data/mockData";
import { HsaContributeWorkspaceHost } from "./HsaContributeWorkspaceHost";
import { HsaRecentTransactionsTable } from "./HsaRecentTransactionsTable";
import { HSA_2026_CONTRIBUTION_MOCK } from "@/data/hsaSharedContributions";
import { hsaDetailTransactions, hsaInvestmentChartPoints } from "./hsaDetailMockData";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const INVESTMENT_RANGES = ["1W", "1M", "3M", "1Y", "3Y", "All"] as const;

const RANGE_WEEKS: Record<(typeof INVESTMENT_RANGES)[number], number> = {
  "1W":  2,
  "1M":  5,
  "3M":  13,
  "1Y":  52,
  "3Y":  52,
  "All": 52,
};

/**
 * Health Savings Account dashboard for /hsa-details
 * (Consumer Experience Redesign reference).
 */
export function HsaAccountDetails() {
  const { homepageMode } = usePrototype();
  const isPartnerSafe = homepageMode === "partner-safe";
  const cardSurface = homepageAccountSurfaceClass(isPartnerSafe);
  const { openReimburseWorkspace } = useReimburseWorkspace();
  const [plannerTab, setPlannerTab] = useState<"2026" | "longterm">("2026");
  const [investRange, setInvestRange] = useState<(typeof INVESTMENT_RANGES)[number]>("1W");
  const [isContributeOpen, setIsContributeOpen] = useState(false);

  const filteredChartPoints = useMemo(
    () => hsaInvestmentChartPoints.slice(-RANGE_WEEKS[investRange]),
    [investRange]
  );

  const annual2026 = {
    contributed: 3_400,
    target: 4_400,
    message:
      "Great job! You are on track to meet your HSA contribution goal. Estimated out of pocket expenses: $1,000.00",
    estimatedExpenses: 1_000,
  };
  const longTerm = hsaPlannerData.longTermGoal;
  const plannerCurrent = plannerTab === "2026" ? annual2026 : longTerm;
  const plannerPct =
    plannerCurrent.target > 0
      ? Math.round((plannerCurrent.contributed / plannerCurrent.target) * 100)
      : 0;
  const plannerOnTrack =
    plannerTab === "2026" ? true : longTerm.status === "on-track";

  const { contributionLimit, yourContrib, employerContrib, leftToContribute } =
    HSA_2026_CONTRIBUTION_MOCK;
  const totalContribYtd = yourContrib + employerContrib;
  const pctLimitUsed = Math.round((totalContribYtd / contributionLimit) * 100);

  return (
    <div className="min-h-screen" style={consumerPageBackgroundStyle}>
      <ConsumerNavigation />

      <FadeInItem>
        <main className="mx-auto w-full max-w-[1440px] space-y-8 px-8 py-7">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Health Savings Account
          </h1>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Account Overview */}
            <Card
              className={cn(cardSurface, "flex flex-col")}
              style={{ borderRadius: "24px" }}
            >
              <CardContent className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--theme-secondary-ramp-50)] text-[var(--theme-secondary)]">
                    <Building2 className="h-5 w-5 text-current" aria-hidden />
                  </div>
                  <h2 className="text-[20px] font-bold leading-7 text-[#14182c]">Account Overview</h2>
                </div>

                {/* Total value */}
                <div>
                  <div className="flex flex-col text-muted-foreground">
                    <p className="text-base leading-6">Total Account Value</p>
                    <p className="text-xs leading-4">Cash + Invested Assets</p>
                  </div>
                  <p className="mt-2 text-[42px] font-bold leading-none tracking-tight text-[#14182c]">
                    $15,900.00
                  </p>
                </div>

                {/* Balance rows in contained box */}
                <div className="flex-1 overflow-hidden rounded-[16px] [background:unset] shadow-[0px_0px_1px_0px_rgba(18,24,29,0.2),0px_1px_3px_0px_rgba(18,24,29,0.1),0px_1px_2px_0px_rgba(18,24,29,0.06)]">
                  {/* Cash Balance */}
                  <div className="flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[#3958c3]">
                        <CircleDollarSign className="h-[24px] w-[24px]" />
                      </div>
                      <span className="text-[16px] font-bold leading-5 text-[#14182c]">Cash Balance</span>
                    </div>
                    <span className="text-[16px] font-regular text-[#14182c]">$3,200.00</span>
                  </div>

                  <div className="mx-4 h-px bg-[#e8ecf8]" />

                  {/* Invested assets */}
                  <div className="flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[#3958c3]">
                        <TrendingUp className="h-[24px] w-[24px] text-current" aria-hidden />
                      </div>
                      <span className="text-[16px] font-bold leading-5 text-[#14182c]">Invested assets</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-semibold text-green-600">+12.5% YTD</span>
                      <span className="text-[16px] font-regular text-[#14182c]">$12,700.00</span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex w-full gap-3">
                  <Button
                    intent="primary"
                    variant="outline"
                    size="md"
                    className="min-w-0 flex-1 rounded-[12px]"
                    type="button"
                  >
                    Pay provider
                  </Button>
                  <Button
                    intent="primary"
                    size="md"
                    className="min-w-0 flex-1 rounded-[12px]"
                    type="button"
                    onClick={() => openReimburseWorkspace()}
                  >
                    Reimburse Myself
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 2026 Contributions */}
            <Card
              className={cn(cardSurface, "flex flex-col")}
              style={{ borderRadius: "24px" }}
            >
              <CardContent className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--theme-secondary-ramp-50)] text-[var(--theme-secondary)]">
                    <Wallet className="h-5 w-5 text-current" aria-hidden />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">2026 Contributions</h2>
                </div>
                <div className="box-content flex items-start justify-between gap-8">
                  <div className="min-w-0 flex w-full flex-col gap-1">
                    <p className="text-sm text-muted-foreground">Total Contributed YTD</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-3xl font-bold text-foreground">{fmt(totalContribYtd)}</p>
                      <Badge intent="success" size="sm" className="shrink-0">
                        {pctLimitUsed}% of limit used
                      </Badge>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end justify-start gap-1 text-right">
                    <p className="text-sm text-muted-foreground">Remaining Limit</p>
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-sm font-semibold text-foreground">
                        {fmt(leftToContribute)}
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                            aria-label="About remaining limit"
                          >
                            <Info className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                        2026 IRS limit for individuals: $4,400.00
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className="h-6 w-full overflow-hidden rounded-full bg-muted flex">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(yourContrib / contributionLimit) * 100}%` }}
                  />
                  <div
                    className="h-full bg-primary/40"
                    style={{ width: `${(employerContrib / contributionLimit) * 100}%` }}
                  />
                  <div
                    className="h-full bg-muted-foreground/25"
                    style={{ width: `${(leftToContribute / contributionLimit) * 100}%` }}
                  />
                </div>
                <ul className="m-0 flex list-none flex-wrap gap-8 p-0">
                  <li className="flex items-start gap-2">
                    <span
                      className="size-[14px] shrink-0 rounded-full bg-primary"
                      aria-hidden
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="text-sm font-normal text-muted-foreground">
                        Your Contributions
                      </span>
                      <span className="text-base font-normal text-foreground">
                        {fmt(yourContrib)}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      className="size-[14px] shrink-0 rounded-full bg-primary/40"
                      aria-hidden
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="text-sm font-normal text-muted-foreground">
                        Employer Contributions
                      </span>
                      <span className="text-base font-normal text-foreground">
                        {fmt(employerContrib)}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span
                      className="size-[14px] shrink-0 rounded-full bg-muted-foreground/25"
                      aria-hidden
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="text-sm font-normal text-muted-foreground">
                        Left to Contribute
                      </span>
                      <span className="text-base font-normal text-foreground">
                        {fmt(leftToContribute)}
                      </span>
                    </div>
                  </li>
                </ul>
                <div className="mt-auto pt-2">
                  <Button
                    intent="primary"
                    variant="outline"
                    size="md"
                    className="w-full rounded-xl border-primary text-primary"
                    type="button"
                    onClick={() => setIsContributeOpen(true)}
                  >
                    Contribute to HSA
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Investments */}
            <Card
              className={cn(cardSurface, "flex flex-col")}
              style={{ borderRadius: "24px" }}
            >
              <CardContent className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--theme-secondary-ramp-50)] text-[var(--theme-secondary)]">
                    <TrendingUp className="h-5 w-5 text-current" aria-hidden />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">Investments</h2>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-full">
                    <p className="text-base text-muted-foreground">HSA Investment Balance</p>
                    <p className="text-3xl font-bold text-foreground">$12,700.00</p>
                    <Badge intent="success" size="sm" className="mt-1">
                      + $2.50 today
                    </Badge>
                  </div>
                  <div className="flex w-fit flex-nowrap gap-1 rounded-lg bg-muted p-1">
                    {INVESTMENT_RANGES.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setInvestRange(r)}
                        className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                          investRange === r
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-[200px] w-full min-h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredChartPoints} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="hsaInvestFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(142 71% 40%)" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="hsl(142 71% 40%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="i" hide />
                      <RechartsTooltip
                        formatter={(value: number) => [fmt(value), "Balance"]}
                        labelFormatter={() => ""}
                        contentStyle={{ borderRadius: 8 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="hsl(142 71% 36%)"
                        strokeWidth={2}
                        fill="url(#hsaInvestFill)"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* My HSA Planner */}
            <Card
              className={cn(cardSurface, "flex flex-col")}
              style={{ borderRadius: "24px" }}
            >
              <CardContent className="flex flex-1 flex-col gap-6 p-6">
                <h2 className="text-lg font-semibold text-foreground">My HSA Planner</h2>
                <div className="flex rounded-lg bg-muted p-1">
                  <button
                    type="button"
                    onClick={() => setPlannerTab("2026")}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                      plannerTab === "2026"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    2026 Goal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlannerTab("longterm")}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                      plannerTab === "longterm"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Long Term Goal
                  </button>
                </div>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div>
                      <p className="text-3xl font-bold text-foreground">
                        {fmt(plannerCurrent.contributed)}
                      </p>
                      <p className="text-sm text-muted-foreground">of {fmt(plannerCurrent.target)}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      Goal Status:{" "}
                      <span className={plannerOnTrack ? "text-green-600" : "text-orange-600"}>
                        {plannerOnTrack ? "On Track" : "Behind"}
                      </span>
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {plannerTab === "2026"
                        ? "Great job! You are on track to meet your HSA contribution goal."
                        : longTerm.message}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Estimated out of pocket expenses:{" "}
                      <span className="font-semibold text-foreground">
                        {fmt(
                          plannerTab === "2026"
                            ? annual2026.estimatedExpenses
                            : longTerm.estimatedExpenses
                        )}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-center shrink-0">
                    <HSAPiggyBank
                      percentage={plannerPct}
                      fillColor="hsl(160, 100%, 38%)"
                      className="h-auto w-[140px]"
                    />
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                      <span className="text-2xl font-bold text-foreground">{plannerPct}%</span>
                      <br />
                      to your goal
                    </p>
                  </div>
                </div>
                <div className="mt-auto pt-2">
                  <Button
                    intent="primary"
                    variant="outline"
                    size="md"
                    className="w-full rounded-xl border-primary text-primary"
                    type="button"
                  >
                    Update my Goal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <HsaRecentTransactionsTable transactions={hsaDetailTransactions} />

          {/* HSA Store promo */}
          <Card
            className={cn(cardSurface, "overflow-hidden")}
            style={{ borderRadius: "24px" }}
          >
            <CardContent className="p-0">
              <div className="flex flex-col gap-6 bg-card p-6 md:flex-row md:items-center md:gap-10 md:p-8">
                <div className="flex flex-1 flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={`${import.meta.env.BASE_URL}logos/hsastore-logo.png`}
                      alt=""
                      className="h-8 w-auto"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground md:text-3xl">
                    Prioritize a year of health and wellness with your HSA
                  </h3>
                  <p className="text-muted-foreground">
                    Plus use DirectPay™ and check out instantly!
                  </p>
                  <div>
                    <Button intent="primary" size="md" className="rounded-xl" type="button" onClick={() => window.open("https://hsastore.com", "_blank")}>
                      Shop HSA Store
                    </Button>
                  </div>
                </div>
                <div className="flex shrink-0 justify-center md:w-[280px]">
                  <img
                    src={`${import.meta.env.BASE_URL}app-ui/fsa-store-image.svg`}
                    alt=""
                    className="max-h-[200px] w-full max-w-[280px] object-contain"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </FadeInItem>

      <ConsumerFooter />

      {isContributeOpen ? (
        <HsaContributeWorkspaceHost onClose={() => setIsContributeOpen(false)} />
      ) : null}
    </div>
  );
}
