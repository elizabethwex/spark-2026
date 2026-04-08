import * as React from "react";
import { ToggleGroup as ToggleGroupRoot, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "../lib/utils";

/**
 * WexToggleGroup - WEX Design System Toggle Group Component
 *
 * Set of two-state buttons for grouped toggles.
 * Uses namespace pattern: WexToggleGroup.Item
 *
 * @example
 * <WexToggleGroup type="single">
 *   <WexToggleGroup.Item value="left" aria-label="Align left">
 *     <AlignLeft className="h-4 w-4" />
 *   </WexToggleGroup.Item>
 *   <WexToggleGroup.Item value="center" aria-label="Align center">
 *     <AlignCenter className="h-4 w-4" />
 *   </WexToggleGroup.Item>
 * </WexToggleGroup>
 */

const WexToggleGroupRoot = React.forwardRef<
  React.ElementRef<typeof ToggleGroupRoot>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupRoot>
>(({ className, ...props }, ref) => (
  <ToggleGroupRoot
    ref={ref}
    className={cn("wex-toggle-group", className)}
    {...props}
  />
));
WexToggleGroupRoot.displayName = "WexToggleGroup";

export const WexToggleGroup = Object.assign(WexToggleGroupRoot, {
  Item: ToggleGroupItem,
});

