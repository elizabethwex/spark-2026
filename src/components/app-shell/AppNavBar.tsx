import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, User, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useDeviceMockup } from "@/hooks/useDeviceMockup";
import { useAppChrome } from "@/context/AppChromeContext";
import { STATUS_BAR_HEIGHT } from "./AppStatusBar";
import { APP_NAV_HOME_INNER_H, APP_NAV_PAGE_INNER_H } from "./appChromeLayout";
import { APP_TOP_LIQUID_GLASS } from "./appChromeStyles";

interface AppNavBarPageProps {
  mode?: "page";
  title: string;
  backTo?: string;
  backLabel?: string;
  rightActions?: ReactNode;
  solid?: boolean;
}

interface AppNavBarHomeProps {
  mode: "home";
  title?: never;
  backTo?: never;
  backLabel?: never;
  rightActions?: never;
  solid?: never;
}

type AppNavBarProps = AppNavBarPageProps | AppNavBarHomeProps;

const CHROME_TRANSITION = { type: "tween" as const, duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

export function AppNavBar(props: AppNavBarProps) {
  const navigate = useNavigate();
  const { deviceOn } = useDeviceMockup();
  const { topChromeHidden } = useAppChrome();

  const navInnerH = props.mode === "home" ? APP_NAV_HOME_INNER_H : APP_NAV_PAGE_INNER_H;
  const hideY = deviceOn ? -(STATUS_BAR_HEIGHT + navInnerH) : "-100%";

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

  if (props.mode === "home") {
    return (
      <motion.header
        initial={false}
        animate={{ y: topChromeHidden ? hideY : 0 }}
        transition={CHROME_TRANSITION}
        style={{
          ...fixedChrome,
          borderBottom: "none",
        }}
      >
        <div
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px 8px",
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}WEX_Logo_Red_Vector.svg`}
            alt="WEX"
            style={{ height: 28, width: "auto", objectFit: "contain" }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              aria-label="Assist IQ"
              onClick={() => navigate("/app/assist-iq")}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(133.5deg, #25146F 2.46%, #C8102E 100%)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(37,20,111,0.35)",
                flexShrink: 0,
              }}
            >
              <Sparkles size={20} strokeWidth={1.75} style={{ color: "#fff" }} />
            </button>

            <button
              aria-label="Profile"
              onClick={() => navigate("/app/my-account")}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                background: "rgba(255, 255, 255, 0.65)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 40px rgba(0,0,0,0.12), inset 0 0 0 0.5px rgba(255,255,255,0.4)",
                flexShrink: 0,
              }}
            >
              <User size={20} strokeWidth={1.75} style={{ color: "#14182c" }} />
            </button>
          </div>
        </div>
      </motion.header>
    );
  }

  const { title, backTo, backLabel = "Back", rightActions, solid = false } = props;

  return (
    <motion.header
      initial={false}
      animate={{ y: topChromeHidden ? hideY : 0 }}
      transition={CHROME_TRANSITION}
      style={{
        ...fixedChrome,
        backdropFilter: solid ? "none" : fixedChrome.backdropFilter,
        WebkitBackdropFilter: solid ? "none" : fixedChrome.WebkitBackdropFilter,
        background: solid ? "var(--app-surface)" : fixedChrome.background,
        borderBottom: solid ? "0.5px solid var(--app-glass-border)" : "none",
      }}
    >
      <div
        style={{
          height: APP_NAV_PAGE_INNER_H,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: backTo ? 4 : 16,
          paddingRight: 16,
          position: "relative",
        }}
      >
        <div style={{ width: 80, display: "flex", alignItems: "center" }}>
          {backTo && (
            <button
              onClick={() => navigate(backTo)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 8px 8px 4px",
                color: "var(--app-tint)",
                fontFamily: "var(--app-font)",
                fontSize: 17,
                fontWeight: 400,
                letterSpacing: -0.41,
              }}
            >
              <ChevronLeft size={22} strokeWidth={2} />
              <span>{backLabel}</span>
            </button>
          )}
        </div>

        <span
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: -0.41,
            color: "var(--app-text)",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>

        <div
          style={{
            width: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 4,
          }}
        >
          {rightActions}
        </div>
      </div>
    </motion.header>
  );
}

/** Reusable icon button for AppNavBar page actions */
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
      aria-label={label}
      onClick={onClick}
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "rgba(0,0,0,0.06)",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--app-tint)",
      }}
    >
      {icon}
    </button>
  );
}
