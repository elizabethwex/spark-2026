import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LightModeBoundary } from "@/components/LightModeBoundary";
import { useAppModeHotkey } from "@/hooks/useAppModeHotkey";
import { ReimburseWorkspaceHost } from "@/pages/reimburse/ReimburseWorkspaceHost";

// iOS app mode shell
const AppShell = React.lazy(() =>
  import("@/components/app-shell/AppShell").then((m) => ({ default: m.AppShell }))
);

// iOS app screen pages
const AppHomePage           = React.lazy(() => import("@/pages/app/AppHome"));
const AppAccountOverviewPage = React.lazy(() => import("@/pages/app/AppAccountOverview"));
const AppAccountDetailPage  = React.lazy(() => import("@/pages/app/AppAccountDetail"));
const AppLpfsaDetailPage    = React.lazy(() => import("@/pages/app/AppLpfsaDetail"));
const AppClaimsOverviewPage = React.lazy(() => import("@/pages/app/AppClaimsOverview"));
const AppClaimsDetailPage   = React.lazy(() => import("@/pages/app/AppClaimsDetail"));
const AppMessageCenterPage  = React.lazy(() => import("@/pages/app/AppMessageCenter"));
const AppMyAccountPage      = React.lazy(() => import("@/pages/app/AppMyAccount"));
const AppAssistIQPage       = React.lazy(() => import("@/pages/app/AppAssistIQ"));
const AppLockScreenPage     = React.lazy(() => import("@/pages/app/AppLockScreen"));
const AppPennyFlowPage      = React.lazy(() => import("@/pages/app/AppPennyFlow"));

// Consumer Experience page - standalone route
const HomePage = React.lazy(() => import("@/pages/HomePage"));

// Account Overview page - standalone route
const AccountOverviewPage = React.lazy(() => import("@/pages/AccountOverview"));

// Message Center page - standalone route
const MessageCenterPage = React.lazy(() => import("@/pages/MessageCenter"));

// My Profile page - standalone route
const MyProfilePage = React.lazy(() => import("@/pages/MyProfile"));

// Resources page - standalone route
const ResourcesPage = React.lazy(() => import("@/pages/Resources"));

// Claims page - standalone route
const ClaimsPage = React.lazy(() => import("@/pages/Claims"));

// Account Documents page - standalone route
const AccountDocumentsPage = React.lazy(() => import("@/pages/AccountDocuments"));

const ReimburseWorkspaceRouteBridge = React.lazy(
  () => import("@/pages/reimburse/ReimburseWorkspaceRouteBridge")
);

// Login page - standalone route
const LoginPage = React.lazy(() => import("@/pages/Login"));

// Theming Engine (Partner Admin)
const ThemingEnginePage = React.lazy(() => import("@/pages/ThemingEnginePage"));

// Modern documentation preview
const ModernDocumentPage = React.lazy(() => import("@/pages/ModernDocument"));

// Select an Account (authenticated; same UI as login step 5)
const SelectProfilePage = React.lazy(() => import("@/pages/SelectProfilePage"));


/**
 * Loading fallback for lazy-loaded pages
 */
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-muted-foreground">Loading...</div>
    </div>
  );
}

/** Mounts the Cmd+M hotkey inside the Router context */
function AppModeHotkey() {
  useAppModeHotkey();
  return null;
}

export function AppRoutes() {
  // Wrap consumer-facing pages to enforce light mode without persisting it
  const withConsumerLight = (node: React.ReactNode) => (
    <ProtectedRoute>
      <LightModeBoundary>{node}</LightModeBoundary>
    </ProtectedRoute>
  );

  // Wrap public pages (e.g., login) to enforce light mode without auth gate
  const withLightOnly = (node: React.ReactNode) => (
    <LightModeBoundary>{node}</LightModeBoundary>
  );

  return (
    <React.Suspense fallback={<PageLoader />}>
      <AppModeHotkey />
      <ScrollToTop />
      <Routes>
        {/* Login route */}
        <Route
          path="login"
          element={withLightOnly(
            <LoginPage
              onLoginSuccess={() => {
                window.location.href = import.meta.env.BASE_URL
              }}
            />
          )}
        />

        {/* Home */}
        <Route index element={withConsumerLight(<HomePage />)} />
        
        {/* Account Overview */}
        <Route path="account-overview" element={withConsumerLight(<AccountOverviewPage />)} />
        
        {/* Message Center */}
        <Route path="message-center" element={withConsumerLight(<MessageCenterPage />)} />
        
        {/* My Profile */}
        <Route path="my-profile" element={withConsumerLight(<MyProfilePage />)} />

        {/* Resources */}
        <Route path="resources" element={withConsumerLight(<ResourcesPage />)} />

        {/* Claims */}
        <Route path="claims" element={withConsumerLight(<ClaimsPage />)} />

        {/* Account Documents */}
        <Route path="account-documents" element={withConsumerLight(<AccountDocumentsPage />)} />

        {/* Select an Account (authenticated; login wizard step 5 remains on /login) */}
        <Route path="select-profile" element={withConsumerLight(<SelectProfilePage />)} />

        {/* Reimbursement route bridge (deep-link compatibility) */}
        <Route
          path="reimburse/*"
          element={
            withConsumerLight(<ReimburseWorkspaceRouteBridge />)
          }
        />
        
        {/* Theming Engine - no LightModeBoundary so preview can toggle dark */}
        <Route path="theming-engine" element={<ProtectedRoute><ThemingEnginePage /></ProtectedRoute>} />

        {/* Modern documentation preview */}
        <Route path="modern-document" element={<ModernDocumentPage />} />

        {/* iOS Mobile App — /app/* (no auth gate, direct-link accessible on phone) */}
        <Route path="app" element={<AppShell />}>
          <Route index element={<AppHomePage />} />
          <Route path="account" element={<AppAccountOverviewPage />} />
          <Route path="account/lpfsa" element={<AppLpfsaDetailPage />} />
          <Route path="account/fsa" element={<AppLpfsaDetailPage />} />
          <Route path="account/dcfsa" element={<AppLpfsaDetailPage />} />
          <Route path="account/:id" element={<AppAccountDetailPage />} />
          <Route path="claims" element={<AppClaimsOverviewPage />} />
          <Route path="claims/:id" element={<AppClaimsDetailPage />} />
          <Route path="messages" element={<AppMessageCenterPage />} />
          <Route path="my-account" element={<AppMyAccountPage />} />
          <Route path="assist-iq" element={<AppAssistIQPage />} />
          <Route path="lock-screen" element={<AppLockScreenPage />} />
          <Route path="penny" element={<AppPennyFlowPage />} />
        </Route>

        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ReimburseWorkspaceHost />
    </React.Suspense>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen text-center py-12 px-4" style={consumerPageBackgroundStyle}>
      <h1 className="text-2xl font-display font-semibold text-foreground mb-2">
        Page Not Found
      </h1>
      <p className="text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
    </div>
  );
}
