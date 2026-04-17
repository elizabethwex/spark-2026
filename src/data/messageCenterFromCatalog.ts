import type { AppVariant } from "@/context/AppVariantContext";
import type { Message } from "@/data/messageCenterUtils";
import { formatDesktopMessageDeliveryDate } from "@/data/messageCenterPrototypeDates";
import {
  getPrototypeInboxEntries,
  MESSAGE_BODY_WITH_ATTACHMENT,
  type MessageTag,
} from "@/pages/app/messageCatalog";

const TAG_CATEGORY: Record<
  MessageTag,
  { category: string; categoryColor: string; categoryTextColor: string }
> = {
  "money-activity": {
    category: "Contributions & Investments",
    categoryColor: "#ffbca7",
    categoryTextColor: "#66230e",
  },
  "account-security": {
    category: "Cards & Security",
    categoryColor: "#e8a6cc",
    categoryTextColor: "#4f0d33",
  },
  "tax-statements": {
    category: "Statements & Tax Documents",
    categoryColor: "#fff7b1",
    categoryTextColor: "#665e18",
  },
};

function pdfNameFromTitle(title: string): string {
  const slug = title
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
  return `${slug || "message"}.pdf`;
}

/** Desktop Message Center table rows — aligned with app prototype catalog + account variant. */
export function buildDesktopMessagesFromVariant(variant: AppVariant): Message[] {
  const entries = getPrototypeInboxEntries(variant);
  return entries.map((entry, i) => {
    const cat = TAG_CATEGORY[entry.tag];
    const read = i % 3 !== 0;
    const archived = i === entries.length - 1;
    return {
      id: `proto-${variant}-${i + 1}`,
      subject: entry.title,
      needsAttention: entry.attentionNeeded,
      hasAttachment: entry.pdfAttached ?? false,
      category: cat.category,
      categoryColor: cat.categoryColor,
      categoryTextColor: cat.categoryTextColor,
      deliveryDate: formatDesktopMessageDeliveryDate(i),
      isStarred: i === 4,
      isBold: !read,
      isRead: read,
      isArchived: archived,
      body: entry.pdfAttached
        ? MESSAGE_BODY_WITH_ATTACHMENT
        : entry.previewBody ??
          `Open this message to review details for ${entry.title}.`,
      attachmentFileName: entry.pdfAttached ? pdfNameFromTitle(entry.title) : undefined,
    };
  });
}
