import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "../lib/utils";

/**
 * WexScrollArea - WEX Design System Scroll Area Component
 *
 * Custom scrollable viewport with accessibility enhancements.
 * Uses namespace pattern: WexScrollArea.Bar
 *
 * @example
 * <WexScrollArea className="h-72 w-48 rounded-md border">
 *   <div className="p-4">
 *     Long scrollable content here
 *   </div>
 *   <WexScrollArea.Bar orientation="vertical" />
 * </WexScrollArea>
 */

// ============================================================================
// Base ScrollArea Components (from Radix/shadcn)
// ============================================================================

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-wex-scrollarea-thumb-bg" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

// ============================================================================
// WEX Wrappers
// ============================================================================

const WexScrollAreaRoot = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      className="h-full w-full rounded-[inherit]"
      tabIndex={0}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
WexScrollAreaRoot.displayName = "WexScrollArea";

export const WexScrollArea = Object.assign(WexScrollAreaRoot, {
  Bar: ScrollBar,
});
