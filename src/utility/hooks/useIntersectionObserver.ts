import { RefObject, useEffect, useState } from 'react'

export type UseIntersectionObserverOptions = {
    root?: Element | null
    rootMargin?: string
    threshold?: number | number[]
    freezeOnceVisible?: boolean
    onChange?: (entry: IntersectionObserverEntry) => void
}

/**
 * useIntersectionObserver observes visibility changes of an element using the IntersectionObserver API.
 * Provides more control and flexibility than useOnScreen with full access to IntersectionObserver options.
 *
 * @param ref - Reference to the element to observe
 * @param options - IntersectionObserver configuration options
 * @returns The latest IntersectionObserverEntry or null if not yet observed
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null)
 * const entry = useIntersectionObserver(ref, { threshold: 0.5 })
 * const isVisible = entry?.isIntersecting
 *
 * return (
 *   <div ref={ref}>
 *     {isVisible ? 'Visible!' : 'Not visible'}
 *   </div>
 * )
 * ```
 */
export default function useIntersectionObserver<T extends HTMLElement>(
    ref: RefObject<T>,
    options: UseIntersectionObserverOptions = {}
): IntersectionObserverEntry | null {
    const {
        root = null,
        rootMargin = '0px',
        threshold = 0,
        freezeOnceVisible = false,
        onChange,
    } = options

    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

    const frozen = freezeOnceVisible && entry?.isIntersecting

    useEffect(() => {
        const element = ref.current

        // Don't observe if frozen or no element
        if (frozen || !element) return

        // Check if IntersectionObserver is supported
        if (typeof IntersectionObserver === 'undefined') {
            console.warn(
                'IntersectionObserver is not supported in this browser'
            )
            return
        }

        const observer = new IntersectionObserver(
            ([entry]: IntersectionObserverEntry[]) => {
                setEntry(entry)
                onChange?.(entry)
            },
            { root, rootMargin, threshold }
        )

        observer.observe(element)

        return () => {
            observer.disconnect()
        }
    }, [ref, root, rootMargin, threshold, frozen, onChange])

    return entry
}
