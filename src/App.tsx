import * as React from 'react'
import { AppRoutes } from '@/routes'
import { TooltipProvider } from '@wexinc-healthbenefits/ben-ui-kit'
import { AuthProvider } from '@/context/AuthContext'
import { PrototypeProvider } from '@/context/PrototypeContext'
import { ReimburseWorkspaceProvider } from '@/context/ReimburseWorkspaceContext'
import { applyPortalThemeToDocument } from '@/lib/portalTheme'

/**
 * Error Boundary to catch rendering errors
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Application Error</h1>
          <pre className="bg-red-50 dark:bg-red-900/20 p-4 rounded overflow-auto">
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Main App component
 */
function App() {
  React.useEffect(() => {
    applyPortalThemeToDocument()

    const THEME_STORAGE_KEY = 'ben-ui-kit-theme'

    const enforceLightMode = () => {
      window.localStorage.setItem(THEME_STORAGE_KEY, 'light')
      document.documentElement.classList.remove('dark')
    }

    enforceLightMode()

    const observer = new MutationObserver(() => {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark')
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <ErrorBoundary>
      <AuthProvider>
        <PrototypeProvider>
          <ReimburseWorkspaceProvider>
            <TooltipProvider>
              <AppRoutes />
            </TooltipProvider>
          </ReimburseWorkspaceProvider>
        </PrototypeProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
