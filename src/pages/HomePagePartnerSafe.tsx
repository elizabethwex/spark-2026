import { useState, useEffect } from "react";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { usePrototype } from "@/context/PrototypeContext";
import { PageFadeIn, FadeInItem } from "@/components/layout/PageFadeIn";
import { SparkAccountsSection } from "@/components/spark/SparkAccountsSection";
import { MessageCenterWidget } from "@/components/sections/MessageCenterWidget";
import { QuickLinksSection } from "@/components/sections/QuickLinksSection";
import { TransactionsAndLinks } from "@/components/sections/TransactionsAndLinks";
import { InfoCardsSection } from "@/components/sections/InfoCardsSection";
import { QuickViewSection } from "@/components/sections/QuickViewSection";
import { MobileAppBanner } from "@/components/sections/MobileAppBanner";
import { QuickActionsSection } from "@/components/sections/QuickActionsSection";
import { ConsumerFooter } from "@/components/layout/Footer";
import { HSAPlannerCard } from "@/components/HSAPlannerCard";
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground";
import { AssistIQUploadClaimModal } from "@/components/spark/AssistIQUploadClaimModal";

/**
 * Partner-safe homepage: traditional dashboard without the prominent AI chat bar.
 */
export default function HomePagePartnerSafe() {
  const { homeLayoutMode: layoutMode } = usePrototype();
  const [activeView, setActiveView] = useState<1 | 2 | 3>(1);
  const [isAssistIQOpen, setIsAssistIQOpen] = useState(false);

  const effectiveLayoutMode = activeView === 2 ? "standard" : layoutMode;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keypresses if the user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === '1') setActiveView(1);
      if (e.key === '2') setActiveView(2);
      if (e.key === '3') setActiveView(3);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen font-['Inter']" style={consumerPageBackgroundStyle}>
      <ConsumerNavigation />

      <main className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-8">
        <PageFadeIn className="space-y-8">
        <FadeInItem>
          <MobileAppBanner />
        </FadeInItem>

        <FadeInItem>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <QuickActionsSection activeView={activeView} />
          </div>

          <div className="lg:col-span-2">
            <SparkAccountsSection variant="partner-safe" activeView={activeView} />
          </div>

          {effectiveLayoutMode === "planner" ? (
            <>
              <div className="h-full">
                <MessageCenterWidget />
              </div>
              <div className="h-full">
                <HSAPlannerCard />
              </div>
            </>
          ) : (
            <>
              <div className="lg:col-span-2">
                <MessageCenterWidget />
              </div>
              <div className="lg:col-span-2">
                <TransactionsAndLinks activeView={activeView} />
              </div>
              <div className="lg:col-span-2">
                <QuickLinksSection />
              </div>
            </>
          )}

          {effectiveLayoutMode === "planner" && (
            <>
              <div className="lg:col-span-2">
                <TransactionsAndLinks activeView={activeView} />
              </div>
              <div className="lg:col-span-2">
                <QuickLinksSection />
              </div>
            </>
          )}

          <div className="lg:col-span-2">
            <InfoCardsSection />
          </div>

          <div className="lg:col-span-2">
            <QuickViewSection activeView={activeView} />
          </div>
        </div>
        </FadeInItem>
        </PageFadeIn>
      </main>

      <ConsumerFooter />
      
      <AssistIQUploadClaimModal
        open={isAssistIQOpen}
        onOpenChange={setIsAssistIQOpen}
        alwaysShowFloatingButton={true}
      />
    </div>
  );
}
