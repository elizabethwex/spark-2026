import { NavLink, useLocation } from "react-router-dom";
import { House, Wallet, FileText, Mail } from "lucide-react";

interface Tab {
  label: string;
  to: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  exact?: boolean;
}

const TABS: Tab[] = [
  { label: "Home",     to: "/app",             icon: House,     exact: true },
  { label: "Accounts", to: "/app/account",     icon: Wallet },
  { label: "Claims",   to: "/app/claims",      icon: FileText },
  { label: "Messages", to: "/app/messages",    icon: Mail },
];

export function AppTabBar() {
  const location = useLocation();

  const isActive = (tab: Tab) => {
    if (tab.exact) return location.pathname === "/app" || location.pathname === "/app/";
    return location.pathname.startsWith(tab.to);
  };

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 430,
        padding: "12px 16px",
        paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        zIndex: 50,
        fontFamily: "var(--app-font)",
        pointerEvents: "none",
      }}
    >
      {/* Glass pill */}
      <div
        style={{
          position: "relative",
          height: 71,
          borderRadius: 290,
          overflow: "hidden",
          pointerEvents: "all",
        }}
      >
        {/* Frosted glass fill */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(20px) saturate(200%)",
            WebkitBackdropFilter: "blur(20px) saturate(200%)",
            background: "rgba(255, 255, 255, 0.82)",
            borderRadius: 290,
          }}
        />

        {/* Tab items */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {TABS.map((tab) => {
            const active = isActive(tab);
            const Icon = tab.icon;

            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.exact}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  textDecoration: "none",
                  padding: "8px 0",
                }}
              >
                {/* Icon with active pill highlight */}
                <div
                  style={{
                    position: "relative",
                    width: 56,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {active && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "hsl(208 100% 97%)",
                        borderRadius: 9999,
                      }}
                    />
                  )}
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.25 : 1.75}
                    style={{
                      color: active ? "hsl(208 100% 38%)" : "#14182c",
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                </div>

                {/* Label */}
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: active ? 600 : 500,
                    letterSpacing: 0,
                    lineHeight: "16px",
                    color: active ? "hsl(208 100% 38%)" : "#14182c",
                  }}
                >
                  {tab.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
