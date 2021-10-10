import { useState, useEffect, MutableRefObject } from 'react'

export const useDetectOutsideClick = <
    T extends HTMLElement | null = HTMLElement
>(
    el: MutableRefObject<T>,
    initialState: boolean
) => {
    const [isActive, setIsActive] = useState(initialState)

    const handler = (e: MouseEvent | TouchEvent) => {
        if (e.target instanceof HTMLElement) {
            // If the active element exists and is clicked outside of
            if (el.current !== null && !el.current.contains(e.target)) {
                setIsActive(!isActive)
            }
        }
    }

    useEffect(() => {
        document.addEventListener('click', handler)
        document.addEventListener('touchstart', handler)

        return () => {
            window.removeEventListener('click', handler)
            document.removeEventListener('touchstart', handler)
        }
    })

    return [isActive, setIsActive] as const
}
