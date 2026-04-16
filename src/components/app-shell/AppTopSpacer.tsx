import { useDeviceMockup } from "@/hooks/useDeviceMockup";
import { APP_NAV_HOME_INNER_H, APP_NAV_PAGE_INNER_H } from "./appChromeLayout";

/**
 * Reserves space for fixed {@link AppNavBar}. With the device frame, {@link AppShell}
 * adds padding for the status bar; this spacer is only the nav row height.
 */
export function AppTopSpacer({ variant }: { variant: "home" | "page" }) {
  const { deviceOn, isMobileDevice } = useDeviceMockup();
  const navH = variant === "home" ? APP_NAV_HOME_INNER_H : APP_NAV_PAGE_INNER_H;

  /** Desktop /app always mirrors the in-frame shell (status bar in AppShell); real mobile does not. */
  const statusBarInShell = deviceOn || !isMobileDevice;

  if (statusBarInShell) {
    return (
      <div
        aria-hidden
        style={{ height: navH, flexShrink: 0, pointerEvents: "none" }}
      />
    );
  }

  return (
    <div
      aria-hidden
      style={{
        height: `calc(env(safe-area-inset-top, 0px) + ${navH}px)`,
        flexShrink: 0,
        pointerEvents: "none",
      }}
    />
  );
}
