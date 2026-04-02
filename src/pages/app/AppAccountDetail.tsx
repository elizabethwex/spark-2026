import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Sparkles,
  DollarSign,
  Receipt,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  PieChart,
  FileText,
  ArrowLeftRight,
  HandCoins,
} from "lucide-react";

const CARD_SHADOW = "0px 3.017px 9.051px rgba(43,49,78,0.04), 0px 6.034px 18.101px rgba(43,49,78,0.06)";
const INVESTMENT_SHADOW =
  "0px 12px 16px -4px rgba(10,13,18,0.08), 0px 4px 6px -2px rgba(10,13,18,0.03), 0px 2px 2px -1px rgba(10,13,18,0.04)";
const TEXT_PRIMARY = "#14182c";
const TEXT_SECONDARY = "#5f6a94";
const TINT = "#3958c3";
const TINT_50 = "#eef2ff";
const LIGHT_BLUE = "#a0dcf8";
const DARK_BLUE = "#0058a3";
const SEPARATOR = "#e6e6e6";
const BG_TERTIARY = "rgba(118,118,128,0.12)";
const SUCCESS_GREEN = "#34c759";
const SUCCESS_BG = "#099";
const LIGHT_BLUE_BORDER = "#e1e8ff";
const LIGHT_BLUE_BG = "#edf1ff";

/** Degrees clockwise from 12 o'clock (Figma: first slice starts ~7 o'clock). */
const DONUT_START_DEG = 210;

/** SVG path for one donut ring slice; angles are degrees clockwise from top. */
function donutSlicePath(
  cx: number,
  cy: number,
  rOut: number,
  rIn: number,
  startDeg: number,
  sweepDeg: number
): string {
  const endDeg = startDeg + sweepDeg;
  const polar = (r: number, deg: number) => {
    const t = (deg * Math.PI) / 180;
    return { x: cx + r * Math.sin(t), y: cy - r * Math.cos(t) };
  };
  const p1 = polar(rOut, startDeg);
  const p2 = polar(rOut, endDeg);
  const p3 = polar(rIn, endDeg);
  const p4 = polar(rIn, startDeg);
  const largeArc = sweepDeg > 180 ? 1 : 0;
  return [
    "M",
    p1.x,
    p1.y,
    "A",
    rOut,
    rOut,
    0,
    largeArc,
    1,
    p2.x,
    p2.y,
    "L",
    p3.x,
    p3.y,
    "A",
    rIn,
    rIn,
    0,
    largeArc,
    0,
    p4.x,
    p4.y,
    "Z",
  ].join(" ");
}

interface TransactionItem {
  merchant: string;
  date: string;
  amount: string;
  type: "credit" | "debit";
}

const TRANSACTIONS: TransactionItem[] = [
  { merchant: "Claim reimbursement", date: "Feb 14", amount: "+ $50.08", type: "credit" },
  { merchant: "Employer contribution", date: "Feb 10", amount: "+ $750.00", type: "credit" },
  { merchant: "Primary care visit", date: "Feb 8", amount: "- $78.12", type: "debit" },
  { merchant: "Pharmacy purchase", date: "Feb 5", amount: "- $46.21", type: "debit" },
];

const PORTFOLIO_ALLOCATION = [
  { label: "Large cap growth", percent: "24%", color: "#25146f" },
  { label: "Large cap value", percent: "20%", color: "#1c6eff" },
  { label: "Commodities", percent: "9%", color: "#81aeff" },
  { label: "International", percent: "9%", color: "#d2ddff" },
  { label: "Other", percent: "38%", color: "#edf1ff" },
];

const HOLDINGS = [
  { ticker: "VUG", name: "Vanguard Growth ETF", value: "$3,096.00" },
  { ticker: "VTV", name: "Vanguard Value ETF", value: "$2,580.00" },
  { ticker: "PDBC", name: "Invesco Optimum Yield Diversified", value: "$1,161.00" },
];

const INVESTMENT_TRANSACTIONS = [
  { description: "Bought VUG", date: "4/27/2026", amount: "$250.00", icon: "check" },
  { description: "Bought VTV", date: "4/27/2026", amount: "$250.00", icon: "check" },
  { description: "Funds transferred", date: "4/27/2026 • HSA", amount: "$500.00", icon: "transfer" },
];

const ACCOUNT_META: Record<string, { name: string; totalBalance: string; availableCash: string }> = {
  hsa: {
    name: "Health Savings Account",
    totalBalance: "$15,900.00",
    availableCash: "$3,000.00",
  },
  lpfsa: {
    name: "Limited Purpose FSA",
    totalBalance: "$850.00",
    availableCash: "$850.00",
  },
};

export default function AppAccountDetail() {
  const { id = "hsa" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"spending" | "investments">("spending");
  const meta = ACCOUNT_META[id] ?? ACCOUNT_META["hsa"];

  const renderSpendingView = () => (
    <>
      {/* Available HSA Cash Card */}
      <div
        style={{
          background: "white",
          borderRadius: 24,
          boxShadow: CARD_SHADOW,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div
          style={{
            fontSize: 17,
            fontWeight: 400,
            lineHeight: "22px",
            letterSpacing: -0.43,
            color: TEXT_SECONDARY,
          }}
        >
          Available HSA Cash
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            lineHeight: "34px",
            letterSpacing: 0.38,
            color: TEXT_PRIMARY,
          }}
        >
          {meta.availableCash}
        </div>
      </div>

      {/* 2026 Contributions Card */}
      <div
        style={{
          background: "white",
          borderRadius: 24,
          boxShadow: CARD_SHADOW,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            fontSize: 17,
            fontWeight: 400,
            lineHeight: "22px",
            letterSpacing: -0.43,
            color: TEXT_SECONDARY,
          }}
        >
          2026 Contributions
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 400,
                lineHeight: "20px",
                letterSpacing: -0.23,
                color: TEXT_PRIMARY,
              }}
            >
              <span style={{ fontWeight: 800 }}>$3,500.00</span>
              {" contributed of "}
              <span style={{ fontWeight: 800 }}>$4,150.00</span>
              {" limit"}
            </div>

            <div
              style={{
                position: "relative",
                height: 20,
                borderRadius: 24,
                overflow: "hidden",
                background: "#edeff0",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: "42%",
                  background: LIGHT_BLUE,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  height: "100%",
                  width: "35%",
                  background: DARK_BLUE,
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: DARK_BLUE,
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    lineHeight: "18px",
                    letterSpacing: -0.08,
                    color: TEXT_PRIMARY,
                  }}
                >
                  Your Contributions
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: "18px",
                  letterSpacing: -0.08,
                  color: TEXT_PRIMARY,
                }}
              >
                $3,000.00
              </div>
            </div>

            <div style={{ height: 1, background: SEPARATOR }} />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: LIGHT_BLUE,
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    lineHeight: "18px",
                    letterSpacing: -0.08,
                    color: TEXT_PRIMARY,
                  }}
                >
                  Employer Contributions
                </div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: "18px",
                  letterSpacing: -0.08,
                  color: TEXT_PRIMARY,
                }}
              >
                $500.00
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: 24,
            boxShadow: CARD_SHADOW,
            padding: "20px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: TINT_50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DollarSign size={28} strokeWidth={2} style={{ color: TINT }} />
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              lineHeight: "20px",
              letterSpacing: -0.23,
              color: TEXT_PRIMARY,
              textAlign: "center",
            }}
          >
            Make a payment
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 24,
            boxShadow: CARD_SHADOW,
            padding: "20px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: TINT_50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Receipt size={28} strokeWidth={2} style={{ color: TINT }} />
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              lineHeight: "20px",
              letterSpacing: -0.23,
              color: TEXT_PRIMARY,
              textAlign: "center",
            }}
          >
            Reimburse Myself
          </div>
        </div>
      </div>

      {/* Account Transactions Section */}
      <div
        style={{
          background: "white",
          borderRadius: 24,
          boxShadow: CARD_SHADOW,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 16px 12px",
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
            Account transactions
          </span>
          <button
            aria-label="Filter transactions"
            style={{
              width: 40,
              height: 40,
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

        {TRANSACTIONS.map((tx, i) => (
          <div key={`${tx.merchant}-${i}`}>
            {i > 0 && (
              <div
                style={{
                  height: 1,
                  background: SEPARATOR,
                  marginLeft: 16,
                }}
              />
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
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
                  {tx.date}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 17,
                    fontWeight: 400,
                    lineHeight: "22px",
                    letterSpacing: -0.43,
                    color: tx.type === "credit" ? "#059669" : TEXT_PRIMARY,
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
    </>
  );

  const renderInvestmentsView = () => (
    <>
      {/* Total Invested Card with Pie Chart */}
      <div
        style={{
          background: "white",
          borderRadius: 24,
          boxShadow: CARD_SHADOW,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 17,
                fontWeight: 400,
                lineHeight: "22px",
                letterSpacing: -0.43,
                color: TEXT_SECONDARY,
              }}
            >
              Total Invested
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  lineHeight: "34px",
                  letterSpacing: 0.38,
                  color: TEXT_PRIMARY,
                }}
              >
                $12,900.00
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: SUCCESS_BG,
                  borderRadius: 9999,
                  padding: "4px 10px",
                }}
              >
                <TrendingUp size={10} strokeWidth={2.5} style={{ color: "white" }} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: "20px",
                    color: "white",
                  }}
                >
                  +8.5%
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {/* Donut chart (132px) — slices start at 7 o’clock, clockwise; matches legend order */}
            <svg
              width={132}
              height={132}
              viewBox="0 0 132 132"
              style={{ flexShrink: 0 }}
              aria-hidden
            >
              {(() => {
                const cx = 66;
                const cy = 66;
                const rOut = 66;
                const rIn = 40;
                let cursor = DONUT_START_DEG;
                return PORTFOLIO_ALLOCATION.map((item) => {
                  const sweep = (parseFloat(item.percent) / 100) * 360;
                  const d = donutSlicePath(cx, cy, rOut, rIn, cursor, sweep);
                  cursor += sweep;
                  return (
                    <path
                      key={item.label}
                      d={d}
                      fill={item.color}
                      stroke="#ffffff"
                      strokeWidth={1.25}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                });
              })()}
            </svg>

            {/* Portfolio Allocation Legend */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, paddingLeft: 8 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  lineHeight: "20px",
                  letterSpacing: -0.23,
                  color: TEXT_PRIMARY,
                }}
              >
                Aggressive Portfolio
              </div>
              {PORTFOLIO_ALLOCATION.map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: item.color,
                        flexShrink: 0,
                      }}
                    />
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        lineHeight: "18px",
                        letterSpacing: -0.08,
                        color: TEXT_PRIMARY,
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      lineHeight: "18px",
                      letterSpacing: -0.08,
                      color: TEXT_PRIMARY,
                      paddingLeft: 8,
                    }}
                  >
                    {item.percent}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Your Portfolio Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            height: 50,
            paddingBottom: 16,
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
            Your Portfolio
          </span>
          <button
            aria-label="View all"
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
            <ArrowRight size={20} strokeWidth={2} style={{ color: TINT }} />
          </button>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 24,
            boxShadow: CARD_SHADOW,
            padding: "8px 16px",
          }}
        >
          {HOLDINGS.map((holding, i) => (
            <div key={holding.ticker}>
              {i > 0 && (
                <div
                  style={{
                    height: 1,
                    background: SEPARATOR,
                  }}
                />
              )}
              <div
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
                    }}
                  >
                    {holding.ticker}
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 400,
                      lineHeight: "20px",
                      letterSpacing: -0.23,
                      color: TEXT_SECONDARY,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {holding.name}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      lineHeight: "22px",
                      letterSpacing: -0.43,
                      color: TEXT_PRIMARY,
                      textAlign: "right",
                    }}
                  >
                    {holding.value}
                  </span>
                  <ChevronRight size={14} strokeWidth={2.5} style={{ color: TEXT_SECONDARY }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Action Buttons (2x2 Grid) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 12,
        }}
      >
        {[
          { label: "Change Portfolio", icon: PieChart },
          { label: "Retake Assessment", icon: FileText },
          { label: "Edit Auto-transfer", icon: ArrowLeftRight },
          { label: "Liquidate account", icon: HandCoins },
        ].map(({ label, icon: Icon }) => (
          <div
            key={label}
            style={{
              background: "white",
              border: `1px solid ${LIGHT_BLUE_BORDER}`,
              borderRadius: 24,
              boxShadow: INVESTMENT_SHADOW,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: LIGHT_BLUE_BG,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={22} strokeWidth={1.75} style={{ color: TINT }} />
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                lineHeight: "20px",
                color: TEXT_PRIMARY,
                textAlign: "center",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Investment Transactions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            height: 50,
            paddingBottom: 16,
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
            Recent Investment Transactions
          </span>
          <button
            aria-label="View all"
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
            <ArrowRight size={20} strokeWidth={2} style={{ color: TINT }} />
          </button>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 24,
            boxShadow: CARD_SHADOW,
            padding: "8px 16px",
          }}
        >
          {INVESTMENT_TRANSACTIONS.map((tx, i) => (
            <div key={`${tx.description}-${i}`}>
              {i > 0 && (
                <div
                  style={{
                    height: 1,
                    background: SEPARATOR,
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 68,
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {tx.icon === "check" ? (
                    <CheckCircle2 size={17} strokeWidth={2} style={{ color: SUCCESS_GREEN }} />
                  ) : (
                    <ArrowLeftRight size={17} strokeWidth={2} style={{ color: TEXT_SECONDARY }} />
                  )}
                </div>
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
                    {tx.description}
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
                    {tx.date}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      lineHeight: "22px",
                      letterSpacing: -0.43,
                      color: TEXT_PRIMARY,
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
    </>
  );

  return (
    <div
      style={{
        minHeight: "auto",
        fontFamily: "var(--app-font)",
        background: "linear-gradient(186.833deg, #eef2ff 50%, #a5b4fc 140%)",
        paddingBottom: "calc(var(--app-tabbar-height, 95px) + env(safe-area-inset-bottom, 0px) + 64px)",
      }}
    >
      {/* Custom Navigation Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "0.5px solid rgba(255,255,255,0.5)",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px 8px",
            position: "relative",
          }}
        >
          {/* Back button */}
          <button
            onClick={() => navigate("/app/account")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px 4px",
              minWidth: 44,
              height: 44,
              color: TEXT_PRIMARY,
              fontSize: 17,
              fontWeight: 500,
            }}
          >
            <ChevronLeft size={20} strokeWidth={2} />
            <span>Back</span>
          </button>

          {/* Center title */}
          <span
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "24px",
              letterSpacing: -0.084,
              color: TEXT_PRIMARY,
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {meta.name}
          </span>

          {/* AssistIQ button */}
          <button
            aria-label="Assist IQ"
            onClick={() => navigate("/app/assist-iq")}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "linear-gradient(133.5deg, #25146F 2.46%, #C8102E 100%)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 16px rgba(37,20,111,0.35)",
            }}
          >
            <Sparkles size={20} strokeWidth={1.75} style={{ color: "#fff" }} />
          </button>
        </div>
      </div>

      {/* Page content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          padding: "24px 16px 0",
        }}
      >
        {/* Total Account Balance Card */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            boxShadow: CARD_SHADOW,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div
              style={{
                fontSize: 17,
                fontWeight: 400,
                lineHeight: "22px",
                letterSpacing: -0.43,
                color: TEXT_SECONDARY,
              }}
            >
              Total Account Balance
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 400,
                lineHeight: "16px",
                color: TEXT_SECONDARY,
              }}
            >
              Cash + Invested Assets
            </div>
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              lineHeight: "41px",
              letterSpacing: 0.4,
              color: TEXT_PRIMARY,
            }}
          >
            {meta.totalBalance}
          </div>
        </div>

        {/* Segmented Control */}
        <div
          style={{
            background: BG_TERTIARY,
            borderRadius: 100,
            height: 48,
            padding: 2,
            display: "flex",
            gap: 4,
          }}
        >
          <button
            onClick={() => setActiveTab("spending")}
            style={{
              flex: 1,
              height: "100%",
              border: "none",
              cursor: "pointer",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: activeTab === "spending" ? 600 : 400,
              letterSpacing: -0.08,
              background: activeTab === "spending" ? TINT : "transparent",
              color: activeTab === "spending" ? "white" : TEXT_PRIMARY,
              transition: "all 0.2s ease",
            }}
          >
            Spending
          </button>
          <button
            onClick={() => setActiveTab("investments")}
            style={{
              flex: 1,
              height: "100%",
              border: "none",
              cursor: "pointer",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: activeTab === "investments" ? 600 : 400,
              letterSpacing: -0.08,
              background: activeTab === "investments" ? TINT : "transparent",
              color: activeTab === "investments" ? "white" : TEXT_PRIMARY,
              transition: "all 0.2s ease",
            }}
          >
            Investments
          </button>
        </div>

        {/* Conditional Content */}
        {activeTab === "spending" ? renderSpendingView() : renderInvestmentsView()}
      </div>
    </div>
  );
}
