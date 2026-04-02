import { Button, Card, CardContent } from "@wexinc-healthbenefits/ben-ui-kit";
import { SectionHeader } from "@/components/ui/SectionHeader";

const quickActions = [
  "Reimburse Myself",
  "Send Payment",
  "Manage My Expenses",
  "Enroll in HSA",
  "Get Help",
];

export function QuickActionsSection() {
  return (
    <Card className="border-border shadow-sm rounded-[24px] overflow-hidden" style={{ borderRadius: '24px' }}>
      <CardContent className="p-6 flex flex-col gap-6" style={{ borderRadius: '24px' }}>
        <SectionHeader title="What can we help you with today:" />

        <div className="flex flex-wrap gap-4">
          {quickActions.map((label) => (
            <Button
              key={label}
              type="button"
              variant="outline"
              className="rounded-xl border-[#3958c3] py-[9.75px] px-[16px] text-[15.75px] font-medium text-[#3958c3] hover:bg-[#3958c3]/5"
            >
              {label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
