import { createContext, useContext, useState } from "react"
import { Outlet } from "react-router-dom"

type ViewMode = "grid" | "list"

interface DocumentViewContextValue {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

const DocumentViewContext = createContext<DocumentViewContextValue | null>(null)

export function useDocumentViewMode() {
  const ctx = useContext(DocumentViewContext)
  if (!ctx) throw new Error("useDocumentViewMode must be used within DocumentViewLayout")
  return ctx
}

export function DocumentViewLayout() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  return (
    <DocumentViewContext.Provider value={{ viewMode, setViewMode }}>
      <Outlet />
    </DocumentViewContext.Provider>
  )
}
