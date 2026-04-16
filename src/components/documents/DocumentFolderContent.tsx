import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@wexinc-healthbenefits/ben-ui-kit"
import {
  ArrowLeft,
  Check,
  ClipboardList,
  Download,
  FileText,
  FolderOpen,
  Info,
  LayoutGrid,
  List,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DOCUMENTS, FOLDERS, type DocStatus, type DocumentItem } from "./documentData"
import { useDocumentViewMode } from "./DocumentViewContext"
import { FilePreviewModal } from "./FilePreviewModal"

interface Props {
  folderId: string
}

export function DocumentFolderContent({ folderId }: Props) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const { viewMode, setViewMode } = useDocumentViewMode()
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null)

  const folder = FOLDERS.find((f) => f.id === folderId)
  const folderDocs = DOCUMENTS.filter((d) => d.folderId === folderId)

  const filtered = folderDocs.filter((doc) => {
    const matchesSearch =
      !search.trim() || doc.title.toLowerCase().includes(search.trim().toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "attached" && doc.status === "attached") ||
      (statusFilter === "unattached" && doc.status === "unattached")
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "eob" && doc.title === "EOB") ||
      (typeFilter === "receipt" && doc.title !== "EOB")
    return matchesSearch && matchesStatus && matchesType
  })

  if (!folder) {
    return (
      <div className="mx-auto w-full max-w-[1376px] py-12 text-center">
        <p className="text-muted-foreground">Folder not found.</p>
        <Link to="/document-org" className="mt-4 inline-block text-sm text-primary underline">
          Back to Document Organizer
        </Link>
      </div>
    )
  }

  return (
    <TooltipProvider>
    <div className="mx-auto w-full max-w-[1376px] space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/document-org"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wex-input-focus-ring"
            aria-label="Back to Document Organizer"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            Document Organizer
          </Link>
          <span className="text-muted-foreground/40" aria-hidden>/</span>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-6 w-6 shrink-0 text-amber-500" aria-hidden />
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {folder.name}
            </h1>
          </div>
        </div>
        <Button type="button" intent="primary" size="md" className="gap-2">
          <Plus className="h-4 w-4 shrink-0 text-white" aria-hidden />
          Upload
        </Button>
      </div>

      {/* Main card */}
      <Card
        variant="outlined"
        className="flex w-full flex-col overflow-hidden rounded-[24px] border border-white/60 bg-white text-foreground shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
        style={{ borderRadius: "24px" }}
      >
        <CardContent className="p-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-10 w-[130px]" aria-label="Filter by type">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="eob">EOB</SelectItem>
                  <SelectItem value="receipt">Receipt</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="h-10 w-[130px]" aria-label="Filter by modified date">
                  <SelectValue placeholder="Modified" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Date</SelectItem>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 w-[130px]" aria-label="Filter by status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="attached">Attached</SelectItem>
                  <SelectItem value="unattached">Unattached</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Input
                inputSize="md"
                type="search"
                placeholder="Find a document..."
                leftIcon={<Search className="h-4 w-4 text-current" />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
                className="w-[220px]"
              />
              <div className="flex self-stretch items-center rounded-md border border-border bg-muted/50 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                  className={cn(
                    "flex h-full items-center justify-center rounded px-2.5 transition-colors",
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                  className={cn(
                    "flex h-full items-center justify-center rounded px-2.5 transition-colors",
                    viewMode === "list"
                      ? "bg-white shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-border" />

          {/* File count */}
          <p className="mt-4 px-1 text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "document" : "documents"}
          </p>

          {/* Documents */}
          <div className="mt-3">
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No documents match your filters.
              </p>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 gap-7 sm:grid-cols-3 lg:grid-cols-4">
                {filtered.map((doc) => (
                  <DocumentCard key={doc.id} doc={doc} onPreview={setPreviewDoc} />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-border rounded-lg border border-border">
                {/* Column headers */}
                <div className="flex items-center gap-3 px-4 py-2 bg-muted/30">
                  <div className="h-10 w-10 shrink-0" />
                  <p className="flex-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</p>
                  <p className="w-[120px] shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Date Modified</p>
                  <p className="w-[40px] shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Size</p>
                  <div className="w-[132px] shrink-0" />
                </div>
                {filtered.map((doc) => (
                  <DocumentListRow key={doc.id} doc={doc} onPreview={setPreviewDoc} />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>

    <FilePreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
    </TooltipProvider>
  )
}

function DocumentDropdownMenu({ title, status }: { title: string; status: DocStatus }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`More options for ${title}`}
          className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wex-input-focus-ring"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {status === "attached" ? (
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
  )
}

function DocumentCard({ doc, onPreview }: { doc: DocumentItem; onPreview: (doc: DocumentItem) => void }) {
  return (
    <div className="group relative overflow-hidden rounded-[8px] border border-[#d1d6d8] bg-white transition-shadow hover:shadow-md">
      <button
        type="button"
        aria-label={`Preview ${doc.title}`}
        onClick={() => onPreview(doc)}
        className="relative h-[153px] w-full rounded-t-[8px] bg-[#d9d9d9] block cursor-pointer overflow-hidden ring-[3px] ring-inset ring-[#f8f9fe] focus-visible:outline-none focus-visible:ring-wex-input-focus-ring"
      >
        {doc.imageUrl && (
          <img src={doc.imageUrl} alt={doc.title} className="h-full w-full object-cover" />
        )}
        <StatusBadge status={doc.status} className="absolute bottom-2 right-2" />
      </button>
      <div className="space-y-1.5 bg-[#f8f9fe] p-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPreview(doc)}
            className="flex-1 truncate text-left text-sm font-semibold leading-5 text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wex-input-focus-ring"
          >
            {doc.title}
          </button>
          <DocumentDropdownMenu title={doc.title} status={doc.status} />
        </div>
        <p className="text-xs leading-4 text-[#7c858e]">{doc.date} — 3mb</p>
      </div>
    </div>
  )
}

function DocumentListRow({ doc, onPreview }: { doc: DocumentItem; onPreview: (doc: DocumentItem) => void }) {
  return (
    <div className="group flex items-center gap-3 px-4 py-3 hover:bg-muted/30">
      {/* Thumbnail */}
      <button
        type="button"
        aria-label={`Preview ${doc.title}`}
        onClick={() => onPreview(doc)}
        className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-[#d9d9d9] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wex-input-focus-ring"
      >
        {doc.imageUrl && (
          <img src={doc.imageUrl} alt={doc.title} className="h-full w-full object-cover" />
        )}
      </button>
      {/* Name + tag inline */}
      <div className="flex flex-1 items-center gap-2 overflow-hidden">
        <button
          type="button"
          onClick={() => onPreview(doc)}
          className="truncate text-sm font-semibold text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wex-input-focus-ring"
        >
          {doc.title}
        </button>
        <StatusBadge status={doc.status} className="shrink-0" />
      </div>
      {/* Date */}
      <p className="w-[120px] shrink-0 text-xs text-[#7c858e]">{doc.date}</p>
      {/* Size */}
      <p className="w-[40px] shrink-0 text-xs text-[#7c858e]">3mb</p>
      {/* Quick actions + three-dots */}
      <div className="flex w-[132px] shrink-0 items-center justify-end gap-1">
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {doc.status === "attached"
            ? <IconButton label="Edit claim"><ClipboardList className="h-4 w-4" /></IconButton>
            : <IconButton label="File claim"><FileText className="h-4 w-4" /></IconButton>
          }
          <IconButton label="Download"><Download className="h-4 w-4" /></IconButton>
          <IconButton label="Rename"><Pencil className="h-4 w-4" /></IconButton>
        </div>
        <DocumentDropdownMenu title={doc.title} status={doc.status} />
      </div>
    </div>
  )
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          className="flex items-center justify-center rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wex-input-focus-ring"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-wex-tooltip-bg text-wex-tooltip-fg">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

function StatusBadge({ status, className }: { status: DocStatus; className?: string }) {
  if (status === "attached") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-[#dcfce7] px-[7px] py-[3.5px] text-[12px] font-bold text-[#008375]",
          className
        )}
      >
        <Check className="h-[10.5px] w-[10.5px] shrink-0 text-current" aria-hidden />
        Attached
      </span>
    )
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[#f7f7f7] px-[7px] py-[3.5px] text-[12px] font-bold text-[#515f6b]",
        className
      )}
    >
      Unattached
    </span>
  )
}
