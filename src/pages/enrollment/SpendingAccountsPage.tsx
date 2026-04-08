import * as React from "react";
import { ShoppingCart, Wallet, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import EnrollmentLayout from "./EnrollmentLayout";
import { AccountSelectCard } from "@/components/enrollment/spending/AccountSelectCard";
import { SpendingAccountInfoDialog } from "@/components/enrollment/spending/SpendingAccountInfoDialog";
import {
  loadSpendingAccountsState,
  saveSpendingAccountsSelected,
  type SpendingAccountId,
} from "@/lib/spendingAccountsStorage";
import { loadHsaState } from "@/lib/hsaStorage";
import { isHDHPSelected } from "@/lib/medicalPlanStorage";

type SpendingAccountsPageProps = {
  currentStepId: string;
  onStepChange: (stepId: string) => void;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
};

function firstSelectedSubstep(selected: SpendingAccountId[]): string | null {
  if (selected.includes("hsa")) return "hsa";
  if (selected.includes("fsa")) return "fsa";
  if (selected.includes("lpfsa")) return "lpfsa";
  if (selected.includes("dcfsa")) return "dcfsa";
  if (selected.includes("hra")) return "hra";
  return null;
}



export default function SpendingAccountsPage({
  currentStepId,
  onStepChange,
  onBack,
  onCancel,
}: SpendingAccountsPageProps) {
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState<SpendingAccountId[]>(() => loadSpendingAccountsState().selected);
  const hsaState = React.useMemo(() => loadHsaState(), []);
  const [infoDialogAccount, setInfoDialogAccount] = React.useState<SpendingAccountId | null>(null);
  const isHDHP = isHDHPSelected();
  const [assistantPromptOpen, setAssistantPromptOpen] = React.useState(false);
  const [assistantPromptVisible, setAssistantPromptVisible] = React.useState(false);

  const setSelectedAndPersist = (next: SpendingAccountId[]) => {
    // keep unique, stable order
    const uniq = Array.from(new Set(next));
    setSelected(uniq);
    saveSpendingAccountsSelected(uniq);
  };

  const toggle = (id: SpendingAccountId, checked: boolean) => {
    const next = new Set<SpendingAccountId>(selected);

    if (checked) {
      next.add(id);
      if (id === "hsa") next.delete("fsa");
      if (id === "fsa") next.delete("hsa");
    } else {
      next.delete(id);
    }

    setSelectedAndPersist(Array.from(next));
  };

  const hsaDisabled = selected.includes("fsa") || isHDHP;
  const fsaDisabled = selected.includes("hsa") || isHDHP;
  const hsaSelected = selected.includes("hsa");
  const hsaConfigured = hsaSelected && (hsaState.isEligible !== undefined || hsaState.electionCents > 0);

  const handleSaveContinue = () => {
    const nextId = firstSelectedSubstep(selected);
    if (nextId) {
      navigate(`/enrollment/${nextId}`);
      return;
    }
    navigate("/enrollment/voluntary-supplemental-benefits");
  };

  React.useEffect(() => {
    const dismissed = window.localStorage.getItem("spendingAccountsIqPromptDismissed");
    if (dismissed) return undefined;

    const timer = window.setTimeout(() => {
      setAssistantPromptOpen(true);
      window.requestAnimationFrame(() => setAssistantPromptVisible(true));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, []);

  const handleDismissAssistantPrompt = () => {
    setAssistantPromptVisible(false);
    window.localStorage.setItem("spendingAccountsIqPromptDismissed", "true");
    window.setTimeout(() => setAssistantPromptOpen(false), 200);
  };

  return (
    <EnrollmentLayout
      currentStepId={currentStepId}
      cancelAction={{ label: "Cancel", onClick: onCancel }}
      onStepChange={onStepChange}
      onBack={onBack}
      onNext={() => {}}
      primaryAction={{ label: "Save & Continue", onClick: handleSaveContinue }}
      primaryActionDisabled={selected.length === 0}
    >
      <div className="pt-14 flex justify-center">
        <div className="w-[400px] flex flex-col gap-4">
          <h2 className="text-[24px] font-bold leading-8 tracking-[-0.456px] text-foreground">
            Let&apos;s Get You Set Up!
          </h2>
          <p className="text-[16px] font-light leading-6 tracking-[-0.176px] text-muted-foreground">
            Which accounts would you like to enroll in?
          </p>

          

          <div className="mt-2 flex flex-col gap-6">
            {!isHDHP && (
              <AccountSelectCard
                id="hsa"
                title="HSA"
                subtext="Health Savings Account"
                description="Save and pay for qualified health expenses with tax-free money. Combines with a high-deductible health plan, and funds roll over year after year."
                icon={<Wallet className="h-[18px] w-[18px] text-muted-foreground" />}
                checked={selected.includes("hsa")}
                disabled={hsaDisabled}
                disabledTooltip="HSA can't be combined with a general-purpose FSA. If you need both, consider an LPFSA instead. You can't enroll in both because a general-purpose FSA makes you ineligible to contribute to an HSA under IRS rules."
                onCheckedChange={(v) => toggle("hsa", v)}
                onViewMore={() => setInfoDialogAccount("hsa")}
              />
            )}

            <AccountSelectCard
              id="fsa"
              title="FSA"
              subtext="Flexible Spending Account"
              description="Set aside pre-tax dollars from your paycheck for eligible out-of-pocket healthcare costs like copays, prescriptions, and dental care."
              icon={<ShoppingCart className="h-[18px] w-[18px] text-muted-foreground" />}
              checked={selected.includes("fsa")}
              disabled={fsaDisabled}
              disabledTooltip={isHDHP 
                ? "FSA is not available when enrolled in the ACME HDHP HSA plan. Your plan includes HSA benefits instead."
                : "HSA can't be combined with a general-purpose FSA. If you need both, consider an LPFSA instead. You can't enroll in both because a general-purpose FSA makes you ineligible to contribute to an HSA under IRS rules."}
              onCheckedChange={(v) => toggle("fsa", v)}
              onViewMore={() => setInfoDialogAccount("fsa")}
            />

            <AccountSelectCard
              id="lpfsa"
              title="LPFSA"
              subtext="Limited Purpose Flexible Spending Account"
              description="A pre-tax account specifically for eligible out-of-pocket dental and vision expenses. Often used alongside an HSA."
              icon={<ShoppingCart className="h-[18px] w-[18px] text-muted-foreground" />}
              checked={selected.includes("lpfsa")}
              onCheckedChange={(v) => toggle("lpfsa", v)}
              onViewMore={() => setInfoDialogAccount("lpfsa")}
            />

            <AccountSelectCard
              id="dcfsa"
              title="DCFSA"
              subtext="Dependent Care Flexible Spending Account"
              description="Use pre-tax funds to pay for eligible care expenses for your children (e.g., daycare, preschool) or other qualifying dependents while you work."
              icon={<ShoppingCart className="h-[18px] w-[18px] text-muted-foreground" />}
              checked={selected.includes("dcfsa")}
              onCheckedChange={(v) => toggle("dcfsa", v)}
              onViewMore={() => setInfoDialogAccount("dcfsa")}
            />

            <AccountSelectCard
              id="hra"
              title="HRA"
              subtext="Health Reimbursement Arrangement"
              description="An employer-funded account that helps reimburse you for qualified medical expenses. Your employer contributes the funds, not you."
              icon={<ShoppingCart className="h-[18px] w-[18px] text-muted-foreground" />}
              checked={selected.includes("hra")}
              onCheckedChange={(v) => toggle("hra", v)}
              onViewMore={() => setInfoDialogAccount("hra")}
            />
          </div>

          {/* HSA Summary */}
          {hsaConfigured && (
            null
          )}
        </div>
      </div>

      {assistantPromptOpen && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="IQ Assistant prompt"
          className="fixed right-14 top-20 z-50"
        >
          <div
            className={[
              "relative w-[320px] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm",
              "origin-top-right transition-all duration-200 ease-out",
              assistantPromptVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "pointer-events-none opacity-0 scale-95 -translate-y-1",
            ].join(" ")}
          >
            <div className="absolute -top-2 right-11 h-4 w-4 rotate-45 border-l border-t border-slate-200 bg-white/95" />
            <button
              type="button"
              onClick={handleDismissAssistantPrompt}
              className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Dismiss IQ Assistant prompt"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="pr-6 text-[14px] leading-5 text-slate-700">
              Would you like to learn more about the differences between the account types and how to use each one?
            </div>
          </div>
        </div>
      )}

      <SpendingAccountInfoDialog
        accountId={infoDialogAccount}
        onClose={() => setInfoDialogAccount(null)}
      />
    </EnrollmentLayout>
  );
}