import { useState, RefObject } from 'react'
import useEffectOnce from './useEffectOnce'
import debounce from '../debounce'

export default function useSize(ref: RefObject<HTMLElement>) {
    const [size, setSize] = useState<{ width: number; height: number }>()

    useEffectOnce(() => {
        if (ref.current == null) return
        // Set initial size
        const rect = ref.current.getBoundingClientRect()
        setSize({ width: rect.width, height: rect.height })
        // Debounce setSize to avoid excessive updates
        const debouncedSetSize = debounce(
            (rect: DOMRectReadOnly) =>
                setSize({ width: rect.width, height: rect.height }),
            100
        )
        const observer = new ResizeObserver(([entry]) => {
            debouncedSetSize(entry.contentRect)
        })
        observer.observe(ref.current)
        return () => observer.disconnect()
    })

    return size
}
