import { Button } from "@wexinc-healthbenefits/ben-ui-kit";
import { cn } from "@/lib/utils";

const FSA_STORE_URL = "https://fsastore.com/";

/** Figma 29515:8707 — Elevation/3 (Medium), same as FSA `SectionCard` */
const CE_BANNER_SHADOW =
  "shadow-[0px_3.017px_9.051px_0px_rgba(43,49,78,0.04),0px_6.034px_18.101px_0px_rgba(43,49,78,0.06)]";

/**
 * End-of-page FSA store promo on the FSA account dashboard (Consumer Experience Redesign — Figma 29515:8707).
 */
export function HsaStorePromoBanner() {
  const base = `${import.meta.env.BASE_URL}fsa-store-banner-ce/`;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-[#FBFBFB]", CE_BANNER_SHADOW)}>
      <div className="relative z-10 grid min-h-0 md:min-h-[277px] md:grid-cols-2 md:items-center">
        {/* Copy + CTA — left column */}
        <div className="order-1 flex min-w-0 flex-col py-6 pl-10 pr-5 sm:py-7 sm:pr-6 md:min-w-0 md:max-w-none md:py-8 md:pr-6">
          <div className="flex flex-col gap-2.5">
            <img
              src={`${base}logo.png`}
              alt="FSA store"
              className="h-7 w-auto max-w-full shrink-0 self-start object-contain sm:h-8"
            />
            <h2 className="w-full min-w-0 text-xl font-bold leading-snug text-[#253746] sm:text-2xl md:text-nowrap md:text-[25px] md:leading-[31px]">
              Prioritize a year of health and wellness with your FSA
            </h2>
            <p className="max-w-[408px] text-base font-normal leading-[1.332] text-[#253746]">
              Plus use DirectPay™ and check out instantly!
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
                Shop FSA Store
              </a>
            </Button>
          </div>
        </div>

        {/* Illustration — right column (Figma hero ~277px) */}
        <div className="relative order-2 flex min-h-[200px] justify-center overflow-hidden md:min-h-[277px] md:justify-end">
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
