import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "lock" | "splash" | "faceIdScanning" | "faceIdSuccess" | "loading";
const ALL_PHASES: Phase[] = ["lock", "splash", "faceIdScanning", "faceIdSuccess", "loading"];

const WEX_APP_ICON = "/wex-app-icon.png";
const WEX_LOGO_RED_VECTOR = "/WEX_Logo_Red_Vector.svg";
const FACE_ID_SVG = "/app-ui/face-id.svg";
const FACE_ID_SUCCESS_SVG = "/app-ui/face-id-success.svg";

/** Splash: vertical pale lavender → soft sky blue */
const SPLASH_BACKGROUND = "linear-gradient(to bottom, #e8ebff, #91b5ff)";

// Timing constants (ms) — adjust here to change sequence speed
const T_SPLASH   = 1200;
const T_SCANNING = 2200;
const T_SUCCESS  = 1000;
const T_LOADING  = 900;

// ─── WEX Splash ───────────────────────────────────────────────────────────────
function WexSplash() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: SPLASH_BACKGROUND,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        style={{
          width: "min(88vw, 180px)",
          maxWidth: "100%",
          filter:
            "drop-shadow(0 12px 40px rgba(0,0,60,0.35)) drop-shadow(0 0 32px rgba(28,110,255,0.35))",
        }}
      >
        <img
          src={WEX_LOGO_RED_VECTOR}
          alt="WEX"
          width={250}
          height={74}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </motion.div>
    </div>
  );
}

// ─── Face ID ──────────────────────────────────────────────────────────────────
const FACE_ID_FRAME: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "50%",
  width: "100%",
  height: "100%",
  objectFit: "contain",
  transform: "translate(-50%, -50%)",
  pointerEvents: "none",
};

/**
 * Face ID flow: splash gradient + stacked SVGs; scanning crossfades into success asset.
 */
function FaceIdScreen({ success }: { success: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: SPLASH_BACKGROUND,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "min(88vw, 340px)",
          aspectRatio: "393 / 293",
          maxHeight: "min(52vh, 320px)",
          flexShrink: 0,
        }}
      >
        <motion.img
          src={FACE_ID_SVG}
          alt=""
          aria-hidden
          initial={false}
          animate={{ opacity: success ? 0 : 1 }}
          transition={{ duration: 0.38, ease: "easeInOut" }}
          style={FACE_ID_FRAME}
        />
        <motion.img
          src={FACE_ID_SUCCESS_SVG}
          alt=""
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: success ? 1 : 0 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          style={FACE_ID_FRAME}
        />
      </div>

      {/* Label — visible during scan, fades out on success */}
      <motion.span
        animate={{ opacity: success ? 0 : 1 }}
        transition={{ duration: 0.25 }}
        style={{
          color: "rgba(37,20,111,0.78)",
          fontSize: 17,
          fontWeight: 400,
          fontFamily: "var(--app-font)",
          letterSpacing: -0.3,
        }}
      >
        Face ID
      </motion.span>
    </div>
  );
}

// ─── iOS-style radial activity spinner ────────────────────────────────────────
function IOSSpinner({ color = "white", size = 40 }: { color?: string; size?: number }) {
  const COUNT   = 12;
  const lineW   = size * 0.09;
  const lineH   = size * 0.26;
  const innerR  = size * 0.14;

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{ width: size, height: size, position: "relative" }}
    >
      {Array.from({ length: COUNT }).map((_, i) => {
        const angle   = (i / COUNT) * 360;
        const opacity = 0.18 + (i / (COUNT - 1)) * 0.82;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: size / 2 - lineH - innerR,
              left: size / 2 - lineW / 2,
              width: lineW,
              height: lineH,
              borderRadius: lineW / 2,
              background: color,
              opacity,
              transformOrigin: `50% calc(100% + ${innerR}px)`,
              transform: `rotate(${angle}deg)`,
            }}
          />
        );
      })}
    </motion.div>
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, #e7ecff 0%, #81aeff 40%, #1c6eff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IOSSpinner color="rgba(37,20,111,0.88)" size={42} />
    </div>
  );
}

// ─── Lock Screen ──────────────────────────────────────────────────────────────
function LockScreen({ onNotificationTap }: { onNotificationTap: () => void }) {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  });
  const [notifTime] = useState(() =>
    new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
  );

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(112.54deg, #C8102E 6.34%, #25146F 83.42%)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Status bar ── */}
      <div
        style={{
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 24,
          gap: 6,
          flexShrink: 0,
        }}
      >
        <svg width="19" height="12" viewBox="0 0 19 12" fill="none">
          {[2, 4, 7, 10].map((h, i) => (
            <rect key={i} x={i * 5} y={12 - h} width="4" height={h} rx="1" fill="rgba(255,255,255,0.9)" />
          ))}
        </svg>
        <svg width="17" height="13" viewBox="0 0 17 13" fill="none">
          <path d="M8.5 10.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" fill="white" />
          <path d="M5.5 8a4.5 4.5 0 0 1 6 0" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M2.5 5.5a8 8 0 0 1 12 0" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 1 }}>
          <div style={{ width: 24, height: 12, border: "1px solid rgba(255,255,255,0.35)", borderRadius: 3.5, padding: 2, display: "flex" }}>
            <div style={{ flex: 1, background: "white", borderRadius: 1.5 }} />
          </div>
          <div style={{ width: 1.3, height: 4, background: "rgba(255,255,255,0.4)", borderRadius: 1 }} />
        </div>
      </div>

      {/* ── Swipe-down indicator ── */}
      <div
        style={{
          position: "absolute",
          top: 47,
          right: 48,
          width: 48,
          height: 2.3,
          background: "rgba(255,255,255,0.35)",
          borderRadius: 2,
          backdropFilter: "blur(15px)",
        }}
      />

      {/* ── Date ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 14,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: 22,
            fontWeight: 400,
            fontFamily: "var(--app-font)",
            letterSpacing: -0.9,
            lineHeight: "28px",
            mixBlendMode: "plus-lighter",
          }}
        >
          {dateStr}
        </span>
      </div>

      {/* ── Large time ── */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 2, position: "relative" }}>
        <div style={{ position: "absolute", inset: "0 -20px", backdropFilter: "blur(1px)", WebkitBackdropFilter: "blur(1px)" }} />
        <span
          style={{
            position: "relative",
            color: "rgba(255,255,255,0.82)",
            fontSize: 90,
            fontWeight: 200,
            fontFamily: "var(--app-font)",
            letterSpacing: -6,
            lineHeight: 1,
            textShadow: "0 2px 24px rgba(200,16,46,0.4), 0 0 80px rgba(255,255,255,0.12)",
          }}
        >
          {time}
        </span>
      </div>

      <div style={{ flex: 1 }} />

      {/* ── WEX notification (liquid glass) ── */}
      <div style={{ padding: "0 10px 12px" }}>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNotificationTap}
          style={{
            width: "100%",
            position: "relative",
            borderRadius: 24,
            padding: "13px 17px",
            border: "none",
            cursor: "pointer",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
            textAlign: "left",
            overflow: "hidden",
            background: "transparent",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              background: "rgba(0,0,0,0.08)",
              mixBlendMode: "hard-light",
              borderRadius: 24,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.07)",
              mixBlendMode: "screen",
              borderRadius: 24,
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: 38,
              height: 38,
              borderRadius: 10,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img src={WEX_APP_ICON} alt="WEX" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <span
                style={{
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  fontFamily: "var(--app-font)",
                  letterSpacing: -0.23,
                  lineHeight: "17px",
                  flex: 1,
                }}
              >
                Documentation needed
              </span>
              <span
                style={{
                  color: "rgba(77,77,77,0.9)",
                  fontSize: 15,
                  fontFamily: "var(--app-font)",
                  whiteSpace: "nowrap",
                  mixBlendMode: "plus-lighter",
                }}
              >
                {notifTime}
              </span>
            </div>
            <span
              style={{
                color: "rgba(255,255,255,0.95)",
                fontSize: 15,
                lineHeight: "18px",
                letterSpacing: -0.23,
                fontFamily: "var(--app-font)",
              }}
            >
              A debit card transaction has been received for $210.00 at Bigtown Dentistry. Documentation is required to complete the transaction.
            </span>
          </div>
        </motion.button>
      </div>

      {/* ── Bottom controls ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: 46,
          paddingRight: 46,
          paddingBottom: 16,
          flexShrink: 0,
        }}
      >
        {(["flashlight", "camera"] as const).map((name) => (
          <div
            key={name}
            style={{
              position: "relative",
              width: 72,
              height: 72,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                background: "rgba(255,255,255,0.10)",
                borderRadius: "50%",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(255,255,255,0.06)",
                mixBlendMode: "screen",
                borderRadius: "50%",
              }}
            />
            <img
              src={`/app-ui/${name}.png`}
              alt={name === "flashlight" ? "Flashlight" : "Camera"}
              style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Home indicator ── */}
      <div style={{ display: "flex", justifyContent: "center", paddingBottom: 10, flexShrink: 0 }}>
        <div
          style={{
            width: 134,
            height: 5,
            background: "rgba(255,255,255,0.7)",
            borderRadius: 100,
          }}
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AppLockScreen() {
  const navigate    = useNavigate();
  const location    = useLocation();

  // Debug: ?phase=splash (or any phase name) freezes on that phase so you can
  // iterate on visuals without triggering the full timed sequence every time.
  const debugPhase  = new URLSearchParams(location.search).get("phase") as Phase | null;
  const initPhase: Phase = debugPhase && ALL_PHASES.includes(debugPhase) ? debugPhase : "lock";

  const [phase, setPhase] = useState<Phase>(initPhase);

  const handleNotificationTap = () => {
    if (debugPhase) return; // frozen in debug mode
    setPhase("splash");
    setTimeout(() => setPhase("faceIdScanning"), T_SPLASH);
    setTimeout(() => setPhase("faceIdSuccess"),  T_SPLASH + T_SCANNING);
    setTimeout(() => setPhase("loading"),         T_SPLASH + T_SCANNING + T_SUCCESS);
    setTimeout(() => navigate("/app/penny"),      T_SPLASH + T_SCANNING + T_SUCCESS + T_LOADING);
  };

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <AnimatePresence mode="wait">
        {phase === "lock" && (
          <motion.div
            key="lock"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <LockScreen onNotificationTap={handleNotificationTap} />
          </motion.div>
        )}

        {phase === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <WexSplash />
          </motion.div>
        )}

        {/* Single key keeps FaceIdScreen mounted across scanning→success,
            so the arc-to-ring and color transitions animate in-place. */}
        {(phase === "faceIdScanning" || phase === "faceIdSuccess") && (
          <motion.div
            key="faceid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <FaceIdScreen success={phase === "faceIdSuccess"} />
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
