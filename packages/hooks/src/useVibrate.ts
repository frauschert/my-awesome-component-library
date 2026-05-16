import { useCallback, useEffect, useRef } from 'react'

/**
 * Vibration pattern - duration or array of [duration, pause, duration, ...]
 */
export type VibrationPattern = number | number[]

/**
 * Options for useVibrate hook
 */
export interface UseVibrateOptions {
    /**
     * Default vibration pattern (ms)
     * @default 200
     */
    defaultPattern?: VibrationPattern
    /**
     * Callback when vibration is not supported
     */
    onNotSupported?: () => void
}

/**
 * Return type for useVibrate hook
 */
export interface UseVibrateReturn {
    /**
     * Whether Vibration API is supported
     */
    isSupported: boolean
    /**
     * Whether currently vibrating
     */
    isVibrating: boolean
    /**
     * Start vibration with pattern
     * @param pattern - Vibration pattern (ms or array)
     */
    vibrate: (pattern?: VibrationPattern) => void
    /**
     * Stop vibration
     */
    stop: () => void
}

/**
 * Hook for triggering device vibration using the Vibration API.
 * Useful for haptic feedback in mobile web apps, games, and interactive UI.
 *
 * @param options - Configuration options
 * @returns Vibration control functions and state
 *
 * @example
 * ```tsx
 * function HapticButton() {
 *   const { vibrate, isSupported } = useVibrate()
 *
 *   return (
 *     <button onClick={() => vibrate(50)}>
 *       Click for haptic feedback
 *       {!isSupported && ' (not supported)'}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Pattern: vibrate 200ms, pause 100ms, vibrate 200ms
 * const { vibrate } = useVibrate()
 * vibrate([200, 100, 200])
 * ```
 *
 * @example
 * ```tsx
 * // Game haptics
 * const { vibrate } = useVibrate({ defaultPattern: 50 })
 *
 * const handleHit = () => vibrate([100, 50, 100, 50, 100]) // Strong hit
 * const handleCollect = () => vibrate(30) // Light tap
 * ```
 */
export function useVibrate(options: UseVibrateOptions = {}): UseVibrateReturn {
    const { defaultPattern = 200, onNotSupported } = options

    const isVibrating = useRef(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Check if Vibration API is supported
    const isSupported =
        typeof window !== 'undefined' &&
        typeof window.navigator !== 'undefined' &&
        'vibrate' in window.navigator &&
        typeof window.navigator.vibrate === 'function'

    // Call onNotSupported if API is not available
    useEffect(() => {
        if (!isSupported && onNotSupported) {
            onNotSupported()
        }
    }, [isSupported, onNotSupported])

    // Calculate total duration for a pattern
    const getPatternDuration = useCallback(
        (pattern: VibrationPattern): number => {
            if (typeof pattern === 'number') {
                return pattern
            }
            // Sum all durations and pauses
            return pattern.reduce((sum, duration) => sum + duration, 0)
        },
        []
    )

    // Start vibration
    const vibrate = useCallback(
        (pattern: VibrationPattern = defaultPattern) => {
            if (!isSupported) return

            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
                timeoutRef.current = null
            }

            // Trigger vibration
            try {
                const success = window.navigator.vibrate(pattern)

                if (success) {
                    isVibrating.current = true

                    // Calculate when vibration will end
                    const duration = getPatternDuration(pattern)

                    // Set timeout to update isVibrating state
                    timeoutRef.current = setTimeout(() => {
                        isVibrating.current = false
                        timeoutRef.current = null
                    }, duration)
                }
            } catch (error) {
                // Silently fail - some browsers may throw
                console.warn('Vibration API error:', error)
            }
        },
        [isSupported, defaultPattern, getPatternDuration]
    )

    // Stop vibration
    const stop = useCallback(() => {
        if (!isSupported) return

        try {
            window.navigator.vibrate(0) // Pass 0 to stop
            isVibrating.current = false

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
                timeoutRef.current = null
            }
        } catch (error) {
            console.warn('Vibration API error:', error)
        }
    }, [isSupported])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stop()
        }
    }, [stop])

    return {
        isSupported,
        isVibrating: isVibrating.current,
        vibrate,
        stop,
    }
}

export default useVibrate
