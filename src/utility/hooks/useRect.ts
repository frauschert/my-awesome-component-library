import { RefObject, useCallback, useEffect, useState } from 'react'

export type Rect = {
    top: number
    right: number
    bottom: number
    left: number
    width: number
    height: number
    x: number
    y: number
}

export type UseRectOptions = {
    /** Re-measure on scroll events. Defaults to true. */
    observeScroll?: boolean
    /** Re-measure on resize events. Defaults to true. */
    observeResize?: boolean
}

function getRect(element: HTMLElement): Rect {
    const r = element.getBoundingClientRect()
    return {
        top: r.top,
        right: r.right,
        bottom: r.bottom,
        left: r.left,
        width: r.width,
        height: r.height,
        x: r.x,
        y: r.y,
    }
}

/**
 * Returns the bounding client rect (position + size) of a referenced element,
 * updated on resize and scroll.
 *
 * @param ref - Ref attached to the target element.
 * @param options - Configuration options.
 * @returns A `Rect` object, or `null` before the first measurement.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null)
 * const rect = useRect(ref)
 *
 * return <div ref={ref}>top: {rect?.top}</div>
 */
export default function useRect<T extends HTMLElement>(
    ref: RefObject<T>,
    options: UseRectOptions = {}
): Rect | null {
    const { observeScroll = true, observeResize = true } = options
    const [rect, setRect] = useState<Rect | null>(null)

    const measure = useCallback(() => {
        if (ref.current) {
            setRect(getRect(ref.current))
        }
    }, [ref])

    useEffect(() => {
        if (!ref.current) return

        measure()

        if (!observeResize && !observeScroll) return

        let resizeObserver: ResizeObserver | null = null

        if (observeResize && typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(measure)
            resizeObserver.observe(ref.current)
        }

        if (observeScroll) {
            window.addEventListener('scroll', measure, true)
        }

        if (observeResize) {
            window.addEventListener('resize', measure)
        }

        return () => {
            resizeObserver?.disconnect()
            if (observeScroll) {
                window.removeEventListener('scroll', measure, true)
            }
            if (observeResize) {
                window.removeEventListener('resize', measure)
            }
        }
    }, [ref, measure, observeScroll, observeResize])

    return rect
}
