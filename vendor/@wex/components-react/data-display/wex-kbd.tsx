import * as React from "react";
import { cn } from "../lib/utils";

/**
 * WexKbd - WEX Design System Keyboard Key Component
 *
 * Displays keyboard shortcuts or key combinations.
 * Uses namespace pattern: WexKbd.Group
 *
 * @example
 * <WexKbd>⌘</WexKbd>
 * <WexKbd.Group>
 *   <WexKbd>⌘</WexKbd>
 *   <WexKbd>K</WexKbd>
 * </WexKbd.Group>
 */

// ============================================================================
// Base Kbd Components (from shadcn)
// ============================================================================

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "bg-wex-kbd-bg text-wex-kbd-fg border border-wex-kbd-border pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium",
        "[&_svg:not([class*='size-'])]:size-3",
        "[[data-slot=tooltip-content]_&]:bg-wex-tooltip-bg/15 [[data-slot=tooltip-content]_&]:text-wex-tooltip-fg",
        className
      )}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}

// ============================================================================
// WEX Wrappers
// ============================================================================

const WexKbdRoot = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof Kbd>
>(({ className, ...props }, ref) => (
  <Kbd
    ref={ref}
    className={cn(
      "bg-wex-kbd-bg text-wex-kbd-fg border-wex-kbd-border",
      className
    )}
    {...props}
  />
));
WexKbdRoot.displayName = "WexKbd";

export const WexKbd = Object.assign(WexKbdRoot, {
  Group: KbdGroup,
});
