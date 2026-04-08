import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "../lib/utils";

/**
 * WexSwitch - WEX Design System Switch Component
 *
 * Toggle control for switching between two states.
 * Uses WEX sizing tokens for accessible touch targets.
 *
 * @example
 * <div className="flex items-center space-x-2">
 *   <WexSwitch id="airplane-mode" />
 *   <WexLabel htmlFor="airplane-mode">Airplane Mode</WexLabel>
 * </div>
 */

export const WexSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wex-switch-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-[var(--wex-component-switch-disabled-opacity)] data-[state=checked]:bg-wex-switch-checked-bg data-[state=unchecked]:bg-wex-switch-bg",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-wex-switch-thumb shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
));
WexSwitch.displayName = "WexSwitch";

