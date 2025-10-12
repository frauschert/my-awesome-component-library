import { useState, RefObject, useEffect } from 'react'
import debounce from '../debounce'

export default function useSize(ref: RefObject<HTMLElement>) {
    const [size, setSize] = useState<{ width: number; height: number }>()

    useEffect(() => {
        const element = ref.current
        if (element == null) return

        // Set initial size
        const rect = element.getBoundingClientRect()
        setSize({ width: rect.width, height: rect.height })

        // Check if ResizeObserver is supported
        if (typeof ResizeObserver === 'undefined') {
            return
        }

        // Debounce setSize to avoid excessive updates
        const debouncedSetSize = debounce(
            (rect: DOMRectReadOnly) =>
                setSize({ width: rect.width, height: rect.height }),
            100
        )

        const observer = new ResizeObserver(([entry]) => {
            debouncedSetSize(entry.contentRect)
        })

        observer.observe(element)

        return () => {
            observer.disconnect()
            debouncedSetSize.cancel()
        }
    }, [ref])

    return size
}
