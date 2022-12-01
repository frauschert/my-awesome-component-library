import { useEffect, useRef } from 'react'

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
