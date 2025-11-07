import { useEffect, useRef, useCallback } from 'react'

export type SwipeDirection = 'up' | 'down' | 'left' | 'right'

export interface SwipeEvent {
    direction: SwipeDirection
    deltaX: number
    deltaY: number
    velocity: number
    distance: number
}

export interface UseSwipeOptions {
    /**
     * Minimum distance in pixels to trigger a swipe
     * @default 50
     */
    threshold?: number
    /**
     * Maximum time in milliseconds for a swipe gesture
     * @default 500
     */
    maxDuration?: number
    /**
     * Minimum velocity (pixels/ms) required to trigger swipe
     * @default 0.3
     */
    minVelocity?: number
    /**
     * Callback when swipe is detected
     */
    onSwipe?: (event: SwipeEvent) => void
    /**
     * Callback for swipe up
     */
    onSwipeUp?: (event: SwipeEvent) => void
    /**
     * Callback for swipe down
     */
    onSwipeDown?: (event: SwipeEvent) => void
    /**
     * Callback for swipe left
     */
    onSwipeLeft?: (event: SwipeEvent) => void
    /**
     * Callback for swipe right
     */
    onSwipeRight?: (event: SwipeEvent) => void
    /**
     * Callback when swiping starts
     */
    onSwipeStart?: (event: { x: number; y: number }) => void
    /**
     * Callback during swipe movement
     */
    onSwipeMove?: (event: {
        x: number
        y: number
        deltaX: number
        deltaY: number
    }) => void
    /**
     * Callback when swipe ends (even if threshold not met)
     */
    onSwipeEnd?: () => void
    /**
     * Prevent default behavior on touch events
     * @default false
     */
    preventDefault?: boolean
    /**
     * Track mouse swipes in addition to touch
     * @default true
     */
    trackMouse?: boolean
}

export interface UseSwipeReturn {
    /**
     * Whether a swipe is currently in progress
     */
    isSwiping: boolean
    /**
     * Direction of the last detected swipe
     */
    direction: SwipeDirection | null
}

interface SwipeState {
    startX: number
    startY: number
    startTime: number
    isSwiping: boolean
}

/**
 * Hook for detecting swipe gestures on touch and mouse events
 *
 * @param target - Element to attach swipe handlers to
 * @param options - Configuration options
 * @returns Swipe state
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null)
 * const { isSwiping, direction } = useSwipe(ref, {
 *   onSwipeLeft: () => console.log('Swiped left!'),
 *   onSwipeRight: () => console.log('Swiped right!'),
 *   threshold: 100,
 * })
 * ```
 */
const useSwipe = <T extends HTMLElement = HTMLElement>(
    target: React.RefObject<T> | null,
    options: UseSwipeOptions = {}
): UseSwipeReturn => {
    const {
        threshold = 50,
        maxDuration = 500,
        minVelocity = 0.3,
        onSwipe,
        onSwipeUp,
        onSwipeDown,
        onSwipeLeft,
        onSwipeRight,
        onSwipeStart,
        onSwipeMove,
        onSwipeEnd,
        preventDefault = false,
        trackMouse = true,
    } = options

    const swipeStateRef = useRef<SwipeState>({
        startX: 0,
        startY: 0,
        startTime: 0,
        isSwiping: false,
    })

    const directionRef = useRef<SwipeDirection | null>(null)

    const getDirection = useCallback(
        (deltaX: number, deltaY: number): SwipeDirection | null => {
            const absX = Math.abs(deltaX)
            const absY = Math.abs(deltaY)

            // Determine if swipe meets threshold
            if (absX < threshold && absY < threshold) {
                return null
            }

            // Determine primary direction
            if (absX > absY) {
                return deltaX > 0 ? 'right' : 'left'
            } else {
                return deltaY > 0 ? 'down' : 'up'
            }
        },
        [threshold]
    )

    const handleSwipeStart = useCallback(
        (clientX: number, clientY: number) => {
            swipeStateRef.current = {
                startX: clientX,
                startY: clientY,
                startTime: Date.now(),
                isSwiping: true,
            }

            if (onSwipeStart) {
                onSwipeStart({ x: clientX, y: clientY })
            }
        },
        [onSwipeStart]
    )

    const handleSwipeMove = useCallback(
        (clientX: number, clientY: number) => {
            if (!swipeStateRef.current.isSwiping) return

            const deltaX = clientX - swipeStateRef.current.startX
            const deltaY = clientY - swipeStateRef.current.startY

            if (onSwipeMove) {
                onSwipeMove({ x: clientX, y: clientY, deltaX, deltaY })
            }
        },
        [onSwipeMove]
    )

    const handleSwipeEnd = useCallback(
        (clientX: number, clientY: number) => {
            if (!swipeStateRef.current.isSwiping) return

            const deltaX = clientX - swipeStateRef.current.startX
            const deltaY = clientY - swipeStateRef.current.startY
            const duration = Date.now() - swipeStateRef.current.startTime
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
            const velocity = distance / duration

            swipeStateRef.current.isSwiping = false

            if (onSwipeEnd) {
                onSwipeEnd()
            }

            // Check if swipe meets criteria
            if (duration > maxDuration || velocity < minVelocity) {
                directionRef.current = null
                return
            }

            const direction = getDirection(deltaX, deltaY)
            if (!direction) {
                directionRef.current = null
                return
            }

            directionRef.current = direction

            const swipeEvent: SwipeEvent = {
                direction,
                deltaX,
                deltaY,
                velocity,
                distance,
            }

            // Call general swipe callback
            if (onSwipe) {
                onSwipe(swipeEvent)
            }

            // Call direction-specific callbacks
            switch (direction) {
                case 'up':
                    if (onSwipeUp) onSwipeUp(swipeEvent)
                    break
                case 'down':
                    if (onSwipeDown) onSwipeDown(swipeEvent)
                    break
                case 'left':
                    if (onSwipeLeft) onSwipeLeft(swipeEvent)
                    break
                case 'right':
                    if (onSwipeRight) onSwipeRight(swipeEvent)
                    break
            }
        },
        [
            maxDuration,
            minVelocity,
            getDirection,
            onSwipe,
            onSwipeUp,
            onSwipeDown,
            onSwipeLeft,
            onSwipeRight,
            onSwipeEnd,
        ]
    )

    useEffect(() => {
        const element = target?.current
        if (!element) return

        // Touch event handlers
        const handleTouchStart = (e: TouchEvent) => {
            if (preventDefault) {
                e.preventDefault()
            }
            const touch = e.touches[0]
            handleSwipeStart(touch.clientX, touch.clientY)
        }

        const handleTouchMove = (e: TouchEvent) => {
            if (preventDefault) {
                e.preventDefault()
            }
            const touch = e.touches[0]
            handleSwipeMove(touch.clientX, touch.clientY)
        }

        const handleTouchEnd = (e: TouchEvent) => {
            if (preventDefault) {
                e.preventDefault()
            }
            const touch = e.changedTouches[0]
            handleSwipeEnd(touch.clientX, touch.clientY)
        }

        // Mouse event handlers
        const handleMouseDown = (e: MouseEvent) => {
            if (!trackMouse) return
            handleSwipeStart(e.clientX, e.clientY)
        }

        const handleMouseMove = (e: MouseEvent) => {
            if (!trackMouse) return
            handleSwipeMove(e.clientX, e.clientY)
        }

        const handleMouseUp = (e: MouseEvent) => {
            if (!trackMouse) return
            handleSwipeEnd(e.clientX, e.clientY)
        }

        // Add touch listeners
        element.addEventListener('touchstart', handleTouchStart, {
            passive: !preventDefault,
        })
        element.addEventListener('touchmove', handleTouchMove, {
            passive: !preventDefault,
        })
        element.addEventListener('touchend', handleTouchEnd, {
            passive: !preventDefault,
        })

        // Add mouse listeners if enabled
        if (trackMouse) {
            element.addEventListener('mousedown', handleMouseDown)
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            element.removeEventListener('touchstart', handleTouchStart)
            element.removeEventListener('touchmove', handleTouchMove)
            element.removeEventListener('touchend', handleTouchEnd)

            if (trackMouse) {
                element.removeEventListener('mousedown', handleMouseDown)
                window.removeEventListener('mousemove', handleMouseMove)
                window.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [
        target,
        handleSwipeStart,
        handleSwipeMove,
        handleSwipeEnd,
        preventDefault,
        trackMouse,
    ])

    return {
        isSwiping: swipeStateRef.current.isSwiping,
        direction: directionRef.current,
    }
}

export default useSwipe
