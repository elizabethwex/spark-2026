import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../lib/utils";

/**
 * WexSlider - WEX Design System Slider Component
 *
 * Range input for selecting values within a range.
 * Uses WEX sizing tokens for accessible touch targets.
 *
 * @example
 * <WexSlider defaultValue={[50]} max={100} step={1} />
 * <WexSlider defaultValue={[25, 75]} max={100} step={1} /> // Range slider with two thumbs
 */

export const WexSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, defaultValue, value, "aria-label": ariaLabel, ...props }, ref) => {
  // Determine the number of thumbs needed based on defaultValue or value
  const values = value ?? defaultValue ?? [0];
  const thumbCount = Array.isArray(values) ? values.length : 1;

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      defaultValue={defaultValue}
      value={value}
      aria-label={ariaLabel}
      {...props}
    >
      <SliderPrimitive.Track className={cn(
        "relative h-2 w-full grow overflow-hidden rounded-full",
        props.disabled ? "bg-wex-slider-track-bg opacity-50" : "bg-wex-slider-track-bg"
      )}>
        <SliderPrimitive.Range className={cn(
          "absolute h-full z-0",
          props.disabled ? "bg-wex-slider-range-bg opacity-50" : "bg-wex-slider-range-bg"
        )} />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }).map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className={cn(
            "block h-5 w-5 rounded-full border-2 shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wex-slider-focus-ring disabled:pointer-events-none relative z-20",
            props.disabled 
              ? "border-wex-slider-disabled-thumb-border bg-wex-slider-disabled-thumb-bg cursor-default"
              : "border-wex-slider-thumb-border bg-wex-slider-thumb-bg cursor-grab active:cursor-grabbing"
          )}
          aria-label={thumbCount > 1 
            ? `${ariaLabel || "Slider"} thumb ${index + 1}` 
            : ariaLabel || "Slider"}
          style={props.disabled ? { 
            opacity: 1,
            zIndex: 20
          } : undefined}
        />
      ))}
    </SliderPrimitive.Root>
  );
});
WexSlider.displayName = "WexSlider";

