import { Card, CardContent } from "@wexinc-healthbenefits/ben-ui-kit";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { usePrototype } from "@/context/PrototypeContext";
import { AccountsSection } from "@/components/sections/AccountsSection";
import { MessageCenterWidget } from "@/components/sections/MessageCenterWidget";
import { QuickLinksSection } from "@/components/sections/QuickLinksSection";
import { TransactionsAndLinks } from "@/components/sections/TransactionsAndLinks";
import { InfoCardsSection } from "@/components/sections/InfoCardsSection";
import { QuickViewSection } from "@/components/sections/QuickViewSection";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { TasksSection } from "@/components/sections/TasksSection";
import { ConsumerFooter } from "@/components/layout/Footer";
import { HSAPlannerCard } from "@/components/HSAPlannerCard";

/**
 * Partner-safe homepage: traditional dashboard without the prominent AI chat bar.
 */
export default function HomePagePartnerSafe() {
  const { homeLayoutMode: layoutMode } = usePrototype();

  return (
    <div className="min-h-screen bg-slate-50/50 font-['Inter']">
      <ConsumerNavigation />

      <main className="w-full max-w-[1280px] mx-auto px-6 sm:px-8 py-8 space-y-8">
        <Card className="border-border shadow-sm">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-display font-semibold text-foreground tracking-tight">
              Welcome back, Crystal
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Here&apos;s a snapshot of your benefits accounts and tasks.
            </p>
          </CardContent>
        </Card>

        <TasksSection />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <AccountsSection />
          </div>

          {layoutMode === "planner" ? (
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
              <div className={layoutMode === "full" ? "lg:col-span-2" : "h-full"}>
                <MessageCenterWidget />
              </div>
              <div className={layoutMode === "full" ? "lg:col-span-2" : "h-full"}>
                <QuickLinksSection />
              </div>
            </>
          )}

          <div className="lg:col-span-2">
            <TransactionsAndLinks />
          </div>

          {layoutMode === "planner" && (
            <div className="lg:col-span-2">
              <QuickLinksSection />
            </div>
          )}

          <div className="lg:col-span-2">
            <InfoCardsSection />
          </div>

          <div className="lg:col-span-2">
            <QuickViewSection />
          </div>

          <div className="lg:col-span-2">
            <PromoBanner />
          </div>
        </div>
      </main>

      <ConsumerFooter />
    </div>
  );
}
