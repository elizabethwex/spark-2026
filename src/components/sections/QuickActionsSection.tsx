import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent } from "@wexinc-healthbenefits/ben-ui-kit";
import { SectionHeader } from "@/components/ui/SectionHeader";

const quickActions = [
  { label: "Reimburse Myself", path: "/reimburse" },
  { label: "Send Payment" },
  { label: "Manage My Expenses" },
  { label: "Enroll in HSA" },
  { label: "Get Help" },
];

export function QuickActionsSection({ activeView = 1 }: { activeView?: 1 | 2 | 3 }) {
  const navigate = useNavigate();

  const displayActions = quickActions.map(action => {
    if (activeView === 2 && action.label === "Enroll in HSA") {
      return { ...action, label: "Enroll in FSA" };
    }
    return action;
  });

  return (
    <Card className="border-border shadow-sm rounded-[24px] overflow-hidden" style={{ borderRadius: '24px' }}>
      <CardContent className="p-6 flex flex-col gap-6" style={{ borderRadius: '24px' }}>
        <SectionHeader title="What can we help you with today:" />

        <div className="flex flex-wrap gap-4">
          {displayActions.map((action) => (
            <Button
              key={action.label}
              type="button"
              variant="outline"
              className="rounded-xl border-[#3958c3] py-[9.75px] px-[16px] text-[15.75px] font-medium text-[#3958c3] hover:bg-[#3958c3]/5"
              onClick={() => action.path && navigate(action.path)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
