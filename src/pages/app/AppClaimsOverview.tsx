import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, Check, X, AlertCircle } from "lucide-react";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { AppTopSpacer } from "@/components/app-shell/AppTopSpacer";
import { AppCard } from "@/components/app-shell/primitives/AppCard";
import { AppBadge } from "@/components/app-shell/primitives/AppBadge";

type ClaimStatus = "approved" | "pending" | "denied" | "in_review";

interface Claim {
  id: string;
  provider: string;
  date: string;
  amount: string;
  account: string;
  status: ClaimStatus;
  category: string;
}

const CLAIMS: Claim[] = [
  { id: "c1", provider: "Dr. Lisa Monroe – Primary Care", date: "Jan 10, 2025", amount: "$120.00", account: "Health FSA", status: "approved", category: "Medical" },
  { id: "c2", provider: "Walgreens", date: "Jan 8, 2025", amount: "$26.00", account: "HSA", status: "approved", category: "Pharmacy" },
  { id: "c3", provider: "Vision Works", date: "Dec 28, 2024", amount: "$215.00", account: "Health FSA", status: "in_review", category: "Vision" },
  { id: "c4", provider: "Advanced Dental Group", date: "Dec 15, 2024", amount: "$340.00", account: "Health FSA", status: "pending", category: "Dental" },
  { id: "c5", provider: "CVS Pharmacy", date: "Dec 10, 2024", amount: "$18.50", account: "HSA", status: "denied", category: "Pharmacy" },
  { id: "c6", provider: "MRI Imaging Center", date: "Nov 30, 2024", amount: "$850.00", account: "Health FSA", status: "approved", category: "Medical" },
];

const STATUS_META: Record<ClaimStatus, { label: string; variant: "success" | "warning" | "info" | "destructive" | "neutral"; icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }> }> = {
  approved: { label: "Approved", variant: "success",     icon: Check },
  pending:  { label: "Pending",  variant: "warning",     icon: Clock },
  denied:   { label: "Denied",   variant: "destructive", icon: X },
  in_review:{ label: "In Review",variant: "info",        icon: AlertCircle },
};

const FILTER_OPTIONS: { label: string; value: ClaimStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Pending", value: "pending" },
  { label: "In Review", value: "in_review" },
  { label: "Denied", value: "denied" },
];

export default function AppClaimsOverview() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<ClaimStatus | "all">("all");

  const filtered = filter === "all" ? CLAIMS : CLAIMS.filter((c) => c.status === filter);

  return (
    <div
      style={{
        minHeight: "100%",
        background: "var(--app-bg)",
        fontFamily: "var(--app-font)",
      }}
    >
      <AppTopSpacer variant="page" />
      <AppNavBar title="Claims" />

      <div style={{ padding: "16px 16px 24px" }}>
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Total Claims", value: "6", color: "var(--app-tint)" },
            { label: "Approved", value: "3", color: "var(--app-success)" },
            { label: "Pending", value: "2", color: "hsl(38 92% 44%)" },
          ].map((s) => (
            <AppCard key={s.label} variant="solid" padding="12px 14px">
              <div
                style={{
                  font: "var(--app-font-title2)",
                  color: s.color,
                  fontWeight: 700,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  font: "var(--app-font-caption1)",
                  color: "var(--app-text-secondary)",
                  marginTop: 3,
                }}
              >
                {s.label}
              </div>
            </AppCard>
          ))}
        </div>

        {/* Filter chips */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 4,
            marginBottom: 16,
            scrollbarWidth: "none",
          }}
        >
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              style={{
                flexShrink: 0,
                padding: "7px 14px",
                borderRadius: "var(--app-radius-pill)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--app-font)",
                fontSize: 14,
                fontWeight: filter === opt.value ? 600 : 400,
                background: filter === opt.value ? "var(--app-tint)" : "var(--app-surface)",
                color: filter === opt.value ? "#fff" : "var(--app-text)",
                boxShadow:
                  filter === opt.value
                    ? "0 2px 8px rgba(0,0,0,0.15)"
                    : "var(--app-card-shadow)",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Claims list */}
        <AppCard variant="solid" padding="0">
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "40px 16px",
                textAlign: "center",
                font: "var(--app-font-subhead)",
                color: "var(--app-text-secondary)",
              }}
            >
              No claims found
            </div>
          ) : (
            filtered.map((claim, i) => {
              const sm = STATUS_META[claim.status];
              const isLast = i === filtered.length - 1;
              return (
                <div
                  key={claim.id}
                  onClick={() => navigate(`/app/claims/${claim.id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "13px 16px",
                    gap: 12,
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "hsl(208 100% 95%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={18} strokeWidth={1.75} style={{ color: "var(--app-tint)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        font: "var(--app-font-subhead)",
                        fontWeight: 500,
                        color: "var(--app-text)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {claim.provider}
                    </div>
                    <div
                      style={{
                        font: "var(--app-font-caption1)",
                        color: "var(--app-text-secondary)",
                        marginTop: 2,
                      }}
                    >
                      {claim.date} · {claim.category}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span
                      style={{
                        font: "var(--app-font-subhead)",
                        fontWeight: 600,
                        color: "var(--app-text)",
                      }}
                    >
                      {claim.amount}
                    </span>
                    <AppBadge label={sm.label} variant={sm.variant} size="sm" />
                  </div>
                  {!isLast && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 68,
                        right: 0,
                        height: "0.5px",
                        background: "var(--app-separator)",
                      }}
                    />
                  )}
                </div>
              );
            })
          )}
        </AppCard>
      </div>
    </div>
  );
}
