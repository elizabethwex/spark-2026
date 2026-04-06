import type { ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, Clock, X, AlertCircle } from "lucide-react";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { AppTopSpacer } from "@/components/app-shell/AppTopSpacer";
import {
  CLAIMS_PAGE_BACKGROUND,
  CLAIMS_STROKE,
  CLAIMS_ROW_SEPARATOR,
  CLAIMS_SUPPORT_LINK,
  CLAIMS_LIST_BADGE_SUCCESS_FG,
} from "./claimsPageStyles";

type ClaimStatus = "approved" | "pending" | "denied" | "in_review";

interface ClaimDetail {
  id: string;
  provider: string;
  displayDate: string;
  account: string;
  transactionAmount: string;
  careRecipient: string;
  claimNumber: string;
  status: ClaimStatus;
  reimbursedAmount: string;
}

const RECEIPT_THUMB = `${import.meta.env.BASE_URL}app-ui/penny-receipt.svg`;

const CLAIM_DATA: Record<string, ClaimDetail> = {
  c2: {
    id: "c2",
    provider: "CVS Pharmacy",
    displayDate: "February 24, 2026",
    account: "Flexible Spending 2025 (FSA)",
    transactionAmount: "$24.99",
    careRecipient: "Nicole Moretti",
    claimNumber: "01SMA251117P0000301",
    status: "approved",
    reimbursedAmount: "$24.99",
  },
  c1: {
    id: "c1",
    provider: "Dr. Lisa Monroe – Primary Care",
    displayDate: "January 10, 2025",
    account: "Health FSA",
    transactionAmount: "$120.00",
    careRecipient: "Sarah J.",
    claimNumber: "CLM-2025-C1",
    status: "approved",
    reimbursedAmount: "$120.00",
  },
  c7: {
    id: "c7",
    provider: "Walgreens",
    displayDate: "January 8, 2025",
    account: "HSA",
    transactionAmount: "$26.00",
    careRecipient: "Sarah J.",
    claimNumber: "CLM-2025-C7",
    status: "approved",
    reimbursedAmount: "$26.00",
  },
  c3: {
    id: "c3",
    provider: "Vision Works",
    displayDate: "December 28, 2024",
    account: "Health FSA",
    transactionAmount: "$215.00",
    careRecipient: "Sarah J.",
    claimNumber: "CLM-2025-C3",
    status: "in_review",
    reimbursedAmount: "—",
  },
  c4: {
    id: "c4",
    provider: "Advanced Dental Group",
    displayDate: "December 15, 2024",
    account: "Health FSA",
    transactionAmount: "$340.00",
    careRecipient: "Sarah J.",
    claimNumber: "CLM-2025-C4",
    status: "pending",
    reimbursedAmount: "—",
  },
  c5: {
    id: "c5",
    provider: "CVS Pharmacy (prior)",
    displayDate: "December 10, 2024",
    account: "HSA",
    transactionAmount: "$18.50",
    careRecipient: "Sarah J.",
    claimNumber: "CLM-2025-C5",
    status: "denied",
    reimbursedAmount: "$0.00",
  },
  c6: {
    id: "c6",
    provider: "MRI Imaging Center",
    displayDate: "November 30, 2024",
    account: "Health FSA",
    transactionAmount: "$850.00",
    careRecipient: "Sarah J.",
    claimNumber: "CLM-2025-C6",
    status: "approved",
    reimbursedAmount: "$850.00",
  },
};

const DEFAULT_CLAIM: ClaimDetail = CLAIM_DATA.c2;

const STATUS_RECEIPT: Record<ClaimStatus, { label: string; color: string; showCheck: boolean }> = {
  approved: { label: "Approved", color: CLAIMS_LIST_BADGE_SUCCESS_FG, showCheck: true },
  pending: { label: "Pending", color: "var(--app-warning)", showCheck: false },
  denied: { label: "Denied", color: "var(--app-destructive)", showCheck: false },
  in_review: { label: "In Review", color: "var(--app-primary)", showCheck: false },
};

function DetailRow({
  value,
  label,
  trailing,
  topSeparator,
}: {
  value: string;
  label: string;
  trailing?: ReactNode;
  topSeparator?: boolean;
}) {
  return (
    <div
      style={{
        padding: "0 16px",
        minHeight: 68,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxSizing: "border-box",
        borderTop: topSeparator ? `1px solid ${CLAIMS_ROW_SEPARATOR}` : undefined,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 0 }}>
          <div
            style={{
              fontSize: 17,
              lineHeight: "22px",
              letterSpacing: -0.43,
              color: "var(--app-text)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </div>
          <div
            style={{
              fontSize: 15,
              lineHeight: "20px",
              letterSpacing: -0.23,
              color: "var(--app-text-secondary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        </div>
        {trailing != null ? (
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>{trailing}</div>
        ) : null}
      </div>
    </div>
  );
}

function BorderedCard({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${CLAIMS_STROKE}`,
        borderRadius: 12,
        overflow: "hidden",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
}

export default function AppClaimsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const claim = id && CLAIM_DATA[id] ? CLAIM_DATA[id] : DEFAULT_CLAIM;
  const receipt = STATUS_RECEIPT[claim.status];

  return (
    <div
      style={{
        minHeight: "100%",
        background: CLAIMS_PAGE_BACKGROUND,
        fontFamily: "var(--app-font)",
        paddingBottom: "calc(var(--app-tabbar-height, 95px) + env(safe-area-inset-bottom, 0px) + 64px)",
      }}
    >
      <AppTopSpacer variant="home" />
      <AppNavBar variant="sub-page" title="Claim details" backTo="/app/claims" backLabel="Back" />

      <div style={{ padding: "16px 16px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
        <BorderedCard>
          <DetailRow topSeparator value={claim.displayDate} label="Date" />
          <DetailRow value={claim.account} label="Account" />
          <DetailRow
            topSeparator
            value={claim.provider}
            label="Transaction"
            trailing={
              <span style={{ fontSize: 17, lineHeight: "22px", letterSpacing: -0.43, color: "var(--app-text-secondary)" }}>
                {claim.transactionAmount}
              </span>
            }
          />
          <DetailRow topSeparator value={claim.careRecipient} label="Care recipient" />
          <DetailRow topSeparator value={claim.claimNumber} label="Claim number" />
        </BorderedCard>

        <BorderedCard>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 16px",
              minHeight: 52,
              boxSizing: "border-box",
            }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 4, overflow: "hidden", flexShrink: 0 }}>
              <img src={RECEIPT_THUMB} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0, fontSize: 17, lineHeight: "22px", letterSpacing: -0.43, color: "var(--app-text)" }}>
              Receipt
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 17, lineHeight: "22px", color: receipt.color, fontWeight: 400 }}>{receipt.label}</span>
              {receipt.showCheck ? (
                <Check size={22} strokeWidth={2.5} style={{ color: "var(--app-success)" }} aria-hidden />
              ) : claim.status === "pending" ? (
                <Clock size={22} strokeWidth={2} style={{ color: receipt.color }} aria-hidden />
              ) : claim.status === "denied" ? (
                <X size={22} strokeWidth={2} style={{ color: receipt.color }} aria-hidden />
              ) : (
                <AlertCircle size={22} strokeWidth={2} style={{ color: receipt.color }} aria-hidden />
              )}
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${CLAIMS_ROW_SEPARATOR}` }}>
            <div
              style={{
                padding: "0 16px",
                minHeight: 68,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 17, lineHeight: "22px", letterSpacing: -0.43, color: "var(--app-text)" }}>Amount reimbursed</span>
              <span style={{ fontSize: 17, lineHeight: "22px", letterSpacing: -0.43, color: "var(--app-text)", fontWeight: 400 }}>
                {claim.reimbursedAmount}
              </span>
            </div>
          </div>
        </BorderedCard>

        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0px 3.017px 9.051px rgba(43,49,78,0.04), 0px 6.034px 18.101px rgba(43,49,78,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              lineHeight: "24px",
              letterSpacing: -0.18,
              color: "var(--app-text)",
            }}
          >
            Questions about this claim?
          </p>
          <p style={{ margin: 0, fontSize: 16, lineHeight: "24px", color: "var(--app-text)" }}>
            Here’s how we can help: review your claim details above, or reach out for personalized support.
          </p>
          <button
            type="button"
            onClick={() => navigate("/app/assist-iq")}
            style={{
              alignSelf: "flex-start",
              border: "none",
              background: "none",
              padding: 0,
              fontFamily: "var(--app-font)",
              fontSize: 16,
              fontWeight: 500,
              lineHeight: "24px",
              color: CLAIMS_SUPPORT_LINK,
              cursor: "pointer",
            }}
          >
            Get support
          </button>
        </div>
      </div>
    </div>
  );
}
