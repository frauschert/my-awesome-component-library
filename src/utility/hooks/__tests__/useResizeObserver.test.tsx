import { renderHook, act } from '@testing-library/react'
import { useRef, RefObject } from 'react'
import useResizeObserver from '../useResizeObserver'

describe('useResizeObserver', () => {
    let mockObserve: jest.Mock
    let mockDisconnect: jest.Mock
    let mockUnobserve: jest.Mock
    let resizeCallback: ResizeObserverCallback

    beforeEach(() => {
        mockObserve = jest.fn()
        mockDisconnect = jest.fn()
        mockUnobserve = jest.fn()

        // Mock ResizeObserver
        global.ResizeObserver = jest.fn((callback) => {
            resizeCallback = callback
            return {
                observe: mockObserve,
                disconnect: mockDisconnect,
                unobserve: mockUnobserve,
            }
        }) as unknown as typeof ResizeObserver
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should return null initially', () => {
        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(null)
            return useResizeObserver(ref)
        })

        expect(result.current).toBeNull()
    })

    it('should observe element when ref is set', () => {
        const element = document.createElement('div')

        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useResizeObserver(ref)
        })

        expect(global.ResizeObserver).toHaveBeenCalled()
        expect(mockObserve).toHaveBeenCalledWith(element, {
            box: 'content-box',
        })
    })

    it('should update entry when resize occurs', () => {
        const element = document.createElement('div')

        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useResizeObserver(ref)
        })

        const mockEntry = {
            contentRect: {
                width: 200,
                height: 100,
                top: 0,
                left: 0,
                bottom: 100,
                right: 200,
                x: 0,
                y: 0,
                toJSON: () => ({}),
            } as DOMRectReadOnly,
            borderBoxSize: [{ blockSize: 100, inlineSize: 200 }],
            contentBoxSize: [{ blockSize: 100, inlineSize: 200 }],
            devicePixelContentBoxSize: [{ blockSize: 100, inlineSize: 200 }],
            target: element,
        } as unknown as ResizeObserverEntry

        // Trigger resize callback
        act(() => {
            resizeCallback([mockEntry], {} as ResizeObserver)
        })

        expect(result.current).not.toBeNull()
        expect(result.current?.contentRect.width).toBe(200)
        expect(result.current?.contentRect.height).toBe(100)
    })

    it('should call onResize callback when resize occurs', () => {
        const element = document.createElement('div')
        const onResize = jest.fn()

        renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useResizeObserver(ref, { onResize })
        })

        const mockEntry = {
            contentRect: {
                width: 300,
                height: 150,
                top: 0,
                left: 0,
                bottom: 150,
                right: 300,
                x: 0,
                y: 0,
                toJSON: () => ({}),
            } as DOMRectReadOnly,
            borderBoxSize: [],
            contentBoxSize: [],
            devicePixelContentBoxSize: [],
            target: element,
        } as unknown as ResizeObserverEntry

        act(() => {
            resizeCallback([mockEntry], {} as ResizeObserver)
        })

        expect(onResize).toHaveBeenCalledWith(
            expect.objectContaining({
                contentRect: mockEntry.contentRect,
            })
        )
    })

    it('should observe with custom box option', () => {
        const element = document.createElement('div')

        renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useResizeObserver(ref, { box: 'border-box' })
        })

        expect(mockObserve).toHaveBeenCalledWith(element, { box: 'border-box' })
    })

    it('should disconnect observer on unmount', () => {
        const element = document.createElement('div')

        const { unmount } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useResizeObserver(ref)
        })

        unmount()

        expect(mockDisconnect).toHaveBeenCalled()
    })

    it('should handle multiple resize events', () => {
        const element = document.createElement('div')

        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useResizeObserver(ref)
        })

        const createMockEntry = (width: number, height: number) =>
            ({
                contentRect: {
                    width,
                    height,
                    top: 0,
                    left: 0,
                    bottom: height,
                    right: width,
                    x: 0,
                    y: 0,
                    toJSON: () => ({}),
                } as DOMRectReadOnly,
                borderBoxSize: [],
                contentBoxSize: [],
                devicePixelContentBoxSize: [],
                target: element,
            } as unknown as ResizeObserverEntry)

        // First resize
        act(() => {
            resizeCallback([createMockEntry(100, 50)], {} as ResizeObserver)
        })
        expect(result.current?.contentRect.width).toBe(100)
        expect(result.current?.contentRect.height).toBe(50)

        // Second resize
        act(() => {
            resizeCallback([createMockEntry(200, 100)], {} as ResizeObserver)
        })
        expect(result.current?.contentRect.width).toBe(200)
        expect(result.current?.contentRect.height).toBe(100)

        // Third resize
        act(() => {
            resizeCallback([createMockEntry(300, 150)], {} as ResizeObserver)
        })
        expect(result.current?.contentRect.width).toBe(300)
        expect(result.current?.contentRect.height).toBe(150)
    })

    it('should not observe if ref is null', () => {
        renderHook(() => {
            const ref = useRef<HTMLDivElement>(null)
            return useResizeObserver(ref)
        })

        expect(mockObserve).not.toHaveBeenCalled()
    })

    it('should handle empty entries array', () => {
        const element = document.createElement('div')

        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useResizeObserver(ref)
        })

        // Trigger with empty array
        resizeCallback([], {} as ResizeObserver)

        // Should still be null
        expect(result.current).toBeNull()
    })

    it('should work with different box types', () => {
        const element = document.createElement('div')

        const { rerender } = renderHook(
            ({ box }: { box: 'content-box' | 'border-box' }) => {
                const ref = useRef<HTMLDivElement>(element)
                return useResizeObserver(ref, { box })
            },
            { initialProps: { box: 'content-box' as const } }
        )

        expect(mockObserve).toHaveBeenCalledWith(element, {
            box: 'content-box',
        })

        // Change box type
        rerender({ box: 'border-box' })

        // Should disconnect old observer and create new one
        expect(mockDisconnect).toHaveBeenCalled()
    })

    it('should include border box sizes in entry', () => {
        const element = document.createElement('div')

        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useResizeObserver(ref)
        })

        const mockEntry = {
            contentRect: {
                width: 200,
                height: 100,
            } as DOMRectReadOnly,
            borderBoxSize: [{ blockSize: 110, inlineSize: 210 }],
            contentBoxSize: [{ blockSize: 100, inlineSize: 200 }],
            devicePixelContentBoxSize: [{ blockSize: 200, inlineSize: 400 }],
            target: element,
        } as unknown as ResizeObserverEntry

        act(() => {
            resizeCallback([mockEntry], {} as ResizeObserver)
        })

        expect(result.current?.borderBoxSize).toEqual([
            { blockSize: 110, inlineSize: 210 },
        ])
        expect(result.current?.contentBoxSize).toEqual([
            { blockSize: 100, inlineSize: 200 },
        ])
        expect(result.current?.devicePixelContentBoxSize).toEqual([
            { blockSize: 200, inlineSize: 400 },
        ])
    })

    it('should warn when ResizeObserver is not supported', () => {
        const consoleWarnSpy = jest
            .spyOn(console, 'warn')
            .mockImplementation(() => {})

        // Remove ResizeObserver
        const originalResizeObserver = global.ResizeObserver
        // @ts-expect-error - Intentionally setting to undefined for test
        global.ResizeObserver = undefined

        const element = document.createElement('div')

        renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useResizeObserver(ref)
        })

        expect(consoleWarnSpy).toHaveBeenCalledWith(
            'ResizeObserver is not supported in this browser'
        )

        // Restore
        global.ResizeObserver = originalResizeObserver
        consoleWarnSpy.mockRestore()
    })

    it('should handle ref changes', () => {
        const ref1 = { current: document.createElement('div') }
        const ref2 = { current: document.createElement('div') }

        const { rerender } = renderHook(
            ({ ref }) => useResizeObserver(ref as RefObject<HTMLDivElement>),
            { initialProps: { ref: ref1 } }
        )

        expect(mockObserve).toHaveBeenCalledWith(ref1.current, {
            box: 'content-box',
        })

        // Clear mock to track new calls
        mockDisconnect.mockClear()

        // Change ref
        rerender({ ref: ref2 })

        // Should disconnect old observer
        expect(mockDisconnect).toHaveBeenCalled()
        // And observe new element
        expect(mockObserve).toHaveBeenCalledWith(ref2.current, {
            box: 'content-box',
        })
    })
})
