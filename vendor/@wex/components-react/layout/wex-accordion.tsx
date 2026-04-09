import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * WexAccordion - WEX Design System Accordion Component
 *
 * Vertically stacked set of interactive headings that reveal content.
 * Uses namespace pattern: WexAccordion.Item, WexAccordion.Trigger, etc.
 *
 * @example
 * <WexAccordion type="single" collapsible>
 *   <WexAccordion.Item value="item-1">
 *     <WexAccordion.Trigger>Section Title</WexAccordion.Trigger>
 *     <WexAccordion.Content>Content here</WexAccordion.Content>
 *   </WexAccordion.Item>
 * </WexAccordion>
 */

// ============================================================================
// Base Accordion Components (from Radix/shadcn)
// ============================================================================

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-wex-accordion-icon-fg transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-4", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

// ============================================================================
// WEX Wrappers
// ============================================================================

const WexAccordionRoot = React.forwardRef<
  React.ElementRef<typeof Accordion>,
  React.ComponentPropsWithoutRef<typeof Accordion>
>((props, ref) => <Accordion ref={ref} {...props} />);
WexAccordionRoot.displayName = "WexAccordion";

const WexAccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionItem>,
  React.ComponentPropsWithoutRef<typeof AccordionItem>
>(({ className, ...props }, ref) => (
  <AccordionItem
    ref={ref}
    className={cn("border-wex-accordion-border", className)}
    {...props}
  />
));
WexAccordionItem.displayName = "WexAccordion.Item";

const WexAccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 px-4 text-sm font-medium text-wex-accordion-trigger-fg transition-all hover:bg-wex-accordion-trigger-hover-bg hover:no-underline text-left [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-wex-accordion-icon-fg transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
WexAccordionTrigger.displayName = "WexAccordion.Trigger";

const WexAccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionContent>,
  React.ComponentPropsWithoutRef<typeof AccordionContent>
>(({ className, children, ...props }, ref) => (
  <AccordionContent
    ref={ref}
    className={cn("px-4", className)}
    {...props}
  >
    {children}
  </AccordionContent>
));
WexAccordionContent.displayName = "WexAccordion.Content";

export const WexAccordion = Object.assign(WexAccordionRoot, {
  Item: WexAccordionItem,
  Trigger: WexAccordionTrigger,
  Content: WexAccordionContent,
});
