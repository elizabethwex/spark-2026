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
  Input,
  Label,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { useFormContext, useWatch } from "react-hook-form";
import { ChevronRight, Info, Lightbulb, Wallet, CreditCard, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import type { ThemingEngineFormValues } from "@/pages/theming-engine/schema";
import { cn } from "@/lib/utils";

// ─── Decorative SVG for illustration ──────────────────────────────────────────

function IllustrationSvg() {
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto shrink-0" aria-hidden>
      <circle cx="40" cy="60" r="35" fill="var(--theme-illustration)" opacity="0.15" />
      <circle cx="40" cy="60" r="20" fill="var(--theme-illustration)" opacity="0.35" />
      <rect x="90" y="30" width="50" height="60" rx="8" fill="var(--theme-illustration)" opacity="0.2" />
      <rect x="100" y="20" width="50" height="60" rx="8" fill="var(--theme-illustration)" opacity="0.35" />
      <circle cx="170" cy="80" r="25" fill="var(--theme-illustration)" opacity="0.12" />
      <path d="M150 100 Q170 60 190 100" stroke="var(--theme-illustration)" strokeWidth="3" opacity="0.5" fill="none" />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

function AiAgentPreviewChip() {
  const { control } = useFormContext<ThemingEngineFormValues>();
  const ai = useWatch({ control, name: "aiAgent" });

  const preset = ai?.iconPreset ?? "orb";
  return (
    <div
      className="inline-flex items-center gap-2 rounded-[var(--preview-ai-chip-radius,8px)] border px-4 py-2.5 text-sm font-semibold shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
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
    <div className="flex flex-col min-h-full bg-muted/30">
      {/* ─── Navigation ──────────────────────────────────────── */}
      <ConsumerNavigation hidePrototypeFloating />

      {/* ─── Two-Column Layout ───────────────────────────────── */}
      <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
        
        {/* ═══ Left Column ═══ */}
        <div className="flex flex-col gap-8">
          
          {/* Button Styles */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Button Styles</h3>
            <div className="flex flex-col gap-3">
              <Button intent="primary" variant="solid" size="md" className="w-full justify-center" data-preview-button data-theme-token="primary">
                Primary Button
              </Button>
              <Button intent="secondary" variant="solid" size="md" className="w-full justify-center" data-preview-button data-theme-token="secondary">
                Secondary Button
              </Button>
            </div>
          </div>

          {/* AI Agent */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">AI Agent</h3>
            <AiAgentPreviewChip />
          </div>

          {/* Input Style */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Input Style</h3>
            <div className="space-y-4">
              <div className="relative">
                <Input id="preview-input-1" placeholder=" " className="peer pt-5 pb-1 h-14" />
                <Label
                  htmlFor="preview-input-1"
                  className="absolute left-3 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
                >
                  First Name
                </Label>
              </div>
              <div className="relative">
                <Input id="preview-input-2" placeholder=" " className="peer pt-5 pb-1 h-14" defaultValue="Jane" />
                <Label
                  htmlFor="preview-input-2"
                  className="absolute left-3 top-2 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
                >
                  Last Name
                </Label>
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Progress Indicators</h3>
            <div className="space-y-6">
              {/* Stepper */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: "var(--theme-primary)" }}>
                    1
                  </div>
                  <span className="text-sm font-medium">Personal Info</span>
                </div>
                <div className="ml-3 h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary text-xs font-bold" style={{ color: "var(--theme-primary)" }}>
                    2
                  </div>
                  <span className="text-sm font-medium" style={{ color: "var(--theme-primary)" }}>Verification</span>
                </div>
                <div className="ml-3 h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted text-xs font-bold text-muted-foreground">
                    3
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Confirmation</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">HSA Cash</span>
                  <span className="text-muted-foreground">50%</span>
                </div>
                <Progress value={50} data-theme-token="primary" className="h-2" />
              </div>
            </div>
          </div>

          {/* Illustration Accents */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Illustration Accents</h3>
            <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-center" data-theme-token="illustration">
              <IllustrationSvg />
            </div>
          </div>

        </div>

        {/* ═══ Right Column ═══ */}
        <div className="flex flex-col gap-8">
          
          {/* Chart Styles */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Chart Styles</h3>
            <Card data-preview-card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">HSA Contributions by Tax Year</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bar Chart Mock */}
                <div className="flex items-end gap-6 h-[180px] pt-4">
                  {/* Y-axis */}
                  <div className="flex flex-col justify-between h-full text-xs text-muted-foreground pb-6">
                    <span>$10K</span>
                    <span>$8K</span>
                    <span>$6K</span>
                    <span>$4K</span>
                    <span>$2K</span>
                    <span>$0K</span>
                  </div>
                  {/* Bars */}
                  <div className="flex-1 flex items-end justify-around h-full border-b border-border pb-0 relative">
                    {/* 2023 */}
                    <div className="flex flex-col items-center gap-2 w-12">
                      <div className="w-full rounded-t-sm" style={{ height: "55%", backgroundColor: "var(--theme-chart-1, var(--theme-primary))" }} />
                      <span className="text-xs text-muted-foreground absolute -bottom-6">2023</span>
                    </div>
                    {/* 2024 */}
                    <div className="flex flex-col items-center gap-2 w-12">
                      <div className="w-full rounded-t-sm" style={{ height: "70%", backgroundColor: "var(--theme-chart-1, var(--theme-primary))" }} />
                      <span className="text-xs text-muted-foreground absolute -bottom-6">2024</span>
                    </div>
                    {/* 2025 */}
                    <div className="flex flex-col items-center gap-2 w-12">
                      <div className="w-full rounded-t-sm" style={{ height: "65%", backgroundColor: "var(--theme-chart-1, var(--theme-primary))" }} />
                      <span className="text-xs text-muted-foreground absolute -bottom-6">2025</span>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: "var(--theme-chart-1, var(--theme-primary))" }} />
                    <span className="text-xs text-muted-foreground">Your Contributions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-sm bg-muted" />
                    <span className="text-xs text-muted-foreground">Remaining to IRS Max</span>
                  </div>
                </div>

                {/* Donut Chart Mock (Paid Claims) */}
                <div className="pt-6 border-t border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">Paid Claims by Category</h4>
                    <span className="text-xs text-muted-foreground">01/01/2025 &ndash; 12/31/2025</span>
                  </div>
                  <div className="flex items-center gap-6">
                    {/* Donut */}
                    <div className="relative h-24 w-24 shrink-0 rounded-full border-[8px] border-muted">
                      <div className="absolute inset-0 rounded-full border-[8px] border-transparent border-t-primary border-r-primary rotate-45" style={{ borderColor: "var(--theme-chart-1, var(--theme-primary))" }} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold">$750</span>
                        <span className="text-[10px] text-muted-foreground">Total Paid</span>
                      </div>
                    </div>
                    {/* Legend List */}
                    <div className="flex-1 space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: "var(--theme-chart-1, var(--theme-primary))" }} />
                            <span className="font-medium">Medical</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">60%</span>
                            <span className="font-semibold">$450</span>
                          </div>
                        </div>
                        <Progress value={60} className="h-1.5" data-theme-token="primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: "var(--theme-chart-2, var(--theme-secondary))" }} />
                            <span className="font-medium">Dental</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">27%</span>
                            <span className="font-semibold">$200</span>
                          </div>
                        </div>
                        <Progress value={27} className="h-1.5" indicatorClassName="bg-[var(--theme-chart-2,var(--theme-secondary))]" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-sm" style={{ backgroundColor: "var(--theme-chart-3, var(--theme-illustration))" }} />
                            <span className="font-medium">Vision</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">13%</span>
                            <span className="font-semibold">$100</span>
                          </div>
                        </div>
                        <Progress value={13} className="h-1.5" indicatorClassName="bg-[var(--theme-chart-3,var(--theme-illustration))]" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* HSA For Life */}
          <div className="space-y-4">
            <Card data-preview-card className="w-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--theme-primary-ramp-50)" }}>
                    <Wallet className="h-5 w-5" style={{ color: "var(--theme-primary)" }} />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-display">HSA For Life</CardTitle>
                    <CardDescription className="text-xs">
                      Health Savings - 2026 plan year
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground">Cash balance</p>
                  <p className="text-4xl font-bold tracking-tight">$0.00</p>
                </div>

                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "var(--theme-primary)" }} />
                  <div>
                    <p className="text-sm font-medium">Your HSA is ready to fund</p>
                    <p className="text-xs text-muted-foreground mt-1">Contribute pre-tax dollars to save on eligible medical expenses.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>0% of contribution limit used</span>
                    <span className="font-medium">$4,300.00 remaining</span>
                  </div>
                  <Progress value={0} data-theme-token="primary" className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground">2025 IRS limit: $4,300.00 (individual)</p>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button intent="primary" variant="solid" size="md" className="w-full justify-center" data-preview-button data-theme-token="primary">
                  Make your first contribution
                </Button>
              </CardFooter>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}