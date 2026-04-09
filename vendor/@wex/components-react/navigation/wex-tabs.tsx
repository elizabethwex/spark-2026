import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Tabs as TabsRoot,
  TabsList as TabsListBase,
  TabsTrigger as TabsTriggerBase,
  TabsContent,
} from "@/components/ui/tabs";
import { cn } from "../lib/utils";

// Context for sharing variant between List and Trigger
const TabsVariantContext = React.createContext<"default" | "line">("default");

/**
 * WexTabs - WEX Design System Tabs Component
 *
 * Tabbed content panels for organizing related content.
 * Uses namespace pattern: WexTabs.List, WexTabs.Trigger, WexTabs.Content
 *
 * @example
 * <WexTabs defaultValue="account">
 *   <WexTabs.List>
 *     <WexTabs.Trigger value="account">Account</WexTabs.Trigger>
 *     <WexTabs.Trigger value="password">Password</WexTabs.Trigger>
 *   </WexTabs.List>
 *   <WexTabs.Content value="account">Account content</WexTabs.Content>
 *   <WexTabs.Content value="password">Password content</WexTabs.Content>
 * </WexTabs>
 */

const WexTabsRoot = React.forwardRef<
  React.ElementRef<typeof TabsRoot>,
  React.ComponentPropsWithoutRef<typeof TabsRoot>
>((props, ref) => <TabsRoot ref={ref} {...props} />);
WexTabsRoot.displayName = "WexTabs";

interface WexTabsListProps extends React.ComponentPropsWithoutRef<typeof TabsListBase> {
  variant?: "default" | "line";
}

const WexTabsList = React.forwardRef<
  React.ElementRef<typeof TabsListBase>,
  WexTabsListProps
>(({ className, variant = "default", ...props }, ref) => (
  <TabsVariantContext.Provider value={variant}>
    <TabsListBase
      ref={ref}
      className={cn(
        variant === "line" 
          ? "inline-flex h-10 items-center justify-start border-b border-wex-tabs-divider bg-transparent p-0" 
          : "border-b border-wex-tabs-divider",
        className
      )}
      {...props}
    />
  </TabsVariantContext.Provider>
));
WexTabsList.displayName = "WexTabs.List";

// ============================================================================
// ScrollableTabsList - Custom WEX Component (not in native shadcn)
// ============================================================================

type ScrollableTabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>;

const ScrollableTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  ScrollableTabsListProps
>(({ className, children, ...props }, ref) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScroll = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  }, []);

  React.useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      const resizeObserver = new ResizeObserver(checkScroll);
      resizeObserver.observe(el);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        resizeObserver.disconnect();
      };
    }
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.5;
      el.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <TabsVariantContext.Provider value="line">
      <div className="relative flex items-center">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-0 z-10 flex h-full items-center justify-center w-8 bg-gradient-to-r from-muted to-transparent hover:from-muted"
            aria-label="Scroll tabs left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide pb-px"
        >
          <TabsPrimitive.List
            ref={ref}
            className={cn(
              "inline-flex h-10 items-center justify-start border-b border-wex-tabs-divider bg-transparent p-0",
              "text-wex-tabs-trigger-fg",
              className
            )}
            {...props}
          >
            {children}
          </TabsPrimitive.List>
        </div>
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute right-0 z-10 flex h-full items-center justify-center w-8 bg-gradient-to-l from-muted to-transparent hover:from-muted"
            aria-label="Scroll tabs right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </TabsVariantContext.Provider>
  );
});
ScrollableTabsList.displayName = "ScrollableTabsList";

const WexScrollableTabsList = React.forwardRef<
  React.ElementRef<typeof ScrollableTabsList>,
  React.ComponentPropsWithoutRef<typeof ScrollableTabsList>
>(({ className, ...props }, ref) => (
  <ScrollableTabsList
    ref={ref}
    className={cn("border-b border-wex-tabs-divider", className)}
    {...props}
  />
));
WexScrollableTabsList.displayName = "WexTabs.ScrollableList";

interface WexTabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsTriggerBase> {
  variant?: "default" | "line";
}

const WexTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsTriggerBase>,
  WexTabsTriggerProps
>(({ className, variant, ...props }, ref) => {
  // Get variant from parent context if not explicitly provided
  const contextVariant = React.useContext(TabsVariantContext);
  const isLineVariant = variant === "line" || (variant === undefined && contextVariant === "line");
  
  return (
    <TabsTriggerBase
      ref={ref}
      className={cn(
        isLineVariant
          ? "inline-flex items-center justify-center whitespace-nowrap border-b-2 border-transparent px-4 py-2.5 text-sm font-medium transition-all text-wex-tabs-trigger-fg -mb-px hover:text-wex-tabs-trigger-active-fg hover:border-wex-tabs-trigger-hover-bg data-[state=active]:text-wex-tabs-trigger-active-fg data-[state=active]:border-wex-tabs-indicator data-[state=active]:shadow-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wex-tabs-focus-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 !rounded-none"
          : "text-wex-tabs-trigger-fg hover:text-wex-tabs-trigger-active-fg hover:border-wex-tabs-trigger-hover-bg data-[state=active]:text-wex-tabs-trigger-active-fg data-[state=active]:border-wex-tabs-indicator",
        className
      )}
      {...props}
    />
  );
});
WexTabsTrigger.displayName = "WexTabs.Trigger";

export const WexTabs = Object.assign(WexTabsRoot, {
  List: WexTabsList,
  ScrollableList: WexScrollableTabsList,
  Trigger: WexTabsTrigger,
  Content: TabsContent,
});

// Export base components for advanced usage
export { ScrollableTabsList };
