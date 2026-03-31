import { Outlet } from "react-router-dom";
import { AppTabBar } from "./AppTabBar";
import { IPhoneMockup, SCREEN_HEIGHT } from "./IPhoneMockup";
import { AppStatusBar, STATUS_BAR_HEIGHT } from "./AppStatusBar";
import { useDeviceMockup } from "@/hooks/useDeviceMockup";

// Height available to route-level screens below the status bar
const CONTENT_HEIGHT = SCREEN_HEIGHT - STATUS_BAR_HEIGHT; // 790px

/**
 * Root layout for all /app/* routes.
 *
 * Device ON (desktop default):
 *   - Full-page desktop background with a centered iPhone mockup
 *   - iOS status bar (time / signal / wifi / battery) at the top of every screen
 *   - `transform: translateZ(0)` on the screen container so the position:fixed
 *     AppTabBar is contained inside the phone frame rather than the viewport
 *   - `--app-screen-height: 790px` so child screens know their available height
 *
 * Device OFF (real mobile default):
 *   - Original full-viewport 430px column, unchanged
 *
 * Keyboard shortcut: Cmd+Shift+D (Mac) / Ctrl+Shift+D (Win)
 */
export function AppShell() {
  const { deviceOn, toggleDevice, isMobileDevice } = useDeviceMockup();

  // ── Device ON ────────────────────────────────────────────────────────────────
  if (deviceOn) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "#060F3A",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          gap: 20,
          fontFamily: "var(--app-font)",
        }}
      >
        <IPhoneMockup>
          {/*
           * The screen container:
           *   - Fixed height = full screen height
           *   - overflow:hidden clips content to the phone screen
           *   - transform:translateZ(0) creates a new containing block, which
           *     "traps" position:fixed children (AppTabBar) so they are
           *     positioned relative to this div instead of the viewport
           *   - --app-screen-height tells child screens how tall they can be
           *     (screen minus the status bar we render above the Outlet)
           */}
          <div
            style={{
              height: SCREEN_HEIGHT,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              transform: "translateZ(0)",
              position: "relative",
              background: "var(--app-bg)",
              // @ts-expect-error custom CSS property
              "--app-screen-height": `${CONTENT_HEIGHT}px`,
            }}
          >
            {/* iOS status bar — time + signal/wifi/battery */}
            <AppStatusBar />

            {/* Route content */}
            <div
              style={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
              }}
            >
              <Outlet />
            </div>

            {/*
             * AppTabBar is position:fixed, so it escapes the normal flex flow.
             * With transform:translateZ(0) on the screen container above, it
             * ends up anchored to the bottom of the phone screen — not the
             * viewport. No extra positioning is needed here; just include it
             * in the React tree so it renders.
             */}
            <AppTabBar />
          </div>
        </IPhoneMockup>

        {/* Toggle hint */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "6px 14px",
            borderRadius: 20,
            background: "rgba(0,0,0,0.2)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={toggleDevice}
          title="Toggle device frame (⌘⇧D)"
        >
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", letterSpacing: 0.1 }}>
            <kbd
              style={{
                fontFamily: "inherit",
                fontSize: 11,
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 4,
                padding: "1px 5px",
                marginRight: 6,
              }}
            >
              ⌘⇧D
            </kbd>
            Hide device frame
          </span>
        </div>
      </div>
    );
  }

  // ── Device OFF — original layout ─────────────────────────────────────────────
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
        <div
          style={{
            paddingBottom: "calc(var(--app-tabbar-height) + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <Outlet />
        </div>
        <AppTabBar />
      </div>

      {/* Show hint badge on desktop only */}
      {!isMobileDevice && (
        <div
          style={{
            position: "fixed",
            bottom: 16,
            right: 16,
            display: "flex",
            alignItems: "center",
            padding: "6px 14px",
            borderRadius: 20,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            cursor: "pointer",
            userSelect: "none",
            zIndex: 9999,
          }}
          onClick={toggleDevice}
          title="Toggle device frame (⌘⇧D)"
        >
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", letterSpacing: 0.1 }}>
            <kbd
              style={{
                fontFamily: "inherit",
                fontSize: 11,
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 4,
                padding: "1px 5px",
                marginRight: 6,
              }}
            >
              ⌘⇧D
            </kbd>
            Show device frame
          </span>
        </div>
      )}
    </div>
  );
}
