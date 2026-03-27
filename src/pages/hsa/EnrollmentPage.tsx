import {
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wexinc-healthbenefits/ben-ui-kit";

interface HSAEnrollmentPageProps {
  certificationChecked: boolean;
  onCertificationCheckedChange: (checked: boolean) => void;
  coverageLevel: string;
  onCoverageLevelChange: (value: string) => void;
}

export default function HSAEnrollmentPage({
  certificationChecked,
  onCertificationCheckedChange,
  coverageLevel,
  onCoverageLevelChange,
}: HSAEnrollmentPageProps) {
  return (
    <div className="flex justify-center pt-14 px-8">
      <div className="w-[400px] flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-[24px] font-bold text-black leading-[32px] tracking-[-0.456px]">
            Check if you qualify for an HSA
          </h2>

          <p className="text-[16px] leading-[24px] text-foreground tracking-[-0.176px]">
            To qualify for an HSA, you must meet the following requirements.
          </p>

          <div className="text-[14px] leading-[24px] text-muted-foreground tracking-[-0.084px]">
            <ul className="list-disc ml-[21px] space-y-0">
              <li>
                You must have a qualifying health plan or be opening an account to rollover balances from an existing HSA account.
              </li>
              <li>
                You cannot have any other disqualifying health coverage.
              </li>
              <li>
                You cannot be covered by a first-dollar full coverage health flexible spending account (FSA) or health reimbursement arrangement (HRA). You can be covered by a limited purpose or post-deductible FSA/HRA as well as a retirement or suspended HRA.
              </li>
              <li>
                You cannot be claimed as a dependent on anyone else's tax return.
              </li>
              <li>
                You cannot be enrolled in Medicare, Medicaid, or TRICARE.
              </li>
              <li>
                Other circumstances may affect your eligibility to establish or contribute to an HSA.
              </li>
            </ul>

            <p className="mt-6 leading-[24px]">
              Refer to{" "}
              <span className="text-primary">IRS publication 969</span>
              , "Health Savings Accounts and Other Tax Favored Health Plans", for information about special rules that affect eligibility. You may download a copy of this publication from www.irs.gov. The publication is also available by calling 1-800-829-3676. You are solely responsible for determining whether you are eligible for an HSA, and for determining you remain eligible in the future.
            </p>
          </div>

          <div className="flex gap-2 items-start">
            <Checkbox
              id="certification"
              checked={certificationChecked}
              onCheckedChange={(checked) => onCertificationCheckedChange(checked === true)}
              className="mt-0.5"
            />
            <label
              htmlFor="certification"
              className="text-[14px] leading-[24px] text-foreground tracking-[-0.084px] cursor-pointer"
            >
              I certify that I meet the qualifications to open a HSA
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-[24px] font-bold text-black leading-[32px] tracking-[-0.456px]">
            Qualifying Health Plan Coverage
          </h2>

          <p className="text-[16px] leading-[24px] text-foreground tracking-[-0.176px]">
            Provide the following information about your qualifying health plan coverage to determine your maximum contribution to your HSA.
          </p>

          <div className="flex flex-col gap-2">
            <label className="text-[10.5px] text-muted-foreground">
              Coverage Level
            </label>
            <Select value={coverageLevel} onValueChange={onCoverageLevelChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select coverage level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
