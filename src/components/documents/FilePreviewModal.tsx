import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@wexinc-healthbenefits/ben-ui-kit"

import { Check, ClipboardList, Download, FileText, Info, MoreVertical, Pencil, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DocStatus, DocumentItem } from "./documentData"

function StatusBadge({ status, className }: { status: DocStatus; className?: string }) {
  if (status === "attached") {
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-full bg-[#dcfce7] px-[7px] py-[3.5px] text-[12px] font-bold text-[#008375]", className)}>
        <Check className="h-[10.5px] w-[10.5px] shrink-0 text-current" aria-hidden />
        Attached
      </span>
    )
  }
  return (
    <span className={cn("inline-flex items-center rounded-full bg-[#f7f7f7] px-[7px] py-[3.5px] text-[12px] font-bold text-[#515f6b]", className)}>
      Unattached
    </span>
  )
}

interface Props {
  doc: DocumentItem | null
  onClose: () => void
}

export function FilePreviewModal({ doc, onClose }: Props) {
  return (
    <Dialog open={doc !== null} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="flex w-full max-w-4xl flex-col gap-0 rounded-xl border-[#edeff0] bg-background p-0 shadow-[0px_20px_25px_0px_rgba(0,0,0,0.1),0px_8px_10px_0px_rgba(0,0,0,0.1)] [&>div:last-child]:hidden overflow-hidden">
        {doc && (
          <>
            {/* Header — sticky so it stays visible when the preview overflows */}
            <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-border bg-background px-6 py-4">
              <div className="space-y-1">
                <DialogTitle className="m-0 text-lg font-semibold text-foreground">
                  {doc.title}
                </DialogTitle>
                <div className="flex items-center gap-3">
                  <p className="text-xs text-muted-foreground">{doc.date} — 3mb</p>
                  <StatusBadge status={doc.status} />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-[35px] w-[35px] shrink-0 border-0 bg-transparent shadow-none hover:bg-muted"
                      aria-label="More options"
                    >
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {doc.status === "attached" ? (
                      <DropdownMenuItem className="gap-2">
                        <ClipboardList className="h-4 w-4 shrink-0 text-muted-foreground" />
                        Edit Claim
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="gap-2">
                        <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                        File Claim
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2">
                      <Download className="h-4 w-4 shrink-0 text-muted-foreground" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Pencil className="h-4 w-4 shrink-0 text-muted-foreground" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2">
                      <Info className="h-4 w-4 shrink-0 text-muted-foreground" />
                      See Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                      <Trash2 className="h-4 w-4 shrink-0 text-current" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-[35px] w-[35px] shrink-0 border-0 bg-transparent shadow-none hover:bg-muted"
                    aria-label="Close preview"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DialogClose>
              </div>
            </div>

            {/* Body — scrollable so tall previews don't clip */}
            <div className="flex overflow-y-auto items-center justify-center bg-[#f5f5f5] p-8">
              <div className="flex min-h-[520px] w-full items-center justify-center rounded-xl bg-[#d9d9d9] overflow-hidden">
                {doc.imageUrl ? (
                  <img
                    src={doc.imageUrl}
                    alt={doc.title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <p className="text-sm text-[#7c858e]">Preview not available</p>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
