import { RefObject, useEffect, useState } from 'react'

export type ResizeObserverEntry = {
    contentRect: DOMRectReadOnly
    borderBoxSize?: ReadonlyArray<ResizeObserverSize>
    contentBoxSize?: ReadonlyArray<ResizeObserverSize>
    devicePixelContentBoxSize?: ReadonlyArray<ResizeObserverSize>
}

export type UseResizeObserverOptions = {
    box?: 'border-box' | 'content-box' | 'device-pixel-content-box'
    onResize?: (entry: ResizeObserverEntry) => void
}

/**
 * useResizeObserver observes size changes of an element using the modern ResizeObserver API.
 * This hook provides more accurate and performant resize detection compared to window.resize events.
 *
 * @param ref - Reference to the element to observe
 * @param options - Optional configuration
 * @returns The latest ResizeObserverEntry or null if not yet observed
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null)
 * const entry = useResizeObserver(ref)
 *
 * return (
 *   <div ref={ref}>
 *     Width: {entry?.contentRect.width}px
 *   </div>
 * )
 * ```
 */
export default function useResizeObserver<T extends HTMLElement>(
    ref: RefObject<T>,
    options: UseResizeObserverOptions = {}
): ResizeObserverEntry | null {
    const { box = 'content-box', onResize } = options
    const [entry, setEntry] = useState<ResizeObserverEntry | null>(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        // Check if ResizeObserver is supported
        if (typeof ResizeObserver === 'undefined') {
            console.warn('ResizeObserver is not supported in this browser')
            return
        }

        const observer = new ResizeObserver(
            (entries: globalThis.ResizeObserverEntry[]) => {
                if (entries.length === 0) return

                const observerEntry = entries[0]
                const customEntry: ResizeObserverEntry = {
                    contentRect: observerEntry.contentRect,
                    borderBoxSize: observerEntry.borderBoxSize,
                    contentBoxSize: observerEntry.contentBoxSize,
                    devicePixelContentBoxSize:
                        observerEntry.devicePixelContentBoxSize,
                }

                setEntry(customEntry)
                onResize?.(customEntry)
            }
        )

        observer.observe(element, { box })

        return () => {
            observer.disconnect()
        }
    }, [ref, box, onResize])

    return entry
}
