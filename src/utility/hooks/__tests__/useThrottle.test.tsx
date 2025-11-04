import { renderHook, act } from '@testing-library/react'
import useThrottle from '../useThrottle'

describe('useThrottle', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.useRealTimers()
    })

    it('should return initial value immediately', () => {
        const { result } = renderHook(() => useThrottle('initial', 1000))
        expect(result.current).toBe('initial')
    })

    it('should throttle value updates', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useThrottle(value, delay),
            { initialProps: { value: 'first', delay: 1000 } }
        )

        expect(result.current).toBe('first')

        // Update value immediately
        rerender({ value: 'second', delay: 1000 })

        // Should not update immediately (throttled)
        expect(result.current).toBe('first')

        // After delay, should update
        act(() => {
            jest.advanceTimersByTime(1000)
        })
        expect(result.current).toBe('second')
    })

    it('should update immediately after throttle period has passed', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useThrottle(value, delay),
            { initialProps: { value: 'first', delay: 500 } }
        )

        // First change to start the throttle
        rerender({ value: 'intermediate', delay: 500 })

        // Wait for throttle period to complete
        act(() => {
            jest.advanceTimersByTime(500)
        })
        expect(result.current).toBe('intermediate')

        // Wait additional time so throttle window has passed
        act(() => {
            jest.advanceTimersByTime(600)
        })

        // Now update should happen immediately since throttle window passed
        rerender({ value: 'second', delay: 500 })
        expect(result.current).toBe('second')
    })

    it('should handle multiple rapid changes', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useThrottle(value, delay),
            { initialProps: { value: 0, delay: 1000 } }
        )

        expect(result.current).toBe(0)

        // Rapid updates
        rerender({ value: 1, delay: 1000 })
        rerender({ value: 2, delay: 1000 })
        rerender({ value: 3, delay: 1000 })

        // Still showing initial value
        expect(result.current).toBe(0)

        // After delay, should show latest value
        act(() => {
            jest.advanceTimersByTime(1000)
        })
        expect(result.current).toBe(3)
    })

    it('should handle different delay values', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useThrottle(value, delay),
            { initialProps: { value: 'a', delay: 500 } }
        )

        rerender({ value: 'b', delay: 500 })

        act(() => {
            jest.advanceTimersByTime(500)
        })
        expect(result.current).toBe('b')

        // Change delay
        rerender({ value: 'c', delay: 1000 })

        act(() => {
            jest.advanceTimersByTime(500)
        })
        expect(result.current).toBe('b') // Still throttled

        act(() => {
            jest.advanceTimersByTime(500)
        })
        expect(result.current).toBe('c') // Now updated
    })

    it('should work with object values', () => {
        const obj1 = { name: 'John', age: 30 }
        const obj2 = { name: 'Jane', age: 25 }

        const { result, rerender } = renderHook(
            ({ value, delay }) => useThrottle(value, delay),
            { initialProps: { value: obj1, delay: 1000 } }
        )

        expect(result.current).toBe(obj1)

        rerender({ value: obj2, delay: 1000 })

        act(() => {
            jest.advanceTimersByTime(1000)
        })
        expect(result.current).toBe(obj2)
    })

    it('should work with array values', () => {
        const arr1 = [1, 2, 3]
        const arr2 = [4, 5, 6]

        const { result, rerender } = renderHook(
            ({ value, delay }) => useThrottle(value, delay),
            { initialProps: { value: arr1, delay: 1000 } }
        )

        expect(result.current).toBe(arr1)

        rerender({ value: arr2, delay: 1000 })

        act(() => {
            jest.advanceTimersByTime(1000)
        })
        expect(result.current).toBe(arr2)
    })

    it('should work with number values', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useThrottle(value, delay),
            { initialProps: { value: 100, delay: 1000 } }
        )

        expect(result.current).toBe(100)

        rerender({ value: 200, delay: 1000 })

        act(() => {
            jest.advanceTimersByTime(1000)
        })
        expect(result.current).toBe(200)
    })

    it('should work with boolean values', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useThrottle(value, delay),
            { initialProps: { value: false, delay: 1000 } }
        )

        expect(result.current).toBe(false)

        rerender({ value: true, delay: 1000 })

        act(() => {
            jest.advanceTimersByTime(1000)
        })
        expect(result.current).toBe(true)
    })

    it('should clear timeout on unmount', () => {
        const { rerender, unmount } = renderHook(
            ({ value, delay }) => useThrottle(value, delay),
            { initialProps: { value: 'first', delay: 1000 } }
        )

        rerender({ value: 'second', delay: 1000 })

        // Unmount before timeout completes
        unmount()

        // Should not throw or cause memory leaks
        act(() => {
            jest.advanceTimersByTime(1000)
        })
    })

    it('should handle very short delays', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useThrottle(value, delay),
            { initialProps: { value: 'a', delay: 10 } }
        )

        rerender({ value: 'b', delay: 10 })

        act(() => {
            jest.advanceTimersByTime(10)
        })
        expect(result.current).toBe('b')
    })

    it('should throttle continuous updates correctly', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useThrottle(value, delay),
            { initialProps: { value: 0, delay: 1000 } }
        )

        expect(result.current).toBe(0)

        // First update after 100ms
        act(() => {
            jest.advanceTimersByTime(100)
        })
        rerender({ value: 1, delay: 1000 })
        expect(result.current).toBe(0)

        // Second update after another 100ms (200ms total)
        act(() => {
            jest.advanceTimersByTime(100)
        })
        rerender({ value: 2, delay: 1000 })
        expect(result.current).toBe(0)

        // After full throttle period from first change
        act(() => {
            jest.advanceTimersByTime(800)
        })
        expect(result.current).toBe(2)
    })

    it('should update immediately when throttle window has passed naturally', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useThrottle(value, delay),
            { initialProps: { value: 'a', delay: 500 } }
        )

        // First change
        rerender({ value: 'b', delay: 500 })

        act(() => {
            jest.advanceTimersByTime(500)
        })
        expect(result.current).toBe('b')

        // Wait longer than throttle period
        act(() => {
            jest.advanceTimersByTime(600)
        })

        // Next change should be immediate
        rerender({ value: 'c', delay: 500 })
        expect(result.current).toBe('c')
    })

    it('should cancel previous timeout when new value arrives', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useThrottle(value, delay),
            { initialProps: { value: 'a', delay: 1000 } }
        )

        rerender({ value: 'b', delay: 1000 })

        // Advance partway
        act(() => {
            jest.advanceTimersByTime(500)
        })

        // New value arrives
        rerender({ value: 'c', delay: 1000 })

        // Original timeout was cancelled, still showing 'a'
        expect(result.current).toBe('a')

        // Complete the new timeout
        act(() => {
            jest.advanceTimersByTime(500)
        })
        expect(result.current).toBe('c')
    })

    it('should handle null and undefined values', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useThrottle(value, delay),
            {
                initialProps: {
                    value: null as string | null | undefined,
                    delay: 1000,
                },
            }
        )

        expect(result.current).toBe(null)

        rerender({ value: undefined as string | null | undefined, delay: 1000 })

        act(() => {
            jest.advanceTimersByTime(1000)
        })
        expect(result.current).toBe(undefined)
    })
})
