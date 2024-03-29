import { useState, RefObject, useCallback } from 'react'
import useEventListener from './useEventListener'

export default function useDetectOutsideClick<
    T extends HTMLElement | null = HTMLElement
>(el: RefObject<T>, initialState: boolean) {
    const [isActive, setIsActive] = useState(initialState)

    const handler = useCallback(
        (e: PointerEvent) => {
            if (e.target instanceof HTMLElement) {
                // If the active element exists and is clicked outside of
                if (el.current !== null && !el.current.contains(e.target)) {
                    setIsActive(!isActive)
                }
            }
        },
        [el, isActive]
    )

    useEventListener(document, 'pointerdown', handler)

    return [isActive, setIsActive] as const
}
