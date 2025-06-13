"use client"

import { useState, useEffect } from "react"

type Breakpoints = {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

/**
 * Custom hook to read viewport width and expose common breakpoint flags.
 * - Mobile: up to 640px
 * - Tablet: 641px up to 1024px
 * - Desktop: 1025px and above
 */
export function useResponsive(): Breakpoints {
  const [breakpoints, setBreakpoints] = useState<Breakpoints>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  })

  useEffect(() => {
    // Media query definitions
    const queries: { [K in keyof Breakpoints]: string } = {
      isMobile: "(max-width: 640px)",
      isTablet: "(min-width: 641px) and (max-width: 1024px)",
      isDesktop: "(min-width: 1025px)",
    }

    // Create MediaQueryList for each
    const mqls: Partial<{ [K in keyof Breakpoints]: MediaQueryList }> = {}
    for (const key in queries) {
      mqls[key as keyof Breakpoints] = window.matchMedia(queries[key as keyof Breakpoints])
    }

    // Handler to update state
    const update = () => {
      setBreakpoints({
        isMobile: mqls.isMobile!.matches,
        isTablet: mqls.isTablet!.matches,
        isDesktop: mqls.isDesktop!.matches,
      })
    }

    // Listen to changes
    for (const key in mqls) {
      mqls[key as keyof Breakpoints]!.addEventListener("change", update)
    }

    // Initialize
    update()

    // Cleanup
    return () => {
      for (const key in mqls) {
        mqls[key as keyof Breakpoints]!.removeEventListener("change", update)
      }
    }
  }, [])

  return breakpoints
}
