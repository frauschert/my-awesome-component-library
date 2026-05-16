import { useEffect, useState } from 'react'

interface UseIdleOptions {
    /**
     * Events to listen for user activity
     * @default ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'wheel']
     */
    events?: string[]
    /**
     * Initial idle state
     * @default false
     */
    initialState?: boolean
}

/**
 * Hook that detects when the user has been inactive for a specified duration.
 * Tracks mouse, keyboard, touch, and scroll events to determine activity.
 *
 * @param timeout - Time in milliseconds before considering user idle
 * @param options - Configuration options for events and initial state
 * @returns Boolean indicating if user is idle
 *
 * @example
 * const isIdle = useIdle(5000) // User idle after 5 seconds
 *
 * return (
 *   <div>
 *     {isIdle ? 'User is idle' : 'User is active'}
 *   </div>
 * )
 *
 * @example
 * // Auto-pause video when idle
 * function VideoPlayer() {
 *   const videoRef = useRef<HTMLVideoElement>(null)
 *   const isIdle = useIdle(3000)
 *
 *   useEffect(() => {
 *     if (isIdle) {
 *       videoRef.current?.pause()
 *     }
 *   }, [isIdle])
 *
 *   return <video ref={videoRef} src="video.mp4" />
 * }
 *
 * @example
 * // Custom events
 * function CustomIdleDetector() {
 *   const isIdle = useIdle(10000, {
 *     events: ['click', 'keydown'],
 *     initialState: true
 *   })
 *
 *   return <div>Idle: {String(isIdle)}</div>
 * }
 */
export default function useIdle(
    timeout: number,
    options: UseIdleOptions = {}
): boolean {
    const {
        events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
            'wheel',
        ],
        initialState = false,
    } = options

    const [isIdle, setIsIdle] = useState(initialState)

    useEffect(() => {
        // SSR guard
        if (typeof window === 'undefined') {
            return
        }

        let timeoutId: ReturnType<typeof setTimeout>

        const handleActivity = () => {
            setIsIdle(false)

            // Clear existing timeout
            if (timeoutId) {
                clearTimeout(timeoutId)
            }

            // Set new timeout
            timeoutId = setTimeout(() => {
                setIsIdle(true)
            }, timeout)
        }

        // Set initial timeout
        timeoutId = setTimeout(() => {
            setIsIdle(true)
        }, timeout)

        // Add event listeners for all specified events
        events.forEach((event) => {
            window.addEventListener(event, handleActivity, true)
        })

        return () => {
            // Clean up timeout
            if (timeoutId) {
                clearTimeout(timeoutId)
            }

            // Remove all event listeners
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity, true)
            })
        }
    }, [timeout, events, initialState])

    return isIdle
}
