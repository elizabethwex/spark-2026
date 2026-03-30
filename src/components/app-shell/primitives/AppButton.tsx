import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "var(--app-tint)",
    color: "var(--app-text-on-tint)",
    border: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
  secondary: {
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    background: "var(--app-glass-bg)",
    color: "var(--app-tint)",
    border: "0.5px solid var(--app-glass-border)",
  },
  ghost: {
    background: "transparent",
    color: "var(--app-tint)",
    border: "none",
  },
  destructive: {
    background: "var(--app-destructive)",
    color: "#fff",
    border: "none",
  },
};

const SIZE_STYLES: Record<ButtonSize, React.CSSProperties> = {
  sm: { fontSize: 15, fontWeight: 500, padding: "7px 14px", borderRadius: "var(--app-radius-md)" },
  md: { fontSize: 17, fontWeight: 600, padding: "11px 20px", borderRadius: "var(--app-radius-md)" },
  lg: { fontSize: 17, fontWeight: 600, padding: "14px 28px", borderRadius: "var(--app-radius-lg)" },
};

export function AppButton({
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  children,
  style,
  ...rest
}: AppButtonProps) {
  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        cursor: "pointer",
        fontFamily: "var(--app-font)",
        letterSpacing: -0.41,
        width: fullWidth ? "100%" : undefined,
        transition: "opacity 0.12s",
        ...VARIANT_STYLES[variant],
        ...SIZE_STYLES[size],
        ...style,
      }}
      {...rest}
    >
      {icon && icon}
      {children}
    </button>
  );
}
