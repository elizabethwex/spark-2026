import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * WexRadioGroup - WEX Design System Radio Group Component
 *
 * Set of checkable radio buttons for single-choice selection.
 * Uses namespace pattern: WexRadioGroup.Item
 *
 * @example
 * <WexRadioGroup defaultValue="option-one">
 *   <div className="flex items-center space-x-2">
 *     <WexRadioGroup.Item value="option-one" id="option-one" />
 *     <WexLabel htmlFor="option-one">Option One</WexLabel>
 *   </div>
 *   <div className="flex items-center space-x-2">
 *     <WexRadioGroup.Item value="option-two" id="option-two" />
 *     <WexLabel htmlFor="option-two">Option Two</WexLabel>
 *   </div>
 * </WexRadioGroup>
 */

// ============================================================================
// Base RadioGroup Components (from Radix/shadcn)
// ============================================================================

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-wex-radio-border text-wex-radio-border shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-wex-radio-focus-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:text-primary",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-3.5 w-3.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

// ============================================================================
// WEX Wrappers
// ============================================================================

const WexRadioGroupRoot = React.forwardRef<
  React.ElementRef<typeof RadioGroup>,
  React.ComponentPropsWithoutRef<typeof RadioGroup>
>(({ className, ...props }, ref) => (
  <RadioGroup
    ref={ref}
    className={cn("wex-radio-group", className)}
    {...props}
  />
));
WexRadioGroupRoot.displayName = "WexRadioGroup";

const WexRadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    radioSize?: "sm" | "md" | "lg";
  }
>(({ className, radioSize = "md", ...props }, ref) => {
  const radioIndicatorSizes = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
  };

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-wex-radio-border bg-wex-radio-bg text-wex-radio-border ring-offset-background focus:outline-none focus-visible:ring-1 focus-visible:ring-wex-radio-focus-ring disabled:cursor-not-allowed disabled:opacity-[var(--wex-component-radio-disabled-opacity)] data-[state=checked]:border-primary data-[state=checked]:text-primary",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className={cn(radioIndicatorSizes[radioSize], "fill-current text-current")} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
WexRadioGroupItem.displayName = "WexRadioGroup.Item";

export const WexRadioGroup = Object.assign(WexRadioGroupRoot, {
  Item: WexRadioGroupItem,
});
