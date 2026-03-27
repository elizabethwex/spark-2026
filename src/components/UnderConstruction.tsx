import { Card, CardContent } from "@wexinc-healthbenefits/ben-ui-kit";
import constructionImage from "@/assets/construction-image.png";

/**
 * UnderConstruction Component
 * 
 * Displays an "under construction" message for pages that are still in development.
 * Used to replace page content while preserving navigation structure.
 */
export function UnderConstruction() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] py-12">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-8 space-y-6">
          {/* Construction Image */}
          <div className="flex justify-center">
            <img
              src={constructionImage}
              alt="Under construction"
              className="w-full max-w-md h-auto object-contain"
            />
          </div>

          <h2 className="text-2xl font-bold text-foreground">
            Pardon the dust!
          </h2>
          
          <p className="text-base text-foreground leading-relaxed">
            Our team is hard at work putting the finishing touches on these pages. For now, we're showing off the navigation so you can see how everything connects.
          </p>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">
                Ready to explore:
              </p>
              <p className="text-sm text-muted-foreground">
                Message Center, Resources, My Account / Profile
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">
                Still in progress:
              </p>
              <p className="text-sm text-muted-foreground">
                Accounts (Overview & Details), Claims, Payments, Expenses, Homepage
              </p>
            </div>
          </div>

          <p className="text-base text-foreground leading-relaxed pt-2">
            We'll have everything up and running soon—thanks for taking a peek behind the scenes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

