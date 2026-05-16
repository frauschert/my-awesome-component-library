import { renderHook, act } from '@testing-library/react'
import useBreakpoint, { defaultBreakpoints } from '../useBreakpoint'

describe('useBreakpoint', () => {
    // Store original innerWidth
    const originalInnerWidth = window.innerWidth

    // Mock window.innerWidth
    const setWindowWidth = (width: number) => {
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: width,
        })
    }

    beforeEach(() => {
        setWindowWidth(1024) // Default to 'lg'
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
        setWindowWidth(originalInnerWidth)
    })

    test('returns correct initial breakpoint', () => {
        setWindowWidth(768)
        const { result } = renderHook(() => useBreakpoint())

        expect(result.current.breakpoint).toBe('md')
        expect(result.current.width).toBe(768)
    })

    test('detects xs breakpoint', () => {
        setWindowWidth(320)
        const { result } = renderHook(() => useBreakpoint())

        expect(result.current.breakpoint).toBe('xs')
    })

    test('detects sm breakpoint', () => {
        setWindowWidth(640)
        const { result } = renderHook(() => useBreakpoint())

        expect(result.current.breakpoint).toBe('sm')
    })

    test('detects md breakpoint', () => {
        setWindowWidth(768)
        const { result } = renderHook(() => useBreakpoint())

        expect(result.current.breakpoint).toBe('md')
    })

    test('detects lg breakpoint', () => {
        setWindowWidth(1024)
        const { result } = renderHook(() => useBreakpoint())

        expect(result.current.breakpoint).toBe('lg')
    })

    test('detects xl breakpoint', () => {
        setWindowWidth(1280)
        const { result } = renderHook(() => useBreakpoint())

        expect(result.current.breakpoint).toBe('xl')
    })

    test('detects xxl breakpoint', () => {
        setWindowWidth(1536)
        const { result } = renderHook(() => useBreakpoint())

        expect(result.current.breakpoint).toBe('xxl')
    })

    test('updates breakpoint on window resize', () => {
        setWindowWidth(768)
        const { result } = renderHook(() => useBreakpoint())

        expect(result.current.breakpoint).toBe('md')

        // Resize window
        act(() => {
            setWindowWidth(1280)
            window.dispatchEvent(new Event('resize'))
            jest.advanceTimersByTime(200)
        })

        expect(result.current.breakpoint).toBe('xl')
        expect(result.current.width).toBe(1280)
    })

    test('debounces resize events', () => {
        setWindowWidth(768)
        const { result } = renderHook(() => useBreakpoint({ debounceMs: 300 }))

        expect(result.current.breakpoint).toBe('md')

        // Trigger multiple resize events
        act(() => {
            setWindowWidth(1024)
            window.dispatchEvent(new Event('resize'))
            jest.advanceTimersByTime(100)

            setWindowWidth(1280)
            window.dispatchEvent(new Event('resize'))
            jest.advanceTimersByTime(100)

            setWindowWidth(1536)
            window.dispatchEvent(new Event('resize'))
            jest.advanceTimersByTime(100)
        })

        // Should still be original value before debounce completes
        expect(result.current.breakpoint).toBe('md')

        // Complete debounce
        act(() => {
            jest.advanceTimersByTime(200)
        })

        // Should now reflect final resize
        expect(result.current.breakpoint).toBe('xxl')
        expect(result.current.width).toBe(1536)
    })

    test('accepts custom breakpoints', () => {
        setWindowWidth(900)
        const { result } = renderHook(() =>
            useBreakpoint({
                breakpoints: {
                    sm: 576,
                    md: 768,
                    lg: 992,
                    xl: 1200,
                },
            })
        )

        expect(result.current.breakpoint).toBe('md')
        expect(result.current.width).toBe(900)
    })

    test('is() checks current breakpoint', () => {
        setWindowWidth(768)
        const { result } = renderHook(() => useBreakpoint())

        expect(result.current.is('md')).toBe(true)
        expect(result.current.is('lg')).toBe(false)
        expect(result.current.is('sm')).toBe(false)
    })

    test('isGreaterOrEqual() works correctly', () => {
        setWindowWidth(1024)
        const { result } = renderHook(() => useBreakpoint())

        expect(result.current.isGreaterOrEqual('xs')).toBe(true)
        expect(result.current.isGreaterOrEqual('sm')).toBe(true)
        expect(result.current.isGreaterOrEqual('md')).toBe(true)
        expect(result.current.isGreaterOrEqual('lg')).toBe(true)
        expect(result.current.isGreaterOrEqual('xl')).toBe(false)
        expect(result.current.isGreaterOrEqual('xxl')).toBe(false)
    })

    test('isLessOrEqual() works correctly', () => {
        setWindowWidth(1024)
        const { result } = renderHook(() => useBreakpoint())

        expect(result.current.isLessOrEqual('xs')).toBe(false)
        expect(result.current.isLessOrEqual('sm')).toBe(false)
        expect(result.current.isLessOrEqual('md')).toBe(false)
        expect(result.current.isLessOrEqual('lg')).toBe(true)
        expect(result.current.isLessOrEqual('xl')).toBe(true)
        expect(result.current.isLessOrEqual('xxl')).toBe(true)
    })

    test('isGreater() works correctly', () => {
        setWindowWidth(1024)
        const { result } = renderHook(() => useBreakpoint())

        expect(result.current.isGreater('xs')).toBe(true)
        expect(result.current.isGreater('sm')).toBe(true)
        expect(result.current.isGreater('md')).toBe(true)
        expect(result.current.isGreater('lg')).toBe(false)
        expect(result.current.isGreater('xl')).toBe(false)
    })

    test('isLess() works correctly', () => {
        setWindowWidth(1024)
        const { result } = renderHook(() => useBreakpoint())

        expect(result.current.isLess('xs')).toBe(false)
        expect(result.current.isLess('sm')).toBe(false)
        expect(result.current.isLess('md')).toBe(false)
        expect(result.current.isLess('lg')).toBe(false)
        expect(result.current.isLess('xl')).toBe(true)
        expect(result.current.isLess('xxl')).toBe(true)
    })

    test('handles edge case at exact breakpoint boundary', () => {
        setWindowWidth(defaultBreakpoints.md)
        const { result } = renderHook(() => useBreakpoint())

        expect(result.current.breakpoint).toBe('md')
        expect(result.current.isGreaterOrEqual('md')).toBe(true)
    })

    test('cleans up event listeners on unmount', () => {
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

        const { unmount } = renderHook(() => useBreakpoint())

        unmount()

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            'resize',
            expect.any(Function)
        )

        removeEventListenerSpy.mockRestore()
    })

    test('clears timeout on unmount during debounce', () => {
        const { unmount } = renderHook(() => useBreakpoint({ debounceMs: 500 }))

        act(() => {
            setWindowWidth(1280)
            window.dispatchEvent(new Event('resize'))
            jest.advanceTimersByTime(100)
        })

        // Unmount during debounce
        unmount()

        // Should not throw or cause issues
        act(() => {
            jest.advanceTimersByTime(500)
        })
    })
})
