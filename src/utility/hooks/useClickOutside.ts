import { RefObject } from 'react'
import useEventListener from './useEventListener'

export default function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T>,
    cb: (e: MouseEvent) => void
) {
    useEventListener(document, 'pointerdown', (e) => {
        if (
            ref.current == null ||
            (e.target instanceof HTMLElement && ref.current.contains(e.target))
        )
            return
        cb(e)
    })
}
