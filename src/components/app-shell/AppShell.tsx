import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppTabBar } from "./AppTabBar";
import { IPhoneMockup, SCREEN_HEIGHT } from "./IPhoneMockup";
import { AppStatusBar, STATUS_BAR_HEIGHT } from "./AppStatusBar";
import { useDeviceMockup } from "@/hooks/useDeviceMockup";
import { AppChromeProvider } from "@/context/AppChromeContext";

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
 * Device OFF:
 *   - Desktop: same inner layout as device ON (430×844, status bar, single inner scroll, tab bar)
 *     so scroll physics match the mockup; outer page is centered in 100dvh.
 *   - Real mobile: 100dvh column with overflow hidden + inner scroll (not the whole column scrolling)
 *
 * Keyboard shortcut: Cmd+Shift+D (Mac) / Ctrl+Shift+D (Win)
 */
export function AppShell() {
  const { deviceOn, toggleDevice, isMobileDevice } = useDeviceMockup();
  const location = useLocation();
  const [scrollPort, setScrollPort] = useState<HTMLDivElement | null>(null);
  const [topChromeHidden, setTopChromeHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  const scrollRefCallback = useCallback((node: HTMLDivElement | null) => {
    setScrollPort(node);
  }, []);

  useEffect(() => {
    lastScrollY.current = 0;
    setTopChromeHidden(false);
    setIsScrolled(false);
    if (scrollPort) {
      scrollPort.scrollTo(0, 0);
    }
  }, [location.pathname, scrollPort]);

  useEffect(() => {
    const threshold = 8;
    const minY = 24;

    const onScroll = () => {
      const y = scrollPort?.scrollTop ?? 0;
      setIsScrolled(y > 0);
      const dy = y - lastScrollY.current;
      lastScrollY.current = y;

      if (y < minY) {
        setTopChromeHidden(false);
        return;
      }
      if (dy > threshold) setTopChromeHidden(true);
      else if (dy < -threshold) setTopChromeHidden(false);
    };

    if (!scrollPort) return undefined;
    scrollPort.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollPort.removeEventListener("scroll", onScroll);
  }, [scrollPort]);

  const chromeValue = { topChromeHidden, isScrolled };

  // ── Device ON ────────────────────────────────────────────────────────────────
  if (deviceOn) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "rgba(14, 0, 38, 1)",
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
          <AppChromeProvider value={chromeValue}>
            <div
              data-app-mobile-scroll
              style={{
                height: SCREEN_HEIGHT,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transform: "translateZ(0)",
                position: "relative",
                background: "linear-gradient(182.7628652606358deg, rgb(238, 242, 255) 50.004%, rgb(165, 180, 252) 140.09%)",
                // @ts-expect-error custom CSS property
                "--app-screen-height": `${CONTENT_HEIGHT}px`,
              }}
            >
              {/* iOS status bar — time + signal/wifi/battery (liquid glass, hides on scroll down) */}
              <AppStatusBar />

              {/* Route content */}
              <div
                id="app-scroll-container"
                ref={scrollRefCallback}
                style={{
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                  paddingTop:
                    location.pathname === "/app/lock-screen" ? 0 : STATUS_BAR_HEIGHT,
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
          </AppChromeProvider>
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

  // ── Device OFF ───────────────────────────────────────────────────────────────
  const screenShellShared: CSSProperties = {
    width: "100%",
    maxWidth: 430,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transform: "translateZ(0)",
    position: "relative",
    background:
      "linear-gradient(182.7628652606358deg, rgb(238, 242, 255) 50.004%, rgb(165, 180, 252) 140.09%)",
    fontFamily: "var(--app-font)",
  };

  // Real phone: inner scroll only (avoid scrolling the full 100dvh wrapper).
  if (isMobileDevice) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "var(--app-bg)",
          display: "flex",
          justifyContent: "center",
          fontFamily: "var(--app-font)",
        }}
      >
        <AppChromeProvider value={chromeValue}>
          <div
            style={{
              ...screenShellShared,
              height: "100dvh",
              maxHeight: "100dvh",
              // @ts-expect-error custom CSS property — approximate content height for /app pages
              "--app-screen-height":
                "calc(100dvh - var(--app-tabbar-height) - env(safe-area-inset-bottom, 0px))",
            }}
          >
            <div
              ref={scrollRefCallback}
              id="app-scroll-container"
              data-app-mobile-scroll
              style={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
                overflowX: "hidden",
              }}
            >
              <div
                style={{
                  paddingBottom:
                    "calc(var(--app-tabbar-height) + env(safe-area-inset-bottom, 0px))",
                }}
              >
                <Outlet />
              </div>
            </div>
            <AppTabBar />
          </div>
        </AppChromeProvider>
      </div>
    );
  }

  // Desktop frame hidden: match device-ON inner screen (844px) + same scroll port as mockup
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--app-bg)",
        fontFamily: "var(--app-font)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AppChromeProvider value={chromeValue}>
        <div
          style={{
            ...screenShellShared,
            height: SCREEN_HEIGHT,
            maxHeight: "min(100dvh, 844px)",
            // @ts-expect-error custom CSS property — same as device ON
            "--app-screen-height": `${CONTENT_HEIGHT}px`,
          }}
        >
          <AppStatusBar />

          <div
            ref={scrollRefCallback}
            id="app-scroll-container"
            data-app-mobile-scroll
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              paddingTop:
                location.pathname === "/app/lock-screen" ? 0 : STATUS_BAR_HEIGHT,
            }}
          >
            <Outlet />
          </div>

          <AppTabBar />
        </div>
      </AppChromeProvider>

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
