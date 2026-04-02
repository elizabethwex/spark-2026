import { useParams, useNavigate } from "react-router-dom";
import { Check, Clock, X, AlertCircle, FileText, Upload, Phone } from "lucide-react";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { AppTopSpacer } from "@/components/app-shell/AppTopSpacer";
import { AppCard } from "@/components/app-shell/primitives/AppCard";
import { AppBadge } from "@/components/app-shell/primitives/AppBadge";
import { AppButton } from "@/components/app-shell/primitives/AppButton";

type ClaimStatus = "approved" | "pending" | "denied" | "in_review";

interface TimelineStep {
  label: string;
  date?: string;
  completed: boolean;
  active: boolean;
}

interface ClaimDetail {
  id: string;
  provider: string;
  date: string;
  serviceDate: string;
  amount: string;
  eligible: string;
  account: string;
  status: ClaimStatus;
  category: string;
  member: string;
  notes?: string;
  timeline: TimelineStep[];
}

const CLAIM_DATA: Record<string, ClaimDetail> = {
  c1: {
    id: "c1",
    provider: "Dr. Lisa Monroe – Primary Care",
    date: "Jan 10, 2025",
    serviceDate: "Jan 8, 2025",
    amount: "$120.00",
    eligible: "$120.00",
    account: "Health FSA",
    status: "approved",
    category: "Medical",
    member: "Sarah J.",
    timeline: [
      { label: "Submitted",  date: "Jan 10, 2025", completed: true,  active: false },
      { label: "In Review",  date: "Jan 11, 2025", completed: true,  active: false },
      { label: "Approved",   date: "Jan 12, 2025", completed: true,  active: false },
      { label: "Paid",       date: "Jan 13, 2025", completed: true,  active: false },
    ],
  },
  c3: {
    id: "c3",
    provider: "Vision Works",
    date: "Dec 28, 2024",
    serviceDate: "Dec 26, 2024",
    amount: "$215.00",
    eligible: "$215.00",
    account: "Health FSA",
    status: "in_review",
    category: "Vision",
    member: "Sarah J.",
    notes: "Additional documentation requested for vision care claim.",
    timeline: [
      { label: "Submitted",  date: "Dec 28, 2024", completed: true,  active: false },
      { label: "In Review",  date: "Dec 30, 2024", completed: false, active: true  },
      { label: "Decision",                         completed: false, active: false },
      { label: "Paid",                             completed: false, active: false },
    ],
  },
  c4: {
    id: "c4",
    provider: "Advanced Dental Group",
    date: "Dec 15, 2024",
    serviceDate: "Dec 13, 2024",
    amount: "$340.00",
    eligible: "$340.00",
    account: "Health FSA",
    status: "pending",
    category: "Dental",
    member: "Sarah J.",
    timeline: [
      { label: "Submitted",  date: "Dec 15, 2024", completed: true,  active: false },
      { label: "In Review",                        completed: false, active: true  },
      { label: "Decision",                         completed: false, active: false },
      { label: "Paid",                             completed: false, active: false },
    ],
  },
  c5: {
    id: "c5",
    provider: "CVS Pharmacy",
    date: "Dec 10, 2024",
    serviceDate: "Dec 10, 2024",
    amount: "$18.50",
    eligible: "$0.00",
    account: "HSA",
    status: "denied",
    category: "Pharmacy",
    member: "Sarah J.",
    notes: "Item is not an eligible HSA expense. Cosmetics and personal care are excluded.",
    timeline: [
      { label: "Submitted",  date: "Dec 10, 2024", completed: true, active: false },
      { label: "In Review",  date: "Dec 11, 2024", completed: true, active: false },
      { label: "Denied",     date: "Dec 12, 2024", completed: true, active: false },
    ],
  },
};

const DEFAULT_CLAIM: ClaimDetail = {
  id: "c2",
  provider: "Walgreens",
  date: "Jan 8, 2025",
  serviceDate: "Jan 8, 2025",
  amount: "$26.00",
  eligible: "$26.00",
  account: "HSA",
  status: "approved",
  category: "Pharmacy",
  member: "Sarah J.",
  timeline: [
    { label: "Submitted",  date: "Jan 8,  2025", completed: true, active: false },
    { label: "Processing", date: "Jan 9,  2025", completed: true, active: false },
    { label: "Approved",   date: "Jan 10, 2025", completed: true, active: false },
  ],
};

const STATUS_META: Record<ClaimStatus, { label: string; variant: "success" | "warning" | "info" | "destructive" | "neutral"; icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }> }> = {
  approved:  { label: "Approved",  variant: "success",     icon: Check },
  pending:   { label: "Pending",   variant: "warning",     icon: Clock },
  denied:    { label: "Denied",    variant: "destructive", icon: X },
  in_review: { label: "In Review", variant: "info",        icon: AlertCircle },
};

export default function AppClaimsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const claim = (id && CLAIM_DATA[id]) ? CLAIM_DATA[id] : DEFAULT_CLAIM;
  const sm = STATUS_META[claim.status];

  const timelineColor = {
    approved: "var(--app-success)",
    pending:  "hsl(38 92% 44%)",
    denied:   "var(--app-destructive)",
    in_review:"var(--app-tint)",
  }[claim.status];

  return (
    <div
      style={{
        minHeight: "100%",
        background: "var(--app-bg)",
        fontFamily: "var(--app-font)",
      }}
    >
      <AppTopSpacer variant="home" />
      <AppNavBar
        variant="sub-page"
        title="Claim Detail"
        backTo="/app/claims"
        backLabel="Claims"
      />

      <div style={{ padding: "16px 16px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Header card */}
        <AppCard variant="solid" padding="18px 20px">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ font: "var(--app-font-title3)", color: "var(--app-text)" }}>
                {claim.provider}
              </div>
              <div style={{ font: "var(--app-font-footnote)", color: "var(--app-text-secondary)", marginTop: 4 }}>
                {claim.category} · {claim.date}
              </div>
            </div>
            <AppBadge label={sm.label} variant={sm.variant} />
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 24 }}>
            <div>
              <div style={{ font: "var(--app-font-caption1)", color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: 0.3 }}>
                Claimed
              </div>
              <div style={{ font: "var(--app-font-title2)", color: "var(--app-text)", marginTop: 2 }}>
                {claim.amount}
              </div>
            </div>
            <div>
              <div style={{ font: "var(--app-font-caption1)", color: "var(--app-text-secondary)", textTransform: "uppercase", letterSpacing: 0.3 }}>
                Eligible
              </div>
              <div style={{ font: "var(--app-font-title2)", color: claim.status === "denied" ? "var(--app-destructive)" : "var(--app-success)", marginTop: 2 }}>
                {claim.eligible}
              </div>
            </div>
          </div>
        </AppCard>

        {/* Timeline */}
        <AppCard variant="solid" padding="16px 20px">
          <div style={{ font: "var(--app-font-headline)", color: "var(--app-text)", marginBottom: 16 }}>
            Claim Status
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {claim.timeline.map((step, i) => {
              const isLast = i === claim.timeline.length - 1;
              return (
                <div key={i} style={{ display: "flex", gap: 14, position: "relative" }}>
                  {/* Connector line */}
                  {!isLast && (
                    <div
                      style={{
                        position: "absolute",
                        left: 11,
                        top: 24,
                        width: 2,
                        height: "calc(100% - 4px)",
                        background: step.completed ? timelineColor : "var(--app-border)",
                        borderRadius: 1,
                      }}
                    />
                  )}

                  {/* Node */}
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: step.completed ? timelineColor : step.active ? "transparent" : "var(--app-border)",
                      border: step.active ? `2px solid ${timelineColor}` : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      zIndex: 1,
                    }}
                  >
                    {step.completed && (
                      <Check size={12} strokeWidth={3} style={{ color: "#fff" }} />
                    )}
                    {step.active && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: timelineColor,
                        }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div style={{ paddingBottom: isLast ? 0 : 20, flex: 1 }}>
                    <div
                      style={{
                        font: "var(--app-font-subhead)",
                        fontWeight: step.active ? 600 : 500,
                        color: step.completed || step.active ? "var(--app-text)" : "var(--app-text-secondary)",
                        lineHeight: "24px",
                      }}
                    >
                      {step.label}
                    </div>
                    {step.date && (
                      <div
                        style={{
                          font: "var(--app-font-caption1)",
                          color: "var(--app-text-secondary)",
                          marginTop: 2,
                        }}
                      >
                        {step.date}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </AppCard>

        {/* Claim details */}
        <AppCard variant="solid" padding="0">
          {[
            { label: "Service Date", value: claim.serviceDate },
            { label: "Account",      value: claim.account },
            { label: "Member",       value: claim.member },
            { label: "Claim #",      value: `CLM-2025-${claim.id.toUpperCase()}` },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "13px 16px",
                position: "relative",
              }}
            >
              <span style={{ font: "var(--app-font-subhead)", color: "var(--app-text-secondary)" }}>
                {row.label}
              </span>
              <span style={{ font: "var(--app-font-subhead)", fontWeight: 500, color: "var(--app-text)" }}>
                {row.value}
              </span>
              {i < arr.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 16,
                    right: 0,
                    height: "0.5px",
                    background: "var(--app-separator)",
                  }}
                />
              )}
            </div>
          ))}
        </AppCard>

        {/* Notes */}
        {claim.notes && (
          <AppCard variant="solid" padding="14px 16px">
            <div style={{ display: "flex", gap: 10 }}>
              <AlertCircle size={18} strokeWidth={1.75} style={{ color: "hsl(38 92% 44%)", flexShrink: 0, marginTop: 1 }} />
              <div style={{ font: "var(--app-font-subhead)", color: "var(--app-text)", lineHeight: "22px" }}>
                {claim.notes}
              </div>
            </div>
          </AppCard>
        )}

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {claim.status === "denied" && (
            <AppButton variant="primary" size="lg" fullWidth icon={<FileText size={18} strokeWidth={1.75} />}>
              File an Appeal
            </AppButton>
          )}
          {(claim.status === "in_review" || claim.status === "pending") && (
            <AppButton variant="primary" size="lg" fullWidth icon={<Upload size={18} strokeWidth={1.75} />}>
              Upload Documentation
            </AppButton>
          )}
          <AppButton
            variant="secondary"
            size="lg"
            fullWidth
            icon={<Phone size={18} strokeWidth={1.75} />}
            onClick={() => navigate("/app/assist-iq")}
          >
            Ask Assist IQ
          </AppButton>
        </div>
      </div>
    </div>
  );
}
