import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, User, Sparkles, X } from "lucide-react";
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
  | (BaseChrome & { variant: "main" })
  | (BaseChrome & { variant: "title"; title: string })
  | (BaseChrome & {
      variant: "sub-page";
      title: string;
      backTo: string;
      backLabel?: string;
    })
  | (BaseChrome & {
      variant: "full-page";
      title: string;
      /** Optional back affordance (liquid pill). */
      backTo?: string;
      backLabel?: string;
      onClose: () => void;
      /** Shown before the close control (e.g. Assist IQ “new chat”). */
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
};

const BACK_PILL_BTN: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  height: 44,
  minWidth: 44,
  padding: "0 10px 0 6px",
  borderRadius: 296,
  border: "none",
  cursor: "pointer",
  flexShrink: 0,
  fontFamily: "var(--app-font)",
  fontSize: 17,
  fontWeight: 500,
  letterSpacing: -0.2,
  color: "#14182c",
  boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  background: "rgba(255, 255, 255, 0.72)",
};

function ProfileButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" aria-label="Profile" onClick={onClick} style={LIQUID_SYMBOL_BTN}>
      <User size={22} strokeWidth={1.75} style={{ color: "#14182c" }} />
    </button>
  );
}

function AssistIqButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" aria-label="Assist IQ" onClick={onClick} style={ASSIST_GRADIENT_BTN}>
      <Sparkles size={22} strokeWidth={1.75} style={{ color: "#fff" }} />
    </button>
  );
}

function BackPill({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={BACK_PILL_BTN}>
      <ChevronLeft size={22} strokeWidth={2} style={{ color: "#14182c", marginLeft: -2 }} />
      <span>{label}</span>
    </button>
  );
}

export function AppNavBar(props: AppNavBarProps) {
  const navigate = useNavigate();
  const { deviceOn } = useDeviceMockup();
  const { topChromeHidden } = useAppChrome();

  const hideY = deviceOn ? -(STATUS_BAR_HEIGHT + APP_NAV_HOME_INNER_H) : "-100%";

  const fixedChrome: React.CSSProperties = {
    position: "fixed",
    left: 0,
    right: 0,
    maxWidth: 430,
    margin: "0 auto",
    width: "100%",
    zIndex: 49,
    fontFamily: "var(--app-font)",
    paddingTop: deviceOn ? 0 : "env(safe-area-inset-top, 0px)",
    top: deviceOn ? STATUS_BAR_HEIGHT : 0,
    ...APP_TOP_LIQUID_GLASS,
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
            style={{ height: 28, width: "auto", objectFit: "contain" }}
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
              color: "#1a1a1a",
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
          <BackPill label={backLabel} onClick={() => navigate(backTo)} />
          <span
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: -0.084,
              color: "#14182c",
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
          {backTo ? <BackPill label={backLabel} onClick={() => navigate(backTo)} /> : <span style={{ width: 44 }} aria-hidden />}
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
              letterSpacing: -0.43,
              color: "#1a1a1a",
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
            <X size={22} strokeWidth={2} style={{ color: "#14182c" }} />
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
