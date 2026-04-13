import {
  type ChangeEvent,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
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
  FloatLabelSelect,
  Separator,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Workspace,
} from "@wexinc-healthbenefits/ben-ui-kit";
import type { Step } from "@wexinc-healthbenefits/ben-ui-kit";
import {
  ArrowRight,
  Banknote,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  Mail,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { useReimburseWorkspace } from "@/context/ReimburseWorkspaceContext";
import type { ReimburseWorkspaceStep } from "@/context/ReimburseWorkspaceContext";
import { ReimburseDocumentationHelpDialog } from "@/pages/reimburse/ReimburseDocumentationHelpDialog";
import confetti from "canvas-confetti";

// ─── Types ──────────────────────────────────────────────────────────────────────
type PlanId = "health-fsa" | "dependent-care-fsa";
type DestinationId = "bank" | "check" | "instant";
type ValidationState = "pass" | "needs-info" | "doc-required";

interface UploadedDoc {
  name: string;
  size: string;
  isDummy?: boolean;
}

interface ClaimData {
  amount: string;
  serviceDateStart: string;
  serviceDateEnd: string;
  provider: string;
  category: string;
  patient: string;
}

/** Extracted receipt row; eligibility is inferred from plan rules in this prototype. */
interface ReceiptLineItem {
  id: string;
  description: string;
  /** Dollar amount for this line */
  amount: number;
  eligible: boolean;
  selected: boolean;
}

interface ReimburseFlowState {
  step: ReimburseWorkspaceStep;
  uploadedDocs: UploadedDoc[];
  entryMode: "upload" | "manual" | "no-doc";
  selectedPlan: PlanId;
  destination: DestinationId;
  processingStep: number;
  validationState: ValidationState;
  claim: ClaimData;
  receiptLineItems: ReceiptLineItem[];
}

// ─── Stepper steps (matches screenshot) ─────────────────────────────────────────
const FLOW_STEPS: Step[] = [
  { id: "upload",   label: "Upload Documentation" },
  { id: "analyze",  label: "Analyze Documentation" },
  { id: "account",  label: "Select Plans" },
  { id: "details",  label: "Confirm Details" },
  { id: "transfer", label: "Transfer Method" },
  { id: "review",   label: "Review" },
];

function toStepperId(step: ReimburseWorkspaceStep): string {
  const map: Partial<Record<ReimburseWorkspaceStep, string>> = {
    start:        "upload",
    processing:   "analyze",
    account:      "account",
    review:       "details",
    manual:       "details",
    destination:  "transfer",
    validation:   "review",
    confirmation: "review",
  };
  return map[step] ?? "upload";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────────
function sumSelectedReceiptLines(lines: ReceiptLineItem[]): string {
  const total = lines.filter((l) => l.selected).reduce((s, l) => s + l.amount, 0);
  return total.toFixed(2);
}

/** Mock extraction aligned with Health FSA rules: medical care eligible; supplements & parking not. */
function createDefaultReceiptLineItems(): ReceiptLineItem[] {
  return [
    { id: "line-copay", description: "Office visit copay", amount: 25, eligible: true, selected: true },
    {
      id: "line-pt",
      description: "Physical therapy session",
      amount: 45,
      eligible: true,
      selected: true,
    },
    { id: "line-sun", description: "Sunscreen", amount: 50, eligible: true, selected: true },
    {
      id: "line-protein",
      description: "Protein powder",
      amount: 25,
      eligible: false,
      selected: false,
    },
    { id: "line-parking", description: "Parking", amount: 25, eligible: false, selected: false },
  ];
}

function createInitialState(step: ReimburseWorkspaceStep): ReimburseFlowState {
  return {
    step,
    uploadedDocs: [],
    entryMode: "upload",
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

function validationStatusFromState(s: ReimburseFlowState): ValidationState {
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

function usd(amount: string) {
  return Number.parseFloat(amount || "0").toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function fmtDate(isoDate: string) {
  if (!isoDate) return "—";
  const [y, m, d] = isoDate.split("-");
  return `${m}/${d}/${y}`;
}

const CATEGORIES = [
  { value: "physical-therapy", label: "Physical therapy" },
  { value: "medical",          label: "Medical / Doctor visit" },
  { value: "dental",           label: "Dental" },
  { value: "vision",           label: "Vision / Eye care" },
  { value: "pharmacy",         label: "Pharmacy / Prescription" },
  { value: "mental-health",    label: "Mental health" },
  { value: "other",            label: "Other medical" },
];

function CustomStepper({ steps, currentStepId }: { steps: Step[], currentStepId: string }) {
  const currentIndex = steps.findIndex(s => s.id === currentStepId);

  return (
    <div className="flex flex-col gap-[24px] p-[24px] w-[240px] bg-[#f7f7f7] h-full shrink-0">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="relative flex flex-col gap-[16px] items-start shrink-0">
            <div className="flex items-center gap-[12px] relative shrink-0 w-full z-10">
              {/* Circle */}
              <div className={`
                flex items-center justify-center w-[24px] h-[24px] rounded-full text-[14px] shrink-0
                ${isActive ? 'border border-[#0058a3] text-[#0058a3] font-semibold bg-transparent' : ''}
                ${isCompleted ? 'border border-[#009b89] text-[#009b89] font-semibold bg-transparent' : ''}
                ${!isActive && !isCompleted ? 'bg-[#e4e6e9] text-[#7c858e] font-medium' : ''}
              `}>
                {isCompleted ? (
                  <Check className="h-4 w-4" strokeWidth={2} />
                ) : (
                  index + 1
                )}
              </div>
              
              {/* Label */}
              <span className={`
                text-[14px] tracking-[-0.084px] whitespace-nowrap
                ${isActive ? 'font-semibold text-[#243746]' : 'font-medium text-[#7c858e]'}
              `}>
                {step.label}
              </span>
            </div>

            {/* Vertical line */}
            {!isLast && (
              <div 
                className="absolute left-[11.5px] top-[24px] h-[24px] w-[1px] bg-[#e4e6e9]"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────────
export function ReimburseWorkspaceHost() {
  const { isOpen, initialStep, sessionKey, closeReimburseWorkspace } = useReimburseWorkspace();
  if (!isOpen) return null;
  return (
    <ReimburseWorkspaceSession
      key={`${sessionKey}-${initialStep}`}
      initialStep={initialStep}
      onClose={closeReimburseWorkspace}
    />
  );
}

// ─── Session ──────────────────────────────────────────────────────────────────────
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

  // Auto-advance through processing
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
            serviceDateStart: prev.claim.serviceDateStart || "2026-03-10",
            serviceDateEnd: prev.claim.serviceDateEnd || "2026-03-10",
            provider: prev.claim.provider || "ABC Physical Therapy",
            category: prev.claim.category || "physical-therapy",
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

  // ── Stepper sidebar ────────────────────────────────────────────────────────────
  const stepperContent = (
    <CustomStepper steps={FLOW_STEPS} currentStepId={toStepperId(state.step)} />
  );

  // ── Footer buttons per step ───────────────────────────────────────────────────
  let primaryBtn: ReactNode = null;
  let secondaryBtn: ReactNode = null;
  let tertiaryBtn: ReactNode = null;

  if (state.step !== "processing" && state.step !== "confirmation") {
    tertiaryBtn = (
      <Button variant="ghost" onClick={() => handleOpenChange(false)} className="px-4 py-2 mr-auto">
        Cancel
      </Button>
    );
  }

  if (state.step === "start") {
    primaryBtn = (
      <Button
        intent="primary"
        disabled={state.uploadedDocs.length === 0}
        onClick={() => setState((prev) => ({ ...prev, step: "processing", processingStep: 1 }))}
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
  } else if (state.step === "review" || state.step === "manual") {
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
        onClick={() => goTo(state.step === "manual" ? "start" : "account")}
        className="px-4 py-2"
      >
        Back
      </Button>
    );
    primaryBtn = (
      <Button
        intent="primary"
        disabled={!canContinue}
        onClick={() => goTo("destination")}
        className="px-4 py-2"
      >
        Continue
      </Button>
    );
  } else if (state.step === "destination") {
    secondaryBtn = (
      <Button
        intent="secondary"
        variant="outline"
        onClick={() => goTo(state.entryMode === "upload" ? "review" : "manual")}
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
      <Button
        intent="secondary"
        variant="outline"
        onClick={() => goTo("destination")}
        className="px-4 py-2"
      >
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

  // ── Summary rows ──────────────────────────────────────────────────────────────
  const summaryRows = useMemo(
    () => [
      { label: "Amount",                value: state.claim.amount ? usd(state.claim.amount) : "$0.00" },
      { label: "Start date of service", value: fmtDate(state.claim.serviceDateStart) },
      { label: "End date of service",   value: fmtDate(state.claim.serviceDateEnd) },
      { label: "Provider",              value: state.claim.provider || "—" },
      { label: "Account",      value: state.selectedPlan === "health-fsa" ? "Health FSA" : "Dependent Care FSA" },
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
          <StartStep state={state} setState={setState} />
        )}
        {state.step === "processing" && (
          <ProcessingStep processingStep={state.processingStep} />
        )}
        {state.step === "account" && (
          <AccountStep state={state} setState={setState} />
        )}
        {(state.step === "review" || state.step === "manual") && (
          <DetailsStep state={state} setState={setState} />
        )}
        {state.step === "destination" && (
          <DestinationStep state={state} setState={setState} />
        )}
        {state.step === "validation" && (
          <ValidationStep
            state={state}
            summaryRows={summaryRows}
            onNav={(step) => goTo(step as ReimburseWorkspaceStep)}
          />
        )}
        {state.step === "confirmation" && (
          <ConfirmationStep summaryRows={summaryRows} />
        )}
      </Workspace>

      {/* Cancel confirmation dialog */}
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

// ─── Step 1: Upload Documentation ────────────────────────────────────────────────
function StartStep({
  state,
  setState,
}: {
  state: ReimburseFlowState;
  setState: Dispatch<SetStateAction<ReimburseFlowState>>;
}) {
  const [docsHelpOpen, setDocsHelpOpen] = useState(false);
  const hasDocs = state.uploadedDocs.length > 0;

  const handleSimulateUpload = () =>
    setState((prev) => ({
      ...prev,
      entryMode: "upload",
      uploadedDocs: [
        ...prev.uploadedDocs,
        { name: "ABC_Physical_Therapy_receipt.pdf", size: "84 KB", isDummy: true },
      ],
    }));

  const handleRemoveDoc = (index: number) =>
    setState((prev) => ({
      ...prev,
      uploadedDocs: prev.uploadedDocs.filter((_, i) => i !== index),
    }));

  return (
    <>
      <ReimburseDocumentationHelpDialog open={docsHelpOpen} onOpenChange={setDocsHelpOpen} />
      <div className="flex justify-center pt-10 px-8 pb-10">
      <div className="w-full max-w-[480px] flex flex-col gap-5">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reimburse myself</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Submit an out-of-pocket expense for reimbursement.
          </p>
        </div>

        {/* Upload / uploaded card */}
        <Card className="overflow-hidden">
          {!hasDocs ? (
            <CardContent className="flex flex-col items-center gap-4 py-10 px-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-50">
                <Upload className="h-6 w-6 text-neutral-700" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-foreground">Upload a receipt</p>
                <p className="text-sm text-muted-foreground">
                  You'll review everything before submitting.
                </p>
              </div>
              <Button intent="primary" className="w-full" onClick={handleSimulateUpload}>
                Upload Document
              </Button>
            </CardContent>
          ) : (
            <CardContent className="p-5 flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Uploaded document(s)
              </p>
              <div className="flex flex-col gap-3">
                {state.uploadedDocs.map((doc, i) => (
                  <div
                    key={`${doc.name}-${i}`}
                    className="relative rounded-lg overflow-hidden border bg-secondary/30"
                    style={{ height: 140 }}
                  >
                    {doc.isDummy ? (
                      <DummyReceiptPreview />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-secondary/40">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                          {doc.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{doc.size}</p>
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveDoc(i)}
                      className="absolute bottom-2 left-2 h-8 w-8 rounded border border-border bg-white shadow-sm flex items-center justify-center hover:bg-secondary transition-colors"
                      aria-label="Remove document"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSimulateUpload}
                className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-2"
              >
                <Plus className="h-3.5 w-3.5" />
                Add another document
              </button>
            </CardContent>
          )}
        </Card>

        {/* What documents link */}
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
            onClick={() =>
              setState((prev) => ({ ...prev, entryMode: "no-doc", step: "manual" }))
            }
          >
            I don't have documentation
          </button>
        </div>
      </div>
      </div>
    </>
  );
}

function DummyReceiptPreview() {
  return (
    <div className="w-full h-full overflow-hidden bg-white">
      <div
        className="w-full origin-top"
        style={{
          transform: "scale(0.42)",
          transformOrigin: "top center",
          width: "238%",
          marginLeft: "-69%",
        }}
      >
        <div className="bg-white p-5">
          <div className="text-center pb-3 border-b border-gray-100">
            <div className="font-bold text-sm text-gray-800 uppercase tracking-wide">
              ABC Physical Therapy
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              1234 Health Ave, Suite 200 · Portland, OR 97201
            </div>
          </div>
          <div className="flex justify-between pt-3 pb-2 text-xs text-gray-500">
            <span>Date: March 10, 2026</span>
            <span>Invoice #: 20260310</span>
          </div>
          <div className="pb-3 border-b border-gray-100">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Patient</div>
            <div className="text-sm text-gray-700">John Doe</div>
            <div className="text-xs text-gray-400">DOB: 01/15/1985 · MRN: 00481920</div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-sm font-bold text-gray-800">
              <span>Patient Balance Due</span>
              <span>$127.43</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Analyze Documentation ───────────────────────────────────────────────
const PROCESSING_STEPS = [
  { label: "Uploading",                 detail: "Sending your document securely" },
  { label: "Reading your document",     detail: "Identifying text and layout" },
  { label: "Finding date and total",    detail: "Extracting key details" },
  { label: "Preparing details to review", detail: "Almost ready for you" },
];

function ProcessingStep({ processingStep }: { processingStep: number }) {
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
              const isDone   = processingStep > i + 1;
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
                      <p className="text-xs text-muted-foreground mt-0.5 animate-pulse">
                        {step.detail}
                      </p>
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
          You'll be able to review and edit everything before submitting.
        </p>
      </div>
    </div>
  );
}

// ─── Step 3: Select Plans ─────────────────────────────────────────────────────────
interface AccountOption {
  id: PlanId;
  name: string;
  balance: number;
  autoSelected?: boolean;
  planYearStart: string;
  planYearEnd: string;
  finalFilingDate: string;
  finalServiceDate: string;
}

const SOURCE_ACCOUNTS: AccountOption[] = [
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

function AccountStep({
  state,
  setState,
}: {
  state: ReimburseFlowState;
  setState: Dispatch<SetStateAction<ReimburseFlowState>>;
}) {
  const claimAmount = Number.parseFloat(state.claim.amount || "127.43");

  return (
    <div className="flex justify-center pt-10 px-8 pb-10">
      <div className="w-full max-w-[480px] flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Choose the account to reimburse from
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Based on your receipt, we've recommended the best match. You can change it if needed.
          </p>
        </div>

        {/* Claim amount pill */}
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
                This amount was detected from your uploaded document. You can update it on the review
                screen if needed.
              </p>
            </TooltipContent>
          </Tooltip>
          Claim amount:{" "}
          <span className="font-semibold text-foreground">
            {usd(state.claim.amount || "127.43")}*
          </span>
        </div>

        {state.selectedPlan === "dependent-care-fsa" && (
          <Alert intent="warning">
            <Info className="h-4 w-4" />
            <AlertTitle>Plan mismatch</AlertTitle>
            <AlertDescription>
              By selecting this plan, your claim could be denied as the items in your document aren't
              best suited for this plan type.
            </AlertDescription>
          </Alert>
        )}

        {/* Account cards */}
        <div className="flex flex-col gap-3" role="radiogroup" aria-label="Benefit accounts">
          {SOURCE_ACCOUNTS.map((acct) => {
            const isSelected = state.selectedPlan === acct.id;
            const acctLow    = acct.balance < claimAmount;
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
                {/* Name + badge + radio */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-foreground">{acct.name}</span>
                    {acct.autoSelected && (
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

                {/* Balance */}
                <p
                  className={`text-2xl font-bold mt-2 mb-3 ${
                    acctLow ? "text-amber-600" : "text-foreground"
                  }`}
                >
                  {usd(String(acct.balance))}
                  {acctLow && (
                    <span className="ml-2 text-xs font-normal text-amber-600">
                      · May not cover full amount
                    </span>
                  )}
                </p>

                {/* Dates */}
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
                          The final filing date is the paperwork deadline — it is the very last day you
                          are allowed to submit a claim and upload your documentation to get reimbursed
                          for the expenses you incurred.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <span>
                      <span className="font-medium text-foreground/80">Final Filing Date:</span>{" "}
                      {acct.finalFilingDate}
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
                          service, purchase an item, or incur an eligible expense that will be covered by
                          your current plan year&apos;s funds.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                    <span>
                      <span className="font-medium text-foreground/80">Final Service Date:</span>{" "}
                      {acct.finalServiceDate}
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

// ─── Step 4: Confirm Details ──────────────────────────────────────────────────────
function DetailsStep({
  state,
  setState,
}: {
  state: ReimburseFlowState;
  setState: Dispatch<SetStateAction<ReimburseFlowState>>;
}) {
  const isManual = state.step === "manual";
  const isNoDoc  = state.entryMode === "no-doc";

  const hasIneligibleSelected = useMemo(
    () => state.receiptLineItems.some((item) => !item.eligible && item.selected),
    [state.receiptLineItems]
  );

  const selectedReceiptTotal = useMemo(() => {
    const sum = state.receiptLineItems
      .filter((l) => l.selected)
      .reduce((s, l) => s + l.amount, 0);
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

  /** Keep end in sync with start while they still match (default single-day service). */
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
      {/* Left: scrollable form */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[520px] mx-auto px-8 py-8 flex flex-col gap-5">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isManual ? "Enter claim details" : "Review claim details"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isManual
                ? "You can add documentation now or later."
                : "Confirm what we found. You can edit anything before submitting."}
            </p>
          </div>

          {isNoDoc && (
            <Alert intent="info">
              <Info className="h-4 w-4" />
              <AlertTitle>No documentation? That's okay.</AlertTitle>
              <AlertDescription>
                You can submit without documentation. If required, we'll notify you.
              </AlertDescription>
            </Alert>
          )}

          {!isManual && state.uploadedDocs.length > 0 && (
            <Alert intent="info">
              <Info className="h-4 w-4" />
              <AlertDescription>
                We extracted these details from your document — please review and confirm.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardContent className="p-6 flex flex-col gap-5">
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
              <FloatLabelSelect
                value={state.claim.category}
                onValueChange={(v) => updateClaim({ category: v })}
              >
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

              <FloatLabelSelect
                value={state.claim.patient}
                onValueChange={(v) => updateClaim({ patient: v })}
              >
                <FloatLabelSelect.Trigger label="Patient">
                  <FloatLabelSelect.Value placeholder=" " />
                </FloatLabelSelect.Trigger>
                <FloatLabelSelect.Content>
                  <FloatLabelSelect.Item value="self">Self</FloatLabelSelect.Item>
                  <FloatLabelSelect.Item value="spouse">Spouse</FloatLabelSelect.Item>
                  <FloatLabelSelect.Item value="dependent">Dependent</FloatLabelSelect.Item>
                </FloatLabelSelect.Content>
              </FloatLabelSelect>
            </CardContent>
          </Card>

          {state.receiptLineItems.length > 0 && (
            <Card className="shadow-sm border-border/80">
              <CardContent className="p-6 flex flex-col gap-4">
                <div>
                  <h2 className="text-base font-semibold text-[#243746] tracking-tight">
                    Items found on your receipt
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    We found these items on your receipt. Items that look eligible are selected. You can
                    include any item or add one manually.
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
                    <div
                      key={item.id}
                      className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4"
                    >
                      <Checkbox
                        checkboxSize="md"
                        checked={item.selected}
                        onCheckedChange={(c) => {
                          if (c === "indeterminate") return;
                          setReceiptLineSelected(item.id, c === true);
                        }}
                        aria-label={`Include ${item.description}`}
                      />
                      <span className="flex-1 min-w-0 text-sm font-medium text-foreground">
                        {item.description}
                      </span>
                      <div
                        className={`inline-flex items-center gap-[3.5px] px-[7px] py-[3.5px] rounded-[12px] shrink-0 ${
                          item.eligible
                            ? "bg-[#dcfce7] text-[#008375]"
                            : "bg-[#ffecc7] text-[#b37a2b]"
                        }`}
                      >
                        <Info className="h-[10.5px] w-[10.5px] text-current" strokeWidth={2.5} aria-hidden />
                        <span className="text-[11px] font-semibold leading-none whitespace-nowrap">
                          {item.eligible ? "Eligible" : "Ineligible*"}
                        </span>
                      </div>
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground w-[4.5rem] text-right">
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

      {/* Right: sticky receipt preview (upload path, large screens) */}
      {!isManual && state.uploadedDocs.some((d) => d.isDummy) && (
        <aside className="hidden lg:flex w-[42%] flex-shrink-0 border-l border-border bg-muted/20 flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-background/80 flex-shrink-0">
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground truncate">
              {state.uploadedDocs[0]?.name ?? "Receipt.pdf"}
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

function ReceiptPreviewFull() {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-border/50 p-7">
      <div className="text-center pb-5 border-b border-gray-100 space-y-0.5">
        <div className="font-bold text-sm text-gray-800 tracking-wide uppercase">
          ABC Physical Therapy
        </div>
        <div className="text-xs text-gray-400">1234 Health Ave, Suite 200 · Portland, OR 97201</div>
        <div className="text-xs text-gray-400">Tel: (503) 555-0182</div>
      </div>
      <div className="flex justify-between pt-4 pb-3 text-xs text-gray-500">
        <span>Date: March 10, 2026</span>
        <span>Invoice #: 20260310</span>
      </div>
      <div className="pb-4 border-b border-gray-100">
        <div className="text-[10px] uppercase tracking-wider text-gray-400 font-medium mb-1">Patient</div>
        <div className="text-sm text-gray-700">John Doe</div>
        <div className="text-xs text-gray-400">DOB: 01/15/1985 · MRN: 00481920</div>
      </div>
      <table className="w-full mt-4 text-xs">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-gray-400 font-medium pb-2 pr-2">Description</th>
            <th className="text-right text-gray-400 font-medium pb-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {[
            { desc: "Office visit copay",             amt: "$25.00" },
            { desc: "Physical therapy session (60 min)", amt: "$90.00" },
            { desc: "Cold pack / ice therapy",        amt: "$5.00" },
            { desc: "Protein powder (supplement)",    amt: "$12.43" },
          ].map((row) => (
            <tr key={row.desc} className="border-b border-gray-50 last:border-0">
              <td className="py-2 pr-2 text-gray-700">{row.desc}</td>
              <td className="py-2 text-right tabular-nums text-gray-700">{row.amt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between text-sm font-semibold text-gray-800">
          <span>Total due</span>
          <span className="tabular-nums">$132.43</span>
        </div>
      </div>
    </div>
  );
}

// ─── Step 5: Transfer Method ──────────────────────────────────────────────────────
function DestinationStep({
  state,
  setState,
}: {
  state: ReimburseFlowState;
  setState: Dispatch<SetStateAction<ReimburseFlowState>>;
}) {
  const options = [
    {
      id: "bank"    as const,
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
      bankName: "Penny's Bank",
      accountMask: "•••• 5423 Checking",
    },
    {
      id: "check"   as const,
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
          <h1 className="text-[24px] font-bold text-[#1d2c38]">
            How would you like to get reimbursed?
          </h1>
          <p className="text-[16px] text-[#515f6b] mt-2 leading-relaxed">
            Select how you'd like to receive the money for your reimbursement.
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
                    className={`mt-0.5 flex-shrink-0 ${
                      isSelected ? "text-neutral-700" : "text-[#515f6b]"
                    }`}
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

// ─── Step 6: Review (Validation) ─────────────────────────────────────────────────
const PLAN_LABELS: Record<string, string> = {
  "health-fsa":         "Health FSA",
  "dependent-care-fsa": "Dependent Care FSA",
};
const DEST_LABELS: Record<string, string> = {
  bank:    "Bank account ending in 1234",
  check:   "Check by mail",
  instant: "Instant payment",
};

function ValidationStep({
  state,
  onNav,
}: {
  state:       ReimburseFlowState;
  summaryRows: { label: string; value: string }[];
  onNav:       (step: string) => void;
}) {
  const planLabel = PLAN_LABELS[state.selectedPlan] ?? state.selectedPlan;
  const destLabel = DEST_LABELS[state.destination]   ?? state.destination;
  const amountFmt = state.claim.amount ? usd(state.claim.amount) : "$127.43";

  const selectedItems = state.receiptLineItems.filter(item => item.selected);

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

        {/* Summary Card */}
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
                  <div className="flex items-center gap-2 text-[#0055a5] font-bold text-[15px]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0 text-neutral-700"
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
                <p className="text-[15px] text-[#515f6b] mt-1 font-medium ml-7">
                  $850.00
                </p>
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
                      className="shrink-0 text-neutral-700"
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
                    <p className="text-[14px] font-medium text-[#515f6b]">Ella's Bank</p>
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

        {/* Items Card */}
        <Card className="shadow-sm border-[#e4e6e9] rounded-xl relative">
          <button
            type="button"
            onClick={() => onNav(state.entryMode === "upload" ? "review" : "manual")}
            className="absolute top-6 right-6 text-[14px] font-semibold text-[#0055a5] hover:underline"
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
                  <span className="text-[16px] text-[#515f6b] tabular-nums shrink-0">
                    {amountFmt}
                  </span>
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

// ─── Confirmation ─────────────────────────────────────────────────────────────────
type TimelineStatus = "completed" | "active" | "pending";

const TIMELINE_EVENTS: { label: string; description: string; icon: any; status: TimelineStatus }[] = [
  { label: "Submitted",    description: "We received your claim.",        icon: CheckCircle2, status: "completed" },
  { label: "Under review", description: "We're checking the details.",    icon: ShieldCheck,  status: "completed" },
  { label: "Approved",     description: "Your claim is approved.",        icon: CheckCircle2, status: "active" },
  { label: "Payment sent", description: "Reimbursement is on the way.",   icon: Banknote,     status: "pending" },
];

function ConfirmationStep({
  summaryRows,
}: {
  summaryRows: { label: string; value: string }[];
}) {
  useEffect(() => {
    // Fire a subtle confetti burst from the top of the screen
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.1 },
      colors: ["#0055a5", "#009b89", "#3958c3", "#e11d48"],
      disableForReducedMotion: true,
      zIndex: 100,
    });
  }, []);

  return (
    <div className="flex justify-center pt-10 px-8 pb-10">
      <div className="w-full max-w-[480px] flex flex-col gap-5">
        {/* Success header */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Claim approved</h1>
          </div>
        </div>

        {/* What happens next */}
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-semibold text-foreground mb-5">What happens next</p>
            <div className="flex flex-col gap-0">
              {TIMELINE_EVENTS.map((event, i) => {
                const Icon   = event.icon;
                const isLast = i === TIMELINE_EVENTS.length - 1;
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
                        } ${
                          isPending ? "bg-[var(--neutral-100)] text-[var(--neutral-700)]" : ""
                        }`}
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

        {/* Claim summary */}
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

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            intent="primary"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Clock className="h-4 w-4 text-white" />
            View claim status
          </Button>
        </div>
      </div>
    </div>
  );
}
