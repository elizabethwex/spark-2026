import { ChevronRight } from "lucide-react";
import type { ReactNode, CSSProperties } from "react";

interface AppListRowProps {
  /** Primary label text */
  label: string;
  /** Secondary text below the label */
  sublabel?: string;
  /** Right-side value or element */
  value?: ReactNode;
  /** Icon slot on the left */
  icon?: ReactNode;
  /** Render a disclosure chevron on the right */
  disclosure?: boolean;
  onClick?: () => void;
  /** Don't render the bottom separator (e.g. last row in group) */
  last?: boolean;
  style?: CSSProperties;
}

export function AppListRow({
  label,
  sublabel,
  value,
  icon,
  disclosure = false,
  onClick,
  last = false,
  style,
}: AppListRowProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        minHeight: 44,
        padding: "10px 16px",
        gap: 12,
        cursor: onClick ? "pointer" : undefined,
        position: "relative",
        fontFamily: "var(--app-font)",
        background: "transparent",
        ...style,
      }}
    >
      {icon && (
        <div
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 17,
            fontWeight: 400,
            letterSpacing: -0.41,
            color: "var(--app-text)",
            lineHeight: "22px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </div>
        {sublabel && (
          <div
            style={{
              fontSize: 13,
              color: "var(--app-text-secondary)",
              letterSpacing: -0.08,
              lineHeight: "18px",
              marginTop: 1,
            }}
          >
            {sublabel}
          </div>
        )}
      </div>

      {value !== undefined && (
        <div
          style={{
            fontSize: 17,
            color: "var(--app-text-secondary)",
            letterSpacing: -0.41,
            flexShrink: 0,
          }}
        >
          {value}
        </div>
      )}

      {disclosure && (
        <ChevronRight
          size={16}
          strokeWidth={2}
          style={{ color: "var(--app-text-tertiary)", flexShrink: 0, marginRight: -4 }}
        />
      )}

      {!last && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: icon ? 56 : 16,
            right: 0,
            height: "0.5px",
            background: "var(--app-separator)",
          }}
        />
      )}
    </div>
  );
}

/** Wraps a group of AppListRows in a card surface with a section header */
export function AppListSection({
  header,
  footer,
  children,
}: {
  header?: string;
  footer?: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {header && (
        <div
          style={{
            fontFamily: "var(--app-font)",
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: 0.07,
            color: "var(--app-text-secondary)",
            textTransform: "uppercase",
            padding: "0 8px 6px",
          }}
        >
          {header}
        </div>
      )}
      <div
        style={{
          background: "var(--app-surface)",
          borderRadius: "var(--app-radius-lg)",
          overflow: "hidden",
          boxShadow: "var(--app-card-shadow)",
        }}
      >
        {children}
      </div>
      {footer && (
        <div
          style={{
            fontFamily: "var(--app-font)",
            fontSize: 13,
            color: "var(--app-text-secondary)",
            padding: "6px 8px 0",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
