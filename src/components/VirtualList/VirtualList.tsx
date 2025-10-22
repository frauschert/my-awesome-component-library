import React, { useState, useRef, useEffect, useCallback } from 'react'
import './virtuallist.scss'
import { classNames } from '../../utility/classnames'

export interface VirtualListProps<T = any> {
    /** Array of items to render */
    items: T[]
    /** Height of each item in pixels */
    itemHeight: number
    /** Height of the visible container */
    height: number
    /** Width of the container */
    width?: number | string
    /** Number of items to render outside visible area (buffer) */
    overscan?: number
    /** Render function for each item */
    renderItem: (item: T, index: number) => React.ReactNode
    /** Callback when scroll position changes */
    onScroll?: (scrollTop: number) => void
    /** Callback when scrolling near end (for infinite scroll) */
    onEndReached?: () => void
    /** Threshold for onEndReached (items from end) */
    endReachedThreshold?: number
    /** Loading state */
    loading?: boolean
    /** Custom loader component */
    loader?: React.ReactNode
    /** Empty state component */
    emptyState?: React.ReactNode
    /** Scroll to index */
    scrollToIndex?: number
    /** Additional CSS class */
    className?: string
    /** Additional styles */
    style?: React.CSSProperties
}

export const VirtualList = <T,>({
    items,
    itemHeight,
    height,
    width = '100%',
    overscan = 3,
    renderItem,
    onScroll,
    onEndReached,
    endReachedThreshold = 5,
    loading = false,
    loader,
    emptyState,
    scrollToIndex,
    className,
    style,
}: VirtualListProps<T>) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [scrollTop, setScrollTop] = useState(0)
    const [hasReachedEnd, setHasReachedEnd] = useState(false)

    const totalHeight = items.length * itemHeight
    const visibleItemCount = Math.ceil(height / itemHeight)
    const startIndex = Math.max(
        0,
        Math.floor(scrollTop / itemHeight) - overscan
    )
    const endIndex = Math.min(
        items.length - 1,
        Math.floor((scrollTop + height) / itemHeight) + overscan
    )

    const visibleItems = items.slice(startIndex, endIndex + 1)
    const offsetY = startIndex * itemHeight

    const handleScroll = useCallback(
        (event: React.UIEvent<HTMLDivElement>) => {
            const target = event.currentTarget
            const newScrollTop = target.scrollTop
            setScrollTop(newScrollTop)
            onScroll?.(newScrollTop)

            // Check if near end
            const scrollBottom = newScrollTop + height
            const nearEnd =
                totalHeight - scrollBottom <= endReachedThreshold * itemHeight

            if (nearEnd && !hasReachedEnd && !loading) {
                setHasReachedEnd(true)
                onEndReached?.()
            } else if (!nearEnd && hasReachedEnd) {
                setHasReachedEnd(false)
            }
        },
        [
            height,
            totalHeight,
            itemHeight,
            endReachedThreshold,
            hasReachedEnd,
            loading,
            onScroll,
            onEndReached,
        ]
    )

    // Scroll to specific index
    useEffect(() => {
        if (scrollToIndex !== undefined && containerRef.current) {
            const targetScrollTop = scrollToIndex * itemHeight
            containerRef.current.scrollTop = targetScrollTop
            setScrollTop(targetScrollTop)
        }
    }, [scrollToIndex, itemHeight])

    const containerClasses = classNames('virtual-list', className)

    // Show empty state
    if (items.length === 0 && !loading) {
        return (
            <div
                className={classNames(containerClasses, 'virtual-list--empty')}
                style={{ ...style, height, width }}
            >
                {emptyState || (
                    <div className="virtual-list__empty-state">
                        No items to display
                    </div>
                )}
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className={containerClasses}
            style={{ ...style, height, width }}
            onScroll={handleScroll}
        >
            <div
                className="virtual-list__content"
                style={{ height: totalHeight }}
            >
                <div
                    className="virtual-list__items"
                    style={{ transform: `translateY(${offsetY}px)` }}
                >
                    {visibleItems.map((item, index) => {
                        const actualIndex = startIndex + index
                        return (
                            <div
                                key={actualIndex}
                                className="virtual-list__item"
                                style={{ height: itemHeight }}
                            >
                                {renderItem(item, actualIndex)}
                            </div>
                        )
                    })}
                </div>
            </div>
            {loading && (
                <div className="virtual-list__loader">
                    {loader || (
                        <div className="virtual-list__spinner">Loading...</div>
                    )}
                </div>
            )}
        </div>
    )
}

export default VirtualList
