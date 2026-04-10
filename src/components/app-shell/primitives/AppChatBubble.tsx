import type { ReactNode } from "react";
import { User } from "lucide-react";

const ASSIST_IQ_GRADIENT = "linear-gradient(133.5deg, #25146f 2.5%, #c8102e 100%)";

interface AppChatBubbleProps {
  /** "user" = right-aligned neutral bubble; "assistant" = left-aligned glass bubble */
  role: "user" | "assistant";
  children: ReactNode;
  /** Timestamp label shown below */
  timestamp?: string;
  /**
   * "bubble" (default) = classic bubble background on both sides.
   * "plain" = user gets neutral pill, assistant gets no background (Figma claims style).
   */
  variant?: "bubble" | "plain";
}

export function AppChatBubble({ role, children, timestamp, variant = "bubble" }: AppChatBubbleProps) {
  const isUser = role === "user";

  const bubbleStyle: React.CSSProperties =
    variant === "plain"
      ? isUser
        ? {
            background: "#e3e7f4",
            color: "#14182c",
            boxShadow: "none",
            padding: "10px 16px",
          }
        : {
            background: "transparent",
            color: "#14182c",
            padding: "0",
          }
      : isUser
        ? {
            background: "var(--app-primary)",
            color: "var(--app-text-on-primary)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            padding: "10px 14px",
          }
        : {
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            background: "var(--app-glass-bg)",
            border: "0.5px solid var(--app-glass-border)",
            color: "var(--app-text)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            padding: "10px 14px",
          };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        marginBottom: 12,
        paddingLeft: isUser ? 40 : 0,
        paddingRight: isUser ? 0 : 40,
        fontFamily: "var(--app-font)",
      }}
    >
      <div
        style={{
          borderRadius: isUser
            ? "var(--app-radius-lg) var(--app-radius-lg) var(--app-radius-sm) var(--app-radius-lg)"
            : "var(--app-radius-lg) var(--app-radius-lg) var(--app-radius-lg) var(--app-radius-sm)",
          fontSize: 17,
          lineHeight: "22px",
          letterSpacing: -0.41,
          maxWidth: "100%",
          ...bubbleStyle,
        }}
      >
        {children}
      </div>
      {timestamp && (
        <div
          style={{
            fontSize: 11,
            color: "var(--app-text-tertiary)",
            marginTop: 4,
            letterSpacing: 0,
          }}
        >
          {timestamp}
        </div>
      )}
    </div>
  );
}

/** Gradient avatar circle used in WEXly chat headers */
export function AssistIQAvatar({ size = 28 }: { size?: number }) {
  const iconSize = Math.round(size * 0.5);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: ASSIST_IQ_GRADIENT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        letterSpacing: 0,
      }}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.913 13.9149L11.9997 24.0033L10.087 13.9149L0 12.0013L10.087 10.0884L12.0003 0L13.913 10.0884L24 12.0013L13.913 13.9149Z" fill="white"/>
        <path d="M20.2758 19.7969L19.5994 23.3628L18.923 19.7969L15.3569 19.1204L18.923 18.4439L19.5994 14.8781L20.2752 18.4439L23.8412 19.1204L20.2758 19.7969Z" fill="white"/>
      </svg>
    </div>
  );
}

/** Suggested prompt chip for the WEXly screen */
export function AppPromptChip({
  label,
  onClick,
  icon,
  variant = "glass",
}: {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
  /** "glass" = existing frosted style; "outlined" = Figma welcome screen style (white bg, brand border) */
  variant?: "glass" | "outlined";
}) {
  const isOutlined = variant === "outlined";
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: isOutlined ? "10px 17px" : "8px 14px",
        borderRadius: "var(--app-radius-pill)",
        background: isOutlined ? "#fff" : "var(--app-glass-bg)",
        border: isOutlined ? "1px solid #25146f" : "0.5px solid var(--app-glass-border)",
        backdropFilter: isOutlined ? undefined : "blur(20px) saturate(180%)",
        WebkitBackdropFilter: isOutlined ? undefined : "blur(20px) saturate(180%)",
        cursor: "pointer",
        fontFamily: "var(--app-font)",
        fontSize: isOutlined ? 14 : 15,
        fontWeight: isOutlined ? 500 : 400,
        letterSpacing: isOutlined ? -0.08 : -0.24,
        color: "#14182c",
        boxShadow: isOutlined ? "none" : "0 1px 4px rgba(0,0,0,0.07)",
        whiteSpace: "nowrap",
        textAlign: "left",
      }}
    >
      {icon && <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</span>}
      {label}
    </button>
  );
}
