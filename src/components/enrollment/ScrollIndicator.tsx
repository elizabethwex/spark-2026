import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ScrollIndicatorProps = {
  /** Offset from bottom to consider "scrolled to end" (default: 100px) */
  threshold?: number;
};

export function ScrollIndicator({ threshold = 100 }: ScrollIndicatorProps) {
  const [showIndicator, setShowIndicator] = React.useState(false);

  React.useEffect(() => {
    const checkScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      // Show indicator if there's more content below the threshold
      setShowIndicator(distanceFromBottom > threshold);
    };

    // Check on mount
    checkScroll();

    // Check on scroll and resize
    window.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [threshold]);

  if (!showIndicator) {
    return null;
  }

  return (
    <>
      {/* Gradient fade overlay */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 h-24 pointer-events-none z-40",
          "bg-gradient-to-t from-background/95 via-background/60 to-transparent"
        )}
      />

      {/* Animated scroll indicator */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="flex flex-col items-center gap-1 animate-bounce">
          <div className="text-[13px] font-medium text-muted-foreground">
            Scroll for more
          </div>
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </>
  );
}
