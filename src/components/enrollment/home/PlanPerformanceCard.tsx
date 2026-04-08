import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight, Sparkles, Target, BarChart3 } from "lucide-react";
import {
  getPlanDetails,
  estimatedSavingsVsAlternative,
} from "@/lib/planDetailsLookup";
import { type EnrollmentSubmissionV1 } from "@/lib/enrollmentSubmissionStorage";
import { getPlanByType, calculateCoverageTier, type PlanType } from "@/lib/allPlansLookup";
import { calculateYTD, calculatePayPeriodsSince, formatCentsAsCurrency } from "@/lib/premiumCalculator";
import { type SimulationMode, generate6MonthSimulation, generateCobraSimulation } from "@/lib/simulatedExpenses";

const softEaseOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

function useInView(opts?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true);
    }, opts);
    obs.observe(el);
    return () => obs.unobserve(el);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { ref, visible };
}



interface Props {
  submission: EnrollmentSubmissionV1;
  simulationMode?: SimulationMode;
}

export function PlanPerformanceCard({ submission, simulationMode = "modern" }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const { ref, visible } = useInView({ threshold: 0.2 });
  const isSimulated = simulationMode === "simulated";
  const isCobra = simulationMode === "cobra";
  const simData = isCobra
    ? generateCobraSimulation(submission)
    : isSimulated
      ? generate6MonthSimulation(submission)
      : null;

  const medicalPlanId = submission.snapshot.plans.medical?.selectedPlanId ?? null;
  const dentalPlanId = submission.snapshot.plans.dental?.selectedPlanId ?? null;
  const visionPlanId = submission.snapshot.plans.vision?.selectedPlanId ?? null;

  const medicalEnrollees = submission.snapshot.plans.medical?.enrollees ?? [];
  const dentalEnrollees = submission.snapshot.plans.dental?.enrollees ?? [];
  const visionEnrollees = submission.snapshot.plans.vision?.enrollees ?? [];

  const medicalPlan = getPlanDetails(medicalPlanId);
  const isFamilyCoverage = !submission.snapshot.household?.selfOnly;

  if (!medicalPlan) return null;

  const deductible = isFamilyCoverage
    ? medicalPlan.familyDeductible
    : medicalPlan.individualDeductible;
  const oopMax = isFamilyCoverage
    ? medicalPlan.familyOopMax
    : medicalPlan.individualOopMax;
  const medicalSavings = estimatedSavingsVsAlternative(medicalPlanId);

  const spentDeductible = simData?.medicalDeductibleSpent ?? 0;
  const spentOop = simData?.medicalOopSpent ?? 0;

  const enrolledPlans: Array<{ type: PlanType; planId: string; enrollees: string[]; label: string }> = [];
  
  if (medicalPlanId && medicalPlanId !== "waive") {
    enrolledPlans.push({ type: "medical", planId: medicalPlanId, enrollees: medicalEnrollees, label: "Medical Plan" });
  }
  if (dentalPlanId && dentalPlanId !== "waive") {
    enrolledPlans.push({ type: "dental", planId: dentalPlanId, enrollees: dentalEnrollees, label: "Dental Plan" });
  }
  if (visionPlanId && visionPlanId !== "waive") {
    enrolledPlans.push({ type: "vision", planId: visionPlanId, enrollees: visionEnrollees, label: "Vision Plan" });
  }

  const hasFamilyCoverageOnAll = 
    enrolledPlans.length > 0 &&
    enrolledPlans.every(p => {
      const tier = calculateCoverageTier(p.enrollees);
      return tier !== "employeeOnly";
    });

  const hasRecommendedMedical = medicalPlanId === "acme-hdhp";
  const totalSavings = medicalSavings;
  
  let insightMessage = "";
  if ((isSimulated || isCobra) && simData) {
    insightMessage = simData.insightMessage;
  } else if (totalSavings > 0) {
    if (hasRecommendedMedical && enrolledPlans.length >= 2) {
      insightMessage = `You're making great choices! You've saved ${formatCurrency(totalSavings)} by selecting the recommended medical plan and enrolling in ${enrolledPlans.length} benefit plans`;
    } else if (hasFamilyCoverageOnAll) {
      insightMessage = `You've saved ${formatCurrency(totalSavings)} with your current plan and have comprehensive family coverage across all your benefits`;
    } else {
      insightMessage = `You've saved ${formatCurrency(totalSavings)} with your current plan compared to the next best plan`;
    }
  } else if (enrolledPlans.length >= 2) {
    insightMessage = `You're on track with deductible spending and maximizing employer contributions across ${enrolledPlans.length} benefit plans`;
  }


  const effectiveSubmission = (isSimulated || isCobra) && simData
    ? { ...submission, submittedAtIso: simData.submittedAtIsoOverride }
    : submission;

  return (
    <div
      ref={ref}
      className="rounded-[24px] bg-background border border-border shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <h3 className="text-[16px] font-semibold text-foreground">
          Plan Performance
        </h3>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="px-6 pb-6 flex flex-col gap-5">
        {/* Title + savings */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[28px] font-bold text-foreground leading-tight">
            Well Insured
          </h2>
          {insightMessage && (
            <motion.div
              className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-start gap-3"
              initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: softEaseOut }}
            >
              <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-[14px] font-medium text-primary leading-snug">
                {insightMessage}
              </p>
            </motion.div>
          )}
        </div>

        {/* Deductible Progress Section */}
        {enrolledPlans.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-[16px] font-semibold text-foreground">
                Deductible Progress
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {enrolledPlans.map((planInfo, idx) => {
                const plan = getPlanByType(planInfo.type, planInfo.planId);
                const coverageTier = calculateCoverageTier(planInfo.enrollees);
                
                if (!plan) return null;

                const hasDeductible = plan.individualDeductible !== undefined;
                const deductibleAmount = coverageTier === "family" || coverageTier === "employeeChildren" || coverageTier === "employeeSpouse"
                  ? plan.familyDeductible ?? plan.individualDeductible ?? 0
                  : plan.individualDeductible ?? 0;

                let spentAmount = 0;
                if ((isSimulated || isCobra) && simData) {
                  if (planInfo.type === "medical") spentAmount = simData.medicalDeductibleSpent;
                  else if (planInfo.type === "dental") spentAmount = simData.dentalDeductibleSpent;
                }

                if (!hasDeductible || deductibleAmount === 0) {
                  return null;
                }

                return (
                  <PlanDeductibleCard
                    key={`${planInfo.type}-${planInfo.planId}`}
                    planLabel={plan.name ?? planInfo.label}
                    deductible={deductibleAmount}
                    spent={spentAmount}
                    visible={visible}
                    delay={0.3 + idx * 0.1}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* 3 sub-cards - Medical detailed view */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DeductibleCard
            title="Pay Deductible"
            subtitle={`Your deductible: ${formatCurrency(deductible)}`}
            spent={spentDeductible}
            total={deductible}
            visible={visible}
            delay={0.4}
          />
          <OopMaxCard
            title="Reach Out-of-Pocket Max"
            subtitle={`Your maximum: ${formatCurrency(oopMax)}`}
            spent={spentOop}
            total={oopMax}
            visible={visible}
            delay={0.55}
          />
          <PlanPaysCard delay={0.7} />
        </div>

        {/* Premium Summary YTD */}
        <PremiumSummaryCard submission={effectiveSubmission} visible={visible} isCobra={isCobra} />
      </div>
    </div>
  );
}

interface AmountCardProps {
  title: string;
  subtitle: string;
  spent: number;
  total: number;
  visible: boolean;
  delay: number;
}

function DeductibleCard({ title, subtitle, spent, total, visible, delay }: AmountCardProps) {
  const remaining = total - spent;
  const pct = total > 0 ? (spent / total) * 100 : 0;

  return (
    <motion.div
      className="rounded-[16px] border border-border bg-background p-5 flex flex-col gap-3 shadow-sm"
      initial={{ opacity: 0, y: 12 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: softEaseOut }}
    >
      <div className="flex flex-col gap-1">
        <h4 className="text-[15px] font-bold text-foreground">{title}</h4>
        <p className="text-[13px] text-muted-foreground">{subtitle}</p>
      </div>

      {/* Progress bar */}
      <div className="flex h-[8px] w-full items-center overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{
            width: visible ? `${Math.max(pct, 2)}%` : "0%",
            transition: "width 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s",
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between text-[12px]">
        <div>
          <span className="font-semibold text-foreground">
            {formatCurrency(spent)}
          </span>
          <br />
          <span className="text-muted-foreground">Spent</span>
        </div>
        <div className="text-right">
          <span className="font-semibold text-foreground">
            {formatCurrency(remaining)}
          </span>
          <br />
          <span className="text-muted-foreground">Remaining</span>
        </div>
      </div>
    </motion.div>
  );
}

function OopMaxCard({ title, subtitle, spent, total, visible, delay }: AmountCardProps) {
  const remaining = total - spent;
  const pct = total > 0 ? (spent / total) * 100 : 0;

  return (
    <motion.div
      className="rounded-[16px] border border-border bg-background p-5 flex flex-col gap-3 shadow-sm"
      initial={{ opacity: 0, y: 12 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: softEaseOut }}
    >
      <div className="flex flex-col gap-1">
        <h4 className="text-[15px] font-bold text-foreground">{title}</h4>
        <p className="text-[13px] text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex h-[8px] w-full items-center overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{
            width: visible ? `${Math.max(pct, 2)}%` : "0%",
            transition: "width 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.45s",
          }}
        />
      </div>

      <div className="flex items-center justify-between text-[12px]">
        <div>
          <span className="font-semibold text-foreground">
            {formatCurrency(spent)}
          </span>
          <br />
          <span className="text-muted-foreground">Spent</span>
        </div>
        <div className="text-right">
          <span className="font-semibold text-foreground">
            {formatCurrency(remaining)}
          </span>
          <br />
          <span className="text-muted-foreground">Remaining</span>
        </div>
      </div>
    </motion.div>
  );
}

function PlanPaysCard({ delay }: { delay: number }) {
  return (
    <motion.div
      className="rounded-[16px] border border-border bg-background p-5 flex flex-col gap-2 shadow-sm"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: softEaseOut }}
    >
      <h4 className="text-[15px] font-bold text-foreground">Plan Pays 100%</h4>
      <p className="text-[13px] text-muted-foreground leading-relaxed">
        You&apos;ve met your out-of-pocket maximum. Insurance pays 100% of
        covered services
      </p>
    </motion.div>
  );
}

interface PlanDeductibleCardProps {
  planLabel: string;
  deductible: number;
  spent: number;
  visible: boolean;
  delay: number;
}

function PlanDeductibleCard({ planLabel, deductible, spent, visible, delay }: PlanDeductibleCardProps) {
  const remaining = deductible - spent;
  const pct = deductible > 0 ? (spent / deductible) * 100 : 0;

  return (
    <motion.div
      className="rounded-[16px] border border-border bg-background/80 p-4 flex flex-col gap-3 shadow-sm"
      initial={{ opacity: 0, y: 8 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: softEaseOut }}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-[14px] font-semibold text-foreground">{planLabel}</h4>
        <span className="text-[13px] text-muted-foreground">
          {formatCurrency(remaining)} remaining
        </span>
      </div>

      <div className="flex h-[4px] w-full items-center overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{
            width: visible ? `${Math.max(pct, 2)}%` : "0%",
            transition: "width 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.2s",
          }}
        />
      </div>

      <div className="flex items-center justify-between text-[12px] text-muted-foreground">
        <span>{formatCurrency(spent)} spent</span>
        <span>{formatCurrency(spent)} of {formatCurrency(deductible)}</span>
      </div>
    </motion.div>
  );
}

interface PremiumSummaryCardProps {
  submission: EnrollmentSubmissionV1;
  visible: boolean;
  isCobra?: boolean;
}

function PremiumSummaryCard({ submission, visible, isCobra = false }: PremiumSummaryCardProps) {
  const baseBiWeeklyCents = submission.totals.plansBiWeeklyCents;

  const biWeeklyCents = isCobra
    ? Math.round(baseBiWeeklyCents * 1.02)
    : baseBiWeeklyCents;
  const employerBiWeeklyCents = isCobra ? 0 : baseBiWeeklyCents * 0.6;

  const ytdData = calculateYTD(
    submission.submittedAtIso,
    biWeeklyCents,
    employerBiWeeklyCents
  );

  const cobraSurchargeCents = isCobra
    ? Math.round(baseBiWeeklyCents * 0.02) * calculatePayPeriodsSince(submission.submittedAtIso)
    : 0;

  return (
    <motion.div
      className="pt-5 mt-2 border-t border-border"
      initial={{ opacity: 0, y: 12 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: 0.8, ease: softEaseOut }}
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-[14px] font-semibold text-foreground uppercase tracking-wide">
          {isCobra ? "COBRA Premium Summary YTD" : "Premium Summary YTD"}
        </h3>
      </div>

      <div className={`grid ${isCobra ? "grid-cols-5" : "grid-cols-4"} gap-4`}>
        <SummaryItem label="Total Paid YTD" value={ytdData.totalPaidYTD} color="text-foreground" size="large" />
        <SummaryItem label="Your Share" value={ytdData.yourShareYTD} color={isCobra ? "text-destructive" : "text-primary"} size="medium" />
        <SummaryItem label="Employer Share" value={ytdData.employerShareYTD} color={isCobra ? "text-muted-foreground" : "text-success-text"} size="medium" />
        {isCobra && (
          <SummaryItem label="COBRA Surcharge (2%)" value={cobraSurchargeCents} color="text-amber-600" size="medium" />
        )}
        <SummaryItem label="Annual Projected" value={ytdData.annualProjected} color="text-foreground" size="large" />
      </div>
    </motion.div>
  );
}

interface SummaryItemProps {
  label: string;
  value: number;
  color: string;
  size: "medium" | "large";
}

function SummaryItem({ label, value, color, size }: SummaryItemProps) {
  const textSize = size === "large" ? "text-[22px]" : "text-[18px]";
  const fontWeight = size === "large" ? "font-bold" : "font-semibold";

  return (
    <div className="flex flex-col gap-1">
      <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
      <div className={`${textSize} ${fontWeight} ${color}`}>
        {formatCentsAsCurrency(value)}
      </div>
    </div>
  );
}
