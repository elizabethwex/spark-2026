import type { CSSProperties, ReactNode } from "react";

interface AppCardProps {
  children: ReactNode;
  /** glass = liquid-glass frosted, solid = white surface (default) */
  variant?: "solid" | "glass" | "tinted";
  onClick?: () => void;
  style?: CSSProperties;
  padding?: string | number;
}

export function AppCard({
  children,
  variant = "solid",
  onClick,
  style,
  padding = "16px",
}: AppCardProps) {
  const base: CSSProperties = {
    borderRadius: "var(--app-radius-lg)",
    fontFamily: "var(--app-font)",
    overflow: "hidden",
  };

  const variants: Record<string, CSSProperties> = {
    solid: {
      background: "var(--app-card-bg)",
      boxShadow: "var(--app-card-shadow)",
    },
    glass: {
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      background: "var(--app-glass-bg)",
      border: "0.5px solid var(--app-glass-border)",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    },
    tinted: {
      background: "var(--app-primary)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
    },
  };

  return (
    <div
      onClick={onClick}
      style={{
        ...base,
        ...variants[variant],
        padding,
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
