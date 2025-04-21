import { useRef, useLayoutEffect } from 'react'

/**
 * A custom hook that returns a mutable ref object that holds the latest value.
 * This is useful for keeping track of the latest value without causing re-renders.
 *
 * @param value - The value to be stored in the ref.
 * @returns A ref object containing the latest value.
 */
export function useLatestRef<T>(value: T) {
    const ref = useRef<T>(value)
    useLayoutEffect(() => {
        ref.current = value
    })
    return ref
}
