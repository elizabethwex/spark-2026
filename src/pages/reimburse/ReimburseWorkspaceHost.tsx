import { type Dispatch, type ReactNode, type SetStateAction, useEffect, useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  Button,
  Card,
  CardContent,
  Workspace,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { ArrowRight, CheckCircle2, Mail, Plus, X, Zap } from "lucide-react";
import { useReimburseWorkspace } from "@/context/ReimburseWorkspaceContext";
import type { ReimburseWorkspaceStep } from "@/context/ReimburseWorkspaceContext";
import { SendPaymentWorkspaceSession } from "@/pages/reimburse/SendPaymentWorkspaceHost";
import {
  AccountStep,
  ConfirmationStep,
  CustomStepper,
  DetailsStep,
  type DestinationId,
  type PlanId,
  PLAN_LABELS,
  ProcessingStep,
  REIMBURSE_FLOW_STEPS,
  type ReceiptLineItem,
  type UploadedDoc,
  type ClaimData,
  type ValidationState,
  WorkspaceUploadStartStep,
  createDefaultReceiptLineItems,
  fmtDate,
  sumSelectedReceiptLines,
  toReimburseStepperId,
  usd,
  validationStatusFromState,
} from "@/pages/reimburse/reimburseWorkspaceShared";

interface ReimburseFlowState {
  step: ReimburseWorkspaceStep;
  uploadedDocs: UploadedDoc[];
  entryMode: "upload" | "manual" | "no-doc";
  autoAnalyze: boolean;
  selectedPlan: PlanId;
  destination: DestinationId;
  processingStep: number;
  validationState: ValidationState;
  claim: ClaimData;
  receiptLineItems: ReceiptLineItem[];
}

function createInitialState(step: ReimburseWorkspaceStep): ReimburseFlowState {
  return {
    step,
    uploadedDocs: [],
    entryMode: "upload",
    autoAnalyze: true,
    selectedPlan: "health-fsa",
    destination: "bank",
    processingStep: 0,
    validationState: "pass",
    receiptLineItems: [],
    claim: {
      amount: "",
      serviceDateStart: "",
      serviceDateEnd: "",
      provider: "",
      category: "",
      patient: "self",
    },
  };
}

export function ReimburseWorkspaceHost() {
  const { isOpen, activeWorkspace, initialStep, sessionKey, closeReimburseWorkspace } = useReimburseWorkspace();
  if (!isOpen) return null;

  if (activeWorkspace === "sendPayment") {
    return (
      <SendPaymentWorkspaceSession
        key={`send-${sessionKey}-${initialStep}`}
        initialStep={initialStep}
        onClose={closeReimburseWorkspace}
      />
    );
  }

  return (
    <ReimburseWorkspaceSession
      key={`reimburse-${sessionKey}-${initialStep}`}
      initialStep={initialStep}
      onClose={closeReimburseWorkspace}
    />
  );
}

function ReimburseWorkspaceSession({
  initialStep,
  onClose,
}: {
  initialStep: ReimburseWorkspaceStep;
  onClose: () => void;
}) {
  const [state, setState] = useState<ReimburseFlowState>(() => createInitialState(initialStep));
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const goTo = (step: ReimburseWorkspaceStep) => setState((prev) => ({ ...prev, step }));

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      if (state.step === "confirmation" || state.step === "start") {
        onClose();
      } else {
        setIsCancelDialogOpen(true);
      }
    }
  };

  useEffect(() => {
    if (state.step !== "processing") return;

    const timers = [0, 1, 2].map((i) =>
      window.setTimeout(() => {
        setState((prev) => ({ ...prev, processingStep: prev.processingStep + 1 }));
      }, (i + 1) * 900)
    );

    const advance = window.setTimeout(() => {
      setState((prev) => {
        const hasUpload = prev.uploadedDocs.length > 0;
        const receiptLineItems = hasUpload ? createDefaultReceiptLineItems() : [];
        const amountFromLines = hasUpload
          ? sumSelectedReceiptLines(receiptLineItems)
          : prev.claim.amount || "127.43";
        return {
          ...prev,
          step: "account",
          receiptLineItems,
          claim: {
            ...prev.claim,
            amount: amountFromLines,
            serviceDateStart: prev.claim.serviceDateStart || "2026-04-08",
            serviceDateEnd: prev.claim.serviceDateEnd || "2026-04-08",
            provider: prev.claim.provider || "CVS Pharmacy",
            category: prev.claim.category || "pharmacy",
            patient: prev.claim.patient || "self",
          },
        };
      });
    }, 3800);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(advance);
    };
  }, [state.step]);

  const stepperContent = (
    <CustomStepper
      steps={REIMBURSE_FLOW_STEPS}
      currentStepId={toReimburseStepperId(state.step)}
      skippedStepIds={[
        ...(state.entryMode === "no-doc" ? ["upload"] : []),
        ...(!state.autoAnalyze ? ["analyze"] : []),
      ]}
    />
  );

  let primaryBtn: ReactNode = null;
  let secondaryBtn: ReactNode = null;
  let tertiaryBtn: ReactNode = null;

  if (state.step !== "processing" && state.step !== "confirmation") {
    tertiaryBtn = (
      <Button
        variant="ghost"
        data-workspace-footer-cancel
        onClick={() => handleOpenChange(false)}
        className="px-4 py-2"
      >
        Cancel
      </Button>
    );
  }

  if (state.step === "start") {
    primaryBtn = (
      <Button
        intent="primary"
        disabled={state.uploadedDocs.length === 0}
        onClick={() =>
          setState((prev) => {
            if (prev.autoAnalyze) {
              return { ...prev, step: "processing", processingStep: 1 };
            }
            return {
              ...prev,
              step: "account",
              processingStep: 0,
              receiptLineItems: [],
              claim: {
                amount: "",
                serviceDateStart: "",
                serviceDateEnd: "",
                provider: "",
                category: "",
                patient: "",
              },
            };
          })
        }
        className="px-4 py-2"
      >
        Continue
      </Button>
    );
  } else if (state.step === "account") {
    secondaryBtn = (
      <Button intent="secondary" variant="outline" onClick={() => goTo("start")} className="px-4 py-2">
        Back
      </Button>
    );
    primaryBtn = (
      <Button intent="primary" onClick={() => goTo("review")} className="px-4 py-2">
        Continue
      </Button>
    );
  } else if (state.step === "review") {
    const canContinue = !!(
      state.claim.amount &&
      state.claim.serviceDateStart &&
      state.claim.serviceDateEnd &&
      state.claim.category
    );
    secondaryBtn = (
      <Button
        intent="secondary"
        variant="outline"
        onClick={() => goTo("account")}
        className="px-4 py-2"
      >
        Back
      </Button>
    );
    primaryBtn = (
      <Button intent="primary" disabled={!canContinue} onClick={() => goTo("destination")} className="px-4 py-2">
        Continue
      </Button>
    );
  } else if (state.step === "destination") {
    secondaryBtn = (
      <Button
        intent="secondary"
        variant="outline"
        onClick={() => goTo(state.entryMode === "upload" && state.autoAnalyze ? "review" : "review")}
        className="px-4 py-2"
      >
        Back
      </Button>
    );
    primaryBtn = (
      <Button
        intent="primary"
        onClick={() =>
          setState((prev) => ({
            ...prev,
            validationState: validationStatusFromState(prev),
            step: "validation",
          }))
        }
        className="px-4 py-2"
      >
        Continue
      </Button>
    );
  } else if (state.step === "validation") {
    secondaryBtn = (
      <Button intent="secondary" variant="outline" onClick={() => goTo("destination")} className="px-4 py-2">
        Back
      </Button>
    );
    primaryBtn = (
      <Button
        intent="primary"
        disabled={state.validationState === "needs-info"}
        onClick={() => goTo("confirmation")}
        className="px-4 py-2"
      >
        Submit claim
      </Button>
    );
  } else if (state.step === "confirmation") {
    secondaryBtn = (
      <Button
        intent="secondary"
        variant="outline"
        onClick={() => setState(createInitialState("start"))}
        className="px-4 py-2"
      >
        Submit another claim
      </Button>
    );
    primaryBtn = (
      <Button intent="primary" onClick={onClose} className="px-4 py-2">
        Done
      </Button>
    );
  }

  const summaryRows = useMemo(
    () => [
      { label: "Amount", value: state.claim.amount ? usd(state.claim.amount) : "—" },
      { label: "Start date of service", value: fmtDate(state.claim.serviceDateStart) },
      { label: "End date of service", value: fmtDate(state.claim.serviceDateEnd) },
      { label: "Provider", value: state.claim.provider || "—" },
      { label: "Account", value: state.selectedPlan === "health-fsa" ? "Health FSA" : "Dependent Care FSA" },
      {
        label: "Destination",
        value:
          state.destination === "bank"
            ? "Bank account ending in 1234"
            : state.destination === "check"
              ? "Check by mail"
              : "Instant payment",
      },
    ],
    [
      state.claim.amount,
      state.claim.provider,
      state.claim.serviceDateStart,
      state.claim.serviceDateEnd,
      state.destination,
      state.selectedPlan,
    ]
  );

  return (
    <>
      <Workspace
        open
        onOpenChange={handleOpenChange}
        title="Reimburse myself"
        stepperContent={state.step === "confirmation" ? undefined : stepperContent}
        showFooter={state.step !== "processing"}
        primaryButton={primaryBtn}
        secondaryButton={secondaryBtn}
        tertiaryButton={tertiaryBtn}
      >
        {state.step === "start" && (
          <WorkspaceUploadStartStep variant="reimburse" state={state} setState={setState} />
        )}
        {state.step === "processing" && <ProcessingStep processingStep={state.processingStep} />}
        {state.step === "account" && <AccountStep state={state} setState={setState} />}
        {state.step === "review" && (
          <DetailsStep state={state} setState={setState} />
        )}
        {state.step === "destination" && <DestinationStep state={state} setState={setState} />}
        {state.step === "validation" && (
          <ValidationStep
            state={state}
            summaryRows={summaryRows}
            onNav={(step) => goTo(step as ReimburseWorkspaceStep)}
          />
        )}
        {state.step === "confirmation" && (
          <ConfirmationStep variant="reimburse" summaryRows={summaryRows} />
        )}
      </Workspace>

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent className="w-[448px] p-0">
          <div className="flex items-center justify-between p-[17.5px]">
            <AlertDialogTitle className="text-base font-semibold text-foreground leading-6">
              Cancel reimbursement
            </AlertDialogTitle>
            <AlertDialogCancel asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Close">
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </AlertDialogCancel>
          </div>
          <div className="px-6 pb-0">
            <AlertDialogDescription className="text-sm text-foreground leading-6">
              Are you sure you want to cancel? Your progress will be lost.
            </AlertDialogDescription>
          </div>
          <AlertDialogFooter className="px-6 pb-6 pt-4 flex items-center justify-end gap-2">
            <AlertDialogCancel asChild>
              <Button
                intent="secondary"
                variant="outline"
                onClick={() => setIsCancelDialogOpen(false)}
                className="px-4 py-2"
              >
                Keep working
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                intent="primary"
                onClick={() => {
                  setIsCancelDialogOpen(false);
                  onClose();
                }}
                className="px-4 py-2"
              >
                Cancel reimbursement
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function DestinationStep({
  state,
  setState,
}: {
  state: ReimburseFlowState;
  setState: Dispatch<SetStateAction<ReimburseFlowState>>;
}) {
  const options = [
    {
      id: "bank" as const,
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 14 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M5.34118 11.3249V6.6582M8.00785 11.3249V6.6582M10.6745 11.3249V6.6582M0.674518 13.9915H12.6745M2.67452 11.3249V6.6582M6.08792 0.790262C6.27085 0.701401 6.47168 0.655565 6.67505 0.656258C6.87842 0.656951 7.07893 0.704156 7.26125 0.794262L12.5053 3.35893C12.8226 3.51426 12.7119 3.99159 12.3586 3.99159H0.990586C0.637252 3.99159 0.527252 3.51426 0.843919 3.35893L6.08792 0.790262Z"
            stroke="currentColor"
            strokeWidth="1.3125"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      label: "Direct Deposit",
      sublabel: "1-2 business days after approval.",
      badge: "Default" as string | undefined,
      bankName: "Wells Fargo Bank",
      accountMask: "•••• 5423 Checking",
    },
    {
      id: "check" as const,
      icon: <Mail className="h-[22px] w-[22px]" />,
      label: "Check by Mail",
      sublabel: "2-4 business days after approval.",
      badge: undefined,
    },
    {
      id: "instant" as const,
      icon: <Zap className="h-[22px] w-[22px]" />,
      label: "Instant Transfer",
      sublabel: "A processing fee may apply.",
      badge: "Fastest" as string | undefined,
    },
  ];

  return (
    <div className="flex justify-center pt-10 px-8 pb-10">
      <div className="w-full max-w-[480px] flex flex-col gap-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#1d2c38]">How would you like to get reimbursed?</h1>
          <p className="text-[16px] text-[#515f6b] mt-2 leading-relaxed">
            Select how you&apos;d like to receive the money for your reimbursement.
          </p>
        </div>

        <div className="flex flex-col gap-4" role="radiogroup" aria-label="Reimbursement destination">
          {options.map((opt) => {
            const isSelected = state.destination === opt.id;
            return (
              <button
                key={opt.id}
                role="radio"
                aria-checked={isSelected}
                type="button"
                onClick={() => setState((prev) => ({ ...prev, destination: opt.id }))}
                className={`w-full text-left p-5 rounded-xl border transition-all ${
                  isSelected
                    ? "border-[#0055a5] bg-white shadow-sm ring-1 ring-[#0055a5]"
                    : "border-[#e4e6e9] bg-white shadow-sm hover:border-[#cbd1e1]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-0.5 flex-shrink-0 ${isSelected ? "text-neutral-700" : "text-[#515f6b]"}`}
                  >
                    {opt.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[16px] font-bold text-[#1d2c38]">{opt.label}</p>
                      {opt.badge && (
                        <span className="inline-flex items-center px-[8px] py-[3px] rounded-[12px] bg-[var(--theme-secondary-ramp-50)] text-[var(--theme-secondary)] text-[12px] font-medium leading-none whitespace-nowrap">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[14px] text-[#515f6b] mt-1">{opt.sublabel}</p>

                    {opt.bankName && (
                      <div className="mt-5">
                        <p className="text-[15px] font-bold text-[#7c858e]">{opt.bankName}</p>
                        <p className="text-[15px] text-[#7c858e] mt-0.5">{opt.accountMask}</p>
                      </div>
                    )}
                  </div>
                  <div
                    className={`mt-0.5 h-[22px] w-[22px] rounded-full border-[2.5px] flex-shrink-0 flex items-center justify-center ${
                      isSelected ? "border-[#0055a5]" : "border-[#cbd1e1]"
                    }`}
                  >
                    {isSelected && <div className="h-[10px] w-[10px] rounded-full bg-[#0055a5]" />}
                  </div>
                </div>
              </button>
            );
          })}

          <button className="flex items-center gap-2 text-[#0055a5] text-[16px] font-medium mt-2 hover:underline w-fit">
            <Plus className="h-5 w-5" />
            Add new account
          </button>
        </div>
      </div>
    </div>
  );
}

const DEST_LABELS: Record<string, string> = {
  bank: "Bank account ending in 1234",
  check: "Check by mail",
  instant: "Instant payment",
};

function ValidationStep({
  state,
  onNav,
}: {
  state: ReimburseFlowState;
  summaryRows: { label: string; value: string }[];
  onNav: (_step: string) => void;
}) {
  const planLabel = PLAN_LABELS[state.selectedPlan] ?? state.selectedPlan;
  const destLabel = DEST_LABELS[state.destination] ?? state.destination;
  const amountFmt = state.claim.amount ? usd(state.claim.amount) : "—";
  const selectedItems = state.receiptLineItems.filter((item) => item.selected);

  return (
    <div className="flex justify-center pt-10 px-8 pb-10">
      <div className="w-full max-w-[480px] flex flex-col gap-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#1d2c38]">Ready to submit?</h1>
          <p className="text-[16px] text-[#515f6b] mt-2 leading-relaxed">
            We checked your claim for common issues so you can fix anything before submitting.
          </p>
        </div>

        {state.validationState === "pass" && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#eefbf4] text-[#008375]">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span className="text-[15px] font-medium">
              Everything looks good! High confidence of claim approval.
            </span>
          </div>
        )}

        <Card className="shadow-sm border-[#e4e6e9] rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-stretch justify-between gap-4">
              <div className="flex-1 rounded-xl border border-[#e4e6e9] p-4 shadow-sm bg-white flex flex-col relative group">
                <button
                  type="button"
                  onClick={() => onNav("account")}
                  className="absolute top-3 right-3 text-[13px] font-semibold text-[#0055a5] hover:underline opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100"
                >
                  Change
                </button>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-[var(--system-text-primary)] font-bold text-[15px]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0 text-[var(--neutral-700)]"
                    >
                      <path
                        d="M1.98958 5.32292C1.63596 5.32292 1.29682 5.46339 1.04677 5.71344C0.796726 5.96349 0.65625 6.30263 0.65625 6.65625V7.98958C0.65625 8.3432 0.796726 8.68234 1.04677 8.93239C1.29682 9.18244 1.63596 9.32292 1.98958 9.32292H4.65625C4.83306 9.32292 5.00263 9.39315 5.12765 9.51818C5.25268 9.6432 5.32292 9.81277 5.32292 9.98958V12.6562C5.32292 13.0099 5.46339 13.349 5.71344 13.5991C5.96349 13.8491 6.30263 13.9896 6.65625 13.9896H7.98958C8.3432 13.9896 8.68234 13.8491 8.93239 13.5991C9.18244 13.349 9.32292 13.0099 9.32292 12.6562V9.98958C9.32292 9.81277 9.39315 9.6432 9.51818 9.51818C9.6432 9.39315 9.81277 9.32292 9.98958 9.32292H12.6562C13.0099 9.32292 13.349 9.18244 13.5991 8.93239C13.8491 8.68234 13.9896 8.3432 13.9896 7.98958V6.65625C13.9896 6.30263 13.8491 5.96349 13.5991 5.71344C13.349 5.46339 13.0099 5.32292 12.6562 5.32292H9.98958C9.81277 5.32292 9.6432 5.25268 9.51818 5.12765C9.39315 5.00263 9.32292 4.83306 9.32292 4.65625V1.98958C9.32292 1.63596 9.18244 1.29682 8.93239 1.04677C8.68234 0.796726 8.3432 0.65625 7.98958 0.65625H6.65625C6.30263 0.65625 5.96349 0.796726 5.71344 1.04677C5.46339 1.29682 5.32292 1.63596 5.32292 1.98958V4.65625C5.32292 4.83306 5.25268 5.00263 5.12765 5.12765C5.00263 5.25268 4.83306 5.32292 4.65625 5.32292H1.98958Z"
                        stroke="currentColor"
                        strokeWidth="1.3125"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {planLabel}
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#ffe4e6] text-[#e11d48] text-[11px] font-semibold mt-6">
                    -{amountFmt}
                  </span>
                </div>
                <p className="text-[15px] text-[#515f6b] mt-1 font-medium ml-7">$850.00</p>
              </div>

              <ArrowRight className="h-5 w-5 text-[#7c858e] shrink-0 self-center" />

              <div className="flex-1 rounded-xl border border-[#e4e6e9] p-4 shadow-sm bg-white flex flex-col relative group">
                <button
                  type="button"
                  onClick={() => onNav("destination")}
                  className="absolute top-3 right-3 text-[13px] font-semibold text-[#0055a5] hover:underline opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100"
                >
                  Change
                </button>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-[#1d2c38] font-bold text-[15px]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0 text-[var(--neutral-700)]"
                    >
                      <path
                        d="M5.34118 11.3249V6.6582M8.00785 11.3249V6.6582M10.6745 11.3249V6.6582M0.674518 13.9915H12.6745M2.67452 11.3249V6.6582M6.08792 0.790262C6.27085 0.701401 6.47168 0.655565 6.67505 0.656258C6.87842 0.656951 7.07893 0.704156 7.26125 0.794262L12.5053 3.35893C12.8226 3.51426 12.7119 3.99159 12.3586 3.99159H0.990586C0.637252 3.99159 0.527252 3.51426 0.843919 3.35893L6.08792 0.790262Z"
                        stroke="currentColor"
                        strokeWidth="1.3125"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {state.destination === "bank" ? "Direct Deposit" : destLabel}
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#008375] text-[11px] font-semibold mt-6">
                    +{amountFmt}
                  </span>
                </div>
                {state.destination === "bank" && (
                  <div className="mt-1 ml-7 space-y-0.5">
                    <p className="text-[14px] font-medium text-[#515f6b]">Wells Fargo Bank</p>
                    <p className="text-[14px] text-[#7c858e]">•••• 5423 Checking</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#e4e6e9]">
              <span className="text-[16px] font-bold text-[#1d2c38]">Submitting</span>
              <span className="text-[20px] font-bold text-[#1d2c38]">{amountFmt}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-[#e4e6e9] rounded-xl relative">
          <button
            type="button"
            onClick={() => onNav("review")}
            className="absolute top-6 right-6 text-[14px] font-semibold text-[var(--system-link)] hover:underline"
          >
            Edit
          </button>
          <CardContent className="p-6">
            <h2 className="text-[18px] font-bold text-[#1d2c38] mb-6">Items submitting</h2>

            <div className="flex flex-col gap-5">
              {selectedItems.length > 0 ? (
                selectedItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4">
                    <span className="text-[16px] text-[#1d2c38]">{item.description}</span>
                    <span className="text-[16px] text-[#515f6b] tabular-nums shrink-0">
                      {usd(String(item.amount))}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[16px] text-[#1d2c38]">Claim amount</span>
                  <span className="text-[16px] text-[#515f6b] tabular-nums shrink-0">{amountFmt}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#e4e6e9]">
              <span className="text-[18px] font-bold text-[#1d2c38]">Total:</span>
              <span className="text-[18px] font-bold text-[#1d2c38]">{amountFmt}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
