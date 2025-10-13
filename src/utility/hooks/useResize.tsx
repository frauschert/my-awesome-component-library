import React, {
    RefObject,
    useCallback,
    useState,
    useRef,
    useEffect,
} from 'react'

export type ResizeDirection =
    | 'top'
    | 'right'
    | 'bottom'
    | 'left'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'

const CURSOR_MAP: Record<ResizeDirection, string> = {
    top: 'ns-resize',
    right: 'ew-resize',
    bottom: 'ns-resize',
    left: 'ew-resize',
    topLeft: 'nwse-resize',
    topRight: 'nesw-resize',
    bottomLeft: 'nesw-resize',
    bottomRight: 'nwse-resize',
}

export type ResizeOptions = {
    step?: number
    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
    onResize?: (size: { width: number; height: number }) => void
    onResizeStart?: (size: { width: number; height: number }) => void
    onResizeEnd?: (size: { width: number; height: number }) => void
    preserveAspectRatio?: boolean
}

export type UseResizeReturn = {
    size: { width: number; height: number }
    isResizing: boolean
    createResizeHandler: (
        direction: ResizeDirection
    ) => (event: React.PointerEvent<HTMLElement>) => void
    getCursor: (direction: ResizeDirection) => string
}

export const useResize = (
    ref: RefObject<HTMLElement | null>,
    options: ResizeOptions = {}
): UseResizeReturn => {
    const {
        step = 1,
        minWidth = 50,
        minHeight = 50,
        maxWidth = Infinity,
        maxHeight = Infinity,
        onResize,
        onResizeStart,
        onResizeEnd,
        preserveAspectRatio = false,
    } = options

    const [size, setSize] = useState({ width: 0, height: 0 })
    const [isResizing, setIsResizing] = useState(false)

    // Store callbacks and options in refs to avoid recreating listeners
    const onResizeRef = useRef(onResize)
    const onResizeStartRef = useRef(onResizeStart)
    const onResizeEndRef = useRef(onResizeEnd)
    const optionsRef = useRef({
        step,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        preserveAspectRatio,
    })

    // Update refs when values change
    useEffect(() => {
        onResizeRef.current = onResize
        onResizeStartRef.current = onResizeStart
        onResizeEndRef.current = onResizeEnd
        optionsRef.current = {
            step,
            minWidth,
            minHeight,
            maxWidth,
            maxHeight,
            preserveAspectRatio,
        }
    }, [
        onResize,
        onResizeStart,
        onResizeEnd,
        step,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        preserveAspectRatio,
    ])

    // Use refs to track resize state
    const resizeStateRef = useRef<{
        isResizing: boolean
        direction: ResizeDirection | null
        startX: number
        startY: number
        startWidth: number
        startHeight: number
        aspectRatio: number
    }>({
        isResizing: false,
        direction: null,
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        aspectRatio: 1,
    })

    // Create stable event handler refs
    const handlersRef = useRef({
        handlePointerMove: (event: PointerEvent) => {
            if (!resizeStateRef.current.isResizing || !ref.current) return

            const {
                direction,
                startX,
                startY,
                startWidth,
                startHeight,
                aspectRatio,
            } = resizeStateRef.current

            if (!direction) return

            const opts = optionsRef.current
            const deltaX = event.clientX - startX
            const deltaY = event.clientY - startY

            let newWidth = startWidth
            let newHeight = startHeight

            // Calculate new dimensions based on direction
            switch (direction) {
                case 'right':
                    newWidth = startWidth + deltaX
                    break
                case 'left':
                    newWidth = startWidth - deltaX
                    break
                case 'bottom':
                    newHeight = startHeight + deltaY
                    break
                case 'top':
                    newHeight = startHeight - deltaY
                    break
                case 'bottomRight':
                    newWidth = startWidth + deltaX
                    newHeight = startHeight + deltaY
                    break
                case 'bottomLeft':
                    newWidth = startWidth - deltaX
                    newHeight = startHeight + deltaY
                    break
                case 'topRight':
                    newWidth = startWidth + deltaX
                    newHeight = startHeight - deltaY
                    break
                case 'topLeft':
                    newWidth = startWidth - deltaX
                    newHeight = startHeight - deltaY
                    break
            }

            // Preserve aspect ratio if enabled
            if (
                opts.preserveAspectRatio &&
                (direction.includes('top') || direction.includes('bottom'))
            ) {
                if (direction.includes('Right') || direction.includes('Left')) {
                    const widthBasedHeight = newWidth / aspectRatio
                    const heightBasedWidth = newHeight * aspectRatio

                    if (
                        Math.abs(newWidth - startWidth) >
                        Math.abs(newHeight - startHeight)
                    ) {
                        newHeight = widthBasedHeight
                    } else {
                        newWidth = heightBasedWidth
                    }
                }
            }

            // Apply step snapping
            newWidth = Math.round(newWidth / opts.step) * opts.step
            newHeight = Math.round(newHeight / opts.step) * opts.step

            // Apply constraints
            newWidth = Math.max(
                opts.minWidth,
                Math.min(opts.maxWidth, newWidth)
            )
            newHeight = Math.max(
                opts.minHeight,
                Math.min(opts.maxHeight, newHeight)
            )

            // Apply the new size
            ref.current.style.width = `${newWidth}px`
            ref.current.style.height = `${newHeight}px`

            const newSize = { width: newWidth, height: newHeight }
            setSize(newSize)
            onResizeRef.current?.(newSize)
        },
        handlePointerUp: () => {
            if (!resizeStateRef.current.isResizing) return

            const finalSize = {
                width: resizeStateRef.current.startWidth,
                height: resizeStateRef.current.startHeight,
            }

            // Get actual final size from element
            if (ref.current) {
                const computedStyle = window.getComputedStyle(ref.current)
                finalSize.width = parseFloat(computedStyle.width)
                finalSize.height = parseFloat(computedStyle.height)
            }

            resizeStateRef.current.isResizing = false
            resizeStateRef.current.direction = null
            setIsResizing(false)

            // Remove event listeners
            document.removeEventListener(
                'pointermove',
                handlersRef.current.handlePointerMove
            )
            document.removeEventListener(
                'pointerup',
                handlersRef.current.handlePointerUp
            )

            // Release pointer capture
            document.body.style.cursor = ''
            document.body.style.userSelect = ''

            onResizeEndRef.current?.(finalSize)
        },
    })

    const createResizeHandler = useCallback(
        (direction: ResizeDirection) =>
            (event: React.PointerEvent<HTMLElement>) => {
                if (!ref.current) return

                event.preventDefault()
                event.stopPropagation()

                // Get current dimensions
                const computedStyle = window.getComputedStyle(ref.current)
                const currentWidth = parseFloat(computedStyle.width)
                const currentHeight = parseFloat(computedStyle.height)

                // Initialize resize state
                resizeStateRef.current = {
                    isResizing: true,
                    direction,
                    startX: event.clientX,
                    startY: event.clientY,
                    startWidth: currentWidth,
                    startHeight: currentHeight,
                    aspectRatio: currentWidth / currentHeight,
                }

                setIsResizing(true)
                setSize({ width: currentWidth, height: currentHeight })

                // Set cursor and prevent text selection
                document.body.style.cursor = CURSOR_MAP[direction]
                document.body.style.userSelect = 'none'

                // Add event listeners using stable references
                document.addEventListener(
                    'pointermove',
                    handlersRef.current.handlePointerMove
                )
                document.addEventListener(
                    'pointerup',
                    handlersRef.current.handlePointerUp
                )

                onResizeStartRef.current?.({
                    width: currentWidth,
                    height: currentHeight,
                })
            },
        [ref]
    )

    const getCursor = useCallback((direction: ResizeDirection): string => {
        return CURSOR_MAP[direction]
    }, [])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (resizeStateRef.current.isResizing) {
                document.removeEventListener(
                    'pointermove',
                    handlersRef.current.handlePointerMove
                )
                document.removeEventListener(
                    'pointerup',
                    handlersRef.current.handlePointerUp
                )
                document.body.style.cursor = ''
                document.body.style.userSelect = ''
            }
        }
    }, [])

    return {
        size,
        isResizing,
        createResizeHandler,
        getCursor,
    }
}
