import { renderHook, act } from '@testing-library/react'
import { useRef, RefObject } from 'react'
import useIntersectionObserver from '../useIntersectionObserver'

describe('useIntersectionObserver', () => {
    let mockObserve: jest.Mock
    let mockDisconnect: jest.Mock
    let mockUnobserve: jest.Mock
    let intersectionCallback: IntersectionObserverCallback

    beforeEach(() => {
        mockObserve = jest.fn()
        mockDisconnect = jest.fn()
        mockUnobserve = jest.fn()

        // Mock IntersectionObserver
        global.IntersectionObserver = jest.fn((callback) => {
            intersectionCallback = callback
            return {
                observe: mockObserve,
                disconnect: mockDisconnect,
                unobserve: mockUnobserve,
            }
        }) as unknown as typeof IntersectionObserver
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('should return null initially', () => {
        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(null)
            return useIntersectionObserver(ref)
        })

        expect(result.current).toBeNull()
    })

    it('should observe element when ref is set', () => {
        const element = document.createElement('div')

        renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useIntersectionObserver(ref)
        })

        expect(global.IntersectionObserver).toHaveBeenCalled()
        expect(mockObserve).toHaveBeenCalledWith(element)
    })

    it('should update entry when intersection occurs', () => {
        const element = document.createElement('div')

        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useIntersectionObserver(ref)
        })

        const mockEntry: IntersectionObserverEntry = {
            isIntersecting: true,
            intersectionRatio: 0.5,
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            target: element,
            time: Date.now(),
        }

        act(() => {
            intersectionCallback([mockEntry], {} as IntersectionObserver)
        })

        expect(result.current).not.toBeNull()
        expect(result.current?.isIntersecting).toBe(true)
        expect(result.current?.intersectionRatio).toBe(0.5)
    })

    it('should call onChange callback when intersection occurs', () => {
        const element = document.createElement('div')
        const onChange = jest.fn()

        renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useIntersectionObserver(ref, { onChange })
        })

        const mockEntry: IntersectionObserverEntry = {
            isIntersecting: true,
            intersectionRatio: 1,
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            target: element,
            time: Date.now(),
        }

        act(() => {
            intersectionCallback([mockEntry], {} as IntersectionObserver)
        })

        expect(onChange).toHaveBeenCalledWith(mockEntry)
    })

    it('should observe with custom threshold', () => {
        const element = document.createElement('div')

        renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useIntersectionObserver(ref, { threshold: 0.5 })
        })

        expect(global.IntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            expect.objectContaining({ threshold: 0.5 })
        )
    })

    it('should observe with multiple thresholds', () => {
        const element = document.createElement('div')

        renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useIntersectionObserver(ref, {
                threshold: [0, 0.25, 0.5, 0.75, 1],
            })
        })

        expect(global.IntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            expect.objectContaining({ threshold: [0, 0.25, 0.5, 0.75, 1] })
        )
    })

    it('should observe with custom rootMargin', () => {
        const element = document.createElement('div')

        renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useIntersectionObserver(ref, { rootMargin: '10px 20px' })
        })

        expect(global.IntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            expect.objectContaining({ rootMargin: '10px 20px' })
        )
    })

    it('should observe with custom root element', () => {
        const element = document.createElement('div')
        const root = document.createElement('div')

        renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useIntersectionObserver(ref, { root })
        })

        expect(global.IntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            expect.objectContaining({ root })
        )
    })

    it('should disconnect observer on unmount', () => {
        const element = document.createElement('div')

        const { unmount } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useIntersectionObserver(ref)
        })

        unmount()

        expect(mockDisconnect).toHaveBeenCalled()
    })

    it('should freeze observation once visible when freezeOnceVisible is true', () => {
        const element = document.createElement('div')

        const { result, rerender } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useIntersectionObserver(ref, { freezeOnceVisible: true })
        })

        const visibleEntry: IntersectionObserverEntry = {
            isIntersecting: true,
            intersectionRatio: 1,
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            target: element,
            time: Date.now(),
        }

        act(() => {
            intersectionCallback([visibleEntry], {} as IntersectionObserver)
        })

        expect(result.current?.isIntersecting).toBe(true)

        // Clear mocks to track new calls
        mockDisconnect.mockClear()
        mockObserve.mockClear()

        // Rerender - should not create new observer since frozen
        rerender()

        // Should not observe again
        expect(mockObserve).not.toHaveBeenCalled()
    })

    it('should handle not intersecting state', () => {
        const element = document.createElement('div')

        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useIntersectionObserver(ref)
        })

        const notIntersectingEntry: IntersectionObserverEntry = {
            isIntersecting: false,
            intersectionRatio: 0,
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            target: element,
            time: Date.now(),
        }

        act(() => {
            intersectionCallback(
                [notIntersectingEntry],
                {} as IntersectionObserver
            )
        })

        expect(result.current?.isIntersecting).toBe(false)
        expect(result.current?.intersectionRatio).toBe(0)
    })

    it('should not observe if ref is null', () => {
        renderHook(() => {
            const ref = useRef<HTMLDivElement>(null)
            return useIntersectionObserver(ref)
        })

        expect(mockObserve).not.toHaveBeenCalled()
    })

    it('should handle multiple intersection updates', () => {
        const element = document.createElement('div')

        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useIntersectionObserver(ref)
        })

        const createEntry = (
            isIntersecting: boolean,
            ratio: number
        ): IntersectionObserverEntry => ({
            isIntersecting,
            intersectionRatio: ratio,
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            target: element,
            time: Date.now(),
        })

        // First update - entering
        act(() => {
            intersectionCallback(
                [createEntry(true, 0.5)],
                {} as IntersectionObserver
            )
        })
        expect(result.current?.isIntersecting).toBe(true)
        expect(result.current?.intersectionRatio).toBe(0.5)

        // Second update - fully visible
        act(() => {
            intersectionCallback(
                [createEntry(true, 1)],
                {} as IntersectionObserver
            )
        })
        expect(result.current?.intersectionRatio).toBe(1)

        // Third update - leaving
        act(() => {
            intersectionCallback(
                [createEntry(false, 0)],
                {} as IntersectionObserver
            )
        })
        expect(result.current?.isIntersecting).toBe(false)
    })

    it('should warn when IntersectionObserver is not supported', () => {
        const consoleWarnSpy = jest
            .spyOn(console, 'warn')
            .mockImplementation(() => {})

        // Remove IntersectionObserver
        const originalIntersectionObserver = global.IntersectionObserver
        // @ts-expect-error - Intentionally setting to undefined for test
        global.IntersectionObserver = undefined

        const element = document.createElement('div')

        renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useIntersectionObserver(ref)
        })

        expect(consoleWarnSpy).toHaveBeenCalledWith(
            'IntersectionObserver is not supported in this browser'
        )

        // Restore
        global.IntersectionObserver = originalIntersectionObserver
        consoleWarnSpy.mockRestore()
    })

    it('should handle ref changes', () => {
        const ref1 = { current: document.createElement('div') }
        const ref2 = { current: document.createElement('div') }

        const { rerender } = renderHook(
            ({ ref }) =>
                useIntersectionObserver(ref as RefObject<HTMLDivElement>),
            { initialProps: { ref: ref1 } }
        )

        expect(mockObserve).toHaveBeenCalledWith(ref1.current)

        // Clear mock to track new calls
        mockDisconnect.mockClear()

        // Change ref
        rerender({ ref: ref2 })

        // Should disconnect old observer
        expect(mockDisconnect).toHaveBeenCalled()
        // And observe new element
        expect(mockObserve).toHaveBeenCalledWith(ref2.current)
    })

    it('should work with all options combined', () => {
        const element = document.createElement('div')
        const root = document.createElement('div')
        const onChange = jest.fn()

        renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useIntersectionObserver(ref, {
                root,
                rootMargin: '50px',
                threshold: [0, 0.5, 1],
                onChange,
            })
        })

        expect(global.IntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            expect.objectContaining({
                root,
                rootMargin: '50px',
                threshold: [0, 0.5, 1],
            })
        )
    })

    it('should track intersection ratio changes accurately', () => {
        const element = document.createElement('div')
        const onChange = jest.fn()

        renderHook(() => {
            const ref = useRef<HTMLDivElement>(element)
            return useIntersectionObserver(ref, {
                threshold: [0, 0.25, 0.5, 0.75, 1],
                onChange,
            })
        })

        const ratios = [0.25, 0.5, 0.75, 1, 0.75, 0.5, 0.25, 0]

        ratios.forEach((ratio) => {
            const entry: IntersectionObserverEntry = {
                isIntersecting: ratio > 0,
                intersectionRatio: ratio,
                boundingClientRect: {} as DOMRectReadOnly,
                intersectionRect: {} as DOMRectReadOnly,
                rootBounds: null,
                target: element,
                time: Date.now(),
            }

            act(() => {
                intersectionCallback([entry], {} as IntersectionObserver)
            })
        })

        expect(onChange).toHaveBeenCalledTimes(ratios.length)
    })
})
