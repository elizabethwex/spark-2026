import { cn } from "@/lib/utils";
import { WEX_AI_GRADIENT } from "@/lib/wexAiBrand";

export interface WexAiSparkleMarkProps {
  /** CSS length, e.g. `40px` */
  size?: string;
  className?: string;
}

/**
 * WEX AI circular mark: indigo→magenta gradient with two white four-point sparkles.
 */
export function WexAiSparkleMark({ size = "40px", className }: WexAiSparkleMarkProps) {
  return (
    <div
      className={cn("relative shrink-0 overflow-hidden rounded-full", className)}
      style={{ width: size, height: size, background: WEX_AI_GRADIENT }}
      aria-hidden
    >
      <svg
        viewBox="0 0 40 40"
        className="absolute inset-0 size-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="white">
          {/* Primary sparkle: horizontal points slightly wider than vertical */}
          <path d="M20 7l1.4 6.1 6.1 1.4-6.1 1.4L20 22l-1.4-6.1-6.1-1.4 6.1-1.4L20 7Z" />
          {/* Secondary sparkle, lower-right */}
          <path d="M28.5 23.5l0.55 2.2 2.15 0.55-2.15 0.55-0.55 2.2-0.55-2.2-2.15-0.55 2.15-0.55 0.55-2.2Z" />
        </g>
      </svg>
    </div>
  );
}
