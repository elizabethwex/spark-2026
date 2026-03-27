import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { BrandColors } from "./schema";

type ActiveColorKey = keyof BrandColors | null;

type ThemingEngineHighlightContextValue = {
  activeColorKey: ActiveColorKey;
  setActiveColorKey: (key: ActiveColorKey) => void;
};

const ThemingEngineHighlightContext = createContext<ThemingEngineHighlightContextValue | null>(null);

export function ThemingEngineHighlightProvider({ children }: { children: ReactNode }) {
  const [activeColorKey, setActiveColorKeyState] = useState<ActiveColorKey>(null);
  const setActiveColorKey = useCallback((key: ActiveColorKey) => {
    setActiveColorKeyState(key);
  }, []);

  return (
    <ThemingEngineHighlightContext.Provider value={{ activeColorKey, setActiveColorKey }}>
      {children}
    </ThemingEngineHighlightContext.Provider>
  );
}

export function useThemingEngineHighlight() {
  const ctx = useContext(ThemingEngineHighlightContext);
  if (!ctx) {
    throw new Error("useThemingEngineHighlight must be used within ThemingEngineHighlightProvider");
  }
  return ctx;
}
