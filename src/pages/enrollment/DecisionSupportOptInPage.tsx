
import { useNavigate } from "react-router-dom";

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
            <div
              className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-full shadow-[0_1.057px_3.17px_rgba(2,13,36,0.2),0_0_0.528px_rgba(2,13,36,0.3)]"
              style={{
                backgroundImage:
                  "linear-gradient(133.514deg, rgb(37, 20, 111) 2.4625%, rgb(200, 16, 46) 100%)",
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                className="shrink-0"
              >
                <path d="M13.913 13.9149L11.9997 24.0033L10.087 13.9149L0 12.0013L10.087 10.0884L12.0003 0L13.913 10.0884L24 12.0013L13.913 13.9149Z" fill="white"/>
                <path d="M20.2758 19.7969L19.5994 23.3628L18.923 19.7969L15.3569 19.1204L18.923 18.4439L19.5994 14.8781L20.2752 18.4439L23.8412 19.1204L20.2758 19.7969Z" fill="white"/>
              </svg>
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
