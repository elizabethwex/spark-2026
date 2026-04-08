import * as React from "react";
import {
  DropdownMenu as DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent as DropdownMenuContentRoot,
  DropdownMenuItem as DropdownMenuItemBase,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent as DropdownMenuSubContentBase,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
import { cn } from "../lib/utils";

/**
 * WexDropdownMenu - WEX Design System Dropdown Menu Component
 *
 * Menu triggered by a button for actions and navigation.
 * Uses namespace pattern: WexDropdownMenu.Trigger, WexDropdownMenu.Content, etc.
 *
 * @example
 * <WexDropdownMenu>
 *   <WexDropdownMenu.Trigger asChild>
 *     <WexButton variant="outline">Open Menu</WexButton>
 *   </WexDropdownMenu.Trigger>
 *   <WexDropdownMenu.Content>
 *     <WexDropdownMenu.Label>My Account</WexDropdownMenu.Label>
 *     <WexDropdownMenu.Separator />
 *     <WexDropdownMenu.Item>Profile</WexDropdownMenu.Item>
 *     <WexDropdownMenu.Item>Settings</WexDropdownMenu.Item>
 *   </WexDropdownMenu.Content>
 * </WexDropdownMenu>
 */

// DropdownMenuRoot is a context provider and doesn't accept refs
const WexDropdownMenuRoot = DropdownMenuRoot as typeof DropdownMenuRoot;

const WexDropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuContentRoot>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuContentRoot>
>(({ className, align = "start", ...props }, ref) => (
  <DropdownMenuContentRoot
    ref={ref}
    align={align}
    className={cn(
      "wex-dropdown-menu-content border-wex-menu-content-border bg-wex-menu-content-bg text-wex-menu-item-fg",
      className
    )}
    {...props}
  />
));
WexDropdownMenuContent.displayName = "WexDropdownMenu.Content";

const WexDropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuSubContentBase>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuSubContentBase>
>(({ className, ...props }, ref) => (
  <DropdownMenuSubContentBase
    ref={ref}
    className={cn(
      "border-wex-menu-content-border bg-wex-menu-content-bg text-wex-menu-item-fg",
      className
    )}
    {...props}
  />
));
WexDropdownMenuSubContent.displayName = "WexDropdownMenu.SubContent";

const WexDropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuItemBase>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuItemBase>
>(({ className, ...props }, ref) => (
  <DropdownMenuItemBase
    ref={ref}
    className={cn(
      "focus:bg-wex-menu-item-focus-bg data-[state=open]:bg-wex-menu-item-hover-bg",
      className
    )}
    {...props}
  />
));
WexDropdownMenuItem.displayName = "WexDropdownMenu.Item";

export const WexDropdownMenu = Object.assign(WexDropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Content: WexDropdownMenuContent,
  Item: WexDropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioItem: DropdownMenuRadioItem,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  Shortcut: DropdownMenuShortcut,
  Group: DropdownMenuGroup,
  Portal: DropdownMenuPortal,
  Sub: DropdownMenuSub,
  SubContent: WexDropdownMenuSubContent,
  SubTrigger: DropdownMenuSubTrigger,
  RadioGroup: DropdownMenuRadioGroup,
});

