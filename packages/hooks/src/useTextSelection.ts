import { useState, useEffect, useCallback, RefObject } from 'react'

export interface TextSelectionState {
    text: string
    rects: DOMRect[]
    ranges: Range[]
    selection: Selection | null
    hasSelection: boolean
    isCollapsed: boolean
    anchorNode: Node | null
    anchorOffset: number
    focusNode: Node | null
    focusOffset: number
}

export interface UseTextSelectionOptions {
    ref?: RefObject<HTMLElement>
    isEnabled?: boolean
}

const EMPTY_STATE: TextSelectionState = {
    text: '',
    rects: [],
    ranges: [],
    selection: null,
    hasSelection: false,
    isCollapsed: true,
    anchorNode: null,
    anchorOffset: 0,
    focusNode: null,
    focusOffset: 0,
}

/**
 * Hook for tracking text selection in the document or within a specific element.
 * Provides detailed information about the current selection including text, position, and ranges.
 *
 * @param options - Configuration options
 * @returns Current selection state
 *
 * @example
 * ```tsx
 * // Track selection in entire document
 * const selection = useTextSelection()
 *
 * return (
 *   <div>
 *     {selection.hasSelection && (
 *       <div>Selected: {selection.text}</div>
 *     )}
 *   </div>
 * )
 * ```
 *
 * @example
 * ```tsx
 * // Track selection within specific element
 * const ref = useRef<HTMLDivElement>(null)
 * const selection = useTextSelection({ ref })
 *
 * return (
 *   <div ref={ref}>
 *     <p>Select text in this container</p>
 *     {selection.hasSelection && (
 *       <Tooltip style={{
 *         top: selection.rects[0]?.top,
 *         left: selection.rects[0]?.left
 *       }}>
 *         Selected: {selection.text}
 *       </Tooltip>
 *     )}
 *   </div>
 * )
 * ```
 */
export default function useTextSelection(
    options: UseTextSelectionOptions = {}
): TextSelectionState {
    const { ref, isEnabled = true } = options
    const [state, setState] = useState<TextSelectionState>(EMPTY_STATE)

    const getSelectionState = useCallback((): TextSelectionState => {
        const selection = window.getSelection()

        if (!selection || selection.rangeCount === 0) {
            return EMPTY_STATE
        }

        // If ref is provided, check if selection is within the ref element
        if (ref?.current) {
            const range = selection.getRangeAt(0)
            const container = ref.current

            // Check if selection is within container
            const isWithinContainer =
                container.contains(range.commonAncestorContainer) ||
                range.commonAncestorContainer === container

            if (!isWithinContainer) {
                return EMPTY_STATE
            }
        }

        const text = selection.toString()
        const hasSelection = text.length > 0
        const isCollapsed = selection.isCollapsed

        // Get all ranges
        const ranges: Range[] = []
        for (let i = 0; i < selection.rangeCount; i++) {
            ranges.push(selection.getRangeAt(i))
        }

        // Get bounding rectangles for each range
        const rects: DOMRect[] = []
        for (const range of ranges) {
            const rangeRects = range.getClientRects()
            for (let i = 0; i < rangeRects.length; i++) {
                rects.push(rangeRects[i])
            }
        }

        return {
            text,
            rects,
            ranges,
            selection,
            hasSelection,
            isCollapsed,
            anchorNode: selection.anchorNode,
            anchorOffset: selection.anchorOffset,
            focusNode: selection.focusNode,
            focusOffset: selection.focusOffset,
        }
    }, [ref])

    const handleSelectionChange = useCallback(() => {
        if (!isEnabled) {
            return
        }

        const newState = getSelectionState()
        setState(newState)
    }, [isEnabled, getSelectionState])

    const handleMouseUp = useCallback(() => {
        if (!isEnabled) {
            return
        }

        // Use setTimeout to ensure selection has been finalized
        setTimeout(() => {
            const newState = getSelectionState()
            setState(newState)
        }, 0)
    }, [isEnabled, getSelectionState])

    useEffect(() => {
        if (!isEnabled) {
            setState(EMPTY_STATE)
            return
        }

        // Listen to selectionchange event on document
        document.addEventListener('selectionchange', handleSelectionChange)

        // Also listen to mouseup for immediate feedback
        document.addEventListener('mouseup', handleMouseUp)

        // Listen on the ref element if provided
        const element = ref?.current
        if (element) {
            element.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            document.removeEventListener(
                'selectionchange',
                handleSelectionChange
            )
            document.removeEventListener('mouseup', handleMouseUp)
            if (element) {
                element.removeEventListener('mouseup', handleMouseUp)
            }
        }
    }, [isEnabled, ref, handleSelectionChange, handleMouseUp])

    return state
}
