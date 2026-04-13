import { useState, useMemo, useEffect } from "react";
import { FadeInItem } from "@/components/layout/PageFadeIn";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@wexinc-healthbenefits/ben-ui-kit";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { ConsumerFooter } from "@/components/layout/Footer";
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground";
import { cn } from "@/lib/utils";
import emptyStateIllustration from "@/assets/empty-state-illustration.svg";
import {
  Star,
  Paperclip,
  MoreVertical,
  FileText,
  Settings,
  Inbox,
  Download,
  AlertTriangle,
  Archive,
  Shield,
  DollarSign,
  Mails,
  Mail,
  MailCheck,
  MailOpen,
  X,
  FileSpreadsheet,
} from "lucide-react";
import type { Message } from "@/data/messageCenterUtils";
import {
  getInitialMessages as getInitialMessagesUtil,
  calculateUnreadCount,
  updateUnreadCount,
  saveReadStatus,
  saveArchiveStatus,
} from "@/data/messageCenterUtils";

const getInitialMessages = (): Message[] => {
  const initialMessages: Message[] = [
    {
      id: "1",
      subject: "HSA Contribution Maximum Warning",
      hasAttachment: true,
      category: "Contributions & Investments",
      categoryColor: "#ffbca7",
      categoryTextColor: "#66230e",
      deliveryDate: "11/23/25 11:05AM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your HSA contribution is approaching the annual maximum limit. Please review your contribution settings.",
      attachmentFileName: "HSA_Contribution_Warning_11_23.pdf",
    },
    {
      id: "2",
      subject: "HSA Contribution Notification",
      hasAttachment: true,
      category: "Contributions & Investments",
      categoryColor: "#ffbca7",
      categoryTextColor: "#66230e",
      deliveryDate: "11/23/25 11:05AM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "A new contribution has been processed to your HSA account.",
      attachmentFileName: "Contribution_Notification_11_23.pdf",
    },
    {
      id: "3",
      subject: "HSA Account Summary (11/01/2025-11/30/2025)",
      hasAttachment: true,
      category: "Statements & Tax Documents",
      categoryColor: "#fff7b1",
      categoryTextColor: "#665e18",
      deliveryDate: "11/23/25 11:05AM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your monthly account summary is now available.",
      attachmentFileName: "Account_Summary_11_2025.pdf",
    },
    {
      id: "4",
      subject: "Tax Form Available: 1099-SA",
      hasAttachment: true,
      category: "Statements & Tax Documents",
      categoryColor: "#fff7b1",
      categoryTextColor: "#665e18",
      deliveryDate: "11/23/25 11:05AM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your 1099-SA tax form is now available for download.",
      attachmentFileName: "1099-SA_2025.pdf",
    },
    {
      id: "5",
      subject: "HSA Withdrawal Notification",
      hasAttachment: false,
      category: "Distributions",
      categoryColor: "#9ddcfb",
      categoryTextColor: "#044362",
      deliveryDate: "11/23/25 11:05AM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "A withdrawal has been processed from your HSA account. The funds have been transferred to your linked bank account.",
    },
    {
      id: "6",
      subject: "HSA Payment Issued",
      hasAttachment: false,
      category: "Distributions",
      categoryColor: "#9ddcfb",
      categoryTextColor: "#044362",
      deliveryDate: "11/23/25 11:05AM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your HSA payment has been issued successfully. You should receive the payment within 3-5 business days.",
    },
    {
      id: "7",
      subject: "Purchase Alert",
      hasAttachment: true,
      category: "Cards & Security",
      categoryColor: "#e8a6cc",
      categoryTextColor: "#4f0d33",
      deliveryDate: "11/23/25 11:05AM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "A purchase was made using your HSA card. Please review the transaction details.",
      attachmentFileName: "Purchase_Alert_11_23.pdf",
    },
    {
      id: "8",
      subject: "HSA Account Summary (10/01/2025-10/31/2025)",
      hasAttachment: true,
      category: "Statements & Tax Documents",
      categoryColor: "#fff7b1",
      categoryTextColor: "#665e18",
      deliveryDate: "11/23/25 11:05AM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your monthly account summary is now available.",
      attachmentFileName: "Account_Summary_10_2025.pdf",
    },
    {
      id: "9",
      subject: "HSA Account Summary (09/01/2025-09/30/2025)",
      hasAttachment: true,
      category: "Statements & Tax Documents",
      categoryColor: "#fff7b1",
      categoryTextColor: "#665e18",
      deliveryDate: "11/23/25 11:05AM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your monthly account summary is now available.",
      attachmentFileName: "Account_Summary_09_2025.pdf",
    },
    {
      id: "10",
      subject: "Password Successfully Changed",
      hasAttachment: false,
      category: "Cards & Security",
      categoryColor: "#e8a6cc",
      categoryTextColor: "#4f0d33",
      deliveryDate: "11/23/25 11:05AM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your password has been successfully changed. If you did not make this change, please contact support immediately.",
    },
    {
      id: "11",
      subject: "Monthly Investment Performance Report",
      hasAttachment: true,
      category: "Contributions & Investments",
      categoryColor: "#ffbca7",
      categoryTextColor: "#66230e",
      deliveryDate: "11/22/25 10:30AM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your monthly investment performance report is now available. Review your portfolio performance and allocations.",
      attachmentFileName: "Investment_Report_11_2025.pdf",
    },
    {
      id: "12",
      subject: "Account Statement Available",
      hasAttachment: true,
      category: "Statements & Tax Documents",
      categoryColor: "#fff7b1",
      categoryTextColor: "#665e18",
      deliveryDate: "11/22/25 09:15AM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your account statement for the previous month is now available for download.",
      attachmentFileName: "Statement_11_2025.pdf",
    },
    {
      id: "13",
      subject: "Withdrawal Processed Successfully",
      hasAttachment: false,
      category: "Distributions",
      categoryColor: "#9ddcfb",
      categoryTextColor: "#044362",
      deliveryDate: "11/21/25 03:45PM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your HSA withdrawal request has been processed. Funds will be available in your linked account within 2-3 business days.",
    },
    {
      id: "14",
      subject: "Card Transaction Notification",
      hasAttachment: false,
      category: "Cards & Security",
      categoryColor: "#e8a6cc",
      categoryTextColor: "#4f0d33",
      deliveryDate: "11/21/25 02:20PM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "A transaction was made using your HSA card. Please verify this transaction is authorized.",
    },
    {
      id: "15",
      subject: "Investment Allocation Update",
      hasAttachment: true,
      category: "Contributions & Investments",
      categoryColor: "#ffbca7",
      categoryTextColor: "#66230e",
      deliveryDate: "11/21/25 11:00AM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your investment allocation has been updated. Review the changes in your account.",
      attachmentFileName: "Allocation_Update_11_21.pdf",
    },
    {
      id: "16",
      subject: "HSA Account Summary (08/01/2025-08/31/2025)",
      hasAttachment: true,
      category: "Statements & Tax Documents",
      categoryColor: "#fff7b1",
      categoryTextColor: "#665e18",
      deliveryDate: "11/20/25 04:30PM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your monthly account summary is now available.",
      attachmentFileName: "Account_Summary_08_2025.pdf",
    },
    {
      id: "17",
      subject: "Payment Confirmation",
      hasAttachment: false,
      category: "Distributions",
      categoryColor: "#9ddcfb",
      categoryTextColor: "#044362",
      deliveryDate: "11/20/25 01:15PM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your HSA payment has been confirmed and processed. The payment will be sent to the specified recipient.",
    },
    {
      id: "18",
      subject: "Security Alert: New Login Detected",
      hasAttachment: false,
      category: "Cards & Security",
      categoryColor: "#e8a6cc",
      categoryTextColor: "#4f0d33",
      deliveryDate: "11/19/25 10:45AM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "A new login was detected from an unrecognized device. If this was not you, please secure your account immediately.",
    },
    {
      id: "19",
      subject: "Quarterly Investment Summary",
      hasAttachment: true,
      category: "Contributions & Investments",
      categoryColor: "#ffbca7",
      categoryTextColor: "#66230e",
      deliveryDate: "11/19/25 09:30AM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your quarterly investment summary is now available. Review your portfolio performance for Q3 2025.",
      attachmentFileName: "Q3_Investment_Summary_2025.pdf",
    },
    {
      id: "20",
      subject: "Tax Document: Form 1099-SA Available",
      hasAttachment: true,
      category: "Statements & Tax Documents",
      categoryColor: "#fff7b1",
      categoryTextColor: "#665e18",
      deliveryDate: "11/18/25 02:00PM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your 1099-SA tax form for the current tax year is now available for download.",
      attachmentFileName: "1099-SA_2025.pdf",
    },
    {
      id: "21",
      subject: "HSA Contribution Received",
      hasAttachment: false,
      category: "Contributions & Investments",
      categoryColor: "#ffbca7",
      categoryTextColor: "#66230e",
      deliveryDate: "11/18/25 11:20AM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "A new contribution has been received and deposited into your HSA account. The funds are now available for use.",
    },
    {
      id: "22",
      subject: "Account Summary (07/01/2025-07/31/2025)",
      hasAttachment: true,
      category: "Statements & Tax Documents",
      categoryColor: "#fff7b1",
      categoryTextColor: "#665e18",
      deliveryDate: "11/17/25 03:10PM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your monthly account summary is now available.",
      attachmentFileName: "Account_Summary_07_2025.pdf",
    },
    {
      id: "23",
      subject: "Withdrawal Request Approved",
      hasAttachment: false,
      category: "Distributions",
      categoryColor: "#9ddcfb",
      categoryTextColor: "#044362",
      deliveryDate: "11/17/25 12:45PM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your withdrawal request has been approved. The funds will be transferred to your linked bank account.",
    },
    {
      id: "24",
      subject: "Card Replacement Shipped",
      hasAttachment: false,
      category: "Cards & Security",
      categoryColor: "#e8a6cc",
      categoryTextColor: "#4f0d33",
      deliveryDate: "11/16/25 10:00AM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your replacement HSA card has been shipped. You should receive it within 7-10 business days.",
    },
    {
      id: "25",
      subject: "Investment Options Updated",
      hasAttachment: true,
      category: "Contributions & Investments",
      categoryColor: "#ffbca7",
      categoryTextColor: "#66230e",
      deliveryDate: "11/16/25 09:15AM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "New investment options have been added to your HSA account. Review the available options and update your allocations.",
      attachmentFileName: "Investment_Options_Update_11_16.pdf",
    },
    {
      id: "26",
      subject: "Monthly Statement Ready",
      hasAttachment: true,
      category: "Statements & Tax Documents",
      categoryColor: "#fff7b1",
      categoryTextColor: "#665e18",
      deliveryDate: "11/15/25 04:20PM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your monthly statement is now ready for review and download.",
      attachmentFileName: "Statement_11_15_2025.pdf",
    },
    {
      id: "27",
      subject: "HSA Payment Processed",
      hasAttachment: false,
      category: "Distributions",
      categoryColor: "#9ddcfb",
      categoryTextColor: "#044362",
      deliveryDate: "11/15/25 01:30PM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your HSA payment has been processed successfully. The payment will be sent to the healthcare provider.",
    },
    {
      id: "28",
      subject: "PIN Change Confirmation",
      hasAttachment: false,
      category: "Cards & Security",
      categoryColor: "#e8a6cc",
      categoryTextColor: "#4f0d33",
      deliveryDate: "11/14/25 11:45AM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your card PIN has been successfully changed. Please keep your new PIN secure and do not share it with anyone.",
    },
    {
      id: "29",
      subject: "Contribution Limit Reminder",
      hasAttachment: true,
      category: "Contributions & Investments",
      categoryColor: "#ffbca7",
      categoryTextColor: "#66230e",
      deliveryDate: "11/14/25 10:10AM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "You are approaching your annual HSA contribution limit. Please review your contribution amounts to avoid exceeding the limit.",
      attachmentFileName: "Contribution_Limit_Reminder_11_14.pdf",
    },
    {
      id: "30",
      subject: "Annual Tax Summary Available",
      hasAttachment: true,
      category: "Statements & Tax Documents",
      categoryColor: "#fff7b1",
      categoryTextColor: "#665e18",
      deliveryDate: "11/13/25 02:50PM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your annual tax summary for 2025 is now available. This document contains important information for your tax filing.",
      attachmentFileName: "Annual_Tax_Summary_2025.pdf",
    },
    {
      id: "31",
      subject: "Distribution Request Submitted",
      hasAttachment: false,
      category: "Distributions",
      categoryColor: "#9ddcfb",
      categoryTextColor: "#044362",
      deliveryDate: "11/13/25 12:00PM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your distribution request has been submitted and is being processed. You will receive a confirmation once it's complete.",
    },
    {
      id: "32",
      subject: "Fraud Alert: Suspicious Activity",
      hasAttachment: false,
      category: "Cards & Security",
      categoryColor: "#e8a6cc",
      categoryTextColor: "#4f0d33",
      deliveryDate: "11/12/25 03:30PM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "We detected suspicious activity on your account. Please verify your recent transactions and contact us if you notice any unauthorized activity.",
    },
    {
      id: "33",
      subject: "Investment Performance Update",
      hasAttachment: true,
      category: "Contributions & Investments",
      categoryColor: "#ffbca7",
      categoryTextColor: "#66230e",
      deliveryDate: "11/12/25 09:45AM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your investment performance has been updated. Review your portfolio gains and losses for the current period.",
      attachmentFileName: "Performance_Update_11_12.pdf",
    },
    {
      id: "34",
      subject: "Account Summary (06/01/2025-06/30/2025)",
      hasAttachment: true,
      category: "Statements & Tax Documents",
      categoryColor: "#fff7b1",
      categoryTextColor: "#665e18",
      deliveryDate: "11/11/25 01:20PM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your monthly account summary is now available.",
      attachmentFileName: "Account_Summary_06_2025.pdf",
    },
    {
      id: "35",
      subject: "Withdrawal Completed",
      hasAttachment: false,
      category: "Distributions",
      categoryColor: "#9ddcfb",
      categoryTextColor: "#044362",
      deliveryDate: "11/11/25 10:30AM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your withdrawal has been completed. The funds have been transferred to your linked account.",
    },
    {
      id: "36",
      subject: "Card Activation Required",
      hasAttachment: false,
      category: "Cards & Security",
      categoryColor: "#e8a6cc",
      categoryTextColor: "#4f0d33",
      deliveryDate: "11/10/25 02:15PM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your new HSA card requires activation. Please activate your card before first use to ensure it's ready for transactions.",
    },
    {
      id: "37",
      subject: "HSA Contribution Limit Reached",
      hasAttachment: true,
      category: "Contributions & Investments",
      categoryColor: "#ffbca7",
      categoryTextColor: "#66230e",
      deliveryDate: "11/10/25 11:00AM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "You have reached your annual HSA contribution limit. No further contributions will be accepted for this tax year.",
      attachmentFileName: "Contribution_Limit_Reached_11_10.pdf",
    },
    {
      id: "38",
      subject: "Tax Form 1099-SA Ready for Download",
      hasAttachment: true,
      category: "Statements & Tax Documents",
      categoryColor: "#fff7b1",
      categoryTextColor: "#665e18",
      deliveryDate: "11/09/25 03:45PM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your 1099-SA tax form is ready for download. This form is required for your tax filing.",
      attachmentFileName: "1099-SA_2025.pdf",
    },
    {
      id: "39",
      subject: "Payment Authorization Confirmed",
      hasAttachment: false,
      category: "Distributions",
      categoryColor: "#9ddcfb",
      categoryTextColor: "#044362",
      deliveryDate: "11/09/25 12:30PM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your payment authorization has been confirmed. The payment will be processed according to your instructions.",
    },
    {
      id: "40",
      subject: "Account Security Settings Updated",
      hasAttachment: false,
      category: "Cards & Security",
      categoryColor: "#e8a6cc",
      categoryTextColor: "#4f0d33",
      deliveryDate: "11/08/25 10:15AM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your account security settings have been updated. Review the changes to ensure they match your preferences.",
    },
    {
      id: "41",
      subject: "Investment Rebalancing Notice",
      hasAttachment: true,
      category: "Contributions & Investments",
      categoryColor: "#ffbca7",
      categoryTextColor: "#66230e",
      deliveryDate: "11/07/25 02:00PM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your investment portfolio has been automatically rebalanced to maintain your target allocation percentages.",
      attachmentFileName: "Rebalancing_Notice_11_07.pdf",
    },
    {
      id: "42",
      subject: "Account Summary (05/01/2025-05/31/2025)",
      hasAttachment: true,
      category: "Statements & Tax Documents",
      categoryColor: "#fff7b1",
      categoryTextColor: "#665e18",
      deliveryDate: "11/06/25 01:45PM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your monthly account summary is now available.",
      attachmentFileName: "Account_Summary_05_2025.pdf",
    },
    {
      id: "43",
      subject: "Distribution Processing",
      hasAttachment: false,
      category: "Distributions",
      categoryColor: "#9ddcfb",
      categoryTextColor: "#044362",
      deliveryDate: "11/05/25 11:20AM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your distribution request is currently being processed. You will receive a notification once it's complete.",
    },
    {
      id: "44",
      subject: "Two-Factor Authentication Enabled",
      hasAttachment: false,
      category: "Cards & Security",
      categoryColor: "#e8a6cc",
      categoryTextColor: "#4f0d33",
      deliveryDate: "11/04/25 03:00PM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Two-factor authentication has been enabled on your account for enhanced security.",
    },
    {
      id: "45",
      subject: "Contribution Schedule Updated",
      hasAttachment: true,
      category: "Contributions & Investments",
      categoryColor: "#ffbca7",
      categoryTextColor: "#66230e",
      deliveryDate: "11/03/25 10:30AM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your contribution schedule has been updated. Review the new schedule to ensure it meets your needs.",
      attachmentFileName: "Contribution_Schedule_Update_11_03.pdf",
    },
    {
      id: "46",
      subject: "Quarterly Statement Available",
      hasAttachment: true,
      category: "Statements & Tax Documents",
      categoryColor: "#fff7b1",
      categoryTextColor: "#665e18",
      deliveryDate: "11/02/25 09:15AM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your quarterly statement for Q3 2025 is now available for download.",
      attachmentFileName: "Q3_Statement_2025.pdf",
    },
    {
      id: "47",
      subject: "Payment Reversal Notice",
      hasAttachment: false,
      category: "Distributions",
      categoryColor: "#9ddcfb",
      categoryTextColor: "#044362",
      deliveryDate: "11/01/25 02:45PM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "A payment has been reversed and the funds have been returned to your HSA account.",
    },
    {
      id: "48",
      subject: "Card Expiration Reminder",
      hasAttachment: false,
      category: "Cards & Security",
      categoryColor: "#e8a6cc",
      categoryTextColor: "#4f0d33",
      deliveryDate: "10/31/25 01:00PM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "Your HSA card will expire soon. A replacement card will be automatically sent to your registered address.",
    },
    {
      id: "49",
      subject: "Investment Fee Schedule Update",
      hasAttachment: true,
      category: "Contributions & Investments",
      categoryColor: "#ffbca7",
      categoryTextColor: "#66230e",
      deliveryDate: "10/30/25 11:30AM",
      isStarred: false,
      isBold: false,
      isRead: false,
      isArchived: false,
      body: "The investment fee schedule has been updated. Review the new fee structure for your investment options.",
      attachmentFileName: "Fee_Schedule_Update_10_30.pdf",
    },
    {
      id: "50",
      subject: "Year-End Tax Preparation Guide",
      hasAttachment: true,
      category: "Statements & Tax Documents",
      categoryColor: "#fff7b1",
      categoryTextColor: "#665e18",
      deliveryDate: "10/29/25 10:00AM",
      isStarred: false,
      isBold: true,
      isRead: false,
      isArchived: false,
      body: "Your year-end tax preparation guide is now available. This guide will help you prepare for tax filing season.",
      attachmentFileName: "Tax_Prep_Guide_2025.pdf",
    },
  ];

  return getInitialMessagesUtil(initialMessages);
};

/**
 * Message type titles that require attention (from product spec).
 * A message is "Attention Needed" if its subject contains one of these (case-insensitive).
 */
const ATTENTION_NEEDED_MESSAGE_TYPES: string[] = [
  // Money Activity
  "HSA Excess Contribution Notification",
  "FSA Final Filing Date and Remaining Balance Notification",
  "Hold Claim Requiring Attestation Notification",
  "Recurring Claim Coverage Attestation",
  "Recurring Claim Coverage Attestation Alert",
  "Smart Commute Order Not Processed",
  "Smart Commute Order Recurrence Schedule Expiration",
  "Denial Letter",
  "Denial Letter With Repayment",
  "Medicare Advantage Denial Letter",
  "Claim Applied to Repayment Alert",
  "Documentation Reminder",
  "Documentation Needed for Debit Card Transaction",
  "Request for More Information (RMI)",
  "HSA Excess Distribution Notification",
  "HSA Cash Balance Warning",
  "HSA Contribution Maximum Warning",
  "HSA Recurring Contribution Cancelled",
  "Enhanced First Letter",
  "Enhanced Second Letter",
  "Enhanced Overdue Letter",
  "Enhanced Ineligible Letter",
  "Enhanced RMI Letter",
  "Hold Claim Attestation Required Alert",
  // Account & Security
  "Password Successfully Changed",
  "HSA Account Closure Notification",
  "Debit Card Suspend Notification",
  "Debit Card Purse Suspend Notification",
  "Account Locked",
  "Red Flags Notification",
  "Missing Custodial Agreements Acceptance",
  "Missing Identity Verification Documentation",
  "Enrollment Reminder",
];

function isMessageAttentionNeeded(message: Message): boolean {
  const subjectLower = message.subject.toLowerCase();
  return ATTENTION_NEEDED_MESSAGE_TYPES.some((title) =>
    subjectLower.includes(title.toLowerCase())
  );
}

export default function MessageCenter() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Message[]>(() => {
    const initial = getInitialMessages();
    // Initialize unread count on mount
    const initialUnreadCount = calculateUnreadCount(initial);
    updateUnreadCount(initialUnreadCount);
    return initial;
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedMessageIds, setSelectedMessageIds] = useState<Set<string>>(new Set());

  const updateMessage = (id: string, updates: Partial<Message>) => {
    setMessages((prev) => {
      const updated = prev.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg));
      
      // Save read status to localStorage and update unread count
      if (updates.hasOwnProperty("isRead")) {
        saveReadStatus(id, updates.isRead as boolean);
        const newUnreadCount = calculateUnreadCount(updated);
        updateUnreadCount(newUnreadCount);
      }
      
      // Save archive status to localStorage and update unread count
      if (updates.hasOwnProperty("isArchived")) {
        saveArchiveStatus(id, updates.isArchived as boolean);
        const newUnreadCount = calculateUnreadCount(updated);
        updateUnreadCount(newUnreadCount);
      }
      
      return updated;
    });
    
    // Update selectedMessage if it's the message being updated
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    // In mobile view, open modal; in desktop view, use side panel
    if (isMobile) {
      setIsModalOpen(true);
    }
    if (!message.isRead) {
      updateMessage(message.id, { isRead: true });
    }
  };

  const handleCloseDetailPanel = () => {
    setSelectedMessage(null);
  };


  const handleToggleReadStatus = (message: Message, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    updateMessage(message.id, { isRead: !message.isRead });
  };

  const handleToggleStar = (message: Message, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    updateMessage(message.id, { isStarred: !message.isStarred });
  };

  const handleArchive = (message: Message, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    updateMessage(message.id, { isArchived: true });
  };

  const handleUnarchive = (message: Message, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    updateMessage(message.id, { isArchived: false });
  };

  const handleBulkMarkUnread = () => {
    selectedMessageIds.forEach((id) => {
      updateMessage(id, { isRead: false });
    });
    setSelectedMessageIds(new Set());
  };

  const handleBulkArchive = () => {
    selectedMessageIds.forEach((id) => {
      updateMessage(id, { isArchived: true });
    });
    setSelectedMessageIds(new Set());
  };

  const getEmptyStateText = (): string => {
    if (selectedCategory === null) {
      return "You don't have any messages yet";
    }
    if (selectedCategory === "archive") {
      return "You don't have any archived messages yet";
    }
    if (selectedCategory === "starred") {
      return "You don't have any starred messages yet";
    }
    if (selectedCategory === "unread") {
      return "You don't have any unread messages yet";
    }
    if (selectedCategory === "recently-viewed") {
      return "You don't have any recently viewed messages yet";
    }
    // Category filter
    return "You don't have any messages in this category yet";
  };

  const unreadCount = useMemo(() => {
    return messages.filter((message) => !message.isRead && !message.isArchived).length;
  }, [messages]);


  const filteredMessages = useMemo(() => {
    if (selectedCategory === null) {
      // All Messages: show only non-archived messages
      return messages.filter((message) => !message.isArchived);
    }
    if (selectedCategory === "archive") {
      // Archive view: show only archived messages
      return messages.filter((message) => message.isArchived === true);
    }
    if (selectedCategory === "action-required") {
      // Attention Needed: show messages whose type is in the spec list
      return messages.filter(
        (message) => isMessageAttentionNeeded(message) && !message.isArchived
      );
    }
    if (selectedCategory === "unread") {
      // Unread: show only non-archived unread messages
      return messages.filter((message) => message.isRead === false && !message.isArchived);
    }
    if (selectedCategory === "starred") {
      // Starred: show only non-archived starred messages
      return messages.filter((message) => message.isStarred === true && !message.isArchived);
    }
    // Category filter - map new category names to existing ones
    let categoryFilter = selectedCategory;
    if (selectedCategory === "Account & Security") {
      categoryFilter = "Cards & Security";
    } else if (selectedCategory === "Money Activity") {
      categoryFilter = "Contributions & Investments";
    } else if (selectedCategory === "Tax & Statements") {
      categoryFilter = "Statements & Tax Documents";
    }
    // Category filter: show only non-archived messages in that category
    return messages.filter((message) => message.category === categoryFilter && !message.isArchived);
  }, [selectedCategory, messages]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMessages = filteredMessages.slice(startIndex, endIndex);

  // Reset to page 1 when filters or items per page change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, itemsPerPage]);

  const mobileFilterOptions = [
    { label: "All Messages", value: "all", section: "Activity" },
    { label: "Unread", value: "unread", section: "Activity" },
    { label: "Recently Viewed", value: "recently-viewed", section: "Activity" },
    { label: "Starred", value: "starred", section: "Activity" },
    { label: "Archive", value: "archive", section: "Manage" },
    { label: "Cards & Security", value: "Cards & Security", section: "Categories" },
    { label: "Investments", value: "Contributions & Investments", section: "Categories" },
    { label: "Distributions", value: "Distributions", section: "Categories" },
    { label: "Documents", value: "Statements & Tax Documents", section: "Categories" },
  ];

  const handleMobileSelect = (value: string) => {
    setSelectedCategory(value === "all" ? null : value);
  };

  return (
    <div className="min-h-screen" style={consumerPageBackgroundStyle}>
      {/* Navigation Bar */}
      <ConsumerNavigation />

      {/* Main Content */}
      <FadeInItem>
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-[1376px]">
          {/* Page Header */}
          <div className="mb-6 space-y-3 md:mb-8">
            {/* Mobile: title + icon buttons right-aligned */}
            <div className="flex items-center justify-between min-[400px]:hidden">
              <h1 className="text-2xl font-bold leading-[34px] tracking-[-0.63px] text-black">
                Message Center
              </h1>
              <div className="flex items-center gap-2">
                <Button
                  intent="primary"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 border-primary text-primary"
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Button
                  intent="primary"
                  size="icon"
                  className="h-10 w-10 bg-primary text-white hover:bg-primary/90"
                  onClick={() => navigate("/my-profile?subPage=communication")}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Desktop: title + full buttons */}
            <div className="hidden items-center justify-between min-[400px]:flex">
              <h1 className="text-2xl font-bold leading-[34px] tracking-[-0.63px] text-black min-[400px]:text-[30px] min-[400px]:leading-[40px]">
                Message Center
              </h1>
              <div className="flex w-full flex-wrap gap-3 min-[400px]:w-auto min-[400px]:flex-nowrap min-[400px]:gap-4">
                <Button
                  intent="primary"
                  variant="outline"
                  className="flex items-center gap-2 border-primary text-primary min-[400px]:h-[44px]"
                  onClick={() => navigate("/account-documents")}
                >
                  <FileText className="h-4 w-4 text-primary" />
                  Account Documents
                </Button>
                <Button
                  intent="primary"
                  className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 min-[400px]:h-[44px]"
                  onClick={() => navigate("/my-profile?subPage=communication")}
                >
                  <Settings className="h-4 w-4 text-white" />
                  Communication Preferences
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="mb-4 min-[400px]:hidden">
            <Card className="rounded-2xl">
              <CardContent className="space-y-3 p-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-[0.24px] text-foreground">
                    Filter Messages
                  </p>
                  <Select value={selectedCategory ?? "all"} onValueChange={handleMobileSelect}>
                    <SelectTrigger className="h-[44px] w-full">
                      <SelectValue placeholder="Choose filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Activity</SelectLabel>
                        {mobileFilterOptions
                          .filter((o) => o.section === "Activity")
                          .map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label === "Unread" ? `Unread (${unreadCount})` : o.label}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                      <SelectSeparator />
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {mobileFilterOptions
                          .filter((o) => o.section === "Categories")
                          .map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                      <SelectSeparator />
                      <SelectGroup>
                        <SelectLabel>Manage</SelectLabel>
                        <SelectItem value="archive">Archive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Container */}
          <SidebarProvider defaultOpen={true} className="h-full">
            <Card className="rounded-2xl overflow-hidden h-full w-full">
              <div className="flex h-full w-full">
                {/* Left Sidebar */}
                <Sidebar
                  collapsible="none"
                  className="hidden min-[400px]:flex w-[252px] border-r border-wex-card-border bg-wex-card-bg flex-col h-auto shrink-0"
                >
                  <SidebarContent className="flex-1 h-full px-2 py-4">
                    <SidebarGroup className="flex-1 h-full">
                      <SidebarGroupContent className="flex-1 h-full">
                        <SidebarMenu className="flex-1 h-full">
                          {/* Activity Section */}
                          <SidebarGroupLabel className="px-3 py-[7px]">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.24px]">ACTIVITY</span>
                          </SidebarGroupLabel>
                          <div className="space-y-1">
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                isActive={selectedCategory === null}
                                onClick={() => setSelectedCategory(null)}
                                className="h-[32px] min-h-[32px] whitespace-normal px-3 py-1 rounded-md data-[active=true]:bg-[var(--theme-secondary-ramp-50)] data-[active=true]:text-secondary data-[active=false]:text-foreground hover:bg-muted"
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <Mails className={`h-[14px] w-[14px] shrink-0 ${selectedCategory === null ? 'text-secondary' : 'text-foreground'}`} />
                                  <span className="text-sm tracking-[-0.084px]">All Messages</span>
                                </div>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                isActive={selectedCategory === "action-required"}
                                onClick={() => setSelectedCategory("action-required")}
                                className="h-[32px] min-h-[32px] whitespace-normal px-3 py-1 rounded-md data-[active=true]:bg-[var(--theme-secondary-ramp-50)] data-[active=true]:text-secondary data-[active=false]:text-foreground hover:bg-muted"
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <AlertTriangle className={`h-[14px] w-[14px] shrink-0 ${selectedCategory === "action-required" ? 'text-secondary' : 'text-foreground'}`} />
                                  <span className="text-sm tracking-[0.07px]">Attention Needed</span>
                                </div>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                isActive={selectedCategory === "unread"}
                                onClick={() => setSelectedCategory("unread")}
                                className="h-[32px] min-h-[32px] whitespace-normal px-3 py-1 rounded-md data-[active=true]:bg-[var(--theme-secondary-ramp-50)] data-[active=true]:text-secondary data-[active=false]:text-foreground hover:bg-muted"
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <Mail className={`h-[14px] w-[14px] shrink-0 ${selectedCategory === "unread" ? 'text-secondary' : 'text-foreground'}`} />
                                  <span className="text-sm tracking-[0.07px]">Unread ({unreadCount})</span>
                                </div>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                isActive={selectedCategory === "starred"}
                                onClick={() => setSelectedCategory("starred")}
                                className="h-[32px] min-h-[32px] whitespace-normal px-3 py-1 rounded-md data-[active=true]:bg-[var(--theme-secondary-ramp-50)] data-[active=true]:text-secondary data-[active=false]:text-foreground hover:bg-muted"
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <Star className={`h-[14px] w-[14px] shrink-0 ${selectedCategory === "starred" ? 'text-secondary' : 'text-foreground'}`} />
                                  <span className="text-sm tracking-[0.07px]">Starred</span>
                                </div>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                isActive={selectedCategory === "archive"}
                                onClick={() => setSelectedCategory("archive")}
                                className="h-[32px] min-h-[32px] whitespace-normal px-3 py-1 rounded-md data-[active=true]:bg-[var(--theme-secondary-ramp-50)] data-[active=true]:text-secondary data-[active=false]:text-foreground hover:bg-muted"
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <Archive className={`h-[14px] w-[14px] shrink-0 ${selectedCategory === "archive" ? 'text-secondary' : 'text-foreground'}`} />
                                  <span className="text-sm tracking-[0.07px]">Archived</span>
                                </div>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </div>

                          <SidebarSeparator className="my-2" />

                          <SidebarGroupLabel className="px-3 py-[7px]">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.24px]">CATEGORIES</span>
                          </SidebarGroupLabel>
                          <div className="space-y-1">
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                isActive={selectedCategory === "Account & Security"}
                                onClick={() => setSelectedCategory("Account & Security")}
                                className="h-[32px] min-h-[32px] whitespace-normal px-3 py-1 rounded-md data-[active=true]:bg-[var(--theme-secondary-ramp-50)] data-[active=true]:text-secondary data-[active=false]:text-foreground hover:bg-muted"
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <Shield className={`h-[14px] w-[14px] shrink-0 ${selectedCategory === "Account & Security" ? 'text-secondary' : 'text-foreground'}`} />
                                  <span className="text-sm tracking-[0.07px]">Account & Security</span>
                                </div>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                isActive={selectedCategory === "Money Activity"}
                                onClick={() => setSelectedCategory("Money Activity")}
                                className="h-[32px] min-h-[32px] whitespace-normal px-3 py-1 rounded-md data-[active=true]:bg-[var(--theme-secondary-ramp-50)] data-[active=true]:text-secondary data-[active=false]:text-foreground hover:bg-muted"
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <DollarSign className={`h-[14px] w-[14px] shrink-0 ${selectedCategory === "Money Activity" ? 'text-secondary' : 'text-foreground'}`} />
                                  <span className="text-sm tracking-[0.07px]">Money Activity</span>
                                </div>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                isActive={selectedCategory === "Tax & Statements"}
                                onClick={() => setSelectedCategory("Tax & Statements")}
                                className="h-[32px] min-h-[32px] whitespace-normal px-3 py-1 rounded-md data-[active=true]:bg-[var(--theme-secondary-ramp-50)] data-[active=true]:text-secondary data-[active=false]:text-foreground hover:bg-muted"
                              >
                                <div className="flex items-center gap-2 w-full">
                                  <FileSpreadsheet className={`h-[14px] w-[14px] shrink-0 ${selectedCategory === "Tax & Statements" ? 'text-secondary' : 'text-foreground'}`} />
                                  <span className="text-sm tracking-[0.07px]">Tax & Statements</span>
                                </div>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </div>
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </SidebarContent>
                </Sidebar>

                {/* Main Content Area - Flex container ready for two-panel design */}
                <SidebarInset className="flex-1 min-w-0 bg-wex-card-bg md:peer-data-[variant=inset]:m-0 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-none md:peer-data-[variant=inset]:ml-0 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-0">
                  {/* Flex wrapper for two-panel layout (table + detail panel) */}
                  <div className="flex h-full w-full">
                    {/* Table Container - Full width when no message selected, shrinks when detail panel is visible */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="p-4 sm:p-6 flex-1 flex flex-col">
                {filteredMessages.length === 0 ? (
                  /* Empty State */
                  <Empty className="border-0 py-12">
                    <EmptyHeader>
                      <EmptyMedia variant="default">
                        <img 
                          src={emptyStateIllustration} 
                          alt="" 
                          className="h-[191px] w-[235px]"
                        />
                      </EmptyMedia>
                      <EmptyTitle className="text-base font-normal text-foreground">
                        {getEmptyStateText()}
                      </EmptyTitle>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <>
                    {/* Mobile Card List */}
                    <div className="space-y-3 min-[400px]:hidden">
                      {filteredMessages.map((message) => (
                        <Card
                          key={message.id}
                          className="shadow-sm cursor-pointer"
                          onClick={(e) => {
                            // Don't open modal if clicking on interactive elements
                            const target = e.target as HTMLElement;
                            if (target.closest('button') || target.closest('[role="checkbox"]') || target.closest('input[type="checkbox"]')) {
                              return;
                            }
                            // In mobile view, open modal; desktop uses side panel
                            if (isMobile) {
                              setSelectedMessage(message);
                              setIsModalOpen(true);
                              if (!message.isRead) {
                                updateMessage(message.id, { isRead: true });
                              }
                            } else {
                              handleMessageClick(message);
                            }
                          }}
                        >
                          <CardContent className="space-y-3 p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-1 items-start gap-2">
                                {message.hasAttachment && (
                                  <Paperclip className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--wex-info))]" />
                                )}
                                <div className="space-y-1 flex-1">
                                  <p
                                    className={`text-sm tracking-[-0.084px] ${
                                      !message.isRead
                                        ? "font-bold text-foreground"
                                        : "font-normal text-foreground"
                                    }`}
                                  >
                                    {message.subject}
                                  </p>
                                  <p className="text-xs text-muted-foreground whitespace-nowrap">{message.deliveryDate}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {isMessageAttentionNeeded(message) && (
                                  <AlertTriangle className="h-4 w-4 shrink-0 text-[hsl(var(--wex-destructive))]" />
                                )}
                                <button
                                  onClick={(e) => handleToggleStar(message, e)}
                                  className="cursor-pointer rounded-full p-2 hover:bg-gray-100"
                                  aria-label={message.isStarred ? "Unstar message" : "Star message"}
                                >
                                  <Star
                                    className={cn(
                                      "h-4 w-4",
                                      message.isStarred
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground"
                                    )}
                                  />
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleToggleReadStatus(message, e)}
                                className="px-3 flex items-center gap-2 text-primary hover:text-primary"
                              >
                                {message.isRead ? (
                                  <>
                                    <MailOpen className="h-4 w-4" />
                                    <span>Mark as Unread</span>
                                  </>
                                ) : (
                                  <>
                                    <MailCheck className="h-4 w-4" />
                                    <span>Mark Read</span>
                                  </>
                                )}
                              </Button>
                              {selectedCategory !== "archive" ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => handleArchive(message, e)}
                                  className="px-3 flex items-center gap-2 text-primary hover:text-primary"
                                >
                                  <Archive className="h-4 w-4" />
                                  <span>Archive</span>
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => handleUnarchive(message, e)}
                                  className="px-3"
                                >
                                  Move to inbox
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden min-[400px]:block flex-1 flex flex-col min-h-0">
                      <div className="overflow-x-auto flex-1">
                        <Table>
                          {/* Table Header */}
                          <TableHeader>
                            {selectedMessageIds.size > 0 ? (
                              // Bulk Action Bar
                              <TableRow className="border-b border-border bg-primary">
                                <TableHead colSpan={5} className="px-3.5 py-2.5 bg-primary text-primary-foreground h-10 min-h-0">
                                  <div className="flex items-center gap-4 h-full min-h-0">
                                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" >
                                      <Checkbox
                                        checked={(() => {
                                          if (paginatedMessages.length === 0) return false;
                                          const selectedCount = paginatedMessages.filter(msg => selectedMessageIds.has(msg.id)).length;
                                          if (selectedCount === 0) return false;
                                          if (selectedCount === paginatedMessages.length) return true;
                                          return "indeterminate";
                                        })()}
                                        onCheckedChange={() => {
                                          const newSelected = new Set(selectedMessageIds);
                                          const allSelected = paginatedMessages.every((msg) => selectedMessageIds.has(msg.id));
                                          
                                          if (allSelected) {
                                            // If all are selected, deselect all
                                            paginatedMessages.forEach((msg) => newSelected.delete(msg.id));
                                          } else {
                                            // If none or some are selected, select all
                                            paginatedMessages.forEach((msg) => newSelected.add(msg.id));
                                          }
                                          setSelectedMessageIds(newSelected);
                                        }}
                                        className="border-white data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=indeterminate]:bg-white data-[state=indeterminate]:border-white [&>svg]:text-primary h-5 w-5 flex-shrink-0"
                                        
                                      />
                                    </div>
                                    <span className="text-sm font-normal text-white tracking-[-0.084px] shrink-0">
                                      {selectedMessageIds.size} {selectedMessageIds.size === 1 ? 'Message' : 'Messages'} Selected
                                    </span>
                                    <div className="flex items-center gap-0 shrink-0">
                                      <button
                                        onClick={handleBulkMarkUnread}
                                        className="flex items-center gap-[7px] px-[10.5px] py-0.5 rounded-[6px] text-sm font-medium text-white hover:bg-white/20 transition-colors h-auto"
                                      >
                                        <MailOpen className="h-[14px] w-[14px]" />
                                        <span>Mark Unread</span>
                                      </button>
                                      <button
                                        onClick={handleBulkArchive}
                                        className="flex items-center gap-[8px] px-[10.5px] py-0.5 rounded-[6px] text-sm font-medium text-white hover:bg-white/20 transition-colors ml-0 h-auto"
                                      >
                                        <Archive className="h-[14px] w-[14px]" />
                                        <span>Archive</span>
                                      </button>
                                    </div>
                                  </div>
                                </TableHead>
                              </TableRow>
                            ) : (
                              // Regular Table Header
                              <TableRow className="border-b border-border bg-muted">
                                <TableHead className="w-[47px] min-w-[47px] max-w-[47px] px-3.5 py-2.5 text-left bg-muted flex-shrink-0">
                                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" >
                                    <Checkbox
                                      checked={(() => {
                                        if (paginatedMessages.length === 0) return false;
                                        const selectedCount = paginatedMessages.filter(msg => selectedMessageIds.has(msg.id)).length;
                                        if (selectedCount === 0) return false;
                                        if (selectedCount === paginatedMessages.length) return true;
                                        return "indeterminate";
                                      })()}
                                      onCheckedChange={() => {
                                        const newSelected = new Set(selectedMessageIds);
                                        const allSelected = paginatedMessages.every((msg) => selectedMessageIds.has(msg.id));
                                        
                                        if (allSelected) {
                                          // If all are selected, deselect all
                                          paginatedMessages.forEach((msg) => newSelected.delete(msg.id));
                                        } else {
                                          // If none or some are selected, select all
                                          paginatedMessages.forEach((msg) => newSelected.add(msg.id));
                                        }
                                        setSelectedMessageIds(newSelected);
                                      }}
                                      className="h-5 w-5 flex-shrink-0"
                                      
                                    />
                                  </div>
                                </TableHead>
                                <TableHead className="w-[40px] min-w-[40px] max-w-[40px] px-3.5 py-2.5 text-center bg-muted flex-shrink-0">
                                </TableHead>
                                <TableHead className="px-3.5 py-2.5 text-left bg-muted min-w-0">
                                  <span className="text-sm font-semibold text-foreground">Subject</span>
                                </TableHead>
                                <TableHead className="px-3.5 py-2.5 text-left bg-muted min-w-0">
                                  <span className="text-sm font-semibold text-foreground">Date</span>
                                </TableHead>
                                <TableHead className="w-[129px] min-w-[129px] max-w-[129px] px-3.5 py-2.5 text-right bg-muted flex-shrink-0">
                                  <span className="text-sm font-semibold text-foreground">Action</span>
                                </TableHead>
                              </TableRow>
                            )}
                          </TableHeader>
                          {/* Table Body */}
                          <TableBody>
                            {paginatedMessages.map((message) => (
                            <TableRow
                              key={message.id}
                              className={cn(
                                "cursor-pointer border-b border-border hover:bg-gray-50",
                                selectedMessage?.id === message.id && "bg-muted/50"
                              )}
                              onClick={(e) => {
                                // Don't open modal if clicking on checkbox or dropdown menu
                                const target = e.target as HTMLElement;
                                if (target.closest('[role="checkbox"]') || target.closest('input[type="checkbox"]') || target.closest('[role="menu"]')) {
                                  return;
                                }
                                handleMessageClick(message);
                              }}
                            >
                              <TableCell className="w-[47px] min-w-[47px] max-w-[47px] px-3.5 py-2.5">
                                <div className="w-6 h-6 flex items-center justify-center" >
                                  <Checkbox
                                    checked={selectedMessageIds.has(message.id)}
                                    onCheckedChange={(checked) => {
                                      const newSelected = new Set(selectedMessageIds);
                                      if (checked) {
                                        newSelected.add(message.id);
                                      } else {
                                        newSelected.delete(message.id);
                                      }
                                      setSelectedMessageIds(newSelected);
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                    className="h-5 w-5 flex-shrink-0"
                                    
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="w-[40px] min-w-[40px] max-w-[40px] px-3.5 py-2.5 text-center">
                                <div className="flex items-center justify-center">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleStar(message, e);
                                    }}
                                    aria-label={message.isStarred ? "Unstar message" : "Star message"}
                                  >
                                    <Star
                                      className={cn(
                                        "h-4 w-4",
                                        message.isStarred
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-400 hover:text-yellow-400"
                                      )}
                                    />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="px-3.5 py-2.5">
                                <div className="flex items-center gap-2">
                                  {message.hasAttachment ? (
                                    <Paperclip className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--wex-info))]" />
                                  ) : null}
                                  <span
                                    className={`text-sm tracking-[-0.084px] ${
                                      !message.isRead
                                        ? "font-bold text-foreground"
                                        : "font-normal text-foreground"
                                    }`}
                                  >
                                    {message.subject}
                                  </span>
                                  {isMessageAttentionNeeded(message) && (
                                    <div className="flex items-center shrink-0 ml-3 mr-12">
                                      <AlertTriangle className="h-6 w-6 text-[hsl(var(--wex-destructive))]" />
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="px-3.5 py-2.5">
                                <span
                                  className={`text-sm tracking-[-0.084px] whitespace-nowrap ${
                                    !message.isRead
                                      ? "font-bold text-foreground"
                                      : "font-normal text-foreground"
                                  }`}
                                >
                                  {selectedMessage ? message.deliveryDate.split(' ')[0] : message.deliveryDate}
                                </span>
                              </TableCell>
                              <TableCell className="w-[129px] min-w-[129px] max-w-[129px] px-3.5 py-2.5 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4"
                                    >
                                      <MoreVertical className="h-4 w-4 text-foreground" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-[180px] rounded-[6px] border border-border bg-white p-[3.5px] shadow-md"
                                  >
                                    <div className="flex flex-col gap-[2px]">
                                      {selectedCategory !== "archive" && (
                                        <>
                                          {!message.isRead && (
                                            <DropdownMenuItem
                                              onClick={(e) => handleToggleReadStatus(message, e)}
                                              className="flex cursor-pointer items-center gap-[7px] rounded-[4px] px-[10.5px] py-[7px] text-sm text-foreground outline-none hover:bg-gray-50 focus:bg-gray-50"
                                            >
                                              <MailCheck className="h-[14px] w-[14px] shrink-0 text-foreground" />
                                              <span>Mark as read</span>
                                            </DropdownMenuItem>
                                          )}
                                          {message.isRead && (
                                            <DropdownMenuItem
                                              onClick={(e) => handleToggleReadStatus(message, e)}
                                              className="flex cursor-pointer items-center gap-[7px] rounded-[4px] px-[10.5px] py-[7px] text-sm text-foreground outline-none hover:bg-gray-50 focus:bg-gray-50"
                                            >
                                              <MailOpen className="h-[14px] w-[14px] shrink-0 text-foreground" />
                                              <span>Mark as unread</span>
                                            </DropdownMenuItem>
                                          )}
                                          <DropdownMenuItem
                                            onClick={(e) => handleArchive(message, e)}
                                            className="flex cursor-pointer items-center gap-[8px] rounded-[4px] px-[10.5px] py-[7px] text-sm text-foreground outline-none hover:bg-gray-50 focus:bg-gray-50"
                                          >
                                            <Archive className="h-[14px] w-[14px] shrink-0 text-foreground" />
                                            <span>Archive</span>
                                          </DropdownMenuItem>
                                        </>
                                      )}
                                      {selectedCategory === "archive" && (
                                        <DropdownMenuItem
                                          onClick={(e) => handleUnarchive(message, e)}
                                          className="flex cursor-pointer items-center gap-[7px] rounded-[4px] px-[10.5px] py-[7px] text-sm text-foreground outline-none hover:bg-gray-50 focus:bg-gray-50"
                                        >
                                          <Inbox className="h-[14px] w-[14px] shrink-0 text-muted-foreground" />
                                          <span>Move to inbox</span>
                                        </DropdownMenuItem>
                                      )}
                                    </div>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  </>
                )}

                {/* Pagination */}
                {filteredMessages.length > 0 && (
                  <div className="mt-6 flex flex-col items-center gap-3 border-t border-border pt-4 min-[400px]:flex-row min-[400px]:justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) setCurrentPage(currentPage - 1);
                            }}
                          />
                        </PaginationItem>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum: number;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                href="#"
                                isActive={currentPage === pageNum}
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(pageNum);
                                }}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                    <div className="min-[400px]:ml-4">
                      <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => {
                          setItemsPerPage(Number(value));
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="h-[35px] min-w-[70px] w-[70px] border-input shadow-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                    )}
                      </div>
                    </div>
                    {/* Right Panel - Detail View - Desktop Only */}
                    {selectedMessage && !isMobile && (
                      <div className="w-[400px] shrink-0 border-l border-wex-card-border bg-white rounded-br-2xl rounded-tr-2xl flex flex-col h-full">
                        <div className="flex flex-col gap-3 p-6 flex-1">
                          {/* Header with alert icon, subject, and close button */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {isMessageAttentionNeeded(selectedMessage) && (
                                <AlertTriangle className="h-6 w-6 shrink-0 text-[hsl(var(--wex-destructive))]" />
                              )}
                              <h3 className="text-sm font-semibold text-foreground tracking-[-0.084px] leading-6 flex-1 min-w-0">
                                {selectedMessage.subject}
                              </h3>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 shrink-0"
                              onClick={handleCloseDetailPanel}
                              aria-label="Close detail panel"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          
                          {/* Date sent */}
                          <div className="text-sm text-muted-foreground tracking-[-0.084px] leading-6">
                            <span>Date sent: </span>
                            <span className="text-foreground">
                              {selectedMessage.deliveryDate.split(' ')[0]}
                            </span>
                          </div>
                          
                          {/* Attachment */}
                          {selectedMessage.hasAttachment && (
                            <div className="border border-border rounded-md h-[68px] px-4 bg-white flex items-center">
                              <div className="flex items-center gap-4 w-full">
                                <FileText className="h-[22px] w-[22px] text-primary shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-primary tracking-[-0.084px] leading-6 truncate">
                                    {selectedMessage.attachmentFileName || "Attachment.pdf"}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 shrink-0"
                                  aria-label="Download attachment"
                                >
                                  <Download className="h-5 w-5 text-foreground" />
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {/* Divider */}
                          <Separator />
                          
                          {/* Message body */}
                          <div className="text-sm text-foreground tracking-[-0.084px] leading-6">
                            {selectedMessage.body || "Please see attachment."}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </SidebarInset>
              </div>
            </Card>
          </SidebarProvider>
        </div>
      </div>
      </FadeInItem>

      <ConsumerFooter />

      {/* Message Detail Modal - Mobile Only */}
      {isMobile && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent 
            position="bottom"
            className="min-[400px]:hidden w-[375px] max-w-[375px] p-6 rounded-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex flex-col flex-1 min-h-0 overflow-y-hidden">
              {/* Header */}
              <div className="space-y-0 mb-0 flex-shrink-0">
                <DialogTitle className="text-base font-semibold text-foreground tracking-[-0.176px] leading-6 mb-0 break-words">
                  {selectedMessage?.subject}
                </DialogTitle>
                <p className="text-sm text-foreground tracking-[-0.084px] leading-6 mt-3 whitespace-nowrap">
                  {selectedMessage?.deliveryDate}
                </p>
                <Separator className="my-3.5" />
              </div>

              {/* Content */}
              <div className="space-y-5 mt-0 flex-1 min-h-0">
                <p className="text-sm text-foreground tracking-[-0.084px] leading-6 break-words">
                  {selectedMessage?.body || "Please see attachment."}
                </p>
                
                {selectedMessage?.hasAttachment && (
                  <div className="border border-border rounded-md h-[68px] px-4 bg-white flex items-center flex-shrink-0">
                    <div className="flex items-center gap-4 w-full min-w-0">
                      <FileText className="h-[22px] w-[22px] text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary tracking-[-0.084px] leading-6 truncate">
                          {selectedMessage.attachmentFileName || "Attachment.pdf"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-[22px] w-[22px] shrink-0"
                        aria-label="Download attachment"
                      >
                        <Download className="h-[22px] w-[22px] text-foreground" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Footer - Close Button */}
                <div className="w-full pt-0 flex-shrink-0">
                  <Button 
                    intent="primary" 
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedMessage(null);
                    }} 
                    className="w-full px-3 py-2"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

