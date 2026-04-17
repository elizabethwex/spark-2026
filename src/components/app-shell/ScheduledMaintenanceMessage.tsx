import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduledMaintenanceMessageProps {
  className?: string;
}

// Module-level variable to persist state across unmounts/remounts until hard reload
// Default is false (hidden) until toggled via 'c'
let isVisibleGlobal = false;

export function ScheduledMaintenanceMessage({ className }: ScheduledMaintenanceMessageProps) {
  const [isVisible, setIsVisible] = useState(isVisibleGlobal);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key.toLowerCase() === "c") {
        isVisibleGlobal = !isVisibleGlobal;
        setIsVisible(isVisibleGlobal);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isVisible) return null;

  const handleClose = () => {
    isVisibleGlobal = false;
    setIsVisible(false);
  };

  return (
    <div
      className={cn(
        "bg-[#eef2ff] border border-[#eef2ff] rounded-[6px] shadow-[0px_4px_8px_0px_rgba(4,5,6,0.04)] flex items-start overflow-hidden w-full",
        className
      )}
    >
      <div className="flex gap-[7px] items-center px-[10.5px] py-[7px] w-full">
        <p className="flex-1 m-0 font-['Inter'] text-[#14182c] text-[14px] leading-[1.4]">
          <span className="font-semibold">Scheduled Maintenance Notice:</span>
          <span>
            {" "}
            We will be performing system maintenance next week to improve
            performance and reliability. During this time, you may experience
            intermittent disruptions or slower response times.
          </span>
        </p>
        <button
          onClick={handleClose}
          aria-label="Close message"
          className="flex items-center justify-center w-[24.5px] h-[24.5px] rounded-[12.25px] bg-transparent border-none cursor-pointer shrink-0 p-0 text-[#14182c] hover:bg-black/5 transition-colors"
        >
          <X size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
