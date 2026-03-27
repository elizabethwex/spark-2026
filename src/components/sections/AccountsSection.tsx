import { useNavigate } from "react-router-dom";
import { Button } from "@wexinc-healthbenefits/ben-ui-kit";
import { ChevronRight, HeartHandshake } from "lucide-react";
import { hsaAccountData } from "@/data/mockData";
import { FSACard } from "@/components/FSACard";
import { HSACard, HSA_SCENARIOS } from "@/components/HSACard";

export function AccountsSection() {
  const navigate = useNavigate();
  
  const isHsaEmpty = hsaAccountData.totalAccountValue === "$0.00" || hsaAccountData.totalAccountValue === "$0";

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between px-1">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Accounts
          </h2>
          {isHsaEmpty && (
            <div className="flex items-center gap-1.5 text-xs text-blue-700/90 font-medium bg-blue-50/50 px-2 py-0.5 rounded-md border border-blue-100/50">
              <HeartHandshake className="h-3 w-3" />
              <span>A $50/mo contribution saves roughly $140 in taxes.</span>
            </div>
          )}
        </div>
        <Button
          intent="primary"
          variant="link"
          size="md"
          className="h-auto p-0"
          onClick={() => navigate("/account-overview")}
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <HSACard data={HSA_SCENARIOS["new-employee"].data} />
        <FSACard />
      </div>
    </div>
  );
}
