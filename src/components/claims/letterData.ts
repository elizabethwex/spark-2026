export interface LetterItem {
  id: string
  title: string
  date: string
  imageUrl?: string
}

export const LETTERS: LetterItem[] = [
  {
    id: "LTR-1",
    title: "Claim Denial Notice",
    date: "Jan 31, 2026",
    imageUrl: `${import.meta.env.BASE_URL}documents/claimdenial.jpg`,
  },
  {
    id: "LTR-2",
    title: "Overdue Receipt Request",
    date: "Mar 2, 2026",
    imageUrl: `${import.meta.env.BASE_URL}documents/overduereceipt.jpg`,
  },
  {
    id: "LTR-3",
    title: "Receipt Request",
    date: "Jan 24, 2026",
    imageUrl: `${import.meta.env.BASE_URL}documents/receiptrequest.jpg`,
  },
  {
    id: "LTR-4",
    title: "Claim Confirmation",
    date: "Mar 12, 2026",
    imageUrl: `${import.meta.env.BASE_URL}documents/claimConfEx.png`,
  },
]
