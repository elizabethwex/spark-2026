import {
  CardContent,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { ResponsiveBar, type BarDatum } from "@nivo/bar";
import { Pie, PieChart, Cell } from "recharts";
import { AlertCircle } from "lucide-react";
import { hsaContributionBars, paidClaimsCategoryData } from "@/data/mockData";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

const WEX_BLUE       = "hsl(208, 100%, 32%)";
const WEX_BLUE_MUTED = "hsl(208, 60%, 88%)";
const CLAIMS_COLORS  = [
  "hsl(208, 100%, 32%)",
  "hsl(203, 68%,  47%)",
  "hsl(198, 87%,  40%)",
];

const Y_TICKS = [0, 2000, 4000, 6000, 8000, 10000];

const nivoTheme = {
  axis: {
    ticks: {
      text: { fill: "#64748b", fontSize: 12, fontFamily: "inherit" },
    },
    domain: { line: { stroke: "transparent" } },
  },
  grid: {
    line: { stroke: "#e2e8f0", strokeDasharray: "3 3" },
  },
  tooltip: {
    container: {
      background: "#ffffff",
      borderRadius: "10px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      padding: "10px 14px",
      fontSize: "13px",
      fontFamily: "inherit",
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ContributedOverlay = ({ bars }: any) => (
  <g>
    {bars.map((bar: any) => {
      const d = hsaContributionBars.find(
        (b) => b.year === bar.data.indexValue,
      );
      if (!d) return null;
      const ratio = d.contributed / d.irsMax;
      const contributedHeight = bar.height * ratio;
      return (
        <rect
          key={`contributed-${bar.key}`}
          x={bar.x}
          y={bar.y + bar.height - contributedHeight}
          width={bar.width}
          height={contributedHeight}
          rx={6}
          ry={6}
          fill={WEX_BLUE}
          pointerEvents="none"
        />
      );
    })}
  </g>
);

const claimsChartConfig = {
  Medical: { label: "Medical", color: CLAIMS_COLORS[0] },
  Dental:  { label: "Dental",  color: CLAIMS_COLORS[1] },
  Vision:  { label: "Vision",  color: CLAIMS_COLORS[2] },
} satisfies ChartConfig;

export function QuickViewSection({ activeView = 1 }: { activeView?: 1 | 2 | 3 }) {
  const totalPaid = paidClaimsCategoryData.reduce((sum, d) => sum + d.amount, 0);
  const pieData   = paidClaimsCategoryData.map((d) => ({ name: d.category, value: d.amount }));

  return (
    <GlassCard>
      <CardContent className="p-6">
        <div className="space-y-5">

          <SectionHeader
            title="Quick View"
          />

          <div className={cn(
            "grid grid-cols-1 gap-6",
            activeView !== 2 && "lg:grid-cols-2 lg:divide-x lg:divide-slate-200"
          )}>

            {activeView !== 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">
                    HSA Contributions by Tax Year
                  </h3>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="h-[320px]">
                  <ResponsiveBar
                    data={hsaContributionBars as unknown as BarDatum[]}
                    keys={["irsMax"]}
                    indexBy="year"
                    colors={[WEX_BLUE_MUTED]}
                    borderRadius={6}
                    padding={0.4}
                    valueScale={{ type: "linear", max: 10000 }}
                    margin={{ top: 10, right: 10, bottom: 40, left: 50 }}
                    enableLabel={false}
                    enableGridX={false}
                    gridYValues={Y_TICKS}
                    axisLeft={{
                      tickValues: Y_TICKS,
                      tickSize: 0,
                      tickPadding: 12,
                      format: (v) => `$${(v as number) / 1000}K`,
                    }}
                    axisBottom={{
                      tickSize: 0,
                      tickPadding: 12,
                    }}
                    theme={nivoTheme}
                    animate
                    motionConfig="gentle"
                    layers={["grid", "axes", "bars", ContributedOverlay, "markers", "legends", "annotations"]}
                    tooltip={({ indexValue }) => {
                      const d = hsaContributionBars.find((b) => b.year === indexValue);
                      if (!d) return null;
                      return (
                        <div className="bg-white rounded-xl shadow-lg px-3 py-2 text-sm border border-slate-100">
                          <div className="font-semibold text-foreground mb-1">{indexValue} Tax Year</div>
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-sm inline-block flex-shrink-0"
                              style={{ background: WEX_BLUE }}
                            />
                            <span className="text-muted-foreground">Your contributions:</span>
                            <span className="font-medium text-foreground">${d.contributed.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-sm inline-block flex-shrink-0"
                              style={{ background: WEX_BLUE_MUTED }}
                            />
                            <span className="text-muted-foreground">Remaining to max:</span>
                            <span className="font-medium text-foreground">${d.remaining.toLocaleString()}</span>
                          </div>
                          <div className="border-t border-slate-100 mt-1.5 pt-1.5 flex items-center justify-between">
                            <span className="text-muted-foreground">IRS Max:</span>
                            <span className="font-semibold text-foreground">${d.irsMax.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    }}
                  />
                </div>

                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: WEX_BLUE }} />
                    <span className="text-muted-foreground">Your Contributions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm border border-slate-200" style={{ backgroundColor: WEX_BLUE_MUTED }} />
                    <span className="text-muted-foreground">Remaining to IRS Max</span>
                  </div>
                </div>
              </div>
            )}

            <div className={cn("space-y-4", activeView !== 2 ? "lg:pl-6" : "max-w-2xl mx-auto w-full")}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">Paid Claims by Category</h3>
                <span className="text-sm text-muted-foreground">01/01/2026 – 12/31/2026</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative flex-shrink-0" style={{ width: 200, height: 200 }}>
                  <ChartContainer config={claimsChartConfig} className="h-full w-full">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={62}
                        outerRadius={95}
                        paddingAngle={3}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        strokeWidth={0}
                      >
                        {pieData.map((_, i) => (
                          <Cell key={`cell-${i}`} fill={CLAIMS_COLORS[i % CLAIMS_COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        formatter={(value) => [`$${value}`, ""]}
                      />
                    </PieChart>
                  </ChartContainer>

                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-foreground">${totalPaid.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">Total Paid</span>
                  </div>
                </div>

                <div className="flex-1 space-y-5">
                  {paidClaimsCategoryData.map((item, i) => (
                    <div key={item.category} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: CLAIMS_COLORS[i] }}
                          />
                          <span className="font-medium text-foreground">{item.category}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground">{item.percentage}%</span>
                          <span className="font-semibold text-foreground tabular-nums">
                            ${item.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: CLAIMS_COLORS[i],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </CardContent>
    </GlassCard>
  );
}
