import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  Pagination as PaginationRoot,
  PaginationContent as PaginationContentRoot,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink as PaginationLinkBase,
  PaginationNext as PaginationNextBase,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { type ButtonProps, buttonVariants } from "@/components/ui/button";
import { cn } from "../lib/utils";

/**
 * WexPagination - WEX Design System Pagination Component
 *
 * Navigation for multi-page content.
 * Uses namespace pattern: WexPagination.Content, WexPagination.Item, etc.
 *
 * @example
 * <WexPagination>
 *   <WexPagination.Content>
 *     <WexPagination.Item>
 *       <WexPagination.Previous href="#" />
 *     </WexPagination.Item>
 *     <WexPagination.Item>
 *       <WexPagination.Link href="#">1</WexPagination.Link>
 *     </WexPagination.Item>
 *     <WexPagination.Item>
 *       <WexPagination.Link href="#" isActive>2</WexPagination.Link>
 *     </WexPagination.Item>
 *     <WexPagination.Item>
 *       <WexPagination.Next href="#" />
 *     </WexPagination.Item>
 *   </WexPagination.Content>
 * </WexPagination>
 */

const WexPaginationRoot = React.forwardRef<
  React.ElementRef<typeof PaginationRoot>,
  React.ComponentPropsWithoutRef<typeof PaginationRoot>
>((props, ref) => <PaginationRoot ref={ref} {...props} />);
WexPaginationRoot.displayName = "WexPagination";

const WexPaginationContent = React.forwardRef<
  React.ElementRef<typeof PaginationContentRoot>,
  React.ComponentPropsWithoutRef<typeof PaginationContentRoot>
>(({ className, ...props }, ref) => (
  <PaginationContentRoot
    ref={ref}
    className={cn("wex-pagination-content", className)}
    {...props}
  />
));
WexPaginationContent.displayName = "WexPagination.Content";

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, "size"> &
  React.ComponentProps<"a">;

const WexPaginationLink = ({
  className,
  isActive,
  size = "icon",
  onClick,
  href,
  ...props
}: PaginationLinkProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    } else if (href === "#") {
      e.preventDefault();
    }
  };

  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        isActive && "bg-wex-pagination-active-bg text-wex-pagination-active-fg pointer-events-none",
        className
      )}
      href={href}
      onClick={handleClick}
      {...props}
    />
  );
};
WexPaginationLink.displayName = "WexPagination.Link";

const WexPaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLinkBase>) => (
  <PaginationLinkBase
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="text-wex-pagination-item-fg">Previous</span>
  </PaginationLinkBase>
);
WexPaginationPrevious.displayName = "WexPagination.Previous";

const WexPaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationNextBase>) => (
  <PaginationNextBase
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span className="text-wex-pagination-item-fg">Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationNextBase>
);
WexPaginationNext.displayName = "WexPagination.Next";

const WexPaginationFirst = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLinkBase>) => (
  <PaginationLinkBase
    aria-label="Go to first page"
    size="default"
    className={cn("gap-1 pl-2.5", className)}
    {...props}
  >
    <ChevronsLeft className="h-4 w-4" />
    <span className="text-wex-pagination-item-fg">First</span>
  </PaginationLinkBase>
);
WexPaginationFirst.displayName = "WexPagination.First";

const WexPaginationLast = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLinkBase>) => (
  <PaginationLinkBase
    aria-label="Go to last page"
    size="default"
    className={cn("gap-1 pr-2.5", className)}
    {...props}
  >
    <span className="text-wex-pagination-item-fg">Last</span>
    <ChevronsRight className="h-4 w-4" />
  </PaginationLinkBase>
);
WexPaginationLast.displayName = "WexPagination.Last";

interface RowsPerPageProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  className?: string;
}

const WexRowsPerPage = ({
  value,
  onChange,
  options = [10, 20, 30, 50, 100],
  className,
}: RowsPerPageProps) => (
  <div className={cn("flex items-center gap-2", className)}>
    <span className="text-sm text-wex-pagination-item-fg whitespace-nowrap">Rows per page</span>
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className="h-8 w-[70px]" aria-label="Rows per page">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={String(option)}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
WexRowsPerPage.displayName = "WexPagination.RowsPerPage";

interface PageReportProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  className?: string;
  /** Format: "{first}" for first item, "{last}" for last item, "{total}" for total items, "{page}" for current page, "{pages}" for total pages */
  template?: string;
}

const WexPageReport = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  className,
  template = "{first} - {last} of {total}",
}: PageReportProps) => {
  const first = (currentPage - 1) * pageSize + 1;
  const last = Math.min(currentPage * pageSize, totalItems);

  const text = template
    .replace("{first}", String(first))
    .replace("{last}", String(last))
    .replace("{total}", String(totalItems))
    .replace("{page}", String(currentPage))
    .replace("{pages}", String(totalPages));

  return (
    <span className={cn("text-sm text-wex-pagination-item-fg", className)}>
      {text}
    </span>
  );
};
WexPageReport.displayName = "WexPagination.PageReport";

interface JumpToPageProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const WexJumpToPage = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: JumpToPageProps) => {
  const [pageInput, setPageInput] = React.useState(String(currentPage));

  React.useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const validateAndSubmit = () => {
    const page = parseInt(pageInput, 10);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      // Reset to current page if invalid
      setPageInput(String(currentPage));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateAndSubmit();
  };

  const handleBlur = () => {
    validateAndSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-wex-pagination-item-fg">Go to page</span>
      <Input
        type="number"
        min={1}
        max={totalPages}
        value={pageInput}
        onChange={(e) => setPageInput(e.target.value)}
        onBlur={handleBlur}
        className="h-8 w-16"
        aria-label="Page number"
      />
      <span className="text-sm text-wex-pagination-item-fg">of {totalPages}</span>
    </form>
  );
};
WexJumpToPage.displayName = "WexPagination.JumpToPage";

export const WexPagination = Object.assign(WexPaginationRoot, {
  Content: WexPaginationContent,
  Ellipsis: PaginationEllipsis,
  Item: PaginationItem,
  Link: WexPaginationLink,
  Next: WexPaginationNext,
  Previous: WexPaginationPrevious,
  First: WexPaginationFirst,
  Last: WexPaginationLast,
  RowsPerPage: WexRowsPerPage,
  PageReport: WexPageReport,
  JumpToPage: WexJumpToPage,
});
