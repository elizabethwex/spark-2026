import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "../lib/utils";

/**
 * WexProgress - WEX Design System Progress Component
 *
 * Progress indicator for tasks with determinate progress.
 * Uses WEX primary color for the progress bar.
 *
 * @example
 * <WexProgress value={33} />
 */

interface WexProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indeterminate?: boolean;
  showLabel?: boolean;
  labelFormat?: (value: number) => string;
}

export const WexProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  WexProgressProps
>(({ className, value, indeterminate, showLabel, labelFormat, ...props }, ref) => {
  const displayValue = value || 0;
  const labelText = labelFormat ? labelFormat(displayValue) : `${Math.round(displayValue)}%`;

  return (
    <div className="relative w-full">
      {showLabel && (
        <div className="absolute -top-5 right-0 text-xs font-medium text-wex-progress-label-fg">
          {labelText}
        </div>
      )}
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full bg-wex-progress-track-bg",
          showLabel && "mt-5",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full bg-wex-progress-indicator-bg transition-all",
            indeterminate && "animate-[progress-indeterminate_2s_ease-in-out_infinite]"
          )}
          style={
            indeterminate
              ? { width: "30%", transform: "translateX(-100%)" }
              : { transform: `translateX(-${100 - displayValue}%)` }
          }
        />
      </ProgressPrimitive.Root>
    </div>
  );
});
WexProgress.displayName = "WexProgress";

