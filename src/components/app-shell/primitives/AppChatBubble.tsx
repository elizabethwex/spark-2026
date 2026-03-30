import type { ReactNode } from "react";

interface AppChatBubbleProps {
  /** "user" = right-aligned tint bubble; "assistant" = left-aligned glass bubble */
  role: "user" | "assistant";
  children: ReactNode;
  /** Timestamp label shown below */
  timestamp?: string;
}

export function AppChatBubble({ role, children, timestamp }: AppChatBubbleProps) {
  const isUser = role === "user";

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
          padding: "10px 14px",
          borderRadius: isUser
            ? "var(--app-radius-lg) var(--app-radius-lg) var(--app-radius-sm) var(--app-radius-lg)"
            : "var(--app-radius-lg) var(--app-radius-lg) var(--app-radius-lg) var(--app-radius-sm)",
          ...(isUser
            ? {
                background: "var(--app-tint)",
                color: "var(--app-text-on-tint)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              }
            : {
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                background: "var(--app-glass-bg)",
                border: "0.5px solid var(--app-glass-border)",
                color: "var(--app-text)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }),
          fontSize: 17,
          lineHeight: "22px",
          letterSpacing: -0.41,
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

/** Suggested prompt chip for the Assist IQ screen */
export function AppPromptChip({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "8px 14px",
        borderRadius: "var(--app-radius-pill)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        background: "var(--app-glass-bg)",
        border: "0.5px solid var(--app-glass-border)",
        cursor: "pointer",
        fontFamily: "var(--app-font)",
        fontSize: 15,
        fontWeight: 400,
        letterSpacing: -0.24,
        color: "var(--app-tint)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}
