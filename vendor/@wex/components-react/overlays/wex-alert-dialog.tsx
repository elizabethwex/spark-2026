import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import {
  AlertDialog as AlertDialogRoot,
  AlertDialogPortal,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { cn } from "../lib/utils";

/**
 * WexAlertDialog - WEX Design System Alert Dialog Component
 *
 * Modal dialog for important confirmations that require user acknowledgment.
 * Uses namespace pattern: WexAlertDialog.Trigger, WexAlertDialog.Content, etc.
 *
 * @example
 * <WexAlertDialog>
 *   <WexAlertDialog.Trigger asChild>
 *     <WexButton intent="destructive">Delete</WexButton>
 *   </WexAlertDialog.Trigger>
 *   <WexAlertDialog.Content>
 *     <WexAlertDialog.Header>
 *       <WexAlertDialog.Title>Are you sure?</WexAlertDialog.Title>
 *       <WexAlertDialog.Description>This action cannot be undone.</WexAlertDialog.Description>
 *     </WexAlertDialog.Header>
 *     <WexAlertDialog.Footer>
 *       <WexAlertDialog.Cancel>Cancel</WexAlertDialog.Cancel>
 *       <WexAlertDialog.Action>Continue</WexAlertDialog.Action>
 *     </WexAlertDialog.Footer>
 *   </WexAlertDialog.Content>
 * </WexAlertDialog>
 */

// AlertDialogRoot is a context provider and doesn't accept refs
// Use the Root from UI components which is already properly set up
const WexAlertDialogRoot = AlertDialogRoot;

const WexAlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-wex-alertdialog-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
));
WexAlertDialogOverlay.displayName = "WexAlertDialog.Overlay";

const WexAlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <WexAlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-wex-alertdialog-border bg-wex-alertdialog-bg text-wex-alertdialog-fg p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
));
WexAlertDialogContent.displayName = "WexAlertDialog.Content";

const WexAlertDialogRootWithNamespace: typeof WexAlertDialogRoot & {
  Portal: typeof AlertDialogPortal;
  Overlay: typeof WexAlertDialogOverlay;
  Trigger: typeof AlertDialogTrigger;
  Content: typeof WexAlertDialogContent;
  Header: typeof AlertDialogHeader;
  Footer: typeof AlertDialogFooter;
  Title: typeof AlertDialogTitle;
  Description: typeof AlertDialogDescription;
  Action: typeof AlertDialogAction;
  Cancel: typeof AlertDialogCancel;
} = Object.assign(WexAlertDialogRoot, {
  Portal: AlertDialogPortal,
  Overlay: WexAlertDialogOverlay,
  Trigger: AlertDialogTrigger,
  Content: WexAlertDialogContent,
  Header: AlertDialogHeader,
  Footer: AlertDialogFooter,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel,
});

export const WexAlertDialog = WexAlertDialogRootWithNamespace;

