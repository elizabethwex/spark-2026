import { Button, Card } from "@wexinc-healthbenefits/ben-ui-kit";

export function MobileAppBanner() {
  return (
    <Card 
      className="relative overflow-hidden rounded-[24px] border border-[#e0e8ff] shadow-sm"
      style={{ borderRadius: '24px' }}
    >
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none scale-105"
        src={`${import.meta.env.BASE_URL}ps-banner.png`}
      />

      <div className="relative flex items-center px-[60px] py-8">
        <div className="flex flex-col gap-4 max-w-[672px]">
          <span className="inline-flex self-start rounded bg-[rgba(21,45,162,0.1)] px-4 py-1 text-sm font-semibold text-[#152da2]">
            WEX Mobile
          </span>

          <h2 className="text-4xl font-display font-bold leading-10 text-[#2f3551]">
            Download our mobile app
          </h2>

          <p className="text-base leading-6 text-[#505c95]">
            Explore 100% FSA-eligible products from 800+ top brands to refresh
            your routine.
            <br />
            Download our mobile app and take control of your health benefits on
            the go.
          </p>

          <div className="pt-2">
            <Button intent="primary" size="md" className="rounded-xl">
              See My Options
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
