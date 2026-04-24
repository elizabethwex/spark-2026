import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@wexinc-healthbenefits/ben-ui-kit";
import {
  ArrowDownUp,
  Banknote,
  CalendarDays,
  CircleCheck,
  CircleDollarSign,
  CircleX,
  Clock,
  DollarSign,
  Download,
  Info,
  Landmark,
  ReceiptText,
  Search,
  WalletCards,
  ChevronsLeft,
  ChevronsRight,
  UserRound,
} from "lucide-react";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { ConsumerFooter } from "@/components/layout/Footer";
import { FadeInItem } from "@/components/layout/PageFadeIn";
import {
  expenseStatusBadgeClass,
  expenseStatusBadgeIntent,
  transactionTableStatusTone,
} from "@/components/claims/expenseTypes";
import { HsaStorePromoBanner } from "@/components/sections/HsaStorePromoBanner";
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground";
import { usePrototype } from "@/context/PrototypeContext";
import { useReimburseWorkspace } from "@/context/ReimburseWorkspaceContext";
import { cn, homepageAccountSurfaceClass } from "@/lib/utils";
import { ClaimExpenseDetailSheet } from "@/components/claims/ClaimExpenseDetailSheet";
import { FsaPreviousPlanYearCard } from "@/pages/fsa-account/FsaPreviousPlanYearCard";
import { FsaPreviousPlanYearDetailSheet } from "@/pages/fsa-account/FsaPreviousPlanYearDetailSheet";
import { FsaPreviousPlanYearPlanRulesSheet } from "@/pages/fsa-account/FsaPreviousPlanYearPlanRulesSheet";
import { dcfsaPreviousPlanYearPlanRulesViewModel } from "@/pages/fsa-account/fsaPreviousPlanYearPlanRulesViewModel";
import { dcfsaPreviousPlanYearViewModel } from "@/pages/fsa-account/fsaPreviousPlanYearViewModel";
import { fsaTransactionToExpenseRow } from "@/pages/fsa-account/fsaTransactionToExpenseRow";
import type { FsaTransactionRow } from "@/pages/fsa-account/fsaTransactionsMock";
import { dcfsaTransactionsData } from "./dcfsaTransactionsMock";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const ELEV_SHADOW =
  "shadow-[0px_3.017px_9.051px_0px_rgba(43,49,78,0.04),0px_6.034px_18.101px_0px_rgba(43,49,78,0.06)]";

function SectionCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/60 bg-white p-6 text-[#14182c]",
        ELEV_SHADOW,
        className
      )}
    >
      {children}
    </div>
  );
}

function InfoTip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex text-[#5f6a94] hover:text-[#14182c] focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={label}
        >
          <Info className="h-4 w-4" aria-hidden />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-[280px] text-left text-sm">
        {children}
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * Dependent Care FSA dashboard at `/dependent-care-fsa`
 * (Consumer Experience Redesign — Figma node 33707:18533).
 */
export default function DcfsaAccountPage() {
  const { homepageMode } = usePrototype();
  const cardSurface = homepageAccountSurfaceClass(homepageMode === "partner-safe");
  const { openReimburseWorkspace } = useReimburseWorkspace();

  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  /** Animates usage bar from 0 → 100% on first paint (election fully used; $0 available). */
  const [usageBarPct, setUsageBarPct] = useState(0);
  const [selectedFsaTx, setSelectedFsaTx] = useState<FsaTransactionRow | null>(null);
  /** Previous Plan Year “View more details” slideout (Figma 29641:15455). */
  const [previousPlanYearDetailOpen, setPreviousPlanYearDetailOpen] = useState(false);
  const [previousPlanYearPlanRulesOpen, setPreviousPlanYearPlanRulesOpen] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      queueMicrotask(() => setUsageBarPct(100));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = requestAnimationFrame(() => setUsageBarPct(100));
    return () => cancelAnimationFrame(id);
  }, []);

  const filtered = useMemo(() => {
    let rows = dcfsaTransactionsData;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(
        (t) =>
          t.date.toLowerCase().includes(q) ||
          t.status.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.planYear.toLowerCase().includes(q) ||
          t.amount.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const start = (currentPage - 1) * rowsPerPage;
  const pageRows = filtered.slice(start, start + rowsPerPage);

  return (
    <div className="min-h-screen" style={consumerPageBackgroundStyle}>
      <ConsumerNavigation />

      <FadeInItem>
        <main className="mx-auto w-full max-w-[1440px] space-y-6 px-8 py-7">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Dependent Care FSA
          </h1>

          <div
            className={cn(
              "rounded-2xl border border-white/60 bg-white p-6",
              ELEV_SHADOW,
              cardSurface
            )}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
              <div className="min-w-0 flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--app-secondary-50)] text-[var(--theme-secondary)]">
                    <Landmark className="h-5 w-5 text-[var(--theme-secondary)]" aria-hidden />
                  </div>
                  <h2 className="text-[20px] font-bold leading-8 text-[#14182c] md:text-2xl">
                    Account Overview
                  </h2>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-[#5f6a94]">
                    <span className="text-base font-semibold">Available Balance</span>
                    <InfoTip label="About available balance">
                      Your available balance reflects the funds available for payment requests made at
                      this time.
                    </InfoTip>
                  </div>
                  <p className="mt-1 text-[40px] font-bold leading-[56px] tracking-tight text-[#14182c]">
                    <AnimatedNumber value={0} format={fmt} durationMs={1200} />
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative h-5 min-w-[200px] flex-1 overflow-hidden rounded-full bg-[#edeff0]">
                    <div
                      className="absolute left-0 top-0 h-full rounded-l-full bg-[#3958c3] transition-[width] duration-[1100ms] ease-out motion-reduce:transition-none"
                      style={{ width: `${usageBarPct}%` }}
                    />
                    <div
                      className="absolute top-0 h-full w-px bg-[#a0dcf8] transition-[left] duration-[1100ms] ease-out motion-reduce:transition-none"
                      style={{ left: `${usageBarPct}%` }}
                    />
                  </div>
                  <Badge
                    intent="secondary"
                    className="shrink-0 rounded-2xl bg-[#f7f7f7] px-2 py-1 text-xs font-bold text-[#515f6b]"
                  >
                    100% of $5,000 used
                  </Badge>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-[0px_0px_1px_0px_rgba(18,24,29,0.2),0px_1px_3px_0px_rgba(18,24,29,0.1),0px_1px_2px_0px_rgba(18,24,29,0.06)]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4 text-base">
                      <div className="flex min-w-0 items-center gap-3">
                        <CalendarDays className="h-4 w-4 shrink-0 text-[var(--theme-secondary)]" aria-hidden />
                        <span className="font-medium text-[#5f6a94]">Plan Year</span>
                      </div>
                      <span className="shrink-0 font-semibold text-[#14182c]">
                        Jan 1, 2026 – Dec 31, 2026
                      </span>
                    </div>
                    <div className="h-px w-full bg-[#b7c0da]" />
                    <div className="flex items-center justify-between gap-4 text-base">
                      <div className="flex min-w-0 items-center gap-3">
                        <CircleDollarSign className="h-4 w-4 shrink-0 text-[var(--theme-secondary)]" aria-hidden />
                        <span className="font-medium text-[#5f6a94]">Eligible Amount</span>
                      </div>
                      <span className="shrink-0 font-semibold text-[#14182c]">$5,000.00</span>
                    </div>
                    <div className="h-px w-full bg-[#b7c0da]" />
                    <div className="flex items-center justify-between gap-4 text-base">
                      <div className="flex min-w-0 items-center gap-2">
                        <DollarSign className="h-4 w-4 shrink-0 text-[var(--theme-secondary)]" aria-hidden />
                        <span className="font-medium text-[#5f6a94]">Plan Year Balance</span>
                        <InfoTip label="About plan year balance">
                          Your plan year balance reflects the total funds currently available for
                          payment based on your contributions to date.
                        </InfoTip>
                      </div>
                      <span className="shrink-0 font-semibold text-[#14182c]">$1,153.86</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 text-sm">
                  <span className="text-[#5f6a94]">Use It or Lose It</span>
                  <span className="font-semibold text-[#14182c]">$0.00</span>
                </div>

                <Button
                  type="button"
                  className="h-10 w-full bg-[#3958c3] font-medium text-white hover:bg-[#3958c3]/90"
                  onClick={() => openReimburseWorkspace()}
                >
                  Reimburse Myself
                </Button>
              </div>

              <div className="min-w-0 flex-1 rounded-lg bg-[#f1f3fb] p-6 shadow-[0px_0px_1px_0px_rgba(18,24,29,0.2),0px_1px_3px_0px_rgba(18,24,29,0.1),0px_1px_2px_0px_rgba(18,24,29,0.06)] lg:mt-14">
                <div className="space-y-1">
                  <p className="text-2xl font-bold tracking-tight text-[#14182c]">No funds available now</p>
                  <div className="text-sm leading-6 text-[#5f6a94]">
                    <p>You can still submit expenses now and get reimbursed once funds are available.</p>
                    <p className="mt-1">
                      Use your funds for eligible services through{" "}
                      <strong className="font-bold text-[#14182c]">Dec 31, 2026</strong>
                    </p>
                    <p className="mt-1">
                      Submit claims by <strong className="font-bold text-[#14182c]">Mar 31, 2027</strong>
                    </p>
                  </div>
                </div>

                <div className="my-6 h-px w-full bg-[#b7c0da]" />

                <div className="space-y-4">
                  <h3 className="text-[19px] font-semibold leading-8 text-[#14182c]">
                    Get ready to use your Dependent Care FSA
                  </h3>
                  <div className="flex flex-col gap-6 rounded-3xl border border-[#f8f9fe] bg-[#f8f9fe] p-[17px]">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
                        <ReceiptText className="h-6 w-6 text-[var(--theme-secondary)]" aria-hidden />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <p className="text-sm font-bold text-[#14182c]">Request a Dependent Care Reimbursement</p>
                        <p className="text-xs font-medium leading-5 text-[#5f6a94]">
                          Submit receipts for Dependent Care expenses you&apos;ve already paid.
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 w-full rounded-xl border-primary text-primary hover:bg-primary/10"
                      onClick={() => openReimburseWorkspace()}
                    >
                      Upload a Receipt
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionCard>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--app-secondary-50)] text-[var(--theme-secondary)]">
                    <ReceiptText className="h-5 w-5 text-[var(--theme-secondary)]" aria-hidden />
                  </div>
                  <h2 className="text-[20px] font-bold leading-8 text-[#14182c] md:text-2xl">
                    Claim Summary
                  </h2>
                </div>
                <div>
                  <p className="text-sm text-[#5f6a94]">Paid to Date</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-[#14182c]">$1,153.86</p>
                </div>
                <DcClaimRows />
              </div>
            </SectionCard>

            <SectionCard>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--app-secondary-50)] text-[var(--theme-secondary)]">
                    <WalletCards className="h-5 w-5 text-[var(--theme-secondary)]" aria-hidden />
                  </div>
                  <h2 className="text-[20px] font-bold leading-8 text-[#14182c] md:text-2xl">
                    Elections
                  </h2>
                </div>
                <div>
                  <p className="text-sm text-[#5f6a94]">Annual Election</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-[#14182c]">$5,000.00</p>
                </div>
                <DcElectionRows />
              </div>
            </SectionCard>
          </div>

          <Card className={cn(cardSurface, "rounded-2xl")} style={{ borderRadius: "16px" }}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  <h2 className="text-2xl font-semibold text-[#14182c]">Transactions</h2>
                </div>
                <div className="flex w-full flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center lg:w-auto">
                  <div className="w-full min-w-[200px] sm:w-[330px]">
                    <Input
                      inputSize="md"
                      type="search"
                      placeholder="Search"
                      leftIcon={<Search className="h-4 w-4" />}
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="md"
                    type="button"
                    className="shrink-0 text-[#5f6a94] hover:text-[#14182c]"
                  >
                    <Download className="mr-2 h-4 w-4" aria-hidden />
                    Export
                  </Button>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-y border-border bg-muted/30">
                      <TableHead className="min-w-0 w-[16%]">
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          Date
                          <ArrowDownUp className="h-3 w-3 opacity-70" aria-hidden />
                        </div>
                      </TableHead>
                      <TableHead className="min-w-0 w-[16%]">Status</TableHead>
                      <TableHead className="min-w-0 w-[21%]">Description</TableHead>
                      <TableHead className="min-w-0 w-[20%]">
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          Plan Year
                          <ArrowDownUp className="h-3 w-3 opacity-70" aria-hidden />
                        </div>
                      </TableHead>
                      <TableHead className="min-w-0 w-[12%] text-left">
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          Amount
                          <ArrowDownUp className="h-3 w-3 opacity-70" aria-hidden />
                        </div>
                      </TableHead>
                      <TableHead className="min-w-0 w-[15%] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((t) => (
                      <FsaTransactionTableRow key={t.id} row={t} onRowClick={setSelectedFsaTx} />
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mx-auto mt-6 flex w-fit flex-col gap-0 sm:flex-row sm:items-center sm:justify-start sm:gap-0">
                <Pagination className="flex w-fit items-center justify-start">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        className="gap-0 px-2"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          setCurrentPage(1);
                        }}
                        aria-disabled={currentPage <= 1}
                      >
                        <ChevronsLeft className="h-4 w-4 text-current" />
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          setCurrentPage((p) => Math.max(1, p - 1));
                        }}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === pageNum}
                            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
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
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          setCurrentPage((p) => Math.min(totalPages, p + 1));
                        }}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        className="gap-0 px-2"
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                          e.preventDefault();
                          setCurrentPage(totalPages);
                        }}
                        aria-disabled={currentPage >= totalPages}
                      >
                        <ChevronsRight className="h-4 w-4 text-current" />
                      </PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                <div className="flex shrink-0 items-center">
                  <Select
                    value={String(rowsPerPage)}
                    onValueChange={(value) => {
                      setRowsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger
                      className="h-8 w-[64px] gap-0"
                      aria-label="Select rows per page"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
            <SectionCard className="flex h-full min-h-0 flex-col">
              <h2 id="plan-rules" className="scroll-mt-24 text-[20px] font-bold leading-8 text-[#14182c]">
                Plan Rules
              </h2>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-[20px] font-semibold leading-8 text-[#14182c]">
                    Claim Deadlines
                  </h3>
                  <div className="mt-4 rounded-xl bg-[#f8f9fe] p-4">
                    <div className="flex gap-3">
                      <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#5f6a94]" aria-hidden />
                      <p className="text-sm font-medium leading-5 text-[#5f6a94]">
                        Submit claims by <strong className="font-bold text-[#14182c]">Mar 31, 2027.</strong>{" "}
                        Based on your <strong className="font-bold text-[#14182c]">Active</strong> employment
                        status, only care services received on or before{" "}
                        <strong className="font-bold text-[#14182c]">Dec 31, 2026</strong> are eligible for
                        reimbursement.
                      </p>
                    </div>
                  </div>
                  <DcPlanDeadlineRows />
                </div>
                <div>
                  <h3 className="text-[20px] font-semibold leading-8 text-[#14182c]">
                    Card Rules
                  </h3>
                  <div className="mt-4 space-y-0">
                    <div className="flex items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
                      <span className="text-[#5f6a94]">Card Transactions</span>
                      <span className="font-medium text-[#14182c]">Allowed</span>
                    </div>
                    <div className="flex items-center justify-between py-3 text-sm">
                      <span className="text-[#5f6a94]">Maximum per Transaction</span>
                      <span className="font-medium text-[#14182c]">No maximum</span>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard className="flex h-full min-h-0 flex-col">
              <FsaPreviousPlanYearCard
                fundTypePhrase="dependent FSA funds"
                viewModel={dcfsaPreviousPlanYearViewModel}
                onOpenMoreDetails={() => setPreviousPlanYearDetailOpen(true)}
                onOpenPlanRules={() => setPreviousPlanYearPlanRulesOpen(true)}
              />
            </SectionCard>
          </div>

          <HsaStorePromoBanner />
        </main>
      </FadeInItem>

      <ConsumerFooter />

      <ClaimExpenseDetailSheet
        key={selectedFsaTx?.id ?? "closed"}
        open={selectedFsaTx !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedFsaTx(null);
        }}
        row={
          selectedFsaTx
            ? fsaTransactionToExpenseRow(selectedFsaTx, {
                accountAndCategoryLabel: "Dependent Care FSA",
              })
            : null
        }
        variant="fsa"
      />

      <FsaPreviousPlanYearDetailSheet
        open={previousPlanYearDetailOpen}
        onOpenChange={setPreviousPlanYearDetailOpen}
        viewModel={dcfsaPreviousPlanYearViewModel}
        planHeading="Dependent Care FSA"
        sheetAriaTitle="Dependent care flexible spending account plan details"
      />

      <FsaPreviousPlanYearPlanRulesSheet
        open={previousPlanYearPlanRulesOpen}
        onOpenChange={setPreviousPlanYearPlanRulesOpen}
        planRules={dcfsaPreviousPlanYearPlanRulesViewModel}
        sheetAriaTitle="Dependent Care FSA plan rules for the previous plan year"
      />
    </div>
  );
}

function DcClaimRows() {
  return (
    <div className="space-y-0">
      <div className="relative flex items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
        <div className="flex items-center gap-2">
          <CircleCheck className="h-4 w-4 shrink-0 text-[#5f6a94]" aria-hidden />
          <span className="text-[#5f6a94]">Total Submitted</span>
        </div>
        <span className="font-medium text-[#14182c]">$1,153.86</span>
      </div>
      <div className="relative flex items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-[#5f6a94]" aria-hidden />
          <span className="text-[#5f6a94]">Total Pending</span>
        </div>
        <span className="font-medium text-[#14182c]">$0.00</span>
      </div>
      <div className="relative flex items-center justify-between py-3 text-sm">
        <div className="flex items-center gap-2">
          <CircleX className="h-4 w-4 shrink-0 text-[#5f6a94]" aria-hidden />
          <span className="text-[#5f6a94]">Total Denied</span>
        </div>
        <span className="font-medium text-[#14182c]">$0.00</span>
      </div>
    </div>
  );
}

function DcElectionRows() {
  return (
    <div className="space-y-0">
      <div className="relative flex items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
        <div className="flex items-center gap-2">
          <UserRound className="h-4 w-4 shrink-0 text-[#5f6a94]" aria-hidden />
          <span className="text-[#5f6a94]">My Contribution to Date</span>
        </div>
        <span className="font-medium text-[#14182c]">$1,153.86</span>
      </div>
      <div className="relative flex items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
        <div className="flex items-center gap-2">
          <Banknote className="h-4 w-4 shrink-0 text-[#5f6a94]" aria-hidden />
          <span className="text-[#5f6a94]">Estimated Payroll Deduction</span>
        </div>
        <span className="font-medium text-[#14182c]">$192.31</span>
      </div>
      <div className="relative flex items-center justify-between py-3 text-sm">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 shrink-0 text-[#5f6a94]" aria-hidden />
          <span className="text-[#5f6a94]">Effective Date</span>
        </div>
        <span className="font-medium text-[#14182c]">01/01/2026</span>
      </div>
    </div>
  );
}

function DcPlanDeadlineRows() {
  return (
    <div className="mt-4 space-y-0">
      <div className="flex flex-wrap items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
        <div className="flex min-w-0 flex-1 items-center gap-2 text-[#5f6a94]">
          <span>Enrollment Status</span>
          <InfoTip label="About Enrollment Status">
            Enrollment Status reflects your current participation in this Dependent Care FSA plan.
          </InfoTip>
        </div>
        <Badge
          intent="success"
          className="w-max max-w-none shrink-0 justify-center rounded-md bg-[#ecfdf5] px-2 py-1 text-xs font-bold text-[#002c22]"
        >
          <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap">
            <CircleCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Active
          </span>
        </Badge>
      </div>
      <div className="flex items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
        <div className="flex items-center gap-2 text-[#5f6a94]">
          <span>Status Effective Date</span>
          <InfoTip label="About Status Effective Date">
            Status Effective Date is the date your current active status began with your employer.
          </InfoTip>
        </div>
        <span className="font-medium text-[#14182c]">10/15/2024</span>
      </div>
      <div className="flex items-center justify-between border-b border-[#b7c0da] py-3 text-sm">
        <div className="flex items-center gap-2 text-[#5f6a94]">
          <span>Final Filing Date</span>
          <InfoTip label="About Final Filing Date">
            Final Filing Date is the last day that you may submit your claim for reimbursement from the plan.
          </InfoTip>
        </div>
        <span className="font-medium text-[#14182c]">03/31/2027</span>
      </div>
      <div className="flex items-center justify-between py-3 text-sm">
        <div className="flex items-center gap-2 text-[#5f6a94]">
          <span>Final Service Date</span>
          <InfoTip label="About Final Service Date">
            Final Service Date is the last day that you may incur a service or purchase a product for reimbursement from
            the plan.
          </InfoTip>
        </div>
        <span className="font-medium text-[#14182c]">12/31/2026</span>
      </div>
    </div>
  );
}

function FsaTransactionTableRow({
  row,
  onRowClick,
}: {
  row: FsaTransactionRow;
  onRowClick: (_row: FsaTransactionRow) => void;
}) {
  const { openReimburseWorkspace } = useReimburseWorkspace();

  const tone = transactionTableStatusTone(row.status);
  const statusCell = (
    <Badge
      intent={expenseStatusBadgeIntent(tone)}
      size="sm"
      pill
      className={cn("max-w-full", expenseStatusBadgeClass(tone))}
    >
      {row.status}
    </Badge>
  );

  return (
    <TableRow
      className="h-[49px] cursor-pointer hover:bg-muted/40"
      role="button"
      tabIndex={0}
      aria-label={`View transaction details, ${row.description}, ${row.date}`}
      onClick={() => onRowClick(row)}
      onKeyDown={(e: React.KeyboardEvent<HTMLTableRowElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onRowClick(row);
        }
      }}
    >
      <TableCell className="min-w-0 w-[16%] whitespace-nowrap">{row.date}</TableCell>
      <TableCell className="min-w-0 w-[16%]">{statusCell}</TableCell>
      <TableCell className="min-w-0 w-[21%]">{row.description}</TableCell>
      <TableCell className="min-w-0 w-[20%] whitespace-nowrap text-sm">{row.planYear}</TableCell>
      <TableCell className="min-w-0 w-[12%] text-left text-sm font-semibold tabular-nums text-[#14182c]">
        {row.amount}
      </TableCell>
      <TableCell className="min-w-0 w-[15%] text-right text-sm">
        {row.action === "upload_receipt" ? (
          <button
            type="button"
            className="font-medium text-neutral-700 underline-offset-2 hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-primary"
            onClick={(e) => {
              e.stopPropagation();
              openReimburseWorkspace();
            }}
          >
            Upload Receipt
          </button>
        ) : (
          <span className="text-muted-foreground" aria-label="No action">
            -
          </span>
        )}
      </TableCell>
    </TableRow>
  );
}
