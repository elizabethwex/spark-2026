import { createContext, useContext, type ReactNode } from "react";

export type AppChromeContextValue = {
  topChromeHidden: boolean;
};

const AppChromeContext = createContext<AppChromeContextValue | null>(null);

export function AppChromeProvider({
  value,
  children,
}: {
  value: AppChromeContextValue;
  children: ReactNode;
}) {
  return <AppChromeContext.Provider value={value}>{children}</AppChromeContext.Provider>;
}

export function useAppChrome(): AppChromeContextValue {
  return useContext(AppChromeContext) ?? { topChromeHidden: false };
}
