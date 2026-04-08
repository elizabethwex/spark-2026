export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-2">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="underline hover:text-foreground transition-colors">
              Copyright
            </a>
            <a href="#" className="underline hover:text-foreground transition-colors">
              Disclaimer
            </a>
            <a href="#" className="underline hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="underline hover:text-foreground transition-colors">
              Terms of Use
            </a>
          </div>
          <div className="text-sm text-muted-foreground text-center">
            WEX Health Inc. 2004-2026. All rights reserved. Powered by WEX Health.
          </div>
        </div>
      </div>
    </footer>
  );
}