import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../lib/utils";

/**
 * WexPopover - WEX Design System Popover Component
 *
 * Floating content triggered by a button.
 * Uses namespace pattern: WexPopover.Trigger, WexPopover.Content
 *
 * @example
 * <WexPopover>
 *   <WexPopover.Trigger asChild>
 *     <WexButton variant="outline">Open Popover</WexButton>
 *   </WexPopover.Trigger>
 *   <WexPopover.Content>
 *     Popover content here
 *   </WexPopover.Content>
 * </WexPopover>
 */

// ============================================================================
// Base Popover Components (from Radix/shadcn)
// ============================================================================

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-wex-popover-bg p-4 text-wex-popover-fg shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// ============================================================================
// WEX Wrappers
// ============================================================================

// PopoverRoot is a context provider and doesn't accept refs
const WexPopoverRoot = Popover as typeof Popover;

const WexPopoverTrigger = PopoverTrigger;

const WexPopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, ...props }, ref) => (
  <PopoverContent
    ref={ref}
    className={cn(
      "wex-popover-content border-wex-popover-border bg-wex-popover-bg text-wex-popover-fg",
      className
    )}
    {...props}
  />
));
WexPopoverContent.displayName = "WexPopover.Content";

const WexPopoverAnchor = PopoverAnchor;

export const WexPopover = Object.assign(WexPopoverRoot, {
  Trigger: WexPopoverTrigger,
  Content: WexPopoverContent,
  Anchor: WexPopoverAnchor,
});

// Export individual components for direct imports
export { WexPopoverTrigger, WexPopoverContent, WexPopoverAnchor };
