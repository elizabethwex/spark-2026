import * as React from "react";

import EnrollmentLayout from "./EnrollmentLayout";
import { WexFloatLabel, WexInput } from "@wex/components-react/form-inputs";
import { loadHsaState, saveHsaState } from "@/lib/hsaStorage";

// HSA Add Funds Page - Configure annual and per-pay-period contributions
type HsaAddFundsPageProps = {
  currentStepId: string;
  onStepChange: (stepId: string) => void;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
};

const MIN_INDIVIDUAL_CONTRIBUTION_CENTS = 0;
const MAX_INDIVIDUAL_CONTRIBUTION_CENTS = 4150_00; // 2026 IRS limit for individual
const MAX_FAMILY_CONTRIBUTION_CENTS = 8750_00;     // 2026 IRS limit for family
const EMPLOYER_CONTRIBUTION_CENTS = 500_00; // $500 employer contribution
const PAY_PERIODS_PER_YEAR = 26;
const DEPENDENTS_STORAGE_KEY = "enrollment.dependents.v1";

function hasDependentsSelected(): boolean {
  try {
    const raw = localStorage.getItem(DEPENDENTS_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1) return false;
    return Array.isArray(parsed.selectedIds) && parsed.selectedIds.length > 0 && !parsed.selfOnly;
  } catch {
    return false;
  }
}

function formatCurrencyFromCents(cents: number): string {
  const dollars = (cents / 100).toFixed(2);
  const [intPart, decPart] = dollars.split(".");
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$${withCommas}.${decPart ?? "00"}`;
}

function parseCurrencyToCents(input: string): number {
  const cleaned = input.replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.round(n * 100));
}

export default function HsaAddFundsPage({ currentStepId, onStepChange, onBack, onNext, onCancel }: HsaAddFundsPageProps) {
  const initial = React.useMemo(() => loadHsaState(), []);
  const hasFamily = React.useMemo(() => hasDependentsSelected(), []);
  const MAX_CONTRIBUTION_CENTS = hasFamily ? MAX_FAMILY_CONTRIBUTION_CENTS : MAX_INDIVIDUAL_CONTRIBUTION_CENTS;
  const coverageLabel = hasFamily ? "Family" : "Individual";

  const [annualText, setAnnualText] = React.useState<string>(() => formatCurrencyFromCents(initial.electionCents));
  const [perPayPeriodText, setPerPayPeriodText] = React.useState<string>(() => {
    const perPay = PAY_PERIODS_PER_YEAR > 0 ? Math.round(initial.electionCents / PAY_PERIODS_PER_YEAR) : 0;
    return formatCurrencyFromCents(perPay);
  });
  const [lastEdited, setLastEdited] = React.useState<"annual" | "perPay">("annual");

  const annualCents = React.useMemo(() => parseCurrencyToCents(annualText), [annualText]);
  const perPayPeriodCents = React.useMemo(() => parseCurrencyToCents(perPayPeriodText), [perPayPeriodText]);
  
  const clampedAnnualCents = Math.min(annualCents, MAX_CONTRIBUTION_CENTS);
  const clampedPerPayPeriodCents = Math.min(perPayPeriodCents * PAY_PERIODS_PER_YEAR, MAX_CONTRIBUTION_CENTS);

  // Derived display value for summary: use the appropriate source based on which field was last edited
  const summaryAnnualCents = lastEdited === "annual" ? clampedAnnualCents : clampedPerPayPeriodCents;
  const totalAnnualWithEmployerCents = summaryAnnualCents + EMPLOYER_CONTRIBUTION_CENTS;
  const showMaxError = annualCents > MAX_CONTRIBUTION_CENTS;

  const persist = (nextElectionCents: number) => {
    saveHsaState({
      ...initial,
      version: 1,
      electionCents: Math.min(Math.max(0, Math.round(nextElectionCents)), MAX_CONTRIBUTION_CENTS),
    });
  };

  const handleSaveContinue = () => {
    persist(summaryAnnualCents);
    onNext();
  };

  const hasContribution = summaryAnnualCents > 0;

  return (
    <EnrollmentLayout
      currentStepId={currentStepId}
      cancelAction={{ label: "Cancel", onClick: onCancel }}
      onStepChange={onStepChange}
      onBack={onBack}
      onNext={() => {}}
      primaryAction={{ label: "Save & Continue", onClick: handleSaveContinue }}
      primaryActionDisabled={!hasContribution}
    >
      <div className="pt-14 flex justify-center">
        <div className="relative w-[min(1136px,92vw)]">
          {/* Right summary card */}
          <div className="absolute right-0 top-0 w-[344px]">
            <div className="bg-white rounded-[12px] border border-border shadow-[0px_4px_10px_0px_rgba(2,13,36,0.15),0px_0px_1px_0px_rgba(2,13,36,0.3)] p-4">
              <div className="text-[14px] font-semibold leading-6 tracking-[0.28px] text-foreground">Summary</div>

              <div className="mt-2 flex items-center justify-between text-[14px] leading-6 tracking-[0.28px] text-foreground">
                <div>Your contribution:</div>
                <div className="text-right">{formatCurrencyFromCents(summaryAnnualCents)}</div>
              </div>

              <div className="flex items-center justify-between text-[14px] leading-6 tracking-[0.28px] text-foreground">
                <div>Employer contribution:</div>
                <div className="text-right">{formatCurrencyFromCents(EMPLOYER_CONTRIBUTION_CENTS)}</div>
              </div>

              <div className="my-2 h-px w-full bg-border" />

              <div className="flex items-center justify-between text-[14px] leading-6 tracking-[0.28px] text-foreground">
                <div className="font-semibold">Total annual contribution:</div>
                <div className="text-right font-semibold">{formatCurrencyFromCents(totalAnnualWithEmployerCents)}</div>
              </div>

              <div className="flex items-center justify-between text-[14px] leading-6 tracking-[0.28px] text-muted-foreground">
                <div>Per pay period deduction:</div>
                <div className="text-right">
                  {formatCurrencyFromCents(
                    PAY_PERIODS_PER_YEAR > 0 ? Math.round(summaryAnnualCents / PAY_PERIODS_PER_YEAR) : 0
                  )}
                </div>
              </div>

              <div className="mt-3 rounded-[6px] border border-primary/30 bg-primary/5 p-2 shadow-[0px_4px_8px_0px_rgba(2,5,10,0.04)]">
                <div className="text-[13px] leading-5 text-primary">
                  <strong>Contribution Limits (2026):</strong>
                  <br />
                  {coverageLabel}: {formatCurrencyFromCents(MAX_CONTRIBUTION_CENTS)}
                  <br />
                  Minimum: {formatCurrencyFromCents(MIN_INDIVIDUAL_CONTRIBUTION_CENTS)}
                </div>
              </div>
            </div>
          </div>

          {/* Main column */}
          <div className="mx-auto w-[400px] flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <h2 className="text-[24px] font-bold leading-8 tracking-[-0.456px] text-foreground">
                HSA Contributions
              </h2>
              <div className="text-[16px] leading-6 tracking-[-0.176px] text-foreground">
                <p className="mb-4">
                  Your employer will contribute <strong>{formatCurrencyFromCents(EMPLOYER_CONTRIBUTION_CENTS)}</strong> to 
                  your HSA. You can also make your own pre-tax contributions to maximize your savings.
                </p>
                <p>
                  For 2026, the IRS contribution limit for {coverageLabel.toLowerCase()} coverage is{" "}
                  <strong>{formatCurrencyFromCents(MAX_CONTRIBUTION_CENTS)}</strong>. This includes both your 
                  contributions and employer contributions.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-[14px] font-semibold leading-6 tracking-[-0.084px] text-foreground">
                Enter your contribution amount
              </div>

              {/* Annual Amount */}
              <div className="flex flex-col gap-2">
                <WexFloatLabel>
                  <WexFloatLabel.Input>
                    <WexInput
                      value={annualText}
                      inputMode="decimal"
                      onChange={(e) => {
                        const raw = e.target.value;
                        setAnnualText(raw);
                        setLastEdited("annual");
                        // Auto-calculate per pay period from annual
                        const cents = parseCurrencyToCents(raw);
                        const clamped = Math.min(cents, MAX_CONTRIBUTION_CENTS);
                        const perPay = PAY_PERIODS_PER_YEAR > 0 ? Math.round(clamped / PAY_PERIODS_PER_YEAR) : 0;
                        setPerPayPeriodText(formatCurrencyFromCents(perPay));
                        persist(clamped);
                      }}
                      onBlur={() => {
                        const cents = parseCurrencyToCents(annualText);
                        const clamped = Math.min(cents, MAX_CONTRIBUTION_CENTS);
                        setAnnualText(formatCurrencyFromCents(clamped));
                        const perPay = PAY_PERIODS_PER_YEAR > 0 ? Math.round(clamped / PAY_PERIODS_PER_YEAR) : 0;
                        setPerPayPeriodText(formatCurrencyFromCents(perPay));
                        persist(clamped);
                      }}
                    />
                  </WexFloatLabel.Input>
                  <WexFloatLabel.Label>Annual Contribution Amount</WexFloatLabel.Label>
                </WexFloatLabel>
                {showMaxError && (
                  <div className="text-xs text-destructive">
                    Maximum contribution: {formatCurrencyFromCents(MAX_CONTRIBUTION_CENTS)}
                  </div>
                )}
              </div>

              {/* Per Pay Period Amount */}
              <div className="flex flex-col gap-2">
                <WexFloatLabel>
                  <WexFloatLabel.Input>
                    <WexInput
                      value={perPayPeriodText}
                      inputMode="decimal"
                      onChange={(e) => {
                        const raw = e.target.value;
                        setPerPayPeriodText(raw);
                        setLastEdited("perPay");
                        // Auto-calculate annual from per pay period
                        const cents = parseCurrencyToCents(raw);
                        const annualFromPerPay = cents * PAY_PERIODS_PER_YEAR;
                        const clamped = Math.min(annualFromPerPay, MAX_CONTRIBUTION_CENTS);
                        const adjustedPerPay = PAY_PERIODS_PER_YEAR > 0 ? Math.round(clamped / PAY_PERIODS_PER_YEAR) : 0;
                        setAnnualText(formatCurrencyFromCents(clamped));
                        persist(adjustedPerPay);
                      }}
                      onBlur={() => {
                        const cents = parseCurrencyToCents(perPayPeriodText);
                        const annualFromPerPay = cents * PAY_PERIODS_PER_YEAR;
                        const clamped = Math.min(annualFromPerPay, MAX_CONTRIBUTION_CENTS);
                        const adjustedPerPay = PAY_PERIODS_PER_YEAR > 0 ? Math.round(clamped / PAY_PERIODS_PER_YEAR) : 0;
                        setPerPayPeriodText(formatCurrencyFromCents(adjustedPerPay));
                        setAnnualText(formatCurrencyFromCents(clamped));
                        persist(adjustedPerPay);
                      }}
                    />
                  </WexFloatLabel.Input>
                  <WexFloatLabel.Label>Per Pay Period Deduction (26 pay periods)</WexFloatLabel.Label>
                </WexFloatLabel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EnrollmentLayout>
  );
}