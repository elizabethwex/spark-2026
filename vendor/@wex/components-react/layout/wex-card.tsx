import * as React from "react";
import {
  Card as CardRoot,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "../lib/utils";

/**
 * WexCard - WEX Design System Card Component
 *
 * Container for grouping related content with header, content, and footer.
 * Uses namespace pattern: WexCard.Header, WexCard.Content, etc.
 *
 * @example
 * <WexCard>
 *   <WexCard.Header>
 *     <WexCard.Title>Card Title</WexCard.Title>
 *     <WexCard.Description>Description</WexCard.Description>
 *   </WexCard.Header>
 *   <WexCard.Content>Content here</WexCard.Content>
 *   <WexCard.Footer>
 *     <WexButton>Action</WexButton>
 *   </WexCard.Footer>
 * </WexCard>
 */

interface WexCardProps extends React.ComponentPropsWithoutRef<typeof CardRoot> {
  variant?: "default" | "elevated" | "outlined" | "flat";
}

const WexCardRoot = React.forwardRef<
  React.ElementRef<typeof CardRoot>,
  WexCardProps
>(({ className, style, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-wex-card-bg border-wex-card-border",
    elevated: "bg-wex-card-bg border-wex-card-border shadow-lg",
    outlined: "bg-transparent border-wex-card-border",
    flat: "bg-wex-card-bg border-transparent",
  };

  return (
    <CardRoot
      ref={ref}
      className={cn(
        "wex-card text-wex-card-fg",
        variantClasses[variant],
        className
      )}
      style={{
        borderRadius: "var(--wex-component-card-radius)",
        ...style,
      }}
      {...props}
    />
  );
});
WexCardRoot.displayName = "WexCard";

const WexCardTitle = React.forwardRef<
  React.ElementRef<typeof CardTitle>,
  React.ComponentPropsWithoutRef<typeof CardTitle>
>(({ className, ...props }, ref) => (
  <CardTitle
    ref={ref}
    className={cn("text-wex-card-header-fg", className)}
    {...props}
  />
));
WexCardTitle.displayName = "WexCard.Title";

// Namespace pattern
export const WexCard = Object.assign(WexCardRoot, {
  Header: CardHeader,
  Footer: CardFooter,
  Title: WexCardTitle,
  Description: CardDescription,
  Content: CardContent,
});

