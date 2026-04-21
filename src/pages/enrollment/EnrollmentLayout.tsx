import * as React from "react";
import { Stepper } from "../../components/enrollment/Stepper";
import { getEnrollmentSteps, flattenEnrollmentStepIds } from "../../components/enrollment/enrollmentSteps";
import { WexButton } from "@wex/components-react/actions";
import { WexDialog } from "@wex/components-react/overlays";
import { ScrollIndicator } from "../../components/enrollment/ScrollIndicator";

type EnrollmentLayoutProps = {
  currentStepId?: string;
  progressStepId?: string;
  cancelAction?: {
    label: string;
    onClick: () => void;
  };
  onStepChange: (stepId: string) => void;
  onBack: () => void;
  onNext: () => void;
  children: React.ReactNode;
  skipAction?: {
    label: string;
    onClick: () => void;
  };
  hideFooterActions?: boolean;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  primaryActionDisabled?: boolean;
};

export default function EnrollmentLayout({
  currentStepId,
  progressStepId,
  cancelAction,
  onStepChange,
  onBack,
  onNext,
  children,
  skipAction,
  hideFooterActions,
  primaryAction,
  secondaryAction,
  primaryActionDisabled,
}: EnrollmentLayoutProps) {
  const steps = getEnrollmentSteps();
  const [cancelConfirmOpen, setCancelConfirmOpen] = React.useState(false);

  const handleConfirmExitEnrollment = () => {
    setCancelConfirmOpen(false);
    cancelAction?.onClick();
  };

  const isFirstStep = React.useMemo(() => {
    const allIds = flattenEnrollmentStepIds(steps);
    return Boolean(currentStepId) && allIds[0] === currentStepId;
  }, [currentStepId, steps]);

  const showBack = !isFirstStep;
  const showBackLeft = showBack && !cancelAction;
  const showBackRight = showBack && Boolean(cancelAction);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left rail */}
      <aside className="bg-muted w-[240px] shrink-0 rounded-tr-[32px] overflow-hidden">
        <div className="px-8 pt-14">
          <h1 className="text-[30px] font-bold leading-10 tracking-[-0.63px] text-foreground">
            Enrollment
          </h1>
        </div>
        <div className="px-8 pt-8">
          <Stepper
            steps={steps}
            currentStepId={currentStepId}
            progressStepId={progressStepId ?? currentStepId ?? steps[0].id}
            onStepChange={onStepChange}
          />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 relative">
        <div className="min-h-screen pb-32">{children}</div>

        {/* Scroll indicator */}
        <ScrollIndicator threshold={150} />

        {/* Bottom actions */}
        {!hideFooterActions ? (
          <div className="fixed left-[240px] right-0 bottom-0 px-8 pb-8 pt-6 bg-gradient-to-t from-white via-white to-white/80 backdrop-blur-sm">
            <div className="h-10 flex items-center justify-between">
              {cancelAction ? (
                <WexButton variant="ghost" onClick={() => setCancelConfirmOpen(true)}>
                  {cancelAction.label}
                </WexButton>
              ) : showBackLeft ? (
                <WexButton variant="outline" intent="primary" onClick={onBack}>
                  Back
                </WexButton>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3">
                {skipAction && (
                  <button
                    type="button"
                    onClick={skipAction.onClick}
                    className="text-[14px] text-primary hover:underline"
                  >
                    {skipAction.label}
                  </button>
                )}
                {showBackRight ? (
                  <WexButton variant="outline" intent="primary" onClick={onBack}>
                    Back
                  </WexButton>
                ) : null}
                {secondaryAction ? (
                  <WexButton variant="outline" intent="primary" onClick={secondaryAction.onClick}>
                    Submit Selections
                  </WexButton>
                ) : null}
                <WexButton intent="primary" onClick={primaryAction?.onClick ?? onNext} disabled={primaryActionDisabled}>
                  {primaryAction?.label ?? "Save & Continue"}
                </WexButton>
              </div>
            </div>
          </div>
        ) : null}

        {cancelAction ? (
          <WexDialog open={cancelConfirmOpen} onOpenChange={setCancelConfirmOpen}>
            <WexDialog.Content size="md" aria-describedby={undefined} className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <WexDialog.Header>
                <WexDialog.Title>Exit enrollment?</WexDialog.Title>
              </WexDialog.Header>
              <div className="px-6 pb-2 text-[14px] text-foreground">
                <p>
                  If you leave now, any selections you haven&apos;t fully submitted—including plans or
                  spending accounts you haven&apos;t confirmed at a checkpoint or on the final review—may
                  not be saved.
                </p>
                <p className="mt-3 text-muted-foreground">
                  You can return and complete enrollment before the deadline if you need more time.
                </p>
              </div>
              <WexDialog.Footer className="justify-end gap-2">
                <WexButton variant="outline" intent="secondary" onClick={() => setCancelConfirmOpen(false)}>
                  Stay
                </WexButton>
                <WexButton intent="primary" onClick={handleConfirmExitEnrollment}>
                  Exit
                </WexButton>
              </WexDialog.Footer>
            </WexDialog.Content>
          </WexDialog>
        ) : null}
      </div>

      {/* Assiste IQ Icon - Fixed in upper-right corner */}
      <div className="fixed top-6 right-8 z-40">
        <div
          className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full shadow-[0_1.057px_3.17px_rgba(2,13,36,0.2),0_0_0.528px_rgba(2,13,36,0.3)]"
          style={{
            backgroundImage:
              "linear-gradient(133.514deg, rgb(37, 20, 111) 2.4625%, rgb(200, 16, 46) 100%)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="shrink-0"
          >
            <path d="M13.913 13.9149L11.9997 24.0033L10.087 13.9149L0 12.0013L10.087 10.0884L12.0003 0L13.913 10.0884L24 12.0013L13.913 13.9149Z" fill="white"/>
            <path d="M20.2758 19.7969L19.5994 23.3628L18.923 19.7969L15.3569 19.1204L18.923 18.4439L19.5994 14.8781L20.2752 18.4439L23.8412 19.1204L20.2758 19.7969Z" fill="white"/>
          </svg>
        </div>
      </div>
    </div>
  );
}