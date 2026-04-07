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
  const [variant, setVariant] = useState<AppVariant>(1);
  return (
    <AppVariantContext.Provider value={{ variant, setVariant }}>
      {children}
    </AppVariantContext.Provider>
  );
}

export function useAppVariant(): AppVariantContextValue {
  const ctx = useContext(AppVariantContext);
  if (!ctx) return { variant: 1, setVariant: () => {} };
  return ctx;
}
