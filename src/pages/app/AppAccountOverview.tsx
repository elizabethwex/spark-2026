import { useNavigate } from "react-router-dom";
import { Wallet, TrendingUp, ArrowRight, ChevronRight } from "lucide-react";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { AppCard } from "@/components/app-shell/primitives/AppCard";
import { AppBadge } from "@/components/app-shell/primitives/AppBadge";

interface AccountSummary {
  id: string;
  name: string;
  type: string;
  balance: string;
  balanceNum: number;
  limit: number;
  color: string;
  planYear: string;
  alert?: string;
  badge?: { label: string; variant: "success" | "warning" | "info" | "neutral" };
}

const ACCOUNTS: AccountSummary[] = [
  {
    id: "hsa",
    name: "HSA For Life®",
    type: "Health Savings Account",
    balance: "$0.00",
    balanceNum: 0,
    limit: 4300,
    color: "hsl(208 100% 45%)",
    planYear: "2025",
    badge: { label: "Active", variant: "success" },
  },
  {
    id: "fsa-health",
    name: "Health FSA",
    type: "Flexible Spending Account",
    balance: "$250.00",
    balanceNum: 250,
    limit: 3050,
    color: "hsl(142 76% 36%)",
    planYear: "Jan 1 – Dec 31, 2025",
    alert: "49 days remaining",
    badge: { label: "Expiring Soon", variant: "warning" },
  },
  {
    id: "fsa-dep",
    name: "Dep. Care FSA",
    type: "Dependent Care FSA",
    balance: "$1,592.00",
    balanceNum: 1592,
    limit: 5000,
    color: "hsl(270 60% 50%)",
    planYear: "Jan 1 – Dec 31, 2025",
    badge: { label: "Active", variant: "success" },
  },
];

const YEAR_SUMMARY = [
  { label: "Total Contributions", value: "$2,530.00" },
  { label: "Total Expenses", value: "$938.00" },
  { label: "Year-to-Date Savings", value: "$1,592.00" },
];

export default function AppAccountOverview() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100%",
        background: "var(--app-bg)",
        fontFamily: "var(--app-font)",
      }}
    >
      <AppNavBar title="Accounts" backTo="/app" backLabel="Home" />

      <div
        style={{
          padding: "16px 16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Account cards */}
        {ACCOUNTS.map((acct) => {
          const pct = Math.min(100, (acct.balanceNum / acct.limit) * 100);
          return (
            <AppCard
              key={acct.id}
              variant="solid"
              padding="0"
              onClick={() => navigate(`/app/account/${acct.id}`)}
            >
              {/* Color header bar */}
              <div
                style={{
                  height: 6,
                  background: acct.color,
                  borderRadius: "var(--app-radius-lg) var(--app-radius-lg) 0 0",
                }}
              />
              <div style={{ padding: "14px 16px 16px" }}>
                {/* Header row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "var(--app-radius-sm)",
                          background: acct.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Wallet size={16} strokeWidth={1.75} style={{ color: "#fff" }} />
                      </div>
                      <div>
                        <div
                          style={{
                            font: "var(--app-font-headline)",
                            color: "var(--app-text)",
                          }}
                        >
                          {acct.name}
                        </div>
                        <div
                          style={{
                            font: "var(--app-font-caption1)",
                            color: "var(--app-text-secondary)",
                            marginTop: 1,
                          }}
                        >
                          {acct.planYear}
                        </div>
                      </div>
                    </div>
                  </div>
                  {acct.badge && (
                    <AppBadge label={acct.badge.label} variant={acct.badge.variant} size="sm" />
                  )}
                </div>

                {/* Balance */}
                <div style={{ marginTop: 14 }}>
                  <div
                    style={{
                      font: "var(--app-font-caption1)",
                      color: "var(--app-text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: 0.3,
                    }}
                  >
                    Available Balance
                  </div>
                  <div
                    style={{
                      font: "var(--app-font-title1)",
                      color: "var(--app-text)",
                      marginTop: 2,
                    }}
                  >
                    {acct.balance}
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        font: "var(--app-font-caption1)",
                        color: "var(--app-text-secondary)",
                      }}
                    >
                      {pct.toFixed(0)}% of ${acct.limit.toLocaleString()} limit
                    </span>
                    {acct.alert && (
                      <span
                        style={{
                          font: "var(--app-font-caption1)",
                          color: "hsl(38 92% 38%)",
                          fontWeight: 600,
                        }}
                      >
                        ⏰ {acct.alert}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "var(--app-border)",
                      borderRadius: "var(--app-radius-pill)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: acct.color,
                        borderRadius: "var(--app-radius-pill)",
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>

                {/* View details link */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 4,
                    marginTop: 12,
                    font: "var(--app-font-subhead)",
                    color: "var(--app-tint)",
                  }}
                >
                  View details
                  <ChevronRight size={14} strokeWidth={2} />
                </div>
              </div>
            </AppCard>
          );
        })}

        {/* Year summary */}
        <div>
          <div
            style={{
              font: "var(--app-font-footnote)",
              fontWeight: 600,
              color: "var(--app-text-secondary)",
              textTransform: "uppercase",
              letterSpacing: 0.4,
              padding: "0 4px 8px",
            }}
          >
            2025 Plan Year Summary
          </div>
          <AppCard variant="solid" padding="0">
            {YEAR_SUMMARY.map((row, i) => (
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
                <span
                  style={{
                    font: "var(--app-font-subhead)",
                    color: "var(--app-text)",
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    font: "var(--app-font-subhead)",
                    fontWeight: 600,
                    color: "var(--app-text)",
                  }}
                >
                  {row.value}
                </span>
                {i < YEAR_SUMMARY.length - 1 && (
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
        </div>

        {/* Invest CTA */}
        <AppCard variant="glass" padding="14px 16px">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--app-radius-md)",
                background: "hsl(208 100% 45%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <TrendingUp size={20} strokeWidth={1.75} style={{ color: "#fff" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  font: "var(--app-font-subhead)",
                  fontWeight: 600,
                  color: "var(--app-text)",
                }}
              >
                Invest your HSA
              </div>
              <div
                style={{
                  font: "var(--app-font-caption1)",
                  color: "var(--app-text-secondary)",
                  marginTop: 2,
                }}
              >
                Grow your balance tax-free
              </div>
            </div>
            <ArrowRight size={16} strokeWidth={2} style={{ color: "var(--app-tint)" }} />
          </div>
        </AppCard>
      </div>
    </div>
  );
}
