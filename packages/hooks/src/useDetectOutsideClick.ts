import { useState, RefObject, useCallback } from 'react'
import useEventListener from './useEventListener'

export default function useDetectOutsideClick<
    T extends HTMLElement | null = HTMLElement
>(el: RefObject<T>, initialState: boolean) {
    const [isActive, setIsActive] = useState(initialState)

    const handler = useCallback(
        (e: PointerEvent) => {
            if (e.target instanceof HTMLElement) {
                // Only close if active and click is outside
                if (
                    isActive &&
                    el.current !== null &&
                    !el.current.contains(e.target)
                ) {
                    setIsActive(false)
                }
            }
        },
        [el, isActive]
    )

    useEventListener(document, 'pointerdown', handler)

    return [isActive, setIsActive] as const
}
