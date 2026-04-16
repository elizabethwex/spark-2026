import * as React from "react";

const HOMEPAGE_MODE_STORAGE_KEY = "portal-prototype-homepage-mode";
const HOME_LAYOUT_STORAGE_KEY = "portal-prototype-home-layout";
const SPARK_ACTIVE_VIEW_STORAGE_KEY = "portal-prototype-spark-active-view";

export type SparkActiveView = 1 | 2 | 3;

export type HomepageMode = "partner-safe" | "ai-forward";

export type HomeLayoutMode = "full" | "planner";

const HOME_LAYOUT_ORDER: HomeLayoutMode[] = ["full", "planner"];

export const HOME_LAYOUT_LABELS: Record<HomeLayoutMode, string> = {
  full: "Full Width",
  planner: "HSA Planner",
};

export type PrototypeContextValue = {
  homepageMode: HomepageMode;
  setHomepageMode: (mode: HomepageMode) => void;
  homeLayoutMode: HomeLayoutMode;
  cycleHomeLayout: () => void;
  sparkActiveView: SparkActiveView;
  setSparkActiveView: (view: SparkActiveView) => void;
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
    if (v === "full" || v === "planner") return v;
  } catch {
    /* ignore */
  }
  return "full";
}

function readStoredSparkActiveView(): SparkActiveView {
  try {
    const v = window.localStorage.getItem(SPARK_ACTIVE_VIEW_STORAGE_KEY);
    if (v === "1" || v === "2" || v === "3") return Number(v) as SparkActiveView;
  } catch {
    /* ignore */
  }
  return 1;
}

export function PrototypeProvider({ children }: { children: React.ReactNode }) {
  const [homepageMode, setHomepageModeState] = React.useState<HomepageMode>(() =>
    typeof window !== "undefined" ? readStoredHomepageMode() : "ai-forward"
  );

  const [homeLayoutMode, setHomeLayoutModeState] = React.useState<HomeLayoutMode>(() =>
    typeof window !== "undefined" ? readStoredHomeLayout() : "full"
  );

  const [sparkActiveView, setSparkActiveViewState] = React.useState<SparkActiveView>(() =>
    typeof window !== "undefined" ? readStoredSparkActiveView() : 1
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

  React.useEffect(() => {
    try {
      window.localStorage.setItem(SPARK_ACTIVE_VIEW_STORAGE_KEY, String(sparkActiveView));
    } catch {
      /* ignore */
    }
  }, [sparkActiveView]);

  const setHomepageMode = React.useCallback((mode: HomepageMode) => {
    setHomepageModeState(mode);
  }, []);

  const cycleHomeLayout = React.useCallback(() => {
    setHomeLayoutModeState((prev) => {
      const idx = HOME_LAYOUT_ORDER.indexOf(prev);
      return HOME_LAYOUT_ORDER[(idx + 1) % HOME_LAYOUT_ORDER.length]!;
    });
  }, []);

  const setSparkActiveView = React.useCallback((view: SparkActiveView) => {
    setSparkActiveViewState(view);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keypresses if the user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === 'p' || e.key === 'P') {
        setHomepageModeState("partner-safe");
      }
      if (e.key === 'm' || e.key === 'M') {
        setHomepageModeState("ai-forward");
      }
      if (e.key === "1") setSparkActiveViewState(1);
      if (e.key === "2") setSparkActiveViewState(2);
      if (e.key === "3") setSparkActiveViewState(3);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const value = React.useMemo<PrototypeContextValue>(
    () => ({
      homepageMode,
      setHomepageMode,
      homeLayoutMode,
      cycleHomeLayout,
      sparkActiveView,
      setSparkActiveView,
    }),
    [homepageMode, setHomepageMode, homeLayoutMode, cycleHomeLayout, sparkActiveView, setSparkActiveView]
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
