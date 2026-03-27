import * as React from "react";

const HOMEPAGE_MODE_STORAGE_KEY = "portal-prototype-homepage-mode";
const HOME_LAYOUT_STORAGE_KEY = "portal-prototype-home-layout";

export type HomepageMode = "partner-safe" | "ai-forward";

export type HomeLayoutMode = "half" | "full" | "planner";

const HOME_LAYOUT_ORDER: HomeLayoutMode[] = ["half", "full", "planner"];

export const HOME_LAYOUT_LABELS: Record<HomeLayoutMode, string> = {
  half: "Half Width",
  full: "Full Width",
  planner: "HSA Planner",
};

export type PrototypeContextValue = {
  homepageMode: HomepageMode;
  setHomepageMode: (mode: HomepageMode) => void;
  homeLayoutMode: HomeLayoutMode;
  cycleHomeLayout: () => void;
};

const PrototypeContext = React.createContext<PrototypeContextValue | null>(null);

function readStoredHomepageMode(): HomepageMode {
  try {
    const v = window.localStorage.getItem(HOMEPAGE_MODE_STORAGE_KEY);
    if (v === "partner-safe" || v === "ai-forward") return v;
  } catch {
    /* ignore */
  }
  return "ai-forward";
}

function readStoredHomeLayout(): HomeLayoutMode {
  try {
    const v = window.localStorage.getItem(HOME_LAYOUT_STORAGE_KEY);
    if (v === "half" || v === "full" || v === "planner") return v;
  } catch {
    /* ignore */
  }
  return "half";
}

export function PrototypeProvider({ children }: { children: React.ReactNode }) {
  const [homepageMode, setHomepageModeState] = React.useState<HomepageMode>(() =>
    typeof window !== "undefined" ? readStoredHomepageMode() : "ai-forward"
  );

  const [homeLayoutMode, setHomeLayoutModeState] = React.useState<HomeLayoutMode>(() =>
    typeof window !== "undefined" ? readStoredHomeLayout() : "half"
  );

  React.useEffect(() => {
    try {
      window.localStorage.setItem(HOMEPAGE_MODE_STORAGE_KEY, homepageMode);
    } catch {
      /* ignore */
    }
  }, [homepageMode]);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(HOME_LAYOUT_STORAGE_KEY, homeLayoutMode);
    } catch {
      /* ignore */
    }
  }, [homeLayoutMode]);

  const setHomepageMode = React.useCallback((mode: HomepageMode) => {
    setHomepageModeState(mode);
  }, []);

  const cycleHomeLayout = React.useCallback(() => {
    setHomeLayoutModeState((prev) => {
      const idx = HOME_LAYOUT_ORDER.indexOf(prev);
      return HOME_LAYOUT_ORDER[(idx + 1) % HOME_LAYOUT_ORDER.length]!;
    });
  }, []);

  const value = React.useMemo<PrototypeContextValue>(
    () => ({
      homepageMode,
      setHomepageMode,
      homeLayoutMode,
      cycleHomeLayout,
    }),
    [homepageMode, setHomepageMode, homeLayoutMode, cycleHomeLayout]
  );

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
}

export function usePrototype(): PrototypeContextValue {
  const ctx = React.useContext(PrototypeContext);
  if (!ctx) {
    throw new Error("usePrototype must be used within PrototypeProvider");
  }
  return ctx;
}
