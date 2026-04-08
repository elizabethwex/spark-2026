import * as React from "react";
import {
  Drawer as DrawerRoot,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent as DrawerContentRoot,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { cn } from "../lib/utils";

/**
 * WexDrawer - WEX Design System Drawer Component
 *
 * Slide-out panel for mobile navigation.
 * Uses namespace pattern: WexDrawer.Trigger, WexDrawer.Content, etc.
 *
 * @example
 * <WexDrawer>
 *   <WexDrawer.Trigger asChild>
 *     <WexButton variant="outline">Open Drawer</WexButton>
 *   </WexDrawer.Trigger>
 *   <WexDrawer.Content>
 *     <WexDrawer.Header>
 *       <WexDrawer.Title>Drawer Title</WexDrawer.Title>
 *       <WexDrawer.Description>Description</WexDrawer.Description>
 *     </WexDrawer.Header>
 *     Content here
 *   </WexDrawer.Content>
 * </WexDrawer>
 */

// DrawerRoot is a context provider and doesn't accept refs
const WexDrawerRoot = DrawerRoot as typeof DrawerRoot;

const WexDrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerOverlay>,
  React.ComponentPropsWithoutRef<typeof DrawerOverlay>
>(({ className, ...props }, ref) => (
  <DrawerOverlay
    ref={ref}
    className={cn(
      "bg-wex-drawer-overlay",
      className
    )}
    {...props}
  />
));
WexDrawerOverlay.displayName = "WexDrawer.Overlay";

const WexDrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerContentRoot>,
  React.ComponentPropsWithoutRef<typeof DrawerContentRoot>
>(({ className, children, ...props }, ref) => (
  <DrawerContentRoot
    ref={ref}
    className={cn(
      "wex-drawer-content border-wex-drawer-border bg-wex-drawer-bg",
      className
    )}
    {...props}
  >
    {children}
  </DrawerContentRoot>
));
WexDrawerContent.displayName = "WexDrawer.Content";

export const WexDrawer = Object.assign(WexDrawerRoot, {
  Portal: DrawerPortal,
  Overlay: WexDrawerOverlay,
  Trigger: DrawerTrigger,
  Close: DrawerClose,
  Content: WexDrawerContent,
  Header: DrawerHeader,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
});

