import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppChrome } from "@/context/AppChromeContext";

/** Height consumed by the status bar inside the phone screen. */
export const STATUS_BAR_HEIGHT = 54;

function getFormattedTime(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// ─── Minimal inline SVG status icons ─────────────────────────────────────────

function CellularIcon() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden="true">
      <rect x="0"    y="8" width="3" height="4"  rx="1" fill="#000" />
      <rect x="4.5"  y="5" width="3" height="7"  rx="1" fill="#000" />
      <rect x="9"    y="2" width="3" height="10" rx="1" fill="#000" />
      <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#000" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
      <circle cx="8" cy="11" r="1.5" fill="#000" />
      <path d="M3.9 7.1a5.8 5.8 0 0 1 8.2 0"  stroke="#000" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M1 4.2a9.9 9.9 0 0 1 14 0"    stroke="#000" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="26" height="13" viewBox="0 0 26 13" fill="none" aria-hidden="true">
      <rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#000" strokeOpacity="0.35" />
      <rect x="2" y="2" width="17" height="9" rx="2" fill="#000" />
      <path d="M23 4.5v4a2 2 0 0 0 0-4z" fill="#000" fillOpacity="0.4" />
    </svg>
  );
}

/**
 * iOS-style status bar: time (left) and signal / WiFi / battery (right).
 *
 * Rendered at the very top of every /app/* screen when the device frame is on.
 * The Dynamic Island pill (rendered by IPhoneMockup) visually sits over the
 * center gap between time and icons.
 */
export function AppStatusBar() {
  const location = useLocation();
  const { topChromeHidden } = useAppChrome();
  const [time, setTime] = useState(getFormattedTime);

  useEffect(() => {
    const id = setInterval(() => setTime(getFormattedTime()), 10_000);
    return () => clearInterval(id);
  }, []);

  if (location.pathname === "/app/lock-screen") return null;

  return (
    <motion.div
      initial={false}
      animate={{ y: topChromeHidden ? -STATUS_BAR_HEIGHT : 0 }}
      transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        maxWidth: 430,
        margin: "0 auto",
        width: "100%",
        height: STATUS_BAR_HEIGHT,
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        flexShrink: 0,
        pointerEvents: "none",
        userSelect: "none",
        fontFamily: "var(--app-font)",
        zIndex: 50,
        background: location.pathname.startsWith("/app/reimburse") ? "#fff" : "rgba(238, 243, 255, 1)",
        transition: "background 0.2s ease",
      }}
    >
      {/* Time — left, uses flex-1 so it stops well before the DI */}
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#000", letterSpacing: -0.3 }}>
          {time}
        </span>
      </div>

      {/* Signal / WiFi / Battery — right */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <CellularIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </motion.div>
  );
}
