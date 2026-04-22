import type { SparkActiveView } from "@/context/PrototypeContext";

/** `href: null` = label shown in the menu but not a navigation target (prototype placeholder). */
export type ConsumerNavSubItem = { label: string; href: string | null };

/**
 * Accounts submenu entries for the consumer header, keyed by prototype homepage view (1/2/3).
 */
export function getAccountsSubItems(view: SparkActiveView): ConsumerNavSubItem[] {
  switch (view) {
    case 1:
      return [
        { label: "Health Savings Account (HSA)", href: "/hsa-details" },
        { label: "Limited Purpose FSA", href: "/lpfsa-account" },
      ];
    case 2:
      return [
        { label: "Health Care FSA", href: "/fsa-account" },
        { label: "Dependent Care FSA", href: "/dependent-care-fsa" },
      ];
    case 3:
      return [{ label: "Health Savings Account (HSA)", href: "/hsa-details" }];
  }
}
