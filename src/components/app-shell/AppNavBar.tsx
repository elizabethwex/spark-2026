import { useNavigate } from "react-router-dom";
import { ChevronLeft, User, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

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

const GLASS_BASE: React.CSSProperties = {
  position: "sticky",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 40,
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  background: "var(--app-glass-bg)",
  borderBottom: "0.5px solid var(--app-glass-border)",
  paddingTop: "env(safe-area-inset-top, 0px)",
  fontFamily: "var(--app-font)",
};

export function AppNavBar(props: AppNavBarProps) {
  const navigate = useNavigate();

  if (props.mode === "home") {
    return (
      <header style={{ ...GLASS_BASE, background: "transparent", borderBottom: "none", backdropFilter: "none", WebkitBackdropFilter: "none" }}>
        {/* iOS status bar spacer */}
        <div style={{ height: "env(safe-area-inset-top, 0px)" }} />
        <div
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px 8px",
          }}
        >
          {/* WEX Logo */}
          <img
            src={`${import.meta.env.BASE_URL}WEX_Logo_Red_Vector.svg`}
            alt="WEX"
            style={{ height: 28, width: "auto", objectFit: "contain" }}
          />

          {/* Trailing action buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Assist IQ gradient button */}
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

            {/* Profile liquid glass button */}
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
      </header>
    );
  }

  const { title, backTo, backLabel = "Back", rightActions, solid = false } = props;

  return (
    <header
      style={{
        ...GLASS_BASE,
        backdropFilter: solid ? "none" : GLASS_BASE.backdropFilter,
        WebkitBackdropFilter: solid ? "none" : GLASS_BASE.WebkitBackdropFilter,
        background: solid ? "var(--app-surface)" : GLASS_BASE.background,
      }}
    >
      <div
        style={{
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: backTo ? 4 : 16,
          paddingRight: 16,
          position: "relative",
        }}
      >
        {/* Left: back button */}
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

        {/* Center: title */}
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

        {/* Right: actions */}
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
    </header>
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
