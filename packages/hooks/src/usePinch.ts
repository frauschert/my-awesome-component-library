import { useEffect, useRef, useCallback, useState } from 'react'

export interface PinchEvent {
    /**
     * Current scale factor (1 = no zoom)
     */
    scale: number
    /**
     * Change in scale since last event
     */
    delta: number
    /**
     * Center point of the pinch gesture
     */
    center: { x: number; y: number }
    /**
     * Distance between touch points in pixels
     */
    distance: number
    /**
     * Whether the gesture is zooming in or out
     */
    direction: 'in' | 'out'
}

export interface UsePinchOptions {
    /**
     * Callback when pinch gesture is detected
     */
    onPinch?: (event: PinchEvent) => void
    /**
     * Callback when pinch starts
     */
    onPinchStart?: (event: PinchEvent) => void
    /**
     * Callback when pinch ends
     */
    onPinchEnd?: (event: PinchEvent) => void
    /**
     * Minimum scale factor
     * @default 0.5
     */
    minScale?: number
    /**
     * Maximum scale factor
     * @default 3
     */
    maxScale?: number
    /**
     * Scale sensitivity multiplier
     * @default 1
     */
    sensitivity?: number
    /**
     * Prevent default behavior on touch events
     * @default true
     */
    preventDefault?: boolean
    /**
     * Enable/disable the hook
     * @default true
     */
    enabled?: boolean
}

export interface UsePinchReturn {
    /**
     * Current scale factor
     */
    scale: number
    /**
     * Whether a pinch is currently in progress
     */
    isPinching: boolean
    /**
     * Reset scale to 1
     */
    reset: () => void
}

interface TouchState {
    initialDistance: number
    initialScale: number
    currentDistance: number
    center: { x: number; y: number }
}

const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch2.clientX - touch1.clientX
    const dy = touch2.clientY - touch1.clientY
    return Math.sqrt(dx * dx + dy * dy)
}

const getCenter = (touch1: Touch, touch2: Touch): { x: number; y: number } => {
    return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
    }
}

/**
 * Hook for detecting pinch-to-zoom gestures on touch devices
 *
 * @param target - Element to attach pinch handlers to
 * @param options - Configuration options
 * @returns Pinch state and controls
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null)
 * const { scale, isPinching, reset } = usePinch(ref, {
 *   onPinch: (event) => {
 *     console.log('Scale:', event.scale)
 *   },
 *   minScale: 0.5,
 *   maxScale: 4,
 * })
 * ```
 */
const usePinch = <T extends HTMLElement = HTMLElement>(
    target: React.RefObject<T> | null,
    options: UsePinchOptions = {}
): UsePinchReturn => {
    const {
        onPinch,
        onPinchStart,
        onPinchEnd,
        minScale = 0.5,
        maxScale = 3,
        sensitivity = 1,
        preventDefault = true,
        enabled = true,
    } = options

    const [scale, setScale] = useState(1)
    const [isPinching, setIsPinching] = useState(false)

    const touchStateRef = useRef<TouchState | null>(null)
    const lastScaleRef = useRef(1)

    const reset = useCallback(() => {
        setScale(1)
        lastScaleRef.current = 1
    }, [])

    const clampScale = useCallback(
        (value: number): number => {
            return Math.max(minScale, Math.min(maxScale, value))
        },
        [minScale, maxScale]
    )

    const createPinchEvent = useCallback(
        (
            currentScale: number,
            center: { x: number; y: number },
            distance: number
        ): PinchEvent => {
            const delta = currentScale - lastScaleRef.current
            return {
                scale: currentScale,
                delta,
                center,
                distance,
                direction: delta > 0 ? 'in' : 'out',
            }
        },
        []
    )

    const handleTouchStart = useCallback(
        (e: TouchEvent) => {
            if (!enabled || e.touches.length !== 2) return

            if (preventDefault) {
                e.preventDefault()
            }

            const touch1 = e.touches[0]
            const touch2 = e.touches[1]
            const distance = getDistance(touch1, touch2)
            const center = getCenter(touch1, touch2)

            touchStateRef.current = {
                initialDistance: distance,
                initialScale: scale,
                currentDistance: distance,
                center,
            }

            setIsPinching(true)

            if (onPinchStart) {
                const event = createPinchEvent(scale, center, distance)
                onPinchStart(event)
            }
        },
        [enabled, preventDefault, scale, onPinchStart, createPinchEvent]
    )

    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            if (!enabled || !touchStateRef.current || e.touches.length !== 2)
                return

            if (preventDefault) {
                e.preventDefault()
            }

            const touch1 = e.touches[0]
            const touch2 = e.touches[1]
            const distance = getDistance(touch1, touch2)
            const center = getCenter(touch1, touch2)

            const { initialDistance, initialScale } = touchStateRef.current

            // Calculate new scale
            const ratio = distance / initialDistance
            const newScale = clampScale(initialScale * ratio * sensitivity)

            touchStateRef.current.currentDistance = distance
            touchStateRef.current.center = center

            setScale(newScale)

            if (onPinch) {
                const event = createPinchEvent(newScale, center, distance)
                onPinch(event)
            }

            lastScaleRef.current = newScale
        },
        [
            enabled,
            preventDefault,
            clampScale,
            sensitivity,
            onPinch,
            createPinchEvent,
        ]
    )

    const handleTouchEnd = useCallback(
        (e: TouchEvent) => {
            if (!enabled || !touchStateRef.current) return

            if (preventDefault) {
                e.preventDefault()
            }

            const { center, currentDistance } = touchStateRef.current

            setIsPinching(false)

            if (onPinchEnd) {
                const event = createPinchEvent(scale, center, currentDistance)
                onPinchEnd(event)
            }

            touchStateRef.current = null
        },
        [enabled, preventDefault, scale, onPinchEnd, createPinchEvent]
    )

    useEffect(() => {
        const element = target?.current
        if (!element || !enabled) return

        element.addEventListener('touchstart', handleTouchStart, {
            passive: !preventDefault,
        })
        element.addEventListener('touchmove', handleTouchMove, {
            passive: !preventDefault,
        })
        element.addEventListener('touchend', handleTouchEnd, {
            passive: !preventDefault,
        })
        element.addEventListener('touchcancel', handleTouchEnd, {
            passive: !preventDefault,
        })

        return () => {
            element.removeEventListener('touchstart', handleTouchStart)
            element.removeEventListener('touchmove', handleTouchMove)
            element.removeEventListener('touchend', handleTouchEnd)
            element.removeEventListener('touchcancel', handleTouchEnd)
        }
    }, [
        target,
        enabled,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        preventDefault,
    ])

    return {
        scale,
        isPinching,
        reset,
    }
}

export default usePinch
