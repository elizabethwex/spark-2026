import * as React from "react";
import {
  Checkbox,
  Label,
} from "@wexinc-healthbenefits/ben-ui-kit";

type EnrollmentStepId =
  | "profile"
  | "dependents"
  | "eligibility"
  | "beneficiaries"
  | "reimbursement"
  | "review"
  | "success";

interface HSAEnrollmentReviewProps {
  affirmation: boolean;
  onAffirmationChange: (checked: boolean) => void;
  eligibilityUnderstanding: boolean;
  onEligibilityUnderstandingChange: (checked: boolean) => void;
  enrollmentDocumentationAcknowledged: boolean;
  onEnrollmentDocumentationAcknowledgedChange: (checked: boolean) => void;
  onEditStep: (stepId: EnrollmentStepId) => void;
}

interface ProfileData {
  name: string;
  ssn: string;
  birthDate: string;
  gender: string;
  maritalStatus: string;
  homeAddress: string[];
  mailingAddress: string[];
  homePhone: string;
  email: string;
}

interface Dependent {
  name: string;
  birthDate: string;
  relationship: string;
}

interface BeneficiaryData {
  name: string;
  sharePercent: string;
  relationship: string;
}

export default function HSAEnrollmentReview({
  affirmation,
  onAffirmationChange,
  eligibilityUnderstanding,
  onEligibilityUnderstandingChange,
  enrollmentDocumentationAcknowledged,
  onEnrollmentDocumentationAcknowledgedChange,
  onEditStep,
}: HSAEnrollmentReviewProps) {
  const profileData: ProfileData = {
    name: "User name",
    ssn: "xxx-xx-3232",
    birthDate: "01/13/1986",
    gender: "Female",
    maritalStatus: "Married",
    homeAddress: ["520 Test Ave", "Test, AL 54530", "United States"],
    mailingAddress: ["520 Test Ave", "Test, AL 54530", "United States"],
    homePhone: "(123)456-7890",
    email: "username@email.com",
  };

  const dependents: Dependent[] = [
    { name: "Dependent name", birthDate: "01/01/2000", relationship: "Dependent" },
  ];

  const beneficiaries: BeneficiaryData[] = [
    { name: "Beneficiary name", sharePercent: "100", relationship: "Dependent" },
  ];

  const reimbursementMethod = {
    type: "Debit Card",
    details: "**** 2454",
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex justify-center pt-14 px-8 pb-8">
        <div className="w-[400px] flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-2xl leading-8 tracking-[-0.456px] text-foreground">
              Review and submit enrollment
            </h1>
            <p className="text-base leading-6 tracking-[-0.176px] text-muted-foreground">
              Please verify the following information is correct.
            </p>

            <div className="flex flex-col gap-3">
              <h2 className="font-semibold text-base leading-6 tracking-[0.32px] text-black">Profile</h2>
              <div className="h-px bg-border" />
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm leading-6 tracking-[0.28px] text-black"><span>Name:</span><span className="text-right">{profileData.name}</span></div>
                <div className="flex justify-between text-sm leading-6 tracking-[0.28px] text-black bg-[rgba(210,214,217,0.2)] py-1"><span>Social Security Number:</span><span className="text-right">{profileData.ssn}</span></div>
                <div className="flex justify-between text-sm leading-6 tracking-[0.28px] text-black"><span>Birth Date:</span><span className="text-right">{profileData.birthDate}</span></div>
                <div className="flex justify-between text-sm leading-6 tracking-[0.28px] text-black bg-[rgba(210,214,217,0.2)] py-1"><span>Gender:</span><span className="text-right">{profileData.gender}</span></div>
                <div className="flex justify-between text-sm leading-6 tracking-[0.28px] text-black"><span>Marital Status:</span><span className="text-right">{profileData.maritalStatus}</span></div>
                <div className="flex justify-between text-sm leading-6 tracking-[0.28px] text-black bg-[rgba(210,214,217,0.2)] py-1">
                  <span>Home Address:</span>
                  <span className="text-right">{profileData.homeAddress.map((line, i) => (<React.Fragment key={i}>{line}{i < profileData.homeAddress.length - 1 && <br />}</React.Fragment>))}</span>
                </div>
                <div className="flex justify-between text-sm leading-6 tracking-[0.28px] text-black">
                  <span>Mailing Address:</span>
                  <span className="text-right">{profileData.mailingAddress.map((line, i) => (<React.Fragment key={i}>{line}{i < profileData.mailingAddress.length - 1 && <br />}</React.Fragment>))}</span>
                </div>
                <div className="flex justify-between text-sm leading-6 tracking-[0.28px] text-black bg-[rgba(210,214,217,0.2)] py-1"><span>Home Phone:</span><span className="text-right">{profileData.homePhone}</span></div>
                <div className="flex justify-between text-sm leading-6 tracking-[0.28px] text-black"><span>Email Address:</span><span className="text-right">{profileData.email}</span></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-base leading-6 tracking-[0.32px] text-black">Eligibility</h2>
              <button onClick={() => onEditStep("eligibility")} className="text-sm leading-6 tracking-[0.28px] text-primary hover:underline">Edit</button>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between text-sm leading-6 tracking-[0.28px] text-black"><span>Name:</span><span className="text-right">{profileData.name}</span></div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-base leading-6 tracking-[0.32px] text-black">Dependents</h2>
              <button onClick={() => onEditStep("dependents")} className="text-sm leading-6 tracking-[0.28px] text-primary hover:underline">Edit</button>
            </div>
            <div className="h-px bg-border" />
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="flex bg-muted border-b border-border">
                <div className="flex-[0_0_148px] px-4 py-2 font-semibold text-sm leading-6 tracking-[-0.084px] text-foreground">Name</div>
                <div className="flex-1 px-4 py-2 font-semibold text-sm leading-6 tracking-[-0.084px] text-foreground border-l border-border">Birth Date</div>
                <div className="flex-1 px-4 py-2 font-semibold text-sm leading-6 tracking-[-0.084px] text-foreground border-l border-border">Relationship</div>
              </div>
              {dependents.map((dependent, index) => (
                <div key={index} className="flex border-b border-border last:border-b-0">
                  <div className="flex-[0_0_148px] px-4 py-2 text-sm leading-6 tracking-[-0.084px] text-foreground">{dependent.name}</div>
                  <div className="flex-1 px-4 py-2 text-sm leading-6 tracking-[-0.084px] text-foreground border-l border-border">{dependent.birthDate}</div>
                  <div className="flex-1 px-4 py-2 text-sm leading-6 tracking-[-0.084px] text-foreground border-l border-border">{dependent.relationship}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-base leading-6 tracking-[0.32px] text-black">Beneficiaries</h2>
              <button onClick={() => onEditStep("beneficiaries")} className="text-sm leading-6 tracking-[0.28px] text-primary hover:underline">Edit</button>
            </div>
            <div className="h-px bg-border" />
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="flex bg-muted border-b border-border">
                <div className="flex-[0_0_165px] px-4 py-2 font-semibold text-sm leading-6 tracking-[-0.084px] text-foreground">Name</div>
                <div className="flex-[0_0_100px] px-4 py-2 font-semibold text-sm leading-6 tracking-[-0.084px] text-foreground border-l border-border whitespace-nowrap">Share %</div>
                <div className="flex-1 px-4 py-2 font-semibold text-sm leading-6 tracking-[-0.084px] text-foreground border-l border-border">Relationship</div>
              </div>
              {beneficiaries.map((beneficiary, index) => (
                <div key={index} className="flex border-b border-border last:border-b-0">
                  <div className="flex-[0_0_165px] px-4 py-2 text-sm leading-6 tracking-[-0.084px] text-foreground">{beneficiary.name}</div>
                  <div className="flex-[0_0_100px] px-4 py-2 text-sm leading-6 tracking-[-0.084px] text-foreground border-l border-border">{beneficiary.sharePercent}</div>
                  <div className="flex-1 px-4 py-2 text-sm leading-6 tracking-[-0.084px] text-foreground border-l border-border">{beneficiary.relationship}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-base leading-6 tracking-[0.32px] text-black">Reimbursement Method</h2>
              <button onClick={() => onEditStep("reimbursement")} className="text-sm leading-6 tracking-[0.28px] text-primary hover:underline">Edit</button>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between text-sm leading-6 tracking-[0.28px] text-black">
              <span>{reimbursementMethod.type}</span>
              <span className="text-right">{reimbursementMethod.details}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-base leading-normal tracking-[-0.304px] text-foreground">Submit Enrollment</h2>
            <p className="text-sm leading-6 tracking-[-0.084px] text-muted-foreground">
              By submitting the enrollment, you are requesting that a Health Savings Account be opened in your name. <span className="text-red-600">All fields are required.</span>
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex gap-1 items-start">
                <Checkbox id="affirmation" checked={affirmation} onCheckedChange={(checked) => onAffirmationChange(checked as boolean)} className="mt-0.5" required />
                <Label htmlFor="affirmation" className="text-sm leading-6 tracking-[-0.084px] text-foreground cursor-pointer">
                  <span className="text-red-600">* </span>I affirm that all information I have provided is true and correct and may be relied upon by the Designated Representative and the HSA Custodian.
                </Label>
              </div>

              <div className="flex gap-1 items-start">
                <Checkbox id="eligibility-check" checked={eligibilityUnderstanding} onCheckedChange={(checked) => onEligibilityUnderstandingChange(checked as boolean)} className="mt-0.5" required />
                <Label htmlFor="eligibility-check" className="text-sm leading-6 tracking-[-0.084px] text-foreground cursor-pointer">
                  <span className="text-red-600">* </span>I understand HSA eligibility and am responsible for ensuring I qualify for contributions each year, that contributions stay within legal limits (considering my coverage and deductible), and for understanding the tax implications of contributions and distributions. I will seek professional tax or legal advice for any related questions.
                </Label>
              </div>

              <div className="flex gap-1 items-start">
                <Checkbox id="documents" checked={enrollmentDocumentationAcknowledged} onCheckedChange={(checked) => onEnrollmentDocumentationAcknowledgedChange(checked as boolean)} className="mt-0.5" required />
                <Label htmlFor="documents" className="text-sm leading-6 tracking-[-0.084px] text-foreground cursor-pointer">
                  <span className="text-red-600">* </span>I confirm I have received the enrollment documentation, understand my right to revoke within 7 days, and acknowledge that I haven&apos;t received tax or legal advice from the Custodian/Representative. I will seek my own professional advice and hold the Custodian/Representative harmless for my actions.
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
