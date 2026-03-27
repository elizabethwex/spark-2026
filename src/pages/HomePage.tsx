import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { PrototypeFloatingControls } from "@/components/PrototypeFloatingControls";
import { usePrototype } from "@/context/PrototypeContext";
import HomePagePartnerSafe from "@/pages/HomePagePartnerSafe";
import { ConsumerFooter } from "@/components/layout/Footer";
import { SparkAiForwardHero } from "@/components/spark/SparkAiForwardHero";
import { SparkAccountsSection } from "@/components/spark/SparkAccountsSection";
import { SparkRecentActivity } from "@/components/spark/SparkRecentActivity";

export default function HomePage() {
  const { homepageMode } = usePrototype();

  if (homepageMode === "partner-safe") {
    return <HomePagePartnerSafe />;
  }

  return <HomePageAiForward />;
}

function HomePageAiForward() {
  return (
    <div 
      className="min-h-screen font-['Inter']"
      style={{ backgroundImage: "linear-gradient(18.88754079365124deg, rgb(255, 255, 255) 17.854%, var(--primary\\/50,rgb(238, 242, 255)) 86.811%, var(--primary\\/200,rgb(199, 210, 254)) 103.68%)" }}
    >
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
