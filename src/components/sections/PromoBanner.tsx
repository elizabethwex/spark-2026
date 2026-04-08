import { Button, Card, CardContent } from "@wexinc-healthbenefits/ben-ui-kit";
import { Smartphone } from "lucide-react";
import { usePrototype } from "@/context/PrototypeContext";
import { cn } from "@/lib/utils";

/**
 * Promotional Banner Component
 * 
 * Full-width banner promoting mobile app download with:
 * - Illustration on left
 * - Brand logo and content in center
 * - Call-to-action button
 */
export function PromoBanner() {
  const { homepageMode } = usePrototype();
  const isPartnerSafe = homepageMode === "partner-safe";

  return (
    <Card 
      className={cn(
        "overflow-hidden rounded-[24px]",
        isPartnerSafe ? "bg-card border-border shadow-sm" : "bg-gradient-to-r from-info/10 via-info/5 to-background"
      )}
      style={{ borderRadius: '24px' }}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 p-8">
          {/* Illustration Placeholder */}
          <div className="flex-shrink-0 w-48 h-48 bg-gradient-to-br from-primary/20 to-info/20 rounded-full flex items-center justify-center">
            <Smartphone className="h-24 w-24 text-primary" />
          </div>

          {/* Content Section */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            {/* Brand Logo Placeholder */}
            <div className="inline-block px-4 py-1 bg-primary/10 rounded text-sm font-semibold text-primary">
              WEX Mobile
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Download our mobile app
            </h2>

            {/* Subheadline */}
            <p className="text-base text-muted-foreground max-w-2xl">
              Explore 100% HSA-eligible products from 800+ top brands to refresh your routine. 
              Download our mobile app and take control of your health benefits on the go.
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <Button intent="primary" size="md">
                See My Options
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

