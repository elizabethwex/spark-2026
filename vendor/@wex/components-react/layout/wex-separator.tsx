import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "../lib/utils";

/**
 * WexSeparator - WEX Design System Separator Component
 *
 * Visual divider between content sections.
 * Simple pass-through wrapper for the vendor primitive.
 *
 * @example
 * <WexSeparator />
 * <WexSeparator orientation="vertical" />
 */

export const WexSeparator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "shrink-0 bg-wex-separator-bg",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    {...props}
  />
));
WexSeparator.displayName = "WexSeparator";

