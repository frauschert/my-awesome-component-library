import { useEffect, useState } from 'react'

/**
 * Hook to track whether a CSS media query matches
 *
 * @param query - The media query string (e.g., '(min-width: 768px)')
 * @returns boolean indicating whether the media query currently matches
 *
 * @example
 * ```tsx
 * // Basic usage
 * const isMobile = useMediaQuery('(max-width: 768px)')
 *
 * // Multiple breakpoints
 * const isDesktop = useMediaQuery('(min-width: 1024px)')
 * const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
 *
 * // Prefers dark mode
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
 *
 * // Orientation
 * const isPortrait = useMediaQuery('(orientation: portrait)')
 *
 * // Prefers reduced motion
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
 * ```
 */
export default function useMediaQuery(query: string): boolean {
    // Initialize with current match state
    // Use a function to avoid SSR issues
    const getMatches = (query: string): boolean => {
        // Prevent SSR issues
        if (typeof window === 'undefined') {
            return false
        }
        return window.matchMedia(query).matches
    }

    const [matches, setMatches] = useState<boolean>(() => getMatches(query))

    useEffect(() => {
        // Prevent SSR issues
        if (typeof window === 'undefined') {
            return
        }

        const mediaQuery = window.matchMedia(query)

        // Update state when media query match changes
        const handleChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches)
        }

        // Set initial value
        setMatches(mediaQuery.matches)

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange)
            return () => mediaQuery.removeEventListener('change', handleChange)
        }
        // Legacy browsers (deprecated but still supported)
        else if (mediaQuery.addListener) {
            mediaQuery.addListener(handleChange)
            return () => mediaQuery.removeListener(handleChange)
        }

        return undefined
    }, [query])

    return matches
}
