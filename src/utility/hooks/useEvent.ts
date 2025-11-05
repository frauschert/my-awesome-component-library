import { useCallback, useLayoutEffect, useRef } from 'react'

/**
 * Hook that returns a stable function reference that always has access to the latest values.
 * Solves the stale closure problem without causing re-renders or requiring the function to be
 * in dependency arrays.
 *
 * This is an implementation of the proposed React useEvent hook (RFC).
 *
 * @template T - The function type
 * @param {T} handler - The callback function
 * @returns {T} A stable function reference with latest closure
 *
 * @example
 * const handleClick = useEvent(() => {
 *   console.log(count) // Always has latest count
 * })
 * // handleClick reference never changes, safe to omit from deps
 */
export default function useEvent<T extends (...args: unknown[]) => unknown>(
    handler: T
): T {
    const handlerRef = useRef<T>(handler)

    // Update ref during render so it's always current
    useLayoutEffect(() => {
        handlerRef.current = handler
    })

    // Return a stable callback that calls the latest handler
    return useCallback(
        ((...args: unknown[]) => {
            const fn = handlerRef.current
            return fn(...args)
        }) as T,
        []
    )
}
