import { useState } from "react";
import { Bell, ChevronRight, AlertCircle, Info, Check } from "lucide-react";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { AppCard } from "@/components/app-shell/primitives/AppCard";

type MessageType = "alert" | "info" | "confirmation";

interface Message {
  id: string;
  subject: string;
  preview: string;
  date: string;
  type: MessageType;
  read: boolean;
  body: string;
}

const MESSAGES: Message[] = [
  {
    id: "m1",
    subject: "Action Required: LSA Balance Expiring",
    preview: "Your LSA balance will expire on March 31. Please use your remaining $49.00 before...",
    date: "Today",
    type: "alert",
    read: false,
    body: "Your Lifestyle Spending Account (LSA) balance of $49.00 will expire on March 31, 2025. Please use your remaining balance before the deadline. Eligible expenses include gym memberships, fitness equipment, and wellness programs.",
  },
  {
    id: "m2",
    subject: "Payroll Contribution Received",
    preview: "A payroll contribution of $158.00 was deposited to your HSA on January 17...",
    date: "Jan 17",
    type: "confirmation",
    read: false,
    body: "A payroll contribution of $158.00 was successfully deposited to your HSA For Life® account on January 17, 2025. Your current HSA balance is $0.00.",
  },
  {
    id: "m3",
    subject: "Claim Approved – Dr. Lisa Monroe",
    preview: "Your claim for $120.00 from Dr. Lisa Monroe has been approved and payment...",
    date: "Jan 12",
    type: "confirmation",
    read: true,
    body: "Your claim for $120.00 from Dr. Lisa Monroe – Primary Care has been approved. Payment has been processed to your Health FSA account. Claim #CLM-2025-C1.",
  },
  {
    id: "m4",
    subject: "Document Requested – Vision Works",
    preview: "We need additional documentation to process your Vision Works claim of $215.00...",
    date: "Dec 30",
    type: "alert",
    read: true,
    body: "We need additional documentation to process your Vision Works claim of $215.00. Please upload an Explanation of Benefits (EOB) or itemized receipt. You can submit documents through the app or log in to the portal.",
  },
  {
    id: "m5",
    subject: "New Plan Year Starting January 1",
    preview: "Your 2025 benefit accounts are now active. Review your new contribution amounts...",
    date: "Jan 1",
    type: "info",
    read: true,
    body: "Your 2025 benefit accounts are now active. Your Health FSA balance has been reset to $250.00 and your Dependent Care FSA is funded at $5,000.00 for the plan year. Review your contribution amounts and ensure your bank account is up to date.",
  },
  {
    id: "m6",
    subject: "Claim Denied – CVS Pharmacy",
    preview: "Your claim for $18.50 from CVS Pharmacy has been denied. The item is not...",
    date: "Dec 12",
    type: "alert",
    read: true,
    body: "Your claim for $18.50 from CVS Pharmacy has been denied. The purchased item (cosmetic product) is not an eligible HSA expense under IRS guidelines. If you believe this is an error, you can file an appeal within 60 days.",
  },
];

const TYPE_ICON: Record<MessageType, { icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>; bg: string; color: string }> = {
  alert:        { icon: AlertCircle, bg: "hsl(350 62% 94%)",  color: "hsl(350 62% 40%)" },
  info:         { icon: Info,        bg: "hsl(208 100% 93%)", color: "hsl(208 100% 32%)" },
  confirmation: { icon: Check,       bg: "hsl(142 76% 90%)",  color: "hsl(142 76% 30%)" },
};

export default function AppMessageCenter() {
  const [selected, setSelected] = useState<Message | null>(null);
  const [messages, setMessages] = useState(MESSAGES);

  const unreadCount = messages.filter((m) => !m.read).length;

  const open = (msg: Message) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
    );
    setSelected({ ...msg, read: true });
  };

  return (
    <div
      style={{
        minHeight: "100%",
        background: "var(--app-bg)",
        fontFamily: "var(--app-font)",
      }}
    >
      <AppNavBar
        title="Messages"
        rightActions={
          unreadCount > 0 ? (
            <div
              style={{
                minWidth: 20,
                height: 20,
                borderRadius: "var(--app-radius-pill)",
                background: "var(--app-destructive)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 6px",
              }}
            >
              <span
                style={{
                  font: "var(--app-font-caption2)",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {unreadCount}
              </span>
            </div>
          ) : undefined
        }
      />

      <div style={{ padding: "16px 16px 24px" }}>
        {unreadCount > 0 && (
          <div style={{ marginBottom: 16 }}>
            <AppCard variant="glass" padding="12px 16px">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Bell size={18} strokeWidth={1.75} style={{ color: "var(--app-tint)" }} />
                <span style={{ font: "var(--app-font-subhead)", color: "var(--app-text)" }}>
                  {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
                </span>
              </div>
            </AppCard>
          </div>
        )}

        <AppCard variant="solid" padding="0">
          {messages.map((msg, i) => {
            const tm = TYPE_ICON[msg.type];
            const Icon = tm.icon;
            const isLast = i === messages.length - 1;
            return (
              <div
                key={msg.id}
                onClick={() => open(msg)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  padding: "13px 16px",
                  gap: 12,
                  cursor: "pointer",
                  position: "relative",
                  background: msg.read ? "transparent" : "hsl(208 100% 98%)",
                }}
              >
                {/* Unread dot */}
                {!msg.read && (
                  <div
                    style={{
                      position: "absolute",
                      left: 4,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--app-tint)",
                    }}
                  />
                )}

                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: tm.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} strokeWidth={1.75} style={{ color: tm.color }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        font: "var(--app-font-subhead)",
                        fontWeight: msg.read ? 400 : 600,
                        color: "var(--app-text)",
                        flex: 1,
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {msg.subject}
                    </div>
                    <span
                      style={{
                        font: "var(--app-font-caption1)",
                        color: "var(--app-text-secondary)",
                        flexShrink: 0,
                      }}
                    >
                      {msg.date}
                    </span>
                  </div>
                  <div
                    style={{
                      font: "var(--app-font-caption1)",
                      color: "var(--app-text-secondary)",
                      marginTop: 3,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as unknown as React.CSSProperties["WebkitBoxOrient"],
                    }}
                  >
                    {msg.preview}
                  </div>
                </div>

                <ChevronRight size={14} strokeWidth={2} style={{ color: "var(--app-text-tertiary)", flexShrink: 0, marginTop: 4 }} />

                {!isLast && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 66,
                      right: 0,
                      height: "0.5px",
                      background: "var(--app-separator)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </AppCard>
      </div>

      {/* Message detail sheet */}
      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            background: "rgba(0,0,0,0.4)",
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: "var(--app-surface)",
              borderRadius: "var(--app-radius-xl) var(--app-radius-xl) 0 0",
              padding: "0 0 env(safe-area-inset-bottom, 24px)",
              maxHeight: "85dvh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  background: "var(--app-border)",
                }}
              />
            </div>
            <div style={{ padding: "16px 20px 32px" }}>
              <div
                style={{
                  font: "var(--app-font-title3)",
                  color: "var(--app-text)",
                  marginBottom: 6,
                  lineHeight: "26px",
                }}
              >
                {selected.subject}
              </div>
              <div style={{ font: "var(--app-font-caption1)", color: "var(--app-text-secondary)", marginBottom: 16 }}>
                {selected.date}
              </div>
              <div
                style={{
                  font: "var(--app-font-body)",
                  color: "var(--app-text)",
                  lineHeight: "26px",
                }}
              >
                {selected.body}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
