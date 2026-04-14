import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const PAGE_COUNT = 2;

const documentationImages = [
  `${import.meta.env.BASE_URL}reimburse-docs/documentation-page-1.png`,
  `${import.meta.env.BASE_URL}reimburse-docs/documentation-page-2.png`,
];

interface ReimburseDocumentationHelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReimburseDocumentationHelpDialog({
  open,
  onOpenChange,
}: ReimburseDocumentationHelpDialogProps) {
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    if (open) setPageIndex(0);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[min(640px,calc(100vw-32px))] w-full p-0 gap-0 rounded-2xl overflow-hidden [&>div:last-child]:hidden"
      >
        <DialogDescription className="sr-only">
          Two-page guide showing what documentation is needed for reimbursement claims, with examples of
          acceptable receipts and explanation of benefits.
        </DialogDescription>
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-1">
          <div className="min-w-0">
            <DialogTitle className="text-lg font-semibold text-[#243746] tracking-tight text-left">
              What documents work best?
            </DialogTitle>
            <p className="text-sm text-[#7c858e] mt-1" aria-live="polite">
              Page {pageIndex + 1} of {PAGE_COUNT}
            </p>
          </div>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-[#515f6b] hover:text-[#1d2c38]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>

        <div className="px-6 pb-4">
          <div className="rounded-lg border border-[#e4e6e9] bg-[#f7f7f7] overflow-hidden max-h-[min(520px,55vh)] overflow-y-auto">
            <img
              src={documentationImages[pageIndex]}
              alt={
                pageIndex === 0
                  ? "Documentation guide page 1: required claim information and itemized receipt example"
                  : "Documentation guide page 2: prescription receipt, EOB example, and unacceptable documentation"
              }
              className="w-full h-auto block"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-[#e4e6e9] px-6 py-4 bg-white">
          <Button
            type="button"
            intent="secondary"
            variant="outline"
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            className="gap-1.5 text-[#515f6b] border-[#e4e6e9] disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4 text-current" />
            Previous
          </Button>

          <div className="flex items-center gap-2" aria-label="Page indicators">
            {Array.from({ length: PAGE_COUNT }, (_, i) => (
              <span
                key={i}
                role="presentation"
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === pageIndex ? "bg-[#243746]" : "bg-[#e4e6e9]"
                }`}
              />
            ))}
          </div>

          <Button
            type="button"
            intent="secondary"
            variant="outline"
            disabled={pageIndex >= PAGE_COUNT - 1}
            onClick={() => setPageIndex((p) => Math.min(PAGE_COUNT - 1, p + 1))}
            className="gap-1.5 border-[#3958c3] text-[#3958c3] hover:bg-[#3958c3]/5 disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4 text-current" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
