import { Card, CardContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@wexinc-healthbenefits/ben-ui-kit";
import { previousPlanYearData, dateRangeOptions } from "./mockData";

/**
 * Previous Plan Year Table Component
 * 
 * Displays previous plan year accounts:
 * - Header with title and date range dropdown
 * - Table with year, account, election amount, claims, forfeited, rollover
 */
export function PreviousPlanYearTable() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Previous Plan Year
            </h2>
            <Select defaultValue="2024">
              <SelectTrigger className="w-[309px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Election Amount</TableHead>
                  <TableHead className="text-right">Claims Processed</TableHead>
                  <TableHead className="text-right">Amount Forfeited</TableHead>
                  <TableHead className="text-right">Amount Rollover</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previousPlanYearData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>{row.account}</TableCell>
                    <TableCell className="text-right">{row.electionAmount}</TableCell>
                    <TableCell className="text-right">{row.claimsProcessed}</TableCell>
                    <TableCell className="text-right">{row.amountForfeited}</TableCell>
                    <TableCell className="text-right">{row.amountRollover}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

