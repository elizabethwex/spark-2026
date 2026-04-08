import * as React from "react";
import {
  ContextMenu as ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuContent as ContextMenuContentRoot,
  ContextMenuItem as ContextMenuItemBase,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from "@/components/ui/context-menu";
import { cn } from "../lib/utils";

/**
 * WexContextMenu - WEX Design System Context Menu Component
 *
 * Right-click context menu for actions.
 * Uses namespace pattern: WexContextMenu.Trigger, WexContextMenu.Content, etc.
 *
 * @example
 * <WexContextMenu>
 *   <WexContextMenu.Trigger>Right click here</WexContextMenu.Trigger>
 *   <WexContextMenu.Content>
 *     <WexContextMenu.Item>Edit</WexContextMenu.Item>
 *     <WexContextMenu.Item>Delete</WexContextMenu.Item>
 *   </WexContextMenu.Content>
 * </WexContextMenu>
 */

// ContextMenuRoot is a context provider and doesn't accept refs
const WexContextMenuRoot = ContextMenuRoot as typeof ContextMenuRoot;

const WexContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuContentRoot>,
  React.ComponentPropsWithoutRef<typeof ContextMenuContentRoot>
>(({ className, ...props }, ref) => (
  <ContextMenuContentRoot
    ref={ref}
    className={cn(
      "wex-context-menu-content border-wex-menu-content-border bg-wex-menu-content-bg text-wex-menu-item-fg",
      className
    )}
    {...props}
  />
));
WexContextMenuContent.displayName = "WexContextMenu.Content";

const WexContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuItemBase>,
  React.ComponentPropsWithoutRef<typeof ContextMenuItemBase>
>(({ className, ...props }, ref) => (
  <ContextMenuItemBase
    ref={ref}
    className={cn(
      "focus:bg-wex-menu-item-focus-bg data-[state=open]:bg-wex-menu-item-hover-bg",
      className
    )}
    {...props}
  />
));
WexContextMenuItem.displayName = "WexContextMenu.Item";

export const WexContextMenu = Object.assign(WexContextMenuRoot, {
  Trigger: ContextMenuTrigger,
  Content: WexContextMenuContent,
  Item: WexContextMenuItem,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioItem: ContextMenuRadioItem,
  Label: ContextMenuLabel,
  Separator: ContextMenuSeparator,
  Shortcut: ContextMenuShortcut,
  Group: ContextMenuGroup,
  Portal: ContextMenuPortal,
  Sub: ContextMenuSub,
  SubContent: ContextMenuSubContent,
  SubTrigger: ContextMenuSubTrigger,
  RadioGroup: ContextMenuRadioGroup,
});

