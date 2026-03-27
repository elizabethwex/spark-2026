import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { PrototypeFloatingControls } from "@/components/PrototypeFloatingControls";
import { usePrototype } from "@/context/PrototypeContext";
import HomePagePartnerSafe from "@/pages/HomePagePartnerSafe";
import { ConsumerFooter } from "@/components/layout/Footer";
import { SparkAiForwardHero } from "@/components/spark/SparkAiForwardHero";
import { SparkAccountsSection } from "@/components/spark/SparkAccountsSection";
import { SparkRecentActivity } from "@/components/spark/SparkRecentActivity";
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground";

export default function HomePage() {
  const { homepageMode } = usePrototype();

  if (homepageMode === "partner-safe") {
    return <HomePagePartnerSafe />;
  }

  return <HomePageAiForward />;
}

function HomePageAiForward() {
  return (
    <div className="min-h-screen font-['Inter']" style={consumerPageBackgroundStyle}>
      <ConsumerNavigation hidePrototypeFloating />

      <main className="mx-auto w-full max-w-[1200px] space-y-10 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <SparkAiForwardHero />
        <SparkAccountsSection />
        <SparkRecentActivity />
      </main>

      <PrototypeFloatingControls />

      <ConsumerFooter />
    </div>
  );
}
