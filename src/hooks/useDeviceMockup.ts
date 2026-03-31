import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "app-device-mockup";

function detectMobile(): boolean {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function getInitialState(isMobile: boolean): boolean {
  if (isMobile) return false;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === "true";
}

/**
 * Manages the iPhone device-frame toggle for /app/* screens.
 *
 * - Defaults ON for desktop visitors, OFF for real mobile devices.
 * - Persists the user's choice in localStorage (mobile devices are never persisted
 *   — they always start with the frame off).
 * - Registers Cmd+Shift+D (Mac) / Ctrl+Shift+D (Win) as the toggle shortcut.
 *   The shortcut is suppressed when focus is inside an interactive text element.
 */
export function useDeviceMockup() {
  const isMobileDevice = detectMobile();
  const [deviceOn, setDeviceOn] = useState<boolean>(() =>
    getInitialState(isMobileDevice)
  );

  const toggleDevice = useCallback(() => {
    setDeviceOn((prev) => {
      const next = !prev;
      if (!isMobileDevice) {
        localStorage.setItem(STORAGE_KEY, String(next));
      }
      return next;
    });
  }, [isMobileDevice]);

  useEffect(() => {
    if (isMobileDevice) return;

    function handleKeyDown(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const triggerKey = isMac ? e.metaKey : e.ctrlKey;

      if (!triggerKey || !e.shiftKey || e.key.toLowerCase() !== "d") return;

      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target.isContentEditable
      ) {
        return;
      }

      e.preventDefault();
      toggleDevice();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileDevice, toggleDevice]);

  return { deviceOn, toggleDevice, isMobileDevice };
}
