import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, User, X } from "lucide-react";
import type { ReactNode } from "react";
import { useDeviceMockup } from "@/hooks/useDeviceMockup";
import { useAppChrome } from "@/context/AppChromeContext";
import { STATUS_BAR_HEIGHT } from "./AppStatusBar";
import { APP_NAV_HOME_INNER_H } from "./appChromeLayout";
import { APP_TOP_LIQUID_GLASS } from "./appChromeStyles";

/**
 * Consumer mobile top nav — matches Figma MobileTopNav
 * (Consumer-Experience Component Library, node 983:4471).
 */
export type AppNavTopVariant = "main" | "title" | "sub-page" | "full-page";

type BaseChrome = { solid?: boolean };

export type AppNavBarProps =
  | (BaseChrome & { variant: "main"; onLogoClick?: () => void })
  | (BaseChrome & { variant: "title"; title: string })
  | (BaseChrome & {
      variant: "sub-page";
      title: string;
      backTo: string | number;
      backLabel?: string;
    })
  | (BaseChrome & {
      variant: "full-page";
      title: string;
      /** Optional back affordance (liquid pill). */
      backTo?: string | number;
      backLabel?: string;
      onClose: () => void;
      /** Shown before the close control (e.g. WEXly “new chat”). */
      rightActions?: ReactNode;
    });

const CHROME_TRANSITION = { type: "tween" as const, duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

const LIQUID_SYMBOL_BTN: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  boxShadow: "0 8px 40px rgba(0,0,0,0.12), inset 0 0 0 0.5px rgba(255,255,255,0.4)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  background: "rgba(255, 255, 255, 0.65)",
};

const ASSIST_GRADIENT_BTN: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  background: "linear-gradient(133.5deg, #25146F 2.46%, #C8102E 100%)",
  boxShadow: "0 4px 16px rgba(37,20,111,0.35)",
  letterSpacing: 0,
};

const BACK_PILL_BTN: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 44,
  width: 44,
  borderRadius: "50%",
  border: "none",
  cursor: "pointer",
  flexShrink: 0,
  fontFamily: "var(--app-font)",
  fontSize: 17,
  fontWeight: 500,
  letterSpacing: -0.2,
  color: "var(--app-text)",
  boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  background: "rgba(255, 255, 255, 0.72)",
};

function ProfileButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" aria-label="Profile" onClick={onClick} style={LIQUID_SYMBOL_BTN}>
      <User size={22} strokeWidth={1.75} style={{ color: "var(--app-text)" }} />
    </button>
  );
}

function AssistIqButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" aria-label="WEXly" onClick={onClick} style={ASSIST_GRADIENT_BTN}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.913 13.9149L11.9997 24.0033L10.087 13.9149L0 12.0013L10.087 10.0884L12.0003 0L13.913 10.0884L24 12.0013L13.913 13.9149Z" fill="white"/>
        <path d="M20.2758 19.7969L19.5994 23.3628L18.923 19.7969L15.3569 19.1204L18.923 18.4439L19.5994 14.8781L20.2752 18.4439L23.8412 19.1204L20.2758 19.7969Z" fill="white"/>
      </svg>
    </button>
  );
}

function BackPill({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={BACK_PILL_BTN} aria-label={label}>
      <ChevronLeft size={22} strokeWidth={2} style={{ color: "var(--app-text)" }} />
    </button>
  );
}

export function AppNavBar(props: AppNavBarProps) {
  const navigate = useNavigate();
  const { deviceOn, isMobileDevice } = useDeviceMockup();
  const { topChromeHidden, isScrolled } = useAppChrome();

  /** Desktop /app always uses AppShell’s status bar (mockup or frame-off). */
  const shellMatchesFrame = deviceOn || !isMobileDevice;
  const hideY = shellMatchesFrame
    ? -(STATUS_BAR_HEIGHT + APP_NAV_HOME_INNER_H)
    : "-100%";

  const fixedChrome: React.CSSProperties = {
    position: "fixed",
    left: 0,
    right: 0,
    maxWidth: 430,
    margin: "0 auto",
    width: "100%",
    zIndex: 49,
    fontFamily: "var(--app-font)",
    paddingTop: shellMatchesFrame ? 0 : "env(safe-area-inset-top, 0px)",
    top: shellMatchesFrame ? STATUS_BAR_HEIGHT : 0,
    ...(isScrolled 
      ? APP_TOP_LIQUID_GLASS 
      : { 
          background: "transparent",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
        }),
    transition: "background 0.2s ease, backdrop-filter 0.2s ease, -webkit-backdrop-filter 0.2s ease",
  };

  const applySolid = (base: React.CSSProperties): React.CSSProperties => {
    if (!props.solid) return base;
    return {
      ...base,
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
      background: "var(--app-surface)",
      borderBottom: "0.5px solid var(--app-glass-border)",
    };
  };

  const rowStyle: React.CSSProperties = {
    minHeight: 56,
    display: "flex",
    alignItems: "center",
    padding: "0 16px 8px",
    boxSizing: "border-box",
  };

  if (props.variant === "main") {
    return (
      <motion.header
        initial={false}
        animate={{ y: topChromeHidden ? hideY : 0 }}
        transition={CHROME_TRANSITION}
        style={applySolid({ ...fixedChrome, borderBottom: "none" })}
      >
        <div style={{ ...rowStyle, justifyContent: "space-between" }}>
          <img
            src={`${import.meta.env.BASE_URL}WEX_Logo_Red_Vector.svg`}
            alt="WEX"
            onClick={props.onLogoClick}
            style={{ 
              height: 28, 
              width: "auto", 
              objectFit: "contain",
              cursor: props.onLogoClick ? "pointer" : "default"
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ProfileButton onClick={() => navigate("/app/my-account")} />
            <AssistIqButton onClick={() => navigate("/app/assist-iq")} />
          </div>
        </div>
      </motion.header>
    );
  }

  if (props.variant === "title") {
    const { title } = props;
    return (
      <motion.header
        initial={false}
        animate={{ y: topChromeHidden ? hideY : 0 }}
        transition={CHROME_TRANSITION}
        style={applySolid({ ...fixedChrome, borderBottom: "none" })}
      >
        <div style={{ ...rowStyle, justifyContent: "space-between", gap: 12 }}>
          <h1
            style={{
              margin: 0,
              font: "var(--app-font-large-title)",
              letterSpacing: 0.4,
              color: "var(--app-text)",
              flex: 1,
              minWidth: 0,
            }}
          >
            {title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <ProfileButton onClick={() => navigate("/app/my-account")} />
            <AssistIqButton onClick={() => navigate("/app/assist-iq")} />
          </div>
        </div>
      </motion.header>
    );
  }

  if (props.variant === "sub-page") {
    const { title, backTo, backLabel = "Back" } = props;
    return (
      <motion.header
        initial={false}
        animate={{ y: topChromeHidden ? hideY : 0 }}
        transition={CHROME_TRANSITION}
        style={applySolid({ ...fixedChrome, borderBottom: "none" })}
      >
        <div style={{ ...rowStyle, justifyContent: "space-between", position: "relative" }}>
          <BackPill label={backLabel} onClick={() => typeof backTo === "number" ? navigate(backTo) : navigate(backTo)} />
          <span
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: -0.084,
              color: "var(--app-text)",
              whiteSpace: "nowrap",
              maxWidth: "42%",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </span>
          <AssistIqButton onClick={() => navigate("/app/assist-iq")} />
        </div>
      </motion.header>
    );
  }

  /* full-page */
  const { title, backTo, backLabel = "Back", onClose, rightActions } = props;
  return (
    <motion.header
      initial={false}
      animate={{ y: topChromeHidden ? hideY : 0 }}
      transition={CHROME_TRANSITION}
      style={applySolid({ ...fixedChrome, borderBottom: props.solid ? undefined : "none" })}
    >
      <div style={{ ...rowStyle, justifyContent: "space-between", position: "relative" }}>
        <div style={{ flex: "0 0 auto", minWidth: 44, display: "flex", justifyContent: "flex-start" }}>
          {backTo !== undefined ? <BackPill label={backLabel} onClick={() => typeof backTo === "number" ? navigate(backTo) : navigate(backTo)} /> : <span style={{ width: 44 }} aria-hidden />}
        </div>
        {title ? (
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: 0,
              color: "var(--app-text)",
              whiteSpace: "nowrap",
              maxWidth: "46%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              pointerEvents: "none",
            }}
          >
            {title}
          </span>
        ) : null}
        <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
          {rightActions}
          <button type="button" aria-label="Close" onClick={onClose} style={LIQUID_SYMBOL_BTN}>
            <X size={22} strokeWidth={2} style={{ color: "var(--app-text)" }} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}

/** Reusable icon button for full-page trailing actions (e.g. new chat). */
export function AppNavAction({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        ...LIQUID_SYMBOL_BTN,
        width: 44,
        height: 44,
      }}
    >
      {icon}
    </button>
  );
}
