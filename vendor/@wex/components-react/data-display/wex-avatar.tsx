import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Avatar as AvatarRoot,
  AvatarImage,
  AvatarFallback as AvatarFallbackBase,
} from "@/components/ui/avatar";
import { cn } from "../lib/utils";

/**
 * WexAvatar - WEX Design System Avatar Component
 *
 * Image element with fallback for representing users or entities.
 * Uses namespace pattern: WexAvatar.Image, WexAvatar.Fallback, WexAvatar.Group, WexAvatar.Badge
 *
 * @example
 * <WexAvatar>
 *   <WexAvatar.Image src="/profile.jpg" alt="John Doe" />
 *   <WexAvatar.Fallback>JD</WexAvatar.Fallback>
 * </WexAvatar>
 *
 * // With status badge
 * <WexAvatar>
 *   <WexAvatar.Image src="/profile.jpg" alt="John Doe" />
 *   <WexAvatar.Fallback>JD</WexAvatar.Fallback>
 *   <WexAvatar.Badge status="online" />
 * </WexAvatar>
 *
 * // Grouped avatars
 * <WexAvatar.Group max={3}>
 *   <WexAvatar><WexAvatar.Fallback>A</WexAvatar.Fallback></WexAvatar>
 *   <WexAvatar><WexAvatar.Fallback>B</WexAvatar.Fallback></WexAvatar>
 * </WexAvatar.Group>
 */

// ============================================================================
// Avatar Variants (for AvatarGroup)
// ============================================================================

const avatarVariants = cva("relative flex shrink-0", {
  variants: {
    size: {
      xs: "h-6 w-6 text-xs",
      sm: "h-8 w-8 text-sm",
      md: "h-10 w-10 text-base",
      lg: "h-12 w-12 text-lg",
      xl: "h-16 w-16 text-xl",
      "2xl": "h-20 w-20 text-2xl",
    },
    shape: {
      circle: "rounded-full",
      square: "rounded-md",
    },
  },
  defaultVariants: {
    size: "md",
    shape: "circle",
  },
});

// ============================================================================
// WEX Avatar Root
// ============================================================================

interface WexAvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarRoot> {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  shape?: "circle" | "square";
}

const WexAvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarRoot>,
  WexAvatarProps
>(({ className, size, shape, ...props }, ref) => (
  <AvatarRoot
    ref={ref}
    className={cn(
      "wex-avatar ring-2 ring-wex-avatar-border",
      avatarVariants({ size, shape }),
      className
    )}
    {...props}
  />
));
WexAvatarRoot.displayName = "WexAvatar";

// ============================================================================
// WEX Avatar Fallback
// ============================================================================

const WexAvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarFallbackBase>,
  React.ComponentPropsWithoutRef<typeof AvatarFallbackBase>
>(({ className, ...props }, ref) => (
  <AvatarFallbackBase
    ref={ref}
    className={cn(
      "ring-2 ring-wex-avatar-border flex items-center justify-center bg-wex-avatar-fallback-bg text-wex-avatar-fallback-fg font-medium",
      className
    )}
    {...props}
  />
));
WexAvatarFallback.displayName = "WexAvatar.Fallback";

// ============================================================================
// Avatar Group - Custom WEX Component (not in native shadcn)
// ============================================================================

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum number of avatars to show before +N indicator */
  max?: number;
  /** Total count for +N indicator */
  total?: number;
  /** Size of avatars in group */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, max, total, size = "md", ...props }, ref) => {
    const childrenArray = React.Children.toArray(children);
    const visibleChildren = max ? childrenArray.slice(0, max) : childrenArray;
    const hiddenCount = total ?? (max ? childrenArray.length - max : 0);
    const showOverflow = hiddenCount > 0 && max && childrenArray.length > max;

    return (
      <div
        ref={ref}
        className={cn("flex -space-x-2", className)}
        {...props}
      >
        {visibleChildren.map((child, index) => (
          <div
            key={index}
            className="ring-2 ring-wex-avatar-border rounded-full"
            style={{ zIndex: visibleChildren.length - index }}
          >
            {child}
          </div>
        ))}
        {showOverflow && (
          <div
            className={cn(
              avatarVariants({ size, shape: "circle" }),
              "ring-2 ring-wex-avatar-border flex items-center justify-center bg-wex-avatar-fallback-bg text-wex-avatar-fallback-fg font-medium"
            )}
          >
            +{hiddenCount}
          </div>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

// ============================================================================
// Avatar Badge - Custom WEX Component (not in native shadcn)
// ============================================================================

const avatarBadgeVariants = cva(
  "absolute rounded-full border-2 border-wex-avatar-border",
  {
    variants: {
      position: {
        "bottom-right": "bottom-0 right-0",
        "bottom-left": "bottom-0 left-0",
        "top-right": "top-0 right-0",
        "top-left": "top-0 left-0",
      },
      status: {
        online: "bg-wex-avatar-status-online-bg",
        offline: "bg-wex-avatar-status-offline-bg",
        busy: "bg-wex-avatar-status-busy-bg",
        away: "bg-wex-avatar-status-away-bg",
      },
      size: {
        xs: "h-1.5 w-1.5",
        sm: "h-2 w-2",
        md: "h-2.5 w-2.5",
        lg: "h-3 w-3",
        xl: "h-3.5 w-3.5",
        "2xl": "h-4 w-4",
      },
    },
    defaultVariants: {
      position: "bottom-right",
      status: "online",
      size: "md",
    },
  }
);

export interface AvatarBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarBadgeVariants> {}

const AvatarBadge = React.forwardRef<HTMLSpanElement, AvatarBadgeProps>(
  ({ className, position, status, size, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(avatarBadgeVariants({ position, status, size }), className)}
      {...props}
    />
  )
);
AvatarBadge.displayName = "AvatarBadge";

// ============================================================================
// WEX Avatar Badge Wrapper
// ============================================================================

const WexAvatarBadge = React.forwardRef<
  HTMLSpanElement,
  AvatarBadgeProps
>(({ className, ...props }, ref) => (
  <AvatarBadge
    ref={ref}
    className={cn("ring-2 ring-wex-avatar-border", className)}
    {...props}
  />
));
WexAvatarBadge.displayName = "WexAvatar.Badge";

// ============================================================================
// Compound Component Export
// ============================================================================

export const WexAvatar = Object.assign(WexAvatarRoot, {
  Image: AvatarImage,
  Fallback: WexAvatarFallback,
  Group: AvatarGroup,
  Badge: WexAvatarBadge,
});

// Export base components for advanced usage
export { AvatarGroup, AvatarBadge };
