import * as React from "react";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  Button,
  Stepper,
  Workspace,
} from "@wexinc-healthbenefits/ben-ui-kit";
import type { Step } from "@wexinc-healthbenefits/ben-ui-kit";
import HSAEnrollmentPage from "./EnrollmentPage";
import HSAProfileReview from "./ProfileReview";
import HSADependentsPage from "./DependentsPage";
import HSABeneficiariesPage from "./BeneficiariesPage";
import HSAReimbursementPage from "./ReimbursementPage";
import HSAEnrollmentReview from "./EnrollmentReview";
import HSAEnrollmentSuccess from "./EnrollmentSuccess";

type EnrollmentStepId =
  | "profile"
  | "dependents"
  | "eligibility"
  | "beneficiaries"
  | "reimbursement"
  | "review"
  | "success";

const enrollmentSteps: Step[] = [
  { id: "profile", label: "Profile" },
  { id: "dependents", label: "Dependents" },
  { id: "eligibility", label: "Eligibility" },
  { id: "beneficiaries", label: "Beneficiaries" },
  { id: "reimbursement", label: "Reimbursement" },
  { id: "review", label: "Review" },
];

const stepOrder: EnrollmentStepId[] = [
  "profile",
  "dependents",
  "eligibility",
  "beneficiaries",
  "reimbursement",
  "review",
  "success",
];

export interface HSAEnrollmentWorkspaceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HSAEnrollmentWorkspace({ open, onOpenChange }: HSAEnrollmentWorkspaceProps) {
  const [currentStepId, setCurrentStepId] = React.useState<EnrollmentStepId>("profile");
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = React.useState(false);

  const [certificationChecked, setCertificationChecked] = React.useState(false);
  const [coverageLevel, setCoverageLevel] = React.useState("");

  const [affirmation, setAffirmation] = React.useState(false);
  const [eligibilityUnderstanding, setEligibilityUnderstanding] = React.useState(false);
  const [documentReceipt, setDocumentReceipt] = React.useState(false);

  const currentStepIndex = stepOrder.indexOf(currentStepId);
  const stepperCurrentId = currentStepId === "success" ? "review" : currentStepId;
  const canProceedFromEligibility = certificationChecked && coverageLevel !== "";
  const canSubmitReview = affirmation && eligibilityUnderstanding && documentReceipt;

  const resetState = React.useCallback(() => {
    setCurrentStepId("profile");
    setCertificationChecked(false);
    setCoverageLevel("");
    setAffirmation(false);
    setEligibilityUnderstanding(false);
    setDocumentReceipt(false);
  }, []);

  React.useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open, resetState]);

  const handleWorkspaceOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setIsCancelConfirmOpen(true);
      return;
    }
    onOpenChange(true);
  };

  const handleCancelRequest = () => {
    setIsCancelConfirmOpen(true);
  };

  const handleCancelConfirm = () => {
    setIsCancelConfirmOpen(false);
    onOpenChange(false);
  };

  const handleCancelDismiss = () => {
    setIsCancelConfirmOpen(false);
  };

  const handleNext = () => {
    const nextStep = stepOrder[currentStepIndex + 1];
    if (nextStep) {
      setCurrentStepId(nextStep);
    }
  };

  const handleBack = () => {
    const prevStep = stepOrder[currentStepIndex - 1];
    if (prevStep) {
      setCurrentStepId(prevStep);
    }
  };

  const handleGoHome = () => {
    onOpenChange(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditStep = (stepId: EnrollmentStepId) => {
    if (stepId !== "success") {
      setCurrentStepId(stepId);
    }
  };

  const stepperContent = (
    <div className="flex flex-col gap-8">
      <h3 className="text-2xl font-bold leading-8 tracking-[-0.456px] text-foreground">
        Enrollment
      </h3>
      <Stepper
        steps={enrollmentSteps}
        currentStepId={stepperCurrentId}
        onStepChange={(stepId) => handleEditStep(stepId as EnrollmentStepId)}
      />
    </div>
  );

  const footerConfig = (() => {
    if (currentStepId === "success") {
      return {
        showFooter: true,
        primary: {
          label: "Go Home",
          onClick: handleGoHome,
          intent: "primary" as const,
        },
        secondary: {
          label: "Print",
          onClick: handlePrint,
          intent: "secondary" as const,
          variant: "outline" as const,
        },
        tertiary: null,
      };
    }

    const primaryLabel = currentStepId === "review" ? "Submit Enrollment" : "Save & Continue";
    const primaryDisabled =
      currentStepId === "eligibility" ? !canProceedFromEligibility :
      currentStepId === "review" ? !canSubmitReview :
      false;

    return {
      showFooter: true,
      primary: {
        label: primaryLabel,
        onClick: handleNext,
        intent: "primary" as const,
        disabled: primaryDisabled,
      },
      secondary: currentStepId === "profile"
        ? null
        : {
            label: "Back",
            onClick: handleBack,
            intent: "secondary" as const,
            variant: "outline" as const,
          },
      tertiary: {
        label: "Cancel",
        onClick: handleCancelRequest,
        variant: "ghost" as const,
      },
    };
  })();

  const renderStep = () => {
    switch (currentStepId) {
      case "profile":
        return <HSAProfileReview />;
      case "dependents":
        return <HSADependentsPage />;
      case "eligibility":
        return (
          <HSAEnrollmentPage
            certificationChecked={certificationChecked}
            onCertificationCheckedChange={setCertificationChecked}
            coverageLevel={coverageLevel}
            onCoverageLevelChange={setCoverageLevel}
          />
        );
      case "beneficiaries":
        return <HSABeneficiariesPage />;
      case "reimbursement":
        return <HSAReimbursementPage />;
      case "review":
        return (
          <HSAEnrollmentReview
            affirmation={affirmation}
            onAffirmationChange={setAffirmation}
            eligibilityUnderstanding={eligibilityUnderstanding}
            onEligibilityUnderstandingChange={setEligibilityUnderstanding}
            documentReceipt={documentReceipt}
            onDocumentReceiptChange={setDocumentReceipt}
            onEditStep={handleEditStep}
          />
        );
      case "success":
        return <HSAEnrollmentSuccess />;
      default:
        return null;
    }
  };

  return (
    <>
      <Workspace
        open={open}
        onOpenChange={handleWorkspaceOpenChange}
        title="Enrollment"
        stepperContent={stepperContent}
        showFooter={footerConfig.showFooter}
        primaryButton={
          footerConfig.primary ? (
            <Button
              intent={footerConfig.primary.intent}
              variant={("variant" in footerConfig.primary ? footerConfig.primary.variant : undefined) as React.ComponentProps<typeof Button>["variant"]}
              onClick={footerConfig.primary.onClick}
              disabled={"disabled" in footerConfig.primary ? footerConfig.primary.disabled : undefined}
              className="px-4 py-2"
            >
              {footerConfig.primary.label}
            </Button>
          ) : null
        }
        secondaryButton={
          footerConfig.secondary ? (
            <Button
              intent={footerConfig.secondary.intent}
              variant={footerConfig.secondary.variant}
              onClick={footerConfig.secondary.onClick}
              className="px-4 py-2"
            >
              {footerConfig.secondary.label}
            </Button>
          ) : null
        }
        tertiaryButton={
          footerConfig.tertiary ? (
            <Button
              variant={footerConfig.tertiary.variant}
              onClick={footerConfig.tertiary.onClick}
              className="px-4 py-2"
            >
              {footerConfig.tertiary.label}
            </Button>
          ) : null
        }
      >
        {renderStep()}
      </Workspace>

      <AlertDialog open={isCancelConfirmOpen} onOpenChange={setIsCancelConfirmOpen}>
        <AlertDialogContent className="w-[448px] p-0">
          <div className="flex items-center justify-between p-[17.5px]">
            <AlertDialogTitle className="text-base font-semibold text-foreground tracking-[-0.176px] leading-6">
              Cancel enrollment
            </AlertDialogTitle>
            <AlertDialogCancel asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </AlertDialogCancel>
          </div>

          <div className="px-[24px] pb-0">
            <AlertDialogDescription className="text-sm text-foreground leading-6">
              Are you sure you want to cancel enrollment? Your progress will be lost.
            </AlertDialogDescription>
          </div>

          <AlertDialogFooter className="px-[24px] pb-[24px] pt-[16px] flex items-center justify-end gap-2">
            <AlertDialogCancel asChild>
              <Button intent="secondary" variant="outline" onClick={handleCancelDismiss} className="px-4 py-2">
                Keep working
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button intent="primary" onClick={handleCancelConfirm} className="px-4 py-2">
                Cancel enrollment
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
