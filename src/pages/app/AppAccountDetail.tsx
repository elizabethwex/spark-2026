import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Wallet, ArrowUpRight, ArrowDownLeft, Check, Clock, X } from "lucide-react";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { AppCard } from "@/components/app-shell/primitives/AppCard";
import { AppBadge } from "@/components/app-shell/primitives/AppBadge";

interface TxItem {
  date: string;
  merchant: string;
  amount: string;
  status: "paid" | "pending" | "processing" | "denied";
  category: string;
}

const ALL_TX: TxItem[] = [
  { date: "Jan 17, 2025", merchant: "Payroll Contribution", amount: "+ $158.00", status: "pending", category: "Contribution" },
  { date: "Jan 14, 2025", merchant: "Walgreens", amount: "- $26.00", status: "paid", category: "Pharmacy" },
  { date: "Jan 14, 2025", merchant: "Payroll Contribution", amount: "+ $158.00", status: "paid", category: "Contribution" },
  { date: "Jan 10, 2025", merchant: "Dr. Smith – Copay", amount: "- $40.00", status: "paid", category: "Medical" },
  { date: "Jan 7, 2025", merchant: "Vision Works", amount: "- $120.00", status: "paid", category: "Vision" },
  { date: "Jan 3, 2025", merchant: "CVS Pharmacy", amount: "- $18.50", status: "denied", category: "Pharmacy" },
];

const STATUS_INFO: Record<TxItem["status"], { label: string; variant: "success" | "warning" | "neutral" | "destructive"; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }> = {
  paid:       { label: "Paid",       variant: "success",     icon: Check },
  pending:    { label: "Pending",    variant: "warning",     icon: Clock },
  processing: { label: "Processing", variant: "neutral",     icon: Clock },
  denied:     { label: "Denied",     variant: "destructive", icon: X },
};

const ACCOUNT_META: Record<string, { name: string; balance: string; color: string; planYear: string }> = {
  hsa:       { name: "HSA For Life®",   balance: "$0.00",     color: "hsl(208 100% 45%)", planYear: "2025" },
  "fsa-health": { name: "Health FSA",   balance: "$250.00",   color: "hsl(142 76% 36%)", planYear: "Jan 1 – Dec 31, 2025" },
  "fsa-dep": { name: "Dep. Care FSA",   balance: "$1,592.00", color: "hsl(270 60% 50%)", planYear: "Jan 1 – Dec 31, 2025" },
};

export default function AppAccountDetail() {
  const { id = "hsa" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedTx, setSelectedTx] = useState<TxItem | null>(null);
  const meta = ACCOUNT_META[id] ?? ACCOUNT_META["hsa"];

  return (
    <div
      style={{
        minHeight: "100%",
        background: "var(--app-bg)",
        fontFamily: "var(--app-font)",
      }}
    >
      <AppNavBar title={meta.name} backTo="/app/account" backLabel="Accounts" />

      <div style={{ padding: "0 0 24px" }}>
        {/* Balance hero */}
        <div
          style={{
            background: meta.color,
            padding: "20px 20px 28px",
          }}
        >
          <div
            style={{
              font: "var(--app-font-caption1)",
              color: "rgba(255,255,255,0.75)",
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            Available Balance
          </div>
          <div
            style={{
              font: "var(--app-font-large-title)",
              color: "#fff",
              marginTop: 4,
            }}
          >
            {meta.balance}
          </div>
          <div
            style={{
              font: "var(--app-font-caption1)",
              color: "rgba(255,255,255,0.65)",
              marginTop: 6,
            }}
          >
            {meta.planYear}
          </div>

          {/* Quick stat row */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 18,
              paddingTop: 16,
              borderTop: "0.5px solid rgba(255,255,255,0.2)",
            }}
          >
            {[
              { label: "Contributions", value: "$2,530", icon: ArrowDownLeft },
              { label: "Expenses", value: "$2,530", icon: ArrowUpRight },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: "var(--app-radius-md)",
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Icon size={16} strokeWidth={2} style={{ color: "rgba(255,255,255,0.8)" }} />
                <div>
                  <div style={{ font: "var(--app-font-caption2)", color: "rgba(255,255,255,0.7)" }}>
                    {label}
                  </div>
                  <div style={{ font: "var(--app-font-callout)", fontWeight: 600, color: "#fff" }}>
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction list */}
        <div style={{ padding: "20px 16px 0" }}>
          <div
            style={{
              font: "var(--app-font-footnote)",
              fontWeight: 600,
              color: "var(--app-text-secondary)",
              textTransform: "uppercase",
              letterSpacing: 0.4,
              marginBottom: 8,
            }}
          >
            Transactions
          </div>
          <AppCard variant="solid" padding="0">
            {ALL_TX.map((tx, i) => {
              const si = STATUS_INFO[tx.status];
              const isLast = i === ALL_TX.length - 1;
              const isPositive = tx.amount.startsWith("+");
              return (
                <div
                  key={i}
                  onClick={() => setSelectedTx(tx)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "12px 16px",
                    gap: 12,
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: isPositive ? "hsl(142 76% 94%)" : "hsl(208 100% 95%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isPositive ? (
                      <ArrowDownLeft
                        size={16}
                        strokeWidth={2}
                        style={{ color: "hsl(142 76% 30%)" }}
                      />
                    ) : (
                      <Wallet size={16} strokeWidth={1.75} style={{ color: "var(--app-tint)" }} />
                    )}
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
                      {tx.merchant}
                    </div>
                    <div
                      style={{
                        font: "var(--app-font-caption1)",
                        color: "var(--app-text-secondary)",
                        marginTop: 2,
                      }}
                    >
                      {tx.date} · {tx.category}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span
                      style={{
                        font: "var(--app-font-subhead)",
                        fontWeight: 600,
                        color: isPositive ? "var(--app-success)" : "var(--app-text)",
                      }}
                    >
                      {tx.amount}
                    </span>
                    <AppBadge label={si.label} variant={si.variant} size="sm" />
                  </div>
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
      </div>

      {/* Transaction detail sheet */}
      {selectedTx && (
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
          onClick={() => setSelectedTx(null)}
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
            {/* Handle */}
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

            <div style={{ padding: "16px 20px 24px" }}>
              <div
                style={{
                  font: "var(--app-font-title2)",
                  color: "var(--app-text)",
                  marginBottom: 4,
                }}
              >
                {selectedTx.merchant}
              </div>
              <div
                style={{
                  font: "var(--app-font-title1)",
                  color: selectedTx.amount.startsWith("+") ? "var(--app-success)" : "var(--app-text)",
                  marginBottom: 16,
                }}
              >
                {selectedTx.amount}
              </div>

              {[
                { label: "Date", value: selectedTx.date },
                { label: "Category", value: selectedTx.category },
                { label: "Account", value: meta.name },
                { label: "Status", value: selectedTx.status },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      font: "var(--app-font-subhead)",
                      color: "var(--app-text-secondary)",
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      font: "var(--app-font-subhead)",
                      fontWeight: 500,
                      color: "var(--app-text)",
                      textTransform: "capitalize",
                    }}
                  >
                    {row.value}
                  </span>
                  {i < arr.length - 1 && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "0.5px",
                        background: "var(--app-separator)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
