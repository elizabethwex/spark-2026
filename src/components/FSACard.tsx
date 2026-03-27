import { useState } from "react";
import {
  CardContent,
  ChartContainer,
  type ChartConfig,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { GlassCard } from "@/components/ui/GlassCard";
import { WexBadge } from "@/components/wex/wex-badge";
import { Pie, PieChart, Cell } from "recharts";
import { AlertCircle, Baby, Bus, CalendarCheck2, Car } from "lucide-react";

const accountsData = {
  LPFSA: {
    id: "lpfsa",
    name: "LPFSA",
    fullName: "Limited Purpose FSA",
    tooltip: "Covers eligible dental and vision expenses only. Use it or lose it by plan year end.",
    balance: "$850.00",
    icon: <CalendarCheck2 className="h-5 w-5" />,
    hasExpiration: true,
    daysLeft: 28,
    totalDays: 33,
    deadline: "Dec 31, 2024",
    badge: { text: "Expires Soon" },
  },
  DCFSA: {
    id: "dcfsa",
    name: "DCFSA",
    fullName: "Dependent Care FSA",
    tooltip: "Covers dependent care expenses like daycare, preschool, and elder care up to $5,000/year.",
    balance: "$2,100.00",
    icon: <Baby className="h-5 w-5" />,
    hasExpiration: true,
    daysLeft: 42,
    totalDays: 65,
    deadline: "Dec 31, 2024",
    badge: null,
  },
  Commuter: {
    id: "commuter",
    name: "Commuter",
    fullName: "Commuter Benefits",
    tooltip: "Pre-tax transit and vanpool benefits. Funds roll over month to month.",
    balance: "$315.00",
    icon: <Bus className="h-5 w-5" />,
    hasExpiration: false,
    daysLeft: null,
    totalDays: null,
    deadline: null,
    badge: null,
  },
  "Parking FSA": {
    id: "parking",
    name: "Parking FSA",
    fullName: "Parking Flexible Spending",
    tooltip: "Pre-tax parking benefits for qualified workplace parking expenses.",
    balance: "$290.00",
    icon: <Car className="h-5 w-5" />,
    hasExpiration: false,
    daysLeft: null,
    totalDays: null,
    deadline: null,
    badge: null,
  },
};

const countdownChartConfig = {
  remaining: { label: "Days Remaining", color: "hsl(var(--chart-1))" },
  elapsed: { label: "Days Elapsed", color: "hsl(var(--chart-2) / 0.2)" },
} satisfies ChartConfig;

function CountdownRing({
  daysLeft,
  totalDays,
}: {
  daysLeft: number;
  totalDays: number;
}) {
  const daysElapsed = totalDays - daysLeft;
  const pieData = [
    { name: "remaining", value: daysLeft },
    { name: "elapsed", value: daysElapsed },
  ];
  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2) / 0.2)"];

  return (
    <div className="relative h-28 w-28 flex-shrink-0">
      <ChartContainer
        config={countdownChartConfig}
        className="h-[112px] w-[112px]"
      >
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={42}
            outerRadius={52}
            startAngle={90}
            endAngle={-270}
            paddingAngle={0}
            cornerRadius={3}
            dataKey="value"
            strokeWidth={0}
          >
            {pieData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index]}
                style={{ outline: "none" }}
              />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{daysLeft}</span>
        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Days Left
        </span>
      </div>
    </div>
  );
}

function AccountIcon({ accountId }: { accountId: string }) {
  switch (accountId) {
    case "dcfsa":
      return <Baby className="h-3.5 w-3.5" />;
    case "commuter":
      return <Bus className="h-3.5 w-3.5" />;
    case "parking":
      return <Car className="h-3.5 w-3.5" />;
    case "lpfsa":
      return <CalendarCheck2 className="h-3.5 w-3.5" />;
    default:
      return null;
  }
}

export function FSACard() {
  const [selectedAccount, setSelectedAccount] =
    useState<keyof typeof accountsData>("LPFSA");
  const account = accountsData[selectedAccount];

  return (
    <GlassCard hoverable className="group/card flex h-full flex-col">
      <div className="flex items-start justify-between p-6 pb-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover/card:scale-110 group-hover/card:rotate-12">
            {account.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-foreground">{account.name}</h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">{account.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {account.fullName}
            </p>
          </div>
        </div>
        <div className={account.badge ? "" : "invisible"}>
          <WexBadge
            intent="warning"
            pill
            size="sm"
            className="bg-primary/10 text-primary border-primary/20"
          >
            {account.badge?.text ?? "\u00A0"}
          </WexBadge>
        </div>
      </div>

      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              Available balance
            </p>
            <p className="text-4xl font-bold tracking-tight text-foreground leading-none">
              {account.balance}
            </p>
            <p
              className={`mt-2 text-xs text-muted-foreground ${account.deadline ? "" : "invisible"}`}
            >
              Deadline:{" "}
              <span className="font-semibold text-foreground">
                {account.deadline ?? "\u00A0"}
              </span>
            </p>
          </div>
          <div className="h-28 w-28 flex-shrink-0">
            {account.hasExpiration &&
              account.daysLeft !== null &&
              account.totalDays !== null && (
                <CountdownRing
                  daysLeft={account.daysLeft}
                  totalDays={account.totalDays}
                />
              )}
          </div>
        </div>

        <div className="space-y-2 border-t border-border pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Accounts
          </p>
          {(
            Object.keys(accountsData) as Array<keyof typeof accountsData>
          ).map((accountKey) => {
            const acct = accountsData[accountKey];
            const isSelected = accountKey === selectedAccount;
            return (
              <button
                key={acct.id}
                onClick={() => setSelectedAccount(accountKey)}
                aria-current={isSelected ? "true" : undefined}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-sm transition-colors hover:bg-primary/5 hover:border-primary/20 group ${
                  isSelected
                    ? "border-primary/20 bg-primary/5"
                    : "border-transparent"
                }`}
              >
                <span className="flex items-center gap-2 text-foreground group-hover:text-primary">
                  <span className="text-primary transition-transform group-hover:scale-110">
                    <AccountIcon accountId={acct.id} />
                  </span>
                  <span className="font-medium">{acct.name}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className={
                      acct.badge
                        ? isSelected
                          ? "invisible"
                          : ""
                        : "hidden"
                    }
                  >
                    <WexBadge
                      intent="warning"
                      pill
                      size="sm"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {acct.badge?.text ?? "\u00A0"}
                    </WexBadge>
                  </span>
                  <span className="font-bold text-foreground group-hover:text-primary">
                    {acct.balance}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </GlassCard>
  );
}
