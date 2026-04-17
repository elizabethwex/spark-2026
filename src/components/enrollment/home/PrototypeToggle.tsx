import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { type SimulationMode } from "@/lib/simulatedExpenses";

interface Props {
  mode: SimulationMode;
  onChange: (mode: SimulationMode) => void;
  hasSubmission?: boolean;
}

const MODE_LABELS: Record<SimulationMode, string> = {
  preEnrollment: "Pre-Enrollment",
  modern: "Just Enrolled",
  simulated: "6 Months In",
  cobraEnroll: "Enroll in COBRA",
  cobra: "COBRA",
};

const POST_ENROLLMENT_MODES: SimulationMode[] = ["modern", "simulated", "cobraEnroll", "cobra"];

export function PrototypeToggle({ mode, onChange, hasSubmission = true }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (newMode: SimulationMode) => {
    onChange(newMode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Prototype
      </span>
      
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-[13px] font-semibold text-foreground shadow-lg hover:bg-muted transition-colors"
        >
          {MODE_LABELS[mode]}
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 min-w-[160px] rounded-lg border border-border bg-background shadow-lg">
            <div className="py-1">
              {(Object.keys(MODE_LABELS) as SimulationMode[]).map((modeOption) => {
                const isDisabled = false;

                return (
                  <button
                    key={modeOption}
                    type="button"
                    onClick={() => handleSelect(modeOption)}
                    disabled={isDisabled}
                    className={[
                      "w-full px-4 py-2 text-left text-[13px] font-medium transition-colors first:rounded-t-lg last:rounded-b-lg",
                      isDisabled
                        ? "opacity-50 cursor-not-allowed text-muted-foreground"
                        : mode === modeOption
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted",
                    ].join(" ")}
                  >
                    {MODE_LABELS[modeOption]}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
