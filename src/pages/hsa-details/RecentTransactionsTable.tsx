import { useState, useMemo } from "react";
import { Card, CardContent } from "@wexinc-healthbenefits/ben-ui-kit";
import { Input } from "@wexinc-healthbenefits/ben-ui-kit";
import { Badge } from "@wexinc-healthbenefits/ben-ui-kit";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@wexinc-healthbenefits/ben-ui-kit";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@wexinc-healthbenefits/ben-ui-kit";
import { Search, ArrowDown } from "lucide-react";
import { transactionsData, type Transaction } from "./mockData";
import { TransactionDetailSheet } from "./TransactionDetailSheet";

/**
 * Recent Transactions Table Component
 * 
 * Data table with:
 * - Search input
 * - Sortable table headers
 * - Status badges (Pending=warning, Complete=success)
 * - Amount formatting (green for positive)
 * - Pagination controls
 * - Click to open transaction detail sheet
 */
export function RecentTransactionsTable() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsSheetOpen(true);
  };

  // Filter transactions based on search query
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactionsData;
    
    const query = searchQuery.toLowerCase();
    return transactionsData.filter((transaction) => {
      return (
        transaction.date.toLowerCase().includes(query) ||
        transaction.status.toLowerCase().includes(query) ||
        transaction.account.toLowerCase().includes(query) ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query) ||
        transaction.amount.toLowerCase().includes(query) ||
        (transaction.subtext?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [searchQuery]);

  // Pagination calculations
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">
                Recent Transactions
              </h2>
              <div className="w-[332px]">
                <Input
                  inputSize="md"
                  type="text"
                  placeholder="Search"
                  leftIcon={<Search className="h-4 w-4 text-current" />}
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Date
                        <ArrowDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.map((transaction) => (
                    <TransactionRow 
                      key={transaction.id} 
                      transaction={transaction}
                      onClick={() => handleRowClick(transaction)}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page</span>
                <select
                  value={rowsPerPage}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                >
                  {[10, 25, 50].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault();
                        setCurrentPage(1);
                      }}
                      aria-disabled={currentPage <= 1}
                    >
                      First
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
                      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                        e.preventDefault();
                        setCurrentPage(totalPages);
                      }}
                      aria-disabled={currentPage >= totalPages}
                    >
                      Last
                    </PaginationLink>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages || 1} ({totalItems} items)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Detail Sheet */}
      <TransactionDetailSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        transaction={selectedTransaction}
      />
    </>
  );
}

/**
 * Transaction Row Component
 */
function TransactionRow({ 
  transaction, 
  onClick 
}: { 
  transaction: Transaction;
  onClick: () => void;
}) {
  return (
    <TableRow
      className="cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent<HTMLTableRowElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <TableCell>{transaction.date}</TableCell>
      <TableCell>
        <Badge
          intent={transaction.status === "Pending" ? "warning" : "success"}
          className="text-xs"
        >
          {transaction.status}
        </Badge>
      </TableCell>
      <TableCell>{transaction.account}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span>{transaction.description}</span>
          {transaction.subtext && (
            <span className="text-xs text-muted-foreground">{transaction.subtext}</span>
          )}
        </div>
      </TableCell>
      <TableCell>{transaction.category}</TableCell>
      <TableCell className={`text-right ${transaction.isPositive ? "text-success" : ""}`}>
        {transaction.amount}
      </TableCell>
    </TableRow>
  );
}
