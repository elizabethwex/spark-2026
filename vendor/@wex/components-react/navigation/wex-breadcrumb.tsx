import * as React from "react";
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbList as BreadcrumbListBase,
  BreadcrumbItem,
  BreadcrumbLink as BreadcrumbLinkBase,
  BreadcrumbPage as BreadcrumbPageBase,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { cn } from "../lib/utils";

/**
 * WexBreadcrumb - WEX Design System Breadcrumb Component
 *
 * Navigation showing current location in hierarchy.
 * Uses namespace pattern: WexBreadcrumb.List, WexBreadcrumb.Item, etc.
 *
 * @example
 * <WexBreadcrumb>
 *   <WexBreadcrumb.List>
 *     <WexBreadcrumb.Item>
 *       <WexBreadcrumb.Link href="/">Home</WexBreadcrumb.Link>
 *     </WexBreadcrumb.Item>
 *     <WexBreadcrumb.Separator />
 *     <WexBreadcrumb.Item>
 *       <WexBreadcrumb.Page>Current Page</WexBreadcrumb.Page>
 *     </WexBreadcrumb.Item>
 *   </WexBreadcrumb.List>
 * </WexBreadcrumb>
 */

const WexBreadcrumbRoot = React.forwardRef<
  React.ElementRef<typeof BreadcrumbRoot>,
  React.ComponentPropsWithoutRef<typeof BreadcrumbRoot>
>(({ className, ...props }, ref) => (
  <BreadcrumbRoot
    ref={ref}
    className={cn("wex-breadcrumb", className)}
    {...props}
  />
));
WexBreadcrumbRoot.displayName = "WexBreadcrumb";

const WexBreadcrumbList = React.forwardRef<
  React.ElementRef<typeof BreadcrumbListBase>,
  React.ComponentPropsWithoutRef<typeof BreadcrumbListBase>
>(({ className, ...props }, ref) => (
  <BreadcrumbListBase
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-wex-breadcrumb-link-fg sm:gap-2.5",
      className
    )}
    {...props}
  />
));
WexBreadcrumbList.displayName = "WexBreadcrumb.List";

const WexBreadcrumbLink = React.forwardRef<
  React.ElementRef<typeof BreadcrumbLinkBase>,
  React.ComponentPropsWithoutRef<typeof BreadcrumbLinkBase>
>(({ className, ...props }, ref) => (
  <BreadcrumbLinkBase
    ref={ref}
    className={cn(
      "transition-colors hover:text-wex-breadcrumb-link-hover-fg",
      className
    )}
    {...props}
  />
));
WexBreadcrumbLink.displayName = "WexBreadcrumb.Link";

const WexBreadcrumbPage = React.forwardRef<
  React.ElementRef<typeof BreadcrumbPageBase>,
  React.ComponentPropsWithoutRef<typeof BreadcrumbPageBase>
>(({ className, ...props }, ref) => (
  <BreadcrumbPageBase
    ref={ref}
    className={cn("font-normal text-wex-breadcrumb-current-fg", className)}
    {...props}
  />
));
WexBreadcrumbPage.displayName = "WexBreadcrumb.Page";

export const WexBreadcrumb = Object.assign(WexBreadcrumbRoot, {
  List: WexBreadcrumbList,
  Item: BreadcrumbItem,
  Link: WexBreadcrumbLink,
  Page: WexBreadcrumbPage,
  Separator: BreadcrumbSeparator,
  Ellipsis: BreadcrumbEllipsis,
});

