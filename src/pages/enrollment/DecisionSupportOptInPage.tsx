
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

import EnrollmentLayout from "./EnrollmentLayout";
import { WexButton } from "@wex/components-react/actions";

const STORAGE_KEY = "enrollment.decision-support-opt-in.v1";

type DecisionSupportOptIn = {
  version: 1;
  optedIn: boolean;
  timestamp: string;
};

export default function DecisionSupportOptInPage() {
  const navigate = useNavigate();

  const handleOptIn = (optedIn: boolean) => {
    try {
      const payload: DecisionSupportOptIn = {
        version: 1,
        optedIn,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
    navigate("/enrollment/medical-plans");
  };

  const onBack = () => {
    navigate("/enrollment/dependents");
  };

  const onCancel = () => {
    navigate("/", { replace: true });
  };

  const onStepChange = (stepId: string) => {
    if (stepId === "select-plans") return navigate("/enrollment/medical-plans");
    if (stepId === "spending-accounts") return navigate("/enrollment/spending-accounts");
    if (stepId === "voluntary-supplemental-benefits") return navigate("/enrollment/accident-insurance");
    navigate(`/enrollment/${stepId}`);
  };

  return (
    <EnrollmentLayout
      progressStepId="select-plans"
      cancelAction={{ label: "Cancel", onClick: onCancel }}
      onStepChange={onStepChange}
      onBack={onBack}
      onNext={() => handleOptIn(false)}
      hideFooterActions
    >
      <div className="pt-20 flex justify-center">
        <div className="max-w-[560px] w-full px-6">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative shrink-0 size-[64px] rounded-full overflow-hidden shadow-lg ring-1 ring-white/80">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(172.91deg, rgb(37, 20, 111) 2.4625%, rgb(200, 16, 46) 100%)',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="size-7 text-white drop-shadow-sm" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-[28px] font-bold leading-tight tracking-[-0.5px] text-foreground text-center mb-4">
            Would you like to receive recommendations on the health plan that's best for you?
          </h2>

          {/* Description */}
          <p className="text-[15px] leading-relaxed text-muted-foreground text-center mb-10">
            Our decision support tool analyzes your needs and suggests the most suitable health plan options, 
            helping you make an informed choice with confidence.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <WexButton
              intent="primary"
              onClick={() => handleOptIn(true)}
              className="w-full h-12 text-[15px] font-semibold"
            >
              Yes, I'd like that
            </WexButton>
            <WexButton
              variant="outline"
              intent="secondary"
              onClick={() => handleOptIn(false)}
              className="w-full h-12 text-[15px] font-semibold"
            >
              No, thank you
            </WexButton>
          </div>
        </div>
      </div>
    </EnrollmentLayout>
  );
}
