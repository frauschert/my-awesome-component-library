import { renderHook, act } from '@testing-library/react'
import useIdle from '../useIdle'

describe('useIdle', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.clearAllTimers()
        jest.useRealTimers()
    })

    it('should initialize as not idle by default', () => {
        const { result } = renderHook(() => useIdle(5000))
        expect(result.current).toBe(false)
    })

    it('should initialize with custom initial state', () => {
        const { result } = renderHook(() =>
            useIdle(5000, { initialState: true })
        )
        expect(result.current).toBe(true)
    })

    it('should become idle after timeout', () => {
        const { result } = renderHook(() => useIdle(5000))

        expect(result.current).toBe(false)

        act(() => {
            jest.advanceTimersByTime(5000)
        })

        expect(result.current).toBe(true)
    })

    it('should reset idle timer on mouse movement', () => {
        const { result } = renderHook(() => useIdle(5000))

        act(() => {
            jest.advanceTimersByTime(3000)
        })

        expect(result.current).toBe(false)

        // Simulate mouse movement
        act(() => {
            const event = new MouseEvent('mousemove')
            window.dispatchEvent(event)
        })

        expect(result.current).toBe(false)

        // Advance time but not enough to trigger idle again
        act(() => {
            jest.advanceTimersByTime(3000)
        })

        expect(result.current).toBe(false)

        // Now advance to complete the timeout
        act(() => {
            jest.advanceTimersByTime(2000)
        })

        expect(result.current).toBe(true)
    })

    it('should reset idle timer on keyboard press', () => {
        const { result } = renderHook(() => useIdle(5000))

        act(() => {
            jest.advanceTimersByTime(4000)
        })

        expect(result.current).toBe(false)

        act(() => {
            const event = new KeyboardEvent('keypress')
            window.dispatchEvent(event)
        })

        expect(result.current).toBe(false)

        act(() => {
            jest.advanceTimersByTime(5000)
        })

        expect(result.current).toBe(true)
    })

    it('should reset idle timer on scroll', () => {
        const { result } = renderHook(() => useIdle(3000))

        act(() => {
            jest.advanceTimersByTime(2000)
        })

        act(() => {
            const event = new Event('scroll')
            window.dispatchEvent(event)
        })

        expect(result.current).toBe(false)

        act(() => {
            jest.advanceTimersByTime(3000)
        })

        expect(result.current).toBe(true)
    })

    it('should reset idle timer on touch', () => {
        const { result } = renderHook(() => useIdle(2000))

        act(() => {
            jest.advanceTimersByTime(1500)
        })

        act(() => {
            const event = new TouchEvent('touchstart')
            window.dispatchEvent(event)
        })

        expect(result.current).toBe(false)

        act(() => {
            jest.advanceTimersByTime(2000)
        })

        expect(result.current).toBe(true)
    })

    it('should work with custom events', () => {
        const { result } = renderHook(() =>
            useIdle(3000, {
                events: ['click', 'keydown'],
            })
        )

        act(() => {
            jest.advanceTimersByTime(2000)
        })

        // Click should reset
        act(() => {
            const event = new MouseEvent('click')
            window.dispatchEvent(event)
        })

        expect(result.current).toBe(false)

        // Mousemove should NOT reset (not in custom events)
        act(() => {
            jest.advanceTimersByTime(2000)
        })

        act(() => {
            const event = new MouseEvent('mousemove')
            window.dispatchEvent(event)
        })

        act(() => {
            jest.advanceTimersByTime(1000)
        })

        expect(result.current).toBe(true)
    })

    it('should handle rapid activity correctly', () => {
        const { result } = renderHook(() => useIdle(1000))

        // Simulate rapid mouse movements
        for (let i = 0; i < 10; i++) {
            act(() => {
                jest.advanceTimersByTime(500)
                const event = new MouseEvent('mousemove')
                window.dispatchEvent(event)
            })

            expect(result.current).toBe(false)
        }

        // Stop activity and wait for timeout
        act(() => {
            jest.advanceTimersByTime(1000)
        })

        expect(result.current).toBe(true)
    })

    it('should update when timeout changes', () => {
        const { result, rerender } = renderHook(
            ({ timeout }) => useIdle(timeout),
            { initialProps: { timeout: 5000 } }
        )

        act(() => {
            jest.advanceTimersByTime(3000)
        })

        expect(result.current).toBe(false)

        // Change timeout to 2000ms
        rerender({ timeout: 2000 })

        // Should become idle after 2000ms from the rerender
        act(() => {
            jest.advanceTimersByTime(2000)
        })

        expect(result.current).toBe(true)
    })

    it('should clean up event listeners on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

        const { unmount } = renderHook(() => useIdle(5000))

        unmount()

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'mousedown',
            expect.any(Function),
            true
        )
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'mousemove',
            expect.any(Function),
            true
        )
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'keypress',
            expect.any(Function),
            true
        )
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'scroll',
            expect.any(Function),
            true
        )
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'touchstart',
            expect.any(Function),
            true
        )
        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'wheel',
            expect.any(Function),
            true
        )

        removeEventListenerSpy.mockRestore()
    })

    it('should become active again after being idle', () => {
        const { result } = renderHook(() => useIdle(2000))

        // Become idle
        act(() => {
            jest.advanceTimersByTime(2000)
        })

        expect(result.current).toBe(true)

        // Activity should make it active again
        act(() => {
            const event = new MouseEvent('mousedown')
            window.dispatchEvent(event)
        })

        expect(result.current).toBe(false)

        // Can become idle again
        act(() => {
            jest.advanceTimersByTime(2000)
        })

        expect(result.current).toBe(true)
    })

    it('should handle mousedown event', () => {
        const { result } = renderHook(() => useIdle(1000))

        act(() => {
            jest.advanceTimersByTime(500)
        })

        act(() => {
            const event = new MouseEvent('mousedown')
            window.dispatchEvent(event)
        })

        expect(result.current).toBe(false)

        act(() => {
            jest.advanceTimersByTime(1000)
        })

        expect(result.current).toBe(true)
    })

    it('should handle wheel event', () => {
        const { result } = renderHook(() => useIdle(1500))

        act(() => {
            jest.advanceTimersByTime(1000)
        })

        act(() => {
            const event = new WheelEvent('wheel')
            window.dispatchEvent(event)
        })

        expect(result.current).toBe(false)

        act(() => {
            jest.advanceTimersByTime(1500)
        })

        expect(result.current).toBe(true)
    })

    it('should work with very short timeouts', () => {
        const { result } = renderHook(() => useIdle(100))

        expect(result.current).toBe(false)

        act(() => {
            jest.advanceTimersByTime(100)
        })

        expect(result.current).toBe(true)
    })

    it('should work with very long timeouts', () => {
        const { result } = renderHook(() => useIdle(60000))

        act(() => {
            jest.advanceTimersByTime(59999)
        })

        expect(result.current).toBe(false)

        act(() => {
            jest.advanceTimersByTime(1)
        })

        expect(result.current).toBe(true)
    })
})
