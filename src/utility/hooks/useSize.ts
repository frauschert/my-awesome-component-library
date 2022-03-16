import { useState, RefObject } from 'react'
import useEffectOnce from './useEffectOnce'

export default function useSize(ref: RefObject<HTMLElement>) {
    const [size, setSize] = useState<DOMRectReadOnly>()

    useEffectOnce(() => {
        if (ref.current == null) return
        const observer = new ResizeObserver(([entry]) =>
            setSize(entry.contentRect)
        )
        observer.observe(ref.current)
        return () => observer.disconnect()
    })

    return size
}
