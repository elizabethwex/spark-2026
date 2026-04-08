import { useNavigate } from "react-router-dom";
import { Printer } from "lucide-react";
import { WexButton } from "@wex/components-react/actions";

import { EnrollmentSuccessIllustration } from "@/components/enrollment/EnrollmentSuccessIllustration";

export default function EnrollmentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[532px] text-center">
        <div className="mx-auto w-[362px] max-w-full">
          <EnrollmentSuccessIllustration className="block w-full h-auto" alt="" />
        </div>

        <h1 className="mt-10 text-[32px] font-bold leading-[42px] tracking-[0.64px] text-foreground">
          Enrollment Successful!
        </h1>
        <p className="mt-3 text-[16px] leading-[24px] tracking-[-0.176px] text-muted-foreground">
          You will receive an email with your enrollment information.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <WexButton intent="primary" onClick={() => navigate("/enrollment/statement")}>
            View Statement
          </WexButton>
          <WexButton variant="outline" intent="primary" onClick={() => navigate("/enrollment/home", { replace: true })}>
            Go Home
          </WexButton>
        </div>

        <button
          type="button"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-[6px] px-3 py-2 text-[14px] text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
          onClick={() => navigate("/enrollment/statement?print=1")}
        >
          <Printer className="h-4 w-4" />
          Print enrollment information
        </button>
      </div>
    </div>
  );
}