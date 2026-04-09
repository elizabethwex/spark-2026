import { useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Loader2 } from "lucide-react";

export function PullToRefresh({
  onRefresh,
  children,
}: {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0); // Track progress for render
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to find if we are at the top of the scrollable area
  const getScrollTop = () => {
    if (!containerRef.current) return 0;
    let node: HTMLElement | null = containerRef.current;
    while (node && node !== document.body && node !== document.documentElement) {
      if (node.scrollHeight > node.clientHeight) {
        const overflowY = window.getComputedStyle(node).overflowY;
        if (overflowY === "auto" || overflowY === "scroll") {
          return node.scrollTop;
        }
      }
      node = node.parentElement;
    }
    return window.scrollY || document.documentElement.scrollTop || 0;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Prevent pull-to-refresh if interacting with a draggable card or specific element
    if ((e.target as HTMLElement).closest('.no-pull')) return;

    if (getScrollTop() <= 0 && !isRefreshing) {
      startY.current = e.clientY;
      isDragging.current = true;
      try {
        // Captures the pointer so events continue even if the mouse leaves the element
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;

    const pullDistance = e.clientY - startY.current;

    // Only pull down if we are at the top
    if (pullDistance > 0 && getScrollTop() <= 0) {
      currentY.current = pullDistance;
      const resistance = pullDistance * 0.3;
      const newY = Math.min(resistance, 70);
      controls.set({ y: newY });
      setPullProgress(newY); // Update state to trigger re-render for spinner opacity
    } else {
      // If they scroll up, cancel the pull
      currentY.current = 0;
      controls.set({ y: 0 });
      setPullProgress(0);
    }
  };

  const handlePointerUp = async (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (currentY.current > 50 && !isRefreshing) {
      setIsRefreshing(true);
      controls.start({ y: 50 });

      await onRefresh();

      setIsRefreshing(false);
    }

    startY.current = 0;
    currentY.current = 0;
    setPullProgress(0);
    controls.start({ y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } });
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ 
        position: "relative", 
        width: "100%", 
        minHeight: "100vh",
        touchAction: "pan-x pan-y" // Allows scroll but helps prevent browser's native pull-to-refresh
      }}
    >
      {/* The Spinner hidden above the content */}
      <motion.div
        style={{
          position: "absolute",
          top: 10,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 0,
          opacity: pullProgress > 0 || isRefreshing ? 1 : 0,
          pointerEvents: "none",
        }}
      >
        <motion.div
          animate={{ rotate: isRefreshing ? 360 : currentY.current }}
          transition={{ repeat: isRefreshing ? Infinity : 0, duration: 1, ease: "linear" }}
          style={{
            background: "transparent",
            padding: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isRefreshing ? 1 : Math.min(pullProgress / 50, 1),
            transform: `scale(${isRefreshing ? 1 : Math.min(0.5 + (pullProgress / 100), 1)})`
          }}
        >
          <Loader2 size={24} color="var(--app-primary, #3958C3)" />
        </motion.div>
      </motion.div>

      {/* The Page Content */}
      <motion.div
        animate={controls}
        style={{ 
          zIndex: 1, 
          position: "relative", 
          minHeight: "100vh" 
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}