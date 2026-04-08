import EnrollmentLayout from "./EnrollmentLayout";
import { enrollmentLabelById, getEnrollmentSteps } from "../../components/enrollment/enrollmentSteps";

type PlaceholderStepPageProps = {
  stepId: string;
  onStepChange: (stepId: string) => void;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
};

export default function PlaceholderStepPage({ stepId, onStepChange, onBack, onNext, onCancel }: PlaceholderStepPageProps) {
  const title = (enrollmentLabelById(getEnrollmentSteps())[stepId] ?? "Step");

  return (
    <EnrollmentLayout
      currentStepId={stepId}
      cancelAction={{ label: "Cancel", onClick: onCancel }}
      onStepChange={onStepChange}
      onBack={onBack}
      onNext={onNext}
    >
      <div className="pt-14 flex justify-center">
        <div className="w-[400px]">
          <h2 className="text-[24px] font-bold leading-8 tracking-[-0.456px] text-foreground">
            {title}
          </h2>
          <p className="mt-4 text-[16px] leading-6 tracking-[-0.176px] text-foreground">
            This step is a placeholder for now. You can still use the stepper and buttons to navigate the flow.
          </p>
        </div>
      </div>
    </EnrollmentLayout>
  );
}