import React, {
    forwardRef,
    useRef,
    useEffect,
    useCallback,
    ReactNode,
} from 'react'
import { classNames } from '../../utility/classnames'
import useIntersectionObserver from '../../utility/hooks/useIntersectionObserver'
import './InfiniteScroll.scss'

export type InfiniteScrollDirection = 'down' | 'up'

export interface InfiniteScrollProps {
    /** Content to render inside the scroll container */
    children: ReactNode
    /** Callback fired when the sentinel enters the viewport */
    onLoadMore: () => void | Promise<void>
    /** Whether more items are available to load */
    hasMore: boolean
    /** Whether data is currently being loaded */
    isLoading?: boolean
    /** Custom loader component shown while loading */
    loader?: ReactNode
    /** Component shown when there are no more items */
    endMessage?: ReactNode
    /** Scroll direction - load more when scrolling down or up */
    direction?: InfiniteScrollDirection
    /** Root margin for intersection observer (e.g., "100px" to trigger earlier) */
    threshold?: string
    /** Intersection threshold (0-1) for triggering load */
    intersectionThreshold?: number
    /** Use window scroll instead of container scroll */
    useWindow?: boolean
    /** Scrollable ancestor element (for nested scroll containers) */
    scrollableTarget?: HTMLElement | null
    /** Additional CSS class */
    className?: string
    /** Additional inline styles */
    style?: React.CSSProperties
    /** Minimum time between load calls (debounce in ms) */
    debounceMs?: number
    /** Initial load on mount if hasMore is true */
    initialLoad?: boolean
    /** Inverse scroll (for chat-like interfaces) */
    inverse?: boolean
}

/**
 * InfiniteScroll - Automatically loads more content as the user scrolls.
 *
 * Uses IntersectionObserver for efficient scroll detection.
 * Supports both downward and upward infinite scrolling.
 *
 * @example
 * ```tsx
 * const [items, setItems] = useState<Item[]>([])
 * const [hasMore, setHasMore] = useState(true)
 * const [loading, setLoading] = useState(false)
 *
 * const loadMore = async () => {
 *   setLoading(true)
 *   const newItems = await fetchItems(items.length)
 *   setItems(prev => [...prev, ...newItems])
 *   setHasMore(newItems.length > 0)
 *   setLoading(false)
 * }
 *
 * return (
 *   <InfiniteScroll
 *     onLoadMore={loadMore}
 *     hasMore={hasMore}
 *     isLoading={loading}
 *     loader={<Spinner />}
 *     endMessage={<p>No more items</p>}
 *   >
 *     {items.map(item => (
 *       <ItemCard key={item.id} item={item} />
 *     ))}
 *   </InfiniteScroll>
 * )
 * ```
 */
export const InfiniteScroll = forwardRef<HTMLDivElement, InfiniteScrollProps>(
    (
        {
            children,
            onLoadMore,
            hasMore,
            isLoading = false,
            loader,
            endMessage,
            direction = 'down',
            threshold = '200px',
            intersectionThreshold = 0,
            useWindow = false,
            scrollableTarget,
            className,
            style,
            debounceMs = 100,
            initialLoad = false,
            inverse = false,
        },
        ref
    ) => {
        const sentinelRef = useRef<HTMLDivElement>(null)
        const lastLoadTimeRef = useRef<number>(0)
        const isLoadingRef = useRef(isLoading)

        // Keep loading ref in sync
        useEffect(() => {
            isLoadingRef.current = isLoading
        }, [isLoading])

        // Determine root for intersection observer
        const getRoot = useCallback(() => {
            if (useWindow) return null
            if (scrollableTarget) return scrollableTarget
            return null
        }, [useWindow, scrollableTarget])

        // Handle intersection
        const handleIntersection = useCallback(
            (entry: IntersectionObserverEntry) => {
                if (!entry.isIntersecting) return
                if (!hasMore) return
                if (isLoadingRef.current) return

                // Debounce protection
                const now = Date.now()
                if (now - lastLoadTimeRef.current < debounceMs) return
                lastLoadTimeRef.current = now

                onLoadMore()
            },
            [hasMore, onLoadMore, debounceMs]
        )

        // Use intersection observer
        useIntersectionObserver(sentinelRef, {
            root: getRoot(),
            rootMargin:
                direction === 'down'
                    ? `0px 0px ${threshold} 0px`
                    : `${threshold} 0px 0px 0px`,
            threshold: intersectionThreshold,
            onChange: handleIntersection,
        })

        // Initial load
        useEffect(() => {
            if (initialLoad && hasMore && !isLoading) {
                onLoadMore()
            }
            // Only run on mount
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        const containerClasses = classNames(
            'infinite-scroll',
            {
                'infinite-scroll--inverse': inverse,
                'infinite-scroll--loading': isLoading,
                'infinite-scroll--use-window': useWindow,
            },
            className
        )

        const defaultLoader = (
            <div className="infinite-scroll__loader">
                <div className="infinite-scroll__spinner" />
                <span className="infinite-scroll__loader-text">Loading...</span>
            </div>
        )

        const defaultEndMessage = (
            <div className="infinite-scroll__end-message">
                No more items to load
            </div>
        )

        const sentinel = (
            <div
                ref={sentinelRef}
                className="infinite-scroll__sentinel"
                aria-hidden="true"
            />
        )

        const loadingContent = isLoading && (loader || defaultLoader)
        const endContent =
            !hasMore && !isLoading && (endMessage ?? defaultEndMessage)

        return (
            <div ref={ref} className={containerClasses} style={style}>
                {inverse && direction === 'up' && sentinel}
                {inverse && loadingContent}

                <div className="infinite-scroll__content">{children}</div>

                {!inverse && direction === 'up' && sentinel}
                {!inverse && loadingContent}
                {!inverse && direction === 'down' && sentinel}

                {endContent}

                {inverse && direction === 'down' && sentinel}
            </div>
        )
    }
)

InfiniteScroll.displayName = 'InfiniteScroll'

export default InfiniteScroll
