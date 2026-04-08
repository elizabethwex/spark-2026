import * as React from "react";
import {
  Collapsible as CollapsibleRoot,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { cn } from "../lib/utils";

/**
 * WexCollapsible - WEX Design System Collapsible Component
 *
 * Expandable/collapsible content section.
 * Uses namespace pattern: WexCollapsible.Trigger, WexCollapsible.Content
 *
 * @example
 * <WexCollapsible>
 *   <WexCollapsible.Trigger>Toggle</WexCollapsible.Trigger>
 *   <WexCollapsible.Content>
 *     Hidden content revealed on toggle
 *   </WexCollapsible.Content>
 * </WexCollapsible>
 */

const WexCollapsibleRoot = React.forwardRef<
  React.ElementRef<typeof CollapsibleRoot>,
  React.ComponentPropsWithoutRef<typeof CollapsibleRoot>
>(({ className, ...props }, ref) => (
  <CollapsibleRoot
    ref={ref}
    className={cn("wex-collapsible", className)}
    {...props}
  />
));
WexCollapsibleRoot.displayName = "WexCollapsible";

export const WexCollapsible = Object.assign(WexCollapsibleRoot, {
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
});

