import { useEffect, useRef } from 'react'

/**
 * A hook that runs a callback function on a specified interval.
 * Automatically handles cleanup and can be paused by passing null as the delay.
 *
 * @param callback - Function to call on each interval tick
 * @param delay - Interval delay in milliseconds, or null to pause
 *
 * @example
 * ```tsx
 * const [count, setCount] = useState(0)
 * useInterval(() => setCount(c => c + 1), 1000) // Increment every second
 * ```
 *
 * @example
 * ```tsx
 * const [isPaused, setIsPaused] = useState(false)
 * useInterval(() => tick(), isPaused ? null : 1000) // Pause when isPaused is true
 * ```
 */
export default function useInterval(
    callback: () => void,
    delay: number | null
): void {
    const savedCallback = useRef<(() => void) | null>(null)

    // Store the latest callback
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval
    useEffect(() => {
        // Don't schedule if delay is null
        if (delay === null) {
            return
        }

        const tick = () => {
            if (savedCallback.current) {
                savedCallback.current()
            }
        }

        const id = setInterval(tick, delay)

        // Cleanup on unmount or delay change
        return () => clearInterval(id)
    }, [delay])
}
