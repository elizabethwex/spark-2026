import { Link } from "react-router-dom";

export function ConsumerFooter() {
  return (
    <footer className="border-t border-border bg-background mt-12">
      <div className="w-full max-w-[1440px] mx-auto px-8 py-6">
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground text-center">
          <p>WEX Health Inc. 2004-2026. All rights reserved. Powered by WEX Health.</p>
          <Link
            to="/theming-engine"
            className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            Appearance / Theming Engine
          </Link>
        </div>
      </div>
    </footer>
  );
}

