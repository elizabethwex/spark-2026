import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

/**
 * WexDialog - WEX Design System Dialog Component
 *
 * Modal dialog for focused content that requires user attention.
 * Uses namespace pattern: WexDialog.Trigger, WexDialog.Content, etc.
 *
 * @example
 * <WexDialog>
 *   <WexDialog.Trigger asChild>
 *     <WexButton>Open</WexButton>
 *   </WexDialog.Trigger>
 *   <WexDialog.Content>
 *     <WexDialog.Header>
 *       <WexDialog.Title>Title</WexDialog.Title>
 *       <WexDialog.Description>Description</WexDialog.Description>
 *     </WexDialog.Header>
 *     Content here
 *     <WexDialog.Footer>
 *       <WexButton>Confirm</WexButton>
 *     </WexDialog.Footer>
 *   </WexDialog.Content>
 * </WexDialog>
 */

// ============================================================================
// Base Dialog Components (from Radix/shadcn)
// ============================================================================

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-wex-dialog-bg p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm p-1 text-wex-dialog-description-fg opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-wex-dialog-close-hover-bg focus:outline-none focus:ring-2 focus:ring-wex-dialog-focus-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-wex-dialog-description-fg", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// ============================================================================
// WEX Wrappers
// ============================================================================

// CRITICAL: Dialog and Sheet share the same Radix primitive (@radix-ui/react-dialog)
// We must create a wrapper function to avoid mutating the shared Root object
// If we use Object.assign directly on DialogRoot, Sheet will overwrite Dialog's Content
const WexDialogRoot = ((props: React.ComponentProps<typeof Dialog>) => (
  <Dialog {...props} />
)) as typeof Dialog;

const WexDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    position?: "center" | "top" | "bottom" | "left" | "right";
    size?: "sm" | "md" | "lg" | "xl" | "full";
    maximizable?: boolean;
  }
>(({ className, position, size = "md", maximizable, children, ...props }, ref) => {
  // Inject styles to constrain animations to single axis
  React.useEffect(() => {
    const styleId = "wex-dialog-animation-overrides";
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      /* Override Tailwind slide animations for wex-dialog-content */
      .wex-dialog-content[data-state="open"][class*="slide-in-from-top"],
      .wex-dialog-content[data-state="closed"][class*="slide-out-to-top"],
      .wex-dialog-content[data-state="open"][class*="slide-in-from-bottom"],
      .wex-dialog-content[data-state="closed"][class*="slide-out-to-bottom"],
      .wex-dialog-content[data-state="open"][class*="slide-in-from-left"],
      .wex-dialog-content[data-state="closed"][class*="slide-out-to-left"],
      .wex-dialog-content[data-state="open"][class*="slide-in-from-right"],
      .wex-dialog-content[data-state="closed"][class*="slide-out-to-right"] {
        animation-duration: 0ms !important;
      }
      
      /* Center position: override all slide animations, use only zoom */
      .wex-dialog-content[class*="left-[50%]"][class*="top-[50%]"][class*="translate-x-[-50%]"][class*="translate-y-[-50%]"] {
        animation: none !important;
      }
      .wex-dialog-content[class*="left-[50%]"][class*="top-[50%]"][class*="translate-x-[-50%]"][class*="translate-y-[-50%]"][data-state="open"] {
        animation: wex-dialog-zoom-in 200ms ease-out forwards !important;
      }
      .wex-dialog-content[class*="left-[50%]"][class*="top-[50%]"][class*="translate-x-[-50%]"][class*="translate-y-[-50%]"][data-state="closed"] {
        animation: wex-dialog-zoom-out 200ms ease-in forwards !important;
      }
      
      /* Override slide animations for center position - disable all slide animations */
      .wex-dialog-content[class*="left-[50%]"][class*="top-[50%]"] {
        animation: none !important;
      }
      .wex-dialog-content[class*="left-[50%]"][class*="top-[50%]"][class*="slide-in-from-left-1/2"],
      .wex-dialog-content[class*="left-[50%]"][class*="top-[50%]"][class*="slide-in-from-top-[48%]"],
      .wex-dialog-content[class*="left-[50%]"][class*="top-[50%]"][class*="slide-out-to-left-1/2"],
      .wex-dialog-content[class*="left-[50%]"][class*="top-[50%]"][class*="slide-out-to-top-[48%]"] {
        animation: none !important;
      }
      
      @keyframes wex-dialog-zoom-in {
        from { 
          transform: translateX(-50%) translateY(-50%) scale(0.95);
          opacity: 0;
        }
        to { 
          transform: translateX(-50%) translateY(-50%) scale(1);
          opacity: 1;
        }
      }
      @keyframes wex-dialog-zoom-out {
        from { 
          transform: translateX(-50%) translateY(-50%) scale(1);
          opacity: 1;
        }
        to { 
          transform: translateX(-50%) translateY(-50%) scale(0.95);
          opacity: 0;
        }
      }
      
      /* Top: slide down from top (vertical Y-axis only) */
      .wex-dialog-content[class*="top-4"]:not([class*="left-4"]):not([class*="right-4"])[data-state="open"] {
        animation: wex-dialog-slide-in-top 200ms ease-out forwards !important;
      }
      .wex-dialog-content[class*="top-4"]:not([class*="left-4"]):not([class*="right-4"])[data-state="closed"] {
        animation: wex-dialog-slide-out-top 200ms ease-in forwards !important;
      }
      
      /* Bottom: slide up from bottom (vertical Y-axis only) */
      .wex-dialog-content[class*="bottom-4"][data-state="open"] {
        animation: wex-dialog-slide-in-bottom 200ms ease-out forwards !important;
      }
      .wex-dialog-content[class*="bottom-4"][data-state="closed"] {
        animation: wex-dialog-slide-out-bottom 200ms ease-in forwards !important;
      }
      
      /* Left: slide in from left (horizontal X-axis only) */
      .wex-dialog-content[class*="left-4"]:not([class*="left-[50%]"])[class*="top-[50%]"][data-state="open"] {
        animation: wex-dialog-slide-in-left 200ms ease-out forwards !important;
      }
      .wex-dialog-content[class*="left-4"]:not([class*="left-[50%]"])[class*="top-[50%]"][data-state="closed"] {
        animation: wex-dialog-slide-out-left 200ms ease-in forwards !important;
      }
      
      /* Right: slide in from right (horizontal X-axis only) */
      .wex-dialog-content[class*="right-4"][class*="top-[50%]"][data-state="open"] {
        animation: wex-dialog-slide-in-right 200ms ease-out forwards !important;
      }
      .wex-dialog-content[class*="right-4"][class*="top-[50%]"][data-state="closed"] {
        animation: wex-dialog-slide-out-right 200ms ease-in forwards !important;
      }
      
      @keyframes wex-dialog-slide-in-top {
        from { 
          transform: translateX(-50%) translateY(-100%);
          opacity: 0;
        }
        to { 
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
      @keyframes wex-dialog-slide-out-top {
        from { 
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        to { 
          transform: translateX(-50%) translateY(-100%);
          opacity: 0;
        }
      }
      @keyframes wex-dialog-slide-in-bottom {
        from { 
          transform: translateX(-50%) translateY(100%);
          opacity: 0;
        }
        to { 
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
      }
      @keyframes wex-dialog-slide-out-bottom {
        from { 
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        to { 
          transform: translateX(-50%) translateY(100%);
          opacity: 0;
        }
      }
      @keyframes wex-dialog-slide-in-left {
        from { 
          transform: translateY(-50%) translateX(-100%);
          opacity: 0;
        }
        to { 
          transform: translateY(-50%) translateX(0);
          opacity: 1;
        }
      }
      @keyframes wex-dialog-slide-out-left {
        from { 
          transform: translateY(-50%) translateX(0);
          opacity: 1;
        }
        to { 
          transform: translateY(-50%) translateX(-100%);
          opacity: 0;
        }
      }
      @keyframes wex-dialog-slide-in-right {
        from { 
          transform: translateY(-50%) translateX(100%);
          opacity: 0;
        }
        to { 
          transform: translateY(-50%) translateX(0);
          opacity: 1;
        }
      }
      @keyframes wex-dialog-slide-out-right {
        from { 
          transform: translateY(-50%) translateX(0);
          opacity: 1;
        }
        to { 
          transform: translateY(-50%) translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);
  
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[calc(100vw-2rem)]",
  };

  // Position classes
  const positionClasses = {
    center: "left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]",
    top: "left-[50%] top-4 translate-x-[-50%] translate-y-0",
    bottom: "left-[50%] bottom-4 translate-x-[-50%] translate-y-0",
    left: "left-4 top-[50%] translate-x-0 translate-y-[-50%]",
    right: "right-4 top-[50%] translate-x-0 translate-y-[-50%]",
  };

  const modalPosition = position ?? "center";
  const [isMaximized, setIsMaximized] = React.useState(false);

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "wex-dialog-content fixed z-50 grid w-full gap-4 border bg-wex-dialog-bg p-6 shadow-lg duration-200 text-wex-dialog-fg border-wex-dialog-border",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          sizeClasses[size],
          !isMaximized && positionClasses[modalPosition],
          !isMaximized && modalPosition === "center" && "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 !data-[state=open]:slide-in-from-left-1/2 !data-[state=open]:slide-in-from-top-[48%] !data-[state=closed]:slide-out-to-left-1/2 !data-[state=closed]:slide-out-to-top-[48%]",
          isMaximized && "inset-4 !left-4 !right-4 !top-4 !bottom-4 !translate-x-0 !translate-y-0 w-auto h-auto max-w-none",
          maximizable && "wex-dialog-maximizable",
          "sm:rounded-lg",
          className
        )}
        style={isMaximized ? { width: "calc(100vw - 2rem)", height: "calc(100vh - 2rem)" } : undefined}
        {...props}
      >
        {children}
        {maximizable && (
          <button
            type="button"
            onClick={() => setIsMaximized(!isMaximized)}
            className="absolute right-12 top-4 rounded-sm p-1 text-wex-dialog-description-fg opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-wex-dialog-close-hover-bg focus:outline-none focus:ring-2 focus:ring-wex-dialog-focus-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
            aria-label={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h4V4m12 4h-4V4m-4 12H8v4m8-4v4" />
              </svg>
            )}
            <span className="sr-only">{isMaximized ? "Restore" : "Maximize"}</span>
          </button>
        )}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm p-1 text-wex-dialog-description-fg opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-wex-dialog-close-hover-bg focus:outline-none focus:ring-2 focus:ring-wex-dialog-focus-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
WexDialogContent.displayName = "WexDialog.Content";

const WexDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogOverlay>,
  React.ComponentPropsWithoutRef<typeof DialogOverlay>
>(({ className, ...props }, ref) => (
  <DialogOverlay
    ref={ref}
    className={cn(
      "bg-wex-dialog-overlay",
      className
    )}
    {...props}
  />
));
WexDialogOverlay.displayName = "WexDialog.Overlay";

const WexDialogClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, asChild, ...props }, ref) => {
  // If asChild is provided, the child component (e.g., WexButton) handles its own styling
  // We only pass through the close functionality without additional styling
  if (asChild) {
    return (
      <DialogPrimitive.Close
        ref={ref}
        className={className}
        asChild={asChild}
        {...props}
      />
    );
  }
  
  // Default: render with X icon (styled close button)
  return (
    <DialogPrimitive.Close
      ref={ref}
      className={cn(
        "absolute right-4 top-4 rounded-sm p-1 text-wex-dialog-description-fg opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-wex-dialog-close-hover-bg focus:outline-none focus:ring-2 focus:ring-wex-dialog-focus-ring focus:ring-offset-2 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </DialogPrimitive.Close>
  );
});
WexDialogClose.displayName = "WexDialog.Close";

const WexDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-wex-dialog-header-fg",
      className
    )}
    {...props}
  />
));
WexDialogTitle.displayName = "WexDialog.Title";

const WexDialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 text-wex-dialog-footer-fg",
      className
    )}
    {...props}
  />
));
WexDialogFooter.displayName = "WexDialog.Footer";

const WexDialogRootWithNamespace: typeof WexDialogRoot & {
  Portal: typeof DialogPortal;
  Overlay: typeof WexDialogOverlay;
  Trigger: typeof DialogTrigger;
  Close: typeof WexDialogClose;
  Content: typeof WexDialogContent;
  Header: typeof DialogHeader;
  Footer: typeof WexDialogFooter;
  Title: typeof WexDialogTitle;
  Description: typeof DialogDescription;
} = Object.assign(WexDialogRoot, {
  Portal: DialogPortal,
  Overlay: WexDialogOverlay,
  Trigger: DialogTrigger,
  Close: WexDialogClose,
  Content: WexDialogContent,
  Header: DialogHeader,
  Footer: WexDialogFooter,
  Title: WexDialogTitle,
  Description: DialogDescription,
});

export const WexDialog = WexDialogRootWithNamespace;
