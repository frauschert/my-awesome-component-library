import { renderHook, act } from '@testing-library/react'
import { useRef } from 'react'
import useRect from '../useRect'

function mockElement(rect: Partial<DOMRect> = {}): HTMLDivElement {
    const el = document.createElement('div')
    el.getBoundingClientRect = jest.fn(
        () =>
            ({
                top: 10,
                right: 210,
                bottom: 60,
                left: 10,
                width: 200,
                height: 50,
                x: 10,
                y: 10,
                ...rect,
                toJSON: () => ({}),
            } as DOMRect)
    )
    return el
}

describe('useRect', () => {
    let observeSpy: jest.Mock
    let disconnectSpy: jest.Mock
    let resizeObserverCallback: ResizeObserverCallback

    beforeEach(() => {
        observeSpy = jest.fn()
        disconnectSpy = jest.fn()

        global.ResizeObserver = jest.fn((cb: ResizeObserverCallback) => {
            resizeObserverCallback = cb
            return {
                observe: observeSpy,
                disconnect: disconnectSpy,
                unobserve: jest.fn(),
            }
        }) as unknown as typeof ResizeObserver
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    it('returns null before the ref is attached', () => {
        const { result } = renderHook(() => {
            const ref = useRef<HTMLDivElement>(null)
            return useRect(ref)
        })
        expect(result.current).toBeNull()
    })

    it('measures the element on mount', () => {
        const el = mockElement()
        const { result } = renderHook(() => {
            const ref = { current: el } as React.RefObject<HTMLDivElement>
            return useRect(ref)
        })

        expect(result.current).toMatchObject({
            top: 10,
            left: 10,
            width: 200,
            height: 50,
            x: 10,
            y: 10,
        })
    })

    it('attaches a ResizeObserver', () => {
        const el = mockElement()
        renderHook(() => {
            const ref = { current: el } as React.RefObject<HTMLDivElement>
            return useRect(ref)
        })
        expect(observeSpy).toHaveBeenCalledWith(el)
    })

    it('disconnects the ResizeObserver on unmount', () => {
        const el = mockElement()
        const { unmount } = renderHook(() => {
            const ref = { current: el } as React.RefObject<HTMLDivElement>
            return useRect(ref)
        })
        unmount()
        expect(disconnectSpy).toHaveBeenCalled()
    })

    it('re-measures when ResizeObserver fires', () => {
        const el = mockElement()
        const { result } = renderHook(() => {
            const ref = { current: el } as React.RefObject<HTMLDivElement>
            return useRect(ref)
        })

        ;(el.getBoundingClientRect as jest.Mock).mockReturnValue({
            top: 20,
            right: 320,
            bottom: 120,
            left: 20,
            width: 300,
            height: 100,
            x: 20,
            y: 20,
            toJSON: () => ({}),
        })

        act(() => {
            resizeObserverCallback([], {} as ResizeObserver)
        })

        expect(result.current).toMatchObject({
            width: 300,
            height: 100,
            top: 20,
        })
    })

    it('re-measures on window scroll', () => {
        const el = mockElement()
        const { result } = renderHook(() => {
            const ref = { current: el } as React.RefObject<HTMLDivElement>
            return useRect(ref)
        })

        ;(el.getBoundingClientRect as jest.Mock).mockReturnValue({
            top: 5,
            right: 205,
            bottom: 55,
            left: 5,
            width: 200,
            height: 50,
            x: 5,
            y: 5,
            toJSON: () => ({}),
        })

        act(() => {
            window.dispatchEvent(new Event('scroll'))
        })

        expect(result.current).toMatchObject({ top: 5, left: 5 })
    })

    it('re-measures on window resize', () => {
        const el = mockElement()
        const { result } = renderHook(() => {
            const ref = { current: el } as React.RefObject<HTMLDivElement>
            return useRect(ref)
        })

        ;(el.getBoundingClientRect as jest.Mock).mockReturnValue({
            top: 30,
            right: 430,
            bottom: 130,
            left: 30,
            width: 400,
            height: 100,
            x: 30,
            y: 30,
            toJSON: () => ({}),
        })

        act(() => {
            window.dispatchEvent(new Event('resize'))
        })

        expect(result.current).toMatchObject({ width: 400, top: 30 })
    })

    it('does not attach scroll listener when observeScroll is false', () => {
        const addSpy = jest.spyOn(window, 'addEventListener')
        const el = mockElement()
        renderHook(() => {
            const ref = { current: el } as React.RefObject<HTMLDivElement>
            return useRect(ref, { observeScroll: false })
        })

        const scrollCalls = addSpy.mock.calls.filter(
            ([event]) => event === 'scroll'
        )
        expect(scrollCalls).toHaveLength(0)
    })

    it('does not attach resize listener when observeResize is false', () => {
        const addSpy = jest.spyOn(window, 'addEventListener')
        const el = mockElement()
        renderHook(() => {
            const ref = { current: el } as React.RefObject<HTMLDivElement>
            return useRect(ref, { observeResize: false })
        })

        const resizeCalls = addSpy.mock.calls.filter(
            ([event]) => event === 'resize'
        )
        expect(resizeCalls).toHaveLength(0)
    })

    it('removes all listeners on unmount', () => {
        const removeSpy = jest.spyOn(window, 'removeEventListener')
        const el = mockElement()
        const { unmount } = renderHook(() => {
            const ref = { current: el } as React.RefObject<HTMLDivElement>
            return useRect(ref)
        })

        unmount()

        expect(removeSpy).toHaveBeenCalledWith(
            'scroll',
            expect.any(Function),
            true
        )
        expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    })
})
