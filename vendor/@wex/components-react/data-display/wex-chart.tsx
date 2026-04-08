import * as React from "react";
import {
  ChartContainer as ChartContainerRoot,
  ChartTooltip,
  ChartTooltipContent as ChartTooltipContentBase,
  ChartLegend,
  ChartLegendContent as ChartLegendContentBase,
  ChartStyle,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { cn } from "../lib/utils";

/**
 * WexChart - WEX Design System Chart Component
 *
 * Data visualization components.
 * Uses namespace pattern: WexChart.Container, WexChart.Tooltip, etc.
 *
 * TOKEN GAPS:
 * Chart colors (--wex-chart-1 through --wex-chart-5) are placeholders.
 * Real brand chart colors need to be defined by the design team.
 *
 * @example
 * <WexChart.Container config={chartConfig}>
 *   <BarChart data={data}>
 *     <WexChart.Tooltip content={<WexChart.TooltipContent />} />
 *     <Bar dataKey="value" fill="var(--chart-1)" />
 *   </BarChart>
 * </WexChart.Container>
 */

const WexChartContainer = React.forwardRef<
  React.ElementRef<typeof ChartContainerRoot>,
  React.ComponentPropsWithoutRef<typeof ChartContainerRoot>
>(({ className, ...props }, ref) => (
  <ChartContainerRoot
    ref={ref}
    className={cn("wex-chart-container", className)}
    {...props}
  />
));
WexChartContainer.displayName = "WexChart.Container";

const WexChartTooltipContent = React.forwardRef<
  React.ElementRef<typeof ChartTooltipContentBase>,
  React.ComponentPropsWithoutRef<typeof ChartTooltipContentBase>
>(({ className, ...props }, ref) => (
  <ChartTooltipContentBase
    ref={ref}
    className={cn(
      "border-wex-chart-tooltip-border bg-wex-chart-tooltip-bg text-wex-chart-tooltip-fg",
      className
    )}
    {...props}
  />
));
WexChartTooltipContent.displayName = "WexChart.TooltipContent";

const WexChartLegendContent = React.forwardRef<
  React.ElementRef<typeof ChartLegendContentBase>,
  React.ComponentPropsWithoutRef<typeof ChartLegendContentBase>
>(({ className, ...props }, ref) => (
  <ChartLegendContentBase
    ref={ref}
    className={cn(
      "[&>svg]:text-wex-chart-axis-fg [&_span]:text-wex-chart-fg",
      className
    )}
    {...props}
  />
));
WexChartLegendContent.displayName = "WexChart.LegendContent";

export const WexChart = {
  Container: WexChartContainer,
  Tooltip: ChartTooltip,
  TooltipContent: WexChartTooltipContent,
  Legend: ChartLegend,
  LegendContent: WexChartLegendContent,
  Style: ChartStyle,
};

export type { ChartConfig as WexChartConfig };

