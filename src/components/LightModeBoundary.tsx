import React from "react";

/**
 * Forces light mode while mounted, without overwriting stored preference.
 * Useful to prevent consumer pages from inheriting dark mode.
 */
export function LightModeBoundary({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const hadDarkClass = root.classList.contains("dark");

    // Force light mode for this section
    root.classList.remove("dark");

    // Restore prior preference/state on cleanup
    return () => {
      if (hadDarkClass) {
        root.classList.add("dark");
      }
    };
  }, []);

  return <>{children}</>;
}
