import { Alert, AlertDescription, Button, Card, CardContent, Input, Switch, Label } from "@wexinc-healthbenefits/ben-ui-kit";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Bell, Menu, Search, MoreHorizontal, AlertTriangle } from "lucide-react";

const MOCK_CHART_DATA = [
  { month: "Jan", value: 4200 },
  { month: "Feb", value: 4500 },
  { month: "Mar", value: 4800 },
  { month: "Apr", value: 5100 },
  { month: "May", value: 5200 },
  { month: "Jun", value: 5550 },
];

interface ThemingEnginePreviewDashboardProps {
  darkMode?: boolean;
}

export function ThemingEnginePreviewDashboard({ darkMode: _darkMode }: ThemingEnginePreviewDashboardProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Mock header */}
      <header className="flex items-center gap-4 pb-4 border-b border-border">
        <button type="button" className="p-2 rounded-md hover:bg-muted" aria-label="Menu">
          <Menu className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1 flex items-center gap-2 rounded-md border border-input bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4 shrink-0" />
          <span>Ask the assistant or browse...</span>
        </div>
        <button type="button" className="p-2 rounded-md hover:bg-muted" aria-label="Notifications">
          <Bell className="h-5 w-5 text-foreground" />
        </button>
        <button type="button" className="p-2 rounded-md hover:bg-muted" aria-label="More">
          <MoreHorizontal className="h-5 w-5 text-foreground" />
        </button>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground">
          EM
        </div>
      </header>

      <h1 className="text-2xl font-display font-semibold text-foreground">
        Welcome back, Crystal
      </h1>

      {/* Alert card */}
      <Alert intent="destructive" className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <AlertDescription className="text-sm font-medium">Your recent claim was denied.</AlertDescription>
      </Alert>

      {/* Account cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                HSA Cash
              </p>
              <p className="text-xl font-display font-bold text-foreground">$1,500.00</p>
            </div>
            <Button intent="primary" size="sm">
              Reimburse Myself
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                HSA Investment Balance
              </p>
              <p className="text-xl font-display font-bold text-foreground">$5,550.00</p>
            </div>
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                  <YAxis hide />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Balance"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-invest-preview" className="text-sm text-foreground">
                Auto Invest ON
              </Label>
              <Switch id="auto-invest-preview" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Buttons row */}
      <div className="flex flex-wrap gap-2">
        <Button intent="secondary" variant="link" size="sm">
          Link
        </Button>
        <Button intent="secondary" variant="outline" size="sm">
          Secondary Button
        </Button>
        <Button intent="primary" size="sm">
          Primary Button
        </Button>
      </div>

      {/* Input sample */}
      <div className="space-y-2">
        <Label htmlFor="preview-input" className="text-sm text-foreground">
          Sample input
        </Label>
        <Input id="preview-input" placeholder="Label" className="max-w-xs" />
      </div>
    </div>
  );
}
