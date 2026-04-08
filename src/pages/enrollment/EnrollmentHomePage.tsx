import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/enrollment/Navigation";
import { Footer } from "@/components/enrollment/Footer";
import { loadEnrollmentSubmission, type EnrollmentSubmissionV1 } from "@/lib/enrollmentSubmissionStorage";
import {
  coveragePeriodFromEffectiveDate,
  EFFECTIVE_DATE,
} from "@/lib/enrollmentCoveragePeriod";
import { PageFadeIn, FadeInItem } from "@/components/layout/PageFadeIn";
import { AssistantIQHero } from "@/components/enrollment/home/AssistantIQHero";
import { PlanPerformanceCard } from "@/components/enrollment/home/PlanPerformanceCard";
import {
  EnrollmentAccountsSection,
  type Elections,
} from "@/components/enrollment/home/EnrollmentAccountsSection";
import { PrototypeToggle } from "@/components/enrollment/home/PrototypeToggle";
import { type SimulationMode } from "@/lib/simulatedExpenses";
import { clearEnrollmentStorage } from "@/lib/clearEnrollmentStorage";
import svgPaths from "@/imports/svg-i1hhvy1f50";
import { Bell, ChevronRight, CheckCircle2, Sparkles } from "lucide-react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function EnrollmentHomePage() {
  const navigate = useNavigate();
  const greeting = getGreeting();
  const [submission, setSubmission] = React.useState<EnrollmentSubmissionV1 | null>(
    () => loadEnrollmentSubmission(),
  );
  const coveragePeriod = React.useMemo(
    () => coveragePeriodFromEffectiveDate(EFFECTIVE_DATE),
    [],
  );
  const [simulationMode, setSimulationMode] = React.useState<SimulationMode>(
    () => (loadEnrollmentSubmission() ? "modern" : "preEnrollment"),
  );

  const handleModeChange = (newMode: SimulationMode) => {
    if (newMode === "preEnrollment") {
      clearEnrollmentStorage();
      setSubmission(null);
    }
    setSimulationMode(newMode);
  };

  if (!submission) {
    return (
      <div className="min-h-screen bg-[hsl(228,53%,96%)] flex flex-col">
        <Navigation />

        <main className="flex-1 relative pt-16">
          <div className="relative max-w-[1200px] mx-auto px-6 sm:px-8 pt-10 pb-12">
            <div
              className="rounded-[20px] shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08),0_8px_16px_-8px_rgba(15,23,42,0.06)] border border-border/40 overflow-hidden grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1.15fr)] divide-y divide-slate-200 lg:divide-y-0 lg:divide-x lg:divide-slate-200"
              style={{
                background: `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1200 523.5' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(176.49 0 0 51.824 -48 157.05)'><stop stop-color='rgba(23,45,161,0.09)' offset='0'/><stop stop-color='rgba(23,45,161,0)' offset='0.5'/></radialGradient></defs></svg>"), url("data:image/svg+xml;utf8,<svg viewBox='0 0 1200 523.5' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(176.49 0 0 55.526 1248 392.62)'><stop stop-color='rgba(200,16,46,0.07)' offset='0'/><stop stop-color='rgba(200,16,46,0)' offset='0.45'/></radialGradient></defs></svg>"), url("data:image/svg+xml;utf8,<svg viewBox='0 0 1200 523.5' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(93.338 0 0 103.65 660 732.9)'><stop stop-color='rgba(23,45,161,0.04)' offset='0'/><stop stop-color='rgba(23,45,161,0)' offset='0.4'/></radialGradient></defs></svg>"), linear-gradient(90deg, rgba(255, 255, 255, 0.93) 0%, rgba(255, 255, 255, 0.93) 100%)`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
              }}
            >

              {/* ── Left: Assistant IQ ── */}
              <div className="flex flex-col gap-8 p-8 sm:p-10 lg:min-h-[520px]">
                <div className="relative shrink-0 size-[52px] rounded-full overflow-hidden shadow-sm ring-1 ring-white/80">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'linear-gradient(172.91deg, rgb(37, 20, 111) 2.4625%, rgb(200, 16, 46) 100%)' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="size-6 text-white drop-shadow-sm" strokeWidth={2} />
                  </div>
                </div>

                <div className="flex flex-col gap-2 max-w-xl">
                  <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-bold text-foreground tracking-tight leading-tight">
                    {greeting}, Nicole
                  </h1>
                  <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">
                    Benefits can be confusing, we can help make them simple.
                  </p>
                </div>

                <div className="bg-white rounded-full border border-slate-200/90 flex items-center pl-5 pr-1.5 py-1.5 max-w-xl">
                  <input
                    type="text"
                    placeholder="Ask me... what I can use my FSA for"
                    className="flex-1 min-w-0 bg-transparent text-[15px] text-foreground placeholder:text-slate-400 outline-none"
                    readOnly
                  />
                  <div className="ml-1 flex items-center gap-1 shrink-0">
                    <div className="bg-indigo-50 rounded-full size-11 flex items-center justify-center border border-sky-100/80">
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M8 12.6667V14.6667" stroke="#0284c7" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        <path d={svgPaths.p4f72080} stroke="#0284c7" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        <path d={svgPaths.p1c53e800} stroke="#0284c7" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div
                      className="rounded-full size-11 flex items-center justify-center shadow-md"
                      style={{ background: 'linear-gradient(172.91deg, rgb(37, 20, 111) 2.4625%, rgb(200, 16, 46) 100%)' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <clipPath id="hp-send-clip"><rect width="16" height="16" fill="white" /></clipPath>
                        <g clipPath="url(#hp-send-clip)">
                          <path d={svgPaths.p22f0380} stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14.5693 1.43133L7.276 8.724" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Right: Your next steps ── */}
              <div className="flex flex-col gap-4 p-8 sm:p-10 lg:min-h-[520px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <Bell className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-[11px] font-bold text-primary tracking-[0.14em] uppercase">
                    Your Next Steps
                  </span>
                  <span className="inline-flex items-center justify-center rounded-full bg-sky-100 text-sky-900 text-[11px] font-bold px-2.5 py-0.5 border border-sky-200/60">
                    1 Task
                  </span>
                </div>

                <div className="flex-1 flex flex-col rounded-2xl bg-white border border-slate-200/80 p-6 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.12)] gap-5">
                  <span className="inline-flex self-start rounded-md bg-orange-50 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-slate-900 shadow-sm border border-amber-200/80">
                    New hire enrollment
                  </span>

                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-[22px] font-bold text-foreground leading-snug">
                      Benefits Enrollment
                    </h2>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">
                      Review available benefit options and make your selections to complete your new hire enrollment. Choose the plans and coverage levels that work best for you.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => { clearEnrollmentStorage(); navigate('/enrollment/profile'); }}
                      className="w-full rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 text-white font-semibold text-[15px] shadow-lg shadow-[rgb(37,20,111)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(37,20,111)] focus-visible:ring-offset-2"
                      style={{ background: 'linear-gradient(172.91deg, rgb(37, 20, 111) 2.4625%, rgb(200, 16, 46) 100%)' }}
                    >
                      Enroll Now
                      <ChevronRight className="h-4 w-4 shrink-0 opacity-90" />
                    </button>
                    <button
                      type="button"
                      className="text-center text-[13px] text-muted-foreground hover:text-foreground transition-colors py-1"
                    >
                      Remind me tomorrow
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[13px] text-sky-800/80 pt-1">
                  <CheckCircle2 className="h-4 w-4 text-sky-600/70 shrink-0" />
                  <span>You&apos;re all caught up on other tasks</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        <PrototypeToggle mode={simulationMode} onChange={handleModeChange} hasSubmission={false} />
        <Footer />
      </div>
    );
  }

  // Enrolled state -- derive data
  const plans = submission.snapshot.plans;
  const elections = submission.snapshot.spendingAccounts.elections as Elections;
  const medicalPlanId = plans.medical?.selectedPlanId ?? null;

  const savedAccounts = submission.snapshot.spendingAccounts.selected ?? [];
  const hsaElection = (elections as Elections & { hsa?: { electionCents: number } }).hsa;
  const isHdhp = medicalPlanId === "acme-hdhp";
  const selectedAccounts =
    isHdhp && hsaElection && hsaElection.electionCents > 0 && !savedAccounts.includes("hsa")
      ? [...savedAccounts, "hsa"]
      : savedAccounts;
  const isFamilyCoverage = !submission.snapshot.household?.selfOnly;
  const isCobraEnroll = simulationMode === "cobraEnroll";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage:
          "linear-gradient(18.89deg, rgb(255,255,255) 17.85%, hsl(228,53%,96%) 86.81%, hsl(229,76%,89%) 103.68%)",
        backgroundAttachment: "fixed",
      }}
    >
      <Navigation />

      <main className="flex-1 relative pt-16 font-['Inter']">
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <PageFadeIn className="space-y-8">
            {/* Hero: Assistant IQ */}
            <FadeInItem>
              <AssistantIQHero
                memberName="Nicole"
                showHsaInvestCta={true}
                simulationMode={simulationMode}
              />
            </FadeInItem>

            {/* Plan Performance Card */}
            {((medicalPlanId && medicalPlanId !== "waive") || 
              (plans.dental?.selectedPlanId && plans.dental.selectedPlanId !== "waive") ||
              (plans.vision?.selectedPlanId && plans.vision.selectedPlanId !== "waive")) && (
              <FadeInItem>
                <PlanPerformanceCard submission={submission} simulationMode={isCobraEnroll ? "simulated" : simulationMode} />
              </FadeInItem>
            )}

            {/* Spending Accounts (spark-2026 card layouts) */}
            <FadeInItem>
              <EnrollmentAccountsSection
                selectedAccounts={selectedAccounts}
                elections={elections}
                coveragePeriod={coveragePeriod}
                isFamilyCoverage={isFamilyCoverage}
                simulationMode={isCobraEnroll ? "simulated" : simulationMode}
              />
            </FadeInItem>
          </PageFadeIn>
        </div>
      </main>

      <PrototypeToggle mode={simulationMode} onChange={handleModeChange} hasSubmission={true} />
      <Footer />
    </div>
  );
}
