export type DocStatus = "attached" | "unattached"

export interface FolderItem {
  id: string
  name: string
  lastModified: string
}

export interface DocumentItem {
  id: string
  title: string
  date: string
  status: DocStatus
  folderId: string | null
  imageUrl?: string
}

export const FOLDERS: FolderItem[] = [
  { id: "2025", name: "2025",       lastModified: "Dec 12, 2025" },
  { id: "2024", name: "James Docs", lastModified: "Jan 8, 2024"  },
]

export const DOCUMENTS: DocumentItem[] = [
  { id: "1",  title: "EOB",                  date: "Dec 12, 2025", status: "unattached", folderId: "2025", imageUrl: "/documents/optum-rx.jpg"    },
  { id: "2",  title: "Rite Aid",              date: "Dec 12, 2025", status: "unattached", folderId: "2025", imageUrl: "/documents/walgreens.png"   },
  { id: "3",  title: "Bright Smiles Dental", date: "Dec 12, 2025", status: "attached",   folderId: "2025", imageUrl: "/documents/huggins.png"     },
  { id: "4",  title: "EOB",                  date: "Dec 12, 2025", status: "unattached", folderId: "2025", imageUrl: "/documents/optum-rx2.jpg"   },
  { id: "5",  title: "Receipt",               date: "Nov 3, 2025",  status: "unattached", folderId: "2025", imageUrl: "/documents/medical.jpg"     },
  { id: "6",  title: "Dr. Johnson",          date: "Oct 18, 2025", status: "unattached", folderId: "2025", imageUrl: "/documents/receipt.png"     },
  { id: "7",  title: "Urgent Care Visit",    date: "Sep 9, 2025",  status: "attached",   folderId: "2025", imageUrl: "/documents/carespot.png"    },
  { id: "8",  title: "EOB",                  date: "Aug 4, 2025",  status: "unattached", folderId: "2025", imageUrl: "/documents/otptum.jpg"      },
  { id: "9",  title: "Quest Receipt",         date: "Jan 8, 2024",  status: "unattached", folderId: "2024", imageUrl: "/documents/quest1.jpg"      },
  { id: "10", title: "Quest Labs",           date: "Jan 8, 2024",  status: "unattached", folderId: "2024", imageUrl: "/documents/quest-labs.png"  },
  { id: "11", title: "Walgreens",            date: "Jan 8, 2024",  status: "attached",   folderId: "2024", imageUrl: "/documents/quest-labs2.png" },
  { id: "12", title: "Hubble",               date: "Jan 8, 2024",  status: "unattached", folderId: "2024", imageUrl: "/documents/hubble.jpg"      },
  // Loose files — not in any folder
  { id: "13", title: "Hubble",               date: "Mar 5, 2026",  status: "unattached", folderId: null,   imageUrl: "/documents/hubble.png"      },
  { id: "14", title: "Contacts Receipt",      date: "Feb 28, 2026", status: "attached",   folderId: null,   imageUrl: "/documents/contacts.jpg"    },
  { id: "15", title: "Target Optical",       date: "Jan 10, 2026", status: "unattached", folderId: null,   imageUrl: "/documents/contacts2.png"   },
]
