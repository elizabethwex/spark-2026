import { Outlet } from "react-router-dom";
import { AppTabBar } from "./AppTabBar";

/**
 * Root layout for all /app/* routes.
 *
 * Provides:
 * - Full-viewport iOS-like container (max 430px centered)
 * - Fixed bottom tab bar
 * - Safe area inset spacing
 * - App background color
 *
 * Individual screen pages render their own AppNavBar via the Outlet.
 */
export function AppShell() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--app-bg)",
        fontFamily: "var(--app-font)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          minHeight: "100dvh",
          position: "relative",
          background: "var(--app-bg)",
          overflowX: "hidden",
        }}
      >
        {/* Screen content rendered by child routes */}
        <div
          style={{
            paddingBottom: "calc(var(--app-tabbar-height) + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <Outlet />
        </div>

        {/* Fixed bottom chrome */}
        <AppTabBar />
      </div>
    </div>
  );
}
