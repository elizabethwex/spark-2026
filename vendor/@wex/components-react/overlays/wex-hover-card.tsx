import * as React from "react";
import {
  HoverCard as HoverCardRoot,
  HoverCardTrigger,
  HoverCardContent as HoverCardContentRoot,
} from "@/components/ui/hover-card";
import { cn } from "../lib/utils";

/**
 * WexHoverCard - WEX Design System Hover Card Component
 *
 * Preview content displayed on hover.
 * Uses namespace pattern: WexHoverCard.Trigger, WexHoverCard.Content
 *
 * @example
 * <WexHoverCard>
 *   <WexHoverCard.Trigger asChild>
 *     <a href="#">Hover over me</a>
 *   </WexHoverCard.Trigger>
 *   <WexHoverCard.Content>
 *     Preview content here
 *   </WexHoverCard.Content>
 * </WexHoverCard>
 */

// HoverCardRoot is a context provider and doesn't accept refs
const WexHoverCardRoot = HoverCardRoot as typeof HoverCardRoot;

const WexHoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardContentRoot>,
  React.ComponentPropsWithoutRef<typeof HoverCardContentRoot>
>(({ className, ...props }, ref) => (
  <HoverCardContentRoot
    ref={ref}
    className={cn(
      "wex-hover-card-content border-wex-hovercard-border bg-wex-hovercard-bg text-wex-hovercard-fg",
      className
    )}
    {...props}
  />
));
WexHoverCardContent.displayName = "WexHoverCard.Content";

export const WexHoverCard = Object.assign(WexHoverCardRoot, {
  Trigger: HoverCardTrigger,
  Content: WexHoverCardContent,
});

