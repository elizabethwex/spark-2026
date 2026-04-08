import * as React from "react";
import {
  ButtonGroup as ButtonGroupRoot,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";
import { cn } from "../lib/utils";

/**
 * WexButtonGroup - WEX Design System Button Group Component
 *
 * Container for grouping related buttons.
 * Uses namespace pattern: WexButtonGroup.Separator, WexButtonGroup.Text
 *
 * @example
 * <WexButtonGroup>
 *   <WexButton variant="outline">Left</WexButton>
 *   <WexButton variant="outline">Center</WexButton>
 *   <WexButton variant="outline">Right</WexButton>
 * </WexButtonGroup>
 */

const WexButtonGroupRoot = React.forwardRef<
  React.ElementRef<typeof ButtonGroupRoot>,
  React.ComponentPropsWithoutRef<typeof ButtonGroupRoot>
>(({ className, ...props }, ref) => (
  <ButtonGroupRoot
    ref={ref}
    className={cn("wex-button-group", className)}
    {...props}
  />
));
WexButtonGroupRoot.displayName = "WexButtonGroup";

export const WexButtonGroup = Object.assign(WexButtonGroupRoot, {
  Separator: ButtonGroupSeparator,
  Text: ButtonGroupText,
});

