import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";

/**
 * WexSkeleton - WEX Design System Skeleton Component
 *
 * Loading placeholder for content that hasn't loaded yet.
 * Uses namespace pattern: WexSkeleton.Card, WexSkeleton.List
 *
 * @example
 * <WexSkeleton className="h-4 w-[250px]" />
 * <WexSkeleton className="h-12 w-12 rounded-full" />
 * <WexSkeleton.Card />
 * <WexSkeleton.List count={3} />
 */

const skeletonVariants = cva("bg-wex-skeleton-bg", {
  variants: {
    variant: {
      default: "animate-pulse rounded-md",
    },
    animation: {
      pulse: "animate-pulse",
      wave: "animate-[shimmer_2s_infinite]",
      none: "",
    },
    shape: {
      default: "rounded-md",
      circle: "rounded-full",
      rectangle: "rounded-none",
      text: "rounded",
    },
  },
  defaultVariants: {
    variant: "default",
    animation: "pulse",
    shape: "default",
  },
});

interface WexSkeletonProps extends React.ComponentProps<"div"> {
  variant?: "default";
  animation?: "pulse" | "wave" | "none";
  shape?: "default" | "circle" | "rectangle" | "text";
}

const WexSkeletonRoot = ({
  className,
  variant,
  animation,
  shape,
  ...props
}: WexSkeletonProps) => (
  <div
    className={cn(skeletonVariants({ variant, animation, shape }), className)}
    {...props}
  />
);
WexSkeletonRoot.displayName = "WexSkeleton";

// ============================================================================
// Preset Skeletons - Custom WEX Components (not in native shadcn)
// ============================================================================

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width (can be number for px or string for any unit) */
  width?: number | string;
  /** Height (can be number for px or string for any unit) */
  height?: number | string;
}

function Skeleton({
  className,
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant: "default" }), className)}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
}

/** Circle skeleton (for avatars) */
function SkeletonCircle({ className, width = 40, height = 40, ...props }: SkeletonProps) {
  return <Skeleton width={width} height={height} className={cn("rounded-full", className)} {...props} />
}

/** Card skeleton - Custom WEX preset */
function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <Skeleton height={200} className="w-full" />
      <Skeleton height={16} className="w-3/4" />
      <Skeleton height={16} className="w-1/2" />
    </div>
  );
}

/** List skeleton - Custom WEX preset */
function SkeletonList({ count = 3, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { count?: number }) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <SkeletonCircle width={32} height={32} />
          <div className="flex-1 space-y-2">
            <Skeleton height={14} className="w-3/4" />
            <Skeleton height={12} className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export const WexSkeleton = Object.assign(WexSkeletonRoot, {
  Card: SkeletonCard,
  List: SkeletonList,
});

// Export preset components for advanced usage
export { SkeletonCard, SkeletonList, SkeletonCircle };
