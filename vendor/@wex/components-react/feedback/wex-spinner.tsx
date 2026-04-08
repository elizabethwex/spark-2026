import * as React from "react";
import { Spinner as SpinnerRoot } from "@/components/ui/spinner";
import { cn } from "../lib/utils";

/**
 * WexSpinner - WEX Design System Spinner Component
 *
 * Loading indicator spinner.
 * Simple pass-through wrapper for the vendor primitive.
 *
 * @example
 * <WexSpinner />
 * <WexButton disabled>
 *   <WexSpinner className="mr-2" />
 *   Loading...
 * </WexButton>
 */

export const WexSpinner = React.forwardRef<
  React.ElementRef<typeof SpinnerRoot>,
  React.ComponentPropsWithoutRef<typeof SpinnerRoot>
>(({ className, ...props }, ref) => (
  <SpinnerRoot
    ref={ref}
    className={cn("wex-spinner", className)}
    {...props}
  />
));
WexSpinner.displayName = "WexSpinner";

