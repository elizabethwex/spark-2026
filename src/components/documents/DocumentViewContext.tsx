import { createContext, useContext, useState } from "react"
import { Outlet } from "react-router-dom"
import { FOLDERS, type FolderItem } from "./documentData"

type ViewMode = "grid" | "list"

interface DocumentViewContextValue {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  folders: FolderItem[]
  setFolders: React.Dispatch<React.SetStateAction<FolderItem[]>>
  folderNames: Record<string, string>
  setFolderNames: React.Dispatch<React.SetStateAction<Record<string, string>>>
}

const DocumentViewContext = createContext<DocumentViewContextValue | null>(null)

export function useDocumentViewMode() {
  const ctx = useContext(DocumentViewContext)
  if (!ctx) throw new Error("useDocumentViewMode must be used within DocumentViewLayout")
  return ctx
}

export function useDocumentFolders() {
  const ctx = useContext(DocumentViewContext)
  if (!ctx) throw new Error("useDocumentFolders must be used within DocumentViewLayout")
  return { folders: ctx.folders, setFolders: ctx.setFolders, folderNames: ctx.folderNames, setFolderNames: ctx.setFolderNames }
}

export function DocumentViewLayout() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [folders, setFolders] = useState<FolderItem[]>(FOLDERS)
  const [folderNames, setFolderNames] = useState<Record<string, string>>(
    Object.fromEntries(FOLDERS.map((f) => [f.id, f.name]))
  )
  return (
    <DocumentViewContext.Provider value={{ viewMode, setViewMode, folders, setFolders, folderNames, setFolderNames }}>
      <Outlet />
    </DocumentViewContext.Provider>
  )
}
