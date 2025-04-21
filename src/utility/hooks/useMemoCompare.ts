import { useEffect, useRef } from 'react'

/**
 * useMemoCompare is a custom hook that compares the current value with the previous value
 * using a custom comparison function. If the values are equal, it returns the previous value;
 * otherwise, it returns the new value.
 *
 * @param next - The new value to compare.
 * @param compare - A function that compares the previous and next values.
 * @returns The previous value if equal; otherwise, the new value.
 */
export default function useMemoCompare<T>(
    next: T,
    compare: (prev: T, next: T) => boolean
) {
    const previousRef = useRef<T>()
    const previous = previousRef.current

    const isEqual = previous !== undefined ? compare(previous, next) : false

    useEffect(() => {
        if (!isEqual) {
            previousRef.current = next
        }
    })

    return isEqual ? previous : next
}
