import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * WexItem - WEX Design System Item Component
 *
 * Flexible list item with media, content, and actions.
 * Uses namespace pattern: WexItem.Media, WexItem.Content, etc.
 *
 * @example
 * <WexItem.Group>
 *   <WexItem>
 *     <WexItem.Media variant="image">
 *       <img src="..." alt="..." />
 *     </WexItem.Media>
 *     <WexItem.Content>
 *       <WexItem.Title>Item Title</WexItem.Title>
 *       <WexItem.Description>Item description</WexItem.Description>
 *     </WexItem.Content>
 *     <WexItem.Actions>
 *       <WexButton size="sm">Action</WexButton>
 *     </WexItem.Actions>
 *   </WexItem>
 *   <WexItem.Separator />
 *   <WexItem>...</WexItem>
 * </WexItem.Group>
 */

// ============================================================================
// Base Separator Component (from Radix/shadcn)
// ============================================================================

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "vertical", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-wex-separator-bg",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

// ============================================================================
// Base Item Components (from shadcn)
// ============================================================================

function ItemGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn("group/item-group flex flex-col", className)}
      {...props}
    />
  );
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      role="presentation"
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-0", className)}
      {...props}
    />
  );
}

const itemVariants = cva(
  "group/item [a]:hover:bg-wex-item-hover-bg focus-visible:border-wex-item-focus-border focus-visible:ring-wex-item-focus-ring/50 [a]:transition-colors flex flex-wrap items-center rounded-md border border-transparent text-sm outline-none transition-colors duration-100 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-wex-item-border",
        muted: "bg-wex-item-muted-bg",
      },
      size: {
        default: "gap-4 p-4 ",
        sm: "gap-2.5 px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Item({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      role="listitem"
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size, className }))}
      {...props}
    />
  );
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-wex-item-icon-bg size-8 rounded-sm border [&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
        className
      )}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        "flex w-fit items-center gap-2 text-sm font-medium leading-snug",
        className
      )}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "text-wex-item-description-fg line-clamp-2 text-balance text-sm font-normal leading-normal",
        "[&>a:hover]:text-wex-item-link-fg [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  );
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  );
}

// ============================================================================
// WEX Wrappers
// ============================================================================

const wexItemVariants = cva(
  "group/item [a]:hover:bg-wex-item-hover-bg focus-visible:border-wex-item-focus-border focus-visible:ring-wex-item-focus-ring/50 [a]:transition-colors flex flex-wrap items-center rounded-md border border-transparent text-sm outline-none transition-colors duration-100 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-wex-item-border",
        muted: "bg-wex-item-muted-bg",
      },
      size: {
        default: "gap-4 p-4 ",
        sm: "gap-2.5 px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const WexItemRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Item> & VariantProps<typeof wexItemVariants>
>(({ className, variant, size, ...props }, ref) => (
  <Item
    ref={ref}
    data-variant={variant}
    data-size={size}
    className={cn(wexItemVariants({ variant, size }), className)}
    {...props}
  />
));
WexItemRoot.displayName = "WexItem";

const wexItemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-wex-item-hover-bg size-8 rounded-sm border [&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const WexItemMedia = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof ItemMedia> & VariantProps<typeof wexItemMediaVariants>
>(({ className, variant = "default", ...props }, ref) => (
  <ItemMedia
    ref={ref}
    data-variant={variant}
    className={cn(wexItemMediaVariants({ variant }), className)}
    {...props}
  />
));
WexItemMedia.displayName = "WexItem.Media";

const WexItemDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof ItemDescription>
>(({ className, ...props }, ref) => (
  <ItemDescription
    ref={ref}
    className={cn("text-[var(--wex-component-item-description-fg)]", className)}
    {...props}
  />
));
WexItemDescription.displayName = "WexItem.Description";

export const WexItem = Object.assign(WexItemRoot, {
  Media: WexItemMedia,
  Content: ItemContent,
  Actions: ItemActions,
  Group: ItemGroup,
  Separator: ItemSeparator,
  Title: ItemTitle,
  Description: WexItemDescription,
  Header: ItemHeader,
  Footer: ItemFooter,
});
