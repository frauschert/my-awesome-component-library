import { useRef, useLayoutEffect } from 'react'

export function useLatestRef<T>(value: T) {
    const ref = useRef<T>(value)
    useLayoutEffect(() => {
        ref.current = value
    })
    return ref
}
