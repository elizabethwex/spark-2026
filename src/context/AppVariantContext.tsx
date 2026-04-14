import { createContext, useContext, useState, type ReactNode } from "react";

export type AppVariant = 1 | 2 | 3;

export const APP_VARIANT_LABELS: Record<AppVariant, string> = {
  1: "HSA + Limited Purpose FSA",
  2: "Health FSA + DC FSA",
  3: "HSA Only",
};

interface AppVariantContextValue {
  variant: AppVariant;
  setVariant: (v: AppVariant) => void;
}

const AppVariantContext = createContext<AppVariantContextValue | null>(null);

export function AppVariantProvider({ children }: { children: ReactNode }) {
  /** Default 3 = HSA-only style accounts/messages; use 2 for FSA-style (e.g. keyboard “2”). */
  const [variant, setVariant] = useState<AppVariant>(3);
  return (
    <AppVariantContext.Provider value={{ variant, setVariant }}>
      {children}
    </AppVariantContext.Provider>
  );
}

export function useAppVariant(): AppVariantContextValue {
  const ctx = useContext(AppVariantContext);
  if (!ctx) return { variant: 3, setVariant: () => {} };
  return ctx;
}
