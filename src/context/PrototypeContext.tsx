import * as React from "react";

const HOMEPAGE_MODE_STORAGE_KEY = "portal-prototype-homepage-mode";
const HOME_LAYOUT_STORAGE_KEY = "portal-prototype-home-layout";
const LOGO_MODE_STORAGE_KEY = "portal-prototype-logo-mode";

export type HomepageMode = "partner-safe" | "ai-forward";

export type HomeLayoutMode = "full" | "planner";

export type LogoMode = "wex" | "acme";

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
  logoMode: LogoMode;
  toggleLogoMode: () => void;
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

function readStoredLogoMode(): LogoMode {
  try {
    const v = window.localStorage.getItem(LOGO_MODE_STORAGE_KEY);
    if (v === "wex" || v === "acme") return v;
  } catch {
    /* ignore */
  }
  return "acme";
}

export function PrototypeProvider({ children }: { children: React.ReactNode }) {
  const [homepageMode, setHomepageModeState] = React.useState<HomepageMode>(() =>
    typeof window !== "undefined" ? readStoredHomepageMode() : "ai-forward"
  );

  const [homeLayoutMode, setHomeLayoutModeState] = React.useState<HomeLayoutMode>(() =>
    typeof window !== "undefined" ? readStoredHomeLayout() : "full"
  );

  const [logoMode, setLogoModeState] = React.useState<LogoMode>(() =>
    typeof window !== "undefined" ? readStoredLogoMode() : "acme"
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
      window.localStorage.setItem(LOGO_MODE_STORAGE_KEY, logoMode);
    } catch {
      /* ignore */
    }
  }, [logoMode]);

  const setHomepageMode = React.useCallback((mode: HomepageMode) => {
    setHomepageModeState(mode);
  }, []);

  const cycleHomeLayout = React.useCallback(() => {
    setHomeLayoutModeState((prev) => {
      const idx = HOME_LAYOUT_ORDER.indexOf(prev);
      return HOME_LAYOUT_ORDER[(idx + 1) % HOME_LAYOUT_ORDER.length]!;
    });
  }, []);

  const toggleLogoMode = React.useCallback(() => {
    setLogoModeState((prev) => (prev === "wex" ? "acme" : "wex"));
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keypresses if the user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.target instanceof HTMLElement && e.target.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      
      const key = e.key.toLowerCase();
      
      if (key === 'p') {
        setHomepageModeState("partner-safe");
      }
      if (key === 'm') {
        setHomepageModeState("ai-forward");
      }
      if (key === 'l') {
        setLogoModeState((prev) => (prev === "wex" ? "acme" : "wex"));
      }
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
      logoMode,
      toggleLogoMode,
    }),
    [homepageMode, setHomepageMode, homeLayoutMode, cycleHomeLayout, logoMode, toggleLogoMode]
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
