import * as React from "react";
import {
  InputGroup as InputGroupRoot,
  InputGroupAddon as InputGroupAddonBase,
  InputGroupButton,
  InputGroupText as InputGroupTextBase,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * WexInputGroup - WEX Design System Input Group Component
 *
 * Container for input with addons, buttons, and text.
 * Uses namespace pattern: WexInputGroup.Addon, WexInputGroup.Input, etc.
 *
 * @example
 * <WexInputGroup>
 *   <WexInputGroup.Addon align="inline-start">
 *     <Icon />
 *   </WexInputGroup.Addon>
 *   <WexInputGroup.Input placeholder="Search..." />
 *   <WexInputGroup.Addon align="inline-end">
 *     <WexInputGroup.Button>Search</WexInputGroup.Button>
 *   </WexInputGroup.Addon>
 * </WexInputGroup>
 */

const WexInputGroupRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof InputGroupRoot>
>(({ className, ...props }, ref) => (
  <InputGroupRoot
    ref={ref}
    className={cn("wex-input-group", className)}
    {...props}
  />
));
WexInputGroupRoot.displayName = "WexInputGroup";

const wexInputGroupAddonVariants = cva(
  "text-wex-inputgroup-addon-fg flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-sm font-medium group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--wex-component-inputgroup-radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end":
          "order-last pr-3 has-[>button]:mr-[-0.4rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start":
          "[.border-b]:pb-3 order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5",
        "block-end":
          "[.border-t]:pt-3 order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
);

const WexInputGroupAddon = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof InputGroupAddonBase> & VariantProps<typeof wexInputGroupAddonVariants>
>(({ className, align = "inline-start", ...props }, ref) => (
  <InputGroupAddonBase
    ref={ref}
    data-align={align}
    className={cn(wexInputGroupAddonVariants({ align }), className)}
    {...props}
  />
));
WexInputGroupAddon.displayName = "WexInputGroup.Addon";

const WexInputGroupText = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof InputGroupTextBase>
>(({ className, ...props }, ref) => (
  <InputGroupTextBase
    ref={ref}
    className={cn("text-wex-inputgroup-addon-fg", className)}
    {...props}
  />
));
WexInputGroupText.displayName = "WexInputGroup.Text";

export const WexInputGroup = Object.assign(WexInputGroupRoot, {
  Addon: WexInputGroupAddon,
  Button: InputGroupButton,
  Text: WexInputGroupText,
  Input: InputGroupInput,
  Textarea: InputGroupTextarea,
});

