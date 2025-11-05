import { renderHook, act, waitFor } from '@testing-library/react'
import usePromise from '../usePromise'

describe('usePromise', () => {
    it('initializes in idle state', () => {
        const promiseFn = jest.fn(() => Promise.resolve('result'))
        const { result } = renderHook(() => usePromise(promiseFn))

        expect(result.current.status).toBe('idle')
        expect(result.current.isIdle).toBe(true)
        expect(result.current.isLoading).toBe(false)
        expect(result.current.isResolved).toBe(false)
        expect(result.current.isRejected).toBe(false)
        expect(result.current.data).toBeNull()
        expect(result.current.error).toBeNull()
    })

    it('executes promise and resolves with data', async () => {
        const promiseFn = jest.fn(() => Promise.resolve('success'))
        const { result } = renderHook(() => usePromise(promiseFn))

        expect(result.current.isIdle).toBe(true)

        let executePromise: Promise<any>
        act(() => {
            executePromise = result.current.execute()
        })

        expect(result.current.status).toBe('pending')
        expect(result.current.isLoading).toBe(true)

        await act(async () => {
            await executePromise
        })

        expect(result.current.status).toBe('resolved')
        expect(result.current.isResolved).toBe(true)
        expect(result.current.isLoading).toBe(false)
        expect(result.current.data).toBe('success')
        expect(result.current.error).toBeNull()
        expect(promiseFn).toHaveBeenCalledTimes(1)
    })

    it('executes promise and handles rejection', async () => {
        const error = new Error('Failed')
        const promiseFn = jest.fn(() => Promise.reject(error))
        const { result } = renderHook(() => usePromise(promiseFn))

        let executePromise: Promise<any>
        act(() => {
            executePromise = result.current.execute()
        })

        expect(result.current.status).toBe('pending')
        expect(result.current.isLoading).toBe(true)

        await act(async () => {
            try {
                await executePromise
            } catch (e) {
                // Expected to throw
            }
        })

        expect(result.current.status).toBe('rejected')
        expect(result.current.isRejected).toBe(true)
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBe(error)
        expect(result.current.data).toBeNull()
    })

    it('passes arguments to promise function', async () => {
        const promiseFn = jest.fn((a: number, b: string) =>
            Promise.resolve(`${a}-${b}`)
        )
        const { result } = renderHook(() => usePromise(promiseFn))

        await act(async () => {
            await result.current.execute(42, 'test')
        })

        expect(promiseFn).toHaveBeenCalledWith(42, 'test')
        expect(result.current.data).toBe('42-test')
    })

    it('executes immediately when immediate option is true', async () => {
        const promiseFn = jest.fn(() => Promise.resolve('immediate'))
        const { result } = renderHook(() =>
            usePromise(promiseFn, { immediate: true })
        )

        // Should start in pending state
        expect(result.current.isLoading).toBe(true)

        await waitFor(() => {
            expect(result.current.isResolved).toBe(true)
        })

        expect(result.current.data).toBe('immediate')
        expect(promiseFn).toHaveBeenCalledTimes(1)
    })

    it('uses initial arguments with immediate execution', async () => {
        const promiseFn = jest.fn((x: number) => Promise.resolve(x * 2))
        const { result } = renderHook(() =>
            usePromise(promiseFn, { immediate: true, initialArgs: [5] })
        )

        await waitFor(() => {
            expect(result.current.isResolved).toBe(true)
        })

        expect(promiseFn).toHaveBeenCalledWith(5)
        expect(result.current.data).toBe(10)
    })

    it('resets state to idle', async () => {
        const promiseFn = jest.fn(() => Promise.resolve('data'))
        const { result } = renderHook(() => usePromise(promiseFn))

        await act(async () => {
            await result.current.execute()
        })

        expect(result.current.isResolved).toBe(true)
        expect(result.current.data).toBe('data')

        act(() => {
            result.current.reset()
        })

        expect(result.current.status).toBe('idle')
        expect(result.current.isIdle).toBe(true)
        expect(result.current.data).toBeNull()
        expect(result.current.error).toBeNull()
    })

    it('handles multiple executions', async () => {
        let counter = 0
        const promiseFn = jest.fn(() => Promise.resolve(++counter))
        const { result } = renderHook(() => usePromise(promiseFn))

        await act(async () => {
            await result.current.execute()
        })
        expect(result.current.data).toBe(1)

        await act(async () => {
            await result.current.execute()
        })
        expect(result.current.data).toBe(2)

        await act(async () => {
            await result.current.execute()
        })
        expect(result.current.data).toBe(3)

        expect(promiseFn).toHaveBeenCalledTimes(3)
    })

    it('clears error on subsequent successful execution', async () => {
        let shouldFail = true
        const promiseFn = jest.fn(() =>
            shouldFail
                ? Promise.reject(new Error('fail'))
                : Promise.resolve('success')
        )
        const { result } = renderHook(() => usePromise(promiseFn))

        // First execution fails
        await act(async () => {
            try {
                await result.current.execute()
            } catch (e) {
                // Expected
            }
        })

        expect(result.current.isRejected).toBe(true)
        expect(result.current.error?.message).toBe('fail')

        // Second execution succeeds
        shouldFail = false
        await act(async () => {
            await result.current.execute()
        })

        expect(result.current.isResolved).toBe(true)
        expect(result.current.data).toBe('success')
        expect(result.current.error).toBeNull()
    })

    it('handles race conditions - only latest promise updates state', async () => {
        const createPromise = (delay: number, value: string) =>
            new Promise<string>((resolve) =>
                setTimeout(() => resolve(value), delay)
            )

        const promiseFn = jest.fn((delay: number, value: string) =>
            createPromise(delay, value)
        )
        const { result } = renderHook(() => usePromise(promiseFn))

        // Start slow promise
        act(() => {
            result.current.execute(100, 'slow')
        })

        // Start fast promise
        await act(async () => {
            await result.current.execute(10, 'fast')
        })

        // Wait for slow promise to complete
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 150))
        })

        // Should have the fast result, not the slow one
        expect(result.current.data).toBe('fast')
    })

    it('does not update state after unmount', async () => {
        const promiseFn = jest.fn(
            () =>
                new Promise<string>((resolve) =>
                    setTimeout(() => resolve('data'), 50)
                )
        )
        const { result, unmount } = renderHook(() => usePromise(promiseFn))

        act(() => {
            result.current.execute()
        })

        expect(result.current.isLoading).toBe(true)

        unmount()

        // Wait for promise to resolve
        await new Promise((resolve) => setTimeout(resolve, 100))

        // No assertion needed - if state update after unmount causes an error, test will fail
    })

    it('converts non-Error rejections to Error objects', async () => {
        const promiseFn = jest.fn(() => Promise.reject('string error'))
        const { result } = renderHook(() => usePromise(promiseFn))

        await act(async () => {
            try {
                await result.current.execute()
            } catch (e) {
                // Expected
            }
        })

        expect(result.current.error).toBeInstanceOf(Error)
        expect(result.current.error?.message).toBe('string error')
    })

    it('returns the resolved value from execute', async () => {
        const promiseFn = jest.fn(() => Promise.resolve('return value'))
        const { result } = renderHook(() => usePromise(promiseFn))

        let returnedValue: string
        await act(async () => {
            returnedValue = await result.current.execute()
        })

        expect(returnedValue!).toBe('return value')
    })

    it('throws the error from execute', async () => {
        const error = new Error('thrown error')
        const promiseFn = jest.fn(() => Promise.reject(error))
        const { result } = renderHook(() => usePromise(promiseFn))

        await act(async () => {
            await expect(result.current.execute()).rejects.toThrow(
                'thrown error'
            )
        })
    })

    it('handles promise function changing', async () => {
        const promiseFn1 = jest.fn(() => Promise.resolve('first'))
        const promiseFn2 = jest.fn(() => Promise.resolve('second'))

        const { result, rerender } = renderHook(({ fn }) => usePromise(fn), {
            initialProps: { fn: promiseFn1 },
        })

        await act(async () => {
            await result.current.execute()
        })
        expect(result.current.data).toBe('first')

        rerender({ fn: promiseFn2 })

        await act(async () => {
            await result.current.execute()
        })
        expect(result.current.data).toBe('second')
    })

    it('works with async functions', async () => {
        const asyncFn = async (value: number) => {
            await new Promise((resolve) => setTimeout(resolve, 10))
            return value * 2
        }

        const { result } = renderHook(() => usePromise(asyncFn))

        await act(async () => {
            await result.current.execute(21)
        })

        expect(result.current.data).toBe(42)
        expect(result.current.isResolved).toBe(true)
    })

    it('handles complex data types', async () => {
        const complexData = {
            users: [
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' },
            ],
            meta: { count: 2, page: 1 },
        }
        const promiseFn = jest.fn(() => Promise.resolve(complexData))
        const { result } = renderHook(() => usePromise(promiseFn))

        await act(async () => {
            await result.current.execute()
        })

        expect(result.current.data).toEqual(complexData)
        expect(result.current.data?.users).toHaveLength(2)
    })

    it('maintains stable function references', () => {
        const promiseFn = jest.fn(() => Promise.resolve('data'))
        const { result, rerender } = renderHook(() => usePromise(promiseFn))

        const execute1 = result.current.execute
        const reset1 = result.current.reset

        rerender()

        const execute2 = result.current.execute
        const reset2 = result.current.reset

        expect(execute1).toBe(execute2)
        expect(reset1).toBe(reset2)
    })
})
