import * as React from "react";
import {
  Sidebar as SidebarRoot,
  SidebarContent as SidebarContentBase,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput as SidebarInputBase,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton as SidebarMenuButtonBase,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "../lib/utils";

/**
 * WexSidebar - WEX Design System Sidebar Component
 *
 * Collapsible navigation sidebar.
 * Uses namespace pattern with many sub-components.
 *
 * @example
 * <WexSidebar.Provider>
 *   <WexSidebar>
 *     <WexSidebar.Header>Header</WexSidebar.Header>
 *     <WexSidebar.Content>
 *       <WexSidebar.Menu>
 *         <WexSidebar.MenuItem>
 *           <WexSidebar.MenuButton>Dashboard</WexSidebar.MenuButton>
 *         </WexSidebar.MenuItem>
 *       </WexSidebar.Menu>
 *     </WexSidebar.Content>
 *     <WexSidebar.Footer>Footer</WexSidebar.Footer>
 *   </WexSidebar>
 * </WexSidebar.Provider>
 */

const WexSidebarRoot = React.forwardRef<
  React.ElementRef<typeof SidebarRoot>,
  React.ComponentPropsWithoutRef<typeof SidebarRoot>
>(({ className, ...props }, ref) => (
  <SidebarRoot
    ref={ref}
    className={cn(
      "relative flex w-full flex-1 flex-col bg-wex-sidebar-bg",
      className
    )}
    {...props}
  />
));
WexSidebarRoot.displayName = "WexSidebar";

const WexSidebarContent = React.forwardRef<
  React.ElementRef<typeof SidebarContentBase>,
  React.ComponentPropsWithoutRef<typeof SidebarContentBase>
>(({ className, ...props }, ref) => (
  <SidebarContentBase
    ref={ref}
    className={cn("bg-wex-sidebar-bg", className)}
    {...props}
  />
));
WexSidebarContent.displayName = "WexSidebar.Content";

const WexSidebarInput = React.forwardRef<
  React.ElementRef<typeof SidebarInputBase>,
  React.ComponentPropsWithoutRef<typeof SidebarInputBase>
>(({ className, ...props }, ref) => (
  <SidebarInputBase
    ref={ref}
    className={cn(
      "h-8 w-full bg-wex-sidebar-bg shadow-none focus-visible:ring-2 focus-visible:ring-wex-sidebar-ring",
      className
    )}
    {...props}
  />
));
WexSidebarInput.displayName = "WexSidebar.Input";

const WexSidebarMenuButton = React.forwardRef<
  React.ElementRef<typeof SidebarMenuButtonBase>,
  React.ComponentPropsWithoutRef<typeof SidebarMenuButtonBase>
>(({ className, variant, ...props }, ref) => (
  <SidebarMenuButtonBase
    ref={ref}
    className={cn(
      variant === "outline" &&
        "bg-wex-sidebar-bg shadow-[0_0_0_1px_hsl(var(--wex-component-sidebar-border))] hover:bg-wex-sidebar-accent-bg hover:text-wex-sidebar-accent-fg hover:shadow-[0_0_0_1px_hsl(var(--wex-component-sidebar-border))]",
      className
    )}
    variant={variant}
    {...props}
  />
));
WexSidebarMenuButton.displayName = "WexSidebar.MenuButton";

export const WexSidebar = Object.assign(WexSidebarRoot, {
  Content: WexSidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  GroupAction: SidebarGroupAction,
  GroupContent: SidebarGroupContent,
  GroupLabel: SidebarGroupLabel,
  Header: SidebarHeader,
  Input: WexSidebarInput,
  Inset: SidebarInset,
  Menu: SidebarMenu,
  MenuAction: SidebarMenuAction,
  MenuBadge: SidebarMenuBadge,
  MenuButton: WexSidebarMenuButton,
  MenuItem: SidebarMenuItem,
  MenuSkeleton: SidebarMenuSkeleton,
  MenuSub: SidebarMenuSub,
  MenuSubButton: SidebarMenuSubButton,
  MenuSubItem: SidebarMenuSubItem,
  Provider: SidebarProvider,
  Rail: SidebarRail,
  Separator: SidebarSeparator,
  Trigger: SidebarTrigger,
});

export { useSidebar as useWexSidebar };
