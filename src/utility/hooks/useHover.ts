import { RefObject } from 'react'
import useEventListener from './useEventListener'
import useToggle from './useToggle'

export default function useHover(ref: RefObject<HTMLElement>) {
    const [hovered, toggle] = useToggle(false)

    useEventListener(ref, 'mouseover', toggle)
    useEventListener(ref, 'mouseout', toggle)

    return hovered
}
