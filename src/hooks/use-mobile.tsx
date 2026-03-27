import * as React from "react"

// Match Message Center mc breakpoint (400px) so desktop layout shows on small viewports
const MOBILE_BREAKPOINT = 400

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Default to desktop (false) until we've measured to avoid mobile flash on large screens
  return isMobile === true
}
