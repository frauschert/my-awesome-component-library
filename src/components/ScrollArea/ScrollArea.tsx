import React, {
    forwardRef,
    useRef,
    useState,
    useEffect,
    useCallback,
    useImperativeHandle,
} from 'react'
import { classNames } from '../../utility/classnames'
import './ScrollArea.scss'

export type ScrollAreaSize = 'sm' | 'md' | 'lg'
export type ScrollAreaType = 'auto' | 'always' | 'hover' | 'scroll'

export interface ScrollAreaProps {
    /** Content to render inside the scroll area */
    children: React.ReactNode
    /** Height of the scroll area (CSS value) */
    height?: string | number
    /** Maximum height before scrolling */
    maxHeight?: string | number
    /** Width of the scroll area */
    width?: string | number
    /** Scrollbar size */
    size?: ScrollAreaSize
    /** When to show scrollbars */
    type?: ScrollAreaType
    /** Enable horizontal scrolling */
    horizontal?: boolean
    /** Enable vertical scrolling (default: true) */
    vertical?: boolean
    /** Scroll offset from edges to show shadow indicators */
    shadowOnScroll?: boolean
    /** Callback when scroll position changes */
    onScroll?: (event: React.UIEvent<HTMLDivElement>) => void
    /** Callback when scrolled to top */
    onScrollToTop?: () => void
    /** Callback when scrolled to bottom */
    onScrollToBottom?: () => void
    /** Callback when scrolled to start (left) */
    onScrollToStart?: () => void
    /** Callback when scrolled to end (right) */
    onScrollToEnd?: () => void
    /** Additional CSS class */
    className?: string
    /** Additional inline styles */
    style?: React.CSSProperties
    /** Content wrapper class */
    contentClassName?: string
    /** Hide scrollbar completely but keep scrolling */
    hideScrollbar?: boolean
    /** Scroll padding (space from content to edge) */
    scrollPadding?: string | number
}

export interface ScrollAreaRef {
    /** Scroll to top */
    scrollToTop: (behavior?: ScrollBehavior) => void
    /** Scroll to bottom */
    scrollToBottom: (behavior?: ScrollBehavior) => void
    /** Scroll to specific position */
    scrollTo: (options: ScrollToOptions) => void
    /** Scroll by delta */
    scrollBy: (options: ScrollToOptions) => void
    /** Get the viewport element */
    getViewport: () => HTMLDivElement | null
    /** Get current scroll position */
    getScrollPosition: () => { top: number; left: number }
}

/**
 * ScrollArea - A container with custom styled scrollbars.
 *
 * Provides consistent scrollbar styling across browsers with
 * configurable appearance and behavior.
 *
 * @example
 * ```tsx
 * <ScrollArea height={300} shadowOnScroll>
 *   <div>Long content that scrolls...</div>
 * </ScrollArea>
 * ```
 *
 * @example
 * ```tsx
 * // With ref for programmatic control
 * const scrollRef = useRef<ScrollAreaRef>(null)
 *
 * <ScrollArea ref={scrollRef} height={400}>
 *   {items.map(item => <Item key={item.id} />)}
 * </ScrollArea>
 *
 * <button onClick={() => scrollRef.current?.scrollToTop('smooth')}>
 *   Back to top
 * </button>
 * ```
 */
export const ScrollArea = forwardRef<ScrollAreaRef, ScrollAreaProps>(
    (
        {
            children,
            height,
            maxHeight,
            width,
            size = 'md',
            type = 'auto',
            horizontal = false,
            vertical = true,
            shadowOnScroll = false,
            onScroll,
            onScrollToTop,
            onScrollToBottom,
            onScrollToStart,
            onScrollToEnd,
            className,
            style,
            contentClassName,
            hideScrollbar = false,
            scrollPadding,
        },
        ref
    ) => {
        const viewportRef = useRef<HTMLDivElement>(null)
        const [showTopShadow, setShowTopShadow] = useState(false)
        const [showBottomShadow, setShowBottomShadow] = useState(false)
        const [showLeftShadow, setShowLeftShadow] = useState(false)
        const [showRightShadow, setShowRightShadow] = useState(false)
        const [isScrolling, setIsScrolling] = useState(false)
        const scrollTimeoutRef =
            useRef<ReturnType<typeof setTimeout>>(undefined)

        // Expose imperative methods
        useImperativeHandle(ref, () => ({
            scrollToTop: (behavior: ScrollBehavior = 'auto') => {
                viewportRef.current?.scrollTo({ top: 0, behavior })
            },
            scrollToBottom: (behavior: ScrollBehavior = 'auto') => {
                if (viewportRef.current) {
                    viewportRef.current.scrollTo({
                        top: viewportRef.current.scrollHeight,
                        behavior,
                    })
                }
            },
            scrollTo: (options: ScrollToOptions) => {
                viewportRef.current?.scrollTo(options)
            },
            scrollBy: (options: ScrollToOptions) => {
                viewportRef.current?.scrollBy(options)
            },
            getViewport: () => viewportRef.current,
            getScrollPosition: () => ({
                top: viewportRef.current?.scrollTop ?? 0,
                left: viewportRef.current?.scrollLeft ?? 0,
            }),
        }))

        const updateShadows = useCallback(() => {
            if (!shadowOnScroll || !viewportRef.current) return

            const {
                scrollTop,
                scrollLeft,
                scrollHeight,
                scrollWidth,
                clientHeight,
                clientWidth,
            } = viewportRef.current

            const threshold = 1 // Small threshold for rounding errors

            if (vertical) {
                setShowTopShadow(scrollTop > threshold)
                setShowBottomShadow(
                    scrollTop < scrollHeight - clientHeight - threshold
                )
            }

            if (horizontal) {
                setShowLeftShadow(scrollLeft > threshold)
                setShowRightShadow(
                    scrollLeft < scrollWidth - clientWidth - threshold
                )
            }
        }, [shadowOnScroll, vertical, horizontal])

        const handleScroll = useCallback(
            (event: React.UIEvent<HTMLDivElement>) => {
                const target = event.currentTarget
                const {
                    scrollTop,
                    scrollLeft,
                    scrollHeight,
                    scrollWidth,
                    clientHeight,
                    clientWidth,
                } = target

                // Update shadows
                updateShadows()

                // Track scrolling state for hover type
                setIsScrolling(true)
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current)
                }
                scrollTimeoutRef.current = setTimeout(() => {
                    setIsScrolling(false)
                }, 150)

                // Edge callbacks
                if (scrollTop === 0) {
                    onScrollToTop?.()
                }
                if (scrollTop >= scrollHeight - clientHeight - 1) {
                    onScrollToBottom?.()
                }
                if (scrollLeft === 0) {
                    onScrollToStart?.()
                }
                if (scrollLeft >= scrollWidth - clientWidth - 1) {
                    onScrollToEnd?.()
                }

                onScroll?.(event)
            },
            [
                updateShadows,
                onScroll,
                onScrollToTop,
                onScrollToBottom,
                onScrollToStart,
                onScrollToEnd,
            ]
        )

        // Initial shadow calculation
        useEffect(() => {
            updateShadows()
        }, [updateShadows, children])

        // Cleanup timeout
        useEffect(() => {
            return () => {
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current)
                }
            }
        }, [])

        const containerClasses = classNames(
            'scroll-area',
            `scroll-area--size-${size}`,
            `scroll-area--type-${type}`,
            {
                'scroll-area--horizontal': horizontal,
                'scroll-area--vertical': vertical,
                'scroll-area--hide-scrollbar': hideScrollbar,
                'scroll-area--shadow-top': showTopShadow,
                'scroll-area--shadow-bottom': showBottomShadow,
                'scroll-area--shadow-left': showLeftShadow,
                'scroll-area--shadow-right': showRightShadow,
                'scroll-area--scrolling': isScrolling,
            },
            className
        )

        const containerStyle: React.CSSProperties = {
            ...style,
            height: typeof height === 'number' ? `${height}px` : height,
            maxHeight:
                typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
            width: typeof width === 'number' ? `${width}px` : width,
        }

        const viewportStyle: React.CSSProperties = {
            padding:
                typeof scrollPadding === 'number'
                    ? `${scrollPadding}px`
                    : scrollPadding,
        }

        return (
            <div className={containerClasses} style={containerStyle}>
                {shadowOnScroll && (
                    <>
                        <div className="scroll-area__shadow scroll-area__shadow--top" />
                        <div className="scroll-area__shadow scroll-area__shadow--bottom" />
                        <div className="scroll-area__shadow scroll-area__shadow--left" />
                        <div className="scroll-area__shadow scroll-area__shadow--right" />
                    </>
                )}
                <div
                    ref={viewportRef}
                    className={classNames(
                        'scroll-area__viewport',
                        contentClassName
                    )}
                    style={viewportStyle}
                    onScroll={handleScroll}
                >
                    {children}
                </div>
            </div>
        )
    }
)

ScrollArea.displayName = 'ScrollArea'

export default ScrollArea
