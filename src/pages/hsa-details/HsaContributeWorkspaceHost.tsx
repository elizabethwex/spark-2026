import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  FloatLabel,
  FloatLabelSelect,
  Label,
  RadioGroup,
  RadioGroupItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Workspace,
} from "@wexinc-healthbenefits/ben-ui-kit";
import type { Step } from "@wexinc-healthbenefits/ben-ui-kit";
import {
  ArrowRight,
  Building2,
  Check,
  CreditCard,
  Eye,
  EyeOff,
  Info,
  PiggyBank,
  Plus,
  X,
} from "lucide-react";
import { HSA_2026_CONTRIBUTION_MOCK } from "@/data/hsaSharedContributions";
import { sparkHsaSummary } from "@/data/sparkAiForwardMock";
import { WEX_PROFILE_BANK_ACCOUNTS_KEY, migrateLegacyEllaBankLabel } from "@/lib/profileBankAccountsSession";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export type ContributeBankAccount = {
  id: string;
  routingNumber: string;
  accountNumber: string;
  confirmAccountNumber: string;
  accountNickname: string;
  /** Matches My Profile bank list (e.g. Wells Fargo Bank). */
  bankName?: string;
  accountType: "checking" | "saving";
  verificationMethod?: "text" | "email";
  selectedDirectDepositOptions?: string[];
  activationStatus?: "pending_deposit" | "active";
};

function normalizeStoredRowToContribute(raw: unknown): ContributeBankAccount | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const id = typeof r.id === "string" ? r.id : "";
  if (!id) return null;
  const nicknameRaw = typeof r.accountNickname === "string" ? r.accountNickname : "";
  const accountNickname = migrateLegacyEllaBankLabel(nicknameRaw) ?? nicknameRaw;
  const bankNameRaw = typeof r.bankName === "string" ? r.bankName.trim() : "";
  const bankNameResolved = bankNameRaw
    ? migrateLegacyEllaBankLabel(bankNameRaw) ?? bankNameRaw
    : undefined;
  return {
    id,
    routingNumber: String(r.routingNumber ?? ""),
    accountNumber: String(r.accountNumber ?? ""),
    confirmAccountNumber: String(r.confirmAccountNumber ?? r.accountNumber ?? ""),
    accountNickname,
    ...(bankNameResolved ? { bankName: bankNameResolved } : {}),
    accountType: r.accountType === "saving" ? "saving" : "checking",
    verificationMethod: r.verificationMethod === "email" ? "email" : "text",
    selectedDirectDepositOptions: Array.isArray(r.selectedDirectDepositOptions)
      ? (r.selectedDirectDepositOptions as string[])
      : [],
    activationStatus: r.activationStatus === "pending_deposit" ? "pending_deposit" : "active",
  };
}

function loadBankAccountsForContribute(): ContributeBankAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = sessionStorage.getItem(WEX_PROFILE_BANK_ACCOUNTS_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeStoredRowToContribute)
      .filter((b): b is ContributeBankAccount => b !== null);
  } catch {
    return [];
  }
}

function saveUserBankAccountsOnly(accounts: ContributeBankAccount[]): void {
  if (typeof window === "undefined") return;
  try {
    let previous: unknown[] = [];
    try {
      const raw = sessionStorage.getItem(WEX_PROFILE_BANK_ACCOUNTS_KEY);
      if (raw) {
        const p: unknown = JSON.parse(raw);
        if (Array.isArray(p)) previous = p;
      }
    } catch {
      /* ignore */
    }
    const prevById = new Map<string, Record<string, unknown>>(
      previous
        .filter((o): o is Record<string, unknown> => !!o && typeof o === "object")
        .filter((o) => typeof o.id === "string")
        .map((o) => [o.id as string, o])
    );
    const merged = accounts.map((acc) => {
      const old = prevById.get(acc.id);
      return old ? ({ ...old, ...acc } as ContributeBankAccount) : acc;
    });
    sessionStorage.setItem(WEX_PROFILE_BANK_ACCOUNTS_KEY, JSON.stringify(merged));
  } catch (e) {
    console.warn("Failed to save bank accounts:", e);
  }
}

function accountLast4(accountNumber: string): string {
  const digits = accountNumber.replace(/\D/g, "");
  return digits.length >= 4 ? digits.slice(-4) : digits || "—";
}

/** Same rules as My Profile → Banking bank cards. */
function profileBankDisplayTitle(bank: ContributeBankAccount): string {
  const nick = bank.accountNickname?.trim() ?? "";
  if (nick) return nick;
  const bn = bank.bankName?.trim() ?? "";
  if (bn) return bn;
  const word = bank.accountType === "checking" ? "Checking" : "Saving";
  return `${word} Account`;
}

/** Same as My Profile `accountTypeLine` (e.g. "Checking Account | Wells Fargo Bank"). */
function profileBankAccountTypeLine(bank: ContributeBankAccount): string {
  const accountTypeWord = bank.accountType === "checking" ? "Checking" : "Saving";
  const bankNameForTypeLine = bank.bankName?.trim() ?? "";
  return bankNameForTypeLine
    ? `${accountTypeWord} Account | ${bankNameForTypeLine}`
    : `${accountTypeWord} Account`;
}

type ContributeStep = "payment" | "contribution" | "review" | "success";

const FLOW_STEPS: Step[] = [
  { id: "payment", label: "Payment Details" },
  { id: "contribution", label: "Contribution Details" },
  { id: "review", label: "Review" },
];

function CustomStepper({ steps, currentStepId }: { steps: Step[]; currentStepId: string }) {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);

  return (
    <div className="flex h-full w-full flex-col gap-[24px] overflow-y-auto overflow-x-hidden bg-[var(--neutral-50)] p-6">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="relative flex min-w-0 w-full flex-col items-start gap-[16px]">
            <div className="relative z-10 flex min-w-0 w-full items-center gap-[12px]">
              <div
                className={cn(
                  "flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full text-[14px]",
                  isActive && "border border-[#0058a3] bg-transparent font-semibold text-[#0058a3]",
                  isCompleted && "border border-[#009b89] bg-transparent font-semibold text-[#009b89]",
                  !isActive && !isCompleted && "bg-[#e4e6e9] font-medium text-[#7c858e]"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" strokeWidth={2} /> : index + 1}
              </div>
              <span
                className={cn(
                  "min-w-0 flex-1 break-words text-[14px] leading-snug tracking-[-0.084px]",
                  isActive ? "font-semibold text-[#243746]" : "font-medium text-[#7c858e]"
                )}
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

type AddBankFormState = {
  verificationMethod: "text" | "email" | "";
  verificationCode: string;
  routingNumber: string;
  accountNumber: string;
  confirmAccountNumber: string;
  accountNickname: string;
  accountType: "checking" | "saving";
};

const emptyAddBankForm = (): AddBankFormState => ({
  verificationMethod: "",
  verificationCode: "",
  routingNumber: "",
  accountNumber: "",
  confirmAccountNumber: "",
  accountNickname: "",
  accountType: "checking",
});

type AddBankPhase = "method" | "code" | "bank";

function AddBankDialog({
  open,
  onOpenChange,
  onBankAdded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBankAdded: (bank: ContributeBankAccount) => void;
}) {
  const [phase, setPhase] = useState<AddBankPhase>("method");
  const [showCodePlain, setShowCodePlain] = useState(false);
  const [form, setForm] = useState<AddBankFormState>(emptyAddBankForm);

  useEffect(() => {
    if (open) {
      setPhase("method");
      setShowCodePlain(false);
      setForm(emptyAddBankForm());
    }
  }, [open]);

  const resetAndClose = () => {
    setPhase("method");
    setShowCodePlain(false);
    setForm(emptyAddBankForm());
    onOpenChange(false);
  };

  const narrowDialog =
    "w-full max-w-[400px] gap-0 rounded-xl border-border bg-background p-0 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] [&>div:last-child]:hidden";
  const wideDialog =
    "w-[800px] max-w-[calc(100vw-2rem)] gap-0 p-0 [&>div:last-child]:hidden";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetAndClose();
      }}
    >
      <DialogContent className={phase === "bank" ? wideDialog : narrowDialog}>
        {phase === "method" && (
          <div className="flex flex-col overflow-hidden rounded-xl">
            <div className="flex items-center justify-between px-6 pb-4 pt-6">
              <DialogTitle className="m-0 text-[17.5px] font-semibold leading-normal tracking-tight text-foreground">
                Authentication
              </DialogTitle>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 border-0 bg-transparent shadow-none hover:bg-muted"
                  aria-label="Close"
                  type="button"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DialogClose>
            </div>
            <div className="flex flex-col gap-6 px-6 pb-2 pt-0">
              <p className="text-[17px] font-normal leading-6 tracking-[-0.221px] text-foreground">
                Your protection is important to us. We need to take some extra steps to verify your identity.
                Choose how you&apos;d like to receive a verification code.
              </p>
              <RadioGroup
                value={form.verificationMethod || undefined}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, verificationMethod: value as "text" | "email" }))
                }
                className="flex flex-col gap-4"
              >
                <label htmlFor="hsa-bank-verify-text" className="flex cursor-pointer items-center gap-[7px] rounded-[11px]">
                  <RadioGroupItem value="text" id="hsa-bank-verify-text" />
                  <span className="text-sm text-foreground">
                    <span className="font-bold">Text Message</span>
                    <span className="font-normal">{` at (***) ***-1111`}</span>
                  </span>
                </label>
                <label htmlFor="hsa-bank-verify-email" className="flex cursor-pointer items-center gap-[7px] rounded-[11px]">
                  <RadioGroupItem value="email" id="hsa-bank-verify-email" />
                  <span className="text-sm text-foreground">
                    <span className="font-bold">Email</span>
                    <span className="font-normal">{` at my***m**@******.com`}</span>
                  </span>
                </label>
              </RadioGroup>
            </div>
            <div className="flex w-full items-center justify-end gap-[7px] px-6 pb-6 pt-4">
              <Button variant="ghost" className="h-9 px-3 text-foreground hover:bg-muted" type="button" onClick={resetAndClose}>
                Cancel
              </Button>
              <Button
                intent="primary"
                className="h-9 rounded-md px-5"
                type="button"
                disabled={!form.verificationMethod}
                onClick={() => {
                  setShowCodePlain(false);
                  setPhase("code");
                }}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {phase === "code" && (
          <div className="flex flex-col overflow-hidden rounded-xl">
            <div className="flex items-center justify-between px-6 pb-4 pt-6">
              <DialogTitle className="m-0 text-[17.5px] font-semibold leading-normal tracking-tight text-foreground">
                Authentication
              </DialogTitle>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 border-0 bg-transparent shadow-none hover:bg-muted"
                  aria-label="Close"
                  type="button"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DialogClose>
            </div>
            <div className="flex flex-col gap-6 px-6 pb-2 pt-0">
              <p className="text-[17px] font-normal leading-6 tracking-[-0.221px] text-[#243746]">
                We sent a 6-digit verification code to{" "}
                {form.verificationMethod === "text" ? "(***) ***-1111" : "my***m**@******.com"}.
              </p>
              <div className="flex flex-col gap-3">
                <div className="[&_input]:rounded-lg [&_input]:border [&_input]:border-[#cdd6dd] [&_input]:bg-background [&_input]:shadow-none [&_input]:transition-colors [&_input]:focus-visible:border-primary [&_input]:focus-visible:ring-1 [&_input]:focus-visible:ring-primary/30">
                  <FloatLabel
                    label="Verification Code"
                    size="lg"
                    type={showCodePlain ? "text" : "password"}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={form.verificationCode}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setForm((prev) => ({ ...prev, verificationCode: digits }));
                    }}
                    maxLength={6}
                    invalid={form.verificationCode.length > 0 && form.verificationCode.length < 6}
                    className="text-base tracking-[0.2em]"
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowCodePlain((v) => !v)}
                        className="cursor-pointer text-[#5c6b78] transition-colors hover:text-foreground"
                        aria-label={showCodePlain ? "Hide verification code" : "Show verification code"}
                      >
                        {showCodePlain ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex w-full items-center justify-end gap-[7px] px-6 pb-6 pt-8">
              <Button
                variant="ghost"
                className="h-9 px-3 text-foreground hover:bg-muted"
                type="button"
                onClick={() => {
                  setForm((prev) => ({ ...prev, verificationCode: "" }));
                  setPhase("method");
                }}
              >
                Back
              </Button>
              <Button variant="ghost" className="h-9 px-3 text-foreground hover:bg-muted" type="button" onClick={resetAndClose}>
                Cancel
              </Button>
              <Button
                intent="primary"
                className="h-9 rounded-md px-5"
                type="button"
                disabled={!/^\d{6}$/.test(form.verificationCode)}
                onClick={() => {
                  setShowCodePlain(false);
                  setPhase("bank");
                }}
              >
                Verify
              </Button>
            </div>
          </div>
        )}

        {phase === "bank" && (
          <div className="flex max-h-[min(90vh,840px)] flex-col overflow-y-auto rounded-xl bg-background">
            <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
              <DialogTitle className="m-0 text-lg font-semibold text-foreground">Add Bank Account</DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" aria-label="Close" type="button">
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DialogClose>
            </div>
            <div className="space-y-4 p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Bank Information</h3>
              <div className="relative">
                <FloatLabel
                  label="Routing Number"
                  value={form.routingNumber}
                  onChange={(e) => setForm((prev) => ({ ...prev, routingNumber: e.target.value }))}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" aria-label="Help">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <FloatLabel
                label="Account Number"
                value={form.accountNumber}
                onChange={(e) => setForm((prev) => ({ ...prev, accountNumber: e.target.value }))}
              />
              <FloatLabel
                label="Confirm Account Number"
                value={form.confirmAccountNumber}
                onChange={(e) => setForm((prev) => ({ ...prev, confirmAccountNumber: e.target.value }))}
              />
              <div className="relative">
                <FloatLabel
                  label="Account Nickname"
                  value={form.accountNickname}
                  onChange={(e) => setForm((prev) => ({ ...prev, accountNickname: e.target.value }))}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Account nickname help"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-left">A name to help you identify this account.</TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-foreground">Account Type:</Label>
                <RadioGroup
                  value={form.accountType}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, accountType: value as "checking" | "saving" }))
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="checking" id="hsa-account-checking" />
                    <Label htmlFor="hsa-account-checking" className="cursor-pointer">
                      Checking
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="saving" id="hsa-account-saving" />
                    <Label htmlFor="hsa-account-saving" className="cursor-pointer">
                      Saving
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
              <Button variant="outline" type="button" onClick={() => setPhase("code")}>
                Back
              </Button>
              <Button
                intent="primary"
                type="button"
                disabled={
                  !form.routingNumber.trim() ||
                  !form.accountNumber.trim() ||
                  form.accountNumber !== form.confirmAccountNumber ||
                  !form.accountNickname.trim()
                }
                onClick={() => {
                  const newBank: ContributeBankAccount = {
                    id: `hsa-bank-${Date.now()}`,
                    routingNumber: form.routingNumber.trim(),
                    accountNumber: form.accountNumber.trim(),
                    confirmAccountNumber: form.confirmAccountNumber.trim(),
                    accountNickname: form.accountNickname.trim(),
                    accountType: form.accountType,
                    verificationMethod: form.verificationMethod || "text",
                    selectedDirectDepositOptions: [],
                    activationStatus: "active",
                  };
                  onBankAdded(newBank);
                  resetAndClose();
                }}
              >
                Save account
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PaymentDetailsStep({
  bankAccounts,
  selectedBankId,
  onSelectBank,
  onAddBankClick,
}: {
  bankAccounts: ContributeBankAccount[];
  selectedBankId: string | null;
  onSelectBank: (id: string) => void;
  onAddBankClick: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Payment Details</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a bank account for your contribution. Withdrawals typically take 2–3 business days to process.
        </p>
      </div>

      <RadioGroup
        value={selectedBankId ?? undefined}
        onValueChange={(v) => onSelectBank(v)}
        className="flex flex-col gap-3"
      >
        {bankAccounts.map((bank) => {
          const selected = selectedBankId === bank.id;
          return (
            <label
              key={bank.id}
              htmlFor={`hsa-bank-${bank.id}`}
              className={cn(
                "relative flex cursor-pointer flex-col gap-1 rounded-xl border bg-card p-4 shadow-sm transition-colors",
                selected ? "border-primary ring-1 ring-primary" : "border-border hover:border-muted-foreground/30"
              )}
            >
              <div className="absolute right-4 top-4">
                <RadioGroupItem value={bank.id} id={`hsa-bank-${bank.id}`} className="border-muted-foreground" />
              </div>
              <span className="pr-10 text-base font-semibold text-foreground">
                {profileBankDisplayTitle(bank)}
              </span>
              <span className="text-sm text-muted-foreground">{profileBankAccountTypeLine(bank)}</span>
              <span className="text-sm text-muted-foreground">•••• {accountLast4(bank.accountNumber)}</span>
            </label>
          );
        })}
      </RadioGroup>

      <Button
        type="button"
        intent="primary"
        variant="outline"
        className="w-full rounded-xl border-primary text-primary"
        onClick={onAddBankClick}
      >
        <Plus className="mr-2 h-4 w-4 shrink-0" aria-hidden />
        Add Bank Account
      </Button>
    </div>
  );
}

function parseContributeAmountUsd(amount: string): number {
  const n = Number.parseFloat(amount.replace(/[$,\s]/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

const fmtUsd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

function stripUsdMask(amount: string): string {
  return amount.replace(/[$,\s]/g, "");
}

/** Digits and at most one decimal with up to 2 fractional digits (for controlled typing). */
function sanitizeUsdTyping(raw: string): string {
  let s = raw.replace(/[^\d.]/g, "");
  if (s === "") return "";
  const firstDot = s.indexOf(".");
  if (firstDot === -1) return s;
  const intPart = s.slice(0, firstDot);
  const afterFirst = s.slice(firstDot + 1).replace(/\./g, "");
  const frac = afterFirst.slice(0, 2);
  const intDisplay = intPart === "" ? "0" : intPart;
  if (frac.length > 0) return `${intDisplay}.${frac}`;
  if (s.endsWith(".")) return `${intDisplay}.`;
  return intPart === "" ? "0" : intPart;
}

function formatUsdOnBlur(raw: string): string {
  const trimmed = raw.replace(/[$,\s]/g, "").trim();
  if (trimmed === "" || trimmed === ".") return "";
  const n = Number.parseFloat(trimmed);
  if (!Number.isFinite(n) || n < 0) return "";
  return fmtUsd(n);
}

function ContributionDetailsStep({
  amount,
  onAmountChange,
  frequency,
  onFrequencyChange,
  notes,
  onNotesChange,
}: {
  amount: string;
  onAmountChange: (v: string) => void;
  frequency: string;
  onFrequencyChange: (v: string) => void;
  notes: string;
  onNotesChange: (v: string) => void;
}) {
  const mock = HSA_2026_CONTRIBUTION_MOCK;
  const totalYtd = mock.yourContrib + mock.employerContrib;
  const thisContribution = parseContributeAmountUsd(amount);
  const availableAfter = Math.max(0, mock.leftToContribute - thisContribution);
  const limit = mock.contributionLimit;
  const rawYtdBarPct = (totalYtd / limit) * 100;
  const rawThisBarPct = (thisContribution / limit) * 100;
  const sumBarPct = rawYtdBarPct + rawThisBarPct;
  /** Stacked bar: primary = YTD, teal = this contribution; scale if sum exceeds 100%. */
  const ytdBarPct = sumBarPct > 100 ? (rawYtdBarPct / sumBarPct) * 100 : rawYtdBarPct;
  const thisBarPct = sumBarPct > 100 ? (rawThisBarPct / sumBarPct) * 100 : rawThisBarPct;
  const pctTowardLimit = Math.min(100, sumBarPct);
  const maxContribFmt = mock.contributionLimit.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return (
    <div className="w-full max-w-full">
      <h2 className="mx-auto w-full max-w-[400px] text-2xl font-semibold text-foreground">
        Contribution Details
      </h2>

      <div className="mt-6 flex w-full max-w-full flex-col gap-4 lg:mt-6 lg:flex-row lg:items-start lg:gap-x-4 lg:ps-[max(1.5rem,calc(50%-200px))]">
        <div className="flex min-w-0 w-full max-w-[400px] shrink-0 flex-col gap-6 lg:w-[400px]">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">HSA balance</p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Available cash</dt>
              <dd className="font-medium text-foreground">{sparkHsaSummary.cashBalance}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Invested assets</dt>
              <dd className="font-medium text-foreground">{sparkHsaSummary.investedAssets}</dd>
            </div>
            <div className="my-2 border-t border-border" />
            <div className="flex justify-between gap-4">
              <dt className="font-semibold text-foreground">Total available balance</dt>
              <dd className="font-semibold text-foreground">{sparkHsaSummary.totalValue}</dd>
            </div>
          </dl>
          </div>

          <div className="flex flex-col gap-4">
          <FloatLabelSelect value={frequency || undefined} onValueChange={onFrequencyChange}>
            <FloatLabelSelect.Trigger label="Frequency" size="md">
              <FloatLabelSelect.Value placeholder=" " />
            </FloatLabelSelect.Trigger>
            <FloatLabelSelect.Content>
              <FloatLabelSelect.Item value="one-time">One-time</FloatLabelSelect.Item>
              <FloatLabelSelect.Item value="schedule">Schedule</FloatLabelSelect.Item>
            </FloatLabelSelect.Content>
          </FloatLabelSelect>

          <FloatLabel
            label="Tax Year"
            value={mock.planYear}
            readOnly
            disabled
            className="opacity-100 [&_input]:cursor-not-allowed"
          />

          <FloatLabel
            label="Amount"
            value={amount}
            inputMode="decimal"
            onFocus={() => onAmountChange(stripUsdMask(amount))}
            onChange={(e) => onAmountChange(sanitizeUsdTyping(e.target.value))}
            onBlur={() => onAmountChange(formatUsdOnBlur(amount))}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="hsa-contrib-notes" className="text-sm font-medium text-foreground">
              Notes
            </Label>
            <textarea
              id="hsa-contrib-notes"
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={4}
              className="min-h-[100px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Optional notes"
            />
          </div>
          </div>
        </div>

        <aside className="w-full max-w-[280px] shrink-0 rounded-xl border border-border bg-card p-5 shadow-sm lg:w-[280px] lg:max-w-none">
        <h3 className="text-sm font-semibold text-foreground">
          {mock.planYear} Contributions
        </h3>
        <div
          className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={Math.round(pctTowardLimit)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Contribution progress toward IRS limit: YTD and this contribution"
        >
          <div
            className="h-full shrink-0 bg-primary transition-[width] duration-200"
            style={{ width: `${ytdBarPct}%` }}
            title={`Total contributions toward limit: ${fmtUsd(totalYtd)}`}
          />
          <div
            className="h-full shrink-0 bg-[#009b89] transition-[width] duration-200"
            style={{ width: `${thisBarPct}%` }}
            title={`This contribution: ${fmtUsd(thisContribution)}`}
          />
        </div>
        <ul className="mt-4 flex flex-col gap-3 text-sm">
          <li className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
              Total contributions
            </span>
            <span className="font-medium text-foreground">{fmtUsd(totalYtd)}</span>
          </li>
          <li className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#009b89]" aria-hidden />
              This contribution
            </span>
            <span className="font-semibold text-foreground">{fmtUsd(thisContribution)}</span>
          </li>
          <li className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 shrink-0 rounded-full bg-muted-foreground/40" aria-hidden />
              Available to contribute
            </span>
            <span className="font-semibold text-foreground">{fmtUsd(availableAfter)}</span>
          </li>
        </ul>
        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
          IRS Contribution Limits ({mock.planYear}): Max contribution: {maxContribFmt}
        </div>
        </aside>
      </div>
    </div>
  );
}

function frequencyReviewLabel(value: string): string {
  if (value === "one-time") return "One-Time";
  if (value === "schedule") return "Schedule";
  return "—";
}

function ReviewStep({
  bank,
  amount,
  frequency,
  taxYear,
  certified,
  onCertifiedChange,
  onEditContribution,
}: {
  bank: ContributeBankAccount | null;
  amount: string;
  frequency: string;
  taxYear: string;
  certified: boolean;
  onCertifiedChange: (next: boolean) => void;
  onEditContribution: () => void;
}) {
  if (!bank) return null;

  const amountDisplay =
    amount.trim() === "" ? "—" : fmtUsd(parseContributeAmountUsd(amount));
  const certifyId = "hsa-contribute-review-certify";

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Review and Submit</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Please verify the following information is correct.
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Building2 className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">{profileBankDisplayTitle(bank)}</p>
            <p className="text-sm text-muted-foreground">{profileBankAccountTypeLine(bank)}</p>
            <p className="text-sm text-muted-foreground">•••• {accountLast4(bank.accountNumber)}</p>
          </div>
        </div>

        <div
          className="flex shrink-0 justify-center text-muted-foreground sm:px-1"
          aria-hidden
        >
          <ArrowRight className="h-6 w-6 rotate-90 sm:rotate-0" strokeWidth={2} />
        </div>

        <div className="flex flex-1 gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PiggyBank className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">HSA</p>
            <p className="text-sm text-muted-foreground">Health Savings Account</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <span className="text-base font-semibold text-foreground">Contribution Details</span>
          <Button
            type="button"
            variant="ghost"
            className="h-auto shrink-0 px-2 py-1 text-sm font-semibold text-primary hover:bg-transparent hover:text-primary/90"
            onClick={onEditContribution}
          >
            Edit
          </Button>
        </div>
        <dl className="divide-y divide-border text-sm">
          <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5">
            <dt className="text-muted-foreground">Frequency</dt>
            <dd className="font-medium text-foreground">{frequencyReviewLabel(frequency)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5">
            <dt className="text-muted-foreground">Tax Year</dt>
            <dd className="font-medium text-foreground">{taxYear}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5">
            <dt className="text-muted-foreground">Amount</dt>
            <dd className="font-semibold text-foreground">{amountDisplay}</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-foreground">Submit Contributions</h3>
        <div className="flex gap-3">
          <Checkbox
            id={certifyId}
            checked={certified}
            onCheckedChange={(c) => onCertifiedChange(c === true)}
            className="mt-0.5 shrink-0"
            aria-describedby={`${certifyId}-description`}
          />
          <Label
            id={`${certifyId}-description`}
            htmlFor={certifyId}
            className="cursor-pointer text-sm font-normal leading-relaxed text-muted-foreground"
          >
            I certify that the information above is correct, that I am eligible to contribute to this HSA, and
            that I understand I am responsible for ensuring contributions comply with IRS limits and eligibility
            rules. I acknowledge that my employer and plan administrator do not determine my personal eligibility or
            maximum contribution amounts.
          </Label>
        </div>
      </div>
    </div>
  );
}

function ContributionSuccessStep({
  onGoHome,
  onAddAnother,
}: {
  onGoHome: () => void;
  onAddAnother: () => void;
}) {
  const timeline = [
    {
      key: "submitted",
      title: "Submitted",
      date: "Apr 13, 2026",
      sub: "We received your request.",
      variant: "done" as const,
    },
    {
      key: "process",
      title: "In Process",
      date: "Apr 15, 2026",
      sub: "Finalizing details with your bank",
      variant: "current" as const,
      badge: "Now",
    },
    {
      key: "completed",
      title: "Completed",
      date: "Apr 16, 2026",
      sub: "Transaction complete",
      variant: "upcoming" as const,
    },
  ];

  return (
    <div
      id="hsa-contribute-success"
      className="mx-auto flex w-full max-w-[400px] flex-col items-center px-2 pb-4 pt-2 sm:px-0"
    >
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#009b89] text-white shadow-sm"
        aria-hidden
      >
        <Check className="h-9 w-9" strokeWidth={2.5} />
      </div>
      <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-foreground">
        Contribution Submitted Successfully!
      </h2>

      <div className="mt-8 w-full rounded-xl border border-border bg-card p-5 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">What Happens Next</p>
        <div className="mt-5">
          {timeline.map((item, index) => (
            <div key={item.key} className="flex gap-4">
              <div className="flex w-10 shrink-0 flex-col items-center">
                {item.variant === "done" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#009b89] text-white">
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                )}
                {item.variant === "current" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8f2fa] text-[#0058a3]">
                    <Building2 className="h-4 w-4" strokeWidth={2} />
                  </div>
                )}
                {item.variant === "upcoming" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <CreditCard className="h-4 w-4" strokeWidth={2} />
                  </div>
                )}
                {index < timeline.length - 1 ? (
                  <div className="mt-1 min-h-[28px] w-px flex-1 bg-border" aria-hidden />
                ) : null}
              </div>
              <div className={cn("min-w-0 flex-1", index < timeline.length - 1 ? "pb-6" : "")}>
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground">{item.title}</span>
                    {"badge" in item && item.badge ? (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold leading-none text-primary-foreground">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  <span className="shrink-0 text-sm text-muted-foreground">{item.date}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button intent="primary" type="button" className="w-full min-w-[140px] sm:w-auto" onClick={onGoHome}>
          Go Home
        </Button>
        <Button
          intent="primary"
          variant="outline"
          type="button"
          className="w-full min-w-[160px] border-primary text-primary sm:w-auto"
          onClick={onAddAnother}
        >
          <Plus className="mr-2 h-4 w-4 shrink-0" aria-hidden />
          Add Another
        </Button>
      </div>
      <button
        type="button"
        className="mt-4 text-sm font-medium text-primary underline-offset-4 hover:underline"
        onClick={() => window.print()}
      >
        Print Confirmation
      </button>
    </div>
  );
}

export function HsaContributeWorkspaceHost({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<ContributeStep>("payment");
  const [bankAccounts, setBankAccounts] = useState<ContributeBankAccount[]>(() => loadBankAccountsForContribute());
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState("");
  const [contributionFrequency, setContributionFrequency] = useState("");
  const [contributionNotes, setContributionNotes] = useState("");
  const [addBankOpen, setAddBankOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [reviewCertified, setReviewCertified] = useState(false);

  const selectedBank = useMemo(
    () => bankAccounts.find((b) => b.id === selectedBankId) ?? null,
    [bankAccounts, selectedBankId]
  );

  useEffect(() => {
    if (step !== "review") setReviewCertified(false);
  }, [step]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (step === "payment" || step === "success") {
        onClose();
      } else {
        setCancelDialogOpen(true);
      }
    }
  };

  const restartContributionFlow = () => {
    setStep("payment");
    setContributionAmount("");
    setContributionFrequency("");
    setContributionNotes("");
    setSelectedBankId(null);
    setReviewCertified(false);
  };

  const stepperContent =
    step === "success" ? undefined : <CustomStepper steps={FLOW_STEPS} currentStepId={step} />;

  let primaryBtn: ReactNode = null;
  let secondaryBtn: ReactNode = null;
  const tertiaryBtn =
    step === "success" ? null : (
      <Button
        variant="ghost"
        type="button"
        className="px-4 py-2"
        data-workspace-footer-cancel
        onClick={() => handleOpenChange(false)}
      >
        Cancel
      </Button>
    );

  if (step === "payment") {
    primaryBtn = (
      <Button
        intent="primary"
        type="button"
        className="px-4 py-2"
        disabled={selectedBankId === null}
        onClick={() => setStep("contribution")}
      >
        Continue
      </Button>
    );
  } else if (step === "contribution") {
    secondaryBtn = (
      <Button intent="secondary" variant="outline" type="button" className="px-4 py-2" onClick={() => setStep("payment")}>
        Back
      </Button>
    );
    const amt = contributionAmount.replace(/[$,\s]/g, "").trim();
    const canContinue = amt.length > 0 && Number.parseFloat(amt) > 0;
    primaryBtn = (
      <Button
        intent="primary"
        type="button"
        className="px-4 py-2"
        disabled={!canContinue}
        onClick={() => setStep("review")}
      >
        Continue
      </Button>
    );
  } else if (step === "review") {
    secondaryBtn = (
      <Button
        intent="secondary"
        variant="outline"
        type="button"
        className="px-4 py-2"
        onClick={() => setStep("contribution")}
      >
        Back
      </Button>
    );
    primaryBtn = (
      <Button
        intent="primary"
        type="button"
        className="px-4 py-2"
        disabled={!reviewCertified}
        onClick={() => setStep("success")}
      >
        Submit
      </Button>
    );
  }

  const handleBankAdded = (bank: ContributeBankAccount) => {
    setBankAccounts((prev) => {
      const next = [...prev, bank];
      saveUserBankAccountsOnly(next);
      return next;
    });
    setSelectedBankId(bank.id);
  };

  return (
    <>
      <Workspace
        open
        onOpenChange={handleOpenChange}
        title="Contribute to HSA"
        stepperContent={stepperContent}
        showFooter={step !== "success"}
        primaryButton={primaryBtn}
        secondaryButton={secondaryBtn}
        tertiaryButton={tertiaryBtn}
      >
        <div
          className={cn(
            "mx-auto flex w-full flex-col py-6 sm:py-8",
            step === "payment" && "max-w-[400px]",
            step === "review" && "max-w-[400px]",
            step === "success" && "max-w-[480px]"
          )}
        >
          {step === "payment" && (
            <PaymentDetailsStep
              bankAccounts={bankAccounts}
              selectedBankId={selectedBankId}
              onSelectBank={setSelectedBankId}
              onAddBankClick={() => setAddBankOpen(true)}
            />
          )}
          {step === "contribution" && (
            <ContributionDetailsStep
              amount={contributionAmount}
              onAmountChange={setContributionAmount}
              frequency={contributionFrequency}
              onFrequencyChange={setContributionFrequency}
              notes={contributionNotes}
              onNotesChange={setContributionNotes}
            />
          )}
          {step === "review" && (
            <ReviewStep
              bank={selectedBank}
              amount={contributionAmount}
              frequency={contributionFrequency}
              taxYear={HSA_2026_CONTRIBUTION_MOCK.planYear}
              certified={reviewCertified}
              onCertifiedChange={setReviewCertified}
              onEditContribution={() => setStep("contribution")}
            />
          )}
          {step === "success" && (
            <ContributionSuccessStep
              onGoHome={() => {
                onClose();
                navigate("/hsa-details");
              }}
              onAddAnother={() => {
                restartContributionFlow();
              }}
            />
          )}
        </div>
      </Workspace>

      <AddBankDialog open={addBankOpen} onOpenChange={setAddBankOpen} onBankAdded={handleBankAdded} />

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent className="w-[448px] p-0">
          <div className="flex items-center justify-between p-[17.5px]">
            <AlertDialogTitle className="text-base font-semibold leading-6 text-foreground">
              Cancel contribution?
            </AlertDialogTitle>
            <AlertDialogCancel asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Close" type="button">
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </AlertDialogCancel>
          </div>
          <div className="px-6 pb-0">
            <AlertDialogDescription className="text-sm leading-6 text-foreground">
              Are you sure you want to cancel? Your progress will be lost.
            </AlertDialogDescription>
          </div>
          <AlertDialogFooter className="flex items-center justify-end gap-2 px-6 pb-6 pt-4">
            <AlertDialogCancel asChild>
              <Button intent="secondary" variant="outline" type="button" className="px-4 py-2" onClick={() => setCancelDialogOpen(false)}>
                Keep working
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                intent="primary"
                type="button"
                className="px-4 py-2"
                onClick={() => {
                  setCancelDialogOpen(false);
                  onClose();
                }}
              >
                Cancel contribution
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
