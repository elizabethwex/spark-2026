import EnrollmentLayout from "./EnrollmentLayout";
import { ReadOnlyCheckbox, ReadOnlyRadio } from "@/components/enrollment/ReadOnlyControls";
import { ReadOnlyField, ReadOnlySelect } from "@/components/enrollment/ReadOnlyField";

type ProfilePageProps = {
  currentStepId: string;
  onStepChange: (stepId: string) => void;
  onBack: () => void;
  onNext: () => void;
  onCancel: () => void;
};

export default function ProfilePage({ currentStepId, onStepChange, onBack, onNext, onCancel }: ProfilePageProps) {
  return (
    <EnrollmentLayout
      currentStepId={currentStepId}
      cancelAction={{ label: "Cancel", onClick: onCancel }}
      onStepChange={onStepChange}
      onBack={onBack}
      onNext={onNext}
    >
      <div className="pt-14 flex justify-center">
        <div className="w-[400px] flex flex-col gap-12">
          {/* Profile section */}
          <section className="flex flex-col gap-4">
            <h2 className="text-[24px] font-bold leading-8 tracking-[-0.456px] text-foreground">
              Review your profile
            </h2>
            <p className="text-[16px] leading-6 tracking-[-0.176px] text-foreground">
              All fields must be completed. If you need to update any information please contact the administrator
            </p>

            <div className="flex flex-col gap-4">
              <ReadOnlyField label="First Name" value="Nicole" />
              <ReadOnlyField label="Middle Name" value="-" />
              <ReadOnlyField label="Last Name" value="Smith" />
              <ReadOnlyField label="Birth Date" value="03/15/1998" />
              <ReadOnlyField label="Participant Account ID" value="78445225" />
              <ReadOnlySelect label="Gender" value="Female" />

              <div className="flex items-center gap-2">
                <div className="w-[116px] text-[16px] leading-6 tracking-[0.32px] text-muted-foreground">
                  Marital Status:
                </div>
                <ReadOnlyRadio label="Married" selected />
                <ReadOnlyRadio label="Single" selected={false} />
              </div>
            </div>
          </section>

          {/* Contact info section */}
          <section className="flex flex-col gap-4">
            <h2 className="text-[24px] font-bold leading-8 tracking-[-0.456px] text-foreground">
              Contact Information
            </h2>

            <div className="flex flex-col gap-4">
              <ReadOnlyField label="Address Line 1" value="123 Main Street" />
              <ReadOnlyField label="Address Line 2" value="-" />
              <ReadOnlyField label="City" value="Anytown" />
              <ReadOnlyField label="State" value="NY" />
              <ReadOnlyField label="Zip Code" value="10011" />

              <div className="flex items-center gap-2">
                <div className="w-[134px] text-[16px] leading-6 tracking-[0.32px] text-muted-foreground">
                  Mailing Address:
                </div>
                <ReadOnlyCheckbox label="Same as Home Address" checked />
              </div>

              <ReadOnlyField label="Home Phone" value="+1 212 555 4567" />
              <ReadOnlyField label="Email Address" value="useremail@email.com" />
              <ReadOnlyField label="Confirm Email Address" value="useremail@email.com" />
            </div>

            <p className="text-[14px] leading-[22px] tracking-[0.28px] text-muted-foreground">
              You will receive communications electronically about your benefits in lieu of paper documents. Your email address will not be shared or used for any other purpose.
            </p>
          </section>
        </div>
      </div>
    </EnrollmentLayout>
  );
}