import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Progress,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { useFormContext, useWatch } from "react-hook-form";
import { ChevronRight, Info, Lightbulb, Wallet, CreditCard, Sparkles, MessageCircle } from "lucide-react";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import type { ThemingEngineFormValues } from "@/pages/theming-engine/schema";

// ─── Static data ──────────────────────────────────────────────────────────────

const TRANSACTIONS = [
  { date: "Jan 17, 2025", status: "Pending" as const, account: "HSA", description: "Payroll Contribution", category: "Contribution", member: "JB", amount: "$158.00" },
  { date: "Jan 14, 2025", status: "Complete" as const, account: "HSA", description: "Walgreens", category: "Pharmacy", member: "AB", amount: "- $26.00" },
  { date: "Jan 14, 2025", status: "Complete" as const, account: "HSA", description: "Payroll Contribution", category: "Contribution", member: "JB", amount: "$158.00" },
];

const FSA_ACCOUNTS = [
  { icon: "📋", label: "LPFSA", amount: "$850.00", highlight: true },
  { icon: "⚙️", label: "DCFSA", amount: "$2,100.00", highlight: false },
  { icon: "🚌", label: "Commuter", amount: "$315.00", highlight: false },
  { icon: "🅿️", label: "Parking FSA", amount: "$290.00", highlight: false },
];

const BAR_CHART_DATA = [
  { year: "2023", yours: 55, remaining: 45 },
  { year: "2024", yours: 70, remaining: 30 },
  { year: "2025", yours: 65, remaining: 35 },
];

const DONUT_SEGMENTS = [
  { label: "Medical", pct: 60, amount: "$450" },
  { label: "Dental", pct: 27, amount: "$200" },
  { label: "Vision", pct: 13, amount: "$100" },
];

// ─── Decorative SVG for banner ────────────────────────────────────────────────

function IllustrationSvg() {
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-auto shrink-0" aria-hidden>
      <circle cx="40" cy="60" r="35" fill="var(--theme-illustration)" opacity="0.15" />
      <circle cx="40" cy="60" r="20" fill="var(--theme-illustration)" opacity="0.35" />
      <rect x="90" y="30" width="50" height="60" rx="8" fill="var(--theme-illustration)" opacity="0.2" />
      <rect x="100" y="20" width="50" height="60" rx="8" fill="var(--theme-illustration)" opacity="0.35" />
      <circle cx="170" cy="80" r="25" fill="var(--theme-illustration)" opacity="0.12" />
      <path d="M150 100 Q170 60 190 100" stroke="var(--theme-illustration)" strokeWidth="3" opacity="0.5" fill="none" />
    </svg>
  );
}

// ─── Countdown ring SVG ───────────────────────────────────────────────────────

function DaysLeftRing({ days }: { days: number }) {
  const circumference = 2 * Math.PI * 28;
  const progress = (days / 60) * circumference;
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        <circle cx="32" cy="32" r="28" fill="none" stroke="#E2E8F0" strokeWidth="4" />
        <circle
          cx="32" cy="32" r="28" fill="none"
          stroke="var(--theme-primary)"
          strokeWidth="4" strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold leading-none" style={{ color: "var(--theme-primary)" }}>{days}</span>
        <span className="text-[7px] font-semibold uppercase tracking-wide text-muted-foreground">Days Left</span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function AiAgentPreviewChip() {
  const { control } = useFormContext<ThemingEngineFormValues>();
  const ai = useWatch({ control, name: "aiAgent" });

  const preset = ai?.iconPreset ?? "orb";
  return (
    <div
      className="inline-flex items-center gap-2 rounded-[var(--preview-ai-chip-radius,8px)] border px-3 py-2 text-sm font-semibold shadow-sm"
      style={{
        borderColor: "hsl(var(--theme-ai-accent-hsl) / 0.35)",
        backgroundColor: "hsl(var(--theme-ai-accent-hsl) / 0.08)",
        color: "hsl(var(--theme-ai-accent-hsl))",
      }}
    >
      {preset === "sparkle" && <Sparkles className="h-4 w-4 shrink-0" aria-hidden />}
      {preset === "chat" && <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />}
      {preset === "orb" && (
        <span className="h-4 w-4 shrink-0 rounded-full bg-current opacity-90" aria-hidden />
      )}
      <span>{ai?.name ?? "AI Assistant"}</span>
    </div>
  );
}

export function MemberDashboardPreview() {
  return (
    <div className="flex flex-col min-h-full">

      {/* ─── Navigation ──────────────────────────────────────── */}
      <ConsumerNavigation hidePrototypeFloating />

      {/* ─── Banner Placeholder ──────────────────────────────── */}
      <section
        className="px-6 py-8 flex items-center justify-between gap-6"
        style={{ backgroundColor: "var(--theme-page-bg)" }}
        data-theme-token="pageBg"
      >
        <div className="space-y-3">
          <AiAgentPreviewChip />
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--theme-primary)" }} data-theme-token="primary">
              Welcome back, Sarah
            </h2>
            <p className="text-sm text-muted-foreground">
              Here&rsquo;s what&rsquo;s happening with your benefits today.
            </p>
          </div>
        </div>
        <div data-theme-token="illustration">
          <IllustrationSvg />
        </div>
      </section>

      {/* ─── Bento Box Grid ──────────────────────────────────── */}
      <div
        className="flex-1 px-6 pb-6 grid grid-cols-2 gap-4 items-start"
        style={{ backgroundColor: "var(--theme-page-bg)" }}
      >

        {/* ═══ Row 1: Quick Actions + Recent Transactions ═══ */}

        {/* Quick Actions */}
        <Card data-preview-card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button intent="primary" variant="solid" size="md" className="w-full" data-preview-button data-theme-token="primary">
              File a Claim
            </Button>
            <Button intent="primary" variant="outline" size="md" className="w-full" data-preview-button data-theme-token="primary">
              View Statements
            </Button>
            <Button intent="primary" variant="outline" size="md" className="w-full" data-preview-button data-theme-token="primary">
              Contact Support
            </Button>
            <Button
              intent="secondary" variant="solid" size="md" className="w-full"
              data-preview-button data-theme-token="secondary"
            >
              Manage Dependents
            </Button>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card data-preview-card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
            <button className="text-xs font-medium flex items-center gap-0.5" style={{ color: "var(--theme-primary)" }} data-theme-token="primary">
              View All Transactions <ChevronRight className="h-3 w-3" />
            </button>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: "var(--theme-primary-surface)" }}>
                  <TableHead className="text-xs font-medium">Date</TableHead>
                  <TableHead className="text-xs font-medium">Status</TableHead>
                  <TableHead className="text-xs font-medium">Account</TableHead>
                  <TableHead className="text-xs font-medium">Description</TableHead>
                  <TableHead className="text-xs font-medium">Category</TableHead>
                  <TableHead className="text-xs font-medium">Member</TableHead>
                  <TableHead className="text-xs font-medium text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TRANSACTIONS.map((tx, i) => (
                  <TableRow key={i} className="border-[#E2E8F0]">
                    <TableCell className="text-xs whitespace-nowrap">{tx.date}</TableCell>
                    <TableCell>
                      <Badge intent={tx.status === "Pending" ? "warning" : "success"} size="sm">
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{tx.account}</TableCell>
                    <TableCell className="text-xs">{tx.description}</TableCell>
                    <TableCell>
                      <Badge intent={tx.category === "Pharmacy" ? "info" : "default"} size="sm">
                        {tx.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full text-[10px] font-medium" style={{ backgroundColor: "var(--theme-primary)", color: "white" }}>
                        {tx.member}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-right font-medium">{tx.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* ═══ Row 2: HSA For Life + Health Care FSA ═══ */}

        {/* HSA For Life */}
        <Card data-preview-card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--theme-primary-surface)" }}>
                <Wallet className="h-4 w-4" style={{ color: "var(--theme-primary)" }} />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">HSA For Life</CardTitle>
                <CardDescription className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Health Savings &ndash; 2025 Plan Year
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Cash balance</p>
              <p className="text-3xl font-bold tracking-tight">$1,248.00</p>
            </div>

            <div className="flex items-start gap-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
              <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--theme-primary)" }} />
              <div>
                <p className="text-xs font-semibold">You&rsquo;re on track!</p>
                <p className="text-xs text-muted-foreground">Keep contributing to maximize your pre-tax savings this year.</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>29% of contribution limit used</span>
                <span>$3,052.00 remaining</span>
              </div>
              <Progress value={29} data-theme-token="primary" />
            </div>

            <p className="text-[10px] text-muted-foreground">2025 IRS limit: $4,300.00 (individual)</p>
          </CardContent>
          <CardFooter>
            <Button intent="primary" variant="outline" size="md" className="w-full" data-preview-button data-theme-token="primary">
              Make your first contribution
            </Button>
          </CardFooter>
        </Card>

        {/* Health Care FSA */}
        <Card data-preview-card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--theme-primary-surface)" }}>
                  <CreditCard className="h-4 w-4" style={{ color: "var(--theme-primary)" }} />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <CardTitle className="text-sm font-semibold">Health Care FSA</CardTitle>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <CardDescription className="text-[10px] text-muted-foreground">
                    01/01/2025 &ndash; 12/31/2025
                  </CardDescription>
                </div>
              </div>
              <Badge intent="destructive" size="sm">Expires Soon</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Available balance</p>
                <p className="text-3xl font-bold tracking-tight">$850.00</p>
                <p className="text-xs text-muted-foreground mt-1">Deadline: Dec 31, 2025</p>
              </div>
              <DaysLeftRing days={28} />
            </div>

            <Separator />

            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Accounts</p>
              {FSA_ACCOUNTS.map((acct, i) => (
                <div
                  key={acct.label}
                  className="flex items-center justify-between py-1.5 text-xs"
                  style={{ borderBottom: i < FSA_ACCOUNTS.length - 1 ? "1px solid #E2E8F0" : "none" }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{acct.icon}</span>
                    <span className={acct.highlight ? "font-medium" : "text-muted-foreground"}>{acct.label}</span>
                  </div>
                  <span className="font-medium">{acct.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ═══ Row 3: HSA Contributions Chart + Paid Claims Donut ═══ */}

        {/* HSA Contributions by Tax Year */}
        <Card data-preview-card>
          <CardHeader className="flex flex-row items-center gap-1 space-y-0">
            <CardTitle className="text-base font-semibold">HSA Contributions by Tax Year</CardTitle>
            <Info className="h-3.5 w-3.5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bar chart */}
            <div className="flex items-end justify-around gap-3 h-40">
              {BAR_CHART_DATA.map((bar) => (
                <div key={bar.year} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-full flex gap-0.5" style={{ height: "120px" }}>
                    {/* Stacked vertical bars */}
                    <div className="flex-1 flex flex-col justify-end rounded-t">
                      <div
                        className="rounded-t transition-all"
                        style={{ height: `${bar.remaining}%`, backgroundColor: "hsl(var(--chart-1) / 0.2)" }}
                      />
                      <div
                        className="rounded-t transition-all"
                        style={{ height: `${bar.yours}%`, backgroundColor: "hsl(var(--chart-1))" }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{bar.year}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(var(--chart-1))" }} />
                <span className="text-muted-foreground">Your Contributions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(var(--chart-1) / 0.2)" }} />
                <span className="text-muted-foreground">Remaining to IRS Max</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paid Claims by Category */}
        <Card data-preview-card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base font-semibold">Paid Claims by Category</CardTitle>
            <span className="text-xs text-muted-foreground">01/01/2025 &ndash; 12/31/2025</span>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              {/* Donut chart via conic-gradient */}
              <div className="relative w-32 h-32 shrink-0">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background: `conic-gradient(
                      hsl(var(--chart-1)) 0% 60%,
                      hsl(var(--chart-2)) 60% 87%,
                      hsl(var(--chart-3)) 87% 100%
                    )`,
                  }}
                />
                <div className="absolute inset-3 rounded-full bg-white flex flex-col items-center justify-center">
                  <span className="text-lg font-bold">$750</span>
                  <span className="text-[10px] text-muted-foreground">Total Paid</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-3">
                {DONUT_SEGMENTS.map((seg, i) => {
                  const varName = `--chart-${i + 1}`;
                  return (
                    <div key={seg.label} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: `hsl(var(${varName}))` }} />
                          <span className="text-xs font-medium">{seg.label}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-muted-foreground">{seg.pct}%</span>
                          <span className="font-semibold">{seg.amount}</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#F1F5F9] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${seg.pct}%`, backgroundColor: `hsl(var(${varName}))` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
