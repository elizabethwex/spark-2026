import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/**
 * WexToggle - WEX Design System Toggle Component
 *
 * Two-state button for toggling between states.
 * Uses vendor variant prop (not intent) - pass-through wrapper.
 *
 * @example
 * <WexToggle aria-label="Toggle italic">
 *   <Italic className="h-4 w-4" />
 * </WexToggle>
 */

const wexToggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium text-wex-toggle-fg transition-colors hover:bg-wex-toggle-hover-bg hover:text-wex-toggle-hover-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-wex-toggle-focus-ring disabled:pointer-events-none disabled:opacity-[var(--wex-component-toggle-disabled-opacity)] data-[state=on]:bg-wex-toggle-pressed-bg data-[state=on]:text-wex-toggle-pressed-fg [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-wex-toggle-bg",
        outline:
          "border border-wex-toggle-border bg-wex-toggle-bg shadow-sm hover:bg-wex-toggle-hover-bg hover:text-wex-toggle-hover-fg",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const WexToggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof wexToggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(wexToggleVariants({ variant, size, className }))}
    {...props}
  />
));
WexToggle.displayName = "WexToggle";

