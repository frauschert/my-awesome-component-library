import React, {
    useRef,
    useState,
    useCallback,
    useEffect,
    Children,
    cloneElement,
    isValidElement,
} from 'react'
import { classNames } from '../../utility/classnames'
import './SplitPane.scss'

export type SplitDirection = 'horizontal' | 'vertical'
export type SplitPaneSize = number | string

export interface SplitPaneProps {
    /** Split direction */
    direction?: SplitDirection
    /** Initial sizes of panes (percentages or pixels) */
    initialSizes?: SplitPaneSize[]
    /** Minimum size for each pane in pixels */
    minSizes?: number[]
    /** Maximum size for each pane in pixels */
    maxSizes?: number[]
    /** Allow panes to be collapsed */
    collapsible?: boolean | boolean[]
    /** Collapsed state for each pane */
    collapsed?: boolean[]
    /** Callback when sizes change */
    onSizeChange?: (sizes: number[]) => void
    /** Callback when pane is collapsed/expanded */
    onCollapse?: (index: number, collapsed: boolean) => void
    /** Storage key for persisting layout */
    storageKey?: string
    /** Splitter size in pixels */
    splitterSize?: number
    /** Show gutters between panes */
    showGutters?: boolean
    /** Custom gutter content */
    renderGutter?: (index: number, direction: SplitDirection) => React.ReactNode
    /** Children panes */
    children: React.ReactNode
    /** Additional class name */
    className?: string
}

export interface PaneProps {
    /** Minimum size in pixels */
    minSize?: number
    /** Maximum size in pixels */
    maxSize?: number
    /** Is this pane collapsible */
    collapsible?: boolean
    /** Initial collapsed state */
    collapsed?: boolean
    /** Pane content */
    children: React.ReactNode
    /** Additional class name */
    className?: string
}

export const Pane: React.FC<PaneProps> = ({ children, className }) => {
    return (
        <div className={classNames('split-pane__pane', className)}>
            {children}
        </div>
    )
}

export const SplitPane: React.FC<SplitPaneProps> = ({
    direction = 'horizontal',
    initialSizes,
    minSizes = [],
    maxSizes = [],
    collapsible = false,
    collapsed: controlledCollapsed,
    onSizeChange,
    onCollapse,
    storageKey,
    splitterSize = 8,
    showGutters = true,
    renderGutter,
    children,
    className,
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragIndex, setDragIndex] = useState<number>(-1)
    const dragStartPos = useRef<number>(0)
    const initialPaneSizes = useRef<number[]>([])

    const childArray = Children.toArray(children).filter(
        (child) => isValidElement(child) && child.type === Pane
    )
    const paneCount = childArray.length

    // Initialize sizes from storage or props
    const getInitialSizes = useCallback((): number[] => {
        if (storageKey) {
            const stored = localStorage.getItem(storageKey)
            if (stored) {
                try {
                    return JSON.parse(stored)
                } catch (e) {
                    console.warn('Failed to parse stored sizes', e)
                }
            }
        }

        if (initialSizes && initialSizes.length === paneCount) {
            return initialSizes.map((size) => {
                if (typeof size === 'string' && size.endsWith('%')) {
                    return parseFloat(size)
                }
                return Number(size)
            })
        }

        // Equal distribution
        return Array(paneCount).fill(100 / paneCount)
    }, [initialSizes, paneCount, storageKey])

    const [sizes, setSizes] = useState<number[]>(getInitialSizes)
    const [internalCollapsed, setInternalCollapsed] = useState<boolean[]>(
        Array(paneCount).fill(false)
    )

    const isCollapsed =
        controlledCollapsed !== undefined
            ? controlledCollapsed
            : internalCollapsed

    // Save sizes to storage
    useEffect(() => {
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(sizes))
        }
    }, [sizes, storageKey])

    // Get collapsible config for each pane
    const getCollapsible = useCallback(
        (index: number): boolean => {
            if (Array.isArray(collapsible)) {
                return collapsible[index] ?? false
            }
            return collapsible
        },
        [collapsible]
    )

    // Handle pane collapse/expand
    const handleCollapse = useCallback(
        (index: number) => {
            const newCollapsed = [...isCollapsed]
            newCollapsed[index] = !newCollapsed[index]

            if (controlledCollapsed === undefined) {
                setInternalCollapsed(newCollapsed)
            }

            onCollapse?.(index, newCollapsed[index])

            // Redistribute sizes when collapsing/expanding
            if (newCollapsed[index]) {
                // Collapsing: distribute this pane's size to others
                const collapsedSize = sizes[index]
                const newSizes = [...sizes]
                const nonCollapsedCount =
                    sizes.length - newCollapsed.filter(Boolean).length

                newSizes[index] = 0
                const extraPerPane =
                    collapsedSize / (nonCollapsedCount - 1 || 1)

                newSizes.forEach((_, i) => {
                    if (i !== index && !newCollapsed[i]) {
                        newSizes[i] += extraPerPane
                    }
                })

                setSizes(newSizes)
                onSizeChange?.(newSizes)
            } else {
                // Expanding: take space from others proportionally
                const targetSize = 100 / paneCount
                const newSizes = [...sizes]
                const expandingSize = targetSize
                const nonCollapsedPanes = newSizes
                    .map((_, i) => i)
                    .filter((i) => i !== index && !newCollapsed[i])

                newSizes[index] = expandingSize

                const totalToReduce = expandingSize
                const reductionPerPane =
                    totalToReduce / (nonCollapsedPanes.length || 1)

                nonCollapsedPanes.forEach((i) => {
                    newSizes[i] = Math.max(0, newSizes[i] - reductionPerPane)
                })

                setSizes(newSizes)
                onSizeChange?.(newSizes)
            }
        },
        [
            isCollapsed,
            sizes,
            controlledCollapsed,
            onCollapse,
            onSizeChange,
            paneCount,
        ]
    )

    // Start dragging
    const handleMouseDown = useCallback(
        (e: React.MouseEvent, index: number) => {
            e.preventDefault()
            setIsDragging(true)
            setDragIndex(index)

            const pos = direction === 'horizontal' ? e.clientX : e.clientY
            dragStartPos.current = pos
            initialPaneSizes.current = [...sizes]

            document.body.style.cursor =
                direction === 'horizontal' ? 'col-resize' : 'row-resize'
        },
        [direction, sizes]
    )

    // Handle dragging
    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging || dragIndex === -1 || !containerRef.current) return

            const container = containerRef.current
            const containerSize =
                direction === 'horizontal'
                    ? container.offsetWidth
                    : container.offsetHeight
            const currentPos =
                direction === 'horizontal' ? e.clientX : e.clientY
            const delta = currentPos - dragStartPos.current
            const deltaPercent = (delta / containerSize) * 100

            const newSizes = [...initialPaneSizes.current]
            const leftIndex = dragIndex
            const rightIndex = dragIndex + 1

            // Apply min/max constraints
            const minLeft = minSizes[leftIndex] || 50
            const minRight = minSizes[rightIndex] || 50
            const maxLeft = maxSizes[leftIndex] || Infinity
            const maxRight = maxSizes[rightIndex] || Infinity

            const minLeftPercent = (minLeft / containerSize) * 100
            const minRightPercent = (minRight / containerSize) * 100
            const maxLeftPercent = (maxLeft / containerSize) * 100
            const maxRightPercent = (maxRight / containerSize) * 100

            let newLeftSize = newSizes[leftIndex] + deltaPercent
            let newRightSize = newSizes[rightIndex] - deltaPercent

            // Enforce constraints
            if (newLeftSize < minLeftPercent) {
                newLeftSize = minLeftPercent
                newRightSize =
                    newSizes[leftIndex] + newSizes[rightIndex] - minLeftPercent
            } else if (newLeftSize > maxLeftPercent) {
                newLeftSize = maxLeftPercent
                newRightSize =
                    newSizes[leftIndex] + newSizes[rightIndex] - maxLeftPercent
            }

            if (newRightSize < minRightPercent) {
                newRightSize = minRightPercent
                newLeftSize =
                    newSizes[leftIndex] + newSizes[rightIndex] - minRightPercent
            } else if (newRightSize > maxRightPercent) {
                newRightSize = maxRightPercent
                newLeftSize =
                    newSizes[leftIndex] + newSizes[rightIndex] - maxRightPercent
            }

            newSizes[leftIndex] = newLeftSize
            newSizes[rightIndex] = newRightSize

            setSizes(newSizes)
            onSizeChange?.(newSizes)
        },
        [isDragging, dragIndex, direction, minSizes, maxSizes, onSizeChange]
    )

    // Stop dragging
    const handleMouseUp = useCallback(() => {
        if (isDragging) {
            setIsDragging(false)
            setDragIndex(-1)
            document.body.style.cursor = ''
        }
    }, [isDragging])

    // Attach global mouse handlers
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)

            return () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [isDragging, handleMouseMove, handleMouseUp])

    return (
        <div
            ref={containerRef}
            className={classNames(
                'split-pane',
                `split-pane--${direction}`,
                isDragging && 'split-pane--dragging',
                className
            )}
        >
            {childArray.map((child, index) => {
                const isLastPane = index === paneCount - 1
                const isPaneCollapsed = isCollapsed[index]
                const paneCollapsible = getCollapsible(index)

                return (
                    <React.Fragment key={index}>
                        <div
                            className={classNames(
                                'split-pane__pane-wrapper',
                                isPaneCollapsed &&
                                    'split-pane__pane-wrapper--collapsed'
                            )}
                            style={{
                                [direction === 'horizontal'
                                    ? 'width'
                                    : 'height']: isPaneCollapsed
                                    ? '0%'
                                    : `${sizes[index]}%`,
                            }}
                        >
                            {isValidElement(child) && cloneElement(child)}
                        </div>

                        {!isLastPane && showGutters && (
                            <div
                                className={classNames(
                                    'split-pane__gutter',
                                    isDragging &&
                                        dragIndex === index &&
                                        'split-pane__gutter--active'
                                )}
                                style={{
                                    [direction === 'horizontal'
                                        ? 'width'
                                        : 'height']: `${splitterSize}px`,
                                }}
                                onMouseDown={(e) => handleMouseDown(e, index)}
                            >
                                {renderGutter ? (
                                    renderGutter(index, direction)
                                ) : (
                                    <>
                                        <div className="split-pane__gutter-line" />
                                        {paneCollapsible && (
                                            <button
                                                className="split-pane__collapse-btn"
                                                onClick={() =>
                                                    handleCollapse(index)
                                                }
                                                aria-label={
                                                    isPaneCollapsed
                                                        ? 'Expand pane'
                                                        : 'Collapse pane'
                                                }
                                            >
                                                <svg
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 12 12"
                                                    fill="currentColor"
                                                >
                                                    {direction ===
                                                    'horizontal' ? (
                                                        isPaneCollapsed ? (
                                                            <path d="M4 2L8 6L4 10V2Z" />
                                                        ) : (
                                                            <path d="M8 2L4 6L8 10V2Z" />
                                                        )
                                                    ) : isPaneCollapsed ? (
                                                        <path d="M2 4L6 8L10 4H2Z" />
                                                    ) : (
                                                        <path d="M2 8L6 4L10 8H2Z" />
                                                    )}
                                                </svg>
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </React.Fragment>
                )
            })}
        </div>
    )
}

export default SplitPane
