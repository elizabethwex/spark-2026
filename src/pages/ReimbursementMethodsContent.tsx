import { useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  RadioGroup,
  RadioGroupItem,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { CreditCard, Landmark, Lock, Pencil, ScrollText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDirectDepositModalBankDisplayFromSession } from "@/lib/profileBankAccountsSession";

type MethodKind = "benefits-card" | "direct-deposit" | "check";

type PrimaryState =
  | { status: "locked"; kind: MethodKind; label: string }
  | { status: "editable"; kind: MethodKind; label: string };

type AlternateState = {
  kind: MethodKind;
  label: string;
};

export type PlanYearReimbursement = {
  id: string;
  dateRangeLabel: string;
  planLines: string[];
  primary: PrimaryState;
  alternate: AlternateState;
};

const METHOD_ICONS: Record<MethodKind, typeof CreditCard> = {
  "benefits-card": CreditCard,
  "direct-deposit": Landmark,
  check: ScrollText,
};

const DIRECT_DEPOSIT_COPY =
  "Your reimbursement will be deposited into your designated bank account within 2 business days from the date we receive substantiation of your claims.";

const CHECK_COPY =
  "Your reimbursement check will be sent to your home within 2-4 business days from the date we receive substantiation of your claims.";

/** Light-blue chip behind payment method icons (Figma: 7px L/R, 3.5px T/B padding). */
function MethodIconChip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[6px] bg-[#dbeafe] pt-[3.5px] pr-[7px] pb-[3.5px] pl-[7px]",
        className
      )}
    >
      {children}
    </span>
  );
}

function MethodRow({
  kind,
  label,
  variant,
}: {
  kind: MethodKind;
  label: string;
  variant: "filled" | "outlined";
}) {
  const Icon = METHOD_ICONS[kind];
  return (
    <div
      className={
        variant === "filled"
          ? "rounded-lg bg-[#f7f7f7] p-4"
          : "rounded-lg border border-[#e4e6e9] bg-white p-4"
      }
    >
      <div className="flex items-center gap-2">
        <div className="flex h-full items-stretch">
          <MethodIconChip>
            <Icon className="h-[14px] w-[14px] shrink-0 text-[#1d2c38]" strokeWidth={2} aria-hidden />
          </MethodIconChip>
        </div>
        <span className="text-sm font-normal leading-6 tracking-[-0.084px] text-[#1d2c38]">
          {label}
        </span>
      </div>
    </div>
  );
}

/** Matches ghost sm Edit control height so Locked badge + Edit rows share one band. */
const CONTROL_LABEL_ROW_CLASS = "flex min-h-[40px] items-center justify-between gap-2";

function PlanYearCard({
  plan,
  onEditReimbursement,
}: {
  plan: PlanYearReimbursement;
  onEditReimbursement: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-lg bg-white p-4 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]">
      {/* Grows so the divider + payment blocks line up across the three columns */}
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <p className="text-base font-semibold leading-6 tracking-[-0.176px] text-[#1d2c38]">
          {plan.dateRangeLabel}
        </p>
        <div className="flex flex-col gap-1 text-[12px] font-normal leading-4 tracking-[0.055px] text-[#515f6b]">
          {plan.planLines.map((line, idx) => (
            <p key={`${plan.id}-plan-${idx}`}>{line}</p>
          ))}
        </div>
      </div>

      <div className="my-4 h-px w-full shrink-0 bg-[#d1d6d8]" />

      <div className="flex shrink-0 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className={CONTROL_LABEL_ROW_CLASS}>
            <span className="text-sm font-normal leading-6 tracking-[-0.084px] text-[#515f6b]">
              Primary Payment Method
            </span>
            {plan.primary.status === "locked" ? (
              <span className="inline-flex shrink-0 items-center gap-[3.5px] rounded-md bg-[#ffecc7] px-[7px] py-[3.5px] text-[12.25px] font-bold leading-none text-[#b37a2b]">
                <Lock className="h-[10.5px] w-[10.5px] shrink-0 text-[#b37a2b]" aria-hidden />
                Locked
              </span>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto shrink-0 gap-[7px] px-[10.5px] py-[7px] text-sm font-medium text-[#0058a3] hover:bg-transparent hover:text-[#0058a3]"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden />
                Edit
              </Button>
            )}
          </div>
          <MethodRow
            kind={plan.primary.kind}
            label={plan.primary.label}
            variant={plan.primary.status === "locked" ? "filled" : "outlined"}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className={CONTROL_LABEL_ROW_CLASS}>
            <span className="text-sm font-normal leading-6 tracking-[-0.084px] text-[#515f6b]">
              Reimbursement Method
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto shrink-0 gap-[7px] px-[10.5px] py-[7px] text-sm font-medium text-[#0058a3] hover:bg-transparent hover:text-[#0058a3]"
              onClick={onEditReimbursement}
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
              Edit
            </Button>
          </div>
          <MethodRow kind={plan.alternate.kind} label={plan.alternate.label} variant="outlined" />
        </div>
      </div>
    </div>
  );
}

type ReimbursementModalChoice = "direct-deposit" | "check";

function kindToModalValue(kind: MethodKind): ReimbursementModalChoice {
  return kind === "check" ? "check" : "direct-deposit";
}

function modalValueToAlternate(
  v: ReimbursementModalChoice
): Pick<AlternateState, "kind" | "label"> {
  if (v === "check") return { kind: "check", label: "Check" };
  return { kind: "direct-deposit", label: "Direct Deposit" };
}

function ReimbursementMethodEditModal({
  plan,
  open,
  onOpenChange,
  onSave,
}: {
  plan: PlanYearReimbursement | null;
  open: boolean;
  onOpenChange: (_open: boolean) => void;
  onSave: (_planId: string, _choice: ReimbursementModalChoice) => void;
}) {
  const navigate = useNavigate();
  const [choice, setChoice] = useState<ReimbursementModalChoice>("direct-deposit");
  const [modalBankDisplay, setModalBankDisplay] = useState(() =>
    getDirectDepositModalBankDisplayFromSession()
  );

  useEffect(() => {
    if (plan) {
      setChoice(kindToModalValue(plan.alternate.kind));
    }
  }, [plan]);

  useEffect(() => {
    if (open) {
      setModalBankDisplay(getDirectDepositModalBankDisplayFromSession());
    }
  }, [open]);

  const handleSave = () => {
    if (!plan) return;
    onSave(plan.id, choice);
    onOpenChange(false);
  };

  const PrimaryMethodIcon = plan ? METHOD_ICONS[plan.primary.kind] : CreditCard;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex max-h-[min(90vh,800px)] w-[448px] flex-col gap-0 overflow-hidden p-0",
          "border border-[#edeff0] shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)]",
          // ben-ui-kit DialogContent: default close lives in div.absolute.right-4.top-4 (see kit); hide it — header has its own X
          "[&>div.absolute.right-4.top-4]:hidden"
        )}
      >
        {plan ? (
          <>
            <div className="flex items-center justify-between p-[17.5px]">
              <DialogTitle className="text-[17.5px] font-semibold leading-normal tracking-[-0.02em] text-[#243746]">
                {plan.dateRangeLabel}
              </DialogTitle>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-[35px] w-[35px] shrink-0 text-foreground"
                  aria-label="Close"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </DialogClose>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto px-[18px] pb-4 pt-4">
              <div>
                <h3 className="text-xl font-semibold leading-8 tracking-[-0.34px] text-[#12181d]">
                  Primary Payment Method
                </h3>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <MethodIconChip>
                      <PrimaryMethodIcon className="h-[14px] w-[14px] text-[#1d2c38]" strokeWidth={2} aria-hidden />
                    </MethodIconChip>
                    <span className="text-sm font-normal leading-6 tracking-[-0.084px] text-[#1d2c38]">
                      {plan.primary.label}
                    </span>
                  </div>
                  {plan.primary.status === "locked" ? (
                    <span className="inline-flex shrink-0 items-center gap-[3.5px] rounded-md bg-[#ffecc7] px-[7px] py-[3.5px] text-[12.25px] font-bold leading-none text-[#b37a2b]">
                      <Lock className="h-[10.5px] w-[10.5px] shrink-0 text-[#b37a2b]" aria-hidden />
                      Locked
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="h-px w-full bg-[#d1d6d8]" />

              <div>
                <h3 className="text-xl font-semibold leading-8 tracking-[-0.34px] text-[#12181d]">
                  Reimbursement Method
                </h3>

                <RadioGroup
                  value={choice}
                  onValueChange={(v) => setChoice(v as ReimbursementModalChoice)}
                  className="mt-4 flex flex-col gap-4"
                >
                  {/* Direct Deposit */}
                  <div
                    role="presentation"
                    className={cn(
                      "flex cursor-pointer gap-2 rounded-lg p-6 shadow-[0px_2px_6px_0px_rgba(2,13,36,0.2),0px_0px_1px_0px_rgba(2,13,36,0.3)]",
                      choice === "direct-deposit"
                        ? "border-2 border-[#3958c3] bg-white"
                        : "border border-[#edeff0] bg-white"
                    )}
                    onClick={() => setChoice("direct-deposit")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setChoice("direct-deposit");
                      }
                    }}
                  >
                    <div className="flex shrink-0 items-start pt-1">
                      <Landmark className="h-4 w-4 text-[#1d2c38]" aria-hidden />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                      <div className="flex gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-bold leading-6 tracking-[-0.176px] text-[#243746]">
                            Direct Deposit
                          </p>
                          <p className="mt-0.5 text-[13px] font-normal leading-[18px] tracking-[0.055px] text-[#243746]">
                            {DIRECT_DEPOSIT_COPY}
                          </p>
                        </div>
                        <RadioGroupItem
                          value="direct-deposit"
                          id={`rm-dd-${plan.id}`}
                          className="mt-0.5 shrink-0"
                          aria-label="Direct Deposit"
                        />
                      </div>
                      {choice === "direct-deposit" ? (
                        <div className="text-sm leading-6 tracking-[-0.084px] text-[#7c858e]">
                          <p className="font-bold text-[#7c858e]">{modalBankDisplay.bankName}</p>
                          <p className="font-normal">{modalBankDisplay.accountLine}</p>
                        </div>
                      ) : null}
                      <div>
                        <button
                          type="button"
                          className="text-left text-sm font-semibold leading-6 tracking-[-0.084px] text-[#1c6eff] underline-offset-2 hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onOpenChange(false);
                            navigate("/my-profile?subPage=banking");
                          }}
                        >
                          Update Bank Account
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Check */}
                  <div
                    role="presentation"
                    className={cn(
                      "flex cursor-pointer gap-2 rounded-lg p-6 shadow-[0px_2px_6px_0px_rgba(2,13,36,0.2),0px_0px_1px_0px_rgba(2,13,36,0.3)]",
                      choice === "check"
                        ? "border-2 border-[#3958c3] bg-white"
                        : "border border-[#edeff0] bg-white"
                    )}
                    onClick={() => setChoice("check")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setChoice("check");
                      }
                    }}
                  >
                    <div className="flex shrink-0 items-start pt-1">
                      <ScrollText className="h-4 w-4 text-[#1d2c38]" aria-hidden />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                      <div className="flex gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-bold leading-6 tracking-[-0.176px] text-[#243746]">
                            Check
                          </p>
                          <p className="mt-0.5 text-[13px] font-normal leading-[18px] tracking-[0.055px] text-[#243746]">
                            {CHECK_COPY}
                          </p>
                        </div>
                        <RadioGroupItem
                          value="check"
                          id={`rm-chk-${plan.id}`}
                          className="mt-0.5 shrink-0"
                          aria-label="Check"
                        />
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex justify-end gap-[7px] px-[17.5px] pb-[17.5px] pt-3">
              <DialogClose asChild>
                <Button type="button" variant="ghost" className="text-primary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="button" intent="primary" onClick={handleSave}>
                Save
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

const DEFAULT_PLAN_YEARS: PlanYearReimbursement[] = [
  {
    id: "2026",
    dateRangeLabel: "01/01/2026 - 12/31/2026",
    planLines: ["Dependent Care FSA 01/01/2026", "Lifestyle Spending Account 01/01/2026"],
    primary: { status: "locked", kind: "benefits-card", label: "WEX Benefits Card" },
    alternate: { kind: "direct-deposit", label: "Direct Deposit" },
  },
  {
    id: "2025",
    dateRangeLabel: "01/01/2025 - 12/31/2025",
    planLines: ["Dependent Care FSA 01/01/2025", "Lifestyle Spending Account 01/01/2025"],
    primary: { status: "locked", kind: "benefits-card", label: "WEX Benefits Card" },
    alternate: { kind: "check", label: "Check" },
  },
  {
    id: "2016",
    dateRangeLabel: "12/01/2016 - No end date",
    planLines: ["Health Savings Account", "—"],
    primary: { status: "locked", kind: "benefits-card", label: "WEX Benefits Card" },
    alternate: { kind: "direct-deposit", label: "Direct Deposit" },
  },
];

export function ReimbursementMethodsContent({
  planYears = DEFAULT_PLAN_YEARS,
}: {
  planYears?: PlanYearReimbursement[];
}) {
  const [rows, setRows] = useState<PlanYearReimbursement[]>(planYears);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  useEffect(() => {
    setRows(planYears);
  }, [planYears]);

  const editingPlan = editingPlanId ? rows.find((p) => p.id === editingPlanId) ?? null : null;

  const handleSaveModal = (planId: string, choice: ReimbursementModalChoice) => {
    const next = modalValueToAlternate(choice);
    setRows((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, alternate: { kind: next.kind, label: next.label } } : p))
    );
  };

  return (
    <>
      <div className="border-b border-[#d1d6d8] px-4 py-4 md:px-6">
        <h2 className="text-2xl font-semibold leading-8 tracking-[-0.456px] text-[#243746]">
          Reimbursement Methods
        </h2>
      </div>

      <div className="flex flex-col gap-6 px-4 pb-6 pt-6 md:px-6">
        <p className="text-[17px] font-normal leading-6 tracking-[-0.221px] text-[#243746]">
          Certain plan years have a fixed primary payment method that cannot be modified.
        </p>

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {rows.map((plan) => (
            <PlanYearCard
              key={plan.id}
              plan={plan}
              onEditReimbursement={() => setEditingPlanId(plan.id)}
            />
          ))}
        </div>
      </div>

      <ReimbursementMethodEditModal
        plan={editingPlan}
        open={editingPlan !== null}
        onOpenChange={(o) => {
          if (!o) setEditingPlanId(null);
        }}
        onSave={handleSaveModal}
      />
    </>
  );
}
