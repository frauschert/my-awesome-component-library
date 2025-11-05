import { useState, useEffect, useCallback, useRef } from 'react'

export type PromiseStatus = 'idle' | 'pending' | 'resolved' | 'rejected'

export interface UsePromiseResult<T, Args extends unknown[] = unknown[]> {
    /**
     * The resolved value of the promise
     */
    data: T | null

    /**
     * Error if the promise was rejected
     */
    error: Error | null

    /**
     * Current status of the promise
     */
    status: PromiseStatus

    /**
     * Whether the promise is currently pending
     */
    isLoading: boolean

    /**
     * Whether the promise is idle (not yet executed)
     */
    isIdle: boolean

    /**
     * Whether the promise was resolved successfully
     */
    isResolved: boolean

    /**
     * Whether the promise was rejected
     */
    isRejected: boolean

    /**
     * Execute the promise with optional arguments
     */
    execute: (...args: Args) => Promise<T>

    /**
     * Reset the state to idle
     */
    reset: () => void
}

export interface UsePromiseOptions<Args extends unknown[] = unknown[]> {
    /**
     * Whether to execute the promise immediately on mount
     * @default false
     */
    immediate?: boolean

    /**
     * Initial arguments to pass to the promise function
     */
    initialArgs?: Args
}

/**
 * Hook for managing promise lifecycle with loading, error, and result states.
 *
 * @param promiseFunction - Function that returns a promise
 * @param options - Configuration options
 * @returns Promise state and control methods
 *
 * @example
 * ```tsx
 * function UserProfile({ userId }) {
 *   const { data, isLoading, error, execute } = usePromise(
 *     (id) => fetch(`/api/users/${id}`).then(r => r.json())
 *   )
 *
 *   useEffect(() => {
 *     execute(userId)
 *   }, [userId])
 *
 *   if (isLoading) return <Spinner />
 *   if (error) return <Error message={error.message} />
 *   if (data) return <User {...data} />
 *   return null
 * }
 * ```
 */
export default function usePromise<
    T = unknown,
    Args extends unknown[] = unknown[]
>(
    promiseFunction: (...args: Args) => Promise<T>,
    options: UsePromiseOptions<Args> = {}
): UsePromiseResult<T, Args> {
    const { immediate = false, initialArgs = [] as unknown as Args } = options

    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const [status, setStatus] = useState<PromiseStatus>('idle')

    const mountedRef = useRef(true)
    const currentPromiseRef = useRef<Promise<T> | null>(null)

    useEffect(() => {
        mountedRef.current = true
        return () => {
            mountedRef.current = false
        }
    }, [])

    const execute = useCallback(
        async (...args: Args): Promise<T> => {
            setStatus('pending')
            setError(null)

            const promise = promiseFunction(...args)
            currentPromiseRef.current = promise

            try {
                const result = await promise

                // Only update state if component is still mounted and this is the latest promise
                if (
                    mountedRef.current &&
                    currentPromiseRef.current === promise
                ) {
                    setData(result)
                    setStatus('resolved')
                }

                return result
            } catch (err) {
                // Only update state if component is still mounted and this is the latest promise
                if (
                    mountedRef.current &&
                    currentPromiseRef.current === promise
                ) {
                    const error =
                        err instanceof Error ? err : new Error(String(err))
                    setError(error)
                    setStatus('rejected')
                }

                throw err
            }
        },
        [promiseFunction]
    )

    const reset = useCallback(() => {
        if (mountedRef.current) {
            setData(null)
            setError(null)
            setStatus('idle')
            currentPromiseRef.current = null
        }
    }, [])

    useEffect(() => {
        if (immediate) {
            execute(...initialArgs)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Only run on mount

    return {
        data,
        error,
        status,
        isLoading: status === 'pending',
        isIdle: status === 'idle',
        isResolved: status === 'resolved',
        isRejected: status === 'rejected',
        execute,
        reset,
    }
}
