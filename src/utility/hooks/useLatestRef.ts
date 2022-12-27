import { useRef, useLayoutEffect } from 'react'

export function useLatestRef<T>(value: T) {
    const ref = useRef<T>()
    useLayoutEffect(() => {
        ref.current = value
    })
    return ref
}
