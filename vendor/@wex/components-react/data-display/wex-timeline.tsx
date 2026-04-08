"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

/**
 * WexTimeline - WEX Design System Timeline Component
 *
 * A vertical timeline component for displaying events in chronological order.
 * Built following the PrimeReact v11 compound component structure.
 *
 * Features:
 * - Alignment variants: left, right, alternate
 * - Opposite content support
 * - Custom markers (icons, colors)
 * - Accessible with semantic HTML and ARIA attributes
 * - Full keyboard navigation support
 *
 * @example
 * // Basic usage
 * <WexTimeline>
 *   <WexTimeline.Event>
 *     <WexTimeline.Separator>
 *       <WexTimeline.Marker />
 *       <WexTimeline.Connector />
 *     </WexTimeline.Separator>
 *     <WexTimeline.Content>Event content</WexTimeline.Content>
 *   </WexTimeline.Event>
 * </WexTimeline>
 *
 * @example
 * // With opposite content and alternate alignment
 * <WexTimeline align="alternate">
 *   <WexTimeline.Event>
 *     <WexTimeline.Opposite>2026</WexTimeline.Opposite>
 *     <WexTimeline.Separator>
 *       <WexTimeline.Marker />
 *       <WexTimeline.Connector />
 *     </WexTimeline.Separator>
 *     <WexTimeline.Content>Main content</WexTimeline.Content>
 *   </WexTimeline.Event>
 * </WexTimeline>
 */

// ============================================================================
// Context
// ============================================================================

interface TimelineContextValue {
  align: "left" | "right" | "alternate"
  eventIndex: number
  totalEvents: number
}

const TimelineContext = React.createContext<TimelineContextValue | null>(null)

function useTimelineContext() {
  const context = React.useContext(TimelineContext)
  if (!context) {
    throw new Error("Timeline components must be used within WexTimeline")
  }
  return context
}

interface EventContextValue {
  index: number
  isLast: boolean
}

const EventContext = React.createContext<EventContextValue | null>(null)

function useEventContext() {
  const context = React.useContext(EventContext)
  if (!context) {
    throw new Error("Event components must be used within WexTimeline.Event")
  }
  return context
}

// ============================================================================
// Variants
// ============================================================================

const timelineVariants = cva(
  "wex-timeline relative flex flex-col",
  {
    variants: {
      align: {
        left: "",
        right: "",
        alternate: "",
      },
    },
    defaultVariants: {
      align: "left",
    },
  }
)

const timelineEventVariants = cva(
  "wex-timeline-event relative flex min-h-[70px]",
  {
    variants: {
      align: {
        left: "flex-row",
        right: "flex-row-reverse",
        alternate: "flex-row", // Always flex-row for alternate - content/opposite order handled by component
      },
    },
    defaultVariants: {
      align: "left",
    },
  }
)

const timelineSeparatorVariants = cva(
  "wex-timeline-separator flex flex-col items-center",
  {
    variants: {
      align: {
        left: "",
        right: "",
        alternate: "",
      },
    },
    defaultVariants: {
      align: "left",
    },
  }
)

const timelineMarkerVariants = cva(
  "wex-timeline-marker flex items-center justify-center z-10 shrink-0 rounded-full",
  {
    variants: {
      variant: {
        // Dot: outer ring with inner dot - h-4 w-4 total, border creates the ring, inner dot via child
        dot: "h-4 w-4 border-2 border-wex-timeline-marker-border bg-wex-timeline-marker-bg",
        // Icon: larger container for custom icons - uses foreground for ring/icon color by default
        icon: "h-8 w-8 border-2 border-wex-timeline-marker-border bg-wex-timeline-marker-bg",
      },
    },
    defaultVariants: {
      variant: "dot",
    },
  }
)

const timelineConnectorVariants = cva(
  "wex-timeline-connector flex-1 w-0.5 bg-wex-timeline-connector-bg",
  {
    variants: {
      hidden: {
        true: "invisible",
        false: "",
      },
    },
    defaultVariants: {
      hidden: false,
    },
  }
)

const timelineContentVariants = cva(
  "wex-timeline-content pb-2",
  {
    variants: {
      align: {
        left: "flex-1 text-left pl-3",
        right: "flex-1 text-right pr-3",
        alternateLeft: "text-right pr-3", // Content on left side, text aligns right toward center
        alternateRight: "text-left pl-3", // Content on right side, text aligns left toward center
      },
    },
    defaultVariants: {
      align: "left",
    },
  }
)

const timelineOppositeVariants = cva(
  "wex-timeline-opposite py-1 text-wex-timeline-opposite-fg",
  {
    variants: {
      align: {
        left: "flex-1 text-right pr-3",
        right: "flex-1 text-left pl-3",
        alternateLeft: "text-right pr-3", // Opposite on left, text aligns right
        alternateRight: "text-left pl-3", // Opposite on right, text aligns left
      },
    },
    defaultVariants: {
      align: "left",
    },
  }
)

// ============================================================================
// Types
// ============================================================================

export interface WexTimelineProps
  extends React.HTMLAttributes<HTMLOListElement>,
    VariantProps<typeof timelineVariants> {
  /** Content alignment: left, right, or alternate */
  align?: "left" | "right" | "alternate"
}

export interface WexTimelineEventProps
  extends React.HTMLAttributes<HTMLLIElement> {}

export interface WexTimelineSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface WexTimelineMarkerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineMarkerVariants> {
  /** Marker variant: dot (default) or icon (for custom content) */
  variant?: "dot" | "icon"
}

export interface WexTimelineConnectorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Hide the connector (typically for the last event) */
  hidden?: boolean
}

export interface WexTimelineContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface WexTimelineOppositeProps
  extends React.HTMLAttributes<HTMLDivElement> {}

// ============================================================================
// Components
// ============================================================================

/**
 * Timeline Root - Container for timeline events
 */
const WexTimelineRoot = React.forwardRef<HTMLOListElement, WexTimelineProps>(
  ({ className, align = "left", children, ...props }, ref) => {
    // Count children to track total events
    const childArray = React.Children.toArray(children)
    const totalEvents = childArray.length

    // Clone children to inject index
    const childrenWithIndex = childArray.map((child, index) => {
      if (React.isValidElement(child)) {
        return (
          <EventContext.Provider
            key={index}
            value={{ index, isLast: index === totalEvents - 1 }}
          >
            {child}
          </EventContext.Provider>
        )
      }
      return child
    })

    return (
      <TimelineContext.Provider
        value={{ align, eventIndex: 0, totalEvents }}
      >
        <ol
          ref={ref}
          role="list"
          aria-label="Timeline"
          className={cn(timelineVariants({ align }), className)}
          {...props}
        >
          {childrenWithIndex}
        </ol>
      </TimelineContext.Provider>
    )
  }
)
WexTimelineRoot.displayName = "WexTimeline"

/**
 * Timeline Event - Individual event container
 */
const WexTimelineEvent = React.forwardRef<HTMLLIElement, WexTimelineEventProps>(
  ({ className, children, ...props }, ref) => {
    const { align } = useTimelineContext()
    const { index } = useEventContext()

    // For alternate alignment, we need to reorder children so separator stays in center
    if (align === "alternate") {
      const childArray = React.Children.toArray(children)
      const isEven = index % 2 === 0
      
      // Find Separator, Content, and Opposite
      let separator: React.ReactNode = null
      let content: React.ReactNode = null
      let opposite: React.ReactNode = null
      
      childArray.forEach((child) => {
        if (React.isValidElement(child)) {
          const displayName = (child.type as any)?.displayName || ''
          if (displayName === 'WexTimeline.Separator') {
            separator = child
          } else if (displayName === 'WexTimeline.Content') {
            content = child
          } else if (displayName === 'WexTimeline.Opposite') {
            opposite = child
          }
        }
      })

      // For alternate layout:
      // - Left side (flex-1): either content or opposite depending on row
      // - Center: separator (shrink-0, fixed width via its children)
      // - Right side (flex-1): the other element
      // Even rows (0, 2, 4): Opposite on left, Content on right
      // Odd rows (1, 3, 5): Content on left, Opposite on right
      const leftContent = isEven 
        ? (opposite || <div className="flex-1" />) 
        : (content || <div className="flex-1" />)
      const rightContent = isEven 
        ? (content || <div className="flex-1" />) 
        : (opposite || <div className="flex-1" />)

      // Clone separator and add h-full to make it fill the wrapper height
      const separatorWithHeight = React.isValidElement(separator)
        ? React.cloneElement(separator as React.ReactElement<any>, {
            className: cn((separator as React.ReactElement<any>).props.className, "h-full")
          })
        : separator

      return (
        <li
          ref={ref}
          role="listitem"
          className={cn(
            "wex-timeline-event relative flex min-h-[70px]",
            className
          )}
          {...props}
        >
          <div className="flex-1">{leftContent}</div>
          <div className="shrink-0 self-stretch">{separatorWithHeight}</div>
          <div className="flex-1">{rightContent}</div>
        </li>
      )
    }

    // For left/right alignment, use standard flex direction
    const effectiveAlign = align

    return (
      <li
        ref={ref}
        role="listitem"
        className={cn(
          timelineEventVariants({ align: effectiveAlign }),
          className
        )}
        {...props}
      >
        {children}
      </li>
    )
  }
)
WexTimelineEvent.displayName = "WexTimeline.Event"

/**
 * Timeline Separator - Contains marker and connector
 */
const WexTimelineSeparator = React.forwardRef<
  HTMLDivElement,
  WexTimelineSeparatorProps
>(({ className, children, ...props }, ref) => {
  const { align } = useTimelineContext()

  return (
    <div
      ref={ref}
      className={cn(timelineSeparatorVariants({ align }), className)}
      {...props}
    >
      {children}
    </div>
  )
})
WexTimelineSeparator.displayName = "WexTimeline.Separator"

/**
 * Timeline Marker - Visual indicator for each event
 * 
 * Two variants:
 * - dot (default): Ring with small inner dot (h-4 w-4)
 * - icon: Container for custom icons (h-8 w-8)
 */
const WexTimelineMarker = React.forwardRef<HTMLDivElement, WexTimelineMarkerProps>(
  ({ className, variant, children, ...props }, ref) => {
    const hasChildren = React.Children.count(children) > 0
    
    // Auto-detect variant: if children provided, use icon variant
    const effectiveVariant = variant || (hasChildren ? "icon" : "dot")

    return (
      <div
        ref={ref}
        className={cn(timelineMarkerVariants({ variant: effectiveVariant }), className)}
        {...props}
      >
        {effectiveVariant === "dot" ? (
          // Inner dot for the dot variant - small filled circle inside the ring
          <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
        ) : (
          children
        )}
      </div>
    )
  }
)
WexTimelineMarker.displayName = "WexTimeline.Marker"

/**
 * Timeline Connector - Vertical line connecting events
 */
const WexTimelineConnector = React.forwardRef<
  HTMLDivElement,
  WexTimelineConnectorProps
>(({ className, hidden: hiddenProp, ...props }, ref) => {
  const { isLast } = useEventContext()
  
  // Auto-hide connector on last event unless explicitly shown
  const shouldHide = hiddenProp !== undefined ? hiddenProp : isLast

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        timelineConnectorVariants({ hidden: shouldHide }),
        className
      )}
      {...props}
    />
  )
})
WexTimelineConnector.displayName = "WexTimeline.Connector"

/**
 * Timeline Content - Main content area for each event
 */
const WexTimelineContent = React.forwardRef<
  HTMLDivElement,
  WexTimelineContentProps
>(({ className, children, ...props }, ref) => {
  const { align } = useTimelineContext()
  const { index } = useEventContext()

  // For alternate alignment, content position alternates
  // Even rows: content on RIGHT (text-left), Odd rows: content on LEFT (text-right)
  const isEven = index % 2 === 0
  let effectiveAlign: "left" | "right" | "alternateLeft" | "alternateRight" = align as any
  
  if (align === "alternate") {
    effectiveAlign = isEven ? "alternateRight" : "alternateLeft"
  }

  return (
    <div
      ref={ref}
      className={cn(timelineContentVariants({ align: effectiveAlign }), className)}
      {...props}
    >
      {children}
    </div>
  )
})
WexTimelineContent.displayName = "WexTimeline.Content"

/**
 * Timeline Opposite - Content displayed opposite to the main content
 */
const WexTimelineOpposite = React.forwardRef<
  HTMLDivElement,
  WexTimelineOppositeProps
>(({ className, children, ...props }, ref) => {
  const { align } = useTimelineContext()
  const { index } = useEventContext()

  // For alternate alignment, opposite is on the side opposite to content
  // Even rows: opposite on LEFT (text-right), Odd rows: opposite on RIGHT (text-left)
  const isEven = index % 2 === 0
  let effectiveAlign: "left" | "right" | "alternateLeft" | "alternateRight" = 
    align === "left" ? "left" : "right"
  
  if (align === "alternate") {
    effectiveAlign = isEven ? "alternateLeft" : "alternateRight"
  }

  return (
    <div
      ref={ref}
      className={cn(timelineOppositeVariants({ align: effectiveAlign }), className)}
      {...props}
    >
      {children}
    </div>
  )
})
WexTimelineOpposite.displayName = "WexTimeline.Opposite"

// ============================================================================
// Compound Component Export
// ============================================================================

const WexTimelineRootWithNamespace: typeof WexTimelineRoot & {
  Event: typeof WexTimelineEvent
  Separator: typeof WexTimelineSeparator
  Marker: typeof WexTimelineMarker
  Connector: typeof WexTimelineConnector
  Content: typeof WexTimelineContent
  Opposite: typeof WexTimelineOpposite
} = Object.assign(WexTimelineRoot, {
  Event: WexTimelineEvent,
  Separator: WexTimelineSeparator,
  Marker: WexTimelineMarker,
  Connector: WexTimelineConnector,
  Content: WexTimelineContent,
  Opposite: WexTimelineOpposite,
})

export const WexTimeline = WexTimelineRootWithNamespace

// Export variants for external use
export {
  timelineVariants,
  timelineEventVariants,
  timelineSeparatorVariants,
  timelineMarkerVariants,
  timelineConnectorVariants,
  timelineContentVariants,
  timelineOppositeVariants,
}
