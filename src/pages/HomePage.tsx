import { useState, useEffect } from "react";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { usePrototype } from "@/context/PrototypeContext";
import HomePagePartnerSafe from "@/pages/HomePagePartnerSafe";
import { ConsumerFooter } from "@/components/layout/Footer";
import { SparkAiForwardHero } from "@/components/spark/SparkAiForwardHero";
import { SparkAccountsSection } from "@/components/spark/SparkAccountsSection";
import { SparkRecentActivity } from "@/components/spark/SparkRecentActivity";
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground";
import { PageFadeIn, FadeInItem } from "@/components/layout/PageFadeIn";

export default function HomePage() {
  const { homepageMode } = usePrototype();

  if (homepageMode === "partner-safe") {
    return <HomePagePartnerSafe />;
  }

  return <HomePageAiForward />;
}

function HomePageAiForward() {
  const [activeView, setActiveView] = useState<1 | 2 | 3>(1);

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
      <ConsumerNavigation hidePrototypeFloating />

      <div className="flex w-full min-h-[calc(100vh-80px)] relative">
        <div id="page-content-wrapper" className="@container group flex-1 min-w-0 transition-all duration-300">
          <main id="main-content" className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10 @5xl:px-8 transition-all duration-300 group-[.is-docked]:max-w-[900px]">
            <PageFadeIn className="space-y-10">
              <FadeInItem><SparkAiForwardHero activeView={activeView} /></FadeInItem>
              {activeView === 3 ? (
                <FadeInItem className="grid grid-cols-1 gap-x-10 gap-y-10 @5xl:grid-cols-2 pl-2">
                  <SparkAccountsSection activeView={activeView} />
                  <SparkRecentActivity activeView={activeView} />
                </FadeInItem>
              ) : (
                <>
                  <FadeInItem><SparkAccountsSection activeView={activeView} /></FadeInItem>
                  <FadeInItem><SparkRecentActivity activeView={activeView} /></FadeInItem>
                </>
              )}
            </PageFadeIn>
          </main>

          <ConsumerFooter />
        </div>
        <div id="docked-sidebar-container" className="shrink-0 overflow-hidden transition-all duration-300" />
      </div>
    </div>
  );
}
