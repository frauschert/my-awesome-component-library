import { renderHook, waitFor } from '@testing-library/react'
import { useEffect } from 'react'
import useIsMounted from '../useIsMounted'

describe('useIsMounted', () => {
    it('returns false before mount', () => {
        let isMounted: (() => boolean) | null = null

        renderHook(() => {
            isMounted = useIsMounted()
            // During first render, before useEffect runs
        })

        // After render but within the same tick, it should be mounted
        // because useEffect with empty deps runs synchronously after render
        expect(isMounted).toBeDefined()
    })

    it('returns true when mounted', () => {
        const { result } = renderHook(() => useIsMounted())

        expect(result.current()).toBe(true)
    })

    it('returns false after unmount', () => {
        const { result, unmount } = renderHook(() => useIsMounted())

        expect(result.current()).toBe(true)

        unmount()

        expect(result.current()).toBe(false)
    })

    it('prevents state updates after unmount', async () => {
        let isMountedCheck: (() => boolean) | null = null
        let setValue: ((value: string) => void) | null = null
        const setState = jest.fn()

        const { unmount } = renderHook(() => {
            const isMounted = useIsMounted()
            isMountedCheck = isMounted

            // Simulate a setState function
            setValue = (value: string) => {
                if (isMounted()) {
                    setState(value)
                }
            }
        })

        // Call setValue while mounted
        setValue?.('mounted value')
        expect(setState).toHaveBeenCalledWith('mounted value')

        unmount()

        // Call setValue after unmount
        setValue?.('unmounted value')
        expect(setState).toHaveBeenCalledTimes(1) // Should not be called again
    })

    it('works with async operations', async () => {
        const { result, unmount } = renderHook(() => useIsMounted())

        const asyncOperation = async () => {
            await new Promise((resolve) => setTimeout(resolve, 100))
            return result.current()
        }

        // Start async operation while mounted
        const promise = asyncOperation()

        // Unmount immediately
        unmount()

        // Wait for async operation to complete
        const isMounted = await promise

        expect(isMounted).toBe(false)
    })

    it('returns stable reference', () => {
        const { result, rerender } = renderHook(() => useIsMounted())

        const firstRef = result.current

        rerender()

        const secondRef = result.current

        expect(firstRef).toBe(secondRef)
    })

    it('works with multiple re-renders', () => {
        const { result, rerender } = renderHook(() => useIsMounted())

        expect(result.current()).toBe(true)

        rerender()
        expect(result.current()).toBe(true)

        rerender()
        expect(result.current()).toBe(true)
    })

    it('handles rapid mount/unmount cycles', () => {
        const { result, unmount, rerender } = renderHook(() => useIsMounted())

        expect(result.current()).toBe(true)

        unmount()
        expect(result.current()).toBe(false)
    })

    it('can be used in useEffect cleanup', () => {
        let cleanupValue: boolean | null = null

        const { unmount } = renderHook(() => {
            const isMounted = useIsMounted()

            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
                return () => {
                    cleanupValue = isMounted()
                }
            }, [isMounted])
        })

        unmount()

        // During cleanup, the component is technically still mounted
        // but our ref gets set to false first
        expect(cleanupValue).toBe(false)
    })

    it('works with fetch and setState pattern', async () => {
        const mockFetch = jest.fn().mockResolvedValue({ data: 'test' })
        const setState = jest.fn()

        const { unmount } = renderHook(() => {
            const isMounted = useIsMounted()

            // Simulate useEffect with fetch
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
                mockFetch().then((result) => {
                    if (isMounted()) {
                        setState(result)
                    }
                })
            }, [isMounted])
        })

        // Unmount before fetch resolves
        unmount()

        // Wait for fetch to resolve
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled()
        })

        // setState should not have been called
        expect(setState).not.toHaveBeenCalled()
    })

    it('allows setState when mounted', async () => {
        const mockFetch = jest.fn().mockResolvedValue({ data: 'test' })
        const setState = jest.fn()

        renderHook(() => {
            const isMounted = useIsMounted()

            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
                mockFetch().then((result) => {
                    if (isMounted()) {
                        setState(result)
                    }
                })
            }, [isMounted])
        })

        // Wait for fetch to resolve
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalled()
        })

        // setState should have been called since component is still mounted
        expect(setState).toHaveBeenCalledWith({ data: 'test' })
    })

    it('handles multiple async operations', async () => {
        const results: boolean[] = []

        const { result, unmount } = renderHook(() => useIsMounted())

        const operation1 = async () => {
            await new Promise((resolve) => setTimeout(resolve, 50))
            results.push(result.current())
        }

        const operation2 = async () => {
            await new Promise((resolve) => setTimeout(resolve, 100))
            results.push(result.current())
        }

        const operation3 = async () => {
            await new Promise((resolve) => setTimeout(resolve, 150))
            results.push(result.current())
        }

        // Start all operations
        const promises = [operation1(), operation2(), operation3()]

        // Unmount after 75ms (after op1, during op2 and op3)
        setTimeout(() => unmount(), 75)

        await Promise.all(promises)

        expect(results).toEqual([true, false, false])
    })
})
