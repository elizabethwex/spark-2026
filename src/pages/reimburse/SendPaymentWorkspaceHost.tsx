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
  Checkbox,
  FloatLabel,
  Workspace,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { ArrowRight, CheckCircle2, Info, Plus, User, X } from "lucide-react";
import type { ReimburseWorkspaceStep } from "@/context/ReimburseWorkspaceContext";
import {
  AccountStep,
  ConfirmationStep,
  CustomStepper,
  DetailsStep,
  PLAN_LABELS,
  ProcessingStep,
  SEND_PAYMENT_FLOW_STEPS,
  WorkspaceUploadStartStep,
  createDefaultReceiptLineItems,
  fmtDate,
  lastFourFromAccountString,
  sumSelectedReceiptLines,
  toSendPaymentStepperId,
  usd,
  validationStatusFromState,
  type ClaimData,
  type PlanId,
  type ReceiptLineItem,
  type UploadedDoc,
  type ValidationState,
} from "@/pages/reimburse/reimburseWorkspaceShared";

/** Empty in this prototype: saved-payee section stays hidden per spec. */
const MOCK_SAVED_PAYEES: { id: string; label: string; mask: string }[] = [];

type PayeeMode = "saved" | "new";

interface SendPaymentFlowState {
  step: ReimburseWorkspaceStep;
  uploadedDocs: UploadedDoc[];
  entryMode: "upload" | "manual" | "no-doc";
  autoAnalyze: boolean;
  selectedPlan: PlanId;
  processingStep: number;
  validationState: ValidationState;
  claim: ClaimData;
  receiptLineItems: ReceiptLineItem[];
  payeeMode: PayeeMode;
  savedPayeeId: string | null;
  payeeName: string;
  payeeAddress: string;
  payeeAccountNumber: string;
  savePayeeForLater: boolean;
  recurringClaim: boolean;
}

function createInitialSendPaymentState(step: ReimburseWorkspaceStep): SendPaymentFlowState {
  return {
    step,
    uploadedDocs: [],
    entryMode: "upload",
    autoAnalyze: true,
    selectedPlan: "health-fsa",
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
    payeeMode: MOCK_SAVED_PAYEES.length > 0 ? "saved" : "new",
    savedPayeeId: MOCK_SAVED_PAYEES[0]?.id ?? null,
    payeeName: "",
    payeeAddress: "",
    payeeAccountNumber: "",
    savePayeeForLater: true,
    recurringClaim: false,
  };
}

function sendPaymentValidationStatus(s: SendPaymentFlowState): ValidationState {
  const base = validationStatusFromState(s);
  if (base !== "pass") return base;
  if (s.payeeMode === "saved" && MOCK_SAVED_PAYEES.length > 0 && !s.savedPayeeId) return "needs-info";
  if (s.payeeMode === "new") {
    if (!s.payeeName.trim() || !s.payeeAccountNumber.trim()) return "needs-info";
  }
  return "pass";
}

export function SendPaymentWorkspaceSession({
  initialStep,
  onClose,
}: {
  initialStep: ReimburseWorkspaceStep;
  onClose: () => void;
}) {
  const [state, setState] = useState<SendPaymentFlowState>(() => createInitialSendPaymentState(initialStep));
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
      steps={SEND_PAYMENT_FLOW_STEPS}
      currentStepId={toSendPaymentStepperId(state.step)}
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
      <Button intent="primary" disabled={!canContinue} onClick={() => goTo("payee")} className="px-4 py-2">
        Continue
      </Button>
    );
  } else if (state.step === "payee") {
    const payeeOk =
      state.payeeMode === "new"
        ? !!(state.payeeName.trim() && state.payeeAccountNumber.trim())
        : MOCK_SAVED_PAYEES.length === 0 || !!state.savedPayeeId;
    secondaryBtn = (
      <Button
        intent="secondary"
        variant="outline"
        onClick={() => goTo("review")}
        className="px-4 py-2"
      >
        Back
      </Button>
    );
    primaryBtn = (
      <Button
        intent="primary"
        disabled={!payeeOk}
        onClick={() =>
          setState((prev) => ({
            ...prev,
            validationState: sendPaymentValidationStatus(prev),
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
      <Button intent="secondary" variant="outline" onClick={() => goTo("payee")} className="px-4 py-2">
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
        Submit
      </Button>
    );
  } else if (state.step === "confirmation") {
    secondaryBtn = (
      <Button
        intent="secondary"
        variant="outline"
        onClick={() => setState(createInitialSendPaymentState("start"))}
        className="px-4 py-2"
      >
        Submit another payment
      </Button>
    );
    primaryBtn = (
      <Button intent="primary" onClick={onClose} className="px-4 py-2">
        Done
      </Button>
    );
  }

  const payeeSummaryLabel =
    state.payeeMode === "saved" && state.savedPayeeId
      ? MOCK_SAVED_PAYEES.find((p) => p.id === state.savedPayeeId)?.label ?? state.payeeName
      : state.payeeName || "—";
  const payeeMask =
    state.payeeMode === "saved" && state.savedPayeeId
      ? MOCK_SAVED_PAYEES.find((p) => p.id === state.savedPayeeId)?.mask ?? "•••• 0000"
      : `Account ending in ${lastFourFromAccountString(state.payeeAccountNumber)}`;

  const summaryRows = useMemo(
    () => [
      { label: "Amount", value: state.claim.amount ? usd(state.claim.amount) : "—" },
      { label: "Start date of service", value: fmtDate(state.claim.serviceDateStart) },
      { label: "End date of service", value: fmtDate(state.claim.serviceDateEnd) },
      { label: "Provider", value: state.claim.provider || "—" },
      { label: "Benefits plan", value: state.selectedPlan === "health-fsa" ? "Health FSA" : "Dependent Care FSA" },
      { label: "Payee", value: payeeSummaryLabel },
      { label: "Payee account", value: payeeMask },
      ...(state.recurringClaim ? [{ label: "Recurring", value: "Yes" }] : []),
    ],
    [
      state.claim.amount,
      state.claim.provider,
      state.claim.serviceDateStart,
      state.claim.serviceDateEnd,
      state.selectedPlan,
      state.recurringClaim,
      state.payeeMode,
      state.savedPayeeId,
      state.payeeName,
      state.payeeAccountNumber,
      payeeSummaryLabel,
      payeeMask,
    ]
  );

  return (
    <>
      <Workspace
        open
        onOpenChange={handleOpenChange}
        title="Send payment"
        stepperContent={state.step === "confirmation" ? undefined : stepperContent}
        showFooter={state.step !== "processing"}
        primaryButton={primaryBtn}
        secondaryButton={secondaryBtn}
        tertiaryButton={tertiaryBtn}
      >
        {state.step === "start" && (
          <WorkspaceUploadStartStep variant="sendPayment" state={state} setState={setState} />
        )}
        {state.step === "processing" && <ProcessingStep processingStep={state.processingStep} />}
        {state.step === "account" && (
          <AccountStep
            state={state}
            setState={setState}
            heading="Choose the benefit plan to pay from"
            autoSub="Based on your invoice, we've recommended the best match. You can change it if needed."
            manualSub="Choose the account that fits this expense. You'll enter claim amounts on the next step."
          />
        )}
        {state.step === "review" && (
          <DetailsStep
            state={state}
            setState={setState}
            showRecurring
            recurringClaim={state.recurringClaim}
            onRecurringChange={(next) => setState((prev) => ({ ...prev, recurringClaim: next }))}
          />
        )}
        {state.step === "payee" && <PayeeStep state={state} setState={setState} />}
        {state.step === "validation" && (
          <SendPaymentValidationStep
            state={state}
            onNav={(step) => goTo(step as ReimburseWorkspaceStep)}
            payeeSummaryLabel={payeeSummaryLabel}
            payeeMask={payeeMask}
          />
        )}
        {state.step === "confirmation" && (
          <ConfirmationStep variant="sendPayment" summaryRows={summaryRows} />
        )}
      </Workspace>

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent className="w-[448px] p-0">
          <div className="flex items-center justify-between p-[17.5px]">
            <AlertDialogTitle className="text-base font-semibold text-foreground leading-6">
              Cancel send payment
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
                Cancel send payment
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function PayeeStep({
  state,
  setState,
}: {
  state: SendPaymentFlowState;
  setState: Dispatch<SetStateAction<SendPaymentFlowState>>;
}) {
  useEffect(() => {
    if (!state.autoAnalyze || state.payeeMode !== "new") return;
    if (state.payeeName || state.payeeAddress || state.payeeAccountNumber) return;
    const provider = state.claim.provider || "CVS Pharmacy";
    setState((prev) => ({
      ...prev,
      payeeName: provider,
      payeeAddress: "1 CVS Dr, Woonsocket, RI 02895",
      payeeAccountNumber: "0210000210000123456",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prototype one-shot prefill from mock extraction
  }, [state.autoAnalyze, state.payeeMode, state.payeeName, state.payeeAddress, state.payeeAccountNumber, state.claim.provider]);

  return (
    <div className="flex justify-center pt-10 px-8 pb-10">
      <div className="w-full max-w-[480px] flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Who is getting paid?</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Select a saved payee or add provider details so we can route payment correctly.
          </p>
        </div>

        {MOCK_SAVED_PAYEES.length > 0 && (
          <div className="flex flex-col gap-3" role="radiogroup" aria-label="Payee source">
            <p className="text-sm font-semibold text-foreground">Select a saved payee</p>
            {MOCK_SAVED_PAYEES.map((p) => {
              const selected = state.payeeMode === "saved" && state.savedPayeeId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() =>
                    setState((prev) => ({ ...prev, payeeMode: "saved", savedPayeeId: p.id }))
                  }
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selected ? "border-primary bg-white" : "border-border/60 bg-white hover:border-border"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground">{p.label}</span>
                    <span className="text-sm text-muted-foreground">{p.mask}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {MOCK_SAVED_PAYEES.length > 0 && (
            <p className="text-sm font-semibold text-foreground">Or add a new payee</p>
          )}
          <button
            type="button"
            onClick={() => setState((prev) => ({ ...prev, payeeMode: "new", savedPayeeId: null }))}
            className={`flex items-center gap-2 rounded-xl border-2 p-4 text-left transition-all ${
              state.payeeMode === "new"
                ? "border-primary bg-white"
                : "border-border/60 bg-white hover:border-border"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
              <Plus className="h-5 w-5 text-neutral-700" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Add a new payee</p>
              <p className="text-sm text-muted-foreground">Enter provider name, address, and account number</p>
            </div>
          </button>

          {state.payeeMode === "new" && (
            <Card>
              <CardContent className="p-6 flex flex-col gap-4">
                <FloatLabel
                  label="Payee name"
                  type="text"
                  value={state.payeeName}
                  onChange={(e) => setState((prev) => ({ ...prev, payeeName: e.target.value }))}
                />
                <FloatLabel
                  label="Address"
                  type="text"
                  value={state.payeeAddress}
                  onChange={(e) => setState((prev) => ({ ...prev, payeeAddress: e.target.value }))}
                />
                <FloatLabel
                  label="Account number"
                  type="text"
                  value={state.payeeAccountNumber}
                  onChange={(e) => setState((prev) => ({ ...prev, payeeAccountNumber: e.target.value }))}
                />
                <div className="flex items-start gap-3 pt-2">
                  <Checkbox
                    checkboxSize="md"
                    id="save-payee"
                    checked={state.savePayeeForLater}
                    onCheckedChange={(c) => {
                      if (c === "indeterminate") return;
                      setState((prev) => ({ ...prev, savePayeeForLater: c === true }));
                    }}
                    aria-labelledby="save-payee-label"
                  />
                  <label id="save-payee-label" htmlFor="save-payee" className="text-sm text-foreground leading-snug cursor-pointer select-none">
                    Save payee information for future use
                  </label>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function SendPaymentValidationStep({
  state,
  onNav,
  payeeSummaryLabel,
  payeeMask,
}: {
  state: SendPaymentFlowState;
  onNav: (step: string) => void;
  payeeSummaryLabel: string;
  payeeMask: string;
}) {
  const planLabel = PLAN_LABELS[state.selectedPlan] ?? state.selectedPlan;
  const amountFmt = state.claim.amount ? usd(state.claim.amount) : "—";
  const selectedItems = state.receiptLineItems.filter((item) => item.selected);

  return (
    <div className="flex justify-center pt-10 px-8 pb-10">
      <div className="w-full max-w-[480px] flex flex-col gap-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#1d2c38]">Final review</h1>
          <p className="text-[16px] text-[#515f6b] mt-2 leading-relaxed">
            Confirm your payment details. You can edit any section before submitting.
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
            <p className="text-xs font-semibold uppercase tracking-wide text-[#7c858e] mb-4">From / To</p>
            <div className="flex items-stretch justify-between gap-4">
              <div className="flex-1 rounded-xl border border-[#e4e6e9] p-4 shadow-sm bg-white flex flex-col relative group">
                <button
                  type="button"
                  onClick={() => onNav("account")}
                  className="absolute top-3 right-3 text-[13px] font-semibold text-[#0055a5] hover:underline opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100"
                >
                  Change
                </button>
                <p className="text-[11px] font-semibold text-[#7c858e] uppercase tracking-wide mb-1">From</p>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-[var(--system-text-primary)] font-bold text-[15px] min-w-0">
                    <User className="h-5 w-5 shrink-0 text-[var(--neutral-700)]" />
                    <span className="break-words">{planLabel}</span>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#ffe4e6] text-[#e11d48] text-[11px] font-semibold shrink-0">
                    -{amountFmt}
                  </span>
                </div>
                <p className="text-[14px] text-[#515f6b] mt-2">Selected benefits plan</p>
              </div>

              <ArrowRight className="h-5 w-5 text-[#7c858e] shrink-0 self-center" />

              <div className="flex-1 rounded-xl border border-[#e4e6e9] p-4 shadow-sm bg-white flex flex-col relative group">
                <button
                  type="button"
                  onClick={() => onNav("payee")}
                  className="absolute top-3 right-3 text-[13px] font-semibold text-[#0055a5] hover:underline opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100"
                >
                  Change
                </button>
                <p className="text-[11px] font-semibold text-[#7c858e] uppercase tracking-wide mb-1">To</p>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold text-[#1d2c38] break-words">{payeeSummaryLabel}</p>
                    <p className="text-[13px] text-[#515f6b] mt-1">{payeeMask}</p>
                    {state.payeeMode === "new" && state.payeeAddress && (
                      <p className="text-[12px] text-[#7c858e] mt-2 leading-snug">{state.payeeAddress}</p>
                    )}
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#008375] text-[11px] font-semibold shrink-0">
                    +{amountFmt}
                  </span>
                </div>
                <p className="text-[14px] text-[#515f6b] mt-2">Provider / payee</p>
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
            Edit details
          </button>
          <CardContent className="p-6">
            <h2 className="text-[18px] font-bold text-[#1d2c38] mb-4">Expense</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Service dates</span>
                <span className="font-medium text-right">
                  {fmtDate(state.claim.serviceDateStart)} – {fmtDate(state.claim.serviceDateEnd)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium text-right">{state.claim.category || "—"}</span>
              </div>
              {state.recurringClaim && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Recurring</span>
                  <span className="font-medium text-right">Yes</span>
                </div>
              )}
            </div>

            {selectedItems.length > 0 && (
              <>
                <h3 className="text-[15px] font-bold text-[#1d2c38] mt-6 mb-3">Line items</h3>
                <div className="flex flex-col gap-3">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-4">
                      <span className="text-[15px] text-[#1d2c38]">{item.description}</span>
                      <span className="text-[15px] text-[#515f6b] tabular-nums shrink-0">
                        {usd(String(item.amount))}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#e4e6e9]">
              <span className="text-[18px] font-bold text-[#1d2c38]">Total</span>
              <span className="text-[18px] font-bold text-[#1d2c38]">{amountFmt}</span>
            </div>
          </CardContent>
        </Card>

        {state.validationState === "doc-required" && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-950">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Documentation may be required for this amount. You can still submit for review.</span>
          </div>
        )}
      </div>
    </div>
  );
}
