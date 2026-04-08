import * as React from "react";

import EnrollmentLayout from "./EnrollmentLayout";
import { WexRadioGroup, WexCheckbox } from "@wex/components-react/form-inputs";
import { WexLabel } from "@wex/components-react/form-structure";
import { loadHsaState, saveHsaState } from "@/lib/hsaStorage";

type HsaPageProps = {
  currentStepId: string;
  onStepChange: (stepId: string) => void;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
};

export default function HsaPage({ currentStepId, onStepChange, onBack, onNext, onCancel }: HsaPageProps) {
  const initial = React.useMemo(() => loadHsaState(), []);
  const [isEligible, setIsEligible] = React.useState<string>(() => 
    initial.isEligible === true ? "yes" : initial.isEligible === false ? "no" : ""
  );
  const [authorizeAccount, setAuthorizeAccount] = React.useState<boolean>(() => initial.authorizeAccount);

  const persist = (eligible: boolean | null, authorize: boolean) => {
    saveHsaState({
      ...initial,
      version: 1,
      isEligible: eligible,
      authorizeAccount: authorize,
    });
  };

  const handleSaveContinue = () => {
    const eligibleValue = isEligible === "yes" ? true : isEligible === "no" ? false : null;
    persist(eligibleValue, authorizeAccount);
    onNext();
  };

  const handleEligibilityChange = (value: string) => {
    setIsEligible(value);
    const eligibleValue = value === "yes" ? true : value === "no" ? false : null;
    // Reset authorization if they select "no"
    const nextAuthorize = value === "no" ? false : authorizeAccount;
    setAuthorizeAccount(nextAuthorize);
    persist(eligibleValue, nextAuthorize);
  };

  const handleAuthorizationChange = (checked: boolean | "indeterminate") => {
    const nextAuthorize = checked === true;
    setAuthorizeAccount(nextAuthorize);
    const eligibleValue = isEligible === "yes" ? true : isEligible === "no" ? false : null;
    persist(eligibleValue, nextAuthorize);
  };

  // Enable "Save & Continue" only when user selected "Yes" and checked the authorization checkbox
  const isSaveDisabled = isEligible !== "yes" || !authorizeAccount;

  return (
    <EnrollmentLayout
      currentStepId={currentStepId}
      cancelAction={{ label: "Cancel", onClick: onCancel }}
      onStepChange={onStepChange}
      onBack={onBack}
      onNext={() => {}}
      primaryAction={{ label: "Save & Continue", onClick: handleSaveContinue }}
      primaryActionDisabled={isSaveDisabled}
    >
      <div className="pt-14 flex justify-center">
        <div className="w-[400px] flex flex-col gap-12">
          <section className="flex flex-col gap-4">
            <h2 className="text-[24px] font-bold leading-8 tracking-[-0.456px] text-foreground">
              Health Savings Account (HSA)
            </h2>
            <p className="text-[16px] leading-6 tracking-[-0.176px] text-foreground">
              A Health Savings Account (HSA) is a tax-advantaged account that helps you save for qualified medical expenses. 
              Since you are enrolled in a High Deductible Health Plan (HDHP), you may be eligible for an HSA.
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <WexLabel className="text-[16px] font-semibold leading-6 tracking-[-0.176px] text-foreground">
              Are you eligible for an HSA?
            </WexLabel>
            
            <div className="text-[14px] leading-6 text-muted-foreground mb-2">
              <p className="mb-2">You are <strong>eligible</strong> for an HSA if you:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Are not covered by other health coverage (such as a spouse's non-HDHP plan)</li>
                <li>Are not enrolled in Medicare</li>
                <li>Cannot be claimed as a dependent on someone else's tax return</li>
              </ul>
            </div>

            <WexRadioGroup value={isEligible} onValueChange={handleEligibilityChange}>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <WexRadioGroup.Item value="yes" id="eligible-yes" />
                  <span className="text-[14px] leading-6 text-foreground">
                    Yes, I am eligible for an HSA
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <WexRadioGroup.Item value="no" id="eligible-no" />
                  <span className="text-[14px] leading-6 text-foreground">
                    No, I am not eligible for an HSA
                  </span>
                </label>
              </div>
            </WexRadioGroup>

            {isEligible === "yes" && (
              <div className="mt-2 rounded-md border border-border bg-background p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <WexCheckbox
                    checked={authorizeAccount}
                    onCheckedChange={handleAuthorizationChange}
                    aria-label="I authorize an HSA account to be opened on my behalf"
                  />
                  <span className="text-[14px] leading-6 text-foreground">
                    I authorize a Health Savings Account (HSA) to be opened on my behalf
                  </span>
                </label>
              </div>
            )}

            {isEligible === "no" && (
              <div className="mt-2 rounded-md border border-warning/30 bg-warning/5 p-3">
                <p className="text-[13px] leading-5 text-foreground">
                  If you are not eligible for an HSA, you will not be able to contribute to this account. 
                  Please consider other spending account options like FSA or LPFSA.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </EnrollmentLayout>
  );
}