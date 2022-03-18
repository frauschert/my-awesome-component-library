import { RefObject } from 'react'
import useEventListener from './useEventListener'

export default function useClickOutside(
    ref: RefObject<HTMLElement>,
    cb: (e: MouseEvent) => void
) {
    useEventListener(document, 'click', (e) => {
        if (
            ref.current == null ||
            (e.target instanceof HTMLElement && ref.current.contains(e.target))
        )
            return
        cb(e)
    })
}
