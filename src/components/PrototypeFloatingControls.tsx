import { useLocation } from "react-router-dom";
import { Button } from "@wexinc-healthbenefits/ben-ui-kit";
import { usePrototype, HOME_LAYOUT_LABELS } from "@/context/PrototypeContext";

/**
 * Conference prototype: floating controls for home layout, homepage variant, and mobile app link.
 */
export function PrototypeFloatingControls() {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "";
  const { homepageMode, homeLayoutMode, cycleHomeLayout } = usePrototype();
  const showLayoutOnHome = isHome && homepageMode === "partner-safe";

  if (!showLayoutOnHome) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 left-4 z-50 flex w-[min(calc(100vw-2rem),14rem)] flex-col gap-2 rounded-xl border border-slate-200 bg-white/95 p-2.5 shadow-lg backdrop-blur-md"
      role="region"
      aria-label="Prototype controls"
    >
      <p className="px-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Prototype
      </p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-auto min-h-8 w-full justify-center whitespace-normal px-2 py-1.5 text-center text-[11px] font-semibold leading-tight"
        onClick={cycleHomeLayout}
      >
        Layout: {HOME_LAYOUT_LABELS[homeLayoutMode]}
      </Button>
    </div>
  );
}
