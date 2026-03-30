import { useNavigate } from "react-router-dom";
import {
  User,
  Users,
  UserCheck,
  CreditCard,
  Building2,
  Lock,
  Bell,
  Globe,
  Phone,
  Mail,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { AppListRow, AppListSection } from "@/components/app-shell/primitives/AppListRow";

interface SectionItem {
  label: string;
  sublabel?: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  iconBg: string;
  iconColor: string;
  href?: string;
}

const PROFILE_SECTIONS: { header: string; items: SectionItem[] }[] = [
  {
    header: "Account",
    items: [
      { label: "My Profile",              icon: User,      iconBg: "hsl(208 100% 45%)", iconColor: "#fff", href: "/app/my-account/profile" },
      { label: "Dependents",              icon: Users,     iconBg: "hsl(142 76% 36%)", iconColor: "#fff" },
      { label: "Beneficiaries",           icon: UserCheck, iconBg: "hsl(270 60% 50%)", iconColor: "#fff" },
      { label: "Authorized Signers",      icon: UserCheck, iconBg: "hsl(198 87% 40%)", iconColor: "#fff" },
    ],
  },
  {
    header: "Financial",
    items: [
      { label: "Banking",    icon: Building2, iconBg: "hsl(38 92% 44%)",  iconColor: "#fff" },
      { label: "Debit Card", icon: CreditCard,iconBg: "hsl(350 62% 48%)", iconColor: "#fff" },
    ],
  },
  {
    header: "Security & Preferences",
    items: [
      { label: "Login & Security",           icon: Lock,  iconBg: "hsl(210 14% 37%)", iconColor: "#fff" },
      { label: "Notification Preferences",   icon: Bell,  iconBg: "hsl(208 100% 45%)", iconColor: "#fff" },
      { label: "Communication Preferences",  icon: Mail,  iconBg: "hsl(142 76% 36%)", iconColor: "#fff" },
      { label: "Language",    sublabel: "English (Default)", icon: Globe, iconBg: "hsl(198 87% 40%)", iconColor: "#fff" },
    ],
  },
];

export default function AppMyAccount() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100%",
        background: "var(--app-bg)",
        fontFamily: "var(--app-font)",
      }}
    >
      <AppNavBar title="Profile" />

      <div style={{ padding: "16px 0 32px" }}>
        {/* Avatar + name hero */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "12px 16px 28px",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, hsl(208 100% 45%) 0%, hsl(270 60% 50%) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(37,99,235,0.3)",
            }}
          >
            <User size={36} strokeWidth={1.5} style={{ color: "#fff" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ font: "var(--app-font-title2)", color: "var(--app-text)" }}>
              Sarah Johnson
            </div>
            <div style={{ font: "var(--app-font-subhead)", color: "var(--app-text-secondary)", marginTop: 4 }}>
              sarah.johnson@example.com
            </div>
          </div>

          {/* Contact info pills */}
          <div style={{ display: "flex", gap: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "var(--app-surface)",
                borderRadius: "var(--app-radius-pill)",
                padding: "7px 14px",
                boxShadow: "var(--app-card-shadow)",
              }}
            >
              <Phone size={14} strokeWidth={1.75} style={{ color: "var(--app-tint)" }} />
              <span style={{ font: "var(--app-font-caption1)", color: "var(--app-text)" }}>
                123-456-7890
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "var(--app-surface)",
                borderRadius: "var(--app-radius-pill)",
                padding: "7px 14px",
                boxShadow: "var(--app-card-shadow)",
              }}
            >
              <Building2 size={14} strokeWidth={1.75} style={{ color: "var(--app-tint)" }} />
              <span style={{ font: "var(--app-font-caption1)", color: "var(--app-text)" }}>
                WEX, Inc.
              </span>
            </div>
          </div>
        </div>

        {/* Settings sections */}
        {PROFILE_SECTIONS.map((section) => (
          <AppListSection key={section.header} header={section.header}>
            {section.items.map((item, i) => {
              const Icon = item.icon;
              return (
                <AppListRow
                  key={item.label}
                  label={item.label}
                  sublabel={item.sublabel}
                  last={i === section.items.length - 1}
                  disclosure
                  onClick={() => item.href && navigate(item.href)}
                  icon={
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 7,
                        background: item.iconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={15} strokeWidth={1.75} style={{ color: item.iconColor }} />
                    </div>
                  }
                />
              );
            })}
          </AppListSection>
        ))}

        {/* Sign out */}
        <div style={{ padding: "0 16px", marginTop: 8 }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "var(--app-radius-lg)",
              background: "var(--app-surface)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontFamily: "var(--app-font)",
              fontSize: 17,
              fontWeight: 500,
              color: "var(--app-destructive)",
              boxShadow: "var(--app-card-shadow)",
            }}
          >
            <LogOut size={18} strokeWidth={1.75} />
            Sign Out
          </button>
        </div>

        {/* App version */}
        <div
          style={{
            textAlign: "center",
            font: "var(--app-font-footnote)",
            color: "var(--app-text-tertiary)",
            marginTop: 24,
          }}
        >
          WEX Health App · Version 2.0.0
        </div>
      </div>
    </div>
  );
}
