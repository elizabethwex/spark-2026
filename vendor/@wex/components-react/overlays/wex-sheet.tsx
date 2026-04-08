import {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

/**
 * WexSheet - WEX Design System Sheet Component
 *
 * Slide-out panel from screen edge.
 * Uses namespace pattern: WexSheet.Trigger, WexSheet.Content, etc.
 *
 * @example
 * <WexSheet>
 *   <WexSheet.Trigger asChild>
 *     <WexButton variant="outline">Open Sheet</WexButton>
 *   </WexSheet.Trigger>
 *   <WexSheet.Content>
 *     <WexSheet.Header>
 *       <WexSheet.Title>Sheet Title</WexSheet.Title>
 *       <WexSheet.Description>Sheet description</WexSheet.Description>
 *     </WexSheet.Header>
 *     Content here
 *   </WexSheet.Content>
 * </WexSheet>
 */

import * as React from "react";
import { cn } from "../lib/utils";

// CRITICAL: Dialog and Sheet share the same Radix primitive (@radix-ui/react-dialog)
// We must create a wrapper function to avoid mutating the shared Root object
// If we use Object.assign directly on Sheet, Dialog will overwrite Sheet's Content
const WexSheetRoot = ((props: React.ComponentProps<typeof Sheet>) => (
  <Sheet {...props} />
)) as typeof Sheet;

interface WexSheetContentProps extends React.ComponentPropsWithoutRef<typeof SheetContent> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const WexSheetContent = React.forwardRef<
  React.ElementRef<typeof SheetContent>,
  WexSheetContentProps
>(({ className, side = "right", size = "md", ...props }, ref) => {
  const sizeClasses = {
    sm: side === "left" || side === "right" ? "!w-64 !max-w-64" : "!h-64 !max-h-64",
    md: side === "left" || side === "right" ? "!w-96 !max-w-96" : "!h-96 !max-h-96",
    lg: side === "left" || side === "right" ? "!w-[32rem] !max-w-[32rem]" : "!h-[32rem] !max-h-[32rem]",
    xl: side === "left" || side === "right" ? "!w-[42rem] !max-w-[42rem]" : "!h-[42rem] !max-h-[42rem]",
    full: side === "left" || side === "right" ? "!w-screen !h-screen !max-w-none !max-h-none" : "!w-screen !h-screen !max-w-none !max-h-none",
  };
  const borderClass =
    side === "bottom"
      ? "border-t border-wex-sheet-border"
      : side === "top"
      ? "border-b border-wex-sheet-border"
      : side === "left"
      ? "border-r border-wex-sheet-border"
      : "border-l border-wex-sheet-border";
  return (
    <SheetContent
      ref={ref}
      side={side}
      className={cn("wex-sheet-content bg-wex-sheet-bg", borderClass, sizeClasses[size], className)}
      {...props}
    />
  );
});
WexSheetContent.displayName = "WexSheet.Content";

const WexSheetRootWithNamespace: typeof WexSheetRoot & {
  Portal: typeof SheetPortal;
  Overlay: typeof SheetOverlay;
  Trigger: typeof SheetTrigger;
  Close: typeof SheetClose;
  Content: typeof WexSheetContent;
  Header: typeof SheetHeader;
  Footer: typeof SheetFooter;
  Title: typeof SheetTitle;
  Description: typeof SheetDescription;
} = Object.assign(WexSheetRoot, {
  Portal: SheetPortal,
  Overlay: SheetOverlay,
  Trigger: SheetTrigger,
  Close: SheetClose,
  Content: WexSheetContent,
  Header: SheetHeader,
  Footer: SheetFooter,
  Title: SheetTitle,
  Description: SheetDescription,
});

export const WexSheet = WexSheetRootWithNamespace;

