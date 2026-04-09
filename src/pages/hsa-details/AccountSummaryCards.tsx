import { Badge, Card, CardContent } from "@wexinc-healthbenefits/ben-ui-kit";
import { FileText } from "lucide-react";
import { accountSummaryData } from "./mockData";

/**
 * Account Summary Cards Component
 * 
 * Displays 4 horizontal cards showing account balances:
 * - Account name
 * - Balance amount
 * - Warning badge for accounts with filing deadlines
 * - "Last day to file" date
 */
export function AccountSummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {accountSummaryData.map((account) => (
        <Card key={account.id} className="overflow-hidden">
          <CardContent className="px-4 py-6">
            <div className="flex flex-col gap-1">
              {/* Account Name + Warning Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">
                  {account.name}
                </span>
                {account.daysLeftWarning && (
                  <Badge 
                    intent="warning" 
                    className="flex items-center gap-1 px-2 py-0 text-xs shrink-0"
                  >
                    <FileText className="h-3 w-3" />
                    {account.daysLeftWarning} days left to file
                  </Badge>
                )}
              </div>

              {/* Balance */}
              <span className="text-xl font-semibold text-foreground">
                {account.balance}
              </span>

              {/* Last Day to File */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Last day to file</span>
                <span className="font-semibold">{account.lastDayToFile}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

