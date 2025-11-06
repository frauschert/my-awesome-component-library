import { renderHook, act } from '@testing-library/react'
import { useRef } from 'react'
import useTextSelection from '../useTextSelection'

// Mock window.getSelection
const mockSelection = {
    toString: jest.fn(),
    rangeCount: 0,
    getRangeAt: jest.fn(),
    isCollapsed: true,
    anchorNode: null,
    anchorOffset: 0,
    focusNode: null,
    focusOffset: 0,
}

const mockRange = {
    commonAncestorContainer: document.body,
    getClientRects: jest.fn(() => []),
}

describe('useTextSelection', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        window.getSelection = jest.fn(
            () => mockSelection as unknown as Selection
        )
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe('initialization', () => {
        it('should initialize with empty state', () => {
            const { result } = renderHook(() => useTextSelection())

            expect(result.current.text).toBe('')
            expect(result.current.hasSelection).toBe(false)
            expect(result.current.isCollapsed).toBe(true)
            expect(result.current.rects).toEqual([])
            expect(result.current.ranges).toEqual([])
        })

        it('should respect isEnabled option', () => {
            const { result } = renderHook(() =>
                useTextSelection({ isEnabled: false })
            )

            expect(result.current.text).toBe('')
            expect(result.current.hasSelection).toBe(false)
        })
    })

    describe('selection tracking', () => {
        it('should detect text selection', () => {
            mockSelection.toString.mockReturnValue('selected text')
            mockSelection.rangeCount = 1
            mockSelection.isCollapsed = false
            mockSelection.getRangeAt.mockReturnValue(
                mockRange as unknown as Range
            )

            const { result } = renderHook(() => useTextSelection())

            act(() => {
                const event = new Event('selectionchange')
                document.dispatchEvent(event)
            })

            expect(result.current.text).toBe('selected text')
            expect(result.current.hasSelection).toBe(true)
            expect(result.current.isCollapsed).toBe(false)
        })

        it('should detect empty selection', () => {
            mockSelection.toString.mockReturnValue('')
            mockSelection.rangeCount = 0
            mockSelection.isCollapsed = true

            const { result } = renderHook(() => useTextSelection())

            act(() => {
                const event = new Event('selectionchange')
                document.dispatchEvent(event)
            })

            expect(result.current.text).toBe('')
            expect(result.current.hasSelection).toBe(false)
            expect(result.current.isCollapsed).toBe(true)
        })

        it('should handle mouseup event', async () => {
            mockSelection.toString.mockReturnValue('clicked text')
            mockSelection.rangeCount = 1
            mockSelection.isCollapsed = false
            mockSelection.getRangeAt.mockReturnValue(
                mockRange as unknown as Range
            )

            const { result } = renderHook(() => useTextSelection())

            await act(async () => {
                const event = new MouseEvent('mouseup')
                document.dispatchEvent(event)
                // Wait for setTimeout
                await new Promise((resolve) => setTimeout(resolve, 10))
            })

            expect(result.current.text).toBe('clicked text')
            expect(result.current.hasSelection).toBe(true)
        })

        it('should clear selection when no selection exists', () => {
            // First set a selection
            mockSelection.toString.mockReturnValue('text')
            mockSelection.rangeCount = 1
            mockSelection.getRangeAt.mockReturnValue(
                mockRange as unknown as Range
            )

            const { result } = renderHook(() => useTextSelection())

            act(() => {
                document.dispatchEvent(new Event('selectionchange'))
            })

            expect(result.current.hasSelection).toBe(true)

            // Then clear it
            mockSelection.toString.mockReturnValue('')
            mockSelection.rangeCount = 0

            act(() => {
                document.dispatchEvent(new Event('selectionchange'))
            })

            expect(result.current.text).toBe('')
            expect(result.current.hasSelection).toBe(false)
        })
    })

    describe('selection properties', () => {
        it('should capture selection properties', () => {
            const anchorNode = document.createTextNode('anchor')
            const focusNode = document.createTextNode('focus')

            mockSelection.toString.mockReturnValue('selected')
            mockSelection.rangeCount = 1
            mockSelection.isCollapsed = false
            mockSelection.anchorNode = anchorNode
            mockSelection.anchorOffset = 5
            mockSelection.focusNode = focusNode
            mockSelection.focusOffset = 10
            mockSelection.getRangeAt.mockReturnValue(
                mockRange as unknown as Range
            )

            const { result } = renderHook(() => useTextSelection())

            act(() => {
                document.dispatchEvent(new Event('selectionchange'))
            })

            expect(result.current.anchorNode).toBe(anchorNode)
            expect(result.current.anchorOffset).toBe(5)
            expect(result.current.focusNode).toBe(focusNode)
            expect(result.current.focusOffset).toBe(10)
            expect(result.current.selection).toBe(mockSelection)
        })

        it('should capture multiple ranges', () => {
            const range1 = { ...mockRange }
            const range2 = { ...mockRange }

            mockSelection.toString.mockReturnValue('multi')
            mockSelection.rangeCount = 2
            mockSelection.getRangeAt
                .mockReturnValueOnce(range1 as unknown as Range)
                .mockReturnValueOnce(range2 as unknown as Range)

            const { result } = renderHook(() => useTextSelection())

            act(() => {
                document.dispatchEvent(new Event('selectionchange'))
            })

            expect(result.current.ranges).toHaveLength(2)
        })

        it('should capture bounding rectangles', () => {
            const rect1 = {
                x: 10,
                y: 20,
                width: 100,
                height: 20,
                top: 20,
                right: 110,
                bottom: 40,
                left: 10,
                toJSON: () => ({}),
            } as DOMRect
            const rect2 = {
                x: 10,
                y: 40,
                width: 50,
                height: 20,
                top: 40,
                right: 60,
                bottom: 60,
                left: 10,
                toJSON: () => ({}),
            } as DOMRect

            mockRange.getClientRects.mockReturnValue([rect1, rect2])
            mockSelection.toString.mockReturnValue('text')
            mockSelection.rangeCount = 1
            mockSelection.getRangeAt.mockReturnValue(
                mockRange as unknown as Range
            )

            const { result } = renderHook(() => useTextSelection())

            act(() => {
                document.dispatchEvent(new Event('selectionchange'))
            })

            expect(result.current.rects).toHaveLength(2)
            expect(result.current.rects[0]).toEqual(rect1)
            expect(result.current.rects[1]).toEqual(rect2)
        })
    })

    describe('ref-based selection', () => {
        it('should track selection within ref element', () => {
            const container = document.createElement('div')
            const textNode = document.createTextNode('text in container')
            container.appendChild(textNode)
            document.body.appendChild(container)

            mockRange.commonAncestorContainer = textNode
            mockSelection.toString.mockReturnValue('text')
            mockSelection.rangeCount = 1
            mockSelection.getRangeAt.mockReturnValue(
                mockRange as unknown as Range
            )

            const { result } = renderHook(() => {
                const ref = useRef<HTMLDivElement>(null)
                // Mock the ref
                ;(ref as any).current = container
                return useTextSelection({ ref })
            })

            act(() => {
                document.dispatchEvent(new Event('selectionchange'))
            })

            expect(result.current.text).toBe('text')
            expect(result.current.hasSelection).toBe(true)

            document.body.removeChild(container)
        })

        it('should ignore selection outside ref element', () => {
            const container = document.createElement('div')
            const outsideNode = document.createElement('div')
            document.body.appendChild(container)
            document.body.appendChild(outsideNode)

            mockRange.commonAncestorContainer = outsideNode
            mockSelection.toString.mockReturnValue('outside text')
            mockSelection.rangeCount = 1
            mockSelection.getRangeAt.mockReturnValue(
                mockRange as unknown as Range
            )

            const { result } = renderHook(() => {
                const ref = useRef<HTMLDivElement>(null)
                ;(ref as any).current = container
                return useTextSelection({ ref })
            })

            act(() => {
                document.dispatchEvent(new Event('selectionchange'))
            })

            expect(result.current.text).toBe('')
            expect(result.current.hasSelection).toBe(false)

            document.body.removeChild(container)
            document.body.removeChild(outsideNode)
        })

        it('should handle selection when container is common ancestor', () => {
            const container = document.createElement('div')
            document.body.appendChild(container)

            mockRange.commonAncestorContainer = container
            mockSelection.toString.mockReturnValue('container text')
            mockSelection.rangeCount = 1
            mockSelection.getRangeAt.mockReturnValue(
                mockRange as unknown as Range
            )

            const { result } = renderHook(() => {
                const ref = useRef<HTMLDivElement>(null)
                ;(ref as any).current = container
                return useTextSelection({ ref })
            })

            act(() => {
                document.dispatchEvent(new Event('selectionchange'))
            })

            expect(result.current.text).toBe('container text')
            expect(result.current.hasSelection).toBe(true)

            document.body.removeChild(container)
        })
    })

    describe('enabled state', () => {
        it('should not track when disabled', () => {
            mockSelection.toString.mockReturnValue('text')
            mockSelection.rangeCount = 1
            mockSelection.getRangeAt.mockReturnValue(
                mockRange as unknown as Range
            )

            const { result } = renderHook(() =>
                useTextSelection({ isEnabled: false })
            )

            act(() => {
                document.dispatchEvent(new Event('selectionchange'))
            })

            expect(result.current.text).toBe('')
            expect(result.current.hasSelection).toBe(false)
        })

        it('should clear state when disabled', () => {
            mockSelection.toString.mockReturnValue('text')
            mockSelection.rangeCount = 1
            mockSelection.getRangeAt.mockReturnValue(
                mockRange as unknown as Range
            )

            const { result, rerender } = renderHook(
                ({ isEnabled }) => useTextSelection({ isEnabled }),
                { initialProps: { isEnabled: true } }
            )

            act(() => {
                document.dispatchEvent(new Event('selectionchange'))
            })

            expect(result.current.hasSelection).toBe(true)

            // Disable
            rerender({ isEnabled: false })

            expect(result.current.text).toBe('')
            expect(result.current.hasSelection).toBe(false)
        })

        it('should resume tracking when re-enabled', () => {
            mockSelection.toString.mockReturnValue('text')
            mockSelection.rangeCount = 1
            mockSelection.getRangeAt.mockReturnValue(
                mockRange as unknown as Range
            )

            const { result, rerender } = renderHook(
                ({ isEnabled }) => useTextSelection({ isEnabled }),
                { initialProps: { isEnabled: false } }
            )

            expect(result.current.hasSelection).toBe(false)

            // Enable
            rerender({ isEnabled: true })

            act(() => {
                document.dispatchEvent(new Event('selectionchange'))
            })

            expect(result.current.text).toBe('text')
            expect(result.current.hasSelection).toBe(true)
        })
    })

    describe('cleanup', () => {
        it('should remove event listeners on unmount', () => {
            const removeEventListenerSpy = jest.spyOn(
                document,
                'removeEventListener'
            )

            const { unmount } = renderHook(() => useTextSelection())

            unmount()

            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                'selectionchange',
                expect.any(Function)
            )
            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                'mouseup',
                expect.any(Function)
            )
        })

        it('should remove ref element listeners on unmount', () => {
            const container = document.createElement('div')
            document.body.appendChild(container)

            const removeEventListenerSpy = jest.spyOn(
                container,
                'removeEventListener'
            )

            const { unmount } = renderHook(() => {
                const ref = useRef<HTMLDivElement>(null)
                ;(ref as any).current = container
                return useTextSelection({ ref })
            })

            unmount()

            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                'mouseup',
                expect.any(Function)
            )

            document.body.removeChild(container)
        })
    })

    describe('edge cases', () => {
        it('should handle null selection', () => {
            window.getSelection = jest.fn(() => null)

            const { result } = renderHook(() => useTextSelection())

            act(() => {
                document.dispatchEvent(new Event('selectionchange'))
            })

            expect(result.current.text).toBe('')
            expect(result.current.hasSelection).toBe(false)
        })

        it('should handle selection with zero ranges', () => {
            mockSelection.rangeCount = 0
            mockSelection.toString.mockReturnValue('')

            const { result } = renderHook(() => useTextSelection())

            act(() => {
                document.dispatchEvent(new Event('selectionchange'))
            })

            expect(result.current.ranges).toEqual([])
            expect(result.current.rects).toEqual([])
        })

        it('should handle ref without current', () => {
            const { result } = renderHook(() => {
                const ref = useRef<HTMLDivElement>(null)
                return useTextSelection({ ref })
            })

            mockSelection.toString.mockReturnValue('text')
            mockSelection.rangeCount = 1
            mockSelection.getRangeAt.mockReturnValue(
                mockRange as unknown as Range
            )

            act(() => {
                document.dispatchEvent(new Event('selectionchange'))
            })

            // Should work like normal selection without ref
            expect(result.current.text).toBe('text')
        })
    })
})
