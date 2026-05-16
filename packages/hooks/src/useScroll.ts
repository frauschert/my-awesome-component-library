import { useState, useEffect, useRef, RefObject } from 'react'

export interface ScrollState {
    /** Horizontal scroll position in pixels */
    x: number
    /** Vertical scroll position in pixels */
    y: number
    /** Scroll direction on the x-axis since last update */
    directionX: 'left' | 'right' | 'none'
    /** Scroll direction on the y-axis since last update */
    directionY: 'up' | 'down' | 'none'
    /** Horizontal scroll progress as percentage (0–100) */
    percentX: number
    /** Vertical scroll progress as percentage (0–100) */
    percentY: number
    /** Whether the target is scrolled to the top */
    isAtTop: boolean
    /** Whether the target is scrolled to the bottom */
    isAtBottom: boolean
    /** Whether the target is scrolled to the left edge */
    isAtLeft: boolean
    /** Whether the target is scrolled to the right edge */
    isAtRight: boolean
}

export interface UseScrollOptions {
    /**
     * Throttle scroll updates (ms). 0 = no throttle.
     * @default 0
     */
    throttleMs?: number
    /**
     * Enable/disable the hook
     * @default true
     */
    enabled?: boolean
}

const getScrollMetrics = (
    target: HTMLElement | Window
): Omit<ScrollState, 'directionX' | 'directionY'> => {
    if (target === window) {
        const x = window.scrollX ?? 0
        const y = window.scrollY ?? 0
        const maxX = Math.max(
            0,
            document.documentElement.scrollWidth - (window.innerWidth ?? 0)
        )
        const maxY = Math.max(
            0,
            document.documentElement.scrollHeight - (window.innerHeight ?? 0)
        )
        return {
            x,
            y,
            percentX: maxX > 0 ? Math.round((x / maxX) * 100) : 0,
            percentY: maxY > 0 ? Math.round((y / maxY) * 100) : 0,
            isAtTop: y <= 0,
            isAtBottom: maxY <= 0 || y >= maxY,
            isAtLeft: x <= 0,
            isAtRight: maxX <= 0 || x >= maxX,
        }
    }

    const {
        scrollLeft: x,
        scrollTop: y,
        scrollWidth,
        scrollHeight,
        clientWidth,
        clientHeight,
    } = target as HTMLElement
    const maxX = Math.max(0, scrollWidth - clientWidth)
    const maxY = Math.max(0, scrollHeight - clientHeight)
    return {
        x,
        y,
        percentX: maxX > 0 ? Math.round((x / maxX) * 100) : 0,
        percentY: maxY > 0 ? Math.round((y / maxY) * 100) : 0,
        isAtTop: y <= 0,
        isAtBottom: maxY <= 0 || y >= maxY,
        isAtLeft: x <= 0,
        isAtRight: maxX <= 0 || x >= maxX,
    }
}

/**
 * Hook to track scroll position, direction, and progress.
 *
 * @param ref - Optional ref to a scrollable element. Defaults to `window`.
 * @param options - Configuration options
 * @returns Current scroll state
 *
 * @example
 * ```tsx
 * // Track window scroll
 * const { y, directionY, percentY, isAtBottom } = useScroll()
 *
 * // Track element scroll
 * const ref = useRef<HTMLDivElement>(null)
 * const { y, percentY } = useScroll(ref)
 * ```
 */
const useScroll = <T extends HTMLElement = HTMLElement>(
    ref?: RefObject<T | null> | null,
    options: UseScrollOptions = {}
): ScrollState => {
    const { throttleMs = 0, enabled = true } = options

    const [state, setState] = useState<ScrollState>(() => ({
        x: 0,
        y: 0,
        directionX: 'none',
        directionY: 'none',
        percentX: 0,
        percentY: 0,
        isAtTop: true,
        isAtBottom: false,
        isAtLeft: true,
        isAtRight: false,
    }))

    const prevPositionRef = useRef({ x: 0, y: 0 })
    const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (!enabled) return
        if (typeof window === 'undefined') return

        const target: HTMLElement | Window = ref?.current ?? window

        const handleScroll = () => {
            if (throttleMs > 0) {
                if (throttleTimerRef.current !== null) return
                throttleTimerRef.current = setTimeout(() => {
                    throttleTimerRef.current = null
                    update()
                }, throttleMs)
            } else {
                update()
            }
        }

        const update = () => {
            const metrics = getScrollMetrics(target)
            const prev = prevPositionRef.current
            const directionX: ScrollState['directionX'] =
                metrics.x > prev.x
                    ? 'right'
                    : metrics.x < prev.x
                    ? 'left'
                    : 'none'
            const directionY: ScrollState['directionY'] =
                metrics.y > prev.y ? 'down' : metrics.y < prev.y ? 'up' : 'none'
            prevPositionRef.current = { x: metrics.x, y: metrics.y }
            setState({ ...metrics, directionX, directionY })
        }

        // Initialise with current position
        update()

        target.addEventListener('scroll', handleScroll, { passive: true })

        return () => {
            target.removeEventListener('scroll', handleScroll)
            if (throttleTimerRef.current !== null) {
                clearTimeout(throttleTimerRef.current)
                throttleTimerRef.current = null
            }
        }
    }, [ref, enabled, throttleMs])

    return state
}

export default useScroll
