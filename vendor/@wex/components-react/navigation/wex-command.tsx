import * as React from "react";
import {
  Command as CommandRoot,
  CommandDialog,
  CommandInput as CommandInputBase,
  CommandList,
  CommandEmpty as CommandEmptyBase,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "../lib/utils";

/**
 * WexCommand - WEX Design System Command Component
 *
 * Command palette for keyboard-first navigation.
 * Uses namespace pattern: WexCommand.Input, WexCommand.List, etc.
 *
 * @example
 * <WexCommand>
 *   <WexCommand.Input placeholder="Type a command or search..." />
 *   <WexCommand.List>
 *     <WexCommand.Empty>No results found.</WexCommand.Empty>
 *     <WexCommand.Group heading="Suggestions">
 *       <WexCommand.Item>Calendar</WexCommand.Item>
 *       <WexCommand.Item>Search</WexCommand.Item>
 *     </WexCommand.Group>
 *   </WexCommand.List>
 * </WexCommand>
 */

// Use the Root from UI components which is already properly set up with "use client"
const WexCommandRoot = React.forwardRef<
  React.ElementRef<typeof CommandRoot>,
  React.ComponentPropsWithoutRef<typeof CommandRoot>
>(({ className, ...props }, ref) => (
  <CommandRoot
    ref={ref}
    className={cn(
      "bg-wex-command-bg text-wex-command-fg",
      className
    )}
    {...props}
  />
));
WexCommandRoot.displayName = "WexCommand";

const WexCommandInput = React.forwardRef<
  React.ElementRef<typeof CommandInputBase>,
  React.ComponentPropsWithoutRef<typeof CommandInputBase>
>(({ className, ...props }, ref) => (
  <CommandInputBase
    ref={ref}
    className={cn("placeholder:text-wex-command-input-placeholder", className)}
    {...props}
  />
));
WexCommandInput.displayName = "WexCommand.Input";

const WexCommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandEmptyBase>,
  React.ComponentPropsWithoutRef<typeof CommandEmptyBase>
>(({ className, ...props }, ref) => (
  <CommandEmptyBase
    ref={ref}
    className={cn("py-6 text-center text-sm text-wex-command-empty-fg", className)}
    {...props}
  />
));
WexCommandEmpty.displayName = "WexCommand.Empty";

export const WexCommand = Object.assign(WexCommandRoot, {
  Dialog: CommandDialog,
  Input: WexCommandInput,
  List: CommandList,
  Empty: WexCommandEmpty,
  Group: CommandGroup,
  Item: CommandItem,
  Shortcut: CommandShortcut,
  Separator: CommandSeparator,
});

