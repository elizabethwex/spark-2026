import type { ReactNode } from "react";

// ─── Dimensions ───────────────────────────────────────────────────────────────
export const SCREEN_WIDTH  = 430;
export const SCREEN_HEIGHT = 844;

// Thin bezels matching the Figma reference (very minimal frame like iPhone 15)
const BEZEL_SIDE   = 10;  // left / right physical frame
const BEZEL_TOP    = 12;  // top physical frame above the screen
const BEZEL_BOTTOM = 12;  // bottom physical frame below the screen

const OUTER_WIDTH  = SCREEN_WIDTH + BEZEL_SIDE * 2;   // 450
const OUTER_HEIGHT = BEZEL_TOP + SCREEN_HEIGHT + BEZEL_BOTTOM; // 868

// Dynamic Island sits 10 px inside the screen area (screen-relative offset)
const DI_TOP_IN_SCREEN = 10;
const DI_WIDTH  = 126;
const DI_HEIGHT = 34;

// ─── Frame palette — Natural Titanium / silver (stands out on dark backgrounds)
const FRAME_BG    = "linear-gradient(160deg, #e8e8ea 0%, #c8c8ca 40%, #b0b0b4 100%)";
const FRAME_INNER = "#d4d4d6";
const BTN_COLOR   = "#b8b8bc";

// ─── IPhoneMockup ─────────────────────────────────────────────────────────────
/**
 * Pure-CSS iPhone 15-style device frame with thin bezels.
 *
 * Children render inside the 430 × 844 px screen area.
 * `--app-screen-height` is set on the screen container so child screens know
 * their available height (excluding the status bar, which AppShell adds above
 * the Outlet).
 */
export function IPhoneMockup({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        width: OUTER_WIDTH,
        height: OUTER_HEIGHT,
        flexShrink: 0,
      }}
    >
      {/* ── Outer chassis ──────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 52,
          background: FRAME_BG,
          boxShadow:
            "0 28px 72px rgba(0,0,0,0.6), 0 6px 18px rgba(0,0,0,0.4), " +
            "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.15)",
        }}
      />

      {/* ── Inner chassis lip (screen bezel ring) ──────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 2,
          borderRadius: 51,
          background: FRAME_INNER,
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.15)",
        }}
      />

      {/* ── Left side buttons: mute toggle + volume up + volume down ──── */}
      <SideButton side="left" top={84}  height={28} />
      <SideButton side="left" top={124} height={60} />
      <SideButton side="left" top={196} height={60} />

      {/* ── Right side button: power ──────────────────────────────────── */}
      <SideButton side="right" top={140} height={76} />

      {/* ── Screen container ───────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: BEZEL_SIDE,
          top: BEZEL_TOP,
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          borderRadius: 44,
          overflow: "hidden",
          background: "#000",
        }}
      >
        {children}
      </div>

      {/* ── Dynamic Island ─────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: BEZEL_TOP + DI_TOP_IN_SCREEN,
          left: "50%",
          transform: "translateX(-50%)",
          width: DI_WIDTH,
          height: DI_HEIGHT,
          borderRadius: 18,
          background: "#000",
          zIndex: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.8)",
        }}
      />

      {/* ── Home indicator ─────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 5,
          left: "50%",
          transform: "translateX(-50%)",
          width: 120,
          height: 4,
          borderRadius: 2,
          background: "rgba(255,255,255,0.4)",
        }}
      />

      {/* ── Subtle glare on the screen glass ───────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: BEZEL_SIDE,
          top: BEZEL_TOP,
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          borderRadius: 44,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 38%)",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />
    </div>
  );
}

// ─── SideButton ───────────────────────────────────────────────────────────────
function SideButton({
  side,
  top,
  height,
}: {
  side: "left" | "right";
  top: number;
  height: number;
}) {
  const isLeft = side === "left";
  return (
    <div
      style={{
        position: "absolute",
        top,
        [isLeft ? "left" : "right"]: -3,
        width: 3,
        height,
        borderRadius: isLeft ? "2px 0 0 2px" : "0 2px 2px 0",
        background: `linear-gradient(${isLeft ? "to left" : "to right"}, ${BTN_COLOR}, #2a2a2c)`,
        boxShadow: isLeft
          ? "-1px 0 3px rgba(0,0,0,0.5)"
          : "1px 0 3px rgba(0,0,0,0.5)",
      }}
    />
  );
}
