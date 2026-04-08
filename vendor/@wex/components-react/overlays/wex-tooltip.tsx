import * as React from "react";
import {
  Tooltip as TooltipRoot,
  TooltipTrigger,
  TooltipContent as TooltipContentBase,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "../lib/utils";

/**
 * WexTooltip - WEX Design System Tooltip Component
 *
 * Popup info displayed on hover/focus.
 * Uses namespace pattern: WexTooltip.Trigger, WexTooltip.Content, WexTooltip.Provider
 *
 * @example
 * <WexTooltip.Provider>
 *   <WexTooltip>
 *     <WexTooltip.Trigger asChild>
 *       <WexButton variant="outline">Hover me</WexButton>
 *     </WexTooltip.Trigger>
 *     <WexTooltip.Content>
 *       <p>Tooltip content</p>
 *     </WexTooltip.Content>
 *   </WexTooltip>
 * </WexTooltip.Provider>
 */

// TooltipRoot is a context provider and doesn't accept refs
// Use the Root from UI components which is already properly set up
const WexTooltipRoot = TooltipRoot;

const WexTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipContentBase>,
  React.ComponentPropsWithoutRef<typeof TooltipContentBase>
>(({ className, ...props }, ref) => (
  <TooltipContentBase
    ref={ref}
    className={cn(
      "bg-wex-tooltip-bg text-wex-tooltip-fg",
      className
    )}
    {...props}
  />
));
WexTooltipContent.displayName = "WexTooltip.Content";

export const WexTooltip = Object.assign(WexTooltipRoot, {
  Trigger: TooltipTrigger,
  Content: WexTooltipContent,
  Provider: TooltipProvider,
});

