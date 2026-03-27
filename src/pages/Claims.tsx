import { ConsumerFooter } from "@/components/layout/Footer";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { UnderConstruction } from "@/components/UnderConstruction";
// Original imports preserved for future restoration:
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// Original imports preserved for future restoration:
// import { Button, Card, Table, Badge, Pagination, Select } from "@wexinc-healthbenefits/ben-ui-kit";
// import { ClaimDetailSheet } from "./ClaimDetailSheet";
// import {
//   DollarSign,
//   Inbox,
//   Receipt,
//   RefreshCw,
//   ArrowUpDown,
//   CreditCard,
//   Wallet,
// } from "lucide-react";

// TypeScript interfaces for Claim data - preserved for restoration
// interface Claim {
//   id: string;
//   dateSubmitted: string;
//   status: "document-needed" | "denied" | "in-review" | "submitted" | "not-submitted" | "approved";
//   providerService: string;
//   dateOfService: string;
//   recipient: string;
//   amount: string;
//   hasRefresh?: boolean;
//   // Extended fields for sidebar
//   claimId?: string;
//   payFrom?: string;
//   payTo?: {
//     recipient: string;
//     address: string;
//   };
//   categoryType?: string;
//   statusMessage?: string;
//   statusDate?: string;
//   isRecurring?: boolean;
//   hasDocuments?: boolean;
//   documents?: Array<{ name: string; url?: string }>;
//   timeline?: Array<{
//     date: string;
//     event: string;
//     description?: string;
//   }>;
//   letters?: Array<{
//     title: string;
//     date: string;
//     url?: string;
//   }>;
// }

// interface SummaryStats {
//   totalReimbursed: string;
//   totalNotSubmitted: string;
//   totalClaims: number;
// }

// Mock data for summary statistics - preserved for restoration
// const summaryStats: SummaryStats = {
//   totalReimbursed: "$5,300.00",
//   totalNotSubmitted: "$2,150.00",
//   totalClaims: 200,
// };

// Mock data for Action Required claims - preserved for restoration
// const actionRequiredClaims: Claim[] = [
//   {
//     id: "1",
//     dateSubmitted: "6/12/2025",
//     status: "document-needed",
//     providerService: "Dr. John Doe",
//     dateOfService: "6/12/2025",
//     recipient: "Crystal Kant",
//     amount: "$150.00",
//     claimId: "456789132541224",
//     payFrom: "Medical FSA",
//     payTo: {
//       recipient: "me (check)",
//       address: "123 elmo st.\nsesame home, ID, 11111",
//     },
//     categoryType: "Medical - Office visit",
//     statusMessage: "Receipt is missing date of service (DOS). Please provide documentation with the required information.",
//     statusDate: "6/24/2025",
//     isRecurring: false,
//     hasDocuments: true,
//     documents: [{ name: "doc_01.jpg - 3MB" }],
//     timeline: [
//       {
//         date: "6/9/2025",
//         event: "Claim created (not submitted)",
//       },
//       {
//         date: "6/12/2025",
//         event: "Claim submitted",
//       },
//       {
//         date: "6/24/2025",
//         event: "Additional documentation needed",
//         description: "Document does not contain Date of Service (DOS). The DOS is the date the service was provided, not the date you paid. Information must be in the document.",
//       },
//     ],
//     letters: [
//       {
//         title: "Submit letter",
//         date: "6/9/2025",
//         url: "#",
//       },
//       {
//         title: "Document needed letter",
//         date: "6/12/2025",
//         url: "#",
//       },
//     ],
//   },
//   {
//     id: "2",
//     dateSubmitted: "5/10/2025",
//     status: "document-needed",
//     providerService: "Pharmacy",
//     dateOfService: "6/10/2025",
//     recipient: "Crystal Kant",
//     amount: "$150.00",
//     claimId: "456789132541225",
//     payFrom: "Medical FSA",
//     payTo: {
//       recipient: "me (check)",
//       address: "123 elmo st.\nsesame home, ID, 11111",
//     },
//     categoryType: "Medical - Prescription",
//     statusMessage: "Please upload receipt for this claim.",
//     statusDate: "5/8/2025",
//     isRecurring: true,
//     hasDocuments: false,
//   },
//   {
//     id: "3",
//     dateSubmitted: "5/21/2025",
//     status: "denied",
//     providerService: "Pharmacy",
//     dateOfService: "5/21/2025",
//     recipient: "Crystal Kant",
//     amount: "$150.00",
//     claimId: "456789132541226",
//     payFrom: "Medical FSA",
//     payTo: {
//       recipient: "me (check)",
//       address: "123 elmo st.\nsesame home, ID, 11111",
//     },
//     categoryType: "Medical - Prescription",
//     statusMessage: "This claim was denied. Please review the reason.",
//     statusDate: "5/20/2025",
//     isRecurring: false,
//     hasDocuments: true,
//     documents: [{ name: "receipt.pdf" }],
//   },
//   {
//     id: "4",
//     dateSubmitted: "5/1/2025",
//     status: "denied",
//     providerService: "Dr. John Doe",
//     dateOfService: "5/1/2025",
//     recipient: "Crystal Kant",
//     amount: "$150.00",
//     claimId: "456789132541227",
//     payFrom: "Medical FSA",
//     payTo: {
//       recipient: "me (check)",
//       address: "123 elmo st.\nsesame home, ID, 11111",
//     },
//     categoryType: "Medical - Office visit",
//     statusMessage: "This claim was denied due to insufficient documentation.",
//     statusDate: "4/30/2025",
//     isRecurring: false,
//     hasDocuments: false,
//   },
// ];

// Mock data for all Claims - preserved for restoration
// const allClaims: Claim[] = [
//   {
//     id: "5",
//     dateSubmitted: "4/30/2025",
//     status: "in-review",
//     providerService: "Pharmacy",
//     dateOfService: "4/30/2025",
//     recipient: "Crystal Kant",
//     amount: "$150.00",
//     claimId: "456789132541229",
//     payFrom: "Medical FSA",
//     payTo: {
//       recipient: "me (check)",
//       address: "123 elmo st.\nsesame home, ID, 11111",
//     },
//     categoryType: "Medical - Prescription",
//     statusMessage: "Your claim is currently under review.",
//     statusDate: "4/30/2025",
//     isRecurring: false,
//     hasDocuments: true,
//     documents: [{ name: "receipt.pdf" }],
//   },
//   {
//     id: "6",
//     dateSubmitted: "4/28/2025",
//     status: "in-review",
//     providerService: "Dr. Jane Dan",
//     dateOfService: "4/28/2025",
//     recipient: "Crystal Kant",
//     amount: "$150.00",
//     hasRefresh: true,
//     claimId: "456789132541230",
//     payFrom: "Medical FSA",
//     payTo: {
//       recipient: "me (check)",
//       address: "123 elmo st.\nsesame home, ID, 11111",
//     },
//     categoryType: "Medical - Office visit",
//     statusMessage: "Your claim is currently under review.",
//     statusDate: "4/28/2025",
//     isRecurring: true,
//     hasDocuments: true,
//     documents: [{ name: "invoice.pdf" }],
//   },
//   {
//     id: "7",
//     dateSubmitted: "4/18/2025",
//     status: "in-review",
//     providerService: "Pharmacy",
//     dateOfService: "4/18/2025",
//     recipient: "Crystal Kant",
//     amount: "$150.00",
//     claimId: "456789132541231",
//     payFrom: "Medical FSA",
//     payTo: {
//       recipient: "me (check)",
//       address: "123 elmo st.\nsesame home, ID, 11111",
//     },
//     categoryType: "Medical - Prescription",
//     statusMessage: "Your claim is currently under review.",
//     statusDate: "4/18/2025",
//     isRecurring: false,
//     hasDocuments: false,
//   },
//   {
//     id: "8",
//     dateSubmitted: "3/22/2025",
//     status: "submitted",
//     providerService: "Dr. John Doe",
//     dateOfService: "3/22/2025",
//     recipient: "Crystal Kant",
//     amount: "$150.00",
//     claimId: "456789132541232",
//     payFrom: "Medical FSA",
//     payTo: {
//       recipient: "me (check)",
//       address: "123 elmo st.\nsesame home, ID, 11111",
//     },
//     categoryType: "Medical - Office visit",
//     statusMessage: "Your claim has been submitted successfully.",
//     statusDate: "3/22/2025",
//     isRecurring: false,
//     hasDocuments: true,
//     documents: [{ name: "receipt.pdf" }],
//   },
//   {
//     id: "9",
//     dateSubmitted: "-",
//     status: "not-submitted",
//     providerService: "Dr. John Doe",
//     dateOfService: "3/8/2025",
//     recipient: "Crystal Kant",
//     amount: "$150.00",
//     claimId: "456789132541228",
//     payFrom: "Medical FSA",
//     payTo: {
//       recipient: "me (check)",
//       address: "123 elmo st.\nsesame home, ID, 11111",
//     },
//     categoryType: "Medical - Office visit",
//     statusMessage: "You have successfully created the claim. Submit to get reimbursed.",
//     statusDate: "3/8/2025",
//     isRecurring: false,
//     hasDocuments: false,
//   },
//   {
//     id: "10",
//     dateSubmitted: "2/14/2025",
//     status: "approved",
//     providerService: "Dr. Jane Dan",
//     dateOfService: "2/14/2025",
//     recipient: "Crystal Kant",
//     amount: "$150.00",
//     hasRefresh: true,
//     claimId: "456789132541233",
//     payFrom: "Medical FSA",
//     payTo: {
//       recipient: "me (check)",
//       address: "123 elmo st.\nsesame home, ID, 11111",
//     },
//     categoryType: "Medical - Office visit",
//     statusMessage: "Your claim has been approved and payment is being processed.",
//     statusDate: "2/15/2025",
//     isRecurring: false,
//     hasDocuments: true,
//     documents: [{ name: "receipt.pdf" }, { name: "invoice.pdf" }],
//   },
//   {
//     id: "11",
//     dateSubmitted: "2/14/2025",
//     status: "approved",
//     providerService: "Dr. Jane Dan",
//     dateOfService: "2/14/2025",
//     recipient: "Crystal Kant",
//     amount: "$150.00",
//   },
//   {
//     id: "12",
//     dateSubmitted: "2/14/2025",
//     status: "approved",
//     providerService: "Dr. Jane Dan",
//     dateOfService: "2/14/2025",
//     recipient: "Crystal Kant",
//     amount: "$150.00",
//   },
//   {
//     id: "13",
//     dateSubmitted: "2/14/2025",
//     status: "approved",
//     providerService: "Dr. Jane Dan",
//     dateOfService: "2/14/2025",
//     recipient: "Crystal Kant",
//     amount: "$150.00",
//   },
//   {
//     id: "14",
//     dateSubmitted: "2/14/2025",
//     status: "approved",
//     providerService: "Dr. Jane Dan",
//     dateOfService: "2/14/2025",
//     recipient: "Crystal Kant",
//     amount: "$150.00",
//   },
// ];

// Helper function to get status badge props - preserved for restoration
// const getStatusBadge = (status: Claim["status"]) => {
//   switch (status) {
//     case "document-needed":
//       return { intent: "warning" as const, label: "Document needed" };
//     case "denied":
//       return { intent: "destructive" as const, label: "Denied" };
//     case "in-review":
//       return { intent: "info" as const, label: "In review" };
//     case "submitted":
//       return { intent: "info" as const, label: "Submitted" }; // Using info as closest match for purple
//     case "not-submitted":
//       return { intent: "default" as const, label: "Not submitted" };
//     case "approved":
//       return { intent: "success" as const, label: "Approved" };
//     default:
//       return { intent: "default" as const, label: status };
//   }
// };

/**
 * Claims Page
 * 
 * NOTE: Original content has been temporarily replaced with an "under construction" message.
 * All original content (interfaces, mock data, helper functions, and JSX) is preserved below
 * in comments for easy restoration when ready to show the full page.
 */
export default function Claims() {
  // Original state and handlers preserved but commented out:
  // const navigate = useNavigate();
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  // const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  // const [isSheetOpen, setIsSheetOpen] = useState(false);

  // const handleRowClick = (claim: Claim) => {
  //   setSelectedClaim(claim);
  //   setIsSheetOpen(true);
  // };

  // // Calculate pagination
  // const totalPages = Math.ceil(allClaims.length / rowsPerPage);
  // const startIndex = (currentPage - 1) * rowsPerPage;
  // const endIndex = startIndex + rowsPerPage;
  // const paginatedClaims = allClaims.slice(startIndex, endIndex);

  // const handleSort = () => {
  //   if (sortDirection === null) {
  //     setSortDirection("asc");
  //   } else if (sortDirection === "asc") {
  //     setSortDirection("desc");
  //   } else {
  //     setSortDirection(null);
  //   }
  // };

  return (
    <div className="min-h-screen bg-[#F1FAFE]">
      <ConsumerNavigation />

      {/* Main Content */}
      <div className="mx-auto max-w-[1440px] px-8 py-8">
        <UnderConstruction />
      </div>

      <ConsumerFooter />

      {/* Original Claim Detail Sheet - commented out for restoration:
      <ClaimDetailSheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          setIsSheetOpen(open);
          if (!open) {
            setSelectedClaim(null);
          }
        }}
        claim={selectedClaim}
      />
      */}
    </div>
  );
}

/* 
 * ============================================================================
 * ORIGINAL CONTENT PRESERVED BELOW - Restore when ready to show full page
 * ============================================================================
 * 
 * Original return statement structure:
 * 
 * return (
 *   <div className="min-h-screen bg-[#F1FAFE]">
 *     <ConsumerNavigation />
 * 
 *     <div className="mx-auto max-w-[1440px] px-8 py-8">
 *       <div className="mx-auto max-w-[1376px]">
 *         {/* Page Header with title and action buttons *\/}
 *         {/* Summary Cards (Total Reimbursed, Total Not Submitted, Total Claims) *\/}
 *         {/* Action Required Table *\/}
 *         {/* Claims Table with pagination *\/}
 *       </div>
 *     </div>
 * 
 *     <ConsumerFooter />
 * 
 *     <ClaimDetailSheet ... />
 *   </div>
 * );
 * 
 * All original JSX content (summary cards, tables, pagination, etc.) is preserved
 * in the commented sections above. The TypeScript interfaces, mock data, and
 * helper functions remain uncommented above for reference.
 * 
 * ============================================================================
 */

