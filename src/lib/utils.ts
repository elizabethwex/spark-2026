import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Card chrome matching the main homepage account cards (SparkAccountsSection):
 * 24px radius, shadow, and partner-safe vs glass-style white surfaces.
 */
export function homepageAccountSurfaceClass(isPartnerSafe: boolean) {
  return cn(
    "overflow-hidden rounded-[24px] transition-shadow hover:shadow-md",
    isPartnerSafe
      ? "border border-border bg-card text-card-foreground shadow-sm"
      : "border border-white/60 bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
  )
}

