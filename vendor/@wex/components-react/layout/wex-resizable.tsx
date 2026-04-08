import * as React from "react";
import { GripVertical } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";
import { cn } from "../lib/utils";

/**
 * WexResizable - WEX Design System Resizable Component
 *
 * Resizable panel groups with accessibility enhancements.
 * Uses namespace pattern: WexResizable.Group, WexResizable.Panel, WexResizable.Handle
 *
 * @example
 * <WexResizable.Group direction="horizontal">
 *   <WexResizable.Panel defaultSize={50}>
 *     Left panel content
 *   </WexResizable.Panel>
 *   <WexResizable.Handle />
 *   <WexResizable.Panel defaultSize={50}>
 *     Right panel content
 *   </WexResizable.Panel>
 * </WexResizable.Group>
 */

// WEX customization: Add role="toolbar" and aria-label for accessibility
// This is a workaround for react-resizable-panels adding aria-orientation
const WexResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Group>) => (
  <ResizablePrimitive.Group
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    // Add role="toolbar" to support aria-orientation from the library
    // This is a workaround for react-resizable-panels adding aria-orientation
    role="toolbar"
    aria-label="Resizable panels"
    {...props}
  />
);
WexResizablePanelGroup.displayName = "WexResizable.Group";

// WEX customization: Use Separator instead of PanelResizeHandle for backward compatibility
const WexResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Separator> & {
  withHandle?: boolean;
}) => (
  <ResizablePrimitive.Separator
    className={cn(
      "relative flex w-px items-center justify-center bg-wex-resizable-handle-bg after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-wex-resizable-focus-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-wex-resizable-handle-bg">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.Separator>
);
WexResizableHandle.displayName = "WexResizable.Handle";

export const WexResizable = {
  Group: WexResizablePanelGroup,
  Panel: ResizablePrimitive.Panel,
  Handle: WexResizableHandle,
};
