import { useEffect, useRef, useState } from 'react'

/**
 * Throttles a value, ensuring it only updates at most once per specified delay.
 * Unlike debouncing, throttling guarantees the value updates at regular intervals
 * during continuous changes.
 *
 * @param value - The value to throttle
 * @param delay - The throttle delay in milliseconds
 * @returns The throttled value
 *
 * @example
 * ```tsx
 * const [scrollY, setScrollY] = useState(0)
 * const throttledScrollY = useThrottle(scrollY, 200)
 *
 * useEffect(() => {
 *   const handleScroll = () => setScrollY(window.scrollY)
 *   window.addEventListener('scroll', handleScroll)
 *   return () => window.removeEventListener('scroll', handleScroll)
 * }, [])
 * ```
 */
function useThrottle<T>(value: T, delay: number): T {
    const [throttledValue, setThrottledValue] = useState<T>(value)
    const lastRan = useRef<number>(Date.now())
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const now = Date.now()
        const timeSinceLastRan = now - lastRan.current

        if (timeSinceLastRan >= delay) {
            // Enough time has passed, update immediately
            setThrottledValue(value)
            lastRan.current = now
        } else {
            // Schedule update for remaining time
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            timeoutRef.current = setTimeout(() => {
                setThrottledValue(value)
                lastRan.current = Date.now()
            }, delay - timeSinceLastRan)
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [value, delay])

    return throttledValue
}

export default useThrottle
