import { Bell, Search, User } from 'lucide-react';
import { WexSeparator } from '@wex/components-react/layout';
import svgPaths from '@/imports/svg-j98j8mo3ag';

export function Navigation() {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).toUpperCase();

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border/50 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-8 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-[108.499px]">
            <svg
              viewBox="0 0 108.499 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
              aria-label="WEX"
              preserveAspectRatio="xMidYMid meet"
            >
              <g clipPath="url(#clip0_nav)">
                <g>
                  <path d={svgPaths.p2b81e300} fill="#C8102E" />
                  <path d={svgPaths.p1a827f72} fill="#C8102E" />
                  <g>
                    <g>
                      <path d={svgPaths.p53db480} fill="#C8102E" />
                      <path d={svgPaths.pd68a500} fill="#C8102E" />
                    </g>
                    <path d={svgPaths.p3c867c0} fill="#A01D28" />
                  </g>
                </g>
                <path d={svgPaths.p3ac54a00} fill="#CE0E2D" />
              </g>
              <defs>
                <clipPath id="clip0_nav">
                  <rect fill="white" height="32" width="108.499" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="flex flex-col ml-1">
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">Benefits</span>
            <span className="text-sm font-semibold text-foreground">Nicole&apos;s Hub</span>
          </div>
        </div>

        {/* Center Date */}
        <div className="text-xs font-medium text-muted-foreground tracking-wide">
          {dateStr}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
              <Bell className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
            <Search className="h-5 w-5" />
          </button>

          <WexSeparator orientation="vertical" className="h-8 mx-1" />

          {/* User Profile */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm font-semibold text-foreground">Nicole </div>
              <div className="text-xs text-muted-foreground">Standard Plan</div>
            </div>
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}