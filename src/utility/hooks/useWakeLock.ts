import { useEffect, useState, useCallback } from 'react'

// Wake Lock API types (experimental feature)
interface WakeLockSentinel extends EventTarget {
    readonly released: boolean
    readonly type: 'screen'
    release(): Promise<void>
}

export interface UseWakeLockOptions {
    /**
     * Automatically request wake lock on mount
     * @default false
     */
    requestOnMount?: boolean

    /**
     * Callback when wake lock is successfully acquired
     */
    onAcquire?: () => void

    /**
     * Callback when wake lock is released
     */
    onRelease?: () => void

    /**
     * Callback when an error occurs
     */
    onError?: (error: Error) => void
}

export interface UseWakeLockReturn {
    /**
     * Whether a wake lock is currently active
     */
    isActive: boolean

    /**
     * Whether the API is supported in this browser
     */
    isSupported: boolean

    /**
     * Request a wake lock
     */
    request: () => Promise<void>

    /**
     * Release the current wake lock
     */
    release: () => Promise<void>
}

/**
 * Hook to prevent the screen from sleeping using the Screen Wake Lock API.
 * Useful for presentations, video playback, reading apps, or any scenario
 * where you want to keep the screen active.
 *
 * @param options - Configuration options
 * @returns Wake lock state and control functions
 *
 * @example
 * ```tsx
 * function VideoPlayer() {
 *   const { isActive, request, release } = useWakeLock()
 *
 *   return (
 *     <div>
 *       <video onPlay={request} onPause={release} />
 *       <p>Screen lock: {isActive ? 'Active' : 'Inactive'}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useWakeLock(
    options: UseWakeLockOptions = {}
): UseWakeLockReturn {
    const { requestOnMount = false, onAcquire, onRelease, onError } = options

    const [isActive, setIsActive] = useState(false)
    const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null)
    const [shouldReacquire, setShouldReacquire] = useState(false)

    // Check if Wake Lock API is supported
    const isSupported =
        typeof window !== 'undefined' &&
        'wakeLock' in window.navigator &&
        typeof (
            window.navigator as Navigator & {
                wakeLock?: { request: unknown }
            }
        ).wakeLock?.request === 'function'

    const release = useCallback(async () => {
        if (wakeLock) {
            try {
                await wakeLock.release()
                setWakeLock(null)
                setIsActive(false)
                setShouldReacquire(false)
                onRelease?.()
            } catch (error) {
                const err =
                    error instanceof Error
                        ? error
                        : new Error('Failed to release wake lock')
                onError?.(err)
            }
        }
    }, [wakeLock, onRelease, onError])

    const request = useCallback(async () => {
        if (!isSupported) {
            const error = new Error(
                'Wake Lock API is not supported in this browser'
            )
            onError?.(error)
            return
        }

        // Release existing lock before requesting a new one
        if (wakeLock) {
            try {
                await wakeLock.release()
            } catch {
                // Ignore errors when releasing old lock
            }
        }

        try {
            const nav = window.navigator as Navigator & {
                wakeLock: { request(type: 'screen'): Promise<WakeLockSentinel> }
            }
            const lock = await nav.wakeLock.request('screen')
            setWakeLock(lock)
            setIsActive(true)
            setShouldReacquire(true)
            onAcquire?.()

            // Handle release event (e.g., when tab becomes hidden)
            const handleRelease = () => {
                setIsActive(false)
                onRelease?.()
            }

            lock.addEventListener('release', handleRelease)
        } catch (error) {
            const err =
                error instanceof Error
                    ? error
                    : new Error('Failed to request wake lock')
            onError?.(err)
        }
    }, [isSupported, wakeLock, onAcquire, onRelease, onError])

    // Handle visibility change - reacquire lock when page becomes visible
    useEffect(() => {
        if (!isSupported) return

        const handleVisibilityChange = () => {
            if (
                document.visibilityState === 'visible' &&
                shouldReacquire &&
                !isActive
            ) {
                // Reacquire wake lock when page becomes visible again
                request()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            )
        }
    }, [isSupported, shouldReacquire, isActive, request])

    // Request on mount if configured
    useEffect(() => {
        if (requestOnMount && isSupported) {
            request()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Release on unmount
    useEffect(() => {
        return () => {
            if (wakeLock) {
                wakeLock.release().catch(() => {
                    // Ignore errors on cleanup
                })
            }
        }
    }, [wakeLock])

    return {
        isActive,
        isSupported,
        request,
        release,
    }
}

export default useWakeLock
