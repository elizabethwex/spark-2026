import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/**
 * WexLabel - WEX Design System Label Component
 *
 * Accessible label for form controls.
 * Simple pass-through wrapper for the vendor primitive.
 *
 * @example
 * <WexLabel htmlFor="email">Email</WexLabel>
 * <WexInput id="email" type="email" />
 */

// ============================================================================
// Base Label Component (from Radix/shadcn)
// ============================================================================

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

// ============================================================================
// WEX Wrappers
// ============================================================================

export const WexLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => (
  <Label
    ref={ref}
    className={cn("wex-label", className)}
    {...props}
  />
));
WexLabel.displayName = "WexLabel";
