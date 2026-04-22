import { loadLpfsaState, saveLpfsaState } from "@/lib/lpfsaStorage";
import { loadFsaState } from "@/lib/fsaStorage";
import * as React from "react";

import EnrollmentLayout from "./EnrollmentLayout";
import { WexFloatLabel, WexCheckbox, WexInput } from "@wex/components-react/form-inputs";

type LpfsaPageProps = {
  currentStepId: string;
  onStepChange: (stepId: string) => void;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
};

const MAX_ELECTION_CENTS = 3050_00;
const TAX_RATE = 0.3;
const PAY_PERIODS_PER_YEAR = 26;

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

export default function LpfsaPage({ currentStepId, onStepChange, onBack, onNext, onCancel }: LpfsaPageProps) {
  const initial = React.useMemo(() => loadLpfsaState(), []);
  const [electionText, setElectionText] = React.useState<string>(() => formatCurrencyFromCents(initial.electionCents));
  const [ack, setAck] = React.useState<boolean>(() => initial.acknowledgedRules);

  const electionCents = React.useMemo(() => parseCurrencyToCents(electionText), [electionText]);
  const clampedElectionCents = Math.min(electionCents, MAX_ELECTION_CENTS);

  const fsaState = React.useMemo(() => loadFsaState(), []);
  const fsaElectionCents = fsaState.electionCents;

  const totalElectionCents = fsaElectionCents + clampedElectionCents;
  const totalTaxSavingsCents = Math.round(totalElectionCents * TAX_RATE);
  const totalPerPayDeductionCents =
    PAY_PERIODS_PER_YEAR > 0 ? Math.round(totalElectionCents / PAY_PERIODS_PER_YEAR) : 0;

  const showMaxError = electionCents > MAX_ELECTION_CENTS;

  const persist = (nextElectionCents: number, nextAck: boolean) => {
    saveLpfsaState({
      version: 1,
      electionCents: Math.min(Math.max(0, Math.round(nextElectionCents)), MAX_ELECTION_CENTS),
      acknowledgedRules: nextAck,
    });
  };

  const handleSaveContinue = () => {
    persist(clampedElectionCents, ack);
    onNext();
  };

  return (
    <EnrollmentLayout
      currentStepId={currentStepId}
      cancelAction={{ label: "Cancel", onClick: onCancel }}
      onStepChange={onStepChange}
      onBack={onBack}
      onNext={() => {}}
      primaryAction={{ label: "Save & Continue", onClick: handleSaveContinue }}
      primaryActionDisabled={!ack}
    >
      <div className="pt-14 flex justify-center">
        <div className="relative w-[min(1136px,92vw)]">
          {/* Right summary card */}
          <div className="absolute right-0 top-0 w-[344px]">
            <div className="bg-white rounded-[12px] border border-border shadow-[0px_4px_10px_0px_rgba(2,13,36,0.15),0px_0px_1px_0px_rgba(2,13,36,0.3)] p-4">
              <div className="text-[14px] font-semibold leading-6 tracking-[0.28px] text-foreground">Plans</div>

              <div className="mt-2 flex items-center justify-between text-[14px] leading-6 tracking-[0.28px] text-foreground">
                <div>FSA</div>
                <div className="text-right">{formatCurrencyFromCents(fsaElectionCents)}</div>
              </div>

              <div className="flex items-center justify-between text-[14px] leading-6 tracking-[0.28px] text-foreground">
                <div>LPFSA</div>
                <div className="text-right">{formatCurrencyFromCents(clampedElectionCents)}</div>
              </div>

              <div className="my-2 h-px w-full bg-border" />

              <div className="flex items-center justify-between text-[14px] leading-6 tracking-[0.28px] text-foreground">
                <div>Total election for the year:</div>
                <div className="text-right">{formatCurrencyFromCents(totalElectionCents)}</div>
              </div>
              <div className="flex items-center justify-between text-[14px] leading-6 tracking-[0.28px] text-foreground">
                <div>Total tax savings for the year:*</div>
                <div className="text-right">{formatCurrencyFromCents(totalTaxSavingsCents)}</div>
              </div>
              
              <div className="flex items-center justify-between text-[14px] leading-6 tracking-[0.28px] text-foreground">
                <div>Estimated pay period deduction:</div>
                <div className="text-right">{formatCurrencyFromCents(totalPerPayDeductionCents)}</div>
              </div>

              <div className="my-2 h-px w-full bg-border" />

              <div className="mt-3 rounded-[6px] border border-primary/30 bg-primary/5 p-2 shadow-[0px_4px_8px_0px_rgba(2,5,10,0.04)]">
                <div className="text-[14px] font-medium text-primary">
                  * Tax savings estimate is based on a 30% tax rate. True tax savings will be based on your individual
                  circumstance.
                </div>
              </div>
            </div>
          </div>

          {/* Main column */}
          <div className="mx-auto w-[400px] flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <h2 className="text-[24px] font-bold leading-8 tracking-[-0.456px] text-foreground">
                Limited Purpose Flexible Spending Account (LPFSA)
              </h2>
              <div className="text-[16px] leading-6 tracking-[-0.176px] text-foreground">
                <p className="mb-0">
                  Eligible expenses must qualify as a medical deduction under Internal Revenue Service rules (Section
                  213(d)). Sample health care expenses include deductibles, co-pays, eyeglasses, contact lenses,
                  prescription and over-the-counter drugs, chiropractic care, therapy and corrective eye surgery (i.e.
                  Lasik).
                </p>
                <p className="mb-0">&nbsp;</p>
                <p>
                  Your enrollment or waiver is binding for the plan year, unless you experience a qualified change in
                  status under the rules of the plan. Pre-Tax Payroll reductions will begin upon the first payroll after
                  the Plan Year Start Date.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="text-[14px] font-semibold leading-6 tracking-[-0.084px] text-foreground">
                Enter your elections in the field below.
              </div>

              <div className="flex flex-col gap-2">
                <WexFloatLabel>
                  <WexFloatLabel.Input>
                    <WexInput
                      value={electionText}
                      inputMode="decimal"
                      onChange={(e) => {
                        setElectionText(e.target.value);
                      }}
                      onBlur={() => {
                        const cents = parseCurrencyToCents(electionText);
                        const clamped = Math.min(cents, MAX_ELECTION_CENTS);
                        setElectionText(formatCurrencyFromCents(clamped));
                        persist(clamped, ack);
                      }}
                    />
                  </WexFloatLabel.Input>
                  <WexFloatLabel.Label>Your Election Amount</WexFloatLabel.Label>
                </WexFloatLabel>
                {showMaxError && (
                  <div className="text-xs text-destructive">Max Employee Election {formatCurrencyFromCents(MAX_ELECTION_CENTS)}</div>
                )}
                {!showMaxError ? (
                  <div className="text-[12px] leading-[21px] text-foreground">
                    Max Employee Election {formatCurrencyFromCents(MAX_ELECTION_CENTS)}
                  </div>
                ) : null}
              </div>

              <label className="flex items-center gap-2 text-[14px] leading-6 text-foreground">
                <WexCheckbox
                  checked={ack}
                  onCheckedChange={(checked) => {
                    const next = checked === true;
                    setAck(next);
                    persist(clampedElectionCents, next);
                  }}
                  aria-label="I have read and understand the LPFSA rules"
                />
                <span>
                  I have read and understand the{" "}
                  <button type="button" className="text-primary underline" onClick={() => {}}>
                    LPFSA rules
                  </button>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </EnrollmentLayout>
  );
}