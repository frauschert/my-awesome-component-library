import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseDraggableOptions {
    initialPosition?: { x: number; y: number }
    bounds?:
        | 'parent'
        | 'window'
        | { left?: number; right?: number; top?: number; bottom?: number }
    axis?: 'x' | 'y' | 'both'
    grid?: [number, number]
    disabled?: boolean
    handle?: string // CSS selector for drag handle
    cancel?: string // CSS selector for elements that shouldn't trigger drag
    onDragStart?: (position: { x: number; y: number }) => void
    onDrag?: (position: { x: number; y: number }) => void
    onDragEnd?: (position: { x: number; y: number }) => void
}

export interface UseDraggableReturn<T extends HTMLElement = HTMLElement> {
    position: { x: number; y: number }
    isDragging: boolean
    ref: React.RefCallback<T | null>
    setPosition: (position: { x: number; y: number }) => void
    reset: () => void
}

/**
 * Hook for making elements draggable.
 * Provides position tracking, constraints, and callbacks.
 *
 * @param options - Configuration options
 * @returns Object with position, dragging state, ref, and control functions
 *
 * @example
 * ```tsx
 * const { ref, position, isDragging } = useDraggable({
 *   initialPosition: { x: 0, y: 0 },
 *   bounds: 'parent'
 * })
 *
 * <div ref={ref} style={{ transform: `translate(${position.x}px, ${position.y}px)` }}>
 *   Drag me!
 * </div>
 * ```
 */
export default function useDraggable<T extends HTMLElement = HTMLElement>(
    options: UseDraggableOptions = {}
): UseDraggableReturn<T> {
    const {
        initialPosition = { x: 0, y: 0 },
        bounds,
        axis = 'both',
        grid,
        disabled = false,
        handle,
        cancel,
        onDragStart,
        onDrag,
        onDragEnd,
    } = options

    const [position, setPosition] = useState(initialPosition)
    const [isDragging, setIsDragging] = useState(false)
    const [element, setElement] = useState<T | null>(null)

    // Use callback ref to track element changes
    const ref = useCallback((node: T | null) => {
        setElement(node)
    }, [])
    const dragStartPos = useRef({ x: 0, y: 0 })
    const elementStartPos = useRef({ x: 0, y: 0 })

    // Apply grid snapping
    const applyGrid = useCallback(
        (x: number, y: number): { x: number; y: number } => {
            if (!grid) return { x, y }

            const [gridX, gridY] = grid
            return {
                x: Math.round(x / gridX) * gridX,
                y: Math.round(y / gridY) * gridY,
            }
        },
        [grid]
    )

    // Apply bounds constraints
    const applyBounds = useCallback(
        (x: number, y: number): { x: number; y: number } => {
            if (!bounds || !element) return { x, y }

            const rect = element.getBoundingClientRect()

            let constrainedX = x
            let constrainedY = y

            if (bounds === 'parent' && element.parentElement) {
                const parentRect = element.parentElement.getBoundingClientRect()
                constrainedX = Math.max(
                    0,
                    Math.min(x, parentRect.width - rect.width)
                )
                constrainedY = Math.max(
                    0,
                    Math.min(y, parentRect.height - rect.height)
                )
            } else if (bounds === 'window') {
                constrainedX = Math.max(
                    0,
                    Math.min(x, window.innerWidth - rect.width)
                )
                constrainedY = Math.max(
                    0,
                    Math.min(y, window.innerHeight - rect.height)
                )
            } else if (typeof bounds === 'object') {
                if (bounds.left !== undefined) {
                    constrainedX = Math.max(bounds.left, constrainedX)
                }
                if (bounds.right !== undefined) {
                    constrainedX = Math.min(bounds.right, constrainedX)
                }
                if (bounds.top !== undefined) {
                    constrainedY = Math.max(bounds.top, constrainedY)
                }
                if (bounds.bottom !== undefined) {
                    constrainedY = Math.min(bounds.bottom, constrainedY)
                }
            }

            return { x: constrainedX, y: constrainedY }
        },
        [bounds, element]
    )

    // Apply axis constraints
    const applyAxis = useCallback(
        (
            x: number,
            y: number,
            startX: number,
            startY: number
        ): { x: number; y: number } => {
            if (axis === 'x') return { x, y: startY }
            if (axis === 'y') return { x: startX, y }
            return { x, y }
        },
        [axis]
    )

    // Check if element matches selector
    const matchesSelector = (element: Element, selector: string): boolean => {
        return element.matches(selector) || element.closest(selector) !== null
    }

    // Handle mouse/touch start
    const handleStart = useCallback(
        (clientX: number, clientY: number, target: EventTarget | null) => {
            if (disabled || !element) return false

            const targetElement = target as Element

            // Check cancel selector
            if (
                cancel &&
                targetElement &&
                matchesSelector(targetElement, cancel)
            ) {
                return false
            }

            // Check handle selector
            if (
                handle &&
                targetElement &&
                !matchesSelector(targetElement, handle)
            ) {
                return false
            }

            dragStartPos.current = { x: clientX, y: clientY }
            elementStartPos.current = { ...position }

            setIsDragging(true)
            onDragStart?.(position)

            return true
        },
        [disabled, cancel, handle, position, onDragStart, element]
    )

    // Handle mouse/touch move
    const handleMove = useCallback(
        (clientX: number, clientY: number) => {
            if (!isDragging) return

            const deltaX = clientX - dragStartPos.current.x
            const deltaY = clientY - dragStartPos.current.y

            let newX = elementStartPos.current.x + deltaX
            let newY = elementStartPos.current.y + deltaY

            // Apply axis constraints
            const axisConstrained = applyAxis(
                newX,
                newY,
                elementStartPos.current.x,
                elementStartPos.current.y
            )
            newX = axisConstrained.x
            newY = axisConstrained.y

            // Apply grid snapping
            const gridSnapped = applyGrid(newX, newY)
            newX = gridSnapped.x
            newY = gridSnapped.y

            // Apply bounds
            const boundsConstrained = applyBounds(newX, newY)
            newX = boundsConstrained.x
            newY = boundsConstrained.y

            const newPosition = { x: newX, y: newY }
            setPosition(newPosition)
            onDrag?.(newPosition)
        },
        [isDragging, applyAxis, applyGrid, applyBounds, onDrag]
    )

    // Handle mouse/touch end
    const handleEnd = useCallback(() => {
        if (!isDragging) return

        setIsDragging(false)
        onDragEnd?.(position)
    }, [isDragging, position, onDragEnd])

    // Mouse event handlers
    const handleMouseDown = useCallback(
        (e: MouseEvent) => {
            if (handleStart(e.clientX, e.clientY, e.target)) {
                e.preventDefault()
            }
        },
        [handleStart]
    )

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            handleMove(e.clientX, e.clientY)
        },
        [handleMove]
    )

    const handleMouseUp = useCallback(() => {
        handleEnd()
    }, [handleEnd])

    // Touch event handlers
    const handleTouchStart = useCallback(
        (e: TouchEvent) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0]
                if (handleStart(touch.clientX, touch.clientY, e.target)) {
                    e.preventDefault()
                }
            }
        },
        [handleStart]
    )

    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0]
                handleMove(touch.clientX, touch.clientY)
            }
        },
        [handleMove]
    )

    const handleTouchEnd = useCallback(() => {
        handleEnd()
    }, [handleEnd])

    // Setup event listeners
    useEffect(() => {
        if (!element || disabled) return

        element.addEventListener('mousedown', handleMouseDown)
        element.addEventListener('touchstart', handleTouchStart, {
            passive: false,
        })

        return () => {
            element.removeEventListener('mousedown', handleMouseDown)
            element.removeEventListener('touchstart', handleTouchStart)
        }
    }, [element, disabled, handleMouseDown, handleTouchStart])

    // Setup document event listeners during drag
    useEffect(() => {
        if (!isDragging) return

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('touchmove', handleTouchMove, {
            passive: false,
        })
        document.addEventListener('touchend', handleTouchEnd)
        document.addEventListener('touchcancel', handleTouchEnd)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('touchmove', handleTouchMove)
            document.removeEventListener('touchend', handleTouchEnd)
            document.removeEventListener('touchcancel', handleTouchEnd)
        }
    }, [
        isDragging,
        handleMouseMove,
        handleMouseUp,
        handleTouchMove,
        handleTouchEnd,
    ])

    // Reset position
    const reset = useCallback(() => {
        setPosition(initialPosition)
    }, [initialPosition])

    return {
        position,
        isDragging,
        ref,
        setPosition,
        reset,
    }
}
