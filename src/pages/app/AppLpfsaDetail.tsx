import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight, FileSearch, SlidersHorizontal, HeartPulse, Baby, CalendarCheck2 } from "lucide-react";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { AppTopSpacer } from "@/components/app-shell/AppTopSpacer";
import type { TransactionRow } from "./AppAccountOverview";
import { TransactionDetailSheet } from "./AppAccountOverview";

const CARD_SHADOW = "0px 3.017px 9.051px rgba(43,49,78,0.04), 0px 6.034px 18.101px rgba(43,49,78,0.06)";
const TEXT_PRIMARY = "#14182c";
const TEXT_SECONDARY = "#5f6a94";
const TINT = "#3958c3";
const SEPARATOR = "#e6e6e6";
const WARNING_BG = "#fff9e6";
const WARNING_TEXT = "#4a3500";
const SUCCESS_SURFACE = "#ecfdf5";
const SUCCESS_TEXT = "#002c22";
const CRITICAL_RED = "#dc2626";
const BORDER_COLOR = "#b7c0da";
const INFO_SURFACE = "#eff6ff";
const TINT_50 = "#eef2ff";

/* ── Per-account-type mock data ─────────────────────────────────────── */

interface BalanceRow {
  label: string;
  value?: string;
  valueColor?: string;
  badge?: { text: string; bg: string; color: string };
}

interface AccountData {
  title: string;
  icon: React.ElementType;
  balanceSubtitle: string;
  balance: string;
  balanceRows: BalanceRow[];
  effectiveDate: string;
  planDuration: string;
  finalServiceDate: string;
  finalFilingDate: string;
  finalFilingDescription: string;
  debitCardAllowed: string;
  maxPerTransaction: string;
  claimsStats: { value: string; label: string }[];
  electionAmount: string;
  contributions: { label: string; value: string }[];
  status: { label: string; value: string }[];
  transactions: TransactionRow[];
}

const ACCOUNT_DATA: Record<string, AccountData> = {
  lpfsa: {
    title: "Limited Purpose FSA",
    icon: CalendarCheck2,
    balanceSubtitle: "FSA Available Balance",
    balance: "$850.00",
    balanceRows: [
      { label: "Plan Year", value: "$1,500.00" },
      { label: "Eligible Amount", value: "$1,750.00" },
      { label: "Rollover Amount", value: "$250.00" },
      { label: "Use it or Lose It", value: "$300.00", valueColor: CRITICAL_RED },
      { label: "File by 3/31/2026", badge: { text: "90 days", bg: WARNING_BG, color: WARNING_TEXT } },
    ],
    effectiveDate: "January 1, 2026",
    planDuration: "Jan 1, 2026 - Dec 31, 2026",
    finalServiceDate: "December 31, 2025",
    finalFilingDate: "March 31, 2026",
    finalFilingDescription: "Last date to submit claims for the 2025 plan year",
    debitCardAllowed: "Yes",
    maxPerTransaction: "No maximum",
    claimsStats: [
      { value: "$640.00", label: "Total Paid" },
      { value: "$892.00", label: "Total Submitted" },
      { value: "0.00", label: "Total Pending" },
      { value: "$252.00", label: "Total Denied" },
    ],
    electionAmount: "$640.00",
    contributions: [
      { label: "Employer", value: "$892.00" },
      { label: "My Contribution to Date", value: "$0.00" },
    ],
    status: [
      { label: "Eligible Amount", value: "$0.00" },
      { label: "Estimated Payroll Deductible", value: "$252.00" },
    ],
    transactions: [
      { merchant: "Pharmacy", date: "4/27/2026", account: "LPFSA", amount: "$42.50", processedDate: "04/27/2026", description: "Prescription Medicine", planYear: "2026", availableBalance: "$807.50", runningBalance: "$765.00", status: "complete" },
      { merchant: "Dr. Miller DDS", date: "4/27/2026", account: "LPFSA", amount: "$340.00", processedDate: "04/27/2026", description: "Dental Services", planYear: "2026", availableBalance: "$1,147.50", runningBalance: "$807.50", status: "complete" },
      { merchant: "CVS Pharmacy", date: "4/24/2026", account: "LPFSA", amount: "$28.10", processedDate: "04/24/2026", description: "Prescription Medicine", planYear: "2026", availableBalance: "$1,175.60", runningBalance: "$1,147.50", status: "complete" },
      { merchant: "Target Store", date: "4/20/2026", account: "LPFSA", amount: "$34.99", processedDate: "04/20/2026", description: "Health Products", planYear: "2026", availableBalance: "$1,210.59", runningBalance: "$1,175.60", status: "complete" },
      { merchant: "Walgreens Pharmacy", date: "4/18/2026", account: "LPFSA", amount: "$19.50", processedDate: "04/18/2026", description: "Prescription Medicine", planYear: "2026", availableBalance: "$1,230.09", runningBalance: "$1,210.59", status: "complete" },
    ],
  },
  fsa: {
    title: "Healthcare FSA",
    icon: HeartPulse,
    balanceSubtitle: "FSA Available Balance",
    balance: "$850.00",
    balanceRows: [
      { label: "Plan Year", value: "$1,500.00" },
      { label: "Eligible Amount", value: "$1,750.00" },
      { label: "Max Rollover", value: "$500.00" },
      { label: "Use it or Lose It", value: "$350.00", valueColor: CRITICAL_RED },
      { label: "File by 3/31/2026", badge: { text: "90 days", bg: WARNING_BG, color: WARNING_TEXT } },
    ],
    effectiveDate: "January 1, 2026",
    planDuration: "Jan 1, 2026 - Dec 31, 2026",
    finalServiceDate: "December 31, 2025",
    finalFilingDate: "March 31, 2026",
    finalFilingDescription: "Last date to submit claims for the 2025 plan year",
    debitCardAllowed: "Yes",
    maxPerTransaction: "No maximum",
    claimsStats: [
      { value: "$1,020.00", label: "Total Paid" },
      { value: "$1,020.00", label: "Total Submitted" },
      { value: "$0.00", label: "Total Pending" },
      { value: "$0.00", label: "Total Denied" },
    ],
    electionAmount: "$1,500.00",
    contributions: [
      { label: "Employer", value: "$0.00" },
      { label: "My Contribution to Date", value: "$1,500.00" },
    ],
    status: [
      { label: "Eligible Amount", value: "$1,500.00" },
      { label: "Estimated Payroll Deductible", value: "$57.69" },
    ],
    transactions: [
      { merchant: "Pharmacy", date: "4/27/2026", account: "FSA", amount: "$42.50", processedDate: "04/27/2026", description: "Prescription Medicine", planYear: "2026", availableBalance: "$807.50", runningBalance: "$765.00", status: "complete" },
      { merchant: "CVS Pharmacy", date: "4/25/2026", account: "FSA", amount: "$28.10", processedDate: "04/25/2026", description: "OTC Medicine", planYear: "2026", availableBalance: "$835.60", runningBalance: "$807.50", status: "complete" },
      { merchant: "Target Store", date: "4/20/2026", account: "FSA", amount: "$34.99", processedDate: "04/20/2026", description: "Health Products", planYear: "2026", availableBalance: "$870.59", runningBalance: "$835.60", status: "complete" },
      { merchant: "Walgreens Pharmacy", date: "4/18/2026", account: "FSA", amount: "$19.50", processedDate: "04/18/2026", description: "Prescription Medicine", planYear: "2026", availableBalance: "$890.09", runningBalance: "$870.59", status: "complete" },
      { merchant: "Dr. Smith Family Med", date: "3/18/2026", account: "FSA", amount: "$30.00", processedDate: "03/18/2026", description: "Primary Care Visit", planYear: "2026", availableBalance: "$920.09", runningBalance: "$890.09", status: "complete" },
    ],
  },
  dcfsa: {
    title: "DCFSA",
    icon: Baby,
    balanceSubtitle: "DCFSA Available Balance",
    balance: "$620.00",
    balanceRows: [
      { label: "Plan Year", value: "$5,000.00" },
      { label: "Eligible Amount", value: "$5,000.00" },
      { label: "Use it or Lose It", value: "$620.00", valueColor: CRITICAL_RED },
      { label: "File by 3/31/2026", badge: { text: "90 days", bg: WARNING_BG, color: WARNING_TEXT } },
    ],
    effectiveDate: "January 1, 2025",
    planDuration: "Jan 1, 2025 - Dec 31, 2025",
    finalServiceDate: "December 31, 2025",
    finalFilingDate: "March 31, 2026",
    finalFilingDescription: "Last date to submit claims for the 2025 plan year",
    debitCardAllowed: "No",
    maxPerTransaction: "No maximum",
    claimsStats: [
      { value: "$4,380.00", label: "Total Paid" },
      { value: "$4,380.00", label: "Total Submitted" },
      { value: "$0.00", label: "Total Pending" },
      { value: "$0.00", label: "Total Denied" },
    ],
    electionAmount: "$5,000.00",
    contributions: [
      { label: "Employer", value: "$0.00" },
      { label: "My Contribution to Date", value: "$5,000.00" },
    ],
    status: [
      { label: "Eligible Amount", value: "$5,000.00" },
      { label: "Estimated Payroll Deductible", value: "$192.31" },
    ],
    transactions: [
      { merchant: "Bright Horizons Daycare", date: "4/27/2026", account: "DCFSA", amount: "$185.00", processedDate: "04/27/2026", description: "Childcare", planYear: "2025", availableBalance: "$620.00", runningBalance: "$435.00", status: "complete" },
      { merchant: "KinderCare", date: "4/22/2026", account: "DCFSA", amount: "$210.00", processedDate: "04/22/2026", description: "Daycare", planYear: "2025", availableBalance: "$830.00", runningBalance: "$620.00", status: "complete" },
      { merchant: "Camp Discovery", date: "3/10/2026", account: "DCFSA", amount: "$150.00", processedDate: "03/10/2026", description: "Day Camp", planYear: "2025", availableBalance: "$980.00", runningBalance: "$830.00", status: "complete" },
      { merchant: "Little Stars Preschool", date: "2/15/2026", account: "DCFSA", amount: "$320.00", processedDate: "02/15/2026", description: "Preschool", planYear: "2025", availableBalance: "$1,300.00", runningBalance: "$980.00", status: "complete" },
      { merchant: "YMCA After School", date: "1/28/2026", account: "DCFSA", amount: "$175.00", processedDate: "01/28/2026", description: "After School Care", planYear: "2025", availableBalance: "$1,475.00", runningBalance: "$1,300.00", status: "complete" },
    ],
  },
};

function SectionIcon() {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: INFO_SURFACE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <FileSearch size={20} strokeWidth={1.75} style={{ color: TINT }} />
    </div>
  );
}

function ActiveBadge() {
  return (
    <div
      style={{
        background: SUCCESS_SURFACE,
        borderRadius: 6,
        padding: "4px 12px",
        fontSize: 12,
        fontWeight: 500,
        lineHeight: "16px",
        color: SUCCESS_TEXT,
      }}
    >
      Active
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueColor,
  badge,
  showSeparator = true,
}: {
  label: string;
  value?: string;
  valueColor?: string;
  badge?: { text: string; bg: string; color: string };
  showSeparator?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {showSeparator && <div style={{ height: 1, background: SEPARATOR }} />}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 52,
        }}
      >
        <span
          style={{
            fontSize: 17,
            fontWeight: 400,
            lineHeight: "22px",
            letterSpacing: 0,
            color: "var(--app-text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {label}
        </span>
        {value && (
          <span
            style={{
              fontSize: 17,
              fontWeight: 600,
              lineHeight: "22px",
              letterSpacing: 0,
              color: valueColor ?? "var(--app-text-secondary)",
              textAlign: "right",
              flexShrink: 0,
            }}
          >
            {value}
          </span>
        )}
        {badge && (
          <div
            style={{
              background: badge.bg,
              borderRadius: 100,
              padding: "6px 11px",
              fontSize: 17,
              fontWeight: 400,
              lineHeight: "22px",
              letterSpacing: -0.43,
              color: badge.color,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {badge.text}
          </div>
        )}
      </div>
    </div>
  );
}

function BorderedSubCard({ title, description, date }: { title: string; description?: string; date: string }) {
  return (
    <div
      style={{
        border: `1px solid ${BORDER_COLOR}`,
        borderRadius: 24,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            lineHeight: "21px",
            letterSpacing: -0.31,
            color: TEXT_PRIMARY,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: 15,
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: -0.23,
              color: TEXT_PRIMARY,
            }}
          >
            {description}
          </div>
        )}
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
          lineHeight: "20px",
          letterSpacing: -0.23,
          color: TEXT_PRIMARY,
        }}
      >
        {date}
      </div>
    </div>
  );
}

function ElectionSubCard({ title, rows }: { title: string; rows: { label: string; value: string }[] }) {
  return (
    <div
      style={{
        border: `1px solid ${BORDER_COLOR}`,
        borderRadius: 24,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          lineHeight: "21px",
          letterSpacing: -0.31,
          color: TEXT_PRIMARY,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {rows.map((row, i) => (
          <div key={row.label} style={{ display: "flex", flexDirection: "column" }}>
            {i > 0 && <div style={{ height: 1, background: SEPARATOR }} />}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: 52,
              }}
            >
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 400,
                  lineHeight: "22px",
                  letterSpacing: -0.43,
                  color: TEXT_PRIMARY,
                }}
              >
                {row.label}
              </span>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  lineHeight: "22px",
                  letterSpacing: -0.43,
                  color: TEXT_SECONDARY,
                  textAlign: "right",
                }}
              >
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AppLpfsaDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const accountId = location.pathname.split("/").pop() ?? "lpfsa";
  const data = ACCOUNT_DATA[accountId] ?? ACCOUNT_DATA["lpfsa"];
  const [selectedTransaction, setSelectedTransaction] = React.useState<TransactionRow | null>(null);

  return (
    <div
      style={{
        minHeight: "auto",
        fontFamily: "var(--app-font)",
        paddingBottom: "calc(var(--app-tabbar-height, 95px) + env(safe-area-inset-bottom, 0px) + 64px)",
      }}
    >
      <AppTopSpacer variant="page" />
      <AppNavBar variant="sub-page" title={data.title} backTo="/app/account" />

      {/* Page Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          padding: "24px 16px 0",
        }}
      >
        {/* 1. Account Balance Card */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            boxShadow: CARD_SHADOW,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: TINT_50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <data.icon size={20} strokeWidth={1.75} style={{ color: TINT }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  lineHeight: "22px",
                  letterSpacing: -0.43,
                  color: TEXT_PRIMARY,
                }}
              >
                Account Balance
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  lineHeight: "16px",
                  color: TEXT_SECONDARY,
                }}
              >
                {data.balanceSubtitle}
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              lineHeight: "34px",
              letterSpacing: 0.38,
              color: TEXT_PRIMARY,
              paddingTop: 8,
            }}
          >
            {data.balance}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {data.balanceRows.map((row, i) => (
              <InfoRow
                key={row.label}
                label={row.label}
                value={row.value}
                valueColor={row.valueColor}
                badge={row.badge}
                showSeparator={i > 0}
              />
            ))}
          </div>

          <div style={{ paddingTop: 8 }}>
            <button
              onClick={() => navigate("/app/reimburse")}
              style={{
                width: "100%",
                height: 50,
                borderRadius: 1000,
                background: TINT,
                border: "none",
                cursor: "pointer",
                fontSize: 17,
                fontWeight: 600,
                lineHeight: "22px",
                letterSpacing: -0.43,
                color: "white",
              }}
            >
              Reimburse Myself
            </button>
          </div>
        </div>

        {/* 2. My Plan Details Card */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            boxShadow: CARD_SHADOW,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SectionIcon />
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  lineHeight: "22px",
                  letterSpacing: -0.43,
                  color: TEXT_PRIMARY,
                }}
              >
                My Plan Details
              </span>
            </div>
            <ActiveBadge />
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <InfoRow label="Effective Date" value={data.effectiveDate} showSeparator={false} />
            <InfoRow label="Plan Duration" value={data.planDuration} />
          </div>

          <BorderedSubCard
            title="Final Service Date"
            description="Last date expenses can be incurred"
            date={data.finalServiceDate}
          />
          <BorderedSubCard
            title="Final Filing Date"
            description={data.finalFilingDescription}
            date={data.finalFilingDate}
          />
        </div>

        {/* 3. Plans Rules Card */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            boxShadow: CARD_SHADOW,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SectionIcon />
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  lineHeight: "22px",
                  letterSpacing: -0.43,
                  color: TEXT_PRIMARY,
                }}
              >
                Plans Rules
              </span>
            </div>
            <ActiveBadge />
          </div>

          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              lineHeight: "21px",
              letterSpacing: -0.31,
              color: TEXT_PRIMARY,
            }}
          >
            Filling Rules
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 400,
              lineHeight: "21px",
              letterSpacing: -0.31,
              color: TEXT_PRIMARY,
            }}
          >
            You must file claims before the final filling date with a service date no later than the final
            service date determined based on your current status.
          </div>

          <InfoRow label="Debit Card Transaction Allowed" value={data.debitCardAllowed} showSeparator={false} />
          <InfoRow label="Max per Transaction Amount" value={data.maxPerTransaction} />
        </div>

        {/* 4. Claims Summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              lineHeight: "24px",
              letterSpacing: -0.18,
              color: TEXT_PRIMARY,
            }}
          >
            Claims Summary
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {data.claimsStats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "white",
                  borderRadius: 24,
                  boxShadow: CARD_SHADOW,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    lineHeight: "28px",
                    letterSpacing: -0.9,
                    color: TEXT_PRIMARY,
                    textAlign: "center",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 400,
                    lineHeight: "20px",
                    letterSpacing: -0.23,
                    color: TEXT_PRIMARY,
                    textAlign: "center",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Elections Card */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            boxShadow: CARD_SHADOW,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SectionIcon />
            <span
              style={{
                fontSize: 17,
                fontWeight: 600,
                lineHeight: "22px",
                letterSpacing: -0.43,
                color: TEXT_PRIMARY,
              }}
            >
              Elections
            </span>
          </div>

          <InfoRow label="Elections Amount" value={data.electionAmount} showSeparator={false} />

          <ElectionSubCard
            title="Contributions"
            rows={data.contributions}
          />
          <ElectionSubCard
            title="Status"
            rows={data.status}
          />
        </div>

        {/* 6. All Transactions */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            boxShadow: CARD_SHADOW,
            padding: "8px 16px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 50,
              paddingBottom: 4,
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                lineHeight: "24px",
                letterSpacing: -0.18,
                color: TEXT_PRIMARY,
              }}
            >
              All Transactions
            </span>
            <button
              aria-label="Filter transactions"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SlidersHorizontal size={20} strokeWidth={1.75} style={{ color: TINT }} />
            </button>
          </div>

          {data.transactions.map((tx, i) => (
            <div key={`${tx.merchant}-${i}`}>
              <div style={{ height: 1, background: SEPARATOR }} />
              <div
                onClick={() => setSelectedTransaction(tx)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 68,
                  gap: 12,
                  cursor: "pointer",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      lineHeight: "22px",
                      letterSpacing: -0.43,
                      color: TEXT_PRIMARY,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tx.merchant}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 400,
                      lineHeight: "20px",
                      letterSpacing: -0.23,
                      color: TEXT_SECONDARY,
                    }}
                  >
                    {tx.date} &bull; {tx.account}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 400,
                      lineHeight: "22px",
                      letterSpacing: -0.43,
                      color: TEXT_SECONDARY,
                      textAlign: "right",
                    }}
                  >
                    {tx.amount}
                  </span>
                  <ChevronRight size={14} strokeWidth={2.5} style={{ color: TEXT_SECONDARY }} />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <TransactionDetailSheet
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
