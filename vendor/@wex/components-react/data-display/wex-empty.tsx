import * as React from "react";
import { cn } from "../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * WexEmpty - WEX Design System Empty State Component
 *
 * Empty state placeholder for when no data is available.
 * Uses namespace pattern: WexEmpty.Header, WexEmpty.Title, etc.
 *
 * @example
 * <WexEmpty>
 *   <WexEmpty.Header>
 *     <WexEmpty.Media variant="icon">
 *       <Icon />
 *     </WexEmpty.Media>
 *     <WexEmpty.Title>No results found</WexEmpty.Title>
 *     <WexEmpty.Description>Try a different search term</WexEmpty.Description>
 *   </WexEmpty.Header>
 *   <WexEmpty.Content>
 *     <WexButton>Create New</WexButton>
 *   </WexEmpty.Content>
 * </WexEmpty>
 */

// ============================================================================
// Base Empty Components (from shadcn)
// ============================================================================

function Empty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg border-dashed p-6 text-center md:p-12",
        className
      )}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        "flex max-w-sm flex-col items-center gap-2 text-center",
        className
      )}
      {...props}
    />
  );
}

const emptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-wex-empty-icon-bg text-wex-empty-icon-fg flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function EmptyMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      className={cn("text-lg font-medium tracking-tight", className)}
      {...props}
    />
  );
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        "text-wex-empty-description-fg [&>a:hover]:text-wex-empty-link-fg text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        "flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm",
        className
      )}
      {...props}
    />
  );
}

// ============================================================================
// WEX Wrappers
// ============================================================================

const WexEmptyRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Empty>
>(({ className, ...props }, ref) => (
  <Empty
    ref={ref}
    className={cn("wex-empty", className)}
    {...props}
  />
));
WexEmptyRoot.displayName = "WexEmpty";

const wexEmptyMediaVariants = cva(
  "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "bg-wex-empty-bg text-wex-empty-icon-fg flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const WexEmptyMedia = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof EmptyMedia> & VariantProps<typeof wexEmptyMediaVariants>
>(({ className, variant = "default", ...props }, ref) => (
  <EmptyMedia
    ref={ref}
    data-variant={variant}
    className={cn(wexEmptyMediaVariants({ variant, className }))}
    {...props}
  />
));
WexEmptyMedia.displayName = "WexEmpty.Media";

const WexEmptyDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof EmptyDescription>
>(({ className, ...props }, ref) => (
  <EmptyDescription
    ref={ref}
    className={cn("text-wex-empty-fg", className)}
    {...props}
  />
));
WexEmptyDescription.displayName = "WexEmpty.Description";

export const WexEmpty = Object.assign(WexEmptyRoot, {
  Header: EmptyHeader,
  Title: EmptyTitle,
  Description: WexEmptyDescription,
  Content: EmptyContent,
  Media: WexEmptyMedia,
});
