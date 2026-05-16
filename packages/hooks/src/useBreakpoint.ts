import { useState, useEffect } from 'react'

/**
 * Standard breakpoint configuration
 */
export interface Breakpoints {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
    xxl: number
}

/**
 * Breakpoint names
 */
export type BreakpointName = keyof Breakpoints

/**
 * Default breakpoints (based on common CSS frameworks)
 */
export const defaultBreakpoints: Breakpoints = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
}

/**
 * Options for useBreakpoint hook
 */
export interface UseBreakpointOptions {
    /** Custom breakpoints */
    breakpoints?: Partial<Breakpoints>
    /** Debounce resize events (ms) */
    debounceMs?: number
}

/**
 * Return type for useBreakpoint hook
 */
export interface UseBreakpointReturn {
    /** Current active breakpoint name */
    breakpoint: BreakpointName
    /** Current window width */
    width: number
    /** Check if current breakpoint matches */
    is: (name: BreakpointName) => boolean
    /** Check if current breakpoint is greater than or equal */
    isGreaterOrEqual: (name: BreakpointName) => boolean
    /** Check if current breakpoint is less than or equal */
    isLessOrEqual: (name: BreakpointName) => boolean
    /** Check if current breakpoint is greater than */
    isGreater: (name: BreakpointName) => boolean
    /** Check if current breakpoint is less than */
    isLess: (name: BreakpointName) => boolean
}

/**
 * Hook to track current responsive breakpoint.
 * Provides utilities to check breakpoint ranges and comparisons.
 *
 * @param options - Configuration options
 * @returns Current breakpoint information and comparison utilities
 *
 * @example
 * ```tsx
 * const { breakpoint, isGreaterOrEqual } = useBreakpoint()
 *
 * return (
 *   <div>
 *     <p>Current: {breakpoint}</p>
 *     {isGreaterOrEqual('md') && <SideNav />}
 *     {!isGreaterOrEqual('md') && <MobileMenu />}
 *   </div>
 * )
 * ```
 *
 * @example
 * ```tsx
 * // Custom breakpoints
 * const bp = useBreakpoint({
 *   breakpoints: {
 *     sm: 576,
 *     md: 768,
 *     lg: 992,
 *     xl: 1200
 *   }
 * })
 * ```
 */
export function useBreakpoint(
    options: UseBreakpointOptions = {}
): UseBreakpointReturn {
    const { breakpoints: customBreakpoints, debounceMs = 150 } = options

    // Merge custom breakpoints with defaults
    const breakpoints: Breakpoints = {
        ...defaultBreakpoints,
        ...customBreakpoints,
    }

    // Get initial window width (SSR-safe)
    const getWidth = (): number => {
        if (typeof window === 'undefined') return 0
        return window.innerWidth
    }

    // Determine breakpoint from width
    const getBreakpoint = (width: number): BreakpointName => {
        const sortedBreakpoints = (
            Object.entries(breakpoints) as [BreakpointName, number][]
        ).sort((a, b) => b[1] - a[1]) // Sort descending

        for (const [name, minWidth] of sortedBreakpoints) {
            if (width >= minWidth) {
                return name
            }
        }

        return 'xs'
    }

    const [width, setWidth] = useState<number>(getWidth)
    const [breakpoint, setBreakpoint] = useState<BreakpointName>(
        getBreakpoint(getWidth())
    )

    useEffect(() => {
        if (typeof window === 'undefined') return

        let timeoutId: NodeJS.Timeout | null = null

        const handleResize = () => {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }

            timeoutId = setTimeout(() => {
                const newWidth = window.innerWidth
                setWidth(newWidth)
                setBreakpoint(getBreakpoint(newWidth))
            }, debounceMs)
        }

        window.addEventListener('resize', handleResize)

        // Set initial values
        const initialWidth = window.innerWidth
        setWidth(initialWidth)
        setBreakpoint(getBreakpoint(initialWidth))

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId)
            }
            window.removeEventListener('resize', handleResize)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceMs])

    // Get numeric value for a breakpoint name
    const getBreakpointValue = (name: BreakpointName): number => {
        return breakpoints[name]
    }

    // Check if current breakpoint matches
    const is = (name: BreakpointName): boolean => {
        return breakpoint === name
    }

    // Check if current breakpoint is >= target
    const isGreaterOrEqual = (name: BreakpointName): boolean => {
        return width >= getBreakpointValue(name)
    }

    // Check if current breakpoint is <= target
    const isLessOrEqual = (name: BreakpointName): boolean => {
        const currentValue = getBreakpointValue(breakpoint)
        const targetValue = getBreakpointValue(name)
        return currentValue <= targetValue
    }

    // Check if current breakpoint is > target
    const isGreater = (name: BreakpointName): boolean => {
        const currentValue = getBreakpointValue(breakpoint)
        const targetValue = getBreakpointValue(name)
        return currentValue > targetValue
    }

    // Check if current breakpoint is < target
    const isLess = (name: BreakpointName): boolean => {
        const currentValue = getBreakpointValue(breakpoint)
        const targetValue = getBreakpointValue(name)
        return currentValue < targetValue
    }

    return {
        breakpoint,
        width,
        is,
        isGreaterOrEqual,
        isLessOrEqual,
        isGreater,
        isLess,
    }
}

export default useBreakpoint
