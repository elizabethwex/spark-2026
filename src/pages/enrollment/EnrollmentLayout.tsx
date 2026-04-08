import * as React from "react";
import { Stepper } from "../../components/enrollment/Stepper";
import { getEnrollmentSteps, flattenEnrollmentStepIds } from "../../components/enrollment/enrollmentSteps";
import { WexButton } from "@wex/components-react/actions";
import { WexDialog } from "@wex/components-react/overlays";
import { ScrollIndicator } from "../../components/enrollment/ScrollIndicator";
import { Sparkles } from "lucide-react";

const BRAND_LINEAR_GRADIENT =
  'linear-gradient(172.91deg, rgb(37, 20, 111) 2.4625%, rgb(200, 16, 46) 100%)';

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
    <div className="min-h-screen bg-background flex">
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
          <div className="fixed left-[240px] right-0 bottom-0 px-8 pb-8 pt-6 bg-gradient-to-t from-background via-background to-background/80 backdrop-blur-sm">
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
            <WexDialog.Content aria-describedby={undefined}>
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
        <div className="relative shrink-0 size-[44px] rounded-full overflow-hidden shadow-sm ring-1 ring-white/80">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: BRAND_LINEAR_GRADIENT }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="size-5 text-white drop-shadow-sm" strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  );
}