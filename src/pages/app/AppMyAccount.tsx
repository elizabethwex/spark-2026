import { useNavigate } from "react-router-dom";
import {
  User,
  Users,
  UserCheck,
  CreditCard,
  Building2,
  Lock,
  Mail,
  LogOut,
  DollarSign,
} from "lucide-react";
import { AppNavBar } from "@/components/app-shell/AppNavBar";
import { AppTopSpacer } from "@/components/app-shell/AppTopSpacer";
import { AppListRow, AppListSection } from "@/components/app-shell/primitives/AppListRow";
import { CLAIMS_PAGE_BACKGROUND } from "./claimsPageStyles";

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
    header: "",
    items: [
      { label: "Profile",              icon: User,      iconBg: "transparent", iconColor: "#5f6a94", href: "/app/my-account/profile" },
      { label: "Dependents",           icon: Users,     iconBg: "transparent", iconColor: "#5f6a94" },
      { label: "Beneficiaries",        icon: UserCheck, iconBg: "transparent", iconColor: "#5f6a94" },
    ],
  },
  {
    header: "",
    items: [
      { label: "Bank Accounts",          icon: Building2, iconBg: "transparent", iconColor: "#5f6a94" },
      { label: "Debit Cards",            icon: CreditCard,iconBg: "transparent", iconColor: "#5f6a94" },
      { label: "Reimbursement Methods",  icon: DollarSign,iconBg: "transparent", iconColor: "#5f6a94" },
    ],
  },
  {
    header: "",
    items: [
      { label: "Login and Security",         icon: Lock,  iconBg: "transparent", iconColor: "#5f6a94" },
      { label: "Communication Preferences",  icon: Mail,  iconBg: "transparent", iconColor: "#5f6a94" },
    ],
  },
];

export default function AppMyAccount() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100%",
        background: CLAIMS_PAGE_BACKGROUND,
        fontFamily: "var(--app-font)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 64px)",
      }}
    >
      <AppTopSpacer variant="home" />
      <AppNavBar variant="sub-page" title="My Account" backTo={-1} backLabel="Back" />

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 16, width: "100%", boxSizing: "border-box" }}>
        {/* Avatar + name hero */}
        <div
          style={{
            background: "var(--app-surface)",
            border: "1px solid var(--app-border)",
            borderRadius: "var(--app-radius-xl)",
            padding: "24px 16px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "var(--app-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <User size={24} strokeWidth={1.5} style={{ color: "#fff" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ font: "var(--app-font-headline)", color: "var(--app-text)" }}>
              Penny Smith
            </div>
            <div style={{ font: "var(--app-font-subhead)", color: "var(--app-text-secondary)" }}>
              penny.smith@wexinc.com
            </div>
          </div>
        </div>

        {/* Settings sections */}
        {PROFILE_SECTIONS.map((section, idx) => (
          <AppListSection key={idx} header={section.header}>
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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={20} strokeWidth={1.75} style={{ color: item.iconColor }} />
                    </div>
                  }
                />
              );
            })}
          </AppListSection>
        ))}

        {/* Sign out */}
        <div>
          <button
            onClick={() => navigate("/login")}
            style={{
              width: "100%",
              padding: "16px 20px",
              borderRadius: "var(--app-radius-pill)",
              background: "var(--app-info-surface)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontFamily: "var(--app-font)",
              fontSize: 16,
              fontWeight: 500,
              color: "var(--app-primary-800)",
            }}
          >
            Log out
            <LogOut size={20} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
