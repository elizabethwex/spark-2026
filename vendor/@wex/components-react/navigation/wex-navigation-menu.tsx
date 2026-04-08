import * as React from "react";
import {
  NavigationMenu as NavigationMenuRoot,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent as NavigationMenuContentBase,
  NavigationMenuTrigger as NavigationMenuTriggerBase,
  NavigationMenuLink,
  NavigationMenuIndicator as NavigationMenuIndicatorBase,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "../lib/utils";

/**
 * WexNavigationMenu - WEX Design System Navigation Menu Component
 *
 * Collection of navigation links with dropdowns.
 * Uses namespace pattern: WexNavigationMenu.List, WexNavigationMenu.Item, etc.
 *
 * @example
 * <WexNavigationMenu>
 *   <WexNavigationMenu.List>
 *     <WexNavigationMenu.Item>
 *       <WexNavigationMenu.Trigger>Getting started</WexNavigationMenu.Trigger>
 *       <WexNavigationMenu.Content>
 *         <WexNavigationMenu.Link href="/docs">Documentation</WexNavigationMenu.Link>
 *       </WexNavigationMenu.Content>
 *     </WexNavigationMenu.Item>
 *   </WexNavigationMenu.List>
 * </WexNavigationMenu>
 */

const WexNavigationMenuRoot = React.forwardRef<
  React.ElementRef<typeof NavigationMenuRoot>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuRoot>
>(({ className, ...props }, ref) => (
  <NavigationMenuRoot
    ref={ref}
    className={cn("wex-navigation-menu", className)}
    {...props}
  />
));
WexNavigationMenuRoot.displayName = "WexNavigationMenu";

const WexNavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuTriggerBase>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuTriggerBase>
>(({ className, ...props }, ref) => (
  <NavigationMenuTriggerBase
    ref={ref}
    className={cn(
      "group inline-flex h-9 w-max items-center justify-center rounded-md bg-wex-navmenu-trigger-bg px-4 py-2 text-sm font-medium transition-colors hover:bg-wex-navmenu-trigger-hover-bg focus:bg-wex-navmenu-trigger-focus-bg focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-wex-navmenu-trigger-hover-bg/50 data-[state=open]:hover:bg-wex-navmenu-trigger-hover-bg data-[state=open]:focus:bg-wex-navmenu-trigger-focus-bg",
      className
    )}
    {...props}
  />
));
WexNavigationMenuTrigger.displayName = "WexNavigationMenu.Trigger";

const WexNavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuContentBase>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuContentBase>
>(({ className, ...props }, ref) => (
  <NavigationMenuContentBase
    ref={ref}
    className={cn("bg-wex-navmenu-content-bg", className)}
    {...props}
  />
));
WexNavigationMenuContent.displayName = "WexNavigationMenu.Content";

const WexNavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuIndicatorBase>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuIndicatorBase>
>(({ className, ...props }, ref) => (
  <NavigationMenuIndicatorBase
    ref={ref}
    className={cn("bg-wex-navmenu-indicator", className)}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-wex-navmenu-indicator shadow-md" />
  </NavigationMenuIndicatorBase>
));
WexNavigationMenuIndicator.displayName = "WexNavigationMenu.Indicator";

export const WexNavigationMenu = Object.assign(WexNavigationMenuRoot, {
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Content: WexNavigationMenuContent,
  Trigger: WexNavigationMenuTrigger,
  Link: NavigationMenuLink,
  Indicator: WexNavigationMenuIndicator,
  Viewport: NavigationMenuViewport,
});

export { navigationMenuTriggerStyle as wexNavigationMenuTriggerStyle };
