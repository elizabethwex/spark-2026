import { Button } from "@wexinc-healthbenefits/ben-ui-kit";
import { cn } from "@/lib/utils";

const FSA_STORE_URL = "https://fsastore.com/";

/** Figma 29515:8707 — Elevation/3 (Medium), same as FSA `SectionCard` */
const CE_BANNER_SHADOW =
  "shadow-[0px_3.017px_9.051px_0px_rgba(43,49,78,0.04),0px_6.034px_18.101px_0px_rgba(43,49,78,0.06)]";

const DEFAULT_HEADING = "Prioritize a year of health and wellness with your FSA";
const DEFAULT_CTA_LABEL = "Shop FSA Store";

export type HsaStorePromoBannerProps = {
  /** When set (e.g. LPFSA account page), replaces the default FSA headline and allows wrapping for longer copy. */
  heading?: string;
  /** When set (e.g. LPFSA account page), replaces the default CTA label on the store link button. */
  ctaLabel?: string;
};

/**
 * End-of-page FSA store promo on consumer account dashboards (Consumer Experience Redesign — Figma 29515:8707).
 */
export function HsaStorePromoBanner({ heading, ctaLabel }: HsaStorePromoBannerProps = {}) {
  const base = `${import.meta.env.BASE_URL}fsa-store-banner-ce/`;
  const headline = heading ?? DEFAULT_HEADING;
  const useCompactHeading = heading == null;
  const buttonLabel = ctaLabel ?? DEFAULT_CTA_LABEL;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-[#FBFBFB]", CE_BANNER_SHADOW)}>
      <div className="relative z-10 grid min-h-0 md:min-h-[277px] md:grid-cols-[minmax(0,1.42fr)_minmax(0,0.58fr)] md:items-center">
        {/* Copy + CTA — left column (~71% on md+ so LPFSA headline can stay one line) */}
        <div className="order-1 flex min-w-0 flex-col py-6 pl-10 pr-5 sm:py-7 sm:pr-6 md:min-w-0 md:max-w-none md:py-8 md:pr-5">
          <div className="flex min-w-0 flex-col gap-2.5">
            <img
              src={`${base}logo.png`}
              alt="FSA store"
              className="h-7 w-auto max-w-full shrink-0 self-start object-contain sm:h-8"
            />
            <h2
              className={cn(
                "w-full min-w-0 text-xl font-bold leading-snug text-[#253746] sm:text-2xl md:text-[25px] md:leading-[31px]",
                useCompactHeading ? "whitespace-nowrap" : "md:whitespace-nowrap"
              )}
            >
              {headline}
            </h2>
            <p className="whitespace-nowrap text-base font-normal leading-[1.332] text-[#253746]">
              Plus use BlexPay™ for essentials and check out instantly!
            </p>
          </div>
          <div className="mt-6">
            <Button
              intent="primary"
              size="md"
              className="h-11 rounded-lg border-0 bg-[#253746] px-3 text-base font-bold text-white shadow-[0px_1px_0px_0px_rgba(0,0,0,0.2)] hover:bg-[#253746]/90 sm:h-[45px] sm:px-4"
              asChild
            >
              <a href={FSA_STORE_URL} target="_blank" rel="noopener noreferrer">
                {buttonLabel}
              </a>
            </Button>
          </div>
        </div>

        {/* Illustration — right column (Figma hero ~277px) */}
        <div className="relative order-2 flex min-h-[200px] w-full items-start justify-center overflow-hidden md:min-h-[277px] md:items-start md:justify-center">
          <img
            src={`${base}illustration.png`}
            alt=""
            aria-hidden
            className="max-h-[220px] w-auto object-contain object-bottom sm:max-h-[260px] md:absolute md:inset-y-0 md:right-0 md:h-full md:max-h-none md:w-auto md:max-w-full md:object-contain md:object-right md:object-bottom"
          />
        </div>
      </div>
    </div>
  );
}
