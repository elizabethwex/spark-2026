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
  const { sparkActiveView: activeView } = usePrototype();

  return (
    <div className="min-h-screen font-['Inter']" style={consumerPageBackgroundStyle}>
      <ConsumerNavigation hidePrototypeFloating />

      <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <PageFadeIn className="space-y-10">
          <FadeInItem><SparkAiForwardHero activeView={activeView} /></FadeInItem>
          {activeView === 3 ? (
            <FadeInItem className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-2 pl-2">
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
  );
}
