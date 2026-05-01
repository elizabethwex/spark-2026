/**
 * Shared UI and helpers for Reimburse-myself and Send-payment workspace flows.
 */
import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  Checkbox,
  FloatLabel,
  FloatLabelSelect,
  Separator,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@wexinc-healthbenefits/ben-ui-kit";
import confetti from "canvas-confetti";
import type { Step } from "@wexinc-healthbenefits/ben-ui-kit";
import {
  Banknote,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import type { ReimburseWorkspaceStep } from "@/context/ReimburseWorkspaceContext";
import { ReimburseDocumentationHelpDialog } from "@/pages/reimburse/ReimburseDocumentationHelpDialog";

// ─── Types ──────────────────────────────────────────────────────────────────────
export type PlanId = "health-fsa" | "dependent-care-fsa";
export type DestinationId = "bank" | "check" | "instant";
export type ValidationState = "pass" | "needs-info" | "doc-required";

export interface UploadedDoc {
  name: string;
  size: string;
  isDummy?: boolean;
}

export interface ClaimData {
  amount: string;
  serviceDateStart: string;
  serviceDateEnd: string;
  provider: string;
  category: string;
  patient: string;
}

export interface ReceiptLineItem {
  id: string;
  description: string;
  amount: number;
  eligible: boolean;
  selected: boolean;
}

export interface AccountOption {
  id: PlanId;
  name: string;
  balance: number;
  autoSelected?: boolean;
  planYearStart: string;
  planYearEnd: string;
  finalFilingDate: string;
  finalServiceDate: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────────
export const REIMBURSE_FLOW_STEPS: Step[] = [
  { id: "upload", label: "Upload Documentation" },
  { id: "analyze", label: "Analyze Documentation" },
  { id: "account", label: "Select Plans" },
  { id: "details", label: "Confirm Details" },
  { id: "transfer", label: "Transfer Method" },
  { id: "review", label: "Review" },
];

export const SEND_PAYMENT_FLOW_STEPS: Step[] = [
  { id: "upload", label: "Upload Documentation" },
  { id: "analyze", label: "Analyze Documentation" },
  { id: "account", label: "Select Plans" },
  { id: "details", label: "Confirm Details" },
  { id: "payee", label: "Define Payee" },
  { id: "review", label: "Review" },
];

export const CATEGORIES = [
  { value: "physical-therapy", label: "Physical therapy" },
  { value: "medical", label: "Medical / Doctor visit" },
  { value: "dental", label: "Dental" },
  { value: "vision", label: "Vision / Eye care" },
  { value: "pharmacy", label: "Pharmacy / Prescription" },
  { value: "mental-health", label: "Mental health" },
  { value: "other", label: "Other medical" },
];

export const SOURCE_ACCOUNTS: AccountOption[] = [
  {
    id: "health-fsa",
    name: "Health FSA",
    balance: 850,
    autoSelected: true,
    planYearStart: "01/01/2026",
    planYearEnd: "12/31/2026",
    finalFilingDate: "04/30/2027",
    finalServiceDate: "12/31/2026",
  },
  {
    id: "dependent-care-fsa",
    name: "Dependent Care FSA",
    balance: 2100,
    planYearStart: "01/01/2026",
    planYearEnd: "12/31/2026",
    finalFilingDate: "04/30/2027",
    finalServiceDate: "12/31/2026",
  },
];

export const PLAN_LABELS: Record<string, string> = {
  "health-fsa": "Health FSA",
  "dependent-care-fsa": "Dependent Care FSA",
};

export const PROCESSING_STEPS = [
  { label: "Uploading", detail: "Sending your document securely" },
  { label: "Reading your document", detail: "Identifying text and layout" },
  { label: "Finding date and total", detail: "Extracting key details" },
  { label: "Preparing details to review", detail: "Almost ready for you" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────────
export function sumSelectedReceiptLines(lines: ReceiptLineItem[]): string {
  const total = lines.filter((l) => l.selected).reduce((s, l) => s + l.amount, 0);
  return total.toFixed(2);
}

export function createDefaultReceiptLineItems(): ReceiptLineItem[] {
  return [
    { id: "line-1", description: "ATORVASTATIN 10MG", amount: 20.0, eligible: true, selected: true },
    { id: "line-2", description: "LISINOPRIL 20MG", amount: 35.0, eligible: true, selected: true },
    { id: "line-3", description: "RX AMORICIL 500MG", amount: 12.45, eligible: true, selected: true },
    { id: "line-4", description: "ORBIT GUM 14PC", amount: 1.89, eligible: false, selected: false },
    { id: "line-5", description: "DIET COKE 20OZ", amount: 2.39, eligible: false, selected: false },
  ];
}

export function validationStatusFromState(s: {
  claim: ClaimData;
  uploadedDocs: { length: number };
}): ValidationState {
  if (
    !s.claim.amount ||
    !s.claim.serviceDateStart ||
    !s.claim.serviceDateEnd ||
    !s.claim.category
  ) {
    return "needs-info";
  }
  if (s.uploadedDocs.length === 0 && Number.parseFloat(s.claim.amount) > 100) return "doc-required";
  return "pass";
}

export function usd(amount: string) {
  return Number.parseFloat(amount || "0").toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function fmtDate(isoDate: string) {
  if (!isoDate) return "—";
  const [y, m, d] = isoDate.split("-");
  return `${m}/${d}/${y}`;
}

export function toReimburseStepperId(step: ReimburseWorkspaceStep): string {
  const map: Partial<Record<ReimburseWorkspaceStep, string>> = {
    start: "upload",
    processing: "analyze",
    account: "account",
    review: "details",
    manual: "details",
    destination: "transfer",
    validation: "review",
    confirmation: "review",
  };
  return map[step] ?? "upload";
}

export function toSendPaymentStepperId(step: ReimburseWorkspaceStep): string {
  const map: Partial<Record<ReimburseWorkspaceStep, string>> = {
    start: "upload",
    processing: "analyze",
    account: "account",
    review: "details",
    manual: "details",
    payee: "payee",
    validation: "review",
    confirmation: "review",
  };
  return map[step] ?? "upload";
}

/** Last four digits from an account number string (digits only for mask). */
export function lastFourFromAccountString(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 4) return digits.slice(-4);
  return raw.slice(-4) || "0000";
}

export function CustomStepper({
  steps,
  currentStepId,
  skippedStepIds = [],
}: {
  steps: Step[];
  currentStepId: string;
  skippedStepIds?: string[];
}) {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);

  return (
    <div className="flex h-full min-h-0 min-w-0 w-full flex-1 flex-col gap-[24px] overflow-x-hidden bg-[var(--neutral-50)] p-6">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isSkipped = isCompleted && skippedStepIds.includes(step.id);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="relative flex min-w-0 w-full flex-col gap-[16px] items-start">
            <div className="relative z-10 flex min-w-0 w-full items-center gap-[12px]">
              <div
                className={`
                flex items-center justify-center w-[24px] h-[24px] rounded-full text-[14px] shrink-0
                ${isActive ? "border border-[#0058a3] text-[#0058a3] font-semibold bg-transparent" : ""}
                ${isCompleted && !isSkipped ? "border border-[#009b89] text-[#009b89] font-semibold bg-transparent" : ""}
                ${isSkipped ? "border border-[#7c858e] text-[#7c858e] font-semibold bg-transparent" : ""}
                ${!isActive && !isCompleted ? "bg-[#e4e6e9] text-[#7c858e] font-medium" : ""}
              `}
              >
                {isSkipped ? (
                  <div className="h-[2px] w-3 bg-[#7c858e] rounded-full" />
                ) : isCompleted ? (
                  <Check className="h-4 w-4" strokeWidth={2} />
                ) : (
                  index + 1
                )}
              </div>

              <span
                className={`
                min-w-0 flex-1 text-[14px] leading-snug tracking-[-0.084px] break-words
                ${isActive ? "font-semibold text-[#243746]" : "font-medium text-[#7c858e]"}
              `}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div className="absolute left-[11.5px] top-[24px] h-[24px] w-[1px] bg-[#e4e6e9]" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function DummyReceiptPreview() {
  return (
    <div className="w-full h-full overflow-hidden bg-[#e4e6e9] flex items-center justify-center">
      <img
        src={`${import.meta.env.BASE_URL}reimburse-docs/cvs-receipt.png`}
        alt="Receipt preview"
        className="object-cover w-full h-full"
      />
    </div>
  );
}

export function ReceiptPreviewFull() {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-border/50 p-4 flex items-center justify-center">
      <img
        src={`${import.meta.env.BASE_URL}reimburse-docs/cvs-receipt.png`}
        alt="Receipt preview"
        className="object-contain w-full h-full max-h-[70vh]"
      />
    </div>
  );
}

export interface WorkspaceUploadSlice {
  uploadedDocs: UploadedDoc[];
  entryMode: "upload" | "manual" | "no-doc";
  autoAnalyze: boolean;
  step: ReimburseWorkspaceStep;
}

export function WorkspaceUploadStartStep<S extends WorkspaceUploadSlice>({
  variant,
  state,
  setState,
}: {
  variant: "reimburse" | "sendPayment";
  state: S;
  setState: Dispatch<SetStateAction<S>>;
}) {
  const [docsHelpOpen, setDocsHelpOpen] = useState(false);
  const hasDocs = state.uploadedDocs.length > 0;

  const uploadDoc =
    variant === "sendPayment"
      ? { name: "Provider_invoice_CVS.jpg", size: "1.2 MB", isDummy: true }
      : { name: "CVS_Pharmacy_receipt.jpg", size: "1.2 MB", isDummy: true };

  const handleSimulateUpload = () =>
    setState((prev) => ({
      ...prev,
      entryMode: "upload",
      uploadedDocs: [...prev.uploadedDocs, uploadDoc],
    }));

  const handleRemoveDoc = (index: number) =>
    setState((prev) => ({
      ...prev,
      uploadedDocs: prev.uploadedDocs.filter((_, i) => i !== index),
    }));

  const goNoDoc = () =>
    setState((prev) => ({
      ...prev,
      entryMode: "no-doc",
      step: "account" as const,
      autoAnalyze: false,
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
    }));

  const isSend = variant === "sendPayment";
  const checkboxId = isSend ? "send-payment-claims-ai" : "reimburse-auto-analyze";
  const labelId = `${checkboxId}-label`;

  return (
    <>
      <ReimburseDocumentationHelpDialog open={docsHelpOpen} onOpenChange={setDocsHelpOpen} />
      <div className="flex justify-center pt-10 px-8 pb-10">
        <div className="w-full max-w-[480px] flex flex-col gap-5">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isSend ? "Send payment to a provider" : "Reimburse myself"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isSend
                ? "Upload your provider invoice or bill. You'll review everything before submitting."
                : "Submit an out-of-pocket expense for reimbursement."}
            </p>
          </div>

          <Card className="overflow-hidden">
            {!hasDocs ? (
              <CardContent className="flex flex-col items-center gap-4 py-10 px-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-50">
                  <Upload className="h-6 w-6 text-neutral-700" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-foreground">
                    {isSend ? "Upload provider invoice or bill" : "Upload a receipt"}
                  </p>
                  <p className="text-sm text-muted-foreground">You&apos;ll review everything before submitting.</p>
                </div>
                <Button intent="primary" className="w-full" onClick={handleSimulateUpload}>
                  Upload Document
                </Button>
              </CardContent>
            ) : (
              <CardContent className="p-6 flex flex-col gap-4 pb-4">
                <p className="text-[13px] font-semibold uppercase tracking-[0.5px] text-[#5e6a75] mb-1">
                  Uploaded document(s)
                </p>
                <div className="flex flex-col gap-3">
                  {state.uploadedDocs.map((doc, i) => (
                    <div
                      key={`${doc.name}-${i}`}
                      className="relative rounded-lg overflow-hidden border border-[#e4e6e9] bg-white h-[180px]"
                    >
                      {doc.isDummy ? (
                        <DummyReceiptPreview />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-secondary/40">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                          <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.size}</p>
                        </div>
                      )}
                      <button
                        onClick={() => handleRemoveDoc(i)}
                        className="absolute bottom-3 left-3 h-10 w-10 rounded-md border border-[#e4e6e9] bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                        aria-label="Remove document"
                      >
                        <Trash2 className="h-[18px] w-[18px] text-[#c8102e]" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleSimulateUpload}
                  className="flex items-center justify-center gap-1.5 text-[15px] font-semibold text-[#0055a5] hover:underline mt-2"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                  Add another document
                </button>
              </CardContent>
            )}

            <div className="flex items-center justify-center gap-3 pb-6 pt-2 bg-card">
              <Checkbox
                checkboxSize="md"
                id={checkboxId}
                checked={state.autoAnalyze}
                onCheckedChange={(c) => {
                  if (c === "indeterminate") return;
                  setState((prev) => ({ ...prev, autoAnalyze: c === true }));
                }}
                aria-labelledby={labelId}
              />
              <div className="flex items-center gap-1.5">
                <label
                  id={labelId}
                  htmlFor={checkboxId}
                  className="text-sm text-foreground leading-snug cursor-pointer select-none pt-0.5"
                >
                  Auto-analyze my document
                </label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="shrink-0 rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      aria-label={isSend ? "About Claims AI" : "About auto-analyze"}
                    >
                      <Info className="h-3.5 w-3.5 text-current" aria-hidden />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-sm text-left">
                    <p className="text-sm font-semibold mb-2">What&apos;s this?</p>
                    <p className="text-sm mb-2">
                      {isSend
                        ? "Claims AI reads your invoice to suggest plan match, payee details, and line items. You stay in control and can edit anything."
                        : "We analyze and determine if the key information are present on the document, saving you time and effort."}
                    </p>
                    <p className="text-sm">
                      We use security measures to protect your information throughout the process. Your data
                      is never used to train any machine learning models or shared with third parties for any
                      purpose other than processing your request.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </Card>

          <div className="flex justify-center">
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-2"
              onClick={() => setDocsHelpOpen(true)}
            >
              <FileText className="h-4 w-4" />
              What documents work best?
            </button>
          </div>

          <Separator />

          <div className="flex justify-center">
            <button
              type="button"
              className="text-sm font-semibold text-foreground hover:underline underline-offset-2 transition-colors"
              onClick={goNoDoc}
            >
              I don&apos;t have documentation
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function ProcessingStep({ processingStep }: { processingStep: number }) {
  return (
    <div className="flex justify-center pt-16 pb-16 px-8">
      <div className="w-full max-w-md flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Getting your claim ready</h1>
          <p className="text-sm text-muted-foreground mt-1">This usually takes a few seconds.</p>
        </div>

        <Card>
          <CardContent className="p-8 flex flex-col gap-5">
            {PROCESSING_STEPS.map((step, i) => {
              const isDone = processingStep > i + 1;
              const isActive = processingStep === i + 1;
              return (
                <div key={step.label} className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : isActive ? (
                      <Spinner className="h-5 w-5" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-border" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        !isDone && !isActive ? "text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                    {isActive && (
                      <p className="text-xs text-muted-foreground mt-0.5 animate-pulse">{step.detail}</p>
                    )}
                  </div>
                </div>
              );
            })}
            {processingStep >= PROCESSING_STEPS.length && (
              <div className="flex items-center gap-2 text-sm text-success bg-success/10 rounded-lg py-3 px-4">
                <CheckCircle2 className="h-4 w-4" />
                Details ready — choosing account…
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          You&apos;ll be able to review and edit everything before submitting.
        </p>
      </div>
    </div>
  );
}

export interface AccountStepStateSlice {
  selectedPlan: PlanId;
  autoAnalyze: boolean;
  claim: ClaimData;
  receiptLineItems: ReceiptLineItem[];
}

export function AccountStep<S extends AccountStepStateSlice>({
  state,
  setState,
  heading = "Choose the account to reimburse from",
  autoSub =
    "Based on your receipt, we've recommended the best match. You can change it if needed.",
  manualSub = "Choose the account that fits this expense. You'll enter claim amounts on the next step.",
}: {
  state: S;
  setState: Dispatch<SetStateAction<S>>;
  heading?: string;
  autoSub?: string;
  manualSub?: string;
}) {
  const parsedClaim = Number.parseFloat(state.claim.amount);
  const claimAmount = Number.isFinite(parsedClaim) ? parsedClaim : 0;

  return (
    <div className="flex justify-center pt-10 px-8 pb-10">
      <div className="w-full max-w-[480px] flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{heading}</h1>
          <p className="text-sm text-muted-foreground mt-1">{state.autoAnalyze ? autoSub : manualSub}</p>
        </div>

        <div className="inline-flex items-center gap-2 text-sm text-neutral-700 bg-neutral-100 rounded-lg px-3 py-2 w-fit">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="shrink-0 rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="About claim amount"
              >
                <Info className="h-3.5 w-3.5 text-current" aria-hidden />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-sm text-left">
              <p className="text-sm">
                {state.autoAnalyze
                  ? "This amount was detected from your uploaded document. You can update it on the review screen if needed."
                  : "Enter your claim amount on the next screen. Your document was not auto-analyzed."}
              </p>
            </TooltipContent>
          </Tooltip>
          Claim amount:{" "}
          <span className="font-semibold text-foreground">{state.claim.amount ? `${usd(state.claim.amount)}*` : "—"}</span>
        </div>

        {state.selectedPlan === "dependent-care-fsa" && (
          <Alert intent="warning">
            <Info className="h-4 w-4" />
            <AlertTitle>Plan mismatch</AlertTitle>
            <AlertDescription>
              {state.autoAnalyze && state.receiptLineItems.length > 0
                ? "By selecting this plan, your claim could be denied as the items in your document aren't best suited for this plan type."
                : "By selecting this plan, verify your expense is eligible under this plan type."}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-3" role="radiogroup" aria-label="Benefit accounts">
          {SOURCE_ACCOUNTS.map((acct) => {
            const isSelected = state.selectedPlan === acct.id;
            const acctLow = claimAmount > 0 && acct.balance < claimAmount;
            return (
              <button
                key={acct.id}
                role="radio"
                aria-checked={isSelected}
                type="button"
                onClick={() => setState((prev) => ({ ...prev, selectedPlan: acct.id }))}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                  acctLow && isSelected
                    ? "border-amber-400 bg-amber-50/40"
                    : isSelected
                      ? "border-primary bg-white"
                      : "border-border/60 bg-white hover:border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-foreground">{acct.name}</span>
                    {acct.autoSelected && state.autoAnalyze && (
                      <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-primary/10 text-primary text-[11px] font-semibold leading-none whitespace-nowrap">
                        Best match
                      </span>
                    )}
                  </div>
                  <div
                    className={`mt-0.5 h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      isSelected ? "border-primary" : "border-muted-foreground/40"
                    }`}
                  >
                    {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                  </div>
                </div>

                <p
                  className={`text-2xl font-bold mt-2 mb-3 ${acctLow ? "text-amber-600" : "text-foreground"}`}
                >
                  {usd(String(acct.balance))}
                  {acctLow && (
                    <span className="ml-2 text-xs font-normal text-amber-600">· May not cover full amount</span>
                  )}
                </p>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          role="button"
                          tabIndex={0}
                          className="inline-flex shrink-0 cursor-help rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          aria-label="What is final filing date?"
                          onClick={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") e.stopPropagation();
                          }}
                        >
                          <Info className="h-3.5 w-3.5 text-current" aria-hidden />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-sm text-left">
                        <p className="text-sm">
                          The final filing date is the paperwork deadline — it is the very last day you are
                          allowed to submit a claim and upload your documentation to get reimbursed for the
                          expenses you incurred.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <span>
                      <span className="font-medium text-foreground/80">Final Filing Date:</span> {acct.finalFilingDate}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          role="button"
                          tabIndex={0}
                          className="inline-flex shrink-0 cursor-help rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          aria-label="What is final service date?"
                          onClick={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") e.stopPropagation();
                          }}
                        >
                          <Info className="h-3.5 w-3.5 text-current" aria-hidden />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-sm text-left">
                        <p className="text-sm">
                          The final service date is the absolute last day you can actually receive a medical
                          service, purchase an item, or incur an eligible expense that will be covered by your
                          current plan year&apos;s funds.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <span>
                      <span className="font-medium text-foreground/80">Final Service Date:</span> {acct.finalServiceDate}
                    </span>
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export interface DetailsStepStateSlice {
  step: ReimburseWorkspaceStep;
  entryMode: "upload" | "manual" | "no-doc";
  autoAnalyze: boolean;
  uploadedDocs: UploadedDoc[];
  claim: ClaimData;
  receiptLineItems: ReceiptLineItem[];
}

export function DetailsStep<S extends DetailsStepStateSlice>({
  state,
  setState,
  showRecurring = false,
  recurringClaim = false,
  onRecurringChange,
}: {
  state: S;
  setState: Dispatch<SetStateAction<S>>;
  showRecurring?: boolean;
  recurringClaim?: boolean;
  onRecurringChange?: (next: boolean) => void;
}) {
  const isManual = state.step === "manual";
  const isNoDoc = state.entryMode === "no-doc";

  const hasIneligibleSelected = useMemo(
    () => state.receiptLineItems.some((item) => !item.eligible && item.selected),
    [state.receiptLineItems]
  );

  const selectedReceiptTotal = useMemo(() => {
    const sum = state.receiptLineItems.filter((l) => l.selected).reduce((s, l) => s + l.amount, 0);
    return sum.toFixed(2);
  }, [state.receiptLineItems]);

  const updateClaim = (update: Partial<ClaimData>) =>
    setState((prev) => ({ ...prev, claim: { ...prev.claim, ...update } }));

  const setReceiptLineSelected = (id: string, selected: boolean) => {
    setState((prev) => {
      const receiptLineItems = prev.receiptLineItems.map((item) =>
        item.id === id ? { ...item, selected } : item
      );
      return {
        ...prev,
        receiptLineItems,
        claim: {
          ...prev.claim,
          amount: sumSelectedReceiptLines(receiptLineItems),
        },
      };
    });
  };

  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setState((prev) => {
      const { serviceDateStart: prevStart, serviceDateEnd: prevEnd } = prev.claim;
      const stillPaired = !prevEnd || prevEnd === prevStart;
      return {
        ...prev,
        claim: {
          ...prev.claim,
          serviceDateStart: next,
          serviceDateEnd: stillPaired ? next : prevEnd,
        },
      };
    });
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[520px] mx-auto px-8 py-8 flex flex-col gap-5">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isManual || isNoDoc || !state.autoAnalyze ? "Enter claim details" : "Review claim details"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isManual || isNoDoc
                ? "You can add documentation now or later."
                : state.autoAnalyze
                  ? "Confirm what we found. You can edit anything before submitting."
                  : "Enter your claim details. Your document was attached but not auto-analyzed."}
            </p>
          </div>

          {isNoDoc && (
            <Alert intent="info">
              <Info className="h-4 w-4" />
              <AlertTitle>No documentation? That&apos;s okay.</AlertTitle>
              <AlertDescription>
                You can submit without documentation. If required, we&apos;ll notify you.
              </AlertDescription>
            </Alert>
          )}

          {!isManual && state.uploadedDocs.length > 0 && state.autoAnalyze && (
            <Alert intent="info">
              <Info className="h-4 w-4" />
              <AlertDescription>
                We extracted these details from your document — please review and confirm.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardContent className="p-6 flex flex-col gap-5">
              <h2 className="text-lg font-semibold text-foreground">Claim details</h2>
              <FloatLabel
                label="Total amount"
                type="number"
                step="0.01"
                value={state.claim.amount}
                onChange={(e) => updateClaim({ amount: e.target.value })}
              />
              <FloatLabel
                label="Start date of service"
                type="date"
                value={state.claim.serviceDateStart}
                onChange={handleStartDateChange}
              />
              <FloatLabel
                label="End date of service"
                type="date"
                value={state.claim.serviceDateEnd}
                onChange={(e) => updateClaim({ serviceDateEnd: e.target.value })}
              />
              <FloatLabel
                label="Provider / merchant name"
                type="text"
                value={state.claim.provider}
                onChange={(e) => updateClaim({ provider: e.target.value })}
              />
              <FloatLabelSelect value={state.claim.category} onValueChange={(v) => updateClaim({ category: v })}>
                <FloatLabelSelect.Trigger label="Category / service type">
                  <FloatLabelSelect.Value placeholder=" " />
                </FloatLabelSelect.Trigger>
                <FloatLabelSelect.Content>
                  {CATEGORIES.map((c) => (
                    <FloatLabelSelect.Item key={c.value} value={c.value}>
                      {c.label}
                    </FloatLabelSelect.Item>
                  ))}
                </FloatLabelSelect.Content>
              </FloatLabelSelect>

              <FloatLabelSelect value={state.claim.patient} onValueChange={(v) => updateClaim({ patient: v })}>
                <FloatLabelSelect.Trigger label="Patient">
                  <FloatLabelSelect.Value placeholder=" " />
                </FloatLabelSelect.Trigger>
                <FloatLabelSelect.Content>
                  <FloatLabelSelect.Item value="self">Self</FloatLabelSelect.Item>
                  <FloatLabelSelect.Item value="spouse">Spouse</FloatLabelSelect.Item>
                  <FloatLabelSelect.Item value="dependent">Dependent</FloatLabelSelect.Item>
                </FloatLabelSelect.Content>
              </FloatLabelSelect>

              {showRecurring && onRecurringChange && (
                <div className="flex items-start gap-3 pt-1 border-t border-border/60">
                  <Checkbox
                    checkboxSize="md"
                    id="recurring-claim"
                    checked={recurringClaim}
                    onCheckedChange={(c) => {
                      if (c === "indeterminate") return;
                      onRecurringChange(c === true);
                    }}
                    aria-labelledby="recurring-claim-label"
                  />
                  <label
                    id="recurring-claim-label"
                    htmlFor="recurring-claim"
                    className="text-sm text-foreground leading-snug cursor-pointer select-none"
                  >
                    Set up a recurring claim for this expense
                  </label>
                </div>
              )}
            </CardContent>
          </Card>

          {state.receiptLineItems.length > 0 && (
            <Card className="shadow-sm border-border/80">
              <CardContent className="p-6 flex flex-col gap-4">
                <div>
                  <h2 className="text-base font-semibold text-[#243746] tracking-tight">Items found on your receipt</h2>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    We found these items on your receipt. Items that look eligible are selected. You can include
                    any item or add one manually.
                  </p>
                </div>

                {hasIneligibleSelected && (
                  <Alert intent="warning">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Ineligible items selected</AlertTitle>
                    <AlertDescription>
                      By selecting an item that is not eligible under your plan, this claim will not be
                      auto-approved and may be denied completely.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-col rounded-lg border border-border/60 divide-y divide-border bg-card">
                  {state.receiptLineItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4">
                      <Checkbox
                        checkboxSize="md"
                        checked={item.selected}
                        disabled={!item.eligible}
                        onCheckedChange={(c) => {
                          if (c === "indeterminate") return;
                          setReceiptLineSelected(item.id, c === true);
                        }}
                        aria-label={`Include ${item.description}`}
                      />
                      <span
                        className={`flex-1 min-w-0 text-sm font-medium ${
                          !item.eligible ? "text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {item.description}
                      </span>
                      <div
                        className={`inline-flex items-center gap-[3.5px] px-[7px] py-[3.5px] rounded-[12px] shrink-0 ${
                          item.eligible ? "bg-[#dcfce7] text-[#008375]" : "bg-[#ffecc7] text-[#b37a2b] opacity-75"
                        }`}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              role="button"
                              tabIndex={0}
                              className="cursor-help flex items-center outline-none"
                              onClick={(e) => e.stopPropagation()}
                              onPointerDown={(e) => e.stopPropagation()}
                              onKeyDown={(e) => e.stopPropagation()}
                            >
                              <Info className="h-[10.5px] w-[10.5px] text-current" strokeWidth={2.5} aria-hidden />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs text-left">
                            <p className="text-sm">
                              {item.eligible
                                ? "This item is considered an eligible expense under your current plan."
                                : "This item is not covered by your current plan and cannot be reimbursed."}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                        <span className="text-[11px] font-semibold leading-none whitespace-nowrap">
                          {item.eligible ? "Eligible" : "Ineligible"}
                        </span>
                      </div>
                      <span
                        className={`shrink-0 text-sm font-semibold tabular-nums w-[4.5rem] text-right ${
                          !item.eligible ? "text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {usd(String(item.amount))}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                  <span>Selected total:</span>
                  <span className="tabular-nums">{usd(selectedReceiptTotal)}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {!isManual && state.uploadedDocs.some((d) => d.isDummy) && (
        <aside className="hidden lg:flex w-[42%] flex-shrink-0 border-l border-border bg-muted/20 flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-background/80 flex-shrink-0">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground truncate">
              {state.uploadedDocs[0]?.name ?? "Receipt.jpg"}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <ReceiptPreviewFull />
          </div>
        </aside>
      )}
    </div>
  );
}

type TimelineStatus = "completed" | "active" | "pending";

const TIMELINE_REIMBURSE: {
  label: string;
  description: string;
  icon: typeof CheckCircle2;
  status: TimelineStatus;
}[] = [
  { label: "Submitted", description: "We received your claim.", icon: CheckCircle2, status: "completed" },
  { label: "Under review", description: "We're checking the details.", icon: ShieldCheck, status: "completed" },
  { label: "Approved", description: "Your claim is approved.", icon: CheckCircle2, status: "active" },
  { label: "Payment sent", description: "Reimbursement is on the way.", icon: Banknote, status: "pending" },
];

const TIMELINE_SEND_PAYMENT: {
  label: string;
  description: string;
  icon: typeof CheckCircle2;
  status: TimelineStatus;
}[] = [
  { label: "Submitted", description: "We received your claim.", icon: CheckCircle2, status: "completed" },
  { label: "Under review", description: "We're checking the details.", icon: ShieldCheck, status: "completed" },
  { label: "Approved", description: "Your claim is approved.", icon: CheckCircle2, status: "active" },
  {
    label: "Payment sent to provider",
    description: "Funds are on the way to your provider.",
    icon: Banknote,
    status: "pending",
  },
];

export function ConfirmationStep({
  variant,
  summaryRows,
}: {
  variant: "reimburse" | "sendPayment";
  summaryRows: { label: string; value: string }[];
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const events = variant === "sendPayment" ? TIMELINE_SEND_PAYMENT : TIMELINE_REIMBURSE;

  const triggerConfetti = () => {
    if (!headingRef.current) return;
    const rect = headingRef.current.getBoundingClientRect();
    const x = rect.width > 0 ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
    const y = rect.height > 0 ? (rect.top + rect.height / 2) / window.innerHeight : 0.2;
    confetti({
      origin: { x, y },
      colors: ["#0055a5", "#009b89", "#3958c3", "#e11d48", "#facc15"],
      zIndex: 10000,
      particleCount: 120,
      spread: 100,
      startVelocity: 45,
      scalar: 1.1,
    });
  };

  useEffect(() => {
    const timer = setTimeout(triggerConfetti, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center pt-10 px-8 pb-10">
      <div className="w-full max-w-[480px] flex flex-col gap-5">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <div>
            <h1 ref={headingRef} className="text-2xl font-bold text-foreground">
              Claim approved!
            </h1>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-semibold text-foreground mb-5">What happens next</p>
            <div className="flex flex-col gap-0">
              {events.map((event, i) => {
                const Icon = event.icon;
                const isLast = i === events.length - 1;
                const isCompleted = event.status === "completed";
                const isActive = event.status === "active";
                const isPending = event.status === "pending";

                return (
                  <div key={event.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-[24px] w-[24px] items-center justify-center rounded-full flex-shrink-0 mt-0.5 ${
                          isActive ? "border border-[var(--theme-primary)] text-[var(--neutral-700)] bg-white" : ""
                        } ${
                          isCompleted ? "border border-[#009b89] text-[#009b89] bg-white" : ""
                        } ${isPending ? "bg-[var(--neutral-100)] text-[var(--neutral-700)]" : ""}`}
                      >
                        {isCompleted ? (
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                        ) : (
                          <Icon className="h-3.5 w-3.5" strokeWidth={isPending ? 2 : 2.5} />
                        )}
                      </div>
                      {!isLast && <div className="w-[1px] flex-1 bg-[#e4e6e9] my-1" />}
                    </div>
                    <div className="pb-6">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-[14px] tracking-[-0.084px] leading-tight ${
                            isActive ? "font-semibold text-[#243746]" : "font-medium text-[var(--neutral-700)]"
                          }`}
                        >
                          {event.label}
                        </p>
                        {isActive && (
                          <span className="inline-flex items-center px-[7px] py-[3.5px] rounded-[12px] bg-[var(--theme-secondary-ramp-50)] text-[var(--theme-secondary)] text-[11px] font-semibold leading-none whitespace-nowrap">
                            Now
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[var(--neutral-700)] mt-1">{event.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-[var(--neutral-700)] mt-4">
              Final amount and timing depend on approval.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-semibold text-foreground mb-4">Claim summary</p>
            <div className="flex flex-col gap-3">
              {summaryRows.map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-4">
                  <span className="text-xs text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-medium text-foreground text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button intent="primary" className="flex-1 flex items-center justify-center gap-2">
            <Clock className="h-4 w-4 text-white" />
            View claim status
          </Button>
        </div>
      </div>
    </div>
  );
}

