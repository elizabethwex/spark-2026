import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground";
import {
  Card,
  CardContent,
  Separator,
  Spinner
} from "@wexinc-healthbenefits/ben-ui-kit";

export default function ReimburseAnalyze() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/reimburse/review");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen" style={consumerPageBackgroundStyle}>
      <ConsumerNavigation />

      <div className="mx-auto max-w-[1440px] px-8 py-8">
        <div className="mx-auto max-w-[720px]">
          <Card>
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold text-foreground">Analyzing your documentation</h1>
                <p className="text-sm text-muted-foreground">
                  We&apos;re checking your upload for required details before the review step.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 py-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Spinner className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">This will take just a few seconds...</p>
              </div>

              <Separator />

              <p className="text-xs text-muted-foreground text-center">
                Next: review your details and submit your reimbursement request.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

