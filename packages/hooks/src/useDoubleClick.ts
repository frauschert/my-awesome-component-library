import { useRef, useCallback, PointerEvent } from 'react'

export function useDoubleClick<T extends HTMLElement>(
    onDoubleClick: (event: PointerEvent<T>) => void,
    delay: number = 250
) {
    const lastClick = useRef<number>(0)

    const handlePointerDown = useCallback(
        (event: PointerEvent<T>) => {
            const now = Date.now()
            if (now - lastClick.current < delay) {
                onDoubleClick(event)
                lastClick.current = 0 // Reset to prevent multiple calls
                return
            }
            lastClick.current = now
        },
        [onDoubleClick, delay]
    )

    return {
        onPointerDown: handlePointerDown,
    }
}
