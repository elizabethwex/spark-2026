import * as React from "react";
import {
  Menubar as MenubarRoot,
  MenubarMenu,
  MenubarTrigger as MenubarTriggerBase,
  MenubarContent as MenubarContentBase,
  MenubarItem as MenubarItemBase,
  MenubarSeparator as MenubarSeparatorBase,
  MenubarLabel,
  MenubarCheckboxItem as MenubarCheckboxItemBase,
  MenubarRadioGroup,
  MenubarRadioItem as MenubarRadioItemBase,
  MenubarPortal,
  MenubarSubContent as MenubarSubContentBase,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut as MenubarShortcutBase,
} from "@/components/ui/menubar";
import { cn } from "../lib/utils";

/**
 * WexMenubar - WEX Design System Menubar Component
 *
 * Horizontal menu bar for app navigation.
 * Uses namespace pattern: WexMenubar.Menu, WexMenubar.Trigger, etc.
 *
 * @example
 * <WexMenubar>
 *   <WexMenubar.Menu>
 *     <WexMenubar.Trigger>File</WexMenubar.Trigger>
 *     <WexMenubar.Content>
 *       <WexMenubar.Item>New</WexMenubar.Item>
 *       <WexMenubar.Item>Open</WexMenubar.Item>
 *       <WexMenubar.Separator />
 *       <WexMenubar.Item>Save</WexMenubar.Item>
 *     </WexMenubar.Content>
 *   </WexMenubar.Menu>
 * </WexMenubar>
 */

const WexMenubarRoot = React.forwardRef<
  React.ElementRef<typeof MenubarRoot>,
  React.ComponentPropsWithoutRef<typeof MenubarRoot>
>(({ className, ...props }, ref) => (
  <MenubarRoot
    ref={ref}
    className={cn(
      "flex h-9 items-center space-x-1 rounded-md border border-wex-menubar-border bg-wex-menubar-bg p-1 shadow-sm",
      className
    )}
    {...props}
  />
));
WexMenubarRoot.displayName = "WexMenubar";

const WexMenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarTriggerBase>,
  React.ComponentPropsWithoutRef<typeof MenubarTriggerBase>
>(({ className, ...props }, ref) => (
  <MenubarTriggerBase
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-wex-menubar-trigger-focus-bg data-[state=open]:bg-wex-menubar-trigger-hover-bg",
      className
    )}
    {...props}
  />
));
WexMenubarTrigger.displayName = "WexMenubar.Trigger";

const WexMenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarContentBase>,
  React.ComponentPropsWithoutRef<typeof MenubarContentBase>
>(({ className, ...props }, ref) => (
  <MenubarContentBase
    ref={ref}
    className={cn(
      "border-wex-menu-content-border bg-wex-menu-content-bg text-wex-menu-item-fg",
      className
    )}
    {...props}
  />
));
WexMenubarContent.displayName = "WexMenubar.Content";

const WexMenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarSubContentBase>,
  React.ComponentPropsWithoutRef<typeof MenubarSubContentBase>
>(({ className, ...props }, ref) => (
  <MenubarSubContentBase
    ref={ref}
    className={cn(
      "border-wex-menu-content-border bg-wex-menu-content-bg text-wex-menu-item-fg",
      className
    )}
    {...props}
  />
));
WexMenubarSubContent.displayName = "WexMenubar.SubContent";

const WexMenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarItemBase>,
  React.ComponentPropsWithoutRef<typeof MenubarItemBase>
>(({ className, ...props }, ref) => (
  <MenubarItemBase
    ref={ref}
    className={cn(
      "focus:bg-wex-menu-item-focus-bg data-[state=open]:bg-wex-menu-item-hover-bg",
      className
    )}
    {...props}
  />
));
WexMenubarItem.displayName = "WexMenubar.Item";

const WexMenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarCheckboxItemBase>,
  React.ComponentPropsWithoutRef<typeof MenubarCheckboxItemBase>
>(({ className, ...props }, ref) => (
  <MenubarCheckboxItemBase
    ref={ref}
    className={cn(
      "focus:bg-wex-menu-item-focus-bg data-[disabled]:opacity-[var(--wex-component-menu-disabled-opacity)]",
      className
    )}
    {...props}
  />
));
WexMenubarCheckboxItem.displayName = "WexMenubar.CheckboxItem";

const WexMenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarRadioItemBase>,
  React.ComponentPropsWithoutRef<typeof MenubarRadioItemBase>
>(({ className, ...props }, ref) => (
  <MenubarRadioItemBase
    ref={ref}
    className={cn(
      "focus:bg-wex-menu-item-focus-bg data-[disabled]:opacity-[var(--wex-component-menu-disabled-opacity)]",
      className
    )}
    {...props}
  />
));
WexMenubarRadioItem.displayName = "WexMenubar.RadioItem";

const WexMenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarSeparatorBase>,
  React.ComponentPropsWithoutRef<typeof MenubarSeparatorBase>
>(({ className, ...props }, ref) => (
  <MenubarSeparatorBase
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-wex-menu-separator", className)}
    {...props}
  />
));
WexMenubarSeparator.displayName = "WexMenubar.Separator";

const WexMenubarShortcut = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof MenubarShortcutBase>) => (
  <MenubarShortcutBase
    className={cn("ml-auto text-xs tracking-widest text-wex-menu-shortcut-fg", className)}
    {...props}
  />
);
WexMenubarShortcut.displayName = "WexMenubar.Shortcut";

export const WexMenubar = Object.assign(WexMenubarRoot, {
  Menu: MenubarMenu,
  Trigger: WexMenubarTrigger,
  Content: WexMenubarContent,
  Item: WexMenubarItem,
  Separator: WexMenubarSeparator,
  Label: MenubarLabel,
  CheckboxItem: WexMenubarCheckboxItem,
  RadioGroup: MenubarRadioGroup,
  RadioItem: WexMenubarRadioItem,
  Portal: MenubarPortal,
  SubContent: WexMenubarSubContent,
  SubTrigger: MenubarSubTrigger,
  Group: MenubarGroup,
  Sub: MenubarSub,
  Shortcut: WexMenubarShortcut,
});
