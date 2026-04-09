import * as React from "react";
import { AspectRatio as AspectRatioRoot } from "@/components/ui/aspect-ratio";
import { cn } from "../lib/utils";

/**
 * WexAspectRatio - WEX Design System Aspect Ratio Component
 *
 * Displays content within a desired aspect ratio.
 * Simple pass-through wrapper for the vendor primitive.
 *
 * @example
 * <WexAspectRatio ratio={16 / 9}>
 *   <img src="..." alt="..." className="rounded-md object-cover" />
 * </WexAspectRatio>
 */

export const WexAspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioRoot>,
  React.ComponentPropsWithoutRef<typeof AspectRatioRoot>
>(({ className, ...props }, ref) => (
  <AspectRatioRoot
    ref={ref}
    className={cn("wex-aspect-ratio", className)}
    {...props}
  />
));
WexAspectRatio.displayName = "WexAspectRatio";

