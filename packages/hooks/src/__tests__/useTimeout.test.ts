import { act, renderHook, waitFor } from '@testing-library/react'
import useTimeout from '../useTimeout'

describe('useTimeout', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    describe('basic functionality', () => {
        it('does not execute callback automatically on mount', () => {
            const callback = jest.fn()
            renderHook(() => useTimeout(callback, 1000))

            jest.advanceTimersByTime(1500)
            expect(callback).not.toHaveBeenCalled()
        })

        it('executes callback after delay when start is called', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 1000))

            act(() => {
                result.current.start()
            })

            expect(callback).not.toHaveBeenCalled()

            act(() => {
                jest.advanceTimersByTime(1000)
            })

            expect(callback).toHaveBeenCalledTimes(1)
        })

        it('executes callback only once', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 1000))

            act(() => {
                result.current.start()
            })

            act(() => {
                jest.advanceTimersByTime(1000)
            })

            expect(callback).toHaveBeenCalledTimes(1)

            // Advance more time
            act(() => {
                jest.advanceTimersByTime(5000)
            })

            // Should still only be called once
            expect(callback).toHaveBeenCalledTimes(1)
        })

        it('respects the delay parameter', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 2500))

            act(() => {
                result.current.start()
            })

            act(() => {
                jest.advanceTimersByTime(2000)
            })
            expect(callback).not.toHaveBeenCalled()

            act(() => {
                jest.advanceTimersByTime(500)
            })
            expect(callback).toHaveBeenCalledTimes(1)
        })
    })

    describe('clear functionality', () => {
        it('prevents callback execution when cleared before delay', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 1000))

            act(() => {
                result.current.start()
            })

            act(() => {
                jest.advanceTimersByTime(500)
            })

            act(() => {
                result.current.clear()
            })

            act(() => {
                jest.advanceTimersByTime(1000)
            })

            expect(callback).not.toHaveBeenCalled()
        })

        it('can be called multiple times safely', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 1000))

            act(() => {
                result.current.start()
            })

            act(() => {
                result.current.clear()
                result.current.clear()
                result.current.clear()
            })

            act(() => {
                jest.advanceTimersByTime(1500)
            })

            expect(callback).not.toHaveBeenCalled()
        })

        it('can be called even when timeout is not active', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 1000))

            expect(() => {
                act(() => {
                    result.current.clear()
                })
            }).not.toThrow()
        })
    })

    describe('reset functionality', () => {
        it('restarts the timeout', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 1000))

            act(() => {
                result.current.start()
            })

            act(() => {
                jest.advanceTimersByTime(500)
            })

            act(() => {
                result.current.reset()
            })

            // Original timeout should be cancelled
            act(() => {
                jest.advanceTimersByTime(600)
            })
            expect(callback).not.toHaveBeenCalled()

            // New timeout should fire
            act(() => {
                jest.advanceTimersByTime(400)
            })
            expect(callback).toHaveBeenCalledTimes(1)
        })

        it('starts timeout even if it was never started', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 1000))

            act(() => {
                result.current.reset()
            })

            act(() => {
                jest.advanceTimersByTime(1000)
            })

            expect(callback).toHaveBeenCalledTimes(1)
        })

        it('can be called multiple times', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 1000))

            act(() => {
                result.current.reset()
            })

            act(() => {
                jest.advanceTimersByTime(500)
            })

            act(() => {
                result.current.reset()
            })

            act(() => {
                jest.advanceTimersByTime(500)
            })

            expect(callback).not.toHaveBeenCalled()

            act(() => {
                jest.advanceTimersByTime(500)
            })

            expect(callback).toHaveBeenCalledTimes(1)
        })
    })

    describe('isActive functionality', () => {
        it('returns false initially', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 1000))

            expect(result.current.isActive()).toBe(false)
        })

        it('returns true after start is called', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 1000))

            act(() => {
                result.current.start()
            })

            expect(result.current.isActive()).toBe(true)
        })

        it('returns false after timeout executes', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 1000))

            act(() => {
                result.current.start()
            })

            act(() => {
                jest.advanceTimersByTime(1000)
            })

            expect(result.current.isActive()).toBe(false)
        })

        it('returns false after clear is called', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 1000))

            act(() => {
                result.current.start()
            })

            expect(result.current.isActive()).toBe(true)

            act(() => {
                result.current.clear()
            })

            expect(result.current.isActive()).toBe(false)
        })

        it('returns true after reset is called', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 1000))

            act(() => {
                result.current.reset()
            })

            expect(result.current.isActive()).toBe(true)
        })
    })

    describe('callback updates', () => {
        it('uses the latest callback', () => {
            const callback1 = jest.fn()
            const callback2 = jest.fn()
            let currentCallback = callback1

            const { result, rerender } = renderHook(() =>
                useTimeout(currentCallback, 1000)
            )

            act(() => {
                result.current.start()
            })

            // Change callback before timeout fires
            currentCallback = callback2
            rerender()

            act(() => {
                jest.advanceTimersByTime(1000)
            })

            expect(callback1).not.toHaveBeenCalled()
            expect(callback2).toHaveBeenCalledTimes(1)
        })

        it('always uses latest callback with state', () => {
            let count = 0
            const callback = jest.fn(() => count)

            const { result, rerender } = renderHook(() =>
                useTimeout(callback, 1000)
            )

            act(() => {
                result.current.start()
            })

            count = 5
            rerender()

            act(() => {
                jest.advanceTimersByTime(1000)
            })

            expect(callback).toHaveBeenCalled()
            expect(callback.mock.results[0].value).toBe(5)
        })
    })

    describe('start functionality', () => {
        it('clears existing timeout when called again', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 1000))

            act(() => {
                result.current.start()
            })

            act(() => {
                jest.advanceTimersByTime(500)
            })

            act(() => {
                result.current.start()
            })

            // First timeout should be cancelled
            act(() => {
                jest.advanceTimersByTime(600)
            })
            expect(callback).not.toHaveBeenCalled()

            // Second timeout should fire
            act(() => {
                jest.advanceTimersByTime(400)
            })
            expect(callback).toHaveBeenCalledTimes(1)
        })
    })

    describe('cleanup', () => {
        it('clears timeout on unmount', () => {
            const callback = jest.fn()
            const { result, unmount } = renderHook(() =>
                useTimeout(callback, 1000)
            )

            act(() => {
                result.current.start()
            })

            unmount()

            act(() => {
                jest.advanceTimersByTime(1500)
            })

            expect(callback).not.toHaveBeenCalled()
        })

        it('does not call callback after unmount', () => {
            const callback = jest.fn()
            const { result, unmount } = renderHook(() =>
                useTimeout(callback, 1000)
            )

            act(() => {
                result.current.start()
            })

            act(() => {
                jest.advanceTimersByTime(500)
            })

            unmount()

            act(() => {
                jest.advanceTimersByTime(1000)
            })

            expect(callback).not.toHaveBeenCalled()
        })
    })

    describe('edge cases', () => {
        it('handles zero delay', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 0))

            act(() => {
                result.current.start()
            })

            act(() => {
                jest.advanceTimersByTime(0)
            })

            expect(callback).toHaveBeenCalledTimes(1)
        })

        it('handles very long delay', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 1000000))

            act(() => {
                result.current.start()
            })

            act(() => {
                jest.advanceTimersByTime(999999)
            })
            expect(callback).not.toHaveBeenCalled()

            act(() => {
                jest.advanceTimersByTime(1)
            })
            expect(callback).toHaveBeenCalledTimes(1)
        })

        it('handles delay change between renders', () => {
            const callback = jest.fn()
            const { result, rerender } = renderHook(
                ({ delay }) => useTimeout(callback, delay),
                { initialProps: { delay: 1000 } }
            )

            act(() => {
                result.current.start()
            })

            // Change delay (should not affect already-started timeout)
            rerender({ delay: 2000 })

            act(() => {
                jest.advanceTimersByTime(1000)
            })

            expect(callback).toHaveBeenCalledTimes(1)
        })

        it('handles multiple rapid start calls', () => {
            const callback = jest.fn()
            const { result } = renderHook(() => useTimeout(callback, 1000))

            act(() => {
                result.current.start()
                result.current.start()
                result.current.start()
            })

            act(() => {
                jest.advanceTimersByTime(1000)
            })

            expect(callback).toHaveBeenCalledTimes(1)
        })
    })

    describe('practical use cases', () => {
        it('works for debounced actions', () => {
            const action = jest.fn()
            const { result } = renderHook(() => useTimeout(action, 500))

            // Simulate rapid user input
            act(() => {
                result.current.reset()
            })
            act(() => {
                jest.advanceTimersByTime(200)
            })

            act(() => {
                result.current.reset()
            })
            act(() => {
                jest.advanceTimersByTime(200)
            })

            act(() => {
                result.current.reset()
            })

            // Action should only fire once after last reset
            act(() => {
                jest.advanceTimersByTime(500)
            })

            expect(action).toHaveBeenCalledTimes(1)
        })

        it('works for delayed notifications', () => {
            const showNotification = jest.fn()
            const { result } = renderHook(() =>
                useTimeout(showNotification, 3000)
            )

            // User performs action
            act(() => {
                result.current.start()
            })

            // User cancels before notification shows
            act(() => {
                jest.advanceTimersByTime(2000)
            })

            act(() => {
                result.current.clear()
            })

            act(() => {
                jest.advanceTimersByTime(2000)
            })

            expect(showNotification).not.toHaveBeenCalled()
        })

        it('works for auto-save functionality', () => {
            const saveData = jest.fn()
            const { result } = renderHook(() => useTimeout(saveData, 2000))

            // User types
            act(() => {
                result.current.reset() // Reset timer on each keystroke
            })

            act(() => {
                jest.advanceTimersByTime(1000)
            })

            // User types again
            act(() => {
                result.current.reset()
            })

            // Wait for auto-save
            act(() => {
                jest.advanceTimersByTime(2000)
            })

            expect(saveData).toHaveBeenCalledTimes(1)
        })
    })
})
