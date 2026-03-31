import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, X, Mic } from "lucide-react";
import { AppNavBar, AppNavAction } from "@/components/app-shell/AppNavBar";
import { AppChatBubble, AppPromptChip } from "@/components/app-shell/primitives/AppChatBubble";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  "What's my HSA balance?",
  "How do I submit a claim?",
  "What expenses are HSA-eligible?",
  "When does my FSA expire?",
  "How much can I contribute?",
  "Why was my claim denied?",
];

const CANNED_RESPONSES: Record<string, string> = {
  "what's my hsa balance?": "Your HSA For Life® currently has an available balance of $0.00. Your 2025 IRS contribution limit is $4,300. You've contributed $2,530.00 so far this year.",
  "how do i submit a claim?": "To submit a claim:\n\n1. Tap Claims in the tab bar\n2. Tap the + button in the top right\n3. Choose your expense category\n4. Upload your receipt or EOB\n5. Confirm the amount and account\n\nClaims are typically processed within 2-3 business days.",
  "what expenses are hsa-eligible?": "Common HSA-eligible expenses include:\n\n• Doctor visits and copays\n• Prescription medications\n• Dental care and orthodontia\n• Vision care and glasses\n• Mental health services\n• Certain medical equipment\n\nCosmetics, gym memberships, and vitamins are generally not eligible unless prescribed. Would you like a full list?",
  "when does my fsa expire?": "Your Health FSA plan year runs January 1 – December 31, 2025. You currently have $250.00 remaining.\n\nYour LSA has a more urgent deadline — it expires March 31, 2025 with $49.00 remaining. I recommend using it soon!",
  "how much can i contribute?": "For 2025:\n\n• HSA: Up to $4,300 (individual) or $8,550 (family)\n• Health FSA: Up to $3,200 (employer plan limit)\n• Dependent Care FSA: Up to $5,000\n\nYour current 2025 contributions are on track based on your payroll elections.",
  "why was my claim denied?": "Your most recent denied claim was from CVS Pharmacy ($18.50) on December 10, 2024. It was denied because the item purchased was a cosmetic product, which is not an IRS-eligible HSA expense.\n\nWould you like to file an appeal or learn more about eligible expenses?",
};

function getResponse(input: string): string {
  const key = input.toLowerCase().trim();
  for (const [q, a] of Object.entries(CANNED_RESPONSES)) {
    if (key.includes(q.replace("?", "")) || q.includes(key)) return a;
  }
  return "Great question! I'm here to help with your WEX health benefit accounts. I can assist with account balances, claims, eligible expenses, contribution limits, and more. Could you provide more details so I can give you the most accurate answer?";
}

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "0",
    role: "assistant",
    content: "Hi Sarah! 👋 I'm Assist IQ, your WEX benefits assistant. I can help you with account balances, claims, eligible expenses, and more.\n\nHow can I help you today?",
    timestamp: now(),
  },
];

export default function AppAssistIQ() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getResponse(trimmed),
        timestamp: now(),
      };
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 1000 + Math.random() * 800);
  };

  const clear = () => {
    setMessages(INITIAL_MESSAGES);
    setIsTyping(false);
  };

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "var(--app-bg)",
        fontFamily: "var(--app-font)",
        position: "relative",
        maxWidth: 430,
        margin: "0 auto",
      }}
    >
      <AppNavBar
        title="Assist IQ"
        rightActions={
          messages.length > 1 ? (
            <AppNavAction icon={<X size={18} strokeWidth={2} />} label="Clear chat" onClick={clear} />
          ) : undefined
        }
      />

      {/* Message list */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 16px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* AI header pill */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: "var(--app-radius-pill)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              background: "var(--app-glass-bg)",
              border: "0.5px solid var(--app-glass-border)",
              boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "linear-gradient(135deg, hsl(270 60% 55%) 0%, hsl(208 100% 45%) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={12} strokeWidth={2} style={{ color: "#fff" }} />
            </div>
            <span
              style={{
                font: "var(--app-font-footnote)",
                fontWeight: 600,
                color: "var(--app-text)",
              }}
            >
              Powered by Assist IQ
            </span>
          </div>
        </div>

        {messages.map((msg) => (
          <AppChatBubble key={msg.id} role={msg.role} timestamp={msg.timestamp}>
            {msg.content.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < msg.content.split("\n").length - 1 && <br />}
              </span>
            ))}
          </AppChatBubble>
        ))}

        {isTyping && (
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 12 }}>
            <div
              style={{
                padding: "12px 16px",
                borderRadius:
                  "var(--app-radius-lg) var(--app-radius-lg) var(--app-radius-lg) var(--app-radius-sm)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                background: "var(--app-glass-bg)",
                border: "0.5px solid var(--app-glass-border)",
                display: "flex",
                gap: 4,
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((dot) => (
                <div
                  key={dot}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--app-text-secondary)",
                    animation: `pulse 1.2s ease-in-out ${dot * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Suggested prompts — shown only at start */}
        {messages.length === 1 && !isTyping && (
          <div style={{ marginTop: 8, marginBottom: 16 }}>
            <div
              style={{
                font: "var(--app-font-footnote)",
                color: "var(--app-text-secondary)",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Suggested questions
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                justifyContent: "center",
              }}
            >
              {SUGGESTED_PROMPTS.map((prompt) => (
                <AppPromptChip key={prompt} label={prompt} onClick={() => send(prompt)} />
              ))}
            </div>
          </div>
        )}

        {/* Spacer so content clears the input bar */}
        <div style={{ height: 16 }} />
      </div>

      {/* Input bar */}
      <div
        style={{
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          background: "var(--app-glass-bg)",
          borderTop: "0.5px solid var(--app-glass-border)",
          padding: "10px 16px",
          paddingBottom: "calc(10px + env(safe-area-inset-bottom, 0px))",
          // Sit above the tab bar
          marginBottom: "var(--app-tabbar-height)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 10,
            background: "var(--app-surface)",
            borderRadius: "var(--app-radius-xl)",
            padding: "8px 8px 8px 16px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Message Assist IQ…"
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              outline: "none",
              fontFamily: "var(--app-font)",
              fontSize: 17,
              letterSpacing: -0.41,
              color: "var(--app-text)",
              lineHeight: "22px",
              resize: "none",
            }}
          />

          {input.trim() ? (
            <button
              onClick={() => send(input)}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--app-tint)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Send size={15} strokeWidth={2.5} style={{ color: "#fff", marginLeft: 1 }} />
            </button>
          ) : (
            <button
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--app-glass-bg)",
                border: "0.5px solid var(--app-glass-border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Mic size={15} strokeWidth={2} style={{ color: "var(--app-text-secondary)" }} />
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.85); }
          30% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
