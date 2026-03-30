import type { CSSProperties } from "react";

type BadgeVariant = "success" | "warning" | "destructive" | "info" | "neutral" | "tint";

interface AppBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  style?: CSSProperties;
}

const VARIANT_STYLES: Record<BadgeVariant, CSSProperties> = {
  success: {
    background: "hsl(142 76% 94%)",
    color: "hsl(142 76% 30%)",
  },
  warning: {
    background: "hsl(38 92% 92%)",
    color: "hsl(38 92% 32%)",
  },
  destructive: {
    background: "hsl(350 62% 94%)",
    color: "hsl(350 62% 40%)",
  },
  info: {
    background: "hsl(198 87% 92%)",
    color: "hsl(198 87% 28%)",
  },
  neutral: {
    background: "hsl(210 18% 93%)",
    color: "hsl(210 14% 37%)",
  },
  tint: {
    background: "hsl(208 100% 92%)",
    color: "hsl(208 100% 32%)",
  },
};

export function AppBadge({ label, variant = "neutral", size = "md", style }: AppBadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "var(--app-radius-pill)",
        fontFamily: "var(--app-font)",
        fontSize: size === "sm" ? 11 : 12,
        fontWeight: 600,
        letterSpacing: 0.1,
        padding: size === "sm" ? "2px 7px" : "3px 9px",
        lineHeight: 1.4,
        whiteSpace: "nowrap",
        ...VARIANT_STYLES[variant],
        ...style,
      }}
    >
      {label}
    </span>
  );
}
