import { useEffect, useState } from "react";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Share,
  BookOpen,
  Battery,
  Wifi,
  Signal,
} from "lucide-react";
import { AppStatusBar } from "./AppStatusBar";

interface FsaStoreBrowserProps {
  onClose: () => void;
}

export function FsaStoreBrowser({ onClose }: FsaStoreBrowserProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const duration = 2000;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsLoading(false);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white">
      {/* iOS Status Bar Mockup */}
      <div className="shrink-0 relative z-50">
        <AppStatusBar />
      </div>
      <div className="h-[54px] shrink-0" /> {/* Spacer for the fixed status bar */}

      {/* Browser Toolbar - Top */}
      <div className="flex flex-col shrink-0">
        <div className="flex items-center justify-between px-4 pb-2">
          {/* Done Button */}
          <button
            onClick={onClose}
            className="text-[17px] font-medium text-primary hover:opacity-80 active:opacity-60 transition-opacity"
          >
            Done
          </button>

          {/* Title & Subtitle */}
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="text-[14px] font-semibold leading-tight text-foreground">
              FSA Store
            </span>
            <span className="text-[12px] text-muted-foreground leading-tight">
              fsastore.com
            </span>
          </div>

          {/* Spacer to balance the 'Done' button */}
          <div className="w-11" />
        </div>

        {/* Progress Bar (only visible while loading) */}
        {isLoading && (
          <div className="h-1 w-full bg-muted/30 overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-50 ease-linear" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden bg-white">
        {isLoading ? (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center px-4"
            style={{
              background:
                "linear-gradient(182.7628652606358deg, rgb(238, 242, 255) 50.004%, rgb(165, 180, 252) 140.09%)",
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <h2 className="text-[18px] font-semibold tracking-tight text-foreground mt-2">
                Opening FSA Store
              </h2>
              <p className="text-[16px] font-medium text-[#202939]">
                Signing you in
              </p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 overflow-y-auto bg-white">
            <img
              src="/app-ui/fsa-res2.png"
              alt="FSA Store"
              className="w-full h-auto"
            />
          </div>
        )}
      </div>

      {/* Browser Toolbar - Bottom */}
      <div className="flex h-[60px] shrink-0 items-center justify-between bg-[#fafbff] px-4 border-t border-border/50">
        <div className="flex items-center gap-6">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30" disabled>
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30" disabled>
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        <div className="flex items-center gap-6">
          <button className="p-2 text-primary hover:opacity-80 transition-opacity">
            <Share className="h-5 w-5" />
          </button>
          <button className="p-2 text-primary hover:opacity-80 transition-opacity">
            <BookOpen className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}