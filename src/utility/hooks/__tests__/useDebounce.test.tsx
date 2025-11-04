import { renderHook, act } from '@testing-library/react'
import useDebounce from '../useDebounce'

describe('useDebounce', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    describe('basic functionality', () => {
        it('should return initial value immediately', () => {
            const { result } = renderHook(() => useDebounce('hello', 500))

            expect(result.current).toBe('hello')
        })

        it('should debounce value changes', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: 'initial', delay: 500 },
                }
            )

            expect(result.current).toBe('initial')

            // Change value
            rerender({ value: 'updated', delay: 500 })

            // Value should not update immediately
            expect(result.current).toBe('initial')

            // Fast-forward time
            act(() => {
                jest.advanceTimersByTime(500)
            })

            // Now value should be updated
            expect(result.current).toBe('updated')
        })

        it('should handle multiple rapid changes', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: 'v1', delay: 500 },
                }
            )

            expect(result.current).toBe('v1')

            // Rapid changes
            rerender({ value: 'v2', delay: 500 })
            act(() => {
                jest.advanceTimersByTime(100)
            })

            rerender({ value: 'v3', delay: 500 })
            act(() => {
                jest.advanceTimersByTime(100)
            })

            rerender({ value: 'v4', delay: 500 })
            act(() => {
                jest.advanceTimersByTime(100)
            })

            // Still should be initial value
            expect(result.current).toBe('v1')

            // Fast-forward past the delay
            act(() => {
                jest.advanceTimersByTime(500)
            })

            // Should be the last value
            expect(result.current).toBe('v4')
        })

        it('should reset timer on each value change', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: 'v1', delay: 1000 },
                }
            )

            expect(result.current).toBe('v1')

            rerender({ value: 'v2', delay: 1000 })
            act(() => {
                jest.advanceTimersByTime(900)
            })

            // Change again before timer completes
            rerender({ value: 'v3', delay: 1000 })
            act(() => {
                jest.advanceTimersByTime(900)
            })

            // Should still be initial value
            expect(result.current).toBe('v1')

            // Complete the final timer
            act(() => {
                jest.advanceTimersByTime(100)
            })

            expect(result.current).toBe('v3')
        })
    })

    describe('different delays', () => {
        it('should work with short delay', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: 'initial', delay: 100 },
                }
            )

            rerender({ value: 'updated', delay: 100 })

            act(() => {
                jest.advanceTimersByTime(100)
            })

            expect(result.current).toBe('updated')
        })

        it('should work with long delay', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: 'initial', delay: 5000 },
                }
            )

            rerender({ value: 'updated', delay: 5000 })

            act(() => {
                jest.advanceTimersByTime(4999)
            })
            expect(result.current).toBe('initial')

            act(() => {
                jest.advanceTimersByTime(1)
            })
            expect(result.current).toBe('updated')
        })

        it('should handle delay changes', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: 'v1', delay: 1000 },
                }
            )

            rerender({ value: 'v2', delay: 500 })

            act(() => {
                jest.advanceTimersByTime(500)
            })

            expect(result.current).toBe('v2')
        })
    })

    describe('different value types', () => {
        it('should work with numbers', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: 0, delay: 500 },
                }
            )

            expect(result.current).toBe(0)

            rerender({ value: 42, delay: 500 })

            act(() => {
                jest.advanceTimersByTime(500)
            })

            expect(result.current).toBe(42)
        })

        it('should work with booleans', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: false, delay: 500 },
                }
            )

            expect(result.current).toBe(false)

            rerender({ value: true, delay: 500 })

            act(() => {
                jest.advanceTimersByTime(500)
            })

            expect(result.current).toBe(true)
        })

        it('should work with objects', () => {
            const obj1 = { name: 'Alice', age: 25 }
            const obj2 = { name: 'Bob', age: 30 }

            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: obj1, delay: 500 },
                }
            )

            expect(result.current).toBe(obj1)

            rerender({ value: obj2, delay: 500 })

            act(() => {
                jest.advanceTimersByTime(500)
            })

            expect(result.current).toBe(obj2)
        })

        it('should work with arrays', () => {
            const arr1 = [1, 2, 3]
            const arr2 = [4, 5, 6]

            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: arr1, delay: 500 },
                }
            )

            expect(result.current).toBe(arr1)

            rerender({ value: arr2, delay: 500 })

            act(() => {
                jest.advanceTimersByTime(500)
            })

            expect(result.current).toBe(arr2)
        })

        it('should work with null and undefined', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: null as string | null, delay: 500 },
                }
            )

            expect(result.current).toBe(null)

            rerender({ value: 'not null', delay: 500 })

            act(() => {
                jest.advanceTimersByTime(500)
            })

            expect(result.current).toBe('not null')

            rerender({ value: undefined as string | undefined, delay: 500 })

            act(() => {
                jest.advanceTimersByTime(500)
            })

            expect(result.current).toBe(undefined)
        })
    })

    describe('cleanup', () => {
        it('should clear timeout on unmount', () => {
            const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

            const { unmount } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: 'test', delay: 500 },
                }
            )

            unmount()

            expect(clearTimeoutSpy).toHaveBeenCalled()

            clearTimeoutSpy.mockRestore()
        })

        it('should not update after unmount', () => {
            const { result, rerender, unmount } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: 'initial', delay: 500 },
                }
            )

            rerender({ value: 'updated', delay: 500 })

            unmount()

            act(() => {
                jest.advanceTimersByTime(500)
            })

            // Should still be initial value since component unmounted
            expect(result.current).toBe('initial')
        })
    })

    describe('practical use cases', () => {
        it('should work for search input debouncing', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: '', delay: 300 },
                }
            )

            // User types "h"
            rerender({ value: 'h', delay: 300 })
            act(() => {
                jest.advanceTimersByTime(100)
            })

            // User types "e"
            rerender({ value: 'he', delay: 300 })
            act(() => {
                jest.advanceTimersByTime(100)
            })

            // User types "l"
            rerender({ value: 'hel', delay: 300 })
            act(() => {
                jest.advanceTimersByTime(100)
            })

            // User types "l"
            rerender({ value: 'hell', delay: 300 })
            act(() => {
                jest.advanceTimersByTime(100)
            })

            // User types "o"
            rerender({ value: 'hello', delay: 300 })

            // Still empty
            expect(result.current).toBe('')

            // Wait for debounce
            act(() => {
                jest.advanceTimersByTime(300)
            })

            // Now should be updated
            expect(result.current).toBe('hello')
        })

        it('should work for window resize debouncing', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: 1024, delay: 250 },
                }
            )

            // Simulate rapid resize events
            const widths = [1020, 1015, 1010, 1005, 1000, 995, 990]

            widths.forEach((width) => {
                rerender({ value: width, delay: 250 })
                act(() => {
                    jest.advanceTimersByTime(50)
                })
            })

            // Should still be initial
            expect(result.current).toBe(1024)

            // Wait for debounce
            act(() => {
                jest.advanceTimersByTime(250)
            })

            // Should be last width
            expect(result.current).toBe(990)
        })

        it('should work for API call throttling', () => {
            const { result, rerender } = renderHook(
                ({ value, delay }) => useDebounce(value, delay),
                {
                    initialProps: { value: { query: '' }, delay: 500 },
                }
            )

            // Rapid filter changes
            const filters = [
                { query: 'a' },
                { query: 'ap' },
                { query: 'app' },
                { query: 'appl' },
                { query: 'apple' },
            ]

            filters.forEach((filter, i) => {
                rerender({ value: filter, delay: 500 })
                if (i < filters.length - 1) {
                    act(() => {
                        jest.advanceTimersByTime(100)
                    })
                }
            })

            expect(result.current.query).toBe('')

            act(() => {
                jest.advanceTimersByTime(500)
            })

            expect(result.current.query).toBe('apple')
        })
    })
})
