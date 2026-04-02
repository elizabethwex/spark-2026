import { useLocation } from "react-router-dom";
import { Button } from "@wexinc-healthbenefits/ben-ui-kit";
import { Smartphone } from "lucide-react";
import { usePrototype, HOME_LAYOUT_LABELS } from "@/context/PrototypeContext";
import { MOBILE_APP_PROTOTYPE_URL } from "@/config/prototype";

/**
 * Conference prototype: floating controls for home layout, homepage variant, and mobile app link.
 */
export function PrototypeFloatingControls() {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "";
  const { homepageMode, setHomepageMode, homeLayoutMode, cycleHomeLayout } = usePrototype();
  const showLayoutOnHome = isHome && homepageMode === "partner-safe";

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex w-[min(calc(100vw-2rem),14rem)] flex-col gap-2 rounded-xl border border-slate-200 bg-white/95 p-2.5 shadow-lg backdrop-blur-md"
      role="region"
      aria-label="Prototype controls"
    >
      <p className="px-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Prototype
      </p>

      {showLayoutOnHome && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-auto min-h-8 w-full justify-center whitespace-normal px-2 py-1.5 text-center text-[11px] font-semibold leading-tight"
          onClick={cycleHomeLayout}
        >
          Layout: {HOME_LAYOUT_LABELS[homeLayoutMode]}
        </Button>
      )}

      <div className="grid grid-cols-2 gap-1">
        <Button
          type="button"
          intent="primary"
          variant={homepageMode === "ai-forward" ? "solid" : "outline"}
          size="sm"
          className="h-auto min-h-8 px-1 py-1.5 text-[10px] font-semibold leading-tight"
          onClick={() => setHomepageMode("ai-forward")}
        >
          Modern
        </Button>
        <Button
          type="button"
          intent="primary"
          variant={homepageMode === "partner-safe" ? "solid" : "outline"}
          size="sm"
          className="h-auto min-h-8 px-1 py-1.5 text-[10px] font-semibold leading-tight"
          onClick={() => setHomepageMode("partner-safe")}
        >
          Partner safe
        </Button>
      </div>
    </div>
  );
}
