import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  label: string;
  secondarySteps?: Step[];
}

export interface StepperProps {
  steps: Step[];
  currentStepId?: string;
  progressStepId: string;
  onStepChange: (stepId: string) => void;
  className?: string;
}

type StepState = "completed" | "current" | "pending";

export function Stepper({ steps, currentStepId, progressStepId, onStepChange, className }: StepperProps) {
  const getStepState = (stepId: string, allStepIds: string[]): StepState => {
    const currentIndex = currentStepId ? allStepIds.indexOf(currentStepId) : -1;
    const rawProgressIndex = allStepIds.indexOf(progressStepId);
    const progressIndex = rawProgressIndex >= 0 ? rawProgressIndex : Math.max(currentIndex, 0);
    const stepIndex = allStepIds.indexOf(stepId);

    const primaryStep = steps.find((step) => step.id === stepId);
    if (primaryStep?.secondarySteps?.length) {
      const allSecondaryCompleted = primaryStep.secondarySteps.every((secondary) => {
        const secondaryIndex = allStepIds.indexOf(secondary.id);
        return secondaryIndex < progressIndex;
      });
      if (stepIndex === currentIndex) return "current";
      if (allSecondaryCompleted) return "completed";
      return "pending";
    }

    if (stepIndex === currentIndex) return "current";
    if (stepIndex < progressIndex) return "completed";
    return "pending";
  };

  const getAllStepIds = (): string[] => {
    const ids: string[] = [];
    steps.forEach((step) => {
      ids.push(step.id);
      step.secondarySteps?.forEach((secondary) => ids.push(secondary.id));
    });
    return ids;
  };

  const isPrimaryStepReached = (stepId: string, allStepIds: string[]): boolean => {
    const rawProgressIndex = allStepIds.indexOf(progressStepId);
    const progressIndex = rawProgressIndex >= 0 ? rawProgressIndex : 0;
    const stepIndex = allStepIds.indexOf(stepId);
    return currentStepId ? stepIndex <= progressIndex : stepIndex < progressIndex;
  };

  const handleStepClick = (stepId: string) => onStepChange(stepId);

  const allStepIds = getAllStepIds();

  return (
    <div className={cn("relative flex flex-col gap-6", className)}>
      <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

      <div className="relative flex flex-col gap-6">
        {steps.map((primaryStep, primaryIndex) => {
          const primaryState = getStepState(primaryStep.id, allStepIds);
          const isPrimaryReached = isPrimaryStepReached(primaryStep.id, allStepIds);
          const showSecondarySteps = Boolean(isPrimaryReached && primaryStep.secondarySteps?.length);
          const isCurrentPrimaryWithSecondary = primaryState === "current" && showSecondarySteps;
          const stepNumber = primaryIndex + 1;

          return (
            <div key={primaryStep.id} className="contents">
              <div className="relative flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleStepClick(primaryStep.id)}
                  className={cn(
                    "relative z-10 flex items-center justify-center rounded-full transition-colors",
                    "hover:opacity-80 cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "w-6 h-6",
                    primaryState === "current" && "border border-primary bg-transparent",
                    primaryState === "pending" && "bg-border border border-transparent",
                    primaryState === "completed" && "border border-success bg-background",
                  )}
                  aria-label={`Step ${stepNumber}: ${primaryStep.label}`}
                  aria-current={primaryState === "current" ? "step" : undefined}
                >
                  {primaryState === "completed" ? (
                    <Check className="h-4 w-4 text-success-text" />
                  ) : (
                    <span
                      className={cn(
                        "text-sm font-semibold leading-6",
                        primaryState === "current" && "text-primary",
                        primaryState === "pending" && "text-muted-foreground font-medium",
                      )}
                    >
                      {stepNumber}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleStepClick(primaryStep.id)}
                  className={cn(
                    "text-sm text-left transition-colors cursor-pointer",
                    "hover:opacity-80",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded",
                    primaryState === "current" ? "font-semibold text-foreground" : "font-medium text-muted-foreground",
                  )}
                >
                  {primaryStep.label}
                </button>
              </div>

              {isCurrentPrimaryWithSecondary && primaryStep.secondarySteps && (
                <div
                  className="absolute left-3 w-px bg-primary z-0"
                  style={{
                    top: "1.5rem",
                    height: `${1 + primaryStep.secondarySteps.length * 1.5}rem`,
                  }}
                />
              )}

              {showSecondarySteps && primaryStep.secondarySteps && (
                <div className="pl-9 flex flex-col gap-0.5">
                  {primaryStep.secondarySteps.map((secondaryStep, secondaryIndex) => {
                    const secondaryState = getStepState(secondaryStep.id, allStepIds);
                    const isLastSecondary = secondaryIndex === primaryStep.secondarySteps!.length - 1;
                    const connectorColor = isCurrentPrimaryWithSecondary ? "bg-primary" : "bg-border";

                    return (
                      <div key={secondaryStep.id} className="contents">
                        <div className="relative flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleStepClick(secondaryStep.id)}
                              className={cn(
                                "relative z-10 flex items-center justify-center rounded-full bg-background border transition-colors",
                                "hover:opacity-80 cursor-pointer",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                "w-3.5 h-3.5",
                                secondaryState === "completed" && "border-success",
                                secondaryState === "current" && "border-primary",
                                secondaryState === "pending" && "border-border",
                              )}
                              aria-label={`Sub-step ${secondaryIndex + 1}: ${secondaryStep.label}`}
                              aria-current={secondaryState === "current" ? "step" : undefined}
                            >
                              {secondaryState === "completed" ? <Check className="h-3 w-3 text-success-text" /> : null}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleStepClick(secondaryStep.id)}
                              className={cn(
                                "text-xs text-left transition-colors cursor-pointer",
                                "hover:opacity-80",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded",
                                secondaryState === "current" ? "font-medium text-foreground" : "font-normal text-muted-foreground",
                              )}
                            >
                              {secondaryStep.label}
                            </button>
                          </div>

                          {!isLastSecondary && <div className={cn("h-4 w-px ml-[5px]", connectorColor)} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}